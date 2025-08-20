// ================= Wetter Widget Controller =====================
// This controller handles CRUD operations for weather widgets.
// It integrates with the weather cache and external weather service,
// and provides endpoints for listing, creating, and deleting widgets.
// Each exported function is wrapped with asyncHandler for robust error handling.
// ===============================================================

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ErrorResponse from "../utils/errorResponse";
import Widget from "../models/Widget";

import { fetchWeather } from "../services/index";
import {
  getWeatherCacheEntry,
  setWeatherCacheEntry,
  isWeatherCacheValid,
} from "../cache/weatherCache";

/**
 * GET /widgets
 * List all widgets from MongoDB, attaching current weather data to each.
 * Weather data is fetched from cache if valid, otherwise from the weather service.
 * City names are capitalized for response consistency.
 */
export const getWidgets = asyncHandler(
  async (req: Request, res: Response, next: Function) => {
    const widgets = await Widget.find();

    // Attach weather data to each widget
    const widgetsWithWeather = await Promise.all(
      widgets.map(async (widget) => {
        // Capitalize city name for response
        const capitalizedLocation = widget.location
          .toLowerCase()
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const cacheKey = widget.location.toLowerCase();
        const cacheEntry = getWeatherCacheEntry(cacheKey);
        let weatherData;
        if (isWeatherCacheValid(cacheEntry)) {
          weatherData = cacheEntry!.data;
        } else {
          weatherData = await fetchWeather(widget.location);
          setWeatherCacheEntry(cacheKey, weatherData);
        }
        return {
          ...widget.toObject(),
          location: capitalizedLocation,
          weather: {
            temperature: weatherData.temperature,
            description: weatherData.description,
          },
        };
      })
    );

    res.status(200).json(widgetsWithWeather);
  }
);

/**
 * POST /widgets
 * Create a new widget for a given location and return its weather data.
 * - Validates input and checks for duplicate widgets (case-insensitive).
 * - Capitalizes city names for consistency.
 * - Utilizes weather cache for performance.
 */
export const createWidget = asyncHandler(
  async (req: Request, res: Response, next: Function) => {
    let { location } = req.body;
    if (!location) {
      throw new ErrorResponse("Location is required", 400);
    }

    // Capitalize city name
    location = location
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Check for duplicate city (case-insensitive)
    const existingWidget = await Widget.findOne({
      location: { $regex: new RegExp(`^${location}$`, "i") },
    });
    if (existingWidget) {
      throw new ErrorResponse("Widget for this location already exists", 409);
    }

    const widget = await Widget.create({ location });

    // Weather cache logic
    const cacheKey = location.toLowerCase();
    const cacheEntry = getWeatherCacheEntry(cacheKey);
    let weatherData;
    if (isWeatherCacheValid(cacheEntry)) {
      weatherData = cacheEntry!.data;
    } else {
      weatherData = await fetchWeather(location);
      setWeatherCacheEntry(cacheKey, weatherData);
    }

    res.status(201).json({ ...widget.toObject(), weather: weatherData });
  }
);

/**
 * DELETE /widgets/:id
 * Delete a widget by its MongoDB ObjectId.
 * Returns a success message or 404 if not found.
 */
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
