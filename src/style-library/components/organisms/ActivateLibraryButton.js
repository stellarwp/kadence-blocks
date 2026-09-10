/**
 * The header's "Set as active" affordance and its confirmation modal, owning its own open state
 * the way `DeleteLibraryModal` owns its trigger.
 *
 * Renders nothing while the library being edited is already the active one — there is no action to
 * offer, and the selector's own check icon already marks which library the site is live with, so a
 * second "Active" label here would only repeat it.
 */

/**
 * WordPress dependencies
 */
import { Button, Tooltip } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ActivateLibraryModal } from './ActivateLibraryModal';
import './ActivateLibraryButton.scss';

/**
 * What activating a library does, shown before the click. The confirmation modal says the same
 * thing after it, naming both libraries; this is the version that reads with no names in it.
 *
 * @since TBD
 */
const ACTIVATE_HINT = __(
	'Makes this library the one your site uses. Your site switches to its colors, sizes and styles.',
	'kadence-blocks'
);

/**
 * Render the activate action and, when open, its confirmation modal.
 *
 * @param {Object}             props                 The component props.
 * @param {string}             props.editingSlug     The library the app is showing, and the activation target.
 * @param {string}             props.editingTitle    That library's display title.
 * @param {string}             props.activeTitle     The display title of the library the site uses now.
 * @param {boolean}            props.isEditingActive Whether the library being edited is already the active one.
 * @param {boolean}            props.isBusy          Whether a library operation is in flight.
 * @param {?{message: string}} props.error           The current activation error, if any.
 * @param {Function}           props.onClearError    Dismisses the current activation error.
 * @param {Function}           props.onActivate      Called with a slug to make that library active.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The action and, while open, its modal — or null when the library being
 *                         edited is already active.
 */
export function ActivateLibraryButton({
	editingSlug,
	editingTitle,
	activeTitle,
	isEditingActive,
	isBusy,
	error,
	onClearError,
	onActivate,
}) {
	const [isOpen, setIsOpen] = useState(false);

	if (isEditingActive) {
		return null;
	}

	// Closes the modal and clears its own error, whether that is a confirmed activation, a Cancel
	// click, or the Modal's own dismiss paths (Escape, click-outside) — all of which are already
	// gated off while `isBusy`, so this never fires mid-request.
	const handleClose = () => {
		setIsOpen(false);
		onClearError();
	};

	// The modal closes only once the pointer has actually moved. `.catch` deliberately does nothing
	// beyond swallowing the rejection — a failed activation already re-set `isBusy`/`error` in the
	// hook, and staying open is exactly the behavior a caught rejection gives here for free.
	const handleConfirm = () => {
		onActivate(editingSlug)
			.then(() => handleClose())
			.catch(() => {});
	};

	return (
		<>
			<Tooltip text={ACTIVATE_HINT}>
				<Button
					variant="secondary"
					disabled={isBusy}
					onClick={() => setIsOpen(true)}
					className="kadence-blocks-style-library__activate-library-action"
				>
					{__('Set as active', 'kadence-blocks')}
				</Button>
			</Tooltip>
			{isOpen && (
				<ActivateLibraryModal
					currentTitle={activeTitle}
					nextTitle={editingTitle}
					isBusy={isBusy}
					error={error}
					onClose={handleClose}
					onConfirm={handleConfirm}
				/>
			)}
		</>
	);
}
