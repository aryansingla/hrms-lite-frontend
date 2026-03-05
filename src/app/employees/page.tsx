"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Employee = {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  present_days?: number;
};

type ApiListResponse = Employee[];

export default function EmployeesPage() {
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    department: "",
  });

  async function fetchEmployees(currentFilters = filters) {
    const params = new URLSearchParams();
    if (currentFilters.name) params.append("name", currentFilters.name);
    if (currentFilters.email) params.append("email", currentFilters.email);
    if (currentFilters.department)
      params.append("department", currentFilters.department);
    const qs = params.toString();

    setLoading(true);
    try {
      const data = await apiFetch<ApiListResponse>(
        `/api/employees/${qs ? `?${qs}` : ""}`,
      );
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.name) params.append("name", filters.name);
    if (filters.email) params.append("email", filters.email);
    if (filters.department) params.append("department", filters.department);
    const qs = params.toString();

    setLoading(true);
    apiFetch<ApiListResponse>(`/api/employees/${qs ? `?${qs}` : ""}`)
      .then((data) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filters.name, filters.email, filters.department]);

  function openAddModal() {
    setEditing(null);
    setForm({
      employee_id: "",
      full_name: "",
      email: "",
      department: "",
    });
    setModalOpen(true);
  }

  function openEditModal(emp: Employee) {
    setEditing(emp);
    setForm({
      employee_id: emp.employee_id,
      full_name: emp.full_name,
      email: emp.email,
      department: emp.department,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/api/employees/${editing.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/api/employees/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await fetchEmployees();
      setModalOpen(false);
    } catch {
      // keep simple for now
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(emp: Employee) {
    setDeleteTarget(emp);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">Employees</h2>
          <button
            type="button"
            className="rounded bg-[#1f6feb] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1d4ed8]"
            onClick={openAddModal}
          >
            Add employee
          </button>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Name</label>
            <input
              className="h-8 rounded-md border border-slate-200 px-2 text-sm"
              value={filters.name}
              onChange={(e) =>
                setFilters((f) => ({ ...f, name: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Email</label>
            <input
              className="h-8 rounded-md border border-slate-200 px-2 text-sm"
              value={filters.email}
              onChange={(e) =>
                setFilters((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Department
            </label>
            <input
              className="h-8 rounded-md border border-slate-200 px-2 text-sm"
              value={filters.department}
              onChange={(e) =>
                setFilters((f) => ({ ...f, department: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="whitespace-nowrap px-3 py-2">Employee ID</th>
                <th className="whitespace-nowrap px-3 py-2">Name</th>
                <th className="whitespace-nowrap px-3 py-2">Email</th>
                <th className="whitespace-nowrap px-3 py-2">Department</th>
                <th className="whitespace-nowrap px-3 py-2">
                  Total present days
                </th>
                <th className="whitespace-nowrap px-3 py-2 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-sm text-slate-500"
                  >
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-sm text-slate-500"
                  >
                    No employees yet.
                  </td>
                </tr>
              ) : (
                items.map((e) => (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-700">
                      {e.employee_id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      {e.full_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                      {e.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                      {e.department || "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                      {e.present_days ?? 0}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right text-xs">
                      <button
                        type="button"
                        className="mr-2 rounded border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                        onClick={() => openEditModal(e)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded bg-[#dc2626] px-2 py-1 text-[11px] text-white hover:bg-[#b91c1c]"
                        onClick={() => handleDelete(e)}
                      >
                        Delete
                      </button>
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
                {editing ? "Edit employee" : "Add employee"}
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
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Employee ID
                </label>
                <input
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={form.employee_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, employee_id: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Full name
                </label>
                <input
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, full_name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Department
                </label>
                <input
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  value={form.department}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, department: e.target.value }))
                  }
                />
              </div>
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

      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Delete employee
              </h2>
              <button
                type="button"
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setDeleteTarget(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {deleteTarget.full_name} ({deleteTarget.employee_id})
              </span>
              ? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-[#dc2626] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b91c1c]"
                onClick={async () => {
                  if (!deleteTarget) return;
                  try {
                    await apiFetch(`/api/employees/${deleteTarget.id}/`, {
                      method: "DELETE",
                    });
                    // Immediately remove from current table
                    setItems((prev) =>
                      prev.filter((e) => e.id !== deleteTarget.id),
                    );
                    // Best-effort full refresh from API
                    await fetchEmployees();
                  } catch {
                    // ignore
                  } finally {
                    setDeleteTarget(null);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

