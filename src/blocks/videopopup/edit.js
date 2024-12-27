/**
 * BLOCK: Kadence Video Popup
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import External
 */
import { debounce, map } from 'lodash';
import metadata from './block.json';

/**
 * Import Icons
 */
import {
	radiusLinkedIcon,
	// radiusIndividualIcon,
	// topLeftIcon,
	// topRightIcon,
	// bottomRightIcon,
	// bottomLeftIcon,
} from '@kadence/icons';

import {
	InspectorControlTabs,
	MeasurementControls,
	KadencePanelBody,
	ImageSizeControl,
	BoxShadowControl,
	KadenceImageControl,
	PopColorControl,
	URLInputControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	ResponsiveRangeControls,
	ResponsiveBorderControl,
	ResponsiveMeasurementControls,
	KadenceIconPicker,
	GenIcon,
} from '@kadence/components';

import {
	getUniqueId,
	getInQueryBlock,
	setBlockDefaults,
	getPreviewSize,
	getBorderStyle,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	KadenceColorOutput,
	setDynamicState,
	getPostOrFseId,
} from '@kadence/helpers';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import { Fragment, useState, useEffect } from '@wordpress/element';

import { MediaUpload, InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';

import {
	Button,
	TextControl,
	Popover,
	TabPanel,
	ButtonGroup,
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

import { useDispatch, useSelect } from '@wordpress/data';
import { video, closeSmall, keyboardReturn } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

/**
 * Build the overlay edit
 */
function KadenceVideoPopup(props) {
	const { attributes, setAttributes, context, clientId, className, isSelected } = props;

	const {
		uniqueID,
		type,
		url,
		media,
		ratio,
		displayShadow,
		maxWidth,
		maxWidthUnit,
		borderWidth,
		borderColor,
		borderOpacity,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		playBtn,
		popup,
		background,
		backgroundOverlay,
		padding,
		paddingUnit,
		margin,
		marginUnit,
		shadow,
		shadowHover,
		autoPlay,
		ariaLabel,
		kadenceAnimation,
		kadenceAOSOptions,
		youtubeCookies,
		inQueryBlock,
		isVimeoPrivate,
	} = attributes;
	const [iconRadiusControl, setIconRadiusControl] = useState('linked');
	const [iconBorderControl, setIconBorderControl] = useState('linked');
	const [isURLInputVisible, setIsURLInputVisible] = useState(false);
	const [localSrc, setLocalSrc] = useState('');
	const [activeTab, setActiveTab] = useState('general');
	const [dynamicPosterImg, setDynamicPosterImg] = useState('');

	const debouncedSetDynamicState = debounce(setDynamicState, 200);

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

	const allIcons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };

	const getDynamic = () => {
		let contextPost = null;
		if (context && context.postId) {
			contextPost = context.postId;
		}
		if (
			attributes.kadenceDynamic &&
			attributes.kadenceDynamic['background:0:img'] &&
			attributes.kadenceDynamic['background:0:img'].enable
		) {
			applyFilters('kadence.dynamicBackground', '', attributes, 'background:0:img', setAttributes, context);
		}
	};
	const debouncedUpdateDynamic = debounce(getDynamic, 200);

	useEffect(() => {
		setBlockDefaults('kadence/videopopup', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}

		if (!inQueryBlock) {
			updatePopupDefaults();
		}

		debouncedUpdateDynamic();
	}, []);

	useEffect(() => {
		const isInQueryBlock = getInQueryBlock(context, inQueryBlock);

		if (isInQueryBlock !== inQueryBlock) {
			setAttributes({ inQueryBlock: isInQueryBlock });
		}
	}, [context]);

	//set the dynamic image state
	useEffect(() => {
		debouncedSetDynamicState(
			'kadence.dynamicBackground',
			'',
			attributes,
			'background:0:img',
			setAttributes,
			context,
			setDynamicPosterImg,
			background ? false : true
		);
	}, [background, context]);

	const marginMouseOver = mouseOverVisualizer();
	const paddingMouseOver = mouseOverVisualizer();

	const openURLInput = () => {
		setIsURLInputVisible(true);
	};

	const closeURLInput = () => {
		setIsURLInputVisible(false);
	};

	const theIcon = playBtn[0].icon ? playBtn[0].icon : 'fas_play';
	const containerClasses = className + ' kadence-video-popup' + uniqueID;
	const blockProps = useBlockProps({
		className: containerClasses,
	});
	const bgType = [
		{ key: 'solid', name: __('Solid', 'kadence-blocks') },
		{ key: 'gradient', name: __('Gradient', 'kadence-blocks') },
	];
	const gradTypes = [
		{ key: 'linear', name: __('Linear', 'kadence-blocks') },
		{ key: 'radial', name: __('Radial', 'kadence-blocks') },
	];
	const icoNames = [
		'fe_play',
		'fe_playCircle',
		'fe_video',
		'fe_youtube',
		'ic_play',
		'fas_play',
		'fas_play-circle',
		'fas_caret-square-right',
		'fas_caret-right',
		'fas_video',
		'fa_youtube',
		'fa_youtube-square',
		'fa_vimeo',
		'fa_vimeo-v',
	];
	const renderStyle = (
		<style>
			{`.kadence-video-popup${uniqueID} .kadence-video-intrinsic:hover .kadence-video-overlay {
					opacity: ${backgroundOverlay[0].opacityHover} !important;
				}
				.kadence-video-popup${uniqueID} .kadence-video-intrinsic:hover .kt-video-svg-icon {
					${
						playBtn[0].colorHover
							? 'color:' +
							  KadenceColorOutput(playBtn[0].colorHover, playBtn[0].opacityHover) +
							  '!important;'
							: ''
					}
					${
						playBtn[0].backgroundHover
							? 'background:' +
							  KadenceColorOutput(playBtn[0].backgroundHover, playBtn[0].backgroundOpacityHover) +
							  '!important;'
							: ''
					}
					${
						playBtn[0].borderHover
							? 'border-color:' +
							  KadenceColorOutput(playBtn[0].borderHover, playBtn[0].borderOpacityHover) +
							  '!important;'
							: ''
					}
				}`}
			{maxWidth
				? `.kadence-inner-column-direction-horizontal > #block-${clientId} { max-width: ${maxWidth}px !important; width:100%; }`
				: ''}
			{displayShadow
				? `.kadence-video-popup${uniqueID} .kadence-video-popup-wrap:hover { box-shadow: ${
						shadowHover[0].hOffset +
						'px ' +
						shadowHover[0].vOffset +
						'px ' +
						shadowHover[0].blur +
						'px ' +
						shadowHover[0].spread +
						'px ' +
						KadenceColorOutput(shadowHover[0].color, shadowHover[0].opacity)
				  } !important; }`
				: ''}
		</style>
	);

	const renderSVG = (svg) => <GenIcon name={svg} icon={allIcons[svg]} />;
	const onSelectMedia = (video) => {
		saveMedia({
			id: video.id,
			url: video.url,
			alt: video.alt,
			width: video.width,
			height: video.height,
			subtype: video.subtype,
		});
	};
	const onChangeLocalSrc = (event) => {
		setLocalSrc(event.target.value);
	};
	const onSubmitLocalSrc = (event) => {
		event.preventDefault();
		if (localSrc) {
			saveMedia({ url: localSrc });
			closeURLInput();
		}
	};
	const onSelectPoster = (img) => {
		saveBackground({
			img: img.url,
			imgAlt: img.alt,
			imgID: img.id,
			imgWidth: img.width,
			imageHeight: img.height,
		});
	};
	const clearPoster = () => {
		saveBackground({
			img: '',
			imgAlt: '',
			imgID: '',
			imgWidth: '',
			imageHeight: '',
		});
	};
	const changeImageSize = (img) => {
		saveBackground({
			img: img.value,
			imgWidth: img.width,
			imageHeight: img.height,
		});
	};
	const saveMedia = (value) => {
		const newUpdate = media.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			media: newUpdate,
		});
	};
	const clearMedia = () => {
		saveMedia({
			id: '',
			url: '',
			alt: '',
			width: '',
			height: '',
			subtype: '',
		});
		setLocalSrc('');
	};
	const saveMargin = (value) => {
		const newUpdate = margin.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			margin: newUpdate,
		});
	};
	const savePadding = (value) => {
		const newUpdate = padding.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			padding: newUpdate,
		});
	};
	const saveShadowHover = (value) => {
		const newUpdate = shadowHover.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadowHover: newUpdate,
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
	const savePlayBtn = (value) => {
		const newUpdate = playBtn.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			playBtn: newUpdate,
		});
	};
	const saveBackground = (value) => {
		const newUpdate = background.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			background: newUpdate,
		});
	};
	const saveBackgroundOverlay = (value) => {
		const newUpdate = backgroundOverlay.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			backgroundOverlay: newUpdate,
		});
	};
	const updatePopupDefaults = () => {
		if (
			popup &&
			'undefined' !== typeof popup[0] &&
			('undefined' == typeof popup[0].maxWidthTablet || 'undefined' == typeof popup[0].maxWidthMobile)
		) {
			const newUpdate = popup;
			newUpdate[0].maxWidthTablet = '';
			newUpdate[0].maxWidthMobile = '';

			setAttributes({
				popup: newUpdate,
			});
		}

		// Update from old border settings.
		const tempBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.borderStyle
					? attributes.borderStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
					  ]
			)
		);
		let updateBorderStyle = false;
		if ('undefined' !== typeof borderOpacity && 0.8 !== borderOpacity) {
			tempBorderStyle[0].top[0] = KadenceColorOutput(borderColor, borderOpacity);
			tempBorderStyle[0].right[0] = KadenceColorOutput(borderColor, borderOpacity);
			tempBorderStyle[0].bottom[0] = KadenceColorOutput(borderColor, borderOpacity);
			tempBorderStyle[0].left[0] = KadenceColorOutput(borderColor, borderOpacity);
			updateBorderStyle = true;
		} else if ('undefined' !== typeof borderColor && '#ffffff' !== borderColor) {
			tempBorderStyle[0].top[0] = borderColor;
			tempBorderStyle[0].right[0] = borderColor;
			tempBorderStyle[0].bottom[0] = borderColor;
			tempBorderStyle[0].left[0] = borderColor;
			updateBorderStyle = true;
		}
		if (2 !== borderWidth?.[0] || 2 !== borderWidth?.[1] || 2 !== borderWidth?.[2] || 2 !== borderWidth?.[3]) {
			tempBorderStyle[0].top[2] = borderWidth?.[0] || '';
			tempBorderStyle[0].right[2] = borderWidth?.[1] || '';
			tempBorderStyle[0].bottom[2] = borderWidth?.[2] || '';
			tempBorderStyle[0].left[2] = borderWidth?.[3] || '';
			updateBorderStyle = true;
		} else if (2 !== borderWidth) {
			tempBorderStyle[0].top[2] = borderWidth;
			tempBorderStyle[0].right[2] = borderWidth;
			tempBorderStyle[0].bottom[2] = borderWidth;
			tempBorderStyle[0].left[2] = borderWidth;
			updateBorderStyle = true;
		}
		//set new attribute and clear old attributes (reset to default)
		if (updateBorderStyle) {
			setAttributes({ borderStyle: tempBorderStyle });

			setAttributes({ borderColor: '#ffffff' });
			setAttributes({ borderOpacity: 0.8 });
			setAttributes({ borderWidth: [2, 2, 2, 2] });
		}
	};
	const savePopup = (value) => {
		let itemMap;
		if (undefined === popup) {
			itemMap = [
				{
					background: '#000000',
					backgroundOpacity: 0.8,
					closeColor: '#ffffff',
					maxWidth: 900,
					maxWidthTablet: '',
					maxWidthMobile: '',
					maxWidthUnit: 'px',
					animation: 'none',
				},
			];
		} else {
			itemMap = popup;
		}
		const newUpdate = itemMap.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			popup: newUpdate,
		});
	};

	const intrinsic = undefined !== ratio && 'custom' !== ratio ? ratio : undefined;
	const imageRatio =
		'custom' === ratio &&
		undefined !== background &&
		undefined !== background[0] &&
		undefined !== background[0].imgWidth &&
		undefined !== background[0].imageHeight
			? (background[0].imageHeight / background[0].imgWidth) * 100
			: intrinsic;
	const mwUnit = undefined !== maxWidthUnit ? maxWidthUnit : 'px';

	//margin
	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[0].desk[0] : '',
		undefined !== margin ? margin[0].tablet[0] : '',
		undefined !== margin ? margin[0].mobile[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[0].desk[1] : '',
		undefined !== margin ? margin[0].tablet[1] : '',
		undefined !== margin ? margin[0].mobile[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[0].desk[2] : '',
		undefined !== margin ? margin[0].tablet[2] : '',
		undefined !== margin ? margin[0].mobile[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[0].desk[3] : '',
		undefined !== margin ? margin[0].tablet[3] : '',
		undefined !== margin ? margin[0].mobile[3] : ''
	);

	//padding
	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0].desk[0] : '',
		undefined !== padding ? padding[0].tablet[0] : '',
		undefined !== padding ? padding[0].mobile[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0].desk[1] : '',
		undefined !== padding ? padding[0].tablet[1] : '',
		undefined !== padding ? padding[0].mobile[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0].desk[2] : '',
		undefined !== padding ? padding[0].tablet[2] : '',
		undefined !== padding ? padding[0].mobile[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0].desk[3] : '',
		undefined !== padding ? padding[0].tablet[3] : '',
		undefined !== padding ? padding[0].mobile[3] : ''
	);

	const previewMaxWidth =
		undefined !== popup && undefined !== popup[0] && popup[0].maxWidth ? popup[0].maxWidth : 900;
	const previewMaxWidthTablet =
		undefined !== popup && undefined !== popup[0] && popup[0].maxWidthTablet ? popup[0].maxWidthTablet : '';
	const previewMaxWidthMobile =
		undefined !== popup && undefined !== popup[0] && popup[0].maxWidthMobile ? popup[0].maxWidthMobile : '';
	const popupMaxWidthUnit =
		undefined !== popup && undefined !== popup[0] && popup[0].maxWidthUnit ? popup[0].maxWidthUnit : 'px';
	const widthMax = popupMaxWidthUnit === 'px' ? 2000 : 100;

	// Border.
	const previewBorderTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[0] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[0] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[0] : ''
	);
	const previewRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[1] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[1] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[1] : ''
	);
	const previewRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[2] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[2] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[2] : ''
	);
	const previewRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[3] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[3] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[3] : ''
	);

	const previewPosterImg = dynamicPosterImg && dynamicPosterImg[0].img ? dynamicPosterImg[0].img : background[0].img;

	const nonTransAttrs = ['background', 'type', 'media', 'url'];

	return (
		<div
			{...blockProps}
			style={{
				paddingTop:
					'' !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, paddingUnit) : undefined,
				paddingRight:
					'' !== previewPaddingRight ? getSpacingOptionOutput(previewPaddingRight, paddingUnit) : undefined,
				paddingBottom:
					'' !== previewPaddingBottom ? getSpacingOptionOutput(previewPaddingBottom, paddingUnit) : undefined,
				paddingLeft:
					'' !== previewPaddingLeft ? getSpacingOptionOutput(previewPaddingLeft, paddingUnit) : undefined,
				marginTop: '' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginUnit) : undefined,
				marginRight:
					'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginUnit) : undefined,
				marginBottom:
					'' !== previewMarginBottom ? getSpacingOptionOutput(previewMarginBottom, marginUnit) : undefined,
				marginLeft:
					'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginUnit) : undefined,
			}}
		>
			<BlockControls key="controls">
				{'local' === type && media && media[0] && media[0].id && (
					<ToolbarGroup group="video-control">
						<MediaUpload
							onSelect={onSelectMedia}
							type="video"
							allowedTypes={['video']}
							value={media[0].id}
							render={({ open }) => (
								<ToolbarButton
									className="components-toolbar__control"
									label={__('Edit Video', 'kadence-blocks')}
									icon={video}
									onClick={open}
								/>
							)}
						/>
					</ToolbarGroup>
				)}
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<InspectorControls>
				<InspectorControlTabs
					panelName={'videopopup'}
					initialOpen={'general'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>
				{activeTab === 'general' && (
					<>
						<KadencePanelBody>
							<SelectControl
								label={__('Video Type', 'kadence-blocks')}
								value={type}
								options={[
									{
										value: 'external',
										label: __('YouTube/Vimeo/VideoPress', 'kadence-blocks'),
									},
									{ value: 'local', label: __('Self Hosted', 'kadence-blocks') },
								]}
								onChange={(value) => setAttributes({ type: value, isVimeoPrivate: false })}
							/>
							{'local' !== type && (
								<Fragment>
									{/* <URLExtenalInputControl
										label={__('Video URL', 'kadence-blocks')}
										value={url}
										onChange={(value) => setAttributes({ url: value })}
										dynamicAttribute="url"
										allowClear={true}
										{...props}
									/> */}

									<URLInputControl
										label={__('Video URL', 'kadence-blocks')}
										url={url}
										onChangeUrl={(value) => setAttributes({ url: value })}
										dynamicAttribute={'url'}
										allowClear={true}
										isSelected={isSelected}
										attributes={attributes}
										setAttributes={setAttributes}
										name={'kadence/videopopup'}
										clientId={clientId}
										context={context}
									/>

									{url && url.includes('vimeo.com/') && (
										<ToggleControl
											label={__('Is Private or Password Protected', 'kadence-blocks')}
											checked={isVimeoPrivate}
											onChange={(value) => setAttributes({ isVimeoPrivate: value })}
										/>
									)}

									<ToggleControl
										label={__('Embed Youtube with no cookies', 'kadence-blocks')}
										checked={youtubeCookies}
										onChange={(value) => setAttributes({ youtubeCookies: value })}
									/>
								</Fragment>
							)}
							{'local' === type && (
								<Fragment>
									{'' === media[0].id && '' === media[0].url && (
										<div className="kb-vide-edit-settings-container">
											<MediaUpload
												onSelect={onSelectMedia}
												type="video"
												value={media[0].id}
												allowedTypes={['video']}
												render={({ open }) => (
													<Button
														className={
															'components-button components-icon-button kt-cta-upload-btn'
														}
														onClick={open}
														icon={video}
														isDefault={true}
													>
														{__('Select Video', 'kadence-blocks')}
													</Button>
												)}
											/>
											<div className="editor-media-placeholder__url-input-container block-editor-media-placeholder__url-input-container">
												<Button
													className="editor-media-placeholder__button block-editor-media-placeholder__button kt-cta-upload-btn"
													onClick={openURLInput}
													isDefault={true}
													isToggled={isURLInputVisible}
												>
													{__('Insert from URL', 'kadence-blocks')}
												</Button>
												{isURLInputVisible && (
													<Popover
														onClose={() => closeURLInput()}
														className="editor-url-popover block-editor-url-popover"
													>
														<div className="editor-url-popover__row block-editor-url-popover__row">
															<form
																className="editor-media-placeholder__url-input-form block-editor-media-placeholder__url-input-form"
																onSubmit={(value) => onSubmitLocalSrc(value)}
															>
																<input
																	className="editor-media-placeholder__url-input-field block-editor-media-placeholder__url-input-field"
																	type="url"
																	aria-label={__('URL', 'kadence-blocks')}
																	placeholder={__(
																		'Paste or type URL',
																		'kadence-blocks'
																	)}
																	onChange={(value) => onChangeLocalSrc(value)}
																	value={localSrc}
																/>
																<Button
																	className="editor-media-placeholder__url-input-submit-button block-editor-media-placeholder__url-input-submit-button"
																	icon={keyboardReturn}
																	label={__('Apply', 'kadence-blocks')}
																	type="submit"
																/>
															</form>
														</div>
													</Popover>
												)}
											</div>
										</div>
									)}
									{'' !== media[0].id && (
										<div className="kb-vide-edit-settings-container">
											<MediaUpload
												onSelect={onSelectMedia}
												type="video"
												value={media[0].id}
												allowedTypes={['video']}
												render={({ open }) => (
													<Button
														className={
															'components-button components-icon-button kt-cta-upload-btn'
														}
														icon={video}
														onClick={open}
													>
														{__('Edit Video', 'kadence-blocks')}
													</Button>
												)}
											/>
											<Button
												label={__('Clear', 'kadence-blocks')}
												className="kb-clear-video-btn"
												icon={closeSmall}
												onClick={clearMedia}
											/>
										</div>
									)}
									{'' === media[0].id && '' !== media[0].url && (
										<div className="editor-media-placeholder__url-input-container block-editor-media-placeholder__url-input-container kb-vide-edit-settings-container">
											<Button
												className="editor-media-placeholder__button block-editor-media-placeholder__button kt-cta-upload-btn"
												onClick={openURLInput}
												isToggled={isURLInputVisible}
												isDefault={true}
											>
												{__('Edit Video URL', 'kadence-blocks')}
											</Button>
											{isURLInputVisible && (
												<Popover
													onClose={() => closeURLInput()}
													className="editor-url-popover block-editor-url-popover"
												>
													<div className="editor-url-popover__row block-editor-url-popover__row">
														<form
															className="editor-media-placeholder__url-input-form block-editor-media-placeholder__url-input-form"
															onSubmit={(value) => onSubmitLocalSrc(value)}
														>
															<input
																className="editor-media-placeholder__url-input-field block-editor-media-placeholder__url-input-field"
																type="url"
																aria-label={__('URL', 'kadence-blocks')}
																placeholder={__('Paste or type URL', 'kadence-blocks')}
																onChange={(value) => onChangeLocalSrc(value)}
																value={'' === localSrc ? media[0].url : localSrc}
															/>
															<Button
																className="editor-media-placeholder__url-input-submit-button block-editor-media-placeholder__url-input-submit-button"
																icon={keyboardReturn}
																label={__('Apply', 'kadence-blocks')}
																type="submit"
															/>
														</form>
													</div>
												</Popover>
											)}
											<Button
												label={__('Clear', 'kadence-blocks')}
												className="kb-clear-video-btn"
												icon={closeSmall}
												onClick={clearMedia}
											/>
										</div>
									)}
								</Fragment>
							)}
							<ToggleControl
								label={__('Auto play video (if able)', 'kadence-blocks')}
								checked={autoPlay}
								onChange={(value) => setAttributes({ autoPlay: value })}
							/>
							<TextControl
								label={__('Aria Label', 'kadence-blocks')}
								value={ariaLabel || ''}
								onChange={(nextValue) => {
									setAttributes({
										ariaLabel: nextValue,
									});
								}}
							/>
							<h2>{__('Video Poster', 'kadence-blocks')}</h2>
							<KadenceImageControl
								label={__('Image', 'kadence-blocks')}
								hasImage={background[0].img ? true : false}
								imageURL={background[0].img ? background[0].img : ''}
								imageID={background[0].imgID}
								onRemoveImage={clearPoster}
								onSaveImage={onSelectPoster}
								disableMediaButtons={background[0].img ? true : false}
								dynamicAttribute="background:0:img"
								isSelected={isSelected}
								attributes={attributes}
								setAttributes={setAttributes}
								name={'kadence/videopopup'}
								clientId={clientId}
								context={context}
							/>
							{background[0].imgID && (
								<ImageSizeControl
									label={__('Poster Image File Size', 'kadence-blocks')}
									id={background[0].imgID}
									url={background[0].img}
									fullSelection={true}
									selectByValue={true}
									onChange={changeImageSize}
								/>
							)}
							<PopColorControl
								label={__('Poster Background', 'kadence-blocks')}
								colorValue={background[0].color ? background[0].color : ''}
								colorDefault={''}
								opacityValue={undefined !== background[0].colorOpacity ? background[0].colorOpacity : 1}
								onColorChange={(value) => saveBackground({ color: value })}
								onOpacityChange={(value) => saveBackground({ colorOpacity: value })}
							/>
							<SelectControl
								label={__('Poster Ratio', 'kadence-blocks')}
								value={undefined !== ratio ? ratio : '56.25'}
								options={[
									{ value: '100', label: __('Square 1:1', 'kadence-blocks') },
									{ value: '133.33', label: __('Portrait 3:4', 'kadence-blocks') },
									{ value: '200', label: __('Tall Portrait 1:2', 'kadence-blocks') },
									{ value: '75', label: __('Landscape 4:3', 'kadence-blocks') },
									{ value: '56.25', label: __('Wide Landscape 16:9', 'kadence-blocks') },
									{ value: '50', label: __('Wider Landscape 2:1', 'kadence-blocks') },
									{ value: 'custom', label: __('Inherit from Image', 'kadence-blocks') },
								]}
								onChange={(value) => setAttributes({ ratio: value })}
							/>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'style' && (
					<>
						<KadencePanelBody>
							<ResponsiveRangeControls
								label={__('Max Video Width', 'kadence-blocks')}
								value={previewMaxWidth}
								onChange={(value) => savePopup({ maxWidth: value })}
								tabletValue={previewMaxWidthTablet}
								onChangeTablet={(value) => savePopup({ maxWidthTablet: value })}
								mobileValue={previewMaxWidthMobile}
								onChangeMobile={(value) => savePopup({ maxWidthMobile: value })}
								min={0}
								max={widthMax}
								step={1}
								unit={popupMaxWidthUnit}
								onUnit={(value) => savePopup({ maxWidthUnit: value })}
								showUnit={true}
								units={['px', '%', 'vw']}
							/>
							<PopColorControl
								label={__('Popup Background Color', 'kadence-blocks')}
								colorValue={
									undefined !== popup && undefined !== popup[0] && popup[0].background
										? popup[0].background
										: '#000000'
								}
								colorDefault={'#000000'}
								opacityValue={
									undefined !== popup &&
									undefined !== popup[0] &&
									undefined !== popup[0].backgroundOpacity
										? popup[0].backgroundOpacity
										: 0.8
								}
								onColorChange={(value) => savePopup({ background: value })}
								onOpacityChange={(value) => savePopup({ backgroundOpacity: value })}
							/>
							<PopColorControl
								label={__('Popup Close Background Color', 'kadence-blocks')}
								colorValue={
									undefined !== popup && undefined !== popup[0] && popup[0].closeBackground
										? popup[0].closeBackground
										: '#ffffff'
								}
								colorDefault={'#ffffff'}
								onColorChange={(value) => savePopup({ closeBackground: value })}
							/>
							<PopColorControl
								label={__('Popup Close Color', 'kadence-blocks')}
								colorValue={
									undefined !== popup && undefined !== popup[0] && popup[0].closeColor
										? popup[0].closeColor
										: '#ffffff'
								}
								colorDefault={'#ffffff'}
								onColorChange={(value) => savePopup({ closeColor: value })}
							/>
							<SelectControl
								label={__('Pop Animation', 'kadence-blocks')}
								value={
									undefined !== popup && undefined !== popup[0] && popup[0].animation
										? popup[0].animation
										: 'none'
								}
								options={[
									{ value: 'none', label: __('None', 'kadence-blocks') },
									{ value: 'zoom', label: __('Zoom', 'kadence-blocks') },
									{ value: 'zoom-out', label: __('Zoom Out', 'kadence-blocks') },
									{ value: 'fade-right', label: __('Fade Right', 'kadence-blocks') },
									{ value: 'fade-left', label: __('Fade Left', 'kadence-blocks') },
									{ value: '3d-unfold', label: __('3d Unfold', 'kadence-blocks') },
								]}
								onChange={(value) => savePopup({ animation: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Play Icon', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-video-play-icon'}
						>
							<KadenceIconPicker
								icons={icoNames}
								value={playBtn[0].icon ? playBtn[0].icon : 'fas_play'}
								onChange={(value) => savePlayBtn({ icon: value })}
								showSearch={false}
								renderFunc={renderSVG}
							/>
							<SelectControl
								label={__('Icon Style', 'kadence-blocks')}
								value={playBtn[0].style}
								options={[
									{ value: 'default', label: __('Default') },
									{ value: 'stacked', label: __('Stacked') },
								]}
								onChange={(value) => {
									savePlayBtn({ style: value });
								}}
							/>
							<RangeControl
								label={__('Icon Size', 'kadence-blocks')}
								value={playBtn[0].size}
								onChange={(value) => savePlayBtn({ size: value })}
								min={5}
								max={250}
								allowReset={true}
							/>
							{playBtn[0].icon && 'fe' === playBtn[0].icon.substring(0, 2) && (
								<RangeControl
									label={__('Line Width', 'kadence-blocks')}
									value={playBtn[0].width}
									onChange={(value) => {
										savePlayBtn({ width: value });
									}}
									step={0.5}
									min={0.5}
									max={4}
								/>
							)}
							<TabPanel
								className="kt-inspect-tabs kt-hover-tabs"
								activeClass="active-tab"
								tabs={[
									{
										name: 'normal',
										title: __('Normal', 'kadence-blocks'),
										className: 'kt-normal-tab',
									},
									{
										name: 'hover',
										title: __('Hover', 'kadence-blocks'),
										className: 'kt-hover-tab',
									},
								]}
							>
								{(tab) => {
									let tabout;
									if (tab.name) {
										if ('hover' === tab.name) {
											tabout = (
												<Fragment>
													<PopColorControl
														label={__('Icon Hover Color', 'kadence-blocks')}
														colorValue={playBtn[0].colorHover ? playBtn[0].colorHover : ''}
														colorDefault={''}
														opacityValue={
															undefined !== playBtn[0].opacityHover
																? playBtn[0].opacityHover
																: 1
														}
														onColorChange={(value) => savePlayBtn({ colorHover: value })}
														onOpacityChange={(value) =>
															savePlayBtn({ opacityHover: value })
														}
													/>
													{playBtn[0].style !== 'default' && (
														<Fragment>
															<PopColorControl
																label={__('Icon Hover Background', 'kadence-blocks')}
																colorValue={
																	playBtn[0].backgroundHover
																		? playBtn[0].backgroundHover
																		: ''
																}
																colorDefault={''}
																opacityValue={
																	undefined !== playBtn[0].backgroundOpacityHover
																		? playBtn[0].backgroundOpacityHover
																		: 1
																}
																onColorChange={(value) =>
																	savePlayBtn({ backgroundHover: value })
																}
																onOpacityChange={(value) =>
																	savePlayBtn({ backgroundOpacityHover: value })
																}
															/>
															<PopColorControl
																label={__('Icon Hover Border Color', 'kadence-blocks')}
																colorValue={
																	playBtn[0].borderHover ? playBtn[0].borderHover : ''
																}
																colorDefault={''}
																opacityValue={
																	undefined !== playBtn[0].borderOpacityHover
																		? playBtn[0].borderOpacityHover
																		: 1
																}
																onColorChange={(value) =>
																	savePlayBtn({ borderHover: value })
																}
																onOpacityChange={(value) =>
																	savePlayBtn({ borderOpacityHover: value })
																}
															/>
														</Fragment>
													)}
												</Fragment>
											);
										} else {
											tabout = (
												<Fragment>
													<PopColorControl
														label={__('Icon Color', 'kadence-blocks')}
														colorValue={playBtn[0].color ? playBtn[0].color : '#ffffff'}
														colorDefault={'#ffffff'}
														opacityValue={
															undefined !== playBtn[0].opacity ? playBtn[0].opacity : 1
														}
														onColorChange={(value) => savePlayBtn({ color: value })}
														onOpacityChange={(value) => savePlayBtn({ opacity: value })}
													/>
													{playBtn[0].style !== 'default' && (
														<Fragment>
															<PopColorControl
																label={__('Icon Background', 'kadence-blocks')}
																colorValue={
																	playBtn[0].background
																		? playBtn[0].background
																		: '#000000'
																}
																colorDefault={'#000000'}
																opacityValue={
																	undefined !== playBtn[0].backgroundOpacity
																		? playBtn[0].backgroundOpacity
																		: 0.7
																}
																onColorChange={(value) =>
																	savePlayBtn({ background: value })
																}
																onOpacityChange={(value) =>
																	savePlayBtn({ backgroundOpacity: value })
																}
															/>
															<PopColorControl
																label={__('Icon Border Color', 'kadence-blocks')}
																colorValue={playBtn[0].border ? playBtn[0].border : ''}
																colorDefault={''}
																opacityValue={
																	undefined !== playBtn[0].borderOpacity
																		? playBtn[0].borderOpacity
																		: 1
																}
																onColorChange={(value) =>
																	savePlayBtn({ border: value })
																}
																onOpacityChange={(value) =>
																	savePlayBtn({ borderOpacity: value })
																}
															/>
														</Fragment>
													)}
												</Fragment>
											);
										}
									}
									return <div>{tabout}</div>;
								}}
							</TabPanel>
							{playBtn[0].style !== 'default' && (
								<Fragment>
									<MeasurementControls
										label={__('Border Width', 'kadence-blocks')}
										measurement={playBtn[0].borderWidth}
										control={iconBorderControl}
										onChange={(value) => savePlayBtn({ borderWidth: value })}
										onControl={(value) => setIconBorderControl(value)}
										min={0}
										max={40}
										step={1}
									/>
									<MeasurementControls
										label={__('Border Radius (%)', 'kadence-blocks')}
										measurement={playBtn[0].borderRadius}
										control={iconRadiusControl}
										onChange={(value) => savePlayBtn({ borderRadius: value })}
										onControl={(value) => setIconRadiusControl(value)}
										min={0}
										max={50}
										step={1}
										controlTypes={[
											{
												key: 'linked',
												name: __('Linked', 'kadence-blocks'),
												icon: radiusLinkedIcon,
											},
											{
												key: 'individual',
												name: __('Individual', 'kadence-blocks'),
												icon: radiusIndividualIcon,
											},
										]}
										firstIcon={topLeftIcon}
										secondIcon={topRightIcon}
										thirdIcon={bottomRightIcon}
										fourthIcon={bottomLeftIcon}
									/>
									<RangeControl
										label={__('Padding (px)', 'kadence-blocks')}
										value={playBtn[0].padding}
										onChange={(value) => {
											savePlayBtn({ padding: value });
										}}
										min={0}
										max={180}
										allowReset={true}
									/>
								</Fragment>
							)}
							<TextControl
								label={__('Title for Icon', 'kadence-blocks')}
								value={playBtn[0].title}
								onChange={(value) => {
									savePlayBtn({ title: value });
								}}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Image Overlay Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-video-image-overlay'}
						>
							<TabPanel
								className="kt-inspect-tabs kt-hover-tabs"
								activeClass="active-tab"
								tabs={[
									{
										name: 'normal',
										title: __('Normal', 'kadence-blocks'),
										className: 'kt-normal-tab',
									},
									{
										name: 'hover',
										title: __('Hover', 'kadence-blocks'),
										className: 'kt-hover-tab',
									},
								]}
							>
								{(tab) => {
									let tabout;
									if (tab.name) {
										if ('hover' === tab.name) {
											tabout = (
												<div className="kt-inner-sub-section">
													<RangeControl
														label={__('Hover Opacity', 'kadence-blocks')}
														value={
															undefined !== backgroundOverlay[0].opacityHover
																? backgroundOverlay[0].opacityHover
																: 0.5
														}
														onChange={(value) =>
															saveBackgroundOverlay({ opacityHover: value })
														}
														min={0}
														max={1}
														step={0.01}
													/>
												</div>
											);
										} else {
											tabout = (
												<div className="kt-inner-sub-section">
													<RangeControl
														label={__('Overlay Opacity', 'kadence-blocks')}
														value={
															undefined !== backgroundOverlay[0].opacity
																? backgroundOverlay[0].opacity
																: 0.3
														}
														onChange={(value) => saveBackgroundOverlay({ opacity: value })}
														min={0}
														max={1}
														step={0.01}
													/>
												</div>
											);
										}
									}
									return <div>{tabout}</div>;
								}}
							</TabPanel>
							<div className="kt-btn-size-settings-container">
								<h2 className="kt-beside-btn-group">{__('Overlay Type', 'kadence-blocks')}</h2>
								<ButtonGroup
									className="kt-button-size-type-options"
									aria-label={__('Overlay Type', 'kadence-blocks')}
								>
									{map(bgType, ({ name, key }) => (
										<Button
											key={key}
											className="kt-btn-size-btn"
											isSmall
											isPrimary={
												(undefined !== backgroundOverlay[0].type
													? backgroundOverlay[0].type
													: 'solid') === key
											}
											aria-pressed={
												(undefined !== backgroundOverlay[0].type
													? backgroundOverlay[0].type
													: 'solid') === key
											}
											onClick={() => saveBackgroundOverlay({ type: key })}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
							</div>
							{'gradient' !== backgroundOverlay[0].type && (
								<div className="kt-inner-sub-section">
									<PopColorControl
										label={__('Overlay Fill', 'kadence-blocks')}
										colorValue={backgroundOverlay[0].fill ? backgroundOverlay[0].fill : '#000000'}
										colorDefault={'#000000'}
										opacityValue={
											undefined !== backgroundOverlay[0].fillOpacity
												? backgroundOverlay[0].fillOpacity
												: 1
										}
										onColorChange={(value) => saveBackgroundOverlay({ fill: value })}
										onOpacityChange={(value) => saveBackgroundOverlay({ fillOpacity: value })}
									/>
								</div>
							)}
							{'gradient' === backgroundOverlay[0].type && (
								<div className="kt-inner-sub-section">
									<PopColorControl
										label={__('Gradient Color 1', 'kadence-blocks')}
										colorValue={backgroundOverlay[0].fill ? backgroundOverlay[0].fill : '#000000'}
										colorDefault={'#000000'}
										opacityValue={
											undefined !== backgroundOverlay[0].fillOpacity
												? backgroundOverlay[0].fillOpacity
												: 1
										}
										onColorChange={(value) => saveBackgroundOverlay({ fill: value })}
										onOpacityChange={(value) => saveBackgroundOverlay({ fillOpacity: value })}
									/>
									<RangeControl
										label={__('Location', 'kadence-blocks')}
										value={backgroundOverlay[0].gradLoc ? backgroundOverlay[0].gradLoc : 0}
										onChange={(value) => saveBackgroundOverlay({ gradLoc: value })}
										min={0}
										max={100}
									/>
									<PopColorControl
										label={__('Gradient Color 2', 'kadence-blocks')}
										colorValue={
											backgroundOverlay[0].secondFill ? backgroundOverlay[0].secondFill : ''
										}
										colorDefault={''}
										opacityValue={
											undefined !== backgroundOverlay[0].secondFillOpacity
												? backgroundOverlay[0].secondFillOpacity
												: 1
										}
										onColorChange={(value) => saveBackgroundOverlay({ secondFill: value })}
										onOpacityChange={(value) => saveBackgroundOverlay({ secondFillOpacity: value })}
									/>
									<RangeControl
										label={__('Location', 'kadence-blocks')}
										value={
											backgroundOverlay[0].gradLocSecond
												? backgroundOverlay[0].gradLocSecond
												: 100
										}
										onChange={(value) => saveBackgroundOverlay({ gradLocSecond: value })}
										min={0}
										max={100}
									/>
									<div className="kt-btn-size-settings-container">
										<h2 className="kt-beside-btn-group">{__('Gradient Type', 'kadence-blocks')}</h2>
										<ButtonGroup
											className="kt-button-size-type-options"
											aria-label={__('Gradient Type', 'kadence-blocks')}
										>
											{map(gradTypes, ({ name, key }) => (
												<Button
													key={key}
													className="kt-btn-size-btn"
													isSmall
													isPrimary={
														(backgroundOverlay[0].gradType
															? backgroundOverlay[0].gradType
															: 'linear') === key
													}
													aria-pressed={
														(backgroundOverlay[0].gradType
															? backgroundOverlay[0].gradType
															: 'linear') === key
													}
													onClick={() => saveBackgroundOverlay({ gradType: key })}
												>
													{name}
												</Button>
											))}
										</ButtonGroup>
									</div>
									{'radial' !== backgroundOverlay[0].gradType && (
										<RangeControl
											label={__('Gradient Angle', 'kadence-blocks')}
											value={
												backgroundOverlay[0].gradAngle ? backgroundOverlay[0].gradAngle : 180
											}
											onChange={(value) => saveBackgroundOverlay({ gradAngle: value })}
											min={0}
											max={360}
										/>
									)}
									{'radial' === backgroundOverlay[0].gradType && (
										<SelectControl
											label={__('Gradient Position', 'kadence-blocks')}
											value={
												backgroundOverlay[0].gradPosition
													? backgroundOverlay[0].gradPosition
													: 'center center'
											}
											options={[
												{
													value: 'center top',
													label: __('Center Top', 'kadence-blocks'),
												},
												{
													value: 'center center',
													label: __('Center Center', 'kadence-blocks'),
												},
												{
													value: 'center bottom',
													label: __('Center Bottom', 'kadence-blocks'),
												},
												{ value: 'left top', label: __('Left Top', 'kadence-blocks') },
												{
													value: 'left center',
													label: __('Left Center', 'kadence-blocks'),
												},
												{
													value: 'left bottom',
													label: __('Left Bottom', 'kadence-blocks'),
												},
												{ value: 'right top', label: __('Right Top', 'kadence-blocks') },
												{
													value: 'right center',
													label: __('Right Center', 'kadence-blocks'),
												},
												{
													value: 'right bottom',
													label: __('Right Bottom', 'kadence-blocks'),
												},
											]}
											onChange={(value) => saveBackgroundOverlay({ gradPosition: value })}
										/>
									)}
								</div>
							)}
							<SelectControl
								label={__('Blend Mode')}
								value={backgroundOverlay[0].blendMode ? backgroundOverlay[0].blendMode : 'normal'}
								options={[
									{ value: 'normal', label: __('Normal', 'kadence-blocks') },
									{ value: 'multiply', label: __('Multiply', 'kadence-blocks') },
									{ value: 'screen', label: __('Screen', 'kadence-blocks') },
									{ value: 'overlay', label: __('Overlay', 'kadence-blocks') },
									{ value: 'darken', label: __('Darken', 'kadence-blocks') },
									{ value: 'lighten', label: __('Lighten', 'kadence-blocks') },
									{ value: 'color-dodge', label: __('Color Dodge', 'kadence-blocks') },
									{ value: 'color-burn', label: __('Color Burn', 'kadence-blocks') },
									{ value: 'difference', label: __('Difference', 'kadence-blocks') },
									{ value: 'exclusion', label: __('Exclusion', 'kadence-blocks') },
									{ value: 'hue', label: __('Hue', 'kadence-blocks') },
									{ value: 'saturation', label: __('Saturation', 'kadence-blocks') },
									{ value: 'color', label: __('Color', 'kadence-blocks') },
									{ value: 'luminosity', label: __('Luminosity', 'kadence-blocks') },
								]}
								onChange={(value) => saveBackgroundOverlay({ blendMode: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Border Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-video-border'}
						>
							<ResponsiveBorderControl
								label={__('Border', 'kadence-blocks')}
								value={borderStyle}
								tabletValue={tabletBorderStyle}
								mobileValue={mobileBorderStyle}
								onChange={(value) => setAttributes({ borderStyle: value })}
								onChangeTablet={(value) => setAttributes({ tabletBorderStyle: value })}
								onChangeMobile={(value) => setAttributes({ mobileBorderStyle: value })}
							/>
							<ResponsiveMeasurementControls
								label={__('Border Radius', 'kadence-blocks')}
								value={borderRadius}
								tabletValue={tabletBorderRadius}
								mobileValue={mobileBorderRadius}
								onChange={(value) => setAttributes({ borderRadius: value })}
								onChangeTablet={(value) => setAttributes({ tabletBorderRadius: value })}
								onChangeMobile={(value) => setAttributes({ mobileBorderRadius: value })}
								min={0}
								max={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 24 : 200}
								step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
								unit={borderRadiusUnit ? borderRadiusUnit : 'px'}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ borderRadiusUnit: value })}
								isBorderRadius={true}
								allowEmpty={true}
								control="linked"
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Shadow', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-video-shadow'}
						>
							<TabPanel
								className="kt-inspect-tabs kt-hover-tabs"
								activeClass="active-tab"
								tabs={[
									{
										name: 'normal',
										title: __('Normal', 'kadence-blocks'),
										className: 'kt-normal-tab',
									},
									{
										name: 'hover',
										title: __('Hover', 'kadence-blocks'),
										className: 'kt-hover-tab',
									},
								]}
							>
								{(tab) => {
									let tabout;
									if (tab.name) {
										if ('hover' === tab.name) {
											tabout = (
												<BoxShadowControl
													label={__('Hover Box Shadow', 'kadence-blocks')}
													enable={displayShadow ? displayShadow : false}
													color={
														undefined !== shadowHover && undefined !== shadowHover[0].color
															? shadowHover[0].color
															: '#000000'
													}
													colorDefault={'#000000'}
													opacity={
														undefined !== shadowHover &&
														undefined !== shadowHover[0].opacity
															? shadowHover[0].opacity
															: 0.2
													}
													hOffset={
														undefined !== shadowHover &&
														undefined !== shadowHover[0].hOffset
															? shadowHover[0].hOffset
															: 1
													}
													vOffset={
														undefined !== shadowHover &&
														undefined !== shadowHover[0].vOffset
															? shadowHover[0].vOffset
															: 1
													}
													blur={
														undefined !== shadowHover && undefined !== shadowHover[0].blur
															? shadowHover[0].blur
															: 2
													}
													spread={
														undefined !== shadowHover && undefined !== shadowHover[0].spread
															? shadowHover[0].spread
															: 0
													}
													onEnableChange={(value) => {
														setAttributes({ displayShadow: value });
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
												/>
											);
										} else {
											tabout = (
												<BoxShadowControl
													label={__('Box Shadow', 'kadence-blocks')}
													enable={displayShadow ? displayShadow : false}
													color={
														undefined !== shadow && undefined !== shadow[0].color
															? shadow[0].color
															: '#000000'
													}
													colorDefault={'#000000'}
													opacity={
														undefined !== shadow && undefined !== shadow[0].opacity
															? shadow[0].opacity
															: 0.2
													}
													hOffset={
														undefined !== shadow && undefined !== shadow[0].hOffset
															? shadow[0].hOffset
															: 1
													}
													vOffset={
														undefined !== shadow && undefined !== shadow[0].vOffset
															? shadow[0].vOffset
															: 1
													}
													blur={
														undefined !== shadow && undefined !== shadow[0].blur
															? shadow[0].blur
															: 2
													}
													spread={
														undefined !== shadow && undefined !== shadow[0].spread
															? shadow[0].spread
															: 0
													}
													onEnableChange={(value) => {
														setAttributes({ displayShadow: value });
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
												/>
											);
										}
									}
									return <div>{tabout}</div>;
								}}
							</TabPanel>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding[0].desk}
								tabletValue={padding[0].tablet}
								mobileValue={padding[0].mobile}
								onChange={(value) => savePadding({ desk: value })}
								onChangeTablet={(value) => savePadding({ tablet: value })}
								onChangeMobile={(value) => savePadding({ mobile: value })}
								min={0}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ paddingUnit: value })}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={margin[0].desk}
								tabletValue={margin[0].tablet}
								mobileValue={margin[0].mobile}
								onChange={(value) => saveMargin({ desk: value })}
								onChangeTablet={(value) => saveMargin({ tablet: value })}
								onChangeMobile={(value) => saveMargin({ mobile: value })}
								min={marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setAttributes({ marginUnit: value })}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
							/>
							<RangeControl
								label={__('Max Width', 'kadence-blocks')}
								value={maxWidth}
								onChange={(value) => {
									setAttributes({ maxWidth: value });
								}}
								min={0}
								max={1800}
								allowReset={true}
							/>
						</KadencePanelBody>

						<div className="kt-sidebar-settings-spacer"></div>

						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={nonTransAttrs}
						/>
					</>
				)}
			</InspectorControls>
			{renderStyle}
			<div
				id={`animate-id${uniqueID}`}
				className={`kadence-video-popup-wrap ${
					displayShadow ? 'kadence-video-shadow' : 'kadence-video-noshadow'
				} aos-animate kt-animation-wrap`}
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
				style={{
					borderTop: previewBorderTopStyle ? previewBorderTopStyle : undefined,
					borderRight: previewBorderRightStyle ? previewBorderRightStyle : undefined,
					borderBottom: previewBorderBottomStyle ? previewBorderBottomStyle : undefined,
					borderLeft: previewBorderLeftStyle ? previewBorderLeftStyle : undefined,
					borderTopLeftRadius:
						'' !== previewRadiusTop
							? previewRadiusTop + (borderRadiusUnit ? borderRadiusUnit : 'px')
							: undefined,
					borderTopRightRadius:
						'' !== previewRadiusRight
							? previewRadiusRight + (borderRadiusUnit ? borderRadiusUnit : 'px')
							: undefined,
					borderBottomRightRadius:
						'' !== previewRadiusBottom
							? previewRadiusBottom + (borderRadiusUnit ? borderRadiusUnit : 'px')
							: undefined,
					borderBottomLeftRadius:
						'' !== previewRadiusLeft
							? previewRadiusLeft + (borderRadiusUnit ? borderRadiusUnit : 'px')
							: undefined,
					boxShadow: displayShadow
						? shadow[0].hOffset +
						  'px ' +
						  shadow[0].vOffset +
						  'px ' +
						  shadow[0].blur +
						  'px ' +
						  shadow[0].spread +
						  'px ' +
						  KadenceColorOutput(shadow[0].color, shadow[0].opacity)
						: undefined,
					maxWidth: undefined !== maxWidth ? maxWidth + mwUnit : undefined,
				}}
			>
				<div
					className={`kadence-video-intrinsic ${
						undefined !== ratio ? ' kadence-video-set-ratio-' + ratio : ''
					}`}
					style={{
						paddingBottom: undefined !== imageRatio ? imageRatio + '%' : undefined,
						backgroundColor: background[0].color
							? KadenceColorOutput(background[0].color, background[0].colorOpacity)
							: undefined,
						backgroundImage: previewPosterImg ? `url(${previewPosterImg})` : undefined,
					}}
				>
					{(!backgroundOverlay[0].type || 'gradient' !== backgroundOverlay[0].type) && (
						<div
							className="kadence-video-overlay"
							style={{
								background: backgroundOverlay[0].fill
									? KadenceColorOutput(backgroundOverlay[0].fill, backgroundOverlay[0].fillOpacity)
									: undefined,
								mixBlendMode: backgroundOverlay[0].blendMode
									? backgroundOverlay[0].blendMode
									: undefined,
								opacity:
									undefined !== backgroundOverlay[0].opacity
										? backgroundOverlay[0].opacity
										: undefined,
							}}
						></div>
					)}
					{backgroundOverlay[0].type && 'gradient' === backgroundOverlay[0].type && (
						<div
							className="kadence-video-overlay"
							style={{
								background:
									'radial' === backgroundOverlay[0].gradType
										? `radial-gradient(at ${
												backgroundOverlay[0].gradPosition
										  }, ${KadenceColorOutput(
												backgroundOverlay[0].fill ? backgroundOverlay[0].fill : '#000000',
												backgroundOverlay[0].fillOpacity
										  )} ${backgroundOverlay[0].gradLoc}%, ${KadenceColorOutput(
												backgroundOverlay[0].secondFill
													? backgroundOverlay[0].secondFill
													: '#000000',
												backgroundOverlay[0].secondFill
													? backgroundOverlay[0].secondFillOpacity
													: 0
										  )} ${backgroundOverlay[0].gradLocSecond}%)`
										: `linear-gradient(${backgroundOverlay[0].gradAngle}deg, ${KadenceColorOutput(
												backgroundOverlay[0].fill ? backgroundOverlay[0].fill : '#000000',
												backgroundOverlay[0].fillOpacity
										  )} ${backgroundOverlay[0].gradLoc}%, ${KadenceColorOutput(
												backgroundOverlay[0].secondFill
													? backgroundOverlay[0].secondFill
													: '#000000',
												backgroundOverlay[0].secondFill
													? backgroundOverlay[0].secondFillOpacity
													: 0
										  )} ${backgroundOverlay[0].gradLocSecond}%)`,
								mixBlendMode: backgroundOverlay[0].blendMode
									? backgroundOverlay[0].blendMode
									: undefined,
								opacity:
									undefined !== backgroundOverlay[0].opacity
										? backgroundOverlay[0].opacity
										: undefined,
							}}
						></div>
					)}
					{!previewPosterImg && (
						<MediaUpload
							onSelect={onSelectPoster}
							allowedTypes={['image']}
							type="image"
							value={''}
							render={({ open }) => (
								<Button className={'button button-large'} onClick={open}>
									{__('Select Image', 'kadence-blocks')}
								</Button>
							)}
						></MediaUpload>
					)}
					<div
						className={`kadence-video-popup-link ${
							'local' === type ? 'kadence-video-type-local' : 'kadence-video-type-external'
						}`}
					>
						<GenIcon
							className={`kt-video-svg-icon  kt-video-svg-icon-style-${
								playBtn[0].style
							} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
								'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
							} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
							name={theIcon}
							size={!playBtn[0].size ? '30' : playBtn[0].size}
							strokeWidth={!playBtn[0].width ? '2' : playBtn[0].width}
							icon={allIcons[theIcon]}
							style={{
								color: playBtn[0].color
									? KadenceColorOutput(playBtn[0].color, playBtn[0].opacity)
									: undefined,
								backgroundColor:
									playBtn[0].background && playBtn[0].style !== 'default'
										? KadenceColorOutput(playBtn[0].background, playBtn[0].backgroundOpacity)
										: undefined,
								padding:
									playBtn[0].padding && playBtn[0].style !== 'default'
										? playBtn[0].padding + 'px'
										: undefined,
								borderColor:
									playBtn[0].border && playBtn[0].style !== 'default'
										? KadenceColorOutput(playBtn[0].border, playBtn[0].borderOpacity)
										: undefined,
								borderWidth:
									playBtn[0].borderWidth &&
									'' !== playBtn[0].borderWidth[0] &&
									playBtn[0].style !== 'default'
										? playBtn[0].borderWidth[0] +
										  'px ' +
										  playBtn[0].borderWidth[1] +
										  'px ' +
										  playBtn[0].borderWidth[2] +
										  'px ' +
										  playBtn[0].borderWidth[3] +
										  'px'
										: undefined,
								borderRadius:
									playBtn[0].borderRadius &&
									'' !== playBtn[0].borderRadius[0] &&
									playBtn[0].style !== 'default'
										? playBtn[0].borderRadius[0] +
										  '% ' +
										  playBtn[0].borderRadius[1] +
										  '% ' +
										  playBtn[0].borderRadius[2] +
										  '% ' +
										  playBtn[0].borderRadius[3] +
										  '%'
										: undefined,
							}}
						/>
					</div>
				</div>
			</div>
			<SpacingVisualizer
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
				type="outside"
				forceShow={marginMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewMarginTop, marginUnit),
					getSpacingOptionOutput(previewMarginRight, marginUnit),
					getSpacingOptionOutput(previewMarginBottom, marginUnit),
					getSpacingOptionOutput(previewMarginLeft, marginUnit),
				]}
			/>
		</div>
	);
}
export default KadenceVideoPopup;
