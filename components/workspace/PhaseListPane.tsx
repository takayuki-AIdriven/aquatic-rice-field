"use client";

import type { FarmPhase, PhaseKey } from "@/lib/farm-schema";
import { ScrollArea } from "@/components/ui/scroll-area";

// カラーテーマ定義
const THEME = {
  emerald: {
    badge: "bg-emerald-600",
    bar: "from-emerald-600 to-emerald-400",
    pct: "text-emerald-600",
    ring: "ring-emerald-200",
    activeBorder: "border-l-emerald-500",
    activeBg: "bg-emerald-50/40",
    icon: "🌱",
  },
  amber: {
    badge: "bg-amber-500",
    bar: "from-amber-600 to-amber-400",
    pct: "text-amber-600",
    ring: "ring-amber-200",
    activeBorder: "border-l-amber-500",
    activeBg: "bg-amber-50/40",
    icon: "🏡",
  },
  sky: {
    badge: "bg-sky-600",
    bar: "from-sky-600 to-sky-400",
    pct: "text-sky-600",
    ring: "ring-sky-200",
    activeBorder: "border-l-sky-500",
    activeBg: "bg-sky-50/40",
    icon: "🌊",
  },
} as const;

type PhaseListPaneProps = {
  phases: FarmPhase[];
  selectedPhaseKey: PhaseKey | null;
  onSelectPhase: (key: PhaseKey) => void;
};

export function PhaseListPane({
  phases,
  selectedPhaseKey,
  onSelectPhase,
}: PhaseListPaneProps) {
  const totalRisks = phases.reduce((s, p) => s + p.riskCount, 0);

  return (
    <div
      id="farm-phase-list"
      className="flex w-56 shrink-0 flex-col border-r border-border"
      aria-label="フェーズリスト"
    >
      {/* ヘッダー */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          育苗フェーズ
        </h2>
        {totalRisks > 0 && (
          <span
            id="phase-pane-risk-badge"
            className="rounded-full bg-red-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-red-800 ring-1 ring-red-200"
            aria-label={`リスクアラート ${totalRisks}件`}
          >
            ⚠ {totalRisks}
          </span>
        )}
      </div>

      {/* フェーズリスト */}
      <ScrollArea className="flex-1">
        <ul className="flex flex-col gap-0 p-2" role="listbox" aria-label="育苗フェーズ選択">
          {phases.map((phase) => {
            const theme = THEME[phase.colorTheme];
            const active = phase.key === selectedPhaseKey;

            return (
              <li key={phase.key} role="option" aria-selected={active}>
                <button
                  id={`phase-item-${phase.key}`}
                  type="button"
                  onClick={() => onSelectPhase(phase.key)}
                  className={`
                    group w-full rounded-lg border-l-2 p-3 text-left transition-all
                    ${active
                      ? `${theme.activeBorder} ${theme.activeBg} shadow-sm`
                      : "border-l-transparent hover:bg-muted/50"
                    }
                  `}
                  aria-current={active ? "true" : undefined}
                >
                  {/* フェーズIDとアイコン */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm ${theme.badge}`}
                        aria-hidden="true"
                      >
                        {phase.phaseId}
                      </span>
                      <span aria-hidden="true" className="text-sm leading-none">
                        {theme.icon}
                      </span>
                    </div>
                    {phase.riskCount > 0 && (
                      <span
                        className="rounded-full bg-red-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-red-700"
                        aria-label={`リスク ${phase.riskCount}件`}
                      >
                        ⚠ {phase.riskCount}
                      </span>
                    )}
                  </div>

                  {/* フェーズ名 */}
                  <p className="mt-2 text-sm font-semibold text-foreground leading-tight">
                    {phase.title}
                  </p>

                  {/* 期間 */}
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
                    {phase.dateRange}
                  </p>

                  {/* 進捗バー */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">進捗</span>
                      <span className={`font-mono font-semibold ${theme.pct}`}>
                        {phase.progressPct}%
                      </span>
                    </div>
                    <div className={`mt-1 h-1.5 overflow-hidden rounded-full bg-muted ring-1 ${theme.ring}`}>
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-500`}
                        style={{ width: `${phase.progressPct}%` }}
                        role="progressbar"
                        aria-valuenow={phase.progressPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${phase.title} ${phase.progressPct}%完了`}
                      />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* フェーズ全体サマリ */}
        <div className="mx-2 mb-3 mt-1 rounded-xl border border-border bg-muted/30 p-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            全体進捗
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {phases.map((phase) => {
              const theme = THEME[phase.colorTheme];
              return (
                <div key={phase.key} className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground w-12 shrink-0">
                    {phase.phaseId}
                  </span>
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
                      style={{ width: `${phase.progressPct}%` }}
                    />
                  </div>
                  <span className={`font-mono text-[10px] font-semibold tabular-nums ${theme.pct} w-8 text-right`}>
                    {phase.progressPct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
