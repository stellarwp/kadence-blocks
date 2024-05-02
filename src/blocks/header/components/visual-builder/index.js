import { useRef, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useEditorElement, capitalizeFirstLetter } from '@kadence/helpers';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';

import ModalClose from './close';
import Desktop from './desktop';
import Tablet from './tablet';
import OffCanvas from './offCanvas';
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

export default function VisualBuilder({ clientId, previewDevice, isVisible, setIsVisible }) {
	const [tab, setTab] = useState(previewDevice);
	const { setPreviewDeviceType } = useDispatch('kadenceblocks/data');

	const updateTab = (value) => {
		setTab(value);

		if (value !== 'off-canvas') {
			setPreviewDeviceType(capitalizeFirstLetter(value));
		}
	};

	const { select } = wp.data;

	const topLevelIds = select('core/block-editor').getBlockOrder(clientId);
	const topLevelBlocks = topLevelIds.map((_id) => select('core/block-editor').getBlock(_id));

	const { desktopBlocks, tabletBlocks, offCanvasBlocks } = extractBlocks(topLevelBlocks);

	const ref = useRef();
	const editorElement = useEditorElement(ref, []);
	const editorWidth = editorElement?.clientWidth;
	const editorLeft = editorElement?.getBoundingClientRect().left;

	return (
		<div class={'kb-header-visual-builder'} ref={ref}>
			{isVisible && (
				<div
					class={'kb-header-visual-builder-modal'}
					style={{
						width: editorWidth + 'px',
						left: editorLeft + 'px',
					}}
				>
					<div class={'tabs'}>
						<Button
							isPrimary={tab === 'Desktop'}
							disabled={desktopBlocks === null}
							onClick={() => updateTab('Desktop')}
						>
							{__('Desktop', 'kadence-blocks')}
						</Button>
						<Button
							isPrimary={tab === 'Tablet'}
							disabled={tabletBlocks === null}
							onClick={() => updateTab('Tablet')}
						>
							{__('Tablet', 'kadence-blocks')}
						</Button>
						<Button
							isPrimary={tab === 'off-canvas'}
							disabled={offCanvasBlocks === null}
							onClick={() => updateTab('off-canvas')}
						>
							{__('Off Canvas', 'kadence-blocks')}
						</Button>
						<ModalClose isVisible={isVisible} setIsVisible={setIsVisible} />
					</div>

					<div class={'content'}>
						{tab === 'Desktop' && <Desktop blocks={desktopBlocks} />}

						{tab === 'Tablet' && <Tablet blocks={tabletBlocks} />}

						{tab === 'off-canvas' && <OffCanvas blocks={offCanvasBlocks} topLevelBlocks={topLevelBlocks} />}
					</div>
				</div>
			)}
		</div>
	);
}
