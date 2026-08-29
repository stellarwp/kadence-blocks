/**
 * The header's "Rename" action and its modal for palettes, mirroring `RenameLibraryModal`: a
 * single label field over the palette being edited, seeded with its current label.
 *
 * Unlike Delete, Rename is available on the default palette too — the server only refuses
 * DELETING it, not relabeling it.
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
import { isDuplicatePaletteLabel } from '../../helpers/palettes';
import './RenamePaletteModal.scss';

/**
 * Render the rename action and, when open, its modal.
 *
 * @param {Object}             props              The component props.
 * @param {string}             props.id           The palette to rename (the one being edited).
 * @param {string}             props.currentLabel That palette's current display label.
 * @param {Object}             props.listing      The palette listing (`{ palettes }`), for the duplicate-label check.
 * @param {boolean}            props.isBusy       Whether a palette operation is in flight.
 * @param {?{message: string}} props.error        The current rename error, if any.
 * @param {Function}           props.onClearError Dismisses the current rename error.
 * @param {Function}           props.onRename     Called with the id and the new label.
 *
 * @since TBD
 *
 * @return {JSX.Element} The action and, when open, its modal.
 */
export function RenamePaletteModal({ id, currentLabel, listing, isBusy, error, onClearError, onRename }) {
	const [isOpen, setIsOpen] = useState(false);
	// Seeded from the current label so the common edit — fixing a typo — starts from the text
	// being fixed rather than an empty field.
	const [label, setLabel] = useState(currentLabel);

	const trimmed = label.trim();
	const isDuplicate = isDuplicatePaletteLabel(trimmed, listing, id);
	const isUnchanged = trimmed === currentLabel.trim();

	const handleOpen = () => {
		setLabel(currentLabel);
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
		onRename(id, trimmed)
			.then(() => handleClose())
			.catch(() => {});
	};

	const canSave = !isBusy && trimmed !== '' && !isDuplicate && !isUnchanged;

	const handleSubmit = (event) => {
		event.preventDefault();

		if (canSave) {
			handleConfirm();
		}
	};

	return (
		<>
			<Button
				variant="tertiary"
				disabled={isBusy}
				onClick={handleOpen}
				className="kadence-blocks-style-library__rename-palette-action"
			>
				{__('Rename', 'kadence-blocks')}
			</Button>
			{isOpen && (
				<Modal
					title={__('Rename Palette', 'kadence-blocks')}
					className="kadence-blocks-style-library__rename-palette-modal"
					onRequestClose={handleClose}
					// Locked while pending, like every other palette modal.
					isDismissible={!isBusy}
					shouldCloseOnEsc={!isBusy}
					shouldCloseOnClickOutside={!isBusy}
				>
					<form onSubmit={handleSubmit}>
						{error && (
							<Notice status="error" isDismissible={false}>
								{error.message}
							</Notice>
						)}
						<TextControl
							label={__('Palette name', 'kadence-blocks')}
							value={label}
							onChange={setLabel}
							disabled={isBusy}
							help={
								isDuplicate
									? sprintf(
											// translators: %s: the palette name the user typed.
											__('A palette named "%s" already exists.', 'kadence-blocks'),
											trimmed
										)
									: undefined
							}
						/>
						<div className="kadence-blocks-style-library__rename-palette-modal-actions">
							<Button type="button" variant="tertiary" onClick={handleClose} disabled={isBusy}>
								{__('Cancel', 'kadence-blocks')}
							</Button>
							<Button
								type="submit"
								variant="primary"
								// Unchanged is disabled alongside empty and duplicate: a rename to the same label
								// would spend a request to change nothing.
								disabled={!canSave}
							>
								{isBusy ? __('Saving…', 'kadence-blocks') : __('Save', 'kadence-blocks')}
							</Button>
						</div>
					</form>
				</Modal>
			)}
		</>
	);
}
