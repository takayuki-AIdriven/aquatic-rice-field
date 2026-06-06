"use client";

import { useEffect, useState } from "react";
import { IBM_Plex_Mono, Noto_Sans_JP } from "next/font/google";
import { GreenhousePhaseDiagram } from "@/components/farm-report/GreenhousePhaseDiagram";

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

const RYUO_LAT = 35.0858;
const RYUO_LON = 136.0354;
const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${RYUO_LAT}&longitude=${RYUO_LON}&timezone=Asia%2FTokyo&wind_speed_unit=ms&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m`;

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

const WEATHER_TABLE: Record<number, [string, string]> = {
  0: ["☀️", "快晴"],
  1: ["🌤️", "概ね晴れ"],
  2: ["⛅", "一部曇り"],
  3: ["☁️", "曇り"],
  45: ["🌫️", "霧"],
  48: ["🌫️", "霧氷"],
  51: ["🌦️", "弱い霧雨"],
  53: ["🌦️", "中程度の霧雨"],
  55: ["🌦️", "濃い霧雨"],
  56: ["🌧️", "弱い凍雨"],
  57: ["🌧️", "強い凍雨"],
  61: ["🌧️", "小雨"],
  63: ["🌧️", "雨"],
  65: ["🌧️", "大雨"],
  66: ["🌨️", "弱い凍結性降雨"],
  67: ["🌨️", "強い凍結性降雨"],
  71: ["🌨️", "弱い雪"],
  73: ["🌨️", "雪"],
  75: ["❄️", "大雪"],
  77: ["🌨️", "霧雪"],
  80: ["🌧️", "小雨・雷雨"],
  81: ["🌧️", "雨・雷雨"],
  82: ["🌧️", "強い雨・雷雨"],
  85: ["🌨️", "にわか雪"],
  86: ["🌨️", "大雪"],
  95: ["⛈️", "雷"],
  96: ["⛈️", "雷・小さな雹"],
  99: ["⛈️", "雷・大きな雹"],
};

function pad(n: number) {
  return (n < 10 ? "0" : "") + n;
}

function getWeatherIconAndDesc(code: number): [string, string] {
  return WEATHER_TABLE[code] ?? ["❓", "不明"];
}

function windDegToDirection(deg: number | null | undefined) {
  if (deg == null || Number.isNaN(deg)) return "—";
  const dirs = [
    "北",
    "北北東",
    "北東",
    "東北東",
    "東",
    "東南東",
    "南東",
    "南南東",
    "南",
    "南南西",
    "南西",
    "西南西",
    "西",
    "西北西",
    "北西",
    "北北西",
  ];
  const ix = Math.floor(((Number(deg) + 11.25) % 360) / 22.5);
  return dirs[ix];
}

function fmtTemp(v: number | null | undefined) {
  if (v == null || Number.isNaN(v)) return "—";
  return (Math.round(Number(v) * 10) / 10).toFixed(1);
}

type WeatherState = {
  icon: string | null;
  condition: string;
  humidity: string;
  wind: string;
  temperature: string;
  feels: string;
};

const INITIAL_WEATHER: WeatherState = {
  icon: null,
  condition: "",
  humidity: "",
  wind: "",
  temperature: "",
  feels: "",
};

const NURSERY_TRAYS: {
  id: string;
  label: string;
  sub: string;
  className: string;
  title?: string;
}[] = [
  { id: "tray-KIN-A1", label: "KIN-A1", sub: "×18", title: "キヌヒカリ A列", className: "group relative flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm ring-1 ring-amber-100" },
  { id: "tray-KIN-A2", label: "KIN-A2", sub: "×18", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/90" },
  { id: "tray-KOS-B1", label: "KOS-B1", sub: "×15", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50" },
  { id: "tray-KOS-B2", label: "KOS-B2", sub: "×15", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50/80" },
  { id: "tray-MIZ-C1", label: "MIZ-C1", sub: "×14", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50" },
  { id: "tray-MIZ-C2", label: "MIZ-C2", sub: "×14", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50/80" },
  { id: "tray-KIN-A3", label: "KIN-A3", sub: "×18", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/80" },
  { id: "tray-KIN-A4", label: "KIN-A4", sub: "×18", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/70" },
  { id: "tray-KIN-B1", label: "KIN-B1", sub: "×18", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-gradient-to-br from-amber-50 to-white" },
  { id: "tray-KIN-B2", label: "KIN-B2", sub: "×18", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/80" },
  { id: "tray-KOS-C1", label: "KOS-C1", sub: "×15", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50/80" },
  { id: "tray-KOS-C2", label: "KOS-C2", sub: "×15", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50/70" },
  { id: "tray-MIZ-D1", label: "MIZ-D1", sub: "×14", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50/80" },
  { id: "tray-MIZ-D2", label: "MIZ-D2", sub: "×14", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50/70" },
  { id: "tray-RSV-01", label: "RSV", sub: "予備", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-white" },
  { id: "tray-RSV-02", label: "RSV", sub: "予備", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-white" },
  { id: "tray-KIN-C1", label: "KIN-C1", sub: "主力帯", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm ring-1 ring-amber-100" },
  { id: "tray-KIN-C2", label: "KIN-C2", sub: "主力帯", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/90" },
  { id: "tray-KOS-D1", label: "KOS-D1", sub: "×15", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50" },
  { id: "tray-KOS-D2", label: "KOS-D2", sub: "×15", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50/80" },
  { id: "tray-MIZ-E1", label: "MIZ-E1", sub: "×14", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50" },
  { id: "tray-MIZ-E2", label: "MIZ-E2", sub: "×14", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50/80" },
  { id: "tray-KIN-C3", label: "KIN-C3", sub: "×18", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/80" },
  { id: "tray-KIN-C4", label: "KIN-C4", sub: "×18", className: "flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/70" },
];

const FARM_REPORT_STYLES = `
  .farm-report {
    font-feature-settings: "palt" 1;
    --color-rice: #22c55e;
    --color-rice-muted: #15803d;
    --color-water: #38bdf8;
    --color-water-muted: #0369a1;
    --color-harvest: #fbbf24;
    --color-harvest-deep: #d97706;
    --color-kinu: #f59e0b;
    --color-kinu-glow: rgba(245, 158, 11, 0.25);
  }
  .farm-report .font-mono {
    font-family: var(--font-ibm-plex-mono), ui-monospace, monospace;
  }
  .farm-report.grain::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; opacity: 0.022;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .farm-report .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
  .farm-report .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.35); border-radius: 9999px; }
  .farm-report .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
`;

type Tray = {
  id: string;
  label: string;
  sub: string;
  className: string;
  title?: string;
};

function labelColor(label: string) {
  if (label.startsWith("KIN")) return "text-amber-900";
  if (label.startsWith("KOS")) return "text-emerald-800";
  if (label.startsWith("MIZ")) return "text-sky-800";
  return "text-slate-500";
}

function PhaseRow({
  id,
  thumbId,
  badgeId,
  badgeClass,
  thumbBorder,
  thumbBg,
  placeholder,
  titleId,
  title,
  dateId,
  date,
  descId,
  desc,
  labelId,
  pctId,
  pct,
  pctColor,
  barId,
  fillId,
  fillWidth,
  fillGradient,
}: {
  id: string;
  thumbId: string;
  badgeId: string;
  badgeClass: string;
  thumbBorder: string;
  thumbBg: string;
  placeholder: string;
  titleId: string;
  title: string;
  dateId: string;
  date: string;
  descId: string;
  desc: string;
  labelId: string;
  pctId: string;
  pct: string;
  pctColor: string;
  barId: string;
  fillId: string;
  fillWidth: string;
  fillGradient: string;
}) {
  return (
    <div id={id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
      <div id={thumbId} className={`relative h-40 w-full shrink-0 overflow-hidden rounded-xl border ${thumbBorder} ${thumbBg} sm:h-36 sm:w-52`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${placeholder === "現場写真スロット" ? "from-emerald-100/90 via-slate-50 to-white" : placeholder === "キヌ主力帯" ? "from-amber-100/90 via-orange-50/80 to-white" : "from-sky-100/90 via-slate-50 to-white"}`} aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <span className={`text-xs ${placeholder === "キヌ主力帯" ? "text-amber-800/70" : placeholder === "圃場・水面" ? "text-sky-800/60" : "text-slate-500"}`}>{placeholder}</span>
        </div>
        <span id={badgeId} className={`absolute left-2 top-2 rounded px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-sm ${badgeClass}`}>
          {id === "phase-seed" ? "PH-01" : id === "phase-nursery" ? "PH-02" : "PH-03"}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id={titleId} className="font-semibold text-slate-900">{title}</h3>
          <span id={dateId} className="font-mono text-xs text-slate-500">{date}</span>
        </div>
        <p id={descId} className="mt-1 text-sm text-slate-600">{desc}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span id={labelId} className="text-slate-500">フェーズ進捗</span>
            <span id={pctId} className={`font-mono font-medium ${pctColor}`}>{pct}</span>
          </div>
          <div id={barId} className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
            <div id={fillId} className={`h-[100%] ${fillWidth} rounded-full bg-gradient-to-r ${fillGradient} ${id === "phase-nursery" ? "shadow-sm" : ""}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FarmReportColumns({ trays }: { trays: Tray[] }) {
  const rowA = trays.slice(0, 8);
  const rowB = trays.slice(8, 16);
  const rowD = trays.slice(16);

  return (
    <>
      <section id="column-visual" className="space-y-6 xl:col-span-7">
        <article id="nursery-map-panel" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 id="nursery-map-heading" className="text-lg font-semibold text-slate-900">令和8年産 水稲苗箱配置図（詳細）</h2>
              <p id="nursery-map-caption" className="mt-0.5 text-xs text-slate-500">ハウス内育苗 · 手書き配置の意図をデジタルで精緻化 · 各ブロックに品種IDを付与</p>
            </div>
            <div id="nursery-map-legend" className="flex flex-wrap gap-2 font-mono text-[10px]">
              <span id="legend-kinu" className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900">KIN — キヌヒカリ</span>
              <span id="legend-koshi" className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-900">KOS — コシヒカリ</span>
              <span id="legend-mizu" className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-sky-900">MIZ — みずかがみ</span>
              <span id="legend-empty" className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">— 予備・通路</span>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div id="nursery-layout" className="scrollbar-thin relative overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
              <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <span>入口（西）</span>
                <span>ハウス長手 24m</span>
                <span>東側 給水</span>
              </div>
              <div className="grid min-w-[520px] grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-12">
                {rowA.map((tray) => (
                  <div key={tray.id} id={tray.id} className={tray.className} title={tray.title}>
                    <span className={`font-mono text-[9px] ${labelColor(tray.label)}`}>{tray.label}</span>
                    <span className="text-[8px] text-slate-500">{tray.sub}</span>
                  </div>
                ))}
                {rowB.map((tray) => (
                  <div key={tray.id} id={tray.id} className={tray.className} title={tray.title}>
                    <span className={`font-mono text-[9px] ${labelColor(tray.label)}`}>{tray.label}</span>
                    <span className="text-[8px] text-slate-500">{tray.sub}</span>
                  </div>
                ))}
                <div id="tray-aisle-N" className="col-span-12 my-1 flex items-center justify-center rounded border border-slate-200 bg-slate-100 py-1.5 font-mono text-[9px] text-slate-600">
                  作業通路 · 灌水・夜間加温ライン
                </div>
                {rowD.map((tray) => (
                  <div key={tray.id} id={tray.id} className={tray.className} title={tray.title}>
                    <span className={`font-mono text-[9px] ${labelColor(tray.label)}`}>{tray.label}</span>
                    <span className="text-[8px] text-slate-500">{tray.sub}</span>
                  </div>
                ))}
              </div>
              <p id="nursery-map-note" className="mt-4 text-center text-[11px] leading-relaxed text-slate-600">
                <span className="font-semibold text-amber-700">KIN</span> は鮒寿司ブランドの中核品種として西側高温部に偏在配置。
                <span className="font-semibold text-emerald-700"> KOS</span> は中温安定帯、<span className="font-semibold text-sky-700"> MIZ</span> は東側加湿に強い。
              </p>
            </div>
          </div>
        </article>

        <article id="visual-log-panel" className="rounded-2xl border border-slate-200 bg-white shadow-md">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 id="visual-log-heading" className="text-lg font-semibold text-slate-900">作業工程ビジュアルログ</h2>
            <p id="visual-log-caption" className="mt-0.5 text-xs text-slate-500">フェーズごとの現場記録 · 進捗と証跡を一枚に統合</p>
          </div>
          <div id="visual-log-list" className="divide-y divide-slate-100">
            <PhaseRow id="phase-seed" thumbId="phase-seed-thumb" badgeId="phase-seed-badge" badgeClass="bg-emerald-600" thumbBorder="border-slate-200" thumbBg="bg-slate-50" placeholder="現場写真スロット" titleId="phase-seed-title" title="浸種・催芽" dateId="phase-seed-date" date="2026-04-02 — 04-05" descId="phase-seed-desc" desc="品種別浸漬時間の微調整。キヌ帯は発熱監視ログを別紙連携済み。" labelId="phase-seed-label" pctId="phase-seed-pct" pct="100%" pctColor="text-emerald-600" barId="phase-seed-bar" fillId="phase-seed-bar-fill" fillWidth="w-full" fillGradient="from-emerald-600 to-emerald-400" />
            <PhaseRow id="phase-nursery" thumbId="phase-nursery-thumb" badgeId="phase-nursery-badge" badgeClass="bg-amber-500" thumbBorder="border-amber-200" thumbBg="bg-amber-50/50" placeholder="キヌ主力帯" titleId="phase-nursery-title" title="育苗ハウス配置・潅水校正" dateId="phase-nursery-date" date="2026-04-06 — 04-12" descId="phase-nursery-desc" desc="配置図に沿った再配置と、ゾーン別潅水量の校正。KIN-C 帯は黄金色ライン監査対象。" labelId="phase-nursery-label" pctId="phase-nursery-pct" pct="86%" pctColor="text-amber-600" barId="phase-nursery-bar" fillId="phase-nursery-bar-fill" fillWidth="w-[86%]" fillGradient="from-amber-600 to-amber-400" />
            <PhaseRow id="phase-field" thumbId="phase-field-thumb" badgeId="phase-field-badge" badgeClass="bg-sky-600" thumbBorder="border-sky-200" thumbBg="bg-sky-50/50" placeholder="圃場・水面" titleId="phase-field-title" title="寄せ植え・本田準備" dateId="phase-field-date" date="2026-04-14 —" descId="phase-field-desc" desc="水管理と同時進行で、法務・減収リスクアラートと連動させる。" labelId="phase-field-label" pctId="phase-field-pct" pct="34%" pctColor="text-sky-600" barId="phase-field-bar" fillId="phase-field-bar-fill" fillWidth="w-[34%]" fillGradient="from-sky-600 to-sky-400" />
          </div>
        </article>
      </section>

      <aside id="column-data" className="space-y-6 xl:col-span-5">
        <VarietyProgressPanel />
        <RiskCenterPanel />
        <AiInsightsPanel />
      </aside>
    </>
  );
}

function VarietyProgressPanel() {
  return (
    <article id="variety-progress-panel" className="rounded-2xl border border-slate-200 bg-white shadow-md">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 id="variety-progress-heading" className="text-lg font-semibold text-slate-900">令和8年 品種別作付進捗</h2>
        <p id="variety-progress-caption" className="mt-0.5 text-xs text-slate-500">作付台帳連携プレビュー · 相対比率は面積ベース</p>
      </div>
      <div id="variety-progress-list" className="space-y-5 p-5 sm:p-6">
        <div id="variety-card-kinu" className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-4 shadow-sm ring-1 ring-amber-100">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-200/40 blur-2xl" aria-hidden="true" />
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p id="variety-kinu-name" className="text-lg font-bold text-amber-950">キヌヒカリ</p>
              <p id="variety-kinu-role" className="mt-0.5 text-xs text-amber-800/80">ブランド中核 · 鮒寿司の命</p>
            </div>
            <span id="variety-kinu-priority" className="shrink-0 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-amber-900">Priority A</span>
          </div>
          <dl id="variety-kinu-stats" className="mt-4 grid grid-cols-3 gap-3 text-center sm:gap-4">
            <div id="kinu-stat-area" className="rounded-lg border border-amber-100 bg-white/80 px-2 py-2 shadow-sm">
              <dt className="font-mono text-[10px] uppercase text-slate-500">面積</dt>
              <dd id="kinu-value-area" className="font-mono text-lg font-semibold tabular-nums text-slate-900">135.3<span className="text-sm font-normal text-slate-500">a</span></dd>
            </div>
            <div id="kinu-stat-tray" className="rounded-lg border border-amber-100 bg-white/80 px-2 py-2 shadow-sm">
              <dt className="font-mono text-[10px] uppercase text-slate-500">苗箱</dt>
              <dd id="kinu-value-tray" className="font-mono text-lg font-semibold tabular-nums text-amber-800">245<span className="text-sm font-normal text-slate-500">箱</span></dd>
            </div>
            <div id="kinu-stat-bags" className="rounded-lg border border-amber-100 bg-white/80 px-2 py-2 shadow-sm">
              <dt className="font-mono text-[10px] uppercase text-slate-500">見込</dt>
              <dd id="kinu-value-bags" className="font-mono text-lg font-semibold tabular-nums text-amber-700">203<span className="text-sm font-normal text-slate-500">袋</span></dd>
            </div>
          </dl>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span id="kinu-progress-label" className="text-slate-500">作付進捗（面積基準）</span>
              <span id="kinu-progress-pct" className="font-mono text-amber-700">92%</span>
            </div>
            <div id="kinu-progress-track" className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200 ring-1 ring-amber-200/60">
              <div id="kinu-progress" className="h-full w-[92%] rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 shadow-sm" />
            </div>
          </div>
        </div>

        <VarietyCard id="variety-card-koshi" nameId="variety-koshi-name" name="コシヒカリ" nameClass="text-emerald-900" tagId="variety-koshi-tag" tag="安定品目" statsId="variety-koshi-stats" areaId="koshi-value-area" area="112.2a" trayId="koshi-value-tray" tray="203箱" trayClass="text-emerald-700" bagsId="koshi-value-bags" bags="168袋" bagsClass="text-emerald-800" labelId="koshi-progress-label" pctId="koshi-progress-pct" pct="78%" pctClass="text-emerald-600" trackId="koshi-progress-track" progressId="koshi-progress" width="w-[78%]" gradient="from-emerald-600 to-emerald-400" border="border-emerald-200" bg="bg-emerald-50/30" />
        <VarietyCard id="variety-card-mizu" nameId="variety-mizu-name" name="みずかがみ" nameClass="text-sky-900" tagId="variety-mizu-tag" tag="水熱適応" statsId="variety-mizu-stats" areaId="mizu-value-area" area="103.8a" trayId="mizu-value-tray" tray="189箱" trayClass="text-sky-700" bagsId="mizu-value-bags" bags="156袋" bagsClass="text-sky-800" labelId="mizu-progress-label" pctId="mizu-progress-pct" pct="71%" pctClass="text-sky-600" trackId="mizu-progress-track" progressId="mizu-progress" width="w-[71%]" gradient="from-sky-600 to-sky-400" border="border-sky-200" bg="bg-sky-50/30" />

        <div id="variety-mix-chart" className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <p id="variety-mix-heading" className="font-mono text-[10px] uppercase tracking-wider text-slate-500">品種構成比（面積）</p>
          <div id="variety-mix-bar" className="mt-3 flex h-4 w-full overflow-hidden rounded-full ring-1 ring-slate-200">
            <div id="mix-segment-kinu" className="bg-gradient-to-b from-amber-500 to-amber-600" style={{ width: "38.5%" }} title="キヌヒカリ" />
            <div id="mix-segment-koshi" className="bg-gradient-to-b from-emerald-600 to-emerald-500" style={{ width: "31.9%" }} title="コシヒカリ" />
            <div id="mix-segment-mizu" className="bg-gradient-to-b from-sky-600 to-sky-500" style={{ width: "29.6%" }} title="みずかがみ" />
          </div>
          <ul id="variety-mix-legend" className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] text-slate-600">
            <li id="mix-legend-kinu"><span className="text-amber-600">■</span> キヌ 38.5%</li>
            <li id="mix-legend-koshi"><span className="text-emerald-600">■</span> コシ 31.9%</li>
            <li id="mix-legend-mizu"><span className="text-sky-600">■</span> みず 29.6%</li>
          </ul>
        </div>
      </div>
    </article>
  );
}

function VarietyCard(props: {
  id: string;
  nameId: string;
  name: string;
  nameClass: string;
  tagId: string;
  tag: string;
  statsId: string;
  areaId: string;
  area: string;
  trayId: string;
  tray: string;
  trayClass: string;
  bagsId: string;
  bags: string;
  bagsClass: string;
  labelId: string;
  pctId: string;
  pct: string;
  pctClass: string;
  trackId: string;
  progressId: string;
  width: string;
  gradient: string;
  border: string;
  bg: string;
}) {
  return (
    <div id={props.id} className={`rounded-xl border ${props.border} ${props.bg} p-4 shadow-sm`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p id={props.nameId} className={`font-semibold ${props.nameClass}`}>{props.name}</p>
        <span id={props.tagId} className="font-mono text-[10px] text-slate-500">{props.tag}</span>
      </div>
      <dl id={props.statsId} className="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
        <div><span className="font-mono text-slate-500">面積</span><br /><span id={props.areaId} className="font-mono font-semibold text-slate-900">{props.area}</span></div>
        <div><span className="font-mono text-slate-500">苗箱</span><br /><span id={props.trayId} className={`font-mono font-semibold ${props.trayClass}`}>{props.tray}</span></div>
        <div><span className="font-mono text-slate-500">見込</span><br /><span id={props.bagsId} className={`font-mono font-semibold ${props.bagsClass}`}>{props.bags}</span></div>
      </dl>
      <div className="mt-4">
        <div className="flex justify-between text-xs">
          <span id={props.labelId} className="text-slate-500">作付進捗</span>
          <span id={props.pctId} className={`font-mono ${props.pctClass}`}>{props.pct}</span>
        </div>
        <div id={props.trackId} className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div id={props.progressId} className={`h-full ${props.width} rounded-full bg-gradient-to-r ${props.gradient}`} />
        </div>
      </div>
    </div>
  );
}

function RiskCenterPanel() {
  const alerts = [
    { id: "risk-alert-legal", severityId: "risk-alert-legal-severity", severity: "Legal", severityClass: "bg-red-100 text-red-800", iconBg: "bg-red-100 text-red-600", titleId: "risk-alert-legal-title", title: "用水関連の定期届出 · 期限 proximity", descId: "risk-alert-legal-desc", desc: "管轄へ提出済み書類の写しと、圃場GISポリゴンの整合が未確認。水路上の重複表記を今週中に是正。", metaId: "risk-alert-legal-meta", meta: "Due: 2026-04-25 · Owner: 管理課", icon: "warning" as const },
    { id: "risk-alert-admin", severityId: "risk-alert-admin-severity", severity: "Admin", severityClass: "bg-amber-100 text-amber-900", iconBg: "bg-amber-100 text-amber-700", titleId: "risk-alert-admin-title", title: "JA出荷カレンダーと育苗計画のズレ", descId: "risk-alert-admin-desc", desc: "みずかがみ寄せ植え開始が行政サンプル採取日と隣接。調整しないと検体の代表値がブレる。", metaId: "risk-alert-admin-meta", meta: "連携先: JA品質管理 · 要MTG", icon: "doc" as const },
    { id: "risk-alert-business", severityId: "risk-alert-business-severity", severity: "Biz", severityClass: "bg-sky-100 text-sky-800", iconBg: "bg-sky-100 text-sky-600", titleId: "risk-alert-business-title", title: "鮒寿司向けキヌの「袋数」見通しギャップ", descId: "risk-alert-business-desc", desc: "見込203袋に対し、プレミアム契約需要が+7%推移。単価防衛のため中食向けアロケーションを再計算。", metaId: "risk-alert-business-meta", meta: "Sensitivity: High · KPI: 袋あたり粗利", icon: "chart" as const },
  ];

  return (
    <article id="risk-center-panel" className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50/80 to-white shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-100 px-5 py-4 sm:px-6">
        <div>
          <h2 id="risk-center-heading" className="text-lg font-semibold text-slate-900">リスク管理センター</h2>
          <p id="risk-center-caption" className="mt-0.5 text-xs text-slate-500">法務 · 行政 · 経営アラート의 統合ビュー</p>
        </div>
        <span id="risk-center-count" className="rounded-full bg-red-100 px-3 py-1 font-mono text-xs font-semibold text-red-800 ring-1 ring-red-200">Open 3</span>
      </div>
      <ul id="risk-alert-list" className="divide-y divide-slate-100">
        {alerts.map((a) => (
          <li key={a.id} id={a.id} className="flex gap-4 p-5 sm:p-6">
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.iconBg}`} aria-hidden="true">
              {a.icon === "warning" && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              {a.icon === "doc" && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              {a.icon === "chart" && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span id={a.severityId} className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${a.severityClass}`}>{a.severity}</span>
                <h3 id={a.titleId} className="font-medium text-slate-900">{a.title}</h3>
              </div>
              <p id={a.descId} className="mt-1 text-sm text-slate-600">{a.desc}</p>
              <p id={a.metaId} className="mt-2 font-mono text-[10px] text-slate-500">{a.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

function AiInsightsPanel() {
  const actions = [
    { id: "ai-action-01", rankId: "ai-action-01-rank", rank: "01", titleId: "ai-action-01-title", title: "KIN-C 帯の夜間最低温度が設定より -1.2°C", bodyId: "ai-action-01-body", body: "22:00–02:00 に加温が弱まるパターンを検知。設定のヒステリシスを 0.6°C に、または西ブロックのみ短時間サイクルに変更。", metaId: "ai-action-01-meta", meta: "Impact: 発葉ばらつき · Confidence 0.84", padding: "pb-5" },
    { id: "ai-action-02", rankId: "ai-action-02-rank", rank: "02", titleId: "ai-action-02-title", title: "圃場 PH-03 の灌水を午前に前倒し", bodyId: "ai-action-02-body", body: "降水確率が夕方に上昇。表面乾燥と夜間低温の複合リスクを下げるため、午前の潅水を +15%（みずブロックのみ）。", metaId: "ai-action-02-meta", meta: "Weather tie-in · Confidence 0.76", padding: "py-5" },
    { id: "ai-action-03", rankId: "ai-action-03-rank", rank: "03", titleId: "ai-action-03-title", title: "リスク Open3 を「現場朝礼」で一枚に要約", bodyId: "ai-action-03-body", body: "法務・行政・経営を分けず、現場が動ける順に並べ替えたチェックリストを QR で共有（所要 6 分）。", metaId: "ai-action-03-meta", meta: "Ops playbook · Confidence 0.71", padding: "pt-5" },
  ];

  return (
    <article id="ai-insights-panel" className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 shadow-md">
      <div className="border-b border-indigo-100 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span id="ai-insights-badge" className="rounded-lg bg-indigo-100 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-800">AI Insight</span>
          <h2 id="ai-insights-heading" className="text-lg font-semibold text-slate-900">明日のアクション</h2>
        </div>
        <p id="ai-insights-caption" className="mt-1 text-xs text-slate-500">現場センサー・台帳・気象を統合した優先度付き提言</p>
      </div>
      <ol id="ai-action-list" className="list-none space-y-0 divide-y divide-slate-100 p-5 sm:p-6">
        {actions.map((a) => (
          <li key={a.id} id={a.id} className={`flex gap-4 ${a.padding}`}>
            <span id={a.rankId} className="font-mono text-sm font-bold text-indigo-600">{a.rank}</span>
            <div>
              <h3 id={a.titleId} className="font-medium text-slate-900">{a.title}</h3>
              <p id={a.bodyId} className="mt-1 text-sm leading-relaxed text-slate-600">{a.body}</p>
              <p id={a.metaId} className="mt-2 font-mono text-[10px] text-indigo-700">{a.meta}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

export default function Page() {
  const [reportDate, setReportDate] = useState("—");
  const [reportDatetime, setReportDatetime] = useState("");
  const [weather, setWeather] = useState<WeatherState>(INITIAL_WEATHER);

  useEffect(() => {
    function tick() {
      const d = new Date();
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const w = WEEKDAYS[d.getDay()];
      const h = d.getHours();
      const min = d.getMinutes();
      const s = d.getSeconds();
      setReportDatetime(
        `${y}-${pad(m)}-${pad(day)}T${pad(h)}:${pad(min)}:${pad(s)}`,
      );
      setReportDate(
        `${y}年${m}月${day}日（${w}） ${pad(h)}:${pad(min)}:${pad(s)}`,
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function updateWeatherRyuo() {
      try {
        const r = await fetch(WEATHER_API_URL);
        const data = await r.json();
        const cur = data.current;
        if (!cur) {
          setWeather({
            icon: null,
            condition: "取得できませんでした",
            humidity: "—",
            wind: "—",
            temperature: "—",
            feels: "—",
          });
          return;
        }

        const { temperature_2m: temp, apparent_temperature: feels, relative_humidity_2m: humidity, wind_speed_10m: ws, wind_direction_10m: wd, weather_code: code } = cur;
        const [icon, desc] = getWeatherIconAndDesc(code);

        setWeather({
          icon,
          condition: desc,
          humidity:
            humidity != null && !Number.isNaN(humidity)
              ? `湿度 ${Math.round(humidity)}%`
              : "—",
          wind:
            ws != null &&
            !Number.isNaN(ws) &&
            wd != null &&
            !Number.isNaN(wd)
              ? `${windDegToDirection(wd)} ${Number(ws).toFixed(1)} m/s`
              : "—",
          temperature: fmtTemp(temp),
          feels:
            feels != null && !Number.isNaN(feels)
              ? `体感 ${fmtTemp(feels)}°C`
              : "—",
        });
      } catch {
        setWeather({
          icon: null,
          condition: "取得できませんでした",
          humidity: "—",
          wind: "—",
          temperature: "—",
          feels: "—",
        });
      }
    }

    updateWeatherRyuo();
    const id = setInterval(updateWeatherRyuo, 600_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FARM_REPORT_STYLES }} />
      <div
        className={`farm-report grain min-h-screen bg-slate-50 text-slate-900 antialiased ${notoSansJP.className} ${ibmPlexMono.variable}`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-lg focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-md"
        >
          メインへ
        </a>

        <div className="relative mx-auto max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <header
            id="report-header"
            className="mb-8 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md sm:p-6"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 shadow-[0_8px_28px_rgba(217,119,6,0.14)]">
                  <svg
                    className="h-8 w-8 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    id="report-badge"
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Next-Gen Farm AI Report
                  </p>
                  <h1
                    id="report-title"
                    className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                  >
                    令和8年産 現場統合レポート
                  </h1>
                  <p
                    id="report-subtitle"
                    className="mt-1 max-w-xl text-sm text-slate-600"
                  >
                    付付加価値の狂気を数字で固定し、誇れる一次産業の現場を共有する。
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-stretch gap-3 lg:justify-end">
                <div
                  id="report-date-card"
                  className="flex min-w-[140px] flex-col justify-center rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 shadow-sm sm:min-w-[17.5rem]"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    レポート日付
                  </span>
                  <time
                    id="report-date"
                    dateTime={reportDatetime}
                    className="font-mono text-lg font-semibold tabular-nums text-slate-900"
                  >
                    {reportDate}
                  </time>
                  <span id="report-era" className="mt-0.5 text-xs text-slate-500">
                    令和8年 / 育苗・作付シーズン
                  </span>
                </div>
                <div
                  id="weather-card"
                  className="flex min-w-[200px] items-center gap-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm"
                >
                  <div
                    id="weather-icon"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600"
                    aria-hidden="true"
                  >
                    {weather.icon ? (
                      <span
                        style={{ fontSize: "2.1rem", lineHeight: 1 }}
                        aria-hidden="true"
                      >
                        {weather.icon}
                      </span>
                    ) : (
                      <svg
                        className="h-7 w-7 opacity-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      id="weather-label"
                      className="font-mono text-[10px] uppercase tracking-wider text-sky-700"
                    >
                      現場天候
                    </span>
                    <p
                      id="weather-condition"
                      className="text-lg font-semibold text-slate-900"
                    >
                      {weather.condition}
                    </p>
                    <p className="font-mono text-xs text-slate-600">
                      <span id="weather-humidity">{weather.humidity}</span> ·{" "}
                      <span id="weather-wind">{weather.wind}</span>
                    </p>
                  </div>
                </div>
                <div
                  id="temperature-card"
                  className="flex min-w-[120px] flex-col justify-center rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/80 px-4 py-3 shadow-sm"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-800/80">
                    気温
                  </span>
                  <p className="flex items-baseline gap-1">
                    <span
                      id="weather-temperature"
                      className="font-mono text-3xl font-bold tabular-nums text-amber-600"
                    >
                      {weather.temperature}
                    </span>
                    <span
                      id="weather-temperature-unit"
                      className="text-sm font-medium text-amber-800/90"
                    >
                      °C
                    </span>
                  </p>
                  <span id="weather-feels" className="text-xs text-slate-500">
                    {weather.feels}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main id="main-content" className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <section
              id="daily-directive-panel"
              className="xl:col-span-12"
              aria-labelledby="daily-directive-heading"
            >
              <article className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-md ring-1 ring-slate-900/[0.03]">
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/12 blur-3xl"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl"
                  aria-hidden="true"
                />

                <div className="relative flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 shadow-sm"
                      aria-hidden="true"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 id="daily-directive-heading" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                          本日のAI現場指令
                        </h2>
                        <span id="daily-directive-badge-priority" className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-red-700">
                          最優先実行
                        </span>
                        <span id="daily-directive-badge-route" className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                          KIN 健苗 QC
                        </span>
                      </div>
                      <p id="daily-directive-subtitle" className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Daily Directive · 温度帯（緑化期／硬化期）· 潅水 · 移植前追肥
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span id="daily-directive-live" className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      現場同期
                    </span>
                    <time id="daily-directive-date" dateTime="2026-04-21" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-slate-700 shadow-sm">
                      2026-04-21
                    </time>
                  </div>
                </div>

                <div className="relative grid gap-4 bg-slate-50/40 p-4 sm:gap-5 sm:p-6 lg:grid-cols-2">
                  <div id="directive-temperature-card" className="flex flex-col rounded-xl border border-orange-200 bg-gradient-to-b from-orange-50/90 to-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600" aria-hidden="true">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                        <div>
                          <h3 id="directive-temperature-title" className="text-base font-bold text-orange-950 sm:text-lg">本日の温度・換気指令</h3>
                          <p id="directive-temperature-meta" className="mt-1 text-xs leading-relaxed text-slate-600">
                            <span className="font-mono text-orange-800">予測最高気温 <span id="directive-temp-high" className="tabular-nums text-slate-900">25℃</span></span>
                            <span className="text-slate-400"> · </span>
                            <span id="directive-temp-sky">晴れ</span>
                            <span className="text-slate-400"> · </span>
                            <span id="directive-temp-phase" className="text-orange-900">緑化期管理帯</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span id="directive-risk-label" className="font-mono text-[10px] uppercase tracking-wider text-slate-500">徒長・高温障害</span>
                        <span id="directive-risk-badge" className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-red-700 ring-1 ring-red-100">
                          <svg className="h-3.5 w-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          リスク：高
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span id="directive-greenhouse-label" className="text-slate-500">温室効果ストレス（推定）</span>
                          <span id="directive-greenhouse-value" className="font-mono font-semibold text-orange-700">高負荷</span>
                        </div>
                        <div id="directive-greenhouse-track" className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-200 ring-1 ring-orange-200/60" role="progressbar" aria-valuenow={82} aria-valuemin={0} aria-valuemax={100} aria-labelledby="directive-greenhouse-label">
                          <div id="directive-greenhouse-fill" className="h-full w-[82%] rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 shadow-sm" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span id="directive-vent-label" className="text-slate-500">側面・換気口 開放目安</span>
                          <span id="directive-vent-value" className="font-mono font-semibold text-orange-800">60% 開放</span>
                        </div>
                        <div id="directive-vent-track" className="mt-1.5 h-3 overflow-hidden rounded-full bg-slate-200 ring-1 ring-orange-200/50" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-labelledby="directive-vent-label">
                          <div id="directive-vent-fill" className="relative h-full w-[60%] rounded-full bg-gradient-to-r from-amber-600 to-orange-500">
                            <span className="absolute inset-y-0 right-0 w-px bg-white/70" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-[11px]">
                          <span id="directive-target-temp-label" className="text-slate-500">目標ハウス内温度帯（普及マニュアル）</span>
                          <span id="directive-target-temp-range" className="font-mono text-orange-800">緑化期 昼20–25／夜15–18</span>
                        </div>
                        <div className="relative h-8 rounded-lg border border-orange-200/80 bg-slate-100 px-2" aria-hidden="true">
                          <div className="absolute inset-y-2 left-[33%] right-[8%] rounded-md bg-gradient-to-r from-orange-200/80 to-amber-100 ring-1 ring-orange-300/50" title="緑化期・昼間目標帯" />
                          <div id="directive-temp-marker" className="absolute inset-y-1.5 left-[88%] w-1 rounded-full bg-orange-500 shadow-sm ring-1 ring-orange-300" title="30℃付近：ヤケ苗警戒" />
                          <div className="absolute inset-x-2 bottom-1 flex justify-between font-mono text-[9px] text-slate-500">
                            <span>10</span><span>15</span><span>20</span><span>25</span><span>30℃</span>
                          </div>
                        </div>
                        <p id="directive-target-temp-note" className="mt-1.5 text-[10px] leading-relaxed text-slate-600">
                          <span className="font-semibold text-orange-800">硬化期</span>：昼15〜20℃／夜10℃以上。
                          <span className="font-semibold text-red-700"> ハウス内30℃超</span>はヤケ苗危険—側面換気口を開放せよ。
                        </p>
                      </div>
                    </div>

                    <GreenhousePhaseDiagram />

                    <div id="directive-temperature-ai" className="mt-4 flex gap-3 rounded-lg border border-orange-200 bg-white p-3 shadow-sm sm:p-4">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-100 font-mono text-[10px] font-bold text-orange-800">AI</span>
                      <p className="min-w-0 text-sm leading-relaxed text-slate-700">
                        緑化期は昼20〜25℃・夜15〜18℃を目標に管理。日射でハウス内が上昇する見込みのため、側面・換気口を推定<span className="font-mono font-semibold text-orange-700">60%開放</span>し温度帯を維持すること。硬化期帯では昼15〜20℃・夜10℃以上を厳守。計測で<span className="font-semibold text-red-700">30℃を超えたらヤケ苗危険</span>—直ちに側面換気口を開放せよ。
                      </p>
                    </div>
                  </div>

                  <div id="directive-irrigation-card" className="flex flex-col rounded-xl border border-sky-200 bg-gradient-to-b from-sky-50/90 to-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-600" aria-hidden="true">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3.5c-4.2 5.2-6.5 8.8-6.5 11.5a6.5 6.5 0 1013 0c0-2.7-2.3-6.3-6.5-11.5z" />
                          </svg>
                        </span>
                        <div>
                          <h3 id="directive-irrigation-title" className="text-base font-bold text-sky-950 sm:text-lg">本日の潅水戦略（キヌヒカリ健苗育成ルート）</h3>
                          <p id="directive-irrigation-route" className="mt-1 text-xs text-slate-500">プール育苗・硬化期の水位管理 · 乾燥時は10時前かん水 · 移植前落水・追肥連携</p>
                        </div>
                      </div>
                      <span id="directive-irrigation-avoid" className="shrink-0 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-sky-800">加湿過多＝徒長注意</span>
                    </div>

                    <ol id="directive-irrigation-timeline" className="relative mt-5 space-y-0 pl-1">
                      <li className="relative flex gap-4 pb-6 before:absolute before:left-[15px] before:top-8 before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-sky-300 before:to-sky-100 last:pb-0 last:before:hidden">
                        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-sky-300 bg-white font-mono text-[10px] font-bold text-sky-800 shadow-sm">AM</div>
                        <div className="min-w-0 flex-1 rounded-lg border border-sky-200 bg-white p-3 shadow-sm sm:p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <time id="directive-water-morning-time" dateTime="10:00" className="rounded bg-sky-100 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-sky-900">〜10:00</time>
                            <span id="directive-water-morning-tag" className="rounded border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-sky-800">かん水（乾燥時）</span>
                            <span id="directive-water-morning-volume" className="font-mono text-xs font-semibold text-slate-900">午前中完了</span>
                          </div>
                          <p id="directive-water-morning-body" className="mt-2 text-sm leading-relaxed text-slate-600">
                            床土が乾いている場合は<span className="font-semibold text-sky-800">午前10時までにかん水</span>する。葉面・床面が長時間<span className="font-semibold text-sky-800">加湿状態にならないよう注意</span>し、過湿による徒長・根の活力低下を防ぐ。
                          </p>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>かん水タイミング（マニュアル）</span>
                              <span className="font-mono text-sky-600">10:00 限界</span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200" role="presentation">
                              <div className="h-full w-full rounded-full bg-gradient-to-r from-sky-700 to-sky-400" />
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="relative flex gap-4">
                        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-cyan-300 bg-white font-mono text-[10px] font-bold text-cyan-800 shadow-sm">PM</div>
                        <div className="min-w-0 flex-1 rounded-lg border border-cyan-200 bg-white p-3 shadow-sm sm:p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <time id="directive-water-afternoon-time" dateTime="14:00" className="rounded bg-cyan-50 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-cyan-900">昼〜14:00</time>
                            <span id="directive-water-afternoon-tag" className="rounded border border-cyan-200 bg-cyan-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-cyan-800">水位・乾湿管理</span>
                            <span id="directive-water-afternoon-volume" className="font-mono text-xs font-semibold text-slate-900">1日1〜2回</span>
                            <span id="directive-water-afternoon-condition" className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600">昼頃までに終了</span>
                          </div>
                          <p id="directive-water-afternoon-body" className="mt-2 text-sm leading-relaxed text-slate-600">
                            プール育苗・硬化期は<span className="font-semibold text-cyan-800">床土表面まで水位を維持</span>し、<span className="font-semibold text-cyan-800">移植前日は落水</span>する。後半は乾き具合を見ながら<span className="font-semibold text-cyan-800">1日1〜2回</span>潅水し、いずれも<span className="font-semibold text-cyan-800">昼頃までに終了</span>させる。
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md border border-cyan-200 bg-cyan-50 px-2 py-1 font-mono text-[10px] text-cyan-900">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              床土表面まで水位
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-600">移植前日：落水</span>
                          </div>
                        </div>
                      </li>
                    </ol>

                    <div id="directive-pretransplant-fertilizer" className="mt-4 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50/90 to-white p-3 shadow-sm sm:p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-amber-900">移植前追肥</span>
                        <span id="directive-fertilizer-tag" className="font-mono text-[10px] font-semibold text-amber-800">弁当肥 · 田植え直前</span>
                      </div>
                      <p id="directive-fertilizer-body" className="mt-2 text-sm leading-relaxed text-slate-700">
                        <span className="font-semibold text-amber-900">移植前追肥（弁当肥）</span>：移植4〜5日前（1.8葉期）に1箱あたり窒素成分1〜2g（液肥100倍希釈）を施用する。施用後は<span className="font-semibold text-amber-900">肥ヤケ防止のため必ずかん水</span>すること。
                      </p>
                    </div>
                  </div>
                </div>

                <div id="directive-footer-cta" className="relative flex flex-col gap-2 border-t border-slate-200 bg-white px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    Execute in order · 換気・30℃監視 → 10時前かん水 → 昼前潅水終了 → 移植前追肥
                  </p>
                  <span className="font-mono text-[10px] text-slate-400">
                    IDs: daily-directive-panel · directive-*
                  </span>
                </div>
              </article>
            </section>

            <FarmReportColumns trays={NURSERY_TRAYS} />
          </main>

          <footer id="report-footer" className="mt-10 border-t border-slate-200 pt-6 text-center font-mono text-[10px] text-slate-500">
            <p id="report-footer-copy">AI_Dashboard_2026 · Single-file mock · IDs are stable hooks for API binding</p>
          </footer>
        </div>
      </div>
    </>
  );
}
