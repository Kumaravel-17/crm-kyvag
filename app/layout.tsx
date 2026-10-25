import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { themeScript } from "@/lib/theme";
import "./globals.css";

// Served by Next.js from this app (no request to Google at runtime); variable font, so every weight is available
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kyvag CRM",
  description: "Capture, score and convert merchant leads from every channel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
