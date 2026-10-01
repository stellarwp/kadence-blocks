/**
 * One row saying whether the thing being edited is the one the site uses, with the action to make
 * it so when it is not. Presentational and generic: every word comes from the caller, and it knows
 * nothing about how anything becomes active, only that `onActivate` starts that.
 */

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './ActivationRow.scss';

/**
 * Render the activation row.
 *
 * @param {Object}   props                   The component props.
 * @param {boolean}  props.isActive          Whether the thing being edited is already the active one.
 * @param {boolean}  props.isBusy            Whether an operation is in flight.
 * @param {Function} props.onActivate        Called when the user asks to make it active.
 * @param {Object}   props.labels            The row's texts.
 * @param {string}   props.labels.active     The status line while active.
 * @param {string}   props.labels.activeHint The sentence under it while active.
 * @param {string}   props.labels.inactive   The status line while not active.
 * @param {string}   props.labels.inactiveHint The sentence saying what activating does.
 * @param {string}   props.labels.action     The action button's text.
 *
 * @since TBD
 *
 * @return {JSX.Element} The row.
 */
export function ActivationRow({ isActive, isBusy, onActivate, labels }) {
	return (
		<div className="kadence-blocks-style-library__activation-row">
			<p className="kadence-blocks-style-library__activation-row-status">
				{isActive ? labels.active : labels.inactive}
			</p>
			<p className="kadence-blocks-style-library__activation-row-hint">
				{isActive ? labels.activeHint : labels.inactiveHint}
			</p>
			{!isActive && (
				<Button
					className="kadence-blocks-style-library__activation-row-action"
					variant="secondary"
					disabled={isBusy}
					onClick={onActivate}
				>
					{labels.action}
				</Button>
			)}
		</div>
	);
}
