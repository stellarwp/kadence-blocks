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
		tooltip,
		tooltipPlacement,
		tooltipDash,
	} = attributes;
	const tooltipID = tooltip && uniqueID ? `kb-image-tooltip-${uniqueID}` : undefined;
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
		[`kb-image-tooltip-border`]: !link && tooltipDash && tooltipID,
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
		<img src={url} alt={globalAlt ? '' : alt} className={imgClasses} width={width} height={height} title={title} data-tooltip-id={!link && tooltipID ? tooltipID : undefined} data-tooltip-placement={!link && tooltipID && tooltipPlacement ? tooltipPlacement : undefined} />
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

	const figure = (
		<>
			{link && true ? (
				<a
					href={link}
					className={`kb-advanced-image-link${tooltipDash && tooltipID ? ' kb-image-tooltip-border' : ''}`}
					data-tooltip-id={tooltipID ? tooltipID : undefined}
					data-tooltip-placement={tooltipID && tooltipPlacement ? tooltipPlacement : undefined}
					target={linkTarget ? '_blank' : undefined}
					aria-label={linkTitle ? linkTitle : undefined}
					rel={relAttr ? relAttr : undefined}
				>
					{image}
				</a>
			) : (
				image
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
				{tooltipID && (
					<span
						className={'kb-tooltip-hidden-content'}
						style={{ display: 'none' }}
						id={tooltipID}
						dangerouslySetInnerHTML={{
							__html: tooltip, // Because this is saved into the post as html WordPress core will sanitize it if the user does not have the unfiltered_html capability.
						}}
					/>
				)}
			</div>
		);
	}

	return (
		<figure {...useBlockProps.save({ className: allClasses })}>
			{figure}
			{tooltipID && (
				<span
					className={'kb-tooltip-hidden-content'}
					style={{ display: 'none' }}
					id={tooltipID}
					dangerouslySetInnerHTML={{
						__html: tooltip, // Because this is saved into the post as html WordPress core will sanitize it if the user does not have the unfiltered_html capability.
					}}
				/>
			)}
		</figure>
	);
}
