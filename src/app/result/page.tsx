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
    if (!data) { router.push("/"); return; }
    setResult(JSON.parse(data));
  }, [router]);

  if (!result) return null;

  const { type, total, correct, timeTakenMs, answers } = result;
  const pct = Math.round((correct / total) * 100);
  const minutes = Math.floor(timeTakenMs / 60000);
  const seconds = Math.floor((timeTakenMs % 60000) / 1000);
  const wrong = answers.filter((a) => !a.correct);

  const grade =
    pct >= 90 ? { label: "S", color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-300" }
    : pct >= 75 ? { label: "A", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-300" }
    : pct >= 60 ? { label: "B", color: "text-green-600", bg: "bg-green-50", border: "border-green-300" }
    : pct >= 40 ? { label: "C", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-300" }
    : { label: "D", color: "text-red-600", bg: "bg-red-50", border: "border-red-300" };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="text-xs font-bold text-white bg-blue-700 px-2.5 py-1 rounded">CAB</span>
          <span className="font-semibold text-gray-800">{EXAM_LABELS[type]} — 結果</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 py-10 space-y-5">
        {/* スコアカード */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-6">
            {/* グレード */}
            <div className={`w-20 h-20 rounded-xl border-2 ${grade.bg} ${grade.border} flex items-center justify-center`}>
              <span className={`text-4xl font-black ${grade.color}`}>{grade.label}</span>
            </div>

            {/* スタッツ */}
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">
                {correct}
                <span className="text-lg text-gray-400 font-normal ml-1">/ {total}問正解</span>
              </div>
              <div className="text-xl font-semibold text-gray-600 mt-0.5">
                正答率 {pct}%
              </div>
              <div className="text-sm text-gray-400 mt-1">
                所要時間: {minutes}分 {String(seconds).padStart(2, "0")}秒
              </div>
            </div>
          </div>

          {/* スコアバー */}
          <div className="mt-6">
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 間違い一覧 */}
        {wrong.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              間違えた問題
              <span className="ml-2 text-sm font-normal text-red-500">{wrong.length}問</span>
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {wrong.map((a, i) => {
                const q = a.question;
                let display = "";
                if (q.type === "arithmetic") display = q.displayStr;
                else if (q.type === "sequence") display = `${q.sequence.join("  ")}  ?`;
                else if (q.type === "command") display = `初期値 ${q.initialValue} → [${q.steps.join("")}]`;
                else if (q.type === "cipher") display = q.encoded.join(" ");
                return (
                  <div key={i} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-4 py-2.5">
                    <span className="text-gray-700 font-mono">{display}</span>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <span className="text-red-400 line-through">{a.userAnswer || "未回答"}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-semibold">{q.answer}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="flex gap-3">
          <Link href={`/${type}`} className="flex-1">
            <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors">
              もう一度
            </button>
          </Link>
          <Link href="/" className="flex-1">
            <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors">
              テスト選択に戻る
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
