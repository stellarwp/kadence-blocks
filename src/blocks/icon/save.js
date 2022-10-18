/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import { IconSpanTag } from '@kadence/components';
/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';

function Save( { attributes, className } ) {
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
}

export default Save;
