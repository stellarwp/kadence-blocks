import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { toggleFormat, applyFormat, registerFormatType, useAnchorRef, useAnchor, insert, insertObject } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import InlineImagePopover from './inline-image-popover';
import { dynamicIcon } from '@kadence/icons';

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
		const [isEditingImage, setIsEditingImage] = useState(false);
		
		const onToggle = () => {
			// May want to add a placeholder that can be replaced with the image
			setIsEditingImage(true);
		};
		
		const disableIsEditingImage = useCallback(() => setIsEditingImage(false), [setIsEditingImage]);

		const insertImage = (imageData) => {
			// Use insertObject to insert the image at the current cursor position
			onChange(
				insertObject(value, {
					type: name,
					attributes: {
						src: imageData.src || '',
						alt: imageData.alt || '',
						style: imageData.style || '',
						width: imageData.width || '150px',
						borderRadius: imageData.borderRadius || 0,
						borderWidth: imageData.borderWidth || 0,
						borderStyle: imageData.borderStyle || 'solid',
						borderColor: imageData.borderColor || '#000000',
					}
				})
			);
			// setIsEditingImage(true);
		};

		useEffect(() => {
			if (isActive) {
				setIsEditingImage(true);
			} else {
				setIsEditingImage(false);
			}
		}, [isActive]);
		
		return (
			<>
				<RichTextToolbarButton
					icon={dynamicIcon}
					title={__('Adv Inline Image', 'kadence-blocks')}
					onClick={onToggle}
					isActive={isActive}
					className={`toolbar-button-with-text toolbar-button__${name}`}
				/>

				{isEditingImage && (
					<InlineImagePopover
						name={name}
						isActive={isActive}
						onClose={disableIsEditingImage}
						activeAttributes={activeAttributes}
						value={value}
						insertImage={insertImage}
						contentRef={contentRef}
					/>
				)}
			</>
		);
	},
};

registerFormatType(name, kadenceInlineImage);

