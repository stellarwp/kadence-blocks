/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useDisabled, useMergeRefs } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { memo, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AutoHeightBlockPreview from './auto';
import {
	BlockEditorProvider,
	store as blockEditorStore,
} from '@wordpress/block-editor';

export function BlockPreview( {
	blocks,
	viewportWidth = 1200,
	minHeight,
	additionalStyles = [],
	editorStyles,
	ratio,
	neededCompatStyles = [],
	baseCompatStyles,
} ) {

	const originalSettings = useSelect(
		( select ) => select( blockEditorStore ).getSettings(),
		[]
	);
	const settings = useMemo(
		() => ( { ...originalSettings, __unstableIsPreviewMode: true } ),
		[ originalSettings ]
	);
	const renderedBlocks = useMemo(
		() => ( Array.isArray( blocks ) ? blocks : [ blocks ] ),
		[ blocks ]
	);

	if ( ! blocks || blocks.length === 0 ) {
		return null;
	}

	return (
		<BlockEditorProvider
			value={ renderedBlocks }
			settings={ settings }
		>
			<AutoHeightBlockPreview
				viewportWidth={ viewportWidth }
				minHeight={ minHeight }
				additionalStyles={ additionalStyles }
				ratio={ ratio }
				editorStyles={ editorStyles }
				baseCompatStyles={ baseCompatStyles }
				neededCompatStyles={ neededCompatStyles }
			/>
		</BlockEditorProvider>
	);
}
