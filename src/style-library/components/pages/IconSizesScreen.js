/**
 * The Icon Sizes screen: the scale config, the star preview renderer, and the two thin wrappers
 * that plug into the shared `ScaleScreen`/`ScaleSettings` contract (see `ScaleScreen.js`'s module
 * docblock). Two things make this screen genuinely different from its
 * siblings: the value column shows two dimensions for a one-dimension token (presentation-only,
 * via `iconSizeRowValue`), and the SIZE field restricts units to the ones
 * `Icon_Size_Adapter`'s px converter can actually round-trip.
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
import { iconSizeRowValue } from '../../helpers/icon-sizes';
import './IconSizesScreen.scss';

/**
 * The full-bleed star preview for one row: a hand-authored path drawn to touch its `0 0 24 24`
 * viewBox's edges, sized inline to the row's own resolved value. A `@wordpress/icons` glyph is
 * deliberately not used here — those glyphs fill only a fraction of their declared viewBox, and
 * this preview's entire job is showing the
 * icon *at the token's size*, which a partially-filled glyph would misrepresent. An empty or zero
 * value collapses the star — the honest rendering of what the value writes.
 *
 * @param {{id: string, label: string, value: string, userCreated: boolean}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderIconSizePreview(row) {
	return (
		<svg
			className="kadence-blocks-style-library__icon-size-preview"
			viewBox="0 0 24 24"
			style={{ width: row.value, height: row.value }}
			aria-hidden="true"
			focusable="false"
		>
			<path d="M12 0L14.69 8.29L23.41 8.29L16.36 13.42L19.05 21.71L12 16.58L4.95 21.71L7.64 13.42L0.59 8.29L9.31 8.29Z" />
		</svg>
	);
}

/**
 * The Icon Sizes screen's config — see `ScaleScreen`'s module docblock for the full per-screen
 * config contract.
 *
 * @since TBD
 */
export const ICON_SIZES_CONFIG = {
	id: 'icon-sizes',
	title: __('Icon Sizes', 'kadence-blocks'),
	addLabel: __('Add Icon Size', 'kadence-blocks'),
	group: __('Icon Sizes', 'kadence-blocks'),
	groupKey: 'icon-sizes',
	tokenType: 'dimension',
	slugBase: 'icon-size',
	newTokenLabel: __('New Icon Size', 'kadence-blocks'),
	newTokenValue: '1.5rem',
	// Restricted to the exact unit set `Converts_Number_To_Px::to_px()` accepts (px|rem|em) — a
	// value outside this domain would silently decouple `kadence/single-icon`'s default `size`
	// attribute from the token while every CSS-variable consumer kept following it, an
	// undiagnosable split-brain the UI must not offer.
	valueField: {
		type: 'unit',
		label: __('Size', 'kadence-blocks'),
		units: [
			{ value: 'px', label: 'px' },
			{ value: 'em', label: 'em' },
			{ value: 'rem', label: 'rem' },
		],
	},
	formatValue: (row) => iconSizeRowValue(row.value),
	renderPreview: renderIconSizePreview,
};

/**
 * The Icon Sizes screen body.
 *
 * @param {Object} props The props `ScaleScreen` accepts (`{ label, route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen.
 */
export function IconSizesScreen(props) {
	return <ScaleScreen config={ICON_SIZES_CONFIG} {...props} />;
}

/**
 * The Icon Sizes screen's settings panel.
 *
 * @param {Object} props The props `ScaleSettings` accepts (`{ route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel.
 */
function IconSizesSettings(props) {
	return <ScaleSettings config={ICON_SIZES_CONFIG} {...props} />;
}

IconSizesScreen.SettingsPanel = IconSizesSettings;
