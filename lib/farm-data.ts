/**
 * 農業ワークスペースの初期データ定数。
 * page.tsx の散在していたデータを集約・構造化。
 */

import type {
  VarietyInfo,
  FarmPhase,
  TrayBlock,
  RiskAlert,
  AiAction,
  TemperatureDirective,
  IrrigationDirective,
  FarmWorkspaceData,
} from "@/lib/farm-schema";

// ===== 品種データ =====

export const VARIETIES: VarietyInfo[] = [
  {
    key: "kinu",
    name: "キヌヒカリ",
    abbr: "KIN",
    role: "ブランド中核 · 鮒寿司の命",
    priority: "Priority A",
    area: "135.3",
    trayCount: 245,
    bagEstimate: 203,
    progressPct: 92,
    colorTheme: "amber",
  },
  {
    key: "koshi",
    name: "コシヒカリ",
    abbr: "KOS",
    role: "安定品目",
    priority: "Priority B",
    area: "112.2",
    trayCount: 203,
    bagEstimate: 168,
    progressPct: 78,
    colorTheme: "emerald",
  },
  {
    key: "mizu",
    name: "みずかがみ",
    abbr: "MIZ",
    role: "水熱適応",
    priority: "Priority C",
    area: "103.8",
    trayCount: 189,
    bagEstimate: 156,
    progressPct: 71,
    colorTheme: "sky",
  },
];

// ===== フェーズデータ =====

export const PHASES: FarmPhase[] = [
  {
    key: "seed",
    phaseId: "PH-01",
    title: "浸種・催芽",
    dateRange: "2026-04-02 — 04-05",
    desc: "品種別浸漬時間の微調整。キヌ帯は発熱監視ログを別紙連携済み。",
    progressPct: 100,
    colorTheme: "emerald",
    riskCount: 0,
  },
  {
    key: "nursery",
    phaseId: "PH-02",
    title: "育苗ハウス配置・潅水校正",
    dateRange: "2026-04-06 — 04-12",
    desc: "配置図に沿った再配置と、ゾーン別潅水量の校正。KIN-C 帯は黄金色ライン監査対象。",
    progressPct: 86,
    colorTheme: "amber",
    riskCount: 2,
  },
  {
    key: "field",
    phaseId: "PH-03",
    title: "寄せ植え・本田準備",
    dateRange: "2026-04-14 —",
    desc: "水管理と同時進行で、法務・減収リスクアラートと連動させる。",
    progressPct: 34,
    colorTheme: "sky",
    riskCount: 1,
  },
];

// ===== 苗箱データ =====

export const TRAYS: TrayBlock[] = [
  { id: "tray-KIN-A1", label: "KIN-A1", sub: "×18", variety: "kinu", title: "キヌヒカリ A列" },
  { id: "tray-KIN-A2", label: "KIN-A2", sub: "×18", variety: "kinu" },
  { id: "tray-KOS-B1", label: "KOS-B1", sub: "×15", variety: "koshi" },
  { id: "tray-KOS-B2", label: "KOS-B2", sub: "×15", variety: "koshi" },
  { id: "tray-MIZ-C1", label: "MIZ-C1", sub: "×14", variety: "mizu" },
  { id: "tray-MIZ-C2", label: "MIZ-C2", sub: "×14", variety: "mizu" },
  { id: "tray-KIN-A3", label: "KIN-A3", sub: "×18", variety: "kinu" },
  { id: "tray-KIN-A4", label: "KIN-A4", sub: "×18", variety: "kinu" },
  { id: "tray-KIN-B1", label: "KIN-B1", sub: "×18", variety: "kinu" },
  { id: "tray-KIN-B2", label: "KIN-B2", sub: "×18", variety: "kinu" },
  { id: "tray-KOS-C1", label: "KOS-C1", sub: "×15", variety: "koshi" },
  { id: "tray-KOS-C2", label: "KOS-C2", sub: "×15", variety: "koshi" },
  { id: "tray-MIZ-D1", label: "MIZ-D1", sub: "×14", variety: "mizu" },
  { id: "tray-MIZ-D2", label: "MIZ-D2", sub: "×14", variety: "mizu" },
  { id: "tray-RSV-01", label: "RSV", sub: "予備", variety: null },
  { id: "tray-RSV-02", label: "RSV", sub: "予備", variety: null },
  { id: "tray-KIN-C1", label: "KIN-C1", sub: "主力帯", variety: "kinu" },
  { id: "tray-KIN-C2", label: "KIN-C2", sub: "主力帯", variety: "kinu" },
  { id: "tray-KOS-D1", label: "KOS-D1", sub: "×15", variety: "koshi" },
  { id: "tray-KOS-D2", label: "KOS-D2", sub: "×15", variety: "koshi" },
  { id: "tray-MIZ-E1", label: "MIZ-E1", sub: "×14", variety: "mizu" },
  { id: "tray-MIZ-E2", label: "MIZ-E2", sub: "×14", variety: "mizu" },
  { id: "tray-KIN-C3", label: "KIN-C3", sub: "×18", variety: "kinu" },
  { id: "tray-KIN-C4", label: "KIN-C4", sub: "×18", variety: "kinu" },
];

// ===== リスクアラート =====

export const RISK_ALERTS: RiskAlert[] = [
  {
    id: "risk-legal",
    severity: "Legal",
    title: "用水関連の定期届出 · 期限 proximity",
    desc: "管轄へ提出済み書類の写しと、圃場GISポリゴンの整合が未確認。水路上の重複表記を今週中に是正。",
    meta: "Due: 2026-04-25 · Owner: 管理課",
    iconKind: "warning",
  },
  {
    id: "risk-admin",
    severity: "Admin",
    title: "JA出荷カレンダーと育苗計画のズレ",
    desc: "みずかがみ寄せ植え開始が行政サンプル採取日と隣接。調整しないと検体の代表値がブレる。",
    meta: "連携先: JA品質管理 · 要MTG",
    iconKind: "doc",
  },
  {
    id: "risk-biz",
    severity: "Biz",
    title: "鮒寿司向けキヌの「袋数」見通しギャップ",
    desc: "見込203袋に対し、プレミアム契約需要が+7%推移。単価防衛のため中食向けアロケーションを再計算。",
    meta: "Sensitivity: High · KPI: 袋あたり粗利",
    iconKind: "chart",
  },
];

// ===== AI インサイト =====

export const AI_ACTIONS: AiAction[] = [
  {
    id: "ai-01",
    rank: "01",
    title: "KIN-C 帯の夜間最低温度が設定より -1.2°C",
    body: "22:00–02:00 に加温が弱まるパターンを検知。設定のヒステリシスを 0.6°C に、または西ブロックのみ短時間サイクルに変更。",
    meta: "Impact: 発葉ばらつき · Confidence 0.84",
  },
  {
    id: "ai-02",
    rank: "02",
    title: "圃場 PH-03 の灌水を午前に前倒し",
    body: "降水確率が夕方に上昇。表面乾燥と夜間低温の複合リスクを下げるため、午前の潅水を +15%（みずブロックのみ）。",
    meta: "Weather tie-in · Confidence 0.76",
  },
  {
    id: "ai-03",
    rank: "03",
    title: "リスク Open3 を「現場朝礼」で一枚に要約",
    body: "法務・行政・経営を分けず、現場が動ける順に並べ替えたチェックリストを QR で共有（所要 6 分）。",
    meta: "Ops playbook · Confidence 0.71",
  },
];

// ===== 温度指令 =====

export const TEMPERATURE_DIRECTIVE: TemperatureDirective = {
  maxTempForecast: "25℃",
  sky: "晴れ",
  phase: "緑化期管理帯",
  riskLevel: "高",
  greenhouseStressPct: 82,
  ventPct: 60,
  aiComment:
    "緑化期は昼20〜25℃・夜15〜18℃を目標に管理。日射でハウス内が上昇する見込みのため、側面・換気口を推定60%開放し温度帯を維持すること。硬化期帯では昼15〜20℃・夜10℃以上を厳守。計測で30℃を超えたらヤケ苗危険—直ちに側面換気口を開放せよ。",
};

// ===== 潅水指令 =====

export const IRRIGATION_DIRECTIVE: IrrigationDirective = {
  morningDeadline: "〜10:00",
  afternoonWindow: "昼〜14:00",
  frequency: "1日1〜2回",
};

// ===== ワークスペース全体データ =====

export const FARM_WORKSPACE_DATA: FarmWorkspaceData = {
  varieties: VARIETIES,
  phases: PHASES,
  trays: TRAYS,
  riskAlerts: RISK_ALERTS,
  aiActions: AI_ACTIONS,
  temperatureDirective: TEMPERATURE_DIRECTIVE,
  irrigationDirective: IRRIGATION_DIRECTIVE,
};
