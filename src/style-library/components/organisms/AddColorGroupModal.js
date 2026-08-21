/**
 * The "Add Color Group" modal: a name field and Cancel / Add actions. Same skeleton as
 * `CreatePaletteModal` — they do not merge, because their validation, copy, and flow
 * (`addGroupFlow`) differ: this one mints the group's first swatch in the same write, since the
 * server drops a color group with zero swatches even on the default palette.
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
import { slugifyPaletteLabel } from '../../helpers/palettes';
import './AddColorGroupModal.scss';

/**
 * Render the add-color-group modal.
 *
 * @param {Object}             props         The component props.
 * @param {Object}             props.palette The palette being edited's effective view, for the duplicate-group check.
 * @param {?{message: string}} props.error   The current structure error, if any.
 * @param {Function}           props.onClose Called to dismiss the modal.
 * @param {Function}           props.onAdd   Called with the typed label to create the group; fires and forgets —
 *                                            the caller decides success/failure asynchronously, surfaced via
 *                                            Snackbar rather than by keeping the modal open.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function AddColorGroupModal({ palette, error, onClose, onAdd }) {
	const [label, setLabel] = useState('');
	const groupId = slugifyPaletteLabel(label);
	const isDuplicate = groupId !== '' && (palette?.groups ?? []).some((group) => group.id === groupId);

	const handleAdd = () => {
		onAdd(label);
		onClose();
	};

	return (
		<Modal
			title={__('Add Color Group', 'kadence-blocks')}
			className="kadence-blocks-style-library__add-color-group-modal"
			onRequestClose={onClose}
		>
			{error && (
				<Notice status="error" isDismissible={false}>
					{error.message}
				</Notice>
			)}
			<TextControl
				label={__('Group name', 'kadence-blocks')}
				value={label}
				onChange={setLabel}
				help={
					isDuplicate
						? sprintf(
								// translators: %s: the group name the user typed.
								__('A color group named "%s" already exists.', 'kadence-blocks'),
								label
							)
						: undefined
				}
			/>
			<div className="kadence-blocks-style-library__add-color-group-modal-actions">
				<Button variant="tertiary" onClick={onClose}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button variant="primary" disabled={groupId === '' || isDuplicate} onClick={handleAdd}>
					{__('Add', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
