"use client";

import { useEffect, useState } from "react";
import { Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WeatherState } from "@/lib/farm-schema";
import { INITIAL_WEATHER } from "@/lib/farm-schema";

// ===== 天気ユーティリティ =====

const RYUO_LAT = 35.0858;
const RYUO_LON = 136.0354;
const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${RYUO_LAT}&longitude=${RYUO_LON}&timezone=Asia%2FTokyo&wind_speed_unit=ms&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m`;

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
  61: ["🌧️", "小雨"],
  63: ["🌧️", "雨"],
  65: ["🌧️", "大雨"],
  71: ["🌨️", "弱い雪"],
  73: ["🌨️", "雪"],
  75: ["❄️", "大雪"],
  80: ["🌧️", "にわか雨"],
  81: ["🌧️", "雨・雷雨"],
  95: ["⛈️", "雷"],
  96: ["⛈️", "雷・小さな雹"],
  99: ["⛈️", "雷・大きな雹"],
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

function pad(n: number) {
  return (n < 10 ? "0" : "") + n;
}

function getWeatherIconAndDesc(code: number): [string, string] {
  return WEATHER_TABLE[code] ?? ["❓", "不明"];
}

function windDegToDirection(deg: number | null | undefined): string {
  if (deg == null || Number.isNaN(deg)) return "—";
  const dirs = ["北", "北北東", "北東", "東北東", "東", "東南東", "南東", "南南東", "南", "南南西", "南西", "西南西", "西", "西北西", "北西", "北北西"];
  const ix = Math.floor(((Number(deg) + 11.25) % 360) / 22.5);
  return dirs[ix];
}

function fmtTemp(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "—";
  return (Math.round(Number(v) * 10) / 10).toFixed(1);
}

type GlobalHeaderProps = {
  varietyName?: string;
  phaseTitle?: string;
  onOpenSettings?: () => void;
  isNightMode?: boolean;
  onToggleNightMode?: () => void;
};

export function GlobalHeader({
  varietyName = "キヌヒカリ",
  phaseTitle = "育苗ハウス配置",
  onOpenSettings,
  isNightMode,
  onToggleNightMode,
}: GlobalHeaderProps) {
  const [reportDate, setReportDate] = useState("—");
  const [reportDatetime, setReportDatetime] = useState("");
  const [weather, setWeather] = useState<WeatherState>(INITIAL_WEATHER);

  // リアルタイム時計
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
      setReportDatetime(`${y}-${pad(m)}-${pad(day)}T${pad(h)}:${pad(min)}:${pad(s)}`);
      setReportDate(`${y}/${pad(m)}/${pad(day)}（${w}） ${pad(h)}:${pad(min)}:${pad(s)}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // 天気取得
  useEffect(() => {
    async function fetchWeather() {
      try {
        const r = await fetch(WEATHER_API_URL);
        const data = await r.json();
        const cur = data.current;
        if (!cur) { setWeather({ ...INITIAL_WEATHER, condition: "取得できませんでした" }); return; }
        const { temperature_2m: temp, apparent_temperature: feels, relative_humidity_2m: humidity, wind_speed_10m: ws, wind_direction_10m: wd, weather_code: code } = cur;
        const [icon, desc] = getWeatherIconAndDesc(code);
        setWeather({
          icon,
          condition: desc,
          humidity: humidity != null ? `湿度 ${Math.round(humidity)}%` : "—",
          wind: (ws != null && wd != null) ? `${windDegToDirection(wd)} ${Number(ws).toFixed(1)} m/s` : "—",
          temperature: fmtTemp(temp),
          feels: feels != null ? `体感 ${fmtTemp(feels)}°C` : "—",
        });
      } catch {
        setWeather({ ...INITIAL_WEATHER, condition: "取得できませんでした" });
      }
    }
    fetchWeather();
    const id = setInterval(fetchWeather, 600_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      id="farm-global-header"
      className={`flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 transition-colors duration-1000 ${isNightMode ? 'bg-transparent text-slate-200' : 'bg-background'}`}
    >
      {/* ロゴ + パンくず */}
      <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-50">
          <span className="text-base leading-none" aria-hidden="true">🌾</span>
        </div>
        <nav aria-label="パンくず" className="min-w-0 overflow-hidden">
          <ol className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <li className="shrink-0 font-semibold text-foreground">令和8年産</li>
            <li className="shrink-0" aria-hidden="true">›</li>
            <li
              id="header-variety"
              className="shrink-0 rounded px-1.5 py-0.5 text-amber-700 bg-amber-50 border border-amber-200 font-semibold"
            >
              {varietyName}
            </li>
            <li className="shrink-0" aria-hidden="true">›</li>
            <li
              id="header-phase"
              className="min-w-0 truncate text-foreground"
            >
              {phaseTitle}
            </li>
          </ol>
        </nav>
      </div>

      {/* 天気ミニ */}
      <div
        id="header-weather"
        className={`hidden shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 md:flex transition-colors duration-700 ${isNightMode ? 'border-sky-900/50 bg-sky-950/40' : 'border-sky-200 bg-sky-50'}`}
        aria-label="現場天候"
      >
        {weather.icon ? (
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }} aria-hidden="true">
            {weather.icon}
          </span>
        ) : (
          <svg className="size-4 text-sky-400 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        )}
        <div className="flex flex-col">
          <span id="header-condition" className={`font-mono text-[11px] font-semibold leading-none ${isNightMode ? 'text-sky-300' : 'text-sky-900'}`}>
            {weather.condition}
          </span>
          <span id="header-humidity" className={`font-mono text-[10px] leading-none mt-0.5 ${isNightMode ? 'text-sky-400/80' : 'text-sky-700'}`}>
            {weather.humidity}
          </span>
        </div>
      </div>

      {/* 気温 */}
      <div
        id="header-temp"
        className={`hidden shrink-0 items-center gap-1 rounded-lg border px-3 py-1.5 lg:flex transition-colors duration-700 ${
          isNightMode
            ? "border-emerald-500/50 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/80"
        }`}
        aria-label="気温"
      >
        <div className="flex items-baseline gap-0.5">
          <span id="header-temperature-value" className={`font-mono text-lg font-bold tabular-nums ${isNightMode ? 'text-emerald-400' : 'text-amber-600'}`}>
            {weather.temperature}
          </span>
          <span className={`font-mono text-xs font-medium ${isNightMode ? 'text-emerald-500/80' : 'text-amber-800/80'}`}>°C</span>
        </div>
        {isNightMode && (
          <span className="ml-2 font-mono text-[10px] font-medium text-emerald-400/90 border border-emerald-500/30 bg-emerald-900/40 rounded px-1.5 py-0.5">
            目標: 15-18℃
          </span>
        )}
      </div>

      {/* 時計 */}
      <time
        id="header-clock"
        dateTime={reportDatetime}
        className="hidden shrink-0 rounded-lg border border-border bg-muted/50 px-3 py-1.5 font-mono text-[11px] tabular-nums text-muted-foreground xl:block"
        aria-label="現在時刻"
      >
        {reportDate}
      </time>

      {/* 昼夜モード切替トグル（北斗七星UI） */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="昼夜モード切替"
              onClick={onToggleNightMode}
            >
              {isNightMode ? <Moon className="size-4 text-indigo-400" /> : <Sun className="size-4 text-amber-500" />}
            </Button>
          }
        />
        <TooltipContent side="bottom">{isNightMode ? "昼間モードへ" : "夜間モードへ"}</TooltipContent>
      </Tooltip>

      {/* 設定ボタン */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="設定"
              onClick={onOpenSettings}
            >
              <Settings className="size-4" />
            </Button>
          }
        />
        <TooltipContent side="bottom">ワークスペース設定</TooltipContent>
      </Tooltip>
    </header>
  );
}
