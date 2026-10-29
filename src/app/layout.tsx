import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Starfield } from "@/components/fx";
import { Toaster } from "@/components/Hud";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cert Quest",
  description: "Learn by playing: gamified, visual prep for cloud and AI certification exams.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Starfield />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
