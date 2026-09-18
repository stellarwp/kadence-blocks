/**
 * The confirmation shown before a library becomes the one the site renders with.
 *
 * This modal is the whole reason activation is safe. Choosing a library from the header dropdown
 * only opens it for editing; the site keeps rendering whatever is active until someone reads this
 * and confirms. The copy therefore names both libraries and describes what a visitor will
 * actually see change, rather than talking about settings in the abstract.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './ActivateLibraryModal.scss';

/**
 * Render the activation confirmation.
 *
 * @param {Object}             props              The component props.
 * @param {string}             props.currentTitle The display title of the library the site uses now.
 * @param {string}             props.nextTitle    The display title of the library about to go live.
 * @param {boolean}            props.isBusy       Whether the activation request is in flight.
 * @param {?{message: string}} props.error        The current activation error, if any.
 * @param {Function}           props.onClose      Called to dismiss the modal.
 * @param {Function}           props.onConfirm    Called to activate the library.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function ActivateLibraryModal({ currentTitle, nextTitle, isBusy, error, onClose, onConfirm }) {
	return (
		<Modal
			title={sprintf(
				// translators: %s: the library's display title.
				__('Set "%s" as the active library?', 'kadence-blocks'),
				nextTitle
			)}
			className="kadence-blocks-style-library__activate-library-modal"
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
					// translators: 1: the library the site currently uses. 2: the library being activated.
					__(
						'Your site currently uses "%1$s". Setting "%2$s" as active changes the colors, typography, spacing, and other styles across your whole site right away — on the front end and in the editor.',
						'kadence-blocks'
					),
					currentTitle,
					nextTitle
				)}
			</p>
			<p>
				{sprintf(
					// translators: %s: the library the site currently uses.
					__(
						'You can switch back at any time, but any custom values in "%s" stay in that library — they are not copied over.',
						'kadence-blocks'
					),
					currentTitle
				)}
			</p>
			<div className="kadence-blocks-style-library__activate-library-modal-actions">
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
