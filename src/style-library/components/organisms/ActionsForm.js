// cspell:ignore Bitwarden lpignore bwignore -- a password manager's name and two managers' own opt-out attribute names.
/**
 * The form inside an actions popover: a name field, whether the thing being edited is the active
 * one, and the destructive action. Generic: it is used for a library today and is shaped so a
 * palette can use it unchanged, so every word and the rule for a valid name come from the caller.
 *
 * Owns only the typed name. Everything that changes data — the rename request, the activation and
 * delete confirmations — belongs to the caller, reached through the callbacks.
 */

/**
 * WordPress dependencies
 */
import { Button, Notice, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ActivationRow } from '../molecules/ActivationRow';
import './ActionsForm.scss';

/**
 * Render the actions form.
 *
 * @param {Object}             props                    The component props.
 * @param {string}             props.title              The form's heading (e.g. "Library").
 * @param {string}             props.nameLabel          The name field's label.
 * @param {string}             props.currentName        The current name, which the field starts from.
 * @param {Function}           props.checkName          Called with the typed name; returns
 *                                                      `{trimmed, isDuplicate, isSavable}` (see
 *                                                      `helpers/rename.js`).
 * @param {Function}           props.duplicateMessage   Called with the trimmed name; returns the
 *                                                      sentence shown when it is already taken.
 * @param {string}             props.destructiveLabel   The destructive action's text (e.g. "Delete").
 * @param {Object}             props.activationLabels   The texts for `ActivationRow`.
 * @param {boolean}            props.isActive           Whether the thing being edited is the active one.
 * @param {boolean}            props.isBusy             Whether an operation is in flight.
 * @param {?{message: string}} props.error              The current rename error, if any.
 * @param {Function}           props.onSave             Called with the trimmed new name.
 * @param {Function}           props.onCancel           Called when the user backs out.
 * @param {Function}           props.onActivate         Called when the user asks to make it active.
 * @param {Function}           props.onDelete           Called when the user asks for the destructive action.
 *
 * @since TBD
 *
 * @return {JSX.Element} The form.
 */
export function ActionsForm({
	title,
	nameLabel,
	currentName,
	checkName,
	duplicateMessage,
	destructiveLabel,
	activationLabels,
	isActive,
	isBusy,
	error,
	onSave,
	onCancel,
	onActivate,
	onDelete,
}) {
	// Seeded from the current name so the common edit — fixing a typo — starts from the text being
	// fixed rather than an empty field.
	const [name, setName] = useState(currentName);

	const { trimmed, isDuplicate, isSavable } = checkName(name);
	const canSave = !isBusy && isSavable;

	const handleSubmit = (event) => {
		event.preventDefault();

		if (canSave) {
			onSave(trimmed);
		}
	};

	return (
		<form className="kadence-blocks-style-library__actions-form" onSubmit={handleSubmit}>
			<h2 className="kadence-blocks-style-library__actions-form-title">{title}</h2>
			{error && (
				<Notice status="error" isDismissible={false}>
					{error.message}
				</Notice>
			)}
			<TextControl
				label={nameLabel}
				value={name}
				onChange={setName}
				disabled={isBusy}
				help={isDuplicate ? duplicateMessage(trimmed) : undefined}
				// A form with a field called "Name" looks like a sign-up form to a password manager,
				// which then offers a saved login or identity over it. `autoComplete` covers the
				// browser's own suggestions; the `data-*` flags are the opt-outs 1Password, LastPass
				// and Bitwarden each read, since they ignore `autoComplete="off"`.
				autoComplete="off"
				data-1p-ignore
				data-lpignore="true"
				data-bwignore
			/>
			<ActivationRow isActive={isActive} isBusy={isBusy} onActivate={onActivate} labels={activationLabels} />
			<div className="kadence-blocks-style-library__actions-form-footer">
				<Button
					className="kadence-blocks-style-library__delete-library-action"
					type="button"
					variant="link"
					isDestructive
					disabled={isBusy}
					onClick={onDelete}
				>
					{destructiveLabel}
				</Button>
				<div className="kadence-blocks-style-library__actions-form-footer-end">
					<Button type="button" variant="tertiary" disabled={isBusy} onClick={onCancel}>
						{__('Cancel', 'kadence-blocks')}
					</Button>
					<Button type="submit" variant="primary" disabled={!canSave}>
						{isBusy ? __('Saving…', 'kadence-blocks') : __('Save', 'kadence-blocks')}
					</Button>
				</div>
			</div>
		</form>
	);
}
