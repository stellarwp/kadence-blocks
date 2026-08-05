/**
 * The rename modal for a color group, mirroring `RenamePaletteModal`: a single label field seeded
 * with the group's current label. Not merged with that modal — the seed, validation, copy, and
 * flow (`renameGroup`) all differ, while reusing the same `Modal`-based skeleton.
 *
 * No uniqueness check: group **ids** are the uniqueness domain and this rename never touches the
 * id (see `renameGroupInGroups`'s own docblock for why), so a duplicate label is display-only
 * ambiguity the user chose — the same stance swatch rename already takes.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './RenameColorGroupModal.scss';

/**
 * Render the rename-color-group confirmation.
 *
 * @param {Object}             props              The component props.
 * @param {Object}             props.group        The group being renamed, `{ id, label }`.
 * @param {boolean}            props.isBusy       Whether a palette operation is in flight.
 * @param {?{message: string}} props.error        The current structure error, if any.
 * @param {Function}           props.onClose      Called to dismiss the modal.
 * @param {Function}           props.onRename     Called with the new label to rename the group.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function RenameColorGroupModal({ group, isBusy, error, onClose, onRename }) {
	const [label, setLabel] = useState(group.label);
	const trimmed = label.trim();
	const isUnchanged = trimmed === group.label.trim();

	return (
		<Modal
			title={__('Rename Color Group', 'kadence-blocks')}
			className="kadence-blocks-style-library__rename-color-group-modal"
			onRequestClose={onClose}
			// Locked while pending, like every other palette modal.
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
				label={__('Group name', 'kadence-blocks')}
				value={label}
				onChange={setLabel}
				disabled={isBusy}
			/>
			<p>{__('This changes the group’s display name on every palette.', 'kadence-blocks')}</p>
			<div className="kadence-blocks-style-library__rename-color-group-modal-actions">
				<Button variant="tertiary" onClick={onClose} disabled={isBusy}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button
					variant="primary"
					// Unchanged is disabled alongside empty: a rename to the same label would spend a
					// request to change nothing.
					disabled={isBusy || trimmed === '' || isUnchanged}
					onClick={() => onRename(trimmed)}
				>
					{isBusy ? __('Saving…', 'kadence-blocks') : __('Save', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
