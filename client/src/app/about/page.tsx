"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function About() {
  const [readme, setReadme] = useState<string>("Lade Projektbeschreibung...");

  useEffect(() => {
    fetch("/README.md")
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => setReadme(text))
      .catch(() => setReadme("README.md konnte nicht geladen werden."));
  }, []);

  return (
    <main className="prose prose-invert max-w-3xl mx-auto p-8 bg-neutral-900 rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-4">Über dieses Projekt</h1>
      <ReactMarkdown>{readme}</ReactMarkdown>
    </main>
  );
}
