import { NextResponse } from 'next/server';
import { STATIC_TRANSACTIONS } from './data';

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      transactions: STATIC_TRANSACTIONS,
      total: STATIC_TRANSACTIONS.length
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions'
      },
      { status: 500 }
    );
  }
}
