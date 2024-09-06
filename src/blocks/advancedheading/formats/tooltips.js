import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { toggleFormat, applyFormat, registerFormatType, useAnchorRef, useAnchor } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import TooltipsPopover from './tooltips-popover';
import { tooltip } from '@kadence/icons';

const name = 'kadence/tooltips';
const allowedBlocks = ['kadence/advancedheading'];

export const kadenceToolTips = {
	title: __('Tooltips', 'kadence-blocks'),
	tagName: 'a',
	className: 'kb-tooltips',
	keywords: [__('tooltips', 'kadence-blocks')],
	attributes: {
		content: 'data-kb-tooltip-content',
		placement: 'data-tooltip-placement',
		url: 'href',
		target: 'target',
		rel: 'rel',
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
		const [isEditingTooltip, setIsEditingTooltip] = useState(false);
		const onToggle = () => onChange(toggleFormat(value, { type: name }));
		const disableIsEditingTooltip = useCallback(() => setIsEditingTooltip(false), [setIsEditingTooltip]);

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
				setIsEditingTooltip(true);
			} else {
				setIsEditingTooltip(false);
			}
		}, [isActive]);
		return (
			<>
				<RichTextToolbarButton
					icon={tooltip}
					title={__('Tooltips', 'kadence-blocks')}
					onClick={onToggle}
					isActive={isActive}
					className={`toolbar-button-with-text toolbar-button__${name}`}
				/>

				{isActive && isEditingTooltip && (
					<TooltipsPopover
						name={name}
						isActive={isActive}
						onClose={disableIsEditingTooltip}
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

registerFormatType(name, kadenceToolTips);
