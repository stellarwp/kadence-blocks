/**
 * Internal dependencies
 */
import { getResponsiveClass, getWrapStyle } from '@js/common';
import { BackgroundContentSave } from '@components/background';
import { getBoxShadow, getFullWidth } from '@js/common'
import { getBorder, getMargin, getPadding, getBorderRadius } from './tools'

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { InnerBlocks, RichText, URLInput } from '@wordpress/block-editor'

const save = ( { attributes } ) => {

	const {
		alignItems,
		isEnableBoxShadow,
		boxShadow
	} = attributes;

	return (
		<Fragment>
			<div 
				className={ classnames( 
					'frontrom-col-wrap',
					attributes.className, 
					getResponsiveClass( attributes )
				) }

				style={{ 
					position: 'relative',
					overflow: 'hidden',
					zIndex: 1,
					...getWrapStyle( attributes ),
					...getMargin( attributes ),
					...getPadding( attributes ),
					...getBorder( attributes ),
					...getBorderRadius( attributes ),
					height: attributes.height ? `${attributes.height}${attributes.heightUnit}` : '',
					width: '100%'
				}}
			>
				{ BackgroundContentSave( attributes ) }
				<div 
					className={ classnames( `frontrom-col-content-align ${alignItems}` ) }
					style={{
						boxShadow: isEnableBoxShadow ? getBoxShadow( JSON.parse( boxShadow ) ) : false,
					}}
				>
                	<InnerBlocks.Content />
                </div>
            </div>
		</Fragment>
	);
};

export default save;
