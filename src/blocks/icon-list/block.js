/**
 * BLOCK: Kadence Icon List
 */

/**
 * Import Icon stuff
 */
import itemicons from '../../icons';
import times from 'lodash/times';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';

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
	createBlock,
	getBlockAttributes,
} = wp.blocks;
const {
	RichText,
} = wp.editor;
const{
	replace,
	join,
	split,
	create,
	toHTMLString,
	LINE_SEPARATOR
} = wp.richText;
const {
	Fragment,
} = wp.element;
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
	title: __( 'Icon List' ), // Block title.
	icon: {
		src: itemicons.iconlistBlock,
	},
	description: __( 'Create engaging lists with icons for bullets.' ),
	category: 'kadence-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'icon' ),
		__( 'list' ),
		__( 'KT' ),
	],
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
					} ), LINE_SEPARATOR );
					const newitems = [];
					const amount = Math.abs( listArray.length );
					{ times( amount, n => {
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
					} ); }
					return createBlock( 'kadence/iconlist', {
						listCount: amount,
						items: newitems,
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
							} ), LINE_SEPARATOR ),
							multilineTag: 'li',
						} ),
					} );
				},
			},
		],
	},
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment || 'none' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,

	save: props => {
		const { attributes: { items, listCount, columns, blockAlignment, uniqueID } } = props;
		const renderItems = ( index ) => {
			return (
				<li className={ `kt-svg-icon-list-style-${ items[ index ].style } kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${ index }` }>
					{ items[ index ].icon && items[ index ].link && (
						<a href={ items[ index ].link } className={ 'kt-svg-icon-link' } target={ ( '_blank' === items[ index ].target ? items[ index ].target : undefined ) } rel={ '_blank' === items[ index ].target ? 'noopener noreferrer' : undefined }>
							<GenIcon className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } icon={ ( 'fa' === items[ index ].icon.substring( 0, 2 ) ? FaIco[ items[ index ].icon ] : Ico[ items[ index ].icon ] ) } style={ {
								color: ( items[ index ].color ? items[ index ].color : undefined ),
								backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? items[ index ].background : undefined ),
								padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
								borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? items[ index ].border : undefined ),
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
							<GenIcon className={ `kt-svg-icon-list-single kt-svg-icon-list-single-${ items[ index ].icon }` } name={ items[ index ].icon } size={ items[ index ].size } strokeWidth={ ( 'fe' === items[ index ].icon.substring( 0, 2 ) ? items[ index ].width : undefined ) } icon={ ( 'fa' === items[ index ].icon.substring( 0, 2 ) ? FaIco[ items[ index ].icon ] : Ico[ items[ index ].icon ] ) } style={ {
								color: ( items[ index ].color ? items[ index ].color : undefined ),
								backgroundColor: ( items[ index ].background && items[ index ].style !== 'default' ? items[ index ].background : undefined ),
								padding: ( items[ index ].padding && items[ index ].style !== 'default' ? items[ index ].padding + 'px' : undefined ),
								borderColor: ( items[ index ].border && items[ index ].style !== 'default' ? items[ index ].border : undefined ),
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
			<div className={ `kt-svg-icon-list-items kt-svg-icon-list-items${ uniqueID } kt-svg-icon-list-columns-${ columns } align${ ( blockAlignment ? blockAlignment : 'none' ) }` }>
				<ul className="kt-svg-icon-list">
					{ times( listCount, n => renderItems( n ) ) }
				</ul>
			</div>
		);
	},
} );
