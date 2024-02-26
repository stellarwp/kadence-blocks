import { __ } from '@wordpress/i18n';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { BlockControls, store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';

import { duplicate } from '@kadence/icons';

export default function DuplicateField({ clientId, name, attributes }) {
	const { insertBlock } = useDispatch(blockEditorStore);
	const { blockIndex, rootClientId } = useSelect(
		(select) => {
			const { getBlockIndex, getBlockRootClientId } = select(blockEditorStore);
			return {
				blockIndex: getBlockIndex(clientId),
				rootClientId: getBlockRootClientId(clientId),
			};
		},
		[clientId]
	);
	return (
		<BlockControls>
			<ToolbarGroup group="duplicate-block">
				<ToolbarButton
					className="kb-duplicate-field"
					icon={duplicate}
					onClick={() => {
						const latestAttributes = attributes;
						latestAttributes.uniqueID = '';
						latestAttributes.inputName = '';
						const newBlock = createBlock(name, latestAttributes);
						insertBlock(newBlock, blockIndex + 1, rootClientId);
					}}
					label={__('Duplicate Field', 'kadence-blocks')}
					showTooltip={true}
				/>
			</ToolbarGroup>
		</BlockControls>
	);
}
