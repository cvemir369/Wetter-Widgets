// ================= Weather Cache Module =========================
// This module provides a simple in-memory cache for weather data.
// It exposes functions to get, set, and validate cache entries by key.
// Used to reduce redundant external weather API calls and improve performance.
// ===============================================================

/**
 * WeatherCacheEntry defines the structure of a single cache entry.
 * - data: The weather data payload (any type).
 * - timestamp: The time (ms since epoch) when the data was cached.
 */
interface WeatherCacheEntry {
  data: any;
  timestamp: number;
}

// In-memory cache object, keyed by location or other identifier.
const weatherCache: Record<string, WeatherCacheEntry> = {};

/**
 * Retrieve a weather cache entry by key.
 * @param key - The cache key (e.g., location string)
 * @returns The cache entry or undefined if not found.
 */
export function getWeatherCacheEntry(
  key: string
): WeatherCacheEntry | undefined {
  return weatherCache[key];
}

/**
 * Set or update a weather cache entry for a given key.
 * @param key - The cache key (e.g., location string)
 * @param data - The weather data to cache
 */
export function setWeatherCacheEntry(key: string, data: any): void {
  weatherCache[key] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Check if a cache entry is still valid based on its age.
 * @param entry - The cache entry to validate
 * @param maxAgeMs - Maximum allowed age in ms (default: 5 minutes)
 * @returns True if valid, false otherwise
 */
export function isWeatherCacheValid(
  entry: WeatherCacheEntry | undefined,
  maxAgeMs = 5 * 60 * 1000
): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < maxAgeMs;
}
