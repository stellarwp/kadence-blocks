/**
 * BLOCK: Kadence Advanced Heading
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, isEqual } from 'lodash';
import { addQueryArgs } from '@wordpress/url';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { formBlockIcon } from '@kadence/icons';
import {
	KadencePanelBody,
	InspectorControlTabs,
	SpacingVisualizer,
	ResponsiveMeasureRangeControl,
	ResponsiveMeasurementControls,
	ResponsiveBorderControl,
	TypographyControls,
	PopColorControl,
	ColorGroup,
	BackgroundControl as KadenceBackgroundControl,
	HoverToggleControl,
	ResponsiveAlignControls,
	ResponsiveRangeControls,
	BackgroundTypeControl,
	GradientControl,
} from '@kadence/components';
import {
	getPreviewSize,
	KadenceColorOutput,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	arrayStringToInt,
	getFontSizeOptionOutput,
} from '@kadence/helpers';

import {
	InspectorControls,
	BlockControls,
	useInnerBlocksProps,
	InspectorAdvancedControls,
	store as editorStore,
} from '@wordpress/block-editor';
import { TextControl, ToggleControl, ToolbarGroup, ExternalLink, Button, Placeholder } from '@wordpress/components';

import { FormTitle, SelectForm, FieldBlockAppender } from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { useEntityPublish } from './hooks';
import BackendStyles from './components/backend-styles';

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;
export function EditInner(props) {
	const { attributes, setAttributes, clientId, context, direct, id, isSelected } = props;
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

	const [meta, setMeta] = useHeaderProp('meta');

	const metaAttributes = {
		padding: meta?._kad_header_padding,
		tabletPadding: meta?._kad_header_tabletPadding,
		mobilePadding: meta?._kad_header_mobilePadding,
		paddingUnit: meta?._kad_header_paddingUnit,
		margin: meta?._kad_header_margin,
		tabletMargin: meta?._kad_header_tabletMargin,
		mobileMargin: meta?._kad_header_mobileMargin,
		marginUnit: meta?._kad_header_marginUnit,
		border: meta?._kad_header_border,
		tabletBorder: meta?._kad_header_tabletBorder,
		mobileBorder: meta?._kad_header_mobileBorder,
		borderUnit: meta?._kad_header_borderUnit,
		hoverBorder: meta?._kad_header_hoverBorder,
		tabletHoverBorder: meta?._kad_header_tabletHoverBorder,
		mobileHoverBorder: meta?._kad_header_mobileHoverBorder,
		hoverBorderUnit: meta?._kad_header_hoverBorderUnit,
		borderRadius: meta?._kad_header_borderRadius,
		tabletBorderRadius: meta?._kad_header_tabletBorderRadius,
		mobileBorderRadius: meta?._kad_header_mobileBorderRadius,
		borderRadiusUnit: meta?._kad_header_borderRadiusUnit,
		borderHoverRadius: meta?._kad_header_borderHoverRadius,
		tabletBorderHoverRadius: meta?._kad_header_tabletBorderHoverRadius,
		mobileBorderHoverRadius: meta?._kad_header_mobileBorderHoverRadius,
		borderHoverRadiusUnit: meta?._kad_header_borderHoverRadiusUnit,
		flex: meta?._kad_header_flex,
		className: meta?._kad_header_className,
		anchor: meta?._kad_header_anchor,
		background: meta?._kad_header_background,
		backgroundHover: meta?._kad_header_backgroundHover,
		typography: meta?._kad_header_typography,
		textColor: meta?._kad_header_textColor,
		linkColor: meta?._kad_header_linkColor,
		linkHoverColor: meta?._kad_header_linkHoverColor,
		height: meta?._kad_header_height,
		heightUnit: meta?._kad_header_heightUnit,
		width: meta?._kad_header_width,
		widthUnit: meta?._kad_header_widthUnit,
	};

	const {
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		margin,
		tabletMargin,
		mobileMargin,
		marginUnit,
		border,
		tabletBorder,
		mobileBorder,
		hoverBorder,
		tabletHoverBorder,
		mobileHoverBorder,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		borderHoverRadius,
		tabletBorderHoverRadius,
		mobileBorderHoverRadius,
		borderHoverRadiusUnit,
		flex,
		className,
		anchor,
		background,
		backgroundHover,
		typography,
		textColor,
		linkColor,
		linkHoverColor,
		height,
		heightUnit,
		width,
		widthUnit,
	} = metaAttributes;

	const setMetaAttribute = (value, key) => {
		setMeta({ ...meta, ['_kad_header_' + key]: value });
	};

	const headerClasses = classnames({
		'kb-header': true,
		[`kb-header-${id}`]: true,
		[`kb-header${uniqueID}`]: uniqueID,
	});

	// Flex direction options
	const previewDirection = getPreviewSize(
		previewDevice,
		undefined !== flex?.direction?.[0] ? flex.direction[0] : '',
		undefined !== flex?.direction?.[1] ? flex.direction[1] : '',
		undefined !== flex?.direction?.[2] ? flex.direction[2] : ''
	);

	const [title, setTitle] = useHeaderProp('title');

	let [blocks, onInput, onChange] = useEntityBlockEditor('postType', 'kadence_header', id);
	const { updateBlockAttributes } = useDispatch(editorStore);

	const emptyHeader = useMemo(() => {
		return [createBlock('kadence/column', {})];
	}, [clientId]);

	if (blocks.length === 0) {
		blocks = emptyHeader;
	}

	const headerInnerBlocks = useMemo(() => {
		return get(blocks, [0, 'innerBlocks'], []);
	}, [blocks]);

	const newBlock = useMemo(() => {
		return get(blocks, [0], {});
	}, [blocks]);

	const [isAdding, addNew] = useEntityPublish('kadence_header', id);
	const onAdd = async (title, template, initialDescription) => {
		try {
			const response = await addNew();

			if (response.id) {
				onChange([{ ...newBlock, innerBlocks: [createBlock('kadence/column', {})] }], clientId);

				setTitle(title);

				const updatedMeta = meta;
				updatedMeta._kad_header_description = initialDescription;

				setMeta({ ...meta, updatedMeta });
				await wp.data.dispatch('core').saveEditedEntityRecord('postType', 'kadence_header', id);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: headerClasses,
		},
		{
			// allowedBlocks: ALLOWED_BLOCKS,
			value: !direct ? headerInnerBlocks : undefined,
			onInput: !direct ? (a, b) => onInput([{ ...newBlock, innerBlocks: a }], b) : undefined,
			onChange: !direct ? (a, b) => onChange([{ ...newBlock, innerBlocks: a }], b) : undefined,
			templateLock: false,
			// renderAppender: headerInnerBlocks.length === 0 ? useFieldBlockAppenderBase : useFieldBlockAppender
		}
	);

	if (headerInnerBlocks.length === 0) {
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
					label={__('Kadence Heading', 'kadence-blocks')}
					icon={formBlockIcon}
				>
					<p style={{ width: '100%', marginBottom: '10px' }}>
						{__('Advanced Headers can not be edited within the widgets screen.', 'kadence-blocks')}
					</p>
					<Button href={editPostLink} variant="primary" className="kb-form-edit-link">
						{__('Edit Form', 'kadence-blocks')}
					</Button>
				</Placeholder>
				<InspectorControls>
					<KadencePanelBody
						panelName={'kb-advanced-form-selected-switch'}
						title={__('Selected Header', 'kadence-blocks')}
					>
						<SelectForm
							postType="kadence_header"
							label={__('Selected Header', 'kadence-blocks')}
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
			<BackendStyles {...props} metaAttributes={metaAttributes} previewDevice={previewDevice} />
			<InspectorControls>
				<InspectorControlTabs
					panelName={'advanced-header'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Flex Settings', 'kadence-blocks')}
							panelName={'kb-col-flex-settings'}
						>
							<ResponsiveAlignControls
								label={__('Direction', 'kadence-blocks')}
								value={flex.direction && flex.direction[0] ? flex.direction[0] : 'vertical'}
								tabletValue={flex.direction && flex.direction[1] ? flex.direction[1] : ''}
								mobileValue={flex.direction && flex.direction[2] ? flex.direction[2] : ''}
								onChange={(value) => {
									if (value) {
										setMetaAttribute(
											{
												...flex,
												direction: [
													value,
													undefined !== flex.direction?.[1] ? flex.direction[1] : '',
													undefined !== flex.direction?.[2] ? flex.direction[2] : '',
												],
											},
											'flex'
										);
									}
								}}
								onChangeTablet={(value) => {
									let tempValue = value;
									if (flex.direction && flex.direction[1] && tempValue === flex.direction[1]) {
										tempValue = '';
									}
									setMetaAttribute(
										{
											...flex,
											direction: [
												undefined !== flex.direction?.[0] ? flex.direction[0] : '',
												tempValue,
												undefined !== flex.direction?.[2] ? flex.direction[2] : '',
											],
										},
										'flex'
									);
								}}
								onChangeMobile={(value) => {
									let tempValue = value;
									if (flex.direction && flex.direction[2] && tempValue === flex.direction[2]) {
										tempValue = '';
									}
									setMetaAttribute(
										{
											...flex,
											direction: [
												undefined !== flex.direction?.[0] ? flex.direction[0] : '',
												undefined !== flex.direction?.[1] ? flex.direction[1] : '',
												tempValue,
											],
										},
										'flex'
									);
								}}
								type={'orientation-column'}
							/>
							<div className="kt-sidebar-settings-spacer"></div>
							{(previewDirection === 'horizontal-reverse' || previewDirection === 'horizontal') && (
								<ResponsiveAlignControls
									label={__('Alignment', 'kadence-blocks')}
									value={
										flex.justifyContent && flex.justifyContent?.[0] ? flex.justifyContent[0] : ''
									}
									tabletValue={
										flex.justifyContent && flex.justifyContent?.[1] ? flex.justifyContent[1] : ''
									}
									mobileValue={
										flex.justifyContent && flex.justifyContent?.[2] ? flex.justifyContent[2] : ''
									}
									onChange={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[0]
												? flex.justifyContent[0]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													tempValue,
													flex.justifyContent && flex.justifyContent[1]
														? flex.justifyContent[1]
														: '',
													flex.justifyContent && flex.justifyContent[2]
														? flex.justifyContent[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeTablet={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[1]
												? flex.justifyContent[1]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													flex.justifyContent && flex.justifyContent?.[0]
														? flex.justifyContent[0]
														: '',
													tempValue,
													flex.justifyContent && flex.justifyContent[2]
														? flex.justifyContent[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeMobile={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[2]
												? flex.justifyContent[2]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													flex.justifyContent && flex.justifyContent?.[0]
														? flex.justifyContent[0]
														: '',
													flex.justifyContent && flex.justifyContent[1]
														? flex.justifyContent[1]
														: '',
													tempValue,
												],
											},
											'flex'
										);
									}}
									type={'justify-column'}
									reverse={previewDirection === 'horizontal-reverse' ? true : false}
								/>
							)}
							{(previewDirection === 'vertical-reverse' || previewDirection === 'vertical') && (
								<ResponsiveAlignControls
									label={__('Alignment', 'kadence-blocks')}
									value={
										flex.justifyContent && flex.justifyContent?.[0] ? flex.justifyContent[0] : ''
									}
									tabletValue={
										flex.justifyContent && flex.justifyContent?.[1] ? flex.justifyContent[1] : ''
									}
									mobileValue={
										flex.justifyContent && flex.justifyContent?.[2] ? flex.justifyContent[2] : ''
									}
									onChange={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[0]
												? flex.justifyContent[0]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													tempValue,
													flex.justifyContent && flex.justifyContent[1]
														? flex.justifyContent[1]
														: '',
													flex.justifyContent && flex.justifyContent[2]
														? flex.justifyContent[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeTablet={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[1]
												? flex.justifyContent[1]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													flex.justifyContent && flex.justifyContent?.[0]
														? flex.justifyContent[0]
														: '',
													tempValue,
													flex.justifyContent && flex.justifyContent[2]
														? flex.justifyContent[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeMobile={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[2]
												? flex.justifyContent[2]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													flex.justifyContent && flex.justifyContent?.[0]
														? flex.justifyContent[0]
														: '',
													flex.justifyContent && flex.justifyContent[1]
														? flex.justifyContent[1]
														: '',
													tempValue,
												],
											},
											'flex'
										);
									}}
									type={'justify-align'}
									reverse={previewDirection === 'horizontal-reverse' ? true : false}
								/>
							)}
							{(previewDirection === 'vertical-reverse' || previewDirection === 'vertical') && (
								<ResponsiveAlignControls
									label={__('Vertical Alignment', 'kadence-blocks')}
									value={undefined !== flex?.verticalAlignment?.[0] ? flex.verticalAlignment[0] : ''}
									mobileValue={
										undefined !== flex?.verticalAlignment?.[1] ? flex.verticalAlignment[1] : ''
									}
									tabletValue={
										undefined !== flex?.verticalAlignment?.[2] ? flex.verticalAlignment[2] : ''
									}
									onChange={(value) => {
										let tempValue = value;
										if (
											(flex.verticalAlignment && flex.verticalAlignment?.[0]
												? flex.verticalAlignment[0]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												verticalAlignment: [
													tempValue,
													flex.verticalAlignment && flex.verticalAlignment?.[1]
														? flex.verticalAlignment[1]
														: '',
													flex.verticalAlignment && flex.verticalAlignment?.[2]
														? flex.verticalAlignment[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeTablet={(value) => {
										let tempValue = value;
										if (
											(undefined !== flex?.verticalAlignment?.[1]
												? flex.verticalAlignment[1]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												verticalAlignmentTablet: [
													flex.verticalAlignment && flex.verticalAlignment?.[1]
														? flex.verticalAlignment[1]
														: '',
													tempValue,
													flex.verticalAlignment && flex.verticalAlignment?.[2]
														? flex.verticalAlignment[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeMobile={(value) => {
										let tempValue = value;
										if (
											(undefined !== flex?.verticalAlignment?.[2]
												? flex.verticalAlignment[2]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute({
											...flex,
											verticalAlignmentMobile: [
												flex.verticalAlignment && flex.verticalAlignment?.[0]
													? flex.verticalAlignment[0]
													: '',
												flex.verticalAlignment && flex.verticalAlignment?.[1]
													? flex.verticalAlignment[1]
													: '',
												tempValue,
											],
										});
									}}
									type={'justify-vertical'}
									reverse={previewDirection === 'vertical-reverse' ? true : false}
								/>
							)}
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Content Size Settings', 'kadence-blocks')}
							panelName={'kb-header-size-settings'}
						>
							<ResponsiveRangeControls
								label={__('Min Height', 'kadence-blocks')}
								value={undefined !== height?.[0] ? height[0] : ''}
								onChange={(value) => {
									setMetaAttribute(
										[
											value,
											undefined !== height?.[1] ? height[1] : '',
											undefined !== height?.[2] ? height[2] : '',
										].map(String),
										'height'
									);
								}}
								tabletValue={undefined !== height?.[1] ? height[1] : ''}
								onChangeTablet={(value) => {
									setMetaAttribute(
										[
											undefined !== height?.[0] ? height[0] : '',
											value,
											undefined !== height?.[2] ? height[2] : '',
										].map(String),
										'height'
									);
								}}
								mobileValue={undefined !== height?.[2] ? height[2] : ''}
								onChangeMobile={(value) => {
									setMetaAttribute(
										[
											undefined !== height?.[0] ? height[0] : '',
											undefined !== height?.[1] ? height[1] : '',
											value,
										].map(String),
										'height'
									);
								}}
								min={0}
								max={heightUnit === 'px' ? 2000 : 200}
								step={1}
								unit={heightUnit ? heightUnit : 'px'}
								onUnit={(value) => {
									setMetaAttribute(value, 'heightUnit');
								}}
								units={['px', 'vw', 'vh']}
							/>
							<ResponsiveRangeControls
								label={__('Max Width', 'kadence-blocks')}
								value={undefined !== width?.[0] ? width[0] : ''}
								onChange={(value) => {
									setMetaAttribute(
										[
											value,
											undefined !== width?.[1] ? width[1] : '',
											undefined !== width?.[2] ? width[2] : '',
										].map(String),
										'width'
									);
								}}
								tabletValue={undefined !== width?.[1] ? width[1] : ''}
								onChangeTablet={(value) => {
									setMetaAttribute(
										[
											undefined !== width?.[0] ? width[0] : '',
											value,
											undefined !== width?.[2] ? width[2] : '',
										].map(String),
										'width'
									);
								}}
								mobileValue={undefined !== width?.[2] ? width[2] : ''}
								onChangeMobile={(value) => {
									setMetaAttribute(
										[
											undefined !== width?.[0] ? width[0] : '',
											undefined !== width?.[1] ? width[1] : '',
											value,
										].map(String),
										'width'
									);
								}}
								min={0}
								max={widthUnit === 'px' ? 2000 : 200}
								step={1}
								unit={widthUnit ? widthUnit : 'px'}
								onUnit={(value) => {
									setMetaAttribute(value, 'widthUnit');
								}}
								units={['px', 'vw', 'vh']}
							/>
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<>
						<KadencePanelBody
							title={__('Background Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-header-bg-settings'}
						>
							<HoverToggleControl
								normal={
									<>
										<BackgroundTypeControl
											label={__('Type', 'kadence-blocks')}
											type={undefined != background?.type ? background.type : 'normal'}
											onChange={(value) =>
												setMetaAttribute({ ...background, type: value }, 'background')
											}
											allowedTypes={['normal', 'gradient']}
										/>
										{'normal' === background?.type && (
											<>
												<PopColorControl
													label={__('Background Color', 'kadence-blocks')}
													value={undefined !== background?.color ? background.color : ''}
													default={''}
													onChange={(value) => {
														setMetaAttribute({ ...background, color: value }, 'background');
													}}
												/>
												<KadenceBackgroundControl
													label={__('Background Image', 'kadence-blocks')}
													hasImage={
														undefined === background.image || '' === background.image
															? false
															: true
													}
													imageURL={background.image ? background.image : ''}
													imageID={background.imageID}
													imagePosition={
														background.position ? background.position : 'center center'
													}
													imageSize={background.size ? background.size : 'cover'}
													imageRepeat={background.repeat ? background.repeat : 'no-repeat'}
													imageAttachment={
														background.attachment ? background.attachment : 'scroll'
													}
													imageAttachmentParallax={true}
													onRemoveImage={() => {
														setMetaAttribute(
															{ ...background, imageID: undefined },
															'background'
														);
														setMetaAttribute(
															{ ...background, image: undefined },
															'background'
														);
													}}
													onSaveImage={(value) => {
														setMetaAttribute(
															{ ...background, imageID: value.id.toString() },
															'background'
														);
														setMetaAttribute(
															{ ...background, image: value.url },
															'background'
														);
													}}
													onSaveURL={(newURL) => {
														if (newURL !== background.image) {
															setMetaAttribute(
																{ ...background, imageID: undefined },
																'background'
															);
															setMetaAttribute(
																{ ...background, image: newURL },
																'background'
															);
														}
													}}
													onSavePosition={(value) =>
														setMetaAttribute(
															{ ...background, position: value },
															'background'
														)
													}
													onSaveSize={(value) =>
														setMetaAttribute({ ...background, size: value }, 'background')
													}
													onSaveRepeat={(value) =>
														setMetaAttribute({ ...background, repeat: value }, 'background')
													}
													onSaveAttachment={(value) =>
														setMetaAttribute(
															{ ...background, attachment: value },
															'background'
														)
													}
													disableMediaButtons={background.image ? true : false}
													dynamicAttribute="background:image"
													isSelected={isSelected}
													attributes={attributes}
													setAttributes={setAttributes}
													name={'kadence/header'}
													clientId={clientId}
													context={context}
												/>
											</>
										)}
										{'gradient' === background?.type && (
											<>
												<GradientControl
													value={background?.gradient}
													onChange={(value) => {
														setMetaAttribute(
															{ ...background, gradient: value },
															'background'
														);
													}}
													gradients={[]}
												/>
											</>
										)}
									</>
								}
								hover={
									<>
										<BackgroundTypeControl
											label={__('Hover Type', 'kadence-blocks')}
											type={undefined != backgroundHover?.type ? backgroundHover.type : 'normal'}
											onChange={(value) =>
												setMetaAttribute({ ...backgroundHover, type: value }, 'backgroundHover')
											}
											allowedTypes={['normal', 'gradient']}
										/>
										{'normal' === backgroundHover?.type && (
											<>
												<PopColorControl
													label={__('Background Color', 'kadence-blocks')}
													value={
														undefined !== backgroundHover?.color
															? backgroundHover.color
															: ''
													}
													default={''}
													onChange={(value) => {
														setMetaAttribute(
															{ ...backgroundHover, color: value },
															'backgroundHover'
														);
													}}
												/>
												<KadenceBackgroundControl
													label={__('Background Image', 'kadence-blocks')}
													hasImage={
														undefined === backgroundHover.image ||
														'' === backgroundHover.image
															? false
															: true
													}
													imageURL={backgroundHover.image ? backgroundHover.image : ''}
													imageID={backgroundHover.imageID}
													imagePosition={
														backgroundHover.imagePosition
															? backgroundHover.imagePosition
															: 'center center'
													}
													imageSize={
														backgroundHover.imageSize ? backgroundHover.imageSize : 'cover'
													}
													imageRepeat={
														backgroundHover.imageRepeat
															? backgroundHover.imageRepeat
															: 'no-repeat'
													}
													imageAttachment={
														backgroundHover.imageAttachment
															? backgroundHover.imageAttachment
															: 'scroll'
													}
													imageAttachmentParallax={true}
													onRemoveImage={() => {
														setMetaAttribute(
															{ ...backgroundHover, imageID: undefined },
															'backgroundHover'
														);
														setMetaAttribute(
															{ ...backgroundHover, image: undefined },
															'backgroundHover'
														);
													}}
													onSaveImage={(value) => {
														setMetaAttribute(
															{ ...backgroundHover, imageID: value.id.toString() },
															'backgroundHover'
														);
														setMetaAttribute(
															{ ...backgroundHover, image: value.url },
															'backgroundHover'
														);
													}}
													onSaveURL={(newURL) => {
														if (newURL !== backgroundHover.image) {
															setMetaAttribute(
																{ ...backgroundHover, imageID: undefined },
																'backgroundHover'
															);
															setMetaAttribute(
																{ ...backgroundHover, image: newURL },
																'backgroundHover'
															);
														}
													}}
													onSavePosition={(value) =>
														setMetaAttribute(
															{ ...backgroundHover, imagePosition: value },
															'backgroundHover'
														)
													}
													onSaveSize={(value) =>
														setMetaAttribute(
															{ ...backgroundHover, imageSize: value },
															'backgroundHover'
														)
													}
													onSaveRepeat={(value) =>
														setMetaAttribute(
															{ ...backgroundHover, imageRepeat: value },
															'backgroundHover'
														)
													}
													onSaveAttachment={(value) =>
														setMetaAttribute(
															{ ...backgroundHover, imageAttachment: value },
															'backgroundHover'
														)
													}
													disableMediaButtons={backgroundHover.image ? true : false}
													dynamicAttribute="backgroundHover:image"
													isSelected={isSelected}
													attributes={attributes}
													setAttributes={setAttributes}
													name={'kadence/header'}
													clientId={clientId}
													context={context}
												/>
											</>
										)}
										{'gradient' === backgroundHover?.type && (
											<>
												<GradientControl
													value={backgroundHover?.gradient}
													onChange={(value) => {
														setMetaAttribute(
															{ ...backgroundHover, gradient: value },
															'backgroundHover'
														);
													}}
													gradients={[]}
												/>
											</>
										)}
									</>
								}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Border Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-border'}
						>
							<HoverToggleControl
								normal={
									<>
										<ResponsiveBorderControl
											label={__('Border', 'kadence-blocks')}
											value={[border]}
											tabletValue={[tabletBorder]}
											mobileValue={[mobileBorder]}
											onChange={(value) => {
												setMetaAttribute(value[0], 'border');
											}}
											onChangeTablet={(value) => setMetaAttribute(value[0], 'tabletBorder')}
											onChangeMobile={(value) => setMetaAttribute(value[0], 'mobileBorder')}
										/>
										<ResponsiveMeasurementControls
											label={__('Border Radius', 'kadence-blocks')}
											value={borderRadius}
											tabletValue={tabletBorderRadius}
											mobileValue={mobileBorderRadius}
											onChange={(value) => setMetaAttribute(value, 'borderRadius')}
											onChangeTablet={(value) => setMetaAttribute(value, 'tabletBorderRadius')}
											onChangeMobile={(value) => setMetaAttribute(value, 'mobileBorderRadius')}
											unit={borderRadiusUnit}
											units={['px', 'em', 'rem', '%']}
											onUnit={(value) => setMetaAttribute(value, 'borderRadiusUnit')}
											max={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 24 : 500}
											step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
											min={0}
											isBorderRadius={true}
											allowEmpty={true}
										/>
									</>
								}
								hover={
									<>
										<ResponsiveBorderControl
											label={__('Hover Border', 'kadence-blocks')}
											value={[hoverBorder]}
											tabletValue={[tabletHoverBorder]}
											mobileValue={[mobileHoverBorder]}
											onChange={(value) => {
												setMetaAttribute(value[0], 'hoverBorder');
											}}
											onChangeTablet={(value) => setMetaAttribute(value[0], 'tabletHoverBorder')}
											onChangeMobile={(value) => setMetaAttribute(value[0], 'mobileHoverBorder')}
										/>
										<ResponsiveMeasurementControls
											label={__('Border Radius', 'kadence-blocks')}
											value={borderHoverRadius}
											tabletValue={tabletBorderHoverRadius}
											mobileValue={mobileBorderHoverRadius}
											onChange={(value) => setMetaAttribute(value, 'borderHoverRadius')}
											onChangeTablet={(value) =>
												setMetaAttribute(value, 'tabletBorderHoverRadius')
											}
											onChangeMobile={(value) =>
												setMetaAttribute(value, 'mobileBorderHoverRadius')
											}
											unit={borderHoverRadiusUnit}
											units={['px', 'em', 'rem', '%']}
											onUnit={(value) => setMetaAttribute(value, 'borderHoverRadiusUnit')}
											max={
												borderHoverRadiusUnit === 'em' || borderHoverRadiusUnit === 'rem'
													? 24
													: 500
											}
											step={
												borderHoverRadiusUnit === 'em' || borderHoverRadiusUnit === 'rem'
													? 0.1
													: 1
											}
											min={0}
											isBorderRadius={true}
											allowEmpty={true}
										/>
									</>
								}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Typography Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-font-family'}
						>
							<TypographyControls
								fontGroup={'header'}
								fontSize={typography.size}
								onFontSize={(value) => setMetaAttribute({ ...typography, size: value }, 'typography')}
								fontSizeType={typography.sizeType}
								onFontSizeType={(value) =>
									setMetaAttribute({ ...typography, sizeType: value }, 'typography')
								}
								lineHeight={typography.lineHeight}
								onLineHeight={(value) =>
									setMetaAttribute({ ...typography, lineHeight: value }, 'typography')
								}
								lineHeightType={typography.lineType}
								onLineHeightType={(value) =>
									setMetaAttribute({ ...typography, lineType: value }, 'typography')
								}
								reLetterSpacing={typography.letterSpacing}
								onLetterSpacing={(value) =>
									setMetaAttribute({ ...typography, letterSpacing: value }, 'typography')
								}
								letterSpacingType={typography.letterType}
								onLetterSpacingType={(value) =>
									setMetaAttribute({ ...typography, letterType: value }, 'typography')
								}
								textTransform={typography.textTransform}
								onTextTransform={(value) =>
									setMetaAttribute({ ...typography, textTransform: value }, 'typography')
								}
								fontFamily={typography.family}
								onFontFamily={(value) =>
									setMetaAttribute({ ...typography, family: value }, 'typography')
								}
								onFontChange={(select) => {
									setMetaAttribute({ ...typography, ...select }, 'typography');
								}}
								onFontArrayChange={(values) =>
									setMetaAttribute({ ...typography, ...values }, 'typography')
								}
								googleFont={typography.google}
								onGoogleFont={(value) =>
									setMetaAttribute({ ...typography, google: value }, 'typography')
								}
								loadGoogleFont={typography.loadGoogle}
								onLoadGoogleFont={(value) =>
									setMetaAttribute({ ...typography, loadGoogle: value }, 'typography')
								}
								fontVariant={typography.variant}
								onFontVariant={(value) =>
									setMetaAttribute({ ...typography, variant: value }, 'typography')
								}
								fontWeight={typography.weight}
								onFontWeight={(value) =>
									setMetaAttribute({ ...typography, weight: value }, 'typography')
								}
								fontStyle={typography.style}
								onFontStyle={(value) => setMetaAttribute({ ...typography, style: value }, 'typography')}
								fontSubset={typography.subset}
								onFontSubset={(value) =>
									setMetaAttribute({ ...typography, subset: value }, 'typography')
								}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Text Color Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-text-color'}
						>
							<ColorGroup>
								<PopColorControl
									label={__('Text Color', 'kadence-blocks')}
									value={textColor ? textColor : ''}
									default={''}
									onChange={(value) => setMetaAttribute(value, 'textColor')}
								/>
								<PopColorControl
									label={__('Link Color', 'kadence-blocks')}
									value={linkColor ? linkColor : ''}
									default={''}
									onChange={(value) => setMetaAttribute(value, 'linkColor')}
									swatchLabel2={__('Hover Color', 'kadence-blocks')}
									value2={linkHoverColor ? linkHoverColor : ''}
									default2={''}
									onChange2={(value) => setMetaAttribute(value, 'linkHoverColor')}
								/>
							</ColorGroup>
						</KadencePanelBody>
						<div className="kt-sidebar-settings-spacer"></div>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-header-padding'}>
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
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200}
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
								min={marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setMetaAttribute(value, 'marginUnit')}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
								allowAuto={true}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					__nextHasNoMarginBottom
					className="html-anchor-control"
					label={__('HTML anchor')}
					help={
						<>
							{__(
								'Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page.'
							)}

							<ExternalLink href={__('https://wordpress.org/documentation/article/page-jumps/')}>
								{__('Learn more about anchors')}
							</ExternalLink>
						</>
					}
					value={anchor}
					placeholder={__('Add an anchor')}
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
					label={__('Additional CSS class(es)')}
					value={className}
					onChange={(nextValue) => {
						setMetaAttribute(nextValue !== '' ? nextValue : undefined, 'className');
					}}
					help={__('Separate multiple classes with spaces.')}
				/>
			</InspectorAdvancedControls>
			<div {...innerBlocksProps} />
			{/*<SpacingVisualizer*/}
			{/*	style={ {*/}
			{/*		marginLeft: ( undefined !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),*/}
			{/*		marginRight: ( undefined !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),*/}
			{/*		marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),*/}
			{/*		marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),*/}
			{/*	} }*/}
			{/*	type="inside"*/}
			{/*	forceShow={ paddingMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewPaddingTop, paddingUnit ), getSpacingOptionOutput( previewPaddingRight, paddingUnit ), getSpacingOptionOutput( previewPaddingBottom, paddingUnit ), getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) ] }*/}
			{/*/>*/}
			{/*<SpacingVisualizer*/}
			{/*	type="inside"*/}
			{/*	forceShow={ marginMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewMarginTop, marginUnit ), getSpacingOptionOutput( previewMarginRight, marginUnit ), getSpacingOptionOutput( previewMarginBottom, marginUnit ), getSpacingOptionOutput( previewMarginLeft, marginUnit ) ] }*/}
			{/*/>*/}
		</>
	);
}
export default EditInner;

function useHeaderProp(prop) {
	return useEntityProp('postType', 'kadence_header', prop);
}
