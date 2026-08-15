/**
 * Everything specific to the `kadence/singlebtn` preset screen, in one place: the block name, the
 * bound property surface, the row preview, the state tabs, and the per-tab settings schema.
 *
 * The generic preset machinery — `helpers/presets.js`, `usePresetScreen`, `PresetSidebar` — reads
 * this config and knows nothing else about buttons. A second preset screen is a second file shaped
 * like this one; see `src/style-library/README.md`.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BUTTON_BLOCK, getButtonPresetProperties, resolveTokenValue } from '../helpers/presets';

export { BUTTON_BLOCK };

/**
 * The panel's state tabs, in display order.
 *
 * @since TBD
 */
const TABS = [
	{ name: 'normal', title: __('Normal', 'kadence-blocks') },
	{ name: 'hover', title: __('Hover', 'kadence-blocks') },
];

/**
 * Build a row's preview from its stored tokens.
 *
 * The shape is this block's own: a button chip needs a background, a text color and a radius.
 * Another block's rows would preview something else entirely, which is why the generic row mapper
 * takes this as a function rather than reading fixed keys.
 *
 * @param {Record<string, *>}      tokens       The preset's stored token map.
 * @param {Record<string, string>} values       The feed's resolved value map.
 * @param {string}                 [breakpoint] The breakpoint to resolve responsive values at —
 *                                              defaults to desktop. Passed through by both the row
 *                                              preview and the draft-overlay chip, so either one
 *                                              shows the step currently being viewed/edited rather
 *                                              than always falling back to desktop.
 *
 * @since TBD
 *
 * @return {{background: string, color: string, borderRadius: string}} The preview.
 */
function preview(tokens, values, breakpoint) {
	return {
		background: resolveTokenValue(values, tokens['button-bg'], breakpoint),
		color: resolveTokenValue(values, tokens['button-text'], breakpoint),
		borderRadius: resolveTokenValue(values, tokens['button-radius'], breakpoint),
	};
}

/**
 * The row's live preview chip: a non-interactive span reading "Button", styled from the row's
 * resolved background/text/radius. Hover values are never previewed here — a static chip cannot
 * honestly show `:hover`, the sidebar's Hover tab is the editing surface for that — and an
 * unresolved value renders the property absent rather than an invented fallback.
 *
 * Styled by `components/pages/ButtonScreen.scss`, which also carries this screen's other overrides
 * and is imported there.
 *
 * @param {{id: string, label: string, preview: {background: string, color: string, borderRadius: string}}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	return (
		<span
			className="kadence-blocks-style-library__button-preset-preview"
			style={{
				background: row.preview.background || undefined,
				color: row.preview.color || undefined,
				borderRadius: row.preview.borderRadius || undefined,
			}}
		>
			{__('Button', 'kadence-blocks')}
		</span>
	);
}

/**
 * The per-tab settings schema: the Normal tab adds a Radius section and the Hover tab never does —
 * `button-radius` has no hover counterpart, so rendering one there would write a property
 * `guard_surface` rejects. The preset name is not here; it is tab-independent and comes from
 * `presetNameSchema()`.
 *
 * @param {string} tab The active tab name (`'normal'` or `'hover'`).
 *
 * @since TBD
 *
 * @return {{panels: Array<Object>}} The settings-form schema for the active tab.
 */
function schemaFor(tab) {
	const isHover = tab === 'hover';
	const textPath = isHover ? 'tokens.button-text-hover' : 'tokens.button-text';
	const bgPath = isHover ? 'tokens.button-bg-hover' : 'tokens.button-bg';

	const colorPanel = {
		id: 'color',
		title: __('Color', 'kadence-blocks'),
		fields: [
			{ type: 'token-color-select', path: textPath, label: __('Text', 'kadence-blocks') },
			{ type: 'token-color-select', path: bgPath, label: __('Background', 'kadence-blocks') },
		],
	};

	if (isHover) {
		return { panels: [colorPanel] };
	}

	const radiusPanel = {
		id: 'border-and-shadow',
		title: __('Border and Shadow', 'kadence-blocks'),
		fields: [
			{
				type: 'radius',
				tokenType: 'dimension',
				role: 'radius',
				responsive: true,
				path: 'tokens.button-radius',
				label: __('Radius', 'kadence-blocks'),
			},
		],
	};

	return { panels: [colorPanel, radiusPanel] };
}

/**
 * The Button preset screen's whole configuration, passed to the generic preset machinery.
 *
 * `properties` is a getter rather than a snapshot: it re-reads `getButtonPresetProperties()` (and
 * therefore the localized feed) on every access, the same live-window-global posture every other
 * feed read in this app takes (see `getDesignTokensFeed()`). Snapshotting it at module-evaluation
 * time would throw for any test that imports this module before stubbing the feed, even one that
 * never touches `properties`.
 *
 * @since TBD
 */
export const BUTTON_PRESET = Object.freeze({
	block: BUTTON_BLOCK,
	get properties() {
		return getButtonPresetProperties();
	},
	slugBase: 'button',
	addLabel: __('Add Button', 'kadence-blocks'),
	newLabel: __('New Button', 'kadence-blocks'),
	tabs: TABS,
	className: 'kadence-blocks-style-library__button-screen',
	preview,
	renderPreview,
	schemaFor,
});
