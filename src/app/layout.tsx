import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold tracking-wide text-white">
                  HRMS
                </span>
                <span className="text-sm font-medium text-slate-700">
                  Lite
                </span>
              </div>
              <nav className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <a href="/" className="inline-flex items-center gap-1 rounded-full px-3 py-1 hover:bg-slate-100">
                  <span>Dashboard</span>
                </a>
                <a href="/employees" className="inline-flex items-center gap-1 rounded-full px-3 py-1 hover:bg-slate-100">
                  <span>Employees</span>
                </a>
                <a href="/attendance" className="inline-flex items-center gap-1 rounded-full px-3 py-1 hover:bg-slate-100">
                  <span>Attendance</span>
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
          </main>
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-slate-500">
              HRMS Lite · Simple internal HR tool
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
