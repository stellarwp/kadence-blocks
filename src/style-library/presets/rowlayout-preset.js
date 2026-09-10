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
 * The row's built-in corner radius, matching `semantic.radius.rowlayout` (square corners).
 *
 * @since TBD
 */
const ROW_RADIUS_FALLBACK = ['0', '0', '0', '0'];

/**
 * Build a row's preview from its stored tokens.
 *
 * The row's whole bound surface is a background and a radius, so both are previewed. Border color is
 * deliberately not part of that surface — see the row's `preset_bindings` declaration for why a
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
 * The row's live preview: a wide, short slab standing in for a section band, drawn at the row's
 * resolved background and radius.
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
 * @param {{id: string, label: string, preview: {background: string, borderRadius: string}}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	const radius = row.preview.borderRadius || undefined;

	return (
		<span className="kadence-blocks-style-library__rowlayout-preset-preview" style={{ borderRadius: radius }}>
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
 * is a single non-responsive picker: the row's background attribute has no per-device counterpart,
 * and `token-color-select` carries no breakpoint switcher to drive one.
 *
 * There is no border-color field, and its absence is deliberate rather than an omission: the row's
 * border output takes `render_border_styles()`'s shorthand path, which no block-default `border-color`
 * rule can reach. Offering the field would save a value that changes nothing on the page. See the
 * row's `preset_bindings` declaration.
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
