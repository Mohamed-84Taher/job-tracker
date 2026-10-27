# Job Tracker — Agent Instructions

> These instructions are auto-loaded by the agent whenever working inside
> `c:\Projects\job-tracker`. They replace the need to re-read every source file
> at the start of each session.

---

## 1. Project Overview

| Key           | Value                                                         |
| ------------- | ------------------------------------------------------------- |
| Name          | `job-tracker`                                                 |
| Type          | Front-only SPA, offline-first, portfolio project              |
| Tech          | React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4           |
| State         | `useReducer` + React Context (`ApplicationsProvider`)         |
| Storage       | IndexedDB via `idb` (db: `job-tracker-db`, store: `applications`) |
| Routing       | `react-router` v8 with `HashRouter` (GitHub Pages compatible) |
| Drag & Drop   | `@dnd-kit/react` + `@dnd-kit/helpers` (v0.5)                 |
| Validation    | Zod v4                                                        |
| Dates         | `date-fns` v4                                                 |
| IDs           | `nanoid` v6                                                   |
| Deploy        | GitHub Pages via `actions/deploy-pages@v4`                    |
| Base path     | `VITE_BASE_PATH=/job-tracker/` in CI; `/` locally             |
| Repo          | `Mohamed-84Taher/job-tracker`, branch `dev` for work          |
| Plan          | `c:\Projects\job-application-tracker-plan.md` (10 phases)     |

---

## 2. Folder Structure (source files only)

```
src/
├── app/                          # (reserved — future providers/router config)
│   └── .gitkeep.ts
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── components/                   # Shared / reusable UI
│   ├── index.ts                  # Barrel exports
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Header.tsx                # Top bar: logo, job count, "New Application" btn
│   └── Modal.tsx                 # Accessible overlay modal (Escape, click-outside)
├── features/
│   ├── applications/             # ★ Core feature module
│   │   ├── index.ts              # Barrel re-export for the entire feature
│   │   ├── types.ts              # Application, Status, STATUSES, FilterStatus, SortOption, ApplicationFilterState
│   │   ├── schema.ts             # Zod schemas (applicationSchema, applicationFormSchema, etc.)
│   │   ├── applicationReducer.ts # useReducer actions: LOAD | ADD | EDIT | DELETE | REORDER
│   │   ├── ApplicationContext.ts # React Context definition (ApplicationsContextValue)
│   │   ├── ApplicationProvider.tsx  # Provider: loads from IndexedDB, exposes CRUD + reorder + move
│   │   ├── useApplications.ts    # Hook: consumes ApplicationsContext
│   │   ├── useApplicationFilters.ts # Hook: debounced search, URL-synced filters, sorting
│   │   └── components/
│   │       ├── ApplicationCard.tsx
│   │       ├── ApplicationFilters.tsx   # Search bar, status tabs, advanced filters drawer, sort
│   │       ├── ApplicationForm.tsx      # Modal form with Zod validation
│   │       ├── ApplicationList.tsx      # List view (table-like cards)
│   │       ├── KanbanBoard.tsx          # 4-column drag-and-drop board
│   │       ├── KanbanColumn.tsx         # Single kanban column
│   │       ├── SortableApplicationCard.tsx # dnd-kit draggable wrapper
│   │       └── StatusBadge.tsx          # Colored status pill
│   ├── settings/                 # (Phase 6 — dark mode toggle, preferences)
│   │   └── .gitkeep.ts
│   └── stats/                    # (Phase 5 — recharts dashboard)
│       └── .gitkeep.ts
├── lib/
│   ├── storage.ts                # IndexedDB adapter: getAll, save, saveAll, remove, clear
│   └── sampleData.ts             # SAMPLE_APPLICATIONS constant for demo/reset
├── tests/
│   └── .gitkeep.ts
├── App.tsx                       # Root component: view toggle, filters, modal wiring
├── index.css                     # Tailwind v4 directives
└── main.tsx                      # Entry: StrictMode → HashRouter → ApplicationsProvider → App
```

---

## 3. Data Model

```ts
type Status = 'applied' | 'interview' | 'offer' | 'rejected';

interface Application {
  id: string;           // nanoid
  company: string;
  role: string;
  status: Status;
  location?: string;
  salary?: string;
  link?: string;        // validated as URL by Zod
  notes?: string;
  appliedAt: string;    // ISO datetime
  followUpAt?: string;  // ISO datetime
  order: number;        // position in column
}
```

---

## 4. Architecture & Patterns

### State flow
```
IndexedDB  ←→  ApplicationsProvider (useReducer)
                  ↕ context
               App.tsx
              ↙       ↘
     KanbanBoard    ApplicationList
```

- **Write path**: action → persist to IndexedDB → dispatch to reducer.
- **Read path**: on mount, `storage.getAll()` → `dispatch({ type: 'LOAD' })`.
- **Filtering**: `useApplicationFilters(applications)` derives filtered data
  from URL `searchParams`. The URL is the single source of truth for filters.

### URL parameters (HashRouter)
| Param      | Purpose                          |
| ---------- | -------------------------------- |
| `q`        | Search query (debounced 300ms)   |
| `status`   | Filter by status (or omit=all)   |
| `from`     | Date range start (YYYY-MM-DD)    |
| `to`       | Date range end (YYYY-MM-DD)      |
| `followUp` | `"1"` to show only follow-ups    |
| `sort`     | SortOption                       |
| `view`     | `"board"` or `"list"`            |

---

## 5. Key Conventions

- **Imports**: use barrel `./features/applications` for public API; direct
  imports only inside the feature folder.
- **Component style**: Tailwind utility classes, no CSS modules. Tailwind v4
  uses `@import "tailwindcss"` in `index.css` (no `@tailwind` directives).
- **TypeScript**: strict mode. Zero lint warnings required (`npm run lint`).
  Zero type errors required (`npm run build` runs `tsc -b && vite build`).
- **Comments/docstrings**: preserve all existing JSDoc and comments unless
  they conflict with a code change.
- **PowerShell pitfalls**: use `;` instead of `&&` for chaining commands.
  Use `Get-ChildItem` instead of `dir /b`.
- **Git**: work on `dev` branch. Commit messages follow conventional commits
  (`feat:`, `fix:`, `refactor:`, etc.).

---

## 6. CI/CD Pipeline

File: `.github/workflows/deploy.yml`

- Triggers on `push`/`pr` to `main` and `workflow_dispatch`.
- Steps: checkout → setup-node 22 → `npm ci` → `npm run lint` → `npm run build`
  (with `VITE_BASE_PATH=/job-tracker/`) → upload-pages-artifact → deploy-pages.
- Requires GitHub Pages enabled in repo Settings → Pages → source: GitHub Actions.

---

## 7. Phase Progress

| Phase | Name                          | Status      |
| ----- | ----------------------------- | ----------- |
| 0     | Setup & first deploy          | ✅ Complete |
| 1     | Data model & storage          | ✅ Complete |
| 2     | Basic UI                      | ✅ Complete |
| 3     | Kanban board                  | ✅ Complete |
| 4     | Search, filters, sorting      | ✅ Complete |
| 5     | Stats dashboard (recharts)    | ⬜ Next     |
| 6     | Reminders & extras            | ⬜ Planned  |
| 7     | PWA & offline                 | ⬜ Planned  |
| 8     | Testing (Vitest)              | ⬜ Planned  |
| 9     | CI/CD & quality               | ⬜ Planned  |
| 10    | Portfolio polish & v1.0.0     | ⬜ Planned  |

Full plan: `c:\Projects\job-application-tracker-plan.md`

---

## 8. Quick Reference Commands

```powershell
# Development
cd c:\Projects\job-tracker
npm run dev              # Vite dev server (default port 5173)

# Verify before commit
npm run lint ; npm run build

# Git workflow
git add . ; git commit -m "feat(scope): description"
```

---

## 9. What to Read for Each Phase

When implementing a new phase, read only these files — do NOT re-read the
entire codebase:

### Phase 5 (Stats Dashboard)
- This `GEMINI.md` for architecture context
- `c:\Projects\job-application-tracker-plan.md` lines 114-122
- `src/features/applications/types.ts` (data model)
- `src/features/applications/index.ts` (what's already exported)
- `src/App.tsx` (to add route / navigation)
- `src/main.tsx` (router setup — already HashRouter)
- `src/components/Header.tsx` (to add Tracker↔Stats navigation links)
- `package.json` (check if recharts is installed)
- **Create in**: `src/features/stats/`

### Phase 6 (Reminders & Extras)
- This `GEMINI.md`
- `c:\Projects\job-application-tracker-plan.md` lines 125-131
- `src/features/applications/types.ts` (`followUpAt` field)
- `src/features/applications/ApplicationProvider.tsx` (may need new actions)
- `src/App.tsx`
- `src/index.css` (dark mode Tailwind config)
- **Create in**: `src/features/settings/`

### Phase 7 (PWA)
- `vite.config.ts` (add `vite-plugin-pwa`)
- `index.html` (manifest link, meta tags)
- `public/` (icons, manifest)

### Phase 8 (Testing)
- `package.json` (add vitest, @testing-library/react)
- `src/lib/storage.ts`, `src/features/applications/applicationReducer.ts` (unit test targets)
- `src/features/applications/useApplicationFilters.ts` (filter logic to test)

### Phase 9 (CI/CD)
- `.github/workflows/deploy.yml` (add test step)
- `package.json` (add `test` script)

### Phase 10 (Polish)
- `README.md`
- Public assets for screenshots
