"use client";

import { useWeatherStore } from "@/stores/weatherStore";
import { WeatherIcon } from "./WeatherIcon";
import { cn } from "@/lib/utils";

export function HourlyForecast() {
  const { weatherData, preferences } = useWeatherStore();
  const { hourly } = weatherData;

  if (!hourly.length) {
    return (
      <div className="card p-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
              <div className="w-8 h-4 skeleton rounded" />
              <div className="w-10 h-10 skeleton rounded-full" />
              <div className="w-8 h-5 skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatHour = (dateString: string, index: number) => {
    if (index === 0) return "Now";
    
    const date = new Date(dateString);
    const hour = date.getHours();
    
    if (preferences.units.timeFormat === "12h") {
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}${period}`;
    }
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div className="card p-4">
      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2">
        {hourly.slice(0, 24).map((hour, index) => {
          const temp =
            preferences.units.temperature === "celsius"
              ? hour.tempC
              : hour.tempF;
          const isNow = index === 0;

          return (
            <div
              key={hour.time}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[60px] py-3 px-2 rounded-xl transition-all duration-200 flex-shrink-0",
                isNow
                  ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                  : "hover:bg-white/5"
              )}
            >
              <span className={cn(
                "text-xs font-medium",
                isNow ? "text-white font-semibold" : "text-muted"
              )}>
                {formatHour(hour.time, index)}
              </span>

              <WeatherIcon
                condition={hour.condition.icon}
                size={isNow ? "lg" : "md"}
                className={isNow ? "text-white" : "text-white/70"}
              />

              <span className={cn(
                "text-sm font-semibold",
                isNow ? "text-white" : "text-white/80"
              )}>
                {Math.round(temp)}°
              </span>

              {hour.precipProbability > 0 && (
                <span className="text-xs text-blue-400 font-medium">
                  {hour.precipProbability}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
