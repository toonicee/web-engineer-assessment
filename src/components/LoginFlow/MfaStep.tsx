"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateMfaCode } from "@/lib/crypto";
import { CircleAlert } from "lucide-react";

interface MfaStepProps {
  username: string;
  secureWord: string;
  onSubmit: (code: string) => Promise<void>;
  onLockoutExpired?: () => void;
  isLoading: boolean;
  error: string;
  attempts: number;
}

export default function MfaStep({
  secureWord,
  onSubmit,
  onLockoutExpired,
  isLoading,
  error,
  attempts,
}: MfaStepProps) {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      await onSubmit(fullCode);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);

      // Auto-focus next input
      if (numericValue && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const numericPaste = paste.replace(/\D/g, "").slice(0, 6);

    if (numericPaste.length === 6) {
      setCode(numericPaste.split(""));
    }
  };

  const generateMockCode = () => {
    const generatedCode = generateMfaCode(secureWord);
    setCode(generatedCode.split(""));
  };

  // Parse lockout time from error message and start countdown
  useEffect(() => {
    if (error && error.includes("Try again in")) {
      const match = error.match(/Try again in (\d+) second/);
      if (match) {
        const seconds = parseInt(match[1]);
        const endTime = Date.now() + (seconds * 1000);
        setLockoutEndTime(endTime);
        setCountdown(seconds);
      }
    } else {
      setLockoutEndTime(null);
      setCountdown(0);
    }
  }, [error]);

  // Countdown timer
  useEffect(() => {
    if (lockoutEndTime) {
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutEndTime - Date.now()) / 1000));
        setCountdown(remaining);
        
        if (remaining === 0) {
          setLockoutEndTime(null);
          clearInterval(timer);
          // Call parent callback or reload page
          if (onLockoutExpired) {
            onLockoutExpired();
          } else {
            window.location.reload();
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutEndTime, router]);

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
              Enter the 6-digit code generated from your secure word, or use the
              generator below
            </p>
            <div className="flex justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={isLoading}
                  className="w-12 h-12 text-center m-1 text-xl font-normal text-black border border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateMockCode}
              className="text-xs text-gray-500 hover:text-gray-600"
            >
              Generate Code from Secure Word
            </Button>
          </div>

          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-500 text-sm">
              {(error.includes("Too many failed attempts") || error.includes("Account locked")) && (
                <CircleAlert className="w-4 h-4" />
              )}
              <span>
                {countdown > 0 ? `Account locked. Try again in ${countdown} second(s).` : error}
              </span>
            </div>
          )}

          {attempts > 0 && (
            <div className="text-orange-500 text-sm text-center">
              Failed attempts: {attempts}/3
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.join("").length !== 6 || countdown > 0}
          >
            {isLoading ? "Verifying..." : countdown > 0 ? `Wait ${countdown}s` : "Verify"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
