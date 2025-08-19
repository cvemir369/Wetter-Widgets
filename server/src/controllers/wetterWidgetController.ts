import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ErrorResponse from "../utils/errorResponse";
import Widget from "../models/Widget";

// In-memory cache for weather data: { [location]: { data: any, timestamp: number } }
const weatherCache: Record<string, { data: any; timestamp: number }> = {};

import axios from "axios";

// Helper to fetch weather data from open-meteo using axios
async function fetchWeather(location: string) {
  // For demo: use city name as latitude/longitude (replace with real geocoding in production)
  // Here, just use Berlin as example
  let lat = 52.52,
    lon = 13.405;
  if (location.toLowerCase() === "berlin") {
    lat = 52.52;
    lon = 13.405;
  }
  // Add more city mappings as needed
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new ErrorResponse("Failed to fetch weather data", 502);
  }
}

// GET /widgets - List all widgets from MongoDB
export const getWidgets = asyncHandler(
  async (req: Request, res: Response, next: Function) => {
    const widgets = await Widget.find();
    res.status(200).json(widgets);
  }
);

// POST /widgets - Create a new widget in MongoDB and return weather data (with caching)
export const createWidget = asyncHandler(
  async (req: Request, res: Response, next: Function) => {
    const { location } = req.body;
    if (!location) {
      throw new ErrorResponse("Location is required", 400);
    }
    const widget = await Widget.create({ location });

    // Weather cache logic
    const cacheEntry = weatherCache[location.toLowerCase()];
    const now = Date.now();
    let weatherData;
    if (cacheEntry && now - cacheEntry.timestamp < 5 * 60 * 1000) {
      weatherData = cacheEntry.data;
    } else {
      weatherData = await fetchWeather(location);
      weatherCache[location.toLowerCase()] = {
        data: weatherData,
        timestamp: now,
      };
    }

    res.status(201).json({ ...widget.toObject(), weather: weatherData });
  }
);

// DELETE /widgets/:id - Delete a widget by id from MongoDB
export const deleteWidget = asyncHandler(
  async (req: Request, res: Response, next: Function) => {
    const { id } = req.params;
    const widget = await Widget.findByIdAndDelete(id);
    if (!widget) {
      throw new ErrorResponse("Widget not found", 404);
    }
    res.status(200).json({ message: "Widget deleted successfully" });
  }
);
