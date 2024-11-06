/**
 * WordPress dependencies
 */
import { useResizeObserver } from '@wordpress/compose';
import { useState, useRef, useEffect } from '@wordpress/element';
import { Disabled, Spinner } from '@wordpress/components';
import root from 'react-shadow';

// import LazyLoad from 'react-lazy-load';
import LazyLoad from './lazyload.js';

const MAX_HEIGHT = 1600;

function ScaledPatternShadowPreview({
	html,
	viewportWidth,
	containerWidth,
	minHeight = 50,
	additionalStyles = [],
	title,
	ratio,
	shadowCompatStyles,
	shadowStyles,
	patternType = 'pattern',
	rootScroll,
}) {
	if (!viewportWidth) {
		viewportWidth = containerWidth;
	}
	const [refreshHeight, setRefreshHeight] = useState(false);
	const [loadingOpacity, setLoadingOpacity] = useState(0);
	const [contentResizeListener, { height: contentHeight }] = useResizeObserver();
	const styleAssets = (
		<>
			<link
				rel="stylesheet"
				id="kadence-blocks-iframe-base"
				href={kadence_blocks_params.livePreviewStyles}
				media="all"
			></link>
			{shadowCompatStyles}
		</>
	);
	const shaddowAssets = (
		<>
			{shadowStyles.map((style, index) => {
				if (style?.css) {
					let finalCSS = style.css.replace(/ .block-editor-block-list__layout/g, '');
					finalCSS = finalCSS.replace(/:root/g, '.pattern-shadow-wrap');
					finalCSS = finalCSS.replace(/body/g, '.single-iframe-content');
					return <style key={index}>{finalCSS}</style>;
				}
			})}
		</>
	);

	const scale = containerWidth / viewportWidth;
	const finalContentHeight = refreshHeight ? 'auto' : contentHeight;
	const resizeClear = () => {
		setTimeout(() => {
			// console.log('REOnePatternPreview');
			setRefreshHeight(true);
		}, 100);
		setTimeout(() => {
			//	console.log('RETwoPatternPreview');
			setRefreshHeight(false);
		}, 400);
		setTimeout(() => {
			setLoadingOpacity(1);
		}, 800);
	};
	const trans_scroll_speed = contentHeight >= MAX_HEIGHT ? ((finalContentHeight - MAX_HEIGHT) / 650) * 1000 : 2000;
	const transitionSpeed = `transform ${trans_scroll_speed}ms linear !important`;
	const shadowRef = useRef(null);
	const checkStylesLoaded = () => {
		const styles = shadowRef.current.shadowRoot.querySelectorAll('style, link[rel="stylesheet"]');
		let loadedCount = 0;

		styles.forEach((style) => {
			if (style.sheet) {
				// For <style> elements and already loaded <link>
				loadedCount++;
			} else if (style.tagName.toLowerCase() === 'link') {
				// For <link rel="stylesheet"> elements
				style.onload = () => {
					loadedCount++;
					if (loadedCount === styles.length) {
						setLoadingOpacity(1);
					}
				};
			}
		});

		if (loadedCount === styles.length) {
			setLoadingOpacity(1);
		}
	};
	useEffect(() => {
		if (shadowRef.current) {
			// Once the component mounts, check if styles have loaded
			checkStylesLoaded();
		}
	}, [shadowRef?.current]);
	return (
		<>
			<LazyLoad
				offset={200}
				rootScroll={rootScroll}
				onContentVisible={() => {
					resizeClear();
				}}
			>
				<Disabled
					className="block-editor-block-preview__content"
					style={{
						transform: `scale(${scale})`,
						height: finalContentHeight ? finalContentHeight * scale : 'auto',
						maxHeight: finalContentHeight > MAX_HEIGHT ? MAX_HEIGHT * scale : undefined,
						//minHeight: contentHeight ? undefined : minHeight,
					}}
				>
					<root.div
						ref={shadowRef}
						className={`kb-pattern-shadow-container${
							contentHeight >= MAX_HEIGHT ? ' kb-pattern-overflow' : ''
						}`}
						aria-hidden
						tabIndex={-1}
						style={{
							opacity: loadingOpacity,
							position: 'absolute',
							width: viewportWidth,
							height: finalContentHeight,
							pointerEvents: 'none',
							maxHeight: MAX_HEIGHT,
							minHeight: scale !== 0 && scale < 1 && minHeight ? minHeight / scale : minHeight,
						}}
					>
						{styleAssets}
						{shaddowAssets}
						<style>{`.pattern-shadow-wrap { transition: ${transitionSpeed} }`}</style>
						<div part={'container'} className={'editor-styles-wrapper pattern-shadow-wrap'}>
							{contentResizeListener}
							<div
								className={`single-iframe-content${
									kadence_blocks_params.isKadenceT ? ' single-content' : ''
								}`}
								dangerouslySetInnerHTML={{ __html: html }}
							/>
						</div>
					</root.div>
				</Disabled>
			</LazyLoad>
			{!contentHeight && (
				<div
					className="kb-preview-iframe-loader-ratio"
					style={{ paddingBottom: ratio ? ratio : undefined, minHeight: ratio ? undefined : minHeight }}
				>
					<div className="kb-preview-iframe-loader">
						<Spinner />
					</div>
				</div>
			)}
		</>
	);
}

export default function AutoHeightPatternPreview(props) {
	const [containerResizeListener, { width: containerWidth }] = useResizeObserver();
	return (
		<>
			<div style={{ position: 'relative', width: '100%', height: 0 }}>{containerResizeListener}</div>
			<div className="block-editor-block-preview__container">
				<ScaledPatternShadowPreview {...props} containerWidth={containerWidth} />
			</div>
		</>
	);
}
