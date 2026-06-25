/**
 * 農業ドメインのスキーマと型定義。
 * farm-report × 4ペインワークスペース統合で使用。
 *
 * ドメイン構造:
 *   - Pane 1: 品種ナビ (VarietyKey → VarietyInfo)
 *   - Pane 2: 育苗フェーズ選択 (PhaseKey → FarmPhase)
 *   - Pane 3: 品種ダッシュボード (苗箱配置図 + 作業工程ビジュアルログ)
 *   - Pane 4: 詳細ビュー (日次指令 + リスクアラート + AI Insight)
 */

// ===== 品種 (Pane 1) =====

/** 品種キー。3品種固定。 */
export type VarietyKey = "kinu" | "koshi" | "mizu";

/** Pane 1 サイドバーに表示する品種情報。 */
export type VarietyInfo = {
  key: VarietyKey;
  /** 品種の表示名 */
  name: string;
  /** 英略称（苗箱ラベルと対応） */
  abbr: string;
  /** 品種の役割説明 */
  role: string;
  /** 優先度ラベル */
  priority: string;
  /** 作付面積 (a) */
  area: string;
  /** 苗箱数 */
  trayCount: number;
  /** 見込袋数 */
  bagEstimate: number;
  /** 作付進捗率 (0〜100) */
  progressPct: number;
  /** カラーテーマ識別子 */
  colorTheme: "amber" | "emerald" | "sky";
};

// ===== 育苗フェーズ (Pane 2) =====

/** 育苗フェーズキー。 */
export type PhaseKey = "seed" | "nursery" | "field";

/** Pane 2 リストに表示するフェーズ情報。 */
export type FarmPhase = {
  key: PhaseKey;
  /** フェーズ番号ラベル (PH-01など) */
  phaseId: string;
  /** フェーズ名称 */
  title: string;
  /** 実施期間 */
  dateRange: string;
  /** 説明文 */
  desc: string;
  /** 進捗率 (0〜100) */
  progressPct: number;
  /** カラーテーマ識別子 */
  colorTheme: "emerald" | "amber" | "sky";
  /** 関連するリスクアラート数 */
  riskCount: number;
};

// ===== 苗箱 (Pane 3) =====

/** 苗箱ブロック1つの情報。 */
export type TrayBlock = {
  id: string;
  label: string;
  sub: string;
  variety: VarietyKey | null; // nullは予備・通路
  title?: string;
};

// ===== リスクアラート (Pane 4) =====

export type RiskSeverity = "Legal" | "Admin" | "Biz";
export type RiskIconKind = "warning" | "doc" | "chart";

/** リスクアラート1件。 */
export type RiskAlert = {
  id: string;
  severity: RiskSeverity;
  title: string;
  desc: string;
  meta: string;
  iconKind: RiskIconKind;
};

// ===== AI Insight (Pane 4) =====

/** AI推奨アクション1件。 */
export type AiAction = {
  id: string;
  rank: string;
  title: string;
  body: string;
  meta: string;
};

// ===== 日次指令 (Pane 4) =====

/** 温度・換気指令情報。 */
export type TemperatureDirective = {
  maxTempForecast: string;
  sky: string;
  phase: string;
  riskLevel: "高" | "中" | "低";
  greenhouseStressPct: number;
  ventPct: number;
  aiComment: string;
};

/** 潅水戦略情報。 */
export type IrrigationDirective = {
  morningDeadline: string;
  afternoonWindow: string;
  frequency: string;
  aiComment?: string;
};

// ===== 天気 (GlobalHeader) =====

export type WeatherState = {
  icon: string | null;
  condition: string;
  humidity: string;
  wind: string;
  temperature: string;
  feels: string;
};

export const INITIAL_WEATHER: WeatherState = {
  icon: null,
  condition: "取得中…",
  humidity: "—",
  wind: "—",
  temperature: "—",
  feels: "—",
};

// ===== Pane 4 の表示状態 =====

/** Pane 4 に何を開いているか。nullは未選択（畳み状態）。 */
export type SelectedFarmDetail = { type: "phase"; phase: PhaseKey } | null;

// ===== ワークスペース全体の Props 用データ =====

export type FarmWorkspaceData = {
  varieties: VarietyInfo[];
  phases: FarmPhase[];
  trays: TrayBlock[];
  riskAlerts: RiskAlert[];
  aiActions: AiAction[];
  temperatureDirective: TemperatureDirective;
  irrigationDirective: IrrigationDirective;
};
