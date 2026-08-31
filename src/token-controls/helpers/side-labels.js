/**
 * The translated name of a border side.
 *
 * `BorderControl` is what names its rows — it is the control that hands a row's bare side key
 * (`top`, `right`, `bottom`, `left`) to `renderColor` as `label` in the first place (see
 * `BorderControl.js`) — so the side vocabulary belongs here rather than in either host's own color
 * field, and both hosts (the block editor's `border-color.js`, the Style Library's `BorderField.js`)
 * translate a row's side name through the same function instead of drifting into two.
 *
 * Those keys are display text, not just object keys, once a row names itself in a locale other than
 * English, so capitalizing the raw key leaves it in English. The four are spelled out here per side
 * rather than derived because they are a closed set and a translator needs the whole phrase in front
 * of them to render "Top Border Color" naturally in a language that orders it differently.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * The translated name of one border side.
 *
 * @param {string} side The side key: `top`, `right`, `bottom` or `left`.
 *
 * @since TBD
 *
 * @return {string} The translated side name, or the key itself when it is not one of the four.
 */
export function sideLabel(side) {
	const names = {
		top: __('Top', 'kadence-blocks'),
		right: __('Right', 'kadence-blocks'),
		bottom: __('Bottom', 'kadence-blocks'),
		left: __('Left', 'kadence-blocks'),
	};

	return names[side] ?? side;
}
