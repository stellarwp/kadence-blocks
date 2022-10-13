/**
 * External dependencies
 */
import classnames from 'classnames';
import { every, filter, forEach, debounce, map } from 'lodash';
import Masonry from 'react-masonry-component';

/**
 * Kadence Components.
 */
import {
	KadenceColorOutput,
	showSettings,
} from '@kadence/helpers';
import {
	PopColorControl,
	TypographyControls,
	KadencePanelBody,
	RangeControl,
	WebfontLoader,
	ImageSizeControl,
	DynamicLinkControl,
	KadenceMediaPlaceholder,
	DynamicGalleryControl,
	MeasurementControls,
	InspectorControlTabs,
	KadenceBlockDefaults
} from '@kadence/components';
import Slider from 'react-slick';
import { applyFilters } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

/**
 * Import Icons
 */
import {
	topLeftIcon,
	topRightIcon,
	bottomLeftIcon,
	bottomRightIcon,
	radiusLinkedIcon,
	radiusIndividualIcon,
	galMasonryIcon,
	galGridIcon,
	galCarouselIcon,
	galFluidIcon,
	galSliderIcon,
	galTilesIcon,
	thumbSliderIcon,
} from '@kadence/icons';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import {
	Button,
	ButtonGroup,
	Tooltip,
	SelectControl,
	ToggleControl,
	Toolbar,
	TabPanel,
	Dashicon,
	Placeholder,
	withNotices,
} from '@wordpress/components';
import {
	BlockControls,
	BlockIcon,
	MediaPlaceholder,
	MediaUpload,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import GalleryImage from './gallery-image';
import { getRelevantMediaFiles } from './shared';

import {
	image,
	closeSmall,
	plusCircleFilled,
} from '@wordpress/icons';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

const linkOptions = [
	{ value: 'attachment', label: __( 'Attachment Page', 'kadence-blocks' ) },
	{ value: 'media', label: __( 'Media File', 'kadence-blocks' ) },
	{ value: 'custom', label: __( 'Custom', 'kadence-blocks' ) },
	{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
];
const typeOptions = [
	{ value: 'masonry', label: __( 'Masonry', 'kadence-blocks' ), icon: galMasonryIcon, isDisabled: false },
	{ value: 'grid', label: __( 'Grid', 'kadence-blocks' ), icon: galGridIcon, isDisabled: false },
	{ value: 'carousel', label: __( 'Carousel', 'kadence-blocks' ), icon: galCarouselIcon, isDisabled: false },
	{ value: 'fluidcarousel', label: __( 'Fluid Carousel', 'kadence-blocks' ), icon: galFluidIcon, isDisabled: false },
	{ value: 'slider', label: __( 'Slider', 'kadence-blocks' ), icon: galSliderIcon, isDisabled: false },
	{ value: 'thumbslider', label: __( 'Thumbnail Slider (Pro addon)', 'kadence-blocks' ), icon: thumbSliderIcon, isDisabled: true },
	{ value: 'tiles', label: __( 'Tiles (Pro addon)', 'kadence-blocks' ), icon: galTilesIcon, isDisabled: true },
	// { value: 'mosaic', label: __( 'Mosaic (Pro only)', 'kadence-blocks' ), icon: galSliderIcon, isDisabled: true },
];

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbGalleryUniqueIDs = [];

const ALLOWED_MEDIA_TYPES = [ 'image' ];

function GalleryEdit( props ) {

	// saveImageAttributes = debounce( saveImageAttributes.bind( this ), 1000 );
	// carouselSizeTrigger = debounce( carouselSizeTrigger.bind( this ), 250 );

	const { attributes, isSelected, className, noticeUI, mediaUpload, context, clientId, setAttributes } = props;
	const {
		inQueryBlock,
		uniqueID,
		images,
		columns,
		linkTo,
		ids,
		columnControl,
		showCaption,
		captionStyles,
		lightbox,
		lightSize,
		type,
		imageRatio,
		captionStyle,
		gutter,
		thumbSize,
		autoPlay,
		autoSpeed,
		transSpeed,
		slidesScroll,
		arrowStyle,
		dotStyle,
		imageRadius,
		margin,
		marginUnit,
		displayShadow,
		shadow,
		shadowHover,
		carouselHeight,
		imageFilter,
		lightboxCaption,
		carouselAlign,
		thumbnailColumns,
		thumbnailControl,
		thumbnailRatio,
		mobileForceHover,
		kadenceDynamic,
		imagesDynamic,
	} = attributes;

	useEffect( () => {

		if ( !uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/advancedgallery' ] !== undefined && typeof blockConfigObject[ 'kadence/advancedgallery' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/advancedgallery' ] ).map( ( attribute ) => {
					attributes[ attribute ] = blockConfigObject[ 'kadence/advancedgallery' ][ attribute ];
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kbGalleryUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( kbGalleryUniqueIDs.includes( uniqueID ) ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kbGalleryUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			kbGalleryUniqueIDs.push( uniqueID );
		}
		if ( every( images, ( { url } ) => isBlobURL( url ) ) ) {
			const filesList = map( images, ( { url } ) => getBlobByURL( url ) );
			forEach( images, ( { url } ) => revokeBlobURL( url ) );
			mediaUpload( {
				filesList,
				onFileChange: ( imgs ) => onSelectImages( imgs, 2 ),
				allowedTypes: [ 'image' ],
			} );
		}

		if ( context && context.queryId && context.postId ) {
			if ( !inQueryBlock ) {
				setAttributes( {
					inQueryBlock: true,
				} );
			}
		} else if ( inQueryBlock ) {
			setAttributes( {
				inQueryBlock: false,
			} );
		}
	}, [] );

	const blockProps = useBlockProps( {
		className: `wp-block-kadence-advancedgallery ${className} kb-gallery-container`,
		style: {
			margin: ( undefined !== margin[ 0 ] && undefined !== margin[ 0 ].desk && '' !== margin[ 0 ].desk[ 0 ] ? margin[ 0 ].desk[ 0 ] + ( undefined !== marginUnit ? marginUnit : 'px' ) + ' ' + margin[ 0 ].desk[ 1 ] + ( undefined !== marginUnit ? marginUnit : 'px' ) + ' ' + margin[ 0 ].desk[ 2 ] + ( undefined !== marginUnit ? marginUnit : 'px' ) + ' ' + margin[ 0 ].desk[ 3 ] + ( undefined !== marginUnit ? marginUnit : 'px' ) + ' ' : undefined ),
		},
	} );

	const [ selectedImage, setSelectedImage ] = useState( null );

	const [ marginDeskControl, setMarginDeskControl ] = useState( 'linked' );
	const [ marginTabletControl, setMarginTabletControl ] = useState( 'linked' );
	const [ marginMobileControl, setMarginMobileControl ] = useState( 'linked' );
	const [ radiusControl, setRadiusControl ] = useState( 'linked' );
	const [ activeTab, setActiveTab ] = useState( 'general' );

	const [ sliderSlides, setSliderSlides ] = useState( null );
	const [ sliderThumbs, setSliderThumbs ] = useState( null );

	const setAttribs = ( attribs ) => {
		let newAttribs = attribs;

		if ( newAttribs.ids ) {
			throw new Error( 'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes' );
		}

		if ( newAttribs.images ) {
			newAttribs = {
				...newAttribs,
				ids: map( newAttribs.images, 'id' ),
			};
		}

		setAttributes( newAttribs );
	}

	const onSelectImage = ( index ) => {
		if ( selectedImage !== index ) {
			setSelectedImage( index );
		}
	};

	const onMove = ( oldIndex, newIndex ) => {
		let newImages = [ ...images ];
		newImages.splice( newIndex, 1, images[ oldIndex ] );
		newImages.splice( oldIndex, 1, images[ newIndex ] );
		setSelectedImage( newIndex );
		setAttribs( { images: newImages } );
	};

	const onMoveForward = ( oldIndex ) => {
		if ( oldIndex === images.length - 1 ) {
			return;
		}
		onMove( oldIndex, oldIndex + 1 );
	};

	const onMoveBackward = ( oldIndex ) => {
		if ( oldIndex === 0 ) {
			return;
		}
		onMove( oldIndex, oldIndex - 1 );
	};

	const onRemoveImage = ( index ) => {
		let newImages = filter( images, ( img, i ) => index !== i );
		setSelectedImage( null );
		setAttribs( {
			images: newImages
		} );
	};

	//async
	async function onSelectImages( imgs, src = 9 ) {
		const updatingImages = await getRelevantMediaFiles( imgs, lightSize, thumbSize, images );
		setAttribs( {
			images: updatingImages,
		} );
	};

	const onUploadError = ( message ) => {
		const { noticeOperations } = props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	};

	// async
	async function setCaptions() {
		let previousShowCaption = showCaption;
		setAttribs( { showCaption: !previousShowCaption } );

		if ( previousShowCaption ) {
			if ( images ) {
				const updatingImages = await getRelevantMediaFiles( images, lightSize, thumbSize );

				setAttribs( {
					images: updatingImages,
				} );
			}
		}
	};

	// async
	async function changeImageThumbSize( img ) {

		setAttributes( { thumbSize: img.slug } );
		const updatingImages = await getRelevantMediaFiles( images, lightSize, img.slug );
		setAttribs( {
			images: updatingImages,
		} );
	};

	// async
	async function changeImageLightSize( img ) {
		setAttributes( { lightSize: img.slug } );

		const updatingImages = await getRelevantMediaFiles( images, img.slug, thumbSize );
		setAttribs( {
			images: updatingImages,
		} );
	};

	const setColumnsNumber = ( value ) => {
		setAttribs( { columns: value } );
	};

	const toggleImageCrop = () => {
		setAttribs( { imageCrop: !imageCrop } );
	};

	const getImageCropHelp = ( checked ) => {
		return checked ? __( 'Thumbnails are cropped to align.', 'kadence-blocks' ) : __( 'Thumbnails are not cropped.', 'kadence-blocks' );
	};
	const saveImageAttributes = ( id, attributes ) => {
		const data = new window.FormData();
		forEach( attributes, ( ( value, key ) => data.append( key, value ) ) );
		apiFetch( {
			path  : '/wp/v2/media/' + id,
			body  : data,
			method: 'POST',
		} );
	};
	const setImageAttributes = ( index, attributes ) => {

		if ( !images[ index ] ) {
			return;
		}
		if ( images[ index ].id ) {
			saveImageAttributes( images[ index ].id, attributes );
		}
		setAttributes( {
			images: [
				...images.slice( 0, index ),
				{
					...images[ index ],
					...attributes,
				},
				...images.slice( index + 1 ),
			],
		} );
	};
	const setLinkAttributes = ( index, attributes ) => {
		if ( !images[ index ] ) {
			return;
		}
		setAttributes( {
			images: [
				...images.slice( 0, index ),
				{
					...images[ index ],
					...attributes,
				},
				...images.slice( index + 1 ),
			],
		} );
	};

	// const componentDidUpdate = ( prevProps ) => {
	// 	// Deselect images when deselecting the block
	// 	if ( !isSelected && prevProps.isSelected ) {
	// 		setSelectedImage( null );
	// 		setCaptionSelected( false );
	// 	}
	// };

	const carouselSizeTrigger = () => {
		const carousel = document.getElementById( 'kb-gallery-id-' + uniqueID );
		if ( carousel ) {
			const width = Math.floor( ( 80 / 100 ) * carousel.offsetWidth );
			carousel.querySelectorAll( '.slick-slide' ).forEach( function( item ) {
				item.style.maxWidth = width + 'px';
			} );
		}

		return;
	};

	const dynamicSource = ( kadenceDynamic && kadenceDynamic[ 'images' ] && kadenceDynamic[ 'images' ].enable ? true : false );
	const galleryTypes = applyFilters( 'kadence.galleryTypes', typeOptions );
	const theImages = dynamicSource ? imagesDynamic : images;
	const hasImages = !!theImages.length;
	const onColumnChange = ( value ) => {
		let columnArray = [];
		if ( 1 === value ) {
			columnArray = [ 1, 1, 1, 1, 1, 1 ];
		} else if ( 2 === value ) {
			columnArray = [ 2, 2, 2, 2, 1, 1 ];
		} else if ( 3 === value ) {
			columnArray = [ 3, 3, 3, 2, 1, 1 ];
		} else if ( 4 === value ) {
			columnArray = [ 4, 4, 4, 3, 2, 2 ];
		} else if ( 5 === value ) {
			columnArray = [ 5, 5, 5, 4, 4, 3 ];
		} else if ( 6 === value ) {
			columnArray = [ 6, 6, 6, 4, 4, 3 ];
		} else if ( 7 === value ) {
			columnArray = [ 7, 7, 7, 5, 5, 4 ];
		} else if ( 8 === value ) {
			columnArray = [ 8, 8, 8, 6, 4, 4 ];
		}
		setAttributes( { columns: columnArray } );
	};
	const onThumbColumnChange = ( value ) => {
		let columnArray = [];
		if ( 1 === value ) {
			columnArray = [ 1, 1, 1, 1, 1, 1 ];
		} else if ( 2 === value ) {
			columnArray = [ 2, 2, 2, 2, 2, 2 ];
		} else if ( 3 === value ) {
			columnArray = [ 3, 3, 3, 3, 3, 3 ];
		} else if ( 4 === value ) {
			columnArray = [ 4, 4, 4, 4, 4, 4 ];
		} else if ( 5 === value ) {
			columnArray = [ 5, 5, 5, 4, 4, 4 ];
		} else if ( 6 === value ) {
			columnArray = [ 6, 6, 6, 4, 4, 4 ];
		} else if ( 7 === value ) {
			columnArray = [ 7, 7, 7, 5, 5, 4 ];
		} else if ( 8 === value ) {
			columnArray = [ 8, 8, 8, 6, 4, 4 ];
		} else if ( 9 === value ) {
			columnArray = [ 9, 9, 9, 7, 5, 5 ];
		} else if ( 10 === value ) {
			columnArray = [ 10, 10, 10, 8, 6, 6 ];
		}
		setAttributes( { thumbnailColumns: columnArray } );
	};
	const saveShadow = ( value ) => {
		const newUpdate = shadow.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			shadow: newUpdate,
		} );
	};
	const saveShadowHover = ( value ) => {
		const newUpdate = shadowHover.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			shadowHover: newUpdate,
		} );
	};
	const saveMargin = ( value ) => {
		const newUpdate = margin.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			margin: newUpdate,
		} );
	};
	const marginMin = ( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 );
	const marginMax = ( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 );
	const marginStep = ( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 );
	const marginTypes = [
		{ key: 'px', name: 'px' },
		{ key: 'em', name: 'em' },
		{ key: '%', name: '%' },
		{ key: 'vh', name: 'vh' },
		{ key: 'rem', name: 'rem' },
	];
	const columnControlTypes = [
		{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: __( 'Linked', 'kadence-blocks' ) },
		{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: __( 'Individual', 'kadence-blocks' ) },
	];
	const gconfig = {
		google: {
			families: [ captionStyles[ 0 ].family + ( captionStyles[ 0 ].variant ? ':' + captionStyles[ 0 ].variant : '' ) ],
		},
	};
	const config = ( captionStyles[ 0 ].google ? gconfig : '' );
	const saveCaptionFont = ( value ) => {
		const newUpdate = captionStyles.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			captionStyles: newUpdate,
		} );
	};

	function CustomNextArrow( props ) {
		const { className, style, onClick } = props;
		return (
			<button
				className={className}
				style={{ ...style, display: 'block' }}
				onClick={onClick}
			>
				<Dashicon icon="arrow-right-alt2"/>
			</button>
		);
	}

	function CustomPrevArrow( props ) {
		const { className, style, onClick } = props;
		return (
			<button
				className={className}
				style={{ ...style, display: 'block' }}
				onClick={onClick}
			>
				<Dashicon icon="arrow-left-alt2"/>
			</button>
		);
	}

	const carouselSettings = {
		dots          : ( dotStyle === 'none' ? false : true ),
		arrows        : ( arrowStyle === 'none' ? false : true ),
		infinite      : true,
		speed         : transSpeed,
		draggable     : false,
		autoplaySpeed : autoSpeed,
		autoplay      : autoPlay,
		slidesToShow  : columns[ 0 ],
		slidesToScroll: ( slidesScroll === 'all' ? columns[ 0 ] : 1 ),
		nextArrow     : <CustomNextArrow/>,
		prevArrow     : <CustomPrevArrow/>,
	};
	const fluidCarouselSettings = {
		dots          : ( dotStyle === 'none' ? false : true ),
		arrows        : ( arrowStyle === 'none' ? false : true ),
		infinite      : true,
		speed         : transSpeed,
		draggable     : false,
		autoplaySpeed : autoSpeed,
		autoplay      : autoPlay,
		centerMode    : ( carouselAlign === false ? false : true ),
		variableWidth : true,
		slidesToShow  : 1,
		slidesToScroll: 1,
		nextArrow     : <CustomNextArrow/>,
		prevArrow     : <CustomPrevArrow/>,
		onInit        : () => carouselSizeTrigger(),
		onReInit      : () => carouselSizeTrigger(),
	};
	const sliderSettings = {
		dots          : ( dotStyle === 'none' ? false : true ),
		arrows        : ( arrowStyle === 'none' ? false : true ),
		infinite      : true,
		fade          : true,
		speed         : transSpeed,
		draggable     : false,
		autoplaySpeed : autoSpeed,
		autoplay      : autoPlay,
		slidesToShow  : 1,
		slidesToScroll: 1,
		nextArrow     : <CustomNextArrow/>,
		prevArrow     : <CustomPrevArrow/>,
	};
	const thumbsliderSettings = {
		dots          : false,
		arrows        : ( arrowStyle === 'none' ? false : true ),
		infinite      : true,
		fade          : true,
		speed         : transSpeed,
		draggable     : false,
		autoplaySpeed : autoSpeed,
		autoplay      : autoPlay,
		slidesToShow  : 1,
		slidesToScroll: 1,
		onInit        : () => onSelectImage( 0 ),
		nextArrow     : <CustomNextArrow/>,
		prevArrow     : <CustomPrevArrow/>,
	};
	const thumbsliderthumbsSettings = {
		dots          : false,
		arrows        : ( arrowStyle === 'none' ? false : true ),
		infinite      : true,
		fade          : false,
		speed         : transSpeed,
		draggable     : false,
		autoplaySpeed : autoSpeed,
		autoplay      : autoPlay,
		slidesToShow  : thumbnailColumns[ 0 ],
		slidesToScroll: 1,
		nextArrow     : <CustomNextArrow/>,
		prevArrow     : <CustomPrevArrow/>,
		swipeToSlide  : true,
		focusOnSelect : true,
	};
	const controls = (
		<BlockControls>
			{hasImages && !dynamicSource && (
				<Toolbar>
					<MediaUpload
						onSelect={( imgs ) => onSelectImages( imgs, 3 ) }
						allowedTypes={ALLOWED_MEDIA_TYPES}
						multiple
						gallery
						value={images.map( ( img ) => img.id )}
						render={( { open } ) => (
							<Button
								className="components-toolbar__control"
								label={__( 'Edit gallery', 'kadence-blocks' )}
								icon="edit"
								onClick={open}
							/>
						)}
					/>
				</Toolbar>
			)}
		</BlockControls>
	);
	const typeLabel = galleryTypes.filter( ( item ) => ( item.value === type ) );
	const sidebarControls = (
		<>
			{showSettings( 'allSettings', 'kadence/advancedgallery' ) && (
				<InspectorControls>

					<InspectorControlTabs
						panelName={ 'advanced-gallery' }
						setActiveTab={ ( value ) => setActiveTab( value ) }
						activeTab={ activeTab }
					/>

					{( activeTab === 'general' ) &&

						<>
							<KadencePanelBody
								title={__( 'Gallery Settings', 'kadence-blocks' )}
								panelName={'kb-gallery-settings'}
							>
								{kadence_blocks_params.dynamic_enabled && dynamicSource && (
									<DynamicGalleryControl dynamicAttribute="images" {...props} />
								)}
								<h2>{__( 'Gallery Type:' ) + ' ' + ( undefined !== typeLabel && undefined !== typeLabel[ 0 ] && typeLabel[ 0 ].label ? typeLabel[ 0 ].label : 'Masonry' )}</h2>
								<ButtonGroup className="kt-style-btn-group kb-gallery-type-select" aria-label={__( 'Gallery Type', 'kadence-blocks' )}>
									{map( galleryTypes, ( { value, label, icon, isDisabled } ) => (
										<Tooltip text={label}>
											<Button
												key={value}
												className={`kt-style-btn${( isDisabled ? ' kb-disabled-btn' : '' )}`}
												isSmall
												isDisabled={isDisabled}
												isPrimary={type === value}
												aria-pressed={type === value}
												onClick={() => {
													if ( !isDisabled ) {
														setAttributes( { type: value } );
													}
												}}
											>
												{icon}
											</Button>
										</Tooltip>
									) )}
								</ButtonGroup>
								{( type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider' ) && (
									<SelectControl
										label={__( 'Image ratio', 'kadence-blocks' )}
										options={[
											{
												label: __( 'Landscape 4:3', 'kadence-blocks' ),
												value: 'land43',
											},
											{
												label: __( 'Landscape 3:2', 'kadence-blocks' ),
												value: 'land32',
											},
											{
												label: __( 'Landscape 16:9', 'kadence-blocks' ),
												value: 'land169',
											},
											{
												label: __( 'Landscape 2:1', 'kadence-blocks' ),
												value: 'land21',
											},
											{
												label: __( 'Landscape 3:1', 'kadence-blocks' ),
												value: 'land31',
											},
											{
												label: __( 'Landscape 4:1', 'kadence-blocks' ),
												value: 'land41',
											},
											{
												label: __( 'Portrait 3:4', 'kadence-blocks' ),
												value: 'port34',
											},
											{
												label: __( 'Portrait 2:3', 'kadence-blocks' ),
												value: 'port23',
											},
											{
												label: __( 'Square 1:1', 'kadence-blocks' ),
												value: 'square',
											},
											{
												label: __( 'Inherit', 'kadence-blocks' ),
												value: 'inherit',
											},
										]}
										value={imageRatio}
										onChange={( value ) => setAttributes( { imageRatio: value } )}
									/>
								)}
								{( type === 'thumbslider' ) && (
									<SelectControl
										label={__( 'Thumbnail Image ratio', 'kadence-blocks' )}
										options={[
											{
												label: __( 'Landscape 4:3', 'kadence-blocks' ),
												value: 'land43',
											},
											{
												label: __( 'Landscape 3:2', 'kadence-blocks' ),
												value: 'land32',
											},
											{
												label: __( 'Landscape 16:9', 'kadence-blocks' ),
												value: 'land169',
											},
											{
												label: __( 'Landscape 2:1', 'kadence-blocks' ),
												value: 'land21',
											},
											{
												label: __( 'Landscape 3:1', 'kadence-blocks' ),
												value: 'land31',
											},
											{
												label: __( 'Landscape 4:1', 'kadence-blocks' ),
												value: 'land41',
											},
											{
												label: __( 'Portrait 3:4', 'kadence-blocks' ),
												value: 'port34',
											},
											{
												label: __( 'Portrait 2:3', 'kadence-blocks' ),
												value: 'port23',
											},
											{
												label: __( 'Square 1:1', 'kadence-blocks' ),
												value: 'square',
											},
											{
												label: __( 'Inherit', 'kadence-blocks' ),
												value: 'inherit',
											},
										]}
										value={thumbnailRatio}
										onChange={( value ) => setAttributes( { thumbnailRatio: value } )}
									/>
								)}
								{type && ( type === 'carousel' || type === 'grid' || type === 'masonry' ) && (
									<>
										<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={__( 'Column Control Type', 'kadence-blocks' )}>
											{map( columnControlTypes, ( { name, key, icon } ) => (
												<Tooltip text={name}>
													<Button
														key={key}
														className="kt-size-btn"
														isSmall
														isPrimary={columnControl === key}
														aria-pressed={columnControl === key}
														onClick={() => setAttributes( { columnControl: key } )}
													>
														{icon}
													</Button>
												</Tooltip>
											) )}
										</ButtonGroup>
										{columnControl !== 'individual' && (
											<RangeControl
												label={__( 'Columns' )}
												value={columns[ 2 ]}
												onChange={onColumnChange}
												min={1}
												max={8}
											/>
										)}
										{columnControl && columnControl === 'individual' && (
											<>
												<h4>{__( 'Columns', 'kadence-blocks' )}</h4>
												<RangeControl
													label={__( 'Screen Above 1500px', 'kadence-blocks' )}
													value={columns[ 0 ]}
													onChange={( value ) => setAttributes( { columns: [ value, columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen 1200px - 1499px', 'kadence-blocks' )}
													value={columns[ 1 ]}
													onChange={( value ) => setAttributes( { columns: [ columns[ 0 ], value, columns[ 2 ], columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen 992px - 1199px', 'kadence-blocks' )}
													value={columns[ 2 ]}
													onChange={( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], value, columns[ 3 ], columns[ 4 ], columns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen 768px - 991px', 'kadence-blocks' )}
													value={columns[ 3 ]}
													onChange={( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], value, columns[ 4 ], columns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen 544px - 767px', 'kadence-blocks' )}
													value={columns[ 4 ]}
													onChange={( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], value, columns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen Below 543px', 'kadence-blocks' )}
													value={columns[ 5 ]}
													onChange={( value ) => setAttributes( { columns: [ columns[ 0 ], columns[ 1 ], columns[ 2 ], columns[ 3 ], columns[ 4 ], value ] } )}
													min={1}
													max={8}
												/>
											</>
										)}
									</>
								)}
								{type && ( type === 'thumbslider' ) && (
									<>
										<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={__( 'Thumb Column Control Type', 'kadence-blocks' )}>
											{map( columnControlTypes, ( { name, key, icon } ) => (
												<Tooltip text={name}>
													<Button
														key={key}
														className="kt-size-btn"
														isSmall
														isPrimary={thumbnailControl === key}
														aria-pressed={thumbnailControl === key}
														onClick={() => setAttributes( { thumbnailControl: key } )}
													>
														{icon}
													</Button>
												</Tooltip>
											) )}
										</ButtonGroup>
										{thumbnailControl !== 'individual' && (
											<RangeControl
												label={__( 'Thumbnail Columns', 'kadence-blocks' )}
												value={thumbnailColumns[ 2 ]}
												onChange={onThumbColumnChange}
												min={1}
												max={10}
											/>
										)}
										{thumbnailControl && thumbnailControl === 'individual' && (
											<>
												<h4>{__( 'Columns' )}</h4>
												<RangeControl
													label={__( 'Screen Above 1500px', 'kadence-blocks' )}
													value={thumbnailColumns[ 0 ]}
													onChange={( value ) => setAttributes( { thumbnailColumns: [ value, thumbnailColumns[ 1 ], thumbnailColumns[ 2 ], thumbnailColumns[ 3 ], thumbnailColumns[ 4 ], thumbnailColumns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen 1200px - 1499px', 'kadence-blocks' )}
													value={thumbnailColumns[ 1 ]}
													onChange={( value ) => setAttributes( { thumbnailColumns: [ thumbnailColumns[ 0 ], value, thumbnailColumns[ 2 ], thumbnailColumns[ 3 ], thumbnailColumns[ 4 ], thumbnailColumns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen 992px - 1199px', 'kadence-blocks' )}
													value={thumbnailColumns[ 2 ]}
													onChange={( value ) => setAttributes( { thumbnailColumns: [ thumbnailColumns[ 0 ], thumbnailColumns[ 1 ], value, thumbnailColumns[ 3 ], thumbnailColumns[ 4 ], thumbnailColumns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen 768px - 991px', 'kadence-blocks' )}
													value={thumbnailColumns[ 3 ]}
													onChange={( value ) => setAttributes( { thumbnailColumns: [ thumbnailColumns[ 0 ], thumbnailColumns[ 1 ], thumbnailColumns[ 2 ], value, thumbnailColumns[ 4 ], thumbnailColumns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen 544px - 767px', 'kadence-blocks' )}
													value={thumbnailColumns[ 4 ]}
													onChange={( value ) => setAttributes( { thumbnailColumns: [ thumbnailColumns[ 0 ], thumbnailColumns[ 1 ], thumbnailColumns[ 2 ], thumbnailColumns[ 3 ], value, thumbnailColumns[ 5 ] ] } )}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__( 'Screen Below 543px', 'kadence-blocks' )}
													value={thumbnailColumns[ 5 ]}
													onChange={( value ) => setAttributes( { thumbnailColumns: [ thumbnailColumns[ 0 ], thumbnailColumns[ 1 ], thumbnailColumns[ 2 ], thumbnailColumns[ 3 ], thumbnailColumns[ 4 ], value ] } )}
													min={1}
													max={8}
												/>
											</>
										)}
									</>
								)}
								{type !== 'slider' && showSettings( 'gutterSettings', 'kadence/advancedgallery' ) && (
									<>
										<h2 className="kt-heading-size-title">{__( 'Gutter', 'kadence-blocks' )}</h2>
										<TabPanel className="kt-size-tabs"
												  activeClass="active-tab"
												  tabs={[
													  {
														  name     : 'desk',
														  title    : <Dashicon icon="desktop"/>,
														  className: 'kt-desk-tab',
													  },
													  {
														  name     : 'tablet',
														  title    : <Dashicon icon="tablet"/>,
														  className: 'kt-tablet-tab',
													  },
													  {
														  name     : 'mobile',
														  title    : <Dashicon icon="smartphone"/>,
														  className: 'kt-mobile-tab',
													  },
												  ]}>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'mobile' === tab.name ) {
															tabout = (
																<RangeControl
																	value={( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' )}
																	onChange={value => setAttributes( { gutter: [ ( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' ), ( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' ), value ] } )}
																	step={2}
																	min={0}
																	max={100}
																/>
															);
														} else if ( 'tablet' === tab.name ) {
															tabout = (
																<RangeControl
																	value={( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' )}
																	onChange={value => setAttributes( { gutter: [ ( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' ), value, ( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' ) ] } )}
																	step={2}
																	min={0}
																	max={100}
																/>
															);
														} else {
															tabout = (
																<RangeControl
																	value={( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' )}
																	onChange={value => setAttributes( { gutter: [ value, ( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' ), ( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' ) ] } )}
																	step={2}
																	min={0}
																	max={100}
																/>
															);
														}
													}
													return <div className={tab.className} key={tab.className}>{tabout}</div>;
												}
											}
										</TabPanel>
									</>
								)}
								{( type === 'fluidcarousel' || type === 'tiles' ) && (
									<>
										<h2 className="kt-heading-size-title">{( type === 'tiles' ? __( 'Row Height', 'kadence-blocks' ) : __( 'Carousel Height', 'kadence-blocks' ) )}</h2>
										<TabPanel className="kt-size-tabs"
												  activeClass="active-tab"
												  tabs={[
													  {
														  name     : 'desk',
														  title    : <Dashicon icon="desktop"/>,
														  className: 'kt-desk-tab',
													  },
													  {
														  name     : 'tablet',
														  title    : <Dashicon icon="tablet"/>,
														  className: 'kt-tablet-tab',
													  },
													  {
														  name     : 'mobile',
														  title    : <Dashicon icon="smartphone"/>,
														  className: 'kt-mobile-tab',
													  },
												  ]}>
											{
												( tab ) => {
													if ( tab.name ) {
														if ( 'mobile' === tab.name ) {
															return (
																<div className={tab.className} key={tab.className}>
																	<RangeControl
																		value={( ( undefined !== carouselHeight && undefined !== carouselHeight[ 2 ] ) ? carouselHeight[ 2 ] : '' )}
																		onChange={value => setAttributes( { carouselHeight: [ ( ( undefined !== carouselHeight && undefined !== carouselHeight[ 0 ] ) ? carouselHeight[ 0 ] : '' ), ( ( undefined !== carouselHeight && undefined !== carouselHeight[ 1 ] ) ? carouselHeight[ 1 ] : '' ), value ] } )}
																		step={1}
																		min={120}
																		max={800}
																	/>
																</div>
															);
														} else if ( 'tablet' === tab.name ) {
															return (
																<div className={tab.className} key={tab.className}>
																	<RangeControl
																		value={( ( undefined !== carouselHeight && undefined !== carouselHeight[ 1 ] ) ? carouselHeight[ 1 ] : '' )}
																		onChange={value => setAttributes( { carouselHeight: [ ( ( undefined !== carouselHeight && undefined !== carouselHeight[ 0 ] ) ? carouselHeight[ 0 ] : '' ), value, ( ( undefined !== carouselHeight && undefined !== carouselHeight[ 2 ] ) ? carouselHeight[ 2 ] : '' ) ] } )}
																		step={1}
																		min={120}
																		max={800}
																	/>
																</div>
															);
														} else {
															return (
																<div className={tab.className} key={tab.className}>
																	<RangeControl
																		value={( ( undefined !== carouselHeight && undefined !== carouselHeight[ 0 ] ) ? carouselHeight[ 0 ] : '' )}
																		onChange={value => setAttributes( { carouselHeight: [ value, ( ( undefined !== carouselHeight && undefined !== carouselHeight[ 1 ] ) ? carouselHeight[ 1 ] : '' ), ( ( undefined !== carouselHeight && undefined !== carouselHeight[ 2 ] ) ? carouselHeight[ 2 ] : '' ) ] } )}
																		step={1}
																		min={120}
																		max={800}
																	/>
																</div>
															);
														}
													}
												}
											}
										</TabPanel>
										{type === 'fluidcarousel' && (
											<ToggleControl
												label={__( 'Carousel Center Mode', 'kadence-blocks' )}
												checked={carouselAlign}
												onChange={( value ) => setAttributes( { carouselAlign: value } )}
											/>
										)}
									</>
								)}
								{ids && undefined !== ids[ 0 ] && !dynamicSource && (
									<ImageSizeControl
										label={__( 'Thumbnail Image Size', 'kadence-blocks' )}
										slug={thumbSize}
										id={ids[ 0 ]}
										fullSelection={true}
										selectByValue={false}
										onChange={() => changeImageThumbSize}
									/>
								)}
							</KadencePanelBody>
							{type && ( type === 'carousel' || type === 'fluidcarousel' || type === 'slider' || type === 'thumbslider' ) && (
								<>
									{showSettings( 'carouselSettings', 'kadence/advancedgallery' ) && (
										<KadencePanelBody
											title={__( 'Carousel Settings', 'kadence-blocks' )}
											initialOpen={false}
											panelName={'kb-gallery-carousel-settings'}
										>
											<ToggleControl
												label={__( 'Carousel Auto Play', 'kadence-blocks' )}
												checked={autoPlay}
												onChange={( value ) => setAttributes( { autoPlay: value } )}
											/>
											{autoPlay && (
												<RangeControl
													label={__( 'Autoplay Speed', 'kadence-blocks' )}
													value={autoSpeed}
													onChange={( value ) => setAttributes( { autoSpeed: value } )}
													min={500}
													max={15000}
													step={10}
												/>
											)}
											<RangeControl
												label={__( 'Carousel Slide Transition Speed', 'kadence-blocks' )}
												value={transSpeed}
												onChange={( value ) => setAttributes( { transSpeed: value } )}
												min={100}
												max={2000}
												step={10}
											/>
											{type === 'carousel' && (
												<SelectControl
													label={__( 'Slides to Scroll', 'kadence-blocks' )}
													options={[
														{
															label: __( 'One' ),
															value: '1',
														},
														{
															label: __( 'All' ),
															value: 'all',
														},
													]}
													value={slidesScroll}
													onChange={( value ) => setAttributes( { slidesScroll: value } )}
												/>
											)}
											<SelectControl
												label={__( 'Arrow Style', 'kadence-blocks' )}
												options={[
													{
														label: __( 'White on Dark', 'kadence-blocks' ),
														value: 'whiteondark',
													},
													{
														label: __( 'Black on Light', 'kadence-blocks' ),
														value: 'blackonlight',
													},
													{
														label: __( 'Outline Black', 'kadence-blocks' ),
														value: 'outlineblack',
													},
													{
														label: __( 'Outline White', 'kadence-blocks' ),
														value: 'outlinewhite',
													},
													{
														label: __( 'None', 'kadence-blocks' ),
														value: 'none',
													},
												]}
												value={arrowStyle}
												onChange={( value ) => setAttributes( { arrowStyle: value } )}
											/>
											{type !== 'thumbslider' && (
												<SelectControl
													label={__( 'Dot Style', 'kadence-blocks' )}
													options={[
														{
															label: __( 'Dark', 'kadence-blocks' ),
															value: 'dark',
														},
														{
															label: __( 'Light', 'kadence-blocks' ),
															value: 'light',
														},
														{
															label: __( 'Outline Dark', 'kadence-blocks' ),
															value: 'outlinedark',
														},
														{
															label: __( 'Outline Light', 'kadence-blocks' ),
															value: 'outlinelight',
														},
														{
															label: __( 'Saturation', 'kadence-blocks' ),
															value: 'saturation',
														},
													]}
													value={dotStyle}
													onChange={( value ) => setAttributes( { dotStyle: value } )}
												/>
											)}
										</KadencePanelBody>
									)}
								</>
							)}
							<KadencePanelBody
								title={__( 'Link Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={'kb-gallery-link-settings'}
							>
								<SelectControl
									label={__( 'Link To', 'kadence-blocks' )}
									value={linkTo}
									onChange={( value ) => setAttributes( { linkTo: value } )}
									options={linkOptions}
								/>
								{linkTo === 'custom' && dynamicSource && (
									<DynamicLinkControl dynamicAttribute="link" {...props}/>
								)}
								{linkTo === 'media' && (
									<>
										{ids && undefined !== ids[ 0 ] && !dynamicSource && (
											<ImageSizeControl
												label={__( 'Link Image Size', 'kadence-blocks' )}
												slug={lightSize}
												id={ids[ 0 ]}
												fullSelection={true}
												selectByValue={false}
												onChange={() => changeImageLightSize() }
											/>
										)}
										{showSettings( 'lightboxSettings', 'kadence/advancedgallery' ) && (
											<>
												<SelectControl
													label={__( 'Link Triggers?', 'kadence-blocks' )}
													value={lightbox}
													onChange={( value ) => setAttributes( { lightbox: value } )}
													options={[
														{
															label: __( 'None', 'kadence-blocks' ),
															value: 'none',
														},
														{
															label: __( 'Lightbox', 'kadence-blocks' ),
															value: 'magnific',
														},
														{
															label: __( 'New Tab', 'kadence-blocks' ),
															value: 'new_tab',
														},
													]}
												/>
												{lightbox && lightbox === 'magnific' && (
													<ToggleControl
														label={__( 'Show Caption in Lightbox', 'kadence-blocks' )}
														checked={lightboxCaption}
														onChange={( value ) => setAttributes( { lightboxCaption: value } )}
													/>
												)}
											</>
										)}
									</>
								)}
							</KadencePanelBody>
							{showSettings( 'captionSettings', 'kadence/advancedgallery' ) && (
								<KadencePanelBody
									title={__( 'Caption Settings', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-gallery-caption-settings'}
								>
									<ToggleControl
										label={__( 'Show Captions', 'kadence-blocks' )}
										checked={showCaption}
										onChange={() => setCaptions()}
									/>
									{showCaption && (
										<>
											<SelectControl
												label={__( 'Caption Placement', 'kadence-blocks' )}
												options={[
													{
														label: __( 'Bottom of Image - Show on Hover', 'kadence-blocks' ),
														value: 'bottom-hover',
													},
													{
														label: __( 'Bottom of Image - Show always', 'kadence-blocks' ),
														value: 'bottom',
													},
													{
														label: __( 'Below Image - Show always', 'kadence-blocks' ),
														value: 'below',
													},
													{
														label: __( 'Cover Image - Show on Hover', 'kadence-blocks' ),
														value: 'cover-hover',
													},
												]}
												value={captionStyle}
												onChange={( value ) => setAttributes( { captionStyle: value } )}
											/>
											{( 'cover-hover' === captionStyle || 'bottom-hover' === captionStyle ) && (
												<ToggleControl
													label={__( 'Force hover effect always for mobile', 'kadence-blocks' )}
													checked={mobileForceHover}
													onChange={value => setAttributes( { mobileForceHover: value } )}
												/>
											)}
											<PopColorControl
												label={__( 'Caption Color', 'kadence-blocks' )}
												value={( captionStyles && captionStyles[ 0 ] && captionStyles[ 0 ].color ? captionStyles[ 0 ].color : '' )}
												default={''}
												onChange={value => saveCaptionFont( { color: value } )}
											/>
											<PopColorControl
												label={__( 'Caption Background', 'kadence-blocks' )}
												value={( captionStyles && captionStyles[ 0 ] && captionStyles[ 0 ].background ? captionStyles[ 0 ].background : '' )}
												default={'#000000'}
												onChange={value => saveCaptionFont( { background: value } )}
												opacityValue={( captionStyles && captionStyles[ 0 ] && undefined !== captionStyles[ 0 ].backgroundOpacity ? captionStyles[ 0 ].backgroundOpacity : 0.5 )}
												onOpacityChange={value => saveCaptionFont( { backgroundOpacity: value } )}
											/>
											<TypographyControls
												fontSize={captionStyles[ 0 ].size}
												onFontSize={( value ) => saveCaptionFont( { size: value } )}
												fontSizeType={captionStyles[ 0 ].sizeType}
												onFontSizeType={( value ) => saveCaptionFont( { sizeType: value } )}
												lineHeight={captionStyles[ 0 ].lineHeight}
												onLineHeight={( value ) => saveCaptionFont( { lineHeight: value } )}
												lineHeightType={captionStyles[ 0 ].lineType}
												onLineHeightType={( value ) => saveCaptionFont( { lineType: value } )}
												letterSpacing={captionStyles[ 0 ].letterSpacing}
												onLetterSpacing={( value ) => saveCaptionFont( { letterSpacing: value } )}
												textTransform={captionStyles[ 0 ].textTransform}
												onTextTransform={( value ) => saveCaptionFont( { textTransform: value } )}
												fontFamily={captionStyles[ 0 ].family}
												onFontFamily={( value ) => saveCaptionFont( { family: value } )}
												onFontChange={( select ) => {
													saveCaptionFont( {
														family: select.value,
														google: select.google,
													} );
												}}
												onFontArrayChange={( values ) => saveCaptionFont( values )}
												googleFont={captionStyles[ 0 ].google}
												onGoogleFont={( value ) => saveCaptionFont( { google: value } )}
												loadGoogleFont={captionStyles[ 0 ].loadGoogle}
												onLoadGoogleFont={( value ) => saveCaptionFont( { loadGoogle: value } )}
												fontVariant={captionStyles[ 0 ].variant}
												onFontVariant={( value ) => saveCaptionFont( { variant: value } )}
												fontWeight={captionStyles[ 0 ].weight}
												onFontWeight={( value ) => saveCaptionFont( { weight: value } )}
												fontStyle={captionStyles[ 0 ].style}
												onFontStyle={( value ) => saveCaptionFont( { style: value } )}
												fontSubset={captionStyles[ 0 ].subset}
												onFontSubset={( value ) => saveCaptionFont( { subset: value } )}
											/>
										</>
									)}
								</KadencePanelBody>
							)}

						</>
					}

					{( activeTab === 'style' ) &&

						<>
							{showSettings( 'styleSettings', 'kadence/advancedgallery' ) && (
								<KadencePanelBody
									title={__( 'Image Style', 'kadence-blocks' )}
									panelName={'kb-gallery-image-style'}
								>
									{!( type === 'carousel' && imageRatio === 'inherit' ) && !( type === 'slider' && imageRatio === 'inherit' ) && (
										<MeasurementControls
											label={__( 'Border Radius', 'kadence-blocks' )}
											measurement={imageRadius}
											control={radiusControl}
											onChange={( value ) => setAttributes( { imageRadius: value } )}
											onControl={( value ) => setRadiusControl( value )}
											min={0}
											max={200}
											step={1}
											controlTypes={[
												{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: radiusLinkedIcon },
												{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: radiusIndividualIcon },
											]}
											firstIcon={topLeftIcon}
											secondIcon={topRightIcon}
											thirdIcon={bottomRightIcon}
											fourthIcon={bottomLeftIcon}
										/>
									)}
									<SelectControl
										label={__( 'Image Filter', 'kadence-blocks' )}
										help={__( 'Not supported in Internet Explorer', 'kadence-blocks' )}
										options={[
											{
												label: __( 'None', 'kadence-blocks' ),
												value: 'none',
											},
											{
												label: __( 'Grayscale', 'kadence-blocks' ),
												value: 'grayscale',
											},
											{
												label: __( 'Sepia', 'kadence-blocks' ),
												value: 'sepia',
											},
											{
												label: __( 'Saturation', 'kadence-blocks' ),
												value: 'saturation',
											},
											{
												label: __( 'Vintage', 'kadence-blocks' ),
												value: 'vintage',
											},
											{
												label: __( 'Earlybird', 'kadence-blocks' ),
												value: 'earlybird',
											},
											{
												label: __( 'Toaster', 'kadence-blocks' ),
												value: 'toaster',
											},
											{
												label: __( 'Mayfair', 'kadence-blocks' ),
												value: 'mayfair',
											},
										]}
										value={imageFilter}
										onChange={( value ) => setAttributes( { imageFilter: value } )}
									/>
								</KadencePanelBody>
							)}
							{showSettings( 'shadowSettings', 'kadence/advancedgallery' ) && (
								<KadencePanelBody
									title={__( 'Image Shadow', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-gallery-image-shadow'}
								>
									<ToggleControl
										label={__( 'Enable Shadow', 'kadence-blocks' )}
										checked={displayShadow}
										onChange={value => setAttributes( { displayShadow: value } )}
									/>
									{displayShadow && (
										<TabPanel className="kt-inspect-tabs kt-hover-tabs"
												  activeClass="active-tab"
												  tabs={[
													  {
														  name     : 'normal',
														  title    : __( 'Normal' ),
														  className: 'kt-normal-tab',
													  },
													  {
														  name     : 'hover',
														  title    : __( 'Hover' ),
														  className: 'kt-hover-tab',
													  },
												  ]}>
											{
												( tab ) => {
													let tabout;
													if ( tab.name ) {
														if ( 'hover' === tab.name ) {
															tabout = (
																<>
																	<PopColorControl
																		label={__( 'Shadow Color', 'kadence-blocks' )}
																		value={( shadowHover[ 0 ].color ? shadowHover[ 0 ].color : '' )}
																		default={''}
																		onChange={value => saveShadowHover( { color: value } )}
																		opacityValue={shadowHover[ 0 ].opacity}
																		onOpacityChange={value => saveShadowHover( { opacity: value } )}
																	/>
																	<RangeControl
																		label={__( 'Shadow Blur', 'kadence-blocks' )}
																		value={shadowHover[ 0 ].blur}
																		onChange={value => saveShadowHover( { blur: value } )}
																		min={0}
																		max={100}
																		step={1}
																	/>
																	<RangeControl
																		label={__( 'Shadow Spread', 'kadence-blocks' )}
																		value={shadowHover[ 0 ].spread}
																		onChange={value => saveShadowHover( { spread: value } )}
																		min={-100}
																		max={100}
																		step={1}
																	/>
																	<RangeControl
																		label={__( 'Shadow Vertical Offset', 'kadence-blocks' )}
																		value={shadowHover[ 0 ].vOffset}
																		onChange={value => saveShadowHover( { vOffset: value } )}
																		min={-100}
																		max={100}
																		step={1}
																	/>
																	<RangeControl
																		label={__( 'Shadow Horizontal Offset', 'kadence-blocks' )}
																		value={shadowHover[ 0 ].hOffset}
																		onChange={value => saveShadowHover( { hOffset: value } )}
																		min={-100}
																		max={100}
																		step={1}
																	/>
																</>
															);
														} else {
															tabout = (
																<>
																	<PopColorControl
																		label={__( 'Shadow Color', 'kadence-blocks' )}
																		value={( shadow[ 0 ].color ? shadow[ 0 ].color : '' )}
																		default={''}
																		onChange={value => saveShadow( { color: value } )}
																		opacityValue={shadow[ 0 ].opacity}
																		onOpacityChange={value => saveShadow( { opacity: value } )}
																	/>
																	<RangeControl
																		label={__( 'Shadow Blur', 'kadence-blocks' )}
																		value={shadow[ 0 ].blur}
																		onChange={value => saveShadow( { blur: value } )}
																		min={0}
																		max={100}
																		step={1}
																	/>
																	<RangeControl
																		label={__( 'Shadow Spread', 'kadence-blocks' )}
																		value={shadow[ 0 ].spread}
																		onChange={value => saveShadow( { spread: value } )}
																		min={-100}
																		max={100}
																		step={1}
																	/>
																	<RangeControl
																		label={__( 'Shadow Vertical Offset', 'kadence-blocks' )}
																		value={shadow[ 0 ].vOffset}
																		onChange={value => saveShadow( { vOffset: value } )}
																		min={-100}
																		max={100}
																		step={1}
																	/>
																	<RangeControl
																		label={__( 'Shadow Horizontal Offset', 'kadence-blocks' )}
																		value={shadow[ 0 ].hOffset}
																		onChange={value => saveShadow( { hOffset: value } )}
																		min={-100}
																		max={100}
																		step={1}
																	/>
																</>
															);
														}
													}
													return <div className={tab.className} key={tab.className}>{tabout}</div>;
												}
											}
										</TabPanel>
									)}
								</KadencePanelBody>
							)}
							{showSettings( 'spacingSettings', 'kadence/advancedgallery' ) && (
								<KadencePanelBody
									title={__( 'Gallery Spacing', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-gallery-spacing'}
								>
									<ButtonGroup className="kt-size-type-options kt-row-size-type-options" aria-label={__( 'Margin Type', 'kadence-blocks' )}>
										{map( marginTypes, ( { name, key } ) => (
											<Button
												key={key}
												className="kt-size-btn"
												isSmall
												isPrimary={marginUnit === key}
												aria-pressed={marginUnit === key}
												onClick={() => setAttributes( { marginUnit: key } )}
											>
												{name}
											</Button>
										) )}
									</ButtonGroup>
									<h2 className="kt-heading-size-title">{__( 'Margin', 'kadence-blocks' )}</h2>
									<TabPanel className="kt-size-tabs"
											  activeClass="active-tab"
											  tabs={[
												  {
													  name     : 'desk',
													  title    : <Dashicon icon="desktop"/>,
													  className: 'kt-desk-tab',
												  },
												  {
													  name     : 'tablet',
													  title    : <Dashicon icon="tablet"/>,
													  className: 'kt-tablet-tab',
												  },
												  {
													  name     : 'mobile',
													  title    : <Dashicon icon="smartphone"/>,
													  className: 'kt-mobile-tab',
												  },
											  ]}>
										{
											( tab ) => {
												let tabout;
												if ( tab.name ) {
													if ( 'mobile' === tab.name ) {
														tabout = (
															<MeasurementControls
																label={__( 'Mobile Margin', 'kadence-blocks' )}
																measurement={margin[ 0 ].mobile}
																control={marginMobileControl}
																onChange={( value ) => saveMargin( { mobile: value } )}
																onControl={( value ) => setMarginMobileControl( value )}
																min={marginMin}
																max={marginMax}
																step={marginStep}
															/>
														);
													} else if ( 'tablet' === tab.name ) {
														tabout = (
															<MeasurementControls
																label={__( 'Tablet Margin', 'kadence-blocks' )}
																measurement={margin[ 0 ].tablet}
																control={marginTabletControl}
																onChange={( value ) => saveMargin( { tablet: value } )}
																onControl={( value ) => setMarginTabletControl( value )}
																min={marginMin}
																max={marginMax}
																step={marginStep}
															/>
														);
													} else {
														tabout = (
															<MeasurementControls
																label={__( 'Margin', 'kadence-blocks' )}
																measurement={margin[ 0 ].desk}
																control={marginDeskControl}
																onChange={( value ) => saveMargin( { desk: value } )}
																onControl={( value ) => setMarginDeskControl( value )}
																min={marginMin}
																max={marginMax}
																step={marginStep}
															/>
														);
													}
												}
												return <div className={tab.className} key={tab.className}>{tabout}</div>;
											}
										}
									</TabPanel>
								</KadencePanelBody>
							)}
						</>
					}

					{( activeTab === 'advanced' ) && (

						<KadenceBlockDefaults attributes={attributes} defaultAttributes={metadata['attributes']} blockSlug={ 'kadence/advancedgallery' } excludedAttrs={ [ 'images', 'imagesDynamic' ] } />

					)}

					</InspectorControls>
			)}
		</>
	);
	let instructions = '';
	let title = '';
	if ( !hasImages ) {
		title = __( 'Gallery', 'kadence-blocks' );
		instructions = __( 'Drag images, upload new ones or select files from your library.', 'kadence-blocks' );
	}
	const dynamicMediaPlaceholder = (
		<Placeholder
			label={__( 'Gallery', 'kadence-blocks' )}
			instructions={__( 'Dynamic source failed to load array of images.', 'kadence-blocks' )}
		>
			{( kadence_blocks_params.dynamic_enabled ? <DynamicGalleryControl dynamicAttribute="images" {...props}/> : undefined )}
		</Placeholder>
	);
	const mediaPlaceholder = (
		<KadenceMediaPlaceholder
			labels={{
				title       : title,
				instructions: instructions,
			}}
			selectIcon={plusCircleFilled}
			selectLabel={__( 'Select Images', 'kadence-blocks' )}
			onSelect={ ( imgs ) => onSelectImages( imgs, 4 ) }
			accept="image/*"
			multiple
			className={'kadence-image-upload'}
			allowedTypes={ALLOWED_MEDIA_TYPES}
			dynamicControl={( kadence_blocks_params.dynamic_enabled ? <DynamicGalleryControl dynamicAttribute="images" {...props}/> : undefined )}
		/>
	);

	const addIcon = <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path fill="none" d="M0 0h24v24H0V0z"/>
		<g>
			<path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
		</g>
	</svg>;

	const addMediaPlaceholder = (
		<MediaPlaceholder
			addToGallery={hasImages}
			isAppender={hasImages}
			className={className}
			dropZoneUIOnly={hasImages && !isSelected}
			icon={!hasImages && <BlockIcon icon={addIcon}/>}
			labels={{
				title       : !hasImages && __( 'Gallery', 'kadence-blocks' ),
				instructions: !hasImages && __( 'Drag images, upload new ones or select files from your library.', 'kadence-blocks' ),
			}}
			onSelect={( imgs ) => onSelectImages( imgs, 5 ) }
			accept="image/*"
			allowedTypes={ALLOWED_MEDIA_TYPES}
			multiple
			value={hasImages ? images : undefined}
			onError={() => onUploadError}
			notices={hasImages ? undefined : noticeUI}
		/>
	);
	const buildCSS = (
		<style>
			{`
					.wp-block[data-type="kadence/advancedgallery"]  ul.kb-gallery-main-contain.kb-gallery-id-${uniqueID} {
						${( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'margin: -' + ( gutter[ 0 ] / 2 ) + 'px;' : '' )}
					}
					.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item {
						${( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'padding:' + ( gutter[ 0 ] / 2 ) + 'px;' : '' )}
					}
					.kb-gallery-main-contain.kb-gallery-type-carousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .slick-slider,
					.kb-gallery-main-contain.kb-gallery-type-thumbslider.kb-gallery-id-${uniqueID} .kt-blocks-carousel-thumbnails.slick-slider {
						${( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'margin: 0 -' + ( gutter[ 0 ] / 2 ) + 'px;' : '' )}
					}
					.kb-gallery-main-contain.kb-gallery-type-carousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .slick-slider .slick-slide,
					.kb-gallery-main-contain.kb-gallery-type-fluidcarousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .slick-slider .slick-slide,
					.kb-gallery-main-contain.kb-gallery-type-thumbslider.kb-gallery-id-${uniqueID} .kt-blocks-carousel-thumbnails.slick-slider .slick-slide {
						${( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'padding: 4px ' + ( gutter[ 0 ] / 2 ) + 'px;' : '' )}
					}
					.kb-gallery-main-contain.kb-gallery-type-fluidcarousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel.kb-carousel-mode-align-left .slick-slider .slick-slide {
						${( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'padding: 4px ' + ( gutter[ 0 ] ) + 'px 4px 0;' : '' )}
					}
					.kb-gallery-main-contain.kb-gallery-type-carousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .slick-prev,
					.kb-gallery-main-contain.kb-gallery-type-thumbslider.kb-gallery-id-${uniqueID} .kt-blocks-carousel-thumbnails .slick-prev {
						${( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'left:' + ( gutter[ 0 ] / 2 ) + 'px;' : '' )}
					}
					.kb-gallery-main-contain.kb-gallery-type-carousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .slick-next,
					.kb-gallery-main-contain.kb-gallery-type-thumbslider.kb-gallery-id-${uniqueID} .kt-blocks-carousel-thumbnails .slick-next {
						${( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'right:' + ( gutter[ 0 ] / 2 ) + 'px;' : '' )}
					}
					${( captionStyles && undefined !== captionStyles[ 0 ] && undefined !== captionStyles[ 0 ].background ? `.kb-gallery-id-${uniqueID}.kb-gallery-main-contain .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner figcaption { background: linear-gradient( 0deg, ` + KadenceColorOutput( ( captionStyles[ 0 ].background ? captionStyles[ 0 ].background : '#000000' ), ( '' !== captionStyles[ 0 ].backgroundOpacity ? captionStyles[ 0 ].backgroundOpacity : 0.5 ) ) + ' 0, ' + KadenceColorOutput( ( captionStyles[ 0 ].background ? captionStyles[ 0 ].background : '#000000' ), 0 ) + ' 100% );}' : '' )}
					${( captionStyles && undefined !== captionStyles[ 0 ] && undefined !== captionStyles[ 0 ].background ? `.kb-gallery-id-${uniqueID}.kb-gallery-caption-style-cover-hover.kb-gallery-main-contain .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner figcaption, .kb-gallery-id-${uniqueID}.kb-gallery-caption-style-below.kb-gallery-main-contain .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner figcaption { background:` + KadenceColorOutput( ( captionStyles[ 0 ].background ? captionStyles[ 0 ].background : '#000000' ), ( '' !== captionStyles[ 0 ].backgroundOpacity ? captionStyles[ 0 ].backgroundOpacity : 0.5 ) ) + ';}' : '' )}
					${( captionStyles && undefined !== captionStyles[ 0 ] && undefined !== captionStyles[ 0 ].color ? `.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner figcaption { color:` + KadenceColorOutput( captionStyles[ 0 ].color ) + ';}' : '' )}
					.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item .kb-gal-image-radius { box-shadow:${( displayShadow ? shadow[ 0 ].hOffset + 'px ' + shadow[ 0 ].vOffset + 'px ' + shadow[ 0 ].blur + 'px ' + shadow[ 0 ].spread + 'px ' + KadenceColorOutput( shadow[ 0 ].color, shadow[ 0 ].opacity ) : 'none' )}; }
					.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item:hover .kb-gal-image-radius { box-shadow:${( displayShadow ? shadowHover[ 0 ].hOffset + 'px ' + shadowHover[ 0 ].vOffset + 'px ' + shadowHover[ 0 ].blur + 'px ' + shadowHover[ 0 ].spread + 'px ' + KadenceColorOutput( shadowHover[ 0 ].color, shadowHover[ 0 ].opacity ) : 'none' )}; }
					.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item .kb-gal-image-radius {
						${( imageRadius && undefined !== imageRadius[ 0 ] && '' !== imageRadius[ 0 ] ? 'border-radius:' + imageRadius[ 0 ] + 'px ' + imageRadius[ 1 ] + 'px ' + imageRadius[ 2 ] + 'px ' + imageRadius[ 3 ] + 'px;' : '' )}
					}
					.kb-gallery-main-contain.kb-gallery-type-fluidcarousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .slick-list figure .kb-gal-image-radius, .kb-gallery-main-contain.kb-gallery-type-fluidcarousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .slick-list figure .kb-gal-image-radius img {
						${( carouselHeight && undefined !== carouselHeight[ 0 ] && '' !== carouselHeight[ 0 ] ? 'height:' + carouselHeight[ 0 ] + 'px;' : '' )}
					}
					.wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-${uniqueID} > .kadence-blocks-gallery-item, .wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img {
						${( carouselHeight && undefined !== carouselHeight[ 0 ] && '' !== carouselHeight[ 0 ] ? 'height:' + carouselHeight[ 0 ] + 'px;' : '' )}
					}
			`}
		</style>
	);
	if ( !hasImages || theImages.constructor !== Array ) {
		return (
			<>
				{controls}
				{sidebarControls}
				{theImages.constructor !== Array && dynamicSource ? dynamicMediaPlaceholder : mediaPlaceholder}
			</>
		);
	}
	const galleryClassNames = classnames(
		'kb-gallery-main-contain',
		{
			[ `kb-gallery-type-${type}` ]                 : type,
			[ `kb-gallery-id-${uniqueID}` ]               : uniqueID,
			[ `kb-gallery-caption-style-${captionStyle}` ]: captionStyle,
			[ `kb-gallery-filter-${imageFilter}` ]        : imageFilter,
		},
	);
	const renderGalleryImages = ( img, index, thumbnail = false ) => {
		const ariaLabel = sprintf(
			/* translators: %1$d is the order number of the image, %2$d is the total number of images. */
			__( 'image %1$d of %2$d in gallery', 'kadence-blocks' ),
			( index + 1 ),
			theImages.length,
		);
		const ratio = ( thumbnail ? thumbnailRatio : imageRatio );
		return (
			<li className="kadence-blocks-gallery-item" key={img.id || img.url}>
				<div className="kadence-blocks-gallery-item-inner">
					<GalleryImage
						thumbUrl={img.thumbUrl}
						url={img.url}
						width={img.width}
						height={img.height}
						lightUrl={img.lightUrl}
						alt={img.alt}
						id={img.id}
						index={index}
						link={img.link}
						linkTo={linkTo}
						isFirstItem={index === 0}
						isLastItem={( index + 1 ) === theImages.length}
						isSelected={isSelected && selectedImage === index}
						onMoveBackward={() => { onMoveBackward( index ) } }
						onMoveForward={() => { onMoveForward( index ) } }
						onRemove={() => { onRemoveImage( index ) } }
						onSelect={( index ) => { onSelectImage( index ) }}
						setAttributes={( attrs ) => { setImageAttributes( index, attrs ) } }
						caption={img.caption}
						customLink={img.customLink}
						linkTarget={img.linkTarget}
						linkSponsored={img.linkSponsored}
						setLinkAttributes={( attrs ) => { setLinkAttributes( index, attrs ) } }
						showCaption={showCaption}
						captionStyles={captionStyles}
						captionStyle={captionStyle}
						aria-label={ariaLabel}
						imageRatio={ratio}
						type={type}
						thumbnail={thumbnail}
						dynamicSource={dynamicSource}
					/>
				</div>
			</li>
		);
	};

	return (
		<div {...blockProps} >
			{buildCSS}
			{controls}
			{sidebarControls}
			{noticeUI}
			{showCaption && captionStyles[ 0 ].google && (
				<WebfontLoader config={config}>
				</WebfontLoader>
			)}
			{type && type === 'fluidcarousel' && (
				<div id={`kb-gallery-id-${uniqueID}`} className={galleryClassNames}>
					<div className={`kt-blocks-carousel kt-blocks-fluid-carousel kt-carousel-container-dotstyle-${dotStyle}${( carouselAlign === false ? ' kb-carousel-mode-align-left' : '' )}`}>
						{theImages.length !== 1 && (
							<Slider className={`kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`} {...fluidCarouselSettings}>
								{theImages.map( ( img, index ) => {
									return renderGalleryImages( img, index );
								} )}
							</Slider>
						)}
						{theImages.length === 1 && (
							theImages.map( ( img, index ) => {
								return renderGalleryImages( img, index );
							} )
						)}
					</div>
				</div>
			)}
			{type && type === 'slider' && (
				<div className={galleryClassNames}>
					<div className={`kt-blocks-carousel kt-blocks-slider kt-carousel-container-dotstyle-${dotStyle}`}>
						{theImages.length !== 1 && (
							<Slider className={`kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`} {...sliderSettings}>
								{theImages.map( ( img, index ) => {
									return renderGalleryImages( img, index );
								} )}
							</Slider>
						)}
						{theImages.length === 1 && (
							theImages.map( ( img, index ) => {
								return renderGalleryImages( img, index );
							} )
						)}
					</div>
				</div>
			)}
			{type && type === 'thumbslider' && (
				<div className={galleryClassNames}>
					<div className={`kt-blocks-carousel kt-blocks-slider kt-carousel-container-dotstyle-${dotStyle}`}>
						{theImages.length !== 1 && (
							<>
								<Slider ref={ (slider) => setSliderSlides(slider)} asNavFor={sliderThumbs} className={`kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`} {...thumbsliderSettings}>
									{theImages.map( ( img, index ) => {
										return renderGalleryImages( img, index );
									} )}
								</Slider>
								<Slider
									className={`kt-carousel-arrowstyle-${arrowStyle} kt-blocks-carousel-thumbnails kb-cloned-${( theImages.length < thumbnailColumns[ 0 ] ? 'hide' : 'show' )} kt-carousel-dotstyle-none`}
									ref={ (slider) => setSliderThumbs(slider)}
									asNavFor={sliderSlides}
									{...thumbsliderthumbsSettings}>
									{theImages.map( ( img, index ) => {
										return renderGalleryImages( img, index, true );
									} )}
								</Slider>
							</>
						)}
						{theImages.length === 1 && (
							theImages.map( ( img, index ) => {
								return renderGalleryImages( img, index );
							} )
						)}
					</div>
				</div>
			)}
			{type && type === 'carousel' && (
				<div className={galleryClassNames}
					 data-columns-xxl={columns[ 0 ]}
					 data-columns-xl={columns[ 1 ]}
					 data-columns-lg={columns[ 2 ]}
					 data-columns-md={columns[ 3 ]}
					 data-columns-sm={columns[ 4 ]}
					 data-columns-xs={columns[ 5 ]}
				>
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						{theImages.length > columns[ 0 ] && (
							<Slider className={`kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`} {...carouselSettings}>
								{theImages.map( ( img, index ) => {
									return renderGalleryImages( img, index );
								} )}
							</Slider>
						)}
						{theImages.length <= columns[ 0 ] && (
							theImages.map( ( img, index ) => {
								return renderGalleryImages( img, index );
							} )
						)}
					</div>
				</div>
			)}
			{type && type === 'masonry' && (
				<Masonry
					className={galleryClassNames}
					elementType={'ul'}
					data-columns-xxl={columns[ 0 ]}
					data-columns-xl={columns[ 1 ]}
					data-columns-lg={columns[ 2 ]}
					data-columns-md={columns[ 3 ]}
					data-columns-sm={columns[ 4 ]}
					data-columns-xs={columns[ 5 ]}
					options={{
						transitionDuration: 0,
					}}
					disableImagesLoaded={false}
					enableResizableChildren={true}
					updateOnEachImageLoad={false}
				>
					{theImages.map( ( img, index ) => {
						return renderGalleryImages( img, index );
					} )}
				</Masonry>
			)}
			{type && type === 'grid' && (
				<ul
					className={galleryClassNames}
					data-columns-xxl={columns[ 0 ]}
					data-columns-xl={columns[ 1 ]}
					data-columns-lg={columns[ 2 ]}
					data-columns-md={columns[ 3 ]}
					data-columns-sm={columns[ 4 ]}
					data-columns-xs={columns[ 5 ]}
				>
					{theImages.map( ( img, index ) => {
						return renderGalleryImages( img, index );
					} )}
				</ul>
			)}
			{type && type === 'tiles' && (
				<ul
					className={galleryClassNames}
				>
					{theImages.map( ( img, index ) => {
						return renderGalleryImages( img, index );
					} )}
				</ul>
			)}
			{isSelected && !dynamicSource && (
				addMediaPlaceholder
			)}
		</div>
	);
}

export default compose( [
	withSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		const {
			__experimentalMediaUpload,
			mediaUpload,
		} = getSettings();

		return {
			mediaUpload: mediaUpload ? mediaUpload : __experimentalMediaUpload,
		};
	} ),
	withNotices,
] )( GalleryEdit );
