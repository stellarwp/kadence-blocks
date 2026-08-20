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
import { getDesignTokensFeed } from '../helpers/tokens';

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
 * The button's per-side padding semantic token ids, top/right/bottom/left order — mirrors the CSS
 * `padding` shorthand and `src/blocks/advancedbtn/style.scss`'s default rule.
 *
 * @since TBD
 */
const BUTTON_PADDING_TOKEN_IDS = [
	'semantic.spacing.button-padding-top',
	'semantic.spacing.button-padding-right',
	'semantic.spacing.button-padding-bottom',
	'semantic.spacing.button-padding-left',
];

/**
 * The button's per-side margin semantic token ids, mirroring `BUTTON_PADDING_TOKEN_IDS`. Every side
 * resolves to the same literal in the shipped baseline, but the box control's own `toShorthand()`
 * already collapses four equal values to one when it renders the default (and expands them the
 * moment a site owner sets sides apart), so registering them per-side costs nothing today and leaves
 * room for that without a token-registry change later.
 *
 * @since TBD
 */
const BUTTON_MARGIN_TOKEN_IDS = [
	'semantic.spacing.button-margin-top',
	'semantic.spacing.button-margin-right',
	'semantic.spacing.button-margin-bottom',
	'semantic.spacing.button-margin-left',
];

/**
 * The literal each padding token resolves to when the baseline is never overridden — also what
 * `src/blocks/advancedbtn/style.scss`'s default rule falls back to when the token itself is absent
 * from the feed.
 *
 * @since TBD
 */
const BUTTON_PADDING_FALLBACK = ['0.4em', '1em', '0.4em', '1em'];

/**
 * The literal each margin token resolves to when the baseline is never overridden.
 *
 * @since TBD
 */
const BUTTON_MARGIN_FALLBACK = ['0', '0', '0', '0'];

/**
 * Resolve a per-side box default (padding/margin) from the resolved design-token feed, one value per
 * CSS side, falling back to the button's own literal default for any side whose token is missing from
 * the feed (e.g. the feed has not loaded yet).
 *
 * Reads the feed live on every call rather than once at import time: `BUTTON_PRESET` is
 * `Object.freeze()`d at module evaluation, before the localized feed is guaranteed to exist, so a
 * getter that captured this at that point could throw or go stale.
 *
 * @param {[string, string, string, string]} tokenIds The four semantic token ids, top/right/bottom/left order.
 * @param {[string, string, string, string]} fallback The literal fallback for each side, same order.
 *
 * @since TBD
 *
 * @return {[string, string, string, string]} The resolved per-side default.
 */
function resolveBoxDefault(tokenIds, fallback) {
	const values = getDesignTokensFeed()?.values ?? {};

	return tokenIds.map((tokenId, index) => values[tokenId] || fallback[index]);
}

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
 * The per-tab settings schema: the Normal tab adds a Border and Shadow section and the Hover tab
 * never does — `button-radius`/`button-border`/`button-shadow` have no hover counterpart, so
 * rendering them there would write a property `guard_surface` rejects. The preset name is not here;
 * it is tab-independent and comes from `presetNameSchema()`.
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

	const borderAndShadowPanel = {
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
				// The button's built-in corner radius — `advancedbtn`'s style.scss falls back to 3px, the
				// same value `semantic.radius.control` holds. Shown muted when the preset sets nothing, so a
				// reset field reports the radius the button really has rather than reading as empty.
				defaultValue: ['0.1875rem', '0.1875rem', '0.1875rem', '0.1875rem'],
			},
			{
				type: 'border',
				responsive: true,
				path: 'tokens.button-border',
				label: __('Border', 'kadence-blocks'),
			},
			{
				type: 'box-shadow',
				path: 'tokens.button-shadow',
				label: __('Shadow', 'kadence-blocks'),
			},
		],
	};

	// Normal only, like the radius panel: neither property has a hover counterpart, so a field on the
	// Hover tab would write something `guard_surface` rejects.
	const spacingPanel = {
		id: 'spacing',
		title: __('Spacing', 'kadence-blocks'),
		fields: [
			{
				type: 'spacing',
				tokenType: 'dimension',
				role: 'spacing',
				responsive: true,
				path: 'tokens.button-padding',
				label: __('Padding', 'kadence-blocks'),
				// What `advancedbtn`'s style.scss gives a standard fill button, resolved from the
				// semantic.spacing.button-padding-* tokens so an unset field shows the padding the button
				// actually renders (a site owner's override included). Only the base case is named: the size
				// and outline variants compute their own, and the preset deliberately stores nothing until a
				// user sets it.
				defaultValue: resolveBoxDefault(BUTTON_PADDING_TOKEN_IDS, BUTTON_PADDING_FALLBACK),
			},
			{
				type: 'spacing',
				tokenType: 'dimension',
				role: 'spacing',
				responsive: true,
				path: 'tokens.button-margin',
				label: __('Margin', 'kadence-blocks'),
				// The button carries no margin of its own, which is a real answer rather than an absent one,
				// resolved from the semantic.spacing.button-margin-* tokens the same way as padding above.
				defaultValue: resolveBoxDefault(BUTTON_MARGIN_TOKEN_IDS, BUTTON_MARGIN_FALLBACK),
			},
		],
	};

	return { panels: [colorPanel, borderAndShadowPanel, spacingPanel] };
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
