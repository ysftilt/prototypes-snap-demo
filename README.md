# Snap Core Flow

A 3-step interaction flow prototype built with Next.js and Tailwind CSS.

## Quick Start

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server → http://localhost:3000
```

## Project Structure

```
app/
  globals.css       ← Design tokens (colors, fonts, spacing)
  layout.js         ← Root HTML wrapper
  page.js           ← Entry point — renders the Flow

components/
  Flow.js           ← Controls which step is shown (the "brain")
  StepOne.js        ← Step 1 UI
  StepTwo.js        ← Step 2 UI
  StepThree.js      ← Step 3 UI

config/
  flow-config.js    ← All editable text and labels (one file!)
```

## How to Edit

**Change text/labels** → Edit `config/flow-config.js`

**Change colors/fonts** → Edit the `@theme` block in `app/globals.css`

**Change step layout** → Edit the corresponding `components/Step*.js` file

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
