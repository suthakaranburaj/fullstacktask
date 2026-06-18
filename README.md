# NoteNest

A full-stack notes application for capturing, organizing, and sharing ideas. Built with a Node.js/Express API and a Next.js frontend.

**Live app:** [https://notes-app-v1-sigma.vercel.app](https://notes-app-v1-sigma.vercel.app)

---

## Overview

NoteNest lets users sign in with Google, create rich-text notes, search and filter their workspace, pin important notes, and share notes with other users or via a link. The backend is a versioned REST API backed by MongoDB. The frontend is a responsive dashboard with light and dark themes.

---

## Features

### Authentication and security

- Google OAuth sign-in (one-click login)
- JWT access tokens with refresh token rotation
- Secure logout with server-side refresh token revocation
- Protected routes on the frontend and authenticated API endpoints on the backend
- Automatic token refresh when the access token expires
- Helmet security headers, CORS, rate limiting, and request compression on the API

### Notes management

- Create, read, update, and delete notes
- Rich text editor (headings, bold, italic, underline, strikethrough, lists, blockquotes, links)
- Pin and unpin notes (pinned notes appear first)
- Tags on notes (up to 20 per note)
- Server-side search by title and content (debounced in the UI)
- Client-side tag filtering
- Note list with previews, created date, and updated date
- Sticky note detail panel on larger screens
- Delete confirmation before removing a note

### Sharing and collaboration (foundation)

- Share notes with registered users by email
- Collaborator roles stored in the database (`viewer` and `editor`)
- Link sharing: enable or disable a share link and copy the URL
- Shared notes appear in the collaborator's dashboard
- Dedicated shared note page at `/shared/[token]` (requires sign-in)
- Share dialog with user invite and link-sharing tabs

### User experience

- Marketing homepage with features, how-it-works, and call-to-action sections
- Light, dark, and system theme support
- Onboarding tour for first-time users (replayable from the dashboard)
- Loading skeletons, empty states, and error pages (401, 403, 500, maintenance, offline)
- Framer Motion animations across the app
- Responsive layout for desktop, tablet, and mobile
- Cold-start notice when the hosted backend is waking up (Render free tier)

### Backend API

- Versioned REST API under `/api/v1`
- Health check endpoint (`GET /health`) with server and database status
- Standardized JSON response format
- MongoDB models for users, notes, and auth tokens
- Graceful shutdown on process signals
- Centralized error handling and request logging

---

## Tech stack

| Layer | Technologies |
|-------|--------------|
| Backend | Node.js, TypeScript, Express 5, Mongoose, MongoDB |
| Auth | Google OAuth, JWT, hashed refresh tokens |
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Radix UI, shadcn-style components |
| Editor | React Quill |
| Theming | next-themes |
| Animation | Framer Motion |
| Hosting | Vercel (frontend), Render (backend) |

---

## Project structure

```
fullstacktask/
├── backend/          # Express API (TypeScript)
│   └── src/
│       ├── modules/v1/   # Auth and notes routes
│       ├── models/       # User, Note, AuthToken
│       ├── middleware/   # Auth, security, rate limiting
│       └── config/       # Database and environment
├── frontend/
│   └── client/       # Next.js app
│       └── app/          # Pages and dashboard
└── core/             # Core assignment (debugging task)
```

---

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Google Cloud OAuth 2.0 credentials (Web client)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in values
npm run dev
```

### Frontend

```bash
cd frontend/client
npm install
cp .env.example .env   # fill in values
npm run dev
```

The frontend runs on port **3001** by default. Configure `NEXT_PUBLIC_API_URL` to point at your backend (for example `http://localhost:5000/api/v1`).

See `backend/.env.example` and `frontend/client/.env.example` for the full list of environment variables.

### Production build (backend)

```bash
cd backend
npm install --include=dev
npm run build
npm start
```

On Render, use **Build command:** `npm install --include=dev && npm run build` and **Start command:** `npm start` (not `npm run dev`).

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/auth/google` | Google sign-in |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/me` | Current user |
| GET | `/api/v1/notes` | List notes (optional `?search=`) |
| POST | `/api/v1/notes` | Create note |
| GET | `/api/v1/notes/:id` | Get note |
| PUT | `/api/v1/notes/:id` | Update note |
| DELETE | `/api/v1/notes/:id` | Delete note |
| POST | `/api/v1/notes/:id/share/users` | Share with users |
| GET | `/api/v1/notes/:id/share` | Share metadata |
| POST | `/api/v1/notes/:id/share/link` | Toggle link sharing |
| GET | `/api/v1/notes/shared/:token` | View shared note |

All notes and share routes require a valid Bearer token except `/health` and `/auth/google`.

---

## Future features

- **Live collaborative editor** — real-time co-editing with multiple users on the same note, similar to Google Docs
- **Version control** — full edit history, named versions, and the ability to restore previous versions of a note
- Role-based permissions enforced end-to-end (`viewer` vs `editor`)
- Remove collaborators and manage share settings from the UI
- Separate views for owned notes vs notes shared with you

---

## License

ISC
