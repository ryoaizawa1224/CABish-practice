"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Timer } from "./Timer";

interface ExamHeaderProps {
  label: string;
  current: number;
  total: number;
  timeLimitMs: number;
  onTimeUp: () => void;
}

export function ExamHeader({ label, current, total, timeLimitMs, onTimeUp }: ExamHeaderProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleQuit = () => {
    setShowConfirm(false);
    sessionStorage.removeItem("cabResult");
    router.push("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* 左: テスト名 + 中断 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirm(true)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md p-1.5 transition-colors -ml-1.5"
              title="テストを中断してトップに戻る"
              aria-label="中断"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-xs font-semibold text-white bg-blue-700 px-2.5 py-1 rounded">
              CAB
            </span>
            <span className="font-semibold text-gray-800 text-sm">{label}</span>
          </div>

          {/* 中央: 問題番号 */}
          <div className="text-sm text-gray-500 hidden sm:block">
            <span className="font-bold text-gray-900 text-base">{current}</span>
            <span className="mx-0.5">/</span>
            <span>{total}</span>
          </div>

          {/* 右: タイマー */}
          <Timer durationMs={timeLimitMs} onTimeUp={onTimeUp} />
        </div>

        {/* プログレスバー */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>

        {/* スマホ用問題番号 */}
        <div className="sm:hidden text-center text-xs text-gray-500 py-1">
          問 {current} / {total}
        </div>
      </header>

      {/* 中断確認モーダル */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-900 text-lg mb-2">テストを中断しますか？</h3>
            <p className="text-sm text-gray-500 mb-5">
              ここまでの回答は記録されません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
              >
                続ける
              </button>
              <button
                onClick={handleQuit}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                中断する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
