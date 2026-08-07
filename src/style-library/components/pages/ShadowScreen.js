/**
 * The Shadow screen: the scale config, the shadowed-square preview renderer, and the two thin
 * wrappers that plug into the shared `ScaleScreen`/`ScaleSettings` contract (see
 * `.local/style-library-reference.md`). The first consumer of the contract's composite value seam
 * (`parseValue`/`buildLeaf`) — the panel edits a six-field object (`ShadowField`, unchanged from the
 * scaffold work) while the feed and the backend deal in one CSS string and dimension-string
 * sub-fields; `helpers/shadow.js` is where that boundary is crossed.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ScaleScreen } from './ScaleScreen';
import { ScaleSettings } from './ScaleSettings';
import { buildShadowLeaf, parseShadowValue, shadowCss } from '../../helpers/shadow';
import './ShadowScreen.scss';

/**
 * The shadowed-square preview for one row: a 48px white square with clearance on every side (the
 * shared `ListRow` slot is unlocked to `overflow: visible` for this screen — see `ShadowScreen.scss`
 * — because a shadow is drawn *outside* its box, and the default framed slot clips it entirely).
 * `row.value` is either the feed's resolved CSS string or an overlaid draft object (the composite
 * case `overlayDraft` copies verbatim); `shadowCss()` accepts both. An empty or unresolved value
 * renders the square with no shadow — the honest rendering of what Save would write.
 *
 * @param {{id: string, label: string, value: string|Object, userCreated: boolean}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderShadowPreview(row) {
	return (
		<span className="kadence-blocks-style-library__shadow-preview" style={{ boxShadow: shadowCss(row.value) }} />
	);
}

/**
 * The Shadow screen's config — see `ScaleScreen`'s module docblock and
 * `.local/style-library-reference.md` for the full per-screen config contract. `formatValue` is set
 * to always return an empty string: the board's rows carry no value column at all, and `ListRow`
 * already renders no column for a falsy `value`.
 *
 * @since TBD
 */
export const SHADOW_CONFIG = {
	id: 'shadow',
	title: __('Shadow', 'kadence-blocks'),
	addLabel: __('Add Shadow', 'kadence-blocks'),
	group: __('Shadow', 'kadence-blocks'),
	groupKey: 'shadow',
	tokenType: 'shadow',
	slugBase: 'shadow',
	newTokenLabel: __('New Shadow', 'kadence-blocks'),
	// The MD seed, already in backend shape (dimension strings, no `inset` key) — `addScaleTokenFlow`
	// passes this straight into the create payload's `$value`.
	newTokenValue: { color: '#1717171f', offsetX: '0px', offsetY: '2px', blur: '8px', spread: '0px' },
	valueField: { type: 'shadow', label: __('Shadow', 'kadence-blocks') },
	formatValue: () => '',
	parseValue: parseShadowValue,
	buildLeaf: buildShadowLeaf,
	renderPreview: renderShadowPreview,
};

/**
 * The Shadow screen body.
 *
 * @param {Object} props The props `ScaleScreen` accepts (`{ label, route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen.
 */
export function ShadowScreen(props) {
	return <ScaleScreen config={SHADOW_CONFIG} {...props} />;
}

/**
 * The Shadow screen's settings panel.
 *
 * @param {Object} props The props `ScaleSettings` accepts (`{ route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel.
 */
function ShadowSettings(props) {
	return <ScaleSettings config={SHADOW_CONFIG} {...props} />;
}

ShadowScreen.SettingsPanel = ShadowSettings;
