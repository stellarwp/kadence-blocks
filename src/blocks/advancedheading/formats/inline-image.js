import { __ } from '@wordpress/i18n';
import { registerFormatType, insertObject } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { image } from '@wordpress/icons';

const name = 'kadence/inline-image';
const allowedBlocks = ['kadence/advancedheading'];

export const kadenceInlineImage = {
	title: __('Adv Inline Image', 'kadence-blocks'),
	tagName: 'img',
	className: 'kb-inline-image',
	keywords: [__('inline image', 'kadence-blocks'), __('image', 'kadence-blocks')],
	attributes: {
		src: 'src',
		alt: 'alt',
		width: 'style',
		borderRadius: 'style',
		borderWidth: 'style',
		borderStyle: 'style',
		borderColor: 'style',
	},
	edit({ activeAttributes, isActive, value, onChange, contentRef }) {
		const selectedBlock = useSelect((select) => {
			return select('core/block-editor').getSelectedBlock();
		}, []);
		if (undefined === selectedBlock?.name) {
			return null;
		}
		if (selectedBlock && !allowedBlocks.includes(selectedBlock.name)) {
			return null;
		}
		const buildStyleString = (settings) => {
			const styles = [];
			if (settings.width) {
				styles.push(`width: ${settings.width}px`);
			}
			if (settings.borderRadius) {
				styles.push(`border-radius: ${settings.borderRadius}px`);
			}
			if (settings.borderWidth) {
				styles.push(`border-width: ${settings.borderWidth}px`);
				styles.push(`border-style: ${settings.borderStyle}`);
				styles.push(`border-color: ${settings.borderColor}`);
			}
			return styles.join('; ');
		};

		const onToggle = () => {
			// Open WordPress media library directly
			const mediaFrame = wp.media({
				title: __('Select Image', 'kadence-blocks'),
				button: {
					text: __('Use Image', 'kadence-blocks'),
				},
				multiple: false,
				library: {
					type: 'image',
				},
			});

			mediaFrame.on('select', () => {
				const attachment = mediaFrame.state().get('selection').first().toJSON();
				if (attachment && attachment.url) {
					const imageData = {
						src: attachment.url,
						alt: attachment.alt || '',
						width: 150,
						borderRadius: 0,
						borderWidth: 0,
						borderStyle: 'solid',
						borderColor: '#000000',
					};
					insertImage(imageData);
				}
			});

			mediaFrame.open();
		};

		const insertImage = (imageData) => {
			// Use insertObject to insert the image at the current cursor position
			const styleString = buildStyleString(imageData);
			onChange(
				insertObject(value, {
					type: name,
					attributes: {
						src: imageData.src || '',
						alt: imageData.alt || '',
						style: styleString,
						width: imageData.width || 150,
						borderRadius: imageData.borderRadius || 0,
						borderWidth: imageData.borderWidth || 0,
						borderStyle: imageData.borderStyle || 'solid',
						borderColor: imageData.borderColor || '#000000',
					},
				})
			);
		};

		return (
			<RichTextToolbarButton
				icon={image}
				title={__('Adv Inline Image', 'kadence-blocks')}
				onClick={onToggle}
				isActive={isActive}
				className={`toolbar-button-with-text toolbar-button__${name}`}
			/>
		);
	},
};

registerFormatType(name, kadenceInlineImage);
