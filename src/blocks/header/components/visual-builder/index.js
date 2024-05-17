import { useRef, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useEditorElement, capitalizeFirstLetter } from '@kadence/helpers';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { get } from 'lodash';

import ModalClose from './close';
import Desktop from './desktop';
import Tablet from './tablet';
import OffCanvas from './offCanvas';
import './editor.scss';
import ModalTogglePosition from './togglePosition';

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

const blockExists = (blocks, blockName) => {
	for (const block of blocks) {
		if (block.name === blockName) {
			return true;
		}
		if (block.innerBlocks && block.innerBlocks.length > 0) {
			const existsInInnerBlocks = blockExists(block.innerBlocks, blockName);
			if (existsInInnerBlocks) {
				return true;
			}
		}
	}
	return false;
};

export default function VisualBuilder({ clientId, previewDevice, isSelected }) {
	const [tab, setTab] = useState(previewDevice);
	const {
		setPreviewDeviceType,
		setHeaderVisualBuilderOpenId,
		setHeaderVisualBuilderOpenPosition,
		setOffCanvasOpenId,
	} = useDispatch('kadenceblocks/data');

	const { selectBlock } = useDispatch('core/block-editor');

	const updateTab = (value, blocks = null) => {
		setTab(value);

		if (value !== 'off-canvas') {
			setPreviewDeviceType(capitalizeFirstLetter(value));
		} else if (value === 'off-canvas') {
			const clientId = get(blocks, 'clientId');
			if (clientId) {
				setOffCanvasOpenId(clientId);
				selectBlock(clientId);
			}
		}
	};

	const { topLevelBlocks, childSelected, isVisible, modalPosition } = useSelect(
		(select) => {
			const { getBlockOrder, getBlock, hasSelectedInnerBlock } = select('core/block-editor');

			const topLevelIds = getBlockOrder(clientId);

			return {
				topLevelBlocks: topLevelIds.map((_id) => getBlock(_id)),
				childSelected: hasSelectedInnerBlock(clientId, true),
				isVisible: select('kadenceblocks/data').getOpenHeaderVisualBuilderId() === clientId,
				modalPosition: select('kadenceblocks/data').getOpenHeaderVisualBuilderPosition(),
			};
		},
		[clientId]
	);

	const setIsVisible = () => {
		setHeaderVisualBuilderOpenId(isVisible ? null : clientId);
	};

	const { desktopBlocks, tabletBlocks, offCanvasBlocks } = extractBlocks(topLevelBlocks);
	const hasTrigger = blockExists(topLevelBlocks, 'kadence/off-canvas-trigger');

	const ref = useRef();
	const editorElement = useEditorElement(ref, [previewDevice]);
	const editorWidth = editorElement?.clientWidth;
	const editorLeft = editorElement?.getBoundingClientRect().left;
	const editorHeight = editorElement?.clientHeight;

	console.log('editorHeight: ' + editorHeight);

	if (!hasTrigger && tab === 'off-canvas') {
		updateTab('Desktop');
	}

	return (
		<>
			<div ref={ref}>
				{!isVisible && (isSelected || childSelected) && (
					<div
						class={'kb-header-visual-builder-teaser'}
						style={{
							width: editorWidth + 'px',
							left: editorLeft + 'px',
						}}
					>
						<Button isPrimary onClick={() => setIsVisible(true)}>
							{__('Open Visual Builder', 'kadence-blocks')}
						</Button>
					</div>
				)}
				{isVisible && (
					<div
						class={'kb-header-visual-builder-modal kb-header-visual-builder-modal-' + modalPosition}
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
							{hasTrigger && (
								<Button
									isPrimary={tab === 'off-canvas'}
									disabled={offCanvasBlocks === null}
									onClick={() => updateTab('off-canvas', offCanvasBlocks)}
								>
									{__('Off Canvas', 'kadence-blocks')}
								</Button>
							)}
							<div className={'modal-settings'}>
								<ModalTogglePosition
									position={modalPosition}
									setPosition={setHeaderVisualBuilderOpenPosition}
								/>
								<ModalClose isVisible={isVisible} setIsVisible={setIsVisible} />
							</div>
						</div>

						<div class={'content'}>
							{tab === 'Desktop' && <Desktop blocks={desktopBlocks} />}

							{tab === 'Tablet' && <Tablet blocks={tabletBlocks} />}

							{tab === 'off-canvas' && (
								<OffCanvas blocks={offCanvasBlocks} topLevelBlocks={topLevelBlocks} />
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
