/**
 * BLOCK: Kadence Section
 */

/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * Internal dependencies
 */
import KadenceColorOutput from '../../components/color/kadence-color-output';

/**
 * WordPress dependencies
 */
import { getColorClassName, InnerBlocks } from '@wordpress/block-editor';

function Save( { attributes } ) {
	const { id, background, backgroundOpacity, backgroundImg, uniqueID, vsdesk, vstablet, vsmobile, bgColorClass } = attributes;
	const bgImg = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' );
	const backgroundString = ( background && '' === bgImg ? KadenceColorOutput( background, backgroundOpacity ) : undefined );
	const classes = classnames( {
		[ `inner-column-${ id }` ]: id,
		[ `kadence-column${ uniqueID }` ]: uniqueID,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
	} );
	const backgroundColorClass = getColorClassName( 'background-color', bgColorClass );
	const innerClasses = classnames( 'kt-inside-inner-col', {
		[ backgroundColorClass ]: backgroundColorClass,
	} );
	return (
		<div className={ classes }>
			<div className={ 'kt-inside-inner-col' } style={ {
				background: backgroundString,
			} } >
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
export default Save;
