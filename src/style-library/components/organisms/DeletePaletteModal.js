/**
 * The confirmation shown before the palette being edited is deleted. Simpler than
 * `DeleteLibraryModal`: there is no successor picker. Opening a palette never writes `$current`
 * (`openPaletteFlow`), so deleting a palette that is merely being edited has no live-site effect to
 * sequence around, and when the deleted palette does happen to be `$current`, the server resolves
 * its own fallback and returns it in the listing `deletePaletteFlow` re-reads — a confirm is all
 * this deletion ever asks for.
 *
 * The trigger button lives in `ColorPaletteScreen`'s header, not here — unlike
 * `DeleteLibraryModal`, which owns both; this modal only renders while its caller's `isOpen` state
 * says so.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './DeletePaletteModal.scss';

/**
 * Render the delete-palette confirmation.
 *
 * @param {Object}             props           The component props.
 * @param {string}             props.label     The palette being edited's display label.
 * @param {boolean}            props.isActive  Whether the palette being edited is also `$current`.
 * @param {boolean}            props.isBusy    Whether the delete request is in flight.
 * @param {?{message: string}} props.error     The current delete error, if any.
 * @param {Function}           props.onClose   Called to dismiss the modal.
 * @param {Function}           props.onConfirm Called to delete the palette.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function DeletePaletteModal({ label, isActive, isBusy, error, onClose, onConfirm }) {
	return (
		<Modal
			title={sprintf(
				// translators: %s: the palette's display label.
				__('Delete "%s"?', 'kadence-blocks'),
				label
			)}
			className="kadence-blocks-style-library__delete-palette-modal"
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
			<p>{__('Its color overrides are removed permanently.', 'kadence-blocks')}</p>
			{isActive && (
				<p>
					{__(
						'This is also your active palette, so your site will fall back to another one automatically.',
						'kadence-blocks'
					)}
				</p>
			)}
			<div className="kadence-blocks-style-library__delete-palette-modal-actions">
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
