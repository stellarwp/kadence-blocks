/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Flex, FlexBlock } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { PhotoCollection } from '..';

const content = {
	featuredTitle: __('Featured Images', 'kadence'),
	featuredDescription: __(
		'Featured images are meant to draw attention, they are used to represent the content on your website.',
		'kadence'
	),
	backgroundTitle: __('Background Images', 'kadence'),
	backgroundDescription: __(
		'Background images are meant to enhance the overall look and feel, styling the background of sections in your website.',
		'kadence'
	),
};

const styles = {
	wrapper: {
		boxSizing: 'border-box',
		maxWidth: 1000,
		margin: 'auto',
	},
};

export function PhotosCurated({ loading, featured, background, updateCollection }) {
	const saveUpdatedPhotos = (galleryIndex) => (selectedImages) => {
		updateCollection(galleryIndex, selectedImages);
	};

	return (
		<div className={'stellarwp-body'} style={styles.wrapper}>
			<Flex align="top" gap="5">
				<FlexBlock>
					<PhotoCollection
						loading={loading}
						photos={featured?.images}
						isLocal={featured?.isLocal}
						collectionLink={featured?.pexelLink}
						title={content.featuredTitle}
						description={content.featuredDescription}
						updateCollection={saveUpdatedPhotos(0)}
					/>
				</FlexBlock>
				<FlexBlock>
					<PhotoCollection
						loading={loading}
						photos={background?.images}
						isLocal={background?.isLocal}
						collectionLink={background?.pexelLink}
						title={content.backgroundTitle}
						description={content.backgroundDescription}
						updateCollection={saveUpdatedPhotos(1)}
					/>
				</FlexBlock>
			</Flex>
		</div>
	);
}
