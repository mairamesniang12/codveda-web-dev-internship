// ============================================
// Focus — To-Do List App
// Add / delete / complete tasks, persisted to localStorage
// ============================================

const STORAGE_KEY = "focus.todos";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const counter = document.getElementById("counter");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = loadTodos();
let currentFilter = "all";

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Could not read saved tasks:", err);
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text) {
  todos.push({
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
  });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.completed);
  if (currentFilter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

function render() {
  const filtered = getFilteredTodos();
  list.innerHTML = "";

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");

    const checkbox = document.createElement("button");
    checkbox.className = "checkbox";
    checkbox.setAttribute("aria-label", "Toggle complete");
    checkbox.textContent = todo.completed ? "✓" : "";
    checkbox.addEventListener("click", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, deleteBtn);
    list.appendChild(li);
  });

  const remaining = todos.filter((t) => !t.completed).length;
  counter.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;

  emptyState.classList.toggle("visible", filtered.length === 0);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addTodo(value);
  input.value = "";
  input.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
