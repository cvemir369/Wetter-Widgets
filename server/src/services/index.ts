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
      hourly: "temperature_2m",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const hourly = response.hourly();
    if (!hourly) {
      throw new ErrorResponse("Weather API did not return hourly data", 502);
    }
    const utcOffsetSeconds = response.utcOffsetSeconds();
    return {
      hourly: {
        time: [
          ...Array(
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval()
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000
            )
        ),
        temperature_2m: hourly.variables(0)?.valuesArray(),
      },
    };
  } catch (error) {
    throw new ErrorResponse("Failed to fetch weather data", 502);
  }
}
