import Link from "next/link";
import { EXAM_LABELS, EXAM_QUESTION_COUNT, EXAM_TIME_LIMITS, ExamType } from "@/types";

const EXAM_COLORS: Record<ExamType, string> = {
  arithmetic: "from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700",
  sequence: "from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700",
  command: "from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700",
  cipher: "from-green-600 to-green-800 hover:from-green-500 hover:to-green-700",
};

const EXAM_DESCS: Record<ExamType, string> = {
  arithmetic: "□ に入る数を答える四則演算の問題",
  sequence: "数列のパターンを見つけて次の数を答える",
  command: "記号の命令を順番に適用して最終値を求める",
  cipher: "記号と文字の対応表から暗号を解読する",
};

const exams: ExamType[] = ["arithmetic", "sequence", "command", "cipher"];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            CAB 練習ツール
          </h1>
          <p className="text-gray-400 text-sm">
            Computer Aptitude Battery — 就活Webテスト対策
          </p>
        </div>

        <div className="space-y-4">
          {exams.map((type) => {
            const minutes = EXAM_TIME_LIMITS[type] / 60000;
            const count = EXAM_QUESTION_COUNT[type];
            return (
              <Link key={type} href={`/${type}`}>
                <div
                  className={`bg-gradient-to-r ${EXAM_COLORS[type]} rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{EXAM_LABELS[type]}</h2>
                      <p className="text-white/70 text-sm mt-1">{EXAM_DESCS[type]}</p>
                    </div>
                    <div className="text-right text-sm text-white/60">
                      <div>{count}問</div>
                      <div>{minutes}分</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-gray-600 text-xs">
          ※ 問題はランダム生成されます。本番のCABとは異なる場合があります。
        </p>
      </div>
    </main>
  );
}
