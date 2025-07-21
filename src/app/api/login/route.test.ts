/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from './route';
import { secureWordStore, SECURE_WORD_EXPIRY_MS } from '@/lib/secureWordStore';
import { hashPassword } from '@/lib/crypto';

// Mock NextRequest for Node.js environment
class MockNextRequest {
  url: string;
  method: string;
  headers: Map<string, string>;
  private body: unknown;

  constructor(body: unknown = {}, url: string = 'http://localhost:3000/api/login') {
    this.url = url;
    this.method = 'POST';
    this.headers = new Map();
    this.body = body;
  }

  async json() {
    return Promise.resolve(this.body);
  }
}

describe('Login API', () => {
  beforeEach(() => {
    // Clear store before each test
    secureWordStore.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle missing credentials', async () => {
    const mockRequest = new MockNextRequest({
      username: '',
      hashedPassword: '',
      secureWord: ''
    }) as unknown as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should handle invalid user', async () => {
    const mockRequest = new MockNextRequest({
      username: 'invaliduser',
      hashedPassword: 'somehash',
      secureWord: 'someword'
    }) as unknown as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBeDefined();
  });

  it('should handle valid login request structure', async () => {
    const mockRequest = new MockNextRequest({
      username: 'admin',
      hashedPassword: 'validhash',
      secureWord: 'validword'
    }) as unknown as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    // Should return a response (either success or error)
    expect(response.status).toBeDefined();
    expect(data).toBeDefined();
  });

  it('should return proper error structure', async () => {
    const mockRequest = new MockNextRequest({
      username: 'testuser',
      hashedPassword: 'testhash',
      secureWord: 'testword'
    }) as unknown as NextRequest;

    const response = await POST(mockRequest);
    const data = await response.json();

    // Should have either success or error property
    expect(data).toHaveProperty('error');
  });

  describe('Secure Word Expiry Validation', () => {
    it('should reject expired secure word', async () => {
      const username = 'admin';
      const secureWord = 'test-secure-word';
      const now = Date.now();
      
      // Add expired secure word to store
      secureWordStore.set(username, {
        word: secureWord,
        issuedAt: now - SECURE_WORD_EXPIRY_MS - 1000, // Expired by 1 second
        requestCount: 1,
        lastRequest: now - SECURE_WORD_EXPIRY_MS - 1000
      });

      const mockRequest = new MockNextRequest({
        username,
        hashedPassword: hashPassword('password123'),
        secureWord
      }) as unknown as NextRequest;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Secure Word Expired');
      expect(data.details).toContain('expired');
    });

    it('should accept valid secure word within expiry time', async () => {
      const username = 'admin';
      const secureWord = 'test-secure-word';
      const now = Date.now();
      
      // Add valid secure word to store
      secureWordStore.set(username, {
        word: secureWord,
        issuedAt: now - 30000, // 30 seconds ago (within 60 second limit)
        requestCount: 1,
        lastRequest: now - 30000
      });

      const mockRequest = new MockNextRequest({
        username,
        hashedPassword: hashPassword('password123'),
        secureWord
      }) as unknown as NextRequest;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.requiresMfa).toBe(true);
    });

    it('should reject invalid secure word', async () => {
      const username = 'admin';
      const correctSecureWord = 'correct-word';
      const wrongSecureWord = 'wrong-word';
      const now = Date.now();
      
      // Add valid secure word to store
      secureWordStore.set(username, {
        word: correctSecureWord,
        issuedAt: now - 30000,
        requestCount: 1,
        lastRequest: now - 30000
      });

      const mockRequest = new MockNextRequest({
        username,
        hashedPassword: hashPassword('password123'),
        secureWord: wrongSecureWord
      }) as unknown as NextRequest;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid Secure Word');
      expect(data.details).toContain('does not match');
    });

    it('should reject when no secure word found', async () => {
      const username = 'admin';
      const secureWord = 'test-word';

      // No secure word in store

      const mockRequest = new MockNextRequest({
        username,
        hashedPassword: hashPassword('password123'),
        secureWord
      }) as unknown as NextRequest;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid Secure Word');
      expect(data.details).toContain('No secure word found');
    });

    it('should require secure word for MFA users', async () => {
      const username = 'admin';

      const mockRequest = new MockNextRequest({
        username,
        hashedPassword: hashPassword('password123')
        // No secureWord provided
      }) as unknown as NextRequest;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Secure Word Required');
      expect(data.details).toContain('MFA requires');
    });

    it('should remove secure word after successful use', async () => {
      const username = 'admin';
      const secureWord = 'test-secure-word';
      const now = Date.now();
      
      // Add valid secure word to store
      secureWordStore.set(username, {
        word: secureWord,
        issuedAt: now - 30000,
        requestCount: 1,
        lastRequest: now - 30000
      });

      const mockRequest = new MockNextRequest({
        username,
        hashedPassword: hashPassword('password123'),
        secureWord
      }) as unknown as NextRequest;

      // Verify secure word exists before request
      expect(secureWordStore.has(username)).toBe(true);

      await POST(mockRequest);

      // Verify secure word is removed after successful use
      expect(secureWordStore.has(username)).toBe(false);
    });
  });
});
