import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "./page";
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock formatCurrency function
jest.mock("@/lib/utils", () => ({
  formatCurrency: jest.fn((amount: number) => `RM ${amount.toFixed(2)}`),
}));

// Mock fetch
global.fetch = jest.fn();

describe("DashboardPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock localStorage with valid tokens
    (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === "token") return "mock-token";
      if (key === "username") return "testuser";
      return null;
    });

    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          transactions: [
            {
              id: "TXN-001",
              date: "24 Aug 2023",
              referenceId: "#12345",
              to: {
                name: "John Doe",
                description: "Personal Transfer",
              },
              type: "DuitNow Payment",
              amount: 250.75,
            },
          ],
        }),
    });
  });

  it("renders loading state initially", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Loading transactions.../i)).toBeInTheDocument();
  });

  it("renders transactions after loading", async () => {
    render(<DashboardPage />);

    await waitFor(
      () => {
        expect(screen.getByText("Transaction History")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Personal Transfer")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("redirects to login when not authenticated", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    render(<DashboardPage />);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("renders table headers correctly", async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Reference ID")).toBeInTheDocument();
      expect(screen.getByText("To")).toBeInTheDocument();
      expect(screen.getByText("Type")).toBeInTheDocument();
      expect(screen.getByText("Amount")).toBeInTheDocument();
    });
  });

  it("displays transaction data in correct format", async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("#12345")).toBeInTheDocument();
      expect(screen.getByText("24 Aug 2023")).toBeInTheDocument();
      expect(screen.getByText("DuitNow Payment")).toBeInTheDocument();
      expect(screen.getByText("RM 250.75")).toBeInTheDocument();
    });
  });

  it("displays correct loading message when authenticating", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    render(<DashboardPage />);
    expect(screen.getByText("Authenticating...")).toBeInTheDocument();
  });

  it("renders with correct data-testid attributes", async () => {
    render(<DashboardPage />);

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
    });
  });

  it("renders loading spinner with correct accessibility attributes", () => {
    render(<DashboardPage />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(spinner).toHaveClass("animate-spin");
  });

  it("handles fetch error gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument();
    });
  });

  it("renders empty state when no transactions", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          transactions: [],
        }),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("No transactions found.")).toBeInTheDocument();
    });
  });

  it("handles unauthorized access", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
      json: () =>
        Promise.resolve({
          success: false,
          error: "Unauthorized",
        }),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("username");
    });
  });
});
