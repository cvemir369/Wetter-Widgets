interface WeatherCacheEntry {
  data: any;
  timestamp: number;
}

const weatherCache: Record<string, WeatherCacheEntry> = {};

export function getWeatherCacheEntry(
  key: string
): WeatherCacheEntry | undefined {
  return weatherCache[key];
}

export function setWeatherCacheEntry(key: string, data: any): void {
  weatherCache[key] = {
    data,
    timestamp: Date.now(),
  };
}

export function isWeatherCacheValid(
  entry: WeatherCacheEntry | undefined,
  maxAgeMs = 5 * 60 * 1000
): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < maxAgeMs;
}
