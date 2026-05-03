import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Learn Anything — AI Learning Assistant",
  description:
    "Enter any topic and grade level to get a structured explanation, key learning points, and an interactive quiz powered by AI.",
  keywords: ["learning", "education", "AI", "quiz", "study"],
  openGraph: {
    title: "Learn Anything — AI Learning Assistant",
    description: "Structured AI-powered learning for every grade level.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
