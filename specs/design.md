# Design Spec: Snap Core Flow

## Current State: Placeholder

The UI uses a simple centered card layout with placeholder tokens. All visual design will be updated when Figma designs are provided.

## Layout

- [x] Full-viewport centered card (max-width 28rem / max-w-md)
- [x] Card has border, rounded corners, white background, padding
- [x] Step indicator text at top ("Step X of 3")
- [x] Title → description → button(s) vertical stack
- [x] Step 1: single "Get Started" button
- [x] Steps 2–3: Back + primary button side by side

## Design Tokens (in globals.css @theme)

- [x] Colors: primary, surface, background, text, text-muted, border
- [x] Font: Inter (system fallback)
- [x] Spacing: page padding
- [x] Radius: button, card

## Figma Integration Points

- [ ] Colors/fonts/spacing → update @theme in globals.css
- [ ] Layout/structure → update JSX in Step components
- [ ] Content/copy → update steps array in flow-config.js
- [ ] Assets → drop into public/
