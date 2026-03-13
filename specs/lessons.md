# Lessons Learned

## Session 1 — Scaffolding

- `create-next-app` prompts interactively even with flags; manual package.json + pnpm install is more reliable for automation
- Next.js 16 is the current latest (was 15 at plan time)

## Session — Step 2→3 Transition Timing

- When adjusting step mount timing, always check that viewfinder dismiss is still in sync — the scrim, form mount, and morph must all be coordinated from the same timing anchor
- Separate timers for coupled visual events (e.g. scrim dismiss vs form mount) drift apart easily; consolidate into a single timer when they should fire together

## Session — Animation Orchestration Refactor

- Timeline-based config (`transitions` objects with named offsets) is far easier to read than nested setTimeouts — you can see the full choreography at a glance
- A `scheduleTransition(timeline, handlers)` helper that returns a cleanup function is a clean pattern for multi-step setTimeout choreography in React effects
- When restructuring config exports, keep a backward-compat flat export temporarily and grep all consumers to migrate them — avoids broken imports mid-refactor
