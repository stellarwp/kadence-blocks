/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Button, Modal, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SaveStatus } from '../atoms/SaveStatus';
import './rename-primitive-dialog.scss';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Dialog for renaming a user-created color primitive.
 *
 * @since TBD
 *
 * @param {object}   props           Component props.
 * @param {object}   props.token     Token definition (id, label).
 * @param {Function} props.onRename  Async fn(id, { new_id, label }) → { ok, data?, error?, isConflict? }.
 * @param {Function} props.onSuccess Called with the new token definition after success.
 * @param {Function} props.onClose   Called when the dialog should close.
 * @return {JSX.Element} Rename-primitive modal.
 */
export function RenamePrimitiveDialog({ token, onRename, onSuccess, onClose }) {
	const terminalSlug = token.id.split('.').pop() ?? '';
	const [newSlug, setNewSlug] = useState(terminalSlug);
	const [newLabel, setNewLabel] = useState(token.label ?? '');
	const [slugError, setSlugError] = useState('');
	const [saveStatus, setSaveStatus] = useState({ status: 'idle', error: null });

	const validateSlug = (input) => {
		if (!input) {
			return __('ID is required.', 'kadence-blocks');
		}

		if (!SLUG_RE.test(input)) {
			return __('ID must be lowercase letters, digits, and hyphens only (e.g. my-color).', 'kadence-blocks');
		}

		return '';
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const sErr = validateSlug(newSlug);

		setSlugError(sErr);

		if (sErr) {
			return;
		}

		setSaveStatus({ status: 'saving', error: null });

		const result = await onRename(token.id, { new_id: newSlug, label: newLabel });

		if (result.ok) {
			setSaveStatus({ status: 'saved', error: null });

			const rewrittenCount = result.data?.rewrittenPaths?.length ?? 0;
			const newId = `primitive.color.custom.${newSlug}`;
			const resolvedLabel =
				newLabel.trim() || newSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

			onSuccess({
				oldId: token.id,
				newToken: {
					...token,
					id: newId,
					label: resolvedLabel,
				},
				rewrittenCount,
			});
			onClose();
		} else if (result.isConflict) {
			setSaveStatus({
				status: 'error',
				error: __(
					'The library changed since this page loaded. Reload the page and try again.',
					'kadence-blocks'
				),
			});
		} else {
			setSaveStatus({ status: 'error', error: result.error });
		}
	};

	const isBusy = saveStatus.status === 'saving';

	return (
		<Modal
			title={__('Rename Custom Color', 'kadence-blocks')}
			onRequestClose={onClose}
			className="kadence-blocks-style-library__rename-primitive-dialog"
		>
			<form onSubmit={handleSubmit} className="kadence-blocks-style-library__rename-primitive-form">
				<TextControl
					label={__('New ID (slug)', 'kadence-blocks')}
					value={newSlug}
					onChange={(v) => {
						setNewSlug(v);
						if (slugError) {
							setSlugError(validateSlug(v));
						}
					}}
					help={
						slugError || __('Lowercase letters, digits, and hyphens. E.g. my-brand-blue', 'kadence-blocks')
					}
					className={slugError ? 'has-error' : ''}
				/>

				<TextControl
					label={__('Label (optional)', 'kadence-blocks')}
					value={newLabel}
					onChange={setNewLabel}
					help={__('Display name shown in the Style Library. Defaults to the new ID.', 'kadence-blocks')}
				/>

				<div className="kadence-blocks-style-library__rename-primitive-actions">
					<Button variant="primary" type="submit" isBusy={isBusy}>
						{__('Rename', 'kadence-blocks')}
					</Button>
					<Button variant="tertiary" onClick={onClose}>
						{__('Cancel', 'kadence-blocks')}
					</Button>
					<SaveStatus status={saveStatus.status} error={saveStatus.error} />
				</div>
			</form>
		</Modal>
	);
}
