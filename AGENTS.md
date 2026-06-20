# TaskForge AI

AI-powered project management platform (Linear/Notion/ClickUp caliber).  
Not a tutorial project — must feel venture-backed and premium.

---

## Brand

| Role | Hex |
|------|-----|
| Primary | `#209dd7` |
| Secondary | `#753991` |
| Accent | `#ecad0a` |
| Dark | `#032147` |
| Neutral | `#888888` |

Typography: Geist (already configured via `next/font` in `app/layout.tsx`).  
Design philosophy: Linear-like, minimal, high information density, intentional whitespace.

---

## Current State (Kanban MVP)

Everything lives in `frontend/`. All commands run there.

### What's built

- Single board, 5 fixed columns (renameable by clicking title)
- Cards with title + details toggle, add/delete, drag-and-drop (native HTML5 API)
- Dummy data on load (13 cards across 5 columns), in-memory React Context state
- 32 Jest unit tests passing, lint clean, dev server starts in ~1s

### Architecture

```
frontend/
  app/layout.tsx        # BoardProvider wraps <body>
  app/page.tsx          # Header + <Board>
  src/components/       # Board.tsx, Column.tsx, Card.tsx
  src/context/          # BoardContext.tsx (BoardProvider + useBoard)
  src/types/            # Card, Column, Board interfaces
  src/lib/dummyData.ts  # Initial state
```

### Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server :3000 |
| `npm test` | Jest unit tests |
| `npm run lint` | ESLint (flat config `eslint.config.mjs`) |
| `npm run format` | Prettier |
| `npm run e2e` | Playwright (no e2e dir exists yet) |

### Gotchas

- **Next.js 16 / React 19** — APIs differ from training data. Check `node_modules/next/dist/docs/` before writing new code.
- **Tailwind v4** — Uses `@import "tailwindcss"` and `@theme inline`, NOT old `@tailwind` directives.
- **Jest import** — `jest.config.ts` must `import nextJest from 'next/jest.js'` (ESM quirk, not `'next/jest'`).
- **State mutations** — React 19 Strict Mode double-invokes updaters. Context state must be immutable (copy arrays/objects before mutating).
- **Color scheme not applied** — Current app uses Tailwind defaults. Brand colors need to be added to `globals.css` `@theme inline` block.
- **@dnd-kit in deps** — Present but unused. Replace native HTML5 DnD when implementing proper drag-and-drop.
- **Path alias** `@/*` → `./src/*` (configured in `tsconfig.json`).
- **prettierrc** at `frontend/.prettierrc` (semicolons, single quotes, trailing commas).
- **`.env` at repo root** contains an OpenRouter API key — do not commit or expose.
- **No E2E tests** — Playwright configured but `frontend/e2e/` dir doesn't exist.

---

## Next: Build Phases (from Product Spec)

The vision doc defines 10 phases. The MVP (Phase 0/current) is done.  
Libraries to install before starting: **shadcn/ui, Framer Motion, Lucide Icons, Recharts, Zustand, React Hook Form, Zod**.

### Phase 1: Design System
Add brand color tokens to `globals.css` `@theme inline`, typography scale (Display XL → Caption).

### Phase 2: Application Shell
Top nav (logo, workspace selector, search, notifications, user menu) + collapsible sidebar (Dashboard, Boards, Analytics, AI, Team, Settings). Use Framer Motion for transitions.

### Phase 3: Premium Kanban Board
Replace current board with gradient column headers, progress indicators, card metadata (priority, due date, tags, assignee avatars, comment count). Implement @dnd-kit for smooth drag-and-drop with reorder within and across columns.

### Phase 4: AI Features
AI Task Generator, AI Prioritization, AI Sprint Planner, AI Insights Panel (mock implementations with realistic UI).

### Phase 5: Analytics
Charts (completion rate, velocity, burn down, productivity) using Recharts.

### Phase 6: Pricing Page
Free / Pro ($15/mo) / Team ($39/mo) / Enterprise pricing cards.

### Phase 7-10: Polish
Dark mode (primary), animations, accessibility, performance.

---

## Implementation Rules

1. TypeScript strictly — no `any`, no dead code, no hacky fixes
2. Premium appearance first — "Would this look believable in a Series A demo?"
3. `'use client'` on all interactive components
4. `data-testid` attributes for test selectors
5. Keep it simple — never over-engineer. No emojis.
