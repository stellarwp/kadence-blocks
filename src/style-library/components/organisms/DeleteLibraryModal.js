/**
 * The header's destructive library action: a red "Delete" text link and its confirmation modal.
 * Always targets the active library. Copy branches on whether the target is the default
 * library — deleting it resets its token values to baseline instead of removing it, and the
 * confirmation must say so honestly rather than presenting a removal that will not happen.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { isDefaultLibrary, libraryDisplayTitle } from '../../helpers/libraries';
import './DeleteLibraryModal.scss';

/**
 * Render the delete/reset action and its confirmation modal.
 *
 * @param {Object}              props             The component props.
 * @param {string}              props.activeSlug  The active library slug, the delete target.
 * @param {string}              props.activeTitle The active library's display title.
 * @param {boolean}             props.isBusy      Whether a library operation is in flight.
 * @param {?{message: string}} props.error         The current delete error, if any.
 * @param {Function}            props.onClearError Dismisses the current delete error.
 * @param {Function}            props.onDelete     Called with the active slug to delete/reset it.
 *
 * @since TBD
 *
 * @return {JSX.Element} The delete action and, when open, its modal.
 */
export function DeleteLibraryModal({ activeSlug, activeTitle, isBusy, error, onClearError, onDelete }) {
	const [isOpen, setIsOpen] = useState(false);
	const isDefault = isDefaultLibrary(activeSlug);
	const label = libraryDisplayTitle({ slug: activeSlug, title: activeTitle ?? '' });
	const restingLabel = isDefault ? __('Reset', 'kadence-blocks') : __('Delete', 'kadence-blocks');
	// The progressive form of restingLabel — the only progress indication while the request is in
	// flight; there is no spinner alongside it.
	const pendingLabel = isDefault ? __('Resetting…', 'kadence-blocks') : __('Deleting…', 'kadence-blocks');

	// Closes the modal and clears its own error, whether that is a confirmed delete, a Cancel
	// click, or the Modal's own dismiss paths (Escape, click-outside) — all of which are already
	// gated off while `isBusy`, so this never fires mid-request. Clearing here (not just on the
	// next open) keeps a past failure from resurfacing anywhere else the delete error is read.
	const handleClose = () => {
		setIsOpen(false);
		onClearError();
	};

	// Deleting the active library (the only target this modal ever offers) resolves in place —
	// the hook refreshes the feed for whatever library ends up active rather than reloading the
	// page — so this modal has to close itself explicitly once that settles; nothing else will.
	// `.catch` deliberately does nothing beyond swallowing the promise rejection — a failed delete
	// already re-set `isBusy`/`error` in the hook, and staying open (not calling handleClose at
	// all) is exactly the "do not close" behavior a caught rejection gives here for free.
	const handleConfirm = () => {
		onDelete(activeSlug)
			.then(() => handleClose())
			.catch(() => {});
	};

	return (
		<>
			<Button
				variant="link"
				isDestructive
				disabled={isBusy}
				onClick={() => setIsOpen(true)}
				className="kadence-blocks-style-library__delete-library-action"
			>
				{__('Delete', 'kadence-blocks')}
			</Button>
			{isOpen && (
				<Modal
					title={isDefault ? __('Reset Library', 'kadence-blocks') : __('Delete Library', 'kadence-blocks')}
					className="kadence-blocks-style-library__delete-library-modal"
					onRequestClose={handleClose}
					// Locked while pending: no close icon, Escape does nothing, clicking outside does
					// nothing. A user hammering Escape mid-request must not be able to walk away from
					// (or re-trigger) a delete that is still in flight.
					isDismissible={!isBusy}
					shouldCloseOnEsc={!isBusy}
					shouldCloseOnClickOutside={!isBusy}
				>
					{error && (
						<Notice status="error" isDismissible={false}>
							{error.message}
						</Notice>
					)}
					<p>
						{isDefault
							? sprintf(
									// translators: %s: the default library's display title.
									__(
										"Reset '%s' to its default values?",
										'kadence-blocks'
									),
									label
								)
							: sprintf(
									// translators: %s: the library's display title.
									__(
										"Delete '%s'? Its tokens and presets are removed permanently.",
										'kadence-blocks'
									),
									label
								)}
					</p>
					<div className="kadence-blocks-style-library__delete-library-modal-actions">
						<Button variant="tertiary" onClick={handleClose} disabled={isBusy}>
							{__('Cancel', 'kadence-blocks')}
						</Button>
						<Button variant="primary" isDestructive disabled={isBusy} onClick={handleConfirm}>
							{isBusy ? pendingLabel : restingLabel}
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
}
