/**
 * BLOCK: Kadence Testimonial
 */

/**
 * Import Icons
 */
import { times } from 'lodash';
import { hexToRGBA, KadenceColorOutput, DeprecatedKadenceColorOutput } from '@kadence/helpers';
import { IconRender } from '@kadence/components';
import classnames from 'classnames';

/**
 * Import attributes
 */
import attributes from './attributes';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { migrateToInnerblocks } from './utils';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
const v5 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			displayMedia,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
			containerVAlign,
			containerPaddingType,
		} = attributes;
		const blockProps = useBlockProps.save({
			className: classnames({
				[`wp-block-kadence-testimonials`]: true,
				[`kt-testimonial-halign-${hAlign}`]: true,
				[`kt-testimonial-style-${style}`]: true,
				[`kt-testimonials-media-${displayMedia ? 'on' : 'off'}`]: true,
				[`kt-testimonials-icon-${displayIcon ? 'on' : 'off'}`]: true,
				[`kt-testimonial-columns-${columns[0]}`]: true,
				[`kt-t-xxl-col-${columns[0]}`]: true,
				[`kt-t-xl-col-${columns[1]}`]: true,
				[`kt-t-lg-col-${columns[2]}`]: true,
				[`kt-t-md-col-${columns[3]}`]: true,
				[`kt-t-sm-col-${columns[4]}`]: true,
				[`kt-t-xs-col-${columns[5]}`]: true,
				[`kt-blocks-testimonials-wrap${uniqueID}`]: true,
			}),
		});

		return (
			<div {...blockProps}>
				{layout && layout === 'carousel' && (
					<div
						className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle} kt-carousel-container-arrowstyle-${arrowStyle}`}
					>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							<InnerBlocks.Content />
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						<InnerBlocks.Content />
					</div>
				)}
			</div>
		);
	},
};
const v4 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
			containerVAlign,
			containerPaddingType,
		} = attributes;
		const containerPaddingUnit = containerPaddingType ? containerPaddingType : 'px';
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					KadenceColorOutput(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? KadenceColorOutput(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: KadenceColorOutput('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? KadenceColorOutput(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius:
				undefined !== containerBorderRadius && '' !== containerBorderRadius && !isNaN(containerBorderRadius)
					? containerBorderRadius + 'px'
					: undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			paddingTop:
				containerPadding &&
				undefined !== containerPadding[0] &&
				'' !== containerPadding[0] &&
				null !== containerPadding[0]
					? containerPadding[0] + containerPaddingUnit
					: undefined,
			paddingRight:
				containerPadding &&
				undefined !== containerPadding[1] &&
				'' !== containerPadding[1] &&
				null !== containerPadding[1]
					? containerPadding[1] + containerPaddingUnit
					: undefined,
			paddingBottom:
				containerPadding &&
				undefined !== containerPadding[2] &&
				'' !== containerPadding[2] &&
				null !== containerPadding[2]
					? containerPadding[2] + containerPaddingUnit
					: undefined,
			paddingLeft:
				containerPadding &&
				undefined !== containerPadding[3] &&
				'' !== containerPadding[3] &&
				null !== containerPadding[3]
					? containerPadding[3] + containerPaddingUnit
					: undefined,
			maxWidth:
				'bubble' === style ||
				'inlineimage' === style ||
				undefined === containerMaxWidth ||
				'' === containerMaxWidth
					? undefined
					: containerMaxWidth + 'px',
		};

		const blockProps = useBlockProps.save({
			className: classnames({
				[`wp-block-kadence-testimonials`]: true,
				[`kt-testimonial-halign-${hAlign}`]: true,
				[`kt-testimonial-style-${style}`]: true,
				[`kt-testimonials-media-${displayMedia ? 'on' : 'off'}`]: true,
				[`kt-testimonials-icon-${displayIcon ? 'on' : 'off'}`]: true,
				[`kt-testimonial-columns-${columns[0]}`]: true,
				[`kt-t-xxl-col-${columns[0]}`]: true,
				[`kt-t-xl-col-${columns[1]}`]: true,
				[`kt-t-lg-col-${columns[2]}`]: true,
				[`kt-t-md-col-${columns[3]}`]: true,
				[`kt-t-sm-col-${columns[4]}`]: true,
				[`kt-t-xs-col-${columns[5]}`]: true,
				[`kt-blocks-testimonials-wrap${uniqueID}`]: true,
				'tns-carousel-wrap': layout && layout == 'carousel',
			}),
		});

		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? KadenceColorOutput(iconStyles[0].color) : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? KadenceColorOutput(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? KadenceColorOutput(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: KadenceColorOutput(mediaStyles[0].border),
							backgroundColor: mediaStyles[0].background
								? KadenceColorOutput(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color
											? KadenceColorOutput(testimonials[index].color)
											: undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: "url('" + urlOutput + "')",
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius &&
											'' !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}${
						containerVAlign ? ' testimonial-valign-' + containerVAlign : ''
					}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials?.[index]?.content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials?.[index]?.media && testimonials?.[index]?.url) ||
									('icon' === testimonials?.[index]?.media && testimonials?.[index]?.icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials?.[index]?.name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials?.[index]?.occupation}
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
			<div {...blockProps}>
				{layout && layout === 'carousel' && (
					<div
						className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle} kt-carousel-container-arrowstyle-${arrowStyle}`}
					>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v3 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
			containerVAlign,
			containerPaddingType,
		} = attributes;
		const containerPaddingUnit = containerPaddingType ? containerPaddingType : 'px';
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					KadenceColorOutput(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? KadenceColorOutput(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: KadenceColorOutput('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? KadenceColorOutput(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius:
				undefined !== containerBorderRadius && '' !== containerBorderRadius && !isNaN(containerBorderRadius)
					? containerBorderRadius + 'px'
					: undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			paddingTop:
				containerPadding &&
				undefined !== containerPadding[0] &&
				'' !== containerPadding[0] &&
				null !== containerPadding[0]
					? containerPadding[0] + containerPaddingUnit
					: undefined,
			paddingRight:
				containerPadding &&
				undefined !== containerPadding[1] &&
				'' !== containerPadding[1] &&
				null !== containerPadding[1]
					? containerPadding[1] + containerPaddingUnit
					: undefined,
			paddingBottom:
				containerPadding &&
				undefined !== containerPadding[2] &&
				'' !== containerPadding[2] &&
				null !== containerPadding[2]
					? containerPadding[2] + containerPaddingUnit
					: undefined,
			paddingLeft:
				containerPadding &&
				undefined !== containerPadding[3] &&
				'' !== containerPadding[3] &&
				null !== containerPadding[3]
					? containerPadding[3] + containerPaddingUnit
					: undefined,
			maxWidth:
				'bubble' === style ||
				'inlineimage' === style ||
				undefined === containerMaxWidth ||
				'' === containerMaxWidth
					? undefined
					: containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? KadenceColorOutput(iconStyles[0].color) : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? KadenceColorOutput(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? KadenceColorOutput(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: KadenceColorOutput(mediaStyles[0].border),
							backgroundColor: mediaStyles[0].background
								? KadenceColorOutput(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color
											? KadenceColorOutput(testimonials[index].color)
											: undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: "url('" + urlOutput + "')",
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius &&
											'' !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}${
						containerVAlign ? ' testimonial-valign-' + containerVAlign : ''
					}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials?.[index]?.content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials?.[index]?.media && testimonials?.[index]?.url) ||
									('icon' === testimonials?.[index]?.media && testimonials?.[index]?.icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials?.[index]?.name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials?.[index]?.occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}${
					layout && layout === 'carousel' ? ' tns-carousel-wrap' : ''
				}`}
			>
				{layout && layout === 'carousel' && (
					<div
						className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle} kt-carousel-container-arrowstyle-${arrowStyle}`}
					>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v2 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
			containerVAlign,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					KadenceColorOutput(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? KadenceColorOutput(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: KadenceColorOutput('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? KadenceColorOutput(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius:
				undefined !== containerBorderRadius && '' !== containerBorderRadius && !isNaN(containerBorderRadius)
					? containerBorderRadius + 'px'
					: undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			paddingTop:
				containerPadding &&
				undefined !== containerPadding[0] &&
				'' !== containerPadding[0] &&
				null !== containerPadding[0]
					? containerPadding[0] + 'px'
					: undefined,
			paddingRight:
				containerPadding &&
				undefined !== containerPadding[1] &&
				'' !== containerPadding[1] &&
				null !== containerPadding[1]
					? containerPadding[1] + 'px'
					: undefined,
			paddingBottom:
				containerPadding &&
				undefined !== containerPadding[2] &&
				'' !== containerPadding[2] &&
				null !== containerPadding[2]
					? containerPadding[2] + 'px'
					: undefined,
			paddingLeft:
				containerPadding &&
				undefined !== containerPadding[3] &&
				'' !== containerPadding[3] &&
				null !== containerPadding[3]
					? containerPadding[3] + 'px'
					: undefined,
			maxWidth:
				'bubble' === style ||
				'inlineimage' === style ||
				undefined === containerMaxWidth ||
				'' === containerMaxWidth
					? undefined
					: containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? KadenceColorOutput(iconStyles[0].color) : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? KadenceColorOutput(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? KadenceColorOutput(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: KadenceColorOutput(mediaStyles[0].border),
							backgroundColor: mediaStyles[0].background
								? KadenceColorOutput(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color
											? KadenceColorOutput(testimonials[index].color)
											: undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: "url('" + urlOutput + "')",
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius &&
											'' !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}${
						containerVAlign ? ' testimonial-valign-' + containerVAlign : ''
					}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v1 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
			containerVAlign,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					KadenceColorOutput(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? KadenceColorOutput(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? KadenceColorOutput(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius:
				undefined !== containerBorderRadius && '' !== containerBorderRadius && !isNaN(containerBorderRadius)
					? containerBorderRadius + 'px'
					: undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			paddingTop:
				containerPadding &&
				undefined !== containerPadding[0] &&
				'' !== containerPadding[0] &&
				null !== containerPadding[0]
					? containerPadding[0] + 'px'
					: undefined,
			paddingRight:
				containerPadding &&
				undefined !== containerPadding[1] &&
				'' !== containerPadding[1] &&
				null !== containerPadding[1]
					? containerPadding[1] + 'px'
					: undefined,
			paddingBottom:
				containerPadding &&
				undefined !== containerPadding[2] &&
				'' !== containerPadding[2] &&
				null !== containerPadding[2]
					? containerPadding[2] + 'px'
					: undefined,
			paddingLeft:
				containerPadding &&
				undefined !== containerPadding[3] &&
				'' !== containerPadding[3] &&
				null !== containerPadding[3]
					? containerPadding[3] + 'px'
					: undefined,
			maxWidth:
				'bubble' === style ||
				'inlineimage' === style ||
				undefined === containerMaxWidth ||
				'' === containerMaxWidth
					? undefined
					: containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? KadenceColorOutput(iconStyles[0].color) : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? KadenceColorOutput(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? KadenceColorOutput(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: KadenceColorOutput(mediaStyles[0].border),
							backgroundColor: mediaStyles[0].background
								? KadenceColorOutput(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius && '' !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color
											? KadenceColorOutput(testimonials[index].color)
											: undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: "url('" + urlOutput + "')",
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius &&
											'' !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}${
						containerVAlign ? ' testimonial-valign-' + containerVAlign : ''
					}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
			containerVAlign,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					KadenceColorOutput(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? hexToRGBA(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? KadenceColorOutput(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: !isNaN(containerBorderRadius) ? containerBorderRadius + 'px' : undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			paddingTop:
				containerPadding &&
				undefined !== containerPadding[0] &&
				'' !== containerPadding[0] &&
				null !== containerPadding[0]
					? containerPadding[0] + 'px'
					: undefined,
			paddingRight:
				containerPadding &&
				undefined !== containerPadding[1] &&
				'' !== containerPadding[1] &&
				null !== containerPadding[1]
					? containerPadding[1] + 'px'
					: undefined,
			paddingBottom:
				containerPadding &&
				undefined !== containerPadding[2] &&
				'' !== containerPadding[2] &&
				null !== containerPadding[2]
					? containerPadding[2] + 'px'
					: undefined,
			paddingLeft:
				containerPadding &&
				undefined !== containerPadding[3] &&
				'' !== containerPadding[3] &&
				null !== containerPadding[3]
					? containerPadding[3] + 'px'
					: undefined,
			maxWidth:
				'bubble' === style ||
				'inlineimage' === style ||
				undefined === containerMaxWidth ||
				'' === containerMaxWidth
					? undefined
					: containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? KadenceColorOutput(iconStyles[0].color) : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? KadenceColorOutput(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? KadenceColorOutput(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: KadenceColorOutput(mediaStyles[0].border),
							backgroundColor: mediaStyles[0].background
								? KadenceColorOutput(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color
											? KadenceColorOutput(testimonials[index].color)
											: undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: "url('" + urlOutput + "')",
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius &&
											'' !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}${
						containerVAlign ? ' testimonial-valign-' + containerVAlign : ''
					}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v_1 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					KadenceColorOutput(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? DeprecatedKadenceColorOutput(
						containerBorder,
						undefined !== containerBorderOpacity ? containerBorderOpacity : 1
					)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? KadenceColorOutput(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: containerBorderRadius ? containerBorderRadius + 'px' : undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			paddingTop:
				containerPadding &&
				undefined !== containerPadding[0] &&
				'' !== containerPadding[0] &&
				null !== containerPadding[0]
					? containerPadding[0] + 'px'
					: undefined,
			paddingRight:
				containerPadding &&
				undefined !== containerPadding[1] &&
				'' !== containerPadding[1] &&
				null !== containerPadding[1]
					? containerPadding[1] + 'px'
					: undefined,
			paddingBottom:
				containerPadding &&
				undefined !== containerPadding[2] &&
				'' !== containerPadding[2] &&
				null !== containerPadding[2]
					? containerPadding[2] + 'px'
					: undefined,
			paddingLeft:
				containerPadding &&
				undefined !== containerPadding[3] &&
				'' !== containerPadding[3] &&
				null !== containerPadding[3]
					? containerPadding[3] + 'px'
					: undefined,
			maxWidth:
				'bubble' === style ||
				'inlineimage' === style ||
				undefined === containerMaxWidth ||
				'' === containerMaxWidth
					? undefined
					: containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? KadenceColorOutput(iconStyles[0].color) : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? KadenceColorOutput(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? KadenceColorOutput(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: KadenceColorOutput(mediaStyles[0].border),
							backgroundColor: mediaStyles[0].background
								? KadenceColorOutput(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color
											? KadenceColorOutput(testimonials[index].color)
											: undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: "url('" + urlOutput + "')",
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius &&
											'' !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v_2 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					hexToRGBA(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? hexToRGBA(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? hexToRGBA(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: containerBorderRadius ? containerBorderRadius + 'px' : undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			paddingTop:
				containerPadding &&
				undefined !== containerPadding[0] &&
				'' !== containerPadding[0] &&
				null !== containerPadding[0]
					? containerPadding[0] + 'px'
					: undefined,
			paddingRight:
				containerPadding &&
				undefined !== containerPadding[1] &&
				'' !== containerPadding[1] &&
				null !== containerPadding[1]
					? containerPadding[1] + 'px'
					: undefined,
			paddingBottom:
				containerPadding &&
				undefined !== containerPadding[2] &&
				'' !== containerPadding[2] &&
				null !== containerPadding[2]
					? containerPadding[2] + 'px'
					: undefined,
			paddingLeft:
				containerPadding &&
				undefined !== containerPadding[3] &&
				'' !== containerPadding[3] &&
				null !== containerPadding[3]
					? containerPadding[3] + 'px'
					: undefined,
			maxWidth:
				'bubble' === style ||
				'inlineimage' === style ||
				undefined === containerMaxWidth ||
				'' === containerMaxWidth
					? undefined
					: containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? iconStyles[0].color : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? hexToRGBA(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? hexToRGBA(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: mediaStyles[0].border,
							backgroundColor: mediaStyles[0].background
								? hexToRGBA(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color ? testimonials[index].color : undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: 'url("' + urlOutput + '")',
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius &&
											'' !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v_3 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					hexToRGBA(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? hexToRGBA(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? hexToRGBA(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: containerBorderRadius ? containerBorderRadius + 'px' : undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			paddingTop:
				containerPadding &&
				undefined !== containerPadding[0] &&
				'' !== containerPadding[0] &&
				null !== containerPadding[0]
					? containerPadding[0] + 'px'
					: undefined,
			paddingLeft:
				containerPadding &&
				undefined !== containerPadding[1] &&
				'' !== containerPadding[1] &&
				null !== containerPadding[1]
					? containerPadding[1] + 'px'
					: undefined,
			paddingBottom:
				containerPadding &&
				undefined !== containerPadding[2] &&
				'' !== containerPadding[2] &&
				null !== containerPadding[2]
					? containerPadding[2] + 'px'
					: undefined,
			paddingRight:
				containerPadding &&
				undefined !== containerPadding[3] &&
				'' !== containerPadding[3] &&
				null !== containerPadding[3]
					? containerPadding[3] + 'px'
					: undefined,
			maxWidth:
				'bubble' === style ||
				'inlineimage' === style ||
				undefined === containerMaxWidth ||
				'' === containerMaxWidth
					? undefined
					: containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? iconStyles[0].color : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? hexToRGBA(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? hexToRGBA(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: mediaStyles[0].border,
							backgroundColor: mediaStyles[0].background
								? hexToRGBA(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color ? testimonials[index].color : undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: 'url("' + urlOutput + '")',
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius &&
											'' !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v_4 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					hexToRGBA(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? hexToRGBA(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? hexToRGBA(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: containerBorderRadius ? containerBorderRadius + 'px' : undefined,
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0] && '' !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1] && '' !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2] && '' !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3] && '' !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			padding: containerPadding
				? containerPadding[0] +
					'px ' +
					containerPadding[1] +
					'px ' +
					containerPadding[2] +
					'px ' +
					containerPadding[3] +
					'px'
				: '',
			maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? iconStyles[0].color : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? hexToRGBA(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? hexToRGBA(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: mediaStyles[0].border,
							backgroundColor: mediaStyles[0].background
								? hexToRGBA(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color ? testimonials[index].color : undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: 'url("' + urlOutput + '")',
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v_5 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					hexToRGBA(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? hexToRGBA(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? hexToRGBA(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: containerBorderRadius + 'px',
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			padding: containerPadding
				? containerPadding[0] +
					'px ' +
					containerPadding[1] +
					'px ' +
					containerPadding[2] +
					'px ' +
					containerPadding[3] +
					'px'
				: '',
			maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? iconStyles[0].color : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? hexToRGBA(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? hexToRGBA(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: mediaStyles[0].border,
							backgroundColor: mediaStyles[0].background
								? hexToRGBA(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color ? testimonials[index].color : undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: 'url("' + urlOutput + '")',
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item kb-slide-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v_6 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					hexToRGBA(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? hexToRGBA(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? hexToRGBA(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: containerBorderRadius + 'px',
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			padding: containerPadding
				? containerPadding[0] +
					'px ' +
					containerPadding[1] +
					'px ' +
					containerPadding[2] +
					'px ' +
					containerPadding[3] +
					'px'
				: '',
			maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? iconStyles[0].color : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[0] &&
								null !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[1] &&
								null !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[2] &&
								null !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth &&
								undefined !== iconStyles[0].borderWidth[3] &&
								null !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? hexToRGBA(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? hexToRGBA(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: mediaStyles[0].border,
							backgroundColor: mediaStyles[0].background
								? hexToRGBA(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									'card' === style &&
									(undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
										? mediaStyles[0].ratio + '%'
										: undefined,
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color ? testimonials[index].color : undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: 'url("' + urlOutput + '")',
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v_7 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					hexToRGBA(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? hexToRGBA(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? hexToRGBA(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: containerBorderRadius + 'px',
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			padding: containerPadding
				? containerPadding[0] +
					'px ' +
					containerPadding[1] +
					'px ' +
					containerPadding[2] +
					'px ' +
					containerPadding[3] +
					'px'
				: '',
			maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px',
		};
		const renderTestimonialIcon = (index) => {
			return (
				<div
					className="kt-svg-testimonial-global-icon-wrap"
					style={{
						margin: iconStyles[0].margin
							? iconStyles[0].margin[0] +
								'px ' +
								iconStyles[0].margin[1] +
								'px ' +
								iconStyles[0].margin[2] +
								'px ' +
								iconStyles[0].margin[3] +
								'px'
							: '',
					}}
				>
					<IconRender
						className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
						name={iconStyles[0].icon}
						size={iconStyles[0].size}
						title={iconStyles[0].title ? iconStyles[0].title : ''}
						strokeWidth={'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined}
						style={{
							color: iconStyles[0].color ? iconStyles[0].color : undefined,
							borderRadius:
								undefined !== iconStyles[0].borderRadius
									? iconStyles[0].borderRadius + 'px'
									: undefined,
							borderTopWidth:
								iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[0]
									? iconStyles[0].borderWidth[0] + 'px'
									: undefined,
							borderRightWidth:
								iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[1]
									? iconStyles[0].borderWidth[1] + 'px'
									: undefined,
							borderBottomWidth:
								iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[2]
									? iconStyles[0].borderWidth[2] + 'px'
									: undefined,
							borderLeftWidth:
								iconStyles[0].borderWidth && undefined !== iconStyles[0].borderWidth[3]
									? iconStyles[0].borderWidth[3] + 'px'
									: undefined,
							background: iconStyles[0].background
								? hexToRGBA(
										iconStyles[0].background,
										undefined !== iconStyles[0].backgroundOpacity
											? iconStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderColor: iconStyles[0].border
								? hexToRGBA(
										iconStyles[0].border,
										undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
									)
								: undefined,
							padding: iconStyles[0].padding
								? iconStyles[0].padding[0] +
									'px ' +
									iconStyles[0].padding[1] +
									'px ' +
									iconStyles[0].padding[2] +
									'px ' +
									iconStyles[0].padding[3] +
									'px'
								: '',
						}}
					/>
				</div>
			);
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: mediaStyles[0].border,
							backgroundColor: mediaStyles[0].background
								? hexToRGBA(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius:
								undefined !== mediaStyles[0].borderRadius
									? mediaStyles[0].borderRadius + 'px'
									: undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div
							className={'kadence-testimonial-image-intrisic'}
							style={{
								paddingBottom:
									undefined === mediaStyles[0].ratio || '' === mediaStyles[0].ratio
										? undefined
										: mediaStyles[0].ratio + '%',
							}}
						>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color ? testimonials[index].color : undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: 'url("' + urlOutput + '")',
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius:
											undefined !== mediaStyles[0].borderRadius
												? mediaStyles[0].borderRadius + 'px'
												: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && renderTestimonialIcon(index)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayIcon && iconStyles[0].icon && 'card' === style && renderTestimonialIcon(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-t-xxl-col-${columns[0]} kt-t-xl-col-${columns[1]} kt-t-lg-col-${columns[2]} kt-t-md-col-${
					columns[3]
				} kt-t-sm-col-${columns[4]} kt-t-xs-col-${columns[5]} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
const v_8 = {
	attributes,
	migrate: migrateToInnerblocks,
	supports: {
		anchor: true,
	},
	save: ({ attributes }) => {
		const {
			uniqueID,
			testimonials,
			style,
			hAlign,
			layout,
			itemsCount,
			containerBackground,
			containerBorder,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			mediaStyles,
			displayTitle,
			titleFont,
			displayContent,
			displayName,
			displayMedia,
			displayShadow,
			shadow,
			displayRating,
			ratingStyles,
			displayOccupation,
			containerBackgroundOpacity,
			containerBorderOpacity,
			containerMaxWidth,
			columnGap,
			autoPlay,
			autoSpeed,
			transSpeed,
			slidesScroll,
			arrowStyle,
			dotStyle,
			columns,
			displayIcon,
			iconStyles,
		} = attributes;
		const containerStyles = {
			boxShadow: displayShadow
				? shadow[0].hOffset +
					'px ' +
					shadow[0].vOffset +
					'px ' +
					shadow[0].blur +
					'px ' +
					shadow[0].spread +
					'px ' +
					hexToRGBA(
						undefined !== shadow[0].color && '' !== shadow[0].color ? shadow[0].color : '#000000',
						shadow[0].opacity ? shadow[0].opacity : 0.2
					)
				: undefined,
			borderColor: containerBorder
				? hexToRGBA(containerBorder, undefined !== containerBorderOpacity ? containerBorderOpacity : 1)
				: hexToRGBA('#eeeeee', undefined !== containerBorderOpacity ? containerBorderOpacity : 1),
			background: containerBackground
				? hexToRGBA(
						containerBackground,
						undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
					)
				: undefined,
			borderRadius: containerBorderRadius + 'px',
			borderTopWidth:
				containerBorderWidth && undefined !== containerBorderWidth[0]
					? containerBorderWidth[0] + 'px'
					: undefined,
			borderRightWidth:
				containerBorderWidth && undefined !== containerBorderWidth[1]
					? containerBorderWidth[1] + 'px'
					: undefined,
			borderBottomWidth:
				containerBorderWidth && undefined !== containerBorderWidth[2]
					? containerBorderWidth[2] + 'px'
					: undefined,
			borderLeftWidth:
				containerBorderWidth && undefined !== containerBorderWidth[3]
					? containerBorderWidth[3] + 'px'
					: undefined,
			padding: containerPadding
				? containerPadding[0] +
					'px ' +
					containerPadding[1] +
					'px ' +
					containerPadding[2] +
					'px ' +
					containerPadding[3] +
					'px'
				: '',
			maxWidth: 'bubble' === style || 'inlineimage' === style ? undefined : containerMaxWidth + 'px',
		};
		const renderTestimonialMedia = (index) => {
			let urlOutput = testimonials[index].url;
			if (testimonials[index].sizes && undefined !== testimonials[index].sizes.thumbnail) {
				if (('card' === style && containerMaxWidth > 500) || mediaStyles[0].width > 600) {
					urlOutput = testimonials[index].url;
				} else if ('card' === style && containerMaxWidth <= 500 && containerMaxWidth > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if ('card' === style && containerMaxWidth <= 100) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 600 && mediaStyles[0].width > 100) {
					if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 1000) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 100 && mediaStyles[0].width > 75) {
					if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 200) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				} else if (mediaStyles[0].width <= 75) {
					if (testimonials[index].sizes.thumbnail && testimonials[index].sizes.thumbnail.width > 140) {
						urlOutput = testimonials[index].sizes.thumbnail.url;
					} else if (testimonials[index].sizes.medium && testimonials[index].sizes.medium.width > 140) {
						urlOutput = testimonials[index].sizes.medium.url;
					} else if (testimonials[index].sizes.large && testimonials[index].sizes.large.width > 200) {
						urlOutput = testimonials[index].sizes.large.url;
					}
				}
			}
			return (
				<div className="kt-testimonial-media-wrap">
					<div
						className="kt-testimonial-media-inner-wrap"
						style={{
							width: 'card' !== style ? mediaStyles[0].width + 'px' : undefined,
							borderColor: mediaStyles[0].border,
							backgroundColor: mediaStyles[0].background
								? hexToRGBA(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
									)
								: undefined,
							borderRadius: mediaStyles[0].borderRadius ? mediaStyles[0].borderRadius + 'px' : undefined,
							borderWidth: mediaStyles[0].borderWidth
								? mediaStyles[0].borderWidth[0] +
									'px ' +
									mediaStyles[0].borderWidth[1] +
									'px ' +
									mediaStyles[0].borderWidth[2] +
									'px ' +
									mediaStyles[0].borderWidth[3] +
									'px'
								: '',
							padding: mediaStyles[0].padding
								? mediaStyles[0].padding[0] +
									'px ' +
									mediaStyles[0].padding[1] +
									'px ' +
									mediaStyles[0].padding[2] +
									'px ' +
									mediaStyles[0].padding[3] +
									'px'
								: '',
							marginTop:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[0]
									? mediaStyles[0].margin[0] + 'px'
									: undefined,
							marginRight:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[1]
									? mediaStyles[0].margin[1] + 'px'
									: undefined,
							marginBottom:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[2]
									? mediaStyles[0].margin[2] + 'px'
									: undefined,
							marginLeft:
								mediaStyles[0].margin && '' !== mediaStyles[0].margin[3]
									? mediaStyles[0].margin[3] + 'px'
									: undefined,
						}}
					>
						<div className={'kadence-testimonial-image-intrisic'}>
							{'icon' === testimonials[index].media && testimonials[index].icon && (
								<IconRender
									className={`kt-svg-testimonial-icon kt-svg-testimonial-icon-${testimonials[index].icon}`}
									name={testimonials[index].icon}
									size={testimonials[index].isize}
									title={testimonials[index].ititle ? testimonials[index].ititle : ''}
									strokeWidth={
										'fe' === testimonials[index].icon.substring(0, 2)
											? testimonials[index].istroke
											: undefined
									}
									style={{
										display: 'flex',
										color: testimonials[index].color ? testimonials[index].color : undefined,
									}}
								/>
							)}
							{'icon' !== testimonials[index].media && testimonials[index].url && (
								<div
									className={'kt-testimonial-image'}
									style={{
										backgroundImage: 'url("' + urlOutput + '")',
										backgroundSize: 'card' === style ? mediaStyles[0].backgroundSize : undefined,
										borderRadius: mediaStyles[0].borderRadius
											? mediaStyles[0].borderRadius + 'px'
											: undefined,
									}}
								></div>
							)}
						</div>
					</div>
				</div>
			);
		};
		const renderTestimonialPreview = (index) => {
			return (
				<div
					className={`kt-testimonial-item-wrap kt-testimonial-item-${index}`}
					style={
						'bubble' !== style && 'inlineimage' !== style
							? containerStyles
							: {
									maxWidth: containerMaxWidth + 'px',
									paddingTop:
										displayIcon &&
										iconStyles[0].icon &&
										iconStyles[0].margin &&
										iconStyles[0].margin[0] &&
										iconStyles[0].margin[0] < 0
											? Math.abs(iconStyles[0].margin[0]) + 'px'
											: undefined,
								}
					}
				>
					<div
						className="kt-testimonial-text-wrap"
						style={'bubble' === style || 'inlineimage' === style ? containerStyles : undefined}
					>
						{displayIcon && iconStyles[0].icon && 'card' !== style && (
							<div
								className="kt-svg-testimonial-global-icon-wrap"
								style={{
									margin: iconStyles[0].margin
										? iconStyles[0].margin[0] +
											'px ' +
											iconStyles[0].margin[1] +
											'px ' +
											iconStyles[0].margin[2] +
											'px ' +
											iconStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={`kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-${iconStyles[0].icon}`}
									name={iconStyles[0].icon}
									size={iconStyles[0].size}
									title={iconStyles[0].title ? iconStyles[0].title : ''}
									strokeWidth={
										'fe' === iconStyles[0].icon.substring(0, 2) ? iconStyles[0].stroke : undefined
									}
									style={{
										color: iconStyles[0].color ? iconStyles[0].color : undefined,
										borderRadius: iconStyles[0].borderRadius
											? iconStyles[0].borderRadius + 'px'
											: undefined,
										borderTopWidth:
											iconStyles[0].borderWidth && '' !== iconStyles[0].borderWidth[0]
												? iconStyles[0].borderWidth[0] + 'px'
												: undefined,
										borderRightWidth:
											iconStyles[0].borderWidth && '' !== iconStyles[0].borderWidth[1]
												? iconStyles[0].borderWidth[1] + 'px'
												: undefined,
										borderBottomWidth:
											iconStyles[0].borderWidth && '' !== iconStyles[0].borderWidth[2]
												? iconStyles[0].borderWidth[2] + 'px'
												: undefined,
										borderLeftWidth:
											iconStyles[0].borderWidth && '' !== iconStyles[0].borderWidth[3]
												? iconStyles[0].borderWidth[3] + 'px'
												: undefined,
										background: iconStyles[0].background
											? hexToRGBA(
													iconStyles[0].background,
													undefined !== iconStyles[0].backgroundOpacity
														? iconStyles[0].backgroundOpacity
														: 1
												)
											: undefined,
										borderColor: iconStyles[0].border
											? hexToRGBA(
													iconStyles[0].border,
													undefined !== iconStyles[0].borderOpacity
														? iconStyles[0].borderOpacity
														: 1
												)
											: undefined,
										padding: iconStyles[0].padding
											? iconStyles[0].padding[0] +
												'px ' +
												iconStyles[0].padding[1] +
												'px ' +
												iconStyles[0].padding[2] +
												'px ' +
												iconStyles[0].padding[3] +
												'px'
											: '',
									}}
								/>
							</div>
						)}
						{displayMedia &&
							('card' === style || 'inlineimage' === style) &&
							(('icon' !== testimonials[index].media && testimonials[index].url) ||
								('icon' === testimonials[index].media && testimonials[index].icon)) &&
							renderTestimonialMedia(index)}
						{displayTitle && (
							<div className="kt-testimonial-title-wrap">
								<RichText.Content
									className="kt-testimonial-title"
									tagName={'h' + titleFont[0].level}
									value={testimonials[index].title}
								/>
							</div>
						)}
						{displayRating && (
							<div
								className={`kt-testimonial-rating-wrap kt-testimonial-rating-${testimonials[index].rating}`}
								style={{
									margin: ratingStyles[0].margin
										? ratingStyles[0].margin[0] +
											'px ' +
											ratingStyles[0].margin[1] +
											'px ' +
											ratingStyles[0].margin[2] +
											'px ' +
											ratingStyles[0].margin[3] +
											'px'
										: '',
								}}
							>
								<IconRender
									className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-1'}
									name={'fas_star'}
									size={ratingStyles[0].size}
									style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
								/>
								{testimonials[index].rating > 1 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-2'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 2 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-3'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 3 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-4'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
								{testimonials[index].rating > 4 && (
									<IconRender
										className={'kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-5'}
										name={'fas_star'}
										size={ratingStyles[0].size}
										style={{ color: KadenceColorOutput(ratingStyles[0].color) }}
									/>
								)}
							</div>
						)}
						{displayContent && (
							<div className="kt-testimonial-content-wrap">
								<RichText.Content
									className="kt-testimonial-content"
									tagName={'div'}
									value={testimonials[index].content}
								/>
							</div>
						)}
					</div>
					{((displayMedia && 'card' !== style && 'inlineimage' !== style) ||
						displayOccupation ||
						displayName) && (
						<div className="kt-testimonial-meta-wrap">
							{displayMedia &&
								'card' !== style &&
								'inlineimage' !== style &&
								(('icon' !== testimonials[index].media && testimonials[index].url) ||
									('icon' === testimonials[index].media && testimonials[index].icon)) &&
								renderTestimonialMedia(index)}
							<div className="kt-testimonial-meta-name-wrap">
								{displayName && (
									<div className="kt-testimonial-name-wrap">
										<RichText.Content
											className="kt-testimonial-name"
											tagName={'div'}
											value={testimonials[index].name}
										/>
									</div>
								)}
								{displayOccupation && (
									<div className="kt-testimonial-occupation-wrap">
										<RichText.Content
											className="kt-testimonial-occupation"
											tagName={'div'}
											value={testimonials[index].occupation}
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
			<div
				className={`kt-testimonial-halign-${hAlign} kt-testimonial-style-${style} kt-testimonials-media-${
					displayMedia ? 'on' : 'off'
				} kt-testimonials-icon-${displayIcon ? 'on' : 'off'} kt-testimonial-columns-${
					columns[0]
				} kt-blocks-testimonials-wrap${uniqueID}`}
			>
				{layout && layout === 'carousel' && (
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-columns-xxl={columns[0]}
							data-columns-xl={columns[1]}
							data-columns-md={columns[2]}
							data-columns-sm={columns[3]}
							data-columns-xs={columns[4]}
							data-columns-ss={columns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{times(itemsCount, (n) => (
								<div className="kt-blocks-testimonial-carousel-item" key={n}>
									{renderTestimonialPreview(n)}
								</div>
							))}
						</div>
					</div>
				)}
				{layout && layout !== 'carousel' && (
					<div
						className={'kt-testimonial-grid-wrap'}
						style={{
							'grid-row-gap': columnGap + 'px',
							'grid-column-gap': columnGap + 'px',
						}}
					>
						{times(itemsCount, (n) => renderTestimonialPreview(n))}
					</div>
				)}
			</div>
		);
	},
};
export default [v5, v4, v3, v2, v1, v, v_1, v_2, v_3, v_4, v_5, v_6, v_7, v_8];
