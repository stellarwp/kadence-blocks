/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Button, Modal, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SaveStatus } from '../atoms/SaveStatus';
import './delete-primitive-dialog.scss';

/**
 * Dialog for confirming deletion of a user-created color primitive.
 *
 * Fetches the reference preview on mount. If any reference is unsupported the
 * confirm button is disabled. On 409 the preview is re-fetched automatically.
 *
 * @since TBD
 *
 * @param {object}   props              Component props.
 * @param {object}   props.token        Token definition (id, label).
 * @param {Function} props.onFetchPreview Async fn(id) → { ok, data: { version, deletable, references } }.
 * @param {Function} props.onDelete     Async fn(id, previewVersion) → { ok, data?, error?, isConflict? }.
 * @param {Function} props.onSuccess    Called with the deleted token id after success.
 * @param {Function} props.onClose      Called when the dialog should close.
 * @return {JSX.Element} Delete-primitive modal.
 */
export function DeletePrimitiveDialog({ token, onFetchPreview, onDelete, onSuccess, onClose }) {
	const [preview, setPreview] = useState(null);
	const [previewError, setPreviewError] = useState(null);
	const [isFetching, setIsFetching] = useState(true);
	const [saveStatus, setSaveStatus] = useState({ status: 'idle', error: null });

	const fetchPreview = async () => {
		setIsFetching(true);
		setPreviewError(null);

		const result = await onFetchPreview(token.id);

		if (result.ok) {
			setPreview(result.data);
			setSaveStatus({ status: 'idle', error: null });
		} else {
			setPreviewError(result.error);
		}

		setIsFetching(false);
	};

	useEffect(() => {
		void fetchPreview();
	}, []);

	const handleConfirm = async () => {
		if (!preview) {
			return;
		}

		setSaveStatus({ status: 'saving', error: null });

		const result = await onDelete(token.id, preview.version);

		if (result.ok) {
			setSaveStatus({ status: 'saved', error: null });
			onSuccess(token.id);
			onClose();
			return;
		}

		if (result.isConflict) {
			setSaveStatus({
				status: 'error',
				error: __('The token set changed since this preview loaded. Refreshing…', 'kadence-blocks'),
			});
			void fetchPreview();
			return;
		}

		setSaveStatus({ status: 'error', error: result.error });
	};

	const canDelete = preview?.deletable === true;
	const hasUnsupported = preview?.references?.some((r) => !r.supported) ?? false;
	const isBusy = saveStatus.status === 'saving';

	return (
		<Modal
			title={__('Delete Custom Color', 'kadence-blocks')}
			onRequestClose={onClose}
			className="kadence-blocks-style-book__delete-primitive-dialog"
		>
			<p className="kadence-blocks-style-book__delete-primitive-description">
				{/* translators: %s is the token label or id */}
				{__('Are you sure you want to delete', 'kadence-blocks')} <strong>{token.label || token.id}</strong>?
			</p>

			{isFetching && (
				<div className="kadence-blocks-style-book__delete-primitive-loading">
					<Spinner />
					{__('Checking references…', 'kadence-blocks')}
				</div>
			)}

			{previewError && <p className="kadence-blocks-style-book__delete-primitive-error">{previewError}</p>}

			{!isFetching && preview && preview.references.length > 0 && (
				<div className="kadence-blocks-style-book__delete-primitive-refs">
					<p className="kadence-blocks-style-book__delete-primitive-refs-heading">
						{__('Tokens that reference this color:', 'kadence-blocks')}
					</p>
					<ul className="kadence-blocks-style-book__delete-primitive-refs-list">
						{preview.references.map((ref) => (
							<li key={ref.path} className="kadence-blocks-style-book__delete-primitive-ref">
								<code>{ref.path}</code>
								<span
									className={`kadence-blocks-style-book__delete-primitive-action kadence-blocks-style-book__delete-primitive-action--${ref.supported ? 'supported' : 'unsupported'}`}
								>
									{ref.supported
										? __('Will revert to baseline', 'kadence-blocks')
										: __('Cannot be auto-resolved', 'kadence-blocks')}
								</span>
							</li>
						))}
					</ul>

					{hasUnsupported && (
						<p className="kadence-blocks-style-book__delete-primitive-blocked">
							{__(
								'Remove the unsupported references manually before deleting this color.',
								'kadence-blocks'
							)}
						</p>
					)}
				</div>
			)}

			<div className="kadence-blocks-style-book__delete-primitive-actions">
				<Button
					variant="primary"
					isDestructive
					onClick={handleConfirm}
					disabled={!canDelete || isFetching || isBusy}
					isBusy={isBusy}
				>
					{__('Delete', 'kadence-blocks')}
				</Button>
				<Button variant="tertiary" onClick={onClose}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
				<SaveStatus status={saveStatus.status} error={saveStatus.error} />
			</div>
		</Modal>
	);
}
