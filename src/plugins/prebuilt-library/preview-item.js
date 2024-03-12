/**
 * Handle Section Library.
 */

/**
 * Globals.
 */
const { localStorage } = window;

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import Masonry from 'react-masonry-css';
import AutoHeightBlockPreview from '../auto';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

import { withSelect, withDispatch, useSelect } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { Button, TextControl, SelectControl, VisuallyHidden, ExternalLink, Spinner } from '@wordpress/components';
import { arrowLeft, download, previous, update, next, chevronLeft, chevronDown } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { useDisabled, useMergeRefs } from '@wordpress/compose';
import { memo, useMemo } from '@wordpress/element';
import {
	BlockEditorProvider,
	__experimentalBlockPatternsList,
	store as blockEditorStore,
} from '@wordpress/block-editor';

export function PreviewItem({
	blocks,
	__experimentalPadding = 0,
	viewportWidth = 1400,
	__experimentalMinHeight,
	__experimentalStyles = [],
}) {
	const originalSettings = useSelect((select) => select(blockEditorStore).getSettings(), []);
	const settings = useMemo(() => ({ ...originalSettings, __unstableIsPreviewMode: true }), [originalSettings]);
	const renderedBlocks = useMemo(() => (Array.isArray(blocks) ? blocks : [blocks]), [blocks]);
	if (!blocks || blocks.length === 0) {
		return null;
	}
	return (
		<BlockEditorProvider value={renderedBlocks} settings={settings}>
			<AutoHeightBlockPreview
				viewportWidth={viewportWidth}
				__experimentalPadding={__experimentalPadding}
				__experimentalMinHeight={__experimentalMinHeight}
				__experimentalStyles={__experimentalStyles}
			/>
		</BlockEditorProvider>
	);
}
