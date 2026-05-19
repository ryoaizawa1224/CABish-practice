"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateCipherQuestions } from "@/lib/generators/cipher";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ChoiceButton } from "@/components/exam/ChoiceButton";
import {
  EXAM_QUESTION_COUNT,
  EXAM_TIME_LIMITS,
  EXAM_LABELS,
  EXAM_DESCRIPTIONS,
  ExamResult,
} from "@/types";

const TYPE = "cipher";
const COUNT = EXAM_QUESTION_COUNT[TYPE];
const TIME = EXAM_TIME_LIMITS[TYPE];

export default function CipherPage() {
  const router = useRouter();
  const [questions] = useState(() => generateCipherQuestions(COUNT));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<ExamResult["answers"]>([]);
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);

  const finish = useCallback(
    (finalResults: ExamResult["answers"]) => {
      if (finished) return;
      setFinished(true);
      const result: ExamResult = {
        type: TYPE,
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

  const handleNext = () => {
    if (selected === null) return;
    const q = questions[current];
    const chosenValue = q.choices[selected];
    const correct = chosenValue === q.answer;
    const newResults = [
      ...results,
      { question: q, userAnswer: String(chosenValue), correct },
    ];
    if (current + 1 >= COUNT) {
      finish(newResults);
    } else {
      setResults(newResults);
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const handleTimeUp = useCallback(() => finish(results), [finish, results]);
  const q = questions[current];

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamHeader
        label={EXAM_LABELS[TYPE]}
        current={current + 1}
        total={COUNT}
        timeLimitMs={TIME}
        onTimeUp={handleTimeUp}
      />

      <main className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <p className="text-sm text-gray-500 mb-6">{EXAM_DESCRIPTIONS[TYPE]}</p>

        {/* 問題カード */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 space-y-5">
          {/* 対応表 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              暗号表
            </p>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(q.table).map(([sym, char]) => (
                <div
                  key={sym}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-center min-w-[3.5rem]"
                >
                  <div className="text-2xl">{sym}</div>
                  <div className="text-sm font-medium text-gray-600 mt-1">{char}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 暗号列 */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 mb-3">この暗号が表す言葉は？</p>
            <div className="flex gap-3 justify-center">
              {q.encoded.map((sym, i) => (
                <div
                  key={i}
                  className="w-14 h-14 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-center justify-center text-2xl"
                >
                  {sym}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {q.choices.map((choice, i) => (
            <ChoiceButton
              key={i}
              index={i}
              value={choice}
              selected={selected === i}
              correct={null}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-10 py-3 rounded-lg transition-colors"
          >
            次の問題へ →
          </button>
        </div>
      </main>
    </div>
  );
}
