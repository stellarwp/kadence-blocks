/**
 * BLOCK: Kadence Advanced Heading
 *
 * Registering a block with Gutenberg.
 */

/**
 * Import Icons
 */
import { advancedHeadingIcon } from '@kadence/icons';

import classnames from 'classnames';
/**
 * Import Css
 */
import './style.scss';
import edit from './edit';
import metadata from './block.json';
import backwardCompatibility from './deprecated';

/**
 * Internal block libraries
 */
import {
	registerBlockType,
	createBlock,
	getBlockDefaultClassName,
} from '@wordpress/blocks';
import {
	Fragment,
} from '@wordpress/element';
import {
	RichText,
	getColorClassName,
	useBlockProps
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/advancedheading', {
	...metadata,
	title: __( 'Advanced Text', 'kadence-blocks' ),
	description: __( 'Create a heading or paragraph and define sizes for desktop, tablet and mobile along with font family, colors, etc.', 'kadence-blocks' ),
	keywords: [
		__( 'title', 'kadence-blocks' ),
		__( 'heading', 'kadence-blocks' ),
		__( 'text', 'kadence-blocks' ),
		'KB',
	],
	icon: {
		src: advancedHeadingIcon,
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'kadence/advancedheading', {
						content,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/heading' ],
				transform: ( { content, level } ) => {
					return createBlock( 'kadence/advancedheading', {
						content: content,
						level: level,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'core/paragraph', {
						content,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/heading' ],
				transform: ( { content, level } ) => {
					return createBlock( 'core/heading', {
						content: content,
						level: level,
					} );
				},
			},
		],
	},
	edit,
	save: props => {
		const { attributes: { anchor, level, content, colorClass, color, textShadow, letterSpacing, topMargin, bottomMargin, marginType, align, uniqueID, className, kadenceAnimation, kadenceAOSOptions, htmlTag, link, linkNoFollow, linkSponsored, linkTarget, backgroundColorClass, linkStyle } } = props;
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
		//const readyContent = ( link ? `<a href="${link}" class="kb-advanced-heading-link"${ linkTarget ? ' target="_blank"' : '' }${ relAttr ? ` rel="${relAttr}"` : '' }>${content}</a>` : content );
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
	},
	deprecated: backwardCompatibility,
	example: {
		attributes: {
					content: __( 'Example Heading', 'kadence-blocks' ),
		}
	}
} );
