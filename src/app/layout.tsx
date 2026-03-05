import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRMS Lite",
  description: "Simple internal HR tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f3f4f6] text-[#374151]`}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 py-6">
            <div className="mx-auto max-w-5xl px-4">{children}</div>
          </main>
          <footer className="mt-auto border-t border-[#e5e7eb] bg-transparent">
            <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-[#6b7280]">
              HRMS Lite · Simple internal HR tool
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
