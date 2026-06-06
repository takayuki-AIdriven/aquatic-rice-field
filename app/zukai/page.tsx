import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Noto_Sans_JP } from "next/font/google";
import { GreenhousePhaseDiagram } from "@/components/farm-report/GreenhousePhaseDiagram";
import { buildZukaiReportMarkdown } from "@/lib/zukai-report-markdown";
import { CopyMarkdownButton } from "./CopyMarkdownButton";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "図解レポート｜令和8年産 現場統合レポート",
  description:
    "AI-Driven School 月次課題提出用 · 自作ツール図解レポート（水稲育苗・長岡ロジック）",
};

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export default function ZukaiReportPage() {
  const baseUrl = getBaseUrl();
  const reportUrl = `${baseUrl}/zukai`;
  const toolUrl = baseUrl;
  const markdown = buildZukaiReportMarkdown(baseUrl);

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 antialiased ${notoSansJP.className} ${ibmPlexMono.variable}`}
    >
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="mb-10 rounded-2xl border border-indigo-200/80 bg-white p-6 shadow-md ring-1 ring-slate-900/[0.03] sm:p-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
            AI-Driven School · 月次課題 · 図解URL
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            自作ツール図解レポート
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            令和8年産 現場統合レポート（キヌヒカリ育苗 · 長岡農業普及指導センターロジック）
          </p>

          <div className="mt-6 space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                提出用・図解URL（このページ）
              </span>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-indigo-800">
                {reportUrl}
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                本番ツールURL
              </span>
              <p className="mt-1 break-all font-mono text-sm text-slate-800">
                <Link href="/" className="text-sky-700 underline-offset-2 hover:underline">
                  {toolUrl}
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <CopyMarkdownButton markdown={markdown} />
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 font-mono text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              本番ダッシュボードを開く →
            </Link>
          </div>
        </header>

        <article className="space-y-10">
          <section id="zukai-section-1" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">
              1. ツールの画面キャプチャ
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              最新の「令和8年産
              現場統合レポート」は、白・薄ベージュ基調の近未来的ダッシュボード上に、リアルタイム天候・AI現場指令・育苗ハウス断面図（CSS）・苗箱配置・品種進捗を一体表示しています。以下は本番UIと同一デザインコードの断面図パーツです。
            </p>

            <div className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 shadow-inner">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="ml-2 font-mono text-[10px] text-slate-500">
                  令和8年産 現場統合レポート — 温度・換気指令（抜粋）
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="mb-3 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50/90 to-white px-3 py-2">
                  <p className="text-xs font-bold text-orange-950">本日の温度・換気指令</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-600">
                    緑化期管理帯 · Open-Meteo 連携 · 長岡マニュアル準拠
                  </p>
                </div>
                <GreenhousePhaseDiagram className="mt-0" />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              ※ フル画面は{" "}
              <Link href="/" className="text-sky-700 underline">
                本番ツール
              </Link>
              で確認（天候API・時計・潅水指令・追肥アラート含む）。
            </p>
          </section>

          <section id="zukai-section-2" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">
              2. ツールで解決する課題
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              配布された一般的な「採用管理」のひな型を Next.js 環境へ完全移植し、水稲栽培（キヌヒカリ）の実業現場に特化した
              <strong> 現場統合レポート </strong>
              へとコンポーネント化しました。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              外部のリアルタイム天気 API（Open-Meteo）から取得した気象データと、ダミーデータだった現場の「AI現場指令パネル」の数値を同期させ、現場管理における
              <strong> ロジックの矛盾（ギャップ）</strong>
              — 天候と現場指令が噛み合わない問題を解決しました。
            </p>
          </section>

          <section id="zukai-section-3" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">
              3. 工夫したポイント
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                気象 API のリアルタイム気温・天候をトリガーに、普及マニュアル準拠の
                <strong>緑化期（昼20〜25℃／夜15〜18℃）</strong>・
                <strong>硬化期（昼15〜20℃／夜10℃以上）</strong>の換気・温度管理指令を構築
              </li>
              <li>
                <strong>30℃超</strong>でヤケ苗危険・側面換気口開放を明示するプロ仕様判定の骨組み
              </li>
              <li>午前10時までのかん水徹底、プール育苗・硬化期の水位管理、移植前日落水</li>
              <li>
                田植え直前の<strong>移植前追肥（弁当肥）</strong>アラートを新設（4〜5日前・1.8葉期・施用後かん水必須）
              </li>
              <li>Tailwind CSS 図形のみでハウス断面をインライン図解化し、近未来UIと1次情報を調和</li>
            </ul>
          </section>

          <section id="zukai-section-4" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">
              4. 苦戦したポイント（デザインの葛藤）
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              Next.js 移植や API 連携は AI を道具としてスムーズに完結できましたが、最も試行錯誤したのは
              <strong> UI/UX のデザイン設計 </strong>
              です。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              配布ひな型の近未来的トーン＆マナーをミリ単位で維持しながら、水稲栽培の1次情報やハウス断面図イラストを Tailwind
              CSS の図形で美しくインライン調和・マージするレイアウト構成に最も頭を悩ませました。
            </p>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
            <h2 className="text-base font-bold text-slate-900">技術スタック</h2>
            <p className="mt-2 font-mono text-xs text-slate-600">
              Next.js 16 · React 19 · Tailwind CSS v4 · Open-Meteo · next/font
            </p>
          </section>
        </article>

        <footer className="mt-8 text-center font-mono text-[10px] text-slate-500">
          図解レポート · {reportUrl}
        </footer>
      </div>
    </div>
  );
}
