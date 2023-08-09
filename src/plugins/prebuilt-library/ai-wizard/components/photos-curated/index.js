/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Flex,
	FlexBlock
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { PhotoCollection } from '..';

const content = {
	featuredTitle: __('Featured Images', 'kadence'),
	featuredDescription: __('We\'ll need some copy here that explains that these are from keywords or that its a pre-made collection for them to use.', 'kadence'),
	backgroundTitle: __('Background Images', 'kadence'),
	backgroundDescription: __('We\'ll need some copy here explaining the premise of background images and what users should look for when choosing them.', 'kadence')
}

const styles = {
	wrapper: {
		boxSizing: 'border-box',
		maxWidth: 1000,
		margin: 'auto'
	}
}

export function PhotosCurated({ loading, featured, background, updateCollection }) {

	const saveUpdatedPhotos = (galleryIndex) => (selectedImages) => {
		updateCollection(galleryIndex, selectedImages);
	}

	return (
		<div
			className={ 'stellarwp-body' }
			style={ styles.wrapper }
		>
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
