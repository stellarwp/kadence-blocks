/**
 * A text link that trails a swatch list and opens the caller's add flow. Like `AddTile`, it starts
 * no flow itself — it only reports the click.
 */

/**
 * WordPress dependencies
 */
import { Icon, plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './AddLink.scss';

/**
 * Render the add link.
 *
 * @param {Object}   props            The component props.
 * @param {string}   props.label      The link's label (e.g. 'Add color') — no literal `+`, the icon
 *                                    already draws one.
 * @param {Function} props.onClick    Called when the link is clicked.
 * @param {boolean}  [props.disabled] Whether the link is disabled — a double-click guard for the
 *                                    duration of its own in-flight add.
 *
 * @since TBD
 *
 * @return {JSX.Element} The add link.
 */
export function AddLink({ label, onClick, disabled = false }) {
	return (
		<button
			type="button"
			className="kadence-blocks-style-library__add-link"
			onClick={onClick}
			disabled={disabled}
			aria-disabled={disabled}
		>
			<Icon icon={plus} className="kadence-blocks-style-library__add-link-icon" />
			<span>{label}</span>
		</button>
	);
}
