"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExamResult, EXAM_LABELS } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("cabResult");
    if (!data) {
      router.push("/");
      return;
    }
    setResult(JSON.parse(data));
  }, [router]);

  if (!result) return null;

  const { type, total, correct, timeTakenMs } = result;
  const pct = Math.round((correct / total) * 100);
  const minutes = Math.floor(timeTakenMs / 60000);
  const seconds = Math.floor((timeTakenMs % 60000) / 1000);

  const grade =
    pct >= 90 ? { label: "S", color: "text-yellow-400" }
    : pct >= 75 ? { label: "A", color: "text-blue-400" }
    : pct >= 60 ? { label: "B", color: "text-green-400" }
    : pct >= 40 ? { label: "C", color: "text-orange-400" }
    : { label: "D", color: "text-red-400" };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">{EXAM_LABELS[type]}</p>
          <h1 className="text-3xl font-extrabold">結果</h1>
        </div>

        {/* スコアカード */}
        <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-xl space-y-4">
          <div className={`text-8xl font-black ${grade.color}`}>{grade.label}</div>
          <div className="text-4xl font-bold">
            {correct} <span className="text-gray-500 text-2xl">/ {total}</span>
          </div>
          <div className="text-2xl font-semibold text-gray-300">{pct}%</div>
          <div className="text-gray-500 text-sm">
            所要時間: {minutes}分 {String(seconds).padStart(2, "0")}秒
          </div>
        </div>

        {/* 詳細（間違いリスト） */}
        {result.answers.filter((a) => !a.correct).length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="font-bold text-red-400 mb-3">
              間違えた問題 ({result.answers.filter((a) => !a.correct).length}問)
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {result.answers
                .filter((a) => !a.correct)
                .map((a, i) => {
                  const q = a.question;
                  let display = "";
                  if (q.type === "arithmetic") display = q.displayStr;
                  else if (q.type === "sequence")
                    display = `${q.sequence.join(", ")}, □`;
                  else if (q.type === "command")
                    display = `初期値${q.initialValue} → [${q.steps.join("")}]`;
                  else if (q.type === "cipher")
                    display = q.encoded.join(" ");
                  return (
                    <div
                      key={i}
                      className="text-sm bg-gray-700 rounded-lg px-3 py-2 flex justify-between"
                    >
                      <span className="text-gray-300">{display}</span>
                      <span>
                        <span className="text-red-400">{a.userAnswer || "未回答"}</span>
                        {" → "}
                        <span className="text-green-400">{q.answer}</span>
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="space-y-3">
          <Link href={`/${type}`}>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition">
              もう一度練習する
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition">
              トップへ戻る
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
