"use client";
import { useState, useEffect } from "react";
import Widget from "../components/Widget";
import { fetchWidgets, createWidget, deleteWidget } from "../utils/widgetApi";

// Type for city suggestion
type Suggestion = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
};

type OpenMeteoGeocodingResult = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
};

type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[];
};

type WidgetType = {
  _id: string;
  location: string;
  weather?: {
    temperature: number;
    description: string;
  };
};

export default function Home() {
  const [location, setLocation] = useState("");
  const [widgets, setWidgets] = useState<WidgetType[]>([]);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Fetch widgets on mount
  useEffect(() => {
    fetchWidgets(setWidgets, () => {});
  }, []);

  // Fetch city suggestions when location changes (debounced)
  useEffect(() => {
    if (!location) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      setIsLoadingSuggestions(true);
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location
        )}&count=5&language=de&format=json`
      )
        .then((res) => res.json())
        .then((data: OpenMeteoGeocodingResponse) => {
          if (data && data.results) {
            setSuggestions(
              data.results.map((item) => ({
                id: item.id,
                name: item.name,
                country: item.country,
                admin1: item.admin1,
              }))
            );
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        })
        .finally(() => setIsLoadingSuggestions(false));
    }, 400);
    setDebounceTimeout(timeout);
    // Cleanup
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleCreateWidget = () => {
    createWidget(location, setLocation, setWidgets, () => {});
  };

  // When user clicks a suggestion
  const handleSuggestionClick = (s: Suggestion) => {
    setLocation(s.name);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  // Keyboard navigation for suggestions
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="font-bold text-4xl">Wetter-Widgets</h1>
        <p className="text-lg">
          Erhalte die aktuellen Wetterdaten für deinen Standort.
        </p>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-2xl">Widget erstellen</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateWidget();
            }}
            className="flex flex-col gap-4"
          >
            <div className="relative w-full sm:w-96">
              <input
                className="border border-gray-300 rounded-md p-2 w-full"
                type="text"
                placeholder="Name der Stadt: z.B. Berlin"
                value={location}
                autoComplete="off"
                onChange={(e) => {
                  setLocation(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => location && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onKeyDown={handleInputKeyDown}
              />
              {showSuggestions &&
                (suggestions.length > 0 || isLoadingSuggestions) && (
                  <ul className="absolute z-10 left-0 right-0 bg-gray-800 border border-gray-700 rounded-md mt-1 max-h-56 overflow-y-auto shadow-lg">
                    {isLoadingSuggestions && (
                      <li className="p-2 text-gray-400">Lädt...</li>
                    )}
                    {suggestions.map((s, idx) => (
                      <li
                        key={s.id}
                        className={`p-2 cursor-pointer transition-colors ${
                          highlightedIndex === idx
                            ? "bg-gray-700 text-white"
                            : "hover:bg-gray-700 text-gray-100"
                        }`}
                        onMouseDown={() => handleSuggestionClick(s)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                      >
                        {s.name}
                        {s.admin1 ? `, ${s.admin1}` : ""}
                        {s.country ? `, ${s.country}` : ""}
                      </li>
                    ))}
                    {!isLoadingSuggestions && suggestions.length === 0 && (
                      <li className="p-2 text-gray-400">Keine Vorschläge</li>
                    )}
                  </ul>
                )}
            </div>
            <button
              type="submit"
              className="mt-2 bg-gray-700 text-white rounded-md p-2 w-full sm:w-96 cursor-pointer hover:bg-gray-600 active:bg-gray-800 active:scale-95 transition-transform"
            >
              Widget erstellen
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-2xl">Aktive Widgets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((w) => (
              <Widget
                key={w._id}
                location={w.location}
                temperature={w.weather?.temperature ?? 0}
                description={w.weather?.description ?? "Keine Daten"}
                onDelete={() => {
                  deleteWidget(w._id, setWidgets, () => {});
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
