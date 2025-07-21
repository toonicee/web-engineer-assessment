import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/crypto';
import { createSession } from '@/lib/auth';

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
