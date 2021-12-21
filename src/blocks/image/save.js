/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

const {
	registerBlockType,
	createBlock,
	getBlockDefaultClassName,
} = wp.blocks;
const {
	Fragment,
} = wp.element;

/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		url,
		alt,
		caption,
		align,
		rel,
		href,
		width,
		height,
		id,
		linkTarget,
		linkNoFollow,
		linkSponsored,
		showCaption,
		sizeSlug,
		title,
		uniqueID,
		imageFilter,
	} = attributes;

	const newRel = isEmpty( rel ) ? undefined : rel;

	const classes = classnames( {
		[ `kt-image${ uniqueID }` ]: uniqueID,
		[ getBlockDefaultClassName( 'kadence/image' ) ]: getBlockDefaultClassName( 'kadence/image' ),
		[ `align${ align }` ]: align,
		[ `size-${ sizeSlug }` ]: sizeSlug,
		'is-resized': width || height,
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

	const image = (
		<img
			src={ url }
			alt={ alt }
			className={ id ? `kadence-image-${ id }` : null }
			width={ width }
			height={ height }
			title={ title }
		/>
	);

	const figure = (
		<div className={ (imageFilter !== 'none' ? 'filter-' + imageFilter : null)}>
			{ href && true ? (
					<a
						href={ href }
						className={ 'kb-advanced-image-link' }
						target={ linkTarget ? '_blank' : undefined }
						relAttr={ relAttr ? relAttr : undefined }
					>
						{ image }
					</a>
			) : (
				image
			) }
			{ ! RichText.isEmpty( caption ) && showCaption !== false  && (
				<RichText.Content tagName="figcaption" value={ caption } />
			) }
		</div>
	);

	if ( 'left' === align || 'right' === align || 'center' === align ) {
		return (
			<div { ...useBlockProps.save() }>
				<figure className={ classes }>{ figure }</figure>
			</div>
		);
	}

	return (
		<figure { ...useBlockProps.save( { className: classes } ) } >
			{ figure }
		</figure>
	);
}
