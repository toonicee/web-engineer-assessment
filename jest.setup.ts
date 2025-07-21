import '@testing-library/jest-dom';
import { act } from 'react';

// Make act available globally
(global as any).act = act;

// Configure React Testing Library
import { configure } from '@testing-library/react';

configure({
    testIdAttribute: 'data-testid',
});

// Mock Next.js modules
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data, init) => ({ 
            json: () => Promise.resolve(data),
            status: init?.status || 200,
            headers: new Headers(init?.headers || {})
        }))
    }
}));

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            route: '/',
            pathname: '',
            query: {},
            asPath: '',
            push: jest.fn(),
            replace: jest.fn(),
        }
    },
    usePathname() {
        return '/'
    },
    useSearchParams() {
        return new URLSearchParams()
    }
}));

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

// Only define localStorage if window exists (jsdom environment)
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
    });
} else {
    // For Node.js environment, set it as global
    global.localStorage = localStorageMock as any;
}