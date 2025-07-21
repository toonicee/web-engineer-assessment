/**
 * @jest-environment node
 */
import { GET } from './route';
import { STATIC_TRANSACTIONS, Transaction } from './data';

describe('Transaction History API', () => {
  beforeAll(() => {
    // Mock setTimeout for Node.js environment
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return transactions successfully', async () => {
    // Fast-forward timers to skip the delay
    const responsePromise = GET();
    jest.advanceTimersByTime(500);
    
    const response = await responsePromise;
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.transactions).toBeDefined();
    expect(data.transactions.length).toBeGreaterThan(0);
  });

  it('should have correct transaction structure', async () => {
    const responsePromise = GET();
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
    const responsePromise = GET();
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
    const responsePromise = GET();
    jest.advanceTimersByTime(500);
    
    const response = await responsePromise;
    const data = await response.json();

    expect(data.transactions).toEqual(STATIC_TRANSACTIONS);
  });
});