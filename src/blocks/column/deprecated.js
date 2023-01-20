/**
 * BLOCK: Kadence Section
 *
 * Registering Deprecations.
 */
/**
 * External dependencies
 */
import classnames from 'classnames';
import { hexToRGBA, KadenceColorOutput } from '@kadence/helpers';

/**
 * Internal dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
/**
 * BLOCK: Kadence Section
 *
 * Registering Deprecations.
 */
export default [
	{
		attributes: {
			id: {
				type: 'number',
				default: 1
			},
			topPadding: {
				type: 'number',
				default: ''
			},
			bottomPadding: {
				type: 'number',
				default: ''
			},
			leftPadding: {
				type: 'number',
				default: ''
			},
			rightPadding: {
				type: 'number',
				default: ''
			},
			topPaddingM: {
				type: 'number',
				default: ''
			},
			bottomPaddingM: {
				type: 'number',
				default: ''
			},
			leftPaddingM: {
				type: 'number',
				default: ''
			},
			rightPaddingM: {
				type: 'number',
				default: ''
			},
			topMargin: {
				type: 'number',
				default: ''
			},
			bottomMargin: {
				type: 'number',
				default: ''
			},
			topMarginM: {
				type: 'number',
				default: ''
			},
			bottomMarginM: {
				type: 'number',
				default: ''
			},
			leftMargin: {
				type: 'number',
				default: ''
			},
			rightMargin: {
				type: 'number',
				default: ''
			},
			leftMarginM: {
				type: 'number',
				default: ''
			},
			rightMarginM: {
				type: 'number',
				default: ''
			},
			zIndex: {
				type: 'number',
				default: ''
			},
			background: {
				type: 'string',
				default: ''
			},
			backgroundOpacity: {
				type: 'number',
				default: 1
			},
			border: {
				type: 'string',
				default: ''
			},
			borderOpacity: {
				type: 'number',
				default: 1
			},
			borderWidth: {
				type: 'array',
				default: [ 0, 0, 0, 0 ]
			},
			tabletBorderWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			mobileBorderWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			borderRadius: {
				type: 'array',
				default: [ 0, 0, 0, 0 ]
			},
			uniqueID: {
				type: 'string',
				default: ''
			},
			collapseOrder: {
				type: 'number'
			},
			backgroundImg: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ]
			},
			textAlign: {
				type: 'array',
				default: [ '', '', '' ]
			},
			textColor: {
				type: 'string',
				default: ''
			},
			linkColor: {
				type: 'string',
				default: ''
			},
			linkHoverColor: {
				type: 'string',
				default: ''
			},
			topPaddingT: {
				type: 'number',
				default: ''
			},
			bottomPaddingT: {
				type: 'number',
				default: ''
			},
			leftPaddingT: {
				type: 'number',
				default: ''
			},
			rightPaddingT: {
				type: 'number',
				default: ''
			},
			topMarginT: {
				type: 'number',
				default: ''
			},
			bottomMarginT: {
				type: 'number',
				default: ''
			},
			leftMarginT: {
				type: 'number',
				default: ''
			},
			rightMarginT: {
				type: 'number',
				default: ''
			},
			displayShadow: {
				type: 'boolean',
				default: false
			},
			shadow: {
				type: 'array',
				default: [ {
					color: '#000000',
					opacity: 0.2,
					spread: 0,
					blur: 14,
					hOffset: 0,
					vOffset: 0,
					inset: false,
				} ]
			},
			noCustomDefaults: {
				type: 'boolean',
				default: false
			},
			vsdesk: {
				type: 'boolean',
				default: false
			},
			vstablet: {
				type: 'boolean',
				default: false
			},
			vsmobile: {
				type: 'boolean',
				default: false
			},
			paddingType: {
				type: 'string',
				default: 'px'
			},
			marginType: {
				type: 'string',
				default: 'px'
			},
			bgColorClass: {
				type: 'string',
				default: ''
			},
			templateLock: {
				type: 'string'
			},
			direction: {
				type: 'array',
				default: [ '', '', '' ]
			},
			justifyContent: {
				type: 'array',
				default: [ '', '', '' ]
			},
			wrapContent: {
				type: 'array',
				default: [ '', '', '' ]
			},
			gutter: {
				type: 'array',
				default: [ '', '', '' ]
			},
			gutterUnit: {
				type: 'string',
				default: 'px'
			},
			verticalAlignment: {
				type: 'string'
			},
			backgroundImgHover: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ]
			},
			backgroundHover: {
				type: 'string',
				default: ''
			},
			overlayOpacity: {
				type: 'number',
				default: 0.3
			},
			overlay: {
				type: 'string',
				default: ''
			},
			overlayImg: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ]
			},
			overlayHoverOpacity: {
				type: 'number',
				default: ''
			},
			overlayHover: {
				type: 'string',
				default: ''
			},
			overlayImgHover: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ]
			},
			overlayGradient: {
				type: 'string',
				default: ''
			},
			overlayGradientHover: {
				type: 'string',
				default: ''
			},
			borderHover: {
				type: 'string',
				default: ''
			},
			borderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			tabletBorderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			mobileBorderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			borderHoverRadius: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			displayHoverShadow: {
				type: 'boolean',
				default: false
			},
			shadowHover: {
				type: 'array',
				default: [ {
					color: '#000000',
					opacity: 0.2,
					spread: 0,
					blur: 14,
					hOffset: 0,
					vOffset: 0,
					inset: false,
				} ]
			},
			textColorHover: {
				type: 'string',
				default: ''
			},
			linkColorHover: {
				type: 'string',
				default: ''
			},
			linkHoverColorHover: {
				type: 'string',
				default: ''
			},
			link: {
				type: 'string',
				default: ''
			},
			linkTitle: {
				type: 'string',
				default: ''
			},
			linkTarget: {
				type: 'boolean',
				default: false
			},
			linkNoFollow: {
				type: 'boolean',
				default: false
			},
			linkSponsored: {
				type: 'boolean',
				default: false
			},
			maxWidth: {
				type: 'array',
				default: [ '', '', '' ]
			},
			maxWidthUnit: {
				type: 'string',
				default: 'px'
			},
			height: {
				type: 'array',
				default: [ '', '', '' ]
			},
			heightUnit: {
				type: 'string',
				default: 'px'
			},
			htmlTag: {
				type: 'string',
				default: 'div'
			},
			inQueryBlock: {
				type: 'boolean',
				default: false
			},
			overlayType: {
				type: 'string',
				default: 'normal'
			},
			sticky: {
				type: 'boolean',
				default: false
			},
			stickyOffset: {
				type: 'array',
				default: [ '', '', '' ]
			},
			stickyOffsetUnit: {
				type: 'string',
				default: 'px'
			},
			kadenceBlockCSS: {
				type: 'string',
				default: '',
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
			kadenceDynamic: {
				type: 'object',
			},
			kadenceConditional: {
				type: 'object',
			},
		},
		supports: {
			anchor: true,
			ktanimate: true,
			ktanimateadd: true,
			ktanimatepreview: true,
			ktanimateswipe: true,
			ktdynamic: true,
			kbcss: true,
			editorsKitBlockNavigator: true
		},
		save: ( { attributes } ) => {
			const { id, uniqueID, vsdesk, vstablet, vsmobile, link, linkNoFollow, linkSponsored, sticky, linkTarget, linkTitle, htmlTag, overlay, overlayImg, overlayHover, overlayImgHover, align, direction, overlayGradient, overlayGradientHover, kadenceAnimation, kadenceAOSOptions } = attributes;
			const hasOverlay = ( overlay || overlayGradient || overlayGradientHover || ( overlayImg && overlayImg[ 0 ] && overlayImg[ 0 ].bgImg ) || overlayHover || ( overlayImgHover && overlayImgHover[ 0 ] && overlayImgHover[ 0 ].bgImg ) ? true : false );
			const deskDirection = ( direction && '' !== direction[ 0 ] ? direction[ 0 ] : false );
			const tabDirection = ( direction && '' !== direction[ 1 ] ? direction[ 1 ] : false );
			const mobileDirection = ( direction && '' !== direction[ 2 ] ? direction[ 2 ] : false );
			const classes = classnames( {
				[ `inner-column-${ id }` ]: id,
				[ `kadence-column${ uniqueID }` ]: uniqueID,
				'kvs-lg-false': vsdesk !== undefined && vsdesk,
				'kvs-md-false': vstablet !== undefined && vstablet,
				'kvs-sm-false': vsmobile !== undefined && vsmobile,
				'kb-section-has-link': undefined !== link && '' !== link,
				'kb-section-is-sticky': undefined !== sticky && sticky,
				'kb-section-has-overlay': undefined !== hasOverlay && hasOverlay,
				[ `align${ align }`] : align === 'full' || align === 'wide',
				[ `kb-section-dir-${ deskDirection }` ]: deskDirection,
				[ `kb-section-md-dir-${ tabDirection }` ]: tabDirection,
				[ `kb-section-sm-dir-${ mobileDirection }` ]: mobileDirection,
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
				<HtmlTagOut { ...useBlockProps.save( { className: classes } ) }
							data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
							data-aos-offset={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
							data-aos-duration={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
							data-aos-delay={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
							data-aos-easing={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
							data-aos-once={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
				>
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
	},
	{
		attributes: {
			id: {
				type: 'number',
				default: 1
			},
			topPadding: {
				type: 'number',
				default: ''
			},
			bottomPadding: {
				type: 'number',
				default: ''
			},
			leftPadding: {
				type: 'number',
				default: ''
			},
			rightPadding: {
				type: 'number',
				default: ''
			},
			topPaddingM: {
				type: 'number',
				default: ''
			},
			bottomPaddingM: {
				type: 'number',
				default: ''
			},
			leftPaddingM: {
				type: 'number',
				default: ''
			},
			rightPaddingM: {
				type: 'number',
				default: ''
			},
			topMargin: {
				type: 'number',
				default: ''
			},
			bottomMargin: {
				type: 'number',
				default: ''
			},
			topMarginM: {
				type: 'number',
				default: ''
			},
			bottomMarginM: {
				type: 'number',
				default: ''
			},
			leftMargin: {
				type: 'number',
				default: ''
			},
			rightMargin: {
				type: 'number',
				default: ''
			},
			leftMarginM: {
				type: 'number',
				default: ''
			},
			rightMarginM: {
				type: 'number',
				default: ''
			},
			zIndex: {
				type: 'number',
				default: ''
			},
			background: {
				type: 'string',
				default: ''
			},
			backgroundOpacity: {
				type: 'number',
				default: 1
			},
			border: {
				type: 'string',
				default: ''
			},
			borderOpacity: {
				type: 'number',
				default: 1
			},
			borderWidth: {
				type: 'array',
				default: [ 0, 0, 0, 0 ]
			},
			tabletBorderWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			mobileBorderWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			borderRadius: {
				type: 'array',
				default: [ 0, 0, 0, 0 ]
			},
			uniqueID: {
				type: 'string',
				default: ''
			},
			collapseOrder: {
				type: 'number'
			},
			backgroundImg: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ]
			},
			textAlign: {
				type: 'array',
				default: [ '', '', '' ]
			},
			textColor: {
				type: 'string',
				default: ''
			},
			linkColor: {
				type: 'string',
				default: ''
			},
			linkHoverColor: {
				type: 'string',
				default: ''
			},
			topPaddingT: {
				type: 'number',
				default: ''
			},
			bottomPaddingT: {
				type: 'number',
				default: ''
			},
			leftPaddingT: {
				type: 'number',
				default: ''
			},
			rightPaddingT: {
				type: 'number',
				default: ''
			},
			topMarginT: {
				type: 'number',
				default: ''
			},
			bottomMarginT: {
				type: 'number',
				default: ''
			},
			leftMarginT: {
				type: 'number',
				default: ''
			},
			rightMarginT: {
				type: 'number',
				default: ''
			},
			displayShadow: {
				type: 'boolean',
				default: false
			},
			shadow: {
				type: 'array',
				default: [ {
					color: '#000000',
					opacity: 0.2,
					spread: 0,
					blur: 14,
					hOffset: 0,
					vOffset: 0,
					inset: false,
				} ]
			},
			noCustomDefaults: {
				type: 'boolean',
				default: false
			},
			vsdesk: {
				type: 'boolean',
				default: false
			},
			vstablet: {
				type: 'boolean',
				default: false
			},
			vsmobile: {
				type: 'boolean',
				default: false
			},
			paddingType: {
				type: 'string',
				default: 'px'
			},
			marginType: {
				type: 'string',
				default: 'px'
			},
			bgColorClass: {
				type: 'string',
				default: ''
			},
			templateLock: {
				type: 'string'
			},
			direction: {
				type: 'array',
				default: [ '', '', '' ]
			},
			justifyContent: {
				type: 'array',
				default: [ '', '', '' ]
			},
			wrapContent: {
				type: 'array',
				default: [ '', '', '' ]
			},
			gutter: {
				type: 'array',
				default: [ '', '', '' ]
			},
			gutterUnit: {
				type: 'string',
				default: 'px'
			},
			verticalAlignment: {
				type: 'string'
			},
			backgroundImgHover: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ]
			},
			backgroundHover: {
				type: 'string',
				default: ''
			},
			overlayOpacity: {
				type: 'number',
				default: 0.3
			},
			overlay: {
				type: 'string',
				default: ''
			},
			overlayImg: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ]
			},
			overlayHoverOpacity: {
				type: 'number',
				default: ''
			},
			overlayHover: {
				type: 'string',
				default: ''
			},
			overlayImgHover: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ]
			},
			borderHover: {
				type: 'string',
				default: ''
			},
			borderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			tabletBorderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			mobileBorderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			borderHoverRadius: {
				type: 'array',
				default: [ '', '', '', '' ]
			},
			displayHoverShadow: {
				type: 'boolean',
				default: false
			},
			shadowHover: {
				type: 'array',
				default: [ {
					color: '#000000',
					opacity: 0.2,
					spread: 0,
					blur: 14,
					hOffset: 0,
					vOffset: 0,
					inset: false,
				} ]
			},
			textColorHover: {
				type: 'string',
				default: ''
			},
			linkColorHover: {
				type: 'string',
				default: ''
			},
			linkHoverColorHover: {
				type: 'string',
				default: ''
			},
			link: {
				type: 'string',
				default: ''
			},
			linkTitle: {
				type: 'string',
				default: ''
			},
			linkTarget: {
				type: 'boolean',
				default: false
			},
			linkNoFollow: {
				type: 'boolean',
				default: false
			},
			linkSponsored: {
				type: 'boolean',
				default: false
			},
			maxWidth: {
				type: 'array',
				default: [ '', '', '' ]
			},
			maxWidthUnit: {
				type: 'string',
				default: 'px'
			},
			height: {
				type: 'array',
				default: [ '', '', '' ]
			},
			heightUnit: {
				type: 'string',
				default: 'px'
			},
			htmlTag: {
				type: 'string',
				default: 'div'
			},
			inQueryBlock: {
				type: 'boolean',
				default: false
			},
			overlayType: {
				type: 'string',
				default: 'normal'
			},
			sticky: {
				type: 'boolean',
				default: false
			},
			stickyOffset: {
				type: 'array',
				default: [ '', '', '' ]
			},
			stickyOffsetUnit: {
				type: 'string',
				default: 'px'
			},
			kadenceBlockCSS: {
				type: 'string',
				default: '',
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
			kadenceDynamic: {
				type: 'object',
			},
			kadenceConditional: {
				type: 'object',
			},
		},
		supports: {
			anchor: true,
			ktanimate: true,
			ktanimateadd: true,
			ktanimatepreview: true,
			ktanimateswipe: true,
			ktdynamic: true,
			kbcss: true,
			editorsKitBlockNavigator: true
		},
		save: ( { attributes } ) => {
			const { id, uniqueID, vsdesk, vstablet, vsmobile, link, linkNoFollow, linkSponsored, sticky, direction, linkTarget, linkTitle, htmlTag, overlay, overlayImg, overlayHover, overlayImgHover, kadenceAnimation, kadenceAOSOptions } = attributes;
			const hasOverlay = ( overlay || ( overlayImg && overlayImg[ 0 ] && overlayImg[ 0 ].bgImg ) || overlayHover || ( overlayImgHover && overlayImgHover[ 0 ] && overlayImgHover[ 0 ].bgImg ) ? true : false );
			const classes = classnames( {
				[ `inner-column-${ id }` ]: id,
				[ `kadence-column${ uniqueID }` ]: uniqueID,
				'kvs-lg-false': vsdesk !== undefined && vsdesk,
				'kvs-md-false': vstablet !== undefined && vstablet,
				'kvs-sm-false': vsmobile !== undefined && vsmobile,
				'kb-section-has-link': undefined !== link && '' !== link,
				'kb-section-is-sticky': undefined !== sticky && sticky,
				'kb-section-has-overlay': undefined !== hasOverlay && hasOverlay,
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
				<HtmlTagOut { ...useBlockProps.save( { className: classes } ) }
							data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
							data-aos-offset={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
							data-aos-duration={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
							data-aos-delay={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
							data-aos-easing={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
							data-aos-once={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
				>
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
	},
	{
		attributes: {
			id: {
				type: 'number',
				default: 1,
			},
			topPadding: {
				type: 'number',
				default: '',
			},
			bottomPadding: {
				type: 'number',
				default: '',
			},
			leftPadding: {
				type: 'number',
				default: '',
			},
			rightPadding: {
				type: 'number',
				default: '',
			},
			topPaddingM: {
				type: 'number',
				default: '',
			},
			bottomPaddingM: {
				type: 'number',
				default: '',
			},
			leftPaddingM: {
				type: 'number',
				default: '',
			},
			rightPaddingM: {
				type: 'number',
				default: '',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			topMarginM: {
				type: 'number',
				default: '',
			},
			bottomMarginM: {
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
			leftMarginM: {
				type: 'number',
				default: '',
			},
			rightMarginM: {
				type: 'number',
				default: '',
			},
			zIndex: {
				type: 'number',
				default: '',
			},
			background: {
				type: 'string',
				default: '',
			},
			backgroundOpacity: {
				type: 'number',
				default: 1,
			},
			border: {
				type: 'string',
				default: '',
			},
			borderOpacity: {
				type: 'number',
				default: 1,
			},
			borderWidth: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			tabletBorderWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobileBorderWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			borderRadius: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
			collapseOrder: {
				type: 'number',
			},
			backgroundImg: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ],
			},
			textAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			textColor: {
				type: 'string',
				default: '',
			},
			linkColor: {
				type: 'string',
				default: '',
			},
			linkHoverColor: {
				type: 'string',
				default: '',
			},
			topPaddingT: {
				type: 'number',
				default: '',
			},
			bottomPaddingT: {
				type: 'number',
				default: '',
			},
			leftPaddingT: {
				type: 'number',
				default: '',
			},
			rightPaddingT: {
				type: 'number',
				default: '',
			},
			topMarginT: {
				type: 'number',
				default: '',
			},
			bottomMarginT: {
				type: 'number',
				default: '',
			},
			leftMarginT: {
				type: 'number',
				default: '',
			},
			rightMarginT: {
				type: 'number',
				default: '',
			},
			displayShadow: {
				type: 'bool',
				default: false,
			},
			shadow: {
				type: 'array',
				default: [ {
					color: '#000000',
					opacity: 0.2,
					spread: 0,
					blur: 14,
					hOffset: 0,
					vOffset: 0,
					inset: false,
				} ],
			},
			noCustomDefaults: {
				type: 'bool',
				default: false,
			},
			vsdesk: {
				type: 'bool',
				default: false,
			},
			vstablet: {
				type: 'bool',
				default: false,
			},
			vsmobile: {
				type: 'bool',
				default: false,
			},
			paddingType: {
				type: 'string',
				default: 'px',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			bgColorClass: {
				type: 'string',
				default: '',
			},
			templateLock: {
				type: 'string',
			},
			direction: {
				type: 'array',
				default: [ '', '', '' ],
			},
			justifyContent: {
				type: 'array',
				default: [ '', '', '' ],
			},
			gutter: {
				type: 'array',
				default: [ '', '', '' ],
			},
			gutterUnit: {
				type: 'string',
				default: 'px',
			},
			verticalAlignment: {
				type: 'string',
			},
			backgroundImgHover: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ],
			},
			backgroundHover: {
				type: 'string',
				default: '',
			},
			borderHover: {
				type: 'string',
				default: '',
			},
			borderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletBorderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobileBorderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			borderHoverRadius: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			displayHoverShadow: {
				type: 'bool',
				default: false,
			},
			shadowHover: {
				type: 'array',
				default: [ {
					color: '#000000',
					opacity: 0.2,
					spread: 0,
					blur: 14,
					hOffset: 0,
					vOffset: 0,
					inset: false,
				} ],
			},
			textColorHover: {
				type: 'string',
				default: '',
			},
			linkColorHover: {
				type: 'string',
				default: '',
			},
			linkHoverColorHover: {
				type: 'string',
				default: '',
			},
			inQueryBlock: {
				type: 'bool',
				default: false,
			},
			kadenceBlockCSS: {
				type: 'string',
				default: '',
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
			kadenceDynamic: {
				type: 'object',
			},
			kadenceConditional: {
				type: 'object',
			},
		},
		supports: {
			anchor: true,
			ktanimate: true,
			ktanimateadd: true,
			ktanimatepreview: true,
			ktanimateswipe: true,
			ktdynamic: true,
			kbcss: true,
			editorsKitBlockNavigator: true
		},
		save: ( { attributes } ) => {
			const { id, background, backgroundOpacity, backgroundImg, uniqueID, vsdesk, vstablet, vsmobile, bgColorClass, kadenceAnimation, kadenceAOSOptions } = attributes;
			const bgImg = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' );
			const backgroundString = ( background && '' === bgImg ? KadenceColorOutput( background, backgroundOpacity ) : undefined );
			const classes = classnames( {
				[ `inner-column-${ id }` ]: id,
				[ `kadence-column${ uniqueID }` ]: uniqueID,
				'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
				'kvs-md-false': vstablet !== 'undefined' && vstablet,
				'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
			} );
			return (
				<div className={ classes }
					 data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
					 data-aos-offset={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
					 data-aos-duration={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
					 data-aos-delay={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
					 data-aos-easing={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
					 data-aos-once={ ( kadenceAnimation && kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
				>
					<div className={ 'kt-inside-inner-col' } style={ {
						background: backgroundString,
					} } >
						<InnerBlocks.Content />
					</div>
				</div>
			);
		}
	},
	{
		attributes: {
			id: {
				type: 'number',
				default: 1,
			},
			topPadding: {
				type: 'number',
				default: '',
			},
			bottomPadding: {
				type: 'number',
				default: '',
			},
			leftPadding: {
				type: 'number',
				default: '',
			},
			rightPadding: {
				type: 'number',
				default: '',
			},
			topPaddingM: {
				type: 'number',
				default: '',
			},
			bottomPaddingM: {
				type: 'number',
				default: '',
			},
			leftPaddingM: {
				type: 'number',
				default: '',
			},
			rightPaddingM: {
				type: 'number',
				default: '',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			topMarginM: {
				type: 'number',
				default: '',
			},
			bottomMarginM: {
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
			leftMarginM: {
				type: 'number',
				default: '',
			},
			rightMarginM: {
				type: 'number',
				default: '',
			},
			zIndex: {
				type: 'number',
				default: '',
			},
			background: {
				type: 'string',
				default: '',
			},
			backgroundOpacity: {
				type: 'number',
				default: 1,
			},
			border: {
				type: 'string',
				default: '',
			},
			borderOpacity: {
				type: 'number',
				default: 1,
			},
			borderWidth: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			tabletBorderWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobileBorderWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			borderRadius: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
			collapseOrder: {
				type: 'number',
			},
			backgroundImg: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ],
			},
			textAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			textColor: {
				type: 'string',
				default: '',
			},
			linkColor: {
				type: 'string',
				default: '',
			},
			linkHoverColor: {
				type: 'string',
				default: '',
			},
			topPaddingT: {
				type: 'number',
				default: '',
			},
			bottomPaddingT: {
				type: 'number',
				default: '',
			},
			leftPaddingT: {
				type: 'number',
				default: '',
			},
			rightPaddingT: {
				type: 'number',
				default: '',
			},
			topMarginT: {
				type: 'number',
				default: '',
			},
			bottomMarginT: {
				type: 'number',
				default: '',
			},
			leftMarginT: {
				type: 'number',
				default: '',
			},
			rightMarginT: {
				type: 'number',
				default: '',
			},
			displayShadow: {
				type: 'bool',
				default: false,
			},
			shadow: {
				type: 'array',
				default: [ {
					color: '#000000',
					opacity: 0.2,
					spread: 0,
					blur: 14,
					hOffset: 0,
					vOffset: 0,
					inset: false,
				} ],
			},
			noCustomDefaults: {
				type: 'bool',
				default: false,
			},
			vsdesk: {
				type: 'bool',
				default: false,
			},
			vstablet: {
				type: 'bool',
				default: false,
			},
			vsmobile: {
				type: 'bool',
				default: false,
			},
			paddingType: {
				type: 'string',
				default: 'px',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			bgColorClass: {
				type: 'string',
				default: '',
			},
			templateLock: {
				type: 'string',
			}
		},
		supports: {
			anchor: true,
			ktanimate: true,
			ktanimateadd: true,
			ktanimatepreview: true,
			ktanimateswipe: true,
			ktdynamic: true,
			kbcss: true,
			editorsKitBlockNavigator: true
		},
		save: ( { attributes } ) => {
			const { id, background, backgroundOpacity, backgroundImg, uniqueID, vsdesk, vstablet, vsmobile } = attributes;
			const bgImg = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' );
			const backgroundString = ( background && '' === bgImg ? KadenceColorOutput( background, backgroundOpacity ) : undefined );
			const classes = classnames( {
				[ `inner-column-${ id }` ]: id,
				[ `kadence-column${ uniqueID }` ]: uniqueID,
				'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
				'kvs-md-false': vstablet !== 'undefined' && vstablet,
				'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
			} );
			return (
				<div className={ classes }>
					<div className={ 'kt-inside-inner-col' } style={ {
						background: backgroundString,
					} } >
						<InnerBlocks.Content />
					</div>
				</div>
			);
		},
	},
	{
		attributes: {
			id: {
				type: 'number',
				default: 1,
			},
			topPadding: {
				type: 'number',
				default: '',
			},
			bottomPadding: {
				type: 'number',
				default: '',
			},
			leftPadding: {
				type: 'number',
				default: '',
			},
			rightPadding: {
				type: 'number',
				default: '',
			},
			topPaddingM: {
				type: 'number',
				default: '',
			},
			bottomPaddingM: {
				type: 'number',
				default: '',
			},
			leftPaddingM: {
				type: 'number',
				default: '',
			},
			rightPaddingM: {
				type: 'number',
				default: '',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			topMarginM: {
				type: 'number',
				default: '',
			},
			bottomMarginM: {
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
			leftMarginM: {
				type: 'number',
				default: '',
			},
			rightMarginM: {
				type: 'number',
				default: '',
			},
			zIndex: {
				type: 'number',
				default: '',
			},
			background: {
				type: 'string',
				default: '',
			},
			backgroundOpacity: {
				type: 'number',
				default: 1,
			},
			border: {
				type: 'string',
				default: '',
			},
			borderOpacity: {
				type: 'number',
				default: 1,
			},
			borderWidth: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			borderRadius: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
			collapseOrder: {
				type: 'number',
			},
			backgroundImg: {
				type: 'array',
				default: [ {
					bgImg: '',
					bgImgID: '',
					bgImgSize: 'cover',
					bgImgPosition: 'center center',
					bgImgAttachment: 'scroll',
					bgImgRepeat: 'no-repeat',
				} ],
			},
			textAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			textColor: {
				type: 'string',
				default: '',
			},
			linkColor: {
				type: 'string',
				default: '',
			},
			linkHoverColor: {
				type: 'string',
				default: '',
			},
			topPaddingT: {
				type: 'number',
				default: '',
			},
			bottomPaddingT: {
				type: 'number',
				default: '',
			},
			leftPaddingT: {
				type: 'number',
				default: '',
			},
			rightPaddingT: {
				type: 'number',
				default: '',
			},
			topMarginT: {
				type: 'number',
				default: '',
			},
			bottomMarginT: {
				type: 'number',
				default: '',
			},
			leftMarginT: {
				type: 'number',
				default: '',
			},
			rightMarginT: {
				type: 'number',
				default: '',
			},
			displayShadow: {
				type: 'bool',
				default: false,
			},
			shadow: {
				type: 'array',
				default: [ {
					color: '#000000',
					opacity: 0.2,
					spread: 0,
					blur: 14,
					hOffset: 0,
					vOffset: 0,
					inset: false,
				} ],
			},
			noCustomDefaults: {
				type: 'bool',
				default: false,
			},
			vsdesk: {
				type: 'bool',
				default: false,
			},
			vstablet: {
				type: 'bool',
				default: false,
			},
			vsmobile: {
				type: 'bool',
				default: false,
			}
		},
		supports: {
			anchor: true,
			ktanimate: true,
			ktanimateadd: true,
			ktanimatepreview: true,
			ktanimateswipe: true,
			ktdynamic: true,
			kbcss: true,
			editorsKitBlockNavigator: true
		},
		save: ( { attributes } ) => {
			const { id, background, backgroundOpacity, backgroundImg, uniqueID } = attributes;
			const bgImg = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' );
			const backgroundString = ( background && '' === bgImg ? KadenceColorOutput( background, backgroundOpacity ) : undefined );
			return (
				<div className={ `inner-column-${ id } kadence-column${ uniqueID }` }>
					<div className={ 'kt-inside-inner-col' } style={ {
						background: backgroundString,
					} } >
						<InnerBlocks.Content />
					</div>
				</div>
			);
		},
	},
	{
		attributes: {
			id: {
				type: 'number',
				default: 1,
			},
			topPadding: {
				type: 'number',
				default: '',
			},
			bottomPadding: {
				type: 'number',
				default: '',
			},
			leftPadding: {
				type: 'number',
				default: '',
			},
			rightPadding: {
				type: 'number',
				default: '',
			},
			topPaddingM: {
				type: 'number',
				default: '',
			},
			bottomPaddingM: {
				type: 'number',
				default: '',
			},
			leftPaddingM: {
				type: 'number',
				default: '',
			},
			rightPaddingM: {
				type: 'number',
				default: '',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			topMarginM: {
				type: 'number',
				default: '',
			},
			bottomMarginM: {
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
			leftMarginM: {
				type: 'number',
				default: '',
			},
			rightMarginM: {
				type: 'number',
				default: '',
			},
			zIndex: {
				type: 'number',
				default: '',
			},
			background: {
				type: 'string',
				default: '',
			},
			backgroundOpacity: {
				type: 'number',
				default: 1,
			},
		},
		save: ( { attributes } ) => {
			const { id, background, backgroundOpacity } = attributes;
			const backgroundString = ( background ? hexToRGBA( background, backgroundOpacity ) : undefined );
			return (
				<div className={ `inner-column-${ id }` }>
					<div className={ 'kt-inside-inner-col' } style={ {
						background: backgroundString,
					} } >
						<InnerBlocks.Content />
					</div>
				</div>
			);
		},
	},
	{
		attributes: {
			id: {
				type: 'number',
				default: 1,
			},
		},
		save: ( { attributes } ) => {
			const { id } = attributes;
			return (
				<div className={ `inner-column-${ id }` }>
					<div className={ 'kt-inside-inner-col' } >
						<InnerBlocks.Content />
					</div>
				</div>
			);
		},
	},
	{
		attributes: {
			id: {
				type: 'number',
				default: 1,
			},
		},
		save: ( { attributes } ) => {
			const { id } = attributes;
			return (
				<div className={ `inner-column-${ id }` }>
					<InnerBlocks.Content />
				</div>
			);
		},
	},
];