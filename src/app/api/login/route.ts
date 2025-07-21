import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/crypto';
import { createSession } from '@/lib/auth';
import { secureWordStore, SECURE_WORD_EXPIRY_MS } from '@/lib/secureWordStore';

// interface Authentication Configuration
interface UserConfig {
  rawPassword: string;
  hashedPassword: string;
  requiresMfa: boolean;
}

const DEMO_USERS: Record<string, UserConfig> = {
  admin: { 
    rawPassword: 'password123', 
    hashedPassword: '', 
    requiresMfa: true 
  },
  user: { 
    rawPassword: 'userpass', 
    hashedPassword: '', 
    requiresMfa: false 
  },
  demo: { 
    rawPassword: 'demo123', 
    hashedPassword: '', 
    requiresMfa: true 
  }
};

// Precompute hashed passwords
Object.keys(DEMO_USERS).forEach(username => {
  DEMO_USERS[username].hashedPassword = hashPassword(DEMO_USERS[username].rawPassword);
});

export async function POST(request: NextRequest) {
  try {
    const { username, hashedPassword, secureWord } = await request.json();

    console.log('Login Attempt Received:', { 
      username, 
      hashedPasswordProvided: !!hashedPassword,
      secureWordProvided: !!secureWord
    });

    // Validate input
    if (!username || !hashedPassword) {
      return NextResponse.json({ 
        error: 'Invalid Credentials', 
        details: 'Username and password are required' 
      }, { status: 400 });
    }

    // Find user
    const user = DEMO_USERS[username];
    if (!user) {
      console.error('User not found:', username);
      return NextResponse.json({ 
        error: 'Authentication Failed', 
        details: 'User does not exist' 
      }, { status: 401 });
    }

    // Password verification
    const computedHashedPassword = hashPassword(user.rawPassword);
    console.log('Password Verification:', {
      providedHash: hashedPassword,
      computedHash: computedHashedPassword,
      match: hashedPassword === computedHashedPassword
    });

    if (hashedPassword !== computedHashedPassword) {
      console.error('Password mismatch for user:', username);
      return NextResponse.json({ 
        error: 'Invalid Credentials', 
        details: 'Incorrect password' 
      }, { status: 401 });
    }

    // Multi-Factor Authentication Check
    if (user.requiresMfa) {
      // Validate secure word expiry for MFA users
      if (!secureWord) {
        return NextResponse.json({ 
          error: 'Secure Word Required', 
          details: 'MFA requires a valid secure word' 
        }, { status: 400 });
      }

      const secureWordData = secureWordStore.get(username);
      if (!secureWordData) {
        return NextResponse.json({ 
          error: 'Invalid Secure Word', 
          details: 'No secure word found for this user' 
        }, { status: 401 });
      }

      // Check if secure word has expired (60 seconds)
      const now = Date.now();
      if (now - secureWordData.issuedAt > SECURE_WORD_EXPIRY_MS) {
        return NextResponse.json({ 
          error: 'Secure Word Expired', 
          details: 'Secure word has expired. Please request a new one.' 
        }, { status: 401 });
      }

      // Validate secure word match
      if (secureWord !== secureWordData.word) {
        return NextResponse.json({ 
          error: 'Invalid Secure Word', 
          details: 'Provided secure word does not match' 
        }, { status: 401 });
      }

      // Remove used secure word to prevent reuse
      secureWordStore.delete(username);

      return NextResponse.json({ 
        success: true, 
        requiresMfa: true,
        message: 'Multi-Factor Authentication Required' 
      });
    }

    // Create session
    const session = createSession(username);

    return NextResponse.json({ 
      success: true, 
      token: session.token,
      message: 'Login Successful' 
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ 
      error: 'Server Error', 
      details: 'An unexpected error occurred' 
    }, { status: 500 });
  }
}
