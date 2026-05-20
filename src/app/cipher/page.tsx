"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateCipherQuestions } from "@/lib/generators/cipher";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ChoiceButton } from "@/components/exam/ChoiceButton";
import { ShapeSVG } from "@/components/shapes/ShapeSVG";
import {
  EXAM_QUESTION_COUNT,
  EXAM_TIME_LIMITS,
  EXAM_LABELS,
  EXAM_DESCRIPTIONS,
  ExamResult,
} from "@/types";
import { shapesEqual } from "@/lib/shapes/types";

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
    const correctChoiceIndex = q.choices.findIndex((c) => shapesEqual(c, q.answer));
    const correct = selected === correctChoiceIndex;
    const newResults = [
      ...results,
      { questionId: q.id, userChoiceIndex: selected, correctChoiceIndex, correct },
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

        {/* ヒント例 */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            ヒント例：暗号 <span className="text-blue-700 text-lg align-middle mx-1">{q.symbol}</span> の意味を考えてください
          </p>
          <div className="space-y-3">
            {q.examples.map((ex, i) => (
              <div key={i} className="flex items-center justify-center gap-3">
                <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                  <ShapeSVG shape={ex.input} size={40} />
                </div>
                <div className="text-gray-400 text-lg">→</div>
                <div className="w-10 h-10 bg-blue-700 text-white rounded-md flex items-center justify-center text-xl font-bold">
                  {q.symbol}
                </div>
                <div className="text-gray-400 text-lg">→</div>
                <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                  <ShapeSVG shape={ex.output} size={40} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 問題 */}
        <div className="bg-white border-2 border-blue-300 rounded-xl shadow-sm p-6 mb-6">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">
            問題
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
              <ShapeSVG shape={q.questionInput} size={48} />
            </div>
            <div className="text-gray-400 text-xl">→</div>
            <div className="w-12 h-12 bg-blue-700 text-white rounded-md flex items-center justify-center text-2xl font-bold">
              {q.symbol}
            </div>
            <div className="text-gray-400 text-xl">→</div>
            <div className="w-16 h-16 bg-blue-50 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center text-3xl font-bold text-blue-500">
              ?
            </div>
          </div>
        </div>

        {/* 5択 */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-8">
          {q.choices.map((choice, i) => (
            <ChoiceButton
              key={i}
              index={i}
              selected={selected === i}
              onClick={() => setSelected(i)}
              compact
            >
              <ShapeSVG
                shape={choice}
                size={42}
                color={selected === i ? "#ffffff" : "#111827"}
              />
            </ChoiceButton>
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
