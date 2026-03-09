# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Scaffolded and running. Tech stack:
- **Next.js 16** (App Router, JavaScript — no TypeScript)
- **Tailwind CSS v4** (tokens in `@theme` block in `app/globals.css`)
- **React 19** (useState + props only)
- **pnpm** package manager
- **No ESLint** configured

## Commands

- `pnpm dev` — Dev server at localhost:3000
- `pnpm build` — Production build (must pass before committing)
- `pnpm start` — Serve production build

## Architecture

```
page.js → Flow.js (owns currentStep state)
             ├── StepOne.js   (props: config, onNext)
             ├── StepTwo.js   (props: config, onNext, onBack)
             └── StepThree.js (props: config, onBack, onFinish)
```

- `config/flow-config.js` — All editable content in one file
- `app/globals.css` — Design tokens in Tailwind v4 `@theme` block
- `components/Flow.js` — Single `useState(1)` controls step rendering

## Project Discovery

On first interaction with a new project, before any implementation:

1. Read `package.json`, `Makefile`, `Cargo.toml`, `pyproject.toml`, or equivalent to identify build/test/lint commands
2. Identify the tech stack, framework versions, and folder structure conventions
3. Create `./specs/commands.md` (if it doesn't exist) and document all discovered commands
4. Review `./specs/lessons.md` and `./specs/commands.md` if they exist from previous sessions
5. Run the setup verification checklist below — every item must pass before you proceed

IMPORTANT: Never guess at build or test commands. Always verify from project config files first.

### Setup Verification

Confirm all of these pass before starting any implementation:

- [ ] `pnpm install` (or equivalent) — dependencies install cleanly
- [ ] `pnpm run dev` — dev server starts without errors (start it, verify, then stop it)
- [ ] `pnpm run build` — production build completes without errors
- [ ] Tests pass (if test suite exists)
- [ ] Linter passes (if linter is configured)

If any fail, fix them FIRST. Document fixes in `./specs/lessons.md`.

## Task Lifecycle

Every non-trivial task follows this sequence. Do not skip steps.

### 1. Plan

- Enter plan mode for ANY task with 3+ steps or architectural decisions
- Create `./specs/plan.md` — a detailed implementation plan with `- [ ]` checkbox items, acceptance criteria per step, and a clear sequence. If the file exists, add a new section for the current task — don't overwrite previous plans.
- Create `./specs/design.md` — a visual, interaction, and motion design spec with `- [ ]` checkbox items covering UI layout, component hierarchy, interaction patterns, motion/animation details, and responsive behavior. Same append rule as plan.md.
- **Present both documents to the user and get confirmation before writing any implementation code.**

### 2. Implement

- Track progress — mark items `- [x]` in `./specs/plan.md` and `./specs/design.md` as you complete them
- High-level summary at each step — what changed and why
- If something goes sideways, STOP and re-plan immediately — don't keep pushing

### 3. Verify

- Run `pnpm run build` — a failing build means the task is NOT done
- Run `pnpm run dev` and verify the feature works in the browser
- Run the project's test suite, linter, and type checker (see `./specs/commands.md`)
- Ask yourself: "Would a staff engineer approve this PR?"

### 4. Close Out

- Add a review section to `./specs/plan.md` summarizing what was done
- Run `pnpm run build` one final time to confirm nothing regressed
- Update `./specs/lessons.md` if you learned anything or received corrections

## Workflow Habits

### Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One task per subagent for focused execution

### Self-Improvement Loop
- After ANY correction from the user: update `./specs/lessons.md` (create if it doesn't exist)
- Write rules that prevent the same mistake twice
- Review `./specs/lessons.md` at session start

### Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: step back, reconsider with full context, implement the clean solution
- Skip this for simple, obvious fixes — don't over-engineer

### Autonomous Bug Fixing
- When given a bug report: reproduce it, trace the root cause, fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Fix failing CI without being told how

## Code Standards

- Always trace errors to their root cause. Never use `// TODO`, `// FIXME`, or placeholder fixes
- Changes should only touch what's necessary — avoid unrelated refactors in the same commit
- Follow the project's existing patterns for naming, file structure, and code style
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- When modifying shared code, verify no downstream consumers break
- Prefer small, focused commits over large changesets
- Every commit must pass `pnpm run build` — never commit code that breaks the build

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Build Must Pass**: A green build is the minimum bar. If the build breaks, fix it before anything else.
