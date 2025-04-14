/**
 * BLOCK: Kadence Advanced Btn Single.
 *
 * Editor for Advanced Btn
 */
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	getFontSizeOptionOutput,
	typographyStyle,
	getBorderStyle,
	setBlockDefaults,
	getBorderColor,
	getUniqueId,
	getInQueryBlock,
	getPostOrFseId,
} from '@kadence/helpers';

import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	SmallResponsiveControl,
	ResponsiveRangeControls,
	IconRender,
	HoverToggleControl,
	ResponsiveBorderControl,
	KadenceIconPicker,
	KadencePanelBody,
	URLInputControl,
	KadenceWebfontLoader,
	BackgroundTypeControl,
	KadenceRadioButtons,
	URLInputInline,
	ResponsiveAlignControls,
	GradientControl,
	BoxShadowControl,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	DynamicTextControl,
	DynamicInlineReplaceControl,
	Tooltip,
} from '@kadence/components';
import classnames from 'classnames';
import { times, filter, map, uniqueId } from 'lodash';

import metadata from './block.json';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { tooltip as tooltipIcon } from '@kadence/icons';
import { link as linkIcon } from '@wordpress/icons';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import { useEffect, useState } from '@wordpress/element';
import {
	RichText,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	JustifyContentControl,
	BlockVerticalAlignmentControl,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToolbarGroup,
	SelectControl,
	ToggleControl,
	ToolbarButton,
	Spinner,
	TextareaControl,
	Dropdown,
	Button,
} from '@wordpress/components';
import { addFilter, applyFilters, doAction } from '@wordpress/hooks';
import BackendStyles from './components/backend-styles';

export default function KadenceButtonEdit(props) {
	const { attributes, setAttributes, isSelected, context, clientId, name } = props;
	const {
		uniqueID,
		text,
		link,
		target,
		sponsored,
		download,
		noFollow,
		sizePreset,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		color,
		background,
		backgroundType,
		textBackgroundType,
		textGradient,
		textBackgroundHoverType,
		textGradientHover,
		gradient,
		colorHover,
		backgroundHover,
		backgroundHoverType,
		gradientHover,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		typography,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		borderHoverRadius,
		tabletBorderHoverRadius,
		mobileBorderHoverRadius,
		borderHoverRadiusUnit,
		icon,
		iconSide,
		iconHover,
		width,
		widthUnit,
		widthType,
		displayShadow,
		shadow,
		displayHoverShadow,
		shadowHover,
		inheritStyles,
		iconSize,
		iconPadding,
		tabletIconPadding,
		mobileIconPadding,
		iconPaddingUnit,
		onlyIcon,
		onlyText,
		iconColor,
		iconColorHover,
		label,
		marginUnit,
		margin,
		iconSizeUnit,
		tabletMargin,
		mobileMargin,
		kadenceAOSOptions,
		kadenceAnimation,
		hideLink,
		iconTitle,
		textUnderline,
		inQueryBlock,
		kadenceDynamic,
		className,
		colorTransparent,
		colorTransparentHover,
		backgroundTransparent,
		backgroundTransparentType,
		gradientTransparent,
		backgroundTransparentHover,
		backgroundTransparentHoverType,
		gradientTransparentHover,
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle,
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		borderTransparentRadius,
		tabletBorderTransparentRadius,
		mobileBorderTransparentRadius,
		borderTransparentRadiusUnit,
		borderTransparentHoverRadius,
		tabletBorderTransparentHoverRadius,
		mobileBorderTransparentHoverRadius,
		borderTransparentHoverRadiusUnit,
		displayShadowTransparent,
		shadowTransparent,
		displayHoverShadowTransparent,
		shadowTransparentHover,
		colorSticky,
		colorStickyHover,
		backgroundSticky,
		backgroundStickyType,
		gradientSticky,
		backgroundStickyHover,
		backgroundStickyHoverType,
		gradientStickyHover,
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle,
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		borderStickyRadius,
		tabletBorderStickyRadius,
		mobileBorderStickyRadius,
		borderStickyRadiusUnit,
		borderStickyHoverRadius,
		tabletBorderStickyHoverRadius,
		mobileBorderStickyHoverRadius,
		borderStickyHoverRadiusUnit,
		displayShadowSticky,
		shadowSticky,
		displayHoverShadowSticky,
		shadowStickyHover,
		tooltip,
		tooltipPlacement,
		buttonRole,
	} = attributes;

	// Support rank math content analysis.
	if (uniqueID !== '') {
		const rankMathContent =
			'<!-- KB:BTN:' +
			uniqueID +
			' -->' +
			(link !== '' ? '<a href="' + link + '">' + text + '</a>' : '<button>' + text + '</button>') +
			'<!-- /KB:BTN:' +
			uniqueID +
			' -->';
		addFilter('rank_math_content', 'kadence/advbtn', (content) => {
			const regex = new RegExp('<!-- KB:BTN:' + uniqueID + ' -->[^]*?<!-- /KB:BTN:' + uniqueID + ' -->', 'g');
			return content.replace(regex, '') + rankMathContent;
		});
	}
	const { updateBlockAttributes } = useDispatch(blockEditorStore);
	const { btnsBlock, rootID } = useSelect(
		(select) => {
			const { getBlockRootClientId, getBlocksByClientId } = select(blockEditorStore);
			const rootID = getBlockRootClientId(clientId);
			const btnsBlock = getBlocksByClientId(rootID);
			return {
				btnsBlock: undefined !== btnsBlock ? btnsBlock : '',
				rootID: undefined !== rootID ? rootID : '',
			};
		},
		[clientId]
	);
	const updateParentBlock = (key, value) => {
		updateBlockAttributes(rootID, { [key]: value });
	};
	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);
	const marginMouseOver = mouseOverVisualizer();
	const paddingMouseOver = mouseOverVisualizer();
	useEffect(() => {
		setBlockDefaults('kadence/singlebtn', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}

		setAttributes({ inQueryBlock: getInQueryBlock(context, inQueryBlock) });

		if (!inQueryBlock) {
			doAction('kadence.triggerDynamicUpdate', 'link', 'link', props);
		}
	}, []);

	const [activeTab, setActiveTab] = useState('general');
	const [isEditingURL, setIsEditingURL] = useState(false);
	useEffect(() => {
		if (!isSelected) {
			setIsEditingURL(false);
		}
	}, [isSelected]);
	function startEditing(event) {
		event.preventDefault();
		setIsEditingURL(true);
	}
	const saveTypography = (value) => {
		const newUpdate = typography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			typography: newUpdate,
		});
	};
	const saveShadow = (value) => {
		const newUpdate = shadow.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadow: newUpdate,
		});
	};
	const saveShadowHover = (value) => {
		const newItems = shadowHover.map((item, thisIndex) => {
			if (0 === thisIndex) {
				item = { ...item, ...value };
			}

			return item;
		});
		setAttributes({
			shadowHover: newItems,
		});
	};
	const saveShadowTransparent = (value) => {
		const newUpdate = shadowTransparent.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadowTransparent: newUpdate,
		});
	};
	const saveShadowTransparentHover = (value) => {
		const newUpdate = shadowTransparentHover.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadowTransparentHover: newUpdate,
		});
	};
	const saveShadowSticky = (value) => {
		const newUpdate = shadowSticky.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadowSticky: newUpdate,
		});
	};
	const saveShadowStickyHover = (value) => {
		const newUpdate = shadowStickyHover.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadowStickyHover: newUpdate,
		});
	};
	const btnSizes = [
		{ value: 'small', label: __('SM', 'kadence-blocks') },
		{ value: 'standard', label: __('MD', 'kadence-blocks') },
		{ value: 'large', label: __('LG', 'kadence-blocks') },
		{ value: 'xlarge', label: __('XL', 'kadence-blocks') },
	];
	const btnWidths = [
		{ value: 'auto', label: __('Auto', 'kadence-blocks') },
		{ value: 'fixed', label: __('Fixed', 'kadence-blocks') },
		{ value: 'full', label: __('Full', 'kadence-blocks') },
	];
	const defineWidthType = (type) => {
		if ('full' === type) {
			//updateParentBlock( 'forceFullwidth', true );
			setAttributes({ widthType: type });
		} else {
			//updateParentBlock( 'forceFullwidth', false );
			setAttributes({ widthType: type });
		}
	};
	const buttonStyleOptions = [
		{ value: 'fill', label: __('Fill', 'kadence-blocks') },
		{ value: 'outline', label: __('Outline', 'kadence-blocks') },
		{ value: 'inherit', label: __('Theme', 'kadence-blocks') },
	];

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin?.[0] ? margin[0] : '',
		undefined !== tabletMargin?.[0] ? tabletMargin[0] : '',
		undefined !== mobileMargin?.[0] ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin?.[1] ? margin[1] : '',
		undefined !== tabletMargin?.[1] ? tabletMargin[1] : '',
		undefined !== mobileMargin?.[1] ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin?.[2] ? margin[2] : '',
		undefined !== tabletMargin?.[2] ? tabletMargin[2] : '',
		undefined !== mobileMargin?.[2] ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin?.[3] ? margin[3] : '',
		undefined !== tabletMargin?.[3] ? tabletMargin[3] : '',
		undefined !== mobileMargin?.[3] ? mobileMargin[3] : ''
	);
	const previewMarginUnit = marginUnit ? marginUnit : 'px';

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding?.[0] ? padding[0] : '',
		undefined !== tabletPadding?.[0] ? tabletPadding[0] : '',
		undefined !== mobilePadding?.[0] ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding?.[1] ? padding[1] : '',
		undefined !== tabletPadding?.[1] ? tabletPadding[1] : '',
		undefined !== mobilePadding?.[1] ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding?.[2] ? padding[2] : '',
		undefined !== tabletPadding?.[2] ? tabletPadding[2] : '',
		undefined !== mobilePadding?.[2] ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding?.[3] ? padding[3] : '',
		undefined !== tabletPadding?.[3] ? tabletPadding[3] : '',
		undefined !== mobilePadding?.[3] ? mobilePadding[3] : ''
	);

	const previewPaddingUnit = paddingUnit ? paddingUnit : 'px';

	const previewIconSize = getPreviewSize(
		previewDevice,
		undefined !== iconSize?.[0] ? iconSize[0] : '',
		undefined !== iconSize?.[1] ? iconSize[1] : '',
		undefined !== iconSize?.[2] ? iconSize[2] : ''
	);
	const previewIconPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[0] ? iconPadding[0] : '',
		undefined !== tabletIconPadding?.[0] ? tabletIconPadding[0] : '',
		undefined !== mobileIconPadding?.[0] ? mobileIconPadding[0] : ''
	);
	const previewIconPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[1] ? iconPadding[1] : '',
		undefined !== tabletIconPadding?.[1] ? tabletIconPadding[1] : '',
		undefined !== mobileIconPadding?.[1] ? mobileIconPadding[1] : ''
	);
	const previewIconPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[2] ? iconPadding[2] : '',
		undefined !== tabletIconPadding?.[2] ? tabletIconPadding[2] : '',
		undefined !== mobileIconPadding?.[2] ? mobileIconPadding[2] : ''
	);
	const previewIconPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[3] ? iconPadding[3] : '',
		undefined !== tabletIconPadding?.[3] ? tabletIconPadding[3] : '',
		undefined !== mobileIconPadding?.[3] ? mobileIconPadding[3] : ''
	);

	const previewFixedWidth = getPreviewSize(
		previewDevice,
		undefined !== width?.[0] ? width[0] : '',
		undefined !== width?.[1] ? width[1] : undefined,
		undefined !== width?.[2] ? width[2] : undefined
	);

	const previewAlign = getPreviewSize(
		previewDevice,
		undefined !== btnsBlock?.[0]?.attributes?.hAlign ? btnsBlock?.[0]?.attributes?.hAlign : '',
		undefined !== btnsBlock?.[0]?.attributes?.thAlign ? btnsBlock?.[0]?.attributes?.thAlign : '',
		undefined !== btnsBlock?.[0]?.attributes?.mhAlign ? btnsBlock?.[0]?.attributes?.mhAlign : ''
	);
	const previewVertical = getPreviewSize(
		previewDevice,
		undefined !== btnsBlock?.[0]?.attributes?.vAlign ? btnsBlock?.[0]?.attributes?.vAlign : '',
		undefined !== btnsBlock?.[0]?.attributes?.tvAlign ? btnsBlock?.[0]?.attributes?.tvAlign : '',
		undefined !== btnsBlock?.[0]?.attributes?.mvAlign ? btnsBlock?.[0]?.attributes?.mvAlign : ''
	);
	const previewOnlyIcon = getPreviewSize(
		previewDevice,
		undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
		undefined !== onlyIcon?.[1] ? onlyIcon[1] : undefined,
		undefined !== onlyIcon?.[2] ? onlyIcon[2] : undefined
	);
	const previewOnlyText = getPreviewSize(
		previewDevice,
		false,
		undefined !== onlyText?.[0] ? onlyText[0] : undefined,
		undefined !== onlyText?.[1] ? onlyText[1] : undefined
	);
	const nonTransAttrs = ['hideLink', 'link', 'target', 'download', 'text', 'sponsor'];
	const btnClassName = classnames({
		'kt-button': true,
		[`kt-button-${uniqueID}`]: true,
		[`kb-btn-global-${inheritStyles}`]: inheritStyles,
		'wp-block-button__link': inheritStyles && 'inherit' === inheritStyles,
		[`kb-btn-has-icon`]: undefined !== previewOnlyText && previewOnlyText ? false : icon,
		[`kt-btn-svg-show-${!iconHover ? 'always' : 'hover'}`]: icon,
		[`kb-btn-only-icon`]: previewOnlyIcon,
		[`kb-btn-only-text`]: previewOnlyText,
		[`kt-btn-size-${sizePreset ? sizePreset : 'standard'}`]: true,
		[`kb-btn-underline-${textUnderline}`]: textUnderline,
		[`${className}`]: className,
	});
	const wrapClasses = classnames({
		[`kb-single-btn-${uniqueID}`]: true,
		[`kt-btn-width-type-${widthType ? widthType : 'auto'}`]: true,
	});
	const blockProps = useBlockProps({
		className: wrapClasses,
		style: {
			width:
				undefined !== widthType &&
				'fixed' === widthType &&
				'%' === (undefined !== widthUnit ? widthUnit : 'px') &&
				'' !== previewFixedWidth
					? previewFixedWidth + (undefined !== widthUnit ? widthUnit : 'px')
					: undefined,
		},
	});
	const isDynamicReplaced =
		undefined !== kadenceDynamic &&
		undefined !== kadenceDynamic.text &&
		undefined !== kadenceDynamic.text.enable &&
		kadenceDynamic.text.enable;
	const richTextFormatsBase = ['core/bold', 'core/italic', 'core/strikethrough', 'toolset/inline-field'];
	const richTextFormats = !kadenceDynamic?.text?.shouldReplace
		? [...['kadence/insert-dynamic'], ...richTextFormatsBase]
		: richTextFormatsBase;

	return (
		<div {...blockProps}>
			<BackendStyles {...props} previewDevice={previewDevice} />
			<BlockControls>
				<ToolbarGroup>
					<JustifyContentControl
						value={previewAlign}
						onChange={(value) => {
							if (previewDevice === 'Mobile') {
								updateParentBlock('mhAlign', value ? value : '');
							} else if (previewDevice === 'Tablet') {
								updateParentBlock('thAlign', value ? value : '');
							} else {
								updateParentBlock('hAlign', value ? value : 'center');
							}
						}}
					/>
					<BlockVerticalAlignmentControl
						value={previewVertical}
						onChange={(value) => {
							if (previewDevice === 'Mobile') {
								updateParentBlock('mvAlign', value ? value : '');
							} else if (previewDevice === 'Tablet') {
								updateParentBlock('tvAlign', value ? value : '');
							} else {
								updateParentBlock('vAlign', value ? value : 'center');
							}
						}}
					/>
				</ToolbarGroup>
				{!hideLink && (
					<ToolbarGroup>
						<ToolbarButton
							name="link"
							icon={linkIcon}
							title={__('Link', 'kadence-blocks')}
							shortcut={displayShortcut.primary('k')}
							onClick={startEditing}
						/>
					</ToolbarGroup>
				)}
				<ToolbarGroup group="tooltip">
					<Dropdown
						className="kb-popover-inline-tooltip-container components-dropdown-menu components-toolbar"
						contentClassName="kb-popover-inline-tooltip"
						placement="bottom"
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								className="components-dropdown-menu__toggle kb-inline-tooltip-toolbar-icon"
								label={__('Tooltip Settings', 'kadence-blocks')}
								icon={tooltipIcon}
								onClick={onToggle}
								aria-expanded={isOpen}
							/>
						)}
						renderContent={() => (
							<>
								<div className="kb-inline-tooltip-control">
									<TextareaControl
										label={__('Tooltip Content', 'kadence-blocks')}
										value={tooltip}
										onChange={(newValue) => setAttributes({ tooltip: newValue })}
									/>
									<SelectControl
										label={__('Placement', 'kadence-blocks')}
										value={tooltipPlacement || 'top'}
										options={[
											{ label: __('Top', 'kadence-blocks'), value: 'top' },
											{ label: __('Top Start', 'kadence-blocks'), value: 'top-start' },
											{ label: __('Top End', 'kadence-blocks'), value: 'top-end' },
											{ label: __('Right', 'kadence-blocks'), value: 'right' },
											{ label: __('Right Start', 'kadence-blocks'), value: 'right-start' },
											{ label: __('Right End', 'kadence-blocks'), value: 'right-end' },
											{ label: __('Bottom', 'kadence-blocks'), value: 'bottom' },
											{ label: __('Bottom Start', 'kadence-blocks'), value: 'bottom-start' },
											{ label: __('Bottom End', 'kadence-blocks'), value: 'bottom-end' },
											{ label: __('Left', 'kadence-blocks'), value: 'left' },
											{ label: __('Left Start', 'kadence-blocks'), value: 'left-start' },
											{ label: __('Left End', 'kadence-blocks'), value: 'left-end' },
											{ label: __('Auto', 'kadence-blocks'), value: 'auto' },
											{ label: __('Auto Start', 'kadence-blocks'), value: 'auto-start' },
											{ label: __('Auto End', 'kadence-blocks'), value: 'auto-end' },
										]}
										onChange={(val) => {
											setAttributes({ tooltipPlacement: val });
										}}
									/>
								</div>
							</>
						)}
					/>
				</ToolbarGroup>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				{Boolean(kadenceDynamic?.text?.shouldReplace) && (
					<DynamicTextControl dynamicAttribute={'text'} {...props} />
				)}
			</BlockControls>
			{!hideLink && isSelected && isEditingURL && (
				<URLInputInline
					url={link}
					onChangeUrl={(value) => {
						setAttributes({ link: value });
					}}
					additionalControls={true}
					changeTargetType={true}
					opensInNewTab={undefined !== target ? target : ''}
					onChangeTarget={(value) => {
						setAttributes({ target: value });
					}}
					linkNoFollow={undefined !== noFollow ? noFollow : false}
					onChangeFollow={(value) => {
						setAttributes({ noFollow: value });
					}}
					linkSponsored={undefined !== sponsored ? sponsored : false}
					onChangeSponsored={(value) => {
						setAttributes({ sponsored: value });
					}}
					linkDownload={undefined !== download ? download : false}
					onChangeDownload={(value) => {
						setAttributes({ download: value });
					}}
					dynamicAttribute={'link'}
					allowClear={true}
					isSelected={isSelected}
					attributes={attributes}
					setAttributes={setAttributes}
					name={name}
					clientId={clientId}
					context={context}
				/>
			)}
			{showSettings('allSettings', 'kadence/advancedbtn') && (
				<>
					<InspectorControls>
						<InspectorControlTabs
							panelName={'singlebtn'}
							setActiveTab={(value) => setActiveTab(value)}
							activeTab={activeTab}
						/>

						{activeTab === 'general' && (
							<>
								<KadencePanelBody
									title={__('Button Settings', 'kadence-blocks')}
									initialOpen={true}
									panelName={'kb-adv-single-btn'}
								>
									{!hideLink && (
										<URLInputControl
											label={__('Button Link', 'kadence-blocks')}
											url={link}
											onChangeUrl={(value) => {
												setAttributes({ link: value });
											}}
											additionalControls={true}
											changeTargetType={true}
											opensInNewTab={undefined !== target ? target : ''}
											onChangeTarget={(value) => {
												setAttributes({ target: value });
											}}
											linkNoFollow={undefined !== noFollow ? noFollow : false}
											onChangeFollow={(value) => {
												setAttributes({ noFollow: value });
											}}
											linkSponsored={undefined !== sponsored ? sponsored : false}
											onChangeSponsored={(value) => {
												setAttributes({ sponsored: value });
											}}
											linkDownload={undefined !== download ? download : false}
											onChangeDownload={(value) => {
												setAttributes({ download: value });
											}}
											dynamicAttribute={'link'}
											allowClear={true}
											isSelected={isSelected}
											attributes={attributes}
											setAttributes={setAttributes}
											name={name}
											clientId={clientId}
											context={context}
										/>
									)}
									<KadenceRadioButtons
										value={inheritStyles}
										options={buttonStyleOptions}
										hideLabel={false}
										label={__('Button Inherit Styles', 'kadence-blocks')}
										onChange={(value) => {
											setAttributes({
												inheritStyles: value,
											});
										}}
									/>
									{showSettings('sizeSettings', 'kadence/advancedbtn') && (
										<>
											<KadenceRadioButtons
												value={sizePreset}
												options={btnSizes}
												hideLabel={false}
												label={__('Button Size', 'kadence-blocks')}
												onChange={(value) => {
													setAttributes({
														sizePreset: value,
													});
												}}
											/>
											<KadenceRadioButtons
												value={widthType}
												options={btnWidths}
												hideLabel={false}
												label={__('Button Width', 'kadence-blocks')}
												onChange={(value) => {
													setAttributes({
														widthType: value,
													});
												}}
											/>
											{'fixed' === widthType && (
												<div className="kt-inner-sub-section">
													<ResponsiveRangeControls
														label={__('Fixed Width', 'kadence-blocks')}
														value={undefined !== width?.[0] ? width[0] : undefined}
														onChange={(value) => {
															setAttributes({
																width: [
																	value,
																	undefined !== width?.[1] ? width[1] : '',
																	undefined !== width?.[2] ? width[2] : '',
																],
															});
														}}
														tabletValue={undefined !== width?.[1] ? width[1] : undefined}
														onChangeTablet={(value) => {
															setAttributes({
																width: [
																	undefined !== width?.[0] ? width[0] : '',
																	value,
																	undefined !== width?.[2] ? width[2] : '',
																],
															});
														}}
														mobileValue={undefined !== width?.[2] ? width[2] : undefined}
														onChangeMobile={(value) => {
															setAttributes({
																width: [
																	undefined !== width?.[0] ? width[0] : '',
																	undefined !== width?.[1] ? width[1] : '',
																	value,
																],
															});
														}}
														min={0}
														max={(widthUnit ? widthUnit : 'px') !== 'px' ? 100 : 600}
														step={1}
														unit={widthUnit ? widthUnit : 'px'}
														onUnit={(value) => {
															setAttributes({ widthUnit: value });
														}}
														units={['px', '%']}
													/>
												</div>
											)}
										</>
									)}
								</KadencePanelBody>
							</>
						)}

						{activeTab === 'style' && (
							<>
								{showSettings('colorSettings', 'kadence/advancedbtn') && (
									<>
										<KadencePanelBody
											title={__('Button Styles', 'kadence-blocks')}
											initialOpen={true}
											panelName={'kb-adv-single-btn-styles'}
										>
											<HoverToggleControl
												hover={
													<>
														<BackgroundTypeControl
															label={__('Text Type Hover', 'kadence-blocks')}
															type={
																textBackgroundHoverType
																	? textBackgroundHoverType
																	: 'normal'
															}
															onChange={(value) =>
																setAttributes({ textBackgroundHoverType: value })
															}
															allowedTypes={['normal', 'gradient']}
														/>
														{'gradient' === textBackgroundHoverType && (
															<GradientControl
																value={textGradientHover}
																onChange={(value) =>
																	setAttributes({ textGradientHover: value })
																}
																gradients={[]}
															/>
														)}
														{'normal' === textBackgroundHoverType && (
															<PopColorControl
																key={'btncolorhover'}
																label={__('Color Hover', 'kadence-blocks')}
																value={colorHover ? colorHover : ''}
																default={''}
																onChange={(value) =>
																	setAttributes({ colorHover: value })
																}
															/>
														)}
														<BackgroundTypeControl
															label={__('Background Hover Type', 'kadence-blocks')}
															type={backgroundHoverType ? backgroundHoverType : 'normal'}
															onChange={(value) =>
																setAttributes({ backgroundHoverType: value })
															}
															allowedTypes={['normal', 'gradient']}
														/>
														{'gradient' === backgroundHoverType && (
															<GradientControl
																value={gradientHover}
																onChange={(value) =>
																	setAttributes({ gradientHover: value })
																}
																gradients={[]}
															/>
														)}
														{'normal' === backgroundHoverType && (
															<PopColorControl
																key={'btnbghover'}
																label={__('Background Color', 'kadence-blocks')}
																value={backgroundHover ? backgroundHover : ''}
																default={''}
																onChange={(value) =>
																	setAttributes({ backgroundHover: value })
																}
															/>
														)}
														<ResponsiveBorderControl
															label={__('Border', 'kadence-blocks')}
															value={borderHoverStyle}
															tabletValue={tabletBorderHoverStyle}
															mobileValue={mobileBorderHoverStyle}
															onChange={(value) =>
																setAttributes({ borderHoverStyle: value })
															}
															onChangeTablet={(value) =>
																setAttributes({ tabletBorderHoverStyle: value })
															}
															onChangeMobile={(value) =>
																setAttributes({ mobileBorderHoverStyle: value })
															}
														/>
														<ResponsiveMeasurementControls
															label={__('Border Radius', 'kadence-blocks')}
															value={borderHoverRadius}
															tabletValue={tabletBorderHoverRadius}
															mobileValue={mobileBorderHoverRadius}
															onChange={(value) =>
																setAttributes({ borderHoverRadius: value })
															}
															onChangeTablet={(value) =>
																setAttributes({ tabletBorderHoverRadius: value })
															}
															onChangeMobile={(value) =>
																setAttributes({ mobileBorderHoverRadius: value })
															}
															unit={borderHoverRadiusUnit}
															units={['px', 'em', 'rem', '%']}
															onUnit={(value) =>
																setAttributes({ borderHoverRadiusUnit: value })
															}
															max={
																borderHoverRadiusUnit === 'em' ||
																borderHoverRadiusUnit === 'rem'
																	? 24
																	: 500
															}
															step={
																borderHoverRadiusUnit === 'em' ||
																borderHoverRadiusUnit === 'rem'
																	? 0.1
																	: 1
															}
															min={0}
															isBorderRadius={true}
															allowEmpty={true}
														/>
														<BoxShadowControl
															label={__('Box Shadow', 'kadence-blocks')}
															enable={
																undefined !== displayHoverShadow
																	? displayHoverShadow
																	: false
															}
															color={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].color
																	? shadowHover[0].color
																	: '#000000'
															}
															colorDefault={'#000000'}
															onArrayChange={(color, opacity) => {
																saveShadowHover({ color, opacity });
															}}
															opacity={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].opacity
																	? shadowHover[0].opacity
																	: 0.2
															}
															hOffset={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].hOffset
																	? shadowHover[0].hOffset
																	: 0
															}
															vOffset={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].vOffset
																	? shadowHover[0].vOffset
																	: 0
															}
															blur={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].blur
																	? shadowHover[0].blur
																	: 14
															}
															spread={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].spread
																	? shadowHover[0].spread
																	: 0
															}
															inset={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].inset
																	? shadowHover[0].inset
																	: false
															}
															onEnableChange={(value) => {
																setAttributes({
																	displayHoverShadow: value,
																});
															}}
															onColorChange={(value) => {
																saveShadowHover({ color: value });
															}}
															onOpacityChange={(value) => {
																saveShadowHover({ opacity: value });
															}}
															onHOffsetChange={(value) => {
																saveShadowHover({ hOffset: value });
															}}
															onVOffsetChange={(value) => {
																saveShadowHover({ vOffset: value });
															}}
															onBlurChange={(value) => {
																saveShadowHover({ blur: value });
															}}
															onSpreadChange={(value) => {
																saveShadowHover({ spread: value });
															}}
															onInsetChange={(value) => {
																saveShadowHover({ inset: value });
															}}
														/>
													</>
												}
												normal={
													<>
														<BackgroundTypeControl
															label={__('Text Type', 'kadence-blocks')}
															type={textBackgroundType ? textBackgroundType : 'normal'}
															onChange={(value) =>
																setAttributes({ textBackgroundType: value })
															}
															allowedTypes={['normal', 'gradient']}
														/>
														{'gradient' === textBackgroundType && (
															<GradientControl
																value={textGradient}
																onChange={(value) =>
																	setAttributes({ textGradient: value })
																}
																gradients={[]}
															/>
														)}
														{'normal' === textBackgroundType && (
															<PopColorControl
																key={'btncolor'}
																label={__('Color', 'kadence-blocks')}
																value={color ? color : ''}
																default={''}
																onChange={(value) => setAttributes({ color: value })}
															/>
														)}
														<BackgroundTypeControl
															label={__('Background Type', 'kadence-blocks')}
															type={backgroundType ? backgroundType : 'normal'}
															onChange={(value) =>
																setAttributes({ backgroundType: value })
															}
															allowedTypes={['normal', 'gradient']}
														/>
														{'gradient' === backgroundType && (
															<GradientControl
																value={gradient}
																onChange={(value) => setAttributes({ gradient: value })}
																gradients={[]}
															/>
														)}
														{'normal' === backgroundType && (
															<PopColorControl
																key={'btnbg'}
																label={__('Background Color', 'kadence-blocks')}
																value={background ? background : ''}
																default={''}
																onChange={(value) =>
																	setAttributes({ background: value })
																}
															/>
														)}
														<ResponsiveBorderControl
															label={__('Border', 'kadence-blocks')}
															value={borderStyle}
															tabletValue={tabletBorderStyle}
															mobileValue={mobileBorderStyle}
															onChange={(value) => setAttributes({ borderStyle: value })}
															onChangeTablet={(value) =>
																setAttributes({ tabletBorderStyle: value })
															}
															onChangeMobile={(value) =>
																setAttributes({ mobileBorderStyle: value })
															}
														/>
														<ResponsiveMeasurementControls
															label={__('Border Radius', 'kadence-blocks')}
															value={borderRadius}
															tabletValue={tabletBorderRadius}
															mobileValue={mobileBorderRadius}
															onChange={(value) => setAttributes({ borderRadius: value })}
															onChangeTablet={(value) =>
																setAttributes({ tabletBorderRadius: value })
															}
															onChangeMobile={(value) =>
																setAttributes({ mobileBorderRadius: value })
															}
															unit={borderRadiusUnit}
															units={['px', 'em', 'rem', '%']}
															onUnit={(value) =>
																setAttributes({ borderRadiusUnit: value })
															}
															max={
																borderRadiusUnit === 'em' || borderRadiusUnit === 'rem'
																	? 24
																	: 500
															}
															step={
																borderRadiusUnit === 'em' || borderRadiusUnit === 'rem'
																	? 0.1
																	: 1
															}
															min={0}
															isBorderRadius={true}
															allowEmpty={true}
														/>
														<BoxShadowControl
															label={__('Box Shadow', 'kadence-blocks')}
															enable={undefined !== displayShadow ? displayShadow : false}
															color={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].color
																	? shadow[0].color
																	: '#000000'
															}
															colorDefault={'#000000'}
															onArrayChange={(color, opacity) => {
																saveShadow({ color, opacity });
															}}
															opacity={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].opacity
																	? shadow[0].opacity
																	: 0.2
															}
															hOffset={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].hOffset
																	? shadow[0].hOffset
																	: 0
															}
															vOffset={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].vOffset
																	? shadow[0].vOffset
																	: 0
															}
															blur={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].blur
																	? shadow[0].blur
																	: 14
															}
															spread={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].spread
																	? shadow[0].spread
																	: 0
															}
															inset={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].inset
																	? shadow[0].inset
																	: false
															}
															onEnableChange={(value) => {
																setAttributes({
																	displayShadow: value,
																});
															}}
															onColorChange={(value) => {
																saveShadow({ color: value });
															}}
															onOpacityChange={(value) => {
																saveShadow({ opacity: value });
															}}
															onHOffsetChange={(value) => {
																saveShadow({ hOffset: value });
															}}
															onVOffsetChange={(value) => {
																saveShadow({ vOffset: value });
															}}
															onBlurChange={(value) => {
																saveShadow({ blur: value });
															}}
															onSpreadChange={(value) => {
																saveShadow({ spread: value });
															}}
															onInsetChange={(value) => {
																saveShadow({ inset: value });
															}}
														/>
													</>
												}
											/>
										</KadencePanelBody>
										{context?.['kadence/headerIsTransparent'] == '1' && (
											<KadencePanelBody
												title={__('Button Transparent Styles', 'kadence-blocks')}
												initialOpen={false}
												panelName={'kb-adv-single-btn-styles-transparent'}
											>
												<HoverToggleControl
													hover={
														<>
															<PopColorControl
																label={__('Color Hover', 'kadence-blocks')}
																value={
																	colorTransparentHover ? colorTransparentHover : ''
																}
																default={''}
																onChange={(value) =>
																	setAttributes({ colorTransparentHover: value })
																}
															/>
															<BackgroundTypeControl
																label={__('Hover Type', 'kadence-blocks')}
																type={
																	backgroundTransparentHoverType
																		? backgroundTransparentHoverType
																		: 'normal'
																}
																onChange={(value) =>
																	setAttributes({
																		backgroundTransparentHoverType: value,
																	})
																}
																allowedTypes={['normal', 'gradient']}
															/>
															{'gradient' === backgroundTransparentHoverType && (
																<GradientControl
																	value={gradientTransparentHover}
																	onChange={(value) =>
																		setAttributes({ gradientHover: value })
																	}
																	gradients={[]}
																/>
															)}
															{'normal' === backgroundTransparentHoverType && (
																<PopColorControl
																	label={__('Background Color', 'kadence-blocks')}
																	value={
																		backgroundTransparentHover
																			? backgroundTransparentHover
																			: ''
																	}
																	default={''}
																	onChange={(value) =>
																		setAttributes({ backgroundHover: value })
																	}
																/>
															)}
															<ResponsiveBorderControl
																label={__('Border', 'kadence-blocks')}
																value={borderTransparentHoverStyle}
																tabletValue={tabletBorderTransparentHoverStyle}
																mobileValue={mobileBorderTransparentHoverStyle}
																onChange={(value) =>
																	setAttributes({
																		borderTransparentHoverStyle: value,
																	})
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderTransparentHoverStyle: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderTransparentHoverStyle: value,
																	})
																}
															/>
															<ResponsiveMeasurementControls
																label={__('Border Radius', 'kadence-blocks')}
																value={borderTransparentHoverRadius}
																tabletValue={tabletBorderTransparentHoverRadius}
																mobileValue={mobileBorderTransparentHoverRadius}
																onChange={(value) =>
																	setAttributes({
																		borderTransparentHoverRadius: value,
																	})
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderTransparentHoverRadius: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderTransparentHoverRadius: value,
																	})
																}
																unit={borderTransparentHoverRadiusUnit}
																units={['px', 'em', 'rem', '%']}
																onUnit={(value) =>
																	setAttributes({
																		borderTransparentHoverRadiusUnit: value,
																	})
																}
																max={
																	borderTransparentHoverRadiusUnit === 'em' ||
																	borderTransparentHoverRadiusUnit === 'rem'
																		? 24
																		: 500
																}
																step={
																	borderTransparentHoverRadiusUnit === 'em' ||
																	borderTransparentHoverRadiusUnit === 'rem'
																		? 0.1
																		: 1
																}
																min={0}
																isBorderRadius={true}
																allowEmpty={true}
															/>
															<BoxShadowControl
																label={__('Box Shadow', 'kadence-blocks')}
																enable={
																	undefined !== displayHoverShadowTransparent
																		? displayHoverShadowTransparent
																		: false
																}
																color={
																	undefined !== shadowTransparentHover &&
																	undefined !== shadowTransparentHover[0] &&
																	undefined !== shadowTransparentHover[0].color
																		? shadowTransparentHover[0].color
																		: '#000000'
																}
																colorDefault={'#000000'}
																onArrayChange={(color, opacity) => {
																	saveShadowTransparentHover({ color, opacity });
																}}
																opacity={
																	undefined !== shadowTransparentHover &&
																	undefined !== shadowTransparentHover[0] &&
																	undefined !== shadowTransparentHover[0].opacity
																		? shadowTransparentHover[0].opacity
																		: 0.2
																}
																hOffset={
																	undefined !== shadowTransparentHover &&
																	undefined !== shadowTransparentHover[0] &&
																	undefined !== shadowTransparentHover[0].hOffset
																		? shadowTransparentHover[0].hOffset
																		: 0
																}
																vOffset={
																	undefined !== shadowTransparentHover &&
																	undefined !== shadowTransparentHover[0] &&
																	undefined !== shadowTransparentHover[0].vOffset
																		? shadowTransparentHover[0].vOffset
																		: 0
																}
																blur={
																	undefined !== shadowTransparentHover &&
																	undefined !== shadowTransparentHover[0] &&
																	undefined !== shadowTransparentHover[0].blur
																		? shadowTransparentHover[0].blur
																		: 14
																}
																spread={
																	undefined !== shadowTransparentHover &&
																	undefined !== shadowTransparentHover[0] &&
																	undefined !== shadowTransparentHover[0].spread
																		? shadowTransparentHover[0].spread
																		: 0
																}
																inset={
																	undefined !== shadowTransparentHover &&
																	undefined !== shadowTransparentHover[0] &&
																	undefined !== shadowTransparentHover[0].inset
																		? shadowTransparentHover[0].inset
																		: false
																}
																onEnableChange={(value) => {
																	setAttributes({
																		displayHoverShadowTransparent: value,
																	});
																}}
																onColorChange={(value) => {
																	saveShadowTransparentHover({ color: value });
																}}
																onOpacityChange={(value) => {
																	saveShadowTransparentHover({ opacity: value });
																}}
																onHOffsetChange={(value) => {
																	saveShadowTransparentHover({ hOffset: value });
																}}
																onVOffsetChange={(value) => {
																	saveShadowTransparentHover({ vOffset: value });
																}}
																onBlurChange={(value) => {
																	saveShadowTransparentHover({ blur: value });
																}}
																onSpreadChange={(value) => {
																	saveShadowTransparentHover({ spread: value });
																}}
																onInsetChange={(value) => {
																	saveShadowTransparentHover({ inset: value });
																}}
															/>
														</>
													}
													normal={
														<>
															<PopColorControl
																label={__('Color', 'kadence-blocks')}
																value={colorTransparent ? colorTransparent : ''}
																default={''}
																onChange={(value) =>
																	setAttributes({ colorTransparent: value })
																}
															/>
															<BackgroundTypeControl
																label={__('Type', 'kadence-blocks')}
																type={
																	backgroundTransparentType
																		? backgroundTransparentType
																		: 'normal'
																}
																onChange={(value) =>
																	setAttributes({ backgroundTransparentType: value })
																}
																allowedTypes={['normal', 'gradient']}
															/>
															{'gradient' === backgroundTransparentType && (
																<GradientControl
																	value={gradientTransparent}
																	onChange={(value) =>
																		setAttributes({ gradientTransparent: value })
																	}
																	gradients={[]}
																/>
															)}
															{'normal' === backgroundTransparentType && (
																<PopColorControl
																	label={__('Background Color', 'kadence-blocks')}
																	value={
																		backgroundTransparent
																			? backgroundTransparent
																			: ''
																	}
																	default={''}
																	onChange={(value) =>
																		setAttributes({ backgroundTransparent: value })
																	}
																/>
															)}
															<ResponsiveBorderControl
																label={__('Border', 'kadence-blocks')}
																value={borderTransparentStyle}
																tabletValue={tabletBorderTransparentStyle}
																mobileValue={mobileBorderTransparentStyle}
																onChange={(value) =>
																	setAttributes({ borderTransparentStyle: value })
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderTransparentStyle: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderTransparentStyle: value,
																	})
																}
															/>
															<ResponsiveMeasurementControls
																label={__('Border Radius', 'kadence-blocks')}
																value={borderTransparentRadius}
																tabletValue={tabletBorderTransparentRadius}
																mobileValue={mobileBorderTransparentRadius}
																onChange={(value) =>
																	setAttributes({ borderTransparentRadius: value })
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderTransparentRadius: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderTransparentRadius: value,
																	})
																}
																unit={borderTransparentRadiusUnit}
																units={['px', 'em', 'rem', '%']}
																onUnit={(value) =>
																	setAttributes({
																		borderTransparentRadiusUnit: value,
																	})
																}
																max={
																	borderTransparentRadiusUnit === 'em' ||
																	borderTransparentRadiusUnit === 'rem'
																		? 24
																		: 500
																}
																step={
																	borderTransparentRadiusUnit === 'em' ||
																	borderTransparentRadiusUnit === 'rem'
																		? 0.1
																		: 1
																}
																min={0}
																isBorderRadius={true}
																allowEmpty={true}
															/>
															<BoxShadowControl
																label={__('Box Shadow', 'kadence-blocks')}
																enable={
																	undefined !== displayShadowTransparent
																		? displayShadowTransparent
																		: false
																}
																color={
																	undefined !== shadowTransparent &&
																	undefined !== shadowTransparent[0] &&
																	undefined !== shadowTransparent[0].color
																		? shadowTransparent[0].color
																		: '#000000'
																}
																colorDefault={'#000000'}
																onArrayChange={(color, opacity) => {
																	saveShadowTransparent({ color, opacity });
																}}
																opacity={
																	undefined !== shadowTransparent &&
																	undefined !== shadowTransparent[0] &&
																	undefined !== shadowTransparent[0].opacity
																		? shadowTransparent[0].opacity
																		: 0.2
																}
																hOffset={
																	undefined !== shadowTransparent &&
																	undefined !== shadowTransparent[0] &&
																	undefined !== shadowTransparent[0].hOffset
																		? shadowTransparent[0].hOffset
																		: 0
																}
																vOffset={
																	undefined !== shadowTransparent &&
																	undefined !== shadowTransparent[0] &&
																	undefined !== shadowTransparent[0].vOffset
																		? shadow[0].vOffset
																		: 0
																}
																blur={
																	undefined !== shadowTransparent &&
																	undefined !== shadowTransparent[0] &&
																	undefined !== shadowTransparent[0].blur
																		? shadowTransparent[0].blur
																		: 14
																}
																spread={
																	undefined !== shadowTransparent &&
																	undefined !== shadowTransparent[0] &&
																	undefined !== shadowTransparent[0].spread
																		? shadowTransparent[0].spread
																		: 0
																}
																inset={
																	undefined !== shadowTransparent &&
																	undefined !== shadowTransparent[0] &&
																	undefined !== shadowTransparent[0].inset
																		? shadowTransparent[0].inset
																		: false
																}
																onEnableChange={(value) => {
																	setAttributes({
																		displayShadowTransparent: value,
																	});
																}}
																onColorChange={(value) => {
																	saveShadowTransparent({ color: value });
																}}
																onOpacityChange={(value) => {
																	saveShadowTransparent({ opacity: value });
																}}
																onHOffsetChange={(value) => {
																	saveShadowTransparent({ hOffset: value });
																}}
																onVOffsetChange={(value) => {
																	saveShadowTransparent({ vOffset: value });
																}}
																onBlurChange={(value) => {
																	saveShadowTransparent({ blur: value });
																}}
																onSpreadChange={(value) => {
																	saveShadowTransparent({ spread: value });
																}}
																onInsetChange={(value) => {
																	saveShadowTransparent({ inset: value });
																}}
															/>
														</>
													}
												/>
											</KadencePanelBody>
										)}
										{context?.['kadence/headerIsSticky'] == '1' && (
											<KadencePanelBody
												title={__('Button Sticky Styles', 'kadence-blocks')}
												initialOpen={false}
												panelName={'kb-adv-single-btn-styles-sticky'}
											>
												<HoverToggleControl
													hover={
														<>
															<PopColorControl
																label={__('Color Hover', 'kadence-blocks')}
																value={colorStickyHover ? colorStickyHover : ''}
																default={''}
																onChange={(value) =>
																	setAttributes({ colorStickyHover: value })
																}
															/>
															<BackgroundTypeControl
																label={__('Hover Type', 'kadence-blocks')}
																type={
																	backgroundStickyHoverType
																		? backgroundStickyHoverType
																		: 'normal'
																}
																onChange={(value) =>
																	setAttributes({
																		backgroundStickyHoverType: value,
																	})
																}
																allowedTypes={['normal', 'gradient']}
															/>
															{'gradient' === backgroundStickyHoverType && (
																<GradientControl
																	value={gradientStickyHover}
																	onChange={(value) =>
																		setAttributes({ gradientHover: value })
																	}
																	gradients={[]}
																/>
															)}
															{'normal' === backgroundStickyHoverType && (
																<PopColorControl
																	label={__('Background Color', 'kadence-blocks')}
																	value={
																		backgroundStickyHover
																			? backgroundStickyHover
																			: ''
																	}
																	default={''}
																	onChange={(value) =>
																		setAttributes({ backgroundHover: value })
																	}
																/>
															)}
															<ResponsiveBorderControl
																label={__('Border', 'kadence-blocks')}
																value={borderStickyHoverStyle}
																tabletValue={tabletBorderStickyHoverStyle}
																mobileValue={mobileBorderStickyHoverStyle}
																onChange={(value) =>
																	setAttributes({
																		borderStickyHoverStyle: value,
																	})
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderStickyHoverStyle: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderStickyHoverStyle: value,
																	})
																}
															/>
															<ResponsiveMeasurementControls
																label={__('Border Radius', 'kadence-blocks')}
																value={borderStickyHoverRadius}
																tabletValue={tabletBorderStickyHoverRadius}
																mobileValue={mobileBorderStickyHoverRadius}
																onChange={(value) =>
																	setAttributes({
																		borderStickyHoverRadius: value,
																	})
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderStickyHoverRadius: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderStickyHoverRadius: value,
																	})
																}
																unit={borderStickyHoverRadiusUnit}
																units={['px', 'em', 'rem', '%']}
																onUnit={(value) =>
																	setAttributes({
																		borderStickyHoverRadiusUnit: value,
																	})
																}
																max={
																	borderStickyHoverRadiusUnit === 'em' ||
																	borderStickyHoverRadiusUnit === 'rem'
																		? 24
																		: 500
																}
																step={
																	borderStickyHoverRadiusUnit === 'em' ||
																	borderStickyHoverRadiusUnit === 'rem'
																		? 0.1
																		: 1
																}
																min={0}
																isBorderRadius={true}
																allowEmpty={true}
															/>
															<BoxShadowControl
																label={__('Box Shadow', 'kadence-blocks')}
																enable={
																	undefined !== displayHoverShadowSticky
																		? displayHoverShadowSticky
																		: false
																}
																color={
																	undefined !== shadowStickyHover &&
																	undefined !== shadowStickyHover[0] &&
																	undefined !== shadowStickyHover[0].color
																		? shadowStickyHover[0].color
																		: '#000000'
																}
																colorDefault={'#000000'}
																onArrayChange={(color, opacity) => {
																	saveShadowStickyHover({ color, opacity });
																}}
																opacity={
																	undefined !== shadowStickyHover &&
																	undefined !== shadowStickyHover[0] &&
																	undefined !== shadowStickyHover[0].opacity
																		? shadowStickyHover[0].opacity
																		: 0.2
																}
																hOffset={
																	undefined !== shadowStickyHover &&
																	undefined !== shadowStickyHover[0] &&
																	undefined !== shadowStickyHover[0].hOffset
																		? shadowStickyHover[0].hOffset
																		: 0
																}
																vOffset={
																	undefined !== shadowStickyHover &&
																	undefined !== shadowStickyHover[0] &&
																	undefined !== shadowStickyHover[0].vOffset
																		? shadowStickyHover[0].vOffset
																		: 0
																}
																blur={
																	undefined !== shadowStickyHover &&
																	undefined !== shadowStickyHover[0] &&
																	undefined !== shadowStickyHover[0].blur
																		? shadowStickyHover[0].blur
																		: 14
																}
																spread={
																	undefined !== shadowStickyHover &&
																	undefined !== shadowStickyHover[0] &&
																	undefined !== shadowStickyHover[0].spread
																		? shadowStickyHover[0].spread
																		: 0
																}
																inset={
																	undefined !== shadowStickyHover &&
																	undefined !== shadowStickyHover[0] &&
																	undefined !== shadowStickyHover[0].inset
																		? shadowStickyHover[0].inset
																		: false
																}
																onEnableChange={(value) => {
																	setAttributes({
																		displayHoverShadowSticky: value,
																	});
																}}
																onColorChange={(value) => {
																	saveShadowStickyHover({ color: value });
																}}
																onOpacityChange={(value) => {
																	saveShadowStickyHover({ opacity: value });
																}}
																onHOffsetChange={(value) => {
																	saveShadowStickyHover({ hOffset: value });
																}}
																onVOffsetChange={(value) => {
																	saveShadowStickyHover({ vOffset: value });
																}}
																onBlurChange={(value) => {
																	saveShadowStickyHover({ blur: value });
																}}
																onSpreadChange={(value) => {
																	saveShadowStickyHover({ spread: value });
																}}
																onInsetChange={(value) => {
																	saveShadowStickyHover({ inset: value });
																}}
															/>
														</>
													}
													normal={
														<>
															<PopColorControl
																label={__('Color', 'kadence-blocks')}
																value={colorSticky ? colorSticky : ''}
																default={''}
																onChange={(value) =>
																	setAttributes({ colorSticky: value })
																}
															/>
															<BackgroundTypeControl
																label={__('Type', 'kadence-blocks')}
																type={
																	backgroundStickyType
																		? backgroundStickyType
																		: 'normal'
																}
																onChange={(value) =>
																	setAttributes({ backgroundStickyType: value })
																}
																allowedTypes={['normal', 'gradient']}
															/>
															{'gradient' === backgroundStickyType && (
																<GradientControl
																	value={gradientSticky}
																	onChange={(value) =>
																		setAttributes({ gradientSticky: value })
																	}
																	gradients={[]}
																/>
															)}
															{'normal' === backgroundStickyType && (
																<PopColorControl
																	label={__('Background Color', 'kadence-blocks')}
																	value={backgroundSticky ? backgroundSticky : ''}
																	default={''}
																	onChange={(value) =>
																		setAttributes({ backgroundSticky: value })
																	}
																/>
															)}
															<ResponsiveBorderControl
																label={__('Border', 'kadence-blocks')}
																value={borderStickyStyle}
																tabletValue={tabletBorderStickyStyle}
																mobileValue={mobileBorderStickyStyle}
																onChange={(value) =>
																	setAttributes({ borderStickyStyle: value })
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderStickyStyle: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderStickyStyle: value,
																	})
																}
															/>
															<ResponsiveMeasurementControls
																label={__('Border Radius', 'kadence-blocks')}
																value={borderStickyRadius}
																tabletValue={tabletBorderStickyRadius}
																mobileValue={mobileBorderStickyRadius}
																onChange={(value) =>
																	setAttributes({ borderStickyRadius: value })
																}
																onChangeTablet={(value) =>
																	setAttributes({
																		tabletBorderStickyRadius: value,
																	})
																}
																onChangeMobile={(value) =>
																	setAttributes({
																		mobileBorderStickyRadius: value,
																	})
																}
																unit={borderStickyRadiusUnit}
																units={['px', 'em', 'rem', '%']}
																onUnit={(value) =>
																	setAttributes({
																		borderStickyRadiusUnit: value,
																	})
																}
																max={
																	borderStickyRadiusUnit === 'em' ||
																	borderStickyRadiusUnit === 'rem'
																		? 24
																		: 500
																}
																step={
																	borderStickyRadiusUnit === 'em' ||
																	borderStickyRadiusUnit === 'rem'
																		? 0.1
																		: 1
																}
																min={0}
																isBorderRadius={true}
																allowEmpty={true}
															/>
															<BoxShadowControl
																label={__('Box Shadow', 'kadence-blocks')}
																enable={
																	undefined !== displayShadowSticky
																		? displayShadowSticky
																		: false
																}
																color={
																	undefined !== shadowSticky &&
																	undefined !== shadowSticky[0] &&
																	undefined !== shadowSticky[0].color
																		? shadowSticky[0].color
																		: '#000000'
																}
																colorDefault={'#000000'}
																onArrayChange={(color, opacity) => {
																	saveShadowSticky({ color, opacity });
																}}
																opacity={
																	undefined !== shadowSticky &&
																	undefined !== shadowSticky[0] &&
																	undefined !== shadowSticky[0].opacity
																		? shadowSticky[0].opacity
																		: 0.2
																}
																hOffset={
																	undefined !== shadowSticky &&
																	undefined !== shadowSticky[0] &&
																	undefined !== shadowSticky[0].hOffset
																		? shadowSticky[0].hOffset
																		: 0
																}
																vOffset={
																	undefined !== shadowSticky &&
																	undefined !== shadowSticky[0] &&
																	undefined !== shadowSticky[0].vOffset
																		? shadow[0].vOffset
																		: 0
																}
																blur={
																	undefined !== shadowSticky &&
																	undefined !== shadowSticky[0] &&
																	undefined !== shadowSticky[0].blur
																		? shadowSticky[0].blur
																		: 14
																}
																spread={
																	undefined !== shadowSticky &&
																	undefined !== shadowSticky[0] &&
																	undefined !== shadowSticky[0].spread
																		? shadowSticky[0].spread
																		: 0
																}
																inset={
																	undefined !== shadowSticky &&
																	undefined !== shadowSticky[0] &&
																	undefined !== shadowSticky[0].inset
																		? shadowSticky[0].inset
																		: false
																}
																onEnableChange={(value) => {
																	setAttributes({
																		displayShadowSticky: value,
																	});
																}}
																onColorChange={(value) => {
																	saveShadowSticky({ color: value });
																}}
																onOpacityChange={(value) => {
																	saveShadowSticky({ opacity: value });
																}}
																onHOffsetChange={(value) => {
																	saveShadowSticky({ hOffset: value });
																}}
																onVOffsetChange={(value) => {
																	saveShadowSticky({ vOffset: value });
																}}
																onBlurChange={(value) => {
																	saveShadowSticky({ blur: value });
																}}
																onSpreadChange={(value) => {
																	saveShadowSticky({ spread: value });
																}}
																onInsetChange={(value) => {
																	saveShadowSticky({ inset: value });
																}}
															/>
														</>
													}
												/>
											</KadencePanelBody>
										)}
									</>
								)}
								{showSettings('iconSettings', 'kadence/advancedbtn') && (
									<KadencePanelBody
										title={__('Icon Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-adv-single-btn-icons'}
									>
										<div className="kt-select-icon-container">
											<KadenceIconPicker
												value={icon}
												onChange={(value) => {
													setAttributes({ icon: value });
												}}
												allowClear={true}
											/>
										</div>
										<SmallResponsiveControl
											label={__('Icon and Text Display', 'kadence-blocks')}
											desktopChildren={
												<SelectControl
													value={
														undefined !== onlyIcon?.[0] && onlyIcon[0] ? 'true' : 'false'
													}
													options={[
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														setAttributes({
															onlyIcon: [
																value === 'true' ? true : false,
																undefined !== onlyIcon?.[1] ? onlyIcon[1] : '',
																undefined !== onlyIcon?.[2] ? onlyIcon[2] : '',
															],
														});
													}}
												/>
											}
											tabletChildren={
												<SelectControl
													value={
														undefined !== onlyText?.[0] && onlyText[0]
															? 'text'
															: undefined !== onlyIcon?.[1] && onlyIcon[1]
															? 'true'
															: undefined !== onlyIcon?.[1] && false === onlyIcon[1]
															? 'false'
															: ''
													}
													options={[
														{ value: '', label: __('Inherit', 'kadence-blocks') },
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
														{
															value: 'text',
															label: __('Show Only Text', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														if ('text' !== value) {
															let newValue = value;
															if (value === 'true') {
																newValue = true;
															} else if (value === 'false') {
																newValue = false;
															}
															setAttributes({
																onlyIcon: [
																	undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																	newValue,
																	undefined !== onlyIcon?.[2] ? onlyIcon[2] : '',
																],
																onlyText: [
																	undefined !== onlyText?.[0] ? false : '',
																	undefined !== onlyText?.[1] ? onlyText[1] : '',
																],
															});
														} else {
															setAttributes({
																onlyText: [
																	undefined !== onlyText?.[0] ? true : '',
																	undefined !== onlyText?.[1] ? onlyText[1] : '',
																],
																onlyIcon: [
																	undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																	false,
																	undefined !== onlyIcon?.[2] ? onlyIcon[2] : '',
																],
															});
														}
													}}
												/>
											}
											mobileChildren={
												<SelectControl
													value={
														undefined !== onlyText?.[1] && onlyText[1]
															? 'text'
															: undefined !== onlyIcon?.[2] && onlyIcon[2]
															? 'true'
															: undefined !== onlyIcon?.[2] && false === onlyIcon[2]
															? 'false'
															: ''
													}
													options={[
														{ value: '', label: __('Inherit', 'kadence-blocks') },
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
														{
															value: 'text',
															label: __('Show Only Text', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														if ('text' !== value) {
															let newValue = value;
															if (value === 'true') {
																newValue = true;
															} else if (value === 'false') {
																newValue = false;
															}
															setAttributes({
																onlyIcon: [
																	undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																	undefined !== onlyIcon?.[1] ? onlyIcon[1] : '',
																	newValue,
																],
																onlyText: [
																	undefined !== onlyText?.[0] ? onlyText?.[0] : '',
																	undefined !== onlyText?.[1] ? false : '',
																],
															});
														} else {
															setAttributes({
																onlyText: [
																	undefined !== onlyText?.[0] ? onlyText?.[0] : '',
																	undefined !== onlyText?.[1] ? true : '',
																],
																onlyIcon: [
																	undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																	undefined !== onlyIcon?.[1] ? onlyIcon[1] : '',
																	false,
																],
															});
														}
													}}
												/>
											}
										/>
										<SelectControl
											label={__('Icon Location', 'kadence-blocks')}
											value={iconSide}
											options={[
												{ value: 'right', label: __('Right', 'kadence-blocks') },
												{ value: 'left', label: __('Left', 'kadence-blocks') },
											]}
											onChange={(value) => {
												setAttributes({ iconSide: value });
											}}
										/>
										<ResponsiveRangeControls
											label={__('Icon Size', 'kadence-blocks')}
											value={undefined !== iconSize?.[0] ? iconSize[0] : ''}
											onChange={(value) => {
												setAttributes({
													iconSize: [
														value,
														undefined !== iconSize[1] ? iconSize[1] : '',
														undefined !== iconSize?.[2] && iconSize[2] ? iconSize[2] : '',
													],
												});
											}}
											tabletValue={undefined !== iconSize?.[1] ? iconSize[1] : ''}
											onChangeTablet={(value) => {
												setAttributes({
													iconSize: [
														undefined !== iconSize?.[0] ? iconSize[0] : '',
														value,
														undefined !== iconSize?.[2] ? iconSize[2] : '',
													],
												});
											}}
											mobileValue={undefined !== iconSize?.[2] ? iconSize[2] : ''}
											onChangeMobile={(value) => {
												setAttributes({
													iconSize: [
														undefined !== iconSize?.[0] ? iconSize[0] : '',
														undefined !== iconSize?.[1] ? iconSize[1] : '',
														value,
													],
												});
											}}
											min={0}
											max={(iconSizeUnit ? iconSizeUnit : 'px') !== 'px' ? 12 : 200}
											step={(iconSizeUnit ? iconSizeUnit : 'px') !== 'px' ? 0.1 : 1}
											unit={iconSizeUnit ? iconSizeUnit : 'px'}
											onUnit={(value) => {
												setAttributes({ iconSizeUnit: value });
											}}
											units={['px', 'em', 'rem']}
										/>
										<PopColorControl
											label={__('Icon Color', 'kadence-blocks')}
											value={iconColor ? iconColor : ''}
											default={''}
											onChange={(value) => {
												setAttributes({ iconColor: value });
											}}
											swatchLabel2={__('Hover Color', 'kadence-blocks')}
											value2={iconColorHover ? iconColorHover : ''}
											default2={''}
											onChange2={(value) => {
												setAttributes({ iconColorHover: value });
											}}
										/>
										<ResponsiveMeasureRangeControl
											label={__('Icon Padding', 'kadence-blocks')}
											value={undefined !== iconPadding ? iconPadding : ['', '', '', '']}
											tabletValue={
												undefined !== tabletIconPadding ? tabletIconPadding : ['', '', '', '']
											}
											mobileValue={
												undefined !== mobileIconPadding ? mobileIconPadding : ['', '', '', '']
											}
											onChange={(value) => setAttributes({ iconPadding: value })}
											onChangeTablet={(value) => setAttributes({ tabletIconPadding: value })}
											onChangeMobile={(value) => setAttributes({ mobileIconPadding: value })}
											min={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? -2 : -999}
											max={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 12 : 999}
											step={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 0.1 : 1}
											unit={iconPaddingUnit}
											units={['px', 'em', 'rem']}
											onUnit={(value) => setAttributes({ iconPaddingUnit: value })}
										/>
										<TextControl
											label={__('Title for screen readers', 'kadence-blocks')}
											help={__(
												'If no title added screen readers will ignore, good if the icon is purely decorative.',
												'kadence-blocks'
											)}
											value={iconTitle}
											onChange={(value) => {
												setAttributes({ iconTitle: value });
											}}
										/>
									</KadencePanelBody>
								)}
								{showSettings('fontSettings', 'kadence/advancedbtn') && (
									<KadencePanelBody
										title={__('Typography Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-adv-btn-font-family'}
									>
										<TypographyControls
											fontGroup={'button'}
											fontSize={typography[0].size}
											onFontSize={(value) => saveTypography({ size: value })}
											fontSizeType={typography[0].sizeType}
											onFontSizeType={(value) => saveTypography({ sizeType: value })}
											lineHeight={typography[0].lineHeight}
											onLineHeight={(value) => saveTypography({ lineHeight: value })}
											lineHeightType={typography[0].lineType}
											onLineHeightType={(value) => saveTypography({ lineType: value })}
											reLetterSpacing={typography[0].letterSpacing}
											onLetterSpacing={(value) => saveTypography({ letterSpacing: value })}
											letterSpacingType={typography[0].letterType}
											onLetterSpacingType={(value) => saveTypography({ letterType: value })}
											textTransform={typography[0].textTransform}
											onTextTransform={(value) => saveTypography({ textTransform: value })}
											fontFamily={typography[0].family}
											onFontFamily={(value) => saveTypography({ family: value })}
											onFontChange={(select) => {
												saveTypography({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => saveTypography(values)}
											googleFont={typography[0].google}
											onGoogleFont={(value) => saveTypography({ google: value })}
											loadGoogleFont={typography[0].loadGoogle}
											onLoadGoogleFont={(value) => saveTypography({ loadGoogle: value })}
											fontVariant={typography[0].variant}
											onFontVariant={(value) => saveTypography({ variant: value })}
											fontWeight={typography[0].weight}
											onFontWeight={(value) => saveTypography({ weight: value })}
											fontStyle={typography[0].style}
											onFontStyle={(value) => saveTypography({ style: value })}
											fontSubset={typography[0].subset}
											onFontSubset={(value) => saveTypography({ subset: value })}
										/>
										<SelectControl
											label={__('Text Underline', 'kadence-blocks')}
											value={textUnderline}
											options={[
												{ value: '', label: __('Unset', 'kadence-blocks') },
												{ value: 'none', label: __('None', 'kadence-blocks') },
												{ value: 'underline', label: __('Underline', 'kadence-blocks') },
											]}
											onChange={(value) => setAttributes({ textUnderline: value })}
										/>
									</KadencePanelBody>
								)}
							</>
						)}

						{activeTab === 'advanced' && (
							<>
								{showSettings('marginSettings', 'kadence/advancedbtn') && (
									<>
										<KadencePanelBody panelName={'kb-single-button-margin-settings'}>
											<ResponsiveMeasureRangeControl
												label={__('Padding', 'kadence-blocks')}
												value={padding}
												onChange={(value) => setAttributes({ padding: value })}
												tabletValue={tabletPadding}
												onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
												mobileValue={mobilePadding}
												onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
												min={paddingUnit === 'em' || paddingUnit === 'rem' ? -25 : -999}
												max={paddingUnit === 'em' || paddingUnit === 'rem' ? 25 : 999}
												step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
												unit={paddingUnit}
												units={['px', 'em', 'rem']}
												onUnit={(value) => setAttributes({ paddingUnit: value })}
												onMouseOver={paddingMouseOver.onMouseOver}
												onMouseOut={paddingMouseOver.onMouseOut}
											/>
											<ResponsiveMeasureRangeControl
												label={__('Margin', 'kadence-blocks')}
												value={margin}
												onChange={(value) => setAttributes({ margin: value })}
												tabletValue={tabletMargin}
												onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
												mobileValue={mobileMargin}
												onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
												min={marginUnit === 'em' || marginUnit === 'rem' ? -25 : -999}
												max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : 999}
												step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
												unit={marginUnit}
												units={['px', 'em', 'rem']}
												onUnit={(value) => setAttributes({ marginUnit: value })}
												onMouseOver={marginMouseOver.onMouseOver}
												onMouseOut={marginMouseOver.onMouseOut}
												allowAuto={true}
											/>
											<TextControl
												label={__('Add Aria Label', 'kadence-blocks')}
												value={label ? label : ''}
												onChange={(value) => setAttributes({ label: value })}
												className={'kb-textbox-style'}
											/>
											<ToggleControl
												label={__('Button Role', 'kadence-blocks')}
												help={__(
													'If the button is used to trigger something in javascript enable this to apply the button role.',
													'kadence-blocks'
												)}
												checked={buttonRole}
												onChange={(value) => setAttributes({ buttonRole: value })}
											/>
										</KadencePanelBody>

										<div className="kt-sidebar-settings-spacer"></div>
									</>
								)}

								<KadenceBlockDefaults
									attributes={attributes}
									defaultAttributes={metadata.attributes}
									blockSlug={metadata.name}
									excludedAttrs={nonTransAttrs}
								/>
							</>
						)}
					</InspectorControls>

					<DynamicInlineReplaceControl dynamicAttribute={'text'} {...props} />
				</>
			)}
			<div
				id={`animate-id${uniqueID}`}
				className={'btn-inner-wrap aos-animate kt-animation-wrap'}
				data-aos={kadenceAnimation ? kadenceAnimation : undefined}
				data-aos-duration={
					kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration
						? kadenceAOSOptions[0].duration
						: undefined
				}
				data-aos-easing={
					kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing
						? kadenceAOSOptions[0].easing
						: undefined
				}
			>
				<Tooltip text={tooltip} placement={tooltipPlacement || 'top'}>
					<span className={btnClassName}>
						{icon && 'left' === iconSide && (
							<IconRender
								className={`kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`}
								name={icon}
								size={'1em'}
								style={{
									fontSize: previewIconSize
										? getFontSizeOptionOutput(
												previewIconSize,
												undefined !== iconSizeUnit ? iconSizeUnit : 'px'
										  )
										: undefined,
								}}
							/>
						)}
						{!isDynamicReplaced && (
							<RichText
								tagName="div"
								placeholder={__('Button…', 'kadence-blocks')}
								value={text}
								onChange={(value) => setAttributes({ text: value })}
								allowedFormats={applyFilters(
									'kadence.whitelist_richtext_formats',
									richTextFormats,
									'kadence/advancedbtn'
								)}
								className={'kt-button-text'}
								keepPlaceholderOnFocus
							/>
						)}
						{isDynamicReplaced && (
							<>
								{applyFilters(
									'kadence.dynamicContent',
									<Spinner />,
									attributes,
									'text',
									setAttributes,
									context
								)}
							</>
						)}
						{icon && 'left' !== iconSide && (
							<IconRender
								className={`kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`}
								name={icon}
								size={'1em'}
								style={{
									fontSize: previewIconSize
										? getFontSizeOptionOutput(
												previewIconSize,
												undefined !== iconSizeUnit ? iconSizeUnit : 'px'
										  )
										: undefined,
								}}
							/>
						)}
						<SpacingVisualizer
							type="inside"
							forceShow={paddingMouseOver.isMouseOver}
							spacing={[
								getSpacingOptionOutput(previewPaddingTop, previewPaddingUnit),
								getSpacingOptionOutput(previewPaddingRight, previewPaddingUnit),
								getSpacingOptionOutput(previewPaddingBottom, previewPaddingUnit),
								getSpacingOptionOutput(previewPaddingLeft, previewPaddingUnit),
							]}
						/>
					</span>
				</Tooltip>
				<SpacingVisualizer
					type="inside"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewMarginTop, previewMarginUnit),
						getSpacingOptionOutput(previewMarginRight, previewMarginUnit),
						getSpacingOptionOutput(previewMarginBottom, previewMarginUnit),
						getSpacingOptionOutput(previewMarginLeft, previewMarginUnit),
					]}
				/>
				{typography?.[0]?.google && (
					<KadenceWebfontLoader typography={typography} clientId={clientId} id={'typography'} />
				)}
			</div>
		</div>
	);
}
