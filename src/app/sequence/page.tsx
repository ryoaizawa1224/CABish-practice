"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateSequenceQuestions } from "@/lib/generators/sequence";
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

const TYPE = "sequence";
const COUNT = EXAM_QUESTION_COUNT[TYPE];
const TIME = EXAM_TIME_LIMITS[TYPE];

export default function SequencePage() {
  const router = useRouter();
  const [questions] = useState(() => generateSequenceQuestions(COUNT));
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

        {/* 問題カード: 5つの図形 + ? */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {q.shapes.map((s, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center"
              >
                <ShapeSVG shape={s} size={44} />
              </div>
            ))}
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
