import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Backdrop } from "@/components/shell/Backdrop";
import { Toaster } from "@/components/Hud";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillQuest",
  description: "Learn by playing: gamified, visual prep for cloud and AI certification exams.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <Backdrop />
          {children}
          <Toaster />
        </MotionProvider>
      </body>
    </html>
  );
}
