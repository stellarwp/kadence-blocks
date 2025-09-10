/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */
import { InspectorControlTabs, SelectParentBlock, KadencePanelBody } from '@kadence/components';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	InspectorControls,
} from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { uniqueIdHelper } from '@kadence/helpers';

/**
 * Build the spacer edit
 */
function KadenceTab(props) {
	const { attributes, setAttributes, clientId } = props;
	const { id, uniqueID } = attributes;
	const [activeTab, setActiveTab] = useState('advanced');
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
			<InspectorControls>
				<SelectParentBlock clientId={clientId} />

				<InspectorControlTabs
					panelName={'tab'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
					allowedTabs={['general', 'advanced']}
				/>
				{activeTab === 'general' && (
					<KadencePanelBody>
						<div className="components-base-control">No general settings available.</div>
					</KadencePanelBody>
				)}
			</InspectorControls>
			<div {...innerBlocksProps} />
		</div>
	);
}

export default KadenceTab;
