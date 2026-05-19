"use client";
import { Timer } from "./Timer";

interface ExamHeaderProps {
  label: string;
  current: number;
  total: number;
  timeLimitMs: number;
  onTimeUp: () => void;
}

export function ExamHeader({ label, current, total, timeLimitMs, onTimeUp }: ExamHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* テスト名 */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-white bg-blue-700 px-2.5 py-1 rounded">
            CAB
          </span>
          <span className="font-semibold text-gray-800 text-sm">{label}</span>
        </div>

        {/* 問題番号 */}
        <div className="text-sm text-gray-500">
          <span className="font-bold text-gray-900 text-base">{current}</span>
          <span className="mx-0.5">/</span>
          <span>{total}</span>
        </div>

        {/* タイマー */}
        <Timer durationMs={timeLimitMs} onTimeUp={onTimeUp} />
      </div>

      {/* プログレスバー */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 bg-blue-600 transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </header>
  );
}
