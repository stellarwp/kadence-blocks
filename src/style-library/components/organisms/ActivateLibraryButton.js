/**
 * The header's "Set as active" affordance and its confirmation modal, owning its own open state
 * the way `DeleteLibraryModal` owns its trigger.
 *
 * Renders one of two things, never nothing: the button while the library being edited is not the
 * active one, and a static "Active" indicator while it is. Collapsing the slot instead would
 * reflow the header every time the user opens a different library, and would leave the most
 * important fact about the current screen — whether these edits are live — unstated.
 */

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ActivateLibraryModal } from './ActivateLibraryModal';
import './ActivateLibraryButton.scss';

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
 * @return {JSX.Element} The action or the indicator, plus the modal while open.
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
		return (
			<span className="kadence-blocks-style-library__active-library-indicator">
				{__('Active', 'kadence-blocks')}
			</span>
		);
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
			<Button
				variant="secondary"
				disabled={isBusy}
				onClick={() => setIsOpen(true)}
				className="kadence-blocks-style-library__activate-library-action"
			>
				{__('Set as active', 'kadence-blocks')}
			</Button>
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
