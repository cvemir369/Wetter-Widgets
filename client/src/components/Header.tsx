"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="p-4 bg-neutral-900 flex gap-4 justify-between">
      <Link href="/" className="text-2xl font-bold text-white">
        Wetter Widgets
      </Link>
      <nav>
        <Link
          href="/"
          className={`mr-4 no-underline text-white hover:text-gray-600${
            pathname === "/" ? " font-bold" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`no-underline text-white hover:text-gray-600${
            pathname === "/about" ? " font-bold" : ""
          }`}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
