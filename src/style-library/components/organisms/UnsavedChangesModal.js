/**
 * The unsaved-changes guard's confirmation modal: presentational only. All state — whether it is
 * open, whether a Save is in flight, and the last Save failure — lives in the draft channel
 * (`hooks/use-draft-channel.js`); this component only renders it and reports button clicks back.
 * Shaped after `DeleteLibraryModal`: an error `Notice` above the body, tertiary Cancel + destructive
 * secondary + primary confirm in the actions row, a progressive pending label instead of a spinner,
 * and every dismiss path gated off while busy.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './UnsavedChangesModal.scss';

/**
 * Render the unsaved-changes confirmation modal.
 *
 * @param {Object}             props           The component props.
 * @param {boolean}            props.isOpen    Whether a guarded action is parked and the modal
 *                                              should render.
 * @param {string}             props.label     The open token's saved display label (not the draft
 *                                              label — a mid-edit or emptied name must not produce
 *                                              "unsaved changes to ''").
 * @param {boolean}            props.isBusy    Whether the modal's Save is in flight.
 * @param {?{message: string}} props.error     The last modal-Save failure, if any.
 * @param {Function}           props.onSave    Commits the draft, then completes the parked action.
 * @param {Function}           props.onDiscard Reverts the draft, then completes the parked action.
 * @param {Function}           props.onCancel  Drops the parked action; the dirty draft stays.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The modal, or `null` while closed.
 */
export function UnsavedChangesModal({ isOpen, label, isBusy, error, onSave, onDiscard, onCancel }) {
	if (!isOpen) {
		return null;
	}

	const body = label
		? sprintf(
				// translators: %s: the token's saved display label.
				__(
					"You have unsaved changes to '%s'. Save them, or discard them to go back to the saved values.",
					'kadence-blocks'
				),
				label
			)
		: __('You have unsaved changes. Save them, or discard them to go back to the saved values.', 'kadence-blocks');

	return (
		<Modal
			title={__('Unsaved Changes', 'kadence-blocks')}
			className="kadence-blocks-style-library__unsaved-changes-modal"
			onRequestClose={onCancel}
			// Locked while pending, the same as `DeleteLibraryModal`: a dismissal mid-Save must not
			// let the user walk away from (or re-trigger) a request that is still in flight.
			isDismissible={!isBusy}
			shouldCloseOnEsc={!isBusy}
			shouldCloseOnClickOutside={!isBusy}
		>
			{error && (
				<Notice status="error" isDismissible={false}>
					{error.message}
				</Notice>
			)}
			<p>{body}</p>
			<div className="kadence-blocks-style-library__unsaved-changes-modal-actions">
				<Button variant="tertiary" onClick={onCancel} disabled={isBusy}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button variant="secondary" isDestructive onClick={onDiscard} disabled={isBusy}>
					{__('Discard', 'kadence-blocks')}
				</Button>
				<Button variant="primary" onClick={onSave} disabled={isBusy}>
					{isBusy ? __('Saving…', 'kadence-blocks') : __('Save', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
