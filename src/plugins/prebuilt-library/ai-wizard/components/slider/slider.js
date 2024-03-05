/**
 * External dependencies
 */
import ReactSlidy from 'react-slidy';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './slider.scss';

function CustomArrow({ icon, ...props }) {
	return (
		<button {...props}>
			<span role="img" aria-label="Arrow">
				<Dashicon icon={icon} />
			</span>
		</button>
	);
}

function CustomArrowLeft(props) {
	return <CustomArrow {...props} icon="arrow-left-alt2" />;
}

function CustomArrowRight(props) {
	return <CustomArrow {...props} icon="arrow-right-alt2" />;
}

export function Slider(props) {
	const { slides = [], text, backgroundImage, doAfterSlide = () => {}, doBeforeSlide = () => {} } = props;

	if (!slides.length) {
		return;
	}

	const sliderClasses = classnames('stellarwp-slider', {
		'has-background': backgroundImage,
	});

	return (
		<div className={sliderClasses} style={{ backgroundImage: `url(${backgroundImage})` }}>
			{text ? (
				<span className="stellarwp-slider__text" align="center">
					{text}
				</span>
			) : null}
			<ReactSlidy
				infiniteLoop
				ArrowLeft={CustomArrowLeft}
				ArrowRight={CustomArrowRight}
				doAfterSlide={doAfterSlide}
				doBeforeSlide={doBeforeSlide}
			>
				{slides.map((slide) => slide)}
			</ReactSlidy>
		</div>
	);
}
