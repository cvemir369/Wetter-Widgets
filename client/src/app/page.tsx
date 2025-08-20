// ================= Home Page Component ==========================
// Main UI for Wetter Widgets. Handles widget creation, autocomplete,
// and displays all active weather widgets. Uses utility functions for
// API calls and autocomplete logic. Styled with Tailwind CSS.
// ================================================================

"use client";
import { useState, useEffect } from "react";
import Widget from "../components/Widget";
import { fetchWidgets, createWidget, deleteWidget } from "../utils/widgetApi";
import {
  Suggestion,
  fetchCitySuggestions,
  handleSuggestionClick as handleSuggestionClickUtil,
  handleInputKeyDown as handleInputKeyDownUtil,
} from "../utils/autocomplete";

// Type for a weather widget object
type WidgetType = {
  _id: string;
  location: string;
  weather?: {
    temperature: number;
    description: string;
  };
};

export default function Home() {
  // State for the city input field
  const [location, setLocation] = useState("");
  // State for all active widgets
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
      fetchCitySuggestions(
        location,
        setSuggestions,
        setShowSuggestions,
        setIsLoadingSuggestions
      );
    }, 400);
    setDebounceTimeout(timeout);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Create a new widget for the current location
  const handleCreateWidget = () => {
    createWidget(location, setLocation, setWidgets, () => {});
  };

  // When user clicks a suggestion
  const handleSuggestionClick = (s: Suggestion) => {
    handleSuggestionClickUtil(
      s,
      setLocation,
      setShowSuggestions,
      setHighlightedIndex
    );
  };

  // Keyboard navigation for suggestions
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleInputKeyDownUtil(
      e,
      showSuggestions,
      suggestions,
      highlightedIndex,
      setHighlightedIndex,
      handleSuggestionClick,
      setShowSuggestions
    );
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* Widget creation form */}
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
              {/* Autocomplete suggestions dropdown */}
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
              className="mt-2 bg-neutral-700 text-white rounded-md p-2 w-full sm:w-96 cursor-pointer hover:bg-neutral-600 active:bg-neutral-800 active:scale-95 transition-transform"
            >
              Widget erstellen
            </button>
          </form>
        </div>

        {/* Active widgets list */}
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-2xl">Aktive Widgets</h2>
          {widgets.length === 0 ? (
            <div className="text-gray-400 p-4 text-center">
              Keine Widgets vorhanden
            </div>
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
}
