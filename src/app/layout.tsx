import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Hud, Toaster } from "@/components/Hud";
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
  title: "AI Practitioner Quest",
  description: "Gamified study app for the AWS Certified AI Practitioner (AIF-C01) exam.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Hud />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
