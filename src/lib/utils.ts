import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: any[]): string {
    return inputs.filter(Boolean).join(' ');
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}