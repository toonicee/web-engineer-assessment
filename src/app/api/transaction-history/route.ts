import { NextRequest, NextResponse } from 'next/server';

// Transaction Interface
export interface Transaction {
  id: string;
  date: string;
  referenceId: string;
  to: {
    name: string;
    description: string;
  };
  type: 'DuitNow Payment' | 'Visa' | 'MasterCard';
  amount: number;
}

// Static Transaction Data
export const STATIC_TRANSACTIONS: Transaction[] = [
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
  },
  {
    id: 'TXN-002',
    date: '23 Aug 2023',
    referenceId: '#67890',
    to: {
      name: 'Acme Corporation',
      description: 'Business Service'
    },
    type: 'Visa',
    amount: 1500.50
  },
  {
    id: 'TXN-003',
    date: '22 Aug 2023',
    referenceId: '#54321',
    to: {
      name: 'Online Marketplace',
      description: 'E-commerce Purchase'
    },
    type: 'MasterCard',
    amount: 75.25
  },
  {
    id: 'TXN-004',
    date: '21 Aug 2023',
    referenceId: '#98765',
    to: {
      name: 'Jane Smith',
      description: 'Utility Payment'
    },
    type: 'DuitNow Payment',
    amount: 125.60
  },
  {
    id: 'TXN-005',
    date: '20 Aug 2023',
    referenceId: '#24680',
    to: {
      name: 'Local Restaurant',
      description: 'Dining Expense'
    },
    type: 'Visa',
    amount: 45.30
  },
  {
    id: 'TXN-006',
    date: '19 Aug 2023',
    referenceId: '#13579',
    to: {
      name: 'Tech Supplies',
      description: 'Office Equipment'
    },
    type: 'MasterCard',
    amount: 675.90
  },
  {
    id: 'TXN-007',
    date: '18 Aug 2023',
    referenceId: '#86420',
    to: {
      name: 'Utility Company',
      description: 'Electricity Bill'
    },
    type: 'DuitNow Payment',
    amount: 185.75
  },
  {
    id: 'TXN-008',
    date: '17 Aug 2023',
    referenceId: '#97531',
    to: {
      name: 'Streaming Service',
      description: 'Monthly Subscription'
    },
    type: 'Visa',
    amount: 15.99
  },
  {
    id: 'TXN-009',
    date: '16 Aug 2023',
    referenceId: '#24680',
    to: {
      name: 'Grocery Store',
      description: 'Weekly Groceries'
    },
    type: 'MasterCard',
    amount: 95.45
  },
  {
    id: 'TXN-010',
    date: '15 Aug 2023',
    referenceId: '#13579',
    to: {
      name: 'Car Service Center',
      description: 'Vehicle Maintenance'
    },
    type: 'DuitNow Payment',
    amount: 350.25
  }
];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      transactions: STATIC_TRANSACTIONS,
      total: STATIC_TRANSACTIONS.length
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions'
      },
      { status: 500 }
    );
  }
}
