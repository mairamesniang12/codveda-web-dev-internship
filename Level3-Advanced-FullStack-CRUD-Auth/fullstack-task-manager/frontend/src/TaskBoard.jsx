import { useEffect, useState } from "react";
import { api } from "./api";

export default function TaskBoard({ token, user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await api.getTasks(token);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const task = await api.createTask(token, title, description);
      setTasks([task, ...tasks]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(task) {
    try {
      const updated = await api.updateTask(token, task.id, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTask(token, id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className="board-shell">
      <header className="board-header">
        <div>
          <p className="eyebrow">Signed in as {user.name}</p>
          <h1>Your Tasks</h1>
        </div>
        <button className="btn-secondary" onClick={onLogout}>
          Log out
        </button>
      </header>

      <form onSubmit={handleCreate} className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="btn-primary">Add task</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <p className="task-counter">{remaining} task{remaining === 1 ? "" : "s"} remaining</p>

      {loading ? (
        <p className="empty-state">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">No tasks yet — add your first one above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={"task-item" + (task.completed ? " completed" : "")}>
              <button
                className="checkbox"
                onClick={() => handleToggle(task)}
                aria-label="Toggle complete"
              >
                {task.completed ? "✓" : ""}
              </button>
              <div className="task-text">
                <p className="task-title">{task.title}</p>
                {task.description && <p className="task-desc">{task.description}</p>}
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(task.id)}
                aria-label="Delete task"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
