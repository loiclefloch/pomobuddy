# Story 1.2: Configure Development Environment & UI Foundation

Status: review

## Story

As a developer,
I want Tailwind CSS, shadcn/ui, and Zustand configured with the feature-based directory structure,
So that I can build UI components following the architectural patterns.

## Acceptance Criteria

1. **Given** the Tauri project from Story 1.1 exists
   **When** I install and configure Tailwind CSS v4
   **Then** Tailwind is integrated with Vite via `@tailwindcss/vite` plugin
   **And** a `globals.css` file exists in `src/styles/` with Tailwind directives

2. **Given** Tailwind is configured
   **When** I initialize shadcn/ui with `npx shadcn@latest init`
   **Then** a `components.json` file is created with correct paths
   **And** the shadcn CLI can add components to `src/shared/components/ui/`

3. **Given** shadcn/ui is configured
   **When** I install Zustand and Lucide icons
   **Then** `zustand` version 5.x is in `package.json` dependencies
   **And** `lucide-react` is available for icon imports

4. **Given** all dependencies are installed
   **When** I create the feature-based directory structure
   **Then** the following directories exist:
     - `src/features/timer/` (components, hooks, stores, types.ts)
     - `src/features/stats/`
     - `src/features/achievements/`
     - `src/features/character/`
     - `src/features/settings/`
     - `src/features/onboarding/`
     - `src/shared/components/ui/`
     - `src/shared/hooks/`
     - `src/shared/lib/`
     - `src/windows/tray/`
     - `src/windows/main/`
     - `src/windows/settings/`
   **And** path aliases are configured in `tsconfig.json` for `@/features/*`, `@/shared/*`, `@/windows/*`

## Tasks / Subtasks

- [x] Task 1: Install and configure Tailwind CSS v4 (AC: #1)
  - [x] 1.1: Install `tailwindcss` and `@tailwindcss/vite` packages
  - [x] 1.2: Update `vite.config.ts` to include Tailwind plugin
  - [x] 1.3: Create `src/styles/globals.css` with Tailwind directives
  - [x] 1.4: Update entry point to import globals.css
  - [x] 1.5: Verify Tailwind classes work in existing components

- [x] Task 2: Initialize shadcn/ui (AC: #2)
  - [x] 2.1: Run `npx shadcn@latest init` with proper configuration
  - [x] 2.2: Configure `components.json` to use `src/shared/components/ui/` path
  - [x] 2.3: Configure New York style and cozy theme colors
  - [x] 2.4: Install required shadcn dependencies (class-variance-authority, clsx, tailwind-merge)
  - [x] 2.5: Create `src/shared/lib/utils.ts` with cn() helper
  - [x] 2.6: Verify shadcn can add a component (test with Button)

- [x] Task 3: Install Zustand and Lucide icons (AC: #3)
  - [x] 3.1: Install `zustand@^5.0.10` for state management
  - [x] 3.2: Install `lucide-react` for icons
  - [x] 3.3: Verify imports work correctly

- [x] Task 4: Create feature-based directory structure (AC: #4)
  - [x] 4.1: Create `src/features/timer/` with subdirs: components/, hooks/, stores/, types.ts
  - [x] 4.2: Create `src/features/stats/` with subdirs: components/, hooks/, types.ts
  - [x] 4.3: Create `src/features/achievements/` with subdirs: components/, stores/, types.ts
  - [x] 4.4: Create `src/features/character/` with subdirs: components/, assets/, types.ts
  - [x] 4.5: Create `src/features/settings/` with subdirs: components/, stores/, types.ts
  - [x] 4.6: Create `src/features/onboarding/` with subdirs: components/, types.ts
  - [x] 4.7: Create `src/shared/components/ui/` for shadcn components
  - [x] 4.8: Create `src/shared/hooks/` for shared hooks (useIPC, usePlatform)
  - [x] 4.9: Create `src/shared/lib/` for utilities
  - [x] 4.10: Create `src/shared/types/` for type definitions
  - [x] 4.11: Create `src/windows/tray/` for tray window entry
  - [x] 4.12: Create `src/windows/main/` for main window entry
  - [x] 4.13: Create `src/windows/settings/` for settings window entry
  - [x] 4.14: Add placeholder .gitkeep or index.ts files to preserve structure

- [x] Task 5: Configure Vite for path resolution (AC: #4)
  - [x] 5.1: Add path alias resolution to `vite.config.ts` matching tsconfig.json
  - [x] 5.2: Verify path aliases work in imports

- [x] Task 6: Implement cozy theme tokens (AC: #1, bonus)
  - [x] 6.1: Configure cozy color palette in CSS variables or Tailwind config
  - [x] 6.2: Define color tokens: cozy-bg, cozy-surface, cozy-elevated, cozy-accent, cozy-success, cozy-text, cozy-muted, cozy-border
  - [x] 6.3: Configure typography tokens for Nunito, Inter, JetBrains Mono fonts

- [x] Task 7: Verification and build test
  - [x] 7.1: Run `npm run build` to verify everything compiles
  - [x] 7.2: Run `tsc --noEmit` to verify TypeScript types
  - [x] 7.3: Test a component with Tailwind classes, shadcn Button, and Lucide icon

## Dev Notes

### Previous Story Intelligence (from Story 1.1)

**Established Patterns:**
- Path aliases already configured in `tsconfig.json`: `@/*`, `@/features/*`, `@/shared/*`, `@/windows/*`
- Vite path resolution needs to be added (currently missing from vite.config.ts)
- TypeScript strict mode enabled
- React 19 + Vite 6 + TypeScript 5.6

**Key Files from Story 1.1:**
- `package.json` - Current dependencies (React 19, Tauri 2.2)
- `tsconfig.json` - Path aliases already defined
- `vite.config.ts` - Needs path resolution + Tailwind plugin

**Note:** Rust is NOT installed on this machine, so `npm run tauri dev` won't work. Frontend-only build testing via `npm run build`.

### Architecture Requirements

**Tailwind CSS v4 Configuration (from Architecture.md):**
```bash
npm install tailwindcss @tailwindcss/vite
```

**Vite Plugin Setup:**
```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/features': resolve(__dirname, 'src/features'),
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/windows': resolve(__dirname, 'src/windows'),
    },
  },
});
```

**globals.css (Tailwind v4 format):**
```css
@import "tailwindcss";
```

**shadcn/ui Configuration:**
```bash
npx shadcn@latest init
```

Expected `components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/components/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  }
}
```

**cn() helper (src/shared/lib/utils.ts):**
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Cozy Theme Color Palette (from UX Design)

**Dark Mode Colors:**
| Token | Hex | Usage |
|-------|-----|-------|
| `cozy-bg` | #1C1816 | App canvas background |
| `cozy-surface` | #2A2422 | Cards, menus |
| `cozy-elevated` | #3D3533 | Hover states, popups |
| `cozy-accent` | #E8A598 | Coral - buttons, highlights |
| `cozy-success` | #A8C5A0 | Sage - success states |
| `cozy-text` | #F5F0E8 | Primary text |
| `cozy-muted` | #A89888 | Secondary text |
| `cozy-border` | #4A4240 | Separators |

**Typography:**
| Token | Font | Usage |
|-------|------|-------|
| `font-heading` | Nunito | Warm, rounded, friendly headings |
| `font-body` | Inter | Clean, readable body text |
| `font-mono` | JetBrains Mono | Code snippets (if needed) |

**Note:** Fonts will be added in a later story (Epic 5). For now, use system fonts as fallback.

### Feature Directory Structure (from Architecture.md)

```
src/
├── features/
│   ├── timer/
│   │   ├── components/       # TimerRing, TimerControls
│   │   ├── hooks/            # useTimer, useTimerState
│   │   ├── stores/           # timerStore.ts
│   │   └── types.ts
│   ├── stats/
│   │   ├── components/       # StatsCard, WeeklyChart
│   │   ├── hooks/            # useStats, useWeeklyData
│   │   └── types.ts
│   ├── achievements/
│   │   ├── components/       # AchievementBadge, CelebrationOverlay
│   │   ├── stores/           # achievementsStore.ts
│   │   └── types.ts
│   ├── character/
│   │   ├── components/       # CharacterSprite, CharacterSelector
│   │   ├── assets/           # Sprite sheets
│   │   └── types.ts
│   ├── settings/
│   │   ├── components/       # SettingsForm
│   │   ├── stores/           # settingsStore.ts
│   │   └── types.ts
│   └── onboarding/
│       ├── components/       # OnboardingFlow, WelcomeScreen
│       └── types.ts
├── shared/
│   ├── components/
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # useIPC, usePlatform
│   ├── lib/                  # utils, constants
│   └── types/                # global type definitions
└── windows/
    ├── tray/                 # Tray window entry
    ├── main/                 # Main window entry
    └── settings/             # Settings window entry
```

### Project Structure Notes

**Alignment with Architecture:**
- Path aliases in tsconfig.json ALREADY configured (from Story 1.1 review fix)
- Vite resolve aliases MISSING - must be added
- Feature-based structure matches Architecture.md exactly

**Naming Conventions (MUST follow):**
- Components: `PascalCase.tsx` (e.g., `TimerRing.tsx`)
- Hooks: `camelCase.ts` (e.g., `useTimer.ts`)
- Stores: `camelCase.ts` (e.g., `timerStore.ts`)
- Tests: `*.test.tsx` co-located with source

### shadcn/ui Components to Install

For this story, install the Button component to verify setup:
```bash
npx shadcn@latest add button
```

This validates:
1. `components.json` paths are correct
2. Tailwind integration works
3. CVA (class-variance-authority) is configured

### Critical Implementation Notes

1. **Tailwind v4** - Uses `@import "tailwindcss"` NOT `@tailwind base/components/utilities`
2. **shadcn/ui RSC** - Set `"rsc": false` (not using React Server Components)
3. **Path aliases** - Must match EXACTLY between tsconfig.json and vite.config.ts
4. **Zustand version** - Use `zustand@^5.0.10` specifically (Architecture requirement)
5. **DO NOT** add unnecessary dependencies - stick to Architecture spec

### References

- [Source: architecture.md#Frontend-Architecture] - Component organization
- [Source: architecture.md#Styling-Patterns] - Tailwind class order
- [Source: architecture.md#Implementation-Patterns] - Naming conventions
- [Source: epics.md#Story-1.2] - Acceptance criteria
- [Source: ux-design-specification.md] - Cozy color palette (UX9)

## Dev Agent Record

### Agent Model Used

Claude (Anthropic) - Sisyphus Agent

### Debug Log References

- npm install tailwindcss @tailwindcss/vite: 14 packages added, 0 vulnerabilities
- npm install class-variance-authority clsx tailwind-merge: 3 packages added
- npm install zustand@^5.0.10 lucide-react: 2 packages added
- npx shadcn@latest add button: Successfully installed Button component
- npm run build: Success - vite v6.4.1, built in 12.11s
- tsc --noEmit: Success - no type errors

### Completion Notes List

1. Installed and configured Tailwind CSS v4 with @tailwindcss/vite plugin
2. Created globals.css with cozy theme color tokens using @theme directive
3. Configured shadcn/ui with New York style, proper path aliases
4. Installed and verified shadcn Button component works
5. Installed Zustand 5.0.10 and Lucide React icons
6. Created complete feature-based directory structure per Architecture.md
7. Added type definitions for all feature modules
8. Created shared hooks (useIPC, usePlatform, useReducedMotion)
9. Created shared utilities (cn, formatTime, dateUtils, constants)
10. Configured Vite path aliases to match tsconfig.json
11. Updated App.tsx to demonstrate Tailwind, shadcn Button, and Lucide icons
12. All builds pass, TypeScript compiles cleanly

### File List

**Created:**
- src/styles/globals.css (Tailwind + cozy theme)
- components.json (shadcn/ui config)
- src/shared/lib/utils.ts (cn helper)
- src/shared/lib/constants.ts
- src/shared/lib/formatTime.ts
- src/shared/lib/dateUtils.ts
- src/shared/lib/index.ts
- src/shared/hooks/useIPC.ts
- src/shared/hooks/usePlatform.ts
- src/shared/hooks/useReducedMotion.ts
- src/shared/hooks/index.ts
- src/shared/types/tauri.d.ts
- src/shared/types/global.d.ts
- src/shared/components/ui/button.tsx (via shadcn)
- src/features/timer/types.ts
- src/features/stats/types.ts
- src/features/achievements/types.ts
- src/features/character/types.ts
- src/features/settings/types.ts
- src/features/onboarding/types.ts
- src/features/*/components/.gitkeep (multiple)
- src/features/*/hooks/.gitkeep (multiple)
- src/features/*/stores/.gitkeep (multiple)
- src/windows/*/.gitkeep (tray, main, settings)

**Modified:**
- vite.config.ts (added Tailwind plugin + path aliases)
- src/main.tsx (import globals.css instead of styles.css)
- src/App.tsx (use Tailwind classes, shadcn Button, Lucide icons)
- package.json (new dependencies)
- package-lock.json

**Deleted:**
- src/styles.css (replaced by globals.css)
- src/App.css (inline Tailwind classes now)

## Change Log

- 2026-01-29: Story implementation completed - Tailwind CSS v4, shadcn/ui, Zustand, feature structure configured
