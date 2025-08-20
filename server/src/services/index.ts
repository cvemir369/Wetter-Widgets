import { fetchWeatherApi } from "openmeteo";
import ErrorResponse from "../utils/errorResponse";
import axios from "axios";

// Fetch latitude and longitude for a city name using Open-Meteo geocoding API
async function getLatLonForCity(
  city: string
): Promise<{ lat: number; lon: number }> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`;
    const response = await axios.get(url);
    const results = response.data.results;
    if (!results || results.length === 0) {
      throw new ErrorResponse("City not found in geocoding API", 404);
    }
    return { lat: results[0].latitude, lon: results[0].longitude };
  } catch (error) {
    throw new ErrorResponse("Failed to fetch city coordinates", 502);
  }
}

// Fetch weather for a city name
export async function fetchWeather(city: string) {
  try {
    const { lat, lon } = await getLatLonForCity(city);
    const params = {
      latitude: lat,
      longitude: lon,
      hourly: "temperature_2m,weathercode",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const hourly = response.hourly();
    if (!hourly) {
      throw new ErrorResponse("Weather API did not return hourly data", 502);
    }
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const now = new Date();
    const times = [
      ...Array(
        (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
      ),
    ].map(
      (_, i) =>
        new Date(
          (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
            1000
        )
    );
    const temperatures = hourly.variables(0)?.valuesArray();
    const weathercodes = hourly.variables(1)?.valuesArray();

    // Find the closest time index to now
    let temperature = null;
    let weatherCode = null;
    if (
      times &&
      temperatures &&
      weathercodes &&
      times.length &&
      temperatures.length &&
      weathercodes.length
    ) {
      const idx = times.findIndex((t) => t > now);
      const useIdx = idx > 0 ? idx - 1 : 0;
      temperature = temperatures[useIdx];
      weatherCode = weathercodes[useIdx];
    }

    const weatherCodeMap: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };

    return {
      temperature: temperature !== null ? Math.round(temperature) : null,
      description:
        weatherCode !== null && weatherCodeMap[weatherCode]
          ? weatherCodeMap[weatherCode]
          : "No data",
    };
  } catch (error) {
    throw new ErrorResponse("Failed to fetch weather data", 502);
  }
}
