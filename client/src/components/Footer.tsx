// ================= Footer Component =============================
// Displays the global footer for the Wetter Widgets app, including
// copyright and branding. Stays at the bottom of the page.
// ===============================================================

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900 text-neutral-200 py-4 text-center mt-auto">
      <span className="text-sm">
        &copy; {new Date().getFullYear()} Wetter Widgets. All rights reserved.
      </span>
    </footer>
  );
}
