import { __ } from '@wordpress/i18n';
import { registerFormatType, insertObject } from '@wordpress/rich-text';
import {
	RichTextToolbarButton,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { image } from '@wordpress/icons';

const name = 'kadence/inline-image';
const allowedBlocks = ['kadence/advancedheading'];

const ALLOWED_MEDIA_TYPES = ['image'];

export const kadenceInlineImage = {
	name,
	title: __('Adv Inline Image', 'kadence-blocks'),
	keywords: [__('inline image', 'kadence-blocks'), __('image', 'kadence-blocks')],
	object: true,
	tagName: 'img',
	className: 'kb-inline-image',
	attributes: {
		className: 'class',
		style: 'style',
		url: 'src',
		alt: 'alt',
	},
	edit({ value, onChange, onFocus, isObjectActive, activeObjectAttributes, contentRef }) {
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
				styles.push(`border-style: ${settings.borderStyle || 'solid'}`);
				styles.push(`border-color: ${settings.borderColor || '#000000'}`);
			}
			return styles.join('; ');
		};

		return (
			<MediaUploadCheck>
				<MediaUpload
					allowedTypes={ALLOWED_MEDIA_TYPES}
					onSelect={({ id, url, alt, width: imgWidth }) => {
						const imageData = {
							url: url,
							alt: alt || '',
							borderRadius: 0,
							borderWidth: 0,
							borderStyle: 'solid',
							borderColor: '#000000',
						};
						const styleString = buildStyleString(imageData);
						onChange(
							insertObject(value, {
								type: name,
								attributes: {
									className: 'kb-inline-image',
									style: styleString,
									url: imageData.url,
									alt: imageData.alt,
								},
							})
						);
						onFocus();
					}}
					render={({ open }) => (
						<RichTextToolbarButton
							icon={image}
							title={isObjectActive ? __('Replace image', 'kadence-blocks') : __('Adv Inline Image', 'kadence-blocks')}
							onClick={open}
							isActive={isObjectActive}
							className={`toolbar-button-with-text toolbar-button__${name}`}
						/>
					)}
				/>
			</MediaUploadCheck>
		);
	},
};

registerFormatType(name, kadenceInlineImage);
