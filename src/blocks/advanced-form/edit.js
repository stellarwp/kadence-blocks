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

/**
 * Internal dependencies
 */
import classnames from 'classnames';

const ktUniqueIDs = [];

export function Edit( {
						  attributes,
						  setAttributes,
						  className,
						  previewDevice,
						  clientId,
					  } ) {

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

	const ALLOWED_BLOCKS = [ 'kadence/advancedheading', 'core/paragraph', 'kadence/spacer' ];

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

	const [ marginControl, setMarginControl ] = useState( 'individual' );
	const [ paddingControl, setPaddingControl ] = useState( 'individual' );
	const [ activeTab, setActiveTab ] = useState( 'general' );

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

	if ( !uniqueID ) {
		const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
		if ( blockConfigObject[ 'kadence/block-template' ] !== undefined && typeof blockConfigObject[ 'kadence/block-template' ] === 'object' ) {
			Object.keys( blockConfigObject[ 'kadence/block-template' ] ).map( ( attribute ) => {
				uniqueID = blockConfigObject[ 'kadence/block-template' ][ attribute ];
			} );
		}
		setAttributes( {
			uniqueID: '_' + clientId.substr( 2, 9 ),
		} );
		ktUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
	} else if ( ktUniqueIDs.includes( uniqueID ) ) {
		setAttributes( {
			uniqueID: '_' + clientId.substr( 2, 9 ),
		} );
		ktUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
	} else {
		ktUniqueIDs.push( uniqueID );
	}
	const containerClasses = classnames( {
		'wp-block-kadence-form'               : true,
		[ `wp-block-kadence-form${uniqueID}` ]: uniqueID,
	} );

	const saveSubmit = ( value ) => {
		setAttributes( { submit: { ...submit, ...value } } );
	};

	const saveStyle = ( value ) => {
		setAttributes( { style: { ...style, ...value } } );
	};

	return (
		<div {...blockProps}>
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
							<SpamOptions setAttributes={setAttributes} honeyPot={honeyPot} recaptcha={recaptcha} recaptchaVersion={recaptchaVersion}/>
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

				{( activeTab === 'style' ) &&
					<>
						<KadencePanelBody
							panelName={'kb-advanced-form-size'}
							title={__( 'Container Spacing', 'kadence-blocks' )}
						>
							<ResponsiveMeasurementControls
								label={__( 'Padding', 'kadence-blocks' )}
								value={paddingDesktop}
								control={paddingControl}
								tabletValue={paddingTablet}
								mobileValue={paddingMobile}
								onChange={( value ) => setAttributes( { paddingDesktop: value } )}
								onChangeTablet={( value ) => setAttributes( { paddingTablet: value } )}
								onChangeMobile={( value ) => setAttributes( { paddingMobile: value } )}
								onChangeControl={( value ) => setPaddingControl( value )}
								min={0}
								max={( paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200 )}
								step={( paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1 )}
								unit={paddingUnit}
								units={[ 'px', 'em', 'rem', '%' ]}
								onUnit={( value ) => setAttributes( { paddingUnit: value } )}
							/>
							<ResponsiveMeasurementControls
								label={__( 'Margin', 'kadence-blocks' )}
								value={marginDesktop}
								control={marginControl}
								tabletValue={marginTablet}
								mobileValue={marginMobile}
								onChange={( value ) => {
									setAttributes( { marginDesktop: value } );
								}}
								onChangeTablet={( value ) => setAttributes( { marginTablet: value } )}
								onChangeMobile={( value ) => setAttributes( { marginMobile: value } )}
								onChangeControl={( value ) => setMarginControl( value )}
								min={( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 )}
								max={( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 )}
								step={( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 )}
								unit={marginUnit}
								units={[ 'px', 'em', 'rem', '%', 'vh' ]}
								onUnit={( value ) => setAttributes( { marginUnit: value } )}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Fields', 'kadence-blocks' )}
							initialOpen={false}
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
							<LabelOptions styleAttribute={style} setAttributes={setAttributes} labelFont={labelFont}/>
						</KadencePanelBody>

						{/* Help Text Styles*/}
						<KadencePanelBody
							title={__( 'Help', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-help-styles'}
						>
							<HelpTextOptions setAttributes={setAttributes} helpFont={helpFont}/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Submit', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-submit-styles'}
						>
							<SubmitButtonStyles saveSubmit={saveSubmit} setAttributes={setAttributes} submit={submit} submitFont={submitFont} submitMargin={submitMargin} submitLabel={submitLabel}/>
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

					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={false}
						renderAppender={InnerBlocks.ButtonBlockAppender}/>


					<div className="kb-forms-submit-container">
						<RichText
							tagName="div"
							placeholder={__( 'Submit' )}
							value={submit.label}
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

export default ( Edit );
