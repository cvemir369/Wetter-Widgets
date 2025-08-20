// ================= Autocomplete Utility =========================
// Provides types and functions for city autocomplete, including
// fetching suggestions from Open-Meteo, handling suggestion clicks,
// and keyboard navigation for the dropdown.
// ===============================================================

// Autocomplete and geocoding types
export type Suggestion = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
};

export type OpenMeteoGeocodingResult = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
};

export type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[];
};

/**
 * Fetch city suggestions from Open-Meteo geocoding API (debounced).
 * @param location - The city name input
 * @param setSuggestions - Setter for suggestions array
 * @param setShowSuggestions - Setter for dropdown visibility
 * @param setIsLoadingSuggestions - Setter for loading state
 */
export function fetchCitySuggestions(
  location: string,
  setSuggestions: (s: Suggestion[]) => void,
  setShowSuggestions: (b: boolean) => void,
  setIsLoadingSuggestions: (b: boolean) => void
) {
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
}

/**
 * Handle click on a suggestion in the dropdown.
 * @param s - The selected suggestion
 * @param setLocation - Setter for input value
 * @param setShowSuggestions - Setter for dropdown visibility
 * @param setHighlightedIndex - Setter for highlighted index
 */
export function handleSuggestionClick(
  s: Suggestion,
  setLocation: (v: string) => void,
  setShowSuggestions: (b: boolean) => void,
  setHighlightedIndex: (i: number) => void
) {
  setLocation(s.name);
  setShowSuggestions(false);
  setHighlightedIndex(-1);
}

/**
 * Keyboard navigation for suggestions dropdown.
 * @param e - Keyboard event
 * @param showSuggestions - Whether dropdown is visible
 * @param suggestions - Array of suggestions
 * @param highlightedIndex - Current highlighted index
 * @param setHighlightedIndex - Setter for highlighted index
 * @param handleSuggestionClick - Handler for selecting a suggestion
 * @param setShowSuggestions - Setter for dropdown visibility
 */
export function handleInputKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
  showSuggestions: boolean,
  suggestions: Suggestion[],
  highlightedIndex: number,
  setHighlightedIndex: (i: number) => void,
  handleSuggestionClick: (s: Suggestion) => void,
  setShowSuggestions: (b: boolean) => void
) {
  if (!showSuggestions || suggestions.length === 0) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setHighlightedIndex(
      highlightedIndex < suggestions.length - 1 ? highlightedIndex + 1 : 0
    );
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setHighlightedIndex(
      highlightedIndex > 0 ? highlightedIndex - 1 : suggestions.length - 1
    );
  } else if (e.key === "Enter") {
    if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
      handleSuggestionClick(suggestions[highlightedIndex]);
    }
  } else if (e.key === "Escape") {
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }
}
