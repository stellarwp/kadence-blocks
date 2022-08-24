import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import {
	ToggleControl,
	ButtonGroup,
	Button,
	ExternalLink,
	TextControl
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

export default function SpamOptions( { setAttributes, honeyPot, recaptcha, recaptchaVersion} ) {

	const RETRIEVE_KEY_URL = 'https://g.co/recaptcha/v3';
	const HELP_URL = 'https://developers.google.com/recaptcha/docs/v3';

	const [ isSaving, setIsSaving ] = useState( false ) ;
	const [ isSavedKey, setIsSavedKey ] = useState( false ) ;

	const [ siteKey, setSiteKey ] = useState( '' ) ;
	const [ siteSecret, setSiteSecret ] = useState( '' ) ;


	const saveKeys = () => {
		setIsSaving( true );

		const settingModel = new wp.api.models.Settings( {
			kadence_blocks_recaptcha_site_key: siteKey,
			kadence_blocks_recaptcha_secret_key: siteSecret,
		} );

		settingModel.save().then( response => {
			setIsSaving( false );
			setIsSavedKey(  true );
		} );
	}

	const removeKeys = () => {
		setSiteKey( '' );
		setSiteSecret( '' );

		if ( isSavedKey ) {
			setIsSaving( true );

			const settingModel = new wp.api.models.Settings( {
				kadence_blocks_recaptcha_site_key: '',
				kadence_blocks_recaptcha_secret_key: '',
			} );
			settingModel.save().then( () => {
				setIsSaving( false );
				setIsSavedKey(  false );
			} );
		}
	}

	useEffect( () => {
		let settings;
		wp.api.loadPromise.then( () => {
			settings = new wp.api.models.Settings();
			settings.fetch().then( response => {

				setSiteKey( response.kadence_blocks_recaptcha_site_key );
				setSiteSecret( response.kadence_blocks_recaptcha_secret_key );

				if ( '' !== response.kadence_blocks_recaptcha_site_key && '' !== response.kadence_blocks_recaptcha_secret_key ) {
					setIsSavedKey( true );
				}
			} );
		} );
	}, [ recaptcha ] );


	return (
		<>
			<ToggleControl
				label={ __( 'Enable Basic Honey Pot Spam Check', 'kadence-blocks' ) }
				help={ __( 'This adds a hidden field that if filled out prevents the form from submitting.', 'kadence-blocks' ) }
				checked={ honeyPot }
				onChange={ ( value ) => setAttributes( { honeyPot: value } ) }
			/>

			<hr/>

			<ToggleControl
				label={ __( 'Enable Google reCAPTCHA', 'kadence-blocks' ) }
				checked={ recaptcha }
				onChange={ ( value ) => setAttributes( { recaptcha: value } ) }
			/>

			{ recaptcha && (
				<>
					<div className="kt-btn-recaptch-settings-container components-base-control">
						<p className="kb-component-label">{ __( 'Recaptcha Version', 'kadence-blocks' ) }</p>
						<ButtonGroup className="kb-radio-button-flex-fill" aria-label={ __( 'Recaptcha Version', 'kadence-blocks' ) }>
							<Button
								key={ 'v2' }
								className="kt-btn-size-btn"
								isSmall
								isPrimary={ recaptchaVersion === 'v2' }
								aria-pressed={ recaptchaVersion === 'v2' }
								onClick={ () => setAttributes( { recaptchaVersion: 'v2' } ) }
							>
								{ __( 'V2', 'kadence-blocks' ) }
							</Button>
							<Button
								key={ 'v3' }
								className="kt-btn-size-btn"
								isSmall
								isPrimary={ recaptchaVersion === 'v3' }
								aria-pressed={ recaptchaVersion === 'v3' }
								onClick={ () => setAttributes( { recaptchaVersion: 'v3' } ) }
							>
								{ __( 'V3', 'kadence-blocks' ) }
							</Button>
						</ButtonGroup>
					</div>
					<p>
						<ExternalLink href={ RETRIEVE_KEY_URL }>{ __( 'Get keys', 'kadence-blocks' ) }</ExternalLink>
						|&nbsp;
						<ExternalLink href={ HELP_URL }>{ __( 'Get help', 'kadence-blocks' ) }</ExternalLink>
					</p>

					<TextControl
						label={ __( 'Site Key', 'kadence-blocks' ) }
						value={ siteKey }
						onChange={ value => setSiteKey( value ) }
					/>
					<TextControl
						label={ __( 'Secret Key', 'kadence-blocks' ) }
						value={ siteSecret }
						onChange={ value => setSiteSecret( value ) }
					/>

					<div className="components-base-control">
						<Button
							isPrimary
							onClick={ saveKeys }
							disabled={ '' === siteKey || '' === siteSecret }
						>
							{ isSaving ? __( 'Saving', 'kadence-blocks' ) : __( 'Save', 'kadence-blocks' ) }
						</Button>
						{ isSavedKey && (
							<>
								&nbsp;
								<Button
									variant={ 'secondary' }
									onClick={ removeKeys }
								>
									{ __( 'Remove', 'kadence-blocks' ) }
								</Button>
							</>
						) }
					</div>
				</>
			) }
		</>
	);

}
