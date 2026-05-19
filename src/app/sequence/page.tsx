"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateSequenceQuestions } from "@/lib/generators/sequence";
import { Timer } from "@/components/exam/Timer";
import { ProgressBar } from "@/components/exam/ProgressBar";
import { EXAM_QUESTION_COUNT, EXAM_TIME_LIMITS, ExamResult } from "@/types";

const COUNT = EXAM_QUESTION_COUNT.sequence;
const TIME = EXAM_TIME_LIMITS.sequence;

export default function SequencePage() {
  const router = useRouter();
  const [questions] = useState(() => generateSequenceQuestions(COUNT));
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ExamResult["answers"]>([]);
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [current]);

  const finish = useCallback(
    (finalResults: ExamResult["answers"]) => {
      if (finished) return;
      setFinished(true);
      const result: ExamResult = {
        type: "sequence",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = questions[current];
    const userAnswer = input.trim();
    const correct = parseInt(userAnswer, 10) === q.answer;
    const newResults = [...results, { question: q, userAnswer, correct }];

    if (current + 1 >= COUNT) {
      finish(newResults);
    } else {
      setResults(newResults);
      setCurrent((c) => c + 1);
      setInput("");
    }
  };

  const handleTimeUp = useCallback(() => finish(results), [finish, results]);

  const q = questions[current];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-400">法則性</h1>
          <Timer durationMs={TIME} onTimeUp={handleTimeUp} />
        </div>

        <ProgressBar current={current} total={COUNT} />

        <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-xl">
          <div className="flex items-center justify-center gap-4 text-3xl font-bold mb-4">
            {q.sequence.map((n, i) => (
              <span key={i}>{n}</span>
            ))}
            <span className="text-purple-400">□</span>
          </div>
          <p className="text-gray-400 text-sm">数列の□に入る数を答えてください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="答えを入力..."
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-center text-2xl focus:outline-none focus:border-purple-500 transition"
          />
          <button
            type="submit"
            disabled={input.trim() === ""}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition"
          >
            次へ →
          </button>
        </form>
      </div>
    </div>
  );
}
