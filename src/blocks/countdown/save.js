/**
 * BLOCK: Kadence Countdown
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

function Save( { attributes } ) {
	const { date, timezone, timeOffset, timestamp, uniqueID, vsdesk, vstablet, vsmobile } = attributes;
	const classes = classnames( {
		'kb-countdown-container': true,
		[ `kb-countdown-container-${ uniqueID }` ]: uniqueID,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
	} );
	return (
		<div className={ classes } data-date={ date } data-timezone={ ( timezone ? timezone : '' ) } data-timestamp={ timestamp } data-time-offset={ timeOffset }>
			<InnerBlocks.Content />
		</div>
	);
}
export default Save;
