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
import { useState, useCallback } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';
import { size, get } from 'lodash';
import {
	useEntityBlockEditor,
	useEntityProp,
} from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/block-editor';
import {
	KadencePanelBody,
	InspectorControlTabs,
	URLInputControl,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer
} from '@kadence/components';
import {
	getPreviewSize,
	KadenceColorOutput,
	getSpacingOptionOutput,
	mouseOverVisualizer
} from '@kadence/helpers';

import {
	useBlockProps,
	RichText,
	BlockAlignmentControl,
	InspectorControls,
	BlockControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

import {
	FieldStyles,
	SpamOptions,
	SubmitActionOptions,
	SubmitButtonStyles,
	LabelOptions,
	HelpTextOptions,
	MailerLiteOptions,
	FluentCrmOptions,
	SendinBlueOptions,
	MailchimpOptions,
	ConvertKitOptions,
	ActiveCampaignOptions,
	FormTitle,
	WebhookOptions,
	AutoEmailOptions,
	DbEntryOptions,
	BackendStyles,
	MessageOptions,
} from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';

export function EditInner( props ) {

	const {
		attributes,
		setAttributes,
		className,
		previewDevice,
		clientId,
		direct,
		id,
	} = props;

	const {
		uniqueID,
	} = attributes;

	const ALLOWED_BLOCKS = [ 'kadence/advancedheading', 'core/paragraph', 'kadence/spacer' ];

	const [ marginControl, setMarginControl ] = useState( 'individual' );
	const [ paddingControl, setPaddingControl ] = useState( 'individual' );
	const [ activeTab, setActiveTab ] = useState( 'general' );

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const [ marginDesktop, setMarginDesktop ] = useFormMeta( '_kad_form_marginDesktop' );
	const [ marginTablet, setMarginTablet ] = useFormMeta( '_kad_form_marginTablet' );
	const [ marginMobile, setMarginMobile ] = useFormMeta( '_kad_form_marginMobile' );
	const [ marginUnit, setMarginUnit ] = useFormMeta( '_kad_form_marginUnit' );

	const [ paddingDesktop, setPaddingDesktop ] = useFormMeta( '_kad_form_paddingDesktop' );
	const [ paddingTablet, setPaddingTablet ] = useFormMeta( '_kad_form_paddingTablet' );
	const [ paddingMobile, setPaddingMobile ] = useFormMeta( '_kad_form_paddingMobile' );
	const [ paddingUnit, setPaddingUnit ] = useFormMeta( '_kad_form_paddingUnit' );

	const [ email, setEmail ] = useFormMeta( '_kad_form_email' );
	const [ actions, setActions ] = useFormMeta( '_kad_form_actions' );
	const [ mailerlite, setMailerlite ] = useFormMeta( '_kad_form_mailerlite' );
	const [ fluentcrm, setFluentcrm ] = useFormMeta( '_kad_form_fluentcrm' );
	const [ sendinblue, setSendinblue ] = useFormMeta( '_kad_form_sendinblue' );
	const [ mailchimp, setMailchimp ] = useFormMeta( '_kad_form_mailchimp' );
	const [ convertkit, setConvertkit ] = useFormMeta( '_kad_form_convertkit' );
	const [ activecampaign, setActivecampaign ] = useFormMeta( '_kad_form_activecampaign' );

	const [ redirect, setRedirect ] = useFormMeta( '_kad_form_redirect' );
	const [ honeyPot, setHoneyPot ] = useFormMeta( '_kad_form_honeyPot' );
	const [ single, setSingle ] = useFormMeta( '_kad_form_single' );
	const [ recaptcha, setRecaptcha ] = useFormMeta( '_kad_form_recaptcha' );
	const [ recaptchaVersion, setRecaptchaVersion ] = useFormMeta( '_kad_form_recaptchaVersion' );

	const [ submit, setSubmit ] = useFormMeta( '_kad_form_submit' );
	const [ submitLabel, setSubmitLabel ] = useFormMeta( '_kad_form_submitLabel' );

	const [ webhook, setWebhook ] = useFormMeta( '_kad_form_webhook' );
	const [ autoEmail, setAutoEmail ] = useFormMeta( '_kad_form_autoEmail' );
	const [ entry, setEntry ] = useFormMeta( '_kad_form_entry' );
	const [ messages, setMessages ] = useFormMeta( '_kad_form_messages' );
	const [ messageFont, setMessageFont ] = useFormMeta( '_kad_form_messageFont' );

	const [ submitFont, setSubmitFont ] = useFormMeta( '_kad_form_submitFont' );
	const [ submitMargin, setSubmitMargin ] = useFormMeta( '_kad_form_submitMargin' );
	const [ labelFont, setLabelFont ] = useFormMeta( '_kad_form_labelFont' );

	const [ style, setStyle ] = useFormMeta( '_kad_form_style' );
	const [ helpFont, setHelpFont ] = useFormMeta( '_kad_form_helpFont' );
	const [ meta, setMeta ] = useFormProp( 'meta' );

	const setMetaAttribute = ( value, key ) => {
		let keyPrefix = '_kad_form_';

		setMeta( { ...meta, [keyPrefix + key]: value } );
	};

	const align = '';

	let btnBG;
	let btnGrad;
	let btnGrad2;
	if ( undefined !== submit.backgroundType && 'gradient' === submit.backgroundType ) {
		btnGrad = ( undefined === submit.background ? 'rgba(255,255,255,0)' : KadenceColorOutput( submit.background, ( submit.backgroundOpacity !== undefined ? submit.backgroundOpacity : 1 ) ) );
		btnGrad2 = ( undefined !== submit.gradient && undefined !== submit.gradient[ 0 ] && '' !== submit.gradient[ 0 ] ? KadenceColorOutput( submit.gradient[ 0 ], ( undefined !== submit.gradient && submit.gradient[ 1 ] !== undefined ? submit.gradient[ 1 ] : 1 ) ) : KadenceColorOutput( '#999999', ( undefined !== submit.gradient && submit.gradient[ 1 ] !== undefined ? submit.gradient[ 1 ] : 1 ) ) );
		if ( undefined !== submit.gradient && 'radial' === submit.gradient[ 4 ] ) {
			btnBG = `radial-gradient(at ${( undefined === submit.gradient[ 6 ] ? 'center center' : submit.gradient[ 6 ] )}, ${btnGrad} ${( undefined === submit.gradient[ 2 ] ? '0' : submit.gradient[ 2 ] )}%, ${btnGrad2} ${( undefined === submit.gradient[ 3 ] ? '100' : submit.gradient[ 3 ] )}%)`;
		} else if ( undefined === submit.gradient || 'radial' !== submit.gradient[ 4 ] ) {
			btnBG = `linear-gradient(${( undefined !== submit.gradient && undefined !== submit.gradient[ 5 ] ? submit.gradient[ 5 ] : '180' )}deg, ${btnGrad} ${( undefined !== submit.gradient && undefined !== submit.gradient[ 2 ] ? submit.gradient[ 2 ] : '0' )}%, ${btnGrad2} ${( undefined !== submit.gradient && undefined !== submit.gradient[ 3 ] ? submit.gradient[ 3 ] : '100' )}%)`;
		}
	} else {
		btnBG = ( undefined === submit.background ? undefined : KadenceColorOutput( submit.background, ( submit.backgroundOpacity !== undefined ? submit.backgroundOpacity : 1 ) ) );
	}

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 0 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 0 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 1 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 1 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 2 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 2 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 3 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 3 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 0 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 0 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 1 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 1 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 2 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 2 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 3 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 3 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 3 ] : '' ) );

	const previewSubmitFontSize = getPreviewSize( previewDevice, submitFont.size[ 0 ], submitFont.size[ 1 ], submitFont.size[ 2 ] );
	const previewSubmitFontSizeType = submitFont.sizeType;

	const containerClasses = classnames( {
		'wp-block-kadence-advanced-form'          : true,
		[ `wp-block-kadence-advanced-form_${id}` ]: true,
	} );

	const submitClasses = classnames( {
		'kb-advanced-form-submit-container'             : true,
		[ `kb-field-desk-width-${submit.width[ 0 ]}` ]  : true,
		[ `kb-field-tablet-width-${submit.width[ 1 ]}` ]: submit.width[ 1 ] !== '',
		[ `kb-field-mobile-width-${submit.width[ 2 ]}` ]: submit.width[ 2 ] !== '',
	} );

	const { hasChildBlocks } = useSelect(
		( select ) => ( {
			hasChildBlocks: select( editorStore ).getBlockOrder( clientId ).length > 0,
		} ),
		[],
	);

	const [ title, setTitle ] = useFormProp( 'title' );

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'kadence_form',
		id,
	);

	let formFields = get( blocks, [ 0, 'innerBlocks' ], [] );
	let newBlock = get( blocks, [ 0 ], {} );

	if ( title === '' ) {
		return (
			<FormTitle
				setTitle={setTitle}
			/>
		);
	}

	return (
		<div>
			{/*<BlockControls group="block">*/}
			{/*	<BlockAlignmentControl*/}
			{/*		value={align}*/}
			{/*		onChange={( value ) => setMetaAttribute( { align: value } )}*/}
			{/*	/>*/}
			{/*</BlockControls>*/}
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
							<SubmitActionOptions setAttributes={setMetaAttribute} selectedActions={actions}/>
						</KadencePanelBody>


						<KadencePanelBody
							panelName={'kb-advanced-form-spam'}
							title={__( 'Spam Prevention', 'kadence-blocks' )}
							initialOpen={false}
						>
							<SpamOptions setAttributes={setMetaAttribute} honeyPot={honeyPot} recaptcha={recaptcha} recaptchaVersion={recaptchaVersion}/>
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
									onChange={( value ) => setMetaAttribute( { ...email, emailTo: value }, 'email' )}
									help={__( 'Seperate with comma for more then one email address.', 'kadence-blocks' )}
								/>
								<TextControl
									label={__( 'Email Subject', 'kadence-blocks' )}
									value={( undefined !== email.subject ? email.subject : '' )}
									onChange={( value ) => setMetaAttribute({ ...email, subject: value }, 'email' )}
								/>
								<TextControl
									label={__( 'From Email', 'kadence-blocks' )}
									value={( undefined !== email.fromEmail ? email.fromEmail : '' )}
									onChange={( value ) => setMetaAttribute( { ...email, fromEmail: value },'email')}
								/>
								<TextControl
									label={__( 'From Name', 'kadence-blocks' )}
									value={( undefined !== email.fromName ? email.fromName : '' )}
									onChange={( value ) => setMetaAttribute( { ...email, fromName: value }, 'email' )}
								/>
								<SelectControl
									label={__( 'Reply To', 'kadence-blocks' )}
									value={email.replyTo}
									options={[
										{ value: 'email_field', label: __( 'Email Field', 'kadence-blocks' ) },
										{ value: 'from_email', label: __( 'From Email', 'kadence-blocks' ) },
									]}
									onChange={value => {
										setMetaAttribute( { ...email, replyTo: value }, 'email' );
									}}
								/>
								<TextControl
									label={__( 'Cc', 'kadence-blocks' )}
									value={( undefined !== email.cc ? email.cc : '' )}
									onChange={( value ) => setMetaAttribute( { ...email, cc: value }, 'email' )}
								/>
								<TextControl
									label={__( 'Bcc', 'kadence-blocks' )}
									value={( undefined !== email.bcc ? email.bcc : '' )}
									onChange={( value ) => setMetaAttribute( { ...email, bcc: value }, 'email' )}
								/>
								<ToggleControl
									label={__( 'Send as HTML email?', 'kadence-blocks' )}
									help={__( 'If off plain text is used.', 'kadence-blocks' )}
									checked={( undefined !== email.html ? email.html : true )}
									onChange={( value ) => setMetaAttribute( { ...email, html: value }, 'email' )}
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
									onChangeUrl={value => setMetaAttribute( value, 'redirect' )}
									additionalControls={false}
								/>
							</KadencePanelBody>
						)}

						{actions.includes( 'mailerlite' ) && (
							<MailerLiteOptions
								parentClientId={clientId}
								settings={mailerlite}
								save={( value ) => { setMetaAttribute({ ...mailerlite, ...value }, 'mailerlite' ); }}
							/>
						)}

						{actions.includes( 'fluentCRM' ) && (
							<FluentCrmOptions
								parentClientId={clientId}
								settings={fluentcrm}
								save={( value ) => setMetaAttribute( { ...fluentcrm, ...value }, 'fluentcrm' )}
							/>
						)}

						{actions.includes( 'sendinblue' ) && (
							<SendinBlueOptions
								parentClientId={clientId}
								settings={sendinblue}
								save={( value ) => setMetaAttribute( { ...sendinblue, ...value }, 'sendinblue' )}
							/>
						)}

						{actions.includes( 'mailchimp' ) && (
							<MailchimpOptions
								parentClientId={clientId}
								settings={mailchimp}
								save={( value ) => setMetaAttribute( { ...mailchimp, ...value }, 'mailchimp' )}
							/>
						)}

						{actions.includes( 'convertkit' ) && (
							<ConvertKitOptions
								parentClientId={clientId}
								settings={convertkit}
								save={( value ) => setMetaAttribute( { ...convertkit, ...value }, 'convertkit' )}
							/>
						)}

						{actions.includes( 'activecampaign' ) && (
							<ActiveCampaignOptions
								parentClientId={clientId}
								settings={activecampaign}
								save={( value ) => setMetaAttribute( { ...activecampaign, ...value }, 'activecampaign' )}
							/>
						)}

						{actions.includes( 'webhook' ) && (
							<WebhookOptions
								parentClientId={clientId}
								settings={webhook}
								save={( value ) => setMetaAttribute( { ...webhook, ...value }, 'webhook' )}
							/>
						)}

						{actions.includes( 'autoEmail' ) && (
							<AutoEmailOptions
								settings={autoEmail}
								save={( value ) => setMetaAttribute( { ...autoEmail, ...value }, 'autoEmail' )}
							/>
						)}

						{actions.includes( 'entry' ) && (
							<DbEntryOptions
								settings={entry}
								save={( value ) => setMetaAttribute( { ...entry, ...value }, 'entry' )}
							/>
						)}

					</>
				}

				{( activeTab === 'style' ) &&
					<>

						<KadencePanelBody
							title={__( 'Fields', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-form-field-styles'}
						>
							<FieldStyles setAttributes={setMetaAttribute} style={style}/>
						</KadencePanelBody>

						{/* Label Styles*/}
						<KadencePanelBody
							title={__( 'Labels', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-label-styles'}
						>
							<LabelOptions styleAttribute={style} setAttributes={setMetaAttribute} labelFont={labelFont}/>
						</KadencePanelBody>

						{/* Help Text Styles*/}
						<KadencePanelBody
							title={__( 'Help Text', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-help-styles'}
						>
							<HelpTextOptions setAttributes={setMetaAttribute} helpFont={helpFont}/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Submit Button', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-submit-styles'}
						>
							<SubmitButtonStyles setAttributes={setMetaAttribute} submit={submit} submitFont={submitFont} submitMargin={submitMargin} submitLabel={submitLabel}/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Message Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-message'}
						>
							<MessageOptions setAttributes={setMetaAttribute} messages={messages} messageFont={messageFont} recaptcha={recaptcha}/>
						</KadencePanelBody>
					</>
				}

				{( activeTab === 'advanced' ) &&
					<>
						<KadencePanelBody
							panelName={'kb-advanced-form-size'}
							title={__( 'Spacing', 'kadence-blocks' )}
							initialOpen={true}
						>
							<ResponsiveMeasureRangeControl
								label={__( 'Padding', 'kadence-blocks' )}
								value={ paddingDesktop }
								tabletValue={ paddingTablet }
								mobileValue={ paddingMobile }
								onChange={( value ) => {
									setMetaAttribute( value, 'paddingDesktop' )
								}}
								onChangeTablet={( value ) => {
									setMetaAttribute( value, 'paddingTablet' )
								}}
								onChangeMobile={( value ) => {
									setMetaAttribute( value, 'paddingMobile' )
								}}
								min={ 0 }
								max={ ( paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200 ) }
								step={ ( paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1 ) }
								unit={ paddingUnit }
								units={[ 'px', 'em', 'rem', '%' ]}
								onUnit={( value ) => setMetaAttribute( value, 'paddingUnit' ) }
								onMouseOver={ paddingMouseOver.onMouseOver }
								onMouseOut={ paddingMouseOver.onMouseOut }
							/>
							<ResponsiveMeasureRangeControl
								label={__( 'Margin', 'kadence-blocks' )}
								value={ marginDesktop }
								tabletValue={ marginTablet }
								mobileValue={ marginMobile }
								onChange={( value ) => {
									setMetaAttribute( value, 'marginDesktop' );
								}}
								onChangeTablet={( value ) => {
									setMetaAttribute( value, 'marginTablet' )
								}}
								onChangeMobile={( value ) => {
									setMetaAttribute( value, 'marginMobile' )
								}}
								min={ ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 ) }
								max={ ( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 ) }
								step={ ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 ) }
								unit={ marginUnit }
								units={[ 'px', 'em', 'rem', '%', 'vh' ]}
								onUnit={( value ) => setMetaAttribute( value, 'marginUnit' ) }
								onMouseOver={ marginMouseOver.onMouseOver }
								onMouseOut={ marginMouseOver.onMouseOut }
							/>
						</KadencePanelBody>
					</>
				}

			</InspectorControls>
			<BackendStyles id={id} previewDevice={previewDevice} fieldStyle={style} labelStyle={labelFont} helpStyle={helpFont}/>

			<div className={containerClasses} style={
				{
					marginTop   : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),
					marginRight : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),
					marginBottom: ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),
					marginLeft  : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),

					paddingTop   : ( '' !== previewPaddingTop ? getSpacingOptionOutput( previewPaddingTop, paddingUnit ) : undefined ),
					paddingRight : ( '' !== previewPaddingRight ? getSpacingOptionOutput( previewPaddingRight, paddingUnit ) : undefined ),
					paddingBottom: ( '' !== previewPaddingBottom ? getSpacingOptionOutput( previewPaddingBottom, paddingUnit ) : undefined ),
					paddingLeft  : ( '' !== previewPaddingLeft ? getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) : undefined ),
				}}
			>
				{( direct ) ?
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						renderAppender={(
							hasChildBlocks ?
								undefined :
								() => <InnerBlocks.ButtonBlockAppender/>
						)}
					/>
					:
					<InnerBlocks
						value={formFields}
						onInput={( a, b ) => onInput( [ { ...newBlock, innerBlocks: a } ], b )}
						onChange={( a, b ) => onChange( [ { ...newBlock, innerBlocks: a } ], b )}
						allowedBlocks={ALLOWED_BLOCKS}
						renderAppender={(
							size( formFields ) ?
								undefined :
								() => <InnerBlocks.ButtonBlockAppender/>
						)}
					/>
				}

				<div className={submitClasses}>
					<RichText
						tagName="div"
						placeholder={__( 'Submit' )}
						value={submit.label}
						onChange={value => {
							setMetaAttribute( { ...submit, label: value }, 'submit' );
						}}
						allowedFormats={applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] )}
						className={`kb-advanced-form-submit kb-button-size-${submit.size} kb-button-width-${submit.widthType}`}
						style={{
							background       : ( undefined !== btnBG ? btnBG : undefined ),
							color            : ( undefined !== submit.color ? KadenceColorOutput( submit.color ) : undefined ),
							fontSize         : previewSubmitFontSize + previewSubmitFontSizeType,
							lineHeight       : ( submitFont.lineHeight && submitFont.lineHeight[ 0 ] ? submitFont.lineHeight[ 0 ] + submitFont.lineType : undefined ),
							fontWeight       : submitFont.weight,
							fontStyle        : submitFont.style,
							letterSpacing    : submitFont.letterSpacing + 'px',
							textTransform    : ( submitFont.textTransform ? submitFont.textTransform : undefined ),
							fontFamily       : ( submitFont.family ? submitFont.family : '' ),
							borderRadius     : ( undefined !== submit.borderRadius ? submit.borderRadius + 'px' : undefined ),
							borderColor      : ( undefined === submit.border ? undefined : KadenceColorOutput( submit.border, ( submit.borderOpacity !== undefined ? submit.borderOpacity : 1 ) ) ),
							width            : ( undefined !== submit.widthType && 'fixed' === submit.widthType && undefined !== submit.fixedWidth && undefined !== submit.fixedWidth[ 0 ] ? submit.fixedWidth[ 0 ] + 'px' : undefined ),
							paddingTop       : ( 'custom' === submit.size && '' !== submit.deskPadding[ 0 ] ? submit.deskPadding[ 0 ] + 'px' : undefined ),
							paddingRight     : ( 'custom' === submit.size && '' !== submit.deskPadding[ 1 ] ? submit.deskPadding[ 1 ] + 'px' : undefined ),
							paddingBottom    : ( 'custom' === submit.size && '' !== submit.deskPadding[ 2 ] ? submit.deskPadding[ 2 ] + 'px' : undefined ),
							paddingLeft      : ( 'custom' === submit.size && '' !== submit.deskPadding[ 3 ] ? submit.deskPadding[ 3 ] + 'px' : undefined ),
							borderTopWidth   : ( submit.borderWidth && '' !== submit.borderWidth[ 0 ] ? submit.borderWidth[ 0 ] + 'px' : undefined ),
							borderRightWidth : ( submit.borderWidth && '' !== submit.borderWidth[ 1 ] ? submit.borderWidth[ 1 ] + 'px' : undefined ),
							borderBottomWidth: ( submit.borderWidth && '' !== submit.borderWidth[ 2 ] ? submit.borderWidth[ 2 ] + 'px' : undefined ),
							borderLeftWidth  : ( submit.borderWidth && '' !== submit.borderWidth[ 3 ] ? submit.borderWidth[ 3 ] + 'px' : undefined ),
							boxShadow        : ( undefined !== submit.boxShadow && undefined !== submit.boxShadow[ 0 ] && submit.boxShadow[ 0 ] ? ( undefined !== submit.boxShadow[ 7 ] && submit.boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== submit.boxShadow[ 3 ] ? submit.boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== submit.boxShadow[ 4 ] ? submit.boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== submit.boxShadow[ 5 ] ? submit.boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== submit.boxShadow[ 6 ] ? submit.boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== submit.boxShadow[ 1 ] ? submit.boxShadow[ 1 ] : '#000000' ), ( undefined !== submit.boxShadow[ 2 ] ? submit.boxShadow[ 2 ] : 1 ) ) : undefined ),
							marginTop        : ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && undefined !== submitMargin[ 0 ].desk && '' !== submitMargin[ 0 ].desk[ 0 ] ? submitMargin[ 0 ].desk[ 0 ] + marginUnit : undefined ),
							marginRight      : ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && undefined !== submitMargin[ 0 ].desk && '' !== submitMargin[ 0 ].desk[ 1 ] ? submitMargin[ 0 ].desk[ 1 ] + marginUnit : undefined ),
							marginBottom     : ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && undefined !== submitMargin[ 0 ].desk && '' !== submitMargin[ 0 ].desk[ 2 ] ? submitMargin[ 0 ].desk[ 2 ] + marginUnit : undefined ),
							marginLeft       : ( undefined !== submitMargin && undefined !== submitMargin[ 0 ] && undefined !== submitMargin[ 0 ].desk && '' !== submitMargin[ 0 ].desk[ 3 ] ? submitMargin[ 0 ].desk[ 3 ] + marginUnit : undefined ),
						}}
					/>
				</div>
			</div>

			<SpacingVisualizer
				style={ {
					marginLeft: ( undefined !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),
					marginRight: ( undefined !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),
					marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),
					marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),
				} }
				type="inside"
				forceShow={ paddingMouseOver.isMouseOver }
				spacing={ [ getSpacingOptionOutput( previewPaddingTop, paddingUnit ), getSpacingOptionOutput( previewPaddingRight, paddingUnit ), getSpacingOptionOutput( previewPaddingBottom, paddingUnit ), getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) ] }
			/>
			<SpacingVisualizer
				type="inside"
				forceShow={ marginMouseOver.isMouseOver }
				spacing={ [ getSpacingOptionOutput( previewMarginTop, marginUnit ), getSpacingOptionOutput( previewMarginRight, marginUnit ), getSpacingOptionOutput( previewMarginBottom, marginUnit ), getSpacingOptionOutput( previewMarginLeft, marginUnit ) ] }
			/>

		</div>
	);
}

export default ( EditInner );

function useFormProp( prop ) {
	return useEntityProp( 'postType', 'kadence_form', prop );
}

function useFormMeta( key ) {
	const [ meta, setMeta ] = useFormProp( 'meta' );

	return [
		meta[ key ],
		useCallback(
			( newValue ) => {
				setMeta( { ...meta, [ key ]: newValue } );
			},
			[ key, setMeta ],
		),
	];
}
