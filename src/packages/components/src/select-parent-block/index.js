/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useBlockDisplayInformation, store as blockEditorStore, BlockIcon } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Import Css
 */
import './editor.scss';

/**
 * Supplying only a client ID will select the first parent block.
 *
 * Supplying a parentSlug will select the first parent with that slug for the given client ID.
 *
 * @param clientId
 * @param label
 * @param parentSlug
 * @returns {JSX.Element|null}
 * @constructor
 */
export default function SelectParentBlock({ clientId, label = null, parentSlug = null }) {
	const { selectBlock } = useDispatch(blockEditorStore);
	const { firstParentClientId } = useSelect((select) => {
		const { getBlockParents, getBlockParentsByBlockName } = select(blockEditorStore);

		let parentClientId, parents;

		if (parentSlug !== null) {
			parents = getBlockParentsByBlockName(clientId, parentSlug);
		} else {
			parents = getBlockParents(clientId);
		}
		parentClientId = parents[parents.length - 1];

		return {
			firstParentClientId: parentClientId,
		};
	}, []);
	if (firstParentClientId === undefined) {
		return null;
	}
	const blockInformation = useBlockDisplayInformation(firstParentClientId);
	return (
		<div className="kadence-blocks-block-parent-selector" key={firstParentClientId}>
			<Button
				className="kadence-blocks-block-parent-selector__button"
				onClick={() => selectBlock(firstParentClientId)}
				icon={<BlockIcon icon={blockInformation?.icon} />}
			>
				{label ? label : __('View Parent Block Settings', 'kadence-blocks')}
			</Button>
		</div>
	);
}
