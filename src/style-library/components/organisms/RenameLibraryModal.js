/**
 * The header's "Rename" action and its modal: a single name field over the library being edited.
 *
 * Only the library's display name changes. Its slug — the identity the site's active-library
 * pointer and every REST route address it by — is fixed at creation and never rewritten, so a
 * rename is safe to do at any time and has no effect on stored token values.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { isDuplicateLibraryName } from '../../helpers/libraries';
import './RenameLibraryModal.scss';

/**
 * Render the rename action and, when open, its modal.
 *
 * @param {Object}             props              The component props.
 * @param {string}             props.slug         The library to rename (the one being edited).
 * @param {string}             props.currentTitle That library's current display title.
 * @param {Array<Object>}      props.libraries    The existing library rows, for the duplicate-name check.
 * @param {boolean}            props.isBusy       Whether a library operation is in flight.
 * @param {?{message: string}} props.error        The current rename error, if any.
 * @param {Function}           props.onClearError Dismisses the current rename error.
 * @param {Function}           props.onRename     Called with the slug and the new title.
 *
 * @since TBD
 *
 * @return {JSX.Element} The action and, when open, its modal.
 */
export function RenameLibraryModal({ slug, currentTitle, libraries, isBusy, error, onClearError, onRename }) {
	const [isOpen, setIsOpen] = useState(false);
	// Seeded from the current name so the common edit — fixing a typo — starts from the text being
	// fixed rather than an empty field.
	const [title, setTitle] = useState(currentTitle);

	const trimmed = title.trim();
	const isDuplicate = isDuplicateLibraryName(trimmed, libraries, slug);
	const isUnchanged = trimmed === currentTitle.trim();

	const handleOpen = () => {
		setTitle(currentTitle);
		setIsOpen(true);
	};

	// Closes and clears its own error, whether that is a completed rename, a Cancel click, or the
	// Modal's own dismiss paths — all already gated off while `isBusy`, so this never fires
	// mid-request.
	const handleClose = () => {
		setIsOpen(false);
		onClearError();
	};

	// `.catch` swallows the rejection only: a failure already landed in `error` via the hook, and
	// not closing is exactly what leaves the inline Notice on screen for the user to act on.
	const handleConfirm = () => {
		onRename(slug, trimmed)
			.then(() => handleClose())
			.catch(() => {});
	};

	return (
		<>
			<Button
				variant="tertiary"
				disabled={isBusy}
				onClick={handleOpen}
				className="kadence-blocks-style-library__rename-library-action"
			>
				{__('Rename', 'kadence-blocks')}
			</Button>
			{isOpen && (
				<Modal
					title={__('Rename Library', 'kadence-blocks')}
					className="kadence-blocks-style-library__rename-library-modal"
					onRequestClose={handleClose}
					// Locked while pending, like every other library modal.
					isDismissible={!isBusy}
					shouldCloseOnEsc={!isBusy}
					shouldCloseOnClickOutside={!isBusy}
				>
					{error && (
						<Notice status="error" isDismissible={false}>
							{error.message}
						</Notice>
					)}
					<TextControl
						label={__('Library title', 'kadence-blocks')}
						value={title}
						onChange={setTitle}
						disabled={isBusy}
						// Unlike creation, this compares against what libraries are actually *called*, not
						// against derived slugs: a slug is minted once at creation and never follows a
						// rename, so a slug-based check would refuse names nothing on screen is using.
						help={
							isDuplicate
								? sprintf(
										// translators: %s: the library name the user typed.
										__('A library named "%s" already exists.', 'kadence-blocks'),
										trimmed
									)
								: undefined
						}
					/>
					<div className="kadence-blocks-style-library__rename-library-modal-actions">
						<Button variant="tertiary" onClick={handleClose} disabled={isBusy}>
							{__('Cancel', 'kadence-blocks')}
						</Button>
						<Button
							variant="primary"
							// Unchanged is disabled alongside empty and duplicate: a rename to the same name
							// would spend a request and bump the library's version to change nothing.
							disabled={isBusy || trimmed === '' || isDuplicate || isUnchanged}
							onClick={handleConfirm}
						>
							{isBusy ? __('Saving…', 'kadence-blocks') : __('Save', 'kadence-blocks')}
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
}
