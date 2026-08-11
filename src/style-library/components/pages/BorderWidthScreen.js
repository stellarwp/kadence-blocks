/**
 * The Border Width screen: the scale config, the bordered-square preview renderer, and the two thin
 * wrappers that plug into the shared `ScaleScreen`/`ScaleSettings` contract (see
 * `ScaleScreen.js`'s module docblock). No link/unlink control — a `dimension` token stores one
 * scalar; per-side border composition happens where tokens are consumed, not here.
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
import './BorderWidthScreen.scss';

/**
 * The bordered-square preview for one row: a fixed-size box (sized by the shared `ListRow` preview
 * slot) whose border is drawn at the row's own resolved width — a `0` or hairline value renders a
 * square with no visible border, which is the honest rendering of what the value writes.
 *
 * @param {{id: string, label: string, value: string, userCreated: boolean}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderBorderWidthPreview(row) {
	return (
		<span
			className="kadence-blocks-style-library__border-width-preview"
			style={{ borderStyle: 'solid', borderWidth: row.value }}
		/>
	);
}

/**
 * The Border Width screen's config — see `ScaleScreen`'s module docblock for the full per-screen
 * config contract.
 *
 * @since TBD
 */
export const BORDER_WIDTH_CONFIG = {
	id: 'border-width',
	title: __('Border', 'kadence-blocks'),
	addLabel: __('Add Border Width', 'kadence-blocks'),
	group: __('Border Width', 'kadence-blocks'),
	groupKey: 'border-width',
	tokenType: 'dimension',
	slugBase: 'border-width',
	newTokenLabel: __('New Border Width', 'kadence-blocks'),
	newTokenValue: '2px',
	valueField: {
		type: 'unit',
		label: __('Border', 'kadence-blocks'),
		units: [
			{ value: 'px', label: 'px' },
			{ value: 'em', label: 'em' },
			{ value: 'rem', label: 'rem' },
		],
	},
	renderPreview: renderBorderWidthPreview,
};

/**
 * The Border Width screen body.
 *
 * @param {Object} props The props `ScaleScreen` accepts (`{ label, route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen.
 */
export function BorderWidthScreen(props) {
	return <ScaleScreen config={BORDER_WIDTH_CONFIG} {...props} />;
}

/**
 * The Border Width screen's settings panel.
 *
 * @param {Object} props The props `ScaleSettings` accepts (`{ route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel.
 */
function BorderWidthSettings(props) {
	return <ScaleSettings config={BORDER_WIDTH_CONFIG} {...props} />;
}

BorderWidthScreen.SettingsPanel = BorderWidthSettings;
