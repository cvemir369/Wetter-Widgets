import axios from "axios";

import { Dispatch, SetStateAction } from "react";

type WidgetType = {
  _id: string;
  location: string;
  weather?: {
    temperature: number;
    description: string;
  };
};

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
      setError("Für diese Stadt existiert bereits ein Widget.");
    } else {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  }
}

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
    setError("Widget konnte nicht gelöscht werden.");
  }
}
