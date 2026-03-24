import type {
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  MinutelyPrecipitation,
  WeatherAlert,
  Astronomy,
  SearchResult,
  SavedLocation,
} from "@/types/weather";

const WTTR_BASE = "https://wttr.in";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function mapWeatherCode(code: number): { text: string; icon: string; code: number } {
  const codeMap: Record<number, { text: string; icon: string }> = {
    113: { text: "Sunny", icon: "sunny" },
    116: { text: "Partly Cloudy", icon: "partly-cloudy" },
    119: { text: "Cloudy", icon: "cloudy" },
    122: { text: "Overcast", icon: "cloudy" },
    143: { text: "Mist", icon: "fog" },
    176: { text: "Patchy Rain", icon: "rain" },
    179: { text: "Patchy Snow", icon: "snow" },
    182: { text: "Patchy Sleet", icon: "snow" },
    185: { text: "Patchy Freezing Drizzle", icon: "rain" },
    200: { text: "Thundery Outbreaks", icon: "thunderstorm" },
    227: { text: "Blowing Snow", icon: "snow" },
    230: { text: "Blizzard", icon: "snow" },
    248: { text: "Fog", icon: "fog" },
    260: { text: "Freezing Fog", icon: "fog" },
    263: { text: "Patchy Light Drizzle", icon: "rain" },
    266: { text: "Light Drizzle", icon: "rain" },
    281: { text: "Freezing Drizzle", icon: "rain" },
    284: { text: "Heavy Freezing Drizzle", icon: "heavy-rain" },
    293: { text: "Patchy Light Rain", icon: "rain" },
    296: { text: "Light Rain", icon: "rain" },
    299: { text: "Moderate Rain", icon: "rain" },
    302: { text: "Heavy Rain", icon: "heavy-rain" },
    305: { text: "Heavy Rain", icon: "heavy-rain" },
    308: { text: "Heavy Rain", icon: "heavy-rain" },
    311: { text: "Light Freezing Rain", icon: "rain" },
    314: { text: "Moderate Freezing Rain", icon: "rain" },
    317: { text: "Light Sleet", icon: "snow" },
    320: { text: "Moderate Sleet", icon: "snow" },
    323: { text: "Light Snow Showers", icon: "snow" },
    326: { text: "Light Snow Showers", icon: "snow" },
    329: { text: "Moderate Snow", icon: "snow" },
    332: { text: "Heavy Snow", icon: "snow" },
    335: { text: "Heavy Snow", icon: "snow" },
    338: { text: "Heavy Snow", icon: "snow" },
    350: { text: "Ice", icon: "snow" },
    353: { text: "Light Rain Showers", icon: "rain" },
    356: { text: "Moderate Rain Showers", icon: "rain" },
    359: { text: "Torrential Rain", icon: "heavy-rain" },
    362: { text: "Light Sleet Showers", icon: "snow" },
    365: { text: "Moderate Sleet Showers", icon: "snow" },
    368: { text: "Light Snow Showers", icon: "snow" },
    371: { text: "Moderate Snow Showers", icon: "snow" },
    374: { text: "Light Snow Showers", icon: "snow" },
    377: { text: "Moderate Snow Showers", icon: "snow" },
    386: { text: "Moderate Thunderstorm", icon: "thunderstorm" },
    389: { text: "Heavy Thunderstorm", icon: "thunderstorm" },
    392: { text: "Light Snow Showers", icon: "snow" },
    395: { text: "Moderate Snow Showers", icon: "snow" },
  };
  const result = codeMap[code];
  if (result) {
    return { ...result, code };
  }
  return { text: "Unknown", icon: "cloudy", code };
}

function getMoonPhase(): { phase: string; illumination: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * (month + 1));
  const jd = c - e + day;
  const ip = (jd % 255) / 255;
  
  if (ip < 0.0625) return { phase: "New Moon", illumination: 0 };
  if (ip < 0.1875) return { phase: "Waxing Crescent", illumination: Math.round(ip * 640) };
  if (ip < 0.3125) return { phase: "First Quarter", illumination: 50 };
  if (ip < 0.4375) return { phase: "Waxing Gibbous", illumination: Math.round((ip - 0.25) * 640) };
  if (ip < 0.5625) return { phase: "Full Moon", illumination: 100 };
  if (ip < 0.6875) return { phase: "Waning Gibbous", illumination: Math.round((0.625 - ip) * 640) };
  if (ip < 0.8125) return { phase: "Last Quarter", illumination: 50 };
  if (ip < 0.9375) return { phase: "Waning Crescent", illumination: Math.round((1 - ip) * 640) };
  return { phase: "New Moon", illumination: 0 };
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  state?: string;
  country?: string;
  lat: string;
  lon: string;
  type?: string;
  address?: {
    country_code?: string;
  };
}

interface WttrDayData {
  date?: string;
  maxtempC?: string;
  mintempC?: string;
  hourly?: Array<{
    weatherCode?: string;
    chanceofrain?: string;
    WindspeedKmph?: string;
    uvIndex?: string;
  }>;
  astronomy?: Array<{
    sunrise?: string;
    sunset?: string;
    moonrise?: string;
    moonset?: string;
  }>;
}

export async function searchLocations(query: string): Promise<SearchResult[]> {
  if (query.length < 2) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { headers: { "User-Agent": "SkyScope Weather App" } }
    );
    if (!response.ok) return [];

    const data = await response.json();
    if (!data.length) return [];

    return data.map((result: NominatimResult) => ({
      id: result.place_id || generateId(),
      name: result.display_name.split(',')[0],
      region: result.state || "",
      country: result.country || "",
      countryCode: result.address?.country_code?.toUpperCase() || "XX",
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      timezone: "UTC",
      type: result.type || "city",
    }));
  } catch (error) {
    console.error("Location search error:", error);
    return [];
  }
}

type LocationInput = SavedLocation | { lat: number; lon: number };

function isSavedLocation(loc: LocationInput): loc is SavedLocation {
  return "name" in loc;
}

export async function getWeatherData(location: LocationInput): Promise<{
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  minutely: MinutelyPrecipitation[];
  alerts: WeatherAlert[];
  astronomy: Astronomy;
  summary: string;
}> {
  const lat = location.lat;
  const lon = isSavedLocation(location) ? location.lon : location.lat;
  const locationName = isSavedLocation(location) ? location.name : `${lat},${lon}`;
  
  try {
    const response = await fetch(`${WTTR_BASE}/${encodeURIComponent(locationName)}?format=j1`);
    if (!response.ok) {
      throw new Error("Weather API failed");
    }

    const data = await response.json();
    const currentData = data.current_condition?.[0] || {};
    const dailyData = data.weather || [];
    
    const weatherCode = parseInt(currentData.weatherCode || "116", 10);
    const condition = mapWeatherCode(weatherCode);
    const now = new Date();
    const moonPhase = getMoonPhase();

    const tempC = parseFloat(currentData.temp_C || "0");
    const feelsLikeC = parseFloat(currentData.FeelsLikeC || currentData.temp_C || "0");
    const humidity = parseInt(currentData.humidity || "0", 10);
    const windKph = parseFloat(currentData.windspeedKmph || "0");
    const windDir = currentData.winddir16Point || "N";
    const pressure = parseFloat(currentData.pressure || "1013");
    const uv = parseFloat(currentData.uvIndex || "0");

    const current: CurrentWeather = {
      location: {
        lat,
        lon,
        name: locationName,
        region: "",
        country: data.nearest_area?.[0]?.country?.[0]?.value || "",
        countryCode: data.nearest_area?.[0]?.countryCode || "XX",
        timezone: "UTC",
        localtime: now.toISOString(),
      },
      current: {
        tempC,
        tempF: (tempC * 9) / 5 + 32,
        feelsLikeC,
        feelsLikeF: (feelsLikeC * 9) / 5 + 32,
        condition,
        humidity,
        windKph,
        windMph: windKph * 0.621371,
        windDegree: 0,
        windDir,
        pressureMb: pressure,
        pressureIn: pressure * 0.02953,
        precipMm: parseFloat(currentData.precipMM || "0"),
        precipIn: parseFloat(currentData.precipInches || "0"),
        visibilityKm: 10,
        visibilityMiles: 6,
        uv,
        dewPointC: 0,
        dewPointF: 0,
        aqi: null,
        source: "wttr",
        updatedAt: now.toISOString(),
      },
    };

    const hourly: HourlyForecast[] = [];
    for (let dayIdx = 0; dayIdx < Math.min(3, dailyData.length); dayIdx++) {
      const dayHourly = dailyData[dayIdx]?.hourly || [];
      for (let h = 0; h < Math.min(8, dayHourly.length); h++) {
        const hData = dayHourly[h];
        const hourCode = parseInt(hData.weatherCode || "116", 10);
        const hourTime = hData.time || `${h * 3}:00`;
        
        hourly.push({
          time: `${dailyData[dayIdx].date || now.toISOString().split('T')[0]}T${hourTime}:00`,
          tempC: parseFloat(hData.tempC || "0"),
          tempF: (parseFloat(hData.tempC || "0") * 9) / 5 + 32,
          condition: mapWeatherCode(hourCode),
          precipMm: parseFloat(hData.precipMM || "0"),
          precipProbability: parseInt(hData.chanceofrain || "0", 10),
          humidity: parseInt(hData.humidity || "0", 10),
          windKph: parseFloat(hData.WindspeedKmph || "0"),
          windMph: parseFloat(hData.WindspeedKmph || "0") * 0.621371,
          windDir: hData.winddir16Point || "N",
          feelsLikeC: parseFloat(hData.FeelsLikeC || hData.tempC || "0"),
          feelsLikeF: ((parseFloat(hData.FeelsLikeC || hData.tempC || "0")) * 9) / 5 + 32,
          uv: parseFloat(hData.uvIndex || "0"),
          isDay: parseInt(hData.weatherCode || "116") < 200,
        });
      }
    }

    const daily: DailyForecast[] = dailyData.map((day: WttrDayData, i: number) => {
      const maxCode = parseInt(day.maxtempC || "116", 10);
      return {
        date: day.date || new Date(now.getTime() + i * 86400000).toISOString().split('T')[0],
        weekDay: new Date(now.getTime() + i * 86400000).toLocaleDateString("en-US", { weekday: "short" }),
        maxTempC: parseFloat(day.maxtempC || "25"),
        maxTempF: (parseFloat(day.maxtempC || "25") * 9) / 5 + 32,
        minTempC: parseFloat(day.mintempC || "15"),
        minTempF: (parseFloat(day.mintempC || "15") * 9) / 5 + 32,
        condition: mapWeatherCode(maxCode),
        precipMm: 0,
        precipProbability: parseInt(day.hourly?.[4]?.chanceofrain || "0", 10),
        humidity: 0,
        windKph: parseFloat(day.hourly?.[4]?.WindspeedKmph || "0"),
        windMph: parseFloat(day.hourly?.[4]?.WindspeedKmph || "0") * 0.621371,
        uv: parseFloat(day.hourly?.[4]?.uvIndex || "0"),
        sunrise: day.astronomy?.[0]?.sunrise || "6:00 AM",
        sunset: day.astronomy?.[0]?.sunset || "6:00 PM",
        moonrise: day.astronomy?.[0]?.moonrise || "",
        moonset: day.astronomy?.[0]?.moonset || "",
        moonPhase: moonPhase.phase,
        moonIllumination: moonPhase.illumination,
      };
    });

    const minutely: MinutelyPrecipitation[] = hourly.slice(0, 60).map((h, i) => ({
      minute: i,
      precipMm: h.precipMm,
      probability: h.precipProbability,
    }));

    const alerts: WeatherAlert[] = [];

    const sunriseTime = daily[0]?.sunrise || "6:00 AM";
    const sunsetTime = daily[0]?.sunset || "6:00 PM";

    const astronomy: Astronomy = {
      sunrise: sunriseTime,
      sunset: sunsetTime,
      moonrise: daily[0]?.moonrise || "",
      moonset: daily[0]?.moonset || "",
      moonPhase: moonPhase.phase,
      moonIllumination: moonPhase.illumination,
      dayLength: calculateDayLength(sunriseTime, sunsetTime),
      goldenHour: {
        morningStart: sunriseTime,
        morningEnd: "8:00 AM",
        eveningStart: "5:00 PM",
        eveningEnd: sunsetTime,
      },
    };

    const precipChance = daily[0]?.precipProbability || 0;
    const conditionText = condition.text.toLowerCase();

    let summary = "";
    if (conditionText.includes("sunny") || conditionText.includes("clear")) {
      summary = tempC > 25
        ? `A beautiful sunny day with temperatures reaching ${Math.round(tempC)}°C. Perfect weather for outdoor activities!`
        : tempC < 10
        ? `Clear skies today with cool temperatures around ${Math.round(tempC)}°C. A pleasant day ahead.`
        : `Clear skies expected with comfortable temperatures of ${Math.round(tempC)}°C. Enjoy the pleasant weather!`;
    } else if (conditionText.includes("cloud") || conditionText.includes("overcast")) {
      summary = `Expect mostly cloudy conditions with temperatures around ${Math.round(tempC)}°C.${precipChance > 30 ? ` There's a ${precipChance}% chance of rain.` : ""}`;
    } else if (conditionText.includes("rain")) {
      summary = precipChance > 60
        ? `Rain is likely today with a ${precipChance}% chance. Temperature around ${Math.round(tempC)}°C. Don't forget your umbrella!`
        : `Light rain expected with temperatures of ${Math.round(tempC)}°C.${precipChance > 20 ? ` ${precipChance}% chance of precipitation.` : ""}`;
    } else if (conditionText.includes("thunder")) {
      summary = `Thunderstorms expected today. Stay indoors if possible. Temperature around ${Math.round(tempC)}°C.`;
    } else if (conditionText.includes("snow")) {
      summary = `Snow expected today with temperatures of ${Math.round(tempC)}°C.${precipChance > 50 ? ` Heavy snowfall possible with ${precipChance}% chance.` : ""}`;
    } else if (conditionText.includes("fog") || conditionText.includes("mist")) {
      summary = `Foggy conditions expected. Drive carefully with reduced visibility. Temperature around ${Math.round(tempC)}°C.`;
    } else {
      summary = `Today's weather: ${condition.text} with temperatures around ${Math.round(tempC)}°C.${precipChance > 20 ? ` ${precipChance}% chance of precipitation.` : ""}`;
    }

    return {
      current,
      hourly,
      daily,
      minutely,
      alerts,
      astronomy,
      summary,
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
}

function calculateDayLength(sunrise: string, sunset: string): string {
  try {
    const parseTime = (t: string): number => {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;
      let hours = parseInt(match[1], 10);
      const mins = parseInt(match[2], 10);
      const isPM = match[3].toUpperCase() === "PM";
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      return hours * 60 + mins;
    };
    
    const riseMins = parseTime(sunrise);
    const setMins = parseTime(sunset);
    const diff = Math.abs(setMins - riseMins);
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  } catch {
    return "N/A";
  }
}

export async function getLocationByCoordinates(lat: number, lon: number): Promise<SavedLocation | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "User-Agent": "SkyScope Weather App" } }
    );
    if (!response.ok) {
      throw new Error("Reverse geocoding failed");
    }

    const data = await response.json();
    const addr = data.address || {};

    return {
      id: generateId(),
      name: addr.city || addr.town || addr.village || addr.county || `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      lat,
      lon,
      country: addr.country || "Unknown",
      countryCode: addr.country_code?.toUpperCase() || "XX",
      isHome: true,
      order: 0,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return {
      id: generateId(),
      name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      lat,
      lon,
      country: "Unknown",
      countryCode: "XX",
      isHome: true,
      order: 0,
    };
  }
}
