"use client";

import { useWeatherStore } from "@/stores/weatherStore";
import { WeatherIcon } from "./WeatherIcon";

export function CurrentConditions() {
  const { weatherData, preferences } = useWeatherStore();
  const { current, lastUpdated } = weatherData;

  if (!current) {
    return (
      <div className="flex flex-col items-center py-12 animate-pulse-subtle">
        <div className="w-40 h-40 rounded-full skeleton" />
        <div className="mt-8 w-48 h-20 skeleton rounded-2xl" />
        <div className="mt-4 w-32 h-8 skeleton rounded-xl" />
      </div>
    );
  }

  const { current: weather } = current;
  const temp =
    preferences.units.temperature === "celsius"
      ? weather.tempC
      : weather.tempF;
  const highTemp =
    preferences.units.temperature === "celsius"
      ? weather.tempC + 5
      : weather.tempF + 9;
  const lowTemp =
    preferences.units.temperature === "celsius"
      ? weather.tempC - 5
      : weather.tempF - 9;
  const feelsLike =
    preferences.units.temperature === "celsius"
      ? weather.feelsLikeC
      : weather.feelsLikeF;

  return (
    <div className="flex flex-col items-center py-8 animate-fade-in-up">
      <div className="relative">
        <WeatherIcon
          condition={weather.condition?.icon || "sunny"}
          size="hero"
          className="text-white"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mt-10 text-center">
        <div className="temp-display text-white font-bold tracking-tighter">
          {Math.round(temp)}
          <span className="text-5xl text-white/60 ml-1">°</span>
        </div>
        
        <div className="mt-3 text-xl font-medium text-white/90 tracking-wide">
          {weather.condition.text}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-white/70 text-sm font-medium">
              H: {Math.round(highTemp)}°
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-white/70 text-sm font-medium">
              L: {Math.round(lowTemp)}°
            </span>
          </div>
        </div>

        <div className="mt-4 badge">
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-white/80 text-sm">
            Feels like <span className="font-semibold text-white">{Math.round(feelsLike)}°</span>
          </span>
        </div>
      </div>

      {lastUpdated && (
        <div className="mt-10 flex items-center gap-2">
          <div className="status-dot" />
          <span className="text-xs text-muted">
            Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  );
}
