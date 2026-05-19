"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateCommandQuestions } from "@/lib/generators/command";
import { Timer } from "@/components/exam/Timer";
import { ProgressBar } from "@/components/exam/ProgressBar";
import { EXAM_QUESTION_COUNT, EXAM_TIME_LIMITS, ExamResult, CommandRule } from "@/types";

const COUNT = EXAM_QUESTION_COUNT.command;
const TIME = EXAM_TIME_LIMITS.command;

const OP_LABEL: Record<CommandRule["operation"], string> = {
  add: "+",
  sub: "-",
  mul: "×",
  div: "÷",
};

export default function CommandPage() {
  const router = useRouter();
  const [questions] = useState(() => generateCommandQuestions(COUNT));
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
        type: "command",
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
          <h1 className="text-xl font-bold text-orange-400">命令表</h1>
          <Timer durationMs={TIME} onTimeUp={handleTimeUp} />
        </div>

        <ProgressBar current={current} total={COUNT} />

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          {/* ルール表 */}
          <div>
            <p className="text-sm text-gray-400 mb-2">命令表</p>
            <div className="grid grid-cols-2 gap-2">
              {q.rules.map((rule) => (
                <div
                  key={rule.symbol}
                  className="bg-gray-700 rounded-lg px-3 py-2 flex items-center justify-between text-sm"
                >
                  <span className="text-2xl">{rule.symbol}</span>
                  <span className="text-gray-300">
                    {OP_LABEL[rule.operation]} {rule.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 問題 */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-1">初期値: <span className="text-white font-bold text-lg">{q.initialValue}</span></p>
            <p className="text-sm text-gray-400 mb-2">命令列:</p>
            <div className="flex gap-2 flex-wrap">
              {q.steps.map((sym, i) => (
                <span
                  key={i}
                  className="bg-orange-900/40 border border-orange-700 rounded-lg w-10 h-10 flex items-center justify-center text-xl"
                >
                  {sym}
                </span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="最終的な値を入力..."
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-center text-2xl focus:outline-none focus:border-orange-500 transition"
          />
          <button
            type="submit"
            disabled={input.trim() === ""}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition"
          >
            次へ →
          </button>
        </form>
      </div>
    </div>
  );
}
