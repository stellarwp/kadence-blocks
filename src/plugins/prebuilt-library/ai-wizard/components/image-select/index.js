/**
 * WordPress dependencies
 */
import { Flex, FlexBlock } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Button } from '..';
import { ImageCarousel } from '..';
import { useKadenceAi } from '../../context/kadence-ai-provider';

const styles = {
	title : {
		fontWeight: 'bold',
		textAlign: 'center'
	},
	description: {
		textAlign: 'center'
	},
	box: {
		maxWidth: 480,
		height: 360,
		borderWidth: 1,
		borderColor: '#DFDFDF',
		borderStyle: 'solid',
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	}
}

/**
 * @param {Ojbect} props
 * @param {'featured'|'background'} props.id
 * @param {string} props.title
 * @param {string} props.buttonText
 * @param {string} props.helpText
 * @param {string} props.mediaButtonText
 */
export function ImageSelect(props) {
	const {
		id, // featured or background
		title,
		buttonText,
		helpText,
		mediaButtonText
	} = props;

	const { state, dispatch } = useKadenceAi();
	const images = id === 'featured' ? state.featuredImages : state.backgroundImages;
	const { media } = window.wp;
	let frame;

	function handleMediaUpload(event) {
		event.preventDefault();

		// If the media frame already exists, reopen it.
		if (frame) {
			frame.open();
			return;
		}

		frame = media({
			title,
			multiple: true,
			button: {
				text: mediaButtonText || 'Use these images'
			}
		});

		frame.on('select', () => {
			if (! id || ! ['featured', 'background'].includes(id)) {
				throw new Error('ImageSelect requires a id property with the value of "featured" or "background"');
			}

			const type = id === 'featured' ? 'SET_FEATURED' : 'SET_BACKGROUND';
			// First in image selection.
			const previewImage =  frame.state().get('selection').first().toJSON();
			// Image selections.
			const images = frame.state().get('selection').map((attachment) => {
				const image = attachment.toJSON();
				// console.log(image);

				return {
					id: image.id,
					url: image.url,
					thumbnail: image.sizes.thumbnail.url
				}
			});

			// Set collection images.
			if (images.length) {
				dispatch({ type: `${ type }_IMAGES`, payload: images });
			}

			// Set preview image.
			if (previewImage) {
				dispatch({ type: `${ type }_PREVIEW`, payload: previewImage });
			}

			return false;
		});

		// Show previously-chosen media in gallery, on open.
		frame.on('open', () => {
			const selection = frame.state().get('selection');

			images.forEach((image) => {
				const attachment = media.attachment(image.id);
				attachment.fetch();

				selection.add(attachment ? [attachment] : []);
			});
		});

		frame.open();
	}

	function getPreviewStyles() {
		const preview = id === 'featured' ? state.featuredImage : state.backgroundImage;
		if (preview) {
			return {
				...styles.box,
				backgroundImage: `url(${ preview.url })`,
			}
		}

		return styles.box;
	}

	return (
		<Flex direction="column" gap="6">
			<FlexBlock style={ styles.title }>
				{ title && title }
			</FlexBlock>
			<FlexBlock>
				<Flex justify="center" align="center" style={ getPreviewStyles() }>
					<Button
						variant="secondary"
						iconPosition="right"
						icon="format-gallery"
						onClick={ handleMediaUpload }
						text={ buttonText }
					/>
				</Flex>
			</FlexBlock>
			{ (images && images.length > 0) && (
				<FlexBlock>
					<ImageCarousel images={ images } />
				</FlexBlock>
			) }
			<FlexBlock style={ styles.description }>
				{ helpText && helpText }
			</FlexBlock>
		</Flex>
	);
}

