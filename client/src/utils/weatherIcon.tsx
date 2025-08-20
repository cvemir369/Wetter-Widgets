import React from "react";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaSmog,
  FaBolt,
} from "react-icons/fa";

export function getWeatherIcon(description: string) {
  const desc = description.toLowerCase();
  if (desc.includes("sun") || desc.includes("clear"))
    return <FaSun className="text-yellow-400" size={32} />;
  if (desc.includes("cloud"))
    return <FaCloud className="text-gray-400" size={32} />;
  if (desc.includes("rain") || desc.includes("drizzle"))
    return <FaCloudRain className="text-blue-400" size={32} />;
  if (desc.includes("snow"))
    return <FaSnowflake className="text-blue-200" size={32} />;
  if (desc.includes("storm") || desc.includes("thunder"))
    return <FaBolt className="text-yellow-600" size={32} />;
  if (
    desc.includes("fog") ||
    desc.includes("mist") ||
    desc.includes("haze") ||
    desc.includes("smog")
  )
    return <FaSmog className="text-gray-300" size={32} />;
  return <FaCloud className="text-gray-400" size={32} />;
}
