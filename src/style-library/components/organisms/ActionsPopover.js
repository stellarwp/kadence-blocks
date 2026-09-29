/**
 * A pencil button that opens a popover under it: the shell for "edit this thing" actions. Generic:
 * it knows the button and the popover, not what goes inside, which the caller renders through
 * `children`.
 */

/**
 * WordPress dependencies
 */
import { Button, Dropdown } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { pencil } from '../../icons';
import './ActionsPopover.scss';

// The same gap the select dropdown leaves under its own toggle; pixels because `Popover` hands
// `offset` to its positioning library, which works in pixels.
const POPOVER_OFFSET = 16;

/**
 * Render the pencil and, while open, its popover.
 *
 * @param {Object}   props             The component props.
 * @param {string}   props.label       The pencil's accessible name and tooltip (e.g. "Edit library").
 * @param {boolean}  props.isBusy      Whether an operation is in flight, which disables the pencil.
 * @param {Function} [props.onClose]   Called whenever the popover closes, by any route.
 * @param {Function} props.children    Called with `{ close }`; returns the popover's content.
 *
 * @since TBD
 *
 * @return {JSX.Element} The pencil and its popover.
 */
export function ActionsPopover({ label, isBusy, onClose, children }) {
	return (
		<Dropdown
			className="kadence-blocks-style-library__actions-popover"
			contentClassName="kadence-blocks-style-library__actions-popover-content"
			popoverProps={{ placement: 'bottom-start', offset: POPOVER_OFFSET }}
			onClose={onClose}
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					className="kadence-blocks-style-library__actions-popover-toggle"
					icon={pencil}
					label={label}
					aria-expanded={isOpen}
					disabled={isBusy}
					onClick={onToggle}
				/>
			)}
			renderContent={({ onClose: close }) => children({ close })}
		/>
	);
}
