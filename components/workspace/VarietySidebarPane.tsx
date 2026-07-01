"use client";

import type { VarietyInfo, VarietyKey } from "@/lib/farm-schema";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Pane1Toggle } from "@/components/workspace/Pane1Toggle";

// カラーテーマごとのクラス定義
const THEME_CLASSES = {
  amber: {
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    bar: "from-amber-600 via-amber-500 to-yellow-400",
    pct: "text-amber-700",
    activeBg: "bg-amber-50/50",
    icon: "🌾",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-900 border-emerald-200",
    bar: "from-emerald-600 to-emerald-400",
    pct: "text-emerald-700",
    activeBg: "bg-emerald-50/50",
    icon: "🌿",
  },
  sky: {
    badge: "bg-sky-100 text-sky-900 border-sky-200",
    bar: "from-sky-600 to-sky-400",
    pct: "text-sky-700",
    activeBg: "bg-sky-50/50",
    icon: "💧",
  },
} as const;

type VarietySidebarPaneProps = {
  varieties: VarietyInfo[];
  selectedVarietyKey: VarietyKey;
  onSelectVariety: (key: VarietyKey) => void;
};

export function VarietySidebarPane({
  varieties,
  selectedVarietyKey,
  onSelectVariety,
}: VarietySidebarPaneProps) {
  // 品種構成比（面積ベース）
  const totalArea = varieties.reduce((s, v) => s + parseFloat(v.area), 0);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border [&_[data-slot=sidebar-container]]:bg-sidebar"
    >
      {/* ヘッダー */}
      <SidebarHeader className="border-b border-sidebar-border p-0">
        <div className="flex h-14 items-center justify-between gap-2 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[state=expanded]:px-4">
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Farm Workspace
            </span>
            <h2 className="truncate text-sm font-bold text-sidebar-foreground">
              令和8年産 水稲
            </h2>
          </div>
          <Pane1Toggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 py-3">
        {/* 品種リスト */}
        <SidebarGroup className="px-1">
          <SidebarGroupLabel className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            品種ナビ
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {varieties.map((v) => {
                const theme = THEME_CLASSES[v.colorTheme];
                const active = v.key === selectedVarietyKey;
                const areaRatio = ((parseFloat(v.area) / totalArea) * 100).toFixed(1);

                return (
                  <SidebarMenuItem key={v.key}>
                    <SidebarMenuButton
                      tooltip={v.name}
                      isActive={active}
                      aria-current={active ? "page" : undefined}
                      onClick={() => onSelectVariety(v.key)}
                      className={`h-auto flex-col items-stretch py-3 ${active ? theme.activeBg : ""}`}
                    >
                      {/* 品種名行 */}
                      <div className="flex w-full items-center gap-2 group-data-[collapsible=icon]:justify-center">
                        <span className="text-base leading-none" aria-hidden="true">
                          {theme.icon}
                        </span>
                        <span className="min-w-0 truncate font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                          {v.name}
                        </span>
                        <span
                          className={`ml-auto shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold group-data-[collapsible=icon]:hidden ${theme.badge}`}
                        >
                          {v.abbr}
                        </span>
                      </div>

                      {/* 統計行（展開時のみ） */}
                      <div className="mt-2.5 flex w-full gap-2 font-mono text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                        <span>{v.area}a</span>
                        <span>·</span>
                        <span>{v.trayCount}箱</span>
                        <span>·</span>
                        <span>{v.bagEstimate}袋見込</span>
                      </div>

                      {/* 進捗バー（展開時のみ） */}
                      <div className="mt-2 group-data-[collapsible=icon]:hidden">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            面積構成比 {areaRatio}%
                          </span>
                          <span className={`font-mono text-[10px] font-semibold ${theme.pct}`}>
                            {v.progressPct}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-border">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
                            style={{ width: `${v.progressPct}%` }}
                          />
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 品種構成比チャート（展開時のみ） */}
        <SidebarGroup className="mt-2 px-1 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            品種構成比（面積）
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div
              id="sidebar-variety-mix-bar"
              className="mt-2 flex h-3 w-full overflow-hidden rounded-full border border-border"
              aria-label="品種構成比"
            >
              {varieties.map((v) => {
                const ratio = (parseFloat(v.area) / totalArea) * 100;
                const barColor = v.colorTheme === "amber"
                  ? "bg-gradient-to-b from-amber-500 to-amber-600"
                  : v.colorTheme === "emerald"
                    ? "bg-gradient-to-b from-emerald-600 to-emerald-500"
                    : "bg-gradient-to-b from-sky-600 to-sky-500";
                return (
                  <div
                    key={v.key}
                    className={barColor}
                    style={{ width: `${ratio}%` }}
                    title={`${v.name} ${ratio.toFixed(1)}%`}
                    aria-label={`${v.name}: ${ratio.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            <ul className="mt-2 flex flex-col gap-1 font-mono text-[10px] text-muted-foreground">
              {varieties.map((v) => {
                const ratio = ((parseFloat(v.area) / totalArea) * 100).toFixed(1);
                const dotColor = v.colorTheme === "amber" ? "text-amber-600" : v.colorTheme === "emerald" ? "text-emerald-600" : "text-sky-600";
                return (
                  <li key={v.key} className="flex items-center gap-1">
                    <span className={dotColor} aria-hidden="true">■</span>
                    <span>{v.name}</span>
                    <span className="ml-auto">{ratio}%</span>
                  </li>
                );
              })}
            </ul>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
