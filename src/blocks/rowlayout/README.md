# Row Layout Block (`kadence/rowlayout`)

A container block that provides a flexible column-based layout system with rich styling options including backgrounds, overlays, dividers, and responsive controls.

## Block Identity

- **Name:** `kadence/rowlayout`
- **Category:** `kadence-blocks`
- **API Version:** 3
- **Allowed Inner Blocks:** `kadence/column` only
- **Frontend Rendering:** Dynamic (PHP) — `save.js` returns only `<InnerBlocks.Content />`

## File Structure

```
rowlayout/
├── index.js                 # Block registration
├── block.json               # Block metadata & attribute definitions
├── edit.js                  # Main editor component (~1500 lines)
├── save.js                  # Save output (delegates to PHP)
├── attributes.js            # Attribute definitions
├── constants.js             # Shared constants & configuration
├── layout-controls.js       # Layout settings panel
├── style-controls.js        # Style settings panel
├── row-background.js        # Background rendering component
├── row-overlay.js           # Overlay rendering component
├── padding-resizer.js       # Interactive padding drag-resize handles
├── gridvisualizer.js        # Grid alignment overlay
├── render-svg-divider.js    # SVG shape divider renderer
├── content-width-icons.js   # Custom toolbar icons
├── utils.js                 # Spacing/gutter helper functions
├── migrations.js            # Attribute migration logic
├── deprecated.js            # Deprecated block versions
├── style.scss               # Frontend styles
├── editor.scss              # Editor-specific styles
├── editor-controls.scss     # Control panel styles
└── splide.scss              # Background slider styles
```

## Architecture

### Main Component (`edit.js`)

`KadenceRowLayout` is the root editor component. Key responsibilities:

- **Column management** — add/remove columns, update layouts, resize widths via drag handles
- **Unique ID generation** — ensures each block instance has a unique identifier
- **Attribute migrations** — runs `runRowLayoutMigrations()` on mount to update legacy data
- **Dynamic CSS generation** — injects styles for text/link colors, grid templates, gaps, z-index, collapse order, and breakout margins
- **Responsive previewing** — adapts the editor view based on the selected preview device

State managed locally:
- `contentWidthPop` — content width popover visibility
- `resizingVisually` — whether padding is being drag-resized
- `resizeColumnWidthNumbers` — temporary column widths during drag
- `activeTab` — current inspector tab
- `dynamicBackgroundImg` — dynamically-loaded background image URL

### Inspector UI

The editor sidebar uses `InspectorControlTabs` with three tabs:

#### Layout Tab (`layout-controls.js`)

| Panel | Controls |
|---|---|
| **Basic Layout** | Column count (1–6), layout preset selector (responsive), column gutter, row gutter, collapse order |
| **Content Max Width** | Inherit from theme toggle, custom max width (responsive), breakout options for 2-column full-width |
| **Top Divider** | SVG shape picker (21 shapes), color, height (responsive), width (responsive), flip |
| **Bottom Divider** | Same as top divider |

#### Style Tab (`style-controls.js`)

| Panel | Controls |
|---|---|
| **Background** | Type selector (normal / gradient / slider / video), color, image, gradient, slider config, video config (local / YouTube / Vimeo), responsive tablet/mobile overrides with force-override option |
| **Overlay** | Opacity, type (normal / gradient), color/image, blend mode (14 options), responsive overrides |
| **Border** | Border (responsive, 4 sides), border radius (responsive, 4 corners), overflow hidden toggle, box shadow |
| **Text Color** | Text color, link color, link hover color |

#### Advanced Tab (in `edit.js`)

| Panel | Controls |
|---|---|
| **Padding** | 4-side responsive measure, spacing presets (XXS–5XL), multiple units |
| **Margin** | Top/bottom responsive measure, auto left/right |
| **Structure** | HTML tag selector, min height (responsive), inner column 100% height, z-index |
| **Visibility** | Hide per device, logged-in/out visibility, role-based visibility, Restrict Content Pro integration |

### Toolbar Controls

- **Alignment** — center, wide, full (filterable via `kadence.blocks.rowlayout.alignmentToolbar`)
- **Content Width** — toggle between theme width and custom, with popover for value entry
- **Vertical Alignment** — top, middle, bottom
- **Add Section** — appends a new column
- **Copy/Paste Attributes** — transfer settings between blocks

## Column System

- **Grid-based layout** using CSS Grid with dynamically generated `grid-template-columns`
- Supports 1–6 columns with multiple predefined layout presets per count
- Custom column widths via `ColumnDragResizer` from `@kadence/components`
- Responsive layouts: independent desktop, tablet, and mobile configurations
- Column collapse order (left-to-right or right-to-left) on smaller viewports
- Breakout columns: special 2-column full-width mode that extends beyond theme content width

### Layout Presets

| Columns | Available Layouts |
|---|---|
| 2 | Equal, 66/33, 33/66, collapse to rows |
| 3 | Equal, 50/25/25, 25/25/50, 25/50/25, 20/60/20, 15/70/15, 100+50/50, 50/50+100, collapse |
| 4 | Equal, 40/20/20/20, 20/20/20/40, two-column grid, collapse |
| 5 | Equal, collapse |
| 6 | Equal, two-column grid, three-column grid, collapse |

## Background System (`row-background.js`)

Four background types, selectable per-device:

1. **Normal** — solid color + optional image with size/position/repeat/attachment controls
2. **Gradient** — CSS gradient via the gradient picker
3. **Slider** — Splide-powered carousel of up to 20 background slides, with arrow/dot styles, autoplay, fade/slide transitions
4. **Video** — local (HTML5 `<video>`), YouTube, or Vimeo; controls for loop, mute, play/pause buttons, aspect ratio

Responsive overrides allow tablet and mobile to show a different background type/color/image than desktop, with a "force override" toggle.

Parallax backgrounds use the `.kt-jarallax` class, triggering a JavaScript parallax library on the frontend.

## Video Background — In Depth

The video background feature spans editor controls (`style-controls.js`), editor preview (`row-background.js`), frontend HTML (`build_html` / `get_video_render` in the PHP class), frontend CSS (`style.scss`), and a small vanilla JS controller (`kb-init-html-bg-video.js`).

### Data Model

Video settings are stored in a single-element array attribute `backgroundVideo`, with the active source type tracked by `backgroundVideoType`:

```json
{
    "backgroundVideoType": "local",
    "backgroundVideo": [
        {
            "youTube": "",
            "local": "",
            "localID": "",
            "vimeo": "",
            "ratio": "16/9",
            "btns": false,
            "btnsMute": false,
            "loop": true,
            "mute": true
        }
    ]
}
```

The `backgroundSettingTab` attribute must be `"video"` for the video background to be active. All video fields are stored regardless of which type is selected, so switching between local/YouTube/Vimeo preserves previously entered values.

| Field | Type | Default | Description |
|---|---|---|---|
| `backgroundVideoType` | `string` | `"local"` | `local`, `youtube`, or `vimeo` |
| `local` | `string` | `""` | URL to a self-hosted video file (MP4) |
| `localID` | `string` | `""` | WordPress media library attachment ID |
| `youTube` | `string` | `""` | YouTube video ID (e.g. `OZBOEnHhR14`) |
| `vimeo` | `string` | `""` | Vimeo video ID (e.g. `789006133`) |
| `ratio` | `string` | `"16/9"` | Aspect ratio for embedded videos: `16/9`, `4/3`, or `3/2` |
| `btns` | `bool` | `false` | Show play/pause buttons (local only) |
| `btnsMute` | `bool` | `false` | Show mute/unmute buttons (local only) |
| `loop` | `bool` | `true` | Loop the video |
| `mute` | `bool` | `true` | Mute the video by default |

The `bgImg` / `bgImgID` attributes double as the video poster image when `backgroundVideoType` is `local`.

### Editor Controls (`style-controls.js`)

When `backgroundSettingTab === 'video'`, the Style tab's Background panel shows:

1. **Video Type** — `SelectControl` with three options: Local (MP4), YouTube, Vimeo

2. **Local video source** (when type is `local`):
   - `KadenceVideoControl` — media library upload/edit/remove using `KadenceMediaPlaceholder` (accepts `video/*`)
   - `DynamicTextInputControl` — text input for the video URL, with dynamic content support (`dynamicAttribute: 'backgroundVideo:0:local'`)

3. **Embed warning** (YouTube/Vimeo) — static text: *"Warning: Embedded videos are not ideal for background content. Consider self hosting instead."*

4. **YouTube ID** — `TextControl` with example placeholder (`OZBOEnHhR14`)

5. **Vimeo ID** — `TextControl` with example placeholder (`789006133`)

6. **Aspect Ratio** (YouTube/Vimeo only) — `SelectControl`: `16/9`, `4/3`, `3/2`

7. **Mute Video** — `ToggleControl` (default: on)

8. **Loop Video** — `ToggleControl` (default: on)

9. **Show Mute/Unmute Buttons** — `ToggleControl` (local only, default: off)

10. **Show Play/Pause Buttons** — `ToggleControl` (local only, default: false in data, but the control reads `true` when `btns` is undefined — see note below)

11. **Background Color** — `PopColorControl` for a fallback color behind the video

12. **Video Poster** (local only) — `KadenceImageControl` for selecting a poster frame; stored in the shared `bgImg`/`bgImgID` attributes

The `saveVideoSettings` helper merges updates into `backgroundVideo[0]`, initializing the array with defaults if it doesn't exist yet.

> **Note on `btns` default behavior:** The `btns` attribute defaults to `false` in `block.json`, but the editor toggle reads `true` when `btns` is `undefined`. This means the control appears checked for new blocks even though the stored value is `false`. The PHP `render_scripts` method checks the actual stored value (`true === $attributes['backgroundVideo'][0]['btns']`), so the play/pause buttons and their script are only loaded when `btns` has been explicitly set to `true`.

### Editor Preview (`row-background.js`)

The `RowBackground` component determines which background layer to render based on `previewBackgroundSettingTab`, which cascades through responsive overrides:

```js
const previewBackgroundSettingTab = getPreviewSize(
    previewDevice,
    backgroundSettingTab || 'normal',
    tabletBackground?.[0]?.enable ? 'normal' : '',
    mobileBackground?.[0]?.enable ? 'normal' : ''
);
```

When tablet or mobile background overrides are enabled, the preview switches away from `'video'` to `'normal'` for those devices, matching the frontend behavior where the video container is hidden via CSS.

When `previewBackgroundSettingTab === 'video'`, the preview renders:

**Local video:**
```jsx
<div className="kb-blocks-bg-video-container" style={{ backgroundColor: ... }}>
    <video
        className="kb-blocks-bg-video"
        playsinline=""
        loop=""
        poster={/* gray placeholder if dynamic, else undefined */}
        src={/* video URL or undefined if dynamic */}
    />
</div>
```

The editor preview video element always has `playsinline` and `loop` set. It does **not** autoplay in the editor. Mute/loop/button controls have no effect on the editor preview — they only affect frontend output.

When a dynamic content source is active (`kadenceDynamic['backgroundVideo:0:local'].enable`), the `src` is omitted and a gray placeholder is shown as the `poster` instead.

**YouTube:**
```jsx
<div className="kb-blocks-bg-video-container" style={{ backgroundColor: ... }}>
    <div
        className="kb-blocks-bg-video"
        style={{ backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)` }}
    />
</div>
```

**Vimeo:**
```jsx
<div className="kb-blocks-bg-video-container" style={{ backgroundColor: ... }}>
    <div
        className="kb-blocks-bg-video"
        style={{ backgroundImage: `url(https://vumbnail.com/${videoId}.jpg)` }}
    />
</div>
```

YouTube and Vimeo videos render as a `<div>` (not `<video>` or `<iframe>`) in the editor, displaying only the thumbnail image as a CSS background. No embed is loaded in the editor.

### Frontend HTML (`get_video_render` in PHP)

#### Local HTML5 Video

```html
<div class="kb-blocks-bg-video-container">
    <video
        class="kb-blocks-bg-video"
        id="bg-row-video-{uniqueID}"
        playsinline
        muted          <!-- omitted when mute=false -->
        loop           <!-- omitted when loop=false -->
        autoplay       <!-- omitted when preload prevention is active -->
        src="{local video URL}"
        poster="{bgImg URL}"    <!-- only when bgImg is set -->
        preload="none"          <!-- only when preload prevention is active -->
    ></video>
    <!-- control buttons (see below) -->
</div>
```

#### YouTube / Vimeo Embed

```html
<div class="kb-blocks-bg-video-container embedded">
    <div class="kb-bg-video-iframe kb-bg-video-ratio-{ratio}">
        <iframe
            frameborder="0"
            class="kb-blocks-bg-video youtube"   <!-- or "vimeo" -->
            id="bg-row-video-{uniqueID}"
            src="{embed URL with query params}"
        ></iframe>
    </div>
</div>
```

The embed URL is constructed with these query parameters (shared by both YouTube and Vimeo):

| Param | Value | Purpose |
|---|---|---|
| `autoplay` | `1` | Auto-start playback |
| `controls` | `0` | Hide player controls |
| `mute` / `muted` | `0` or `1` | Initial mute state |
| `loop` | `0` or `1` | Loop playback |
| `playlist` | `{videoId}` | Required by YouTube for loop to work |
| `disablekb` | `1` | Disable keyboard controls |
| `modestbranding` | `1` | Minimal YouTube branding |
| `playsinline` | `1` | Inline playback on mobile |
| `rel` | `0` | Don't show related videos |
| `background` | `1` | Background mode (Vimeo) |

#### Video Control Buttons (Local Only)

When `btns` or `btnsMute` is true, a button wrapper is rendered:

```html
<div class="kb-background-video-buttons-wrapper kb-background-video-buttons-html5">
    <!-- Play/Pause (when btns=true) -->
    <button class="kb-background-video-play kb-toggle-video-btn"
            aria-label="Play" aria-hidden="true" style="display: none;">
        <svg><!-- play icon --></svg>
    </button>
    <button class="kb-background-video-pause kb-toggle-video-btn"
            aria-label="Pause" aria-hidden="false">
        <svg><!-- pause icon --></svg>
    </button>

    <!-- Mute/Unmute (when btnsMute=true, or legacy: btns=true + mute=false + btnsMute unset) -->
    <button class="kb-background-video-unmute kb-toggle-video-btn"
            aria-label="Unmute" aria-hidden="true|false">
        <svg><!-- volume icon --></svg>
    </button>
    <button class="kb-background-video-mute kb-toggle-video-btn"
            aria-label="Mute" aria-hidden="false|true">
        <svg><!-- volume-up icon --></svg>
    </button>
</div>
```

The initial visibility of mute/unmute buttons depends on the `mute` attribute: if `mute=false` (video starts unmuted), the mute button is visible and unmute is hidden, and vice versa.

The `btnsMute` visibility has a legacy fallback: if `btnsMute` is not set at all (`undefined`), mute buttons appear when `btns=true` AND `mute=false`. This preserves behavior for blocks created before `btnsMute` was added as an independent control.

### Frontend JavaScript (`kb-init-html-bg-video.js`)

A small vanilla JS file that attaches click handlers to the four button types. It is only enqueued when play/pause or mute/unmute buttons are visible.

| Button Class | Action | Side Effects |
|---|---|---|
| `.kb-background-video-pause` | `video.pause()` | Shows play button, hides pause button |
| `.kb-background-video-play` | `video.play()` | Shows pause button, hides play button |
| `.kb-background-video-mute` | `video.muted = true` | Shows unmute button, hides mute button |
| `.kb-background-video-unmute` | `video.muted = false` | Shows mute button, hides unmute button |

Each handler toggles `aria-hidden` and `display` on the paired button. The script navigates from `button → parentNode (wrapper) → parentNode (container) → getElementsByTagName('video')[0]` to find the target `<video>` element.

This script only targets HTML5 `<video>` elements. YouTube/Vimeo embeds have no play/pause/mute controls — their `<iframe>` embeds rely on the query parameters (`autoplay`, `mute`, `loop`) set at render time.

### Frontend CSS (`style.scss`)

The video container is absolutely positioned to fill the row:

```scss
.kb-blocks-bg-video-container {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    overflow: hidden;
}
```

**Local video** is centered and scaled to cover:

```scss
.kb-blocks-bg-video {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%; min-height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
}
// Native controls are force-hidden
.kb-blocks-bg-video::-webkit-media-controls { display: none !important; }
```

**Embedded video** (YouTube/Vimeo) uses a ratio container for proper aspect scaling:

```scss
.kb-blocks-bg-video-container.embedded {
    .kb-bg-video-iframe {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        min-width: 100%;
        height: 0;
        padding-bottom: 56.25%;           // 16:9 default
        &.kb-bg-video-ratio-4-3 { padding-bottom: 75%; }
        &.kb-bg-video-ratio-3-2 { padding-bottom: 66.66%; }
    }
    // Below 16:9 viewport aspect, switch to height-based sizing
    @media (max-aspect-ratio: 16/9) {
        .kb-bg-video-iframe {
            min-height: 100%;
            aspect-ratio: 16/9;
        }
    }
    // iframe fills its ratio container
    .kb-blocks-bg-video {
        top: 0; left: 0;
        width: 100%; height: 100%;
        border: 0;
        transform: translate(0%, 0%);
    }
}
```

**Control buttons** are positioned bottom-right with a fade-in hover effect:

```scss
.kb-background-video-buttons-wrapper {
    position: absolute;
    z-index: 11;
    bottom: 20px; right: 20px;
}
button.kb-toggle-video-btn {
    padding: 8px;
    margin: 0 0 0 8px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    opacity: 0.5;
    height: 32px;
    transition: opacity 0.3s ease-in-out;
    // 16x16 SVG icons
}
button.kb-toggle-video-btn:hover { opacity: 1; }
```

### Responsive Video Preload Prevention

When tablet or mobile background overrides are enabled, the video is hidden on smaller screens via CSS (`display: none` on `.kb-blocks-bg-video-container`). To avoid wasting bandwidth loading a video that won't be seen, the PHP applies a preload prevention strategy:

1. The `<video>` tag is rendered with `preload="none"` instead of `autoplay`
2. An inline `<script>` is injected after the block's closing tag:

```html
<script>
if (window.innerWidth > {breakpoint}) {
    document.getElementById("bg-row-video-{uniqueID}").removeAttribute("preload");
    document.getElementById("bg-row-video-{uniqueID}").setAttribute("autoplay", "");
}
</script>
```

The breakpoint is `1024` when the tablet override is enabled, or `767` when only the mobile override is active.

This is filterable via `kadence_blocks_rowlayout_prevent_preload_for_mobile` (default: `true`). Setting it to `false` disables the optimization, causing the video to always load and autoplay regardless of device.

### Dynamic Content Support

The local video URL supports dynamic content via the `DynamicTextInputControl` with `dynamicAttribute: 'backgroundVideo:0:local'`. When dynamic content is enabled:

- In the editor, the `<video>` element has no `src` and shows a gray placeholder image as its poster
- On the frontend, the dynamic content system resolves the URL at render time

### Limitations and Behavioral Notes

- YouTube/Vimeo embeds show **no** play/pause/mute controls — only local videos support interactive buttons
- The editor preview **never** autoplays video — it shows the video element (local) or a thumbnail (YouTube/Vimeo) statically
- Mute/loop toggles and button controls have **no effect** on the editor preview
- The `ratio` control only appears for YouTube/Vimeo — local videos use `object-fit: cover` and don't need a ratio container
- Native browser video controls are force-hidden via `::-webkit-media-controls { display: none }`
- The video is absolutely positioned behind all content — the overlay, dividers, and column content all stack above it

## Overlay System (`row-overlay.js`)

A layer rendered on top of the background supporting:

- Solid color or gradient (linear/radial) overlays
- Background image on the overlay itself
- Opacity control (0–100)
- 14 CSS blend modes (normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, difference, exclusion, hue, saturation, color, luminosity)
- Responsive overrides (tablet/mobile)

## SVG Dividers (`render-svg-divider.js`)

21 SVG shape dividers available for top and bottom edges:

- Curve triangles (`ct`, `cti`, `ctd`, `ctdi`)
- Slants (`sltl`, `sltli`, `sltr`, `sltri`)
- Curves (`crv`, `crvi`, `crvl`, `crvli`, `crvr`, `crvri`)
- Waves (`wave`, `wavei`, `waves`, `wavesi`)
- Mountains (`mtns`)
- Triangles (`littri`, `littrii`)
- Three levels (`threelevels`, `threelevelsi`)

All rendered as inline SVG with `viewBox="0 0 1000 100"` and `preserveAspectRatio="none"` for responsive scaling. Height and width are independently configurable per device.

## Interactive Padding Resizer (`padding-resizer.js`)

Drag handles on the top and bottom of the row in the editor for visual padding adjustment. Supports:

- Numeric pixel values with direct drag
- Spacing variable presets with snap-to-grid behavior
- Real-time preview labels showing the current value
- Per-device operation (respects the active preview device)

Snap values: `[0, 8, 16, 24, 32, 48, 64, 80, 104, 128, 160]` px

## Spacing System

Two modes of spacing values:

1. **Numeric** — raw values in px, em, rem, %, vh, or vw
2. **Presets** — named spacing tokens mapped to CSS variables (`var(--global-kb-spacing-*)`)

Available presets: `0`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `3xl`, `4xl`, `5xl`

## Responsive System

- Three breakpoints: Desktop, Tablet, Mobile
- Device preview switcher in the editor
- `getPreviewSize()` helper cascades values (mobile falls back to tablet, tablet falls back to desktop)
- Responsive attributes typically use arrays: `[desktop, tablet, mobile]`

## Utilities (`utils.js`)

| Function | Purpose |
|---|---|
| `getGutterPercentUnit()` | Convert gutter preset to percentage |
| `getGutterTotal()` | Calculate total gutter for grid-template |
| `getPreviewGutterSize()` | Get responsive gutter value with CSS variable support |
| `getSpacingOptionName()` | Map spacing value to human-readable name |
| `getSpacingOptionSize()` | Map spacing value to pixel size |
| `getSpacingNameFromSize()` | Reverse lookup: pixel size to name |
| `getSpacingValueFromSize()` | Reverse lookup: pixel size to value |

## Migrations (`migrations.js`)

Handles upgrading legacy attribute formats:

- Gutter presets (`wide`, `narrow`, `widest`) to custom numeric values
- Individual padding properties to array format
- Individual margin properties to array format
- Adding type fields to tablet/mobile background settings

## Extensibility

The block uses `applyFilters()` extensively for third-party customization:

- `kadence.blocks.rowlayout.alignmentToolbar` — toolbar alignment options
- Layout option filters per column count
- Gutter option filters
- `kadence.col_width_map` — column width mapping
- Spacing size filters
- Blend mode option filters
- Default padding filters

## Frontend Rendering (PHP)

The frontend output is entirely dynamic, handled by `Kadence_Blocks_Rowlayout_Block` in `includes/blocks/class-kadence-blocks-row-layout-block.php`. The class extends `Kadence_Blocks_Abstract_Block` and is responsible for CSS generation, HTML markup, and conditional script/style enqueuing.

### HTML Output Structure (`build_html`)

The `build_html()` method assembles the frontend DOM. For blocks with `kbVersion > 1` (current format), the output is:

```html
<{htmlTag} class="kb-row-layout-wrap kb-row-layout-id{uniqueID} align{align} ..." {wrapper_args}>
    <!-- Background slider (if type=slider) -->
    <div class="kt-blocks-carousel kb-blocks-bg-slider ...">
        <div class="kt-blocks-carousel-init splide ...">
            <div class="splide__track">
                <ul class="splide__list">
                    <li class="splide__slide kb-bg-slide-contain">...</li>
                </ul>
            </div>
            <!-- Pause button (if autoplay + showPauseButton) -->
        </div>
    </div>

    <!-- Background video (if type=video) -->
    <div class="kb-blocks-bg-video-container">
        <video class="kb-blocks-bg-video" ...></video>  <!-- local -->
        <!-- OR -->
        <div class="kb-bg-video-iframe kb-bg-video-ratio-{ratio}">
            <iframe ...></iframe>  <!-- YouTube/Vimeo -->
        </div>
        <!-- Play/pause/mute buttons -->
    </div>

    <!-- Overlay (if has_overlay) -->
    <div class="kt-row-layout-overlay kt-row-overlay-{type}"></div>

    <!-- Top divider (if topSep != none) -->
    <div class="kt-row-layout-top-sep kt-row-sep-type-{slug}">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none">...</svg>
    </div>

    <!-- Column wrapper -->
    <div class="kt-row-column-wrap kt-has-{n}-columns kt-row-layout-{layout} kt-tab-layout-{tabletLayout} kt-mobile-layout-{mobileLayout} ...">
        {inner block content}
    </div>

    <!-- Bottom divider (if bottomSep != none) -->
    <div class="kt-row-layout-bottom-sep kt-row-sep-type-{slug}">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none">...</svg>
    </div>
</{htmlTag}>
```

#### Outer Wrapper Classes

| Class | Condition |
|---|---|
| `kb-row-layout-wrap` | Always |
| `kb-row-layout-id{uniqueID}` | Always (CSS target) |
| `align{align}` | Based on alignment (`alignnone`, `alignwide`, `alignfull`) |
| `kb-v-lg-hidden` | `vsdesk` is true |
| `kb-v-md-hidden` | `vstablet` is true |
| `kb-v-sm-hidden` | `vsmobile` is true |
| `has-{bgColorClass}-background-color` | When `bgColorClass` is set |
| `kt-row-has-bg` | When any background, gradient, or overlay is defined |
| `kt-jarallax` | When background image uses parallax attachment |

#### Inner Wrapper Classes

| Class | Condition |
|---|---|
| `kt-row-column-wrap` | Always |
| `kt-has-{n}-columns` | Based on column count (default 2) |
| `kt-row-layout-{layout}` | Desktop layout (e.g. `equal`, `left-golden`) |
| `kt-tab-layout-{layout}` | Tablet layout (default `inherit`) |
| `kt-mobile-layout-{layout}` | Mobile layout (default `inherit`) |
| `kt-row-valign-{alignment}` | Vertical alignment (`top`, `middle`, `bottom`) |
| `kt-inner-column-height-full` | `columnsInnerHeight` is true |
| `kb-theme-content-width` | `inheritMaxWidth` is true |

#### Data Attributes (Parallax)

When parallax is active, the outer wrapper receives:
- `data-img-position` — background position (e.g. `center center`)
- `data-img-size` — background size (e.g. `cover`)
- `data-img-repeat` — background repeat (only when size is not `cover`)

#### Legacy Selectors (`kbVersion <= 1`)

Older blocks use `#kt-layout-id{uniqueID}` (ID-based) instead of `.kb-row-layout-id{uniqueID}` (class-based) for CSS selectors.

### CSS Generation (`build_css`)

The `build_css()` method generates all frontend styles using a CSS builder object. Styles are output in a `<style>` block scoped to the block's unique selector.

#### Rendering Order

1. **Margin** — supports both legacy individual properties (`topMargin`, `bottomMargin`, etc.) and modern array format; responsive with tablet/mobile overrides; GeneratePress compatibility fix (`margin-bottom: 0px`)
2. **Vertical alignment** — maps `top`/`middle`/`bottom` to `align-content` on the inner wrapper and `justify-content` on child columns
3. **Gutters** — column gap and row gap via `render_row_gap()`, supporting named presets and custom values
4. **Max width** — either inherited from theme (`--global-content-width` or `--wp--style--global--content-size`) or custom value; Kadence Theme integration adds `--global-content-edge-padding`; responsive tablet/mobile overrides with auto centering
5. **Padding** — supports both legacy individual properties and modern array format; responsive
6. **Min height** — responsive across all three breakpoints
7. **Grid template columns** — desktop, tablet, and mobile layouts via `get_template_columns()`
8. **Collapse ordering** — reverse order via CSS `order` property on `:nth-child()` selectors (supports up to 4 rows of columns)
9. **Breakout columns** — negative margin calculations for 2-column full-width layouts using CSS custom properties (`--breakout-negative-margin-left`, `--breakout-negative-margin-right`); uses `margin-inline-start`/`margin-inline-end` for LTR/RTL support; desktop-only with tablet fallback
10. **Border radius** — responsive; triggers `overflow: clip` and `isolation: isolate` when any radius is non-zero; also applies radius to the overlay element
11. **Box shadow** — full `box-shadow` shorthand with color, opacity, spread, blur, offsets, and inset support
12. **Border** — supports both legacy format (color + width arrays) and modern `borderStyle` format
13. **Background** — normal (color + image) or gradient; parallax converts to `background-attachment: fixed` with mobile fallback to `scroll` via `kadence_blocks_attachment_fixed_on_mobile` filter
14. **Tablet/mobile background overrides** — can replace or remove desktop backgrounds; `forceOverDesk` hides desktop images with `!important`; hides jarallax containers when switching away from parallax; hides sliders/videos when a responsive override is active
15. **Overlay** — opacity, color/gradient/image, blend mode (`mix-blend-mode`); responsive tablet/mobile overrides; supports legacy `grad` type (manual gradient stops) and modern `gradient` type (CSS gradient string)
16. **Z-index** — applied to either the outer wrapper (`kbVersion > 1`) or inner wrapper (legacy), with `position: relative`
17. **Text/link colors** — text color applies to the block and all heading levels (h1–h6); separate link and link hover colors
18. **Dividers** — top and bottom separator height, width (as %), and fill color with responsive overrides
19. **Visibility** — `display: none !important` at specific breakpoints (`desktopOnly`, `tabletOnly`, `mobile`)
20. **Slider pause button** — styled to match the arrow style (whiteondark, blackonlight, outlineblack, outlinewhite)
21. **Custom CSS** — `kadenceBlockCSS` attribute injected with `selector` replaced by the block's base selector

#### Grid Template Column Calculation (`get_template_columns`)

The method maps layout presets to CSS grid values:

| Layout | Grid Template |
|---|---|
| `equal` (2 col) | `repeat(2, minmax(0, 1fr))` |
| `left-golden` | `minmax(0, 2fr) minmax(0, 1fr)` |
| `right-golden` | `minmax(0, 1fr) minmax(0, 2fr)` |
| `left-half` (3 col) | `minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)` |
| `center-half` | `minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)` |
| `center-wide` | `minmax(0, 1fr) minmax(0, 3fr) minmax(0, 1fr)` |
| `center-exwide` | `minmax(0, 1fr) minmax(0, 6fr) minmax(0, 1fr)` |
| `first-row` | `repeat(2, minmax(0, 1fr))` + first child spans full width |
| `last-row` | `repeat(2, minmax(0, 1fr))` + last child spans full width |
| `row` | `minmax(0, 1fr)` (single column stack) |
| `grid-layout` (1 col) | `repeat(12, minmax(0, 1fr))` |
| Custom widths | `minmax(0, calc({width}% - (({gap} * {n-1}) / {n})))` per column |

For custom widths, the last column width is calculated as the remainder to sum to 100%.

The `first-row` and `last-row` layouts use `:nth-child(Nn+M of *:not(style))` selectors to span specific children across the full grid width via `grid-column: 1 / -1`.

#### Responsive Layout Cascade

- **Desktop** — always rendered
- **Tablet** — uses `tabletLayout` if set; if not set but custom tablet gutter exists, re-renders desktop layout with tablet gutter; if not set and columns > 4, falls back to `mobileLayout` (or `row`)
- **Mobile** — uses `mobileLayout` (defaults to `row` / single column stack)

### Script & Style Enqueuing (`render_scripts`)

Scripts and styles are conditionally loaded based on which features are active:

| Asset | Condition | Dependencies |
|---|---|---|
| `kadence-blocks-rowlayout` (CSS) | Always (base block styles) | — |
| `kadence-blocks-parallax-js` | Background or overlay image uses `parallax` attachment | `jarallax` |
| `jarallax` | Loaded as dependency of parallax script | — |
| `kadence-blocks-splide` (CSS) | Background type is `slider` | `kadence-kb-splide` |
| `kadence-blocks-splide-init` (JS) | Background type is `slider` | `kad-splide` |
| `kadence-blocks-video-bg` (JS) | Background video with play/pause or mute/unmute buttons visible | — |

### Registered Frontend Scripts (`register_scripts`)

| Handle | File | Purpose |
|---|---|---|
| `jarallax` | `includes/assets/js/jarallax.min.js` | Parallax scrolling library |
| `kadence-blocks-parallax-js` | `includes/assets/js/kt-init-parallax.min.js` | Initializes parallax on `.kt-jarallax` elements |
| `kadence-kb-splide` (CSS) | `includes/assets/css/kadence-splide.min.css` | Base Splide carousel styles |
| `kadence-blocks-splide` (CSS) | `includes/assets/css/kb-blocks-splide.min.css` | Kadence-specific Splide styles |
| `kad-splide` (JS) | `includes/assets/js/splide.min.js` | Splide carousel library |
| `kadence-blocks-splide-init` (JS) | `includes/assets/js/kb-splide-init.min.js` | Initializes Splide carousels with i18n labels |
| `kadence-blocks-video-bg` (JS) | `includes/assets/js/kb-init-html-bg-video.min.js` | Play/pause/mute control for HTML5 background videos |

The parallax speed is configurable via the `kadence_blocks_parallax_speed` filter (default: `-0.1`).

### Background Video Rendering (`get_video_render`)

Three video types supported:

**Local HTML5 Video:**
- Renders a `<video>` tag with `playsinline`, optional `muted`, `loop`, and `autoplay` attributes
- Uses `bgImg` as the `poster` image when available
- When tablet/mobile background overrides are active, `preload="none"` is set and an inline `<script>` checks `window.innerWidth` to conditionally add `autoplay` (threshold: 1024px if tablet override, 767px if mobile only). This is filterable via `kadence_blocks_rowlayout_prevent_preload_for_mobile`

**YouTube / Vimeo Embed:**
- Renders an `<iframe>` inside a ratio container (`.kb-bg-video-ratio-{ratio}`)
- Query parameters set: `autoplay=1`, `controls=0`, `loop`, `mute/muted`, `disablekb=1`, `modestbranding=1`, `playsinline=1`, `rel=0`, `background=1`
- Ratio formatted as `16-9`, `4-3`, or `3-2`

**Video Control Buttons:**
- Play/pause buttons with SVG icons, toggled via `aria-hidden` and `display: none`
- Mute/unmute buttons shown when `btnsMute` is true or when `btns` is true and video is unmuted
- Controlled by `kadence-blocks-video-bg` script

### Background Slider Rendering (`get_slider_render`)

Outputs a Splide.js carousel structure with data attributes for initialization:

- `data-slider-anim-speed` — transition speed in ms
- `data-slider-type` — always `slider`
- `data-slider-arrows` — `true`/`false` based on arrow style
- `data-slider-fade` — fade vs slide transition
- `data-slider-dots` — pagination dots
- `data-slider-auto` — autoplay toggle
- `data-slider-speed` — autoplay interval in ms
- `data-show-pause-button` — accessibility pause control

Each slide is a `<li class="splide__slide">` containing a `<div>` with inline background styles (color, image, size, position, repeat). Slide count is capped by `backgroundSliderCount`.

When autoplay and `showPauseButton` are both enabled, a `<button class="kb-gallery-pause-button splide__toggle">` is rendered with SVG pause/play icons.

### Overlay Rendering

The overlay `<div>` is conditionally rendered by `has_overlay()`, which checks for any overlay configuration across desktop, tablet, and mobile (including legacy `grad` type). The overlay element receives classes:
- `kt-row-layout-overlay` — always
- `kt-row-overlay-{type}` — overlay type (`normal`, `gradient`, `grad`)
- `kt-jarallax` — when overlay image uses parallax attachment

All overlay visual styling is applied via CSS (not inline styles).

### Divider Rendering (`get_divider_render`)

SVG paths are defined inline for all 21 divider types. The output is wrapped in a positioned `<div>` with class `kt-row-layout-{location}-sep kt-row-sep-type-{slug}`. The SVG paths are filterable via `kadence_blocks_row_divider_paths`.

### PHP Filter Hooks

| Filter | Purpose | Default |
|---|---|---|
| `kadence_blocks_attachment_fixed_on_mobile` | Allow `background-attachment: fixed` on mobile/tablet | `false` (falls back to `scroll`) |
| `kadence_blocks_parallax_speed` | Parallax scroll speed | `-0.1` |
| `kadence_blocks_rowlayout_prevent_preload_for_mobile` | Prevent video preload when responsive overrides hide the video | `true` |
| `kadence_blocks_row_divider_paths` | Custom SVG divider paths | Built-in 21 paths |
| `kadence_blocks_css_output_media_queries` | Whether to wrap breakout styles in media queries | `true` |

### Allowed HTML Tags

The outer wrapper tag is validated against: `div`, `header`, `section`, `article`, `main`, `aside`, `footer`.

### Color System (`output_color`)

Palette colors (`palette1`–`palette9`) resolve to CSS custom properties with hardcoded fallbacks:

| Token | CSS Variable | Fallback |
|---|---|---|
| `palette1` | `--global-palette1` | `#3182CE` |
| `palette2` | `--global-palette2` | `#2B6CB0` |
| `palette3` | `--global-palette3` | `#1A202C` |
| `palette4` | `--global-palette4` | `#2D3748` |
| `palette5` | `--global-palette5` | `#4A5568` |
| `palette6` | `--global-palette6` | `#718096` |
| `palette7` | `--global-palette7` | `#EDF2F7` |
| `palette8` | `--global-palette8` | `#F7FAFC` |
| `palette9` | `--global-palette9` | `#ffffff` |

Non-palette colors with opacity use `kadence_blocks_hex2rgba()`.

## Context

The block consumes WordPress block context:

- `postId` / `queryId` — for query loop awareness
- `kadence/dynamicSource` / `kadence/repeaterRow` — for dynamic content support

The `inQueryBlock` attribute tracks whether the row is inside a query loop.