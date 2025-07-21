"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PasswordStepProps {
  username: string;
  onSubmit: (password: string) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export default function PasswordStep({
  username,
  onSubmit,
  isLoading,
  error,
}: PasswordStepProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      await onSubmit(password);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-slide-up">
      <CardHeader>
        <CardTitle className="text-center text-gray-600">
          Enter Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Welcome back, {username}
            </p>
            <Input
              type="password"
              className="text-gray-500 placeholder:text-gray-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading || !password}
          >
            {isLoading ? "Verifying..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
