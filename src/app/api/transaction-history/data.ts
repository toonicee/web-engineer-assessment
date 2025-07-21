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
    referenceId: '#12346',
    to: {
      name: 'Jane Smith',
      description: 'Online Purchase'
    },
    type: 'Visa',
    amount: 89.50
  },
  {
    id: 'TXN-003',
    date: '22 Aug 2023',
    referenceId: '#12347',
    to: {
      name: 'ABC Supermarket',
      description: 'Grocery Shopping'
    },
    type: 'MasterCard',
    amount: 156.25
  },
  {
    id: 'TXN-004',
    date: '21 Aug 2023',
    referenceId: '#12348',
    to: {
      name: 'Sarah Wilson',
      description: 'Bill Payment'
    },
    type: 'DuitNow Payment',
    amount: 320.00
  },
  {
    id: 'TXN-005',
    date: '20 Aug 2023',
    referenceId: '#12349',
    to: {
      name: 'Tech Store',
      description: 'Electronics Purchase'
    },
    type: 'Visa',
    amount: 899.99
  },
  {
    id: 'TXN-006',
    date: '19 Aug 2023',
    referenceId: '#12350',
    to: {
      name: 'Coffee House',
      description: 'Dining'
    },
    type: 'MasterCard',
    amount: 28.75
  },
  {
    id: 'TXN-007',
    date: '18 Aug 2023',
    referenceId: '#12351',
    to: {
      name: 'Mike Johnson',
      description: 'Personal Transfer'
    },
    type: 'DuitNow Payment',
    amount: 150.00
  },
  {
    id: 'TXN-008',
    date: '17 Aug 2023',
    referenceId: '#12352',
    to: {
      name: 'Gas Station',
      description: 'Fuel Purchase'
    },
    type: 'Visa',
    amount: 65.40
  },
  {
    id: 'TXN-009',
    date: '16 Aug 2023',
    referenceId: '#12353',
    to: {
      name: 'BookStore',
      description: 'Educational Materials'
    },
    type: 'MasterCard',
    amount: 42.80
  },
  {
    id: 'TXN-010',
    date: '15 Aug 2023',
    referenceId: '#12354',
    to: {
      name: 'Lisa Chen',
      description: 'Gift Transfer'
    },
    type: 'DuitNow Payment',
    amount: 350.25
  }
];
