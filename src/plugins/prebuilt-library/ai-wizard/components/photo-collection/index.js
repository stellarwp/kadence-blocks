/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Flex, FlexBlock, Spinner } from '@wordpress/components';

import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
// import {
// 	MediaUpload,
// } from '@wordpress/block-editor';
import MediaUpload from './media-modal';
/**
 * Get library data.
 *
 * @param {(object)} userData
 *
 * @return {Promise<object>} Promise returns object
 */
async function downloadImages(images) {
	try {
		const response = await apiFetch({
			path: '/kb-design-library/v1/process_images',
			method: 'POST',
			data: {
				images,
			},
		});
		return response;
	} catch (error) {
		const message = error?.message ? error.message : error;
		console.log(`ERROR: ${message}`);
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
		paddingRight: '9px',
		position: 'relative',
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
		gap: '16px',
	},
	square: {
		position: 'relative',
		width: '100%',
		height: '100%',
		backgroundColor: '#fcfcfc',
		backgroundSize: 'cover',
		aspectRatio: '1/1',
	},
	placeholder: {
		background: '#F5F5F5',
		height: '100%',
		width: '100%',
		zIndex: 2,
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
		borderTop: '1px solid #DFDFDF',
	},
	contentWrapper: {
		gap: 8,
		textAlign: 'center',
	},
	title: {
		fontSize: '14px',
		fontWeight: 600,
	},
	description: {
		fontSize: '14px',
		marginTop: '8px',
	},
	importWrapper: {
		position: 'relative',
		marginBottom: '-24px',
	},
	importNotice: {
		position: 'absolute',
		top: '0',
		width: '100%',
		height: '318px',
		backgroundColor: 'rgba(255,255,255,0.9)',
		display: 'flex',
		fontSize: '18px',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 11,
	},
	spinner: {
		marginRight: '8px',
		marginLeft: '8px',
		marginTop: '4px',
		marginBottom: '4px',
	},
};

const ALLOWED_MEDIA_TYPES = ['image'];

export function PhotoCollection({ photos, loading, isLocal, collectionLink, title, description, updateCollection }) {
	const photoGallery = usePhotos(photos);
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadedIDs, setDownloadedIDs] = useState([]);
	const [selectionIDs, setSelectionIDs] = useState([]);

	useEffect(() => {
		if (photos) {
			const tempSelectionIDs = [];
			photos.forEach(function (image) {
				tempSelectionIDs.push(image.id);
			});
			setSelectionIDs(tempSelectionIDs);
		} else {
			setSelectionIDs([]);
		}
	}, [photos]);
	function onSelectImages(images) {
		const formattedPhotos = images.map((photo) => ({
			id: photo.id,
			post_id: photo.id,
			alt: photo.alt || photo.name,
			url: photo?.sizes?.large?.url || photo?.sizes?.full?.url,
			sizes: [
				{
					name: 'thumbnail',
					src: photo?.sizes?.thumbnail?.url || photo?.sizes?.large?.url || photo?.sizes?.full?.url,
				},
			],
		}));
		updateCollection(formattedPhotos);
	}
	async function downloadToMediaLibrary(open) {
		setIsDownloading(true);
		const response = await downloadImages(photos);
		if (response !== false) {
			const tempDownloadedIDs = [];
			response.forEach(function (image) {
				tempDownloadedIDs.push(image.id);
			});
			setSelectionIDs(tempDownloadedIDs);
			setTimeout(function () {
				open();
				setIsDownloading(false);
			}, 100);
		} else {
			setIsDownloading(false);
		}
	}
	function handleDownload(open) {
		if (!isDownloading) {
			if (!isLocal && photos?.length > 0) {
				downloadToMediaLibrary(open);
			} else {
				open();
			}
		}
	}

	return (
		<div style={styles.wrapper}>
			<div style={styles.contentWrapper}>
				<div style={styles.title}>{title} </div>
				<div style={styles.description}>{description}</div>
			</div>
			<div style={styles.importWrapper} className="kb-images-custom-import">
				{loading && (
					<div style={styles.importNotice} className="kb-importing-information">
						<Spinner style={styles.spinner} /> {__('Loading…', 'kadence-blocks')}
					</div>
				)}
				{isDownloading && (
					<div style={styles.importNotice} className="kb-importing-information">
						<Spinner style={styles.spinner} /> {__('Importing Images…', 'kadence-blocks')}
					</div>
				)}
			</div>
			<div style={styles.gridWrapper} className="kb-images-custom-scroll-bar">
				<div style={styles.grid}>
					{photoGallery && photoGallery.length > 0
						? photoGallery.map((image, index) => (
								<FlexBlock style={styles.square} key={index}>
									<FlexBlock className="loading-behind-image" style={styles.loading}>
										<Spinner />
									</FlexBlock>
									{image?.sizes ? (
										<img
											style={styles.img}
											alt={image.alt}
											src={image?.sizes?.[0]?.src ? image.sizes[0].src : image?.url}
										/>
									) : (
										<FlexBlock
											style={{ ...styles.square, ...styles.placeholder }}
											key={image.alt}
										/>
									)}
								</FlexBlock>
							))
						: Array.from('123456789ABC').map((item) => (
								<FlexBlock style={{ ...styles.square, ...styles.placeholder }} key={item} />
							))}
				</div>
			</div>
			<Flex>
				<FlexBlock style={styles.linkWrapper}>
					<MediaUpload
						onSelect={(imgs) => onSelectImages(imgs)}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						multiple
						gallery
						title={'Edit Collection'}
						value={selectionIDs}
						render={({ open }) => (
							<Button
								variant="link"
								disabled={isDownloading}
								text={__('Edit Collection', 'kadence-blocks')}
								onClick={() => handleDownload(open)}
								style={{ fontSize: '14px' }}
							/>
						)}
					/>
				</FlexBlock>
			</Flex>
		</div>
	);
}
