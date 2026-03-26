import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IntervueX",
  description: "AI Interview Practice Platform",
  icons: {
    icon: "/image.png", 
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}