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
import { useState, useCallback, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { size, get, isEqual } from 'lodash';
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
	SpacingVisualizer,
	ResponsiveRangeControls
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
	useInnerBlocksProps,
	BlockVerticalAlignmentControl,
	JustifyContentControl,
} from '@wordpress/block-editor';
import {
	TextControl,
	SelectControl,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';

import {
	FieldStyles,
	SubmitActionOptions,
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
	MessageStyling,
	getFormFields,
	FieldBlockAppender,
} from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { useEntityPublish } from './hooks';
const ALLOWED_BLOCKS = [ 'kadence/advancedheading', 'core/paragraph', 'kadence/spacer', 'kadence/rowlayout', 'kadence/column', 'kadence/advanced-form-text', 'kadence/advanced-form-textarea', 'kadence/advanced-form-select', 'kadence/advanced-form-submit', 'kadence/advanced-form-radio', 'kadence/advanced-form-file', 'kadence/advanced-form-time', 'kadence/advanced-form-date', 'kadence/advanced-form-telephone', 'kadence/advanced-form-checkbox', 'kadence/advanced-form-email', 'kadence/advanced-form-accept', 'kadence/advanced-form-number', 'kadence/advanced-form-hidden', 'kadence/advanced-form-captcha' ];

export function EditInner( props ) {

	const {
		attributes,
		setAttributes,
		className,
		clientId,
		direct,
		id,
		isSelected,
	} = props;
	const {
		uniqueID
	} = attributes;

	const { previewDevice } = useSelect(
		( select ) => {
			return {
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ],
	);

	const [ activeTab, setActiveTab ] = useState( 'general' );

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const [ fields ] = useFormMeta( '_kad_form_fields' )
	const [ email ] = useFormMeta( '_kad_form_email' );
	const [ actions ] = useFormMeta( '_kad_form_actions' );
	const [ mailerlite ] = useFormMeta( '_kad_form_mailerlite' );
	const [ fluentcrm ] = useFormMeta( '_kad_form_fluentcrm' );
	const [ sendinblue ] = useFormMeta( '_kad_form_sendinblue' );
	const [ mailchimp ] = useFormMeta( '_kad_form_mailchimp' );
	const [ convertkit ] = useFormMeta( '_kad_form_convertkit' );
	const [ activecampaign ] = useFormMeta( '_kad_form_activecampaign' );

	const [ redirect ] = useFormMeta( '_kad_form_redirect' );

	const [ webhook ] = useFormMeta( '_kad_form_webhook' );
	const [ autoEmail ] = useFormMeta( '_kad_form_autoEmail' );
	const [ entry ] = useFormMeta( '_kad_form_entry' );
	const [ messages ] = useFormMeta( '_kad_form_messages' );

	const [ labelFont ] = useFormMeta( '_kad_form_labelFont' );
	const [ inputFont ] = useFormMeta( '_kad_form_inputFont' );

	const [ vAlign ] = useFormMeta( '_kad_form_vAlign' );
	const [ hAlign ] = useFormMeta( '_kad_form_hAlign' );

	const [ padding ] = useFormMeta( '_kad_form_padding' );
	const [ tabletPadding ] = useFormMeta( '_kad_form_tabletPadding' );
	const [ mobilePadding ] = useFormMeta( '_kad_form_mobilePadding' );
	const [ paddingUnit ] = useFormMeta( '_kad_form_paddingUnit' );

	const [ margin ] = useFormMeta( '_kad_form_margin' );
	const [ tabletMargin ] = useFormMeta( '_kad_form_tabletMargin' );
	const [ mobileMargin ] = useFormMeta( '_kad_form_mobileMargin' );
	const [ marginUnit ] = useFormMeta( '_kad_form_marginUnit' );

	const [ style ] = useFormMeta( '_kad_form_style' );
	const [ helpFont ] = useFormMeta( '_kad_form_helpFont' );
	const [ maxWidth ] = useFormMeta( '_kad_form_maxWidth' );
	const [ maxWidthUnit ] = useFormMeta( '_kad_form_maxWidthUnit');

	const [ meta, setMeta ] = useFormProp( 'meta' );

	const setMetaAttribute = ( value, key ) => {
		setMeta( { ...meta, ['_kad_form_' + key]: value } );
	};

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 0 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 0 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 1 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 1 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 2 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 2 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 3 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 3 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== padding ? padding[ 0 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 0 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== padding ? padding[ 1 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 1 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== padding ? padding[ 2 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 2 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== padding ? padding[ 3 ] : '' ), ( undefined !== tabletPadding ? tabletPadding[ 3 ] : '' ), ( undefined !== mobilePadding ? mobilePadding[ 3 ] : '' ) );


	const previewHorizontalAlign = getPreviewSize( previewDevice, ( undefined !== hAlign?.[0] ? hAlign[0] : '' ), ( undefined !== hAlign?.[1] ? hAlign[1] : '' ), ( undefined !== hAlign?.[2] ? hAlign[2] : '' ) );
	const previewVerticalAlign = getPreviewSize( previewDevice, ( undefined !== vAlign?.[0] ? vAlign[0] : '' ), ( undefined !== vAlign?.[1] ? vAlign[1] : '' ), ( undefined !== vAlign?.[2] ? vAlign[2] : '' ) );


	const formClasses = classnames( {
		'kb-advanced-form'          : true,
		[ `kb-advanced-form-${id}` ]: true,
		[ `kb-form${uniqueID}` ]: uniqueID,
	} );

	const [ title, setTitle ] = useFormProp( 'title' );

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'kadence_form',
		id,
	);
	const {
		insertBlocks,
	} = useDispatch( editorStore );
	let formInnerBlocks = get( blocks, [ 0, 'innerBlocks' ], [] );
	useEffect( () => {
		if ( Array.isArray( formInnerBlocks ) && formInnerBlocks.length ) {
			let currentFields = getFormFields( formInnerBlocks );
			if ( ! isEqual( fields, currentFields ) ) {
				setMetaAttribute( currentFields, 'fields' );
			}
		}
	}, [formInnerBlocks] );
	let newBlock = get( blocks, [ 0 ], {} );

	const [ isAdding, addNew ] = useEntityPublish( 'kadence_form', id );
	const onAdd = async( title, template ) => {
		try {
			const response = await addNew();
			if ( response.id ) {
				switch ( template ) {
					case 'simple':
						insertBlocks(
							[ createBlock( 'kadence/advanced-form-text', {} ), createBlock( 'kadence/advanced-form-email', {} ), createBlock( 'kadence/advanced-form-textarea', {} ), createBlock( 'kadence/advanced-form-submit', {} ) ],
							0,
							clientId,
							false
						);
					break;
					default:
						insertBlocks(
							[ createBlock( 'kadence/advanced-form-submit', {} ) ],
							0,
							clientId,
							false
						);
					break;
				}
				setTitle(title);
			}
		} catch ( error ) {
			console.error( error );
		}
	};
	const useFieldBlockAppender = () => {
		if ( ! isSelected ) {
			return null;
		}
		return (
			<FieldBlockAppender inline={ true } rootClientId={ clientId } />
		);
	};
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: formClasses,
			style: {
				marginTop   : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),
				marginRight : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),
				marginBottom: ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),
				marginLeft  : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),

				paddingTop   : ( '' !== previewPaddingTop ? getSpacingOptionOutput( previewPaddingTop, paddingUnit ) : undefined ),
				paddingRight : ( '' !== previewPaddingRight ? getSpacingOptionOutput( previewPaddingRight, paddingUnit ) : undefined ),
				paddingBottom: ( '' !== previewPaddingBottom ? getSpacingOptionOutput( previewPaddingBottom, paddingUnit ) : undefined ),
				paddingLeft  : ( '' !== previewPaddingLeft ? getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) : undefined ),
			}
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			value: ! direct ? formInnerBlocks : undefined,
			onInput: ! direct ? ( a, b ) => onInput( [ { ...newBlock, innerBlocks: a } ], b ) : undefined,
			onChange: ! direct ? ( a, b ) => onChange( [ { ...newBlock, innerBlocks: a } ], b ) : undefined,
			templateLock: false,
			renderAppender: useFieldBlockAppender
		}
	);
	if ( title === '' ) {
		return (
			<>
				<FormTitle
					onAdd={ onAdd }
					isAdding={ isAdding }
				/>
				<div className='kb-form-hide-while-setting-up'>
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	}
	return (
		<>
			<style>
				{ isSelected && (
					<>
					{ `.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }` };
					</>
				)}
			</style>
			<BlockControls>
				<ToolbarGroup group="align-block">
					<JustifyContentControl
						value={ previewHorizontalAlign }
						onChange={ value => {
							if ( previewDevice === 'Mobile' ) {
								setMetaAttribute( [ ( undefined !== hAlign?.[0] ? hAlign?.[0] : '' ), ( undefined !== hAlign?.[1] ? hAlign?.[1] : '' ), ( value ? value : '' ) ], 'hAlign' );
							} else if ( previewDevice === 'Tablet' ) {
								setMetaAttribute( [ ( undefined !== hAlign?.[0] ? hAlign?.[0] : '' ), ( value ? value : '' ), ( undefined !== hAlign?.[2] ? hAlign?.[2] : '' ) ], 'hAlign' );
							} else {
								setMetaAttribute( [ ( value ? value : '' ), ( undefined !== hAlign?.[1] ? hAlign?.[1] : '' ), ( undefined !== hAlign?.[2] ? hAlign?.[2] : '' ) ], 'hAlign' );
							}
						} }
					/>
					<BlockVerticalAlignmentControl
						value={ previewVerticalAlign }
						onChange={ value => {
							if ( previewDevice === 'Mobile' ) {
								setMetaAttribute(  [ ( undefined !== vAlign?.[0] ? vAlign?.[0] : '' ), ( undefined !== vAlign?.[1] ? vAlign?.[1] : '' ), ( value ? value : '' ) ], 'vAlign' );
							} else if ( previewDevice === 'Tablet' ) {
								setMetaAttribute( [ ( undefined !== vAlign?.[0] ? vAlign?.[0] : '' ), ( value ? value : '' ), ( undefined !== vAlign?.[2] ? vAlign?.[2] : '' ) ], 'vAlign' );
							} else {
								setMetaAttribute( [ ( value ? value : '' ), ( undefined !== vAlign?.[1] ? vAlign?.[1] : '' ), ( undefined !== vAlign?.[2] ? vAlign?.[2] : '' ) ], 'vAlign' );
							}
						}}
					/>
				</ToolbarGroup>
				<ToolbarGroup group="add-block" className="kb-add-block">
					<FieldBlockAppender rootClientId={clientId} />
				</ToolbarGroup>
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
								formInnerBlocks={formInnerBlocks}
								settings={mailerlite}
								save={( value ) => { setMetaAttribute({ ...mailerlite, ...value }, 'mailerlite' ); }}
							/>
						)}

						{actions.includes( 'fluentCRM' ) && (
							<FluentCrmOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={fluentcrm}
								save={( value ) => setMetaAttribute( { ...fluentcrm, ...value }, 'fluentcrm' )}
							/>
						)}

						{actions.includes( 'sendinblue' ) && (
							<SendinBlueOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={sendinblue}
								save={( value ) => setMetaAttribute( { ...sendinblue, ...value }, 'sendinblue' )}
							/>
						)}

						{actions.includes( 'mailchimp' ) && (
							<MailchimpOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={mailchimp}
								save={( value ) => setMetaAttribute( { ...mailchimp, ...value }, 'mailchimp' )}
							/>
						)}

						{actions.includes( 'convertkit' ) && (
							<ConvertKitOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={convertkit}
								save={( value ) => setMetaAttribute( { ...convertkit, ...value }, 'convertkit' )}
							/>
						)}

						{actions.includes( 'activecampaign' ) && (
							<ActiveCampaignOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={activecampaign}
								save={( value ) => setMetaAttribute( { ...activecampaign, ...value }, 'activecampaign' )}
							/>
						)}

						{actions.includes( 'webhook' ) && (
							<WebhookOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
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
						<div className="kt-sidebar-settings-spacer"></div>
						{/*<KadencePanelBody*/}
						{/*	panelName={'kb-advanced-form-spam'}*/}
						{/*	title={__( 'Spam Prevention', 'kadence-blocks' )}*/}
						{/*	initialOpen={false}*/}
						{/*>*/}
						{/*	*/}
						{/*</KadencePanelBody>*/}
						<KadencePanelBody
							title={__( 'Message Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-message'}
						>
							<MessageOptions setAttributes={setMetaAttribute} messages={ messages } />
						</KadencePanelBody>
					</>
				}

				{( activeTab === 'style' ) &&
					<>

						<KadencePanelBody
							title={__( 'Fields', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-form-field-styles'}
						>
							<FieldStyles setMetaAttribute={setMetaAttribute} inputFont={inputFont} style={style} useFormMeta={ useFormMeta }/>
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
							title={__( 'Message Styling', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-form-message'}
						>
							<MessageStyling setMetaAttribute={setMetaAttribute} useFormMeta={ useFormMeta } />
						</KadencePanelBody>
					</>
				}

				{( activeTab === 'advanced' ) &&
					<>
						<KadencePanelBody panelName={'kb-row-padding'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
								tabletValue={tabletPadding}
								mobileValue={mobilePadding}
								onChange={(value) => {
									setMetaAttribute( value, 'padding' );
								}}
								onChangeTablet={(value) => {
									setMetaAttribute( value, 'tabletPadding' );
								}}
								onChangeMobile={(value) => {
									setMetaAttribute( value, 'mobilePadding' );
								}}
								min={0}
								max={(paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200)}
								step={(paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1)}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute( value, 'paddingUnit' )}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={margin}
								tabletValue={tabletMargin}
								mobileValue={mobileMargin}
								onChange={(value) => {
									setMetaAttribute( value, 'margin' );
								}}
								onChangeTablet={(value) => {
									setMetaAttribute( value, 'tabletMargin' );
								}}
								onChangeMobile={(value) => {
									setMetaAttribute( value, 'mobileMargin' );
								}}
								min={(marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200)}
								max={(marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200)}
								step={(marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1)}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setMetaAttribute( value, 'marginUnit' )}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
							/>
						</KadencePanelBody>
						<div className="kt-sidebar-settings-spacer"></div>
						<KadencePanelBody
							title={__( 'Field Width', 'kadence-blocks' )}
							initialOpen={true}
							panelName={ 'kb-adv-form-text-width' }
						>
							<ResponsiveRangeControls
								label={__( 'Max Width', 'kadence-blocks' )}
								value={( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' )}
								onChange={value => {
									setMetaAttribute( [ value, ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ], 'maxWidth' );
								}}
								tabletValue={( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' )}
								onChangeTablet={( value ) => {
									setMetaAttribute( [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), value, ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ], 'maxWidth' );
								}}
								mobileValue={( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' )}
								onChangeMobile={( value ) => {
									setMetaAttribute( [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), value ], 'maxWidth' );
								}}
								min={0}
								max={( maxWidthUnit === 'px' ? 2000 : 100 )}
								step={1}
								unit={maxWidthUnit ? maxWidthUnit : '%'}
								onUnit={( value ) => {
									setMetaAttribute( value, 'maxWidthUnit' );
								}}
								units={[ 'px', '%', 'vw' ]}
							/>
						</KadencePanelBody>
					</>
				}

			</InspectorControls>
			<BackendStyles uniqueID={uniqueID} useFormMeta={useFormMeta} previewDevice={previewDevice} inputFont={inputFont} fieldStyle={style} labelStyle={labelFont} helpStyle={helpFont}/>

			<div {...innerBlocksProps} />
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

		</>
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
