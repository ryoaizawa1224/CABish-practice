"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateSequenceQuestions } from "@/lib/generators/sequence";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ChoiceButton } from "@/components/exam/ChoiceButton";
import {
  EXAM_QUESTION_COUNT,
  EXAM_TIME_LIMITS,
  EXAM_LABELS,
  EXAM_DESCRIPTIONS,
  ExamResult,
} from "@/types";

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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-6">
          <p className="text-sm text-gray-400 mb-4">数列</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {q.sequence.map((n, i) => (
              <div
                key={i}
                className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-900"
              >
                {n}
              </div>
            ))}
            <div className="w-14 h-14 bg-blue-50 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center text-2xl font-bold text-blue-500">
              ?
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
