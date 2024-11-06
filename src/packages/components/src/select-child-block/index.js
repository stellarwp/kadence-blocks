import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useBlockDisplayInformation, store as blockEditorStore, BlockIcon } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import './editor.scss';

export default function SelectChildBlock({ clientId, label = null, childSlug = null }) {
	const { selectBlock } = useDispatch(blockEditorStore);
	const { childClientId } = useSelect((select) => {
		const { getBlocksByClientId, getBlock } = select(blockEditorStore);

		const findChildRecursively = (blockId, targetSlug) => {
			const block = getBlock(blockId);
			if (!block) return null;

			for (const child of block.innerBlocks) {
				if (child.name === targetSlug) {
					return child.clientId;
				}
				const nestedResult = findChildRecursively(child.clientId, targetSlug);
				if (nestedResult) {
					return nestedResult;
				}
			}
			return null;
		};

		let childId;

		if (childSlug !== null) {
			childId = findChildRecursively(clientId, childSlug);
		} else {
			const childBlock = getBlocksByClientId(clientId)[0]?.innerBlocks[0] || null;
			childId = childBlock?.clientId;
		}

		return {
			childClientId: childId,
		};
	}, [clientId, childSlug]);

	if (childClientId === undefined) {
		return null;
	}

	const blockInformation = useBlockDisplayInformation(childClientId);

	return (
		<div className="kadence-blocks-block-child-selector" key={childClientId}>
			<Button
				className="kadence-blocks-block-child-selector__button"
				onClick={() => selectBlock(childClientId)}
				icon={<BlockIcon icon={blockInformation?.icon} />}
			>
				{label ? label : __('View Child Block Settings', 'kadence-blocks')}
			</Button>
		</div>
	);
}
