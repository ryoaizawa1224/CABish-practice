"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateCommandQuestions } from "@/lib/generators/command";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ChoiceButton } from "@/components/exam/ChoiceButton";
import {
  EXAM_QUESTION_COUNT,
  EXAM_TIME_LIMITS,
  EXAM_LABELS,
  EXAM_DESCRIPTIONS,
  ExamResult,
  CommandRule,
} from "@/types";

const TYPE = "command";
const COUNT = EXAM_QUESTION_COUNT[TYPE];
const TIME = EXAM_TIME_LIMITS[TYPE];

const OP_LABEL: Record<CommandRule["operation"], string> = {
  add: "＋",
  sub: "－",
  mul: "×",
  div: "÷",
};

export default function CommandPage() {
  const router = useRouter();
  const [questions] = useState(() => generateCommandQuestions(COUNT));
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
          {/* 命令表 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              命令表
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {q.rules.map((rule) => (
                <div
                  key={rule.symbol}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"
                >
                  <div className="text-2xl mb-1">{rule.symbol}</div>
                  <div className="text-sm font-medium text-gray-600">
                    {OP_LABEL[rule.operation]}&thinsp;{rule.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 問題 */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">初期値</p>
                <div className="w-12 h-12 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-center justify-center text-xl font-bold text-blue-700">
                  {q.initialValue}
                </div>
              </div>
              <div className="text-gray-300 text-2xl">→</div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-2">命令列</p>
                <div className="flex gap-2 flex-wrap">
                  {q.steps.map((sym, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-center text-lg font-medium"
                    >
                      {sym}
                    </div>
                  ))}
                </div>
              </div>
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
