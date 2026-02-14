# Responsive Background Video for Row Layout Block

## Context

The row layout block (`kadence/rowlayout`) supports background videos (local MP4, YouTube, Vimeo) but only at the desktop level. There is no way to set different videos per device. The block already has a full responsive background system for images and gradients (`tabletBackground`/`mobileBackground` arrays with enable toggles, type selectors, and per-device fields), but video was never added as a type option for those responsive panels.

The goal is to let users set a different background video for desktop, tablet, and mobile, and ensure the browser only loads the video for the active viewport.

## Approach

Extend the existing responsive background system to accept `'video'` as a type. Store per-device video data in new attributes (`tabletBackgroundVideo`, `mobileBackgroundVideo`) that mirror the desktop `backgroundVideo` structure. Render per-device `<video>`/`<iframe>` containers in the frontend HTML, use CSS media queries for visibility, and use JavaScript to activate only the visible video (removing `preload="none"` / setting iframe `src`).

## Files to Modify

### 1. `src/blocks/rowlayout/block.json` — New Attributes

Add four new attributes:

```json
"tabletBackgroundVideoType": {
    "type": "string",
    "default": "local"
},
"tabletBackgroundVideo": {
    "type": "array",
    "default": [{
        "youTube": "",
        "local": "",
        "localID": "",
        "vimeo": "",
        "ratio": "16/9",
        "loop": true,
        "mute": true
    }]
},
"mobileBackgroundVideoType": {
    "type": "string",
    "default": "local"
},
"mobileBackgroundVideo": {
    "type": "array",
    "default": [{
        "youTube": "",
        "local": "",
        "localID": "",
        "vimeo": "",
        "ratio": "16/9",
        "loop": true,
        "mute": true
    }]
}
```

No `btns`/`btnsMute` for responsive — play/pause/mute buttons are desktop-only for MVP. Video poster image uses the existing `tabletBackground[0].bgImg` / `mobileBackground[0].bgImg` fields, following the same coupling pattern as desktop where `bgImg` doubles as the video poster.

### 2. `src/blocks/rowlayout/style-controls.js` — Editor Controls

**a. Destructure new attributes** (~line 53): Add `tabletBackgroundVideo`, `tabletBackgroundVideoType`, `mobileBackgroundVideo`, `mobileBackgroundVideoType`.

**b. Add save helpers** (after `saveVideoSettings` ~line 348):

```js
const saveTabletVideoSettings = (value) => {
    let bgVideo;
    if (!tabletBackgroundVideo?.[0]) {
        bgVideo = [{ youTube: '', local: '', localID: '', vimeo: '', ratio: '16/9',
                      loop: true, mute: true }];
    } else {
        bgVideo = tabletBackgroundVideo;
    }
    const newUpdate = bgVideo.map((item, index) => {
        if (0 === index) item = { ...item, ...value };
        return item;
    });
    setAttributes({ tabletBackgroundVideo: newUpdate });
};
// Same pattern for saveMobileVideoSettings → mobileBackgroundVideo
```

**c. Change `allowedTypes` on tablet and mobile `BackgroundTypeControl`**:

- `mobileControls` (~line 534): Change `allowedTypes={['normal', 'gradient']}` to `allowedTypes={['normal', 'gradient', 'video']}`
- `tabletControls` (~line 704): Same change

The `BackgroundTypeControl` component (`src/packages/components/src/background-type-control/index.js`) already has a `'video'` tab with icon defined in `defaultTabs` — it's just filtered out by `allowedTypes`. No changes needed to that component.

**d. Add video controls** after the existing `'normal' === tabletBackgroundType` and `'gradient' === tabletBackgroundType` conditional blocks:

```jsx
{'video' === tabletBackgroundType && (
    <>
        <SelectControl label="Background Video Type"
            options={[
                { label: 'Local (MP4)', value: 'local' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Vimeo', value: 'vimeo' },
            ]}
            value={tabletBackgroundVideoType}
            onChange={(value) => setAttributes({ tabletBackgroundVideoType: value })}
        />
        {/* Local: KadenceVideoControl + TextControl for URL */}
        {/* YouTube: TextControl for video ID */}
        {/* Vimeo: TextControl for video ID */}
        {/* Ratio SelectControl (YouTube/Vimeo only) */}
        {/* Mute ToggleControl */}
        {/* Loop ToggleControl */}
        {/* Poster KadenceImageControl (local only) — writes to tabletBackground[0].bgImg / mobileBackground[0].bgImg */}
        <PopColorControl label="Background Color" ... />
    </>
)}
```

Mirror for `mobileControls`. The controls replicate the desktop video controls (lines 1155-1343) but use the per-device save helpers and attributes. No play/pause/mute button toggles.

### 3. `src/blocks/rowlayout/row-background.js` — Editor Preview

**a. Destructure new attributes** (~line 97): Add the four new attributes.

**b. Update `previewBackgroundSettingTab`** (~line 371):

Currently tablet/mobile overrides always resolve to `'normal'`:
```js
tabletBackground?.[0]?.enable ? 'normal' : '',
```

Change to pass through the actual type:
```js
tabletBackground?.[0]?.enable ? (tabletBackground?.[0]?.type || 'normal') : '',
```

Same for mobile. This lets the preview show the video container when the device override type is `'video'`.

**c. Update video preview rendering** (~line 640):

Replace the single desktop-only video preview with device-aware logic:

```js
{'video' === previewBackgroundSettingTab && (() => {
    let activeVideoType, activeVideo;
    if (previewDevice === 'Mobile' && mobileBackground?.[0]?.enable && mobileBackground?.[0]?.type === 'video') {
        activeVideoType = mobileBackgroundVideoType || 'local';
        activeVideo = mobileBackgroundVideo?.[0];
    } else if (previewDevice === 'Tablet' && tabletBackground?.[0]?.enable && tabletBackground?.[0]?.type === 'video') {
        activeVideoType = tabletBackgroundVideoType || 'local';
        activeVideo = tabletBackgroundVideo?.[0];
    } else {
        activeVideoType = backgroundVideoType || 'local';
        activeVideo = backgroundVideo?.[0];
    }
    return (
        <div className="kb-blocks-bg-video-container" style={{ backgroundColor: ... }}>
            {/* Render <video> or thumbnail <div> based on activeVideoType/activeVideo */}
        </div>
    );
})()}
```

### 4. `includes/blocks/class-kadence-blocks-row-layout-block.php` — Frontend

This is the largest change. Four methods need updates.

**a. `get_video_render()` — Add `$device` parameter**

Refactor to accept `$device = 'desktop'`:

```php
public function get_video_render( $attributes, $device = 'desktop' ) {
    switch ( $device ) {
        case 'tablet':
            $video_attributes = $attributes['tabletBackgroundVideo'][0] ?? [];
            $video_type = $attributes['tabletBackgroundVideoType'] ?? 'local';
            $poster = $attributes['tabletBackground'][0]['bgImg'] ?? '';
            break;
        case 'mobile':
            $video_attributes = $attributes['mobileBackgroundVideo'][0] ?? [];
            $video_type = $attributes['mobileBackgroundVideoType'] ?? 'local';
            $poster = $attributes['mobileBackground'][0]['bgImg'] ?? '';
            break;
        default: // desktop — unchanged behavior
            $video_attributes = $attributes['backgroundVideo'][0] ?? [];
            $video_type = $attributes['backgroundVideoType'] ?? 'local';
            $poster = $attributes['bgImg'] ?? '';
            break;
    }
    // ... existing rendering logic using $video_attributes, $video_type, $poster
```

Key differences for non-desktop containers:
- Container class: `kb-blocks-bg-video-container kb-blocks-bg-video-{$device}`
- Video ID: `bg-row-video-{$uniqueID}-{$device}`
- All `<video>` elements: `preload="none"`, no `autoplay` (JS will activate the correct one)
- All `<iframe>` elements: use `data-src` instead of `src` (JS will copy to `src`)
- No play/pause/mute buttons

The desktop container also gets `preload="none"` (no autoplay) when responsive video overrides exist, so JS can uniformly activate the correct one.

**b. `build_html()` — Render per-device video containers**

After the existing video render (~line 1735):

```php
if ( 'video' === $background_type ) {
    $extra_content .= $this->get_video_render( $attributes, 'desktop' );
}
$tablet_bg = $attributes['tabletBackground'][0] ?? [];
if ( ! empty( $tablet_bg['enable'] ) && 'video' === ( $tablet_bg['type'] ?? '' ) ) {
    $extra_content .= $this->get_video_render( $attributes, 'tablet' );
}
$mobile_bg = $attributes['mobileBackground'][0] ?? [];
if ( ! empty( $mobile_bg['enable'] ) && 'video' === ( $mobile_bg['type'] ?? '' ) ) {
    $extra_content .= $this->get_video_render( $attributes, 'mobile' );
}
```

Replace the existing inline `<script>` preload prevention (lines 1763-1769) with enqueuing the new responsive video script when any per-device video exists. The script handles all viewport-based activation.

**c. `build_css()` — Video container visibility**

After the existing tablet/mobile background CSS sections (~lines 917, 988), add per-block CSS rules:

```php
$has_tablet_video = ! empty( $tablet_background['enable'] ) && 'video' === ( $tablet_background['type'] ?? '' );
$has_mobile_video = ! empty( $mobile_background['enable'] ) && 'video' === ( $mobile_background['type'] ?? '' );

if ( $has_tablet_video ) {
    // Hide tablet container by default
    $css->set_selector( $base_selector . ' > .kb-blocks-bg-video-tablet' );
    $css->add_property( 'display', 'none' );
    // Show at tablet, hide desktop
    $css->set_media_state( 'tablet' );
    $css->set_selector( $base_selector . ' > .kb-blocks-bg-video-tablet' );
    $css->add_property( 'display', 'block' );
    $css->set_selector( $base_selector . ' > .kb-blocks-bg-video-container:not(.kb-blocks-bg-video-tablet):not(.kb-blocks-bg-video-mobile)' );
    $css->add_property( 'display', 'none' );
    $css->set_media_state( 'desktop' );
}

if ( $has_mobile_video ) {
    // Hide mobile container by default
    $css->set_selector( $base_selector . ' > .kb-blocks-bg-video-mobile' );
    $css->add_property( 'display', 'none' );
    // Show at mobile, hide others
    $css->set_media_state( 'mobile' );
    $css->set_selector( $base_selector . ' > .kb-blocks-bg-video-mobile' );
    $css->add_property( 'display', 'block' );
    $css->set_selector( $base_selector . ' > .kb-blocks-bg-video-container:not(.kb-blocks-bg-video-mobile)' );
    $css->add_property( 'display', 'none' );
    $css->set_media_state( 'desktop' );
}
```

Also update the existing generic video-hiding logic (~lines 913-916, 984-987). Currently when a tablet/mobile override is enabled and the desktop type is not `normal`, ALL `.kb-blocks-bg-video-container` elements are hidden. This must be refined to exclude device-specific video containers when the override type is `'video'`:

```php
// Existing: hides all video containers when tablet override replaces desktop video
if ( 'normal' !== $background_type ) {
    if ( 'video' === ( $tablet_background_type ?? '' ) ) {
        // Only hide desktop video + slider, not the tablet video container
        $css->set_selector( $base_selector . ' > .kb-blocks-bg-video-container:not(.kb-blocks-bg-video-tablet):not(.kb-blocks-bg-video-mobile),' . $base_selector . ' .kb-blocks-bg-slider' );
    } else {
        $css->set_selector( $base_selector . ' .kb-blocks-bg-video-container,' . $base_selector . ' .kb-blocks-bg-slider' );
    }
    $css->add_property( 'display', 'none' );
}
```

Same refinement for the mobile section.

**Cascade behavior:** If tablet video is set but mobile is not, the tablet container should remain visible at mobile breakpoint (inheriting down). If both are set, mobile overrides tablet at the mobile breakpoint. This is handled by using `:not()` selectors so only the most specific container is visible.

**d. `render_scripts()` — Enqueue responsive video script**

```php
$has_tablet_video = ! empty( $attributes['tabletBackground'][0]['enable'] )
    && 'video' === ( $attributes['tabletBackground'][0]['type'] ?? '' );
$has_mobile_video = ! empty( $attributes['mobileBackground'][0]['enable'] )
    && 'video' === ( $attributes['mobileBackground'][0]['type'] ?? '' );
if ( $has_tablet_video || $has_mobile_video ) {
    $this->enqueue_script( 'kadence-blocks-responsive-video-bg' );
}
```

### 5. New File: `src/assets/js/kb-responsive-bg-video.js`

**Existing patterns review:** No shared viewport utility exists in `src/assets/js/` — each script (`kt-tabs.js`, `kb-navigation-block.js`, `kb-header-block.js`) implements its own inline detection using `window.innerWidth`. The script below follows the same conventions (IIFE, `DOMContentLoaded` check, debounced resize, `window.innerWidth`).

**Critical:** The JS breakpoints (`TABLET = 1024`, `MOBILE = 767`) must match the CSS media query breakpoints used by `build_css()` media states. Verify these values against `Kadence_Blocks_CSS::$media_queries` during implementation.

A lightweight script that runs once on load and optionally on resize. It:

1. Finds all `.kb-row-layout-wrap` elements that contain multiple video containers
2. Determines the current viewport (`desktop` / `tablet` / `mobile`) based on `window.innerWidth`
3. For the matching container: removes `preload="none"`, sets `autoplay`, calls `.play()` on `<video>`; copies `data-src` to `src` on `<iframe>`
4. For non-matching containers: pauses `<video>`, does not load `<iframe>`

```js
(function() {
    var TABLET = 1024, MOBILE = 767;
    function getDevice() {
        var w = window.innerWidth;
        return w <= MOBILE ? 'mobile' : w <= TABLET ? 'tablet' : 'desktop';
    }
    function activate(c) {
        var v = c.querySelector('video');
        if (v) { v.removeAttribute('preload'); v.setAttribute('autoplay',''); v.play && v.play().catch(function(){}); }
        var f = c.querySelector('iframe[data-src]');
        if (f && !f.src) f.src = f.getAttribute('data-src');
    }
    function deactivate(c) {
        var v = c.querySelector('video');
        if (v) { v.pause(); v.removeAttribute('autoplay'); }
    }
    function init() {
        var rows = document.querySelectorAll('.kb-row-layout-wrap');
        rows.forEach(function(row) {
            var desk = row.querySelector(':scope > .kb-blocks-bg-video-container:not(.kb-blocks-bg-video-tablet):not(.kb-blocks-bg-video-mobile)');
            var tab = row.querySelector(':scope > .kb-blocks-bg-video-tablet');
            var mob = row.querySelector(':scope > .kb-blocks-bg-video-mobile');
            if (!tab && !mob) return;
            var dev = getDevice();
            [{el:desk,d:'desktop'},{el:tab,d:'tablet'},{el:mob,d:'mobile'}].forEach(function(o) {
                if (!o.el) return;
                var on = o.d === dev
                    || (dev === 'mobile' && o.d === 'tablet' && !mob)
                    || (dev === 'tablet' && o.d === 'desktop' && !tab)
                    || (dev === 'mobile' && o.d === 'desktop' && !tab && !mob);
                on ? activate(o.el) : deactivate(o.el);
            });
        });
    }
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
    var t; window.addEventListener('resize', function() { clearTimeout(t); t = setTimeout(init, 250); });
})();
```

Register in `register_scripts()`:

```php
wp_register_script( 'kadence-blocks-responsive-video-bg',
    KADENCE_BLOCKS_URL . 'includes/assets/js/kb-responsive-bg-video.min.js',
    array(), KADENCE_BLOCKS_VERSION, true );
```

### 6. `src/blocks/rowlayout/style.scss` — No changes needed

Tablet/mobile containers get both `.kb-blocks-bg-video-container` and `.kb-blocks-bg-video-{device}`, so they inherit all existing positioning/sizing styles. Visibility is handled by per-block CSS from `build_css()`.

## Bandwidth Optimization Strategy

| Video Type | Hidden Container Behavior | Activation |
|---|---|---|
| Local `<video>` | `preload="none"`, no `autoplay` | JS removes `preload`, adds `autoplay`, calls `.play()` |
| YouTube/Vimeo `<iframe>` | `data-src` instead of `src` | JS copies `data-src` → `src` |

CSS `display: none` on non-matching containers provides visual hiding. The JS ensures no network requests are made for hidden videos. The combination guarantees the browser only loads the active video.

## Backward Compatibility

- Existing blocks have no `tabletBackgroundVideo`/`mobileBackgroundVideo` attributes — `block.json` defaults provide empty values, no migration needed
- `tabletBackground[0].type` defaults to `'normal'` in existing blocks, so the video code path never triggers
- Desktop video rendering is unchanged (`get_video_render($attributes, 'desktop')` preserves all existing behavior)
- The block is dynamically rendered (PHP), so no `deprecated.js` entries needed
- Existing inline preload prevention script remains for blocks without responsive video

## Verification

1. **Editor:** Switch between Desktop/Tablet/Mobile preview — verify correct video thumbnail or `<video>` element shows per device
2. **Frontend — local video:** Set different MP4 videos per device. Open DevTools Network tab. On desktop viewport, only the desktop video should load. Resize to tablet — desktop video should pause, tablet video should load and play
3. **Frontend — YouTube/Vimeo:** Set YouTube on desktop, Vimeo on mobile. Verify only the desktop iframe loads initially. At mobile width, verify the Vimeo iframe gets its `src` set
4. **Cascade:** Set desktop + mobile video (no tablet). Verify tablet viewport shows the desktop video
5. **Mixed:** Set desktop=video, tablet=image, mobile=video. Verify tablet shows the image background (no video container visible), mobile shows the mobile video
6. **Legacy blocks:** Existing blocks with desktop-only video should render identically to before
