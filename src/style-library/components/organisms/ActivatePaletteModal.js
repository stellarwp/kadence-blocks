/**
 * The confirmation shown before a palette becomes `$current` — the one the site renders with.
 * Mirrors `ActivateLibraryModal`: choosing a palette from the header dropdown only opens it for
 * editing, so this modal is the whole reason activation is safe. The copy names both palettes and
 * describes what a visitor will actually see change, rather than talking about settings in the
 * abstract.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './ActivatePaletteModal.scss';

/**
 * Render the activation confirmation.
 *
 * @param {Object}             props              The component props.
 * @param {string}             props.currentLabel The display label of the palette the site uses now.
 * @param {string}             props.nextLabel    The display label of the palette about to go live.
 * @param {boolean}            props.isBusy       Whether the activation request is in flight.
 * @param {?{message: string}} props.error        The current activation error, if any.
 * @param {Function}           props.onClose      Called to dismiss the modal.
 * @param {Function}           props.onConfirm    Called to activate the palette.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function ActivatePaletteModal({ currentLabel, nextLabel, isBusy, error, onClose, onConfirm }) {
	return (
		<Modal
			title={sprintf(
				// translators: %s: the palette's display label.
				__('Set "%s" as the active palette?', 'kadence-blocks'),
				nextLabel
			)}
			className="kadence-blocks-style-library__activate-palette-modal"
			onRequestClose={onClose}
			// Locked while pending: no close icon, Escape does nothing, clicking outside does
			// nothing. A site-wide restyle in flight must not be walkable-away-from mid-request.
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
					// translators: 1: the palette the site currently uses. 2: the palette being activated.
					__(
						'Your site currently uses "%1$s". Setting "%2$s" as active changes the colors across your whole site right away — on the front end and in the editor.',
						'kadence-blocks'
					),
					currentLabel,
					nextLabel
				)}
			</p>
			<div className="kadence-blocks-style-library__activate-palette-modal-actions">
				{/* Cancel carries the autofocus: the safe choice should be the one a stray Enter
				 * press lands on, since the other one restyles the entire site. */}
				<Button variant="tertiary" onClick={onClose} disabled={isBusy} autoFocus>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button variant="primary" disabled={isBusy} onClick={onConfirm}>
					{/* The progressive label is the only progress indication — no spinner alongside it. */}
					{isBusy ? __('Setting active…', 'kadence-blocks') : __('Set as active', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
