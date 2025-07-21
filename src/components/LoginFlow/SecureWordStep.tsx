"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SecureWordStepProps {
  username: string;
  secureWord: string;
  expiresAt: number;
  onNext: () => void;
  error: string;
}

export default function SecureWordStep({
  username,
  secureWord,
  expiresAt,
  onNext,
  error,
}: SecureWordStepProps) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-slide-up">
      <CardHeader>
        <CardTitle className="text-center text-gray-600">Secure Word</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">Hello, {username}</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-2xl font-mono font-bold text-blue-600 mb-2">
            {secureWord}
          </div>
          <div className="text-sm text-gray-500">
            Expires in: {formatTime(timeLeft)}
          </div>
        </div>
        {timeLeft > 0 ? (
          <>
            <p className="text-sm text-gray-500">
              Please remember this secure word. You'll need it for the next
              step.
            </p>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button onClick={onNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Next
            </Button>
          </>
        ) : (
          <div className="text-red-500 text-sm">
            Secure word has expired. Please start over.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
