/**
 * BLOCK: Kadence Advanced Heading
 *
 * Depreciated.
 */
import classnames from 'classnames';

import { KadenceColorOutput } from '@kadence/helpers';

import {
	Fragment,
} from '@wordpress/element';
import {
	RichText,
	getColorClassName,
	useBlockProps
} from '@wordpress/block-editor';
import {
	getBlockDefaultClassName,
} from '@wordpress/blocks';

export default [
	{
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'h1,h2,h3,h4,h5,h6,p',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: '',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			leftMargin: {
				type: 'number',
				default: '',
			},
			rightMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			tabletMargin: {
				type: 'array',
				default: ['', '', '', ''],
			},
			mobileMargin: {
				type: 'array',
				default: ['', '', '', ''],
			},
			tabletMarginType: {
				type: 'string',
				default: 'px',
			},
			mobileMarginType: {
				type: 'string',
				default: 'px',
			},
			paddingType: {
				type: 'string',
				default: 'px',
			},
			padding: {
				type: 'array',
				default: ['', '', '', ''],
			},
			tabletPadding: {
				type: 'array',
				default: ['', '', '', ''],
			},
			mobilePadding: {
				type: 'array',
				default: ['', '', '', ''],
			},
			markSize: {
				type: 'array',
				default: ['', '', ''],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: ['', '', ''],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: '',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [0, 0, 0, 0],
			},
			markTabPadding: {
				type: 'array',
				default: ['', '', '', ''],
			},
			markMobilePadding: {
				type: 'array',
				default: ['', '', '', ''],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			markTextTransform: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
			},
			colorClass: {
				type: 'string',
			},
			tabletAlign: {
				type: 'string',
			},
			mobileAlign: {
				type: 'string',
			},
			textShadow: {
				type: 'array',
				default: [{
					enable: false,
					color: 'rgba(0, 0, 0, 0.2)',
					blur: 1,
					hOffset: 1,
					vOffset: 1,
				}],
			},
			htmlTag: {
				type: 'string',
				default: 'heading',
			},
			loadItalic: {
				type: 'boolean',
				default: false,
			},
			link: {
				type: 'string',
			},
			linkTarget: {
				type: 'boolean',
				default: false,
			},
			linkNoFollow: {
				type: 'boolean',
				default: false,
			},
			linkSponsored: {
				type: 'boolean',
				default: false,
			},
			background: {
				type: 'string',
			},
			backgroundColorClass: {
				type: 'string',
			},
			linkStyle: {
				type: 'string',
			},
			linkColor: {
				type: 'string',
			},
			linkHoverColor: {
				type: 'string',
			},
			inQueryBlock: {
				type: 'boolean',
				default: false,
			},
		},
		save: (props) => {
			const {
				attributes: {
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
					linkStyle
				}
			} = props;
			const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
			const textColorClass = getColorClassName('color', colorClass);
			const textBackgroundColorClass = getColorClassName('background-color', backgroundColorClass);
			const revealAnimation = (kadenceAnimation && ('reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation) ? true : false);
			const wrapper = (revealAnimation ? true : false);
			const classes = classnames({
				[`kt-adv-heading${uniqueID}`]: uniqueID,
				[className]: !wrapper && !link && className,
				[getBlockDefaultClassName('kadence/advancedheading')]: getBlockDefaultClassName('kadence/advancedheading'),
				[textColorClass]: textColorClass,
				'has-text-color': textColorClass,
				[textBackgroundColorClass]: textBackgroundColorClass,
				'has-background': textBackgroundColorClass,
				[`hls-${linkStyle}`]: !link && linkStyle
			});
			let relAttr;
			if (linkTarget) {
				relAttr = 'noopener noreferrer';
			}
			if (undefined !== linkNoFollow && true === linkNoFollow) {
				relAttr = (relAttr ? relAttr.concat(' nofollow') : 'nofollow');
			}
			if (undefined !== linkSponsored && true === linkSponsored) {
				relAttr = (relAttr ? relAttr.concat(' sponsored') : 'sponsored');
			}
			//const readyContent = ( link ? `<a href="${link}" class="kb-advanced-heading-link"${ linkTarget ? ' target="_blank"' : '' }${ relAttr ? ` rel="${relAttr}"` : '' }>${content}</a>` : content );
			const htmlItem = (
				<RichText.Content
					tagName={tagName}
					id={anchor ? anchor : undefined}
					className={classes}
					data-kb-block={`kb-adv-heading${uniqueID}`}
					data-aos={(kadenceAnimation ? kadenceAnimation : undefined)}
					data-aos-offset={(kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].offset ? kadenceAOSOptions[0].offset : undefined)}
					data-aos-duration={(kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration ? kadenceAOSOptions[0].duration : undefined)}
					data-aos-delay={(kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].delay ? kadenceAOSOptions[0].delay : undefined)}
					data-aos-easing={(kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing ? kadenceAOSOptions[0].easing : undefined)}
					data-aos-once={(kadenceAOSOptions && kadenceAOSOptions[0] && undefined !== kadenceAOSOptions[0].once && '' !== kadenceAOSOptions[0].once ? kadenceAOSOptions[0].once : undefined)}
					value={content}
				/>
			);
			const linkHTMLItem = (
				<a
					href={link}
					className={`kb-advanced-heading-link kt-adv-heading-link${uniqueID}${(!wrapper && className ? ' ' + className : '')}${(linkStyle ? ' hls-' + linkStyle : '')}`}
					target={linkTarget ? '_blank' : undefined}
					rel={relAttr ? relAttr : undefined}
				>
					{htmlItem}
				</a>
			);
			const readyContent = (link ? linkHTMLItem : htmlItem);

			const blockProps = useBlockProps.save({});

			return (
				<Fragment {...blockProps}>
					{wrapper && (
						<div
							className={`kb-adv-heading-wrap${uniqueID} kadence-advanced-heading-wrapper${(revealAnimation ? ' kadence-heading-clip-animation' : '')}${(className ? ' ' + className : '')}`}>
							{readyContent}
						</div>
					)}
					{!wrapper && (
						readyContent
					)}
				</Fragment>
			);
		}
	},
	{
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'h1,h2,h3,h4,h5,h6,p',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: '',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			leftMargin: {
				type: 'number',
				default: '',
			},
			rightMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			tabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletMarginType: {
				type: 'string',
				default: 'px',
			},
			mobileMarginType: {
				type: 'string',
				default: 'px',
			},
			paddingType: {
				type: 'string',
				default: 'px',
			},
			padding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: '',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markTabPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			markTextTransform: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
			},
			colorClass: {
				type: 'string',
			},
			tabletAlign: {
				type: 'string',
			},
			mobileAlign: {
				type: 'string',
			},
			textShadow: {
				type: 'array',
				default: [ {
					enable: false,
					color: 'rgba(0, 0, 0, 0.2)',
					blur: 1,
					hOffset: 1,
					vOffset: 1,
				} ],
			},
			htmlTag: {
				type: 'string',
				default: 'heading',
			},
			loadItalic: {
				type: 'boolean',
				default: false,
			},
			link: {
				type: 'string',
			},
			linkTarget: {
				type: 'boolean',
				default: false,
			},
			linkNoFollow: {
				type: 'boolean',
				default: false,
			},
			linkSponsored: {
				type: 'boolean',
				default: false,
			},
			background: {
				type: 'string',
			},
			backgroundColorClass: {
				type: 'string',
			},
			linkStyle: {
				type: 'string',
			},
			linkColor: {
				type: 'string',
			},
			linkHoverColor: {
				type: 'string',
			},
			inQueryBlock: {
				type: 'boolean',
				default: false,
			},
		},
		save: ( { attributes } ) => {
			const { anchor, level, content, colorClass, color, textShadow, letterSpacing, topMargin, bottomMargin, marginType, align, uniqueID, className, kadenceAnimation, kadenceAOSOptions, htmlTag, link, linkNoFollow, linkSponsored, linkTarget, backgroundColorClass, linkStyle } = attributes;
			const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
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
					relAttr={ relAttr ? relAttr : undefined }
				>
					{ htmlItem }
				</a>
			);
			const readyContent = ( link ? linkHTMLItem : htmlItem );
			return (
				<Fragment>
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
	},
	{
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'h1,h2,h3,h4,h5,h6,p',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			leftMargin: {
				type: 'number',
				default: '',
			},
			rightMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			tabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletMarginType: {
				type: 'string',
				default: 'px',
			},
			mobileMarginType: {
				type: 'string',
				default: 'px',
			},
			paddingType: {
				type: 'string',
				default: 'px',
			},
			padding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markTabPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			markTextTransform: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
			},
			colorClass: {
				type: 'string',
			},
			tabletAlign: {
				type: 'string',
			},
			mobileAlign: {
				type: 'string',
			},
			textShadow: {
				type: 'array',
				default: [ {
					enable: false,
					color: 'rgba(0, 0, 0, 0.2)',
					blur: 1,
					hOffset: 1,
					vOffset: 1,
				} ],
			},
			htmlTag: {
				type: 'string',
				default: 'heading',
			},
			loadItalic: {
				type: 'boolean',
				default: false,
			},
			link: {
				type: 'string',
			},
			linkTarget: {
				type: 'boolean',
				default: false,
			},
			linkNoFollow: {
				type: 'boolean',
				default: false,
			},
			linkSponsored: {
				type: 'boolean',
				default: false,
			},
			background: {
				type: 'string',
			},
			backgroundColorClass: {
				type: 'string',
			},
		},
		save: ( { attributes } ) => {
			const { anchor, level, content, colorClass, color, textShadow, letterSpacing, topMargin, bottomMargin, marginType, align, uniqueID, className, kadenceAnimation, kadenceAOSOptions, htmlTag, link, linkNoFollow, linkSponsored, linkTarget, backgroundColorClass, linkStyle } = attributes;
			const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
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
					className={ 'kb-advanced-heading-link' }
					target={ linkTarget ? '_blank' : undefined }
					relAttr={ relAttr ? relAttr : undefined }
				>
					{ htmlItem }
				</a>
			);
			const readyContent = ( link ? linkHTMLItem : htmlItem );
			return (
				<Fragment>
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
	},
	{
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'h1,h2,h3,h4,h5,h6,p',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			leftMargin: {
				type: 'number',
				default: '',
			},
			rightMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			tabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletMarginType: {
				type: 'string',
				default: 'px',
			},
			mobileMarginType: {
				type: 'string',
				default: 'px',
			},
			paddingType: {
				type: 'string',
				default: 'px',
			},
			padding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markTabPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			markTextTransform: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
			},
			colorClass: {
				type: 'string',
			},
			tabletAlign: {
				type: 'string',
			},
			mobileAlign: {
				type: 'string',
			},
			textShadow: {
				type: 'array',
				default: [ {
					enable: false,
					color: 'rgba(0, 0, 0, 0.2)',
					blur: 1,
					hOffset: 1,
					vOffset: 1,
				} ],
			},
			htmlTag: {
				type: 'string',
				default: 'heading',
			},
			loadItalic: {
				type: 'boolean',
				default: false,
			},
			link: {
				type: 'string',
			},
			linkTarget: {
				type: 'boolean',
				default: false,
			},
			linkNoFollow: {
				type: 'boolean',
				default: false,
			},
			linkSponsored: {
				type: 'boolean',
				default: false,
			},
			background: {
				type: 'string',
			},
			backgroundColorClass: {
				type: 'string',
			},
		},
		save: ( { attributes } ) => {
			const { anchor, level, content, colorClass, color, textShadow, letterSpacing, topMargin, bottomMargin, marginType, align, uniqueID, className, kadenceAnimation, kadenceAOSOptions, htmlTag, link, linkNoFollow, linkSponsored, linkTarget, backgroundColorClass } = attributes;
			const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
			const textColorClass = getColorClassName( 'color', colorClass );
			const textBackgroundColorClass = getColorClassName( 'background-color', backgroundColorClass );
			const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
			const wrapper = ( revealAnimation ? true : false );
			const classes = classnames( {
				[ `kt-adv-heading${ uniqueID }` ]: uniqueID,
				[ className ]: ! wrapper && className,
				[ getBlockDefaultClassName( 'kadence/advancedheading' ) ]: getBlockDefaultClassName( 'kadence/advancedheading' ),
				[ textColorClass ]: textColorClass,
				'has-text-color': textColorClass,
				[ textBackgroundColorClass ]: textBackgroundColorClass,
				'has-background': textBackgroundColorClass,
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
					className={ 'kb-advanced-heading-link' }
					target={ linkTarget ? '_blank' : undefined }
					relAttr={ relAttr ? relAttr : undefined }
				>
					{ htmlItem }
				</a>
			);
			const readyContent = ( link ? linkHTMLItem : htmlItem );
			return (
				<Fragment>
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
	},
	{
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'h1,h2,h3,h4,h5,h6,p',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			leftMargin: {
				type: 'number',
				default: '',
			},
			rightMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			tabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletMarginType: {
				type: 'string',
				default: 'px',
			},
			mobileMarginType: {
				type: 'string',
				default: 'px',
			},
			paddingType: {
				type: 'string',
				default: 'px',
			},
			padding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markTabPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			markTextTransform: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
			},
			colorClass: {
				type: 'string',
			},
			tabletAlign: {
				type: 'string',
			},
			mobileAlign: {
				type: 'string',
			},
			textShadow: {
				type: 'array',
				default: [ {
					enable: false,
					color: 'rgba(0, 0, 0, 0.2)',
					blur: 1,
					hOffset: 1,
					vOffset: 1,
				} ],
			},
			htmlTag: {
				type: 'string',
				default: 'heading',
			},
			loadItalic: {
				type: 'boolean',
				default: false,
			},
		},
		save: ( { attributes } ) => {
			const { anchor, level, content, colorClass, color, textShadow, letterSpacing, topMargin, bottomMargin, marginType, align, uniqueID, className, kadenceAnimation, kadenceAOSOptions, htmlTag } = attributes;
			const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
			const textColorClass = getColorClassName( 'color', colorClass );
			const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
			const wrapper = ( revealAnimation ? true : false );
			const classes = classnames( {
				[ `kt-adv-heading${ uniqueID }` ]: uniqueID,
				[ className ]: ! wrapper && className,
				[ getBlockDefaultClassName( 'kadence/advancedheading' ) ]: getBlockDefaultClassName( 'kadence/advancedheading' ),
				[ textColorClass ]: textColorClass,
			} );
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
			return (
				<Fragment>
					{ wrapper && (
						<div className={ `kb-adv-heading-wrap${ uniqueID } kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }${ ( className ? ' ' + className : '' ) }` }>
							{ htmlItem }
						</div>
					) }
					{ ! wrapper && (
						htmlItem
					) }
				</Fragment>
			);
		}
	},
	{
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'h1,h2,h3,h4,h5,h6,p',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			markTextTransform: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
			},
			colorClass: {
				type: 'string',
			},
			textShadow: {
				type: 'array',
				default: [ {
					enable: false,
					color: 'rgba(0, 0, 0, 0.2)',
					blur: 1,
					hOffset: 1,
					vOffset: 1,
				} ],
			},
			htmlTag: {
				type: 'string',
				default: 'heading',
			},
			kadenceAnimation: {
				type: 'string',
			},
			kadenceAOSOptions: {
				type: 'array',
				default: [ {
					duration: '',
					offset: '',
					easing: '',
					once: '',
					delay: '',
					delayOffset: '',
				} ],
			},
		},
		save: ( { attributes } ) => {
			const { anchor, align, level, content, color, colorClass, textShadow, uniqueID, letterSpacing, topMargin, bottomMargin, marginType, className, kadenceAnimation, kadenceAOSOptions, htmlTag } = attributes;
			//const tagName = 'h' + level;
			const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
			const textColorClass = getColorClassName( 'color', colorClass );
			const mType = ( marginType ? marginType : 'px' );
			let tagId = ( anchor ? anchor : `kt-adv-heading${ uniqueID }` );
			const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
			const wrapper = ( anchor || revealAnimation ? true : false );
			tagId = ( revealAnimation && ! anchor ? `kt-adv-inner-heading${ uniqueID }` : tagId );
			//const classes = ( ! wrapper && className ? `${ className } ${ getBlockDefaultClassName( 'kadence/advancedheading' ) }` : getBlockDefaultClassName( 'kadence/advancedheading' ) );
			const classes = classnames( {
				[ `kt-adv-heading${ uniqueID }` ]: uniqueID,
				[ className ]: ! wrapper && className,
				[ getBlockDefaultClassName( 'kadence/advancedheading' ) ]: getBlockDefaultClassName( 'kadence/advancedheading' ),
				[ textColorClass ]: textColorClass,
			} );
			const htmlItem = (
				<RichText.Content
					tagName={ tagName }
					id={ tagId }
					className={ classes }
					data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
					data-aos-offset={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
					data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
					data-aos-delay={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
					data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
					data-aos-once={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
					style={ {
						textAlign: align,
						color: ! textColorClass && color ? KadenceColorOutput( color ) : undefined,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
						marginTop: ( undefined !== topMargin && '' !== topMargin ? topMargin + mType : undefined ),
						marginBottom: ( undefined !== bottomMargin && '' !== bottomMargin ? bottomMargin + mType : undefined ),
						textShadow: ( undefined !== textShadow && undefined !== textShadow[ 0 ] && undefined !== textShadow[ 0 ].enable && textShadow[ 0 ].enable ? ( undefined !== textShadow[ 0 ].hOffset ? textShadow[ 0 ].hOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].vOffset ? textShadow[ 0 ].vOffset : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].blur ? textShadow[ 0 ].blur : 1 ) + 'px ' + ( undefined !== textShadow[ 0 ].color ? KadenceColorOutput( textShadow[ 0 ].color ) : 'rgba(0,0,0,0.2)' ) : undefined ),
					} }
					value={ content }
				/>
			);
			return (
				<Fragment>
					{ wrapper && (
						<div id={ `kt-adv-heading${ uniqueID }` } className={ `kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }${ ( className ? ' ' + className : '' ) }` }>
							{ htmlItem }
						</div>
					) }
					{ ! wrapper && (
						htmlItem
					) }
				</Fragment>
			);
		},
	},
	{
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'h1,h2,h3,h4,h5,h6',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			markTextTransform: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
			},
		},
		save: ( { attributes } ) => {
			const { anchor, align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType, className, kadenceAnimation, kadenceAOSOptions } = attributes;
			const tagName = 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
			let tagId = ( anchor ? anchor : `kt-adv-heading${ uniqueID }` );
			const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
			const wrapper = ( anchor || revealAnimation ? true : false );
			tagId = ( revealAnimation && ! anchor ? `kt-adv-inner-heading${ uniqueID }` : tagId );
			const classes = ( className ? `${ className } ${ getBlockDefaultClassName( 'kadence/advancedheading' ) }` : getBlockDefaultClassName( 'kadence/advancedheading' ) );
			const htmlItem = (
				<RichText.Content
					tagName={ tagName }
					id={ tagId }
					className={ `kt-adv-heading${ uniqueID } ${ classes }` }
					data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
					data-aos-offset={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
					data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
					data-aos-delay={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
					data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
					data-aos-once={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
					style={ {
						textAlign: align,
						color: color,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
						marginTop: ( undefined !== topMargin && '' !== topMargin ? topMargin + mType : undefined ),
						marginBottom: ( undefined !== bottomMargin && '' !== bottomMargin ? bottomMargin + mType : undefined ),
					} }
					value={ content }
				/>
			);
			return (
				<Fragment>
					{ wrapper && (
						<div id={ `kt-adv-heading${ uniqueID }` } className={ `kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }` }>
							{ htmlItem }
						</div>
					) }
					{ ! wrapper && (
						htmlItem
					) }
				</Fragment>
			);
		},
	},
	{
		attributes: {
			content: {
				type: 'string',
				source: 'html',
				selector: 'h1,h2,h3,h4,h5,h6',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			textTransform: {
				type: 'string',
				default: '',
			},
			markTextTransform: {
				type: 'string',
				default: '',
			},
			anchor: {
				type: 'string',
			},
		},
		save: ( { attributes } ) => {
			const { anchor, align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType, className, kadenceAnimation, kadenceAOSOptions } = attributes;
			const tagName = 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
			let tagId = ( anchor ? anchor : `kt-adv-heading${ uniqueID }` );
			const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
			const wrapper = ( anchor || revealAnimation ? true : false );
			tagId = ( revealAnimation && ! anchor ? `kt-adv-inner-heading${ uniqueID }` : tagId );
			const classes = ( className ? `${ className } ${ getBlockDefaultClassName( 'kadence/advancedheading' ) }` : getBlockDefaultClassName( 'kadence/advancedheading' ) );
			const htmlItem = (
				<RichText.Content
					tagName={ tagName }
					id={ tagId }
					className={ `kt-adv-heading${ uniqueID } ${ classes }` }
					data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
					data-aos-offset={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
					data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
					data-aos-delay={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
					data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
					data-aos-once={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
					style={ {
						textAlign: align,
						color: color,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
						marginTop: ( topMargin ? topMargin + mType : undefined ),
						marginBottom: ( bottomMargin ? bottomMargin + mType : undefined ),
					} }
					value={ content }
				/>
			);
			return (
				<Fragment>
					{ wrapper && (
						<div id={ `kt-adv-heading${ uniqueID }` } className={ `kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }` }>
							{ htmlItem }
						</div>
					) }
					{ ! wrapper && (
						htmlItem
					) }
				</Fragment>
			);
		},
	},
	{
		attributes: {
			content: {
				type: 'array',
				source: 'children',
				selector: 'h1,h2,h3,h4,h5,h6',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			anchor: {
				type: 'string',
			},
		},
		save: ( { attributes } ) => {
			const { anchor, align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType, className, kadenceAnimation, kadenceAOSOptions } = attributes;
			const tagName = 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
			let tagId = ( anchor ? anchor : `kt-adv-heading${ uniqueID }` );
			const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
			const wrapper = ( anchor || revealAnimation ? true : false );
			tagId = ( revealAnimation && ! anchor ? `kt-adv-inner-heading${ uniqueID }` : `kt-adv-heading${ uniqueID }` );
			const classes = ( className ? `${ className } ${ getBlockDefaultClassName( 'kadence/advancedheading' ) }` : getBlockDefaultClassName( 'kadence/advancedheading' ) );
			const htmlItem = (
				<RichText.Content
					tagName={ tagName }
					id={ tagId }
					className={ `kt-adv-heading${ uniqueID } ${ classes }` }
					data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
					data-aos-offset={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
					data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
					data-aos-delay={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
					data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
					data-aos-once={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
					style={ {
						textAlign: align,
						color: color,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
						marginTop: ( topMargin ? topMargin + mType : undefined ),
						marginBottom: ( bottomMargin ? bottomMargin + mType : undefined ),
					} }
					value={ content }
				/>
			);
			return (
				<Fragment>
					{ wrapper && (
						<div id={ `kt-adv-heading${ uniqueID }` } className={ `kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }` }>
							{ htmlItem }
						</div>
					) }
					{ ! wrapper && (
						htmlItem
					) }
				</Fragment>
			);
		},
	},
	{
		attributes: {
			content: {
				type: 'array',
				source: 'children',
				selector: 'h1,h2,h3,h4,h5,h6',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
		},
		save: ( { attributes } ) => {
			const { align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType } = attributes;
			const tagName = 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
			return (
				<RichText.Content
					tagName={ tagName }
					id={ `kt-adv-heading${ uniqueID }` }
					style={ {
						textAlign: align,
						color: color,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
						marginTop: ( topMargin ? topMargin + mType : undefined ),
						marginBottom: ( bottomMargin ? bottomMargin + mType : undefined ),
					} }
					value={ content }
				/>
			);
		},
	},
	{
		attributes: {
			content: {
				type: 'array',
				source: 'children',
				selector: 'h1,h2,h3,h4,h5,h6',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
		},
		save: ( { attributes } ) => {
			const { align, level, content, color, uniqueID, letterSpacing } = attributes;
			const tagName = 'h' + level;
			return (
				<RichText.Content
					tagName={ tagName }
					id={ `kt-adv-heading${ uniqueID }` }
					style={ {
						textAlign: align,
						color: color,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
					} }
					value={ content }
				/>
			);
		},
	},
];
