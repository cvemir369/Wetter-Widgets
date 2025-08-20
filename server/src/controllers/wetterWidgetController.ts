import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ErrorResponse from "../utils/errorResponse";
import Widget from "../models/Widget";
import { fetchWeather } from "../services/index";

// In-memory cache for weather data: { [location]: { data: any, timestamp: number } }
const weatherCache: Record<string, { data: any; timestamp: number }> = {};

// GET /widgets - List all widgets from MongoDB
export const getWidgets = asyncHandler(
  async (req: Request, res: Response, next: Function) => {
    const widgets = await Widget.find();

    // For each widget, fetch weather and attach temperature/description
    const widgetsWithWeather = await Promise.all(
      widgets.map(async (widget) => {
        // Capitalize city name for response
        const capitalizedLocation = widget.location
          .toLowerCase()
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const cacheKey = widget.location.toLowerCase();
        const cacheEntry = weatherCache[cacheKey];
        const now = Date.now();
        let weatherData;
        if (cacheEntry && now - cacheEntry.timestamp < 5 * 60 * 1000) {
          weatherData = cacheEntry.data;
        } else {
          weatherData = await fetchWeather(widget.location);
          weatherCache[cacheKey] = {
            data: weatherData,
            timestamp: now,
          };
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

// POST /widgets - Create a new widget in MongoDB and return weather data (with caching)
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
    const cacheEntry = weatherCache[cacheKey];
    const now = Date.now();
    let weatherData;
    if (cacheEntry && now - cacheEntry.timestamp < 5 * 60 * 1000) {
      weatherData = cacheEntry.data;
    } else {
      weatherData = await fetchWeather(location);
      weatherCache[cacheKey] = {
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
