import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "SixLabs Screen Library",
  description: "Design handoff for SixLabs: the website and its design libraries.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
