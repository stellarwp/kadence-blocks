/**
 * BLOCK: Kadence Progress Bar
 */

/**
 * Import Css
 */
import './editor.scss';

import {
	TypographyControls,
	PopColorControl,
	WebfontLoader,
	ResponsiveRangeControls,
	ResponsiveMeasureRangeControl,
	ResponsiveAlignControls,
	InspectorControlTabs,
	KadencePanelBody,
	KadenceRadioButtons,
	KadenceImageControl,
} from '@kadence/components';

import {
	KadenceColorOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	getFontSizeOptionOutput,
	setBlockDefaults,
	getUniqueId,
	getPostOrFseId,
} from '@kadence/helpers';

import { lineBar, circleBar, semiCircleBar, lineMask } from '@kadence/icons';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { map, range } from 'lodash';
import {
	RichText,
	InspectorControls,
	BlockControls,
	useBlockProps,
	BlockAlignmentControl,
} from '@wordpress/block-editor';

import {
	PanelBody,
	SelectControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
	TextControl,
} from '@wordpress/components';
import { Circle, SemiCircle, Line } from 'progressbar.js';
/**
 * Internal dependencies
 */
import classnames from 'classnames';

export function Edit(props) {
	const { attributes, setAttributes, isSelected, clientId } = props;

	const {
		uniqueID,
		align,
		labelPadding,
		tabletLabelPadding,
		mobileLabelPadding,
		labelPaddingType,
		margin,
		tabletMargin,
		mobileMargin,
		marginType,
		barBackground,
		barBackgroundOpacity,
		progressColor,
		progressOpacity,
		barType,
		containerMaxWidth,
		tabletContainerMaxWidth,
		mobileContainerMaxWidth,
		containerMaxWidthUnits,
		displayLabel,
		labelFont,
		label,
		labelPosition,
		numberFont,
		progressAmount,
		progressMax,
		displayPercent,
		numberSuffix,
		numberPrefix,
		numberIsRelative,
		duration,
		progressWidth,
		progressWidthTablet,
		progressWidthMobile,
		progressBorderRadius,
		easing,
		labelLayout,
		hAlign,
		thAlign,
		mhAlign,
		delayUntilInView,
		decimal,
		maskIterations,
		maskSvg,
		maskUrl,
		ariaLabel,
	} = attributes;

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

	useEffect(() => {
		setBlockDefaults('kadence/progress-bar', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);

	const saveLabelFont = (value) => {
		setAttributes({
			labelFont: JSON.parse(JSON.stringify({ ...labelFont, ...value })),
		});
	};
	const saveNumberFont = (value) => {
		setAttributes({
			numberFont: JSON.parse(JSON.stringify({ ...numberFont, ...value })),
		});
	};

	const [activeTab, setActiveTab] = useState('general');
	const [rerender, setRerender] = useState(0);

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

	const previewLabelPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== labelPadding ? labelPadding[0] : '',
		undefined !== tabletLabelPadding ? tabletLabelPadding[0] : '',
		undefined !== mobileLabelPadding ? mobileLabelPadding[0] : ''
	);
	const previewLabelPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== labelPadding ? labelPadding[1] : '',
		undefined !== tabletLabelPadding ? tabletLabelPadding[1] : '',
		undefined !== mobileLabelPadding ? mobileLabelPadding[1] : ''
	);
	const previewLabelPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== labelPadding ? labelPadding[2] : '',
		undefined !== tabletLabelPadding ? tabletLabelPadding[2] : '',
		undefined !== mobileLabelPadding ? mobileLabelPadding[2] : ''
	);
	const previewLabelPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== labelPadding ? labelPadding[3] : '',
		undefined !== tabletLabelPadding ? tabletLabelPadding[3] : '',
		undefined !== mobileLabelPadding ? mobileLabelPadding[3] : ''
	);

	const previewProgressWidth = getPreviewSize(
		previewDevice,
		undefined !== progressWidth ? progressWidth : '',
		undefined !== progressWidthTablet ? progressWidthTablet : '',
		undefined !== progressWidthMobile ? progressWidthMobile : ''
	);
	const previewProgressBorderRadius = getPreviewSize(
		previewDevice,
		undefined !== progressBorderRadius[0] ? progressBorderRadius[0] : '',
		undefined !== progressBorderRadius[1] ? progressBorderRadius[1] : '',
		undefined !== progressBorderRadius[2] ? progressBorderRadius[2] : ''
	);

	const previewContainerMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== containerMaxWidth ? containerMaxWidth : '',
		undefined !== tabletContainerMaxWidth ? tabletContainerMaxWidth : '',
		undefined !== mobileContainerMaxWidth ? mobileContainerMaxWidth : ''
	);
	const tempLabelFont = JSON.parse(JSON.stringify(labelFont));
	const tempNumberFont = JSON.parse(JSON.stringify(numberFont));
	const previewLabelFont = getPreviewSize(
		previewDevice,
		undefined !== tempLabelFont.size && undefined !== tempLabelFont.size[0] && '' !== tempLabelFont.size[0]
			? tempLabelFont.size[0]
			: '',
		undefined !== tempLabelFont.size && undefined !== tempLabelFont.size[1] && '' !== tempLabelFont.size[1]
			? tempLabelFont.size[1]
			: '',
		undefined !== tempLabelFont.size && undefined !== tempLabelFont.size[2] && '' !== tempLabelFont.size[2]
			? tempLabelFont.size[2]
			: ''
	);
	const previewLabelLineHeight = getPreviewSize(
		previewDevice,
		undefined !== tempLabelFont.lineHeight &&
			undefined !== tempLabelFont.lineHeight[0] &&
			'' !== tempLabelFont.lineHeight[0]
			? tempLabelFont.lineHeight[0]
			: '',
		undefined !== tempLabelFont.lineHeight &&
			undefined !== tempLabelFont.lineHeight[1] &&
			'' !== tempLabelFont.lineHeight[1]
			? tempLabelFont.lineHeight[1]
			: '',
		undefined !== tempLabelFont.lineHeight &&
			undefined !== tempLabelFont.lineHeight[2] &&
			'' !== tempLabelFont.lineHeight[2]
			? tempLabelFont.lineHeight[2]
			: ''
	);
	const previewLabelSpacing = getPreviewSize(
		previewDevice,
		undefined !== tempLabelFont?.letterSpacing?.[0] && '' !== tempLabelFont.letterSpacing[0]
			? tempLabelFont.letterSpacing[0]
			: '',
		undefined !== tempLabelFont?.letterSpacing?.[1] && '' !== tempLabelFont.letterSpacing[1]
			? tempLabelFont.letterSpacing[1]
			: '',
		undefined !== tempLabelFont?.letterSpacing?.[2] && '' !== tempLabelFont.letterSpacing[2]
			? tempLabelFont.letterSpacing[2]
			: ''
	);
	const previewNumberFont = getPreviewSize(
		previewDevice,
		undefined !== tempNumberFont.size && undefined !== tempNumberFont.size[0] && '' !== tempNumberFont.size[0]
			? tempNumberFont.size[0]
			: '',
		undefined !== tempNumberFont.size && undefined !== tempNumberFont.size[1] && '' !== tempNumberFont.size[1]
			? tempNumberFont.size[1]
			: '',
		undefined !== tempNumberFont.size && undefined !== tempNumberFont.size[2] && '' !== tempNumberFont.size[2]
			? tempNumberFont.size[2]
			: ''
	);
	const previewNumberLineHeight = getPreviewSize(
		previewDevice,
		undefined !== tempNumberFont?.lineHeight?.[0] && '' !== tempNumberFont.lineHeight[0]
			? tempNumberFont.lineHeight[0]
			: '',
		undefined !== tempNumberFont?.lineHeight?.[1] && '' !== tempNumberFont.lineHeight[1]
			? tempNumberFont.lineHeight[1]
			: '',
		undefined !== tempNumberFont?.lineHeight?.[2] && '' !== tempNumberFont.lineHeight[2]
			? tempNumberFont.lineHeight[2]
			: ''
	);
	const previewNumberSpacing = getPreviewSize(
		previewDevice,
		undefined !== tempNumberFont?.letterSpacing?.[0] && '' !== tempNumberFont.letterSpacing[0]
			? tempNumberFont.letterSpacing[0]
			: '',
		undefined !== tempNumberFont?.letterSpacing?.[1] && '' !== tempNumberFont.letterSpacing[1]
			? tempNumberFont.letterSpacing[1]
			: '',
		undefined !== tempNumberFont?.letterSpacing?.[2] && '' !== tempNumberFont.letterSpacing[2]
			? tempNumberFont.letterSpacing[2]
			: ''
	);
	const previewAlign = getPreviewSize(
		previewDevice,
		undefined !== hAlign ? hAlign : '',
		undefined !== thAlign ? thAlign : '',
		undefined !== mhAlign ? mhAlign : ''
	);
	const containerClasses = classnames({
		'kb-progress-bar-container': true,
		[`kb-progress-bar-container${uniqueID}`]: true,
		[`kb-progress-bar-type-${barType}`]: true,
		[`kb-progress-bar-align${undefined !== align ? align : ''}`]: true,
	});

	const blockProps = useBlockProps({
		className: containerClasses,
	});

	const layoutPresetOptions = [
		{ key: 'line', name: __('Line', 'kadence-blocks'), icon: lineBar },
		{ key: 'circle', name: __('Circle', 'kadence-blocks'), icon: circleBar },
		{ key: 'line-mask', name: __('Masked Line', 'kadence-blocks'), icon: lineMask },
		{ key: 'semicircle', name: __('Semicircle', 'kadence-blocks'), icon: semiCircleBar },
	];
	const labelFontConfigObj = {
		google: {
			families: [labelFont.family + (labelFont.variant ? ':' + labelFont.variant : '')],
		},
	};
	const labelFontConfig = labelFont.google ? labelFontConfigObj : '';
	const numberFontConfigObj = {
		google: {
			families: [numberFont.family + (numberFont.variant ? ':' + numberFont.variant : '')],
		},
	};
	const numberFontConfig = numberFont.google ? numberFontConfigObj : '';

	const progressLabelStyles = {
		fontWeight: labelFont?.weight ? labelFont.weight : undefined,
		fontStyle: labelFont?.style ? labelFont.style : undefined,
		color: labelFont?.color ? KadenceColorOutput(labelFont.color) : undefined,
		fontSize: previewLabelFont ? getFontSizeOptionOutput(previewLabelFont, labelFont.sizeType) : undefined,
		lineHeight: previewLabelLineHeight ? previewLabelLineHeight + labelFont.lineType : undefined,
		letterSpacing: previewLabelSpacing
			? previewLabelSpacing + (labelFont.spacingType ? labelFont.spacingType : 'px')
			: undefined,
		textTransform: labelFont.textTransform ? labelFont.textTransform : undefined,
		fontFamily: labelFont.family ? labelFont.family : undefined,
	};
	const progressPercentStyles = {
		fontWeight: tempNumberFont?.weight ? tempNumberFont.weight : progressLabelStyles.fontWeight,
		fontStyle: tempNumberFont?.style ? tempNumberFont.style : progressLabelStyles.fontStyle,
		color: tempNumberFont?.color ? KadenceColorOutput(tempNumberFont.color) : progressLabelStyles.color,
		fontSize: previewNumberFont
			? getFontSizeOptionOutput(previewNumberFont, tempNumberFont.sizeType)
			: progressLabelStyles.fontSize,
		lineHeight: previewNumberLineHeight
			? previewNumberLineHeight + tempNumberFont.lineType
			: progressLabelStyles.lineHeight,
		letterSpacing: previewNumberSpacing
			? previewNumberSpacing + (tempNumberFont.spacingType ? tempNumberFont.spacingType : 'px')
			: progressLabelStyles.letterSpacing,
		textTransform: tempNumberFont?.textTransform ? tempNumberFont.textTransform : progressLabelStyles.textTransform,
		fontFamily: tempNumberFont?.family ? tempNumberFont.family : progressLabelStyles.fontFamily,
	};

	const progressAttributes = {
		color: progressColor ? KadenceColorOutput(progressColor, progressOpacity) : 'var(--global-palette1, #2B6CB0)',
		strokeWidth: previewProgressWidth,
		duration: duration === 0 ? 1 : duration * 1000,
		easing,
		trailWidth: previewProgressWidth,
		trailColor: barBackground
			? KadenceColorOutput(barBackground, barBackgroundOpacity)
			: 'var(--global-palette7, #EDF2F7)',
		svgStyle: {
			borderRadius: barType === 'line' ? previewProgressBorderRadius + 'px' : '',
		},
		step(state, bar) {
			const iFrameSelector = document.getElementsByName('editor-canvas');
			const selector =
				iFrameSelector.length > 0
					? document.getElementsByName('editor-canvas')[0].contentWindow.document
					: document;

			const elementAbove = selector.getElementById('current-progress-above' + uniqueID);
			const elementInside = selector.getElementById('current-progress-inside' + uniqueID);
			const elementBelow = selector.getElementById('current-progress-below' + uniqueID);
			let value;
			if (numberIsRelative) {
				value = bar.value() * 100;
			} else {
				value = bar.value() * progressMax;
			}
			if (decimal === 'one') {
				value = Math.round(value * 10) / 10;
				value = value.toFixed(1);
			} else if (decimal === 'two') {
				value = Math.round(value * 100) / 100;
				value = value.toFixed(2);
			} else {
				value = Math.round(value);
			}

			if (elementAbove && labelPosition === 'above' && displayPercent) {
				elementAbove.innerHTML = numberPrefix + value + numberSuffix;
			} else if (elementAbove) {
				elementAbove.innerHTML = '';
			}

			if (elementInside && labelPosition === 'inside' && displayPercent) {
				elementInside.innerHTML = numberPrefix + value + numberSuffix;
			} else if (elementInside) {
				elementInside.innerHTML = '';
			}

			if (elementBelow && labelPosition === 'below' && displayPercent) {
				elementBelow.innerHTML = numberPrefix + value + numberSuffix;
			} else if (elementBelow) {
				elementBelow.innerHTML = '';
			}
		},
	};

	const container = '#kb-progress-bar' + uniqueID;
	const iFrameSelector = document.getElementsByName('editor-canvas');
	const selector =
		iFrameSelector.length > 0 ? document.getElementsByName('editor-canvas')[0].contentWindow.document : document;
	let progressItem = null;

	useEffect(() => {
		const containerDiv = selector.querySelector(container);
		if (containerDiv === null) {
			return;
		}
		if (barType === 'line' || barType === 'line-mask') {
			progressItem = new Line(containerDiv, progressAttributes);
		} else if (barType === 'circle') {
			progressItem = new Circle(containerDiv, progressAttributes);
		} else if (barType === 'semicircle') {
			progressItem = new SemiCircle(containerDiv, progressAttributes);
		}

		if (progressItem) {
			const progressReal = progressAmount <= progressMax ? progressAmount : progressMax;
			progressItem.animate(progressReal / progressMax);
		}

		return function cleanup() {
			if (progressItem) {
				progressItem.destroy();
			}
		};
	}, [
		progressAmount,
		progressMax,
		progressColor,
		progressOpacity,
		progressBorderRadius,
		duration,
		easing,
		barBackground,
		barBackgroundOpacity,
		barType,
		progressWidth,
		progressWidthTablet,
		progressWidthMobile,
		labelPosition,
		numberIsRelative,
		rerender,
		labelLayout,
		decimal,
		uniqueID,
		selector,
		displayPercent,
		numberPrefix,
		numberSuffix,
	]);

	const RenderLabel = (currentPosition) => {
		const wrapperLayoutStyles = {
			paddingTop:
				'' !== previewLabelPaddingTop
					? getSpacingOptionOutput(previewLabelPaddingTop, labelPaddingType)
					: undefined,
			paddingRight:
				'' !== previewLabelPaddingRight
					? getSpacingOptionOutput(previewLabelPaddingRight, labelPaddingType)
					: undefined,
			paddingBottom:
				'' !== previewLabelPaddingBottom
					? getSpacingOptionOutput(previewLabelPaddingBottom, labelPaddingType)
					: undefined,
			paddingLeft:
				'' !== previewLabelPaddingLeft
					? getSpacingOptionOutput(previewLabelPaddingLeft, labelPaddingType)
					: undefined,
		};

		if (previewAlign === 'space-between') {
			wrapperLayoutStyles.justifyContent = 'space-between';
		} else if (previewAlign === 'center') {
			wrapperLayoutStyles.justifyContent = 'center';
			wrapperLayoutStyles.textAlign = 'center';
		} else if (previewAlign === 'left') {
			wrapperLayoutStyles.textAlign = 'left';
			wrapperLayoutStyles.justifyContent = 'flex-start';
		} else if (previewAlign === 'right') {
			wrapperLayoutStyles.textAlign = 'right';
			wrapperLayoutStyles.justifyContent = 'flex-end';
		}

		if (labelLayout === 'lt' || labelLayout === 'lb') {
			wrapperLayoutStyles.flexDirection = 'column';
		}

		if (labelPosition === 'inside' && previewAlign === 'center') {
			wrapperLayoutStyles.transform = 'translateX(-50%) translateY(-50%)';
			wrapperLayoutStyles.left = '50%';
		}

		if (
			(barType === 'line' || barType === 'line-mask') &&
			labelPosition === 'inside' &&
			previewAlign === 'space-between'
		) {
			wrapperLayoutStyles.width = '100%';
		}

		return (
			<div
				className={'kb-progress-label-wrap ' + (currentPosition === 'inside' ? 'kt-progress-label-inside' : '')}
				style={wrapperLayoutStyles}
			>
				{displayPercent && (labelLayout === 'lb' || labelLayout === 'pl') && (
					<span id={'current-progress-' + currentPosition + uniqueID} style={progressPercentStyles}></span>
				)}

				{displayLabel && (
					<RichText
						tagName={'span'}
						value={label}
						onChange={(value) => {
							setAttributes({ label: value });
						}}
						placeholder={__('Progress', 'kadence-blocks')}
						style={progressLabelStyles}
						className={'kt-progress-label'}
					/>
				)}
				{displayPercent && (labelLayout === 'lt' || labelLayout === 'lp') && (
					<span id={'current-progress-' + currentPosition + uniqueID} style={progressPercentStyles}></span>
				)}
			</div>
		);
	};

	let maskStyles = '';
	const iterations = maskIterations ?? 5;
	const mask = maskSvg ?? 'star';
	const maskBaseUrl = kadence_blocks_params.svgMaskPath;
	let maskUrlToUse = maskBaseUrl + mask + '.svg';

	if ('custom' === maskSvg) {
		if (maskUrl) {
			maskUrlToUse = maskUrl;
		} else {
			maskUrlToUse = maskBaseUrl + 'star.svg';
		}
	}

	const maskImageString = ('url(' + maskUrlToUse + '),').repeat(iterations).replace(/(^,)|(,$)/g, '');
	const maskRepeatString = 'no-repeat,'.repeat(iterations).replace(/(^,)|(,$)/g, '');
	const maskPositionArray = iterations > 1 ? range(0, 100.1, 100 / (iterations - 1)) : [0];
	const maskPositionString = (maskPositionArray.join('%,') + '%').replace(/(^,)|(,$)/g, '');
	const maskAspectRatioString = iterations + '/1';
	const maskHeightString = progressWidth ? progressWidth * 11.5 + 'px' : '80px';
	const maskHeightStringTablet = progressWidthTablet ? progressWidthTablet * 11.5 + 'px' : '';
	const maskHeightStringMobile = progressWidthMobile ? progressWidthMobile * 11.5 + 'px' : '';
	const previewMaskHeightString = getPreviewSize(
		previewDevice,
		maskHeightString,
		maskHeightStringTablet,
		maskHeightStringMobile
	);

	if ('line-mask' == barType) {
		maskStyles = `
				#kb-progress-bar${uniqueID} {
					-webkit-mask-image: ${maskImageString};
					mask-image: ${maskImageString};

					-webkit-mask-size: contain;
					mask-size: contain;

					-webkit-mask-repeat: ${maskRepeatString};
					mask-repeat: ${maskRepeatString};

					-webkit-mask-position: ${maskPositionString};
					mask-position: ${maskPositionString};

					aspect-ratio: ${maskAspectRatioString};

					height: ${previewMaskHeightString};
				}
				`;
	}

	return (
		<div {...blockProps}>
			<BlockControls group="block">
				<BlockAlignmentControl value={align} onChange={(value) => setAttributes({ align: value })} />
			</BlockControls>
			<InspectorControls>
				<InspectorControlTabs panelName={'progress-bar'} setActiveTab={setActiveTab} activeTab={activeTab} />

				{activeTab === 'general' && (
					<>
						<PanelBody>
							<ButtonGroup
								className="kt-style-btn-group"
								aria-label={__('Progress Bar Layout', 'kadence-blocks')}
							>
								{map(layoutPresetOptions, ({ name, key, icon }) => (
									<Button
										key={key}
										className="kt-style-btn"
										isSmall
										label={name}
										aria-pressed={false}
										onClick={() => {
											const attributeUpdates = { barType: key };
											// Update defaults if switching back from line mask
											if (barType === 'line-mask' && key !== 'line-mask') {
												if (5 === progressMax && 4 === progressAmount) {
													attributeUpdates.progressMax = 100;
													attributeUpdates.progressAmount = 90;
													if ('' === numberSuffix) {
														attributeUpdates.numberSuffix = '%';
													}
												}
												attributeUpdates.decimal = 'none';
												attributeUpdates.displayPercent = true;
											}
											if (key !== 'line' && labelPosition === 'inside') {
												attributeUpdates.hAlign = 'center';
												attributeUpdates.thAlign = '';
												attributeUpdates.mhAlign = '';
											}
											// Update from default if they choose the line mask option
											if (key === 'line-mask') {
												if (100 == progressMax && 90 == progressAmount) {
													attributeUpdates.progressMax = 5;
													attributeUpdates.progressAmount = 4;
													if ('' !== numberSuffix) {
														attributeUpdates.numberSuffix = '';
													}
												}
												if ('' == label) {
													attributeUpdates.displayLabel = false;
												}
												attributeUpdates.decimal = 'one';
												attributeUpdates.displayPercent = false;
											}
											setAttributes(attributeUpdates);
										}}
										style={{
											border: barType === key ? '2px solid #2B6CB0' : '0',
											//marginRight: '4px',
											//width      : '75px',
										}}
									>
										{icon}
									</Button>
								))}
							</ButtonGroup>
						</PanelBody>

						{/* These are the wordpress and Kadence components mostly that are imported at the top */}
						<KadencePanelBody>
							{barType == 'line-mask' && (
								<>
									<SelectControl
										label={__('Mask Shape', 'kadence-blocks')}
										options={[
											{
												label: __('Star', 'kadence-blocks'),
												value: 'star',
											},
											{
												label: __('Heart', 'kadence-blocks'),
												value: 'heart',
											},
											{
												label: __('Smile', 'kadence-blocks'),
												value: 'smile-beam',
											},
											{
												label: __('Thumbs Up', 'kadence-blocks'),
												value: 'thumbs-up',
											},
											{
												label: __('Thumbs Down', 'kadence-blocks'),
												value: 'thumbs-down',
											},
											{
												label: __('Mug', 'kadence-blocks'),
												value: 'mug-hot',
											},
											{
												label: __('Circle', 'kadence-blocks'),
												value: 'circle',
											},
											{
												label: __('Diamond', 'kadence-blocks'),
												value: 'diamond',
											},
											{
												label: __('Rounded', 'kadence-blocks'),
												value: 'rounded',
											},
											{
												label: __('Cat', 'kadence-blocks'),
												value: 'cat',
											},
											{
												label: __('Dog', 'kadence-blocks'),
												value: 'dog',
											},
											{
												label: __('Custom', 'kadence-blocks'),
												value: 'custom',
											},
										]}
										value={maskSvg}
										onChange={(value) => setAttributes({ maskSvg: value })}
									/>
									{maskSvg === 'custom' && (
										<div class="components-base-control">
											<KadenceImageControl
												label={__('Custom Mask Image', 'kadence-blocks')}
												hasImage={maskUrl ? true : false}
												imageURL={maskUrl ? maskUrl : ''}
												imageID={''}
												onRemoveImage={() => {
													setAttributes({
														maskUrl: undefined,
													});
												}}
												onSaveImage={(image) => {
													setAttributes({
														maskUrl: image.url,
													});
												}}
												disableMediaButtons={maskUrl ? true : false}
											/>
											Square images that are black on a transparent background work best for this
											mask.
										</div>
									)}
									<RangeControl
										label={__('Mask Iterations', 'kadence-blocks')}
										value={maskIterations}
										onChange={(value) => setAttributes({ maskIterations: value })}
										min={1}
										max={100}
									/>
								</>
							)}
							<ResponsiveRangeControls
								label={__('Progress Thickness', 'kadence-blocks')}
								value={progressWidth}
								tabletValue={progressWidthTablet}
								mobileValue={progressWidthMobile}
								onChange={(value) => {
									setAttributes({ progressWidth: value });
								}}
								onChangeTablet={(value) => {
									setAttributes({ progressWidthTablet: value });
								}}
								onChangeMobile={(value) => {
									setAttributes({ progressWidthMobile: value });
								}}
								allowEmpty={false}
								min={0.25}
								max={50}
								step={0.25}
							/>
							{'line' === barType && (
								<ResponsiveRangeControls
									label={__('Border Radius', 'kadence-blocks')}
									value={progressBorderRadius[0]}
									tabletValue={progressBorderRadius[1]}
									mobileValue={progressBorderRadius[2]}
									onChange={(value) =>
										setAttributes({
											progressBorderRadius: [
												value,
												progressBorderRadius && progressBorderRadius[1]
													? progressBorderRadius[1]
													: '',
												progressBorderRadius && progressBorderRadius[2]
													? progressBorderRadius[2]
													: '',
											],
										})
									}
									onChangeTablet={(value) =>
										setAttributes({
											progressBorderRadius: [
												progressBorderRadius && progressBorderRadius[0]
													? progressBorderRadius[0]
													: '',
												value,
												progressBorderRadius && progressBorderRadius[2]
													? progressBorderRadius[2]
													: '',
											],
										})
									}
									onChangeMobile={(value) =>
										setAttributes({
											progressBorderRadius: [
												progressBorderRadius && progressBorderRadius[0]
													? progressBorderRadius[0]
													: '',
												progressBorderRadius && progressBorderRadius[1]
													? progressBorderRadius[1]
													: '',
												value,
											],
										})
									}
									allowEmpty={true}
									min={0}
									max={50}
									step={1}
									unit={'px'}
								/>
							)}
							<KadenceRadioButtons
								label={__('Number Format', 'kadence-blocks')}
								value={decimal}
								className={'kb-letter-case'}
								options={[
									{
										value: 'none',
										label: __('1', 'kadence-blocks'),
										tooltip: __('Whole Number', 'kadence-blocks'),
									},
									{
										value: 'one',
										label: __('0.1', 'kadence-blocks'),
										tooltip: __('One Decimal Space', 'kadence-blocks'),
									},
									{
										value: 'two',
										label: __('0.01', 'kadence-blocks'),
										tooltip: __('Two Decimal Spaces', 'kadence-blocks'),
									},
								]}
								allowClear={false}
								onChange={(value) => setAttributes({ decimal: value })}
							/>
							<RangeControl
								label={__('Progress', 'kadence-blocks')}
								value={progressAmount}
								onChange={(value) => setAttributes({ progressAmount: value })}
								min={0}
								max={progressMax}
								step={decimal === 'two' ? 0.01 : decimal === 'one' ? 0.1 : 1}
							/>
							<RangeControl
								label={__('Max Progress', 'kadence-blocks')}
								value={progressMax}
								onChange={(value) => {
									setAttributes({ progressMax: value });
								}}
								min={1}
								max={1000}
								step={decimal === 'two' ? 0.01 : decimal === 'one' ? 0.1 : 1}
							/>
							<TextControl
								label={__('Aria Label', 'kadence-blocks')}
								value={ariaLabel}
								onChange={(value) => setAttributes({ ariaLabel: value })}
								help={__(
									'Describe the purpose of this progress bar for screen readers, leave blank if label describes and the bar is purely decorative.',
									'kadence-blocks'
								)}
								className={'kb-textbox-style'}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Number Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-progress-number-settings'}
						>
							<ToggleControl
								label={__('Show Number', 'kadence-blocks')}
								checked={displayPercent}
								onChange={(value) => setAttributes({ displayPercent: value })}
							/>

							{displayPercent && (
								<>
									<TextControl
										label={__('Number Prefix', 'kadence-blocks')}
										value={numberPrefix}
										onChange={(value) => setAttributes({ numberPrefix: value })}
										onBlur={() => {
											setRerender(Math.random());
										}}
									/>
									<TextControl
										label={__('Number Suffix', 'kadence-blocks')}
										value={numberSuffix}
										onChange={(value) => setAttributes({ numberSuffix: value })}
										onBlur={() => {
											setRerender(Math.random());
										}}
									/>
									{progressMax !== 100 && (
										<ToggleControl
											label={__('Percentage relative to 100%', 'kadence-blocks')}
											checked={numberIsRelative}
											onChange={(value) => setAttributes({ numberIsRelative: value })}
										/>
									)}
								</>
							)}
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Animation', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-progress-bar-timing'}
						>
							<RangeControl
								label={__('Duration', 'kadence-blocks')}
								value={duration}
								onChange={(value) => setAttributes({ duration: value })}
								min={0}
								max={25}
								step={0.1}
							/>

							<ToggleControl
								label={__('Wait until visible to animate', 'kadence-blocks')}
								help={__(
									'The animation wont start until the progress bar is visible in the viewport. This does not apply in the editor',
									'kadence-blocks'
								)}
								checked={delayUntilInView}
								onChange={(value) => setAttributes({ delayUntilInView: value })}
							/>

							<SelectControl
								label={__('Type', 'kadence-blocks')}
								options={[
									{ value: 'linear', label: __('Linear', 'kadence-blocks') },
									{ value: 'easeIn', label: __('Ease In', 'kadence-blocks') },
									{ value: 'easeOut', label: __('Ease Out', 'kadence-blocks') },
									{ value: 'easeInOut', label: __('Ease In Out', 'kadence-blocks') },
								]}
								value={easing}
								onChange={(value) => setAttributes({ easing: value })}
							/>
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<Fragment>
						<KadencePanelBody>
							<KadenceRadioButtons
								label={__('Text Position', 'kadence-blocks')}
								value={labelPosition}
								options={[
									{ value: 'above', label: __('Above', 'kadence-blocks') },
									{ value: 'inside', label: __('Inside', 'kadence-blocks') },
									{ value: 'below', label: __('Below', 'kadence-blocks') },
								]}
								className={'kb-letter-case'}
								allowClear={false}
								onChange={(value) => setAttributes({ labelPosition: value })}
							/>

							{/* {labelPosition !== 'inside' || barType === 'line' ? ( <ResponsiveAlignControls
								label={__( 'Text Alignment', 'kadence-blocks' )}
								value={( hAlign ? hAlign : '' )}
								mobileValue={( mhAlign ? mhAlign : '' )}
								tabletValue={( thAlign ? thAlign : '' )}
								onChange={( nextAlign ) => setAttributes( { hAlign: ( nextAlign ? nextAlign : 'space-between' ) } )}
								onChangeTablet={( nextAlign ) => setAttributes( { thAlign: ( nextAlign ? nextAlign : '' ) } )}
								onChangeMobile={( nextAlign ) => setAttributes( { mhAlign: ( nextAlign ? nextAlign : '' ) } )}
								type={'justify'}
							/> ) : null} */}
							<ResponsiveAlignControls
								label={__('Text Alignment', 'kadence-blocks')}
								value={hAlign ? hAlign : ''}
								mobileValue={mhAlign ? mhAlign : ''}
								tabletValue={thAlign ? thAlign : ''}
								onChange={(nextAlign) =>
									setAttributes({ hAlign: nextAlign ? nextAlign : 'space-between' })
								}
								onChangeTablet={(nextAlign) => setAttributes({ thAlign: nextAlign ? nextAlign : '' })}
								onChangeMobile={(nextAlign) => setAttributes({ mhAlign: nextAlign ? nextAlign : '' })}
								type={'justify'}
							/>

							{displayLabel && displayPercent ? (
								<SelectControl
									label={__('Text Layout', 'kadence-blocks')}
									options={[
										{ value: 'lp', label: __('Label then %', 'kadence-blocks') },
										{ value: 'pl', label: __('% then Label', 'kadence-blocks') },
										{ value: 'lt', label: __('Label above %', 'kadence-blocks') },
										{ value: 'lb', label: __('Label below %', 'kadence-blocks') },
									]}
									value={labelLayout}
									onChange={(value) => setAttributes({ labelLayout: value })}
								/>
							) : null}

							<ToggleControl
								label={__('Show Label', 'kadence-blocks')}
								checked={displayLabel}
								onChange={(value) => setAttributes({ displayLabel: value })}
							/>

							<ToggleControl
								label={__('Show Number', 'kadence-blocks')}
								checked={displayPercent}
								onChange={(value) => setAttributes({ displayPercent: value })}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Progress Color', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-progress-color'}
						>
							<PopColorControl
								label={__('Progress Background', 'kadence-blocks')}
								colorValue={barBackground}
								opacityValue={barBackgroundOpacity}
								onColorChange={(value) => setAttributes({ barBackground: value })}
								onOpacityChange={(value) => setAttributes({ barBackgroundOpacity: value })}
							/>
							<PopColorControl
								label={__('Progress Color', 'kadence-blocks')}
								colorValue={progressColor}
								opacityValue={progressOpacity}
								onColorChange={(value) => setAttributes({ progressColor: value })}
								onOpacityChange={(value) => setAttributes({ progressOpacity: value })}
							/>
						</KadencePanelBody>
						{displayPercent || displayLabel ? (
							<KadencePanelBody
								title={__('Text Styling', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-progress-text-styling'}
							>
								<PopColorControl
									label={__('Color Settings', 'kadence-blocks')}
									value={labelFont.color ? labelFont.color : ''}
									default={''}
									onChange={(value) => saveLabelFont({ color: value })}
								/>
								<TypographyControls
									fontGroup={'body'}
									fontSize={labelFont.size}
									onFontSize={(value) => saveLabelFont({ size: value })}
									fontSizeType={labelFont.sizeType}
									onFontSizeType={(value) => saveLabelFont({ sizeType: value })}
									lineHeight={labelFont.lineHeight}
									onLineHeight={(value) => saveLabelFont({ lineHeight: value })}
									lineHeightType={labelFont.lineType}
									onLineHeightType={(value) => saveLabelFont({ lineType: value })}
									reLetterSpacing={labelFont.letterSpacing}
									onLetterSpacing={(value) => saveLabelFont({ letterSpacing: value })}
									textTransform={labelFont.textTransform}
									onTextTransform={(value) => saveLabelFont({ textTransform: value })}
									fontFamily={labelFont.family}
									onFontFamily={(value) => saveLabelFont({ family: value })}
									onFontChange={(select) => {
										saveLabelFont({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveLabelFont(values)}
									googleFont={labelFont.google}
									onGoogleFont={(value) => saveLabelFont({ google: value })}
									loadGoogleFont={labelFont.loadGoogle}
									onLoadGoogleFont={(value) => saveLabelFont({ loadGoogle: value })}
									fontVariant={labelFont.variant}
									onFontVariant={(value) => saveLabelFont({ variant: value })}
									fontWeight={labelFont.weight}
									onFontWeight={(value) => saveLabelFont({ weight: value })}
									fontStyle={labelFont.style}
									onFontStyle={(value) => saveLabelFont({ style: value })}
									fontSubset={labelFont.subset}
									onFontSubset={(value) => saveLabelFont({ subset: value })}
									// padding={labelFont.padding}
									// onPadding={( value ) => saveLabelFont( { padding: value } )}
									// margin={labelFont.margin}
									// onMargin={( value ) => saveLabelFont( { margin: value } )}
								/>
							</KadencePanelBody>
						) : null}

						{displayPercent && (
							<KadencePanelBody
								title={__('Number Styling', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-progress-number-styling'}
							>
								<PopColorControl
									label={__('Color Settings', 'kadence-blocks')}
									value={numberFont.color ? numberFont.color : ''}
									default={''}
									onChange={(value) => saveNumberFont({ color: value })}
								/>
								<TypographyControls
									fontGroup={'body'}
									fontSize={numberFont.size}
									onFontSize={(value) => saveNumberFont({ size: value })}
									fontSizeType={numberFont.sizeType}
									onFontSizeType={(value) => saveNumberFont({ sizeType: value })}
									lineHeight={numberFont.lineHeight}
									onLineHeight={(value) => saveNumberFont({ lineHeight: value })}
									lineHeightType={numberFont.lineType}
									onLineHeightType={(value) => saveNumberFont({ lineType: value })}
									reLetterSpacing={numberFont.letterSpacing}
									onLetterSpacing={(value) => saveNumberFont({ letterSpacing: value })}
									textTransform={numberFont.textTransform}
									onTextTransform={(value) => saveNumberFont({ textTransform: value })}
									fontFamily={numberFont.family}
									onFontFamily={(value) => saveNumberFont({ family: value })}
									onFontChange={(select) => {
										saveNumberFont({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveNumberFont(values)}
									googleFont={numberFont.google}
									onGoogleFont={(value) => saveNumberFont({ google: value })}
									loadGoogleFont={numberFont.loadGoogle}
									onLoadGoogleFont={(value) => saveNumberFont({ loadGoogle: value })}
									fontVariant={numberFont.variant}
									onFontVariant={(value) => saveNumberFont({ variant: value })}
									fontWeight={numberFont.weight}
									onFontWeight={(value) => saveNumberFont({ weight: value })}
									fontStyle={numberFont.style}
									onFontStyle={(value) => saveNumberFont({ style: value })}
									fontSubset={numberFont.subset}
									onFontSubset={(value) => saveNumberFont({ subset: value })}
									// padding={numberFont.padding}
									// onPadding={( value ) => saveNumberFont( { padding: value } )}
									// margin={numberFont.margin}
									// onMargin={( value ) => saveNumberFont( { margin: value } )}
								/>
							</KadencePanelBody>
						)}
						{(displayPercent || displayLabel) && (
							<KadencePanelBody
								title={__('Text and Number Padding', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-progress-text-padding'}
							>
								<ResponsiveMeasureRangeControl
									label={__('Padding', 'kadence-blocks')}
									value={labelPadding}
									tabletValue={tabletLabelPadding}
									mobileValue={mobileLabelPadding}
									onChange={(value) => {
										setAttributes({ labelPadding: value });
									}}
									onChangeTablet={(value) => setAttributes({ tabletLabelPadding: value })}
									onChangeMobile={(value) => setAttributes({ mobileLabelPadding: value })}
									min={labelPaddingType === 'em' || labelPaddingType === 'rem' ? -12 : -999}
									max={labelPaddingType === 'em' || labelPaddingType === 'rem' ? 24 : 999}
									step={labelPaddingType === 'em' || labelPaddingType === 'rem' ? 0.1 : 1}
									unit={labelPaddingType}
									units={['px', 'em', 'rem', '%', 'vh']}
									onUnit={(value) => setAttributes({ labelPaddingType: value })}
									// onMouseOver={ labelPaddingMouseOver.onMouseOver }
									// onMouseOut={ labelPaddingMouseOver.onMouseOut }
								/>
							</KadencePanelBody>
						)}
					</Fragment>
				)}

				{activeTab === 'advanced' && (
					<KadencePanelBody>
						<ResponsiveMeasureRangeControl
							label={__('Margin', 'kadence-blocks')}
							value={margin}
							tabletValue={tabletMargin}
							mobileValue={mobileMargin}
							onChange={(value) => {
								setAttributes({ margin: value });
							}}
							onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
							onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
							min={marginType === 'em' || marginType === 'rem' ? -12 : -999}
							max={marginType === 'em' || marginType === 'rem' ? 24 : 999}
							step={marginType === 'em' || marginType === 'rem' ? 0.1 : 1}
							unit={marginType}
							units={['px', 'em', 'rem', '%', 'vh']}
							onUnit={(value) => setAttributes({ marginType: value })}
							// onMouseOver={ marginMouseOver.onMouseOver }
							// onMouseOut={ marginMouseOver.onMouseOut }
							allowAuto={true}
						/>
						<ResponsiveRangeControls
							label={__('Max Width', 'kadence-blocks')}
							value={containerMaxWidth}
							onChange={(value) => setAttributes({ containerMaxWidth: value })}
							tabletValue={tabletContainerMaxWidth ? tabletContainerMaxWidth : ''}
							onChangeTablet={(value) => setAttributes({ tabletContainerMaxWidth: value })}
							mobileValue={mobileContainerMaxWidth ? mobileContainerMaxWidth : ''}
							onChangeMobile={(value) => setAttributes({ mobileContainerMaxWidth: value })}
							min={0}
							max={containerMaxWidthUnits === 'px' ? 3000 : 100}
							step={1}
							unit={containerMaxWidthUnits}
							onUnit={(value) => setAttributes({ containerMaxWidthUnits: value })}
							reset={() =>
								setAttributes({
									containerMaxWidth: 0,
									tabletContainerMaxWidth: '',
									mobileContainerMaxWidth: '',
								})
							}
							units={['px', 'vh', '%']}
						/>
					</KadencePanelBody>
				)}
			</InspectorControls>
			<style>{maskStyles}</style>
			<div
				style={{
					position: 'relative',
					marginTop:
						'' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginType) : undefined,
					marginRight:
						'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginType) : undefined,
					marginBottom:
						'' !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, marginType)
							: undefined,
					marginLeft:
						'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginType) : undefined,
					width: previewContainerMaxWidth ? previewContainerMaxWidth + containerMaxWidthUnits : 'none',
				}}
			>
				{'above' === labelPosition && (displayLabel || displayPercent) && RenderLabel('above')}

				<div id={'kb-progress-bar' + uniqueID} class="kb-progress-bar"></div>
				{'inside' === labelPosition && (displayLabel || displayPercent) && RenderLabel('inside')}
				{'below' === labelPosition && (displayLabel || displayPercent) && RenderLabel('below')}
			</div>

			{labelFont.google && <WebfontLoader config={labelFontConfig}></WebfontLoader>}

			{displayPercent && numberFont.google && <WebfontLoader config={numberFontConfig}></WebfontLoader>}
		</div>
	);
}

export default Edit;
