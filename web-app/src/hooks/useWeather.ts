"use client";

import { useWeatherStore } from "@/stores/weatherStore";
import { getWeatherData } from "@/services/weatherService";
import { useEffect } from "react";

export function useWeather() {
  const {
    currentLocation,
    weatherData,
    setCurrent,
    setHourly,
    setDaily,
    setMinutely,
    setAlerts,
    setAstronomy,
    setSummary,
    setLoading,
    setError,
  } = useWeatherStore();

  const fetchWeather = async () => {
    if (!currentLocation) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(currentLocation);
      setCurrent(data.current);
      setHourly(data.hourly);
      setDaily(data.daily);
      setMinutely(data.minutely);
      setAlerts(data.alerts);
      setAstronomy(data.astronomy);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentLocation) {
      fetchWeather();
    }
  }, [currentLocation?.lat, currentLocation?.lon]);

  return {
    weatherData,
    fetchWeather,
    isLoading: weatherData.loading,
    error: weatherData.error,
  };
}
