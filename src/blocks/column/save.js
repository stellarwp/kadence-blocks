/**
 * BLOCK: Kadence Section
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Save( { attributes } ) {
	const { id, uniqueID, vsdesk, vstablet, vsmobile, link, linkNoFollow, linkSponsored, linkTarget, linkTitle, htmlTag } = attributes;
	const classes = classnames( {
		[ `inner-column-${ id }` ]: id,
		[ `kadence-column${ uniqueID }` ]: uniqueID,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
		'kb-section-has-link': undefined !== link && '' !== link,
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
	const HtmlTagOut = ( ! htmlTag ? 'div' : htmlTag );
	return (
		<HtmlTagOut { ...useBlockProps.save( { className: classes }) }>
			<div className={ 'kt-inside-inner-col' }>
				<InnerBlocks.Content />
			</div>
			{ link && (
				<a
					href={ link }
					className={ `kb-section-link-overlay` }
					target={ linkTarget ? '_blank' : undefined }
					rel={ relAttr ? relAttr : undefined }
					aria-label={ linkTitle ? linkTitle : undefined }
				>
				</a>
			) }
		</HtmlTagOut>
	);
}
export default Save;
