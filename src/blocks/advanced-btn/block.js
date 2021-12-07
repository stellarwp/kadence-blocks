/**
 * BLOCK: Kadence Advanced Btn
 */
/**
 * External dependencies
 */
import classnames from 'classnames';
import times from 'lodash/times';

/**
 * Internal libraries
 */
import IconRender from '../../components/icons/icon-render';
/**
 * Import Icons
 */
import icons from './icon';

/**
 * Import Css
 */
// import './style.scss';
// import './editor.scss';

import edit from './edit';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const { registerBlockType } = wp.blocks;
import { 
	RichText,
} from '@wordpress/block-editor';
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/advancedbtn', {
	title: __( 'Advanced Button', 'kadence-blocks' ), // Block title.
	description: __( 'Create an advanced button or a row of buttons. Style each one, including hover controls!', 'kadence-blocks' ),
	icon: {
		src: icons.block,
	},
	category: 'kadence-blocks',
	keywords: [
		'KB',
		__( 'Button', 'kadence-blocks' ),
		__( 'Icon', 'kadence-blocks' ),
	],
	supports: {
		ktanimate: true,
		ktanimateadd: true,
		ktanimatepreview: true,
		ktdynamic: true,
	},
	usesContext: [ 'postId', 'queryId' ],
	attributes: {
		hAlign: {
			type: 'string',
			default: 'center',
		},
		thAlign: {
			type: 'string',
			default: '',
		},
		mhAlign: {
			type: 'string',
			default: '',
		},
		btnCount: {
			type: 'number',
			default: 1,
		},
		uniqueID: {
			type: 'string',
			default: '',
		},
		btns: {
			type: 'array',
			default: [ {
				text: '',
				link: '',
				target: '_self',
				size: '',
				paddingBT: '',
				paddingLR: '',
				color: '#555555',
				background: '',
				border: '#555555',
				backgroundOpacity: 1,
				borderOpacity: 1,
				borderRadius: '',
				borderWidth: '',
				colorHover: '#ffffff',
				backgroundHover: '#444444',
				borderHover: '#444444',
				backgroundHoverOpacity: 1,
				borderHoverOpacity: 1,
				icon: '',
				iconSide: 'right',
				iconHover: false,
				cssClass: '',
				noFollow: false,
				gap: 5,
				responsiveSize: [ '', '' ],
				gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
				gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
				btnStyle: 'basic',
				btnSize: 'standard',
				backgroundType: 'solid',
				backgroundHoverType: 'solid',
				width: [ '', '', '' ],
				responsivePaddingBT: [ '', '' ],
				responsivePaddingLR: [ '', '' ],
				boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
				boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
				sponsored: false,
				download: false,
				tabletGap: '',
				mobileGap: '',
				inheritStyles: '',
				iconSize: [ '', '', '' ],
				iconPadding: [ '', '', '', '' ],
				iconTabletPadding: [ '', '', '', '' ],
				iconMobilePadding: [ '', '', '', '' ],
				onlyIcon: [ false, '', '' ],
				iconColor: '',
				iconColorHover: '',
				sizeType: 'px',
				iconSizeType: 'px',
				label: '',
				marginUnit: 'px',
				margin: [ '', '', '', '' ],
				tabletMargin: [ '', '', '', '' ],
				mobileMargin: [ '', '', '', '' ],
				anchor: '',
				borderStyle: '',
			} ],
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
		textTransform: {
			type: 'string',
			default: '',
		},
		widthType: {
			type: 'string',
			default: 'auto',
		},
		widthUnit: {
			type: 'string',
			default: 'px',
		},
		forceFullwidth: {
			type: 'bool',
			default: false,
		},
		collapseFullwidth: {
			type: 'bool',
			default: false,
		},
		margin: {
			type: 'array',
			default: [ {
				desk: [ '', '', '', '' ],
				tablet: [ '', '', '', '' ],
				mobile: [ '', '', '', '' ],
			} ],
		},
		marginUnit: {
			type: 'string',
			default: 'px',
		},
		inQueryBlock: {
			type: 'bool',
			default: false,
		},
	},
	edit,
	save: props => {
		const { attributes: { btnCount, btns, hAlign, uniqueID, letterSpacing, forceFullwidth, thAlign, mhAlign, collapseFullwidth } } = props;
		const renderSaveBtns = ( index ) => {
			let relAttr;
			if ( '_blank' === btns[ index ].target ) {
				relAttr = 'noreferrer noopener';
			}
			if ( true === btns[ index ].noFollow ) {
				relAttr = ( relAttr ? relAttr.concat( ' nofollow' ) : 'nofollow' );
			}
			if ( undefined !== btns[ index ].sponsored && true === btns[ index ].sponsored ) {
				relAttr = ( relAttr ? relAttr.concat( ' sponsored' ) : 'sponsored' );
			}
			let btnSize;
			if ( undefined !== btns[ index ].paddingLR || undefined !== btns[ index ].paddingBT ) {
				btnSize = 'custom';
			} else {
				btnSize = 'standard';
			}
			let globalStyles;
			if ( undefined !== btns[ index ].inheritStyles && '' !== btns[ index ].inheritStyles ) {
				globalStyles = 'kb-btn-global-' + btns[ index ].inheritStyles;
			} else {
				globalStyles = '';
			}
			let themeStyles;
			if ( undefined !== btns[ index ].inheritStyles && 'inherit' === btns[ index ].inheritStyles ) {
				themeStyles = 'wp-block-button__link';
			} else {
				themeStyles = '';
			}
			const btnClasses = classnames( {
				'kt-button': true,
				'button': true,
				[ `kt-btn-${ index }-action` ]: true,
				[ `kt-btn-size-${ ( btns[ index ].btnSize ? btns[ index ].btnSize : btnSize ) }` ]: true,
				[ `kt-btn-style-${ ( btns[ index ].btnStyle ? btns[ index ].btnStyle : 'basic' ) }` ]: true,
				[ `kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) }` ]: true,
				[ `kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) }` ] : true,
				[ `kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }` ]: true,
				'ktblocksvideopop': 'video' === btns[ index ].target,
				[ btns[ index ].cssClass ]: btns[ index ].cssClass,
				[ globalStyles ]: globalStyles,
				[ themeStyles ]: themeStyles,
				[ `kb-btn-only-icon` ]: ( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[0] ),
				[ `kb-btn-tablet-only-icon` ]:( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[1] ),
				[ `kb-btn-mobile-only-icon` ]: ( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[2] ),
			} );
			return (
				<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
					<a id={ btns[ index ].anchor ? btns[ index ].anchor : undefined } className={ btnClasses } aria-label={ btns[ index ].label ? btns[ index ].label : undefined } download={ ( undefined !== btns[ index ].download && true === btns[ index ].download ? '' : undefined ) } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ ( '_blank' === btns[ index ].target ? btns[ index ].target : undefined ) } rel={ relAttr } style={ {
						borderRadius: ( undefined !== btns[ index ].borderRadius && '' !== btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
						borderWidth: ( undefined !== btns[ index ].borderWidth && '' !== btns[ index ].borderWidth ? btns[ index ].borderWidth + 'px' : undefined ),
						letterSpacing: ( undefined !== letterSpacing && '' !== letterSpacing ? letterSpacing + 'px' : undefined ),
					} } >
						{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
							<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ '1em' } />
						) }
						<RichText.Content
							tagName={ 'span' }
							className="kt-btn-inner-text"
							value={ btns[ index ].text }
						/>
						{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
							<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ '1em' } />
						) }
					</a>
				</div>
			);
		};
		return (
			<div className={ `kt-btn-align-${ hAlign } kt-btn-tablet-align-${ ( thAlign ? thAlign : 'inherit' ) } kt-btn-mobile-align-${ ( mhAlign ? mhAlign : 'inherit' ) } kt-btns-wrap kt-btns${ uniqueID }${ ( forceFullwidth ? ' kt-force-btn-fullwidth' : '' ) }${ ( collapseFullwidth ? ' kt-mobile-collapse-btn-fullwidth' : '' ) }` }>
				{ times( btnCount, n => renderSaveBtns( n ) ) }
			</div>
		);
	},
	deprecated: [
		{ 
			attributes: {
				hAlign: {
					type: 'string',
					default: 'center',
				},
				thAlign: {
					type: 'string',
					default: '',
				},
				mhAlign: {
					type: 'string',
					default: '',
				},
				btnCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				btns: {
					type: 'array',
					default: [ {
						text: '',
						link: '',
						target: '_self',
						size: '',
						paddingBT: '',
						paddingLR: '',
						color: '#555555',
						background: '',
						border: '#555555',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: '',
						colorHover: '#ffffff',
						backgroundHover: '#444444',
						borderHover: '#444444',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						noFollow: false,
						gap: 5,
						responsiveSize: [ '', '' ],
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						width: [ '', '', '' ],
						responsivePaddingBT: [ '', '' ],
						responsivePaddingLR: [ '', '' ],
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						sponsored: false,
						download: false,
						tabletGap: '',
						mobileGap: '',
						inheritStyles: '',
						iconSize: [ '', '', '' ],
						iconPadding: [ '', '', '', '' ],
						iconTabletPadding: [ '', '', '', '' ],
						iconMobilePadding: [ '', '', '', '' ],
						onlyIcon: [ false, '', '' ],
						iconColor: '',
						iconColorHover: '',
						sizeType: 'px',
					} ],
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
				textTransform: {
					type: 'string',
					default: '',
				},
				widthType: {
					type: 'string',
					default: 'auto',
				},
				widthUnit: {
					type: 'string',
					default: 'px',
				},
				forceFullwidth: {
					type: 'bool',
					default: false,
				},
				collapseFullwidth: {
					type: 'bool',
					default: false,
				},
				margin: {
					type: 'array',
					default: [ {
						desk: [ '', '', '', '' ],
						tablet: [ '', '', '', '' ],
						mobile: [ '', '', '', '' ],
					} ],
				},
				marginUnit: {
					type: 'string',
					default: 'px',
				},
			},
			save: ( { attributes } ) => {
				const { btnCount, btns, hAlign, uniqueID, letterSpacing, forceFullwidth, thAlign, mhAlign, collapseFullwidth } = attributes;
				const renderSaveBtns = ( index ) => {
					let relAttr;
					if ( '_blank' === btns[ index ].target ) {
						relAttr = 'noreferrer noopener';
					}
					if ( true === btns[ index ].noFollow ) {
						relAttr = ( relAttr ? relAttr.concat( ' nofollow' ) : 'nofollow' );
					}
					if ( undefined !== btns[ index ].sponsored && true === btns[ index ].sponsored ) {
						relAttr = ( relAttr ? relAttr.concat( ' sponsored' ) : 'sponsored' );
					}
					let btnSize;
					if ( undefined !== btns[ index ].paddingLR || undefined !== btns[ index ].paddingBT ) {
						btnSize = 'custom';
					} else {
						btnSize = 'standard';
					}
					let globalStyles;
					if ( undefined !== btns[ index ].inheritStyles && '' !== btns[ index ].inheritStyles ) {
						globalStyles = 'kb-btn-global-' + btns[ index ].inheritStyles;
					} else {
						globalStyles = '';
					}
					let themeStyles;
					if ( undefined !== btns[ index ].inheritStyles && 'inherit' === btns[ index ].inheritStyles ) {
						themeStyles = 'wp-block-button__link';
					} else {
						themeStyles = '';
					}
					const btnClasses = classnames( {
						'kt-button': true,
						'button': true,
						[ `kt-btn-${ index }-action` ]: true,
						[ `kt-btn-size-${ ( btns[ index ].btnSize ? btns[ index ].btnSize : btnSize ) }` ]: true,
						[ `kt-btn-style-${ ( btns[ index ].btnStyle ? btns[ index ].btnStyle : 'basic' ) }` ]: true,
						[ `kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) }` ]: true,
						[ `kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) }` ] : true,
						[ `kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }` ]: true,
						'ktblocksvideopop': 'video' === btns[ index ].target,
						[ btns[ index ].cssClass ]: btns[ index ].cssClass,
						[ globalStyles ]: globalStyles,
						[ themeStyles ]: themeStyles,
						[ `kb-btn-only-icon` ]: ( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[0] ),
						[ `kb-btn-tablet-only-icon` ]:( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[1] ),
						[ `kb-btn-mobile-only-icon` ]: ( btns[ index ].icon && btns[ index ].onlyIcon && btns[ index ].onlyIcon[2] ),
					} );
					return (
						<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
							<a className={ btnClasses } download={ ( undefined !== btns[ index ].download && true === btns[ index ].download ? '' : undefined ) } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ ( '_blank' === btns[ index ].target ? btns[ index ].target : undefined ) } rel={ relAttr } style={ {
								borderRadius: ( undefined !== btns[ index ].borderRadius && '' !== btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
								borderWidth: ( undefined !== btns[ index ].borderWidth && '' !== btns[ index ].borderWidth ? btns[ index ].borderWidth + 'px' : undefined ),
								letterSpacing: ( undefined !== letterSpacing && '' !== letterSpacing ? letterSpacing + 'px' : undefined ),
							} } >
								{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
								<RichText.Content
									tagName={ 'span' }
									className="kt-btn-inner-text"
									value={ btns[ index ].text }
								/>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
							</a>
						</div>
					);
				};
				return (
					<div className={ `kt-btn-align-${ hAlign } kt-btn-tablet-align-${ ( thAlign ? thAlign : 'inherit' ) } kt-btn-mobile-align-${ ( mhAlign ? mhAlign : 'inherit' ) } kt-btns-wrap kt-btns${ uniqueID }${ ( forceFullwidth ? ' kt-force-btn-fullwidth' : '' ) }${ ( collapseFullwidth ? ' kt-mobile-collapse-btn-fullwidth' : '' ) }` }>
						{ times( btnCount, n => renderSaveBtns( n ) ) }
					</div>
				);
			}
		},
		{
			attributes: {
				hAlign: {
					type: 'string',
					default: 'center',
				},
				thAlign: {
					type: 'string',
					default: '',
				},
				mhAlign: {
					type: 'string',
					default: '',
				},
				btnCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				btns: {
					type: 'array',
					default: [ {
						text: '',
						link: '',
						target: '_self',
						size: '',
						paddingBT: '',
						paddingLR: '',
						color: '#555555',
						background: '',
						border: '#555555',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: '',
						colorHover: '#ffffff',
						backgroundHover: '#444444',
						borderHover: '#444444',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						noFollow: false,
						gap: 5,
						responsiveSize: [ '', '' ],
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						width: [ '', '', '' ],
						responsivePaddingBT: [ '', '' ],
						responsivePaddingLR: [ '', '' ],
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
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
				widthType: {
					type: 'string',
					default: 'auto',
				},
				widthUnit: {
					type: 'string',
					default: 'px',
				},
				forceFullwidth: {
					type: 'bool',
					default: false,
				},
			},
			save: ( { attributes } ) => {
				const { btnCount, btns, hAlign, uniqueID, letterSpacing, forceFullwidth, thAlign, mhAlign } = attributes;
				const renderSaveBtns = ( index ) => {
					let relAttr;
					if ( '_blank' === btns[ index ].target && true === btns[ index ].noFollow ) {
						relAttr = 'noreferrer noopener nofollow';
					} else if ( '_blank' === btns[ index ].target ) {
						relAttr = 'noreferrer noopener';
					} else if ( true === btns[ index ].noFollow ) {
						relAttr = 'nofollow';
					} else {
						relAttr = undefined;
					}
					let btnSize;
					if ( undefined !== btns[ index ].paddingLR || undefined !== btns[ index ].paddingBT ) {
						btnSize = 'custom';
					} else {
						btnSize = 'standard';
					}
					return (
						<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
							<a className={ `kt-button kt-btn-${ index }-action kt-btn-size-${ ( btns[ index ].btnSize ? btns[ index ].btnSize : btnSize ) } kt-btn-style-${ ( btns[ index ].btnStyle ? btns[ index ].btnStyle : 'basic' ) } kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) } kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) } kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }${ ( 'video' === btns[ index ].target ? ' ktblocksvideopop' : '' ) }${ ( btns[ index ].cssClass ? ' ' + btns[ index ].cssClass : '' ) }` } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ ( '_blank' === btns[ index ].target ? btns[ index ].target : undefined ) } rel={ relAttr } style={ {
								borderRadius: ( undefined !== btns[ index ].borderRadius && '' !== btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
								borderWidth: ( undefined !== btns[ index ].borderWidth && '' !== btns[ index ].borderWidth ? btns[ index ].borderWidth + 'px' : undefined ),
								letterSpacing: ( undefined !== letterSpacing && '' !== letterSpacing ? letterSpacing + 'px' : undefined ),
							} } >
								{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
								<RichText.Content
									tagName={ 'span' }
									className="kt-btn-inner-text"
									value={ btns[ index ].text }
								/>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
							</a>
						</div>
					);
				};
				return (
					<div className={ `kt-btn-align-${ hAlign } kt-btn-tablet-align-${ ( thAlign ? thAlign : 'inherit' ) } kt-btn-mobile-align-${ ( mhAlign ? mhAlign : 'inherit' ) } kt-btns-wrap kt-btns${ uniqueID }${ ( forceFullwidth ? ' kt-force-btn-fullwidth' : '' ) }` }>
						{ times( btnCount, n => renderSaveBtns( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				hAlign: {
					type: 'string',
					default: 'center',
				},
				btnCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				btns: {
					type: 'array',
					default: [ {
						text: '',
						link: '',
						target: '_self',
						size: 18,
						paddingBT: '',
						paddingLR: '',
						color: '#555555',
						background: 'transparent',
						border: '#555555',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: 3,
						borderWidth: 2,
						colorHover: '#ffffff',
						backgroundHover: '#444444',
						borderHover: '#444444',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						noFollow: false,
						gap: 5,
					} ],
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
				forceFullwidth: {
					type: 'bool',
					default: false,
				},
			},
			save: ( { attributes } ) => {
				const { btnCount, btns, hAlign, uniqueID, letterSpacing, forceFullwidth } = attributes;
				const renderSaveBtns = ( index ) => {
					let relAttr;
					if ( '_blank' === btns[ index ].target && true === btns[ index ].noFollow ) {
						relAttr = 'noreferrer noopener nofollow';
					} else if ( '_blank' === btns[ index ].target ) {
						relAttr = 'noreferrer noopener';
					} else if ( true === btns[ index ].noFollow ) {
						relAttr = 'nofollow';
					} else {
						relAttr = undefined;
					}
					return (
						<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
							<a className={ `kt-button kt-btn-${ index }-action kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) } kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) } kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }${ ( 'video' === btns[ index ].target ? ' ktblocksvideopop' : '' ) }${ ( btns[ index ].cssClass ? ' ' + btns[ index ].cssClass : '' ) }` } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ ( '_blank' === btns[ index ].target ? btns[ index ].target : undefined ) } rel={ relAttr } style={ {
								fontSize: ( btns[ index ].size ? btns[ index ].size + 'px' : undefined ),
								borderRadius: ( btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
								borderWidth: btns[ index ].borderWidth + 'px',
								paddingLeft: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingRight: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingTop: ( btns[ index ].paddingBT ? btns[ index ].paddingBT + 'px' : undefined ),
								paddingBottom: ( btns[ index ].paddingBT ? btns[ index ].paddingBT + 'px' : undefined ),
								letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
							} } >
								{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
							</a>
						</div>
					);
				};
				return (
					<div className={ `kt-btn-align-${ hAlign } kt-btns-wrap kt-btns${ uniqueID }${ ( forceFullwidth ? ' kt-force-btn-fullwidth' : '' ) }` }>
						{ times( btnCount, n => renderSaveBtns( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				hAlign: {
					type: 'string',
					default: 'center',
				},
				btnCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				btns: {
					type: 'array',
					default: [ {
						text: '',
						link: '',
						target: '_self',
						size: 18,
						paddingBT: '',
						paddingLR: '',
						color: '#555555',
						background: 'transparent',
						border: '#555555',
						borderRadius: 3,
						borderWidth: 2,
						colorHover: '#ffffff',
						backgroundHover: '#444444',
						borderHover: '#444444',
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
					} ],
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
				const { btnCount, btns, hAlign, uniqueID, letterSpacing } = attributes;
				const renderSaveBtns = ( index ) => {
					return (
						<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
							<a className={ `kt-button kt-btn-${ index }-action kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) } kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) } kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }${ ( btns[ index ].cssClass ? ' ' + btns[ index ].cssClass : '' ) }` } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ btns[ index ].target } rel={ btns[ index ].target ? 'noopener noreferrer' : undefined } style={ {
								fontSize: ( btns[ index ].size ? btns[ index ].size + 'px' : undefined ),
								borderRadius: ( btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
								borderWidth: btns[ index ].borderWidth + 'px',
								paddingLeft: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingRight: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingTop: ( btns[ index ].paddingBT ? btns[ index ].paddingBT + 'px' : undefined ),
								paddingBottom: ( btns[ index ].paddingBT ? btns[ index ].paddingBT + 'px' : undefined ),
								letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
							} } >
								{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
							</a>
						</div>
					);
				};
				return (
					<div className={ `kt-btn-align-${ hAlign } kt-btns-wrap kt-btns${ uniqueID }` }>
						{ times( btnCount, n => renderSaveBtns( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				hAlign: {
					type: 'string',
					default: 'center',
				},
				btnCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				btns: {
					type: 'array',
					default: [ {
						text: '',
						link: '',
						target: '_self',
						size: 18,
						paddingBT: '',
						paddingLR: '',
						color: '#555555',
						background: 'transparent',
						border: '#555555',
						borderRadius: 3,
						borderWidth: 2,
						colorHover: '#ffffff',
						backgroundHover: '#444444',
						borderHover: '#444444',
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
					} ],
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
				const { btnCount, btns, hAlign, uniqueID, letterSpacing } = attributes;
				const renderSaveBtns = ( index ) => {
					return (
						<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
							<a className={ `kt-button kt-btn-${ index }-action kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) } kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) } kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }${ ( btns[ index ].cssClass ? ' ' + btns[ index ].cssClass : '' ) }` } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ btns[ index ].target } rel={ '_blank' === btns[ index ].target ? 'noreferrer noopener' : undefined } style={ {
								fontSize: ( btns[ index ].size ? btns[ index ].size + 'px' : undefined ),
								borderRadius: ( btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
								borderWidth: btns[ index ].borderWidth + 'px',
								paddingLeft: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingRight: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingTop: ( btns[ index ].paddingBT ? btns[ index ].paddingBT + 'px' : undefined ),
								paddingBottom: ( btns[ index ].paddingBT ? btns[ index ].paddingBT + 'px' : undefined ),
								letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
							} } >
								{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
							</a>
						</div>
					);
				};
				return (
					<div className={ `kt-btn-align-${ hAlign } kt-btns-wrap kt-btns${ uniqueID }` }>
						{ times( btnCount, n => renderSaveBtns( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				hAlign: {
					type: 'string',
					default: 'center',
				},
				btnCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
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
				btns: {
					type: 'array',
					default: [ {
						text: '',
						link: '',
						target: '_self',
						size: 18,
						paddingBT: '',
						paddingLR: '',
						color: '#555555',
						background: 'transparent',
						border: '#555555',
						borderRadius: 3,
						borderWidth: 2,
						colorHover: '#ffffff',
						backgroundHover: '#444444',
						borderHover: '#444444',
						icon: '',
						iconSide: 'right',
						iconHover: false,
					} ],
				},
			},
			save: ( { attributes } ) => {
				const { btnCount, btns, hAlign, uniqueID, letterSpacing } = attributes;
				const renderSaveBtns = ( index ) => {
					return (
						<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
							<a className={ `kt-button kt-btn-${ index }-action kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) } kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) } kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }` } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ btns[ index ].target } style={ {
								fontSize: ( btns[ index ].size ? btns[ index ].size + 'px' : undefined ),
								borderRadius: ( btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
								borderWidth: btns[ index ].borderWidth + 'px',
								paddingLeft: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingRight: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingTop: ( btns[ index ].paddingTB ? btns[ index ].paddingTB + 'px' : undefined ),
								paddingBottom: ( btns[ index ].paddingTB ? btns[ index ].paddingTB + 'px' : undefined ),
								letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
							} } >
								{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
							</a>
						</div>
					);
				};
				return (
					<div className={ `kt-btn-align-${ hAlign } kt-btns-wrap kt-btns${ uniqueID }` }>
						{ times( btnCount, n => renderSaveBtns( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				hAlign: {
					type: 'string',
					default: 'center',
				},
				btnCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				btns: {
					type: 'array',
					default: [ {
						text: '',
						link: '',
						target: '_self',
						size: 18,
						paddingBT: '',
						paddingLR: '',
						color: '#555555',
						background: 'transparent',
						border: '#555555',
						borderRadius: 3,
						borderWidth: 2,
						colorHover: '#ffffff',
						backgroundHover: '#444444',
						borderHover: '#444444',
						icon: '',
						iconSide: 'right',
						iconHover: false,
					} ],
				},
			},
			save: ( { attributes } ) => {
				const { btnCount, btns, hAlign, uniqueID } = attributes;
				const renderSaveBtns = ( index ) => {
					return (
						<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
							<a className={ `kt-button kt-btn-${ index }-action kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) } kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) } kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }` } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ btns[ index ].target } style={ {
								backgroundColor: ( btns[ index ].background ? btns[ index ].background : 'transparent' ),
								color: btns[ index ].color,
								fontSize: ( btns[ index ].size ? btns[ index ].size + 'px' : undefined ),
								borderRadius: ( btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
								borderWidth: ( btns[ index ].borderWidth ? btns[ index ].borderWidth + 'px' : undefined ),
								borderColor: btns[ index ].border,
								paddingLeft: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingRight: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingTop: ( btns[ index ].paddingTB ? btns[ index ].paddingTB + 'px' : undefined ),
								paddingBottom: ( btns[ index ].paddingTB ? btns[ index ].paddingTB + 'px' : undefined ),
							} } onMouseOver={ `this.style.background='${ btns[ index ].backgroundHover }',this.style.color='${ btns[ index ].colorHover }',this.style.borderColor='${ btns[ index ].borderHover }'` } onFocus={ `this.style.background='${ btns[ index ].backgroundHover }',this.style.color='${ btns[ index ].colorHover }',this.style.borderColor='${ btns[ index ].borderHover }'` } onBlur={ `this.style.background='${ ( btns[ index ].background ? btns[ index ].background : 'transparent' ) }',this.style.color='${ btns[ index ].color }',this.style.borderColor='${ btns[ index ].border }'` } onMouseOut={ `this.style.background='${ ( btns[ index ].background ? btns[ index ].background : 'transparent' ) }',this.style.color='${ btns[ index ].color }',this.style.borderColor='${ btns[ index ].border }'` }>
								{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
							</a>
						</div>
					);
				};
				return (
					<div className={ `kt-btn-align-${ hAlign } kt-btns-wrap kt-btns${ uniqueID }` }>
						{ times( btnCount, n => renderSaveBtns( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				hAlign: {
					type: 'string',
					default: 'center',
				},
				btnCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				btns: {
					type: 'array',
					default: [ {
						text: '',
						link: '',
						target: '_self',
						size: 18,
						paddingBT: '',
						paddingLR: '',
						color: '#555555',
						background: 'transparent',
						border: '#555555',
						borderRadius: 3,
						borderWidth: 2,
						colorHover: '#ffffff',
						backgroundHover: '#444444',
						borderHover: '#444444',
						icon: '',
						iconSide: 'right',
						iconHover: false,
					} ],
				},
			},
			save: ( { attributes } ) => {
				const { btnCount, btns, hAlign, uniqueID } = attributes;
				const renderSaveBtns = ( index ) => {
					return (
						<div className={ `kt-btn-wrap kt-btn-wrap-${ index }` }>
							<a className={ `kt-button kt-btn-${ index }-action kt-btn-svg-show-${ ( ! btns[ index ].iconHover ? 'always' : 'hover' ) } kt-btn-has-text-${ ( ! btns[ index ].text ? 'false' : 'true' ) } kt-btn-has-svg-${ ( ! btns[ index ].icon ? 'false' : 'true' ) }` } href={ ( ! btns[ index ].link ? '#' : btns[ index ].link ) } target={ btns[ index ].target } style={ {
								backgroundColor: ( btns[ index ].background ? btns[ index ].background : 'transparent' ),
								color: btns[ index ].color,
								fontSize: ( btns[ index ].size ? btns[ index ].size + 'px' : undefined ),
								borderRadius: ( btns[ index ].borderRadius ? btns[ index ].borderRadius + 'px' : undefined ),
								borderWidth: btns[ index ].borderWidth + 'px',
								borderColor: btns[ index ].border,
								paddingLeft: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingRight: ( btns[ index ].paddingLR ? btns[ index ].paddingLR + 'px' : undefined ),
								paddingTop: ( btns[ index ].paddingTB ? btns[ index ].paddingTB + 'px' : undefined ),
								paddingBottom: ( btns[ index ].paddingTB ? btns[ index ].paddingTB + 'px' : undefined ),
							} } onMouseOver={ `this.style.background='${ btns[ index ].backgroundHover }',this.style.color='${ btns[ index ].colorHover }',this.style.borderColor='${ btns[ index ].borderHover }'` } onFocus={ `this.style.background='${ btns[ index ].backgroundHover }',this.style.color='${ btns[ index ].colorHover }',this.style.borderColor='${ btns[ index ].borderHover }'` } onBlur={ `this.style.background='${ ( btns[ index ].background ? btns[ index ].background : 'transparent' ) }',this.style.color='${ btns[ index ].color }',this.style.borderColor='${ btns[ index ].border }'` } onMouseOut={ `this.style.background='${ ( btns[ index ].background ? btns[ index ].background : 'transparent' ) }',this.style.color='${ btns[ index ].color }',this.style.borderColor='${ btns[ index ].border }'` }>
								{ btns[ index ].icon && 'left' === btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<IconRender className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } />
								) }
							</a>
						</div>
					);
				};
				return (
					<div className={ `kt-btn-align-${ hAlign } kt-btns-wrap kt-btns${ uniqueID }` }>
						{ times( btnCount, n => renderSaveBtns( n ) ) }
					</div>
				);
			},
		},
	],
} );
