/**
 * BLOCK: Kadence Countdown
 */
const { rest_url } = kadence_blocks_params;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { get } from 'lodash';

function Save( { attributes } ) {
	const { uniqueID } = attributes;
	const classes = classnames( {
		'kb-lottie-container': true,
		[ `kb-lottie-container${ uniqueID }` ] : true,
		[ `align${ attributes.align }` ]: attributes.align,
	} );

	const getAnimationUrl= (fileSrc, fileUrl, localFile, rest_url) => {
		let url = '';

		if( fileSrc === 'url') {
			url = fileUrl;
		} else {
			url = rest_url + 'kb-lottieanimation/v1/animations/' + get(localFile, [0, 'value'], '')
		}

		if( url === '' || url === rest_url + 'kb-lottieanimation/v1/animations/') {
			url = 'https://assets10.lottiefiles.com/packages/lf20_rqcjx8hr.json';
		}

		return url;
	}

	let playerProps = {};

	if(attributes.loop){
		playerProps.loop = '';
	}

	if(attributes.playbackSpeed){
		playerProps.speed = attributes.playbackSpeed;
	}

	if(attributes.showControls){
		playerProps.controls = '';
	}

	if(attributes.autoplay){
		playerProps.autoplay = '';
	}

	if(attributes.onlyPlayOnHover){
		playerProps.hover = '';
	}

	if(attributes.bouncePlayback) {
		playerProps.mode = 'bounce';
	} else {
		playerProps.mode = 'normal';
	}

	if( attributes.delay !== 0){
		playerProps.intermission = 1000 * attributes.delay;
	}

	if( attributes.loopLimit !== 0 ) {
		playerProps.count = attributes.loopLimit;
	}

	return (
		<div className={ classes }>
			<lottie-player
				{...playerProps}
				id={ 'kb-lottie-player' + uniqueID }
				src={ getAnimationUrl(attributes.fileSrc, attributes.fileUrl, attributes.localFile, rest_url) }
				aria-label={ attributes.label ? attributes.label : undefined }
				style={ {
					maxWidth: ( attributes.width === "0" ? 'auto' : attributes.width + 'px'),
					height: 'auto',
					margin: '0 auto'
				} }
			>
			</lottie-player>
		</div>
	);
}
export default Save;
