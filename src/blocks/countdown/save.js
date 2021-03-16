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
	const { uniqueID, vsdesk, vstablet, vsmobile, timerLayout, countdownDivider, enableTimer, counterAlign } = attributes;
	const classes = classnames( {
		'kb-countdown-container': true,
		[ `kb-countdown-container-${ uniqueID }` ]: uniqueID,
		[ `kb-countdown-timer-layout-${ timerLayout }` ] : timerLayout,
		'kb-countdown-has-timer' : enableTimer,
		'kb-countdown-enable-dividers': 'inline' !== timerLayout && countdownDivider,
		[ `kb-countdown-align-${ counterAlign[0] }` ]: ( undefined !== counterAlign && undefined !== counterAlign[0] ? counterAlign[0] : false ),
		[ `kb-countdown-align-tablet-${ counterAlign[1] }` ]: ( undefined !== counterAlign && undefined !== counterAlign[1] ? counterAlign[1] : false ),
		[ `kb-countdown-align-mobile-${ counterAlign[2] }` ]: ( undefined !== counterAlign && undefined !== counterAlign[2] ? counterAlign[2] : false ),
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
	} );
	return (
		<div className={ classes } data-id={ uniqueID }>
			<InnerBlocks.Content />
		</div>
	);
}
export default Save;
