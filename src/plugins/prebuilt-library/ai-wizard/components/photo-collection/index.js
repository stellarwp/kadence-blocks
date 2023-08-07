/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Flex,
	FlexBlock,
	Spinner
} from '@wordpress/components';

import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Get library data.
 *
 * @param {(object)} userData
 *
 * @return {Promise<object>} Promise returns object
 */
async function downloadImages( images ) {
	try {
		const response = await apiFetch( {
			path: '/kb-design-library/v1/process_images',
			method: 'POST',
			data: {
				images: images,
			},
		} );
		return response;
	} catch (error) {
		console.log(`ERROR: ${ error }`);
		return false;
	}
}


/**
 * Internal dependencies
 */
import { Button } from '..';
import { usePhotos } from '../../hooks/use-photos';

const styles = {
	wrapper: {
		boxSizing: 'border-box',
		width: '100%',
		padding: 32,
		paddingBottom: '16px',
		marginLeft: 'auto',
		marginRight: 'auto',
		border: '1px solid #DFDFDF',
		borderRadius: '4px',
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
	},
	gridWrapper: {
		maxHeight: '318px',
		height: '500px',
		overflow: 'hidden',
		overflowY: 'auto',
		marginRight: '-8px',
   		paddingRight: '8px'
	},
	loading: {
		position: 'absolute',
		inset: '0 0 0 0',
		backgroundColor: 'rgba(255,255,255,0.95)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1,
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr 1fr',
		gap: '16px'
	},
	square: {
		position: 'relative',
		width: '100%',
		height: '100%',
		backgroundColor: '#fcfcfc',
		backgroundSize: 'cover',
		aspectRatio: '1/1'
	},
	placeholder: {
		background: '#F5F5F5',
		height: '100%',
		width: '100%',
		zIndex: 2
	},
	img: {
		objectFit: 'cover',
		objectPosition: 'center',
		width: '100%',
		position: 'relative',
		zIndex: 2,
		aspectRatio: '1/1',
	},
	linkWrapper: {
		paddingTop: 16,
		textAlign: 'center',
		borderTop: '1px solid #DFDFDF'
	},
	contentWrapper: {
		gap: 8,
		textAlign: 'center'
	},
	title: {
		fontSize: '14px',
		fontWeight: 600
	},
	description: {
		fontSize: '14px',
		marginTop: '8px'
	},
}

export function PhotoCollection({ photos, collectionLink, title, description, updateCollection }) {
	const photoGallery = usePhotos(photos);
    const [isDownloading, setIsDownloading] = useState( false );
    const [downloadedIDs, setDownloadedIDs] = useState( '' );
	let mediaLibrary = {};
	function initModal() {
		mediaLibrary = window.wp.media({
			id: title,
			title: `Edit ${title}`,
			button: {
				text: 'Use These Images',
			},
			multiple: 'add',
		});
	}
	initModal();
	mediaLibrary.on( 'select', function() {
		// TODO: Use collectionLink to download the Pexel collection to the media library
		const selectedPhotos = mediaLibrary.state().get('selection').toJSON();
		const formattedPhotos = selectedPhotos.map((photo) => ({
			id: photo.id,
			alt: photo.alt || photo.name,
			isLocal: true,
			sizes: [
				{ name: 'thumbnail', src: photo.sizes.thumbnail.url }
			]
		}));
		initModal();
		updateCollection(formattedPhotos);
	});

	mediaLibrary.on( 'open', function() {
		console.log('open', photos);
		console.log('downloadedIDs', downloadedIDs);
		const selectionAPI = mediaLibrary.state().get( 'selection' );
		downloadedIDs.forEach( function( id ) {
			const attachment = wp.media.attachment( image.id );
			selectionAPI.add( attachment ? [ attachment ] : []);
		});
		// photos.forEach( function( image ) {
		// 	if(image.isLocal) {
		// 		const attachment = wp.media.attachment( image.id );
		// 		selectionAPI.add( attachment ? [ attachment ] : []);
		// 	}
		// });
	});
	async function downloadToMediaLibrary() {
		const response = await downloadImages(photos);
		console.log('response', response);
		if ( response !== false ) {
			let tempIds = [];
			response.forEach(photo => {
				tempIds.push(photo.id);
			});
			setDownloadedIDs( tempIds );
			mediaLibrary.open();
			setIsDownloading(false);
		} else {
			setIsDownloading(false);
		}
	}
	function handleDownload() {
		if ( ! isDownloading ) {
			setIsDownloading(true);
			downloadToMediaLibrary();
		}
	}


	return (
		<div
			style={ styles.wrapper }
		>
			<div style={ styles.contentWrapper }>
				<div style={ styles.title }>{ title} </div>
				<div style={ styles.description }>{ description }</div>
			</div>
			<div style={ styles.gridWrapper } id="custom-scroll-bar">
				<div style={ styles.grid }>
					{ photoGallery && photoGallery.length > 0 ?
						photoGallery.map((image, index) => (
							<FlexBlock style={ styles.square } key={index}>
								<FlexBlock className="loading-behind-image" style={ styles.loading }>
									<Spinner />
								</FlexBlock>
								{
									image?.sizes ? (
										<img style={ styles.img } alt={ image.alt } src={ image.sizes[0].src } />
									) : (
										<FlexBlock style={{ ...styles.square, ...styles.placeholder }} key={image.alt} />
									)
								}
							</FlexBlock>
						)) : (
							Array.from('123456789ABC').map((item) => (
								<FlexBlock style={{ ...styles.square, ...styles.placeholder }} key={item} />
						)
					))}
				</div>
			</div>
			<Flex>
				<FlexBlock style={ styles.linkWrapper }>
					<Button
						variant="link"
						text={ __('Edit Collection', 'kadence') }
						target="_blank"
						onClick={ () => handleDownload() }
						disabled={ isDownloading }
						style={{ fontSize: '14px'}}
					/>
					{ isDownloading && (
						<Spinner />
					)}
				</FlexBlock>
			</Flex>
		</div>
	);
}
