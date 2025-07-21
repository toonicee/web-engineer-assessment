"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Transaction Interface
interface Transaction {
  id: string;
  date: string;
  referenceId: string;
  to: {
    name: string;
    description: string;
  };
  type: "DuitNow Payment" | "Visa" | "MasterCard";
  amount: number;
}

// Utility function for RM formatting
function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username) {
        // Redirect to login if not authenticated
        router.push("/login");
        return false;
      }

      return true;
    };

    // Validate authentication
    const authenticated = checkAuthentication();
    setIsAuthenticated(authenticated);

    // If authenticated, fetch transactions
    if (authenticated) {
      async function fetchTransactions() {
        try {
          const response = await fetch("/api/transaction-history", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          // Handle unauthorized access
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            router.push("/login");
            return;
          }

          const data = await response.json();

          if (data.success) {
            setTransactions(data.transactions);
          } else {
            setError(data.error || "Failed to fetch transactions");
          }
        } catch (err) {
          setError("Network error");
        } finally {
          setIsLoading(false);
        }
      }

      fetchTransactions();
    }
  }, [router]);

  // Render loading state
  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isAuthenticated ? "Loading transactions..." : "Authenticating..."}
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render dashboard content
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
          Transaction History
        </h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                    Reference ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                    To
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-extrabold text-gray-600">
                      {transaction.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-extrabold text-gray-600">
                      {transaction.referenceId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm  text-gray-600">
                      <span className="block text-gray-600">
                        {transaction.to.name}
                      </span>
                      <span className="block font-thin text-xs text-gray-400">
                        {transaction.to.description}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm font-extrabold text-gray-600">
                      {transaction.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-extrabold text-gray-700 mb-4">
              Total Transactions
            </h3>
            <p className="text-2xl font-extrabold text-blue-600">
              {transactions.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-extrabold text-gray-700 mb-4">
              Total Amount
            </h3>
            <p className="text-2xl font-extrabold text-green-600">
              {formatCurrency(
                transactions.reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-extrabold text-gray-700 mb-4">
              Transaction Types
            </h3>
            <div className="text-sm text-gray-600">
              {Array.from(new Set(transactions.map((t) => t.type))).map(
                (type) => (
                  <div key={type} className="flex justify-between">
                    <span>{type}</span>
                    <span>
                      {transactions.filter((t) => t.type === type).length}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
