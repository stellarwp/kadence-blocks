# Style Library

The wp-admin app for editing a design-token library: token scales (color, spacing, radius, shadow,
typography…) and per-block presets. Mounted at `admin.php?page=kadence-blocks-style-library`.

## Independence from the block editor

This app is deliberately uncoupled from `src/extension/*` and `@kadence/components`, in both
directions. Those ship into the block editor with their own tests and constraints; coupling an admin
screen to them makes both harder to change. Components here are built fresh and expressed through
this app's own design-token layer. Existing editor components may be used as visual and interaction
models — copy the shape, never the code or its pre-token hardcoded values.

The exception is `src/token-controls/`: token-aware form controls built once in a neutral home and
consumed by this app directly and by the block editor through wrappers. That is a deliberate shared
surface, not a reopening of app-to-app coupling.

## Layering

Atomic design, and the directory names are the contract:

| Layer | Holds | Example |
|---|---|---|
| `components/atoms/` | Single-purpose primitives | `SectionHeading` |
| `components/molecules/` | Small compositions, including form fields | `ListRow`, `fields/TokenSelectField` |
| `components/organisms/` | Self-contained regions | `SettingsForm`, `SwatchGrid` |
| `components/templates/` | Layout shells with slots, no data | `SettingsPanel` |
| `components/pages/` | Composition roots that wire hooks to templates | `ButtonScreen`, `ButtonSettings` |

**Pages are wiring.** They connect hooks to a template and an organism; they should not contain
rendering logic. When a page grows past wiring, the new part belongs a layer down. Same rule
upward: a template never fetches, and an organism never knows which screen mounted it.

## Preset screens

A preset screen edits one block's presets. `ButtonScreen` + `ButtonSettings` are the first, and
register for `kadence/singlebtn` on the public preset-screens filter.

### `PresetSidebar` holds everything generic

`pages/PresetSidebar.js` is the whole sidebar: the outer gate that waits for the fetched payload and
self-heals a stale `kb-item`, and the inner panel that owns the draft, the tabs, the name field,
save, delete, the error notices, and the draft-channel publication behind the unsaved-changes
guard. It knows nothing about which block it is editing.

`helpers/presets.js` is the generic machinery: the alias/id codec, value-shape tests,
`resolveTokenValue`, `presetSaveTokens`, `presetNameSchema`. The three functions that need to know
a block's specifics — `presetRows`, `presetInitialValues`, `overlayPresetRows` — take them as
arguments rather than importing them.

### One config file per block: `presets/<block>-preset.js`

Everything a preset screen needs that is not generic lives in a single frozen config:

```js
export const BUTTON_PRESET = Object.freeze({
    block:      'kadence/singlebtn',
    properties: [...],   // the bound surface declarations.php binds
    slugBase:   'button',
    tabs:       [...],   // which states exist
    preview,             // (tokens, values) => the row's preview
    schemaFor,           // (tab) => that tab's settings schema
});
```

### Adding a preset screen

1. Add `presets/<block>-preset.js` exporting a config of that shape.
2. Call `usePresetScreen(library, THE_PRESET)`.
3. Render `<PresetSidebar route navigate screen preset={THE_PRESET} />`.
4. Register the screen on the public preset-screens filter.

No new hook, no new panel, no changes to anything generic.

**If a screen needs something `PresetSidebar` cannot express, add a prop for it — do not fork the
file.** A fourth seam is fine; a second copy is not.

### Known duplication, deliberately left

The draft-channel block — the publish effect, the `actionsRef` assignment, the close guard — is
duplicated between `PresetSidebar` and `ScaleSettings`. Both are correct and neither is a copy made
in haste; the open question is whether the right boundary is a `usePresetDraftChannel` hook or
something wider, and two examples that already differ in their readiness guard is thin evidence.
Worth revisiting when a third screen needs it, or when either copy has to change.

## Fields and the settings schema

A settings panel renders from a schema, not from hand-placed components: `{ panels: [{ id, title,
fields: [{ type, path, label }] }] }`. `constants/field-types.js` maps a `type` to its component and
`organisms/SettingsForm` walks the schema. Adding a control means registering a type and referencing
it from a schema — no page changes.

Values are read and written by dot path, so a field never knows where in the draft it lives.
Responsive-capable types additionally carry a breakpoint: see `readResponsiveSlot` /
`writeResponsiveSlot` in `helpers/settings-schema.js`, which unwrap the
`{ base, responsive: { tablet, mobile } }` envelope.

## Tokens are the only shared vocabulary

There is no shared component layer between this app and the rest of the plugin, so the
primitive/semantic token contract is what keeps the app visually coherent as screens are added.
`--kb-sl-*` custom properties are declared on the page body class rather than the app root, because
WordPress portals popovers and modals outside the app root where root-scoped tokens would not
resolve.
