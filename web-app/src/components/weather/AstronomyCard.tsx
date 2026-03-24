"use client";

import { useWeatherStore } from "@/stores/weatherStore";

export function AstronomyCard() {
  const { weatherData } = useWeatherStore();
  const { astronomy } = weatherData;

  if (!astronomy) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 skeleton rounded-full" />
            <div className="space-y-2">
              <div className="w-16 h-5 skeleton rounded" />
              <div className="w-12 h-4 skeleton rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 skeleton rounded-full" />
            <div className="space-y-2">
              <div className="w-16 h-5 skeleton rounded" />
              <div className="w-12 h-4 skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getMoonEmoji = (phase: string) => {
    const lower = phase.toLowerCase();
    if (lower.includes("new")) return "🌑";
    if (lower.includes("full")) return "🌕";
    if (lower.includes("crescent")) return lower.includes("waxing") ? "🌒" : "🌘";
    if (lower.includes("quarter")) return lower.includes("first") ? "🌓" : "🌗";
    if (lower.includes("gibbous")) return lower.includes("waxing") ? "🌔" : "🌖";
    return "🌙";
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wider mb-1">Sunrise</div>
            <div className="text-lg font-semibold text-white">{astronomy.sunrise}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted uppercase tracking-wider mb-1">Sunset</div>
            <div className="text-lg font-semibold text-white">{astronomy.sunset}</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM5.25 12a6.75 6.75 0 1113.5 0 6.75 6.75 0 01-13.5 0zM12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5zM17.625 6.375a.75.75 0 00-1.06 1.06l1.59 1.59a.75.75 0 001.061-1.06l-1.59-1.59zM6.375 17.625a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-2xl shadow-lg shadow-slate-500/20">
              {getMoonEmoji(astronomy.moonPhase)}
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-wider mb-1">Moon Phase</div>
              <div className="text-base font-medium text-white">{astronomy.moonPhase}</div>
              <div className="text-xs text-muted mt-0.5">{astronomy.moonIllumination}% illuminated</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <div className="text-xs text-muted uppercase tracking-wider mb-1">Rise</div>
              <div className="text-white/80">{astronomy.moonrise}</div>
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-wider mb-1">Set</div>
              <div className="text-white/80">{astronomy.moonset}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center">
        <div className="badge">
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white/80 text-sm">
            Day length: <span className="font-semibold text-white">{astronomy.dayLength}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
