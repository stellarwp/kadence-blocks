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
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function Save({ attributes }) {
	const {
		uniqueID,
		vsdesk,
		vstablet,
		vsmobile,
		timerLayout,
		countdownDivider,
		enableTimer,
		counterAlign,
		revealOnLoad,
		enablePauseButton,
	} = attributes;
	const classes = classnames({
		'kb-countdown-container': true,
		[`kb-countdown-container-${uniqueID}`]: uniqueID,
		[`kb-countdown-timer-layout-${timerLayout}`]: enableTimer && timerLayout,
		'kb-countdown-has-timer': enableTimer,
		'kb-countdown-reveal-on-load': revealOnLoad,
		'kb-countdown-enable-dividers': 'inline' !== timerLayout && countdownDivider && enableTimer,
		[`kb-countdown-align-${counterAlign[0]}`]:
			undefined !== counterAlign && undefined !== counterAlign[0] && enableTimer ? counterAlign[0] : false,
		[`kb-countdown-align-tablet-${counterAlign[1]}`]:
			undefined !== counterAlign && undefined !== counterAlign[1] && enableTimer ? counterAlign[1] : false,
		[`kb-countdown-align-mobile-${counterAlign[2]}`]:
			undefined !== counterAlign && undefined !== counterAlign[2] && enableTimer ? counterAlign[2] : false,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
	});

	const blockProps = useBlockProps.save({
		className: classes,
	});

	return (
		<div {...blockProps} data-id={uniqueID}>
			{enablePauseButton && (
				<button
					type="button"
					className="kb-countdown-pause-button"
					aria-label="Pause countdown timer"
					aria-pressed="false"
					title="Pause countdown"
				>
					<span className="kb-countdown-pause-icon" aria-hidden="true">
						⏸
					</span>
				</button>
			)}
			<InnerBlocks.Content />
		</div>
	);
}
export default Save;
