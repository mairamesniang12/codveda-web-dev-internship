const BASE_URL = "/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong.");
  }
  return data;
}

export const api = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  getTasks: (token) => request("/tasks", { token }),

  createTask: (token, title, description) =>
    request("/tasks", { method: "POST", token, body: { title, description } }),

  updateTask: (token, id, patch) =>
    request(`/tasks/${id}`, { method: "PUT", token, body: patch }),

  deleteTask: (token, id) =>
    request(`/tasks/${id}`, { method: "DELETE", token }),
};
