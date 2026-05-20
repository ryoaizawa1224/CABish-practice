"use client";
import { ReactNode } from "react";

const LABELS = ["ア", "イ", "ウ", "エ", "オ"];

interface ChoiceButtonProps {
  index: number;
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  /** trueなら横並びになっても良いコンパクト表示 */
  compact?: boolean;
}

export function ChoiceButton({ index, selected, onClick, children, compact }: ChoiceButtonProps) {
  const base = "border-2 rounded-lg transition-all duration-150 cursor-pointer flex items-center";
  const sel = selected
    ? "border-blue-600 bg-blue-600 text-white"
    : "border-gray-300 bg-white text-gray-800 hover:border-blue-500 hover:bg-blue-50";
  const padding = compact ? "px-3 py-2 gap-3" : "px-5 py-3.5 gap-4 w-full";

  return (
    <button onClick={onClick} className={`${base} ${sel} ${padding}`}>
      <span className="w-7 h-7 flex-shrink-0 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
        {LABELS[index]}
      </span>
      <span className="flex-1 flex items-center justify-center min-w-0">
        {children}
      </span>
    </button>
  );
}
