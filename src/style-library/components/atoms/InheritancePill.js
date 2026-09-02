/**
 * The one pill slot a swatch card carries under its value line, in either of its two states: a
 * static pill naming the palette the color still comes from, or the button that drops this
 * palette's own value and puts the color back on that source.
 *
 * Both states occupy the same slot, so a card either says where its value comes from or offers the
 * way back — never both, and never a slot that changes the card's height.
 *
 * Deliberately no icon and no tooltip: the pill's own words carry the meaning, and at this size a
 * glyph reads as a smudge.
 */

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './InheritancePill.scss';

/**
 * Render the inheritance pill.
 *
 * @param {Object}   props               The component props.
 * @param {string}   props.variant       `'inherited'` for the static pill naming another palette,
 *                                       `'default'` for the static pill on the default palette
 *                                       itself, `'reset'` for the button.
 * @param {string}   [props.sourceLabel] The display label of the palette the value comes from.
 * @param {string}   [props.swatchName]  The color's name, used only in the reset button's
 *                                       accessible name — the visible text stays "Reset" so a row
 *                                       of pills stays scannable.
 * @param {Function} [props.onReset]     Called when the reset button is clicked.
 * @param {boolean}  [props.isDisabled]  Whether this pill's action is unavailable right now.
 *
 * @since TBD
 *
 * @return {JSX.Element} The pill.
 */
export function InheritancePill({
	variant,
	sourceLabel = '',
	swatchName = '',
	onReset = () => {},
	isDisabled = false,
}) {
	if ('reset' === variant) {
		return (
			<button
				type="button"
				className="kadence-blocks-style-library__inheritance-pill kadence-blocks-style-library__inheritance-pill--reset"
				onClick={onReset}
				disabled={isDisabled}
				aria-label={sprintf(
					// translators: 1: the color's name, 2: the palette its value comes back from.
					__('Reset %1$s to %2$s', 'kadence-blocks'),
					swatchName,
					sourceLabel
				)}
			>
				{__('Reset', 'kadence-blocks')}
			</button>
		);
	}

	// On the default palette the pill is a statement, not a pointer: this color is the shipped one.
	// A fixed word, not `sourceLabel` — the default palette can be renamed, and a pill reading
	// "From Brand" on the palette named Brand would say it follows itself.
	if ('default' === variant) {
		return (
			<span className="kadence-blocks-style-library__inheritance-pill kadence-blocks-style-library__inheritance-pill--inherited">
				{__('Default', 'kadence-blocks')}
			</span>
		);
	}

	return (
		<span className="kadence-blocks-style-library__inheritance-pill kadence-blocks-style-library__inheritance-pill--inherited">
			{sprintf(
				// translators: %s: the palette this color's value comes from.
				__('From %s', 'kadence-blocks'),
				sourceLabel
			)}
		</span>
	);
}
