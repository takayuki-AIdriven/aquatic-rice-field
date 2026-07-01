"use client";

import type {
  FarmPhase,
  RiskAlert,
  AiAction,
  TemperatureDirective,
  IrrigationDirective,
  SelectedFarmDetail,
} from "@/lib/farm-schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { GreenhousePhaseDiagram } from "@/components/farm-report/GreenhousePhaseDiagram";
import { ChevronRight, X } from "lucide-react";

// ===== アイコン =====

function WarningIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

// ===== Pane4 本体 =====

type FarmDetailPaneProps = {
  selectedDetail: SelectedFarmDetail;
  phases: FarmPhase[];
  riskAlerts: RiskAlert[];
  aiActions: AiAction[];
  tempDirective: TemperatureDirective;
  irrigationDirective: IrrigationDirective;
  pane4Open: boolean;
  onTogglePane4: () => void;
};

export function FarmDetailPane({
  selectedDetail,
  phases,
  riskAlerts,
  aiActions,
  tempDirective,
  irrigationDirective,
  pane4Open,
  onTogglePane4,
}: FarmDetailPaneProps) {
  const selectedPhase = selectedDetail?.type === "phase"
    ? phases.find((p) => p.key === selectedDetail.phase)
    : null;

  if (!pane4Open) {
    return (
      <div
        id="farm-detail-pane-collapsed"
        className="flex w-10 shrink-0 flex-col items-center border-l border-border bg-background pt-4"
        aria-label="詳細パネル（折りたたみ）"
      >
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onTogglePane4}
          aria-label="詳細パネルを開く"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      id="farm-detail-pane"
      className="flex w-80 shrink-0 flex-col border-l border-border bg-background xl:w-96"
    >
      {/* ヘッダー */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            詳細ビュー
          </span>
          {selectedPhase && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-800">
              {selectedPhase.phaseId}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onTogglePane4}
          aria-label="詳細パネルを閉じる"
        >
          <X className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">

          {/* ===== 日次指令 ===== */}
          <section
            id="detail-daily-directive"
            className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-card shadow-md"
            aria-labelledby="detail-directive-title"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-red-700">
                  最優先実行
                </span>
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-amber-800">
                  KIN 健苗 QC
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-800">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                現場同期
              </span>
            </div>

            {/* 温度・換気 */}
            <div className="flex flex-col gap-3 p-4">
              <div
                id="detail-temperature-card"
                className="flex flex-col rounded-xl border border-orange-200 bg-gradient-to-b from-orange-50/90 to-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600" aria-hidden="true">
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <div>
                      <h3
                        id="detail-directive-title"
                        className="text-sm font-bold text-orange-950"
                      >
                        本日の温度・換気指令
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-mono text-orange-800">予測最高 {tempDirective.maxTempForecast}</span>
                        {" · "}{tempDirective.sky}
                        {" · "}<span className="text-orange-900">{tempDirective.phase}</span>
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md border border-red-200 bg-red-50 px-2 py-1 font-mono text-[10px] font-bold uppercase text-red-700 ring-1 ring-red-100">
                    リスク：{tempDirective.riskLevel}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {/* 温室ストレス */}
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">温室効果ストレス（推定）</span>
                      <span className="font-mono font-semibold text-orange-700">高負荷</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted ring-1 ring-orange-200/60"
                      role="progressbar" aria-valuenow={tempDirective.greenhouseStressPct} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-500"
                        style={{ width: `${tempDirective.greenhouseStressPct}%` }} />
                    </div>
                  </div>
                  {/* 換気 */}
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">換気口 開放目安</span>
                      <span className="font-mono font-semibold text-orange-800">{tempDirective.ventPct}% 開放</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted ring-1 ring-orange-200/50"
                      role="progressbar" aria-valuenow={tempDirective.ventPct} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-600 to-orange-500"
                        style={{ width: `${tempDirective.ventPct}%` }} />
                    </div>
                  </div>
                </div>

                {/* ハウス断面図 */}
                <GreenhousePhaseDiagram className="mt-3" />

                {/* AIコメント */}
                <div className="mt-3 flex gap-2 rounded-lg border border-orange-200 bg-card p-3 shadow-sm">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-orange-100 font-mono text-[10px] font-bold text-orange-800">AI</span>
                  <p className="min-w-0 text-xs leading-relaxed text-foreground/80">{tempDirective.aiComment}</p>
                </div>
              </div>

              {/* 潅水戦略 */}
              <div
                id="detail-irrigation-card"
                className="flex flex-col rounded-xl border border-sky-200 bg-gradient-to-b from-sky-50/90 to-card p-4 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-600" aria-hidden="true">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3.5c-4.2 5.2-6.5 8.8-6.5 11.5a6.5 6.5 0 1013 0c0-2.7-2.3-6.3-6.5-11.5z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-sky-950">潅水戦略（健苗育成ルート）</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">プール育苗・硬化期の水位管理</p>
                  </div>
                </div>
                <ol className="mt-3 space-y-2 pl-1" aria-label="潅水タイムライン">
                  <li className="flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-sky-300 bg-card font-mono text-[10px] font-bold text-sky-800 shadow-sm">AM</div>
                    <div className="flex-1 rounded-lg border border-sky-200 bg-card p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <time className="rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-900">{irrigationDirective.morningDeadline}</time>
                        <span className="font-mono text-[10px] font-semibold text-sky-800">かん水（乾燥時）</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        床土が乾いている場合は<span className="font-semibold text-sky-800">午前10時までにかん水</span>。過湿による徒長・根の活力低下を防ぐ。
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-cyan-300 bg-card font-mono text-[10px] font-bold text-cyan-800 shadow-sm">PM</div>
                    <div className="flex-1 rounded-lg border border-cyan-200 bg-card p-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <time className="rounded bg-cyan-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-900">{irrigationDirective.afternoonWindow}</time>
                        <span className="font-mono text-[10px] font-semibold text-cyan-800">水位・乾湿管理</span>
                        <span className="font-mono text-[10px] font-semibold text-foreground">{irrigationDirective.frequency}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        床土表面まで水位を維持し、<span className="font-semibold text-cyan-800">移植前日は落水</span>。昼頃までに完了。
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* ===== リスク管理センター ===== */}
          <section
            id="detail-risk-center"
            className="overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-b from-red-50/80 to-card shadow-md"
            aria-labelledby="detail-risk-heading"
          >
            <div className="flex items-center justify-between border-b border-red-100 px-4 py-3">
              <div>
                <h3 id="detail-risk-heading" className="text-sm font-semibold text-foreground">リスク管理センター</h3>
                <p className="text-xs text-muted-foreground">法務 · 行政 · 経営アラートの統合ビュー</p>
              </div>
              <span className="rounded-full bg-red-100 px-2.5 py-1 font-mono text-xs font-semibold text-red-800 ring-1 ring-red-200">
                Open {riskAlerts.length}
              </span>
            </div>
            <ul id="risk-alert-list" className="divide-y divide-border">
              {riskAlerts.map((alert) => {
                const severityClass = alert.severity === "Legal"
                  ? "bg-red-100 text-red-800"
                  : alert.severity === "Admin"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-sky-100 text-sky-800";
                const iconBg = alert.severity === "Legal"
                  ? "bg-red-100 text-red-600"
                  : alert.severity === "Admin"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-sky-100 text-sky-600";

                return (
                  <li key={alert.id} id={alert.id} className="flex gap-3 p-4">
                    <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${iconBg}`} aria-hidden="true">
                      {alert.iconKind === "warning" && <WarningIcon />}
                      {alert.iconKind === "doc" && <DocIcon />}
                      {alert.iconKind === "chart" && <ChartIcon />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${severityClass}`}>{alert.severity}</span>
                        <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{alert.desc}</p>
                      <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">{alert.meta}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ===== AI Insights ===== */}
          <section
            id="detail-ai-insights"
            className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-card to-card shadow-md"
            aria-labelledby="detail-ai-heading"
          >
            <div className="border-b border-indigo-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-indigo-100 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-800">AI Insight</span>
                <h3 id="detail-ai-heading" className="text-sm font-semibold text-foreground">明日のアクション</h3>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">現場センサー・台帳・気象を統合した優先度付き提言</p>
            </div>
            <ol className="divide-y divide-border p-4" aria-label="AIアクションリスト">
              {aiActions.map((action) => (
                <li key={action.id} id={action.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="font-mono text-sm font-bold text-indigo-600 shrink-0 w-6">{action.rank}</span>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{action.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{action.body}</p>
                    <p className="mt-1.5 font-mono text-[10px] text-indigo-700">{action.meta}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

        </div>
      </ScrollArea>
    </div>
  );
}
