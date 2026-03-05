const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  // Handle endpoints that return no content (e.g. 204 DELETE)
  if (res.status === 204) {
    return null as T;
  }

  // Gracefully handle empty bodies even on 2xx
  const text = await res.text();
  if (!text) {
    return null as T;
  }

  return JSON.parse(text) as T;
}

