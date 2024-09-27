/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { render, useState } from '@wordpress/element';
import { useDispatch, useSelect, subscribe } from '@wordpress/data';
import { createBlock, isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { ToolbarButton } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
/**
 * Internal dependencies
 */
import { SafeParseJSON, showSettings } from '@kadence/helpers';
import { kadenceBlocksIcon } from '@kadence/icons';
/**
 * Add Prebuilt Library button to Gutenberg toolbar
 */
function ToolbarLibrary() {
	const { getSelectedBlock, getBlockIndex, getBlockHierarchyRootClientId } = useSelect(blockEditorStore);
	const { replaceBlocks, insertBlocks } = useDispatch(blockEditorStore);
	const kadenceIcon = applyFilters('kadence.blocks_icon', kadenceBlocksIcon);

	const LibraryButton = () => (
		<ToolbarButton
			className="kb-toolbar-prebuilt-button"
			icon={kadenceIcon}
			onClick={() => {
				const selectedBlock = getSelectedBlock();
				if (selectedBlock && isUnmodifiedDefaultBlock(selectedBlock)) {
					replaceBlocks(
						selectedBlock.clientId,
						createBlock('kadence/rowlayout', {
							isPrebuiltModal: true,
							noCustomDefaults: true,
						}),
						null,
						0
					);
				} else if (selectedBlock) {
					const destinationRootClientId = getBlockHierarchyRootClientId(selectedBlock.clientId);
					let destinationIndex = 0;
					if (destinationRootClientId) {
						destinationIndex = getBlockIndex(destinationRootClientId) + 1;
					} else {
						destinationIndex = getBlockIndex(selectedBlock.clientId) + 1;
					}
					insertBlocks(
						createBlock('kadence/rowlayout', {
							isPrebuiltModal: true,
							noCustomDefaults: true,
						}),
						destinationIndex
					);
				} else {
					insertBlocks(
						createBlock('kadence/rowlayout', {
							isPrebuiltModal: true,
							noCustomDefaults: true,
						})
					);
				}
			}}
		>
			{__('Design Library', 'kadence-blocks')}
		</ToolbarButton>
	);
	const renderButton = (selector) => {
		const patternButton = document.createElement('div');
		patternButton.classList.add('kadence-toolbar-design-library');
		selector.appendChild(patternButton);
		render(<LibraryButton />, patternButton);
	};

	if (showSettings('show', 'kadence/designlibrary') && kadence_blocks_params.showDesignLibrary) {
		const targetNode = document.querySelector('.block-editor__container');
		const config = { childList: true, subtree: true };

		const callback = function (mutationsList, observer) {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList') {
					const editToolbar = document.querySelector('.edit-post-header-toolbar');
					if (editToolbar && !editToolbar.querySelector('.kadence-toolbar-design-library')) {
						renderButton(editToolbar);
						observer.disconnect();
					}
				}
			}
		};

		const observer = new MutationObserver(callback);
		if (targetNode) {
			observer.observe(targetNode, config);
		}
	}

	return null;
}
registerPlugin('kb-toolbar-library', {
	render: ToolbarLibrary,
});
