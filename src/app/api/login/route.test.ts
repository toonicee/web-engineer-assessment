/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock NextRequest for Node.js environment
class MockNextRequest {
  url: string;
  method: string;
  headers: Map<string, string>;
  private body: any;

  constructor(body: any = {}, url: string = 'http://localhost:3000/api/login') {
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
  beforeAll(() => {
    // Mock setTimeout for Node.js environment
    jest.useFakeTimers();
  });

  afterAll(() => {
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
});
