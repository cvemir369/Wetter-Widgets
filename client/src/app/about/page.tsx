// ================= About Page Component =========================
// Displays information about the Wetter Widgets project, including
// features, tech stack, and usage instructions. Styled with Tailwind CSS.
// ===============================================================

export default function About() {
  return (
    <main className="flex flex-col gap-4 p-6 rounded-lg shadow-lg mt-8 max-w-2xl mx-auto bg-neutral-900 text-neutral-100">
      {/* Project title */}
      <h1 className="text-3xl font-bold mb-4">Über dieses Projekt</h1>

      {/* Project description */}
      <p className="mb-4">
        Wetter Widgets ist eine moderne Webanwendung, mit der Sie Wetter-Widgets
        für verschiedene Städte erstellen und verwalten können. Die Anwendung
        nutzt die Open-Meteo API, um aktuelle Wetterdaten wie Temperatur und
        Wetterbeschreibung für den gewünschten Ort anzuzeigen.
      </p>

      {/* Widget usage explanation */}
      <p className="mb-4">
        Sie können beliebig viele Widgets für verschiedene Orte anlegen. Jedes
        Widget zeigt die aktuellen Wetterdaten für die gewählte Stadt an und
        kann bei Bedarf wieder entfernt werden. Die Bedienung ist einfach und
        intuitiv: Geben Sie den Namen einer Stadt ein, wählen Sie aus den
        Vorschlägen und erstellen Sie mit einem Klick ein neues Widget.
      </p>

      {/* Tech stack and backend info */}
      <p className="mb-4">
        Die Anwendung ist komplett ohne Benutzerkonto nutzbar. Alle Daten werden
        in einer Datenbank gespeichert und über eine eigene API bereitgestellt.
        Die Oberfläche ist mit <span className="font-semibold">Next.js</span>{" "}
        und <span className="font-semibold">Tailwind CSS</span> umgesetzt, das
        Backend basiert auf{" "}
        <span className="font-semibold">Node.js / Express.js</span> und{" "}
        <span className="font-semibold">MongoDB</span>.
      </p>

      {/* Feature list */}
      <p className="mb-4">Zu den wichtigsten Features gehören:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Erstellen und Löschen von Wetter-Widgets für beliebige Städte</li>
        <li>Live-Anzeige von Temperatur und Wetterbeschreibung</li>
        <li>Autocomplete für Stadtnamen mit Vorschlagsliste</li>
        <li>Responsives, modernes Design</li>
        <li>Keine Registrierung oder Anmeldung erforderlich</li>
      </ul>

      {/* Project purpose */}
      <p>
        Das Projekt eignet sich ideal, um moderne Webentwicklung mit React,
        Next.js, API-Anbindung und Datenbankintegration zu demonstrieren.
      </p>

      {/* GitHub link */}
      <a
        className="underline"
        href="https://github.com/cvemir369/Wetter-Widgets"
        target="_blank"
        rel="noopener noreferrer"
      >
        Zur Repository GitHub-Seite
      </a>
    </main>
  );
}
