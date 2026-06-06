function SeedlingRow({ tall }: { tall?: boolean }) {
  return (
    <div className="flex items-end justify-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          {tall ? (
            <>
              <div className="h-2 w-2.5 rounded-full bg-emerald-400/90 ring-1 ring-emerald-500/30" />
              <div className="mt-px h-5 w-0.5 rounded-full bg-gradient-to-t from-emerald-700 to-emerald-500" />
            </>
          ) : (
            <>
              <div className="h-1 w-1 rounded-full bg-emerald-500" />
              <div className="mt-px h-2 w-0.5 rounded-full bg-emerald-600" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function GreenhousePhaseDiagram({ className = "mt-4" }: { className?: string }) {
  return (
    <div
      id="directive-greenhouse-diagram"
      className={`${className} rounded-xl border border-orange-100 bg-gradient-to-b from-white via-amber-50/30 to-orange-50/20 p-3 shadow-sm ring-1 ring-slate-900/[0.02] sm:p-4`}
      aria-labelledby="directive-greenhouse-diagram-heading"
    >
      <p
        id="directive-greenhouse-diagram-heading"
        className="mb-3 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
      >
        育苗ハウス断面 · 緑化期／硬化期（普及マニュアル）
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div
          id="directive-diagram-ryokka"
          className="flex flex-col rounded-lg border border-sky-200/80 bg-white/90 p-3 shadow-sm"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-emerald-800">
              緑化期
            </span>
            <span className="font-mono text-[9px] text-sky-700">青シート被覆</span>
          </div>
          <div className="relative mx-auto h-[7.5rem] w-full max-w-[11rem]">
            <div className="absolute inset-x-0 bottom-0 h-px bg-amber-800/25" aria-hidden="true" />
            <div
              className="absolute bottom-0 left-[6%] right-[6%] h-[4.25rem] rounded-t-[3.5rem] border-2 border-b-0 border-slate-300/90 bg-gradient-to-b from-amber-50/90 to-stone-100/80"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 left-[10%] right-[10%] h-[3.75rem] rounded-t-[3rem] border border-b-0 border-sky-400/70 bg-gradient-to-b from-sky-300/55 via-sky-200/40 to-sky-100/30 shadow-[inset_0_-4px_8px_rgba(56,189,248,0.15)]"
              aria-hidden="true"
              title="被覆資材（青シート）"
            />
            <div className="absolute bottom-1 left-1/2 w-[88%] -translate-x-1/2">
              <SeedlingRow />
            </div>
            <span
              className="absolute right-0 top-1 rounded border border-sky-200 bg-sky-50 px-1 py-px font-mono text-[8px] text-sky-800"
              aria-hidden="true"
            >
              シート
            </span>
          </div>
          <ul className="mt-2.5 space-y-1 text-[10px] leading-snug text-slate-600">
            <li id="directive-diagram-ryokka-day" className="rounded-md bg-orange-50/80 px-2 py-1 ring-1 ring-orange-100">
              <span className="font-semibold text-orange-800">昼:</span> 20〜25℃
              <span className="text-orange-700">（快晴時は換気！）</span>
            </li>
            <li id="directive-diagram-ryokka-night" className="rounded-md bg-indigo-50/60 px-2 py-1 ring-1 ring-indigo-100/80">
              <span className="font-semibold text-indigo-800">夜:</span> 15〜18℃
              <span className="text-indigo-700">（10℃以下にしない！）</span>
            </li>
          </ul>
        </div>

        <div
          id="directive-diagram-kouka"
          className="flex flex-col rounded-lg border border-amber-200/80 bg-white/90 p-3 shadow-sm"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-amber-900">
              硬化期
            </span>
            <span className="font-mono text-[9px] text-slate-500">被覆外し・外気慣らし</span>
          </div>
          <div className="relative mx-auto h-[7.5rem] w-full max-w-[11rem]">
            <div className="absolute inset-x-0 bottom-0 h-px bg-amber-800/25" aria-hidden="true" />
            <div
              className="absolute bottom-0 left-[6%] right-[6%] h-[4.25rem] rounded-t-[3.5rem] border-2 border-b-0 border-dashed border-slate-300/80 bg-gradient-to-b from-slate-50/90 to-stone-100/70"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-3 -right-0.5 flex h-10 w-2.5 flex-col items-center justify-center rounded-sm border border-dashed border-sky-300/80 bg-sky-100/50"
              aria-hidden="true"
              title="シートを外した状態"
            >
              <span className="h-full w-full rounded-sm bg-gradient-to-b from-sky-200/60 to-sky-300/40" />
            </div>
            <div className="absolute bottom-1 left-1/2 w-[88%] -translate-x-1/2">
              <SeedlingRow tall />
            </div>
            <span
              className="absolute left-0 top-2 max-w-[3.5rem] rounded border border-slate-200 bg-white/90 px-1 py-px text-[8px] leading-tight text-slate-500"
              aria-hidden="true"
            >
              外気
            </span>
          </div>
          <ul className="mt-2.5 space-y-1 text-[10px] leading-snug text-slate-600">
            <li id="directive-diagram-kouka-day" className="rounded-md bg-amber-50/80 px-2 py-1 ring-1 ring-amber-100">
              <span className="font-semibold text-amber-900">昼:</span> 15〜20℃
            </li>
            <li id="directive-diagram-kouka-night" className="rounded-md bg-slate-100/80 px-2 py-1 ring-1 ring-slate-200/80">
              <span className="font-semibold text-slate-700">夜:</span> 10℃以上
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
