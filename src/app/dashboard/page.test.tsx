import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from './page';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({
      success: true,
      transactions: [
        {
          id: 'TXN-001',
          date: '24 Aug 2023',
          referenceId: '#12345',
          to: {
            name: 'John Doe',
            description: 'Personal Transfer'
          },
          type: 'DuitNow Payment',
          amount: 250.75
        }
      ]
    })
  })
) as jest.Mock;

describe('DashboardPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        removeItem: jest.fn()
      },
      writable: true
    });
  });

  it('renders loading state initially', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Loading transactions.../i)).toBeInTheDocument();
  });

  it('renders transactions after loading', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Personal Transfer')).toBeInTheDocument();
    });
  });
});