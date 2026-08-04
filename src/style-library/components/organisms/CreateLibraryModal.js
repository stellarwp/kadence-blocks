/**
 * The "Create Library" modal: a title field and Cancel / Create actions. The derived slug (used
 * for the REST path and the collision check) is an implementation detail and is never shown —
 * the field reads as a plain name input. Creation is pessimistic — the caller keeps the modal busy
 * until the request resolves (a successful create is followed by a switch-and-reload, which
 * unmounts this modal).
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
import { isDuplicateLibraryTitle, slugifyLibraryTitle } from '../../helpers/libraries';
import './CreateLibraryModal.scss';

/**
 * Render the create-library modal.
 *
 * @param {Object}              props          The component props.
 * @param {Array<Object>}       props.libraries The existing library rows, for the duplicate-slug check.
 * @param {boolean}             props.isBusy    Whether the create request is in flight.
 * @param {?{message: string}} props.error      The current create error, if any.
 * @param {Function}            props.onClose   Called to dismiss the modal.
 * @param {Function}            props.onCreate  Called with the typed title to create the library.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function CreateLibraryModal({ libraries, isBusy, error, onClose, onCreate }) {
	const [title, setTitle] = useState('');
	const slug = slugifyLibraryTitle(title);
	const isDuplicate = isDuplicateLibraryTitle(title, libraries);

	return (
		<Modal
			title={__('Create Library', 'kadence-blocks')}
			className="kadence-blocks-style-library__create-library-modal"
			onRequestClose={onClose}
			// Locked while pending: no close icon, Escape does nothing, clicking outside does
			// nothing. A create request in flight cannot be walked away from mid-request.
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
				label={__('Library title', 'kadence-blocks')}
				value={title}
				onChange={setTitle}
				disabled={isBusy}
				// Two names that read as different can still collide once normalized (case,
				// punctuation, and whitespace are all folded away — see slugifyLibraryTitle), so a
				// name that duplicates an existing library needs a stated reason here rather than
				// just a disabled Create button. Empty is not an error — there is nothing to collide
				// with yet, so no message shows before the user has typed anything.
				help={
					isDuplicate
						? sprintf(
								// translators: %s: the library name the user typed.
								__('A library named "%s" already exists.', 'kadence-blocks'),
								title
							)
						: undefined
				}
			/>
			<div className="kadence-blocks-style-library__create-library-modal-actions">
				<Button variant="tertiary" onClick={onClose} disabled={isBusy}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button
					variant="primary"
					disabled={isBusy || slug === '' || isDuplicate}
					onClick={() => onCreate(title)}
				>
					{/* The progressive label is the only progress indication — no spinner alongside it.
					 * A successful create is always followed by a switch-and-reload (see the hook), so
					 * this stays on the pending label right up to the reload rather than needing an
					 * explicit close: nothing ever sets `isBusy` back to false on the success path. */}
					{isBusy ? __('Creating…', 'kadence-blocks') : __('Create', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
