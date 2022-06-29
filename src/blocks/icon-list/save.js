/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import { KadenceColorOutput, IconRender } from '@kadence/components';
import { Fragment } from '@wordpress/element';
import { times } from 'lodash';
import { RichText } from '@wordpress/block-editor';

function Save( { attributes } ) {
	const { items, listCount, columns, blockAlignment, iconAlign, uniqueID, tabletColumns, mobileColumns } = attributes;

	const renderItems = ( index ) => {
		return (
			<li className={ `kt-svg-icon-list-style-${ items[ index ].style } kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${ index } kt-svg-icon-list-level-${ items[index].level }` }>
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

	const blockProps = useBlockProps.save( {} );

	return (
		<div {...blockProps} className={ `wp-block-kadence-iconlist kt-svg-icon-list-items kt-svg-icon-list-items${ uniqueID } kt-svg-icon-list-columns-${ columns } align${ ( blockAlignment ? blockAlignment : 'none' ) }${ ( undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : '' ) }${ ( undefined !== tabletColumns && '' !== tabletColumns ? ' kt-tablet-svg-icon-list-columns-' + tabletColumns : '' ) }${ ( undefined !== mobileColumns && '' !== mobileColumns ? ' kt-mobile-svg-icon-list-columns-' + mobileColumns : '' ) }` }>
			<ul className="kt-svg-icon-list">
				{ times( listCount, n => renderItems( n ) ) }
			</ul>
		</div>
	);
}

export default Save;
