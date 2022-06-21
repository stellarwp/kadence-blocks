/**
 * BLOCK: Kadence Icon
 */

import metadata from './block.json';

/**
 * Import Icon stuff
 */
import { iconIcon } from '@kadence/icons';
import { times } from 'lodash';
import { IconRender, IconSpanTag} from '@kadence/components';
import { KadenceColorOutput } from '@kadence/helpers';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

/**
 * Import Css
 */
 import './style.scss';

/**
 * Internal block libraries
 */
import {
	registerBlockType,
} from '@wordpress/blocks';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/icon', {
	...metadata,
	icon: {
		src: iconIcon,
	},
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,

	save: props => {
		const { attributes: { icons, iconCount, blockAlignment, textAlignment, uniqueID, verticalAlignment } } = props;
		const renderSaveIcons = ( index ) => {
			return (
				<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
					{ icons[ index ].icon && icons[ index ].link && (
						<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined } aria-label={ ( undefined !== icons[ index ].linkTitle && '' !== icons[ index ].linkTitle ? icons[ index ].linkTitle : undefined ) } style={ {
							marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
							marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
							marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
							marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
						} }
						>
							<IconSpanTag className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } ariaHidden={ ( icons[ index ].title ? undefined : 'true' ) } style={ {
								color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
								backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
								padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
								borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
								borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
								borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
							} } />
						</a>
					) }
					{ icons[ index ].icon && ! icons[ index ].link && (
						<IconSpanTag className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } ariaHidden={ ( icons[ index ].title ? undefined : 'true' ) } style={ {
							color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
							backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
							padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
							borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
							borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
							borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
							marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
							marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
							marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
							marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
						} } />
					) }
				</div>
			);
		};
		return (
			<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'none' ) }${ ( verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : '' ) }` } style={ {
				textAlign: ( textAlignment ? textAlignment : 'center' ),
			} } >
				{ times( iconCount, n => renderSaveIcons( n ) ) }
			</div>
		);
	},
	deprecated: [
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
						icon: 'fe_aperture',
						link: '',
						target: '_self',
						size: 50,
						width: 2,
						title: '',
						color: '#444444',
						background: 'transparent',
						border: '#444444',
						borderRadius: 0,
						borderWidth: 2,
						padding: 20,
						style: 'default',
						marginTop: 0,
						marginRight: 0,
						marginBottom: 0,
						marginLeft: 0,
						hColor: '',
						hBackground: '',
						hBorder: '',
						linkTitle: '',
					} ],
				},
				iconCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: '',
				},
				textAlignment: {
					type: 'string',
					default: 'center',
				},
				tabletTextAlignment: {
					type: 'string',
				},
				mobileTextAlignment: {
					type: 'string',
				},
				verticalAlignment: {
					type: 'string',
				},
				inQueryBlock: {
					type: 'bool',
					default: false,
				},
			},
			save: ( props ) => {
				const { attributes: { icons, iconCount, blockAlignment, textAlignment, uniqueID, verticalAlignment } } = props;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined } aria-label={ ( undefined !== icons[ index ].linkTitle && '' !== icons[ index ].linkTitle ? icons[ index ].linkTitle : undefined ) } style={ {
									marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
									marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
									marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
									marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
								} }
								>
									<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } ariaHidden={ ( icons[ index ].title ? undefined : 'true' ) } style={ {
										color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } ariaHidden={ ( icons[ index ].title ? undefined : 'true' ) } style={ {
									color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
									marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
									marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
									marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'none' ) }${ ( verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : '' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			}
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
						icon: 'fe_aperture',
						link: '',
						target: '_self',
						size: 50,
						width: 2,
						title: '',
						color: '#444444',
						background: 'transparent',
						border: '#444444',
						borderRadius: 0,
						borderWidth: 2,
						padding: 20,
						style: 'default',
						marginTop: 0,
						marginRight: 0,
						marginBottom: 0,
						marginLeft: 0,
						hColor: '',
						hBackground: '',
						hBorder: '',
					} ],
				},
				iconCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: 'center',
				},
				textAlignment: {
					type: 'string',
					default: 'center',
				},
				tabletTextAlignment: {
					type: 'string',
				},
				mobileTextAlignment: {
					type: 'string',
				},
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID, verticalAlignment } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined } aria-label={ ( undefined !== icons[ index ].linkTitle && '' !== icons[ index ].linkTitle ? icons[ index ].linkTitle : undefined ) } style={ {
									marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
									marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
									marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
									marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
								} }
								>
									<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } ariaHidden={ ( icons[ index ].title ? undefined : 'true' ) } style={ {
										color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } ariaHidden={ ( icons[ index ].title ? undefined : 'true' ) } style={ {
									color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
									marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
									marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
									marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }${ ( verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : '' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			}
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
						icon: 'fe_aperture',
						link: '',
						target: '_self',
						size: 50,
						width: 2,
						title: '',
						color: '#444444',
						background: 'transparent',
						border: '#444444',
						borderRadius: 0,
						borderWidth: 2,
						padding: 20,
						style: 'default',
						marginTop: 0,
						marginRight: 0,
						marginBottom: 0,
						marginLeft: 0,
						hColor: '',
						hBackground: '',
						hBorder: '',
					} ],
				},
				iconCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: 'center',
				},
				textAlignment: {
					type: 'string',
					default: 'center',
				},
				tabletTextAlignment: {
					type: 'string',
				},
				mobileTextAlignment: {
					type: 'string',
				},
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID, verticalAlignment } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined } aria-label={ ( undefined !== icons[ index ].linkTitle && '' !== icons[ index ].linkTitle ? icons[ index ].linkTitle : undefined ) } style={ {
									marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
									marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
									marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
									marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
								} }
								>
									<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
										color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
									color: ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
									marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
									marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
									marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }${ ( verticalAlignment ? verticalAlignment : '' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			}
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
						icon: 'fe_aperture',
						link: '',
						target: '_self',
						size: 50,
						width: 2,
						title: '',
						color: '#444444',
						background: 'transparent',
						border: '#444444',
						borderRadius: 0,
						borderWidth: 2,
						padding: 20,
						style: 'default',
					} ],
				},
				iconCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: 'center',
				},
				textAlignment: {
					type: 'string',
					default: 'center',
				},
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined }>
									<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
										color: ( icons[ index ].color ? icons[ index ].color : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
									color: ( icons[ index ].color ? icons[ index ].color : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
						icon: 'fe_aperture',
						link: '',
						target: '_self',
						size: 50,
						width: 2,
						title: '',
						color: '#444444',
						background: 'transparent',
						border: '#444444',
						borderRadius: 0,
						borderWidth: 2,
						padding: 20,
						style: 'default',
					} ],
				},
				iconCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: 'center',
				},
				textAlignment: {
					type: 'string',
					default: 'center',
				},
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined }>
									<div style={ {
										color: ( icons[ index ].color ? icons[ index ].color : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` }>
									</div>
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<div style={ {
									color: ( icons[ index ].color ? icons[ index ].color : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
								} } className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` }>
								</div>
							) }
						</div>
					);
				};
				return (
					<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
						icon: 'fe_aperture',
						link: '',
						target: '_self',
						size: 50,
						width: 2,
						title: '',
						color: '#444444',
						background: 'transparent',
						border: '#444444',
						borderRadius: 0,
						borderWidth: 2,
						padding: 20,
						style: 'default',
					} ],
				},
				iconCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: 'center',
				},
				textAlignment: {
					type: 'string',
					default: 'center',
				},
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ icons[ index ].target }>
									<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
										color: ( icons[ index ].color ? icons[ index ].color : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
									color: ( icons[ index ].color ? icons[ index ].color : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			},
		},
		{
			attributes: {
				icons: {
					type: 'array',
					default: [ {
						icon: 'fe_aperture',
						link: '',
						target: '_self',
						size: 50,
						width: 2,
						title: '',
						color: '#444444',
						background: 'transparent',
						border: '#444444',
						borderRadius: 0,
						borderWidth: 2,
						padding: 20,
						style: 'default',
					} ],
				},
				iconCount: {
					type: 'number',
					default: 1,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: 'center',
				},
				textAlignment: {
					type: 'string',
					default: 'center',
				},
			},
			save: ( { attributes } ) => {
				const { icons, iconCount, blockAlignment, textAlignment, uniqueID } = attributes;
				const renderSaveIcons = ( index ) => {
					return (
						<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
							{ icons[ index ].icon && icons[ index ].link && (
								<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ icons[ index ].target } rel="noopener noreferrer">
									<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
										color: ( icons[ index ].color ? icons[ index ].color : undefined ),
										backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
										padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
										borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
										borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
									} } />
								</a>
							) }
							{ icons[ index ].icon && ! icons[ index ].link && (
								<IconRender className={ `kt-svg-icon kt-svg-icon-${ icons[ index ].icon }` } name={ icons[ index ].icon } size={ icons[ index ].size } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } style={ {
									color: ( icons[ index ].color ? icons[ index ].color : undefined ),
									backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? icons[ index ].background : undefined ),
									padding: ( icons[ index ].padding && icons[ index ].style !== 'default' ? icons[ index ].padding + 'px' : undefined ),
									borderColor: ( icons[ index ].border && icons[ index ].style !== 'default' ? icons[ index ].border : undefined ),
									borderWidth: ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
								} } />
							) }
						</div>
					);
				};
				return (
					<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
						textAlign: ( textAlignment ? textAlignment : 'center' ),
					} } >
						{ times( iconCount, n => renderSaveIcons( n ) ) }
					</div>
				);
			},
		},
	],
} );
