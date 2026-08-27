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
 * The section's built-in border color, used to draw the preview's edge when the preset's border does
 * not resolve — `semantic.color.border`'s own shipped value.
 *
 * @since TBD
 */
const COLUMN_BORDER_FALLBACK = '#E2E8F0';

/**
 * The section's built-in corner radius, matching `semantic.radius.column` (square corners).
 *
 * @since TBD
 */
const COLUMN_RADIUS_FALLBACK = ['0', '0', '0', '0'];

/**
 * Build a row's preview from its stored tokens.
 *
 * The section's whole bound surface is a background, a border color and a radius, so all three are
 * previewed. Border is a COLOR only: the binding owns the `borderStyle` composite's color axis and
 * nothing else, because the section's border width and style stay with the block's own control.
 *
 * @param {Record<string, *>}      tokens       The preset's stored token map.
 * @param {Record<string, string>} values       The feed's resolved value map.
 * @param {string}                 [breakpoint] The breakpoint to resolve responsive values at.
 *
 * @since TBD
 *
 * @return {{background: string, border: string, borderRadius: string}} The preview.
 */
function preview(tokens, values, breakpoint) {
	return {
		background: resolveTokenValue(values, tokens.background, breakpoint),
		border: resolveTokenValue(values, tokens.border, breakpoint),
		borderRadius: resolveTokenValue(values, tokens.borderRadius, breakpoint),
	};
}

/**
 * The section's live preview: a tall, narrow slab drawn at the section's resolved background, border
 * color and radius.
 *
 * Portrait where the Row Layout's band is landscape, because that is the shape each block actually
 * takes on a page — a section is a column of content — and a corner radius reads differently at each
 * aspect. The two nested elements are the shared `preset-surface` shape: the frame carries the border
 * and a transparency checker, the fill carries the preset's background above it, which a single
 * element cannot layer in that order since a background image always paints above its own background
 * color. The section ships a transparent background, so without the checker every unstyled preset
 * would look like it had set white.
 *
 * @param {{id: string, label: string, preview: {background: string, border: string, borderRadius: string}}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	return (
		<span
			className="kadence-blocks-style-library__column-preset-preview"
			style={{
				borderColor: row.preview.border || COLUMN_BORDER_FALLBACK,
				borderRadius: row.preview.borderRadius || undefined,
			}}
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
 * for every breakpoint could not reproduce a look a site owner had already built by hand. Background
 * and border are single non-responsive pickers: the section's background attribute has no per-device
 * counterpart, and the border binding owns one axis of a composite whose width and style are not the
 * preset's to set.
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
					{
						type: 'token-color-select',
						path: 'tokens.border',
						label: __('Border Color', 'kadence-blocks'),
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
