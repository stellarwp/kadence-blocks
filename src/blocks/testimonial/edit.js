/**
 * BLOCK: Kadence Single Testimonial
 *
 */

import metadata from './block.json';
import TestimonialItemWrap from './carousel-item-wrap';
/**
 * Import Icons
 */
import {
	testimonialBubbleIcon,
	alignTopIcon,
	alignMiddleIcon,
	alignBottomIcon,
	testimonialBasicIcon,
	testimonialCardIcon,
	testimonialInLineIcon,
} from '@kadence/icons';

/**
 * Import External
 */
import { has } from 'lodash';

/**
 * Import Components
 */

import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	ResponsiveRangeControls,
	KadencePanelBody,
	WebfontLoader,
	KadenceIconPicker,
	IconRender,
	KadenceMediaPlaceholder,
	MeasurementControls,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	CopyPasteAttributes,
	SelectParentBlock,
} from '@kadence/components';

import {
	getPreviewSize,
	KadenceColorOutput,
	showSettings,
	setBlockDefaults,
	getPostOrFseId,
	getUniqueId,
} from '@kadence/helpers';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import { useEffect, Fragment, useState, useRef } from '@wordpress/element';

import { MediaUpload, RichText, InspectorControls, useBlockProps, BlockControls } from '@wordpress/block-editor';

import { useSelect, useDispatch } from '@wordpress/data';

import {
	Button,
	ButtonGroup,
	Dashicon,
	RangeControl,
	ToggleControl,
	SelectControl,
	Tooltip,
} from '@wordpress/components';

import { closeSmall, image } from '@wordpress/icons';
import classnames from 'classnames';

/**
 * Build the overlay edit
 */

function KadenceTestimonials(props) {
	const { attributes, setAttributes, className, clientId, isSelected, context } = props;

	const {
		uniqueID,
		url,
		id,
		media,
		icon,
		isize,
		istroke,
		ititle,
		color,
		title,
		content,
		name,
		occupation,
		rating,
		sizes,
		tabletIsize,
		mobileIsize,
		inQueryBlock,
	} = attributes;

	const displayContent = context['kadence/testimonials-displayContent'];
	const displayTitle = context['kadence/testimonials-displayTitle'];
	const displayRating = context['kadence/testimonials-displayRating'];
	const displayName = context['kadence/testimonials-displayName'];
	const displayIcon = context['kadence/testimonials-displayIcon'];
	const iconStyles = context['kadence/testimonials-iconStyles'];
	const style = context['kadence/testimonials-style'];

	const titleFont = context['kadence/testimonials-titleFont'];

	const displayOccupation = context['kadence/testimonials-displayOccupation'];
	const displayMedia = context['kadence/testimonials-displayMedia'];
	const containerMaxWidth = context['kadence/testimonials-containerMaxWidth'];
	const mediaStyles = context['kadence/testimonials-mediaStyles'];
	const ratingStyles = context['kadence/testimonials-ratingStyles'];

	const [activeTab, setActiveTab] = useState('general');

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);

	useEffect(() => {
		setBlockDefaults(metadata.name, attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}

		if (context && context.queryId && context.postId) {
			if (context.queryId !== inQueryBlock) {
				setAttributes({
					inQueryBlock: context.queryId,
				});
			}
		} else if (inQueryBlock) {
			setAttributes({
				inQueryBlock: false,
			});
		}
	}, []);

	const previewIconSize = getPreviewSize(
		previewDevice,
		undefined !== isize ? isize : '',
		undefined !== tabletIsize ? tabletIsize : '',
		undefined !== mobileIsize ? mobileIsize : ''
	);

	const nonTransAttrs = ['url', 'title', 'content', 'name', 'occupation'];

	const blockProps = useBlockProps({});

	const ALLOWED_MEDIA_TYPES = ['image'];

	const renderTestimonialSettings = () => {
		return (
			<>
				<SelectControl
					label={__('Media Type', 'kadence-blocks')}
					value={media}
					options={[
						{ value: 'image', label: __('Image', 'kadence-blocks') },
						{ value: 'icon', label: __('Icon', 'kadence-blocks') },
					]}
					onChange={(value) => setAttributes({ media: value })}
				/>
				{'icon' === media && (
					<Fragment>
						<KadenceIconPicker
							value={icon}
							onChange={(value) => {
								setAttributes({ icon: value });
							}}
						/>
						<ResponsiveRangeControls
							label={__('Icon Size', 'kadence-blocks')}
							value={undefined !== isize ? isize : ''}
							onChange={(value) => setAttributes({ isize: value })}
							tabletValue={undefined !== tabletIsize ? tabletIsize : ''}
							onChangeTablet={(value) => setAttributes({ tabletIsize: value })}
							mobileValue={undefined !== mobileIsize ? mobileIsize : ''}
							onChangeMobile={(value) => setAttributes({ mobileIsize: value })}
							min={0}
							max={300}
							step={1}
							unit={'px'}
							showUnit={true}
							units={['px']}
						/>
						{icon && 'fe' === icon.substring(0, 2) && (
							<RangeControl
								label={__('Line Width', 'kadence-blocks')}
								value={istroke}
								onChange={(value) => {
									setAttributes({ istroke: value });
								}}
								step={0.5}
								min={0.5}
								max={4}
							/>
						)}
						<PopColorControl
							label={__('Icon Color', 'kadence-blocks')}
							value={color ? color : '#555555'}
							default={'#555555'}
							onChange={(value) => setAttributes({ color: value })}
						/>
					</Fragment>
				)}
				<RangeControl
					label={__('Rating', 'kadence-blocks')}
					value={rating}
					onChange={(value) => {
						setAttributes({ rating: value });
					}}
					step={1}
					min={1}
					max={5}
				/>
			</>
		);
	};

	const renderTestimonialIcon = () => {
		return (
			<div className="kt-svg-testimonial-global-icon-wrap">
				<IconRender
					className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
					name={iconStyles[0].icon}
					size={iconStyles[0].size}
					title={iconStyles[0].title ? iconStyles[0].title : ''}
					strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
					style={{
						color: iconStyles[0].color ? KadenceColorOutput(iconStyles[0].color) : undefined,
						background: iconStyles[0].background
							? KadenceColorOutput(
									iconStyles[0].background,
									undefined !== iconStyles[0].backgroundOpacity ? iconStyles[0].backgroundOpacity : 1
								)
							: undefined,
					}}
				/>
			</div>
		);
	};
	const renderTestimonialMedia = () => {
		let urlOutput = url;
		if (has(sizes, 'thumbnail')) {
			if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
				urlOutput = url;
			} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
				if (sizes.large && sizes.large.width > 1000) {
					urlOutput = sizes.large.url;
				}
			} else if ('card' === style && containerMaxWidth <= 100) {
				if (sizes.medium && sizes.medium.width > 200) {
					urlOutput = sizes.medium.url;
				} else if (sizes.large && sizes.large.width > 200) {
					urlOutput = sizes.large.url;
				}
			} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
				if (sizes.large && sizes.large.width > 1000) {
					urlOutput = sizes.large.url;
				}
			} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
				if (sizes.medium && sizes.medium.width > 200) {
					urlOutput = sizes.medium.url;
				} else if (sizes.large && sizes.large.width > 200) {
					urlOutput = sizes.large.url;
				}
			} else if (mediaStyles[0].width <= 75) {
				if (sizes.thumbnail && sizes.thumbnail.width > 140) {
					urlOutput = sizes.thumbnail.url;
				} else if (sizes.medium && sizes.medium.width > 140) {
					urlOutput = sizes.medium.url;
				} else if (sizes.large && sizes.large.width > 200) {
					urlOutput = sizes.large.url;
				}
			}
		}

		return (
			<div className="kt-testimonial-media-wrap">
				<div className="kt-testimonial-media-inner-wrap">
					<div className={'kadence-testimonial-image-intrisic'}>
						{'icon' === media && icon && (
							<IconRender
								className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${icon}`}
								name={icon}
								size={previewIconSize}
								title={ititle ? ititle : ''}
								strokeWidth={'fe' === icon.substring(0, 2) ? istroke : undefined}
								style={{
									display: 'flex',
									color: color ? KadenceColorOutput(color) : undefined,
								}}
							/>
						)}
						{'icon' !== media && url && (
							<>
								<MediaUpload
									onSelect={(media) => {
										setAttributes({
											id: media.id,
											url: media.url,
											alt: media.alt,
											subtype: media.subtype,
											sizes: media.sizes,
										});
									}}
									type="image"
									value={id ? id : ''}
									allowedTypes={ALLOWED_MEDIA_TYPES}
									render={({ open }) => (
										<Tooltip text={__('Edit Image', 'kadence-blocks')}>
											<Button
												style={{
													backgroundImage: 'url("' + urlOutput + '")',
													backgroundSize:
														'card' === style ? mediaStyles[0].backgroundSize : undefined,
													borderRadius: mediaStyles[0].borderRadius + 'px',
												}}
												className={'kt-testimonial-image'}
												onClick={open}
											/>
										</Tooltip>
									)}
								/>
								<Button
									label={__('Remove Image', 'kadence-blocks')}
									className={'kt-remove-img kt-testimonial-remove-image'}
									onClick={() => {
										setAttributes({
											id: null,
											url: null,
											alt: null,
											subtype: null,
											sizes: null,
										});
									}}
									icon={closeSmall}
									showTooltip={true}
								/>
							</>
						)}
						{'icon' !== media && !url && (
							<Fragment>
								{'card' === style && (
									<KadenceMediaPlaceholder
										onSelect={(media) => {
											setAttributes({
												id: media.id,
												url: media.url,
												alt: media.alt,
												sizes: media.sizes,
												subtype: media.subtype,
											});
										}}
										value={''}
										allowedTypes={ALLOWED_MEDIA_TYPES}
										onSelectURL={(media) => {
											if (media !== url) {
												setAttributes({
													id: null,
													url: media,
													alt: null,
													sizes: null,
													subtype: null,
												});
											}
										}}
										accept="image/*"
										className={'kadence-image-upload'}
									/>
								)}
								{'card' !== style && (
									<MediaUpload
										onSelect={(media) => {
											setAttributes({
												id: media.id,
												url: media.url,
												alt: media.alt,
												sizes: media.sizes,
												subtype: media.subtype,
											});
										}}
										type="image"
										value={''}
										allowedTypes={ALLOWED_MEDIA_TYPES}
										render={({ open }) => (
											<Button
												className="kt-testimonial-image-placeholder"
												aria-label={__('Add Image', 'kadence-blocks')}
												icon={image}
												style={{
													borderRadius: mediaStyles[0].borderRadius + 'px',
												}}
												onClick={open}
											/>
										)}
									/>
								)}
							</Fragment>
						)}
					</div>
				</div>
			</div>
		);
	};

	const renderTestimonialPreview = (isCarousel = false) => {
		return (
			<div className={`kt-testimonial-item-wrap kt-testimonial-item-${uniqueID}`}>
				<div className="kt-testimonial-text-wrap">
					{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon()}
					{displayMedia && ('card' === style || 'inlineimage' === style) && renderTestimonialMedia()}
					{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon()}
					{displayTitle && (
						<div className="kt-testimonial-title-wrap">
							<RichText
								tagName={'h' + titleFont[0].level}
								value={title}
								onChange={(value) => {
									setAttributes({ title: value });
								}}
								placeholder={__('Best product I have ever used!', 'kadence-blocks')}
								className={'kt-testimonial-title'}
							/>
						</div>
					)}
					{displayRating && (
						<div className={`kt-testimonial-rating-wrap kt-testimonial-rating-${rating}`}>
							<IconRender
								className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
								name={'fas_star'}
								size={undefined !== ratingStyles?.[0]?.size ? ratingStyles[0].size : '1em'}
								style={{
									color:
										undefined !== ratingStyles?.[0]?.color
											? KadenceColorOutput(ratingStyles[0].color)
											: undefined,
								}}
							/>
							{rating > 1 && (
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
									name={'fas_star'}
									size={undefined !== ratingStyles?.[0]?.size ? ratingStyles[0].size : '1em'}
									style={{
										color:
											undefined !== ratingStyles?.[0]?.color
												? KadenceColorOutput(ratingStyles[0].color)
												: undefined,
									}}
								/>
							)}
							{rating > 2 && (
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
									name={'fas_star'}
									size={undefined !== ratingStyles?.[0]?.size ? ratingStyles[0].size : '1em'}
									style={{
										color:
											undefined !== ratingStyles?.[0]?.color
												? KadenceColorOutput(ratingStyles[0].color)
												: undefined,
									}}
								/>
							)}
							{rating > 3 && (
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
									name={'fas_star'}
									size={undefined !== ratingStyles?.[0]?.size ? ratingStyles[0].size : '1em'}
									style={{
										color:
											undefined !== ratingStyles?.[0]?.color
												? KadenceColorOutput(ratingStyles[0].color)
												: undefined,
									}}
								/>
							)}
							{rating > 4 && (
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
									name={'fas_star'}
									size={undefined !== ratingStyles?.[0]?.size ? ratingStyles[0].size : '1em'}
									style={{
										color:
											undefined !== ratingStyles?.[0]?.color
												? KadenceColorOutput(ratingStyles[0].color)
												: undefined,
									}}
								/>
							)}
						</div>
					)}
					{displayContent && (
						<div className="kt-testimonial-content-wrap">
							<RichText
								tagName={'div'}
								placeholder={__(
									'I have been looking for a product like this for years. I have tried everything and nothing did what I wanted until using this product. I am so glad I found it!',
									'kadence-blocks'
								)}
								value={content}
								onChange={(value) => {
									setAttributes({ content: value });
								}}
								className={'kt-testimonial-content'}
							/>
						</div>
					)}
				</div>
				{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
					displayOccupation ||
					displayName) && (
					<div className="kt-testimonial-meta-wrap">
						{displayMedia && 'card' !== style && 'inlineimage' !== style && renderTestimonialMedia()}
						<div className="kt-testimonial-meta-name-wrap">
							{displayName && (
								<div className="kt-testimonial-name-wrap">
									<RichText
										tagName={'div'}
										placeholder={__('Sophia Reily', 'kadence-blocks')}
										value={name}
										onChange={(value) => {
											setAttributes({ name: value });
										}}
										className={'kt-testimonial-name'}
									/>
								</div>
							)}
							{displayOccupation && (
								<div className="kt-testimonial-occupation-wrap">
									<RichText
										tagName={'div'}
										placeholder={__('CEO of Company', 'kadence-blocks')}
										value={occupation}
										onChange={(value) => {
											setAttributes({ occupation: value });
										}}
										className={'kt-testimonial-occupation'}
									/>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		);
	};
	return (
		<TestimonialItemWrap {...{ attributes, setAttributes, isSelected, clientId, context, previewDevice }}>
			<div {...blockProps}>
				{showSettings('allSettings') && (
					<>
						<BlockControls>
							<CopyPasteAttributes
								attributes={attributes}
								excludedAttrs={nonTransAttrs}
								defaultAttributes={metadata.attributes}
								blockSlug={metadata.name}
								onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
							/>
						</BlockControls>
						<InspectorControls>
							<SelectParentBlock clientId={clientId} />
							<InspectorControlTabs
								panelName={'icon'}
								allowedTabs={['general', 'advanced']}
								setActiveTab={(value) => setActiveTab(value)}
								activeTab={activeTab}
							/>

							{activeTab === 'general' && (
								<>
									{showSettings('individualSettings', 'kadence/testimonials') && (
										<KadencePanelBody
											title={__('Individual Settings', 'kadence-blocks')}
											initialOpen={true}
											panelName={'kb-testimonials-individual-settings'}
										>
											{renderTestimonialSettings()}
										</KadencePanelBody>
									)}
								</>
							)}

							{activeTab === 'advanced' && (
								<>
									<KadenceBlockDefaults
										attributes={attributes}
										defaultAttributes={metadata.attributes}
										blockSlug={metadata.name}
										excludedAttrs={nonTransAttrs}
									/>
								</>
							)}
						</InspectorControls>
					</>
				)}

				<>{renderTestimonialPreview(true)}</>
			</div>
		</TestimonialItemWrap>
	);
}

export default KadenceTestimonials;
