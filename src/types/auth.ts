export interface SecureWordRequest {
  username: string;
}

export interface SecureWordResponse {
  secureWord: string;
  issuedAt: number;
}

export interface LoginRequest {
  username: string;
  hashedPassword: string;
  secureWord: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  requiresMfa?: boolean;
}

export interface MfaRequest {
  username: string;
  code: string;
}

export interface MfaResponse {
  success: boolean;
  token?: string;
}

export interface LoginState {
  step: 'username' | 'secureWord' | 'password' | 'mfa' | 'success';
  username: string;
  secureWord: string;
  secureWordExpiry: number;
  attempts: number;
  isLoading: boolean;
  error: string;
}

export interface SessionData {
  username: string;
  token: string;
  expiresAt: number;
}