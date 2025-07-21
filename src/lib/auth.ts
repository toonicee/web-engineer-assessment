import jwt from 'jsonwebtoken';
import { SessionData } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function generateToken(username: string): string {
    return jwt.sign(
        { username, issuedAt: Date.now() },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

export function verifyToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.username;
    } catch {
        return null;
    }
}

export function createSession(username: string) {
    return {
        token: `${username}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
}