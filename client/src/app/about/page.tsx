import React from "react";

const AboutPage = () => (
  <main className="max-w-2xl mx-auto p-8 sm:p-16 flex flex-col gap-6">
    <h1 className="text-3xl font-bold mb-2">About This App</h1>
    <p>
      Wetter Widgets is a modern weather application that provides real-time
      weather updates, forecasts, and interactive widgets for your convenience.
      Built with React and TypeScript, it aims to deliver a fast, reliable, and
      user-friendly experience.
    </p>
    <ul className="list-disc list-inside pl-2 space-y-1">
      <li>Real-time weather data</li>
      <li>Customizable widgets</li>
      <li>Responsive design</li>
      <li>Open-source and privacy-focused</li>
    </ul>
    <p>
      Developed by passionate engineers to help you stay informed about the
      weather, wherever you are.
    </p>
  </main>
);

export default AboutPage;
