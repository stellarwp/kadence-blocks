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
import { store as editorStore } from '@wordpress/editor';
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
} from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';

const ktUniqueIDs = [];

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

	const [ metaAttributes, setMetaAttributes ] = useFormMeta( 'kadence_form_attrs' );

	const parsedAttrs = JSON.parse( metaAttributes );

	const setMetaAttribute = ( value ) => {
		setMetaAttributes( JSON.stringify( { ...parsedAttrs, ...value } ) );
	};

	const saveSubmit = ( value ) => {
		setMetaAttributes( JSON.stringify( { ...parsedAttrs, submit: { ...parsedAttrs.submit, ...value } } ) );
	};

	const saveStyle = ( value ) => {
		setMetaAttributes( JSON.stringify( { ...parsedAttrs, style: { ...parsedAttrs.style, ...value } } ) );
	};

	const {
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
		fluentcrm,
		sendinblue,
		mailchimp,
		convertkit,
		activecampaign,
		webhook,
		autoEmail,
		entry,
	} = parsedAttrs;

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

	const blockProps = useBlockProps( {
		className: classnames( className, {
			'test': true,
		} ),
	} );

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 0 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 0 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 1 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 1 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 2 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 2 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 3 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 3 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 0 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 0 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 1 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 1 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 2 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 2 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 3 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 3 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 3 ] : '' ) );

	const previewSubmitFontSize = getPreviewSize( previewDevice, submitFont[ 0 ].size[ 0 ], submitFont[ 0 ].size[ 1 ], submitFont[ 0 ].size[ 2 ] );
	const previewSubmitFontSizeType = submitFont[ 0 ].sizeType;

	const containerClasses = classnames( {
		'wp-block-kadence-form': true,
	} );

	const { hasChildBlocks } = useSelect(
		( select ) => ( {
			hasChildBlocks: select( editorStore ).getBlockOrder( clientId ).length > 0,
		} ),
		[],
	);

	const [ title, setTitle ] = useFormProp( 'title' );

	const ShowFields = ( id ) => {

		const [ blocks, onInput, onChange ] = useEntityBlockEditor(
			'postType',
			'kadence_form',
			id,
		);

		let formFields = get( blocks, [ 0, 'innerBlocks' ], [] );
		let newBlock = get( blocks, [ 0 ], {} );

		return (
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
		);
	}

	if ( title === '' ) {
		return (
			<FormTitle
				setTitle={setTitle}
			/>
		);
	}

	return (
		<div {...blockProps}>
			<BlockControls group="block">
				<BlockAlignmentControl
					value={align}
					onChange={( value ) => setMetaAttribute( { align: value } )}
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
									onChange={( value ) => setMetaAttribute( { email: { ...email, emailTo: value } } )}
									help={__( 'Seperate with comma for more then one email address.', 'kadence-blocks' )}
								/>
								<TextControl
									label={__( 'Email Subject', 'kadence-blocks' )}
									value={( undefined !== email.subject ? email.subject : '' )}
									onChange={( value ) => setMetaAttribute( { email: { ...email, subject: value } } )}
								/>
								<TextControl
									label={__( 'From Email', 'kadence-blocks' )}
									value={( undefined !== email.fromEmail ? email.fromEmail : '' )}
									onChange={( value ) => setMetaAttribute( { email: { ...email, fromEmail: value } } )}
								/>
								<TextControl
									label={__( 'From Name', 'kadence-blocks' )}
									value={( undefined !== email.fromName ? email.fromName : '' )}
									onChange={( value ) => setMetaAttribute( { email: { ...email, fromName: value } } )}
								/>
								<SelectControl
									label={__( 'Reply To', 'kadence-blocks' )}
									value={email.replyTo}
									options={[
										{ value: 'email_field', label: __( 'Email Field', 'kadence-blocks' ) },
										{ value: 'from_email', label: __( 'From Email', 'kadence-blocks' ) },
									]}
									onChange={value => {
										setMetaAttribute( { email: { ...email, replyTo: value } } );
									}}
								/>
								<TextControl
									label={__( 'Cc', 'kadence-blocks' )}
									value={( undefined !== email.cc ? email.cc : '' )}
									onChange={( value ) => setMetaAttribute( { email: { ...email, cc: value } } )}
								/>
								<TextControl
									label={__( 'Bcc', 'kadence-blocks' )}
									value={( undefined !== email.bcc ? email.bcc : '' )}
									onChange={( value ) => setMetaAttribute( { email: { ...email, bcc: value } } )}
								/>
								<ToggleControl
									label={__( 'Send as HTML email?', 'kadence-blocks' )}
									help={__( 'If off plain text is used.', 'kadence-blocks' )}
									checked={( undefined !== email.html ? email.html : true )}
									onChange={( value ) => setMetaAttribute( { email: { ...email, html: value } } )}
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
									onChangeUrl={value => setMetaAttribute( { redirect: value } )}
									additionalControls={false}
								/>
							</KadencePanelBody>
						)}

						{actions.includes( 'mailerlite' ) && (
							<MailerLiteOptions
								parentClientId={clientId}
								settings={mailerlite}
								save={( value ) => { setMetaAttribute( { mailerlite: { ...mailerlite, ...value } } ); }}
							/>
						)}

						{actions.includes( 'fluentCRM' ) && (
							<FluentCrmOptions
								parentClientId={clientId}
								settings={fluentcrm}
								save={( value ) => setMetaAttribute( { fluentcrm: { ...fluentcrm, ...value } } )}
							/>
						)}

						{actions.includes( 'sendinblue' ) && (
							<SendinBlueOptions
								parentClientId={clientId}
								settings={sendinblue}
								save={( value ) => setMetaAttribute( { sendinblue: { ...sendinblue, ...value } } )}
							/>
						)}

						{actions.includes( 'mailchimp' ) && (
							<MailchimpOptions
								parentClientId={clientId}
								settings={mailchimp}
								save={( value ) => setMetaAttribute( { mailchimp: { ...mailchimp, ...value } } )}
							/>
						)}

						{actions.includes( 'convertkit' ) && (
							<ConvertKitOptions
								parentClientId={clientId}
								settings={convertkit}
								save={( value ) => setMetaAttribute( { convertkit: { ...convertkit, ...value } } )}
							/>
						)}

						{actions.includes( 'activecampaign' ) && (
							<ActiveCampaignOptions
								parentClientId={clientId}
								settings={activecampaign}
								save={( value ) => setMetaAttribute( { activecampaign: { ...activecampaign, ...value } } )}
							/>
						)}

						{actions.includes( 'webhook' ) && (
							<WebhookOptions
								parentClientId={clientId}
								settings={webhook}
								save={( value ) => setMetaAttribute( { webhook: { ...webhook, ...value } } )}
							/>
						)}

						{actions.includes( 'autoEmail' ) && (
							<AutoEmailOptions
								settings={autoEmail}
								save={( value ) => setMetaAttribute( { autoEmail: { ...autoEmail, ...value } } )}
							/>
						)}

						{actions.includes( 'entry' ) && (
							<DbEntryOptions
								settings={entry}
								save={( value ) => setMetaAttribute( { entry: { ...entry, ...value } } )}
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
							<FieldStyles saveStyle={saveStyle} style={style}/>
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
							<SubmitButtonStyles saveSubmit={saveSubmit} setAttributes={setMetaAttribute} submit={submit} submitFont={submitFont} submitMargin={submitMargin} submitLabel={submitLabel}/>
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
							<ResponsiveMeasurementControls
								label={__( 'Padding', 'kadence-blocks' )}
								value={paddingDesktop}
								control={paddingControl}
								tabletValue={paddingTablet}
								mobileValue={paddingMobile}
								onChange={( value ) => setMetaAttribute( { paddingDesktop: value } )}
								onChangeTablet={( value ) => setMetaAttribute( { paddingTablet: value } )}
								onChangeMobile={( value ) => setMetaAttribute( { paddingMobile: value } )}
								onChangeControl={( value ) => setPaddingControl( value )}
								min={0}
								max={( paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200 )}
								step={( paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1 )}
								unit={paddingUnit}
								units={[ 'px', 'em', 'rem', '%' ]}
								onUnit={( value ) => setMetaAttribute( { paddingUnit: value } )}
							/>
							<ResponsiveMeasurementControls
								label={__( 'Margin', 'kadence-blocks' )}
								value={marginDesktop}
								control={marginControl}
								tabletValue={marginTablet}
								mobileValue={marginMobile}
								onChange={( value ) => {
									setMetaAttribute( { marginDesktop: value } );
								}}
								onChangeTablet={( value ) => setMetaAttribute( { marginTablet: value } )}
								onChangeMobile={( value ) => setMetaAttribute( { marginMobile: value } )}
								onChangeControl={( value ) => setMarginControl( value )}
								min={( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 )}
								max={( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 )}
								step={( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 )}
								unit={marginUnit}
								units={[ 'px', 'em', 'rem', '%', 'vh' ]}
								onUnit={( value ) => setMetaAttribute( { marginUnit: value } )}
							/>
						</KadencePanelBody>
					</>
				}

			</InspectorControls>
			<div className={containerClasses} style={
				{
					marginTop   : ( '' !== previewMarginTop ? previewMarginTop + marginUnit : undefined ),
					marginRight : ( '' !== previewMarginRight ? previewMarginRight + marginUnit : undefined ),
					marginBottom: ( '' !== previewMarginBottom ? previewMarginBottom + marginUnit : undefined ),
					marginLeft  : ( '' !== previewMarginLeft ? previewMarginLeft + marginUnit : undefined ),

					paddingTop   : ( '' !== previewPaddingTop ? previewPaddingTop + paddingUnit : undefined ),
					paddingRight : ( '' !== previewPaddingRight ? previewPaddingRight + paddingUnit : undefined ),
					paddingBottom: ( '' !== previewPaddingBottom ? previewPaddingBottom + paddingUnit : undefined ),
					paddingLeft  : ( '' !== previewPaddingLeft ? previewPaddingLeft + paddingUnit : undefined ),
				}}
			>
				<div className={'kb-form-wrap'}>

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
						<ShowFields id={id}/>
					}

					<div className="kb-forms-submit-container">
						<RichText
							tagName="div"
							placeholder={__( 'Submit' )}
							value={parsedAttrs.submit.label}
							onChange={value => {
								saveSubmit( { label: value } );
							}}
							allowedFormats={applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field' ] )}
							className={`kb-forms-submit kb-button-size-${submit.size} kb-button-width-${submit.widthType}`}
							style={{
								background       : ( undefined !== btnBG ? btnBG : undefined ),
								color            : ( undefined !== submit.color ? KadenceColorOutput( submit.color ) : undefined ),
								fontSize         : previewSubmitFontSize + previewSubmitFontSizeType,
								lineHeight       : ( submitFont[ 0 ].lineHeight && submitFont[ 0 ].lineHeight[ 0 ] ? submitFont[ 0 ].lineHeight[ 0 ] + submitFont[ 0 ].lineType : undefined ),
								fontWeight       : submitFont[ 0 ].weight,
								fontStyle        : submitFont[ 0 ].style,
								letterSpacing    : submitFont[ 0 ].letterSpacing + 'px',
								textTransform    : ( submitFont[ 0 ].textTransform ? submitFont[ 0 ].textTransform : undefined ),
								fontFamily       : ( submitFont[ 0 ].family ? submitFont[ 0 ].family : '' ),
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
			</div>
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
