/**
 * BLOCK: Lottie
 */

const { rest_url } = kadence_blocks_params;
import classnames from 'classnames';
import { get } from 'lodash';

export default [
	{
		attributes: {
			align: {
				type: 'string',
			},
			fileSrc: {
				type: 'string',
				default: 'url',
			},
			fileUrl: {
				type: 'string',
				default: 'https://assets10.lottiefiles.com/packages/lf20_rqcjx8hr.json',
			},
			localFile: {
				type: 'array',
				default: [],
			},
			showControls: {
				type: 'boolean',
				default: false,
			},
			autoplay: {
				type: 'boolean',
				default: true,
			},
			loop: {
				type: 'boolean',
				default: true,
			},
			onlyPlayOnHover: {
				type: 'boolean',
				default: false,
			},
			onlyPlayOnScroll: {
				type: 'boolean',
				default: false,
			},
			waitUntilInView: {
				type: 'boolean',
				default: false,
			},
			startFrame: {
				type: 'number',
				default: '0',
			},
			endFrame: {
				type: 'number',
				default: '100',
			},
			bouncePlayback: {
				type: 'boolean',
				default: false,
			},
			playbackSpeed: {
				type: 'number',
				default: 1,
			},
			label: {
				type: 'string',
				default: '',
			},
			loopLimit: {
				type: 'number',
				default: 0,
			},
			delay: {
				type: 'number',
				default: 0,
			},
			id: {
				type: 'number',
			},
			width: {
				type: 'number',
				default: '0',
			},
			uniqueID: {
				type: 'string',
			},
			marginDesktop: {
				type: 'array',
				default: ['', '', '', ''],
			},
			marginTablet: {
				type: 'array',
				default: ['', '', '', ''],
			},
			marginMobile: {
				type: 'array',
				default: ['', '', '', ''],
			},
			marginUnit: {
				type: 'string',
				default: 'px',
			},
			paddingDesktop: {
				type: 'array',
				default: ['', '', '', ''],
			},
			paddingTablet: {
				type: 'array',
				default: ['', '', '', ''],
			},
			paddingMobile: {
				type: 'array',
				default: ['', '', '', ''],
			},
			paddingUnit: {
				type: 'string',
				default: 'px',
			},
		},
		getEditWrapperProps({ blockAlignment }) {
			return {
				'data-align': blockAlignment,
			};
		},
		save: ({ attributes }) => {
			const { uniqueID } = attributes;
			const classes = classnames({
				'kb-lottie-container': true,
				[`kb-lottie-container${uniqueID}`]: true,
				[`align${attributes.align}`]: attributes.align,
			});

			const getAnimationUrl = (fileSrc, fileUrl, localFile, rest_url) => {
				let url = '';

				if (fileSrc === 'url') {
					url = fileUrl;
				} else {
					url = rest_url + 'kb-lottieanimation/v1/animations/' + get(localFile, [0, 'value'], '');
				}

				if (url === '' || url === rest_url + 'kb-lottieanimation/v1/animations/') {
					url = 'https://assets10.lottiefiles.com/packages/lf20_rqcjx8hr.json';
				}

				return url;
			};

			const playerProps = {};

			if (attributes.loop) {
				playerProps.loop = '';
			}

			if (attributes.playbackSpeed) {
				playerProps.speed = attributes.playbackSpeed;
			}

			if (attributes.showControls) {
				playerProps.controls = '';
			}

			if (attributes.autoplay) {
				playerProps.autoplay = '';
			}

			if (attributes.onlyPlayOnHover) {
				playerProps.hover = '';
			}

			if (attributes.bouncePlayback) {
				playerProps.mode = 'bounce';
			} else {
				playerProps.mode = 'normal';
			}

			if (attributes.delay !== 0) {
				playerProps.intermission = 1000 * attributes.delay;
			}

			if (attributes.loopLimit !== 0) {
				playerProps.count = attributes.loopLimit;
			}

			return (
				<div className={classes}>
					<lottie-player
						{...playerProps}
						id={'kb-lottie-player' + uniqueID}
						src={getAnimationUrl(attributes.fileSrc, attributes.fileUrl, attributes.localFile, rest_url)}
						aria-label={attributes.label ? attributes.label : undefined}
						style={{
							maxWidth: attributes.width === '0' ? 'auto' : attributes.width + 'px',
							height: 'auto',
							margin: '0 auto',
						}}
					></lottie-player>
				</div>
			);
		},
	},
];
