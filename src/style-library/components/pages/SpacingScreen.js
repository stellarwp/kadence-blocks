/**
 * The Spacing screen: the scale config, the value-sized square preview renderer, and the two thin
 * wrappers that plug into the shared `ScaleScreen`/`ScaleSettings` contract (see
 * `.local/style-library-reference.md`). The `Spacing` group is already declared in
 * `declarations.php` (its steps each carry a `kb_spacing_slot` projection, so a value edited here
 * changes every block that already stores that slug) — this screen only lists and edits it.
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
import './SpacingScreen.scss';

/**
 * The value-sized square preview for one row: a `div` sized inline to the row's own resolved
 * value, clamped by the stylesheet at `6rem` so the largest steps pin rather than blowing up the
 * row — an empty or zero value degrades to a collapsed square, the honest rendering.
 *
 * @param {{id: string, label: string, value: string, userCreated: boolean}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderSpacingPreview(row) {
	return (
		<div
			className="kadence-blocks-style-library__spacing-preview"
			style={{ width: row.value, height: row.value }}
		/>
	);
}

/**
 * The Spacing screen's config — see `ScaleScreen`'s module docblock and
 * `.local/style-library-reference.md` for the full per-screen config contract.
 *
 * @since TBD
 */
export const SPACING_CONFIG = {
	id: 'spacing',
	title: __('Spacing', 'kadence-blocks'),
	addLabel: __('Add Spacing', 'kadence-blocks'),
	group: __('Spacing', 'kadence-blocks'),
	groupKey: 'spacing',
	tokenType: 'dimension',
	slugBase: 'spacing',
	newTokenLabel: __('New Spacing', 'kadence-blocks'),
	newTokenValue: '2rem',
	valueField: {
		type: 'unit',
		label: __('Spacing', 'kadence-blocks'),
		units: [
			{ value: 'px', label: 'px' },
			{ value: 'em', label: 'em' },
			{ value: 'rem', label: 'rem' },
			{ value: 'vh', label: 'vh' },
			{ value: 'vw', label: 'vw' },
		],
		responsive: true,
	},
	renderPreview: renderSpacingPreview,
};

/**
 * The Spacing screen body.
 *
 * @param {Object} props The props `ScaleScreen` accepts (`{ label, route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen.
 */
export function SpacingScreen(props) {
	return <ScaleScreen config={SPACING_CONFIG} {...props} />;
}

/**
 * The Spacing screen's settings panel.
 *
 * @param {Object} props The props `ScaleSettings` accepts (`{ route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel.
 */
function SpacingSettings(props) {
	return <ScaleSettings config={SPACING_CONFIG} {...props} />;
}

SpacingScreen.SettingsPanel = SpacingSettings;
