"use client";

import { useWeatherStore } from "@/stores/weatherStore";
import { WeatherIcon } from "./WeatherIcon";
import { getDayName } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function DailyForecast() {
  const { weatherData, preferences } = useWeatherStore();
  const { daily } = weatherData;

  if (!daily.length) {
    return (
      <div className="card p-4 space-y-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            <div className="w-12 h-5 skeleton rounded" />
            <div className="w-8 h-8 skeleton rounded-full" />
            <div className="w-16 h-5 skeleton rounded" />
          </div>
        ))}
      </div>
    );
  }

  const temps = daily.map((d) =>
    preferences.units.temperature === "celsius" ? d.maxTempC : d.maxTempF
  );
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  return (
    <div className="card p-4">
      <div className="space-y-1">
        {daily.map((day, dayIndex) => {
          const max =
            preferences.units.temperature === "celsius"
              ? day.maxTempC
              : day.maxTempF;
          const min =
            preferences.units.temperature === "celsius"
              ? day.minTempC
              : day.minTempF;

          const barLeft = ((min - minTemp) / range) * 100;
          const barRight = ((maxTemp - max) / range) * 100;
          const barWidth = 100 - barLeft - barRight;

          return (
            <div
              key={day.date}
              className="flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className={cn(
                "w-12 text-sm font-medium flex-shrink-0",
                dayIndex === 0 ? "text-white" : "text-muted"
              )}>
                {getDayName(day.date)}
              </span>

              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <WeatherIcon condition={day.condition.icon} size="sm" />
              </div>

              <span className="w-8 text-right text-sm text-muted flex-shrink-0">
                {Math.round(min)}°
              </span>

              <div className="flex-1 relative h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-orange-400"
                  style={{
                    left: `${Math.min(Math.max(barLeft, 0), 100)}%`,
                    right: `${Math.min(Math.max(barRight, 0), 100)}%`,
                  }}
                />
              </div>

              <span className="w-8 text-sm font-medium text-white flex-shrink-0">
                {Math.round(max)}°
              </span>

              {day.precipProbability > 0 && (
                <div className="flex items-center gap-1 w-10 flex-shrink-0 justify-end">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                  <span className="text-xs text-blue-400 font-medium">
                    {day.precipProbability}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
