import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, TextControl, RangeControl, SelectControl } from '@wordpress/components';
import { useCachedTruthy } from '@wordpress/block-editor';
import { KadencePanelBody } from '@kadence/components';
import { kadenceInlineImage as settings } from './inline-image';

export default function InlineImagePopover({
	name,
	value,
	updateFormat,
	isActive,
	onClose,
	contentRef,
	activeAttributes,
}) {
	const imageSettings = {
		src: activeAttributes.src || '',
		alt: activeAttributes.alt || '',
		width: activeAttributes.width || 100,
		borderRadius: activeAttributes.borderRadius || 0,
		borderWidth: activeAttributes.borderWidth || 0,
		borderStyle: activeAttributes.borderStyle || 'solid',
		borderColor: activeAttributes.borderColor || '#000000',
	};

	const buildStyleString = (settings) => {
		const styles = [];
		if (settings.width) {
			styles.push(`width: ${settings.width}%`);
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

	const popoverAnchor = useCachedTruthy(
		useAnchor({
			editableContentElement: contentRef.current,
			settings: {
				...settings,
				isActive,
			},
		})
	);

	return (
		<Popover className="kb-typing-popover kb-inline-image-popover" onClose={onClose} anchor={popoverAnchor}>
			<KadencePanelBody
				title={__('Image Settings', 'kadence-blocks')}
				initialOpen={true}
				panelName={'kb-inline-image-basic-settings'}
			>
				<TextControl
					label={__('Image URL', 'kadence-blocks')}
					value={imageSettings.src}
					onChange={(newValue) => updateFormat({ src: newValue })}
					placeholder={__('Enter image URL', 'kadence-blocks')}
				/>
				<TextControl
					label={__('Alternative Text', 'kadence-blocks')}
					value={imageSettings.alt}
					onChange={(newValue) => updateFormat({ alt: newValue })}
					placeholder={__('Enter alternative text', 'kadence-blocks')}
					help={__('Describe the image for screen readers and accessibility.', 'kadence-blocks')}
				/>
				<RangeControl
					label={__('Image Width (%)', 'kadence-blocks')}
					value={imageSettings.width}
					onChange={(newValue) => {
						const newSettings = { ...imageSettings, width: newValue };
						updateFormat({ 
							width: newValue,
							style: buildStyleString(newSettings)
						});
					}}
					min={10}
					max={100}
					step={5}
					help={__('Set the width of the image as a percentage of the container.', 'kadence-blocks')}
				/>
			</KadencePanelBody>
			
			<KadencePanelBody
				title={__('Border Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-inline-image-border-settings'}
			>
				<RangeControl
					label={__('Border Width (px)', 'kadence-blocks')}
					value={imageSettings.borderWidth}
					onChange={(newValue) => {
						const newSettings = { ...imageSettings, borderWidth: newValue };
						updateFormat({ 
							borderWidth: newValue,
							style: buildStyleString(newSettings)
						});
					}}
					min={0}
					max={20}
					step={1}
					help={__('Set the border width in pixels.', 'kadence-blocks')}
				/>
				<SelectControl
					label={__('Border Style', 'kadence-blocks')}
					value={imageSettings.borderStyle}
					options={[
						{ label: __('None', 'kadence-blocks'), value: 'none' },
						{ label: __('Solid', 'kadence-blocks'), value: 'solid' },
						{ label: __('Dashed', 'kadence-blocks'), value: 'dashed' },
						{ label: __('Dotted', 'kadence-blocks'), value: 'dotted' },
						{ label: __('Double', 'kadence-blocks'), value: 'double' },
						{ label: __('Groove', 'kadence-blocks'), value: 'groove' },
						{ label: __('Ridge', 'kadence-blocks'), value: 'ridge' },
						{ label: __('Inset', 'kadence-blocks'), value: 'inset' },
						{ label: __('Outset', 'kadence-blocks'), value: 'outset' },
					]}
					onChange={(val) => {
						const newSettings = { ...imageSettings, borderStyle: val };
						updateFormat({ 
							borderStyle: val,
							style: buildStyleString(newSettings)
						});
					}}
				/>
				<TextControl
					label={__('Border Color', 'kadence-blocks')}
					value={imageSettings.borderColor}
					onChange={(newValue) => {
						const newSettings = { ...imageSettings, borderColor: newValue };
						updateFormat({ 
							borderColor: newValue,
							style: buildStyleString(newSettings)
						});
					}}
					placeholder={__('#000000', 'kadence-blocks')}
					help={__('Enter a hex color code for the border.', 'kadence-blocks')}
				/>
			</KadencePanelBody>

			<KadencePanelBody
				title={__('Border Radius Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-inline-image-radius-settings'}
			>
				<RangeControl
					label={__('Border Radius (px)', 'kadence-blocks')}
					value={imageSettings.borderRadius}
					onChange={(newValue) => {
						const newSettings = { ...imageSettings, borderRadius: newValue };
						updateFormat({ 
							borderRadius: newValue,
							style: buildStyleString(newSettings)
						});
					}}
					min={0}
					max={50}
					step={1}
					help={__('Set the border radius in pixels for rounded corners.', 'kadence-blocks')}
				/>
			</KadencePanelBody>
		</Popover>
	);
}

