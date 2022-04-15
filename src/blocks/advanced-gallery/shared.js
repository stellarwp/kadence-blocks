/**
 * External dependencies
 */
import get from 'lodash/get';
import pick from 'lodash/pick';

export const getRelevantMediaFiles = async ( images, lightSize, thumbSize, oldImages = '' ) => {
	return await Promise.all(
		images.map( async ( image ) => {
			let old_link = '';
			let old_link_target = '';
			let old_link_sponsored = '';
			let theImage = await wp.data.select( 'core' ).getMedia( image.id );
			if ( ! theImage ) {
				theImage = image;
			}
			const imageProps = pick( theImage, [ 'id', 'link' ] );
			imageProps.alt = get( theImage, [ 'alt_text' ] ) || get( theImage, [ 'alt' ] ) || undefined;
			imageProps.caption = get( theImage, [ 'caption', 'raw' ] ) || get( theImage, [ 'caption' ] ) || undefined;
			imageProps.url = theImage.source_url || image.url;
			if ( image.id && typeof oldImages === 'object' && oldImages !== null ) {
				for ( let k in oldImages ) {
					if ( parseInt( oldImages[ k ].id ) === image.id ) {
						if ( oldImages[ k ].customLink ) {
							old_link = oldImages[ k ].customLink;
						}
						if ( oldImages[ k ].linkTarget ) {
							old_link_target = oldImages[ k ].linkTarget;
						}
						if ( oldImages[ k ].linkTarget ) {
							old_link_sponsored = oldImages[ k ].linkSponsored;
						}
					}
				}
			}
			imageProps.customLink = image.customLink || old_link;
			imageProps.linkTarget = image.linkTarget || old_link_target;
			imageProps.linkSponsored = image.linkSponsored || old_link_sponsored;
			imageProps.thumbUrl = get( theImage, [ 'media_details', 'sizes', thumbSize, 'source_url' ] ) || get( theImage, [ 'sizes', thumbSize, 'url' ] ) || theImage.source_url || image.url;
			imageProps.lightUrl = get( theImage, [ 'media_details', 'sizes', lightSize, 'source_url' ] ) || get( theImage, [ 'sizes', lightSize, 'url' ] ) || theImage.source_url || image.url;
			imageProps.width = get( theImage, [ 'media_details', 'sizes', thumbSize, 'width' ] ) || get( theImage, [ 'sizes', thumbSize, 'width' ] ) || get( theImage, [ 'media_details', 'width' ] ) || get( theImage, [ 'sizes', 'full', 'width' ] )  || undefined;
			imageProps.height = get( theImage, [ 'media_details', 'sizes', thumbSize, 'height' ] ) || get( theImage, [ 'sizes', thumbSize, 'height' ] ) || get( theImage, [ 'media_details', 'height' ] ) || get( theImage, [ 'sizes', 'full', 'height' ] ) || undefined;
			return imageProps;
		} )
	);
};

export const pickRelevantMediaFiles = ( image, lightSize, thumbSize, oldImages ) => {
	let oldThumb_size = '';
	const imageProps = pick( image, [ 'id', 'link' ] );
	if ( image.id && typeof oldImages === 'object' && oldImages !== null ) {
		for ( let k in oldImages ) {
			if ( parseInt( oldImages[ k ].id ) === image.id ) {
				if ( oldImages[ k ].customLink ) {
					imageProps.customLink = oldImages[ k ].customLink;
				}
				if ( oldImages[ k ].linkTarget ) {
					imageProps.linkTarget = oldImages[ k ].linkTarget;
				}
				oldThumb_size = oldImages[ k ].thumbUrl
			}
		}
	}
	if ( ( image.id && ! image.sizes && ! image.media_details ) || ( 'medium_large' === thumbSize && ! oldThumb_size ) ) {
		const theImage = wp.data.select( 'core' ).getMedia( image.id );
		if ( theImage ) {
			image = theImage;
		}
	}
	imageProps.alt = get( image, [ 'alt_text' ] ) || get( image, [ 'alt' ] ) || undefined;
	imageProps.caption = get( image, [ 'caption', 'raw' ] ) || get( image, [ 'caption' ] ) || undefined;
	imageProps.url = image.url || image.source_url;
	imageProps.thumbUrl = get( image, [ 'sizes', thumbSize, 'url' ] ) || get( image, [ 'media_details', 'sizes', thumbSize, 'source_url' ] ) || oldThumb_size || image.url || image.source_url;
	imageProps.lightUrl = get( image, [ 'sizes', lightSize, 'url' ] ) || get( image, [ 'media_details', 'sizes', lightSize, 'source_url' ] ) || image.url || image.source_url;
	imageProps.width = get( image, [ 'sizes', thumbSize, 'width' ] ) || get( image, [ 'media_details', 'sizes', thumbSize, 'width' ] ) || get( image, [ 'sizes', 'full', 'width' ] ) || get( image, [ 'media_details', 'width' ] ) || undefined;
	imageProps.height = get( image, [ 'sizes', thumbSize, 'height' ] ) || get( image, [ 'media_details', 'sizes', thumbSize, 'height' ] ) || get( image, [ 'sizes', 'full', 'height' ] ) || get( image, [ 'media_details', 'height' ] ) || undefined;
	return imageProps;
};

export const pickRelevantMediaFilesCore = ( image ) => {
	const imageProps = pick( image, [ 'alt', 'id', 'link', 'caption' ] );
	imageProps.url = get( image, [ 'sizes', 'large', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'large', 'source_url' ] ) || image.url;
	return imageProps;
};

export const pickRelevantMediaFilesUpdate = ( image, lightSize, thumbSize ) => {
	let theImage = wp.data.select( 'core' ).getMedia( image.id );
	if ( ! theImage ) {
		theImage = image;
	}
	const imageProps = pick( theImage, [ 'id', 'link' ] );
	imageProps.alt = get( theImage, [ 'alt_text' ] ) || get( theImage, [ 'alt' ] ) || undefined;
	imageProps.caption = get( theImage, [ 'caption', 'raw' ] ) || get( theImage, [ 'caption' ] ) || undefined;
	imageProps.url = theImage.source_url || image.url;
	imageProps.customLink = image.customLink;
	imageProps.linkTarget = image.linkTarget;
	imageProps.thumbUrl = get( theImage, [ 'sizes', thumbSize, 'url' ] ) || get( theImage, [ 'media_details', 'sizes', thumbSize, 'source_url' ] ) || theImage.source_url || image.url;
	imageProps.lightUrl = get( theImage, [ 'sizes', lightSize, 'url' ] ) || get( theImage, [ 'media_details', 'sizes', lightSize, 'source_url' ] ) || theImage.source_url || image.url;
	imageProps.width = get( theImage, [ 'sizes', thumbSize, 'width' ] ) || get( theImage, [ 'media_details', 'sizes', thumbSize, 'width' ] ) || get( theImage, [ 'media_details', 'width' ] ) || undefined;
	imageProps.height = get( theImage, [ 'sizes', thumbSize, 'height' ] ) || get( theImage, [ 'media_details', 'sizes', thumbSize, 'height' ] ) || get( theImage, [ 'media_details', 'height' ] ) || undefined;
	return imageProps;
};

export const columnConvert = ( value ) => {
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
		columnArray = [ 8, 4, 4, 6, 4, 4 ];
	}
	return columnArray;
};
