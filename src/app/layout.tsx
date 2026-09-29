import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SixLabs Screen Library",
  description: "Design handoff for SixLabs: the website and its design libraries.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
