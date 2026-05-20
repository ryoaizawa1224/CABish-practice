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
  const answered = answers.filter((a) => a.userChoiceIndex !== null);

  const grade =
    pct >= 90 ? { label: "S", color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-300" }
    : pct >= 75 ? { label: "A", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-300" }
    : pct >= 60 ? { label: "B", color: "text-green-600", bg: "bg-green-50", border: "border-green-300" }
    : pct >= 40 ? { label: "C", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-300" }
    : { label: "D", color: "text-red-600", bg: "bg-red-50", border: "border-red-300" };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="text-xs font-bold text-white bg-blue-700 px-2.5 py-1 rounded">CAB</span>
          <span className="font-semibold text-gray-800">{EXAM_LABELS[type]} — 結果</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 py-10 space-y-5">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-xl border-2 ${grade.bg} ${grade.border} flex items-center justify-center`}>
              <span className={`text-4xl font-black ${grade.color}`}>{grade.label}</span>
            </div>

            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900">
                {correct}
                <span className="text-lg text-gray-400 font-normal ml-1">/ {total}問正解</span>
              </div>
              <div className="text-xl font-semibold text-gray-600 mt-0.5">
                正答率 {pct}%
              </div>
              <div className="text-sm text-gray-400 mt-1">
                所要時間: {minutes}分 {String(seconds).padStart(2, "0")}秒 ／ 回答数: {answered.length} / {total}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {wrong.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-3">
              間違えた問題
              <span className="ml-2 text-sm font-normal text-red-500">{wrong.length}問</span>
            </h2>
            <p className="text-xs text-gray-400 mb-2">
              ※ 詳細な振り返りは「もう一度」で再挑戦してください
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {answers.map((a, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center ${
                    a.correct
                      ? "bg-green-100 text-green-700"
                      : a.userChoiceIndex === null
                      ? "bg-gray-100 text-gray-400"
                      : "bg-red-100 text-red-700"
                  }`}
                  title={`問${i + 1}: ${
                    a.correct ? "正解" : a.userChoiceIndex === null ? "未回答" : "誤答"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

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
