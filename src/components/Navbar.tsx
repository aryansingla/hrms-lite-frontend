"use client";

import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#e5e7eb] bg-[#f3f4f6] text-[#374151]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a href="/" className="no-underline text-[#111827]">
          <h1 className="m-0 text-lg font-semibold">HRMS Lite</h1>
        </a>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded border border-transparent p-1 text-[#4b5563] hover:bg-slate-200 sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 5h14v1.5H3V5Zm0 4.25h14v1.5H3v-1.5Zm0 4.25h14V15H3v-1.5Z" />
          </svg>
        </button>
        <nav className="hidden items-center gap-4 text-sm sm:flex">
          <a
            href="/"
            className="inline-flex items-center gap-1 text-[#4b5563] hover:text-[#111827]"
          >
            <span>Dashboard</span>
          </a>
          <a
            href="/employees"
            className="inline-flex items-center gap-1 text-[#4b5563] hover:text-[#111827]"
          >
            <span>Employees</span>
          </a>
          <a
            href="/attendance"
            className="inline-flex items-center gap-1 text-[#4b5563] hover:text-[#111827]"
          >
            <span>Attendance</span>
          </a>
        </nav>
      </div>
      {open && (
        <nav className="sm:hidden">
          <div className="flex flex-col items-start gap-2 border-t border-[#e5e7eb] bg-[#f3f4f6] px-4 py-2 text-sm">
            <a
              href="/"
              className="inline-flex items-center gap-1 text-[#4b5563] hover:text-[#111827]"
              onClick={() => setOpen(false)}
            >
              <span>Dashboard</span>
            </a>
            <a
              href="/employees"
              className="inline-flex items-center gap-1 text-[#4b5563] hover:text-[#111827]"
              onClick={() => setOpen(false)}
            >
              <span>Employees</span>
            </a>
            <a
              href="/attendance"
              className="inline-flex items-center gap-1 text-[#4b5563] hover:text-[#111827]"
              onClick={() => setOpen(false)}
            >
              <span>Attendance</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

