// ================= Widget API Utility ===========================
// Provides functions for interacting with the Wetter Widgets API,
// including fetching, creating, and deleting widgets. Handles API
// errors and updates React state accordingly.
// ===============================================================

import axios from "axios";
import { Dispatch, SetStateAction } from "react";

// Type for a weather widget object
type WidgetType = {
  _id: string;
  location: string;
  weather?: {
    temperature: number;
    description: string;
  };
};

/**
 * Fetch all widgets from the API and update state.
 * @param setWidgets - Setter for widgets array
 * @param setError - Setter for error message
 */
export async function fetchWidgets(
  setWidgets: Dispatch<SetStateAction<WidgetType[]>>,
  setError: Dispatch<SetStateAction<string>>
) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/widgets`
    );
    setWidgets(res.data);
  } catch {
    setError("Widgets konnten nicht geladen werden.");
  }
}

/**
 * Create a new widget for a given location and update state.
 * Handles duplicate widget errors and general API errors.
 * @param location - City name
 * @param setLocation - Setter for input value
 * @param setWidgets - Setter for widgets array
 * @param setError - Setter for error message
 */
export async function createWidget(
  location: string,
  setLocation: Dispatch<SetStateAction<string>>,
  setWidgets: Dispatch<SetStateAction<WidgetType[]>>,
  setError: Dispatch<SetStateAction<string>>
) {
  setError("");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/widgets`,
      { location },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setLocation("");
    setWidgets((prev: WidgetType[]) => [...prev, response.data]);
  } catch (err: unknown) {
    type AxiosError409 = {
      response: {
        status: number;
        data?: { error?: string };
      };
    };
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      (err as AxiosError409).response &&
      (err as AxiosError409).response.status === 409 &&
      (err as AxiosError409).response.data?.error ===
        "Widget for this location already exists"
    ) {
      setError("F\u00fcr diese Stadt existiert bereits ein Widget.");
    } else {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  }
}

/**
 * Delete a widget by ID and update state.
 * @param id - Widget ID
 * @param setWidgets - Setter for widgets array
 * @param setError - Setter for error message
 */
export async function deleteWidget(
  id: string,
  setWidgets: Dispatch<SetStateAction<WidgetType[]>>,
  setError: Dispatch<SetStateAction<string>>
) {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/widgets/${id}`);
    setWidgets((prev: WidgetType[]) =>
      prev.filter((widget) => widget._id !== id)
    );
  } catch {
    setError("Widget konnte nicht gel\u00f6scht werden.");
  }
}
