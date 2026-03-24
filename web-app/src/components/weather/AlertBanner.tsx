"use client";

import { useWeatherStore } from "@/stores/weatherStore";
import { cn } from "@/lib/utils";

export function AlertBanner() {
  const { weatherData } = useWeatherStore();
  const { alerts } = weatherData;

  if (!alerts.length) return null;

  const alert = alerts[0];
  const severityStyles = {
    extreme: "from-red-600 to-red-700 border-red-500/30",
    severe: "from-orange-600 to-orange-700 border-orange-500/30",
    moderate: "from-yellow-600 to-yellow-700 border-yellow-500/30",
    minor: "from-blue-600 to-blue-700 border-blue-500/30",
  };

  const severityIcons = {
    extreme: "🚨",
    severe: "⚠️",
    moderate: "⚡",
    minor: "ℹ️",
  };

  return (
    <div className="px-5">
      <div
        className={cn(
          "p-4 rounded-2xl bg-gradient-to-r border shadow-lg",
          severityStyles[alert.severity]
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{severityIcons[alert.severity]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm">{alert.event}</h3>
            </div>
            <p className="text-white/90 text-xs mt-1 line-clamp-2">
              {alert.headline}
            </p>
            {alert.expires && (
              <div className="flex items-center gap-1.5 mt-2">
                <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/60 text-xs">
                  Until {new Date(alert.expires).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>
          <button className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 hover:bg-white/30 transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
