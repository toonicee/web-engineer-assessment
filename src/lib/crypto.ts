import CryptoJS from 'crypto-js';

export function hashPassword(password: string): string {
  // Simple hash function for demonstration
  // In production, use a secure hashing library like bcrypt
  const salt = 'your-secret-salt'; // Replace with a secure, environment-based salt
  return btoa(password + salt); // Base64 encoding (for demo only)
}

export function generateSecureWord(username: string): string {
  const timestamp = Date.now();
  const hash = CryptoJS.MD5(username + timestamp).toString();
  return hash.substring(0, 8).toUpperCase();
}

export function generateMfaCode(): string {
  // Mock implementation - in real app use TOTP library
  return Math.random().toString().substr(2, 6);
}