/**
 * The "Create Color Palette" modal: a name field and Cancel / Create actions. Modeled on
 * `CreateLibraryModal` — a title field, the same derived-slug duplicate check, and the same
 * resolved/rejected-promise close contract — but for palettes, whose slug and duplicate rule
 * (`slugifyPaletteLabel` / `isDuplicatePaletteLabel`) already exist from the data-layer flows.
 *
 * A successful create both creates and opens the new palette (`createPaletteFlow`); it never
 * activates it, so the caller closes this modal on the create resolving, not on any activation.
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
import { isDuplicatePaletteLabel, slugifyPaletteLabel } from '../../helpers/palettes';
import './CreatePaletteModal.scss';

/**
 * Render the create-palette modal.
 *
 * @param {Object}              props          The component props.
 * @param {Object}              props.listing  The palette listing (`{ palettes }`), for the duplicate-label check.
 * @param {boolean}              props.isBusy   Whether the create request is in flight.
 * @param {?{message: string}}  props.error    The current create error, if any.
 * @param {Function}             props.onClose  Called to dismiss the modal.
 * @param {Function}             props.onCreate Called with the typed label to create the palette.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function CreatePaletteModal({ listing, isBusy, error, onClose, onCreate }) {
	const [label, setLabel] = useState('');
	const slug = slugifyPaletteLabel(label);
	const isDuplicate = isDuplicatePaletteLabel(label, listing);

	return (
		<Modal
			title={__('Create Color Palette', 'kadence-blocks')}
			className="kadence-blocks-style-library__create-palette-modal"
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
				label={__('Palette name', 'kadence-blocks')}
				value={label}
				onChange={setLabel}
				disabled={isBusy}
				help={
					isDuplicate
						? sprintf(
								// translators: %s: the palette name the user typed.
								__('A palette named "%s" already exists.', 'kadence-blocks'),
								label
							)
						: undefined
				}
			/>
			<div className="kadence-blocks-style-library__create-palette-modal-actions">
				<Button variant="tertiary" onClick={onClose} disabled={isBusy}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button
					variant="primary"
					disabled={isBusy || slug === '' || isDuplicate}
					onClick={() => onCreate(label)}
				>
					{/* The progressive label is the only progress indication — no spinner alongside it. */}
					{isBusy ? __('Creating…', 'kadence-blocks') : __('Create', 'kadence-blocks')}
				</Button>
			</div>
		</Modal>
	);
}
