/**
 * Sample weather API module that needs documentation
 * Students will use Claude Code to help document this code
 */

interface WeatherData {
  temperature: number;
  humidity: number;
  conditions: string;
  windSpeed: number;
  location: string;
  timestamp: Date;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  conditions: string;
  precipitation: number;
}

const API_BASE = "https://api.weather.example.com/v1";

async function getCurrentWeather(city: string): Promise<WeatherData> {
  const response = await fetch(`${API_BASE}/current?city=${encodeURIComponent(city)}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    temperature: data.temp_f,
    humidity: data.humidity,
    conditions: data.conditions,
    windSpeed: data.wind_mph,
    location: data.location.name,
    timestamp: new Date(data.timestamp)
  };
}

async function getForecast(city: string, days: number = 7): Promise<ForecastDay[]> {
  if (days < 1 || days > 14) {
    throw new Error("Days must be between 1 and 14");
  }

  const response = await fetch(
    `${API_BASE}/forecast?city=${encodeURIComponent(city)}&days=${days}`
  );

  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`);
  }

  const data = await response.json();

  return data.forecast.map((day: any) => ({
    date: day.date,
    high: day.high_f,
    low: day.low_f,
    conditions: day.conditions,
    precipitation: day.precip_chance
  }));
}

function formatTemperature(temp: number, unit: "F" | "C" = "F"): string {
  if (unit === "C") {
    const celsius = ((temp - 32) * 5) / 9;
    return `${celsius.toFixed(1)}°C`;
  }
  return `${temp}°F`;
}

function getWeatherEmoji(conditions: string): string {
  const conditionMap: Record<string, string> = {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    snowy: "❄️",
    stormy: "⛈️",
    windy: "💨",
    foggy: "🌫️"
  };

  return conditionMap[conditions.toLowerCase()] || "🌤️";
}

export {
  WeatherData,
  ForecastDay,
  getCurrentWeather,
  getForecast,
  formatTemperature,
  getWeatherEmoji
};
