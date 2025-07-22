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

export function generateMfaCode(secureWord?: string): string {
  if (secureWord) {
    // Generate MFA code based on secure word (deterministic - numeric only)
    const hash = CryptoJS.MD5(secureWord).toString();
    // Convert hash to numbers only
    let numericCode = '';
    for (let i = 0; i < hash.length && numericCode.length < 6; i++) {
      const char = hash[i];
      if (/\d/.test(char)) {
        numericCode += char;
      }
    }
    // If not enough digits, pad with hash-based numbers
    while (numericCode.length < 6) {
      const charCode = hash.charCodeAt(numericCode.length) % 10;
      numericCode += charCode.toString();
    }
    return numericCode.substring(0, 6);
  }
  // Mock implementation - in real app use TOTP library
  return Math.random().toString().substr(2, 6);
}