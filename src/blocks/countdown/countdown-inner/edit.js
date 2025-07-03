/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { useEffect } from '@wordpress/element';

import { useSelect, useDispatch } from '@wordpress/data';

import { uniqueIdHelper } from '@kadence/helpers';

/**
 * Build the spacer edit
 */

function KadenceCountdownInner(props) {
	const { attributes, clientId, setAttributes } = props;
	const { location, uniqueID } = attributes;

	uniqueIdHelper(props);

	const hasChildBlocks = wp.data.select('core/block-editor').getBlockOrder(clientId).length > 0;

	const blockProps = useBlockProps({
		className: `kb-countdown-inner kb-countdown-inner-${location} kb-countdown-inner-${uniqueID}`,
	});

	return (
		<div {...blockProps}>
			<InnerBlocks
				templateLock={false}
				renderAppender={hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender}
			/>
		</div>
	);
}
export default KadenceCountdownInner;
