/**
 * External dependencies
 */
import classnames from 'classnames';
import { get, has, omit, pick, debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { compose } from '@wordpress/compose';
import { useSelect, withSelect } from '@wordpress/data';
import {
	BlockAlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';
import {
	withNotices
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { plusCircleFilled } from '@wordpress/icons';
import KadenceMediaPlaceholder from '../../components/common/kadence-media-placeholder';
import KadenceImageControl from '../../components/common/kadence-image-control';
import KadencePanelBody from '../../components/KadencePanelBody';
import itemicons from '../../icons';

/* global wp */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal dependencies
 */
import Image from './image';

/**
 * Module constants
 */
import {
	LINK_DESTINATION_ATTACHMENT,
	LINK_DESTINATION_CUSTOM,
	LINK_DESTINATION_MEDIA,
	LINK_DESTINATION_NONE,
	ALLOWED_MEDIA_TYPES,
} from './constants';

export const pickRelevantMediaFiles = ( image, size ) => {
	const imageProps = pick( image, [ 'alt', 'id', 'link', 'caption' ] );
	imageProps.url =
		get( image, [ 'sizes', size, 'url' ] ) ||
		get( image, [ 'media_details', 'sizes', size, 'source_url' ] ) ||
		image.url;
	return imageProps;
};

/**
 * Is the URL a temporary blob URL? A blob URL is one that is used temporarily
 * while the image is being uploaded and will not have an id yet allocated.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 *
 * @return {boolean} Is the URL a Blob URL
 */
const isTemporaryImage = ( id, url ) => ! id && isBlobURL( url );

/**
 * Is the url for the image hosted externally. An externally hosted image has no
 * id and is not a blob url.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 *
 * @return {boolean} Is the url an externally hosted url?
 */
export const isExternalImage = ( id, url ) => url && ! id && ! isBlobURL( url );

/**
 * Checks if WP generated default image size. Size generation is skipped
 * when the image is smaller than the said size.
 *
 * @param {Object} image
 * @param {string} defaultSize
 *
 * @return {boolean} Whether or not it has default image size.
 */
function hasDefaultSize( image, defaultSize ) {
	return (
		has( image, [ 'sizes', defaultSize, 'url' ] ) ||
		has( image, [ 'media_details', 'sizes', defaultSize, 'source_url' ] )
	);
}
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
 const ktimageUniqueIDs = [];

export function ImageEdit( {
	attributes,
	setAttributes,
	isSelected,
	className,
	noticeUI,
	insertBlocksAfter,
	noticeOperations,
	onReplace,
	context,
	clientId,
	getPreviewDevice,
} ) {
	const {
		url = '',
		alt,
		caption,
		align,
		id,
		width,
		height,
		uniqueID,
		sizeSlug,
		imageFilter,
		useRatio,
		imgMaxWidth,
		kadenceAnimation,
		kadenceAOSOptions,
	} = attributes;
	function getDynamic() {
		let contextPost = null;
		if ( context && context.queryId && context.postId ) {
			contextPost = context.postId;
		}
		if ( attributes.kadenceDynamic && attributes.kadenceDynamic['url'] && attributes.kadenceDynamic['url'].enable ) {
			applyFilters( 'kadence.dynamicImage', '', attributes, setAttributes, 'url', contextPost );
		}
	}
	useEffect( () => {
		if ( ! uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/image' ] !== undefined && typeof blockConfigObject[ 'kadence/image' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/image' ] ).map( ( attribute ) => {
					attributes[ attribute ] = blockConfigObject[ 'kadence/image' ][ attribute ];
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktimageUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( ktimageUniqueIDs.includes( uniqueID ) ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktimageUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			ktimageUniqueIDs.push( uniqueID );
		}
		if ( context && context.queryId && context.postId ) {
			if ( ! attributes.inQueryBlock ) {
				setAttributes( {
					inQueryBlock: true,
				} );
			}
		} else if ( attributes.inQueryBlock ) {
			setAttributes( {
				inQueryBlock: false,
			} );
		}
		const debouncedContent = debounce( () => {
			getDynamic();
		}, 200 );
		debouncedContent();
	}, [] );
	const [ temporaryURL, setTemporaryURL ] = useState();
	const altRef = useRef();
	useEffect( () => {
		altRef.current = alt;
	}, [ alt ] );

	const captionRef = useRef();
	useEffect( () => {
		captionRef.current = caption;
	}, [ caption ] );

	const ref = useRef();
	const { imageDefaultSize, mediaUpload } = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return pick( getSettings(), [ 'imageDefaultSize', 'mediaUpload' ] );
	}, [] );
	function onUploadError( message ) {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	function onSelectImage( media ) {
		if ( ! media || ! media.url ) {
			setAttributes( {
				url: undefined,
				alt: undefined,
				id: undefined,
				title: undefined,
				caption: undefined,
			} );

			return;
		}

		if ( isBlobURL( media.url ) ) {
			setTemporaryURL( media.url );
			return;
		}

		setTemporaryURL();

		let mediaAttributes = pickRelevantMediaFiles( media, imageDefaultSize );

		// If a caption text was meanwhile written by the user,
		// make sure the text is not overwritten by empty captions.
		if ( captionRef.current && ! get( mediaAttributes, [ 'caption' ] ) ) {
			mediaAttributes = omit( mediaAttributes, [ 'caption' ] );
		}

		let additionalAttributes;
		// Reset the dimension attributes if changing to a different image.
		if ( ! media.id || media.id !== id ) {
			additionalAttributes = {
				width: undefined,
				height: undefined,
				// Fallback to size "full" if there's no default image size.
				// It means the image is smaller, and the block will use a full-size URL.
				sizeSlug: hasDefaultSize( media, imageDefaultSize )
					? imageDefaultSize
					: 'full',
			};
		} else {
			// Keep the same url when selecting the same file, so "Image Size"
			// option is not changed.
			additionalAttributes = { url };
		}
		// Check if default link setting should be used.
		let linkDestination = attributes.linkDestination;
		if ( ! linkDestination ) {
			// Use the WordPress option to determine the proper default.
			// The constants used in Gutenberg do not match WP options so a little more complicated than ideal.
			// TODO: fix this in a follow up PR, requires updating media-text and ui component.
			switch (
				wp?.media?.view?.settings?.defaultProps?.link ||
				LINK_DESTINATION_NONE
			) {
				case 'file':
				case LINK_DESTINATION_MEDIA:
					linkDestination = LINK_DESTINATION_MEDIA;
					break;
				case 'post':
				case LINK_DESTINATION_ATTACHMENT:
					linkDestination = LINK_DESTINATION_ATTACHMENT;
					break;
				case LINK_DESTINATION_CUSTOM:
					linkDestination = LINK_DESTINATION_CUSTOM;
					break;
				case LINK_DESTINATION_NONE:
					linkDestination = LINK_DESTINATION_NONE;
					break;
			}
		}

		// Check if the image is linked to it's media.
		let href;
		switch ( linkDestination ) {
			case LINK_DESTINATION_MEDIA:
				href = media.url;
				break;
			case LINK_DESTINATION_ATTACHMENT:
				href = media.link;
				break;
		}
		mediaAttributes.link = href;

		setAttributes( {
			...mediaAttributes,
			...additionalAttributes,
			linkDestination,
		} );
	}

	function onSelectURL( newURL ) {
		if ( newURL !== url ) {
			setAttributes( {
				url: newURL,
				id: undefined,
				width: undefined,
				height: undefined,
				sizeSlug: imageDefaultSize,
			} );
		}
	}

	function updateAlignment( nextAlign ) {
		const extraUpdatedAttributes = [ 'wide', 'full' ].includes( nextAlign )
			? { width: undefined, height: undefined }
			: {};
		setAttributes( {
			...extraUpdatedAttributes,
			align: nextAlign,
		} );
	}

	let isTemp = isTemporaryImage( id, url );

	// Upload a temporary image on mount.
	useEffect( () => {
		if ( ! isTemp ) {
			return;
		}

		const file = getBlobByURL( url );

		if ( file ) {
			mediaUpload( {
				filesList: [ file ],
				onFileChange: ( [ img ] ) => {
					onSelectImage( img );
				},
				allowedTypes: ALLOWED_MEDIA_TYPES,
				onError: ( message ) => {
					isTemp = false;
					noticeOperations.createErrorNotice( message );
					setAttributes( {
						src: undefined,
						id: undefined,
						url: undefined,
					} );
				},
			} );
		}
	}, [] );

	// If an image is temporary, revoke the Blob url when it is uploaded (and is
	// no longer temporary).
	useEffect( () => {
		if ( isTemp ) {
			setTemporaryURL( url );
			return;
		}
		revokeBlobURL( temporaryURL );
	}, [ isTemp, url ] );

	const isExternal = isExternalImage( id, url );
	const src = isExternal ? url : undefined;
	const mediaPreview = !! url && (
		<img
			alt={ __( 'Edit image' ) }
			title={ __( 'Edit image' ) }
			className={ 'edit-image-preview' }
			src={ url }
		/>
	);

	const classes = classnames( className, {
		'is-transient': temporaryURL,
		'is-resized': !! width || !! height,
		'aos-animate': 'aos-animate',
		[ `size-${ sizeSlug }` ]: sizeSlug,
		[ `filter-${ imageFilter }` ]: imageFilter && imageFilter !== 'none',
		[ `kb-image-is-ratio-size` ]: useRatio,
		'image-is-svg': url && url.endsWith( '.svg' ),
	} );

	const blockProps = useBlockProps( {
		ref,
		className: classes,
	} );

	return (
		<figure data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) } data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) } data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) } { ...blockProps } style={{
			maxWidth: ( imgMaxWidth && ( align === 'left' || align === 'right' ) ) ? imgMaxWidth + 'px' : undefined,
		}}>
			{ ( temporaryURL || url ) && (
				<Image
					temporaryURL={ temporaryURL }
					previewDevice={ getPreviewDevice }
					attributes={ attributes }
					setAttributes={ setAttributes }
					isSelected={ isSelected }
					insertBlocksAfter={ insertBlocksAfter }
					onReplace={ onReplace }
					onSelectImage={ onSelectImage }
					onSelectURL={ onSelectURL }
					onUploadError={ onUploadError }
					containerRef={ ref }
					context={ context }
					clientId={ clientId }
				/>
			) }
			{ ! url && (
				<>
					<BlockControls group="block">
						<BlockAlignmentControl
							value={ align }
							onChange={ updateAlignment }
						/>
					</BlockControls>
					<InspectorControls>
						<KadencePanelBody
							title={ __( 'Image settings', 'kadence-blocks' ) }
							initialOpen={ true }
							panelName={ 'kb-image-settings-edit' }
						>
							<KadenceImageControl
								label={ __( 'Image', 'kadence-blocks' ) }
								hasImage={ ( url ? true : false ) }
								imageURL={ ( url ? url : '' ) }
								imageID={ id ? id : '' }
								onRemoveImage={ () => {
									setAttributes( {
										url: undefined,
										width: undefined,
										height: undefined,
										sizeSlug: undefined,
									} );
								} }
								onSaveImage={ onSelectImage }
								disableMediaButtons={ ( url ? true : false ) }
								dynamicAttribute="url"
								isSelected={ isSelected }
								attributes={ attributes }
								setAttributes={ setAttributes }
								name={ 'kadence/image' }
								clientId={ clientId }
							/>
						</KadencePanelBody>
					</InspectorControls>
				</>
			) }
			<KadenceMediaPlaceholder
				labels={ { 'title': __( 'Advanced Image', 'kadence-blocks' ) } }
				icon={ itemicons.image }
				selectIcon={ plusCircleFilled }
				selectLabel={ __( 'Select Image', 'kadence-blocks' ) }
				onSelect={ onSelectImage }
				onSelectURL={ onSelectURL }
				accept="image/*"
				notices={ noticeUI }
				onError={ onUploadError }
				className={ 'kadence-image-upload' }
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				mediaPreview={ mediaPreview }
				disableMediaButtons={ temporaryURL || url }
			/>
		</figure>
	);
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
	withNotices,
] )( ImageEdit );
