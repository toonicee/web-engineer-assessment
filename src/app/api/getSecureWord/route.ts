import { NextRequest, NextResponse } from 'next/server';
import { generateSecureWord } from '../../../lib/crypto';
import { SecureWordRequest, SecureWordResponse } from '../../../types/auth';

// In-memory store 
const secureWordStore = new Map<string, { word: string; issuedAt: number; requestCount: number; lastRequest: number }>();

export async function POST(request: NextRequest) {
  try {
    const { username }: SecureWordRequest = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const now = Date.now();
    const existing = secureWordStore.get(username);

    // Rate limiting: max 1 request per 10 seconds
    if (existing && (now - existing.lastRequest) < 10000) {
      return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
    }

    // Generate new secure word
    const secureWord = generateSecureWord(username);

    secureWordStore.set(username, {
      word: secureWord,
      issuedAt: now,
      requestCount: (existing?.requestCount || 0) + 1,
      lastRequest: now
    });

    const response: SecureWordResponse = {
      secureWord,
      issuedAt: now
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}