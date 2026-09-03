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
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BUTTON_MARGIN_FALLBACK, BUTTON_PADDING_FALLBACK } from '../../token-controls/helpers/button-box-defaults';
import { BUTTON_BLOCK, getPresetProperties, resolveTokenValue } from '../helpers/presets';
import { capBoxSides } from '../helpers/preview';

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
 * The most preview padding or margin any one side may show. Smaller than the image preview's cap
 * because the chip sits inside a list row rather than standing alone as a tile — the spacing scale
 * runs to 10rem, and an uncapped top-step preset would make its row taller than the screen.
 *
 * @since TBD
 */
const BOX_PREVIEW_CAP = '2rem';

/**
 * Build a row's preview from its stored tokens.
 *
 * The shape is this block's own: every resting-state property the chip can draw — background,
 * text color, radius, the border trio, shadow, padding, and margin — plus a nested `hover` map
 * of the state the chip swaps to on interaction (see `renderPreview`). Another block's rows
 * would preview something else entirely, which is why the generic row mapper takes this as a
 * function rather than reading fixed keys.
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
 * @return {{background: string, color: string, borderRadius: string, borderWidth: string, borderStyle: string, borderColor: string, shadow: string, padding: string, margin: string, hover: {background: string, color: string, borderRadius: string, borderWidth: string, borderStyle: string, borderColor: string, shadow: string}}} The preview.
 */
function preview(tokens, values, breakpoint) {
	return {
		background: resolveTokenValue(values, tokens['button-bg'], breakpoint),
		color: resolveTokenValue(values, tokens['button-text'], breakpoint),
		borderRadius: resolveTokenValue(values, tokens['button-radius'], breakpoint),
		borderWidth: resolveTokenValue(values, tokens['button-border-width'], breakpoint),
		borderStyle: resolveTokenValue(values, tokens['button-border-style'], breakpoint),
		borderColor: resolveTokenValue(values, tokens['button-border-color'], breakpoint),
		shadow: resolveTokenValue(values, tokens['button-shadow'], breakpoint),
		padding: resolveTokenValue(values, tokens['button-padding'], breakpoint),
		margin: resolveTokenValue(values, tokens['button-margin'], breakpoint),
		// No hover padding/margin: the block binds no hover counterpart for either, so the chip's
		// box never changes between states. The hover border trio's key order is the block's own —
		// `button-border-hover-width`, not `button-border-width-hover` (see `declarations.php`).
		hover: {
			background: resolveTokenValue(values, tokens['button-bg-hover'], breakpoint),
			color: resolveTokenValue(values, tokens['button-text-hover'], breakpoint),
			borderRadius: resolveTokenValue(values, tokens['button-radius-hover'], breakpoint),
			borderWidth: resolveTokenValue(values, tokens['button-border-hover-width'], breakpoint),
			borderStyle: resolveTokenValue(values, tokens['button-border-hover-style'], breakpoint),
			borderColor: resolveTokenValue(values, tokens['button-border-hover-color'], breakpoint),
			shadow: resolveTokenValue(values, tokens['button-shadow-hover'], breakpoint),
		},
	};
}

/**
 * The live preview chip: a span reading "Button", styled from the row's resolved styles —
 * background, text, radius, border, shadow, padding, and margin. While the pointer is over the
 * chip (or `row.showHoverState` is set, which the screen does for the row whose panel is on the
 * Hover tab), each style swaps to the preset's resolved hover value, per property: an unset hover
 * value keeps the resting style, exactly what a real button whose preset stores no hover override
 * does. An unresolved value renders the property absent rather than an invented fallback, leaving
 * the stylesheet's chip defaults in charge (so a preset that sets only a border color still
 * previews it: the stylesheet's transparent `1px solid` border supplies the width and style).
 * Padding and margin are capped per side (see `capBoxSides`) so an extreme preset cannot make its
 * list row enormous; neither has a hover-bound counterpart, so the chip's box never changes
 * between states.
 *
 * Styled by `components/pages/ButtonScreen.scss`, which also carries this screen's other overrides
 * and is imported there.
 *
 * @param {Object} props     The component props.
 * @param {Object} props.row The row descriptor (`{id, label, preview, showHoverState?}`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The chip.
 */
function ButtonPresetPreviewChip({ row }) {
	const [isHovered, setIsHovered] = useState(false);

	const resting = row.preview;
	const hover = resting.hover ?? {};
	const showHover = isHovered || row.showHoverState === true;
	const styleFor = (base, hovered) => (showHover && hovered ? hovered : base) || undefined;

	return (
		<span
			className="kadence-blocks-style-library__button-preset-preview"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				background: styleFor(resting.background, hover.background),
				color: styleFor(resting.color, hover.color),
				borderRadius: styleFor(resting.borderRadius, hover.borderRadius),
				borderWidth: styleFor(resting.borderWidth, hover.borderWidth),
				borderStyle: styleFor(resting.borderStyle, hover.borderStyle),
				borderColor: styleFor(resting.borderColor, hover.borderColor),
				boxShadow: styleFor(resting.shadow, hover.shadow),
				padding: capBoxSides(resting.padding, BOX_PREVIEW_CAP),
				margin: capBoxSides(resting.margin, BOX_PREVIEW_CAP),
			}}
		>
			{__('Button', 'kadence-blocks')}
		</span>
	);
}

/**
 * The row's preview slot: the generic row mapper calls this as a plain function, so it stays one —
 * the hover state lives inside `ButtonPresetPreviewChip`, which needs to be a component to hold it.
 *
 * @param {{id: string, label: string, preview: Object, showHoverState?: boolean}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	return <ButtonPresetPreviewChip row={row} />;
}

/**
 * The per-tab settings schema: the Normal tab adds a Border and Shadow section and the Hover tab
 * never does. The block does bind hover counterparts for radius, border, and shadow — `preview()`
 * above resolves `button-radius-hover`, the hover border trio, and `button-shadow-hover`, and the
 * chip already previews them — but the Hover tab only offers the color pair today; that is a
 * scope decision, not a `guard_surface` restriction, and offering the other fields is a separate
 * schema decision. The preset name is not here; it is tab-independent and comes from
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
			{ type: 'color-select', path: textPath, label: __('Text', 'kadence-blocks') },
			{ type: 'color-select', path: bgPath, label: __('Background', 'kadence-blocks') },
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
				// A base path, not a stored key: PHP declares `button-border-width`/`-style`/`-color` as
				// three separate bound properties, so `BorderField` derives and reads/writes the three
				// sibling keys `${path}-width` / `-style` / `-color` itself rather than one composite value
				// living at this path.
				path: 'tokens.button-border',
				label: __('Border', 'kadence-blocks'),
				// `BorderControl` only takes one `defaultValue` for its width axis (color/style have no
				// equivalent fallback prop) — `semantic.border-width.default`'s shipped resolution, the
				// value `var(--kb-btn-border-width)` computes to today. Shown muted when the field is
				// unset, the same way Radius/Padding/Margin's `defaultValue` above are.
				defaultValue: '1px',
			},
			{
				type: 'box-shadow',
				path: 'tokens.button-shadow',
				label: __('Shadow', 'kadence-blocks'),
				// No `defaultValue`: a button renders no shadow of its own when the preset sets none, so
				// there is no literal to name — the control's own bare muted "Default" already says that.
				// (`BoxShadowControl` does now read a `defaultValue`, so one can be added here the day a
				// button grows a built-in shadow.)
			},
		],
	};

	// Normal only: the block binds no hover counterpart for padding or margin, so a field on the
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
				// What `advancedbtn`'s style.scss gives a standard fill button, so an unset field shows the
				// padding the button actually renders. Only the base case is named: the size and outline
				// variants compute their own, and the preset deliberately stores nothing until a user sets it.
				defaultValue: BUTTON_PADDING_FALLBACK,
			},
			{
				type: 'spacing',
				tokenType: 'dimension',
				role: 'spacing',
				responsive: true,
				path: 'tokens.button-margin',
				label: __('Margin', 'kadence-blocks'),
				// The button carries no margin of its own, which is a real answer rather than an absent one.
				defaultValue: BUTTON_MARGIN_FALLBACK,
			},
		],
	};

	return { panels: [colorPanel, borderAndShadowPanel, spacingPanel] };
}

/**
 * The Button preset screen's whole configuration, passed to the generic preset machinery.
 *
 * `properties` is a getter rather than a snapshot: it re-reads `getPresetProperties()` (and
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
		return getPresetProperties(BUTTON_BLOCK);
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
