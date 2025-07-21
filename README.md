# Web Engineer Assessment

This is a [Next.js](https://nextjs.org) project implementing solutions for 4 development challenges focused on modern web application fundamentals.

## 🎯 Challenges Completed

### Challenge 1: Build a Basic Navbar with Next.js ✅

**Objective**: Create a simple web application using Next.js that includes a functional navigation bar (navbar). Focus on layout and basic interaction without adding backend functionality.

**Implementation**:

- Clean, responsive navigation interface
- Next.js App Router for seamless page transitions
- Tailwind CSS for modern styling
- Mobile-friendly responsive design

### Challenge 2: Build a Simple Login Flow with Next.js ✅

**Objective**: Create a basic login system using Next.js where the user enters a username and password. The login flow will include multiple steps and demonstrate interaction with a mock API.

**Implementation**:

- **Multi-Step Authentication Flow**: Username → Secure Word → Password → MFA
- **Mock API Integration**: `/api/getSecureWord`, `/api/login`, `/api/verifyMfa`
- **Secure Password Handling**: bcrypt hashing, JWT tokens
- **Interactive Progress Indicator**: Visual step progression
- **Error Handling**: Comprehensive user feedback

### Challenge 3: Create a Simple Table with Data Fetching from a Mock API ✅

**Objective**: After a successful login, redirect user to a page displaying a simple table with data fetched from a mock API (e.g., `/api/transaction-history`).

**Implementation**:

- **Transaction Dashboard**: Clean, sortable data table
- **Mock API Endpoint**: `/api/transaction-history` with realistic data
- **Real-time Data Fetching**: Automatic updates and loading states
- **Responsive Table Design**: Mobile-optimized layout
- **Error States**: Graceful handling of API failures

### Challenge 4: Unit Tests ✅

**Objective**: Implement comprehensive unit tests for the application functionality.

**Implementation**:

- **Authentication Testing**: Login flow, MFA, token management
- **API Testing**: Mock API responses and error handling
- **Input Validation**: Username, password, MFA code validation
- **Timer Logic**: Secure word expiry and countdown
- **Dashboard Testing**: Table rendering and data display

## 🚀 Features Delivered

- **Multi-Step Login Flow**: Username → Secure Word → Password → MFA
- **Transaction Dashboard**: View transaction history with real-time data
- **Secure Authentication**: JWT tokens, password hashing, MFA support
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Comprehensive Testing**: Unit tests and logic validation

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

### Development

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Demo Credentials

Use these credentials to test the login flow:

**Username Options:**

- `admin` (requires MFA)
- `user` (no MFA required)
- `demo` (requires MFA)

**Password Options:**

- `password123` (for admin)
- `userpass` (for user)
- `demo123` (for demo)

**MFA Code:** `123456` (for admin and demo users)

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard page and tests
│   └── login/             # Login page
├── components/            # React components
│   ├── LoginFlow/         # Multi-step login components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## Testing

### Running Tests

This project includes comprehensive unit tests for all core functionality:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Test Coverage

**✅ Working Tests :**

```bash
# Run LoginFlow logic tests
yarn test src/components/LoginFlow/LoginFlow.simple.test.tsx

# Run Dashboard tests
yarn test src/app/dashboard/page.test.tsx
```

**Test Areas Covered:**

- Username submission and validation
- Password authentication with hashing
- MFA verification and code validation
- Secure word timer and expiry logic
- Token storage and session management
- API error handling and network failures
- Input validation and sanitization
- Navigation and routing logic

## Build and Production

### Build the application

```bash
yarn build
```

### Start production server

```bash
yarn start
```

### Type checking

```bash
yarn lint
```
