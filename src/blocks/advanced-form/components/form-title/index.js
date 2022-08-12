/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { advancedFormIcon } from '@kadence/icons';

export default function FormTitle( {
									   setTitle,
								   } ) {

	const [ tmpTitle, setTmpTitle ] = useState( '' );

	return (
		<Placeholder
			className="kb-select-or-create-placeholder"
			icon={advancedFormIcon}
			label={__( 'Kadence Form', 'kadence-form' )}
		>
			<form className="kb-select-or-create-placeholder__actions">
				<TextControl
					label={__( 'Give your form a title', 'kadence-blocks' )}
					placeholder={__( 'Contact Us', 'kadence-blocks' )}
					value={tmpTitle}
					onChange={setTmpTitle}
				/>

				<Button
					isPrimary
					type="submit"
					disabled={tmpTitle === ''}
					onClick={() => setTitle( tmpTitle )}
				>
					{__( 'Create', 'kadence-blocks' )}
				</Button>
			</form>
		</Placeholder>
	);
}
