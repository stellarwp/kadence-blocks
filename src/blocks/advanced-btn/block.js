/**
 * BLOCK: Kadence Advanced Btn
 */
import times from 'lodash/times';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
/**
 * Import Icons
 */
import icons from './icon';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

import edit from './edit';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
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
	title: __( 'Advanced Button' ), // Block title.
	icon: {
		src: icons.block,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'Button' ),
		__( 'Icon' ),
		__( 'KT' ),
	],
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
	edit,
	save: props => {
		const { attributes: { btnCount, btns, hAlign, uniqueID, letterSpacing } } = props;
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
							<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
						) }
						<span className="kt-btn-inner-text">
							{ btns[ index ].text }
						</span>
						{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
							<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
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
	deprecated: [
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
									<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
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
									<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
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
									<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
								) }
								<span className="kt-btn-inner-text">
									{ btns[ index ].text }
								</span>
								{ btns[ index ].icon && 'left' !== btns[ index ].iconSide && (
									<GenIcon className={ `kt-btn-svg-icon kt-btn-svg-icon-${ btns[ index ].icon } kt-btn-side-${ btns[ index ].iconSide }` } name={ btns[ index ].icon } size={ ( ! btns[ index ].size ? '14' : btns[ index ].size ) } icon={ ( 'fa' === btns[ index ].icon.substring( 0, 2 ) ? FaIco[ btns[ index ].icon ] : Ico[ btns[ index ].icon ] ) } />
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
