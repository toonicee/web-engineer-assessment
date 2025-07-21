"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoginState } from "@/types/auth";
import { hashPassword } from "@/lib/crypto";
import UsernameStep from "./UsernameStep";
import SecureWordStep from "./SecureWordStep";
import PasswordStep from "./PasswordStep";
import MfaStep from "./MfaStep";

const initialState: LoginState = {
  step: "username",
  username: "",
  secureWord: "",
  secureWordExpiry: 0,
  attempts: 0,
  isLoading: false,
  error: "",
};

export default function LoginFlow() {
  const [state, setState] = useState<LoginState>(initialState);
  const router = useRouter();

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading, error: "" }));
  }, []);

  // Step 1: Handle username submission and get secure word
  const handleUsernameSubmit = useCallback(
    async (username: string) => {
      setLoading(true);

      try {
        const response = await fetch("/api/getSecureWord", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get secure word");
        }

        setState((prev) => ({
          ...prev,
          username,
          secureWord: data.secureWord,
          secureWordExpiry: data.issuedAt + 60000, // 60 seconds from issue
          step: "secureWord",
          isLoading: false,
          error: "",
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    },
    [setError, setLoading]
  );

  // Step 2: Move to password step
  const handleSecureWordNext = useCallback(() => {
    setState((prev) => ({ ...prev, step: "password" }));
  }, []);

  // Step 3: Handle password submission and login
  const handlePasswordSubmit = useCallback(
    async (password: string) => {
      setLoading(true);

      try {
        const hashedPass = hashPassword(password);
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: state.username,
            hashedPassword: hashedPass,
            secureWord: state.secureWord,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        if (data.requiresMfa) {
          setState((prev) => ({
            ...prev,
            step: "mfa",
            isLoading: false,
            error: "",
          }));
        } else {
          // Login successful, store token and user info
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", state.username);
            
            // Dispatch custom event for login state change
            window.dispatchEvent(new Event('loginStateChanged'));
          }
          
          setState((prev) => ({ ...prev, step: "success", isLoading: false }));
          router.push("/dashboard");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Login failed");
      }
    },
    [state.username, state.secureWord, setError, setLoading, router]
  );

  // Step 4: Handle MFA code submission
  const handleMfaSubmit = useCallback(
    async (code: string) => {
      setLoading(true);

      try {
        const response = await fetch("/api/verifyMfa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: state.username,
            code,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            setState((prev) => ({
              ...prev,
              attempts: prev.attempts + 1,
              isLoading: false,
              error: data.error || "Invalid MFA code",
            }));
            return;
          }
          throw new Error(data.error || "MFA verification failed");
        }

        // MFA successful, store token and user info
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", state.username);
          
          // Dispatch custom event for login state change
          window.dispatchEvent(new Event('loginStateChanged'));
        }
        
        setState((prev) => ({ ...prev, step: "success", isLoading: false }));
        router.push("/dashboard");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "MFA verification failed"
        );
      }
    },
    [state.username, setError, setLoading, router]
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (state.step) {
      case "username":
        return (
          <UsernameStep
            onSubmit={handleUsernameSubmit}
            isLoading={state.isLoading}
            error={state.error}
          />
        );

      case "secureWord":
        return (
          <SecureWordStep
            username={state.username}
            secureWord={state.secureWord}
            expiresAt={state.secureWordExpiry}
            onNext={handleSecureWordNext}
            error={state.error}
          />
        );

      case "password":
        return (
          <PasswordStep
            username={state.username}
            onSubmit={handlePasswordSubmit}
            isLoading={state.isLoading}
            error={state.error}
          />
        );

      case "mfa":
        return (
          <MfaStep
            username={state.username}
            onSubmit={handleMfaSubmit}
            isLoading={state.isLoading}
            error={state.error}
            attempts={state.attempts}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {["username", "secureWord", "password", "mfa"].map(
              (step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    ["username", "secureWord", "password", "mfa"].indexOf(
                      state.step
                    ) >= index
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                />
              )
            )}
          </div>
          <p className="text-center text-sm text-gray-600 capitalize">
            Step{" "}
            {["username", "secureWord", "password", "mfa"].indexOf(state.step) +
              1}
            : {state.step.replace(/([A-Z])/g, " $1")}
          </p>
        </div>

        {renderCurrentStep()}

        {/* Demo credentials info */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">
            Demo Credentials:
          </h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>
              <strong>Username:</strong> admin, user, or demo
            </div>
            <div>
              <strong>Password:</strong> password123, userpass, or demo123
            </div>
            <div>
              <strong>MFA Code:</strong> 123456 (for admin and demo)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
