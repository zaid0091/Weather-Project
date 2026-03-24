"use client";

import { useState, useEffect } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";

type TabId = "home" | "locations" | "map" | "alerts" | "settings";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { CurrentConditions } from "@/components/weather/CurrentConditions";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { WeatherDetails } from "@/components/weather/WeatherDetails";
import { AstronomyCard } from "@/components/weather/AstronomyCard";
import { AISummary } from "@/components/weather/AISummary";
import { MinutelyPrecipitation } from "@/components/weather/MinutelyPrecipitation";
import { AlertBanner } from "@/components/weather/AlertBanner";
import { useWeatherStore } from "@/stores/weatherStore";
import { RefreshCw, MapPin, Map, Bell, Settings, Search } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { fetchWeather, isLoading, error } = useWeather();
  const { requestLocation, currentLocation } = useGeolocation();
  const { weatherData } = useWeatherStore();

  useEffect(() => {
    if (currentLocation && !weatherData.current) {
      fetchWeather();
    }
  }, [currentLocation]);

  const handleRefresh = () => {
    requestLocation();
    fetchWeather();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-[#0f0f1a] -z-10" />
      
      <div className="orb orb-primary w-96 h-96 -top-48 -right-48 opacity-20" />
      <div className="orb orb-secondary w-80 h-80 top-1/2 -left-40 opacity-15" />
      
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="relative pb-24">
        {error && (
          <div className="px-5 mb-6">
            <div className="card p-4 border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Unable to load weather</p>
                  <p className="text-sm text-muted">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="btn btn-ghost text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "home" && (
          <div className="space-y-8">
            <AlertBanner />
            <AISummary />
            
            <section className="px-5 animate-fade-in-up">
              <CurrentConditions />
            </section>

            <section className="px-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Hourly Forecast</h2>
              </div>
              <HourlyForecast />
            </section>

            <section className="px-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Precipitation</h2>
              </div>
              <MinutelyPrecipitation />
            </section>

            <section className="px-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-purple-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">10-Day Forecast</h2>
              </div>
              <DailyForecast />
            </section>

            <section className="px-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Weather Details</h2>
              </div>
              <WeatherDetails />
            </section>

            <section className="px-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Sun & Moon</h2>
              </div>
              <AstronomyCard />
            </section>

            <div className="h-20" />
          </div>
        )}

        {activeTab === "locations" && (
          <div className="px-5 py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl card flex items-center justify-center mb-6">
              <MapPin size={28} className="text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Saved Locations</h2>
            <p className="text-muted max-w-xs mx-auto mb-8">
              Search for cities to add them to your saved locations for quick access.
            </p>
            <button
              onClick={() => setActiveTab("home")}
              className="btn btn-primary"
            >
              <Search size={18} />
              Search Locations
            </button>
          </div>
        )}

        {activeTab === "map" && (
          <div className="px-5 py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl card flex items-center justify-center mb-6">
              <Map size={28} className="text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Weather Maps</h2>
            <p className="text-muted max-w-xs mx-auto">
              Interactive radar and satellite maps coming soon.
            </p>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="px-5 py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl card flex items-center justify-center mb-6">
              <Bell size={28} className="text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Weather Alerts</h2>
            <p className="text-muted max-w-xs mx-auto">
              {weatherData.alerts.length > 0
                ? `${weatherData.alerts.length} active alert(s) in your area.`
                : "No active weather alerts. We'll notify you when conditions change."}
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="px-5 py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl card flex items-center justify-center mb-6">
              <Settings size={28} className="text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Settings</h2>
            <p className="text-muted max-w-xs mx-auto mb-6">
              Customize units, theme, and notifications.
            </p>
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn btn-primary"
            >
              Open Settings
            </button>
          </div>
        )}
      </main>

      {isLoading && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40">
          <div className="card px-4 py-2 flex items-center gap-2">
            <RefreshCw size={16} className="animate-spin text-purple-400" />
            <span className="text-sm text-muted">Updating...</span>
          </div>
        </div>
      )}

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
