import { useRef, useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useEditorElement, capitalizeFirstLetter, blockExists } from '@kadence/helpers';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch, select } from '@wordpress/data';
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
		const clientId = get(blocks, 'clientId');

		if (value !== 'off-canvas') {
			setPreviewDeviceType(capitalizeFirstLetter(value));

			// if tab we're switching away from was off canvas...
			if (tab === 'off-canvas') {
				setOffCanvasOpenId(null);
				selectBlock(clientId);
			}
		} else if (value === 'off-canvas') {
			if (clientId) {
				setOffCanvasOpenId(clientId);
				selectBlock(clientId);
			}
		}

		setTab(value);
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

	const isListViewOpen = useSelect((select) => {
		return select('core/edit-post').isListViewOpened();
	}, []);

	useEffect(() => {
		//if we're already in a tablet / mobile device than we should automatically switch the tab, etc
		const device = previewDevice === 'Mobile' || previewDevice === 'Tablet' ? 'Tablet' : 'Desktop';
		if (tab !== device) {
			setTab(device);
		}
	}, [isVisible, previewDevice]);

	const setIsVisible = () => {
		setHeaderVisualBuilderOpenId(isVisible ? null : clientId);
	};

	const { desktopBlocks, tabletBlocks, offCanvasBlocks } = extractBlocks(topLevelBlocks);
	const hasTrigger = blockExists(topLevelBlocks, 'kadence/off-canvas-trigger');

	const ref = useRef();
	const editorElement = useEditorElement(ref, [previewDevice, tab, isListViewOpen], 'editor-visual-editor');
	const editorWidth = editorElement?.clientWidth;
	const editorLeft = editorElement?.getBoundingClientRect().left;
	const editorFooterHeight = previewDevice === 'Desktop' ? '25px' : '0';

	if (!hasTrigger && tab === 'off-canvas') {
		updateTab('Desktop', desktopBlocks);
	}

	// Happens if the block is removed while the visual builder is open
	if (topLevelBlocks.length === 0) {
		return null;
	}

	return (
		<>
			{isVisible && (
				<style>
					{/* Prevent off canvas from being hidden by visual builder when moved to top*/}
					{modalPosition === 'top' && <>{`.kb-off-canvas-inner { margin-top: 310px; }`}</>}
				</style>
			)}
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
								className="kb-device-tab"
								isPressed={tab === 'Desktop'}
								disabled={desktopBlocks === null}
								onClick={() => updateTab('Desktop', desktopBlocks)}
							>
								{__('Desktop', 'kadence-blocks')}
							</Button>
							<Button
								className="kb-device-tab"
								isPressed={tab === 'Tablet'}
								disabled={tabletBlocks === null}
								onClick={() => updateTab('Tablet', tabletBlocks)}
							>
								{__('Tablet / Mobile', 'kadence-blocks')}
							</Button>
							{hasTrigger && (
								<Button
									className="kb-device-tab"
									isPressed={tab === 'off-canvas'}
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

			{/* hide the metaboxes area that currently take up the same space as the visual builder while the teaser or builder is active */}
			{(isVisible || (!isVisible && (isSelected || childSelected))) && (
				<style>
					{'' +
						'.edit-post-layout__metaboxes{display: none}' +
						`.editor-styles-wrapper{ margin-${modalPosition}: ${
							modalPosition === 'top' ? '280' : '315'
						}px;}` +
						`.editor-visual-editor:not(.is-resizable) .block-editor-iframe__scale-container{
							${modalPosition === 'top' ? '' : 'margin-bottom: 250px;'}
							${previewDevice !== 'Desktop' && modalPosition === 'bottom' ? 'height: 1224px;' : ''}
						}
						`}
				</style>
			)}
		</>
	);
}
