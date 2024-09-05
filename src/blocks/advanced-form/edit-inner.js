/**
 * BLOCK: Kadence Advanced Form
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { size, get, isEqual } from 'lodash';
import { addQueryArgs } from '@wordpress/url';
import { applyFilters } from '@wordpress/hooks';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { formBlockIcon } from '@kadence/icons';
import {
	KadencePanelBody,
	InspectorControlTabs,
	URLInputControl,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	BackgroundTypeControl,
	PopColorControl,
	ResponsiveRangeControls,
	GradientControl,
} from '@kadence/components';
import {
	getPreviewSize,
	KadenceColorOutput,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	arrayStringToInt,
} from '@kadence/helpers';

import {
	InspectorControls,
	BlockControls,
	useInnerBlocksProps,
	InspectorAdvancedControls,
	store as editorStore,
} from '@wordpress/block-editor';
import {
	TextControl,
	SelectControl,
	ToggleControl,
	ToolbarGroup,
	ExternalLink,
	Button,
	Placeholder,
	TextareaControl,
} from '@wordpress/components';

import {
	FieldStyles,
	SubmitActionOptions,
	LabelOptions,
	RadioLabelOptions,
	HelpTextOptions,
	MailerLiteOptions,
	FluentCrmOptions,
	SendinBlueOptions,
	MailchimpOptions,
	ConvertKitOptions,
	ActiveCampaignOptions,
	GetResponseOptions,
	FormTitle,
	WebhookOptions,
	AutoEmailOptions,
	DbEntryOptions,
	BackendStyles,
	MessageOptions,
	MessageStyling,
	getFormFields,
	dedupeFormFieldUniqueIds,
	FieldBlockAppender,
	SelectForm,
} from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { useEntityPublish } from './hooks';
const ALLOWED_BLOCKS = [
	'core/paragraph',
	'kadence/advancedheading',
	'kadence/spacer',
	'kadence/rowlayout',
	'kadence/column',
	'kadence/advanced-form-text',
	'kadence/advanced-form-textarea',
	'kadence/advanced-form-select',
	'kadence/advanced-form-submit',
	'kadence/advanced-form-radio',
	'kadence/advanced-form-file',
	'kadence/advanced-form-time',
	'kadence/advanced-form-date',
	'kadence/advanced-form-telephone',
	'kadence/advanced-form-checkbox',
	'kadence/advanced-form-email',
	'kadence/advanced-form-accept',
	'kadence/advanced-form-number',
	'kadence/advanced-form-hidden',
	'kadence/advanced-form-captcha',
];

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;
export function EditInner(props) {
	const { attributes, setAttributes, clientId, direct, id, isSelected } = props;
	const { uniqueID } = attributes;

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	const [activeTab, setActiveTab] = useState('general');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const [fields] = useFormMeta('_kad_form_fields');
	const [email] = useFormMeta('_kad_form_email');
	const [actions] = useFormMeta('_kad_form_actions');
	const [mailerlite] = useFormMeta('_kad_form_mailerlite');
	const [fluentcrm] = useFormMeta('_kad_form_fluentcrm');
	const [sendinblue] = useFormMeta('_kad_form_sendinblue');
	const [mailchimp] = useFormMeta('_kad_form_mailchimp');
	const [convertkit] = useFormMeta('_kad_form_convertkit');
	const [activecampaign] = useFormMeta('_kad_form_activecampaign');
	const [getresponse] = useFormMeta('_kad_form_getresponse');

	const [redirect] = useFormMeta('_kad_form_redirect');
	const [description] = useFormMeta('_kad_form_description');

	const [webhook] = useFormMeta('_kad_form_webhook');
	const [autoEmail] = useFormMeta('_kad_form_autoEmail');
	const [entry] = useFormMeta('_kad_form_entry');
	const [messages] = useFormMeta('_kad_form_messages');

	const [labelFont] = useFormMeta('_kad_form_labelFont');
	const [inputFont] = useFormMeta('_kad_form_inputFont');

	const [padding] = useFormMeta('_kad_form_padding');
	const [tabletPadding] = useFormMeta('_kad_form_tabletPadding');
	const [mobilePadding] = useFormMeta('_kad_form_mobilePadding');
	const [paddingUnit] = useFormMeta('_kad_form_paddingUnit');

	const [margin] = useFormMeta('_kad_form_margin');
	const [tabletMargin] = useFormMeta('_kad_form_tabletMargin');
	const [mobileMargin] = useFormMeta('_kad_form_mobileMargin');
	const [marginUnit] = useFormMeta('_kad_form_marginUnit');

	const [style] = useFormMeta('_kad_form_style');
	const [background] = useFormMeta('_kad_form_background');
	const [helpFont] = useFormMeta('_kad_form_helpFont');
	const [radioLabelFont] = useFormMeta('_kad_form_radioLabelFont');
	const [maxWidth] = useFormMeta('_kad_form_maxWidth');
	const [maxWidthUnit] = useFormMeta('_kad_form_maxWidthUnit');
	const [submitHide] = useFormMeta('_kad_form_submitHide');
	const [browserValidation] = useFormMeta('_kad_form_browserValidation');
	const [enableAnalytics] = useFormMeta('_kad_form_enableAnalytics');

	const [className] = useFormMeta('_kad_form_className');
	const [anchor] = useFormMeta('_kad_form_anchor');

	const [meta, setMeta] = useFormProp('meta');

	const setMetaAttribute = (value, key) => {
		setMeta({ ...meta, ['_kad_form_' + key]: value });
	};
	const saveBackgroundStyle = (value) => {
		setMetaAttribute({ ...background, ...value }, 'background');
	};
	const saveStyle = (value) => {
		setMetaAttribute({ ...style, ...value }, 'style');
	};
	const saveInputFont = (value) => {
		setMetaAttribute({ ...inputFont, ...value }, 'inputFont');
	};
	const saveLabelFont = (value) => {
		setMetaAttribute({ ...labelFont, ...value }, 'labelFont');
	};

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[0] : '',
		undefined !== tabletMargin ? tabletMargin[0] : '',
		undefined !== mobileMargin ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[1] : '',
		undefined !== tabletMargin ? tabletMargin[1] : '',
		undefined !== mobileMargin ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[2] : '',
		undefined !== tabletMargin ? tabletMargin[2] : '',
		undefined !== mobileMargin ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[3] : '',
		undefined !== tabletMargin ? tabletMargin[3] : '',
		undefined !== mobileMargin ? mobileMargin[3] : ''
	);

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0] : '',
		undefined !== tabletPadding ? tabletPadding[0] : '',
		undefined !== mobilePadding ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[1] : '',
		undefined !== tabletPadding ? tabletPadding[1] : '',
		undefined !== mobilePadding ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[2] : '',
		undefined !== tabletPadding ? tabletPadding[2] : '',
		undefined !== mobilePadding ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[3] : '',
		undefined !== tabletPadding ? tabletPadding[3] : '',
		undefined !== mobilePadding ? mobilePadding[3] : ''
	);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== maxWidth?.[0] ? maxWidth[0] : '',
		undefined !== maxWidth?.[1] ? maxWidth[1] : '',
		undefined !== maxWidth?.[2] ? maxWidth[2] : ''
	);
	const backgroundType =
		undefined !== background?.backgroundType && '' !== background?.backgroundType
			? background.backgroundType
			: 'normal';
	let hasBackground =
		'normal' === backgroundType && undefined !== background?.background && '' !== background?.background
			? true
			: false;
	if (!hasBackground) {
		hasBackground =
			'gradient' === backgroundType && undefined !== background?.gradient && '' !== background?.gradient
				? true
				: false;
	}
	const previewBackground = 'gradient' === backgroundType ? background?.gradient : background?.background;

	const formClasses = classnames({
		'kb-advanced-form': true,
		[`kb-advanced-form-${id}`]: true,
		[`kb-form${uniqueID}`]: uniqueID,
		[`kb-form-label-style-${style?.labelStyle}`]: style?.labelStyle,
		[`kb-form-basic-style`]: undefined !== style?.basicStyles && false === style.basicStyles ? false : true,
		[`kb-form-hide-required-asterisk`]:
			undefined !== style?.showRequired && false === style.showRequired ? true : false,
		[`kb-form-has-background`]: hasBackground,
		[`kb-form-is-dark`]: undefined !== style?.isDark && true === style.isDark,
		[`kb-form-input-size-${style?.size}`]: style?.size,
	});

	const [title, setTitle] = useFormProp('title');

	let [blocks, onInput, onChange] = useEntityBlockEditor('postType', 'kadence_form', id);
	const { updateBlockAttributes } = useDispatch(editorStore);

	const emptyForm = useMemo(() => {
		return [createBlock('kadence/advanced-form', {})];
	}, [clientId]);

	if (blocks.length === 0) {
		blocks = emptyForm;
	}

	const formInnerBlocks = useMemo(() => {
		return get(blocks, [0, 'innerBlocks'], []);
	}, [blocks]);

	const newBlock = useMemo(() => {
		return get(blocks, [0], {});
	}, [blocks]);

	useEffect(() => {
		if (Array.isArray(formInnerBlocks) && formInnerBlocks.length) {
			dedupeFormFieldUniqueIds(formInnerBlocks, updateBlockAttributes, id);

			const currentFields = getFormFields(formInnerBlocks);

			if (!isEqual(fields, currentFields)) {
				setMetaAttribute(currentFields, 'fields');
			}
		}
	}, [formInnerBlocks]);

	const showAnalytics = useMemo(() => {
		return applyFilters('kadence.analyticsOptionAdvancedForm', false);
	}, []);

	const [isAdding, addNew] = useEntityPublish('kadence_form', id);
	const onAdd = async (title, template, style, initialDescription) => {
		try {
			const response = await addNew();
			let buttonAttributes = {
				text: 'Submit',
				widthType: 'full',
			};
			if ('subscribe' === template && 'infield' === style) {
				buttonAttributes = {
					typography: [
						{
							size: ['', '', ''],
							sizeType: 'px',
							lineHeight: ['42', '', ''],
							lineType: 'px',
							letterSpacing: ['', '', ''],
							letterType: 'px',
							textTransform: '',
							family: '',
							google: '',
							style: '',
							weight: '',
							variant: '',
							subset: '',
							loadGoogle: true,
						},
					],
					text: 'Submit',
					widthType: 'full',
				};
			}
			if (response.id) {
				switch (template) {
					case 'contact':
						onChange(
							[
								{
									...newBlock,
									innerBlocks: [
										createBlock(
											'kadence/rowlayout',
											{ colLayout: 'equal', padding: ['0', '0', '0', '0'] },
											[
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-text', { label: 'Name' }),
												]),
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-email', {
														label: 'Email',
														required: true,
													}),
												]),
											]
										),
										createBlock('kadence/advanced-form-textarea', {
											label: 'Message',
											required: true,
										}),
										createBlock('kadence/advanced-form-submit', { text: 'Submit' }),
									],
								},
							],
							clientId
						);
						break;
					case 'contactAdvanced':
						onChange(
							[
								{
									...newBlock,
									innerBlocks: [
										createBlock(
											'kadence/rowlayout',
											{ colLayout: 'equal', padding: ['0', '0', '0', '0'] },
											[
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-text', { label: 'Name' }),
												]),
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-email', {
														label: 'Email',
														required: true,
													}),
												]),
											]
										),
										createBlock(
											'kadence/rowlayout',
											{ colLayout: 'equal', padding: ['0', '0', '0', '0'] },
											[
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-select', { label: 'Option 1' }),
												]),
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-select', { label: 'Option 2' }),
												]),
											]
										),
										createBlock('kadence/advanced-form-textarea', {
											label: 'Message',
											required: true,
										}),
										createBlock('kadence/advanced-form-submit', { text: 'Submit' }),
									],
								},
							],
							clientId
						);
						break;
					case 'subscribeAdvanced':
						onChange(
							[
								{
									...newBlock,
									innerBlocks: [
										createBlock(
											'kadence/rowlayout',
											{ colLayout: 'equal', padding: ['0', '0', '0', '0'] },
											[
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-text', { label: 'Name' }),
												]),
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-email', {
														label: 'Email',
														required: true,
													}),
												]),
											]
										),
										createBlock('kadence/advanced-form-submit', { text: 'Submit' }),
									],
								},
							],
							clientId
						);
						break;
					case 'subscribe':
						onChange(
							[
								{
									...newBlock,
									innerBlocks: [
										createBlock(
											'kadence/rowlayout',
											{ colLayout: 'left-golden', padding: ['0', '0', '0', '0'] },
											[
												createBlock('kadence/column', {}, [
													createBlock('kadence/advanced-form-email', {
														label: 'Email',
														required: true,
													}),
												]),
												createBlock('kadence/column', { verticalAlignment: 'bottom' }, [
													createBlock('kadence/advanced-form-submit', buttonAttributes),
												]),
											]
										),
									],
								},
							],
							clientId
						);
						break;
					default:
						onChange(
							[
								{
									...newBlock,
									innerBlocks: [
										createBlock('core/paragraph', {}),
										createBlock('kadence/advanced-form-submit', { text: 'Submit' }),
									],
								},
							],
							clientId
						);
						break;
				}
				setTitle(title);
				const updatedMeta = meta;
				if (
					kadence_blocks_params.pro === 'true' &&
					updatedMeta?._kad_form_actions &&
					!updatedMeta._kad_form_actions.includes('entry')
				) {
					updatedMeta._kad_form_actions.push('entry');
				}
				updatedMeta._kad_form_description = initialDescription;
				if (style === 'dark') {
					updatedMeta._kad_form_style = {
						...updatedMeta._kad_form_style,
						background: 'palette3',
						isDark: true,
						placeholderColor: 'palette6',
						borderActive: 'palette7',
					};
					updatedMeta._kad_form_inputFont = { ...updatedMeta._kad_form_inputFont, color: 'palette9' };
					updatedMeta._kad_form_labelFont = { ...updatedMeta._kad_form_labelFont, color: 'palette9' };
					updatedMeta._kad_form_background = { ...updatedMeta._kad_form_background, background: 'palette3' };
					const borderStyle = {
						top: ['palette6', '', 1],
						right: ['palette6', '', 1],
						bottom: ['palette6', '', 1],
						left: ['palette6', '', 1],
						unit: 'px',
					};
					updatedMeta._kad_form_fieldBorderStyle = borderStyle;
				} else if (style === 'infield') {
					updatedMeta._kad_form_style = { ...updatedMeta._kad_form_style, labelStyle: 'infield' };
				} else if (style === 'underline') {
					const borderStyle = {
						top: ['#B9B9C5', '', 0],
						right: ['#B9B9C5', '', 0],
						bottom: ['#B9B9C5', '', 2],
						left: ['#B9B9C5', '', 0],
						unit: 'px',
					};
					updatedMeta._kad_form_labelFont = { ...updatedMeta._kad_form_labelFont, color: '#909097' };
					updatedMeta._kad_form_style = {
						...updatedMeta._kad_form_style,
						labelStyle: 'float',
						borderActive: 'palette1',
						boxShadow: [true, '#000000', 0, 0, 0, 0, 0, false],
						boxShadowActive: [true, '#000000', 0, 0, 0, 0, 0, false],
					};
					updatedMeta._kad_form_fieldBorderStyle = borderStyle;
					updatedMeta._kad_form_fieldBorderRadius = [0, 0, 0, 0];
				}
				setMeta({ ...meta, updatedMeta });
				await wp.data.dispatch('core').saveEditedEntityRecord('postType', 'kadence_form', id);
			}
		} catch (error) {
			console.error(error);
		}
	};
	const useFieldBlockAppender = () => {
		if (isSelected) {
			return null;
		}
		return <FieldBlockAppender inline={true} rootClientId={clientId} />;
	};
	const useFieldBlockAppenderBase = () => {
		return <FieldBlockAppender inline={false} rootClientId={clientId} />;
	};
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: formClasses,
			style: {
				marginTop: '' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginUnit) : undefined,
				marginRight:
					'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginUnit) : undefined,
				marginBottom:
					'' !== previewMarginBottom ? getSpacingOptionOutput(previewMarginBottom, marginUnit) : undefined,
				marginLeft:
					'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginUnit) : undefined,

				paddingTop:
					'' !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, paddingUnit) : undefined,
				paddingRight:
					'' !== previewPaddingRight ? getSpacingOptionOutput(previewPaddingRight, paddingUnit) : undefined,
				paddingBottom:
					'' !== previewPaddingBottom ? getSpacingOptionOutput(previewPaddingBottom, paddingUnit) : undefined,
				paddingLeft:
					'' !== previewPaddingLeft ? getSpacingOptionOutput(previewPaddingLeft, paddingUnit) : undefined,

				maxWidth: '' !== previewMaxWidth ? previewMaxWidth + maxWidthUnit : undefined,
				background: '' !== previewBackground ? KadenceColorOutput(previewBackground) : undefined,
			},
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			value: !direct ? formInnerBlocks : undefined,
			onInput: !direct ? (a, b) => onInput([{ ...newBlock, innerBlocks: a }], b) : undefined,
			onChange: !direct ? (a, b) => onChange([{ ...newBlock, innerBlocks: a }], b) : undefined,
			templateLock: false,
			renderAppender: formInnerBlocks.length === 0 ? useFieldBlockAppenderBase : useFieldBlockAppender,
		}
	);

	if (formInnerBlocks.length === 0) {
		return (
			<>
				<FormTitle onAdd={onAdd} isAdding={isAdding} existingTitle={title} />
				<div className="kb-form-hide-while-setting-up">
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	}
	if (typeof pagenow !== 'undefined' && ('widgets' === pagenow || 'customize' === pagenow)) {
		const editPostLink = addQueryArgs('post.php', {
			post: id,
			action: 'edit',
		});
		return (
			<>
				<Placeholder
					className="kb-select-or-create-placeholder"
					label={__('Kadence Form', 'kadence-blocks')}
					icon={formBlockIcon}
				>
					<p style={{ width: '100%', marginBottom: '10px' }}>
						{__('Advanced forms can not be edited within the widgets screen.', 'kadence-blocks')}
					</p>
					<Button href={editPostLink} variant="primary" className="kb-form-edit-link">
						{__('Edit Form', 'kadence-blocks')}
					</Button>
				</Placeholder>
				<InspectorControls>
					<KadencePanelBody
						panelName={'kb-advanced-form-selected-switch'}
						title={__('Selected Form', 'kadence-blocks')}
					>
						<SelectForm
							postType="kadence_form"
							label={__('Selected Form', 'kadence-blocks')}
							hideLabelFromVision={true}
							onChange={(nextId) => {
								setAttributes({ id: parseInt(nextId) });
							}}
							value={id}
						/>
					</KadencePanelBody>
				</InspectorControls>
			</>
		);
	}
	return (
		<>
			<style>
				{isSelected && (
					<>
						{`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }`}
						;
					</>
				)}
			</style>
			<BlockControls>
				<ToolbarGroup group="add-block" className="kb-add-block">
					<FieldBlockAppender rootClientId={clientId} />
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<InspectorControlTabs
					panelName={'advanced-form'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							panelName={'kb-advanced-form-selected-switch'}
							title={__('Form', 'kadence-blocks')}
						>
							{!direct && (
								<SelectForm
									postType="kadence_form"
									label={__('Selected Form', 'kadence-blocks')}
									hideLabelFromVision={true}
									onChange={(nextId) => setAttributes({ id: parseInt(nextId) })}
									value={id}
								/>
							)}
							<TextareaControl
								label={__('Form Description', 'kadence-blocks')}
								placeholder={__('Optionally add an description about your form', 'kadence-blocks')}
								help={__('This is used for your reference only.', 'kadence-blocks')}
								value={undefined !== description ? description : ''}
								onChange={(value) => setMetaAttribute(value, 'description')}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							panelName={'kb-advanced-form-submit-actions'}
							title={__('Submit Actions', 'kadence-blocks')}
						>
							<SubmitActionOptions setAttributes={setMetaAttribute} selectedActions={actions} />
							<ToggleControl
								label={__('Hide form after submit?', 'kadence-blocks')}
								checked={undefined !== submitHide ? submitHide : false}
								onChange={(value) => {
									setMetaAttribute(value, 'submitHide');
								}}
							/>
						</KadencePanelBody>

						{size(actions) > 0 && <div className="kt-sidebar-settings-spacer"></div>}

						{actions.includes('email') && (
							<KadencePanelBody
								title={__('Email Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-form-email-settings'}
							>
								<TextControl
									label={__('Email To Address', 'kadence-blocks')}
									placeholder={__('name@example.com', 'kadence-blocks')}
									value={undefined !== email.emailTo ? email.emailTo : ''}
									onChange={(value) => setMetaAttribute({ ...email, emailTo: value }, 'email')}
									help={__('Seperate with comma for more then one email address.', 'kadence-blocks')}
								/>
								<TextControl
									label={__('Email Subject', 'kadence-blocks')}
									value={undefined !== email.subject ? email.subject : ''}
									onChange={(value) => setMetaAttribute({ ...email, subject: value }, 'email')}
								/>
								<TextControl
									label={__('From Email', 'kadence-blocks')}
									value={undefined !== email.fromEmail ? email.fromEmail : ''}
									onChange={(value) => setMetaAttribute({ ...email, fromEmail: value }, 'email')}
								/>
								<TextControl
									label={__('From Name', 'kadence-blocks')}
									value={undefined !== email.fromName ? email.fromName : ''}
									onChange={(value) => setMetaAttribute({ ...email, fromName: value }, 'email')}
								/>
								<SelectControl
									label={__('Reply To', 'kadence-blocks')}
									value={email.replyTo}
									options={[
										{ value: 'email_field', label: __('Email Field', 'kadence-blocks') },
										{ value: 'from_email', label: __('From Email', 'kadence-blocks') },
									]}
									onChange={(value) => {
										setMetaAttribute({ ...email, replyTo: value }, 'email');
									}}
								/>
								<TextControl
									label={__('Cc', 'kadence-blocks')}
									value={undefined !== email.cc ? email.cc : ''}
									onChange={(value) => setMetaAttribute({ ...email, cc: value }, 'email')}
								/>
								<TextControl
									label={__('Bcc', 'kadence-blocks')}
									value={undefined !== email.bcc ? email.bcc : ''}
									onChange={(value) => setMetaAttribute({ ...email, bcc: value }, 'email')}
								/>
								<ToggleControl
									label={__('Send as HTML email?', 'kadence-blocks')}
									help={__('If off plain text is used.', 'kadence-blocks')}
									checked={undefined !== email.html ? email.html : true}
									onChange={(value) => setMetaAttribute({ ...email, html: value }, 'email')}
								/>
							</KadencePanelBody>
						)}

						{actions.includes('redirect') && (
							<KadencePanelBody
								title={__('Redirect Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-form-redirect-settings'}
							>
								<URLInputControl
									label={__('Redirect to', 'kadence-blocks')}
									url={redirect}
									onChangeUrl={(value) => setMetaAttribute(value, 'redirect')}
									additionalControls={false}
								/>
							</KadencePanelBody>
						)}

						{actions.includes('mailerlite') && (
							<MailerLiteOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={mailerlite}
								save={(value) => {
									setMetaAttribute({ ...mailerlite, ...value }, 'mailerlite');
								}}
							/>
						)}

						{actions.includes('fluentCRM') && (
							<FluentCrmOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={fluentcrm}
								save={(value) => setMetaAttribute({ ...fluentcrm, ...value }, 'fluentcrm')}
							/>
						)}

						{actions.includes('sendinblue') && (
							<SendinBlueOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={sendinblue}
								save={(value) => setMetaAttribute({ ...sendinblue, ...value }, 'sendinblue')}
							/>
						)}

						{actions.includes('mailchimp') && (
							<MailchimpOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={mailchimp}
								save={(value) => setMetaAttribute({ ...mailchimp, ...value }, 'mailchimp')}
							/>
						)}

						{actions.includes('convertkit') && (
							<ConvertKitOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={convertkit}
								save={(value) => setMetaAttribute({ ...convertkit, ...value }, 'convertkit')}
							/>
						)}

						{actions.includes('activecampaign') && (
							<ActiveCampaignOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={activecampaign}
								save={(value) => setMetaAttribute({ ...activecampaign, ...value }, 'activecampaign')}
							/>
						)}

						{actions.includes('getresponse') && (
							<GetResponseOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={getresponse}
								save={(value) => setMetaAttribute({ ...getresponse, ...value }, 'getresponse')}
							/>
						)}

						{actions.includes('webhook') && (
							<WebhookOptions
								parentClientId={clientId}
								formInnerBlocks={formInnerBlocks}
								settings={webhook}
								save={(value) => setMetaAttribute({ ...webhook, ...value }, 'webhook')}
							/>
						)}

						{actions.includes('autoEmail') && (
							<AutoEmailOptions
								settings={autoEmail}
								save={(value) => setMetaAttribute({ ...autoEmail, ...value }, 'autoEmail')}
							/>
						)}

						{actions.includes('entry') && (
							<DbEntryOptions
								settings={entry}
								save={(value) => setMetaAttribute({ ...entry, ...value }, 'entry')}
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
							title={__('Message Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-form-message'}
						>
							<MessageOptions setAttributes={setMetaAttribute} messages={messages} />
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<>
						<KadencePanelBody
							title={__('Input Fields', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-form-field-styles'}
						>
							<FieldStyles
								setMetaAttribute={setMetaAttribute}
								inputFont={inputFont}
								style={style}
								useFormMeta={useFormMeta}
							/>
						</KadencePanelBody>

						{/* Label Styles*/}
						<KadencePanelBody
							title={__('Labels', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-form-label-styles'}
						>
							<LabelOptions
								styleAttribute={style}
								setAttributes={setMetaAttribute}
								labelFont={labelFont}
							/>
						</KadencePanelBody>
						{/* Label Styles*/}
						<KadencePanelBody
							title={__('Radio/Checkbox Labels', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-form-radio-label-styles'}
						>
							<RadioLabelOptions setAttributes={setMetaAttribute} radioLabelFont={radioLabelFont} />
						</KadencePanelBody>
						{/* Help Text Styles*/}
						<KadencePanelBody
							title={__('Help Text', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-form-help-styles'}
						>
							<HelpTextOptions setAttributes={setMetaAttribute} helpFont={helpFont} />
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Message Styling', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-form-message'}
						>
							<MessageStyling setMetaAttribute={setMetaAttribute} useFormMeta={useFormMeta} />
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Background', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-form-background'}
						>
							<BackgroundTypeControl
								label={__('Background Type', 'kadence-blocks')}
								type={background?.backgroundType ? background.backgroundType : 'normal'}
								onChange={(value) => saveBackgroundStyle({ backgroundType: value })}
								allowedTypes={['normal', 'gradient']}
							/>
							{'gradient' !== background?.backgroundType && (
								<PopColorControl
									label={__('Background', 'kadence-blocks')}
									value={background?.background ? background.background : ''}
									default={''}
									onChange={(value) => {
										saveBackgroundStyle({ background: value });
									}}
								/>
							)}
							{'gradient' === background?.backgroundType && (
								<GradientControl
									value={background?.gradient}
									onChange={(value) => {
										saveBackgroundStyle({ gradient: value });
									}}
									gradients={[]}
								/>
							)}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-row-padding'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={arrayStringToInt(padding)}
								tabletValue={arrayStringToInt(tabletPadding)}
								mobileValue={arrayStringToInt(mobilePadding)}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'padding');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletPadding');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobilePadding');
								}}
								min={0}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 999}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'paddingUnit')}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={arrayStringToInt(margin)}
								tabletValue={arrayStringToInt(tabletMargin)}
								mobileValue={arrayStringToInt(mobileMargin)}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'margin');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletMargin');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobileMargin');
								}}
								min={marginUnit === 'em' || marginUnit === 'rem' ? -12 : -999}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : 999}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setMetaAttribute(value, 'marginUnit')}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
								allowAuto={true}
							/>
						</KadencePanelBody>
						<KadencePanelBody initialOpen={true} panelName={'kb-adv-form-max-width'}>
							<ResponsiveRangeControls
								label={__('Max Width', 'kadence-blocks')}
								value={maxWidth[0] !== '' ? parseInt(maxWidth[0]) : ''}
								onChange={(value) => {
									value = value ? value : '';
									setMetaAttribute([value.toString(), maxWidth[1], maxWidth[2]], 'maxWidth');
								}}
								tabletValue={maxWidth[1] !== '' ? parseInt(maxWidth[1]) : ''}
								onChangeTablet={(value) => {
									value = value ? value : '';
									setMetaAttribute([maxWidth[0], value.toString(), maxWidth[2]], 'maxWidth');
								}}
								mobileValue={maxWidth[2] !== '' ? parseInt(maxWidth[2]) : ''}
								onChangeMobile={(value) => {
									value = value ? value : '';
									setMetaAttribute([maxWidth[0], maxWidth[1], value.toString()], 'maxWidth');
								}}
								min={0}
								max={maxWidthUnit === 'px' ? 2000 : 100}
								step={1}
								reset={() => setMetaAttribute(['', '', ''], 'maxWidth')}
								unit={maxWidthUnit ? maxWidthUnit : '%'}
								onUnit={(value) => {
									setMetaAttribute(value, 'maxWidthUnit');
								}}
								units={['px', '%', 'vw']}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Validation', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-adv-form-browser-validation'}
						>
							<ToggleControl
								label={__('Use Browser Validation', 'kadence-blocks')}
								checked={browserValidation}
								onChange={(value) => {
									setMetaAttribute(value, 'browserValidation');
								}}
								help={__(
									'This will use the browsers default validation for required fields. If disabled, custom error message will be displayed.',
									'kadence-blocks'
								)}
							/>
						</KadencePanelBody>
						{showAnalytics && (
							<KadencePanelBody
								title={__('Analytics', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-form-enable-analytics'}
							>
								<ToggleControl
									label={__('Enable Form Analytics', 'kadence-blocks')}
									checked={enableAnalytics}
									onChange={(value) => {
										setMetaAttribute(value, 'enableAnalytics');
									}}
									help={__(
										'This will capture how many times the form is loaded, started, and submitted so you can have conversion analytics.',
										'kadence-blocks'
									)}
								/>
							</KadencePanelBody>
						)}
					</>
				)}
			</InspectorControls>
			<InspectorAdvancedControls>
				<ToggleControl
					label={__('Form Styles', 'kadence-blocks')}
					help={__(
						'Only disable if you intend to control form styles through custom css or theme',
						'kadence-blocks'
					)}
					checked={undefined !== style?.basicStyles ? style.basicStyles : true}
					onChange={(value) => {
						setMetaAttribute({ ...style, ...{ basicStyles: value } }, 'style');
					}}
				/>

				<TextControl
					__nextHasNoMarginBottom
					className="html-anchor-control"
					label={__('HTML anchor', 'kadence-blocks')}
					help={
						<>
							{__(
								'Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page.',
								'kadence-blocks'
							)}

							<ExternalLink href={__('https://wordpress.org/documentation/article/page-jumps/', 'kadence-blocks')}>
								{__('Learn more about anchors', 'kadence-blocks')}
							</ExternalLink>
						</>
					}
					value={anchor}
					placeholder={__('Add an anchor', 'kadence-blocks')}
					onChange={(nextValue) => {
						nextValue = nextValue.replace(ANCHOR_REGEX, '-');
						setMetaAttribute(nextValue, 'anchor');
					}}
					autoCapitalize="none"
					autoComplete="off"
				/>

				<TextControl
					__nextHasNoMarginBottom
					autoComplete="off"
					label={__('Additional CSS class(es)', 'kadence-blocks')}
					value={className}
					onChange={(nextValue) => {
						setMetaAttribute(nextValue !== '' ? nextValue : undefined, 'className');
					}}
					help={__('Separate multiple classes with spaces.', 'kadence-blocks')}
				/>
			</InspectorAdvancedControls>
			<BackendStyles
				uniqueID={uniqueID}
				useFormMeta={useFormMeta}
				previewDevice={previewDevice}
				inputFont={inputFont}
				fieldStyle={style}
				labelStyle={labelFont}
				helpStyle={helpFont}
				radioLabelFont={radioLabelFont}
			/>

			<div {...innerBlocksProps} />
			<SpacingVisualizer
				style={{
					marginLeft:
						undefined !== previewMarginLeft
							? getSpacingOptionOutput(previewMarginLeft, marginUnit)
							: undefined,
					marginRight:
						undefined !== previewMarginRight
							? getSpacingOptionOutput(previewMarginRight, marginUnit)
							: undefined,
					marginTop:
						undefined !== previewMarginTop
							? getSpacingOptionOutput(previewMarginTop, marginUnit)
							: undefined,
					marginBottom:
						undefined !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, marginUnit)
							: undefined,
				}}
				type="inside"
				forceShow={paddingMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewPaddingTop, paddingUnit),
					getSpacingOptionOutput(previewPaddingRight, paddingUnit),
					getSpacingOptionOutput(previewPaddingBottom, paddingUnit),
					getSpacingOptionOutput(previewPaddingLeft, paddingUnit),
				]}
			/>
			<SpacingVisualizer
				type="inside"
				forceShow={marginMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewMarginTop, marginUnit),
					getSpacingOptionOutput(previewMarginRight, marginUnit),
					getSpacingOptionOutput(previewMarginBottom, marginUnit),
					getSpacingOptionOutput(previewMarginLeft, marginUnit),
				]}
			/>
		</>
	);
}
export default EditInner;

function useFormProp(prop) {
	return useEntityProp('postType', 'kadence_form', prop);
}

function useFormMeta(key) {
	const [meta, setMeta] = useFormProp('meta');

	return [
		meta[key],
		useCallback(
			(newValue) => {
				setMeta({ ...meta, [key]: newValue });
			},
			[key, setMeta]
		),
	];
}
