"use client";

import { useWeatherStore } from "@/stores/weatherStore";

export function MinutelyPrecipitation() {
  const { weatherData } = useWeatherStore();
  const { minutely } = weatherData;

  if (!minutely.length) return null;

  const nextRain = minutely.find((m) => m.precipMm > 0);
  const rainStartMinute = nextRain?.minute;
  const hasRainUpcoming = rainStartMinute !== undefined && rainStartMinute <= 120;

  const rainMinutes = minutely.filter((m) => m.precipMm > 0).length;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Precipitation</span>
      </div>

      {hasRainUpcoming ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">
                Rain in <span className="text-blue-400 font-bold">{rainStartMinute} min</span>
              </div>
              <div className="text-sm text-muted">
                Expected to start soon
              </div>
            </div>
          </div>

          <div className="h-10 rounded-xl bg-white/5 overflow-hidden relative">
            <div className="absolute inset-0 flex">
              {minutely.slice(0, 60).map((minute, idx) => {
                const intensity = Math.min(minute.precipMm / 0.5, 1);
                return (
                  <div
                    key={idx}
                    className="flex-1 transition-all duration-300"
                    style={{
                      backgroundColor: intensity > 0
                        ? `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`
                        : "transparent",
                    }}
                  />
                );
              })}
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span className="text-xs text-muted">Now</span>
              <span className="text-xs text-muted">+30m</span>
              <span className="text-xs text-muted">+60m</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="text-white font-medium">No rain expected</div>
            <div className="text-sm text-muted">Clear for the next 2 hours</div>
          </div>
        </div>
      )}

      {rainMinutes > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Rain duration</span>
            <span className="text-white font-medium">{rainMinutes} minutes</span>
          </div>
        </div>
      )}
    </div>
  );
}
