/**
 * BLOCK: Video Popup
 */

import { GenIcon } from '@kadence/components';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { get } from 'lodash';
import { useBlockProps } from '@wordpress/block-editor';

export default [
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			type: {
				type: 'string',
				default: 'iframe',
			},
			url: {
				type: 'string',
			},
			media: {
				type: 'array',
				default: [
					{
						url: '',
						id: '',
						width: '',
						height: '',
						alt: '',
						subtype: '',
					},
				],
			},
			autoPlay: {
				type: 'boolean',
				default: true,
			},
			ratio: {
				type: 'string',
			},
			borderRadius: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderWidth: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderColor: {
				type: 'string',
			},
			borderOpacity: {
				type: 'number',
			},
			playBtn: {
				type: 'array',
				default: [
					{
						icon: '',
						size: '',
						width: 2,
						title: 'Play',
						color: '#ffffff',
						opacity: 1,
						background: '#000000',
						backgroundOpacity: 0.7,
						border: '',
						borderOpacity: 1,
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						padding: '',
						style: 'default',
						animation: 'none',
						colorHover: '',
						opacityHover: 1,
						backgroundHover: '',
						backgroundOpacityHover: 1,
						borderHover: '',
						borderOpacityHover: 1,
					},
				],
			},
			background: {
				type: 'array',
				default: [
					{
						color: '',
						colorOpacity: 1,
						img: '',
						imgID: '',
						imgAlt: '',
						imgWidth: '',
						imageHeight: '',
						bgSize: 'cover',
						bgPosition: 'center center',
						bgAttachment: 'scroll',
						bgRepeat: 'no-repeat',
					},
				],
			},
			backgroundOverlay: {
				type: 'array',
				default: [
					{
						type: 'solid',
						fill: '#000000',
						fillOpacity: 1,
						secondFill: '',
						secondFillOpacity: 1,
						gradLoc: 0,
						gradLocSecond: 100,
						gradType: 'linear',
						gradAngle: 180,
						gradPosition: 'center center',
						opacity: 0.3,
						opacityHover: 0.5,
						blendMode: 'none',
					},
				],
			},
			padding: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			paddingUnit: {
				type: 'string',
				default: 'px',
			},
			margin: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			marginUnit: {
				type: 'string',
				default: 'px',
			},
			displayShadow: {
				type: 'boolean',
				default: false,
			},
			shadow: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			shadowHover: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			maxWidth: {
				type: 'number',
			},
			maxWidthUnit: {
				type: 'string',
			},
			popup: {
				type: 'array',
				default: [
					{
						background: '#000000',
						backgroundOpacity: 0.8,
						closeColor: '#ffffff',
						maxWidth: 900,
						maxWidthTablet: '',
						maxWidthMobile: '',
						maxWidthUnit: 'px',
						animation: 'none',
					},
				],
			},
			ariaLabel: {
				type: 'string',
			},
			youtubeCookies: {
				type: 'boolean',
				default: true,
			},
			inQueryBlock: {
				type: 'boolean',
				default: false,
			},
		},
		save: ({ attributes }) => {
			const {
				type,
				uniqueID,
				url,
				media,
				ratio,
				playBtn,
				background,
				displayShadow,
				maxWidth,
				maxWidthUnit,
				autoPlay,
				popup,
				ariaLabel,
				youtubeCookies,
				inQueryBlock,
			} = attributes;
			const intrinsic = undefined !== ratio && 'custom' !== ratio ? ratio : undefined;
			const imageRatio =
				'custom' === ratio &&
				undefined !== background &&
				undefined !== background[0] &&
				undefined !== background[0].imgWidth &&
				undefined !== background[0].imageHeight
					? (background[0].imageHeight / background[0].imgWidth) * 100
					: intrinsic;
			const mwUnit = undefined !== maxWidthUnit ? maxWidthUnit : 'px';
			const theIcon = playBtn[0].icon ? playBtn[0].icon : 'fas_play';
			const popAnimation =
				undefined !== popup && undefined !== popup[0] && undefined !== popup[0].animation
					? popup[0].animation
					: 'none';
			const allIcons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };
			const playIcon = get(allIcons, theIcon, {});
			const playTitle = playBtn[0].title ? playBtn[0].title : '';
			const playSize = !playBtn[0].size ? '30' : playBtn[0].size;
			const playSizeClass = !playBtn[0].size ? 'auto' : playBtn[0].size;
			const playAnimationClass = '' !== playBtn[0].animation ? playBtn[0].animation : 'none';
			const playClasses = `kt-video-svg-icon kt-video-svg-icon-style-${playBtn[0].style} kt-video-svg-icon-${theIcon} kt-video-play-animation-${playAnimationClass} kt-video-svg-icon-size-${playSizeClass}`;
			const classes =
				'kadence-video-popup-link ' +
				('local' == type ? 'kadence-video-type-local' : 'kadence-video-type-external');

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
						style={{
							maxWidth: undefined !== maxWidth ? maxWidth + mwUnit : undefined,
						}}
					>
						<div
							className={`kadence-video-intrinsic ${
								undefined !== ratio ? ' kadence-video-set-ratio-' + ratio : ''
							}`}
							style={{
								paddingBottom: undefined !== imageRatio ? imageRatio + '%' : undefined,
							}}
						>
							{undefined !== background[0] &&
								undefined !== background[0].img &&
								'' !== background[0].img && (
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
							<div className="kadence-video-overlay"></div>
							{'local' === type && (
								<button
									className={classes}
									aria-label={ariaLabel ? ariaLabel : undefined}
									{...dataAttrs}
								>
									<GenIcon
										className={playClasses}
										name={playBtn[0].icon}
										size={playSize}
										title={playTitle}
										icon={playIcon}
									/>
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
									<GenIcon
										className={playClasses}
										name={playBtn[0].icon}
										size={playSize}
										title={playTitle}
										icon={playIcon}
									/>
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
		},
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			type: {
				type: 'string',
				default: 'iframe',
			},
			url: {
				type: 'string',
			},
			media: {
				type: 'array',
				default: [
					{
						url: '',
						id: '',
						width: '',
						height: '',
						alt: '',
						subtype: '',
					},
				],
			},
			autoPlay: {
				type: 'boolean',
				default: true,
			},
			ratio: {
				type: 'string',
			},
			borderRadius: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderWidth: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderColor: {
				type: 'string',
			},
			borderOpacity: {
				type: 'number',
			},
			playBtn: {
				type: 'array',
				default: [
					{
						icon: '',
						size: '',
						width: 2,
						title: 'Play',
						color: '#ffffff',
						opacity: 1,
						background: '#000000',
						backgroundOpacity: 0.7,
						border: '',
						borderOpacity: 1,
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						padding: '',
						style: 'default',
						animation: 'none',
						colorHover: '',
						opacityHover: 1,
						backgroundHover: '',
						backgroundOpacityHover: 1,
						borderHover: '',
						borderOpacityHover: 1,
					},
				],
			},
			background: {
				type: 'array',
				default: [
					{
						color: '',
						colorOpacity: 1,
						img: '',
						imgID: '',
						imgAlt: '',
						imgWidth: '',
						imageHeight: '',
						bgSize: 'cover',
						bgPosition: 'center center',
						bgAttachment: 'scroll',
						bgRepeat: 'no-repeat',
					},
				],
			},
			backgroundOverlay: {
				type: 'array',
				default: [
					{
						type: 'solid',
						fill: '#000000',
						fillOpacity: 1,
						secondFill: '',
						secondFillOpacity: 1,
						gradLoc: 0,
						gradLocSecond: 100,
						gradType: 'linear',
						gradAngle: 180,
						gradPosition: 'center center',
						opacity: 0.3,
						opacityHover: 0.5,
						blendMode: 'none',
					},
				],
			},
			padding: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			paddingUnit: {
				type: 'string',
				default: 'px',
			},
			margin: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			marginUnit: {
				type: 'string',
				default: 'px',
			},
			displayShadow: {
				type: 'boolean',
				default: false,
			},
			shadow: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			shadowHover: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			maxWidth: {
				type: 'number',
			},
			maxWidthUnit: {
				type: 'string',
			},
			popup: {
				type: 'array',
				default: [
					{
						background: '#000000',
						backgroundOpacity: 0.8,
						closeColor: '#ffffff',
						maxWidth: 900,
						maxWidthTablet: '',
						maxWidthMobile: '',
						maxWidthUnit: 'px',
						animation: 'none',
					},
				],
			},
			ariaLabel: {
				type: 'string',
			},
			youtubeCookies: {
				type: 'boolean',
				default: true,
			},
			inQueryBlock: {
				type: 'boolean',
				default: false,
			},
		},
		save: ({ attributes }) => {
			const {
				type,
				uniqueID,
				url,
				media,
				ratio,
				playBtn,
				background,
				displayShadow,
				maxWidth,
				maxWidthUnit,
				autoPlay,
				popup,
				ariaLabel,
				inQueryBlock,
			} = attributes;
			const intrinsic = undefined !== ratio && 'custom' !== ratio ? ratio : undefined;
			const imageRatio =
				'custom' === ratio &&
				undefined !== background &&
				undefined !== background[0] &&
				undefined !== background[0].imgWidth &&
				undefined !== background[0].imageHeight
					? (background[0].imageHeight / background[0].imgWidth) * 100
					: intrinsic;
			const mwUnit = undefined !== maxWidthUnit ? maxWidthUnit : 'px';
			const theIcon = playBtn[0].icon ? playBtn[0].icon : 'fas_play';
			const allIcons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };

			return (
				<div className={`wp-block-kadence-videopopup kadence-video-popup${uniqueID}`}>
					<div
						className={`kadence-video-popup-wrap ${
							displayShadow ? 'kadence-video-shadow' : 'kadence-video-noshadow'
						}`}
						style={{
							maxWidth: undefined !== maxWidth ? maxWidth + mwUnit : undefined,
						}}
					>
						<div
							className={`kadence-video-intrinsic ${
								undefined !== ratio ? ' kadence-video-set-ratio-' + ratio : ''
							}`}
							style={{
								paddingBottom: undefined !== imageRatio ? imageRatio + '%' : undefined,
							}}
						>
							{undefined !== background[0] &&
								undefined !== background[0].img &&
								'' !== background[0].img && (
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
							<div className="kadence-video-overlay"></div>
							{'local' === type && (
								<button
									className={'kadence-video-popup-link kadence-video-type-local'}
									ariaLabel={ariaLabel ? ariaLabel : undefined}
									data-popup-class={`kadence-popup-${uniqueID}`}
									data-effect={
										undefined !== popup &&
										undefined !== popup[0] &&
										undefined !== popup[0].animation
											? popup[0].animation
											: 'none'
									}
									data-popup-id={`kadence-local-video-${uniqueID}`}
									data-popup-auto={autoPlay ? 'true' : 'false'}
								>
									<GenIcon
										className={`kt-video-svg-icon kt-video-svg-icon-style-${
											playBtn[0].style
										} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
											'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
										} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
										name={playBtn[0].icon}
										size={!playBtn[0].size ? '30' : playBtn[0].size}
										title={playBtn[0].title ? playBtn[0].title : ''}
										icon={allIcons[theIcon]}
									/>
								</button>
							)}
							{'local' !== type && (
								<a
									href={!url ? '#' : url}
									role="button"
									ariaLabel={ariaLabel ? ariaLabel : undefined}
									data-popup-class={`kadence-popup-${uniqueID}`}
									data-effect={
										undefined !== popup &&
										undefined !== popup[0] &&
										undefined !== popup[0].animation
											? popup[0].animation
											: 'none'
									}
									className={'kadence-video-popup-link kadence-video-type-external'}
								>
									<GenIcon
										className={`kt-video-svg-icon kt-video-svg-icon-style-${
											playBtn[0].style
										} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
											'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
										} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
										name={playBtn[0].icon}
										size={!playBtn[0].size ? '30' : playBtn[0].size}
										title={playBtn[0].title ? playBtn[0].title : ''}
										icon={allIcons[theIcon]}
									/>
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
		},
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			type: {
				type: 'string',
				default: 'iframe',
			},
			url: {
				type: 'string',
			},
			media: {
				type: 'array',
				default: [
					{
						url: '',
						id: '',
						width: '',
						height: '',
						alt: '',
						subtype: '',
					},
				],
			},
			autoPlay: {
				type: 'boolean',
				default: false,
			},
			ratio: {
				type: 'string',
			},
			borderRadius: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderWidth: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderColor: {
				type: 'string',
			},
			borderOpacity: {
				type: 'number',
			},
			playBtn: {
				type: 'array',
				default: [
					{
						icon: '',
						size: '',
						width: 2,
						title: __('Play'),
						color: '#ffffff',
						opacity: 1,
						background: '#000000',
						backgroundOpacity: 0.7,
						border: '',
						borderOpacity: 1,
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						padding: '',
						style: 'default',
						animation: 'none',
						colorHover: '',
						opacityHover: 1,
						backgroundHover: '',
						backgroundOpacityHover: 1,
						borderHover: '',
						borderOpacityHover: 1,
					},
				],
			},
			background: {
				type: 'array',
				default: [
					{
						color: '',
						colorOpacity: 1,
						img: '',
						imgID: '',
						imgAlt: '',
						imgWidth: '',
						imageHeight: '',
						bgSize: 'cover',
						bgPosition: 'center center',
						bgAttachment: 'scroll',
						bgRepeat: 'no-repeat',
					},
				],
			},
			backgroundOverlay: {
				type: 'array',
				default: [
					{
						type: 'solid',
						fill: '#000000',
						fillOpacity: 1,
						secondFill: '',
						secondFillOpacity: 1,
						gradLoc: 0,
						gradLocSecond: 100,
						gradType: 'linear',
						gradAngle: 180,
						gradPosition: 'center center',
						opacity: 0.3,
						opacityHover: 0.5,
						blendMode: 'none',
					},
				],
			},
			padding: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			margin: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			marginUnit: {
				type: 'string',
			},
			displayShadow: {
				type: 'boolean',
				default: false,
			},
			shadow: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			shadowHover: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			maxWidth: {
				type: 'number',
			},
			maxWidthUnit: {
				type: 'string',
			},
			popup: {
				type: 'array',
				default: [
					{
						background: '#000000',
						backgroundOpacity: 0.8,
						closeColor: '#ffffff',
						maxWidth: 900,
						maxWidthUnit: 'px',
						animation: 'none',
					},
				],
			},
			ariaLabel: {
				type: 'string',
			},
			inQueryBlock: {
				type: 'boolean',
				default: false,
			},
		},
		save: ({ attributes }) => {
			const {
				type,
				uniqueID,
				url,
				media,
				ratio,
				playBtn,
				background,
				displayShadow,
				maxWidth,
				maxWidthUnit,
				autoPlay,
				popup,
				ariaLabel,
				inQueryBlock,
			} = attributes;
			const intrinsic = undefined !== ratio && 'custom' !== ratio ? ratio : undefined;
			const imageRatio =
				'custom' === ratio &&
				undefined !== background &&
				undefined !== background[0] &&
				undefined !== background[0].imgWidth &&
				undefined !== background[0].imageHeight
					? (background[0].imageHeight / background[0].imgWidth) * 100
					: intrinsic;
			const mwUnit = undefined !== maxWidthUnit ? maxWidthUnit : 'px';
			const theIcon = playBtn[0].icon ? playBtn[0].icon : 'fas_play';
			const allIcons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };

			return (
				<div className={`kadence-video-popup${uniqueID}`}>
					<div
						className={`kadence-video-popup-wrap ${
							displayShadow ? 'kadence-video-shadow' : 'kadence-video-noshadow'
						}`}
						style={{
							maxWidth: undefined !== maxWidth ? maxWidth + mwUnit : undefined,
						}}
					>
						<div
							className={`kadence-video-intrinsic ${
								undefined !== ratio ? ' kadence-video-set-ratio-' + ratio : ''
							}`}
							style={{
								paddingBottom: undefined !== imageRatio ? imageRatio + '%' : undefined,
							}}
						>
							{undefined !== background[0] &&
								undefined !== background[0].img &&
								'' !== background[0].img && (
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
							<div className="kadence-video-overlay"></div>
							{'local' === type && (
								<button
									className={'kadence-video-popup-link kadence-video-type-local'}
									ariaLabel={ariaLabel ? ariaLabel : undefined}
									data-popup-class={`kadence-popup-${uniqueID}`}
									data-effect={
										undefined !== popup &&
										undefined !== popup[0] &&
										undefined !== popup[0].animation
											? popup[0].animation
											: 'none'
									}
									data-popup-id={`kadence-local-video-${uniqueID}`}
									data-popup-auto={autoPlay ? 'true' : 'false'}
								>
									<GenIcon
										className={`kt-video-svg-icon kt-video-svg-icon-style-${
											playBtn[0].style
										} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
											'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
										} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
										name={playBtn[0].icon}
										size={!playBtn[0].size ? '30' : playBtn[0].size}
										title={playBtn[0].title ? playBtn[0].title : ''}
										icon={allIcons[theIcon]}
									/>
								</button>
							)}
							{'local' !== type && (
								<a
									href={!url ? '#' : url}
									role="button"
									ariaLabel={ariaLabel ? ariaLabel : undefined}
									data-popup-class={`kadence-popup-${uniqueID}`}
									data-effect={
										undefined !== popup &&
										undefined !== popup[0] &&
										undefined !== popup[0].animation
											? popup[0].animation
											: 'none'
									}
									className={'kadence-video-popup-link kadence-video-type-external'}
								>
									<GenIcon
										className={`kt-video-svg-icon kt-video-svg-icon-style-${
											playBtn[0].style
										} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
											'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
										} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
										name={playBtn[0].icon}
										size={!playBtn[0].size ? '30' : playBtn[0].size}
										title={playBtn[0].title ? playBtn[0].title : ''}
										icon={allIcons[theIcon]}
									/>
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
		},
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			type: {
				type: 'string',
				default: 'iframe',
			},
			url: {
				type: 'string',
			},
			media: {
				type: 'array',
				default: [
					{
						url: '',
						id: '',
						width: '',
						height: '',
						alt: '',
						subtype: '',
					},
				],
			},
			autoPlay: {
				type: 'boolean',
				default: false,
			},
			ratio: {
				type: 'string',
			},
			borderRadius: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderWidth: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderColor: {
				type: 'string',
			},
			borderOpacity: {
				type: 'number',
			},
			playBtn: {
				type: 'array',
				default: [
					{
						icon: '',
						size: '',
						width: 2,
						title: __('Play'),
						color: '#ffffff',
						opacity: 1,
						background: '#000000',
						backgroundOpacity: 0.7,
						border: '',
						borderOpacity: 1,
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						padding: '',
						style: 'default',
						animation: 'none',
						colorHover: '',
						opacityHover: 1,
						backgroundHover: '',
						backgroundOpacityHover: 1,
						borderHover: '',
						borderOpacityHover: 1,
					},
				],
			},
			background: {
				type: 'array',
				default: [
					{
						color: '',
						colorOpacity: 1,
						img: '',
						imgID: '',
						imgAlt: '',
						imgWidth: '',
						imageHeight: '',
						bgSize: 'cover',
						bgPosition: 'center center',
						bgAttachment: 'scroll',
						bgRepeat: 'no-repeat',
					},
				],
			},
			backgroundOverlay: {
				type: 'array',
				default: [
					{
						type: 'solid',
						fill: '#000000',
						fillOpacity: 1,
						secondFill: '',
						secondFillOpacity: 1,
						gradLoc: 0,
						gradLocSecond: 100,
						gradType: 'linear',
						gradAngle: 180,
						gradPosition: 'center center',
						opacity: 0.3,
						opacityHover: 0.5,
						blendMode: 'none',
					},
				],
			},
			padding: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			margin: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			marginUnit: {
				type: 'string',
			},
			displayShadow: {
				type: 'boolean',
				default: false,
			},
			shadow: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			shadowHover: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			maxWidth: {
				type: 'number',
			},
			maxWidthUnit: {
				type: 'string',
			},
		},
		save: ({ attributes }) => {
			const {
				type,
				uniqueID,
				url,
				media,
				ratio,
				playBtn,
				background,
				displayShadow,
				maxWidth,
				maxWidthUnit,
				autoPlay,
			} = attributes;
			const intrinsic = undefined !== ratio && 'custom' !== ratio ? ratio : undefined;
			const imageRatio =
				'custom' === ratio &&
				undefined !== background &&
				undefined !== background[0] &&
				undefined !== background[0].imgWidth &&
				undefined !== background[0].imageHeight
					? (background[0].imageHeight / background[0].imgWidth) * 100
					: intrinsic;
			const mwUnit = undefined !== maxWidthUnit ? maxWidthUnit : 'px';
			const theIcon = playBtn[0].icon ? playBtn[0].icon : 'fas_play';
			const allIcons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };

			return (
				<div className={`kadence-video-popup${uniqueID}`}>
					<div
						className={`kadence-video-popup-wrap ${
							displayShadow ? 'kadence-video-shadow' : 'kadence-video-noshadow'
						}`}
						style={{
							maxWidth: undefined !== maxWidth ? maxWidth + mwUnit : undefined,
						}}
					>
						<div
							className={`kadence-video-intrinsic ${
								undefined !== ratio ? ' kadence-video-set-ratio-' + ratio : ''
							}`}
							style={{
								paddingBottom: undefined !== imageRatio ? imageRatio + '%' : undefined,
							}}
						>
							{undefined !== background[0] &&
								undefined !== background[0].img &&
								'' !== background[0].img && (
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
							<div className="kadence-video-overlay"></div>
							{'local' === type && (
								<button
									className={'kadence-video-popup-link kadence-video-type-local'}
									data-popup-id={`kadence-local-video-${uniqueID}`}
									data-popup-auto={autoPlay ? 'true' : 'false'}
								>
									<GenIcon
										className={`kt-video-svg-icon kt-video-svg-icon-style-${
											playBtn[0].style
										} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
											'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
										} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
										name={playBtn[0].icon}
										size={!playBtn[0].size ? '30' : playBtn[0].size}
										title={playBtn[0].title ? playBtn[0].title : ''}
										icon={allIcons[theIcon]}
									/>
								</button>
							)}
							{'local' !== type && (
								<a
									href={!url ? '#' : url}
									role="button"
									className={'kadence-video-popup-link kadence-video-type-external'}
								>
									<GenIcon
										className={`kt-video-svg-icon kt-video-svg-icon-style-${
											playBtn[0].style
										} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
											'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
										} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
										name={playBtn[0].icon}
										size={!playBtn[0].size ? '30' : playBtn[0].size}
										title={playBtn[0].title ? playBtn[0].title : ''}
										icon={allIcons[theIcon]}
									/>
								</a>
							)}
						</div>
					</div>
					{'local' === type && undefined !== media && undefined !== media[0] && media[0].url && (
						<div id={`kadence-local-video-${uniqueID}`} className="mfp-hide kadence-local-video-popup-wrap">
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
		},
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			type: {
				type: 'string',
				default: 'iframe',
			},
			url: {
				type: 'string',
			},
			media: {
				type: 'array',
				default: [
					{
						url: '',
						id: '',
						width: '',
						height: '',
						alt: '',
						subtype: '',
					},
				],
			},
			autoPlay: {
				type: 'boolean',
				default: false,
			},
			ratio: {
				type: 'string',
			},
			borderRadius: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderWidth: {
				type: 'array',
				default: ['', '', '', ''],
			},
			borderColor: {
				type: 'string',
			},
			borderOpacity: {
				type: 'number',
			},
			playBtn: {
				type: 'array',
				default: [
					{
						icon: '',
						size: '',
						width: 2,
						title: __('Play'),
						color: '#ffffff',
						opacity: 1,
						background: '#000000',
						backgroundOpacity: 0.7,
						border: '',
						borderOpacity: 1,
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						padding: '',
						style: 'default',
						animation: 'none',
						colorHover: '',
						opacityHover: 1,
						backgroundHover: '',
						backgroundOpacityHover: 1,
						borderHover: '',
						borderOpacityHover: 1,
					},
				],
			},
			background: {
				type: 'array',
				default: [
					{
						color: '',
						colorOpacity: 1,
						img: '',
						imgID: '',
						imgAlt: '',
						imgWidth: '',
						imageHeight: '',
						bgSize: 'cover',
						bgPosition: 'center center',
						bgAttachment: 'scroll',
						bgRepeat: 'no-repeat',
					},
				],
			},
			backgroundOverlay: {
				type: 'array',
				default: [
					{
						type: 'solid',
						fill: '#000000',
						fillOpacity: 1,
						secondFill: '',
						secondFillOpacity: 1,
						gradLoc: 0,
						gradLocSecond: 100,
						gradType: 'linear',
						gradAngle: 180,
						gradPosition: 'center center',
						opacity: 0.3,
						opacityHover: 0.5,
						blendMode: 'none',
					},
				],
			},
			padding: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			margin: {
				type: 'array',
				default: [
					{
						desk: ['', '', '', ''],
						tablet: ['', '', '', ''],
						mobile: ['', '', '', ''],
					},
				],
			},
			marginUnit: {
				type: 'string',
			},
			displayShadow: {
				type: 'boolean',
				default: false,
			},
			shadow: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			shadowHover: {
				type: 'array',
				default: [
					{
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 4,
						vOffset: 2,
					},
				],
			},
			maxWidth: {
				type: 'number',
			},
			maxWidthUnit: {
				type: 'string',
			},
		},
		save: ({ attributes }) => {
			const {
				type,
				uniqueID,
				url,
				media,
				ratio,
				playBtn,
				background,
				displayShadow,
				maxWidth,
				maxWidthUnit,
				autoPlay,
			} = attributes;
			const intrinsic = undefined !== ratio && 'custom' !== ratio ? ratio : undefined;
			const imageRatio =
				'custom' === ratio &&
				undefined !== background &&
				undefined !== background[0] &&
				undefined !== background[0].width &&
				undefined !== background[0].height
					? (background[0].height / background[0].width) * 100
					: intrinsic;
			const mwUnit = undefined !== maxWidthUnit ? maxWidthUnit : 'px';
			const theIcon = playBtn[0].icon ? playBtn[0].icon : 'fas_play';
			const allIcons = { ...kadence_blocks_params_ico.icons, ...kadence_blocks_params_fa.icons };

			return (
				<div className={`kadence-video-popup${uniqueID}`}>
					<div
						className={`kadence-video-popup-wrap ${
							displayShadow ? 'kadence-video-shadow' : 'kadence-video-noshadow'
						}`}
						style={{
							maxWidth: undefined !== maxWidth ? maxWidth + mwUnit : undefined,
						}}
					>
						<div
							className={`kadence-video-intrinsic ${
								undefined !== ratio ? ' kadence-video-set-ratio-' + ratio : ''
							}`}
							style={{
								paddingBottom: undefined !== imageRatio ? imageRatio + '%' : undefined,
							}}
						>
							{undefined !== background[0] &&
								undefined !== background[0].img &&
								'' !== background[0].img && (
									<img
										src={background[0].img}
										alt={background[0].imgAlt}
										width={background[0].imgWidth}
										height={background[0].imgHeight}
										className={
											background[0].imgID
												? `kadence-video-poster wp-image-${background[0].imgID}`
												: 'kadence-video-poster'
										}
									/>
								)}
							<div className="kadence-video-overlay"></div>
							{'local' === type && (
								<button
									className={'kadence-video-popup-link kadence-video-type-local'}
									data-popup-id={`kadence-local-video-${uniqueID}`}
									data-popup-auto={autoPlay ? 'true' : 'false'}
								>
									<GenIcon
										className={`kt-video-svg-icon kt-video-svg-icon-style-${
											playBtn[0].style
										} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
											'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
										} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
										name={playBtn[0].icon}
										size={!playBtn[0].size ? '30' : playBtn[0].size}
										title={playBtn[0].title ? playBtn[0].title : ''}
										icon={allIcons[theIcon]}
									/>
								</button>
							)}
							{'local' !== type && (
								<a
									href={!url ? '#' : url}
									role="button"
									className={'kadence-video-popup-link kadence-video-type-external'}
								>
									<GenIcon
										className={`kt-video-svg-icon kt-video-svg-icon-style-${
											playBtn[0].style
										} kt-video-svg-icon-${theIcon} kt-video-play-animation-${
											'' !== playBtn[0].animation ? playBtn[0].animation : 'none'
										} kt-video-svg-icon-size-${!playBtn[0].size ? 'auto' : playBtn[0].size}`}
										name={playBtn[0].icon}
										size={!playBtn[0].size ? '30' : playBtn[0].size}
										title={playBtn[0].title ? playBtn[0].title : ''}
										icon={allIcons[theIcon]}
									/>
								</a>
							)}
						</div>
					</div>
					{'local' === type && undefined !== media && undefined !== media[0] && media[0].url && (
						<div id={`kadence-local-video-${uniqueID}`} className="mfp-hide kadence-local-video-popup-wrap">
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
		},
	},
];
