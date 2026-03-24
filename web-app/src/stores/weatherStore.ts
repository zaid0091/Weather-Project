import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WeatherData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  MinutelyPrecipitation,
  WeatherAlert,
  Astronomy,
  SavedLocation,
  UserPreferences,
} from "@/types/weather";
import { generateId } from "@/lib/utils";

interface WeatherState {
  currentLocation: SavedLocation | null;
  weatherData: WeatherData;
  savedLocations: SavedLocation[];
  preferences: UserPreferences;

  setCurrentLocation: (location: SavedLocation) => void;
  setWeatherData: (data: Partial<WeatherData>) => void;
  setCurrent: (current: CurrentWeather) => void;
  setHourly: (hourly: HourlyForecast[]) => void;
  setDaily: (daily: DailyForecast[]) => void;
  setMinutely: (minutely: MinutelyPrecipitation[]) => void;
  setAlerts: (alerts: WeatherAlert[]) => void;
  setAstronomy: (astronomy: Astronomy) => void;
  setSummary: (summary: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  addSavedLocation: (location: Omit<SavedLocation, "id" | "order">) => void;
  removeSavedLocation: (id: string) => void;
  updateSavedLocation: (id: string, updates: Partial<SavedLocation>) => void;
  reorderSavedLocations: (ids: string[]) => void;
  setHomeLocation: (id: string) => void;

  updatePreferences: (updates: Partial<UserPreferences>) => void;
  updateUnits: (updates: Partial<UserPreferences["units"]>) => void;
  updateTheme: (theme: UserPreferences["theme"]) => void;
}

const defaultPreferences: UserPreferences = {
  units: {
    temperature: "fahrenheit",
    wind: "mph",
    pressure: "inHg",
    precipitation: "in",
    distance: "mi",
    timeFormat: "12h",
  },
  theme: "dynamic",
  language: "en",
  notifications: {
    severeWeather: true,
    dailyForecast: true,
    dailyForecastTime: "07:00",
    rainAlert: true,
    rainAlertMinutes: 30,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  },
};

const defaultWeatherData: WeatherData = {
  current: null,
  hourly: [],
  daily: [],
  minutely: [],
  alerts: [],
  astronomy: null,
  summary: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      weatherData: defaultWeatherData,
      savedLocations: [],
      preferences: defaultPreferences,

      setCurrentLocation: (location) => set({ currentLocation: location }),

      setWeatherData: (data) =>
        set((state) => ({
          weatherData: { ...state.weatherData, ...data },
        })),

      setCurrent: (current) =>
        set((state) => ({
          weatherData: {
            ...state.weatherData,
            current,
            lastUpdated: new Date().toISOString(),
          },
        })),

      setHourly: (hourly) =>
        set((state) => ({
          weatherData: { ...state.weatherData, hourly },
        })),

      setDaily: (daily) =>
        set((state) => ({
          weatherData: { ...state.weatherData, daily },
        })),

      setMinutely: (minutely) =>
        set((state) => ({
          weatherData: { ...state.weatherData, minutely },
        })),

      setAlerts: (alerts) =>
        set((state) => ({
          weatherData: { ...state.weatherData, alerts },
        })),

      setAstronomy: (astronomy) =>
        set((state) => ({
          weatherData: { ...state.weatherData, astronomy },
        })),

      setSummary: (summary) =>
        set((state) => ({
          weatherData: { ...state.weatherData, summary },
        })),

      setLoading: (loading) =>
        set((state) => ({
          weatherData: { ...state.weatherData, loading },
        })),

      setError: (error) =>
        set((state) => ({
          weatherData: { ...state.weatherData, error },
        })),

      addSavedLocation: (location) => {
        const { savedLocations } = get();
        const newLocation: SavedLocation = {
          ...location,
          id: generateId(),
          order: savedLocations.length,
        };
        set({ savedLocations: [...savedLocations, newLocation] });
      },

      removeSavedLocation: (id) =>
        set((state) => ({
          savedLocations: state.savedLocations
            .filter((loc) => loc.id !== id)
            .map((loc, index) => ({ ...loc, order: index })),
        })),

      updateSavedLocation: (id, updates) =>
        set((state) => ({
          savedLocations: state.savedLocations.map((loc) =>
            loc.id === id ? { ...loc, ...updates } : loc
          ),
        })),

      reorderSavedLocations: (ids) =>
        set((state) => {
          const reordered = ids
            .map((id, index) => {
              const loc = state.savedLocations.find((l) => l.id === id);
              return loc ? { ...loc, order: index } : null;
            })
            .filter((loc): loc is SavedLocation => loc !== null);
          return { savedLocations: reordered };
        }),

      setHomeLocation: (id) =>
        set((state) => ({
          savedLocations: state.savedLocations.map((loc) => ({
            ...loc,
            isHome: loc.id === id,
          })),
        })),

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),

      updateUnits: (updates) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            units: { ...state.preferences.units, ...updates },
          },
        })),

      updateTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),
    }),
    {
      name: "skyscope-weather-store",
      partialize: (state) => ({
        savedLocations: state.savedLocations,
        preferences: state.preferences,
        currentLocation: state.currentLocation,
      }),
    }
  )
);
