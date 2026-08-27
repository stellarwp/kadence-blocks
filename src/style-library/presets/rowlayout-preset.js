/**
 * Everything specific to the `kadence/rowlayout` preset screen, in one place: the block name, the
 * bound property surface, the row preview, and the settings schema.
 *
 * The generic preset machinery — `helpers/presets.js`, `usePresetScreen`, `PresetSidebar` — reads
 * this config and knows nothing else about rows. See `src/style-library/README.md`.
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
 * The block name this screen edits — the single JS spelling, shared by the screen registration and
 * the config below so the two can never drift.
 *
 * @since TBD
 */
export const ROWLAYOUT_BLOCK = 'kadence/rowlayout';

/**
 * The row's built-in border color, used to draw the preview's edge when the preset's border does not
 * resolve — `semantic.color.border`'s own shipped value.
 *
 * @since TBD
 */
const ROW_BORDER_FALLBACK = '#E2E8F0';

/**
 * The row's built-in corner radius, matching `semantic.radius.rowlayout` (square corners).
 *
 * @since TBD
 */
const ROW_RADIUS_FALLBACK = ['0', '0', '0', '0'];

/**
 * Build a row's preview from its stored tokens.
 *
 * The row's whole bound surface is a background, a border color and a radius, so all three are
 * previewed. Border is a COLOR only: the binding owns the `borderStyle` composite's color axis and
 * nothing else, because the row's border width and style stay with the block's own control. The
 * preview therefore draws a fixed hairline in the preset's color rather than implying the preset
 * sets a thickness.
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
 * The row's live preview: a wide, short slab standing in for a section band, drawn at the row's
 * resolved background, border color and radius.
 *
 * A slab rather than a square because a Row Layout is always full-width and short relative to its
 * width, and a corner radius reads very differently at those proportions than on a square swatch.
 * The background is deliberately allowed to resolve to `transparent` — that is the row's real
 * shipped default — which is why the slab is two nested elements rather than one: the outer carries
 * the frame and a checker, the inner carries the preset's background on top of it. Painting both onto
 * one element cannot work in either order (a background image always sits above its own background
 * color), and against the list's white surface a transparent background and a white one would
 * otherwise be indistinguishable.
 *
 * @param {{id: string, label: string, preview: {background: string, border: string, borderRadius: string}}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	const radius = row.preview.borderRadius || undefined;

	return (
		<span
			className="kadence-blocks-style-library__rowlayout-preset-preview"
			style={{
				borderColor: row.preview.border || ROW_BORDER_FALLBACK,
				borderRadius: radius,
			}}
		>
			<span
				className="kadence-blocks-style-library__rowlayout-preset-preview-fill"
				style={{ background: row.preview.background || undefined }}
			/>
		</span>
	);
}

/**
 * The settings schema. The row declares no tabs: it binds no hover property, so there is no second
 * state to switch to and `PresetSidebar` renders the field area bare.
 *
 * Radius uses the responsive `radius` field because the block declares `tabletBorderRadius`/
 * `mobileBorderRadius` and its own control is per-device — a preset that could only say one radius
 * for every breakpoint could not reproduce a look a site owner had already built by hand. Background
 * and border are single non-responsive pickers: the row's background attribute has no per-device
 * counterpart, and the border binding owns one axis of a composite whose width and style are not
 * the preset's to set.
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
						// Square corners, which is what an un-preset row renders and what
						// `semantic.radius.rowlayout` holds. Shown muted so an unset field reports the radius
						// the row really has rather than reading as empty.
						defaultValue: ROW_RADIUS_FALLBACK,
					},
				],
			},
		],
	};
}

/**
 * The Row Layout preset screen's whole configuration, passed to the generic preset machinery.
 *
 * `properties` is a getter rather than a snapshot, for the same reason the Button's is: the config is
 * frozen at module evaluation, before the localized feed is guaranteed to exist, so a snapshot taken
 * here could throw or go stale.
 *
 * @since TBD
 */
export const ROWLAYOUT_PRESET = Object.freeze({
	block: ROWLAYOUT_BLOCK,
	get properties() {
		return getPresetProperties(ROWLAYOUT_BLOCK);
	},
	slugBase: 'row',
	addLabel: __('Add Row Style', 'kadence-blocks'),
	newLabel: __('New Row Style', 'kadence-blocks'),
	className: 'kadence-blocks-style-library__rowlayout-screen',
	preview,
	renderPreview,
	schemaFor,
});
