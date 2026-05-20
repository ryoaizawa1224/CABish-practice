"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  generateCommandQuestions,
  commandLabel,
} from "@/lib/generators/command";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { ChoiceButton } from "@/components/exam/ChoiceButton";
import { ShapeSVG, ShapeGroupSVG } from "@/components/shapes/ShapeSVG";
import {
  EXAM_QUESTION_COUNT,
  EXAM_TIME_LIMITS,
  EXAM_LABELS,
  EXAM_DESCRIPTIONS,
  ExamResult,
} from "@/types";
import { Shape, shapesEqual } from "@/lib/shapes/types";

const TYPE = "command";
const COUNT = EXAM_QUESTION_COUNT[TYPE];
const TIME = EXAM_TIME_LIMITS[TYPE];

function shapeListsEqual(a: Shape[], b: Shape[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((s, i) => shapesEqual(s, b[i]));
}

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
    const correctChoiceIndex = q.choices.findIndex((c) => shapeListsEqual(c, q.answer));
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

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 space-y-5">
          {/* 命令表 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              命令表
            </p>
            <div className="grid grid-cols-2 gap-2">
              {q.commands.map((c, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-white border border-gray-300 rounded-md flex items-center justify-center text-lg flex-shrink-0">
                    {c.symbol}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {commandLabel(c.kind)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 初期図形 */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              初期の図形列
            </p>
            <div className="flex justify-center bg-blue-50 border-2 border-blue-200 rounded-lg p-3 gap-2">
              {q.initial.map((s, i) => (
                <ShapeSVG key={i} shape={s} size={44} />
              ))}
            </div>
          </div>

          {/* 命令の適用順 */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              命令を上から順に適用
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {q.commands.map((c, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-center text-lg font-medium"
                >
                  {c.symbol}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5択（縦に並べる：図形列が長くなりうる） */}
        <p className="text-sm text-gray-600 mb-3 font-medium">最終的な図形列はどれ？</p>
        <div className="space-y-2 mb-8">
          {q.choices.map((choice, i) => (
            <ChoiceButton
              key={i}
              index={i}
              selected={selected === i}
              onClick={() => setSelected(i)}
            >
              <ShapeGroupSVG
                shapes={choice}
                size={36}
                color={selected === i ? "#ffffff" : "#111827"}
                gap={4}
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
