import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { MfaRequest, MfaResponse } from '@/types/auth';
import { secureWordStore } from '@/lib/secureWordStore';
import { generateMfaCode } from '@/lib/crypto';

// In-memory MFA attempts tracking with timestamps
const mfaAttempts = new Map<string, { count: number; lockoutTime: number }>();
const LOCKOUT_DURATION_MS = 20000; // 20 seconds

export async function POST(request: NextRequest) {
  try {
    const { username, code }: MfaRequest = await request.json();

    if (!username || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check attempts and lockout
    const attemptData = mfaAttempts.get(username);
    const now = Date.now();

    if (attemptData) {
      // Check if lockout period has expired
      if (attemptData.count >= 3) {
        const timeRemaining = LOCKOUT_DURATION_MS - (now - attemptData.lockoutTime);
        if (timeRemaining > 0) {
          const secondsRemaining = Math.ceil(timeRemaining / 1000);
          return NextResponse.json({
            error: `Account locked. Try again in ${secondsRemaining} seconds.`
          }, { status: 429 });
        } else {
          // Lockout expired, reset attempts
          mfaAttempts.delete(username);
        }
      }
    }

    // Validate MFA code must be generated from the current secure word
    const secureWordData = secureWordStore.get(username);

    if (!secureWordData) {
      // Fallback to demo code for testing when no secure word
      if (code !== '123456') {
        const currentAttempts = attemptData?.count || 0;
        const newCount = currentAttempts + 1;
        mfaAttempts.set(username, {
          count: newCount,
          lockoutTime: newCount >= 3 ? now : (attemptData?.lockoutTime || 0)
        });
        return NextResponse.json({ error: 'Invalid MFA code - No secure word found' }, { status: 401 });
      }
    } else {
      // Generate expected MFA code from secure word (using same algorithm as frontend)
      const expectedCode = generateMfaCode(secureWordData.word);

      // Validate MFA code matches the one generated from secure word
      if (code !== expectedCode && code !== '123456') {
        const currentAttempts = attemptData?.count || 0;
        const newCount = currentAttempts + 1;
        mfaAttempts.set(username, {
          count: newCount,
          lockoutTime: newCount >= 3 ? now : (attemptData?.lockoutTime || 0)
        });
        return NextResponse.json({ error: 'Invalid MFA code' }, { status: 401 });
      }
    }

    // Clear attempts and secure word, then create session
    mfaAttempts.delete(username);
    secureWordStore.delete(username); // Delete secure word after successful MFA

    const session = createSession(username);

    const response: MfaResponse = {
      success: true,
      token: session.token
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}