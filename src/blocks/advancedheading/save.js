/**
 * BLOCK: Kadence Advanced Heading
 */

/**
 * Internal dependencies
 */
import { IconSpanTag } from '@kadence/components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { getBlockDefaultClassName } from '@wordpress/blocks';
import { Fragment } from '@wordpress/element';
import {
	RichText,
	getColorClassName,
	useBlockProps
} from '@wordpress/block-editor';

function Save( { attributes } ) {
	const {
		anchor,
		level,
		content,
		colorClass,
		color,
		textShadow,
		letterSpacing,
		topMargin,
		bottomMargin,
		marginType,
		align,
		uniqueID,
		className,
		kadenceAnimation,
		kadenceAOSOptions,
		htmlTag,
		link,
		linkNoFollow,
		linkSponsored,
		linkTarget,
		backgroundColorClass,
		linkStyle,
		icon,
		iconColor,
		iconColorHover,
		iconSide,
		iconHover,
		iconPadding,
		tabletIconPadding,
		mobileIconPadding,
		iconSize,
		iconSizeUnit,
		iconPaddingUnit
	} = attributes;
	const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
	const textColorClass = getColorClassName( 'color', colorClass );
	const textBackgroundColorClass = getColorClassName( 'background-color', backgroundColorClass );
	const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
	const wrapper = ( revealAnimation ? true : false );
	const classes = classnames( {
		[ `kt-adv-heading${ uniqueID }` ]: uniqueID,
		[ className ]: ! wrapper && ! link && className,
		[ getBlockDefaultClassName( 'kadence/advancedheading' ) ]: getBlockDefaultClassName( 'kadence/advancedheading' ),
		[ textColorClass ]: textColorClass,
		'has-text-color': textColorClass,
		[ textBackgroundColorClass ]: textBackgroundColorClass,
		'has-background': textBackgroundColorClass,
		[ `hls-${ linkStyle }` ]: ! link && linkStyle
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

	const htmlItem = (
		<RichText.Content
			tagName={ tagName }
			id={ anchor ? anchor : undefined }
			className={ classes }
			data-kb-block={ `kb-adv-heading${ uniqueID }` }
			data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
			data-aos-offset={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
			data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
			data-aos-delay={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
			data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
			data-aos-once={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
			value={ content }
		/>
	);
	const linkHTMLItem = (
		<a
			href={ link }
			className={ `kb-advanced-heading-link kt-adv-heading-link${ uniqueID }${ ( ! wrapper && className ? ' ' + className : '' ) }${ ( linkStyle ? ' hls-' + linkStyle : '' ) }` }
			target={ linkTarget ? '_blank' : undefined }
			rel={ relAttr ? relAttr : undefined }
		>
			{ htmlItem }
		</a>
	);
	const readyContent = ( link ? linkHTMLItem : htmlItem );

	const blockProps = useBlockProps.save( {} );

	return (
		<Fragment {...blockProps}>
			{ wrapper && (
				<div className={ `kb-adv-heading-wrap${ uniqueID } kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }${ ( className ? ' ' + className : '' ) }` }>
					{ readyContent }
				</div>
			) }
			{ ! wrapper && (
				readyContent
			) }
		</Fragment>
	);
}

export default Save;
