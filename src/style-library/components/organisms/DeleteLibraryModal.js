/**
 * The header's destructive library action: a red "Delete" text link and its confirmation modal.
 * Always targets the library being edited. Copy branches on whether the target is the default
 * library — deleting it resets its token values to baseline instead of removing it, and the
 * confirmation must say so honestly rather than presenting a removal that will not happen.
 *
 * Deleting the library the site is currently rendering with additionally requires naming its
 * successor. Without that, the server would drop the pointer back to the default library and the
 * user would discover a site-wide restyle they never chose, as a side effect of a cleanup. The
 * successor field starts empty and the confirm button stays disabled until it is answered — unless
 * only one library could succeed it, in which case the copy names that library and there is no
 * field, since a question with a single possible answer is friction rather than a safeguard.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { isDefaultLibrary, libraryDisplayTitle, successorOptions } from '../../helpers/libraries';
import './DeleteLibraryModal.scss';

/**
 * Render the delete/reset action and its confirmation modal.
 *
 * @param {Object}             props              The component props.
 * @param {string}             props.editingSlug  The library being edited, and the delete target.
 * @param {string}             props.editingTitle That library's display title.
 * @param {string}             props.activeSlug   The slug the site renders with.
 * @param {Array<Object>}      props.libraries    The existing library rows, for the successor list.
 * @param {boolean}            props.isBusy       Whether a library operation is in flight.
 * @param {?{message: string}} props.error        The current delete error, if any.
 * @param {Function}           props.onClearError Dismisses the current delete error.
 * @param {Function}           props.onDelete     Called with the target slug and, when required, the successor slug.
 *
 * @since TBD
 *
 * @return {JSX.Element} The delete action and, when open, its modal.
 */
export function DeleteLibraryModal({
	editingSlug,
	editingTitle,
	activeSlug,
	libraries,
	isBusy,
	error,
	onClearError,
	onDelete,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [successorSlug, setSuccessorSlug] = useState('');

	const isDefault = isDefaultLibrary(editingSlug);
	const label = libraryDisplayTitle({ slug: editingSlug, title: editingTitle ?? '' });

	// Only a real removal of the live library leaves the site without one. Resetting the default
	// keeps it in place and still active, so there is nothing to succeed it.
	const needsSuccessor = editingSlug === activeSlug && !isDefault;
	const successors = needsSuccessor ? successorOptions(libraries, editingSlug) : [];

	// With a single candidate there is nothing to decide — the site can only land in one place, so
	// asking would be a question with one answer. The consequence is still stated, naming that
	// library outright; what is dropped is the choosing, not the telling.
	//
	// This is reachable on most sites, not a corner case: the default library can never be deleted,
	// so any site with exactly two libraries hits it the moment it deletes the active one.
	const isSuccessorForced = needsSuccessor && successors.length === 1;
	// Read through rather than seeded into state on open: the libraries list arrives from its own
	// request, so a modal opened before it lands would otherwise keep a stale '' with no picker
	// rendered to correct it — a dead end with the confirm button disabled forever.
	const chosenSuccessor = isSuccessorForced ? successors[0].slug : successorSlug;

	const restingLabel = isDefault ? __('Reset', 'kadence-blocks') : __('Delete', 'kadence-blocks');
	// The progressive form of restingLabel — the only progress indication while the request is in
	// flight; there is no spinner alongside it.
	const pendingLabel = isDefault ? __('Resetting…', 'kadence-blocks') : __('Deleting…', 'kadence-blocks');

	const handleOpen = () => {
		// Reset per open, so a successor picked and then abandoned in an earlier attempt is never
		// silently reused by the next one.
		setSuccessorSlug('');
		setIsOpen(true);
	};

	// Closes the modal and clears its own error, whether that is a confirmed delete, a Cancel
	// click, or the Modal's own dismiss paths (Escape, click-outside) — all of which are already
	// gated off while `isBusy`, so this never fires mid-request. Clearing here (not just on the
	// next open) keeps a past failure from resurfacing anywhere else the delete error is read.
	const handleClose = () => {
		setIsOpen(false);
		onClearError();
	};

	// The flow resolves in place — the hook moves the feed to whatever library the app should land
	// on rather than reloading the page — so this modal has to close itself once that settles;
	// nothing else will. `.catch` deliberately does nothing beyond swallowing the promise
	// rejection: a failed delete already re-set `isBusy`/`error` in the hook, and staying open
	// (not calling handleClose at all) is exactly the "do not close" behavior a caught rejection
	// gives here for free.
	const handleConfirm = () => {
		onDelete(editingSlug, needsSuccessor ? chosenSuccessor : undefined)
			.then(() => handleClose())
			.catch(() => {});
	};

	return (
		<>
			<Button
				variant="link"
				isDestructive
				disabled={isBusy}
				onClick={handleOpen}
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
									__("Reset '%s' to its default values?", 'kadence-blocks'),
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
					{isSuccessorForced && (
						<p>
							{sprintf(
								// translators: %s: the library the site will use instead.
								__(
									'This is also your active library, so your site will use "%s" instead. Its colors, typography, spacing, and other styles go live across your site immediately — on the front end and in the editor.',
									'kadence-blocks'
								),
								libraryDisplayTitle(successors[0])
							)}
						</p>
					)}
					{needsSuccessor && !isSuccessorForced && (
						<>
							<p>
								{__(
									'This is also your active library, so your site needs another one. The library you choose below goes live immediately — colors, typography, spacing, and other styles change across your site on the front end and in the editor.',
									'kadence-blocks'
								)}
							</p>
							<SelectControl
								label={__('Which library should your site use instead?', 'kadence-blocks')}
								value={successorSlug}
								disabled={isBusy}
								onChange={setSuccessorSlug}
								// The empty option is deliberately kept selectable-looking rather than
								// preselecting a library: defaulting to one would reproduce the very
								// silent fallback this picker exists to remove, since the user would
								// confirm without reading and land somewhere they never chose. That
								// reasoning does not apply when there is only one candidate, which is
								// why that case skips the picker entirely rather than preselecting here.
								options={[
									{ value: '', label: __('Select a library…', 'kadence-blocks') },
									...successors.map((library) => ({
										value: library.slug,
										label: libraryDisplayTitle(library),
									})),
								]}
							/>
						</>
					)}
					<div className="kadence-blocks-style-library__delete-library-modal-actions">
						<Button variant="tertiary" onClick={handleClose} disabled={isBusy}>
							{__('Cancel', 'kadence-blocks')}
						</Button>
						<Button
							variant="primary"
							isDestructive
							disabled={isBusy || (needsSuccessor && chosenSuccessor === '')}
							onClick={handleConfirm}
						>
							{isBusy ? pendingLabel : restingLabel}
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
}
