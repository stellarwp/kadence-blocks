/**
 * Picking a check mark color that stays legible against whichever swatch it sits on
 * (`ColorGroupList`'s selected-row mark) — the swatch's own color is a design token's resolved
 * value, so there is no fixed color that reads on every one of them.
 */

/**
 * The mark colors to choose between, matching the design tokens' own light/dark text colors
 * (`token-controls.scss`'s header comment: gray-900 `#1e1e1e` text, white surfaces).
 *
 * @since TBD
 */
const LIGHT_MARK = '#ffffff';
const DARK_MARK = '#1e1e1e';

/**
 * The popover's own background (`token-controls.scss`'s "260px white sheet") — what an
 * alpha-bearing swatch color is composited against, since `readableMarkColor()` picks a mark
 * color for how the swatch actually reads on that surface, not for its channels in isolation.
 *
 * @since TBD
 */
const SWATCH_BACKING = { r: 255, g: 255, b: 255 };

/**
 * Parse a CSS color string into its `{ r, g, b, a }` channels (0-255 for color, 0-1 for alpha).
 * Handles the shapes a resolved design-token value actually takes: `#rgb`, `#rrggbb`,
 * `#rrggbbaa`, `rgb(...)`, and `rgba(...)`. Returns `null` for anything else (a CSS keyword, a
 * `var(...)` reference, or an unresolved value) rather than guessing.
 *
 * @param {string} value The color string.
 *
 * @since TBD
 *
 * @return {?{r: number, g: number, b: number, a: number}} The parsed channels, or null.
 */
export function parseColorChannels(value) {
	if (typeof value !== 'string') {
		return null;
	}

	const trimmed = value.trim();
	const hex = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i)?.[1];

	if (hex) {
		const full = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;
		const a = full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1;

		return {
			r: parseInt(full.slice(0, 2), 16),
			g: parseInt(full.slice(2, 4), 16),
			b: parseInt(full.slice(4, 6), 16),
			a,
		};
	}

	const rgb = trimmed.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);

	if (rgb) {
		return {
			r: Number(rgb[1]),
			g: Number(rgb[2]),
			b: Number(rgb[3]),
			a: rgb[4] === undefined ? 1 : Number(rgb[4]),
		};
	}

	return null;
}

/**
 * Composite a parsed color's channels over `SWATCH_BACKING`, so an alpha-bearing swatch's
 * luminance reflects how it actually reads on the popover surface rather than its raw channels —
 * a fully transparent swatch is indistinguishable from that white surface, not from black.
 *
 * @param {{r: number, g: number, b: number, a: number}} channels The parsed channels.
 *
 * @since TBD
 *
 * @return {{r: number, g: number, b: number}} The composited, fully opaque channels.
 */
function compositeOverBacking({ r, g, b, a }) {
	return {
		r: a * r + (1 - a) * SWATCH_BACKING.r,
		g: a * g + (1 - a) * SWATCH_BACKING.g,
		b: a * b + (1 - a) * SWATCH_BACKING.b,
	};
}

/**
 * The channel-relative luminance a channel contributes under WCAG's contrast formula.
 *
 * @param {number} channel An 0-255 color channel.
 *
 * @since TBD
 *
 * @return {number} The linearized 0-1 contribution.
 */
function linearize(channel) {
	const normalized = channel / 255;

	return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

/**
 * WCAG relative luminance (0 = black, 1 = white) for a parsed color.
 *
 * @param {{r: number, g: number, b: number}} channels The color's channels.
 *
 * @since TBD
 *
 * @return {number} The relative luminance.
 */
export function relativeLuminance({ r, g, b }) {
	return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * The check mark color that reads legibly against a swatch's resolved background — white on a
 * dark swatch, the design tokens' own dark text color on a light one. Defaults to the dark mark
 * when the swatch's color can't be parsed (a `var(...)` reference or an unresolved value), since
 * `ColorGroupList`'s rows sit on a light popover background either way.
 *
 * @param {*} value The swatch's resolved CSS color.
 *
 * @since TBD
 *
 * @return {string} `#ffffff` or `#1e1e1e`.
 */
export function readableMarkColor(value) {
	const channels = parseColorChannels(value);

	if (!channels) {
		return DARK_MARK;
	}

	// 0.5 splits light from dark roughly at WCAG's own "AA large text" contrast threshold for
	// these two marks against arbitrary backgrounds — good enough for a decorative check mark,
	// where the swatch's own color is already the primary signal.
	return relativeLuminance(compositeOverBacking(channels)) < 0.5 ? LIGHT_MARK : DARK_MARK;
}
