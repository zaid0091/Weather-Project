export interface Location {
  lat: number;
  lon: number;
  name: string;
  region: string;
  country: string;
  countryCode: string;
  timezone: string;
  localtime: string;
}

export interface Condition {
  text: string;
  code: number;
  icon: string;
}

export interface AirQuality {
  usEpaIndex: number;
  category: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface CurrentWeather {
  location: Location;
  current: {
    tempC: number;
    tempF: number;
    feelsLikeC: number;
    feelsLikeF: number;
    condition: Condition;
    humidity: number;
    windKph: number;
    windMph: number;
    windDegree: number;
    windDir: string;
    pressureMb: number;
    pressureIn: number;
    precipMm: number;
    precipIn: number;
    visibilityKm: number;
    visibilityMiles: number;
    uv: number;
    dewPointC: number;
    dewPointF: number;
    aqi: AirQuality | null;
    source: string;
    updatedAt: string;
  };
}

export interface HourlyForecast {
  time: string;
  tempC: number;
  tempF: number;
  condition: Condition;
  precipMm: number;
  precipProbability: number;
  humidity: number;
  windKph: number;
  windMph: number;
  windDir: string;
  feelsLikeC: number;
  feelsLikeF: number;
  uv: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  weekDay: string;
  maxTempC: number;
  maxTempF: number;
  minTempC: number;
  minTempF: number;
  condition: Condition;
  precipMm: number;
  precipProbability: number;
  humidity: number;
  windKph: number;
  windMph: number;
  uv: number;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonIllumination: number;
}

export interface MinutelyPrecipitation {
  minute: number;
  precipMm: number;
  probability: number;
}

export interface WeatherAlert {
  id: string;
  headline: string;
  severity: "minor" | "moderate" | "severe" | "extreme";
  urgency: "low" | "medium" | "high";
  event: string;
  effective: string;
  expires: string;
  description: string;
  instruction: string;
  areas: string;
}

export interface Astronomy {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonIllumination: number;
  dayLength: string;
  goldenHour: {
    morningStart: string;
    morningEnd: string;
    eveningStart: string;
    eveningEnd: string;
  };
}

export interface WeatherData {
  current: CurrentWeather | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  minutely: MinutelyPrecipitation[];
  alerts: WeatherAlert[];
  astronomy: Astronomy | null;
  summary: string | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  countryCode: string;
  isHome: boolean;
  order: number;
}

export interface UserPreferences {
  units: {
    temperature: "celsius" | "fahrenheit";
    wind: "kph" | "mph" | "ms" | "knots";
    pressure: "hPa" | "inHg" | "mb";
    precipitation: "mm" | "in";
    distance: "km" | "mi";
    timeFormat: "12h" | "24h";
  };
  theme: "light" | "dark" | "auto" | "dynamic";
  language: string;
  notifications: {
    severeWeather: boolean;
    dailyForecast: boolean;
    dailyForecastTime: string;
    rainAlert: boolean;
    rainAlertMinutes: number;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
}

export interface SearchResult {
  id: string;
  name: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  timezone: string;
  type: "city" | "zip" | "landmark" | "airport";
}

export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "overcast"
  | "mist"
  | "fog"
  | "light-rain"
  | "rain"
  | "heavy-rain"
  | "thunderstorm"
  | "snow"
  | "light-snow"
  | "heavy-snow"
  | "sleet"
  | "hail"
  | "night-clear"
  | "night-cloudy"
  | "night-rain"
  | "night-snow";

export interface WeatherDetailItem {
  label: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
}
