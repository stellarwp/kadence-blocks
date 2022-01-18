/**
 * BLOCK: Kadence Icon List
 */

/**
 * Import Icon stuff
 */
import itemicons from '../../icons';
import times from 'lodash/times';
import IconRender from '../../components/icons/icon-render';
import KadenceColorOutput from '../../kadence-color-output';

import edit from './edit';
/**
 * Import Css
 */
// import './style.scss';
// import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	registerBlockType,
	createBlock,
	getBlockAttributes,
} = wp.blocks;
const {
	RichText,
} = wp.blockEditor;
const {
	replace,
	join,
	split,
	create,
	toHTMLString,
	LINE_SEPARATOR,
	__UNSTABLE_LINE_SEPARATOR,
} = wp.richText;
const {
	Fragment,
} = wp.element;
const lineSep = LINE_SEPARATOR ? LINE_SEPARATOR : __UNSTABLE_LINE_SEPARATOR;
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/iconlist', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Icon List', 'kadence-blocks' ), // Block title.
	icon: {
		src: itemicons.iconlistBlock,
	},
	description: __( 'Create engaging lists with icons for bullets.', 'kadence-blocks' ),
	category: 'kadence-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'icon', 'kadence-blocks' ),
		__( 'list', 'kadence-blocks' ),
		'KB',
	],
	supports: {
		ktdynamic: true,
	},
	attributes: {
		items: {
			type: 'array',
			default: [ {
				icon: 'fe_checkCircle',
				link: '',
				target: '_self',
				size: 20,
				width: 2,
				text: '',
				color: '',
				background: '',
				border: '',
				borderRadius: 0,
				padding: 5,
				borderWidth: 1,
				style: 'default',
			} ],
		},
		listStyles: {
			type: 'array',
			default: [ {
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: '',
				family: '',
				google: false,
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
				color: '',
				textTransform: '',
			} ],
		},
		listCount: {
			type: 'number',
			default: 1,
		},
		columns: {
			type: 'number',
			default: 1,
		},
		tabletColumns: {
			type: 'number',
			default: '',
		},
		mobileColumns: {
			type: 'number',
			default: '',
		},
		listGap: {
			type: 'number',
			default: 5,
		},
		listLabelGap: {
			type: 'number',
			default: 10,
		},
		uniqueID: {
			type: 'string',
			default: '',
		},
		blockAlignment: {
			type: 'string',
			default: 'none',
		},
		listMargin: {
			type: 'array',
			default: [ 0, 0, 10, 0 ],
		},
		iconAlign: {
			type: 'string',
			default: 'middle',
		},
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/list' ],
				transform: ( { values } ) => {
					const listArray = split( create( {
						html: values,
						multilineTag: 'li',
						multilineWrapperTags: [ 'ul', 'ol' ],
					} ), lineSep );
					const newitems = [ {
						icon: 'fe_checkCircle',
						link: '',
						target: '_self',
						size: 20,
						width: 2,
						text: toHTMLString( { value: listArray[ 0 ] } ),
						color: '',
						background: '',
						border: '',
						borderRadius: 0,
						padding: 5,
						borderWidth: 1,
						style: 'default',
					} ];
					const amount = Math.abs( listArray.length );
					{ times( amount, n => {
						if ( n !== 0 ) {
							newitems.push( {
								icon: 'fe_checkCircle',
								link: '',
								target: '_self',
								size: 20,
								width: 2,
								text: toHTMLString( { value: listArray[ n ] } ),
								color: '',
								background: '',
								border: '',
								borderRadius: 0,
								padding: 5,
								borderWidth: 1,
								style: 'default',
							} );
						}
					} ); }
					return createBlock( 'kadence/iconlist', {
						items: newitems,
						listCount: amount,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/list' ],
				transform: ( blockAttributes ) => {
					return createBlock( 'core/list', {
						values: toHTMLString( {
							value: join( blockAttributes.items.map( ( { text } ) => {
								return create( { html: text } );
							} ), lineSep ),
							multilineTag: 'li',
						} ),
					} );
				},
			},
		],
	},
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,

	save: props => {
		const { attributes: { items, listCount, columns, blockAlignment, iconAlign, uniqueID, tabletColumns, mobileColumns } } = props;
		const renderItems = ( index ) => {
			return (
				<li className={ `kt-svg-icon-list-style-${ items[ index ].style } kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${ index }` }>
					{ items[ index ].link && (
						<a href={ items[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === items[ index ].target ? items[ index ].target : undefined ) } rel={ '_blank' === items[ index ].target ? 'noopener noreferrer' : undefined }>
							{ items[ index ].icon && (
								<IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } ariaHidden={ 'true' } style={ {
									color: ( items[ index ].color ? KadenceColorOutput( items[ index ].color ) : undefined ),
									backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].background ) : undefined ),
									padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
									borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].border ) : undefined ),
									borderWidth: ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
								} } />
							) }
							<RichText.Content
								tagName="span"
								value={ items[ index ].text }
								className={ 'kt-svg-icon-list-text' }
							/>
						</a>
					) }
					{ ! items[ index ].link && (
						<Fragment>
							{ items[ index ].icon && (
								<IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } ariaHidden={ 'true' } style={ {
									color: ( items[ index ].color ? KadenceColorOutput( items[ index ].color ) : undefined ),
									backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].background ) : undefined ),
									padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
									borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].border ) : undefined ),
									borderWidth: ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
									borderRadius: ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
									marginTop: ( items[ index ].marginTop ? items[ index ].marginTop + 'px' : undefined ),
									marginRight: ( items[ index ].marginRight ? items[ index ].marginRight + 'px' : undefined ),
									marginBottom: ( items[ index ].marginBottom ? items[ index ].marginBottom + 'px' : undefined ),
									marginLeft: ( items[ index ].marginLeft ? items[ index ].marginLeft + 'px' : undefined ),
								} } />
							) }
							<RichText.Content
								tagName="span"
								value={ items[ index ].text }
								className={ 'kt-svg-icon-list-text' }
							/>
						</Fragment>
					) }
				</li>
			);
		};
		return (
			<div className={ `kt-svg-icon-list-items kt-svg-icon-list-items${ uniqueID } kt-svg-icon-list-columns-${ columns } align${ ( blockAlignment ? blockAlignment : 'none' ) }${ ( undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : '' ) }${ ( undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : '' ) }${ ( undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : '' ) }` }>
				<ul className="kt-svg-icon-list">
					{ times( listCount, n => renderItems( n ) ) }
				</ul>
			</div>
		);
	},
	deprecated: [
		{
			attributes: {
				items: {
					type: 'array',
					default: [ {
						icon: 'fe_checkCircle',
						link: '',
						target: '_self',
						size: 20,
						width: 2,
						text: '',
						color: '',
						background: '',
						border: '',
						borderRadius: 0,
						padding: 5,
						borderWidth: 1,
						style: 'default',
					} ],
				},
				listStyles: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						color: '',
						textTransform: '',
					} ],
				},
				listCount: {
					type: 'number',
					default: 1,
				},
				columns: {
					type: 'number',
					default: 1,
				},
				tabletColumns: {
					type: 'number',
					default: '',
				},
				mobileColumns: {
					type: 'number',
					default: '',
				},
				listGap: {
					type: 'number',
					default: 5,
				},
				listLabelGap: {
					type: 'number',
					default: 10,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: 'none',
				},
				listMargin: {
					type: 'array',
					default: [ 0, 0, 10, 0 ],
				},
				iconAlign: {
					type: 'string',
					default: 'middle',
				},
			},
			save: ( { attributes } ) => {
				const { items, listCount, columns, blockAlignment, iconAlign, uniqueID, tabletColumns, mobileColumns } = attributes;
				const renderItems = ( index ) => {
					return (
						<li className={ `kt-svg-icon-list-style-${ items[ index ].style } kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${ index }` }>
							{ items[ index ].icon && items[ index ].link && (
								<a href={ items[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === items[ index ].target ? items[ index ].target : undefined ) } rel={ '_blank' === items[ index ].target ? 'noopener noreferrer' : undefined }>
									<IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } ariaHidden={ 'true' } style={ {
										color: ( items[ index ].color ? KadenceColorOutput( items[ index ].color ) : undefined ),
										backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].background ) : undefined ),
										padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
										borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].border ) : undefined ),
										borderWidth: ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
									} } />
									<RichText.Content
										tagName="span"
										value={ items[ index ].text }
										className={ 'kt-svg-icon-list-text' }
									/>
								</a>
							) }
							{ items[ index ].icon && ! items[ index ].link && (
								<Fragment>
									<IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } ariaHidden={ 'true' } style={ {
										color: ( items[ index ].color ? KadenceColorOutput( items[ index ].color ) : undefined ),
										backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].background ) : undefined ),
										padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
										borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].border ) : undefined ),
										borderWidth: ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
										marginTop: ( items[ index ].marginTop ? items[ index ].marginTop + 'px' : undefined ),
										marginRight: ( items[ index ].marginRight ? items[ index ].marginRight + 'px' : undefined ),
										marginBottom: ( items[ index ].marginBottom ? items[ index ].marginBottom + 'px' : undefined ),
										marginLeft: ( items[ index ].marginLeft ? items[ index ].marginLeft + 'px' : undefined ),
									} } />
									<RichText.Content
										tagName="span"
										value={ items[ index ].text }
										className={ 'kt-svg-icon-list-text' }
									/>
								</Fragment>
							) }
						</li>
					);
				};
				return (
					<div className={ `kt-svg-icon-list-items kt-svg-icon-list-items${ uniqueID } kt-svg-icon-list-columns-${ columns } align${ ( blockAlignment ? blockAlignment : 'none' ) }${ ( undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : '' ) }${ ( undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : '' ) }${ ( undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : '' ) }` }>
						<ul className="kt-svg-icon-list">
							{ times( listCount, n => renderItems( n ) ) }
						</ul>
					</div>
				);
			}
		},
		{ 
			attributes: {
				items: {
					type: 'array',
					default: [ {
						icon: 'fe_checkCircle',
						link: '',
						target: '_self',
						size: 20,
						width: 2,
						text: '',
						color: '',
						background: '',
						border: '',
						borderRadius: 0,
						padding: 5,
						borderWidth: 1,
						style: 'default',
					} ],
				},
				listStyles: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						color: '',
						textTransform: '',
					} ],
				},
				listCount: {
					type: 'number',
					default: 1,
				},
				columns: {
					type: 'number',
					default: 1,
				},
				listGap: {
					type: 'number',
					default: 5,
				},
				listLabelGap: {
					type: 'number',
					default: 10,
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				blockAlignment: {
					type: 'string',
					default: 'none',
				},
				listMargin: {
					type: 'array',
					default: [ 0, 0, 10, 0 ],
				},
				iconAlign: {
					type: 'string',
					default: 'middle',
				},
			},
			save: ( { attributes } ) => {
				const { items, listCount, columns, blockAlignment, iconAlign, uniqueID } = attributes;
				const renderItems = ( index ) => {
					return (
						<li className={ `kt-svg-icon-list-style-${ items[ index ].style } kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${ index }` }>
							{ items[ index ].icon && items[ index ].link && (
								<a href={ items[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === items[ index ].target ? items[ index ].target : undefined ) } rel={ '_blank' === items[ index ].target ? 'noopener noreferrer' : undefined }>
									<IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } style={ {
										color: ( items[ index ].color ? KadenceColorOutput( items[ index ].color ) : undefined ),
										backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].background ) : undefined ),
										padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
										borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].border ) : undefined ),
										borderWidth: ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
									} } />
									<RichText.Content
										tagName="span"
										value={ items[ index ].text }
										className={ 'kt-svg-icon-list-text' }
									/>
								</a>
							) }
							{ items[ index ].icon && ! items[ index ].link && (
								<Fragment>
									<IconRender className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } style={ {
										color: ( items[ index ].color ? KadenceColorOutput( items[ index ].color ) : undefined ),
										backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].background ) : undefined ),
										padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
										borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? KadenceColorOutput( items[ index ].border ) : undefined ),
										borderWidth: ( items[ index ].borderWidth && items[ index ].style !== 'default' ? items[ index ].borderWidth + 'px' : undefined ),
										borderRadius: ( items[ index ].borderRadius && items[ index ].style !== 'default' ? items[ index ].borderRadius + '%' : undefined ),
										marginTop: ( items[ index ].marginTop ? items[ index ].marginTop + 'px' : undefined ),
										marginRight: ( items[ index ].marginRight ? items[ index ].marginRight + 'px' : undefined ),
										marginBottom: ( items[ index ].marginBottom ? items[ index ].marginBottom + 'px' : undefined ),
										marginLeft: ( items[ index ].marginLeft ? items[ index ].marginLeft + 'px' : undefined ),
									} } />
									<RichText.Content
										tagName="span"
										value={ items[ index ].text }
										className={ 'kt-svg-icon-list-text' }
									/>
								</Fragment>
							) }
						</li>
					);
				};
				return (
					<div className={ `kt-svg-icon-list-items kt-svg-icon-list-items${ uniqueID } kt-svg-icon-list-columns-${ columns } align${ ( blockAlignment ? blockAlignment : 'none' ) }${ ( undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : '' ) }` }>
						<ul className="kt-svg-icon-list">
							{ times( listCount, n => renderItems( n ) ) }
						</ul>
					</div>
				);
			}
		}
	]

} );
