"use client";

/**
 * FarmWorkspace: 農業版 4ペインワークスペース。
 *
 * レイアウト構造:
 * ```
 * <SidebarProvider> (h-screen, defaultOpen, Cmd+B でトグル)
 * ┌─ VarietySidebarPane (Pane 1) ─┬─ SidebarInset ──────────────────────────┐
 * │ 品種ナビ (折りたたみ可)          │ ┌─ GlobalHeader (h-14) ──────────────┐ │
 * │ collapsible="icon"              │ └────────────────────────────────────┘ │
 * │ 240px ↔ 48px                   │ ┌─ PhaseListPane ─┬─ FarmDashboard ─┬─ FarmDetailPane ─┐ │
 * │                                 │ │ Pane 2         │ Pane 3          │ Pane 4 (開閉可) │ │
 * └─────────────────────────────────┴─┴────────────────┴─────────────────┴─────────────────┘ │
 * ```
 */

import { useState, useCallback } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GlobalHeader } from "@/components/workspace/GlobalHeader";
import { VarietySidebarPane } from "@/components/workspace/VarietySidebarPane";
import { PhaseListPane } from "@/components/workspace/PhaseListPane";
import { FarmDashboardPane } from "@/components/workspace/FarmDashboardPane";
import { FarmDetailPane } from "@/components/workspace/FarmDetailPane";

import type {
  VarietyKey,
  PhaseKey,
  SelectedFarmDetail,
  FarmWorkspaceData,
} from "@/lib/farm-schema";

type FarmWorkspaceProps = {
  data: FarmWorkspaceData;
};

export function FarmWorkspace({ data }: FarmWorkspaceProps) {
  const { varieties, phases, trays, riskAlerts, aiActions, temperatureDirective, irrigationDirective } = data;

  // 選択中の品種 (Pane 1 → Pane 3 に伝播)
  const [selectedVarietyKey, setSelectedVarietyKey] = useState<VarietyKey>("kinu");

  // 選択中のフェーズ (Pane 2 → Pane 4 に伝播)
  const [selectedPhaseKey, setSelectedPhaseKey] = useState<PhaseKey | null>("nursery");

  // Pane 4 の表示状態
  const [selectedDetail, setSelectedDetail] = useState<SelectedFarmDetail>({ type: "phase", phase: "nursery" });

  // ユーザーが手動で Pane 4 を畳んだか
  const [pane4ManuallyClosed, setPane4ManuallyClosed] = useState(false);

  // 夜間モード（北斗七星 UI）の状態管理
  const [isNightMode, setIsNightMode] = useState(false);
  const toggleNightMode = useCallback(() => setIsNightMode((v) => !v), []);

  // Pane 4 の展開状態
  const pane4Open = selectedDetail !== null && !pane4ManuallyClosed;

  // 品種選択ハンドラ (Pane 1)
  const selectVariety = useCallback((key: VarietyKey) => {
    setSelectedVarietyKey(key);
  }, []);

  // フェーズ選択ハンドラ (Pane 2)
  const selectPhase = useCallback((key: PhaseKey) => {
    setSelectedPhaseKey(key);
    setSelectedDetail({ type: "phase", phase: key });
    setPane4ManuallyClosed(false);
  }, []);

  // 詳細を開くハンドラ (Pane 3 → Pane 4)
  const openDetail = useCallback((phase: PhaseKey) => {
    setSelectedDetail({ type: "phase", phase });
    setSelectedPhaseKey(phase);
    setPane4ManuallyClosed(false);
  }, []);

  // Pane 4 開閉トグル
  const togglePane4 = useCallback(() => {
    setPane4ManuallyClosed((v) => !v);
  }, []);

  // 選択中の品種データ
  const activeVariety = varieties.find((v) => v.key === selectedVarietyKey) ?? varieties[0];

  // GlobalHeader 用のラベル
  const activePhase = selectedPhaseKey ? phases.find((p) => p.key === selectedPhaseKey) : null;

  return (
    <SidebarProvider
      defaultOpen
      className={`relative h-screen w-full overflow-hidden transition-colors duration-1000 ${isNightMode ? "dark bg-[#0b1021] text-slate-200" : "bg-background text-foreground"}`}
    >
      {/* 夜間モード時の背景グラフィック（北斗七星） */}
      {isNightMode && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden mix-blend-screen opacity-50 transition-opacity duration-1000">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <g stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" fill="rgba(255, 255, 255, 0.9)">
              <g transform="translate(calc(100vw - 400px), 120) scale(1.8)">
                <polyline points="20,120 70,140 120,110 160,130 190,180 240,200 270,150" fill="none" strokeDasharray="3 5" />
                <line x1="160" y1="130" x2="270" y2="150" fill="none" strokeDasharray="3 5" />
                <circle cx="20" cy="120" r="3" className="animate-pulse" style={{ animationDuration: '3s' }} />
                <circle cx="70" cy="140" r="2.5" />
                <circle cx="120" cy="110" r="2" />
                <circle cx="160" cy="130" r="2" />
                <circle cx="190" cy="180" r="2.5" />
                <circle cx="240" cy="200" r="2.5" />
                <circle cx="270" cy="150" r="3.5" className="animate-pulse" style={{ animationDuration: '4s' }} />
              </g>
            </g>
          </svg>
        </div>
      )}

      {/* Pane 1: 品種サイドバー */}
      <VarietySidebarPane
        varieties={varieties}
        selectedVarietyKey={selectedVarietyKey}
        onSelectVariety={selectVariety}
      />

      <SidebarInset className={`flex min-w-0 flex-col z-10 transition-colors duration-1000 ${isNightMode ? 'bg-transparent' : 'bg-background'}`}>
        {/* グローバルヘッダー（時計・天気・パンくず） */}
        <GlobalHeader
          varietyName={activeVariety.name}
          phaseTitle={activePhase?.title ?? "フェーズ選択"}
          isNightMode={isNightMode}
          onToggleNightMode={toggleNightMode}
        />

        {/* Pane 2 / Pane 3 / Pane 4 の横並びエリア */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Pane 2: フェーズリスト */}
          <PhaseListPane
            phases={phases}
            selectedPhaseKey={selectedPhaseKey}
            onSelectPhase={selectPhase}
          />

          {/* Pane 3: ファームダッシュボード */}
          <FarmDashboardPane
            variety={activeVariety}
            phases={phases}
            trays={trays}
            selectedVarietyKey={selectedVarietyKey}
            onOpenDetail={openDetail}
          />

          {/* Pane 4: 詳細ビュー */}
          <FarmDetailPane
            selectedDetail={selectedDetail}
            phases={phases}
            riskAlerts={riskAlerts}
            aiActions={aiActions}
            tempDirective={temperatureDirective}
            irrigationDirective={irrigationDirective}
            pane4Open={pane4Open}
            onTogglePane4={togglePane4}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
