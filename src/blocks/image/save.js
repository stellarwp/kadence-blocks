/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
 import { RichText, useBlockProps } from '@wordpress/block-editor';
 import { getBlockDefaultClassName } from '@wordpress/blocks';

export default function save( { attributes } ) {
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
	} = attributes;

	const classes = classnames( {
		[ `align${ align }` ]: align,
		[ `size-${ sizeSlug }` ]: sizeSlug,
		'is-resized': width || height,
		[ `kb-filter-${ imageFilter }` ]: imageFilter && imageFilter !== 'none',
		[ `kb-image-is-ratio-size` ]: useRatio,
		'image-is-svg': url && url.endsWith( '.svg' ),
	} );

	const allClasses = classnames( {
		[ `kb-image${ uniqueID }` ]: uniqueID,
		[ getBlockDefaultClassName( 'kadence/image' ) ]: getBlockDefaultClassName( 'kadence/image' ),
		[ `align${ align }` ]: align,
		[ `size-${ sizeSlug }` ]: sizeSlug,
		'is-resized': width || height,
		[ `kb-filter-${ imageFilter }` ]: imageFilter && imageFilter !== 'none',
		[ `kb-image-is-ratio-size` ]: useRatio,
		'image-is-svg': url && url.endsWith( '.svg' ),
	} );

	const containerClasses = classnames( {
		[ `kb-image${ uniqueID }` ]: uniqueID,
		[ getBlockDefaultClassName( 'kadence/image' ) ]: getBlockDefaultClassName( 'kadence/image' ),
	} );

	let relAttr;
	if ( linkTarget ) {
		relAttr = 'noopener noreferrer';
	}
	if ( undefined !== linkNoFollow && true === linkNoFollow ) {
		relAttr = ( relAttr ? relAttr.concat( ' nofollow' ) : 'nofollow' );
	}
	if ( undefined !== linkSponsored && true === linkSponsored ) {
		relAttr = ( relAttr ? relAttr.concat( ' sponsored' ) : 'sponsored' );
	}
	let image = (
		<img
			src={ url }
			alt={ alt }
			className={ id ? `kb-img wp-image-${ id }` : 'kb-img' }
			width={ width }
			height={ height }
			title={ title }
		/>
	);
	if ( useRatio ){
		image = <div className={ `kb-is-ratio-image kb-image-ratio-${ ( ratio ? ratio : 'land43' )}` }>{ image }</div>;
	}

	const figure = (
		<>
			{ link && true ? (
					<a
						href={ link }
						className={ 'kb-advanced-image-link' }
						target={ linkTarget ? '_blank' : undefined }
						rel={ relAttr ? relAttr : undefined }
						aria-label={ linkTitle ? linkTitle : undefined }
					>
						{ image }
					</a>
			) : (
				image
			) }
			{ ! RichText.isEmpty( caption ) && showCaption !== false  && (
				<RichText.Content tagName="figcaption" value={ caption } />
			) }
		</>
	);

	if ( 'left' === align || 'right' === align || 'center' === align ) {
		return (
			<div { ...useBlockProps.save( { className: containerClasses }) }>
				<figure className={ classes }>{ figure }</figure>
			</div>
		);
	}

	return (
		<figure { ...useBlockProps.save( { className: allClasses } ) } >
			{ figure }
		</figure>
	);
}
