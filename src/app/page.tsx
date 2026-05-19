import Link from "next/link";
import {
  EXAM_LABELS,
  EXAM_QUESTION_COUNT,
  EXAM_TIME_LIMITS,
  EXAM_DESCRIPTIONS,
  ExamType,
} from "@/types";

const exams: ExamType[] = ["arithmetic", "sequence", "command", "cipher"];

const EXAM_ICONS: Record<ExamType, string> = {
  arithmetic: "＋",
  sequence:   "…",
  command:    "▲",
  cipher:     "★",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="text-xs font-bold text-white bg-blue-700 px-2.5 py-1 rounded">
            CAB
          </span>
          <span className="font-semibold text-gray-800">練習ツール</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        {/* タイトル */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            テスト選択
          </h1>
          <p className="text-sm text-gray-500">
            練習したい科目を選んでください。問題はランダムに生成されます。
          </p>
        </div>

        {/* テスト一覧 */}
        <div className="space-y-3">
          {exams.map((type) => {
            const minutes = EXAM_TIME_LIMITS[type] / 60000;
            const count = EXAM_QUESTION_COUNT[type];
            return (
              <Link key={type} href={`/${type}`}>
                <div className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md rounded-xl p-5 cursor-pointer transition-all duration-150 flex items-center gap-5">
                  {/* アイコン */}
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl text-blue-600 font-bold flex-shrink-0">
                    {EXAM_ICONS[type]}
                  </div>

                  {/* テキスト */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">
                      {EXAM_LABELS[type]}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5 truncate">
                      {EXAM_DESCRIPTIONS[type]}
                    </div>
                  </div>

                  {/* バッジ */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {count}問
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {minutes}分
                    </span>
                  </div>

                  <span className="text-gray-300 text-lg ml-1">›</span>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          ※ 問題はランダム生成です。本番のCABと完全に同一ではありません。
        </p>
      </main>
    </div>
  );
}
