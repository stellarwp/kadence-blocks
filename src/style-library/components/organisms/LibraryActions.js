/**
 * The header's actions for the library being edited: the generic actions popover and form, given
 * the library's own words and rules, plus the two confirmation modals the form can lead to.
 *
 * The popover always closes before a modal opens. On this page a modal is drawn above every
 * popover, so one left open would sit half-hidden behind the dialog. That is also why the modals
 * are mounted here and not inside the popover: they have to outlive it.
 *
 * Only a library's display name changes on save. Its slug — the identity the site's
 * active-library pointer and every REST route address it by — is fixed at creation and never
 * rewritten, so a rename is safe to do at any time and has no effect on stored token values.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ActionsForm } from './ActionsForm';
import { ActionsPopover } from './ActionsPopover';
import { ActivateLibraryModal } from './ActivateLibraryModal';
import { DeleteLibraryModal } from './DeleteLibraryModal';
import { checkLibraryRename, isDefaultLibrary } from '../../helpers/libraries';

const MODAL_ACTIVATE = 'activate';
const MODAL_DELETE = 'delete';

const ACTIVATION_LABELS = {
	active: __('Active library', 'kadence-blocks'),
	activeHint: __('Your site uses this library.', 'kadence-blocks'),
	inactive: __('Not the active library', 'kadence-blocks'),
	inactiveHint: __(
		'Setting it as active makes this library the one your site uses. Your site switches to its colors, sizes and styles.',
		'kadence-blocks'
	),
	action: __('Set as active', 'kadence-blocks'),
};

/**
 * The sentence shown under the name field when another library already uses the typed name.
 *
 * @param {string} name The library name the user typed.
 *
 * @since TBD
 *
 * @return {string} The message.
 */
function duplicateLibraryMessage(name) {
	// translators: %s: the library name the user typed.
	return sprintf(__('A library named "%s" already exists.', 'kadence-blocks'), name);
}

/**
 * Render the library actions.
 *
 * @param {Object}        props                 The component props.
 * @param {string}        props.editingSlug     The library the app is showing; every action targets it.
 * @param {string}        props.editingTitle    That library's display title.
 * @param {string}        props.activeSlug      The slug the site renders with.
 * @param {string}        props.activeTitle     The display title of the library the site uses now.
 * @param {boolean}       props.isEditingActive Whether the library being edited is the active one.
 * @param {Array<Object>} props.libraries       The existing library rows.
 * @param {boolean}       props.isBusy          Whether a library operation is in flight.
 * @param {Object}        props.errors          The current `{ rename, activate, delete }` errors, each null or `{message}`.
 * @param {Object}        props.onClearError    The matching `{ rename, activate, delete }` functions that dismiss each error.
 * @param {Function}      props.onRename        Called with the slug and the new title.
 * @param {Function}      props.onActivate      Called with a slug to make that library active.
 * @param {Function}      props.onDelete        Called with the target slug and, when required, the successor slug.
 *
 * @since TBD
 *
 * @return {JSX.Element} The pencil, its popover and, while open, a confirmation modal.
 */
export function LibraryActions({
	editingSlug,
	editingTitle,
	activeSlug,
	activeTitle,
	isEditingActive,
	libraries,
	isBusy,
	errors,
	onClearError,
	onRename,
	onActivate,
	onDelete,
}) {
	const [openModal, setOpenModal] = useState(null);

	const closeModal = () => setOpenModal(null);

	// Closes and clears its own error, whether that is a confirmed activation, a Cancel click, or
	// the Modal's own dismiss paths — all already gated off while `isBusy`, so this never fires
	// mid-request.
	const closeActivateModal = () => {
		closeModal();
		onClearError.activate();
	};

	// `.catch` swallows the rejection only: a failure already landed in `errors` via the hook, and
	// not closing is exactly what leaves the modal's inline Notice on screen for the user to act on.
	const confirmActivate = () => {
		onActivate(editingSlug)
			.then(closeActivateModal)
			.catch(() => {});
	};

	return (
		<>
			<ActionsPopover
				label={__('Edit library', 'kadence-blocks')}
				isBusy={isBusy}
				// Every way out of the popover — Save, Cancel, Escape, a click outside — drops a rename
				// error with it, so a past failure is not the first thing the next opening shows.
				onClose={onClearError.rename}
			>
				{({ close }) => {
					const leaveFor = (modal) => () => {
						close();
						setOpenModal(modal);
					};

					return (
						<ActionsForm
							title={__('Library', 'kadence-blocks')}
							nameLabel={__('Name', 'kadence-blocks')}
							currentName={editingTitle}
							// Compares against what libraries are actually *called*, not against derived
							// slugs: a slug is minted once at creation and never follows a rename, so a
							// slug-based check would refuse names nothing on screen is using.
							checkName={(typed) => checkLibraryRename(typed, editingTitle, libraries, editingSlug)}
							duplicateMessage={duplicateLibraryMessage}
							// The default library is never removed, only returned to its shipped values,
							// and the label says which of the two is about to be confirmed.
							destructiveLabel={
								isDefaultLibrary(editingSlug)
									? __('Reset', 'kadence-blocks')
									: __('Delete', 'kadence-blocks')
							}
							activationLabels={ACTIVATION_LABELS}
							isActive={isEditingActive}
							isBusy={isBusy}
							error={errors.rename}
							// A failed rename keeps the popover open with its error showing; only a
							// finished one closes it.
							onSave={(title) =>
								onRename(editingSlug, title)
									.then(close)
									.catch(() => {})
							}
							onCancel={close}
							onActivate={leaveFor(MODAL_ACTIVATE)}
							onDelete={leaveFor(MODAL_DELETE)}
						/>
					);
				}}
			</ActionsPopover>
			{openModal === MODAL_ACTIVATE && (
				<ActivateLibraryModal
					currentTitle={activeTitle}
					nextTitle={editingTitle}
					isBusy={isBusy}
					error={errors.activate}
					onClose={closeActivateModal}
					onConfirm={confirmActivate}
				/>
			)}
			{openModal === MODAL_DELETE && (
				<DeleteLibraryModal
					editingSlug={editingSlug}
					editingTitle={editingTitle}
					activeSlug={activeSlug}
					libraries={libraries}
					isBusy={isBusy}
					error={errors.delete}
					onClearError={onClearError.delete}
					onDelete={onDelete}
					onClose={closeModal}
				/>
			)}
		</>
	);
}
