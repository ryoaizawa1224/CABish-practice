"use client";

const LABELS = ["ア", "イ", "ウ", "エ", "オ"];

interface ChoiceButtonProps {
  index: number;
  value: string | number;
  selected: boolean;
  correct?: boolean | null; // null = まだ判定しない
  onClick: () => void;
}

export function ChoiceButton({ index, value, selected, correct, onClick }: ChoiceButtonProps) {
  let style =
    "border-gray-300 bg-white text-gray-800 hover:border-blue-500 hover:bg-blue-50";

  if (selected && correct === null) {
    style = "border-blue-600 bg-blue-600 text-white";
  } else if (selected && correct === true) {
    style = "border-green-600 bg-green-600 text-white";
  } else if (selected && correct === false) {
    style = "border-red-500 bg-red-500 text-white";
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 border-2 rounded-lg px-5 py-3.5 text-left transition-all duration-150 cursor-pointer ${style}`}
    >
      <span className="w-7 h-7 flex-shrink-0 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
        {LABELS[index]}
      </span>
      <span className="text-lg font-medium">{value}</span>
    </button>
  );
}
