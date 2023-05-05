/**
 * External dependencies
 */
import ReactSlidy from 'react-slidy'

/**
 * WordPress dependencies
 */
import { Dashicon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import '../slider/slider.scss';

export function ImageCarousel({ images }) {
	if (! images || ! Array.isArray(images)) {
		return <></>;
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

	return (
		<div className={ 'stellarwp-photo-preview' }>
			<ReactSlidy
				infiniteLoop
				numOfSlides={ 5 }
				sanitize={ false }
				ArrowLeft={ CustomArrowLeft }
				ArrowRight={ CustomArrowRight }
				showArrows={ images.length > 5 }
			>
				{ images.map((image) => (
					<div style={{ paddingLeft: 8, paddingRight: 8 }}>
						<img src={ image.thumbnail } />
					</div>
				)) }
			</ReactSlidy>
		</div>
	)
}

