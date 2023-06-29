/**
 * External dependencies
 */
import ReactSlidy from 'react-slidy';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Dashicon, __experimentalText as Text } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './slider.scss';

const styles = {
	img: {
		height: 'clamp(400px, 600px, 60vh)',
		width: 'auto',
		aspectRation: '11/15'
	},
	sliderContent: {
		color: '#FFFFFF',
		display: 'block',
		marginBottom: 24
	}
}

function CustomArrow({icon, ...props}) {
  return (
    <button { ...props }>
      <span role="img" aria-label="Arrow">
        <Dashicon icon={ icon } />
      </span>
    </button>
  )
}

function CustomArrowLeft(props) {
  return <CustomArrow { ...props } icon="arrow-left-alt2" />
}

function CustomArrowRight(props) {
  return <CustomArrow { ...props } icon="arrow-right-alt2" />
}

export function Slider({ slides = [], text, backgroundImage }) {
	if (! slides.length) {
		return;
	}

	const sliderClasses = classnames('stellarwp-slider', {
		'has-background': backgroundImage,
	})

	return (
		<div className={ sliderClasses } style={{ backgroundImage: `url(${ backgroundImage })` }}>
			{ text ? (
				<Text className="stellarwp-slider__text" align="center" style={ styles.sliderContent }>
					{ text }
				</Text>
			) : null }
			<ReactSlidy
				infiniteLoop
				ArrowLeft={ CustomArrowLeft }
				ArrowRight={ CustomArrowRight }
			>
				{
					slides.map((slide) => (
						<img style={ styles.img } src={ slide }	/>
					))
				}
			</ReactSlidy>
		</div>
	);
}

