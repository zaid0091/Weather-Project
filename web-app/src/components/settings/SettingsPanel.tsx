"use client";

import { useWeatherStore } from "@/stores/weatherStore";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { preferences, updateUnits, updateTheme } = useWeatherStore();

  if (!isOpen) return null;

  const handleUnitChange = (key: string, value: string) => {
    if (key === "theme") {
      updateTheme(value as "light" | "dark" | "auto" | "dynamic");
    } else {
      updateUnits({ [key]: value });
    }
  };

  const unitOptions = [
    {
      key: "temperature",
      label: "Temperature",
      currentValue: preferences.units.temperature,
      values: [
        { value: "fahrenheit" as const, label: "°F" },
        { value: "celsius" as const, label: "°C" },
      ],
    },
    {
      key: "wind",
      label: "Wind Speed",
      currentValue: preferences.units.wind,
      values: [
        { value: "mph" as const, label: "mph" },
        { value: "kph" as const, label: "km/h" },
        { value: "ms" as const, label: "m/s" },
        { value: "knots" as const, label: "knots" },
      ],
    },
    {
      key: "pressure",
      label: "Pressure",
      currentValue: preferences.units.pressure,
      values: [
        { value: "inHg" as const, label: "inHg" },
        { value: "hPa" as const, label: "hPa" },
        { value: "mb" as const, label: "mb" },
      ],
    },
  ];

  const themeOptions = [
    {
      key: "theme",
      label: "App Theme",
      currentValue: preferences.theme,
      values: [
        { value: "dynamic" as const, label: "Dynamic", icon: "🌈" },
        { value: "light" as const, label: "Light", icon: "☀️" },
        { value: "dark" as const, label: "Dark", icon: "🌙" },
        { value: "auto" as const, label: "System", icon: "⚙️" },
      ],
    },
  ];

  const notificationOptions = [
    {
      key: "severeWeather",
      label: "Severe Weather Alerts",
      description: "Get notified about dangerous conditions",
      value: preferences.notifications.severeWeather,
    },
    {
      key: "dailyForecast",
      label: "Daily Forecast",
      description: "Morning weather summary",
      value: preferences.notifications.dailyForecast,
    },
    {
      key: "rainAlert",
      label: "Rain Alerts",
      description: "Know when rain is coming",
      value: preferences.notifications.rainAlert,
    },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a12] shadow-2xl animate-fade-in-right overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="px-6 pt-6 pb-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <p className="text-sm text-muted mt-1">Customize your experience</p>
              </div>
              <button
                onClick={onClose}
                className="icon-btn"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="p-6 space-y-8">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Units</h3>
                <div className="space-y-4">
                  {unitOptions.map((option) => (
                    <div key={option.key} className="card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-white">{option.label}</span>
                        <span className="text-xs text-muted">{option.currentValue}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {option.values.map((v) => {
                          const isSelected = option.currentValue === v.value;
                          return (
                            <button
                              key={v.value}
                              onClick={() => handleUnitChange(option.key, v.value)}
                              className={cn(
                                "py-2.5 px-4 rounded-xl text-sm font-medium transition-all",
                                isSelected
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                                  : "bg-white/5 text-muted hover:bg-white/10"
                              )}
                            >
                              {v.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Appearance</h3>
                <div className="space-y-3">
                  {themeOptions.map((option) => (
                    <div key={option.key} className="card p-4">
                      <div className="text-sm font-medium text-white mb-3">{option.label}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {option.values.map((v) => {
                          const isSelected = option.currentValue === v.value;
                          return (
                            <button
                              key={v.value}
                              onClick={() => handleUnitChange(option.key, v.value)}
                              className={cn(
                                "py-3 px-4 rounded-xl transition-all flex items-center gap-3",
                                isSelected
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                                  : "bg-white/5 text-muted hover:bg-white/10"
                              )}
                            >
                              <span className="text-lg">{v.icon}</span>
                              <span className="text-sm font-medium">{v.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Notifications</h3>
                <div className="space-y-3">
                  {notificationOptions.map((option) => (
                    <div
                      key={option.key}
                      className="card p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{option.label}</div>
                        <div className="text-xs text-muted mt-0.5">{option.description}</div>
                      </div>
                      <button
                        className={cn(
                          "w-12 h-7 rounded-full transition-all duration-300 relative",
                          option.value ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-white/10"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300",
                            option.value ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">About</h3>
                <div className="card p-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div className="text-xl font-bold text-white">SkyScope</div>
                  <div className="text-sm text-muted mt-1">Version 1.0.0</div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-muted">
                      Global Weather Forecast Application
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
