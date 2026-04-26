<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>令和8年産 次世代農場AIレポート — 現場統合ダッシュボード</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            rice: { DEFAULT: '#22c55e', muted: '#15803d' },
            water: { DEFAULT: '#38bdf8', muted: '#0369a1' },
            harvest: { DEFAULT: '#fbbf24', deep: '#d97706' },
            kinu: { DEFAULT: '#f59e0b', glow: 'rgba(245, 158, 11, 0.25)' },
          },
          fontFamily: {
            sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
            mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
          },
          boxShadow: {
            'panel': '0 1px 2px rgba(15,23,42,0.05), 0 8px 24px -6px rgba(15,23,42,0.08)',
            'kinu': '0 8px 28px rgba(217, 119, 6, 0.14)',
          },
        },
      },
    };
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    body { font-feature-settings: "palt" 1; }
    .grain::before {
      content: '';
      position: fixed; inset: 0; pointer-events: none; opacity: 0.022;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.35); border-radius: 9999px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  </style>
</head>
<body class="grain min-h-screen bg-slate-50 text-slate-900 antialiased">
  <!-- Skip link -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-lg focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-md">メインへ</a>

  <div class="relative mx-auto max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <header id="report-header" class="mb-8 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md sm:p-6">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-start gap-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 shadow-kinu">
            <svg class="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p id="report-badge" class="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Next-Gen Farm AI Report</p>
            <h1 id="report-title" class="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">令和8年産 現場統合レポート</h1>
            <p id="report-subtitle" class="mt-1 max-w-xl text-sm text-slate-600">付加価値の狂気を数字で固定し、誇れる一次産業の現場を共有する。</p>
          </div>
        </div>

        <div class="flex flex-wrap items-stretch gap-3 lg:justify-end">
          <div id="report-date-card" class="flex min-w-[140px] sm:min-w-[17.5rem] flex-col justify-center rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 shadow-sm">
            <span class="font-mono text-[10px] uppercase tracking-wider text-slate-500">レポート日付</span>
            <time id="report-date" datetime="" class="font-mono text-lg font-semibold tabular-nums text-slate-900">—</time>
            <span id="report-era" class="mt-0.5 text-xs text-slate-500">令和8年 / 育苗・作付シーズン</span>
          </div>
          <div id="weather-card" class="flex min-w-[200px] items-center gap-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 shadow-sm">
            <div id="weather-icon" class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-600" aria-hidden="true">
              <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <span id="weather-label" class="font-mono text-[10px] uppercase tracking-wider text-sky-700">現場天候</span>
              <p id="weather-condition" class="text-lg font-semibold text-slate-900">曇り時々晴れ</p>
              <p class="font-mono text-xs text-slate-600"><span id="weather-humidity">湿度 62%</span> · <span id="weather-wind">北西 2m/s</span></p>
            </div>
          </div>
          <div id="temperature-card" class="flex min-w-[120px] flex-col justify-center rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/80 px-4 py-3 shadow-sm">
            <span class="font-mono text-[10px] uppercase tracking-wider text-amber-800/80">気温</span>
            <p class="flex items-baseline gap-1">
              <span id="weather-temperature" class="font-mono text-3xl font-bold tabular-nums text-amber-600">18.4</span>
              <span id="weather-temperature-unit" class="text-sm font-medium text-amber-800/90">°C</span>
            </p>
            <span id="weather-feels" class="text-xs text-slate-500">体感 17°C</span>
          </div>
        </div>
      </div>
    </header>

    <main id="main-content" class="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <!-- Daily Directive: highest-priority field orders -->
      <section id="daily-directive-panel" class="xl:col-span-12" aria-labelledby="daily-directive-heading">
        <article class="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-md ring-1 ring-slate-900/[0.03]">
          <div class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/12 blur-3xl" aria-hidden="true"></div>
          <div class="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true"></div>

          <div class="relative flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div class="flex flex-wrap items-center gap-3">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 shadow-sm" aria-hidden="true">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h2 id="daily-directive-heading" class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">本日のAI現場指令</h2>
                  <span id="daily-directive-badge-priority" class="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-red-700">最優先実行</span>
                  <span id="daily-directive-badge-route" class="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-800">KIN 健苗 QC</span>
                </div>
                <p id="daily-directive-subtitle" class="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">Daily Directive · 温度・換気 / 潅水・水分ストレス</p>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:justify-end">
              <span id="daily-directive-live" class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                <span class="relative flex h-2 w-2">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                  <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                現場同期
              </span>
              <time id="daily-directive-date" datetime="2026-04-21" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs tabular-nums text-slate-700 shadow-sm">2026-04-21</time>
            </div>
          </div>

          <div class="relative grid gap-4 bg-slate-50/40 p-4 sm:gap-5 sm:p-6 lg:grid-cols-2">
            <!-- Temperature & ventilation -->
            <div id="directive-temperature-card" class="flex flex-col rounded-xl border border-orange-200 bg-gradient-to-b from-orange-50/90 to-white p-4 shadow-sm sm:p-5">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-orange-600" aria-hidden="true">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <div>
                    <h3 id="directive-temperature-title" class="text-base font-bold text-orange-950 sm:text-lg">本日の温度・換気指令</h3>
                    <p id="directive-temperature-meta" class="mt-1 text-xs leading-relaxed text-slate-600">
                      <span class="font-mono text-orange-800">予測最高気温 <span id="directive-temp-high" class="tabular-nums text-slate-900">25℃</span></span>
                      <span class="text-slate-400"> · </span>
                      <span id="directive-temp-sky">晴れ</span>
                    </p>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span id="directive-risk-label" class="font-mono text-[10px] uppercase tracking-wider text-slate-500">徒長・高温障害</span>
                  <span id="directive-risk-badge" class="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-red-700 ring-1 ring-red-100">
                    <svg class="h-3.5 w-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    リスク：高
                  </span>
                </div>
              </div>

              <div class="mt-4 space-y-3">
                <div>
                  <div class="flex items-center justify-between text-[11px]">
                    <span id="directive-greenhouse-label" class="text-slate-500">温室効果ストレス（推定）</span>
                    <span id="directive-greenhouse-value" class="font-mono font-semibold text-orange-700">高負荷</span>
                  </div>
                  <div id="directive-greenhouse-track" class="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-200 ring-1 ring-orange-200/60" role="progressbar" aria-valuenow="82" aria-valuemin="0" aria-valuemax="100" aria-labelledby="directive-greenhouse-label">
                    <div id="directive-greenhouse-fill" class="h-full w-[82%] rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 shadow-sm"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between text-[11px]">
                    <span id="directive-vent-label" class="text-slate-500">側面・換気口 開放目安</span>
                    <span id="directive-vent-value" class="font-mono font-semibold text-orange-800">60% 開放</span>
                  </div>
                  <div id="directive-vent-track" class="mt-1.5 h-3 overflow-hidden rounded-full bg-slate-200 ring-1 ring-orange-200/50" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-labelledby="directive-vent-label">
                    <div id="directive-vent-fill" class="relative h-full w-[60%] rounded-full bg-gradient-to-r from-amber-600 to-orange-500">
                      <span class="absolute inset-y-0 right-0 w-px bg-white/70" aria-hidden="true"></span>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="mb-1.5 flex items-center justify-between text-[11px]">
                    <span id="directive-target-temp-label" class="text-slate-500">目標ハウス内温度帯</span>
                    <span id="directive-target-temp-range" class="font-mono text-orange-800">20 — 25℃</span>
                  </div>
                  <div class="relative h-8 rounded-lg border border-orange-200/80 bg-slate-100 px-2" aria-hidden="true">
                    <div class="absolute inset-y-2 left-[33%] right-[8%] rounded-md bg-gradient-to-r from-orange-200/80 to-amber-100 ring-1 ring-orange-300/50" title="目標帯"></div>
                    <div id="directive-temp-marker" class="absolute inset-y-1.5 left-[88%] w-1 rounded-full bg-orange-500 shadow-sm ring-1 ring-orange-300" title="予測ピークに近い"></div>
                    <div class="absolute inset-x-2 bottom-1 flex justify-between font-mono text-[9px] text-slate-500">
                      <span>15</span><span>20</span><span>25</span><span>30℃</span>
                    </div>
                  </div>
                </div>
              </div>

              <div id="directive-temperature-ai" class="mt-4 flex gap-3 rounded-lg border border-orange-200 bg-white p-3 shadow-sm sm:p-4">
                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-orange-100 font-mono text-[10px] font-bold text-orange-800">AI</span>
                <p class="min-w-0 text-sm leading-relaxed text-slate-700">本日は日射による急激なハウス内温度上昇（温室効果）が予測されます。目標温度20〜25℃を維持するため、側面・換気口の開放（推定：<span class="font-mono font-semibold text-orange-700">60%開放</span>）を実施してください。</p>
              </div>
            </div>

            <!-- Irrigation -->
            <div id="directive-irrigation-card" class="flex flex-col rounded-xl border border-sky-200 bg-gradient-to-b from-sky-50/90 to-white p-4 shadow-sm sm:p-5">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-600" aria-hidden="true">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 3.5c-4.2 5.2-6.5 8.8-6.5 11.5a6.5 6.5 0 1013 0c0-2.7-2.3-6.3-6.5-11.5z" />
                    </svg>
                  </span>
                  <div>
                    <h3 id="directive-irrigation-title" class="text-base font-bold text-sky-950 sm:text-lg">本日の潅水戦略（キヌヒカリ健苗育成ルート）</h3>
                    <p id="directive-irrigation-route" class="mt-1 text-xs text-slate-500">底面給水 · 根の垂直誘導 · 夕方軽乾 → 夜間水分ストレス</p>
                  </div>
                </div>
                <span id="directive-irrigation-avoid" class="shrink-0 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-sky-800">過湿＝徒長禁止</span>
              </div>

              <ol id="directive-irrigation-timeline" class="relative mt-5 space-y-0 pl-1">
                <li class="relative flex gap-4 pb-6 before:absolute before:left-[15px] before:top-8 before:h-[calc(100%-2rem)] before:w-px before:bg-gradient-to-b before:from-sky-300 before:to-sky-100 last:pb-0 last:before:hidden">
                  <div class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-sky-300 bg-white font-mono text-[10px] font-bold text-sky-800 shadow-sm">AM</div>
                  <div class="min-w-0 flex-1 rounded-lg border border-sky-200 bg-white p-3 shadow-sm sm:p-4">
                    <div class="flex flex-wrap items-center gap-2">
                      <time id="directive-water-morning-time" datetime="05:00" class="rounded bg-sky-100 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-sky-900">05:00</time>
                      <span id="directive-water-morning-tag" class="rounded border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-sky-800">メイン潅水</span>
                      <span id="directive-water-morning-volume" class="font-mono text-xs font-semibold text-slate-900">1.0〜1.2L/箱</span>
                    </div>
                    <p id="directive-water-morning-body" class="mt-2 text-sm leading-relaxed text-slate-600">底から滴るまで与え、根を真下へ誘導せよ。</p>
                    <div class="mt-3">
                      <div class="flex items-center justify-between text-[10px] text-slate-500">
                        <span>実行深度（推定充足）</span>
                        <span class="font-mono text-sky-600">100%</span>
                      </div>
                      <div class="mt-1 h-2 overflow-hidden rounded-full bg-slate-200" role="presentation">
                        <div class="h-full w-full rounded-full bg-gradient-to-r from-sky-700 to-sky-400"></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="relative flex gap-4">
                  <div class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-cyan-300 bg-white font-mono text-[10px] font-bold text-cyan-800 shadow-sm">PM</div>
                  <div class="min-w-0 flex-1 rounded-lg border border-cyan-200 bg-white p-3 shadow-sm sm:p-4">
                    <div class="flex flex-wrap items-center gap-2">
                      <time id="directive-water-afternoon-time" datetime="14:00" class="rounded bg-cyan-50 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-cyan-900">14:00</time>
                      <span id="directive-water-afternoon-tag" class="rounded border border-cyan-200 bg-cyan-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-cyan-800">サポート潅水</span>
                      <span id="directive-water-afternoon-volume" class="font-mono text-xs font-semibold text-slate-900">0.2〜0.5L/箱</span>
                      <span id="directive-water-afternoon-condition" class="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600">乾きやすい際のみ</span>
                    </div>
                    <p id="directive-water-afternoon-body" class="mt-2 text-sm leading-relaxed text-slate-600">夕方に表面が白く乾く状態を作り出し、夜間の水分ストレスで強靭な根張りを実現せよ。<span class="font-semibold text-cyan-800">過湿による徒長を絶対回避。</span></p>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <span class="inline-flex items-center gap-1 rounded-md border border-cyan-200 bg-cyan-50 px-2 py-1 font-mono text-[10px] text-cyan-900">
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        表面軽乾
                      </span>
                      <span class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] text-slate-600">
                        条件付き実行
                      </span>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div id="directive-footer-cta" class="relative flex flex-col gap-2 border-t border-slate-200 bg-white px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p class="font-mono text-[10px] uppercase tracking-wider text-slate-500">Execute in order · 換気 → 朝潅水 → 夕方乾燥評価 → 条件付きサポート</p>
            <span class="font-mono text-[10px] text-slate-400">IDs: daily-directive-panel · directive-*</span>
          </div>
        </article>
      </section>

      <!-- Left column -->
      <section id="column-visual" class="space-y-6 xl:col-span-7">
        <!-- Nursery map -->
        <article id="nursery-map-panel" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 id="nursery-map-heading" class="text-lg font-semibold text-slate-900">令和8年産 水稲苗箱配置図（詳細）</h2>
              <p id="nursery-map-caption" class="mt-0.5 text-xs text-slate-500">ハウス内育苗 · 手書き配置の意図をデジタルで精緻化 · 各ブロックに品種IDを付与</p>
            </div>
            <div id="nursery-map-legend" class="flex flex-wrap gap-2 font-mono text-[10px]">
              <span id="legend-kinu" class="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900">KIN — キヌヒカリ</span>
              <span id="legend-koshi" class="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-900">KOS — コシヒカリ</span>
              <span id="legend-mizu" class="rounded-full border border-sky-200 bg-sky-50 px-2 py-1 text-sky-900">MIZ — みずかがみ</span>
              <span id="legend-empty" class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">— 予備・通路</span>
            </div>
          </div>
          <div class="p-4 sm:p-6">
            <div id="nursery-layout" class="relative overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
              <!-- Schematic greenhouse grid -->
              <div class="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <span>入口（西）</span>
                <span>ハウス長手 24m</span>
                <span>東側 給水</span>
              </div>
              <div class="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-12 min-w-[520px]">
                <!-- Row A -->
                <div id="tray-KIN-A1" class="group relative flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm ring-1 ring-amber-100" title="キヌヒカリ A列">
                  <span class="font-mono text-[9px] text-amber-900">KIN-A1</span>
                  <span class="text-[8px] text-slate-500">×18</span>
                </div>
                <div id="tray-KIN-A2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/90">
                  <span class="font-mono text-[9px] text-amber-900">KIN-A2</span>
                  <span class="text-[8px] text-slate-500">×18</span>
                </div>
                <div id="tray-KOS-B1" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50">
                  <span class="font-mono text-[9px] text-emerald-800">KOS-B1</span>
                  <span class="text-[8px] text-slate-500">×15</span>
                </div>
                <div id="tray-KOS-B2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50/80">
                  <span class="font-mono text-[9px] text-emerald-800">KOS-B2</span>
                  <span class="text-[8px] text-slate-500">×15</span>
                </div>
                <div id="tray-MIZ-C1" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50">
                  <span class="font-mono text-[9px] text-sky-800">MIZ-C1</span>
                  <span class="text-[8px] text-slate-500">×14</span>
                </div>
                <div id="tray-MIZ-C2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50/80">
                  <span class="font-mono text-[9px] text-sky-800">MIZ-C2</span>
                  <span class="text-[8px] text-slate-500">×14</span>
                </div>
                <div id="tray-KIN-A3" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/80">
                  <span class="font-mono text-[9px] text-amber-900">KIN-A3</span>
                  <span class="text-[8px] text-slate-500">×18</span>
                </div>
                <div id="tray-KIN-A4" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/70">
                  <span class="font-mono text-[9px] text-amber-900">KIN-A4</span>
                  <span class="text-[8px] text-slate-500">×18</span>
                </div>
                <!-- Row B -->
                <div id="tray-KIN-B1" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                  <span class="font-mono text-[9px] text-amber-900">KIN-B1</span>
                  <span class="text-[8px] text-slate-500">×18</span>
                </div>
                <div id="tray-KIN-B2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/80">
                  <span class="font-mono text-[9px] text-amber-900">KIN-B2</span>
                  <span class="text-[8px] text-slate-500">×18</span>
                </div>
                <div id="tray-KOS-C1" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50/80">
                  <span class="font-mono text-[9px] text-emerald-800">KOS-C1</span>
                  <span class="text-[8px] text-slate-500">×15</span>
                </div>
                <div id="tray-KOS-C2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50/70">
                  <span class="font-mono text-[9px] text-emerald-800">KOS-C2</span>
                  <span class="text-[8px] text-slate-500">×15</span>
                </div>
                <div id="tray-MIZ-D1" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50/80">
                  <span class="font-mono text-[9px] text-sky-800">MIZ-D1</span>
                  <span class="text-[8px] text-slate-500">×14</span>
                </div>
                <div id="tray-MIZ-D2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50/70">
                  <span class="font-mono text-[9px] text-sky-800">MIZ-D2</span>
                  <span class="text-[8px] text-slate-500">×14</span>
                </div>
                <div id="tray-RSV-01" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-white">
                  <span class="font-mono text-[9px] text-slate-500">RSV</span>
                  <span class="text-[8px] text-slate-500">予備</span>
                </div>
                <div id="tray-RSV-02" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-white">
                  <span class="font-mono text-[9px] text-slate-500">RSV</span>
                  <span class="text-[8px] text-slate-500">予備</span>
                </div>
                <!-- Row C walkway strip -->
                <div id="tray-aisle-N" class="col-span-12 my-1 flex items-center justify-center rounded border border-slate-200 bg-slate-100 py-1.5 font-mono text-[9px] text-slate-600">作業通路 · 灌水・夜間加温ライン</div>
                <!-- Row D -->
                <div id="tray-KIN-C1" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm ring-1 ring-amber-100">
                  <span class="font-mono text-[9px] text-amber-900">KIN-C1</span>
                  <span class="text-[8px] text-slate-500">主力帯</span>
                </div>
                <div id="tray-KIN-C2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/90">
                  <span class="font-mono text-[9px] text-amber-900">KIN-C2</span>
                  <span class="text-[8px] text-slate-500">主力帯</span>
                </div>
                <div id="tray-KOS-D1" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50">
                  <span class="font-mono text-[9px] text-emerald-800">KOS-D1</span>
                  <span class="text-[8px] text-slate-500">×15</span>
                </div>
                <div id="tray-KOS-D2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-emerald-200 bg-emerald-50/80">
                  <span class="font-mono text-[9px] text-emerald-800">KOS-D2</span>
                  <span class="text-[8px] text-slate-500">×15</span>
                </div>
                <div id="tray-MIZ-E1" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50">
                  <span class="font-mono text-[9px] text-sky-800">MIZ-E1</span>
                  <span class="text-[8px] text-slate-500">×14</span>
                </div>
                <div id="tray-MIZ-E2" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-sky-200 bg-sky-50/80">
                  <span class="font-mono text-[9px] text-sky-800">MIZ-E2</span>
                  <span class="text-[8px] text-slate-500">×14</span>
                </div>
                <div id="tray-KIN-C3" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/80">
                  <span class="font-mono text-[9px] text-amber-900">KIN-C3</span>
                  <span class="text-[8px] text-slate-500">×18</span>
                </div>
                <div id="tray-KIN-C4" class="flex aspect-[4/3] flex-col items-center justify-center rounded border border-amber-200 bg-amber-50/70">
                  <span class="font-mono text-[9px] text-amber-900">KIN-C4</span>
                  <span class="text-[8px] text-slate-500">×18</span>
                </div>
              </div>
              <p id="nursery-map-note" class="mt-4 text-center text-[11px] leading-relaxed text-slate-600">
                <span class="font-semibold text-amber-700">KIN</span> は鮒寿司ブランドの中核品種として西側高温部に偏在配置。
                <span class="font-semibold text-emerald-700">KOS</span> は中温安定帯、<span class="font-semibold text-sky-700">MIZ</span> は東側加湿に強い。
              </p>
            </div>
          </div>
        </article>

        <!-- Visual operation log -->
        <article id="visual-log-panel" class="rounded-2xl border border-slate-200 bg-white shadow-md">
          <div class="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 id="visual-log-heading" class="text-lg font-semibold text-slate-900">作業工程ビジュアルログ</h2>
            <p id="visual-log-caption" class="mt-0.5 text-xs text-slate-500">フェーズごとの現場記録 · 進捗と証跡を一枚に統合</p>
          </div>
          <div id="visual-log-list" class="divide-y divide-slate-100">
            <div id="phase-seed" class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <div id="phase-seed-thumb" class="relative h-40 w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:h-36 sm:w-52">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-100/90 via-slate-50 to-white" aria-hidden="true"></div>
                <div class="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span class="text-xs text-slate-500">現場写真スロット</span>
                </div>
                <span id="phase-seed-badge" class="absolute left-2 top-2 rounded bg-emerald-600 px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-sm">PH-01</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 id="phase-seed-title" class="font-semibold text-slate-900">浸種・催芽</h3>
                  <span id="phase-seed-date" class="font-mono text-xs text-slate-500">2026-04-02 — 04-05</span>
                </div>
                <p id="phase-seed-desc" class="mt-1 text-sm text-slate-600">品種別浸漬時間の微調整。キヌ帯は発熱監視ログを別紙連携済み。</p>
                <div class="mt-4">
                  <div class="flex items-center justify-between text-xs">
                    <span id="phase-seed-label" class="text-slate-500">フェーズ進捗</span>
                    <span id="phase-seed-pct" class="font-mono font-medium text-emerald-600">100%</span>
                  </div>
                  <div id="phase-seed-bar" class="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div id="phase-seed-bar-fill" class="h-full w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                  </div>
                </div>
              </div>
            </div>

            <div id="phase-nursery" class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <div id="phase-nursery-thumb" class="relative h-40 w-full shrink-0 overflow-hidden rounded-xl border border-amber-200 bg-amber-50/50 sm:h-36 sm:w-52">
                <div class="absolute inset-0 bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-white" aria-hidden="true"></div>
                <div class="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span class="text-xs text-amber-800/70">キヌ主力帯</span>
                </div>
                <span id="phase-nursery-badge" class="absolute left-2 top-2 rounded bg-amber-500 px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-sm">PH-02</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 id="phase-nursery-title" class="font-semibold text-slate-900">育苗ハウス配置・潅水校正</h3>
                  <span id="phase-nursery-date" class="font-mono text-xs text-slate-500">2026-04-06 — 04-12</span>
                </div>
                <p id="phase-nursery-desc" class="mt-1 text-sm text-slate-600">配置図に沿った再配置と、ゾーン別潅水量の校正。KIN-C 帯は黄金色ライン監査対象。</p>
                <div class="mt-4">
                  <div class="flex items-center justify-between text-xs">
                    <span id="phase-nursery-label" class="text-slate-500">フェーズ進捗</span>
                    <span id="phase-nursery-pct" class="font-mono font-medium text-amber-600">86%</span>
                  </div>
                  <div id="phase-nursery-bar" class="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div id="phase-nursery-bar-fill" class="h-[100%] w-[86%] rounded-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            <div id="phase-field" class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
              <div id="phase-field-thumb" class="relative h-40 w-full shrink-0 overflow-hidden rounded-xl border border-sky-200 bg-sky-50/50 sm:h-36 sm:w-52">
                <div class="absolute inset-0 bg-gradient-to-br from-sky-100/90 via-slate-50 to-white" aria-hidden="true"></div>
                <div class="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span class="text-xs text-sky-800/60">圃場・水面</span>
                </div>
                <span id="phase-field-badge" class="absolute left-2 top-2 rounded bg-sky-600 px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-sm">PH-03</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 id="phase-field-title" class="font-semibold text-slate-900">寄せ植え・本田準備</h3>
                  <span id="phase-field-date" class="font-mono text-xs text-slate-500">2026-04-14 —</span>
                </div>
                <p id="phase-field-desc" class="mt-1 text-sm text-slate-600">水管理と同時進行で、法務・減収リスクアラートと連動させる。</p>
                <div class="mt-4">
                  <div class="flex items-center justify-between text-xs">
                    <span id="phase-field-label" class="text-slate-500">フェーズ進捗</span>
                    <span id="phase-field-pct" class="font-mono font-medium text-sky-600">34%</span>
                  </div>
                  <div id="phase-field-bar" class="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div id="phase-field-bar-fill" class="h-[100%] w-[34%] rounded-full bg-gradient-to-r from-sky-600 to-sky-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Right column -->
      <aside id="column-data" class="space-y-6 xl:col-span-5">
        <!-- Variety progress -->
        <article id="variety-progress-panel" class="rounded-2xl border border-slate-200 bg-white shadow-md">
          <div class="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 id="variety-progress-heading" class="text-lg font-semibold text-slate-900">令和8年 品種別作付進捗</h2>
            <p id="variety-progress-caption" class="mt-0.5 text-xs text-slate-500">作付台帳連携プレビュー · 相対比率は面積ベース</p>
          </div>
          <div id="variety-progress-list" class="space-y-5 p-5 sm:p-6">
            <!-- Kinuhikari — hero -->
            <div id="variety-card-kinu" class="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-4 shadow-sm ring-1 ring-amber-100">
              <div class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-200/40 blur-2xl" aria-hidden="true"></div>
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p id="variety-kinu-name" class="text-lg font-bold text-amber-950">キヌヒカリ</p>
                  <p id="variety-kinu-role" class="mt-0.5 text-xs text-amber-800/80">ブランド中核 · 鮒寿司の命</p>
                </div>
                <span id="variety-kinu-priority" class="shrink-0 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-amber-900">Priority A</span>
              </div>
              <dl id="variety-kinu-stats" class="mt-4 grid grid-cols-3 gap-3 text-center sm:gap-4">
                <div id="kinu-stat-area" class="rounded-lg border border-amber-100 bg-white/80 px-2 py-2 shadow-sm">
                  <dt class="font-mono text-[10px] uppercase text-slate-500">面積</dt>
                  <dd id="kinu-value-area" class="font-mono text-lg font-semibold tabular-nums text-slate-900">135.3<span class="text-sm font-normal text-slate-500">a</span></dd>
                </div>
                <div id="kinu-stat-tray" class="rounded-lg border border-amber-100 bg-white/80 px-2 py-2 shadow-sm">
                  <dt class="font-mono text-[10px] uppercase text-slate-500">苗箱</dt>
                  <dd id="kinu-value-tray" class="font-mono text-lg font-semibold tabular-nums text-amber-800">245<span class="text-sm font-normal text-slate-500">箱</span></dd>
                </div>
                <div id="kinu-stat-bags" class="rounded-lg border border-amber-100 bg-white/80 px-2 py-2 shadow-sm">
                  <dt class="font-mono text-[10px] uppercase text-slate-500">見込</dt>
                  <dd id="kinu-value-bags" class="font-mono text-lg font-semibold tabular-nums text-amber-700">203<span class="text-sm font-normal text-slate-500">袋</span></dd>
                </div>
              </dl>
              <div class="mt-4">
                <div class="flex items-center justify-between text-xs">
                  <span id="kinu-progress-label" class="text-slate-500">作付進捗（面積基準）</span>
                  <span id="kinu-progress-pct" class="font-mono text-amber-700">92%</span>
                </div>
                <div id="kinu-progress-track" class="mt-2 h-3 overflow-hidden rounded-full bg-slate-200 ring-1 ring-amber-200/60">
                  <div id="kinu-progress" class="h-full w-[92%] rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 shadow-sm"></div>
                </div>
              </div>
            </div>

            <!-- Koshihikari -->
            <div id="variety-card-koshi" class="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-sm">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p id="variety-koshi-name" class="font-semibold text-emerald-900">コシヒカリ</p>
                <span id="variety-koshi-tag" class="font-mono text-[10px] text-slate-500">安定品目</span>
              </div>
              <dl id="variety-koshi-stats" class="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
                <div><span class="font-mono text-slate-500">面積</span><br /><span id="koshi-value-area" class="font-mono font-semibold text-slate-900">112.2a</span></div>
                <div><span class="font-mono text-slate-500">苗箱</span><br /><span id="koshi-value-tray" class="font-mono font-semibold text-emerald-700">203箱</span></div>
                <div><span class="font-mono text-slate-500">見込</span><br /><span id="koshi-value-bags" class="font-mono font-semibold text-emerald-800">168袋</span></div>
              </dl>
              <div class="mt-4">
                <div class="flex justify-between text-xs">
                  <span id="koshi-progress-label" class="text-slate-500">作付進捗</span>
                  <span id="koshi-progress-pct" class="font-mono text-emerald-600">78%</span>
                </div>
                <div id="koshi-progress-track" class="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div id="koshi-progress" class="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                </div>
              </div>
            </div>

            <!-- Mizukagami -->
            <div id="variety-card-mizu" class="rounded-xl border border-sky-200 bg-sky-50/30 p-4 shadow-sm">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p id="variety-mizu-name" class="font-semibold text-sky-900">みずかがみ</p>
                <span id="variety-mizu-tag" class="font-mono text-[10px] text-slate-500">水熱適応</span>
              </div>
              <dl id="variety-mizu-stats" class="mt-3 grid grid-cols-3 gap-3 text-center text-sm">
                <div><span class="font-mono text-slate-500">面積</span><br /><span id="mizu-value-area" class="font-mono font-semibold text-slate-900">103.8a</span></div>
                <div><span class="font-mono text-slate-500">苗箱</span><br /><span id="mizu-value-tray" class="font-mono font-semibold text-sky-700">189箱</span></div>
                <div><span class="font-mono text-slate-500">見込</span><br /><span id="mizu-value-bags" class="font-mono font-semibold text-sky-800">156袋</span></div>
              </dl>
              <div class="mt-4">
                <div class="flex justify-between text-xs">
                  <span id="mizu-progress-label" class="text-slate-500">作付進捗</span>
                  <span id="mizu-progress-pct" class="font-mono text-sky-600">71%</span>
                </div>
                <div id="mizu-progress-track" class="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div id="mizu-progress" class="h-full w-[71%] rounded-full bg-gradient-to-r from-sky-600 to-sky-400"></div>
                </div>
              </div>
            </div>

            <!-- Stacked comparison mini chart -->
            <div id="variety-mix-chart" class="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <p id="variety-mix-heading" class="font-mono text-[10px] uppercase tracking-wider text-slate-500">品種構成比（面積）</p>
              <div id="variety-mix-bar" class="mt-3 flex h-4 w-full overflow-hidden rounded-full ring-1 ring-slate-200">
                <div id="mix-segment-kinu" class="bg-gradient-to-b from-amber-500 to-amber-600" style="width:38.5%" title="キヌヒカリ"></div>
                <div id="mix-segment-koshi" class="bg-gradient-to-b from-emerald-600 to-emerald-500" style="width:31.9%" title="コシヒカリ"></div>
                <div id="mix-segment-mizu" class="bg-gradient-to-b from-sky-600 to-sky-500" style="width:29.6%" title="みずかがみ"></div>
              </div>
              <ul id="variety-mix-legend" class="mt-3 flex flex-wrap gap-4 font-mono text-[10px] text-slate-600">
                <li id="mix-legend-kinu"><span class="text-amber-600">■</span> キヌ 38.5%</li>
                <li id="mix-legend-koshi"><span class="text-emerald-600">■</span> コシ 31.9%</li>
                <li id="mix-legend-mizu"><span class="text-sky-600">■</span> みず 29.6%</li>
              </ul>
            </div>
          </div>
        </article>

        <!-- Risk center -->
        <article id="risk-center-panel" class="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50/80 to-white shadow-md">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-red-100 px-5 py-4 sm:px-6">
            <div>
              <h2 id="risk-center-heading" class="text-lg font-semibold text-slate-900">リスク管理センター</h2>
              <p id="risk-center-caption" class="mt-0.5 text-xs text-slate-500">法務 · 行政 · 経営アラートの統合ビュー</p>
            </div>
            <span id="risk-center-count" class="rounded-full bg-red-100 px-3 py-1 font-mono text-xs font-semibold text-red-800 ring-1 ring-red-200">Open 3</span>
          </div>
          <ul id="risk-alert-list" class="divide-y divide-slate-100">
            <li id="risk-alert-legal" class="flex gap-4 p-5 sm:p-6">
              <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600" aria-hidden="true">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span id="risk-alert-legal-severity" class="rounded bg-red-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-red-800">Legal</span>
                  <h3 id="risk-alert-legal-title" class="font-medium text-slate-900">用水関連の定期届出 · 期限 proximity</h3>
                </div>
                <p id="risk-alert-legal-desc" class="mt-1 text-sm text-slate-600">管轄へ提出済み書類の写しと、圃場GISポリゴンの整合が未確認。水路上の重複表記を今週中に是正。</p>
                <p id="risk-alert-legal-meta" class="mt-2 font-mono text-[10px] text-slate-500">Due: 2026-04-25 · Owner: 管理課</p>
              </div>
            </li>
            <li id="risk-alert-admin" class="flex gap-4 p-5 sm:p-6">
              <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700" aria-hidden="true">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span id="risk-alert-admin-severity" class="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-900">Admin</span>
                  <h3 id="risk-alert-admin-title" class="font-medium text-slate-900">JA出荷カレンダーと育苗計画のズレ</h3>
                </div>
                <p id="risk-alert-admin-desc" class="mt-1 text-sm text-slate-600">みずかがみ寄せ植え開始が行政サンプル採取日と隣接。調整しないと検体の代表値がブレる。</p>
                <p id="risk-alert-admin-meta" class="mt-2 font-mono text-[10px] text-slate-500">連携先: JA品質管理 · 要MTG</p>
              </div>
            </li>
            <li id="risk-alert-business" class="flex gap-4 p-5 sm:p-6">
              <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600" aria-hidden="true">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span id="risk-alert-business-severity" class="rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-sky-800">Biz</span>
                  <h3 id="risk-alert-business-title" class="font-medium text-slate-900">鮒寿司向けキヌの「袋数」見通しギャップ</h3>
                </div>
                <p id="risk-alert-business-desc" class="mt-1 text-sm text-slate-600">見込203袋に対し、プレミアム契約需要が+7%推移。単価防衛のため中食向けアロケーションを再計算。</p>
                <p id="risk-alert-business-meta" class="mt-2 font-mono text-[10px] text-slate-500">Sensitivity: High · KPI: 袋あたり粗利</p>
              </div>
            </li>
          </ul>
        </article>

        <!-- AI insights -->
        <article id="ai-insights-panel" class="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 shadow-md">
          <div class="border-b border-indigo-100 px-5 py-4 sm:px-6">
            <div class="flex flex-wrap items-center gap-3">
              <span id="ai-insights-badge" class="rounded-lg bg-indigo-100 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-800">AI Insight</span>
              <h2 id="ai-insights-heading" class="text-lg font-semibold text-slate-900">明日のアクション</h2>
            </div>
            <p id="ai-insights-caption" class="mt-1 text-xs text-slate-500">現場センサー・台帳・気象を統合した優先度付き提言</p>
          </div>
          <ol id="ai-action-list" class="list-none space-y-0 divide-y divide-slate-100 p-5 sm:p-6">
            <li id="ai-action-01" class="flex gap-4 pb-5">
              <span id="ai-action-01-rank" class="font-mono text-sm font-bold text-indigo-600">01</span>
              <div>
                <h3 id="ai-action-01-title" class="font-medium text-slate-900">KIN-C 帯の夜間最低温度が設定より -1.2°C</h3>
                <p id="ai-action-01-body" class="mt-1 text-sm leading-relaxed text-slate-600">22:00–02:00 に加温が弱まるパターンを検知。設定のヒステリシスを 0.6°C に、または西ブロックのみ短時間サイクルに変更。</p>
                <p id="ai-action-01-meta" class="mt-2 font-mono text-[10px] text-indigo-700">Impact: 発葉ばらつき · Confidence 0.84</p>
              </div>
            </li>
            <li id="ai-action-02" class="flex gap-4 py-5">
              <span id="ai-action-02-rank" class="font-mono text-sm font-bold text-indigo-600">02</span>
              <div>
                <h3 id="ai-action-02-title" class="font-medium text-slate-900">圃場 PH-03 の灌水を午前に前倒し</h3>
                <p id="ai-action-02-body" class="mt-1 text-sm leading-relaxed text-slate-600">降水確率が夕方に上昇。表面乾燥と夜間低温の複合リスクを下げるため、午前の潅水を +15%（みずブロックのみ）。</p>
                <p id="ai-action-02-meta" class="mt-2 font-mono text-[10px] text-indigo-700">Weather tie-in · Confidence 0.76</p>
              </div>
            </li>
            <li id="ai-action-03" class="flex gap-4 pt-5">
              <span id="ai-action-03-rank" class="font-mono text-sm font-bold text-indigo-600">03</span>
              <div>
                <h3 id="ai-action-03-title" class="font-medium text-slate-900">リスク Open3 を「現場朝礼」で一枚に要約</h3>
                <p id="ai-action-03-body" class="mt-1 text-sm leading-relaxed text-slate-600">法務・行政・経営を分けず、現場が動ける順に並べ替えたチェックリストを QR で共有（所要 6 分）。</p>
                <p id="ai-action-03-meta" class="mt-2 font-mono text-[10px] text-indigo-700">Ops playbook · Confidence 0.71</p>
              </div>
            </li>
          </ol>
        </article>
      </aside>
    </main>

    <footer id="report-footer" class="mt-10 border-t border-slate-200 pt-6 text-center font-mono text-[10px] text-slate-500">
      <p id="report-footer-copy">AI_Dashboard_2026 · Single-file mock · IDs are stable hooks for API binding</p>
    </footer>
  </div>
  <script>
    (function () {
      var el = document.getElementById('report-date');
      if (!el) return;
      var weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      function pad(n) {
        return (n < 10 ? '0' : '') + n;
      }
      function tick() {
        var d = new Date();
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        var day = d.getDate();
        var w = weekdays[d.getDay()];
        var h = d.getHours();
        var min = d.getMinutes();
        var s = d.getSeconds();
        el.setAttribute('datetime', y + '-' + pad(m) + '-' + pad(day) + 'T' + pad(h) + ':' + pad(min) + ':' + pad(s));
        el.textContent = y + '年' + m + '月' + day + '日（' + w + '） ' + pad(h) + ':' + pad(min) + ':' + pad(s);
      }
      tick();
      setInterval(tick, 1000);
    })();
  </script>
</body>
</html>
