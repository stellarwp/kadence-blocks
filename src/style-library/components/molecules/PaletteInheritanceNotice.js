/**
 * The notice above the swatch grid, stating how many of this palette's colors still take their
 * value from the palette they were built on, and what that means when that palette is edited.
 *
 * Stated once, in place, rather than behind a tooltip on each card: inheritance is the state of
 * every card here, and a hint that only pays off for a user who already suspects something is not
 * an explanation.
 */

/**
 * WordPress dependencies
 */
import { _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './PaletteInheritanceNotice.scss';

/**
 * Render the palette inheritance notice.
 *
 * @param {Object} props             The component props.
 * @param {number} props.count       How many colors still follow the source palette.
 * @param {string} props.sourceLabel The source palette's display label.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The notice, or null when nothing is inherited.
 */
export function PaletteInheritanceNotice({ count, sourceLabel }) {
	if (count < 1 || !sourceLabel) {
		return null;
	}

	return (
		<p className="kadence-blocks-style-library__palette-inheritance-notice" role="status">
			{sprintf(
				/* translators: 1: number of colors, 2: the source palette's name. */
				_n(
					'%1$d color in this palette still follows %2$s. Editing it in %2$s updates it here too, until you customize it.',
					'%1$d colors in this palette still follow %2$s. Editing them in %2$s updates them here too, until you customize them.',
					count,
					'kadence-blocks'
				),
				count,
				sourceLabel
			)}
		</p>
	);
}
