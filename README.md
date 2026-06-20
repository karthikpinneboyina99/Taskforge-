<div align="center">
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/TaskForge-209dd7?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjMjA5ZGQ3Ii8+PHBhdGggZD0iTTEwIDE2TDE0IDIwTDIyIDEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+" />
    <img alt="TaskForge" src="https://img.shields.io/badge/TaskForge-209dd7?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjMjA5ZGQ3Ii8+PHBhdGggZD0iTTEwIDE2TDE0IDIwTDIyIDEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+" />
  </picture>
  <h1 align="center" style="margin-top: 8px; font-size: 2.5rem; font-weight: 700; letter-spacing: -0.02em;">TaskForge AI</h1>
  <p align="center" style="font-size: 1.1rem; color: #888; max-width: 500px;">
    AI-powered project management platform — Kanban boards, analytics, auth, and more.
  </p>
  <br />
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React%2019-087ea4?style=flat-square&logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169e1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind%20v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind v4" />
    <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
    <img src="https://img.shields.io/badge/Docker-2496ed?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  </p>
  <br />
</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Auth System](#auth-system)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [Design System](#design-system)
- [Database](#database)
- [Scripts & Commands](#scripts--commands)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Future Development](#future-development)
- [Contributing](#contributing)

---

## Overview

TaskForge is a full-stack project management platform designed to feel premium and production-ready. It features a drag-and-drop Kanban board, role-based authentication (Admin / Employee / External), AI-powered insights, analytics dashboards, and a polished Apple-inspired UI.

Built with a **separate backend architecture** — a Next.js 16 frontend communicates with an Express API server, which handles all authentication and database operations. PostgreSQL runs in Docker for data persistence.

---

## Tech Stack

### Frontend (`frontend/`)

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling with `@theme inline` design tokens |
| **Framer Motion** | Page transitions and micro-animations |
| **Zustand** | Lightweight state management (UI store) |
| **React Context** | Auth state and board state |
| **Lucide Icons** | Icon library |
| **Recharts** | Charts and analytics |
| **shadcn/ui** | UI primitives (button, etc.) |
| **@dnd-kit** | Drag-and-drop for Kanban cards |
| **Jest + Testing Library** | Unit tests |
| **Playwright** | E2E tests (configured, no tests yet) |

### Backend (`backend/`)

| Technology | Purpose |
|------------|---------|
| **Express** | HTTP server and routing |
| **TypeScript** | Type safety (compiled via `tsx`) |
| **PostgreSQL (pg)** | Database driver |
| **bcryptjs** | Password hashing |
| **jose** | JWT creation and verification |
| **cors** | Cross-origin requests (dev only) |
| **dotenv** | Environment variable loading |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker (PostgreSQL 16 Alpine)** | Local database |
| **Docker Compose** | Container orchestration |

---

## Architecture

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│              │  HTTP  │              │  SQL   │              │
│  Next.js 16  │ ─────▶ │  Express API │ ─────▶ │  PostgreSQL  │
│  (port 3000) │        │  (port 4000) │        │  (port 5432) │
│              │ ◀───── │              │ ◀───── │              │
└──────────────┘        └──────────────┘        └──────────────┘
       │
       │ Next.js rewrites /api/* → localhost:4000/api/*
       │
       ▼
  Browser (no CORS issues)
```

### Key Design Decisions

- **Separate backend** — Express on port 4000 handles all auth/database logic. Next.js proxies `/api/*` via rewrites (no CORS in production).
- **Client-side auth** — JWT stored in `localStorage`. Auth state managed via React Context (`AuthProvider`).
- **Route protection** — Authenticated pages in the `(app)` route group are wrapped with `AppShell`, which checks auth and redirects unauthenticated users to `/`.
- **Session timeout** — 40 minutes of inactivity triggers automatic logout.
- **Design tokens as CSS variables** — All colors go through `@theme inline` in `globals.css` so Tailwind utilities like `bg-card`, `text-muted-subtle` work everywhere.

---

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker Desktop (for PostgreSQL)
- npm

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd taskforge

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Go back to root
cd ..
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts PostgreSQL 16 Alpine on port `5432` with:
- User: `taskforge`
- Password: `taskforge_secret`
- Database: `taskforge`

### 3. Configure Environment

Create `backend/.env`:

```bash
DATABASE_URL=postgresql://taskforge:taskforge_secret@localhost:5432/taskforge
JWT_SECRET=your-secret-key-change-in-production
```

Create `frontend/.env.local`:

```bash
API_URL=http://localhost:4000
# Optional: for AI features
OPENROUTER_API_KEY=your-openrouter-key
```

> **Note:** `.env*` files are gitignored. The root `.env` file is for local reference only.

### 4. Initialize Database

```bash
# Start the backend (this will auto-create tables and seed data)
cd backend && npm run dev
```

Then visit `http://localhost:4000/api/setup` in your browser or run:

```bash
curl http://localhost:4000/api/setup
```

### 5. Start Development

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** — you'll see the login page.

---

## Auth System

### Roles

| Role | Description | Login Tab |
|------|-------------|-----------|
| **Admin** | Full system access | **Admin** tab |
| **Employee** | Company team member | **Employee** tab (sign up first) |
| **External** | Guest collaborator | **External** tab (sign up first) |

### Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin (seeded) | `karthikpinneboyina@gmail.com` | `kanban@123` |
| Employee | Self-register | Set during signup |
| External | Self-register | Set during signup |

### Flow

1. Visit `/` — unified login page with three-tab toggle
2. **Admin**: Enter email + password → sign in directly
3. **Employee / External**: Fill signup form → account created → click "Sign in now" → enter credentials
4. After login → redirected to `/boards`
5. **Session timeout**: 40 minutes of inactivity (mouse, keyboard, touch) → auto-logout → redirect to `/`

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user (role: employee or external) |
| POST | `/api/auth/login` | No | Login as employee or external |
| POST | `/api/auth/admin/login` | No | Login as admin |
| GET | `/api/auth/me` | Bearer token | Get current user info |
| GET | `/api/setup` | No | Initialize database with schema and seed |

---

## Project Structure

```
taskforge/
├── backend/                          # Express API server
│   ├── src/
│   │   ├── index.ts                  # Server entry (port 4000)
│   │   ├── db.ts                     # PostgreSQL connection pool
│   │   ├── db-init.ts                # Table creation + seed data
│   │   ├── auth.ts                   # JWT create/verify helpers
│   │   └── routes/
│   │       ├── auth.ts               # Auth endpoints
│   │       └── setup.ts              # DB setup endpoint
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
├── frontend/                         # Next.js 16 application
│   ├── app/
│   │   ├── page.tsx                  # Login page (unified with three tabs)
│   │   ├── layout.tsx                # Root layout (AuthProvider, BoardProvider)
│   │   ├── globals.css               # Tailwind v4 + @theme design tokens
│   │   ├── (app)/                    # Protected routes (auth required)
│   │   │   ├── layout.tsx            # AppShell wrapper (auth guard)
│   │   │   ├── boards/page.tsx       # Kanban board
│   │   │   ├── dashboard/page.tsx    # Dashboard
│   │   │   ├── analytics/page.tsx    # Analytics charts
│   │   │   ├── ai/page.tsx           # AI features
│   │   │   ├── team/page.tsx         # Team page
│   │   │   ├── settings/page.tsx     # Settings
│   │   │   └── pricing/page.tsx      # Pricing plans
│   │   ├── (auth)/                   # Redirect pages (→ /)
│   │   │   ├── login/page.tsx
│   │   │   ├── admin/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   └── api/ai/chat/route.ts     # OpenRouter proxy (Next.js API route)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppShell.tsx          # App layout with auth guard + TopNav
│   │   │   ├── TopNav.tsx            # Netflix-style centered nav bar
│   │   │   ├── Board.tsx             # Kanban board with drag-and-drop
│   │   │   ├── Column.tsx            # Board column
│   │   │   ├── Card.tsx              # Kanban card
│   │   │   ├── AIChatbot.tsx         # AI chatbot panel
│   │   │   └── ui/button.tsx         # shadcn/ui button primitive
│   │   ├── context/
│   │   │   ├── AuthContext.tsx        # Auth state, login, register, logout, session timeout
│   │   │   └── BoardContext.tsx       # Board state (cards, columns)
│   │   ├── store/
│   │   │   └── uiStore.ts            # Zustand UI state (dark mode, active page)
│   │   ├── lib/
│   │   │   ├── auth.ts               # JWT utilities (frontend-side)
│   │   │   ├── utils.ts              # Tailwind class merge utility
│   │   │   └── dummyData.ts          # Initial Kanban seed data
│   │   └── types/index.ts            # TypeScript interfaces
│   ├── jest.config.ts
│   ├── next.config.ts                # Rewrites /api/* → localhost:4000
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml                # PostgreSQL 16 Alpine
├── .gitignore
└── README.md
```

---

## Available Pages

| URL | Description | Auth Required |
|-----|-------------|:---:|
| `/` | Premium login page (Apple-inspired glassmorphism UI) | No |
| `/boards` | Kanban board with 5 columns, drag-and-drop cards | Yes |
| `/dashboard` | Project dashboard | Yes |
| `/analytics` | Charts and analytics (Recharts) | Yes |
| `/ai` | AI features (task generation, insights) | Yes |
| `/team` | Team management | Yes |
| `/settings` | User/workspace settings | Yes |
| `/pricing` | Pricing plans (Free / Pro / Team / Enterprise) | Yes |
| `/login` | Redirects to `/` | — |
| `/admin` | Redirects to `/` | — |
| `/register` | Redirects to `/` | — |

---

## Design System

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#209dd7` | Buttons, links, active states |
| `--secondary` | `#753991` | Gradients, accents |
| `--accent` | `#ecad0a` | Highlights, warnings |
| `--brand-dark` | `#032147` | Deep navy |
| `--neutral` | `#888888` | Subtle text, borders |

### Typography

- **Font**: Geist (Vercel's font family, configured via `next/font`)
- **Scale**: Display XL (4.5rem) → Caption (0.75rem)
- **Philosophy**: Linear-like, minimal, high information density

### Theme

- **Default**: Dark mode (`.dark` class on `<html>`)
- **Toggle**: Light/dark switch in TopNav
- **Implementation**: CSS variables in `@theme inline` block, `.dark` variant via `@custom-variant dark`

---

## Database

### Schema (`users` table)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee', 'external')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Seeded Data

| Email | Role | Password |
|-------|------|----------|
| `karthikpinneboyina@gmail.com` | Admin | `kanban@123` |

(Employee and External users register themselves.)

---

## Scripts & Commands

### Frontend (`cd frontend`)

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server on :3000 |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm test` | Run Jest unit tests (32 tests) |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier formatting |
| `npm run e2e` | Playwright E2E (no tests yet) |

### Backend (`cd backend`)

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server on :4000 with hot-reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Start compiled server |
| `npm run setup` | Run database initialization directly |

### Root

| Command | Action |
|---------|--------|
| `docker compose up -d` | Start PostgreSQL |
| `docker compose down` | Stop PostgreSQL |

---

## Environment Variables

### Root `.env`

```
OPENROUTER_API_KEY=sk-or-v1-...
DATABASE_URL=postgresql://taskforge:taskforge_secret@localhost:5432/taskforge
JWT_SECRET=taskforge-dev-secret-change-in-production
```

### `backend/.env`

```
DATABASE_URL=postgresql://taskforge:taskforge_secret@localhost:5432/taskforge
JWT_SECRET=taskforge-dev-secret-change-in-production
```

### `frontend/.env.local`

```
API_URL=http://localhost:4000
OPENROUTER_API_KEY=sk-or-v1-...     # Optional, for AI Chat
```

> **Security**: Never commit `.env` files. They are covered by `.gitignore`.

---

## Testing

### Unit Tests (Jest)

```bash
cd frontend && npm test
```

32 tests covering:
- Board component rendering and interactions
- Column rendering and card management
- Card drag-and-drop state
- Board context state management

### Lint

```bash
cd frontend && npm run lint
```

---

## Future Development

The project is structured for phased development. Planned enhancements:

### Phase 1: Design System (Done)
- Brand color tokens in `globals.css`
- Typography scale (Display XL → Caption)

### Phase 2: Application Shell (Done)
- Top nav (logo, nav links, user menu, dark mode toggle)
- Auth protection for all routes
- 40-min inactivity session timeout

### Phase 3: Premium Kanban Board (Done)
- Gradient column headers
- Drag-and-drop with @dnd-kit
- Card metadata (assignee, due date, tags, priority)

### Phase 4: AI Features (Scaffolded)
- AI Task Generator
- AI Prioritization
- AI Sprint Planner
- AI Insights Panel (via OpenRouter)

### Phase 5-10: Roadmap
- **Analytics**: Completion rate, velocity, burn-down charts (Recharts)
- **Pricing Page**: Free / Pro / Team / Enterprise
- **Dark Mode Polish**: Full theme consistency
- **Animations**: Framer Motion page transitions
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Code splitting, lazy loading
- **E2E Tests**: Playwright test suite
- **Real-time**: WebSocket for live board updates
- **File Attachments**: Upload to cards
- **Notifications**: In-app and email

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <br />
  <p style="color: #888; font-size: 0.85rem;">
    Built with Next.js 16, React 19, Express, PostgreSQL, and TypeScript.
  </p>
  <p style="color: #555; font-size: 0.8rem;">
    &copy; 2026 TaskForge. All rights reserved.
  </p>
</div>
