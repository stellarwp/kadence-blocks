# Token controls

Token-aware form controls, built once and consumed by two apps: the Style Library directly, and the
block editor through wrappers. Nothing here knows which app mounted it.

## The three rules that make it reusable

**Controlled only.** `value` / `onChange`. No internal value state, no debouncing.

**Tokens arrive as props.** The pickable pool and a `resolveToken` function are passed in. No control
imports the Style Library's token layer or reads `@wordpress/data` — that is what would drag an
admin app's data layer into the editor.

**No app-specific storage knowledge.** Two shapes differ between hosts and neither belongs in a
control:

| | Style Library | Block editor |
|---|---|---|
| breakpoints | one `{ base, responsive }` envelope | sibling attributes (`tabletBorderRadius`) |
| linked sides | four identical slots collapse to a scalar | always a four-element array |

So a control takes the **active breakpoint's** value and an **explicit `isLinked`** prop. Each host's
wrapper maps its own storage onto that. Deriving linked-ness from the value's shape would work in
the Style Library and be permanently wrong in the editor, whose array never collapses.

## Layering

| Layer | Holds |
|---|---|
| `helpers/` | Pure functions — value shapes, slot reads and writes |
| `atoms/` | Single-purpose marks — `BindingIndicator` |
| `molecules/` | Small compositions — `TokenPopover` |
| `organisms/` | Self-contained regions — `TokenSelector` |
| `templates/` | Slot-based layout with no data — `ControlShell`, `SlotGrid` |
| `controls/` | The public API: one complete control per property |

`controls/` is this library's equivalent of a page — the composed, exported thing a host renders.
Everything below it is internal.

## Value shapes

A box-shaped value is either a **scalar** (a token id or a CSS literal) or a **slot list**, the
positional array `[top, right, bottom, left]`. Index 0 is `top` for a side property and `top-left`
for a corner property, both clockwise from the same origin — so one array serves padding, margin,
border width and radius with no per-property branching. Only the *display* order differs, and
`SlotGrid` handles that from `role`.

`writeSlot`'s `collapse` flag is where the two hosts diverge: the Style Library collapses a uniform
list back to a scalar because its stored preset shape reads a scalar as "every slot"; the block
editor never collapses.

## Status, not "dirty" or "overridden"

`ControlShell` takes `status: { bound, modified }`. Both hosts ask the same question against a
different baseline — the saved preset in the Style Library, the selected preset in the editor. The
shell renders the mark; the host decides what "modified" means.
