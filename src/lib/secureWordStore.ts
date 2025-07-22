// Shared secure word store for rate limiting and expiry validation
export interface SecureWordData {
  word: string;
  issuedAt: number;
  requestCount: number;
  lastRequest: number;
}

// Use global to persist across hot reloads in development
const globalForSecureWordStore = globalThis as unknown as {
  secureWordStore: Map<string, SecureWordData> | undefined;
};

export const secureWordStore = 
  globalForSecureWordStore.secureWordStore ?? 
  new Map<string, SecureWordData>();

if (process.env.NODE_ENV === 'development') {
  globalForSecureWordStore.secureWordStore = secureWordStore;
}

export const SECURE_WORD_EXPIRY_MS = 60000; // 60 seconds
export const RATE_LIMIT_MS = 10000; // 10 seconds
