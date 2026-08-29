import { useState } from "react";
import AuthForm from "./AuthForm.jsx";
import TaskBoard from "./TaskBoard.jsx";

function loadSession() {
  try {
    const raw = localStorage.getItem("task-manager.session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [session, setSession] = useState(loadSession());

  function handleAuth(token, user) {
    const next = { token, user };
    localStorage.setItem("task-manager.session", JSON.stringify(next));
    setSession(next);
  }

  function handleLogout() {
    localStorage.removeItem("task-manager.session");
    setSession(null);
  }

  return session ? (
    <TaskBoard token={session.token} user={session.user} onLogout={handleLogout} />
  ) : (
    <AuthForm onAuth={handleAuth} />
  );
}
