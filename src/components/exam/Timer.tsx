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
  const color =
    pct > 0.4 ? "text-gray-800" : pct > 0.2 ? "text-amber-600" : "text-red-600";

  return (
    <div className={`font-mono font-bold tabular-nums text-sm ${color}`}>
      残り {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
