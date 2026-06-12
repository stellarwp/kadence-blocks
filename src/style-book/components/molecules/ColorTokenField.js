/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Button, ColorPicker, Dropdown, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { fromPickerColor, toPickerColor } from '../../helpers/colors';
import { SaveStatus } from '../atoms/SaveStatus';
import { TokenTypeBadge } from '../atoms/TokenTypeBadge';

/**
 * Color token row with a picker popover and hex input.
 *
 * @param {object}   props              Component props.
 * @param {object}   props.token        Token definition from the schema.
 * @param {string}   props.value        Current resolved value.
 * @param {Function} props.onSave       Async save handler.
 * @param {object}   props.fieldState   Save status for this field.
 * @return {JSX.Element} Color token field row.
 */
export function ColorTokenField({ token, value, onSave, fieldState }) {
	const [draft, setDraft] = useState(value ?? '');
	const isDirty = draft !== (value ?? '');
	const isSaving = fieldState.status === 'saving';

	useEffect(() => {
		setDraft(value ?? '');
	}, [value]);

	const handleSave = async (nextValue = draft) => {
		if (isSaving) {
			return;
		}

		await onSave(token.id, token.type, nextValue);
	};

	return (
		<div className="kadence-style-book__token-field kadence-style-book__token-field--color">
			<div className="kadence-style-book__token-field-meta">
				<Dropdown
					popoverProps={{ placement: 'bottom-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<button
							type="button"
							className="kadence-style-book__color-picker-toggle"
							style={{ backgroundColor: draft || '#ffffff' }}
							onClick={onToggle}
							aria-expanded={isOpen}
							aria-label={__('Open color picker', 'kadence-blocks')}
							disabled={isSaving}
						/>
					)}
					renderContent={() => (
						<div className="kadence-style-book__color-picker-popover">
							<ColorPicker
								color={toPickerColor(draft)}
								onChangeComplete={(color) => {
									const next = fromPickerColor(color);
									setDraft(next);
									void handleSave(next);
								}}
								enableAlpha={false}
							/>
						</div>
					)}
				/>
				<div className="kadence-style-book__token-field-labels">
					<strong className="kadence-style-book__token-label">{token.label}</strong>
					<code className="kadence-style-book__token-id">{token.id}</code>
				</div>
				<TokenTypeBadge type={token.type} />
			</div>

			<div className="kadence-style-book__token-field-controls">
				<TextControl
					className="kadence-style-book__token-input"
					label={__('Hex value', 'kadence-blocks')}
					value={draft}
					onChange={setDraft}
					onBlur={() => {
						if (isDirty && !isSaving) {
							void handleSave();
						}
					}}
					disabled={isSaving}
					help={token.cssVar}
				/>
				<Button
					variant="secondary"
					onClick={() => void handleSave()}
					disabled={!isDirty || isSaving}
					isBusy={isSaving}
				>
					{__('Save', 'kadence-blocks')}
				</Button>
				<SaveStatus status={fieldState.status} error={fieldState.error} />
			</div>
		</div>
	);
}
