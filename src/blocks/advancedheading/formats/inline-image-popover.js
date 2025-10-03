import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, TextControl, RangeControl, SelectControl, Button } from '@wordpress/components';
import { useCachedTruthy } from '@wordpress/block-editor';
import { KadencePanelBody } from '@kadence/components';
import { image, closeSmall, plusCircleFilled } from '@wordpress/icons';
import { kadenceInlineImage as settings } from './inline-image';
import { insertObject } from '@wordpress/rich-text';

export default function InlineImagePopover({
	name,
	value,
	insertImage,
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

	const hasImage = !!imageSettings.src;

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

	const onSelectImage = (media) => {
		if (!media || !media.url) {
			onClose();
			return;
		}

		const newSettings = {
			...imageSettings,
			src: media.url,
			alt: media.alt || '',
		};

		insertImage({
			src: media.url,
			alt: media.alt || '',
			style: buildStyleString(newSettings),
			width: newSettings.width,
			borderRadius: newSettings.borderRadius,
			borderWidth: newSettings.borderWidth,
			borderStyle: newSettings.borderStyle,
			borderColor: newSettings.borderColor,
		});
	};

	const onSelectURL = (newURL) => {
		if (newURL && newURL.trim()) {
			const newSettings = {
				...imageSettings,
				src: newURL.trim(),
			};

			insertImage({
				src: newURL.trim(),
				alt: '',
				style: buildStyleString(newSettings),
				width: newSettings.width,
				borderRadius: newSettings.borderRadius,
				borderWidth: newSettings.borderWidth,
				borderStyle: newSettings.borderStyle,
				borderColor: newSettings.borderColor,
			});
		}
	};

	const onRemoveImage = () => {
		insertImage({
			src: '',
			alt: '',
			style: ''
		});
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
				{!hasImage ? (
					<>
						<div className="components-kadence-image-background__label">{__('Image', 'kadence-blocks')}</div>
						<div className="kb-inline-image-placeholder">
							<Button
								isPrimary
								icon={plusCircleFilled}
								onClick={() => {
									// Use WordPress media library directly
									const mediaFrame = wp.media({
										title: __('Select Image', 'kadence-blocks'),
										button: {
											text: __('Use Image', 'kadence-blocks')
										},
										multiple: false,
										library: {
											type: 'image'
										}
									});

									mediaFrame.on('select', () => {
										const attachment = mediaFrame.state().get('selection').first().toJSON();
										onSelectImage(attachment);
									});

									mediaFrame.open();
								}}
							>
								{__('Select Image', 'kadence-blocks')}
							</Button>
							<Button
								isSecondary
								onClick={() => {
									const url = prompt(__('Enter image URL:', 'kadence-blocks'));
									if (url) {
										onSelectURL(url);
									}
								}}
							>
								{__('Insert from URL', 'kadence-blocks')}
							</Button>
						</div>
					</>
				) : (
					<>
						<div className="components-kadence-image-background__label">{__('Image', 'kadence-blocks')}</div>
						<div className="kadence-image-media-control kadence-image-background-control">
							<div className="kb-inline-image-preview">
								<img 
									src={imageSettings.src} 
									alt={imageSettings.alt || ''} 
									style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
								/>
							</div>
							<div className="kb-inline-image-actions">
								<Button
									isSecondary
									icon={image}
									onClick={() => {
										// Use WordPress media library directly
										const mediaFrame = wp.media({
											title: __('Select Image', 'kadence-blocks'),
											button: {
												text: __('Use Image', 'kadence-blocks')
											},
											multiple: false,
											library: {
												type: 'image'
											}
										});

										mediaFrame.on('select', () => {
											const attachment = mediaFrame.state().get('selection').first().toJSON();
											onSelectImage(attachment);
										});

										mediaFrame.open();
									}}
								>
									{__('Change Image', 'kadence-blocks')}
								</Button>
								<Button
									icon={closeSmall}
									label={__('Remove Image', 'kadence-blocks')}
									isDestructive
									onClick={onRemoveImage}
								/>
							</div>
						</div>
					</>
				)}
				{hasImage && (
					<>
						<TextControl
							label={__('Alternative Text', 'kadence-blocks')}
							value={imageSettings.alt}
							onChange={(newValue) => insertImage({ alt: newValue })}
							placeholder={__('Enter alternative text', 'kadence-blocks')}
							help={__('Describe the image for screen readers and accessibility.', 'kadence-blocks')}
						/>
						<RangeControl
							label={__('Image Width (%)', 'kadence-blocks')}
							value={imageSettings.width}
							onChange={(newValue) => {
								const newSettings = { ...imageSettings, width: newValue };
								insertImage({ 
									width: newValue,
									style: buildStyleString(newSettings)
								});
							}}
							min={10}
							max={100}
							step={5}
							help={__('Set the width of the image as a percentage of the container.', 'kadence-blocks')}
						/>
					</>
				)}
			</KadencePanelBody>
			
			{hasImage && (
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
						insertImage({ 
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
						insertImage({ 
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
						insertImage({ 
							borderColor: newValue,
							style: buildStyleString(newSettings)
						});
					}}
					placeholder={__('#000000', 'kadence-blocks')}
					help={__('Enter a hex color code for the border.', 'kadence-blocks')}
				/>
				</KadencePanelBody>
			)}

			{hasImage && (
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
						insertImage({ 
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
			)}
		</Popover>
	);
}

