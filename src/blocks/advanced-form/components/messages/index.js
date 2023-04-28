import { __ } from '@wordpress/i18n';
import {
	TextControl,
	PanelRow,
	RangeControl
} from '@wordpress/components';

export default function MessageOptions( { setAttributes, messages, recaptcha } ) {

	const saveMessages = ( value ) => {
		setAttributes( {  ...messages, ...value }, 'messages' );
	};

	return (
		<>
			<TextControl
				label={__( 'Success Message', 'kadence-blocks' )}
				placeholder={__( 'Submission Success, Thanks for getting in touch!', 'kadence-blocks' )}
				value={( undefined !== messages.success ? messages.success : '' )}
				onChange={( value ) => saveMessages( { success: value } )}
			/>
			<TextControl
				label={__( 'Pre Submit Form Validation Error Message', 'kadence-blocks' )}
				placeholder={__( 'Please fix the errors to proceed', 'kadence-blocks' )}
				value={( undefined !== messages.preError ? messages.preError : '' )}
				onChange={( value ) => saveMessages( { preError: value } )}
			/>
			<TextControl
				label={__( 'Error Message', 'kadence-blocks' )}
				placeholder={__( 'Submission Failed', 'kadence-blocks' )}
				value={( undefined !== messages.error ? messages.error : '' )}
				onChange={( value ) => saveMessages( { error: value } )}
			/>
			{recaptcha && (
				<TextControl
					label={__( 'Recapcha Error Message', 'kadence-blocks' )}
					placeholder={__( 'Submission Failed, reCaptcha spam prevention.', 'kadence-blocks' )}
					value={( undefined !== messages.recaptchaerror ? messages.recaptchaerror : '' )}
					onChange={( value ) => saveMessages( { recaptchaerror: value } )}
				/>
			)}
		</>
	);

}
