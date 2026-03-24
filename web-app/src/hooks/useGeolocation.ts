"use client";

import { useEffect } from "react";
import { useWeatherStore } from "@/stores/weatherStore";
import { getLocationByCoordinates } from "@/services/weatherService";

const DEFAULT_LOCATION = {
  id: "default",
  name: "New York",
  lat: 40.7128,
  lon: -74.006,
  country: "United States",
  countryCode: "US",
  isHome: true,
  order: 0,
};

export function useGeolocation() {
  const { setCurrentLocation, currentLocation } = useWeatherStore();

  const setDefaultLocation = () => {
    setCurrentLocation(DEFAULT_LOCATION);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      setDefaultLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = await getLocationByCoordinates(latitude, longitude);
        if (location) {
          setCurrentLocation(location);
        }
      },
      () => {
        setDefaultLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    if (!currentLocation) {
      requestLocation();
    }
  }, []);

  return { requestLocation, currentLocation };
}
