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
import './add-primitive-dialog.scss';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Dialog for creating a new user-defined color primitive.
 *
 * @since TBD
 *
 * @param {object}   props           Component props.
 * @param {Function} props.onCreate  Async handler called with { id, $type, $value, label }.
 * @param {Function} props.onClose   Called when the dialog should close.
 * @return {JSX.Element} Add-primitive modal.
 */
export function AddPrimitiveDialog({ onCreate, onClose }) {
	const [slug, setSlug] = useState('');
	const [label, setLabel] = useState('');
	const [value, setValue] = useState('#000000');
	const [slugError, setSlugError] = useState('');
	const [valueError, setValueError] = useState('');
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

	const validateValue = (input) => {
		if (!input.trim()) {
			return __('Color value is required.', 'kadence-blocks');
		}

		return '';
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const sErr = validateSlug(slug);
		const vErr = validateValue(value);

		setSlugError(sErr);
		setValueError(vErr);

		if (sErr || vErr) {
			return;
		}

		setSaveStatus({ status: 'saving', error: null });

		const result = await onCreate({ id: slug, $type: 'color', $value: value.trim(), label });

		if (result.ok) {
			setSaveStatus({ status: 'saved', error: null });
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

	return (
		<Modal
			title={__('Add Custom Color', 'kadence-blocks')}
			onRequestClose={onClose}
			className="kadence-blocks-style-library__add-primitive-dialog"
		>
			<form onSubmit={handleSubmit} className="kadence-blocks-style-library__add-primitive-form">
				<TextControl
					label={__('ID (slug)', 'kadence-blocks')}
					value={slug}
					onChange={(v) => {
						setSlug(v);
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
					value={label}
					onChange={setLabel}
					help={__('Display name shown in the Style Library. Defaults to the ID.', 'kadence-blocks')}
				/>

				<TextControl
					label={__('Color value', 'kadence-blocks')}
					value={value}
					onChange={(v) => {
						setValue(v);
						if (valueError) {
							setValueError(validateValue(v));
						}
					}}
					help={valueError || __('Hex color, e.g. #3182CE', 'kadence-blocks')}
					className={valueError ? 'has-error' : ''}
				/>

				<div className="kadence-blocks-style-library__add-primitive-actions">
					<Button variant="primary" type="submit" isBusy={saveStatus.status === 'saving'}>
						{__('Add Color', 'kadence-blocks')}
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
