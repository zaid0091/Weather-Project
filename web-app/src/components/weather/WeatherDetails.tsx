"use client";

import { useWeatherStore } from "@/stores/weatherStore";
import { formatWindSpeed, getUVIndexLevel, getAQICategory, getWindDirection } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  accentColor: string;
}

function DetailItem({ icon, label, value, subValue, accentColor }: DetailItemProps) {
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={cn("opacity-60", accentColor)}>{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className={cn("text-xl font-semibold", accentColor)}>{value}</span>
        {subValue && (
          <span className="text-xs text-muted mb-0.5">{subValue}</span>
        )}
      </div>
    </div>
  );
}

export function WeatherDetails() {
  const { weatherData, preferences } = useWeatherStore();
  const { current } = weatherData;

  if (!current) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card p-4 h-24">
            <div className="animate-pulse space-y-2">
              <div className="w-16 h-3 bg-white/10 rounded" />
              <div className="w-20 h-6 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { current: weather } = current;
  const uvInfo = getUVIndexLevel(weather.uv);
  const aqiInfo = weather.aqi ? getAQICategory(weather.aqi.usEpaIndex) : null;
  const windDir = getWindDirection(weather.windDegree);

  const details: DetailItemProps[] = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      label: "Humidity",
      value: `${weather.humidity}%`,
      subValue: weather.humidity > 60 ? "Humid" : weather.humidity < 30 ? "Dry" : "Comfortable",
      accentColor: "text-cyan-400",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      ),
      label: "Wind",
      value: formatWindSpeed(weather.windMph, "mph"),
      subValue: windDir,
      accentColor: "text-teal-400",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      label: "UV Index",
      value: `${weather.uv}`,
      subValue: uvInfo.label,
      accentColor: "text-yellow-400",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: "Pressure",
      value: `${weather.pressureIn.toFixed(2)} in`,
      accentColor: "text-purple-400",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      label: "Visibility",
      value: `${Math.round(weather.visibilityMiles)} mi`,
      accentColor: "text-indigo-400",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      label: "Dew Point",
      value: `${Math.round(preferences.units.temperature === "celsius" ? weather.dewPointC : weather.dewPointF)}°`,
      subValue: weather.dewPointC < 10 ? "Dry" : weather.dewPointC > 20 ? "Muggy" : "Comfortable",
      accentColor: "text-emerald-400",
    },
  ];

  if (aqiInfo) {
    details.push({
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      label: "Air Quality",
      value: `${weather.aqi!.usEpaIndex}`,
      subValue: aqiInfo.label,
      accentColor: "text-green-400",
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {details.map((detail, index) => (
        <div
          key={detail.label}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <DetailItem {...detail} />
        </div>
      ))}
    </div>
  );
}
