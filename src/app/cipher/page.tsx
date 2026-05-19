"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateCipherQuestions } from "@/lib/generators/cipher";
import { Timer } from "@/components/exam/Timer";
import { ProgressBar } from "@/components/exam/ProgressBar";
import { EXAM_QUESTION_COUNT, EXAM_TIME_LIMITS, ExamResult } from "@/types";

const COUNT = EXAM_QUESTION_COUNT.cipher;
const TIME = EXAM_TIME_LIMITS.cipher;

export default function CipherPage() {
  const router = useRouter();
  const [questions] = useState(() => generateCipherQuestions(COUNT));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<ExamResult["answers"]>([]);
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);

  const finish = useCallback(
    (finalResults: ExamResult["answers"]) => {
      if (finished) return;
      setFinished(true);
      const result: ExamResult = {
        type: "cipher",
        total: COUNT,
        correct: finalResults.filter((r) => r.correct).length,
        timeTakenMs: Date.now() - startTime,
        answers: finalResults,
      };
      sessionStorage.setItem("cabResult", JSON.stringify(result));
      router.push("/result");
    },
    [finished, startTime, router]
  );

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    const q = questions[current];
    const correct = choice === q.answer;
    const newResults = [...results, { question: q, userAnswer: choice, correct }];

    setTimeout(() => {
      if (current + 1 >= COUNT) {
        finish(newResults);
      } else {
        setResults(newResults);
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 400);
  };

  const handleTimeUp = useCallback(() => finish(results), [finish, results]);

  const q = questions[current];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-400">暗号</h1>
          <Timer durationMs={TIME} onTimeUp={handleTimeUp} />
        </div>

        <ProgressBar current={current} total={COUNT} />

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          {/* 対応表 */}
          <div>
            <p className="text-sm text-gray-400 mb-2">記号と文字の対応表</p>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(q.table).map(([sym, char]) => (
                <div key={sym} className="bg-gray-700 rounded-lg px-3 py-2 text-center">
                  <div className="text-2xl">{sym}</div>
                  <div className="text-sm text-gray-300">{char}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 暗号 */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-2">この暗号が表す言葉は？</p>
            <div className="flex gap-3 justify-center">
              {q.encoded.map((sym, i) => (
                <span
                  key={i}
                  className="bg-green-900/40 border border-green-700 rounded-lg w-12 h-12 flex items-center justify-center text-2xl"
                >
                  {sym}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4択 */}
        <div className="grid grid-cols-2 gap-3">
          {q.choices.map((choice) => {
            const isSelected = selected === choice;
            const isCorrect = choice === q.answer;
            let style = "bg-gray-800 border-gray-600 hover:border-green-500";
            if (selected) {
              if (isCorrect) style = "bg-green-800 border-green-500";
              else if (isSelected) style = "bg-red-800 border-red-500";
              else style = "bg-gray-800 border-gray-700 opacity-50";
            }
            return (
              <button
                key={choice}
                onClick={() => handleSelect(choice)}
                className={`border rounded-xl py-4 text-xl font-bold transition ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
