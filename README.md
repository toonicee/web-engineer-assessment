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

- **18 Passing Unit Tests**: Complete logic coverage
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

## API Endpoints

The application includes these API endpoints:

- `POST /api/getSecureWord` - Generate secure word for authentication
- `POST /api/login` - Authenticate user with credentials
- `POST /api/verifyMfa` - Verify MFA code
- `GET /api/transaction-history` - Fetch user transactions

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT tokens with bcrypt password hashing
- **Testing**: Jest with React Testing Library
- **UI Components**: Custom components with shadcn/ui patterns
- **State Management**: React hooks and local storage

## Development Guidelines

1. **Code Style**: Follow TypeScript and ESLint configurations
2. **Testing**: Write unit tests for new features
3. **Security**: Never commit secrets, use environment variables
4. **Components**: Follow existing patterns for consistency
5. **API**: Implement proper error handling and validation

## 📁 Challenge Implementation Details

### Challenge 1: Navbar Implementation

- **Location**: `src/app/layout.tsx` and navigation components
- **Features**: Responsive design, clean UI, mobile-optimized
- **Technology**: Next.js App Router, Tailwind CSS

### Challenge 2: Login Flow Implementation

- **Location**: `src/components/LoginFlow/` directory
- **Files**:
  - `index.tsx` - Main login flow orchestrator
  - `UsernameStep.tsx` - Username input component
  - `SecureWordStep.tsx` - Secure word display with timer
  - `PasswordStep.tsx` - Password input component
  - `MfaStep.tsx` - MFA code verification component
- **API Routes**: `src/app/api/getSecureWord/`, `src/app/api/login/`, `src/app/api/verifyMfa/`

### Challenge 3: Data Table Implementation

- **Location**: `src/app/dashboard/page.tsx`
- **API Route**: `src/app/api/transaction-history/route.ts`
- **Features**: Real-time data fetching, loading states, error handling, responsive design
- **Data**: Mock transaction data with realistic fields

### Challenge 4: Unit Tests Implementation

- **Location**: Multiple test files across components
- **Primary Test File**: `src/components/LoginFlow/LoginFlow.simple.test.tsx`
- **Coverage**: 18 comprehensive unit tests covering all core functionality
- **Testing Strategy**: Logic-focused tests due to React 19 compatibility considerations
