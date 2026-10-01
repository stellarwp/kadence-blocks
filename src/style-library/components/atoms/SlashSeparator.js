/**
 * A decorative `/` set between a title and the control that scopes it (e.g. "Style Library /
 * Your Library"). It carries no size of its own: the separator has to match a neighboring title
 * that is its sibling, not its parent, so the caller sizes it through `className`.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './SlashSeparator.scss';

/**
 * Render the slash separator.
 *
 * @param {Object} props             The component props.
 * @param {string} [props.className] Extra class names, used by the caller to set the font size.
 *
 * @since TBD
 *
 * @return {JSX.Element} The separator.
 */
export function SlashSeparator({ className }) {
	return (
		<span className={classnames('kadence-blocks-style-library__slash-separator', className)} aria-hidden="true">
			/
		</span>
	);
}
