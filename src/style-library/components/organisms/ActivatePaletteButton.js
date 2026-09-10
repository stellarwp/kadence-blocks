/**
 * The header's "Set as active" affordance and its confirmation modal for palettes, mirroring
 * `ActivateLibraryButton` exactly: it owns its own open state, and renders nothing while the
 * palette being edited is already `$current` — there is no action to offer, and the dropdown's own
 * Active badge already says which one is live, so a second label here would only repeat it.
 */

/**
 * WordPress dependencies
 */
import { Button, Tooltip } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ActivatePaletteModal } from './ActivatePaletteModal';
import './ActivatePaletteButton.scss';

/**
 * What activating a palette does, shown before the click. The documentation link that belongs with
 * this sentence lives in the screen's description row instead: a tooltip is neither hoverable nor
 * focusable, so a link inside one is unreachable by mouse and keyboard alike.
 *
 * @since TBD
 */
const ACTIVATE_HINT = __(
	'Makes this palette the one your site uses. Individual blocks can still be switched to another palette.',
	'kadence-blocks'
);

/**
 * Render the activate action and, when open, its confirmation modal.
 *
 * @param {Object}             props                 The component props.
 * @param {string}             props.editingId       The palette the app is showing, and the activation target.
 * @param {string}             props.editingLabel    That palette's display label.
 * @param {string}             props.activeLabel     The display label of the palette the site uses now.
 * @param {boolean}            props.isEditingActive Whether the palette being edited is already the active one.
 * @param {boolean}            props.isBusy          Whether a palette operation is in flight.
 * @param {?{message: string}} props.error           The current activation error, if any.
 * @param {Function}           props.onClearError    Dismisses the current activation error.
 * @param {Function}           props.onActivate      Called with an id to make that palette active.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The action and, while open, its modal — or null when the palette being
 *                         edited is already active.
 */
export function ActivatePaletteButton({
	editingId,
	editingLabel,
	activeLabel,
	isEditingActive,
	isBusy,
	error,
	onClearError,
	onActivate,
}) {
	const [isOpen, setIsOpen] = useState(false);

	if (isEditingActive) {
		return null;
	}

	// Closes the modal and clears its own error, whether that is a confirmed activation, a Cancel
	// click, or the Modal's own dismiss paths (Escape, click-outside) — all of which are already
	// gated off while `isBusy`, so this never fires mid-request.
	const handleClose = () => {
		setIsOpen(false);
		onClearError();
	};

	// The modal closes only once the pointer has actually moved. `.catch` deliberately does nothing
	// beyond swallowing the rejection — a failed activation already re-set `isBusy`/`error` in the
	// hook, and staying open is exactly the behavior a caught rejection gives here for free.
	const handleConfirm = () => {
		onActivate(editingId)
			.then(() => handleClose())
			.catch(() => {});
	};

	return (
		<>
			<Tooltip text={ACTIVATE_HINT}>
				<Button
					variant="secondary"
					disabled={isBusy}
					onClick={() => setIsOpen(true)}
					className="kadence-blocks-style-library__activate-palette-action"
				>
					{__('Set as active', 'kadence-blocks')}
				</Button>
			</Tooltip>
			{isOpen && (
				<ActivatePaletteModal
					currentLabel={activeLabel}
					nextLabel={editingLabel}
					isBusy={isBusy}
					error={error}
					onClose={handleClose}
					onConfirm={handleConfirm}
				/>
			)}
		</>
	);
}
