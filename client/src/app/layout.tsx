// ================= Root Layout Component ========================
// Defines the global layout for the Wetter Widgets app, including
// font setup, global styles, header, footer, and page metadata.
// All pages are rendered within this layout.
// ===============================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Load Geist Sans and Geist Mono fonts from Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Global metadata for the app (used by Next.js for SEO)
export const metadata: Metadata = {
  title: "Wetter Widgets",
  description:
    "Erhalten Sie die neuesten Wetteraktualisierungen für Ihren Standort.",
};

/**
 * RootLayout wraps all pages in the app, providing global structure and styles.
 * - Sets up custom fonts and antialiasing
 * - Renders Header and Footer on every page
 * - Injects global metadata
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col gap-4">
          {/* Global header */}
          <Header />
          {/* Page content */}
          {children}
          {/* Global footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
