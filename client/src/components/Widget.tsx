import React from "react";
import { TiDelete } from "react-icons/ti";
import { getWeatherIcon } from "../utils/weatherIcon";

type WidgetProps = {
  location: string;
  temperature: number;
  description: string;
  onDelete?: () => void;
};

export default function Widget({
  location,
  temperature,
  description,
  onDelete,
}: WidgetProps) {
  return (
    <div className="relative border border-gray-300 rounded-md p-4 group min-w-[200px]">
      {onDelete && (
        <TiDelete
          onClick={onDelete}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer hover:text-red-400 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold z-10"
          aria-label="Delete widget"
        />
      )}
      <div className="flex items-center gap-2 mb-2">
        {getWeatherIcon(description)}
        <h3 className="font-bold text-xl">{location}</h3>
      </div>
      <p className="text-lg">{temperature}°C</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
