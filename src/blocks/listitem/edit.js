/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Kadence Components
 */
import {
	KadenceColorOutput,
	setBlockDefaults,
	uniqueIdHelper,
	showSettings,
	getFontSizeOptionOutput,
	getSpacingOptionOutput,
	getPreviewSize,
	getBorderStyle,
} from '@kadence/helpers';

import {
	PopColorControl,
	KadenceIconPicker,
	IconRender,
	KadencePanelBody,
	URLInputControl,
	InspectorControlTabs,
	SelectParentBlock,
	Tooltip,
	ResponsiveBorderControl,
	ResponsiveMeasurementControls,
	TypographyControls,
	ResponsiveMeasureRangeControl,
	GradientControl,
	KadenceWebfontLoader,
} from '@kadence/components';

import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

import { InspectorControls, RichText, BlockControls, useBlockProps } from '@wordpress/block-editor';

import { useEffect, useState, useRef } from '@wordpress/element';

import {
	RangeControl,
	ToggleControl,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
	TextControl,
	Dropdown,
	Button,
	TextareaControl,
} from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';
import { formatIndent, formatOutdent } from '@wordpress/icons';
import { tooltip as tooltipIcon } from '@kadence/icons';

function KadenceListItem(props) {
	const {
		attributes,
		className,
		setAttributes,
		clientId,
		isSelected,
		name,
		onReplace,
		onRemove,
		mergeBlocks,
		context,
	} = props;
	const {
		uniqueID,
		icon,
		link,
		linkNoFollow,
		linkSponsored,
		target,
		size,
		width,
		text,
		color,
		iconTitle,
		background,
		border,
		borderRadius,
		padding,
		borderWidth,
		style,
		level,
		showIcon,
		tooltipSelection,
		tooltip,
		tooltipPlacement,
		tooltipDash,
		markSize,
		markSizeType,
		markLineHeight,
		markLineType,
		markLetterSpacing,
		markTypography,
		markGoogleFont,
		markLoadGoogleFont,
		markFontSubset,
		markFontVariant,
		markFontWeight,
		markFontStyle,
		markPadding,
		markColor,
		markBG,
		markBGOpacity,
		markBorder,
		markBorderWidth,
		markBorderOpacity,
		markBorderStyle,
		markTextTransform,
		markMobilePadding,
		markTabPadding,
		markLetterSpacingType,
		markPaddingType,
		tabletMarkLetterSpacing,
		mobileMarkLetterSpacing,
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles,
		markBorderRadius,
		tabletMarkBorderRadius,
		mobileMarkBorderRadius,
		markBorderRadiusUnit,
		enableMarkGradient,
		enableMarkBackgroundGradient,
		markGradient,
		markBackgroundGradient,
	} = attributes;
	const displayIcon = icon ? icon : context['kadence/listIcon'];
	const displayWidth = width ? width : context['kadence/listIconWidth'];
	const [activeTab, setActiveTab] = useState('general');
	let richTextFormats = applyFilters(
		'kadence.whitelist_richtext_formats',
		[
			'core/bold',
			'core/italic',
			'kadence/mark',
			'kadence/typed',
			'core/strikethrough',
			'core/superscript',
			'core/superscript',
			'toolset/inline-field',
		],
		'kadence/listitem'
	);

	richTextFormats = link ? richTextFormats : undefined;

	const textRef = useRef(clientId);
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	uniqueIdHelper(props);

	useEffect(() => {
		setBlockDefaults('kadence/listitem', attributes);
	}, []);

	const blockProps = useBlockProps({
		className,
	});

	const onMoveLeft = () => {
		const newLevel = level - 1;

		setAttributes({ level: Math.max(newLevel, 0) });
	};
	const onMoveRight = () => {
		setAttributes({ level: level + 1 });
	};
	const iconOnlyTooltip = 'icon' === tooltipSelection ? true : false;
	const textOnlyTooltip = 'text' === tooltipSelection ? true : false;
	const WrapTag = link ? 'a' : 'span';
	const markBGString = markBG ? KadenceColorOutput(markBG, markBGOpacity) : '';
	const previewMarkSize = getPreviewSize(
		previewDevice,
		undefined !== markSize ? markSize[0] : '',
		undefined !== markSize ? markSize[1] : '',
		undefined !== markSize ? markSize[2] : ''
	);
	const previewMarkLineHeight = getPreviewSize(
		previewDevice,
		undefined !== markLineHeight ? markLineHeight[0] : '',
		undefined !== markLineHeight ? markLineHeight[1] : '',
		undefined !== markLineHeight ? markLineHeight[2] : ''
	);
	const previewMarkLetterSpacing = getPreviewSize(
		previewDevice,
		undefined !== markLetterSpacing ? markLetterSpacing : '',
		undefined !== tabletMarkLetterSpacing ? tabletMarkLetterSpacing : '',
		undefined !== mobileMarkLetterSpacing ? mobileMarkLetterSpacing : ''
	);
	const previewMarkBorderTopStyle = getBorderStyle(
		previewDevice,
		'top',
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles
	);
	const previewMarkBorderRightStyle = getBorderStyle(
		previewDevice,
		'right',
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles
	);
	const previewMarkBorderBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles
	);
	const previewMarkBorderLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles
	);
	const previewMarkPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== markPadding ? markPadding[0] : 0,
		undefined !== markTabPadding ? markTabPadding[0] : '',
		undefined !== markMobilePadding ? markMobilePadding[0] : ''
	);
	const previewMarkPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== markPadding ? markPadding[1] : 0,
		undefined !== markTabPadding ? markTabPadding[1] : '',
		undefined !== markMobilePadding ? markMobilePadding[1] : ''
	);
	const previewMarkPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== markPadding ? markPadding[2] : 0,
		undefined !== markTabPadding ? markTabPadding[2] : '',
		undefined !== markMobilePadding ? markMobilePadding[2] : ''
	);
	const previewMarkPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== markPadding ? markPadding[3] : 0,
		undefined !== markTabPadding ? markTabPadding[3] : '',
		undefined !== markMobilePadding ? markMobilePadding[3] : ''
	);
	const previewMarkBorderRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== markBorderRadius ? markBorderRadius[0] : '',
		undefined !== tabletMarkBorderRadius ? tabletMarkBorderRadius[0] : '',
		undefined !== mobileMarkBorderRadius ? mobileMarkBorderRadius[0] : ''
	);
	const previewMarkBorderRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== markBorderRadius ? markBorderRadius[1] : '',
		undefined !== tabletMarkBorderRadius ? tabletMarkBorderRadius[1] : '',
		undefined !== mobileMarkBorderRadius ? mobileMarkBorderRadius[1] : ''
	);
	const previewMarkBorderRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== markBorderRadius ? markBorderRadius[2] : '',
		undefined !== tabletMarkBorderRadius ? tabletMarkBorderRadius[2] : '',
		undefined !== mobileMarkBorderRadius ? mobileMarkBorderRadius[2] : ''
	);
	const previewMarkBorderRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== markBorderRadius ? markBorderRadius[3] : '',
		undefined !== tabletMarkBorderRadius ? tabletMarkBorderRadius[3] : '',
		undefined !== mobileMarkBorderRadius ? mobileMarkBorderRadius[3] : ''
	);
	const markBorderRadiusUnitPreview = undefined !== markBorderRadiusUnit ? markBorderRadiusUnit : 'px';
	const listItemOutput = (
		<>
			{displayIcon && showIcon && (
				<Tooltip
					className="kb-icon-list-single-wrap"
					text={tooltip && iconOnlyTooltip ? tooltip : undefined}
					placement={tooltipPlacement || 'top'}
				>
					<IconRender
						className={`kt-svg-icon-list-single kt-svg-icon-list-single-${displayIcon}${
							iconOnlyTooltip && tooltip ? ' kb-icon-list-tooltip' : ''
						}${!tooltipDash && iconOnlyTooltip && tooltip ? ' kb-list-tooltip-no-border' : ''}`}
						name={displayIcon}
						size={size ? size : '1em'}
						strokeWidth={'fe' === displayIcon.substring(0, 2) ? displayWidth : undefined}
						style={{
							color: color ? KadenceColorOutput(color) : undefined,
							backgroundColor:
								background && style === 'stacked' ? KadenceColorOutput(background) : undefined,
							padding: padding && style === 'stacked' ? padding + 'px' : undefined,
							borderColor: border && style === 'stacked' ? KadenceColorOutput(border) : undefined,
							borderWidth: borderWidth && style === 'stacked' ? borderWidth + 'px' : undefined,
							borderRadius: borderRadius && style === 'stacked' ? borderRadius + '%' : undefined,
						}}
					/>
				</Tooltip>
			)}

			{!showIcon && size !== 0 && (
				<div
					style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
					className={'kt-svg-icon-list-single'}
				>
					<svg
						style={{ display: 'inline-block', verticalAlign: 'middle' }}
						viewBox={'0 0 24 24'}
						height={size ? size : '1em'}
						width={size ? size : '1em'}
						fill={'none'}
						stroke={displayWidth}
						preserveAspectRatio={true ? 'xMinYMin meet' : undefined}
						stroke-width={displayWidth}
					></svg>
				</div>
			)}
			<Tooltip
				className="kb-icon-list-text-wrap"
				text={tooltip && textOnlyTooltip ? tooltip : undefined}
				placement={tooltipPlacement || 'top'}
			>
				<RichText
					tagName="div"
					ref={textRef}
					allowedFormats={richTextFormats ? richTextFormats : undefined}
					identifier="text"
					value={text}
					onChange={(value) => {
						setAttributes({ text: value });
					}}
					onSplit={(value, isOriginal) => {
						const newAttributes = { ...attributes };
						newAttributes.text = value;
						if (!isOriginal) {
							newAttributes.uniqueID = '';
							newAttributes.link = '';
						}

						const block = createBlock('kadence/listitem', newAttributes);

						if (isOriginal) {
							block.clientId = clientId;
						}

						return block;
					}}
					onMerge={mergeBlocks}
					onRemove={onRemove}
					onReplace={onReplace}
					className={`kt-svg-icon-list-text${textOnlyTooltip && tooltip ? ' kb-icon-list-tooltip' : ''}${
						!tooltipDash && textOnlyTooltip && tooltip ? ' kb-list-tooltip-no-border' : ''
					}`}
					data-empty={!text}
				/>
			</Tooltip>
		</>
	);
	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarGroup group="add-indent">
					<ToolbarButton
						icon={formatOutdent}
						title={__('Outdent', 'kadence-blocks')}
						describedBy={__('Outdent list item', 'kadence-blocks')}
						disabled={level === 0}
						onClick={() => onMoveLeft()}
					/>
					<ToolbarButton
						icon={formatIndent}
						title={__('Indent', 'kadence-blocks')}
						describedBy={__('Indent list item', 'kadence-blocks')}
						isDisabled={level === 5}
						onClick={() => onMoveRight()}
					/>
				</ToolbarGroup>
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
									<SelectControl
										label={__('Only apply tooltip to:', 'kadence-blocks')}
										value={tooltipSelection || 'both'}
										options={[
											{ label: __('Text and Icon', 'kadence-blocks'), value: 'both' },
											{ label: __('Text Only', 'kadence-blocks'), value: 'text' },
											{ label: __('Icon Only', 'kadence-blocks'), value: 'icon' },
										]}
										onChange={(val) => {
											setAttributes({ tooltipSelection: val });
										}}
									/>
									{!link && (
										<ToggleControl
											label={__('Show indicator underline', 'kadence-blocks')}
											checked={tooltipDash}
											onChange={(value) => {
												setAttributes({ tooltipDash: value });
											}}
										/>
									)}
								</div>
							</>
						)}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<SelectParentBlock clientId={clientId} />
				<InspectorControlTabs
					panelName={'listitem'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>
				{activeTab === 'general' && (
					<KadencePanelBody initialOpen={true} panelName={'kb-icon-item-settings'}>
						<URLInputControl
							label={__('Link', 'kadence-blocks')}
							url={link}
							onChangeUrl={(value) => {
								setAttributes({ link: value });
							}}
							additionalControls={true}
							opensInNewTab={target && '_blank' == target ? true : false}
							onChangeTarget={(value) => {
								if (value) {
									setAttributes({ target: '_blank' });
								} else {
									setAttributes({ target: '_self' });
								}
							}}
							linkNoFollow={undefined !== linkNoFollow ? linkNoFollow : false}
							onChangeFollow={(value) => setAttributes({ linkNoFollow: value })}
							linkSponsored={undefined !== linkSponsored ? linkSponsored : false}
							onChangeSponsored={(value) => setAttributes({ linkSponsored: value })}
							dynamicAttribute={'link'}
							allowClear={true}
							isSelected={isSelected}
							attributes={attributes}
							setAttributes={setAttributes}
							name={name}
							clientId={clientId}
							context={context}
						/>

						<ToggleControl
							label={__('Hide icon', 'kadence-blocks')}
							checked={!showIcon}
							onChange={(value) => {
								setAttributes({ showIcon: !value });
							}}
						/>

						{showIcon && (
							<>
								<KadenceIconPicker
									value={icon}
									onChange={(value) => {
										setAttributes({ icon: value });
									}}
									allowClear={true}
									placeholder={__('Select Icon', 'kadence-blocks')}
								/>
								<TextControl
									label={__('Icon title for screen readers', 'kadence-blocks')}
									help={__(
										'If no title added screen readers will ignore, good if the icon is purely decorative.',
										'kadence-blocks'
									)}
									value={iconTitle}
									onChange={(value) => {
										setAttributes({ iconTitle: value });
									}}
								/>
							</>
						)}
					</KadencePanelBody>
				)}
				{activeTab === 'style' && (
					<>
						<KadencePanelBody initialOpen={true} panelName={'kb-icon-item'}>
							<RangeControl
								label={__('Icon Size', 'kadence-blocks')}
								value={size}
								onChange={(value) => {
									setAttributes({ size: value });
								}}
								min={0}
								max={250}
							/>
							{displayIcon && 'fe' === displayIcon.substring(0, 2) && (
								<RangeControl
									label={__('Line Width', 'kadence-blocks')}
									value={width}
									onChange={(value) => {
										setAttributes({ width: value });
									}}
									step={0.5}
									min={0.5}
									max={4}
								/>
							)}
							<PopColorControl
								label={__('Icon Color', 'kadence-blocks')}
								value={color ? color : ''}
								default={''}
								onChange={(value) => {
									setAttributes({ color: value });
								}}
							/>
							<SelectControl
								label={__('Icon Style', 'kadence-blocks')}
								value={style}
								options={[
									{ value: '', label: __('Inherit', 'kadence-blocks') },
									{ value: 'default', label: __('Default', 'kadence-blocks') },
									{ value: 'stacked', label: __('Stacked', 'kadence-blocks') },
								]}
								onChange={(value) => {
									setAttributes({ style: value });
								}}
							/>
							{style === 'stacked' && (
								<PopColorControl
									label={__('Icon Background', 'kadence-blocks')}
									value={background ? background : ''}
									default={''}
									onChange={(value) => {
										setAttributes({ background: value });
									}}
								/>
							)}
							{style === 'stacked' && (
								<PopColorControl
									label={__('Border Color', 'kadence-blocks')}
									value={border ? border : ''}
									default={''}
									onChange={(value) => {
										setAttributes({ border: value });
									}}
								/>
							)}
							{style === 'stacked' && (
								<RangeControl
									label={__('Border Size (px)', 'kadence-blocks')}
									value={borderWidth}
									onChange={(value) => {
										setAttributes({ borderWidth: value });
									}}
									min={0}
									max={20}
								/>
							)}
							{style === 'stacked' && (
								<RangeControl
									label={__('Border Radius (%)', 'kadence-blocks')}
									value={borderRadius}
									onChange={(value) => {
										setAttributes({ borderRadius: value });
									}}
									min={0}
									max={50}
								/>
							)}
							{style === 'stacked' && (
								<RangeControl
									label={__('Padding (px)', 'kadence-blocks')}
									value={padding}
									onChange={(value) => {
										setAttributes({ padding: value });
									}}
									min={0}
									max={180}
								/>
							)}
						</KadencePanelBody>

						{showSettings('highlightSettings', 'kadence/listitem') && (
							<KadencePanelBody
								title={__('Advanced Highlight Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-heading-highlight-settings'}
							>
								<>
									{!enableMarkGradient && (
										<PopColorControl
											label={__('Color', 'kadence-blocks')}
											value={markColor ? markColor : ''}
											default={''}
											onChange={(value) => setAttributes({ markColor: value })}
										/>
									)}
									{!enableMarkBackgroundGradient && (
										<ToggleControl
											style={{ marginTop: '10px' }}
											label={__('Enable Text Gradient', 'kadence-blocks')}
											help={__(
												'Enabling Text Gradient disables Background Color and Gradient.',
												'kadence-blocks'
											)}
											checked={enableMarkGradient}
											onChange={(value) => setAttributes({ enableMarkGradient: value })}
										/>
									)}

									{enableMarkGradient && (
										<GradientControl
											value={markGradient}
											onChange={(value) => setAttributes({ markGradient: value })}
											gradients={[]}
										/>
									)}

									{!enableMarkGradient && !enableMarkBackgroundGradient && (
										<PopColorControl
											label={__('Background', 'kadence-blocks')}
											value={markBG ? markBG : ''}
											default={''}
											onChange={(value) => setAttributes({ markBG: value })}
											opacityValue={markBGOpacity}
											onOpacityChange={(value) => setAttributes({ markBGOpacity: value })}
											onArrayChange={(color, opacity) =>
												setAttributes({ markBG: color, markBGOpacity: opacity })
											}
										/>
									)}
								</>
								{!enableMarkGradient && (
									<ToggleControl
										style={{ marginTop: '10px' }}
										label={__('Enable Background Gradient', 'kadence-blocks')}
										help={__(
											'Enabling Background Gradient disables Text Gradient.',
											'kadence-blocks'
										)}
										checked={enableMarkBackgroundGradient}
										onChange={(value) => setAttributes({ enableMarkBackgroundGradient: value })}
									/>
								)}
								{enableMarkBackgroundGradient && (
									<GradientControl
										value={markBackgroundGradient}
										onChange={(value) => setAttributes({ markBackgroundGradient: value })}
										gradients={[]}
									/>
								)}
								<ResponsiveBorderControl
									label={__('Border', 'kadence-blocks')}
									value={markBorderStyles}
									tabletValue={tabletMarkBorderStyles}
									mobileValue={mobileMarkBorderStyles}
									onChange={(value) => setAttributes({ markBorderStyles: value })}
									onChangeTablet={(value) => setAttributes({ tabletMarkBorderStyles: value })}
									onChangeMobile={(value) => setAttributes({ mobileMarkBorderStyles: value })}
								/>
								<ResponsiveMeasurementControls
									label={__('Border Radius', 'kadence-blocks')}
									value={markBorderRadius}
									tabletValue={tabletMarkBorderRadius}
									mobileValue={mobileMarkBorderRadius}
									onChange={(value) => setAttributes({ markBorderRadius: value })}
									onChangeTablet={(value) => setAttributes({ tabletMarkBorderRadius: value })}
									onChangeMobile={(value) => setAttributes({ mobileMarkBorderRadius: value })}
									unit={markBorderRadiusUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ markBorderRadiusUnit: value })}
									max={markBorderRadiusUnit === 'em' || markBorderRadiusUnit === 'rem' ? 24 : 500}
									step={markBorderRadiusUnit === 'em' || markBorderRadiusUnit === 'rem' ? 0.1 : 1}
									min={0}
									isBorderRadius={true}
									allowEmpty={true}
								/>
								<TypographyControls
									fontGroup={'heading'}
									fontSize={markSize}
									onFontSize={(value) => setAttributes({ markSize: value })}
									fontSizeType={markSizeType}
									onFontSizeType={(value) => setAttributes({ markSizeType: value })}
									lineHeight={markLineHeight}
									onLineHeight={(value) => setAttributes({ markLineHeight: value })}
									lineHeightType={markLineType}
									onLineHeightType={(value) => setAttributes({ markLineType: value })}
									reLetterSpacing={[
										markLetterSpacing,
										tabletMarkLetterSpacing,
										mobileMarkLetterSpacing,
									]}
									onLetterSpacing={(value) =>
										setAttributes({
											markLetterSpacing: value[0],
											tabletMarkLetterSpacing: value[1],
											mobileMarkLetterSpacing: value[2],
										})
									}
									letterSpacingType={markLetterSpacingType}
									onLetterSpacingType={(value) => setAttributes({ markLetterSpacingType: value })}
									fontFamily={markTypography}
									onFontFamily={(value) => setAttributes({ markTypography: value })}
									onFontChange={(select) => {
										setAttributes({
											markTypography: select.value,
											markGoogleFont: select.google,
										});
									}}
									googleFont={markGoogleFont}
									onGoogleFont={(value) => setAttributes({ markGoogleFont: value })}
									loadGoogleFont={markLoadGoogleFont}
									onLoadGoogleFont={(value) => setAttributes({ markLoadGoogleFont: value })}
									fontVariant={markFontVariant}
									onFontVariant={(value) => setAttributes({ markFontVariant: value })}
									fontWeight={markFontWeight}
									onFontWeight={(value) => setAttributes({ markFontWeight: value })}
									fontStyle={markFontStyle}
									onFontStyle={(value) => setAttributes({ markFontStyle: value })}
									fontSubset={markFontSubset}
									onFontSubset={(value) => setAttributes({ markFontSubset: value })}
									textTransform={markTextTransform}
									onTextTransform={(value) => setAttributes({ markTextTransform: value })}
								/>
								<ResponsiveMeasureRangeControl
									label={__('Padding', 'kadence-blocks')}
									value={markPadding}
									tabletValue={markTabPadding}
									mobileValue={markMobilePadding}
									onChange={(value) => setAttributes({ markPadding: value })}
									onChangeTablet={(value) => setAttributes({ markTabPadding: value })}
									onChangeMobile={(value) => setAttributes({ markMobilePadding: value })}
									min={0}
									max={markPaddingType === 'em' || markPaddingType === 'rem' ? 12 : 999}
									step={markPaddingType === 'em' || markPaddingType === 'rem' ? 0.1 : 1}
									unit={markPaddingType}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ markPaddingType: value })}
								/>
							</KadencePanelBody>
						)}
					</>
				)}
			</InspectorControls>

			{markGoogleFont && markTypography && (
				<KadenceWebfontLoader
					typography={[{ family: markTypography, variant: markFontVariant ? markFontVariant : '' }]}
					clientId={clientId}
					id={'advancedHeadingMark'}
				/>
			)}

			<div
				className={`kt-svg-icon-list-item-wrap kt-svg-icon-list-item-wrap-${uniqueID} kt-svg-icon-list-item-0 kt-svg-icon-list-level-${level}${
					style ? ' kt-svg-icon-list-style-' + style : ''
				}`}
			>
				<style>
					{`.kt-svg-icon-list-item-wrap-${uniqueID}.kt-svg-icon-list-item-0.kt-svg-icon-list-level-${level}${
						style ? '.kt-svg-icon-list-style-' + style : ''
					} mark.kt-highlight {
						color: ${!enableMarkGradient ? KadenceColorOutput(markColor) : 'transparent'};
						background: ${markBG && !enableMarkGradient ? markBGString : 'transparent'};
						background-image: ${enableMarkGradient ? markGradient : enableMarkBackgroundGradient ? markBackgroundGradient : 'none'};
						-webkit-background-clip: ${enableMarkGradient ? 'text' : undefined};
						background-clip: ${enableMarkGradient ? 'text' : undefined};
						-webkit-text-fill-color: ${enableMarkGradient ? 'transparent' : undefined};
						-webkit-box-decoration-break: clone;
						box-decoration-break: clone;
						font-weight: ${markFontWeight ? markFontWeight : 'inherit'};
						font-style: ${markFontStyle ? markFontStyle : 'inherit'};
						font-size: ${previewMarkSize ? getFontSizeOptionOutput(previewMarkSize, markSizeType) : 'inherit'};
						line-height: ${previewMarkLineHeight ? previewMarkLineHeight + markLineType : 'inherit'};
						letter-spacing: ${
							previewMarkLetterSpacing
								? previewMarkLetterSpacing + (markLetterSpacingType ? markLetterSpacingType : 'px')
								: 'inherit'
						};
						text-transform: ${markTextTransform ? markTextTransform : 'inherit'};
						font-family: ${markTypography ? markTypography : 'inherit'};
						border-top: ${previewMarkBorderTopStyle ? previewMarkBorderTopStyle : 'inherit'};
						border-right: ${previewMarkBorderRightStyle ? previewMarkBorderRightStyle : 'inherit'};
						border-bottom: ${previewMarkBorderBottomStyle ? previewMarkBorderBottomStyle : 'inherit'};
						border-left: ${previewMarkBorderLeftStyle ? previewMarkBorderLeftStyle : 'inherit'};
						padding-top: ${previewMarkPaddingTop ? getSpacingOptionOutput(previewMarkPaddingTop, markPaddingType) : '0'};
						padding-right: ${previewMarkPaddingRight ? getSpacingOptionOutput(previewMarkPaddingRight, markPaddingType) : '0'};
						padding-bottom: ${previewMarkPaddingBottom ? getSpacingOptionOutput(previewMarkPaddingBottom, markPaddingType) : '0'};
						padding-left: ${previewMarkPaddingLeft ? getSpacingOptionOutput(previewMarkPaddingLeft, markPaddingType) : '0'};
						${
							'' !== previewMarkBorderRadiusTop
								? 'border-top-left-radius:' +
									previewMarkBorderRadiusTop +
									markBorderRadiusUnitPreview +
									';'
								: ''
						}
						${
							'' !== previewMarkBorderRadiusRight
								? 'border-top-right-radius:' +
									previewMarkBorderRadiusRight +
									markBorderRadiusUnitPreview +
									';'
								: ''
						}
						${
							'' !== previewMarkBorderRadiusBottom
								? 'border-bottom-right-radius:' +
									previewMarkBorderRadiusBottom +
									markBorderRadiusUnitPreview +
									';'
								: ''
						}
						${
							'' !== previewMarkBorderRadiusLeft
								? 'border-bottom-left-radius:' +
									previewMarkBorderRadiusLeft +
									markBorderRadiusUnitPreview +
									';'
								: ''
						}
					}`}
				</style>
				<Tooltip
					TagName={WrapTag}
					className={`kb-icon-list-tooltip-wrap${
						!link && tooltip && !iconOnlyTooltip && !textOnlyTooltip ? ' kb-icon-list-tooltip' : ''
					}${
						!link && tooltip && !iconOnlyTooltip && !textOnlyTooltip && !tooltipDash
							? ' kb-list-tooltip-no-border'
							: ''
					}${link ? ' kt-svg-icon-link' : ''}`}
					text={tooltip && !iconOnlyTooltip && !textOnlyTooltip ? tooltip : undefined}
					placement={tooltipPlacement || 'top'}
				>
					{listItemOutput}
				</Tooltip>
			</div>
		</div>
	);
}

export default KadenceListItem;
