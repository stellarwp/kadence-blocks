/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */
import { useEffect } from '@wordpress/element';

import { InnerBlocks, useBlockProps, useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { uniqueIdHelper } from '@kadence/helpers';

/**
 * Build the spacer edit
 */
function KadenceTab(props) {
	const { attributes, setAttributes, clientId } = props;
	const { id, uniqueID } = attributes;

	uniqueIdHelper(props);
	const hasChildBlocks = useSelect((select) => select(blockEditorStore).getBlocks(clientId).length > 0, [clientId]);
	const blockProps = useBlockProps({
		className: `kt-tab-inner-content kt-inner-tab-${id} kt-inner-tab${uniqueID}`,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'kt-tab-inner-content-inner',
		},
		{
			templateLock: false,
			renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<div {...blockProps} data-tab={id}>
			<div {...innerBlocksProps} />
		</div>
	);
}

export default KadenceTab;
