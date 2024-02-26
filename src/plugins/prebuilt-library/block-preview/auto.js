/**
 * WordPress dependencies
 */
import { useResizeObserver, pure, useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { Disabled, Spinner } from '@wordpress/components';
/**
 * Internal dependencies
 */
import {
	BlockList,
	//	__unstableIframe as Iframe,
	__unstableEditorStyles as EditorStyles,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import Iframe from '../iframe/editor-iframe.js';

// This is used to avoid rendering the block list if the sizes change.
let MemoizedBlockList;

const MAX_HEIGHT = 1600;

function ScaledBlockPreview({
	viewportWidth,
	containerWidth,
	minHeight = '200px',
	additionalStyles = [],
	editorStyles,
	ratio,
	neededCompatStyles = [],
	baseCompatStyles,
}) {
	if (!viewportWidth) {
		viewportWidth = containerWidth;
	}

	const [contentResizeListener, { height: contentHeight }] = useResizeObserver();

	// Initialize on render instead of module top level, to avoid circular dependency issues.
	MemoizedBlockList = MemoizedBlockList || pure(BlockList);

	const scale = containerWidth / viewportWidth;
	return (
		<>
			{!contentHeight && (
				<div className="kb-preview-iframe-loader">
					<Spinner />
				</div>
			)}
			<Disabled
				className="block-editor-block-preview__content"
				style={{
					transform: `scale(${scale})`,
					height: contentHeight * scale,
					maxHeight: contentHeight > MAX_HEIGHT ? MAX_HEIGHT * scale : undefined,
					minHeight: contentHeight ? undefined : minHeight,
				}}
			>
				<Iframe
					head={<EditorStyles styles={editorStyles} />}
					contentRef={useRefEffect((bodyElement) => {
						const {
							ownerDocument: { documentElement },
						} = bodyElement;
						documentElement.classList.add('block-editor-block-preview__content-iframe');
						documentElement.style.position = 'absolute';
						documentElement.style.width = '100%';

						// Necessary for contentResizeListener to work.
						bodyElement.style.boxSizing = 'border-box';
						bodyElement.style.position = 'absolute';
						bodyElement.style.width = '100%';
					}, [])}
					aria-hidden
					tabIndex={-1}
					style={{
						position: 'absolute',
						width: viewportWidth,
						height: contentHeight,
						pointerEvents: 'none',
						// This is a catch-all max-height for patterns.
						// See: https://github.com/WordPress/gutenberg/pull/38175.
						maxHeight: MAX_HEIGHT,
						minHeight: scale !== 0 && scale < 1 && minHeight ? minHeight / scale : minHeight,
					}}
				>
					{contentResizeListener}
					<MemoizedBlockList renderAppender={false} />
				</Iframe>
			</Disabled>
		</>
	);
}

export default function AutoBlockPreview(props) {
	const [containerResizeListener, { width: containerWidth }] = useResizeObserver();

	return (
		<>
			<div style={{ position: 'relative', width: '100%', height: 0 }}>{containerResizeListener}</div>
			<div className="block-editor-block-preview__container">
				{!!containerWidth && <ScaledBlockPreview {...props} containerWidth={containerWidth} />}
			</div>
		</>
	);
}
