/**
 * The Border Radius screen: the scale config, the rounded-square preview renderer, and the two thin
 * wrappers that plug into the shared `ScaleScreen`/`ScaleSettings` contract (see
 * `.local/style-library-reference.md`). No link/unlink-corners control — a `dimension` token stores
 * one scalar; per-corner composition happens where tokens are consumed (the preset `box-sides`
 * field), not here.
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
import './BorderRadiusScreen.scss';

/**
 * The rounded-square preview for one row: a fixed-size box (sized by the shared `ListRow` preview
 * slot) whose corner radius is the row's own resolved value — `9999px` renders the FULL circle and
 * `0` renders square, both for free, with no per-step branching.
 *
 * @param {{id: string, label: string, value: string, userCreated: boolean}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderRadiusPreview(row) {
	return <span className="kadence-blocks-style-library__border-radius-preview" style={{ borderRadius: row.value }} />;
}

/**
 * The Border Radius screen's config — see `ScaleScreen`'s module docblock and
 * `.local/style-library-reference.md` for the full per-screen config contract.
 *
 * @since TBD
 */
export const BORDER_RADIUS_CONFIG = {
	id: 'border-radius',
	title: __('Corner Radius', 'kadence-blocks'),
	addLabel: __('Add Border Radius', 'kadence-blocks'),
	group: __('Border Radius', 'kadence-blocks'),
	groupKey: 'border-radius',
	tokenType: 'dimension',
	slugBase: 'radius',
	newTokenLabel: __('New Radius', 'kadence-blocks'),
	newTokenValue: '0.5rem',
	valueField: {
		type: 'unit',
		label: __('Radius', 'kadence-blocks'),
		units: [
			{ value: 'px', label: 'px' },
			{ value: 'em', label: 'em' },
			{ value: 'rem', label: 'rem' },
			{ value: '%', label: '%' },
		],
	},
	renderPreview: renderRadiusPreview,
};

/**
 * The Border Radius screen body.
 *
 * @param {Object} props The props `ScaleScreen` accepts (`{ label, route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen.
 */
export function BorderRadiusScreen(props) {
	return <ScaleScreen config={BORDER_RADIUS_CONFIG} {...props} />;
}

/**
 * The Border Radius screen's settings panel.
 *
 * @param {Object} props The props `ScaleSettings` accepts (`{ route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel.
 */
function BorderRadiusSettings(props) {
	return <ScaleSettings config={BORDER_RADIUS_CONFIG} {...props} />;
}

BorderRadiusScreen.SettingsPanel = BorderRadiusSettings;
