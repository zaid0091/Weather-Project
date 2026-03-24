"use client";

import { useWeatherStore } from "@/stores/weatherStore";

export function AISummary() {
  const { weatherData } = useWeatherStore();
  const { summary, loading } = weatherData;

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-purple-500/20" />
          <div className="w-20 h-3 bg-white/10 rounded" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-4 bg-white/10 rounded" />
          <div className="w-3/4 h-4 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="card p-5 hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">AI Summary</span>
      </div>
      <p className="text-white/90 leading-relaxed">{summary}</p>
    </div>
  );
}
