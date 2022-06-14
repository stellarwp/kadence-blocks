/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import { IconRender } from '@kadence/components';
import { KadenceColorOutput } from '@kadence/helpers';
import { times } from 'lodash';

function Save( { attributes, className } ) {
	const {  icons, iconCount, blockAlignment, textAlignment, uniqueID, verticalAlignment } = attributes;
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

	const blockProps = useBlockProps.save( {
		className: className,
	} );

	return (
		<div {...blockProps} className={ 'wp-block-kadence-icon ' + `kt-svg-icons kt-svg-icons${ uniqueID } align${ ( blockAlignment ? blockAlignment : 'none' ) }${ ( verticalAlignment ? ' kb-icon-valign-' + verticalAlignment : '' ) }` } style={ {
			textAlign: ( textAlignment ? textAlignment : 'center' ),
		} } >
			{ times( iconCount, n => renderSaveIcons( n ) ) }
		</div>
	);
}

export default Save;
