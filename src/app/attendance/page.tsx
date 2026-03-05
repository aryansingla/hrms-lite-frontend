"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type EmployeeRow = {
  id: number;
  full_name: string;
  department: string;
  current_status: string;
  current_status_label: string;
  present_days: number;
};

export default function AttendancePage() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dateValue, setDateValue] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<"present" | "absent">(
    "present",
  );

  useEffect(() => {
    setLoading(true);
    apiFetch<EmployeeRow[]>(`/api/attendance/overview/?date=${dateValue}`)
      .then((data) => setRows(data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [dateValue]);

  function toggleSelected(id: number, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  }

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelectedIds(rows.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  }

  function openMarkModal() {
    if (!selectedIds.length) {
      alert("Select at least one employee.");
      return;
    }
    setModalOpen(true);
  }

  async function handleMark(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedIds.length) return;
    setSaving(true);
    try {
      await apiFetch("/api/attendance/bulk/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateValue,
          status: statusValue,
          employee_ids: selectedIds,
        }),
      });
      // refresh list for date
      const data = await apiFetch<EmployeeRow[]>(
        `/api/attendance/overview/?date=${dateValue}`,
      );
      setRows(data);
      setModalOpen(false);
    } catch {
      // ignore for now
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">Attendance</h2>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="h-8 rounded-md border border-slate-200 px-2 text-sm"
            />
            <button
              type="button"
              className="rounded bg-[#1f6feb] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1d4ed8]"
              onClick={openMarkModal}
            >
              Mark attendance
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="whitespace-nowrap px-3 py-2">
                  <input
                    type="checkbox"
                    checked={
                      rows.length > 0 && selectedIds.length === rows.length
                    }
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
                <th className="whitespace-nowrap px-3 py-2">Employee</th>
                <th className="whitespace-nowrap px-3 py-2">Department</th>
                <th className="whitespace-nowrap px-3 py-2">Status</th>
                <th className="whitespace-nowrap px-3 py-2">
                  Total present days
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-sm text-slate-500"
                  >
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-sm text-slate-500"
                  >
                    No employees yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="whitespace-nowrap px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r.id)}
                        onChange={(e) => toggleSelected(r.id, e.target.checked)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      {r.full_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                      {r.department || "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      {r.current_status ? (
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            r.current_status === "present"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {r.current_status_label}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          Not marked
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                      {r.present_days ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Mark attendance
              </h2>
              <button
                type="button"
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
                onClick={() => !saving && setModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleMark} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    value={statusValue}
                    onChange={(e) =>
                      setStatusValue(e.target.value as "present" | "absent")
                    }
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                {selectedIds.length} employees selected.
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => !saving && setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#1f6feb] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

