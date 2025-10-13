import type { Metadata } from "next";
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
