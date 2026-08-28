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
 * The weights the preset offers. A closed set, for the same reason as {@see BORDER_STYLE_OPTIONS} —
 * `semantic.font-weight` holds one entry per usage, not a scale.
 *
 * @since TBD
 */
const FONT_WEIGHT_OPTIONS = [
	{ value: '', label: __('Default', 'kadence-blocks') },
	{ value: '100', label: __('100 Thin', 'kadence-blocks') },
	{ value: '200', label: __('200 Extra Light', 'kadence-blocks') },
	{ value: '300', label: __('300 Light', 'kadence-blocks') },
	{ value: '400', label: __('400 Regular', 'kadence-blocks') },
	{ value: '500', label: __('500 Medium', 'kadence-blocks') },
	{ value: '600', label: __('600 Semi Bold', 'kadence-blocks') },
	{ value: '700', label: __('700 Bold', 'kadence-blocks') },
	{ value: '800', label: __('800 Extra Bold', 'kadence-blocks') },
	{ value: '900', label: __('900 Black', 'kadence-blocks') },
];

/**
 * Build a row's preview from its stored tokens.
 *
 * Everything the screen edits that a chip of text can honestly show. `borderWidth` and `borderStyle`
 * are previewed alongside `borderColor` because all three are needed for a border to render at all —
 * a color on its own is invisible, which is the trap the Row Layout and Section screens hit. Font
 * family is absent because it is not a bound property; see `schemaFor()`.
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
 * type property, and a color chip cannot show a weight or a transform. The size is deliberately
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
				textTransform: row.preview.textTransform || undefined,
				borderColor: row.preview.borderColor || undefined,
				borderWidth: row.preview.borderWidth || undefined,
				// A border renders only when all three are set, so the style is what decides whether the
				// frame appears at all. Left absent, the stylesheet's own `none` leaves the chip without a frame.
				borderStyle: row.preview.borderStyle || undefined,
				borderRadius: row.preview.borderRadius || undefined,
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
 * Ten of the block's twelve bound properties are offered, grouped by what a site owner is doing rather
 * than by how each value is stored.
 *
 * Font family is not among them, and is not a bound property at all: a heading inherits the theme's
 * font, the block-default CSS emits no font-family default for it, and the family a site owner picks
 * comes from the typography control's own font catalog and is stored as a literal. See the block's
 * `preset_bindings` declaration.
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
 * @since TBD
 *
 * @return {{panels: Array<Object>}} The settings-form schema.
 */
function schemaFor() {
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
						type: 'token-scalar',
						tokenType: 'dimension',
						role: 'font-size',
						responsive: true,
						path: 'tokens.fontSize',
						label: __('Size', 'kadence-blocks'),
						defaultValue: HEADING_FONT_SIZE_FALLBACK,
						// The font-size scale is fluid: every step resolves to a whole `clamp()`
						// expression, which overran its row and pushed the step's own name out of view.
						// The names (SM, MD, LG…) are what a site owner picks by, so the value goes.
						showValue: false,
					},
					{
						type: 'select',
						path: 'tokens.fontWeight',
						label: __('Weight', 'kadence-blocks'),
						options: FONT_WEIGHT_OPTIONS,
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
