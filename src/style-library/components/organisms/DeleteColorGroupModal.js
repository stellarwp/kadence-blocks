/**
 * The confirmation shown before a color group is deleted, modeled on `DeletePaletteModal`: names
 * the group and its swatch count, because this destroys N swatches at once rather than one. The
 * group's colors are removed from every palette — structure lives only on the default node, so a
 * group delete is not scoped to the palette currently being viewed.
 *
 * The trigger lives in the group's overflow menu (`ColorPaletteScreen`), not here; this modal only
 * renders while its caller's target state says so.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice } from '@wordpress/components';
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './DeleteColorGroupModal.scss';

/**
 * Render the delete-color-group confirmation.
 *
 * @param {Object}             props           The component props.
 * @param {Object}             props.group     The group being deleted, `{ id, label, items }`.
 * @param {boolean}            props.isBusy    Whether the delete request is in flight.
 * @param {?{message: string}} props.error     The current structure error, if any.
 * @param {Function}           props.onClose   Called to dismiss the modal.
 * @param {Function}           props.onConfirm Called to delete the group.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function DeleteColorGroupModal({ group, isBusy, error, onClose, onConfirm }) {
	const count = group.items.length;

	return (
		<Modal
			title={__('Delete Color Group?', 'kadence-blocks')}
			className="kadence-blocks-style-library__delete-color-group-modal"
			onRequestClose={onClose}
			// Locked while pending: no close icon, Escape does nothing, clicking outside does
			// nothing. A delete request in flight cannot be walked away from mid-request.
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
				{sprintf(
					// translators: 1: the group's display label, 2: its swatch count.
					_n(
						'Delete the group "%1$s" and its %2$d color? This removes it from every palette.',
						'Delete the group "%1$s" and its %2$d colors? This removes them from every palette.',
						count,
						'kadence-blocks'
					),
					group.label,
					count
				)}
			</p>
			<div className="kadence-blocks-style-library__delete-color-group-modal-actions">
				<Button variant="tertiary" onClick={onClose} disabled={isBusy} autoFocus>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button variant="primary" isDestructive disabled={isBusy} onClick={onConfirm}>
					{/* The progressive label is the only progress indication — no spinner alongside it. */}
					{isBusy ? __('Deleting…', 'kadence-blocks') : __('Delete', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
