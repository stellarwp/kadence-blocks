/**
 * Everything specific to the `kadence/single-icon` preset screen, in one place: the block name, the
 * bound property surface, the row preview, and the settings schema.
 *
 * The generic preset machinery — `helpers/presets.js`, `usePresetScreen`, `PresetSidebar` — reads
 * this config and knows nothing else about icons. See `src/style-library/README.md`.
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
export const SINGLE_ICON_BLOCK = 'kadence/single-icon';

/**
 * The icon's built-in color, used when the preset's color does not resolve — `semantic.color.icon`'s
 * own shipped value, which is what an un-preset icon renders at.
 *
 * @since TBD
 */
const ICON_COLOR_FALLBACK = '#3182CE';

/**
 * The icon's built-in size, matching `semantic.icon-size.default`.
 *
 * @since TBD
 */
const ICON_SIZE_FALLBACK = '1.5rem';

/**
 * Build a row's preview from its stored tokens.
 *
 * An icon's whole bound surface is its color and its size, so both are previewed — unlike the
 * Button, whose preview shows three of eleven properties. Size is previewed as a real length rather
 * than a scaled-down swatch, because an icon-size scale is only legible at true size.
 *
 * @param {Record<string, *>}      tokens       The preset's stored token map.
 * @param {Record<string, string>} values       The feed's resolved value map.
 * @param {string}                 [breakpoint] The breakpoint to resolve responsive values at.
 *
 * @since TBD
 *
 * @return {{color: string, size: string}} The preview.
 */
function preview(tokens, values, breakpoint) {
	return {
		color: resolveTokenValue(values, tokens.color, breakpoint),
		size: resolveTokenValue(values, tokens.size, breakpoint),
	};
}

/**
 * The row's live preview: a generic glyph drawn at the row's resolved color and size.
 *
 * A neutral shape rather than a real Kadence icon on purpose — a preset skins whichever icon a block
 * happens to use, so previewing one specific glyph would imply the preset selects it. `currentColor`
 * lets the single `color` style drive the fill.
 *
 * @param {{id: string, label: string, preview: {color: string, size: string}}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	return (
		<span
			className="kadence-blocks-style-library__single-icon-preset-preview"
			style={{
				color: row.preview.color || ICON_COLOR_FALLBACK,
				fontSize: row.preview.size || ICON_SIZE_FALLBACK,
			}}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path
					fill="currentColor"
					d="M12 2 9.2 8.6 2 9.2l5.5 4.8L5.8 21 12 17.3 18.2 21l-1.7-7 5.5-4.8-7.2-.6z"
				/>
			</svg>
		</span>
	);
}

/**
 * The settings schema. The icon declares no tabs: it binds no hover property, so there is no second
 * state to switch to and `PresetSidebar` renders the field area bare.
 *
 * Size uses `token-scalar` so a preset stores a token id and keeps following the Icon Sizes scale, the
 * same way the block's own size control does — and, like that control, can say something different per
 * breakpoint. The block stores its size in `size`/`tabletSize`/`mobileSize` and the binding declares all
 * three, so a preset that could only set one value for every device would be unable to reproduce a look
 * a site owner had already built with the block's own control.
 *
 * @since TBD
 *
 * @return {{panels: Array<Object>}} The settings-form schema.
 */
function schemaFor() {
	return {
		panels: [
			{
				id: 'icon',
				title: __('Icon', 'kadence-blocks'),
				fields: [
					{ type: 'token-color-select', path: 'tokens.color', label: __('Color', 'kadence-blocks') },
					{
						type: 'token-scalar',
						tokenType: 'dimension',
						role: 'icon-size',
						responsive: true,
						path: 'tokens.size',
						label: __('Size', 'kadence-blocks'),
						// What an un-preset icon renders at, shown muted so an unset field reports the size the
						// block really has rather than reading as empty.
						defaultValue: ICON_SIZE_FALLBACK,
					},
				],
			},
		],
	};
}

/**
 * The Single Icon preset screen's whole configuration, passed to the generic preset machinery.
 *
 * `properties` is a getter rather than a snapshot, for the same reason the Button's is: the config is
 * frozen at module evaluation, before the localized feed is guaranteed to exist, so a snapshot taken
 * here could throw or go stale.
 *
 * @since TBD
 */
export const SINGLE_ICON_PRESET = Object.freeze({
	block: SINGLE_ICON_BLOCK,
	get properties() {
		return getPresetProperties(SINGLE_ICON_BLOCK);
	},
	slugBase: 'icon',
	addLabel: __('Add Icon Style', 'kadence-blocks'),
	newLabel: __('New Icon Style', 'kadence-blocks'),
	className: 'kadence-blocks-style-library__single-icon-screen',
	preview,
	renderPreview,
	schemaFor,
});
