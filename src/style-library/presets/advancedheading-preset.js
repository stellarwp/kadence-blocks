// cspell:ignore Abril Fatface -- a Google font family named as a concrete example.
/**
 * Everything specific to the `kadence/advancedheading` (Advanced Text) preset screen, in one place:
 * the block name, the bound property surface, the row preview, and the settings schema.
 *
 * The generic preset machinery — `helpers/presets.js`, `usePresetScreen`, `PresetSidebar` — reads
 * this config and knows nothing else about headings. See `src/style-library/README.md`.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getPresetProperties, resolveTokenValue } from '../helpers/presets';
import { fontCatalogOptions, fontOptions, fontWeightsFor } from '../helpers/typography';

/**
 * The block name this screen edits. The block is called Advanced Text in the UI but
 * `kadence/advancedheading` in code, and this is the single JS spelling of the code name.
 *
 * @since TBD
 */
export const HEADING_BLOCK = 'kadence/advancedheading';

/**
 * The heading's built-in font size, matching `semantic.font-size.heading`.
 *
 * @since TBD
 */
const HEADING_FONT_SIZE_FALLBACK = '2rem';

/**
 * The heading's built-in corner radius, matching `semantic.radius.heading` (square corners).
 *
 * @since TBD
 */
const HEADING_RADIUS_FALLBACK = ['0', '0', '0', '0'];

/**
 * The heading's built-in padding, matching `semantic.spacing.heading-padding` (none).
 *
 * @since TBD
 */
const HEADING_PADDING_FALLBACK = ['0', '0', '0', '0'];

/**
 * The heading's built-in border width, matching `semantic.border-width.default`.
 *
 * @since TBD
 */
const HEADING_BORDER_WIDTH_FALLBACK = '1px';

/**
 * The CSS keywords `border-style` accepts, as the preset offers them.
 *
 * A closed keyword set rather than a token pool: `border-style` has no primitive scale to pick from —
 * `semantic.border-style` holds a single `default` entry, which is a delivery point rather than a set
 * of choices — so a select over the keywords is the honest control. See `schemaFor()`.
 *
 * @since TBD
 */
const BORDER_STYLE_OPTIONS = [
	{ value: '', label: __('Default', 'kadence-blocks') },
	{ value: 'none', label: __('None', 'kadence-blocks') },
	{ value: 'solid', label: __('Solid', 'kadence-blocks') },
	{ value: 'dashed', label: __('Dashed', 'kadence-blocks') },
	{ value: 'dotted', label: __('Dotted', 'kadence-blocks') },
	{ value: 'double', label: __('Double', 'kadence-blocks') },
];

/**
 * The CSS keywords `text-transform` accepts, as the preset offers them. A closed keyword set, for the
 * same reason as {@see BORDER_STYLE_OPTIONS}.
 *
 * @since TBD
 */
const TEXT_TRANSFORM_OPTIONS = [
	{ value: '', label: __('Default', 'kadence-blocks') },
	{ value: 'none', label: __('None', 'kadence-blocks') },
	{ value: 'capitalize', label: __('Capitalize', 'kadence-blocks') },
	{ value: 'uppercase', label: __('Uppercase', 'kadence-blocks') },
	{ value: 'lowercase', label: __('Lowercase', 'kadence-blocks') },
];

/**
 * The human name for each CSS weight, so a list narrowed to one family still reads as words.
 *
 * @since TBD
 */
const FONT_WEIGHT_LABELS = {
	100: __('100 Thin', 'kadence-blocks'),
	200: __('200 Extra Light', 'kadence-blocks'),
	300: __('300 Light', 'kadence-blocks'),
	400: __('400 Regular', 'kadence-blocks'),
	500: __('500 Medium', 'kadence-blocks'),
	600: __('600 Semi Bold', 'kadence-blocks'),
	700: __('700 Bold', 'kadence-blocks'),
	800: __('800 Extra Bold', 'kadence-blocks'),
	900: __('900 Black', 'kadence-blocks'),
};

/**
 * Every CSS weight, offered when nothing narrower is known.
 *
 * @since TBD
 */
const ALL_FONT_WEIGHTS = Object.keys(FONT_WEIGHT_LABELS);

/**
 * The weights a family actually ships, as select options.
 *
 * A family the catalog knows is narrowed to its own weights, which is the point of the exercise: a
 * flat 100-900 list offers faces most families do not have — Abril Fatface ships only 400 — and the
 * browser answers a missing one with a synthesized approximation rather than the real face. With no
 * family chosen the heading inherits the theme's font, which could be anything, and a custom font
 * carries no weight data at all; both cases offer the full set rather than guessing.
 *
 * @param {string} family The family the preset has chosen, or '' for the theme's font.
 *
 * @since TBD
 *
 * @return {Array<{value: string, label: string}>} The weight options.
 */
function fontWeightOptions(family) {
	const weights = family ? fontWeightsFor(family) : null;

	return [
		{ value: '', label: __('Default', 'kadence-blocks') },
		...(weights ?? ALL_FONT_WEIGHTS).map((weight) => ({
			value: String(weight),
			label: FONT_WEIGHT_LABELS[weight] ?? String(weight),
		})),
	];
}

/**
 * Build a row's preview from its stored tokens.
 *
 * Everything the screen edits that a chip of text can honestly show. `borderWidth` and `borderStyle`
 * are previewed alongside `borderColor` because all three are needed for a border to render at all —
 * a color on its own is invisible, which is the trap the Row Layout and Section screens hit.
 *
 * @param {Record<string, *>}      tokens       The preset's stored token map.
 * @param {Record<string, string>} values       The feed's resolved value map.
 * @param {string}                 [breakpoint] The breakpoint to resolve responsive values at.
 *
 * @since TBD
 *
 * @return {Record<string, string>} The preview.
 */
function preview(tokens, values, breakpoint) {
	const resolve = (property) => resolveTokenValue(values, tokens[property], breakpoint);

	return {
		color: resolve('color'),
		background: resolve('background'),
		typography: resolve('typography'),
		fontSize: resolve('fontSize'),
		fontWeight: resolve('fontWeight'),
		textTransform: resolve('textTransform'),
		padding: resolve('padding'),
		borderColor: resolve('borderColor'),
		borderWidth: resolve('borderWidth'),
		borderStyle: resolve('borderStyle'),
		borderRadius: resolve('borderRadius'),
	};
}

/**
 * The row's live preview: the word "Heading" set in the preset's own type, on its own background, in
 * its own frame.
 *
 * Real text rather than a swatch, because every property this screen edits except the box ones is a
 * type property, and a color chip cannot show a family, a weight or a transform. Padding is applied at
 * true size: a heading's padding is bounded by the scale the field offers, unlike the image tile's,
 * which had to be capped. The size is deliberately
 * NOT applied at true size — the scale reaches 4rem and a row cannot grow that far without dwarfing its
 * neighbors — so the chip states the family, weight, transform, color and frame faithfully and leaves
 * size to the sidebar. The Advanced Image tile can afford to grow because its padding is the only
 * property that drives its geometry; a heading's font size drives everything at once.
 *
 * @param {{id: string, label: string, preview: Record<string, string>}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	return (
		<span
			className="kadence-blocks-style-library__heading-preset-preview"
			style={{
				color: row.preview.color || undefined,
				background: row.preview.background || undefined,
				fontWeight: row.preview.fontWeight || undefined,
				fontFamily: row.preview.typography || undefined,
				textTransform: row.preview.textTransform || undefined,
				borderColor: row.preview.borderColor || undefined,
				borderWidth: row.preview.borderWidth || undefined,
				// A border renders only when all three are set, so the style is what decides whether the
				// frame appears at all. Left absent, the stylesheet's own `none` leaves the chip without a frame.
				borderStyle: row.preview.borderStyle || undefined,
				borderRadius: row.preview.borderRadius || undefined,
				// The preset's own padding, not the stylesheet's. Without this the chip showed a fixed
				// inset and a padding preset read as doing nothing at all.
				padding: row.preview.padding || undefined,
			}}
		>
			{__('Heading', 'kadence-blocks')}
		</span>
	);
}

/**
 * The settings schema. The heading declares no tabs: it binds no hover property, so there is no second
 * state to switch to and `PresetSidebar` renders the field area bare.
 *
 * Eleven of the block's thirteen bound properties are offered, grouped by what a site owner is doing
 * rather than by how each value is stored.
 *
 * Font family uses the same tabbed picker the block editor mounts — favorites pinned above the full
 * catalog — and stores the family as a literal: the font catalog is a list of real faces, not a token
 * scale, so there is nothing to alias to. Weight then narrows to the weights that family actually
 * ships, which is why this takes the draft — the two fields are linked, and offering a weight a family
 * does not have would render a synthesized face rather than the one the design system promised.
 *
 * The split between a token picker and a keyword select is not arbitrary: a property is offered as a
 * picker when the design system actually has a scale for it, and as a select when it does not.
 * `border-style`, `text-transform` and `font-weight` have no primitive layer at all — their semantic
 * groups hold one entry per usage (`control`, `heading`), which is a delivery point rather than a set
 * of choices — so a picker would show an empty list. `border-style` in particular has to be offered:
 * without it a preset can set a border's color and width and never make it visible, which is exactly
 * the dead control the Row Layout and Section screens had to drop.
 *
 * `fontHeight` and `letterSpacing` are bound but NOT offered. They have no scale either, and unlike the
 * three above they are open numeric ranges rather than closed keyword sets, so the only control that
 * would fit is a bare number — which invites exactly the unsystematic values a design token library
 * exists to prevent. They want a line-height and letter-spacing scale first; SOFT-4235 covers that.
 *
 * @param {string} tab    The active tab name; the heading declares no tabs, so this is unused.
 * @param {Object} values The current draft, read for the chosen font family.
 * @param {Object} feed   The live design-tokens feed, read for the library's font favorites.
 *
 * @since TBD
 *
 * @return {{panels: Array<Object>}} The settings-form schema.
 */
function schemaFor(tab, values, feed) {
	const family = values?.tokens?.typography ?? '';

	return {
		panels: [
			{
				id: 'color',
				title: __('Color', 'kadence-blocks'),
				fields: [
					{ type: 'token-color-select', path: 'tokens.color', label: __('Text', 'kadence-blocks') },
					{
						type: 'token-color-select',
						path: 'tokens.background',
						label: __('Background', 'kadence-blocks'),
					},
				],
			},
			{
				id: 'typography',
				title: __('Typography', 'kadence-blocks'),
				fields: [
					{
						type: 'font-family',
						path: 'tokens.typography',
						label: __('Font Family', 'kadence-blocks'),
						// Built from the LIVE feed rather than left to the field's own page-load global: a
						// favorite added on the Typography screen refreshes the feed, so passing it through
						// is what makes the new face selectable here without a reload.
						favorites: fontOptions(feed).map((font) => font.label),
						catalogOptions: fontCatalogOptions(feed),
						// What a heading with no family of its own renders in. Named on the muted trigger so
						// an unset field reports the face actually in use rather than reading as empty.
						inherited: __('Theme Font', 'kadence-blocks'),
						// Pairs the Weight field below with this one, so a family switch clears a weight
						// the new family has no face for instead of leaving it to be synthesized.
						weightPath: 'tokens.fontWeight',
					},
					{
						type: 'token-scalar',
						tokenType: 'dimension',
						role: 'font-size',
						responsive: true,
						path: 'tokens.fontSize',
						label: __('Size', 'kadence-blocks'),
						defaultValue: HEADING_FONT_SIZE_FALLBACK,
					},
					{
						type: 'select',
						path: 'tokens.fontWeight',
						label: __('Weight', 'kadence-blocks'),
						options: fontWeightOptions(family),
					},
					{
						type: 'select',
						path: 'tokens.textTransform',
						label: __('Transform', 'kadence-blocks'),
						options: TEXT_TRANSFORM_OPTIONS,
					},
				],
			},
			{
				id: 'border',
				title: __('Border', 'kadence-blocks'),
				fields: [
					{
						type: 'select',
						path: 'tokens.borderStyle',
						label: __('Style', 'kadence-blocks'),
						options: BORDER_STYLE_OPTIONS,
					},
					{
						type: 'token-scalar',
						tokenType: 'dimension',
						role: 'border-width',
						path: 'tokens.borderWidth',
						label: __('Width', 'kadence-blocks'),
						defaultValue: HEADING_BORDER_WIDTH_FALLBACK,
					},
					{
						type: 'token-color-select',
						path: 'tokens.borderColor',
						label: __('Color', 'kadence-blocks'),
					},
					{
						type: 'radius',
						tokenType: 'dimension',
						role: 'radius',
						responsive: true,
						path: 'tokens.borderRadius',
						label: __('Radius', 'kadence-blocks'),
						defaultValue: HEADING_RADIUS_FALLBACK,
					},
				],
			},
			{
				id: 'spacing',
				title: __('Spacing', 'kadence-blocks'),
				fields: [
					{
						type: 'spacing',
						tokenType: 'dimension',
						role: 'spacing',
						responsive: true,
						path: 'tokens.padding',
						label: __('Padding', 'kadence-blocks'),
						defaultValue: HEADING_PADDING_FALLBACK,
					},
				],
			},
		],
	};
}

/**
 * The Advanced Text preset screen's whole configuration, passed to the generic preset machinery.
 *
 * `properties` is a getter rather than a snapshot, for the same reason the Button's is: the config is
 * frozen at module evaluation, before the localized feed is guaranteed to exist, so a snapshot taken
 * here could throw or go stale.
 *
 * @since TBD
 */
export const HEADING_PRESET = Object.freeze({
	block: HEADING_BLOCK,
	get properties() {
		return getPresetProperties(HEADING_BLOCK);
	},
	slugBase: 'heading',
	addLabel: __('Add Text Style', 'kadence-blocks'),
	newLabel: __('New Text Style', 'kadence-blocks'),
	className: 'kadence-blocks-style-library__heading-screen',
	preview,
	renderPreview,
	schemaFor,
});
