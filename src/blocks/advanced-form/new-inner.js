/**
 * BLOCK: Kadence Block Template
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { size } from 'lodash';
import { useEffect, useCallback } from '@wordpress/element';

import {
	ResponsiveMeasurementControls,
	KadencePanelBody,
	InspectorControlTabs,
	URLInputControl,
} from '@kadence/components';
import { getPreviewSize, KadenceColorOutput } from '@kadence/helpers';

import {
	useBlockProps,
	RichText,
	BlockAlignmentControl,
	store as blockEditorStore,
	InspectorControls,
	BlockControls,
	InnerBlocks,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';


import {
	FieldStyles,
	SpamOptions,
	SubmitActionOptions,
	SubmitButtonStyles,
	LabelOptions,
	HelpTextOptions,
	MailerLiteOptions,
	FluentCrmOptions
} from './components';
import {
	useEntityProp,
	EntityProvider,
} from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import classnames from 'classnames';

const ktUniqueIDs = [];

export function NewInner( props ) {

	const {
		attributes,
		setAttributes,
		className,
		previewDevice,
		clientId,
	} = props;

	const {
		uniqueID,
		align,
		paddingTablet,
		paddingDesktop,
		paddingMobile,
		paddingUnit,
		marginTablet,
		marginDesktop,
		marginMobile,
		marginUnit,
		actions,
		honeyPot,
		recaptcha,
		recaptchaVersion,
		submit,
		submitFont,
		submitMargin,
		submitLabel,
		style,
		labelFont,
		helpFont,
		email,
		redirect,
		mailerlite,
		fluentcrm
	} = attributes;

	const [ activeTab, setActiveTab ] = useState( 'general' );

	const blockProps = useBlockProps( {
		className: classnames( className, {
			'test': true,
		} ),
	} );

	const containerClasses = classnames( {
		'wp-block-kadence-form'               : true,
		[ `wp-block-kadence-form${uniqueID}` ]: uniqueID,
	} );

	const saveSubmit = ( value ) => {
		setAttributes( { submit: { ...submit, ...value } } );
	};

	return (
		<>
			<BlockControls group="block">
				<BlockAlignmentControl
					value={align}
					onChange={( value ) => setAttributes( { align: value } )}
				/>
			</BlockControls>
			<InspectorControls>

				<InspectorControlTabs
					panelName={'advanced-form'}
					setActiveTab={( value ) => setActiveTab( value )}
					activeTab={activeTab}
				/>


				{( activeTab === 'general' ) &&

					<>
						<KadencePanelBody
							panelName={'kb-advanced-form-submit-actions'}
							title={__( 'Submit Actions', 'kadence-blocks' )}
						>
							<SubmitActionOptions setAttributes={setAttributes} selectedActions={actions}/>
						</KadencePanelBody>


						<KadencePanelBody
							panelName={'kb-advanced-form-spam'}
							title={__( 'Spam Prevention', 'kadence-blocks' )}
							initialOpen={false}
						>
							<SpamOptions setAttributes={setAttributes} setHoneyPot={setHoneyPot} honeyPot={honeyPot} recaptcha={recaptcha} recaptchaVersion={recaptchaVersion}/>
						</KadencePanelBody>

						{size( actions ) > 0 && (
							<div className="kt-sidebar-settings-spacer"></div>
						)}

						{actions.includes( 'email' ) && (
							<KadencePanelBody
								title={__( 'Email Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={'kb-form-email-settings'}
							>
								<TextControl
									label={__( 'Email To Address', 'kadence-blocks' )}
									placeholder={__( 'name@example.com', 'kadence-blocks' )}
									value={( undefined !== email.emailTo ? email.emailTo : '' )}
									onChange={( value ) => setAttributes( { email: { ...email, emailTo: value } } )}
									help={__( 'Seperate with comma for more then one email address.', 'kadence-blocks' )}
								/>
								<TextControl
									label={__( 'Email Subject', 'kadence-blocks' )}
									value={( undefined !== email.subject ? email.subject : '' )}
									onChange={( value ) => setAttributes( { email: { ...email, subject: value } } )}
								/>
								<TextControl
									label={__( 'From Email', 'kadence-blocks' )}
									value={( undefined !== email.fromEmail ? email.fromEmail : '' )}
									onChange={( value ) => setAttributes( { email: { ...email, fromEmail: value } } )}
								/>
								<TextControl
									label={__( 'From Name', 'kadence-blocks' )}
									value={( undefined !== email.fromName ? email.fromName : '' )}
									onChange={( value ) => setAttributes( { email: { ...email, fromName: value } } )}
								/>
								<SelectControl
									label={__( 'Reply To', 'kadence-blocks' )}
									value={email.replyTo}
									options={[
										{ value: 'email_field', label: __( 'Email Field', 'kadence-blocks' ) },
										{ value: 'from_email', label: __( 'From Email', 'kadence-blocks' ) },
									]}
									onChange={value => {
										setAttributes( { email: { ...email, replyTo: value } } );
									}}
								/>
								<TextControl
									label={__( 'Cc', 'kadence-blocks' )}
									value={( undefined !== email.cc ? email.cc : '' )}
									onChange={( value ) => setAttributes( { email: { ...email, cc: value } } )}
								/>
								<TextControl
									label={__( 'Bcc', 'kadence-blocks' )}
									value={( undefined !== email.bcc ? email.bcc : '' )}
									onChange={( value ) => setAttributes( { email: { ...email, bcc: value } } )}
								/>
								<ToggleControl
									label={__( 'Send as HTML email?', 'kadence-blocks' )}
									help={__( 'If off plain text is used.', 'kadence-blocks' )}
									checked={( undefined !== email.html ? email.html : true )}
									onChange={( value ) => setAttributes( { email: { ...email, html: value } } )}
								/>
							</KadencePanelBody>
						)}

						{actions.includes( 'redirect' ) && (
							<KadencePanelBody
								title={__( 'Redirect Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={'kb-form-redirect-settings'}
							>
								<URLInputControl
									label={__( 'Redirect to', 'kadence-blocks' )}
									url={redirect}
									onChangeUrl={value => setAttributes( { redirect: value } )}
									additionalControls={false}
								/>
							</KadencePanelBody>
						)}

						{actions.includes( 'mailerlite' ) && (
							<MailerLiteOptions
								// fields={fields}
								fields={ [] }
								settings={mailerlite}
								save={ ( value ) => setAttributes( { mailerlite: { ...mailerlite, value } } )}
							/>
						)}

						{actions.includes( 'fluentCRM' ) && (
							<FluentCrmOptions
								// fields={fields}
								fields={ [] }
								settings={fluentcrm}
								save={( value ) => setAttributes( { fluentcrm: { ...fluentcrm, value } } )}
							/>
						)}

					</>
				}

			</InspectorControls>
			<div className={containerClasses}>
				<div className={'kb-form-wrap'}>

					<div className="kb-forms-submit-container">
						<RichText
							tagName="div"
							placeholder={__( 'Submit' )}
							value={submit.label}
							onChange={value => {
								saveSubmit( { label: value } );
							}}
							allowedFormats={applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] )}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default ( NewInner );
