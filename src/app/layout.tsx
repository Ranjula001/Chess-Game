import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cinematic Chess MVP",
  description: "Official chess rules presented as living tactical battle theatre."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
