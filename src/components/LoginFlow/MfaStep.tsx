"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MfaStepProps {
  username: string;
  onSubmit: (code: string) => Promise<void>;
  isLoading: boolean;
  error: string;
  attempts: number;
}

export default function MfaStep({
  username,
  onSubmit,
  isLoading,
  error,
  attempts,
}: MfaStepProps) {
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      await onSubmit(code);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setCode(numericValue);
  };

  const generateMockCode = () => {
    setCode("123456");
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-slide-up">
      <CardHeader>
        <CardTitle className="text-center text-gray-600">
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code from your authenticator app
            </p>
            <Input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              disabled={isLoading}
              className="text-center text-lg tracking-widest font-mono text-gray-500 placeholder:text-gray-200"
              maxLength={6}
              autoFocus
            />
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateMockCode}
              className="text-xs text-gray-500 hover:text-gray-600"
            >
              Use Demo Code (123456)
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {attempts > 0 && (
            <div className="text-orange-500 text-sm text-center">
              Failed attempts: {attempts}/3
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
