import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { toggleFormat, applyFormat, registerFormatType, useAnchorRef, useAnchor } from '@wordpress/rich-text';
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
		const onToggle = () => onChange(toggleFormat(value, { type: name }));
		const disableIsEditingImage = useCallback(() => setIsEditingImage(false), [setIsEditingImage]);

		const updateFormat = (newValue) => {
			const newAttributes = {
				...activeAttributes,
				...newValue,
			};
			onChange(
				applyFormat(value, {
					type: name,
					attributes: newAttributes,
				})
			);
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

				{isActive && isEditingImage && (
					<InlineImagePopover
						name={name}
						isActive={isActive}
						onClose={disableIsEditingImage}
						activeAttributes={activeAttributes}
						value={value}
						updateFormat={updateFormat}
						contentRef={contentRef}
					/>
				)}
			</>
		);
	},
};

registerFormatType(name, kadenceInlineImage);

