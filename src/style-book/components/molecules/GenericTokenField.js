/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SaveStatus } from '../atoms/SaveStatus';
import { TokenSwatch } from '../atoms/TokenSwatch';
import { TokenTypeBadge } from '../atoms/TokenTypeBadge';

/**
 * Text-based token row for non-color types.
 *
 * @param {object}   props              Component props.
 * @param {object}   props.token        Token definition from the schema.
 * @param {string}   props.value        Current resolved value.
 * @param {Function} props.onSave       Async save handler.
 * @param {object}   props.fieldState   Save status for this field.
 * @return {JSX.Element} Token field row.
 */
export function GenericTokenField( { token, value, onSave, fieldState } ) {
	const [ draft, setDraft ] = useState( value ?? '' );
	const isDirty = draft !== ( value ?? '' );
	const isSaving = fieldState.status === 'saving';

	useEffect( () => {
		setDraft( value ?? '' );
	}, [ value ] );

	const handleSave = async () => {
		if ( ! isDirty || isSaving ) {
			return;
		}

		await onSave( token.id, token.type, draft );
	};

	return (
		<div className="kadence-style-book__token-field">
			<div className="kadence-style-book__token-field-meta">
				<TokenSwatch type={ token.type } value={ draft } />
				<div className="kadence-style-book__token-field-labels">
					<strong className="kadence-style-book__token-label">{ token.label }</strong>
					<code className="kadence-style-book__token-id">{ token.id }</code>
				</div>
				<TokenTypeBadge type={ token.type } />
			</div>

			<div className="kadence-style-book__token-field-controls">
				<TextControl
					className="kadence-style-book__token-input"
					value={ draft }
					onChange={ setDraft }
					onBlur={ () => {
						if ( isDirty && ! isSaving ) {
							void handleSave();
						}
					} }
					disabled={ isSaving }
					help={ token.cssVar }
				/>
				<Button
					variant="secondary"
					onClick={ handleSave }
					disabled={ ! isDirty || isSaving }
					isBusy={ isSaving }
				>
					{ __( 'Save', 'kadence-blocks' ) }
				</Button>
				<SaveStatus status={ fieldState.status } error={ fieldState.error } />
			</div>
		</div>
	);
}
