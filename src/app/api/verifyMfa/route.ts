import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '../../../lib/auth';
import { MfaRequest, MfaResponse } from '../../../types/auth';

// In-memory MFA attempts tracking
const mfaAttempts = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const { username, code }: MfaRequest = await request.json();
    
    if (!username || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check attempts
    const attempts = mfaAttempts.get(username) || 0;
    if (attempts >= 3) {
      return NextResponse.json({ error: 'Too many failed attempts. Account locked.' }, { status: 429 });
    }

    // Mock MFA verification (in real app, verify TOTP code)
    const isValidCode = code === '123456' || code.length === 6;
    
    if (!isValidCode) {
      mfaAttempts.set(username, attempts + 1);
      return NextResponse.json({ error: 'Invalid MFA code' }, { status: 401 });
    }

    // Clear attempts and create session
    mfaAttempts.delete(username);
    
    const session = createSession(username);

    const response: MfaResponse = {
      success: true,
      token: session.token
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}