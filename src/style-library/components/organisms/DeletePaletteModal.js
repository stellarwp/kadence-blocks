/**
 * The confirmation shown before the palette being edited is deleted or reset. A baseline palette is
 * never removed — dropping its overrides reverts it to the shipped colors and it stays in the
 * listing — so it is offered as a Reset, and only a user-created palette is a real Delete. Mirrors
 * `DeleteLibraryModal`, which draws the same line for the default library.
 *
 * The trigger button lives in `ColorPaletteScreen`'s header, not here — unlike
 * `DeleteLibraryModal`, which owns both; this modal only renders while its caller's `isOpen` state
 * says so.
 */

/**
 * WordPress dependencies
 */
import { Button, Modal, Notice, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { paletteDisplayLabel } from '../../helpers/palettes';
import './DeletePaletteModal.scss';

/**
 * Render the delete-palette confirmation.
 *
 * @param {Object}             props           The component props.
 * @param {string}             props.label         The palette being edited's display label.
 * @param {boolean}            props.isUserCreated Whether this palette is removable rather than resettable.
 * @param {Array}              props.successors    The palettes the active pointer can move to.
 * @param {boolean}            props.isActive      Whether the palette being edited is also `$current`.
 * @param {boolean}            props.isBusy        Whether the request is in flight.
 * @param {?{message: string}} props.error         The current error, if any.
 * @param {Function}           props.onClose       Called to dismiss the modal.
 * @param {Function}           props.onConfirm     Called with the chosen successor id to run the action.
 *
 * @since TBD
 *
 * @return {JSX.Element} The modal.
 */
export function DeletePaletteModal({
	label,
	isUserCreated,
	successors = [],
	isActive,
	isBusy,
	error,
	onClose,
	onConfirm,
}) {
	const [successorId, setSuccessorId] = useState('');

	// A reset leaves the palette in place and still active, so there is nothing to succeed it.
	const needsSuccessor = isActive && isUserCreated;
	const isSuccessorForced = needsSuccessor && successors.length === 1;
	const chosenSuccessor = isSuccessorForced ? successors[0].id : successorId;

	const restingLabel = isUserCreated ? __('Delete', 'kadence-blocks') : __('Reset', 'kadence-blocks');
	const pendingLabel = isUserCreated ? __('Deleting…', 'kadence-blocks') : __('Resetting…', 'kadence-blocks');
	const title = isUserCreated
		? sprintf(
				// translators: %s: the palette's display label.
				__('Delete "%s"?', 'kadence-blocks'),
				label
			)
		: sprintf(
				// translators: %s: the palette's display label.
				__('Reset "%s"?', 'kadence-blocks'),
				label
			);

	return (
		<Modal
			title={title}
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
			<p>
				{isUserCreated
					? __('Its color overrides are removed permanently.', 'kadence-blocks')
					: __('Its colors return to the shipped baseline. The palette itself stays.', 'kadence-blocks')}
			</p>
			{isSuccessorForced && (
				<p>
					{sprintf(
						// translators: %s: the palette the site will use instead.
						__(
							'This is also your active palette, so your site will use "%s" instead. Its colors go live across your site immediately — on the front end and in the editor.',
							'kadence-blocks'
						),
						paletteDisplayLabel(successors[0])
					)}
				</p>
			)}
			{needsSuccessor && !isSuccessorForced && (
				<>
					<p>
						{__(
							'This is also your active palette, so your site needs another one. The palette you choose below goes live immediately — its colors change across your site on the front end and in the editor.',
							'kadence-blocks'
						)}
					</p>
					<SelectControl
						label={__('Which palette should your site use instead?', 'kadence-blocks')}
						value={successorId}
						disabled={isBusy}
						onChange={setSuccessorId}
						options={[
							{ value: '', label: __('Select a palette…', 'kadence-blocks') },
							...successors.map((row) => ({ value: row.id, label: paletteDisplayLabel(row) })),
						]}
					/>
				</>
			)}
			<div className="kadence-blocks-style-library__delete-palette-modal-actions">
				<Button variant="tertiary" onClick={onClose} disabled={isBusy} autoFocus>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<Button
					variant="primary"
					isDestructive
					disabled={isBusy || (needsSuccessor && !chosenSuccessor)}
					onClick={() => onConfirm(chosenSuccessor)}
				>
					{/* The progressive label is the only progress indication — no spinner alongside it. */}
					{isBusy ? pendingLabel : restingLabel}
				</Button>
			</div>
		</Modal>
	);
}
