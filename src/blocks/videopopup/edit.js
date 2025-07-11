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
	radiusIndividualIcon,
	topLeftIcon,
	topRightIcon,
	bottomRightIcon,
	bottomLeftIcon,
	proIcon,
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
	uniqueIdHelper,
	getInQueryBlock,
	setBlockDefaults,
	getPreviewSize,
	getBorderStyle,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	KadenceColorOutput,
	setDynamicState,
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
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
	ToggleControl,
	ExternalLink,
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
		mediaRatio,
		mediaRatioMobile,
		mediaUseMobile,
		mediaMobile,
		urlMobile,
		mediaPoster,
		posterType,
	} = attributes;
	const [isURLInputVisible, setIsURLInputVisible] = useState(false);
	const [localSrc, setLocalSrc] = useState('');
	const [isURLInputVisibleMobile, setIsURLInputVisibleMobile] = useState(false);
	const [localSrcMobile, setLocalSrcMobile] = useState('');
	const [isURLInputVisiblePoster, setIsURLInputVisiblePoster] = useState(false);
	const [localSrcPoster, setLocalSrcPoster] = useState('');
	const [activeTab, setActiveTab] = useState('general');
	const [dynamicPosterImg, setDynamicPosterImg] = useState('');

	const debouncedSetDynamicState = debounce(setDynamicState, 200);

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
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

	uniqueIdHelper(props);

	useEffect(() => {
		setBlockDefaults('kadence/videopopup', attributes);

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

	const theIcon = playBtn[0].icon ? playBtn[0].icon : 'fas_play';
	const containerClasses = className + ' kadence-video-popup' + uniqueID;
	const blockProps = useBlockProps({
		className: containerClasses,
	});
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
		} else if (2 !== borderWidth && !borderWidth?.[0]) {
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

		const tempPopupAnimation =
			undefined !== popup && undefined !== popup[0] && popup[0].animation ? popup[0].animation : 'none';
		if ('fade-left' == tempPopupAnimation || 'fade-right' == tempPopupAnimation) {
			savePopup({ animation: 'fade' });
		} else if ('3d-unfold' == tempPopupAnimation) {
			savePopup({ animation: 'flip' });
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

	const videoPopupProStyleControls = (
		<>
			<KadencePanelBody
				title={__('Pop Animation', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-video-pop-animation'}
				proTag={true}
			>
				<div className="kb-pro-notice">
					<h2>{__('Pop Animation', 'kadence-blocks')} </h2>
					<p>
						{__(
							'Add an appealing animation when the video opens with Kadence Blocks Pro!',
							'kadence-blocks'
						)}{' '}
					</p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>
			<KadencePanelBody
				title={__('Play Icon', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-video-play-icon'}
				proTag={true}
			>
				<div className="kb-pro-notice">
					<h2>{__('Play Icon', 'kadence-blocks')} </h2>
					<p>
						{__('Customize the play icon shape color and more with Kadence Blocks Pro!', 'kadence-blocks')}{' '}
					</p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>
			<KadencePanelBody
				title={__('Image Overlay Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-video-image-overlay'}
				proTag={true}
			>
				<div className="kb-pro-notice">
					<h2>{__('Image Overlay', 'kadence-blocks')} </h2>
					<p>{__('Add an overlay to the poster image with Kadence Blocks Pro!', 'kadence-blocks')} </p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>
			<KadencePanelBody
				title={__('Border Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-video-border'}
				proTag={true}
			>
				<div className="kb-pro-notice">
					<h2>{__('Border', 'kadence-blocks')} </h2>
					<p>{__('Adjust and customize the video border with Kadence Blocks Pro!', 'kadence-blocks')} </p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>
			<KadencePanelBody
				title={__('Shadow', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-video-shadow'}
				proTag={true}
			>
				<div className="kb-pro-notice">
					<h2>{__('Shadow', 'kadence-blocks')} </h2>
					<p>{__('Adjust and customize the video shadow with Kadence Blocks Pro!', 'kadence-blocks')} </p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>
		</>
	);

	const videoTypeOptions = applyFilters(
		'kadence.videoPopupProVideoTypeOptions',
		[
			{
				value: 'external',
				label: __('YouTube/Vimeo/VideoPress', 'kadence-blocks'),
			},
			{ value: 'local', label: __('Self Hosted (pro)', 'kadence-blocks'), disabled: true },
		],
		props
	);

	const nonTransAttrs = ['background', 'type', 'media', 'url'];

	const mediaRatioOptions = applyFilters(
		'kadence.videoPopupProMediaRatioOptions',
		[
			{ value: '', label: __('Default', 'kadence-blocks') },
			{ value: '4:3', label: __('Landscape 4:3 (Pro addon)', 'kadence-blocks'), disabled: true },
			{ value: '16:9', label: __('Wide Landscape 16:9 (Pro addon)', 'kadence-blocks'), disabled: true },
			{ value: '3:4', label: __('Portrait 3:4 (Pro addon)', 'kadence-blocks'), disabled: true },
			{ value: '9:16', label: __('Vertical 9:16 (Pro addon)', 'kadence-blocks'), disabled: true },
		],
		props
	);

	const MediaControls = ({ device }) => {
		const urlToUse = device === 'mobile' ? urlMobile : url;
		const urlString = device === 'mobile' ? 'urlMobile' : 'url';
		const isURLInputVisibleToUse = device === 'mobile' ? isURLInputVisibleMobile : isURLInputVisible;
		const setIsURLInputVisibleToUse = device === 'mobile' ? setIsURLInputVisibleMobile : setIsURLInputVisible;
		const localSrcToUse = device === 'mobile' ? localSrcMobile : localSrc;
		const setLocalSrcToUse = device === 'mobile' ? setLocalSrcMobile : setLocalSrc;

		const urlLabel =
			device === 'mobile' ? __('Mobile Video URL', 'kadence-blocks') : __('Video URL', 'kadence-blocks');

		return (
			<>
				{'local' !== type && (
					<Fragment>
						<URLInputControl
							key={device + 'url'}
							label={urlLabel}
							url={urlToUse}
							onChangeUrl={(value) => setAttributes({ [urlString]: value })}
							dynamicAttribute={urlString}
							allowClear={true}
							isSelected={isSelected}
							attributes={attributes}
							setAttributes={setAttributes}
							name={'kadence/videopopup'}
							clientId={clientId}
							context={context}
							additionalControls={false}
						/>
					</Fragment>
				)}
				{applyFilters(
					'kadence.videoPopupProLocalVideoControls',
					'',
					props,
					isURLInputVisibleToUse,
					setIsURLInputVisibleToUse,
					localSrcToUse,
					setLocalSrcToUse,
					device
				)}
			</>
		);
	};

	const videoPopupProMediaMobileControls = (
		<ToggleControl
			label={
				<div
					style={{
						display: 'flex',
						gap: '5px',
						alignItems: 'center',
						justifyContent: 'flex-start',
						width: '100%',
						fill: 'white',
					}}
				>
					<span>{__('Use Mobile Video', 'kadence-blocks')}</span>
					{proIcon}
				</div>
			}
			checked={mediaUseMobile}
			help={__(
				'Play a different video on smaller screens. You can also set a different video ratio.',
				'kadence-blocks'
			)}
			disabled={true}
		/>
	);

	const videoPopupProLocalVideoPosterControls = (
		<SelectControl
			label={__('Poster Type', 'kadence-blocks')}
			value={posterType}
			options={[
				{ value: '', label: __('Image', 'kadence-blocks') },
				{ value: 'video', label: __('Video (Pro addon)', 'kadence-blocks'), disabled: true },
			]}
			onChange={(value) => setAttributes({ posterType: value })}
		/>
	);

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
								options={videoTypeOptions}
								onChange={(value) => setAttributes({ type: value, isVimeoPrivate: false })}
							/>
							<MediaControls device="desktop" />
							<SelectControl
								label={__('Video Ratio', 'kadence-blocks')}
								value={mediaRatio}
								options={mediaRatioOptions}
								onChange={(value) => setAttributes({ mediaRatio: value })}
							/>

							{applyFilters(
								'kadence.videoPopupProMediaMobileControls',
								videoPopupProMediaMobileControls,
								props
							)}

							{mediaUseMobile && kadence_blocks_params?.pro && (
								<KadencePanelBody style={{ marginBottom: '10px' }}>
									<MediaControls device="mobile" />
									<SelectControl
										label={__('Mobile Video Ratio', 'kadence-blocks')}
										value={mediaRatioMobile}
										options={mediaRatioOptions}
										onChange={(value) => setAttributes({ mediaRatioMobile: value })}
									/>
								</KadencePanelBody>
							)}

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

							{applyFilters(
								'kadence.videoPopupProLocalVideoPosterControls',
								videoPopupProLocalVideoPosterControls,
								props,
								isURLInputVisiblePoster,
								setIsURLInputVisiblePoster,
								localSrcPoster,
								setLocalSrcPoster
							)}

							{'video' !== posterType && (
								<>
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
								</>
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
						</KadencePanelBody>
						{applyFilters('kadence.videoPopupProStyleControls', videoPopupProStyleControls, props)}
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
					{posterType === 'video' && mediaPoster && mediaPoster[0] && mediaPoster[0].url && (
						<video
							src={mediaPoster[0].url}
							autoPlay={false}
							muted={true}
							playsInline={false}
							className={'kadence-video-poster'}
							preload="metadata"
						/>
					)}
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
