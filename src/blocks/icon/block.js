/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Icon stuff
 */
import itemicons from './icon';
import times from 'lodash/times';
import IconRender from '../../icon-render';

import edit from './edit';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

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
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Icon' ), // Block title.
	icon: {
		src: itemicons.block,
	},
	category: 'kadence-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'icon' ),
		__( 'svg' ),
		__( 'KT' ),
	],
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
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,

	save: props => {
		const { attributes: { icons, iconCount, blockAlignment, textAlignment, uniqueID } } = props;
		const renderSaveIcons = ( index ) => {
			return (
				<div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
					{ icons[ index ].icon && icons[ index ].link && (
						<a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined } style={ {
							marginTop: ( icons[ index ].marginTop ? icons[ index ].marginTop + 'px' : undefined ),
							marginRight: ( icons[ index ].marginRight ? icons[ index ].marginRight + 'px' : undefined ),
							marginBottom: ( icons[ index ].marginBottom ? icons[ index ].marginBottom + 'px' : undefined ),
							marginLeft: ( icons[ index ].marginLeft ? icons[ index ].marginLeft + 'px' : undefined ),
						} }
						>
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
			<div className={ `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'center' ) }` } style={ {
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
