"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type DashboardStats = {
  total_employees: number;
  total_attendance_today: number;
  present_today: number;
  top_present: {
    id: number;
    employee_id: string;
    full_name: string;
    department: string;
    present_days: number;
  }[];
};

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<DashboardStats>("/api/dashboard/")
      .then((data) => setStats(data))
      .catch(() =>
        setStats({
          total_employees: 0,
          total_attendance_today: 0,
          present_today: 0,
          top_present: [],
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white px-5 py-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#111827]">Overview</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div
            className="rounded-xl px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}
          >
            <div className="text-xs font-medium uppercase tracking-wide opacity-90">
              Total employees
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {stats?.total_employees ?? (loading ? "…" : 0)}
            </div>
          </div>
          <div
            className="rounded-xl px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)" }}
          >
            <div className="text-xs font-medium uppercase tracking-wide opacity-90">
              Attendance marked today
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {stats?.total_attendance_today ?? (loading ? "…" : 0)}
            </div>
          </div>
          <div
            className="rounded-xl px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg, #ea580c, #f97316)" }}
          >
            <div className="text-xs font-medium uppercase tracking-wide opacity-90">
              Present today
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {stats?.present_today ?? (loading ? "…" : 0)}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white px-5 py-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#111827]">
            Most regular (by Present days)
          </h2>
        </div>
        {loading ? (
          <p className="text-sm text-[#6b7280]">Loading…</p>
        ) : !stats || stats.top_present.length === 0 ? (
          <p className="text-sm text-[#6b7280]">No attendance data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="whitespace-nowrap px-3 py-2">Employee</th>
                  <th className="whitespace-nowrap px-3 py-2">Department</th>
                  <th className="whitespace-nowrap px-3 py-2">
                    Total present days
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.top_present.map((e) => (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="whitespace-nowrap px-3 py-2">
                      {e.full_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                      {e.department || "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                      {e.present_days}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
