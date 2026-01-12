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
import { __ } from '@wordpress/i18n';

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
		pauseButtonPosition,
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
					className={`kb-countdown-pause-button kb-countdown-pause-button-${pauseButtonPosition || 'top-right'}`}
					aria-label={__('Pause countdown timer', 'kadence-blocks')}
					title={__('Pause countdown', 'kadence-blocks')}
				>
					<span className="kb-countdown-pause-icon" aria-hidden="true">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
							<rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
						</svg>
					</span>
				</button>
			)}
			<InnerBlocks.Content />
		</div>
	);
}
export default Save;
