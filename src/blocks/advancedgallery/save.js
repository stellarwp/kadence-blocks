/**
 * BLOCK: Kadence Advanced Gallery
 */

/**
 * External dependencies
 */
import classnames from 'classnames';
import { Fragment } from '@wordpress/element';
import { RichText, useBlockProps } from '@wordpress/block-editor';

function Save({ attributes }) {
	const {
		uniqueID,
		images,
		columns,
		type,
		linkTo,
		showCaption,
		captionStyle,
		imageRatio,
		imageFilter,
		lightbox,
		lightboxCaption,
		dotStyle,
		transSpeed,
		slidesScroll,
		autoPlay,
		arrowStyle,
		autoSpeed,
		carouselAlign,
		thumbnailColumns,
		thumbnailRatio,
		mobileForceHover,
		kadenceDynamic,
		kbVersion,
	} = attributes;

	if (kbVersion >= 2) {
		return null;
	}
	const dynamicSource = kadenceDynamic && kadenceDynamic.images && kadenceDynamic.images.enable ? true : false;
	if (dynamicSource) {
		return null;
	}
	const galleryClassNames = classnames({
		'kb-gallery-ul': true,
		[`kb-gallery-type-${type}`]: type,
		'kb-masonry-init': 'masonry' === type,
		'kb-mobile-force-hover': mobileForceHover,
		[`kb-gallery-id-${uniqueID}`]: uniqueID,
		[`kb-gallery-caption-style-${captionStyle}`]: captionStyle,
		[`kb-gallery-filter-${imageFilter}`]: imageFilter,
		'kb-gallery-magnific-init': linkTo === 'media' && lightbox === 'magnific',
	});
	const renderThumbImages = (image) => {
		const imgContainClassName = classnames({
			'kb-gallery-image-contain': true,
			'kadence-blocks-gallery-intrinsic':
				((type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider') &&
					imageRatio) ||
				(type !== 'fluidcarousel' && type !== 'tiles' && image.width && image.height),
			[`kb-gallery-image-ratio-${thumbnailRatio}`]:
				thumbnailRatio &&
				(type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider'),
		});
		const img = (
			<div
				className={imgContainClassName}
				style={{
					paddingBottom:
						(type !== 'grid' &&
							type !== 'carousel' &&
							type !== 'fluidcarousel' &&
							type !== 'tiles' &&
							type !== 'slider' &&
							type !== 'thumbslider' &&
							image.width &&
							image.height) ||
						(type === 'grid' && thumbnailRatio === 'inherit' && image.width && image.height)
							? (image.height / image.width) * 100 + '%'
							: undefined,
				}}
			>
				<img
					src={image.thumbUrl || image.url}
					width={image.width}
					height={image.height}
					alt={image.alt}
					data-full-image={image.url}
					data-light-image={image.lightUrl}
					data-id={image.id}
					data-link={image.link}
					data-custom-link={image.customLink}
					data-custom-link-target={image.linkTarget}
					data-sponsored={image.linkSponsored}
					className={image.id ? `wp-image-${image.id}` : null}
				/>
			</div>
		);
		const figClassName = classnames({
			'kb-gallery-thumb-figure': true,
			[`kb-has-image-ratio-${thumbnailRatio}`]:
				thumbnailRatio &&
				(type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider'),
		});
		const imgPack = (
			<Fragment>
				<div
					className="kb-gal-image-radius"
					style={{
						maxWidth:
							(type === 'masonry' && image.width && image.height) ||
							((type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider') &&
								thumbnailRatio === 'inherit' &&
								image.width &&
								image.height)
								? image.width + 'px'
								: undefined,
					}}
				>
					{img}
				</div>
			</Fragment>
		);
		return (
			<li key={image.id || image.url} className="kadence-blocks-gallery-thumb-item">
				<div className="kadence-blocks-gallery-thumb-item-inner">
					<figure className={figClassName}>{imgPack}</figure>
				</div>
			</li>
		);
	};
	const renderGalleryImages = (image) => {
		let href;
		switch (linkTo) {
			case 'media':
				href = image.lightUrl || image.url;
				break;
			case 'custom':
				href = image.customLink ? image.customLink : '';
				break;
			case 'attachment':
				href = image.link;
				break;
		}
		const imgContainClassName = classnames({
			'kb-gallery-image-contain': true,
			'kadence-blocks-gallery-intrinsic':
				((type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider') &&
					imageRatio) ||
				(type !== 'fluidcarousel' && type !== 'tiles' && image.width && image.height),
			[`kb-gallery-image-ratio-${imageRatio}`]:
				imageRatio && (type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider'),
		});
		const img = (
			<div
				className={imgContainClassName}
				style={{
					paddingBottom:
						(type !== 'grid' &&
							type !== 'carousel' &&
							type !== 'fluidcarousel' &&
							type !== 'tiles' &&
							type !== 'slider' &&
							type !== 'thumbslider' &&
							image.width &&
							image.height) ||
						(type === 'grid' && imageRatio === 'inherit' && image.width && image.height)
							? (image.height / image.width) * 100 + '%'
							: undefined,
				}}
			>
				<img
					src={image.thumbUrl || image.url}
					width={image.width}
					height={image.height}
					alt={image.alt}
					data-full-image={image.url}
					data-light-image={image.lightUrl}
					data-id={image.id}
					data-link={image.link}
					data-custom-link={image.customLink}
					data-custom-link-target={image.linkTarget}
					data-sponsored={image.linkSponsored}
					className={`${image.id ? `wp-image-${image.id}` : 'wp-image-'}${
						type === 'carousel' ||
						type === 'fluidcarousel' ||
						type === 'tiles' ||
						type === 'slider' ||
						type === 'thumbslider'
							? ' skip-lazy'
							: ''
					}`}
				/>
			</div>
		);
		const figClassName = classnames({
			'kb-gallery-figure': true,
			'kb-gallery-item-has-link': href,
			'kadence-blocks-gallery-item-has-caption': showCaption && image.caption && image.caption.length > 0,
			'kadence-blocks-gallery-item-hide-caption': !showCaption,
			[`kb-has-image-ratio-${imageRatio}`]:
				imageRatio && (type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider'),
		});
		const FigTag = !href && 'below' === captionStyle ? 'figcaption' : 'div';
		const figcap = (
			<RichText.Content className="kadence-blocks-gallery-item__caption" tagName={FigTag} value={image.caption} />
		);
		const ItemTag =
			type === 'carousel' || type === 'fluidcarousel' || type === 'slider' || type === 'thumbslider'
				? 'div'
				: 'li';
		const imgPack = (
			<Fragment>
				<div
					className="kb-gal-image-radius"
					style={{
						maxWidth:
							(type === 'masonry' && image.width && image.height) ||
							((type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider') &&
								imageRatio === 'inherit' &&
								image.width &&
								image.height)
								? image.width + 'px'
								: undefined,
					}}
				>
					{img}
					{image.caption && image.caption.length > 0 && 'below' !== captionStyle && figcap}
				</div>
				{image.caption && image.caption.length > 0 && 'below' === captionStyle && figcap}
			</Fragment>
		);
		let relAttr;
		if (linkTo === 'custom' && '_blank' === image.linkTarget) {
			relAttr = 'noopener noreferrer';
		}
		if (linkTo === 'custom' && 'sponsored' === image.linkSponsored) {
			relAttr = relAttr ? relAttr.concat(' sponsored') : 'sponsored';
		}
		return (
			<ItemTag key={image.id || image.url} className="kadence-blocks-gallery-item">
				<div className="kadence-blocks-gallery-item-inner">
					<figure className={figClassName}>
						{href ? (
							<a
								href={href}
								className="kb-gallery-item-link"
								target={
									(linkTo === 'custom' && image.linkTarget === '_blank') ||
									(linkTo === 'media' && lightbox === 'new_tab')
										? '_blank'
										: undefined
								}
								rel={relAttr ? relAttr : undefined}
							>
								{imgPack}
							</a>
						) : (
							imgPack
						)}
					</figure>
				</div>
			</ItemTag>
		);
	};

	const blockProps = useBlockProps.save({
		className: `kb-gallery-wrap-id-${uniqueID}`,
	});

	return (
		<div {...blockProps}>
			{type === 'carousel' && (
				<div
					className={galleryClassNames}
					data-image-filter={imageFilter}
					data-lightbox-caption={lightboxCaption ? 'true' : false}
				>
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kb-gallery-carousel kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
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
							{images.map((image, index) => (
								<div className="kb-slide-item kb-gallery-carousel-item" key={index}>
									{renderGalleryImages(image)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			{type === 'fluidcarousel' && (
				<div
					className={galleryClassNames}
					data-image-filter={imageFilter}
					data-lightbox-caption={lightboxCaption ? 'true' : false}
				>
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kb-blocks-fluid-carousel kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}${
								carouselAlign === false ? ' kb-carousel-mode-align-left' : ''
							}`}
							data-slider-anim-speed={transSpeed}
							data-slider-type="fluidcarousel"
							data-slider-scroll="1"
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
							data-slider-center-mode={carouselAlign === false ? 'false' : undefined}
						>
							{images.map((image, index) => (
								<div className="kb-slide-item kb-gallery-carousel-item" key={index}>
									{renderGalleryImages(image)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			{type === 'slider' && (
				<div
					className={galleryClassNames}
					data-image-filter={imageFilter}
					data-lightbox-caption={lightboxCaption ? 'true' : false}
				>
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<div
							className={`kt-blocks-carousel-init kb-blocks-slider kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							data-slider-anim-speed={transSpeed}
							data-slider-type="slider"
							data-slider-scroll="1"
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={'none' === dotStyle ? false : true}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{images.map((image, index) => (
								<div className="kb-slide-item kb-gallery-slide-item" key={index}>
									{renderGalleryImages(image)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			{type === 'thumbslider' && (
				<div
					className={galleryClassNames}
					data-image-filter={imageFilter}
					data-lightbox-caption={lightboxCaption ? 'true' : false}
				>
					<div className={'kt-blocks-carousel kt-carousel-container-dotstyle-none'}>
						<div
							id={`kb-slider-${uniqueID}`}
							className={`kt-blocks-carousel-init kb-gallery-carousel kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-none`}
							data-columns-xxl={thumbnailColumns[0]}
							data-columns-xl={thumbnailColumns[1]}
							data-columns-md={thumbnailColumns[2]}
							data-columns-sm={thumbnailColumns[3]}
							data-columns-xs={thumbnailColumns[4]}
							data-columns-ss={thumbnailColumns[5]}
							data-slider-anim-speed={transSpeed}
							data-slider-type="thumbnail"
							data-slider-nav={`kb-thumb-slider-${uniqueID}`}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={false}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{images.map((image, index) => (
								<div className="kb-slide-item kb-gallery-carousel-item" key={index}>
									{renderGalleryImages(image)}
								</div>
							))}
						</div>
						<div
							id={`kb-thumb-slider-${uniqueID}`}
							className={`kb-gallery-carousel kb-gallery-slider-thumbnails kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-none`}
							data-slider-anim-speed={transSpeed}
							data-slider-type="thumbnail"
							data-slider-nav={`kb-slider-${uniqueID}`}
							data-slider-scroll={slidesScroll}
							data-slider-arrows={'none' === arrowStyle ? false : true}
							data-slider-dots={false}
							data-slider-hover-pause="false"
							data-slider-auto={autoPlay}
							data-slider-speed={autoSpeed}
						>
							{images.map((image, index) => (
								<div className="kb-slide-item kb-gallery-carousel-item" key={index}>
									{renderThumbImages(image)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			{type === 'tiles' && (
				<ul
					className={galleryClassNames}
					data-image-filter={imageFilter}
					data-lightbox-caption={lightboxCaption ? 'true' : false}
				>
					{images.map((image) => {
						return renderGalleryImages(image);
					})}
				</ul>
			)}
			{(type === 'masonry' || type === 'grid') && (
				<ul
					className={galleryClassNames}
					data-item-selector=".kadence-blocks-gallery-item"
					data-image-filter={imageFilter}
					data-lightbox-caption={lightboxCaption ? 'true' : false}
					data-columns-xxl={columns[0]}
					data-columns-xl={columns[1]}
					data-columns-lg={columns[2]}
					data-columns-md={columns[3]}
					data-columns-sm={columns[4]}
					data-columns-xs={columns[5]}
				>
					{images.map((image) => {
						return renderGalleryImages(image);
					})}
				</ul>
			)}
		</div>
	);
}

export default Save;
