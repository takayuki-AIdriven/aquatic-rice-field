"use client";

import type { VarietyInfo, FarmPhase, TrayBlock, VarietyKey, PhaseKey } from "@/lib/farm-schema";
import { ScrollArea } from "@/components/ui/scroll-area";

// ===== カラーテーマ =====

const VARIETY_THEME = {
  kinu: {
    label: "text-amber-900",
    trayBg: "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm ring-1 ring-amber-100",
    trayBgSub: "border-amber-200 bg-amber-50/90",
  },
  koshi: {
    label: "text-emerald-800",
    trayBg: "border-emerald-200 bg-emerald-50",
    trayBgSub: "border-emerald-200 bg-emerald-50/80",
  },
  mizu: {
    label: "text-sky-800",
    trayBg: "border-sky-200 bg-sky-50",
    trayBgSub: "border-sky-200 bg-sky-50/80",
  },
} as const;

const PHASE_THEME = {
  emerald: {
    badge: "bg-emerald-600",
    pctColor: "text-emerald-600",
    bar: "from-emerald-600 to-emerald-400",
    thumbBorder: "border-slate-200",
    thumbBg: "bg-slate-50",
    placeholder: "現場写真スロット",
    placeholderText: "text-slate-500",
    placeholderBg: "from-emerald-100/90 via-slate-50 to-white",
  },
  amber: {
    badge: "bg-amber-500",
    pctColor: "text-amber-600",
    bar: "from-amber-600 to-amber-400",
    thumbBorder: "border-amber-200",
    thumbBg: "bg-amber-50/50",
    placeholder: "キヌ主力帯",
    placeholderText: "text-amber-800/70",
    placeholderBg: "from-amber-100/90 via-orange-50/80 to-white",
  },
  sky: {
    badge: "bg-sky-600",
    pctColor: "text-sky-600",
    bar: "from-sky-600 to-sky-400",
    thumbBorder: "border-sky-200",
    thumbBg: "bg-sky-50/50",
    placeholder: "圃場・水面",
    placeholderText: "text-sky-800/60",
    placeholderBg: "from-sky-100/90 via-slate-50 to-white",
  },
} as const;

const PHASE_IDS: Record<PhaseKey, string> = {
  seed: "PH-01",
  nursery: "PH-02",
  field: "PH-03",
};

// ===== サブコンポーネント =====

function TrayGrid({ trays, selectedVariety }: { trays: TrayBlock[]; selectedVariety: VarietyKey }) {
  const rowA = trays.slice(0, 8);
  const rowB = trays.slice(8, 16);
  const rowD = trays.slice(16);

  function trayClass(tray: TrayBlock, idx: number) {
    if (tray.variety === null) {
      return "flex aspect-[4/3] flex-col items-center justify-center rounded border border-dashed border-muted-foreground/30 bg-background";
    }
    const theme = VARIETY_THEME[tray.variety];
    const isSelected = tray.variety === selectedVariety;
    const base = isSelected ? theme.trayBg : `${theme.trayBgSub} opacity-60`;
    return `flex aspect-[4/3] flex-col items-center justify-center rounded border ${base} transition-opacity`;
  }

  function labelClass(variety: VarietyKey | null) {
    if (!variety) return "font-mono text-[9px] text-muted-foreground";
    return `font-mono text-[9px] ${VARIETY_THEME[variety].label}`;
  }

  return (
    <div
      id="nursery-layout"
      className="relative overflow-x-auto rounded-xl border border-border bg-muted/30 p-3 shadow-inner"
    >
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>入口（西）</span>
        <span>ハウス長手 24m</span>
        <span>東側 給水</span>
      </div>
      <div className="grid min-w-[480px] grid-cols-8 gap-1 sm:grid-cols-8 lg:grid-cols-12">
        {rowA.map((tray) => (
          <div key={tray.id} id={tray.id} className={trayClass(tray, 0)} title={tray.title}>
            <span className={labelClass(tray.variety)}>{tray.label}</span>
            <span className="text-[8px] text-muted-foreground">{tray.sub}</span>
          </div>
        ))}
        {rowB.map((tray) => (
          <div key={tray.id} id={tray.id} className={trayClass(tray, 1)} title={tray.title}>
            <span className={labelClass(tray.variety)}>{tray.label}</span>
            <span className="text-[8px] text-muted-foreground">{tray.sub}</span>
          </div>
        ))}
        <div className="col-span-12 my-0.5 flex items-center justify-center rounded border border-border bg-muted/50 py-1 font-mono text-[9px] text-muted-foreground">
          作業通路 · 灌水・夜間加温ライン
        </div>
        {rowD.map((tray) => (
          <div key={tray.id} id={tray.id} className={trayClass(tray, 2)} title={tray.title}>
            <span className={labelClass(tray.variety)}>{tray.label}</span>
            <span className="text-[8px] text-muted-foreground">{tray.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseRow({ phase }: { phase: FarmPhase }) {
  const theme = PHASE_THEME[phase.colorTheme];
  return (
    <div
      id={`phase-row-${phase.key}`}
      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
    >
      {/* サムネイル */}
      <div
        className={`relative h-28 w-full shrink-0 overflow-hidden rounded-xl border ${theme.thumbBorder} ${theme.thumbBg} sm:h-24 sm:w-40`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.placeholderBg}`} aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
          <span className={`text-xs ${theme.placeholderText}`}>{theme.placeholder}</span>
        </div>
        <span className={`absolute left-2 top-2 rounded px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-sm ${theme.badge}`}>
          {PHASE_IDS[phase.key]}
        </span>
      </div>
      {/* テキスト */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-foreground">{phase.title}</h3>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">{phase.dateRange}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{phase.desc}</p>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">フェーズ進捗</span>
            <span className={`font-mono font-medium ${theme.pctColor}`}>{phase.progressPct}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
              style={{ width: `${phase.progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Pane 3 本体 =====

type FarmDashboardPaneProps = {
  variety: VarietyInfo;
  phases: FarmPhase[];
  trays: TrayBlock[];
  selectedVarietyKey: VarietyKey;
  onOpenDetail: (phase: PhaseKey) => void;
};

export function FarmDashboardPane({
  variety,
  phases,
  trays,
  selectedVarietyKey,
  onOpenDetail,
}: FarmDashboardPaneProps) {
  const theme = {
    amber: { bar: "from-amber-600 via-amber-500 to-yellow-400", track: "ring-amber-200/60", pct: "text-amber-700" },
    emerald: { bar: "from-emerald-600 to-emerald-400", track: "ring-emerald-200/60", pct: "text-emerald-700" },
    sky: { bar: "from-sky-600 to-sky-400", track: "ring-sky-200/60", pct: "text-sky-700" },
  }[variety.colorTheme];

  return (
    <ScrollArea
      id="farm-dashboard-pane"
      className="flex min-w-0 flex-1 flex-col"
    >
      <div className="flex flex-col gap-5 p-5">
        {/* 品種ヘッダーカード */}
        <article
          id="variety-hero-card"
          className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-md"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-amber-200/30 blur-3xl" aria-hidden="true" />
          <div className="flex flex-wrap items-start justify-between gap-3 p-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                令和8年産 作付管理
              </p>
              <h2
                id="dashboard-variety-name"
                className="mt-1 text-2xl font-bold tracking-tight text-foreground"
              >
                {variety.name}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{variety.role}</p>
            </div>
            <span className="shrink-0 rounded-full border border-border bg-muted px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
              {variety.priority}
            </span>
          </div>

          {/* KPI グリッド */}
          <dl
            id="dashboard-kpi-grid"
            className="grid grid-cols-3 gap-3 border-t border-border px-5 pb-4 pt-4 text-center sm:gap-4"
          >
            {[
              { dt: "面積", dd: `${variety.area}a`, ddClass: "text-foreground" },
              { dt: "苗箱", dd: `${variety.trayCount}箱`, ddClass: theme.pct },
              { dt: "見込", dd: `${variety.bagEstimate}袋`, ddClass: theme.pct },
            ].map(({ dt, dd, ddClass }) => (
              <div key={dt} className="rounded-xl border border-border bg-background px-2 py-2.5 shadow-sm">
                <dt className="font-mono text-[10px] uppercase text-muted-foreground">{dt}</dt>
                <dd className={`font-mono text-xl font-bold tabular-nums ${ddClass}`}>{dd}</dd>
              </div>
            ))}
          </dl>

          {/* 進捗バー */}
          <div className="border-t border-border px-5 pb-5 pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">作付進捗（面積基準）</span>
              <span className={`font-mono font-semibold ${theme.pct}`}>{variety.progressPct}%</span>
            </div>
            <div className={`mt-2 h-3 overflow-hidden rounded-full bg-muted ring-1 ${theme.track}`}>
              <div
                id="dashboard-progress-bar"
                className={`h-full rounded-full bg-gradient-to-r ${theme.bar} shadow-sm transition-all duration-700`}
                style={{ width: `${variety.progressPct}%` }}
                role="progressbar"
                aria-valuenow={variety.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${variety.name} 作付進捗 ${variety.progressPct}%`}
              />
            </div>
          </div>
        </article>

        {/* 苗箱配置図 */}
        <article id="nursery-map-panel" className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 id="nursery-map-heading" className="text-base font-semibold text-foreground">
                令和8年産 水稲苗箱配置図
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                ハウス内育苗 · 選択品種をハイライト表示
              </p>
            </div>
            <div id="nursery-map-legend" className="flex flex-wrap gap-2 font-mono text-[10px]">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900">KIN — キヌヒカリ</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-900">KOS — コシヒカリ</span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-sky-900">MIZ — みずかがみ</span>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <TrayGrid trays={trays} selectedVariety={selectedVarietyKey} />
            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-amber-700">KIN</span> は鮒寿司ブランドの中核品種として西側高温部に偏在配置。
              <span className="font-semibold text-emerald-700"> KOS</span> は中温安定帯、<span className="font-semibold text-sky-700"> MIZ</span> は東側加湿に強い。
            </p>
          </div>
        </article>

        {/* 作業工程ビジュアルログ */}
        <article id="visual-log-panel" className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <div className="border-b border-border px-5 py-4">
            <h2 id="visual-log-heading" className="text-base font-semibold text-foreground">
              作業工程ビジュアルログ
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              フェーズごとの現場記録 · 進捗と証跡を一枚に統合
            </p>
          </div>
          <div id="visual-log-list" className="divide-y divide-border">
            {phases.map((phase) => (
              <button
                key={phase.key}
                type="button"
                className="w-full text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => onOpenDetail(phase.key)}
                aria-label={`${phase.title} の詳細を表示`}
              >
                <PhaseRow phase={phase} />
              </button>
            ))}
          </div>
        </article>
      </div>
    </ScrollArea>
  );
}
