/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { getBlockDefaultClassName } from '@wordpress/blocks';

export default function save({ attributes }) {
	const {
		url,
		alt,
		caption,
		align,
		link,
		width,
		height,
		id,
		linkTarget,
		linkNoFollow,
		linkSponsored,
		linkTitle,
		showCaption,
		sizeSlug,
		title,
		uniqueID,
		imageFilter,
		useRatio,
		ratio,
		preventLazyLoad,
		overlay,
		overlayOpacity,
		overlayGradient,
		overlayType,
		globalAlt,
		urlSticky,
		idSticky,
		altSticky,
		titleSticky,
		widthSticky,
		heightSticky,
		sizeSlugSticky,
		urlTransparent,
		idTransparent,
		altTransparent,
		titleTransparent,
		widthTransparent,
		heightTransparent,
		sizeSlugTransparent,
	} = attributes;

	const classes = classnames({
		[`align${align}`]: align,
		[`size-${sizeSlug}`]: sizeSlug,
		'is-resized': width || height,
		[`kb-filter-${imageFilter}`]: imageFilter && imageFilter !== 'none',
		[`kb-image-is-ratio-size`]: useRatio,
		'image-is-svg': url && url.endsWith('.svg'),
	});

	const allClasses = classnames({
		[`kb-image${uniqueID}`]: uniqueID,
		[getBlockDefaultClassName('kadence/image')]: getBlockDefaultClassName('kadence/image'),
		[`align${align}`]: align,
		[`size-${sizeSlug}`]: sizeSlug,
		'is-resized': width || height,
		[`kb-filter-${imageFilter}`]: imageFilter && imageFilter !== 'none',
		[`kb-image-is-ratio-size`]: useRatio,
		'image-is-svg': url && url.endsWith('.svg'),
	});

	const containerClasses = classnames({
		[`kb-image${uniqueID}`]: uniqueID,
		[getBlockDefaultClassName('kadence/image')]: getBlockDefaultClassName('kadence/image'),
	});

	const imgClasses = classnames({
		'kb-img': true,
		[`wp-image-${id}`]: id,
		[`skip-lazy`]: preventLazyLoad,
		[`kb-skip-lazy`]: preventLazyLoad,
	});
	const imgClassesSticky = classnames({
		'kb-img': true,
		'kb-img-sticky': true,
		[`wp-image-${idSticky}`]: idSticky,
		[`skip-lazy`]: preventLazyLoad,
		[`kb-skip-lazy`]: preventLazyLoad,
	});
	const imgClassesTransparent = classnames({
		'kb-img': true,
		'kb-img-transparent': true,
		[`wp-image-${idTransparent}`]: idTransparent,
		[`skip-lazy`]: preventLazyLoad,
		[`kb-skip-lazy`]: preventLazyLoad,
	});
	let useOverlay = false;
	if (overlayOpacity && overlay && overlayType && overlayType !== 'gradient') {
		useOverlay = true;
	} else if (overlayOpacity && overlayGradient && overlayType && overlayType === 'gradient') {
		useOverlay = true;
	}
	let relAttr;
	if (linkTarget) {
		relAttr = 'noopener noreferrer';
	}
	if (undefined !== linkNoFollow && true === linkNoFollow) {
		relAttr = relAttr ? relAttr.concat(' nofollow') : 'nofollow';
	}
	if (undefined !== linkSponsored && true === linkSponsored) {
		relAttr = relAttr ? relAttr.concat(' sponsored') : 'sponsored';
	}
	let image = (
		<img src={url} alt={globalAlt ? '' : alt} className={imgClasses} width={width} height={height} title={title} />
	);
	if (useRatio) {
		image = (
			<div
				className={`kb-is-ratio-image kb-image-ratio-${ratio ? ratio : 'land43'}${
					useOverlay ? ' kb-image-has-overlay' : ''
				}`}
			>
				{image}
			</div>
		);
	} else if (useOverlay) {
		image = <div className={`kb-image-has-overlay`}>{image}</div>;
	}

	let imageSticky = (
		<img
			src={urlSticky}
			alt={globalAlt ? '' : altSticky}
			className={imgClassesSticky}
			width={widthSticky}
			height={heightSticky}
			title={titleSticky}
			style={{ display: 'none' }}
		/>
	);
	if (useRatio) {
		imageSticky = (
			<div className={`kb-is-ratio-image kb-image-ratio-${ratio ? ratio : 'land43'}`}>{imageSticky}</div>
		);
	}

	let imageTransparent = (
		<img
			src={urlTransparent}
			alt={globalAlt ? '' : altTransparent}
			className={imgClassesTransparent}
			width={widthTransparent}
			height={heightTransparent}
			title={titleTransparent}
		/>
	);
	if (useRatio) {
		imageTransparent = (
			<div className={`kb-is-ratio-image kb-image-ratio-${ratio ? ratio : 'land43'}`}>{imageTransparent}</div>
		);
	}

	const figure = (
		<>
			{link && true ? (
				<a
					href={link}
					className={'kb-advanced-image-link'}
					target={linkTarget ? '_blank' : undefined}
					aria-label={linkTitle ? linkTitle : undefined}
					rel={relAttr ? relAttr : undefined}
				>
					{image}
					{urlSticky && imageSticky}
					{urlTransparent && imageTransparent}
				</a>
			) : (
				<>
					{image}
					{urlSticky && imageSticky}
					{urlTransparent && imageTransparent}
				</>
			)}
			{!RichText.isEmpty(caption) && showCaption !== false && (
				<RichText.Content tagName="figcaption" value={caption} />
			)}
		</>
	);

	if ('left' === align || 'right' === align || 'center' === align) {
		return (
			<div {...useBlockProps.save({ className: containerClasses })}>
				<figure className={classes}>{figure}</figure>
			</div>
		);
	}

	return <figure {...useBlockProps.save({ className: allClasses })}>{figure}</figure>;
}
