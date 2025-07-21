/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, STATIC_TRANSACTIONS, Transaction } from './route';

// Mock NextRequest for Node.js environment
class MockNextRequest {
  url: string;
  method: string;
  headers: Map<string, string>;

  constructor(url: string = 'http://localhost:3000/api/transaction-history') {
    this.url = url;
    this.method = 'GET';
    this.headers = new Map();
  }

  json() {
    return Promise.resolve({});
  }
}

describe('Transaction History API', () => {
  beforeAll(() => {
    // Mock setTimeout for Node.js environment
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return transactions successfully', async () => {
    const mockRequest = new MockNextRequest() as unknown as NextRequest;
    
    // Fast-forward timers to skip the delay
    const responsePromise = GET(mockRequest);
    jest.advanceTimersByTime(500);
    
    const response = await responsePromise;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.transactions).toBeDefined();
    expect(data.transactions.length).toBeGreaterThan(0);
  });

  it('should have correct transaction structure', async () => {
    const mockRequest = new MockNextRequest() as unknown as NextRequest;
    
    const responsePromise = GET(mockRequest);
    jest.advanceTimersByTime(500);
    
    const response = await responsePromise;
    const data = await response.json();

    const transaction = data.transactions[0];
    expect(transaction).toHaveProperty('id');
    expect(transaction).toHaveProperty('date');
    expect(transaction).toHaveProperty('referenceId');
    expect(transaction).toHaveProperty('to.name');
    expect(transaction).toHaveProperty('to.description');
    expect(transaction).toHaveProperty('type');
    expect(transaction).toHaveProperty('amount');
  });

  it('should return transactions with correct properties', async () => {
    const mockRequest = new MockNextRequest() as unknown as NextRequest;
    
    const responsePromise = GET(mockRequest);
    jest.advanceTimersByTime(500);
    
    const response = await responsePromise;
    const data = await response.json();

    expect(data.total).toBe(data.transactions.length);
    
    data.transactions.forEach((transaction: Transaction) => {
      expect(transaction).toMatchObject({
        id: expect.any(String),
        date: expect.any(String),
        referenceId: expect.any(String),
        to: {
          name: expect.any(String),
          description: expect.any(String)
        },
        type: expect.any(String),
        amount: expect.any(Number)
      });
    });
  });

  it('should match static transactions', async () => {
    const mockRequest = new MockNextRequest() as unknown as NextRequest;
    
    const responsePromise = GET(mockRequest);
    jest.advanceTimersByTime(500);
    
    const response = await responsePromise;
    const data = await response.json();

    expect(data.transactions).toEqual(STATIC_TRANSACTIONS);
  });
});