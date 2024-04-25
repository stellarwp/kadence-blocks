import { useMemo, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useEntityBlockEditor } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { get } from 'lodash';
import ModalClose from './close';
import Desktop from './desktop';
import './editor.scss';

const getDescendantIds = (id = '', recursive = true, first_loop = true) => {
	const { select } = wp.data;

	const ids = id && !first_loop ? [id] : [];

	const children_id = select('core/block-editor').getBlockOrder(id);

	if (children_id) {
		let descendants_id;

		if (recursive) {
			descendants_id = children_id.flatMap((_children_id) => getDescendantIds(_children_id, true, false));
		} else {
			descendants_id = children_id;
		}

		ids.push(...descendants_id);
	}

	return ids;
};

function extractBlocks(blocksData) {
	let desktopBlocks,
		tabletBlocks,
		offCanvasBlocks = null;

	// Loop through the blocks data to find the relevant blocks
	blocksData.forEach((block) => {
		if (block.name.includes('desktop')) {
			desktopBlocks = block;
		} else if (block.name.includes('tablet')) {
			tabletBlocks = block;
		} else if (block.name.includes('off-canvas')) {
			offCanvasBlocks = block;
		}
	});

	return { desktopBlocks, tabletBlocks, offCanvasBlocks };
}

export default function VisualBuilder({ clientId, startVisible = false }) {
	// Don't commit, active for testing
	const [isVisible, setIsVisible] = useState(!startVisible);
	const [tab, setTab] = useState('desktop');

	const { select } = wp.data;

	const topLevelIds = select('core/block-editor').getBlockOrder(clientId);
	const topLevelBlocks = topLevelIds.map((_id) => select('core/block-editor').getBlock(_id));

	const { desktopBlocks, tabletBlocks, offCanvasBlocks } = extractBlocks(topLevelBlocks);

	return (
		<div class={'kb-header-visual-builder'}>
			<div class={'kb-header-visual-builder__toggle'}>
				<button onClick={() => setIsVisible(!isVisible)}>{isVisible ? 'Hide' : 'Show'} Visual Builder</button>
			</div>

			{isVisible && (
				<div class={'kb-header-visual-builder-modal'}>
					<div class={'tabs'}>
						<Button
							isPrimary={tab === 'desktop'}
							disabled={desktopBlocks === null}
							onClick={() => setTab('desktop')}
						>
							{__('Desktop', 'kadence-blocks')}
						</Button>
						<Button
							isPrimary={tab === 'tablet'}
							disabled={tabletBlocks === null}
							onClick={() => setTab('tablet')}
						>
							{__('Tablet', 'kadence-blocks')}
						</Button>
						<Button
							isPrimary={tab === 'off-canvas'}
							disabled={offCanvasBlocks === null}
							onClick={() => setTab('off-canvas')}
						>
							{__('Off Canvas', 'kadence-blocks')}
						</Button>
						<ModalClose isVisible={isVisible} setIsVisible={setIsVisible} />
					</div>

					<div class={'content'}>
						{tab === 'desktop' && <Desktop blocks={desktopBlocks} />}

						{tab === 'tablet' && <>Tablet Content</>}

						{tab === 'off-canvas' && <>Off Canvas Content</>}
					</div>
				</div>
			)}
		</div>
	);
}
