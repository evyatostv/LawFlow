import type { Metadata } from "next";
import { Assistant, Heebo } from "next/font/google";
import "./globals.css";

const assistant = Assistant({ subsets: ["hebrew"], variable: "--font-body" });
const heebo = Heebo({ subsets: ["hebrew"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "LawFlow",
  description: "מערכת ניהול משרד לעורכי דין יחידים בישראל",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${heebo.variable}`}>
      <body className="font-body text-ink">{children}</body>
    </html>
  );
}
