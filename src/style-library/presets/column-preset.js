/**
 * Everything specific to the `kadence/column` (Section) preset screen, in one place: the block name,
 * the bound property surface, the row preview, and the settings schema.
 *
 * The generic preset machinery — `helpers/presets.js`, `usePresetScreen`, `PresetSidebar` — reads
 * this config and knows nothing else about sections. See `src/style-library/README.md`.
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
 * The block name this screen edits. The block is called Section in the UI but `kadence/column` in
 * code, and this is the single JS spelling of the code name, shared by the screen registration and
 * the config below so the two can never drift.
 *
 * @since TBD
 */
export const COLUMN_BLOCK = 'kadence/column';

/**
 * The section's built-in corner radius, matching `semantic.radius.column` (square corners).
 *
 * @since TBD
 */
const COLUMN_RADIUS_FALLBACK = ['0', '0', '0', '0'];

/**
 * Build a row's preview from its stored tokens.
 *
 * The section's whole bound surface is a background and a radius, so both are previewed. Border color
 * is deliberately not part of that surface — see the section's `preset_bindings` declaration for why a
 * color-only border binding can never reach the page — so the preview's edge is a neutral frame from
 * the stylesheet rather than anything the preset holds.
 *
 * @param {Record<string, *>}      tokens       The preset's stored token map.
 * @param {Record<string, string>} values       The feed's resolved value map.
 * @param {string}                 [breakpoint] The breakpoint to resolve responsive values at.
 *
 * @since TBD
 *
 * @return {{background: string, borderRadius: string}} The preview.
 */
function preview(tokens, values, breakpoint) {
	return {
		background: resolveTokenValue(values, tokens.background, breakpoint),
		borderRadius: resolveTokenValue(values, tokens.borderRadius, breakpoint),
	};
}

/**
 * The section's live preview: a tall, narrow slab drawn at the section's resolved background and
 * radius.
 *
 * Portrait where the Row Layout's band is landscape, because that is the shape each block actually
 * takes on a page — a section is a column of content — and a corner radius reads differently at each
 * aspect. The two nested elements are the shared `preset-surface` shape: the frame carries the border
 * and a transparency checker, the fill carries the preset's background above it, which a single
 * element cannot layer in that order since a background image always paints above its own background
 * color. The section ships a transparent background, so without the checker every unstyled preset
 * would look like it had set white.
 *
 * @param {{id: string, label: string, preview: {background: string, borderRadius: string}}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	return (
		<span
			className="kadence-blocks-style-library__column-preset-preview"
			style={{ borderRadius: row.preview.borderRadius || undefined }}
		>
			<span
				className="kadence-blocks-style-library__column-preset-preview-fill"
				style={{ background: row.preview.background || undefined }}
			/>
		</span>
	);
}

/**
 * The settings schema. The section declares no tabs: it binds no hover property, so there is no
 * second state to switch to and `PresetSidebar` renders the field area bare.
 *
 * Radius uses the responsive `radius` field because the block declares `tabletBorderRadius`/
 * `mobileBorderRadius` and its own control is per-device — a preset that could only say one radius
 * for every breakpoint could not reproduce a look a site owner had already built by hand. Background is
 * a single non-responsive picker: the section's background attribute has no per-device counterpart, and
 * `token-color-select` carries no breakpoint switcher to drive one.
 *
 * There is no border-color field, and its absence is deliberate rather than an omission: the section's
 * border output takes `render_border_styles()`'s shorthand path, which no block-default `border-color`
 * rule can reach. Offering the field would save a value that changes nothing on the page. See the
 * section's `preset_bindings` declaration.
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
					{
						type: 'token-color-select',
						path: 'tokens.background',
						label: __('Background', 'kadence-blocks'),
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
						path: 'tokens.borderRadius',
						label: __('Radius', 'kadence-blocks'),
						// Square corners, which is what an un-preset section renders and what
						// `semantic.radius.column` holds. Shown muted so an unset field reports the radius the
						// section really has rather than reading as empty.
						defaultValue: COLUMN_RADIUS_FALLBACK,
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
	className: 'kadence-blocks-style-library__column-screen',
	preview,
	renderPreview,
	schemaFor,
});
