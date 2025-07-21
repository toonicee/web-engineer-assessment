export function cn(...inputs: (string | Record<string, boolean> | undefined)[]): string {
    return inputs
        .filter(Boolean)
        .map(input => {
            if (typeof input === 'string') return input;
            if (typeof input === 'object') {
                return Object.entries(input)
                    .filter(([, value]) => value)
                    .map(([key]) => key)
                    .join(' ');
            }
            return '';
        })
        .filter(Boolean)
        .join(' ');
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