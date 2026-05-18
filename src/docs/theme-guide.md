# Theme Guide

## Design Tokens

All colors come from `src/index.css` CSS variables mapped to Tailwind via `@theme`.

| Token | Usage |
|-------|--------|
| `bg-background` | Page background |
| `bg-card` | Cards, panels |
| `bg-secondary` | Subtle sections |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text |
| `border-border` | All borders |
| `bg-primary` | Buttons, active states |
| `text-primary-foreground` | Text on primary |

## Typography

- **Body**: Poppins (`font-sans`)
- **Headings**: Bebas Neue (`font-heading`)

## Rules

- Pure black & white aesthetic only
- No colorful accents, neon, or glassmorphism
- Subtle grayscale hover transitions
- Use `rounded-xl` for corners (matches `--radius`)

## Dark Mode

Toggle via navbar. Adds `.dark` class to `<html>` which swaps CSS variables.

## Tailwind v4

Import in `index.css`:

```css
@import "tailwindcss";
```

Use semantic classes (`bg-card`) not hardcoded hex values.
