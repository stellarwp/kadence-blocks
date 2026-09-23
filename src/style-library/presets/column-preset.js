/**
 * Everything specific to the `kadence/column` (Section) preset screen, in one place: the block name,
 * the bound property surface, the row preview, the state tabs, and the per-tab settings schema.
 *
 * The generic preset machinery — `helpers/presets.js`, `usePresetScreen`, `PresetSettings` — reads
 * this config and knows nothing else about sections. See `src/style-library/README.md`.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getPresetProperties, resolveTokenValue, restingRadiusSlots } from '../helpers/presets';

/**
 * The block name this screen edits. The block is called Section in the UI but `kadence/column` in
 * code, and this is the single JS spelling of the code name, shared by the screen registration and
 * the config below so the two can never drift.
 *
 * @since TBD
 */
export const COLUMN_BLOCK = 'kadence/column';

/**
 * The panel's state tabs, in display order. `hover` is the name the screen watches to hold the open
 * row's hover preview while that tab is being edited.
 *
 * @since TBD
 */
const TABS = [
	{ name: 'normal', title: __('Normal', 'kadence-blocks') },
	{ name: 'hover', title: __('Hover', 'kadence-blocks') },
];

/**
 * The section's built-in corner radius, matching `semantic.radius.column` (square corners).
 *
 * @since TBD
 */
const COLUMN_RADIUS_FALLBACK = ['0', '0', '0', '0'];

/**
 * Build a row's preview from its stored tokens.
 *
 * The section's whole bound surface is a background and a radius, each with a hover twin, so all
 * four are previewed. Border color is deliberately not part of that surface — see the section's
 * `preset_bindings` declaration for why a color-only border binding can never reach the page — so
 * the preview's edge is a neutral frame from the stylesheet rather than anything the preset holds.
 *
 * @param {Record<string, *>}      tokens       The preset's stored token map.
 * @param {Record<string, string>} values       The feed's resolved value map.
 * @param {string}                 [breakpoint] The breakpoint to resolve responsive values at.
 *
 * @since TBD
 *
 * @return {{background: string, borderRadius: string, hover: {background: string, borderRadius: string}}} The preview.
 */
function preview(tokens, values, breakpoint) {
	return {
		background: resolveTokenValue(values, tokens.background, breakpoint),
		borderRadius: resolveTokenValue(values, tokens.borderRadius, breakpoint),
		hover: {
			background: resolveTokenValue(values, tokens.backgroundHover, breakpoint),
			borderRadius: resolveTokenValue(values, tokens.borderHoverRadius, breakpoint),
		},
	};
}

/**
 * The section's live preview: a tall, narrow slab drawn at the section's resolved background and
 * radius. While the pointer is over it (or `row.showHoverState` is set, which the screen does for
 * the row whose panel is on the Hover tab) each style swaps to the preset's resolved hover value;
 * an unset hover value keeps the resting style, exactly what a real section whose preset stores no
 * hover override does.
 *
 * Portrait where the Row Layout's band is landscape, because that is the shape each block actually
 * takes on a page — a section is a column of content — and a corner radius reads differently at each
 * aspect. The two nested elements are the shared `preset-surface` shape: the frame carries the border
 * and a transparency checker, the fill carries the preset's background above it, which a single
 * element cannot layer in that order since a background image always paints above its own background
 * color. The section ships a transparent background, so without the checker every unstyled preset
 * would look like it had set white.
 *
 * @param {Object} props     The component props.
 * @param {Object} props.row The row descriptor (`{id, label, preview, showHoverState?}`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function ColumnPresetPreview({ row }) {
	const [isHovered, setIsHovered] = useState(false);

	const resting = row.preview;
	const hover = resting.hover ?? {};
	const showHover = isHovered || row.showHoverState === true;
	const styleFor = (base, hovered) => (showHover && hovered ? hovered : base) || undefined;

	return (
		<span
			className="kadence-blocks-style-library__column-preset-preview"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ borderRadius: styleFor(resting.borderRadius, hover.borderRadius) }}
		>
			<span
				className="kadence-blocks-style-library__column-preset-preview-fill"
				style={{ background: styleFor(resting.background, hover.background) }}
			/>
		</span>
	);
}

/**
 * The row's preview slot: the generic row mapper calls this as a plain function, so it stays one —
 * the hover state lives inside `ColumnPresetPreview`, which needs to be a component to hold it.
 *
 * @param {{id: string, label: string, preview: Object, showHoverState?: boolean}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	return <ColumnPresetPreview row={row} />;
}

/**
 * The per-tab settings schema. The Normal tab edits the resting background and radius; the Hover
 * tab edits their hover twins, the only two hover properties the block binds.
 *
 * Radius uses the responsive `radius` field because the block declares `tabletBorderRadius`/
 * `mobileBorderRadius` (and their hover twins) and its own control is per-device — a preset that
 * could only say one radius for every breakpoint could not reproduce a look a site owner had already
 * built by hand. Background is a single non-responsive picker: the section's background attribute has
 * no per-device counterpart, and `color-select` carries no breakpoint switcher to drive one. It opens
 * the same palette popover the block editor's own color controls open, and falls back to the Default
 * preset's token for the active tab when unset.
 *
 * There is no border-color field on either tab, and its absence is deliberate rather than an
 * omission: the section's border output takes `render_border_styles()`'s shorthand path, which no
 * block-default `border-color` rule can reach. Offering the field would save a value that changes
 * nothing on the page. See the section's `preset_bindings` declaration.
 *
 * @param {string}  tab   The active tab name (`'normal'` or `'hover'`).
 * @param {?Object} draft The panel draft, read by the hover radius default.
 * @param {?Object} feed  The design-tokens feed, read by the hover radius default.
 *
 * @since TBD
 *
 * @return {{panels: Array<Object>}} The settings-form schema for the active tab.
 */
function schemaFor(tab, draft, feed) {
	const isHover = tab === 'hover';

	return {
		panels: [
			{
				id: 'color',
				title: __('Color', 'kadence-blocks'),
				fields: [
					{
						type: 'color-select',
						path: isHover ? 'tokens.backgroundHover' : 'tokens.background',
						label: __('Background', 'kadence-blocks'),
						// The semantic background the block binds for each state (the Default preset binds
						// `column-bg`, see the baseline's `presets["kadence/column"]`; the hover twin is the
						// block's own hover binding), so a row that stores nothing previews the color a fresh
						// section really renders — transparent, shown as a blank swatch labeled "Default".
						defaultValue: isHover ? 'semantic.color.column-bg-hover' : 'semantic.color.column-bg',
					},
				],
			},
			{
				id: 'border',
				title: __('Border', 'kadence-blocks'),
				fields: [
					{
						type: 'radius',
						tokenType: 'dimension',
						role: 'radius',
						responsive: true,
						path: isHover ? 'tokens.borderHoverRadius' : 'tokens.borderRadius',
						label: __('Radius', 'kadence-blocks'),
						// Resting: square corners, which is what an un-preset section renders and what
						// `semantic.radius.column` holds. Hover: the resting corners in effect at the field's
						// active breakpoint, since a section with no hover radius keeps them through hover;
						// resolved lazily because the schema is built before the breakpoint is known. Shown
						// muted so an unset field reports the radius the section really has rather than
						// reading as empty.
						defaultValue: isHover
							? (breakpoint) => restingRadiusSlots(draft, feed, COLUMN_RADIUS_FALLBACK, breakpoint)
							: COLUMN_RADIUS_FALLBACK,
					},
				],
			},
		],
	};
}

/**
 * The Section preset screen's whole configuration, passed to the generic preset machinery.
 *
 * `properties` is a getter rather than a snapshot, for the same reason the Button's is: the config is
 * frozen at module evaluation, before the localized feed is guaranteed to exist, so a snapshot taken
 * here could throw or go stale.
 *
 * @since TBD
 */
export const COLUMN_PRESET = Object.freeze({
	block: COLUMN_BLOCK,
	get properties() {
		return getPresetProperties(COLUMN_BLOCK);
	},
	slugBase: 'section',
	addLabel: __('Add Section Style', 'kadence-blocks'),
	newLabel: __('New Section Style', 'kadence-blocks'),
	tabs: TABS,
	className: 'kadence-blocks-style-library__column-screen',
	preview,
	renderPreview,
	schemaFor,
});
