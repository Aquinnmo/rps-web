import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rock Paper Scissors",
  description: "Play rock paper scissors against the computer in a responsive single-page experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="fixed right-6 top-6 z-50">
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            About
          </Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
