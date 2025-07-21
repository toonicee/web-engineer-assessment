// Shared secure word store for rate limiting and expiry validation
export interface SecureWordData {
  word: string;
  issuedAt: number;
  requestCount: number;
  lastRequest: number;
}

export const secureWordStore = new Map<string, SecureWordData>();

export const SECURE_WORD_EXPIRY_MS = 60000; // 60 seconds
export const RATE_LIMIT_MS = 10000; // 10 seconds
