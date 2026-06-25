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
      className="h-screen w-full overflow-hidden bg-background text-foreground"
    >
      {/* Pane 1: 品種サイドバー */}
      <VarietySidebarPane
        varieties={varieties}
        selectedVarietyKey={selectedVarietyKey}
        onSelectVariety={selectVariety}
      />

      <SidebarInset className="flex min-w-0 flex-col bg-background">
        {/* グローバルヘッダー（時計・天気・パンくず） */}
        <GlobalHeader
          varietyName={activeVariety.name}
          phaseTitle={activePhase?.title ?? "フェーズ選択"}
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
