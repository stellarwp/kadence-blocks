/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { KadenceColorOutput } from '@kadence/helpers';
import SvgPattern from './svg-pattern';

function Save( { attributes } ) {
	const {
		className,
		blockAlignment,
		dividerEnable,
		dividerStyle,
		hAlign,
		dividerColor,
		dividerOpacity,
		uniqueID,
		rotate,
		strokeWidth,
		strokeGap,
		tabletHAlign,
		mobileHAlign,
		vsdesk,
		vstablet,
		vsmobile,
	} = attributes;

	const innerSpacerClasses = classnames( {
		'kt-block-spacer'                            : true,
		[ `kt-block-spacer-halign-${hAlign}` ]       : hAlign,
		[ `kt-block-spacer-thalign-${tabletHAlign}` ]: tabletHAlign,
		[ `kt-block-spacer-malign-${mobileHAlign}` ] : mobileHAlign,
	} );

	const blockProps = useBlockProps.save( {
		className: classnames( {
			[ `align${( blockAlignment ? blockAlignment : 'none' )}` ]: true,
			[ `kt-block-spacer-${uniqueID}` ]                         : uniqueID,
			'kvs-lg-false'                                            : vsdesk !== 'undefined' && vsdesk,
			'kvs-md-false'                                            : vstablet !== 'undefined' && vstablet,
			'kvs-sm-false'                                            : vsmobile !== 'undefined' && vsmobile,
		},
			className
		),
	} );

	return (
		<div {...blockProps}>
			<div className={innerSpacerClasses}>
				{dividerEnable && (
					<>
						{dividerStyle === 'stripe' && (
							<span className="kt-divider-stripe">
									<SvgPattern uniqueID={uniqueID} color={KadenceColorOutput( dividerColor )} opacity={dividerOpacity} rotate={rotate} strokeWidth={strokeWidth}
												strokeGap={strokeGap}/>
								</span>
						)}
						{dividerStyle !== 'stripe' && (
							<hr className="kt-divider"/>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default Save;
