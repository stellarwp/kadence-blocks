/**
 * The Color Palette header's actions for the palette being edited: the generic actions popover and
 * form, given the palette's own words and rules, plus the two confirmation modals the form can
 * lead to. The palette counterpart of `LibraryActions`.
 *
 * The popover always closes before a modal opens. On this page a modal is drawn above every
 * popover, so one left open would sit half-hidden behind the dialog. That is also why the modals
 * are mounted here and not inside the popover: they have to outlive it.
 *
 * Every action targets the palette being edited, never the active one: under the open/activate
 * split the two can differ, and acting on the live palette instead would re-tint the site as a
 * side effect of cleaning up an unrelated draft.
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
import { ActivatePaletteModal } from './ActivatePaletteModal';
import { DeletePaletteModal } from './DeletePaletteModal';
import { checkRename } from '../../helpers/rename';
import { isDuplicatePaletteLabel, paletteSuccessorOptions } from '../../helpers/palettes';

const MODAL_ACTIVATE = 'activate';
const MODAL_DELETE = 'delete';

const ACTIVATION_LABELS = {
	active: __('Active palette', 'kadence-blocks'),
	activeHint: __('Your site uses this palette.', 'kadence-blocks'),
	inactive: __('Not the active palette', 'kadence-blocks'),
	inactiveHint: __(
		'Setting it as active makes this palette the one your site uses. Individual blocks can still be switched to another palette.',
		'kadence-blocks'
	),
	action: __('Set as active', 'kadence-blocks'),
};

/**
 * The sentence shown under the name field when another palette already uses the typed name.
 *
 * @param {string} name The palette name the user typed.
 *
 * @since TBD
 *
 * @return {string} The message.
 */
function duplicatePaletteMessage(name) {
	// translators: %s: the palette name the user typed.
	return sprintf(__('A palette named "%s" already exists.', 'kadence-blocks'), name);
}

/**
 * Render the palette actions.
 *
 * @param {Object}   props                 The component props.
 * @param {string}   props.editingId       The palette the screen is showing; every action targets it.
 * @param {string}   props.editingLabel    That palette's display label.
 * @param {string}   props.activeLabel     The display label of the palette the site uses now.
 * @param {boolean}  props.isEditingActive Whether the palette being edited is the active one.
 * @param {boolean}  props.isUserCreated   Whether the palette is removable rather than resettable.
 * @param {Object}   props.listing         The palette listing (`{ palettes }`).
 * @param {boolean}  props.isBusy          Whether a palette operation is in flight.
 * @param {Object}   props.errors          The current `{ rename, activate, delete }` errors, each null or `{message}`.
 * @param {Object}   props.onClearError    The matching `{ rename, activate, delete }` functions that dismiss each error.
 * @param {Function} props.onRename        Called with the id and the new label.
 * @param {Function} props.onActivate      Called with an id to make that palette active.
 * @param {Function} props.onDelete        Called with the target id and the successor id.
 *
 * @since TBD
 *
 * @return {JSX.Element} The pencil, its popover and, while open, a confirmation modal.
 */
export function PaletteActions({
	editingId,
	editingLabel,
	activeLabel,
	isEditingActive,
	isUserCreated,
	listing,
	isBusy,
	errors,
	onClearError,
	onRename,
	onActivate,
	onDelete,
}) {
	const [openModal, setOpenModal] = useState(null);
	const [target, setTarget] = useState(null);

	const closeActivateModal = () => {
		setOpenModal(null);
		setTarget(null);
		onClearError.activate();
	};

	const closeDeleteModal = () => {
		setOpenModal(null);
		setTarget(null);
		onClearError.delete();
	};

	const confirmActivate = () => {
		onActivate(target.id)
			.then(closeActivateModal)
			.catch(() => {});
	};

	const confirmDelete = (successorId) => {
		onDelete(target.id, successorId)
			.then(closeDeleteModal)
			.catch(() => {});
	};

	return (
		<>
			<ActionsPopover label={__('Edit palette', 'kadence-blocks')} isBusy={isBusy} onClose={onClearError.rename}>
				{({ close }) => {
					const leaveFor = (modal) => () => {
						close();
						setTarget({
							id: editingId,
							label: editingLabel,
							isUserCreated,
							successors: paletteSuccessorOptions(listing, editingId),
							isActive: isEditingActive,
						});
						setOpenModal(modal);
					};

					return (
						<ActionsForm
							title={__('Palette', 'kadence-blocks')}
							nameLabel={__('Name', 'kadence-blocks')}
							currentName={editingLabel}
							checkName={(typed) =>
								checkRename(typed, editingLabel, (name) =>
									isDuplicatePaletteLabel(name, listing, editingId)
								)
							}
							duplicateMessage={duplicatePaletteMessage}
							destructiveLabel={
								isUserCreated ? __('Delete', 'kadence-blocks') : __('Reset', 'kadence-blocks')
							}
							activationLabels={ACTIVATION_LABELS}
							isActive={isEditingActive}
							isBusy={isBusy}
							error={errors.rename}
							onSave={(label) =>
								onRename(editingId, label)
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
			{openModal === MODAL_ACTIVATE && target && (
				<ActivatePaletteModal
					currentLabel={activeLabel}
					nextLabel={target.label}
					isBusy={isBusy}
					error={errors.activate}
					onClose={closeActivateModal}
					onConfirm={confirmActivate}
				/>
			)}
			{openModal === MODAL_DELETE && target && (
				<DeletePaletteModal
					label={target.label}
					isUserCreated={target.isUserCreated}
					successors={target.successors}
					isActive={target.isActive}
					isBusy={isBusy}
					error={errors.delete}
					onClose={closeDeleteModal}
					onConfirm={confirmDelete}
				/>
			)}
		</>
	);
}
