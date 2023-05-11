/**
 * WordPress dependencies
 */
import { useResizeObserver } from '@wordpress/compose';
import {
	useState,
	useMemo,
} from '@wordpress/element';
import { Disabled, Spinner } from '@wordpress/components';
import root from 'react-shadow';

import LazyLoad from 'react-lazy-load';


const MAX_HEIGHT = 1600;

function ScaledPatternShadowPreview( {
	html,
	viewportWidth,
	containerWidth,
	minHeight = 200,
	additionalStyles = [],
	title,
	ratio,
	neededCompatStyles = [],
	baseCompatStyles,
	shadowStyles,
	patternType = 'pattern',
} ) {
	if ( ! viewportWidth ) {
		viewportWidth = containerWidth;
	}
	const [ refreshHeight, setRefreshHeight ] = useState( false );
	const [ contentResizeListener, { height: contentHeight } ] = useResizeObserver();
	const styleAssets = (
		<>
			<link rel="stylesheet" id="kadence-blocks-iframe-base" href={ kadence_blocks_params.livePreviewStyles } media="all"></link>
			{ [ ...neededCompatStyles, ...baseCompatStyles ].map(
				( { tagName, href, id, rel, media, textContent } ) => {
					const TagName = tagName.toLowerCase();
					let finalTextContent = textContent.replace( / .block-editor-block-list__layout/g, '' );
					finalTextContent = finalTextContent.replace( /:root/g, '.pattern-shadow-wrap' );
					if ( TagName === 'style' ) {
						return (
							<TagName { ...{ id } } key={ id }>
								{ finalTextContent }
							</TagName>
						);
					}

					return (
						<TagName { ...{ href, id, rel, media } } key={ id } />
					);
				}
			) }
		</>
	);

	const shaddowAssets = (
		<>
			{ shadowStyles.map(
				( style, index ) => {
					if ( style?.css ) {
						let finalCSS = style.css.replace( / .block-editor-block-list__layout/g, '' );
						finalCSS = finalCSS.replace( /:root/g, '.pattern-shadow-wrap' );
						finalCSS = finalCSS.replace( /body/g, '.single-iframe-content' );
						return (
							<style key={ index }>{ finalCSS }</style>
						);
					}
				}
			) }
		</>
	);

	const scale = containerWidth / viewportWidth;
	const finalContentHeight = refreshHeight ? 'auto' : contentHeight;
	const resizeClear = () => {
		setTimeout( () => {
			// console.log('REOnePatternPreview');
			setRefreshHeight( true );
		}, 100 );
		setTimeout( () => {
		//	console.log('RETwoPatternPreview');
			setRefreshHeight( false );
		}, 400 );
	}
	return (
		<>
			<LazyLoad onContentVisible={() => {resizeClear()}}>
				<Disabled
					className="block-editor-block-preview__content"
					style={ {
						transform: `scale(${ scale })`,
						height: finalContentHeight ? finalContentHeight * scale : 'auto',
						maxHeight:
							finalContentHeight > MAX_HEIGHT ? MAX_HEIGHT * scale : undefined,
						//minHeight: contentHeight ? undefined : minHeight,
					} }
				>
					<root.div
					 	className={ `kb-pattern-shadow-container${ contentHeight >= MAX_HEIGHT ? ' kb-pattern-overflow' : '' }` }
						aria-hidden
						tabIndex={ -1 }
						style={ {
							position: 'absolute',
							width: viewportWidth,
							height: finalContentHeight,
							pointerEvents: 'none',
							maxHeight: MAX_HEIGHT,
							minHeight:
								scale !== 0 && scale < 1 && minHeight
									? minHeight / scale
									: minHeight,
						} }
					>
						{styleAssets}
						{shaddowAssets}
						<div part={'container'} className={ "editor-styles-wrapper pattern-shadow-wrap" }>{ contentResizeListener }<div className={ `single-iframe-content${ kadence_blocks_params.isKadenceT ? ' single-content' : '' }`} dangerouslySetInnerHTML={ {__html: html } } /></div>
					</root.div>
				</Disabled>
			</LazyLoad>
			{ ! contentHeight && (
				<div className='kb-preview-iframe-loader-ratio' style={ {paddingBottom: ratio ? ratio : undefined, minHeight: ratio ? undefined : minHeight,}}><div className='kb-preview-iframe-loader'><Spinner /></div></div>
			) }
		</>
	);
}

export default function AutoHeightPatternPreview( props ) {
	const [ containerResizeListener, { width: containerWidth } ] = useResizeObserver();
	return (
		<>
			<div style={ { position: 'relative', width: '100%', height: 0 } }>
				{ containerResizeListener }
			</div>
			<div className="block-editor-block-preview__container">
				<ScaledPatternShadowPreview
					{ ...props }
					containerWidth={ containerWidth }
				/>
			</div>
		</>
	);
}
