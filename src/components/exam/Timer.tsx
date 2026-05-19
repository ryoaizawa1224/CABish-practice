"use client";
import { useEffect, useState } from "react";

interface TimerProps {
  durationMs: number;
  onTimeUp: () => void;
}

export function Timer({ durationMs, onTimeUp }: TimerProps) {
  const [remaining, setRemaining] = useState(durationMs);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const pct = remaining / durationMs;
  const color = pct > 0.5 ? "text-green-400" : pct > 0.25 ? "text-yellow-400" : "text-red-400";

  return (
    <div className={`font-mono text-2xl font-bold tabular-nums ${color}`}>
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
