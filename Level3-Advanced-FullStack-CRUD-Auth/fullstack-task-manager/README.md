# Task Manager — Full-Stack CRUD Application + User Authentication

Codveda Web Development Internship — Level 3 (Advanced), Tasks 1 & 2 combined:
a full-stack CRUD app with a built-in JWT authentication system securing every task route.

## Stack

- **Backend:** Node.js, Express, JWT authentication, bcrypt password hashing
- **Database:** SQLite via Node's built-in `node:sqlite` module (Node.js ≥ 22.5) — a file-based
  relational database with zero native compilation and no external server or account needed,
  which keeps the project runnable anywhere. You'll see an "experimental feature" warning in the
  console when the server starts — that's expected and harmless. Swapping in PostgreSQL or MongoDB
  later only means changing `db.js` and the queries in `routes/`.
- **Frontend:** React (Vite), calling the API with the native `fetch` API

## Features

- Register / log in with a hashed password and a signed JWT
- Every `/api/tasks/*` route is protected — no token, no access (401)
- Tasks are scoped per user (`user_id`), so users only ever see their own data
- Full CRUD: create, read, update (edit + toggle complete), delete
- Session (token + user) persisted in the browser via `localStorage`

## Project structure

```
fullstack-task-manager/
├── backend/
│   ├── db.js              # SQLite schema (users, tasks)
│   ├── middleware/auth.js # JWT verification middleware
│   ├── routes/auth.js     # register / login
│   ├── routes/tasks.js    # CRUD, all routes require a valid token
│   ├── server.js          # Express app entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api.js          # fetch wrapper for the backend
    │   ├── AuthForm.jsx     # login / register form
    │   ├── TaskBoard.jsx    # task list + create/toggle/delete
    │   ├── App.jsx          # switches between auth and board
    │   └── index.css
    └── vite.config.js       # proxies /api to the backend on :4000
```

## Running it locally

**1. Backend**

```bash
cd backend
cp .env.example .env      # optionally change JWT_SECRET
npm install
npm run dev                # runs on http://localhost:4000
```

**2. Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev                 # runs on http://localhost:5173
```

Open http://localhost:5173, create an account, and start adding tasks.
The Vite dev server proxies `/api/*` requests to the backend automatically.

## API reference

| Method | Route              | Auth required | Description              |
|--------|---------------------|:--------------:|---------------------------|
| POST   | `/api/auth/register` | No             | Create an account          |
| POST   | `/api/auth/login`    | No             | Log in, receive a JWT      |
| GET    | `/api/tasks`         | Yes            | List the current user's tasks |
| POST   | `/api/tasks`         | Yes            | Create a task               |
| PUT    | `/api/tasks/:id`     | Yes            | Update title/description/completed |
| DELETE | `/api/tasks/:id`     | Yes            | Delete a task               |

Send the token as `Authorization: Bearer <token>` on every `/api/tasks` request.

## Notes for submission

- Backend and frontend were tested end-to-end locally (register → login → create → list → 401 on missing token) before packaging.
- `node_modules` and `dist` are excluded — run `npm install` in both `backend/` and `frontend/` before starting.
