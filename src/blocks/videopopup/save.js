/**
 * BLOCK: Kadence Video Popup
 */

import { IconSpanTag } from '@kadence/components';
import classNames from 'classnames';
import { useBlockProps } from '@wordpress/block-editor';

function Save(props) {
	const {
		attributes: {
			type,
			uniqueID,
			url,
			media,
			ratio,
			playBtn,
			background,
			displayShadow,
			autoPlay,
			popup,
			ariaLabel,
			youtubeCookies,
			inQueryBlock,
			posterType,
			mediaPoster,
		},
	} = props;
	const intrinsic = undefined !== ratio && 'custom' !== ratio ? ratio : undefined;
	const imageRatio =
		'custom' === ratio &&
		undefined !== background &&
		undefined !== background[0] &&
		undefined !== background[0].imgWidth &&
		undefined !== background[0].imageHeight
			? (background[0].imageHeight / background[0].imgWidth) * 100
			: intrinsic;
	const theIcon = playBtn[0].icon ? playBtn[0].icon : 'fas_play';
	const popAnimation =
		undefined !== popup && undefined !== popup[0] && undefined !== popup[0].animation ? popup[0].animation : 'none';
	const playTitle = playBtn[0].title ? playBtn[0].title : '';
	const playSize = !playBtn[0].size ? '30' : playBtn[0].size;
	const playSizeClass = !playBtn[0].size ? 'auto' : playBtn[0].size;
	const playAnimationClass = '' !== playBtn[0].animation ? playBtn[0].animation : 'none';
	const playClasses = `kt-video-svg-icon kt-video-svg-icon-style-${playBtn[0].style} kt-video-svg-icon-${theIcon} kt-video-play-animation-${playAnimationClass} kt-video-svg-icon-size-${playSizeClass}`;
	const classes =
		'kadence-video-popup-link ' + ('local' == type ? 'kadence-video-type-local' : 'kadence-video-type-external');

	const dataAttrs = {
		'data-popup-class': `kadence-popup-${uniqueID}`,
		'data-effect': popAnimation,
		'data-popup-id': `kadence-local-video-${uniqueID}`,
		'data-popup-auto': autoPlay ? 'true' : 'false',
		'data-youtube-cookies': youtubeCookies ? 'true' : 'false',
	};

	const containerClasses = classNames('wp-block-kadence-videopopup', 'kadence-video-popup' + uniqueID);

	return (
		<div {...useBlockProps.save({ className: containerClasses })}>
			<div
				className={`kadence-video-popup-wrap ${
					displayShadow ? 'kadence-video-shadow' : 'kadence-video-noshadow'
				}`}
			>
				<div
					className={`kadence-video-intrinsic ${
						undefined !== ratio ? ' kadence-video-set-ratio-' + ratio : ''
					}`}
					style={{
						paddingBottom: undefined !== imageRatio ? imageRatio + '%' : undefined,
					}}
				>
					{posterType !== 'video' && (
						<img
							src={background[0].img}
							alt={background[0].imgAlt}
							width={background[0].imgWidth}
							height={background[0].imageHeight}
							className={
								background[0].imgID
									? `kadence-video-poster wp-image-${background[0].imgID}`
									: 'kadence-video-poster'
							}
						/>
					)}
					{posterType === 'video' && (
						<>
							{undefined !== mediaPoster && undefined !== mediaPoster[0] && mediaPoster[0].url && (
								<video
									src={mediaPoster[0].url}
									autoPlay={true}
									loop={true}
									muted={true}
									playsInline={true}
									className={'kadence-video-poster'}
								/>
							)}
						</>
					)}
					<div className="kadence-video-overlay"></div>
					{'local' === type && (
						<button className={classes} aria-label={ariaLabel ? ariaLabel : undefined} {...dataAttrs}>
							<IconSpanTag extraClass={playClasses} name={theIcon} title={playTitle} />
						</button>
					)}
					{'local' !== type && (
						<a
							className={classes}
							aria-label={ariaLabel ? ariaLabel : undefined}
							href={!url ? '#' : url}
							role="button"
							{...dataAttrs}
						>
							<IconSpanTag extraClass={playClasses} name={theIcon} title={playTitle} />
						</a>
					)}
				</div>
			</div>
			{'local' === type && undefined !== media && undefined !== media[0] && media[0].url && (
				<div
					id={`kadence-local-video-${uniqueID}`}
					className="mfp-hide mfp-with-anim kadence-local-video-popup-wrap"
				>
					<video
						className="kadence-local-video-popup"
						controls={true}
						preload={'metadata'}
						src={media[0].url}
					/>
				</div>
			)}
		</div>
	);
}

export default Save;
