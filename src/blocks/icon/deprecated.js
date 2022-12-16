/**
 * BLOCK: Spacer
 *
 * Depreciated.
 */


/**
 * Internal block libraries
 */
import { times } from 'lodash';
import { KadenceColorOutput } from '@kadence/helpers';
import { IconRender, IconSpanTag } from '@kadence/components';
import { migrateToInnerblocks } from './utils';
import classnames from 'classnames';
import { useBlockProps } from '@wordpress/block-editor';

 export default [
	 {
		 attributes: {
			 icons: {
				 type: 'array',
				 default: [
					 {
						 icon: 'fe_aperture',
						 link: '',
						 target: '_self',
						 size: 50,
						 width: 2,
						 title: '',
						 color: 'palette4',
						 background: 'transparent',
						 border: 'palette4',
						 borderRadius: 0,
						 borderWidth: 2,
						 padding: [ 20, 20, 20, 20 ],
						 paddingUnit : 'px',
						 style: 'default',
						 margin: [ '', '', '', '' ],
						 marginUnit : 'px',
						 hColor: '',
						 hBackground: '',
						 hBorder: '',
						 linkTitle: '',
						 tabletSize: '',
						 mobileSize: '',
						 tabletMargin: [ '', '', '', '' ],
						 mobileMargin: [ '', '', '', '' ],
						 tabletPadding: [ '', '', '', '' ],
						 mobilePadding: [ '', '', '', '' ]
					 }
				 ]
			 },
			 iconCount: {
				 type: 'number',
				 default: 1
			 },
			 uniqueID: {
				 type: 'string',
				 default: ''
			 },
			 blockAlignment: {
				 type: 'string',
				 default: ''
			 },
			 textAlignment: {
				 type: 'string',
				 default: 'center'
			 },
			 tabletTextAlignment: {
				 type: 'string'
			 },
			 mobileTextAlignment: {
				 type: 'string'
			 },
			 verticalAlignment: {
				 type: 'string'
			 },
			 inQueryBlock: {
				 type: 'boolean',
				 default: false
			 }
		 },
		 save( { attributes, className } ) {
			 const {  icons, iconCount, blockAlignment, textAlignment, uniqueID, verticalAlignment } = attributes;
			 const renderSaveIcons = ( index ) => {
				 return (
					 <div className={ `kt-svg-style-${ icons[ index ].style } kt-svg-icon-wrap kt-svg-item-${ index }` }>
						 { icons[ index ].icon && icons[ index ].link && (
							 <a href={ icons[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === icons[ index ].target ? icons[ index ].target : undefined ) } rel={ '_blank' === icons[ index ].target ? 'noopener noreferrer' : undefined } aria-label={ ( undefined !== icons[ index ].linkTitle && '' !== icons[ index ].linkTitle ? icons[ index ].linkTitle : undefined ) }>
								 <IconSpanTag name={ icons[ index ].icon } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } />
							 </a>
						 ) }
						 { icons[ index ].icon && ! icons[ index ].link && (
							 <IconSpanTag name={ icons[ index ].icon } strokeWidth={ ( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined ) } title={ ( icons[ index ].title ? icons[ index ].title : '' ) } />
						 ) }
					 </div>
				 );
			 };
			 const classes = classnames( {
				 'kt-svg-icons': true,
				 [ `kt-svg-icons${ uniqueID }` ]: uniqueID,
				 [ `align${ ( blockAlignment ? blockAlignment : 'none' ) }` ]: true,
				 [ `kb-icon-valign-${ verticalAlignment }` ]: verticalAlignment,
			 } );

			 const blockProps = useBlockProps.save( {
				 className: classes,
			 } );

			 return (
				 <div { ...blockProps }>
					 { times( iconCount, n => renderSaveIcons( n ) ) }
				 </div>
			 );
		 },
		 migrate: migrateToInnerblocks,
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
		supports: {
			ktdynamic: true,
		},
		getEditWrapperProps( { blockAlignment } ) {
			if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
				return { 'data-align': blockAlignment };
			}
		},
		migrate( attributes ) {
			const newAttributes = attributes;
			for ( let i = 0; i < attributes.icons.length; i++) {
				if ( attributes.icons[i].padding ) {
					const tempPadding = parseInt( attributes.icons[i].padding, 10 );
					newAttributes.icons[i].padding = [ tempPadding, tempPadding, tempPadding, tempPadding ];
				}
				const tempMarginTop = ( attributes.icons[i].marginTop ? parseInt( attributes.icons[i].marginTop, 10 ) : '');
				const tempMarginRight = ( attributes.icons[i].marginRight ? parseInt( attributes.icons[i].marginRight, 10 ) : '');
				const tempMarginBottom = ( attributes.icons[i].marginBottom ? parseInt( attributes.icons[i].marginBottom, 10 ) : '');
				const tempMarginLeft = ( attributes.icons[i].marginLeft ? parseInt( attributes.icons[i].marginLeft, 10 ) : '');
				delete newAttributes.icons[i].marginTop;
				delete newAttributes.icons[i].marginRight;
				delete newAttributes.icons[i].marginBottom;
				delete newAttributes.icons[i].marginLeft;
				
				newAttributes.icons[i].margin = [ tempMarginTop, tempMarginRight, tempMarginBottom, tempMarginLeft ];
			}
		   return newAttributes;
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
 ];
