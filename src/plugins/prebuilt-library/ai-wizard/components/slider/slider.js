/**
 * External dependencies
 */
import ReactSlidy from 'react-slidy'

/**
 * WordPress dependencies
 */
import { Dashicon, __experimentalText as Text } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import img1 from '../../assets/sample-content-1.jpg';
import img2 from '../../assets/sample-content-2.jpg';
import img3 from '../../assets/sample-content-3.jpg';
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

export function Slider() {
	return (
		<>
			<Text align="center" style={ styles.sliderContent }>
				{ __('Not sure where to start? Here\'s some real life examples!', 'kadence-blocks') }
			</Text>
			<ReactSlidy
				infiniteLoop
				ArrowLeft={ CustomArrowLeft }
				ArrowRight={ CustomArrowRight }
			>
				<img style={ styles.img } src={ img1 }	/>
				<img style={ styles.img } src={ img2 }	/>
				<img style={ styles.img } src={ img3 }	/>
			</ReactSlidy>
		</>
	);
}

