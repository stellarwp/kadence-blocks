import { useMemo, useState } from '@wordpress/element';
import { get, debounce } from 'lodash';
import classnames from 'classnames';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import SelectBlockButton from './selectBlock';
import AddBlockButton from './add';
import Block from './block';
import ColumnBlocks from './columnBlocks';
import { DESKTOP_SECTION_NAMES, DESKTOP_BLOCK_POSITIONS, DESKTOP_CLIENT_ID_POSITIONS, ROW_TO_KEY } from './constants';

const computeSections = (thisRow, blocks) =>
	useMemo(() => {
		return DESKTOP_SECTION_NAMES.map((name, index) => ({
			name,
			blocks: get(thisRow, DESKTOP_BLOCK_POSITIONS[index], []),
			clientId: get(thisRow, DESKTOP_CLIENT_ID_POSITIONS[index], []),
		}));
	}, [thisRow, blocks]);

const DesktopRow = ({ position, blocks, activeBlockData }) => {
	const thisRow = useMemo(() => get(blocks, [ROW_TO_KEY[position]], []), [blocks, position]);
	const sections = computeSections(thisRow, blocks);

	// If mid columns and center are empty, don't show mid columns
	// Also don't show the mid columns when dragging a block across the middle.
	const isCenterEmpty = sections[2].blocks.length === 0;
	const areMidColumnsEmpty = sections[1].blocks.length === 0 && sections[3].blocks.length === 0;
	const isActiveDragTheOnlyCenterBlock =
		null !== activeBlockData &&
		sections[2].blocks.length === 1 &&
		activeBlockData.id === sections[2].blocks[0].clientId;
	const showMidColumns = (!isCenterEmpty && !isActiveDragTheOnlyCenterBlock) || !areMidColumnsEmpty;

	return (
		<div className={'visual-row-wrapper'} key={position}>
			<SelectBlockButton clientId={thisRow.clientId} />
			<div className={`visual-desktop-row visual-desktop-row-${position}`}>
				<div className={'visual-section-wrapper visual-section-wrapper-left'}>
					<ColumnBlocks
						blocks={sections[0].blocks}
						position={position}
						className={'left'}
						clientId={sections[0].clientId}
					/>
					<AddBlockButton position={'left'} clientId={sections[0].clientId} showMidColumns={showMidColumns} />
					{showMidColumns && (
						<>
							<ColumnBlocks
								blocks={sections[1].blocks}
								className={'center-left'}
								showMidColumns={showMidColumns}
								clientId={sections[1].clientId}
							/>
							<AddBlockButton position={'center-left'} clientId={sections[1].clientId} />
						</>
					)}
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-center'}>
					<ColumnBlocks blocks={sections[2].blocks} className={'center'} clientId={sections[2].clientId} />
					<AddBlockButton position={'center'} clientId={sections[2].clientId} />
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-right'}>
					{showMidColumns && (
						<>
							<ColumnBlocks
								blocks={sections[3].blocks}
								className={'center-right'}
								showMidColumns={showMidColumns}
								clientId={sections[3].clientId}
							/>
							<AddBlockButton position={'center-right'} clientId={sections[3].clientId} />
						</>
					)}
					<ColumnBlocks blocks={sections[4].blocks} className={'right'} clientId={sections[4].clientId} />
					<AddBlockButton
						position={'right'}
						clientId={sections[4].clientId}
						showMidColumns={showMidColumns}
					/>
				</div>
			</div>
		</div>
	);
};

export default function Desktop({ blocks }) {
	const rowPositions = ['top', 'middle', 'bottom'];
	const innerBlocks = useMemo(() => get(blocks, ['innerBlocks'], []), [blocks]);

	const [activeBlockData, setActiveBlockData] = useState(null);

	const getIndex = (clientId) => {
		return wp.data.select('core/block-editor').getBlockIndex(clientId);
	};

	function handleDragEnd(event) {
		const { active, over } = event;

		setActiveBlockData(null);
	}

	function handleDragStart(event) {
		const { active } = event;
		setActiveBlockData(active);
	}

	// Action when dragging over a new drop section
	function onDragOver(event) {
		const { active, over } = event;

		if (over && active) {
			let destinationClientId = over.id;
			const currentClientID = active.id;
			const parentClientID = wp.data.select('core/block-editor').getBlockRootClientId(currentClientID);
			const newIndex = getIndex(destinationClientId);
			const currentIndex = getIndex(currentClientID);
			const destName = wp.data.select('core/block-editor').getBlockName(destinationClientId);

			// We're moving within the same column
			if (destName !== 'kadence/header-column') {
				destinationClientId = parentClientID;
			}

			// Sorting into same position, no action needed.
			if (destinationClientId === parentClientID && newIndex === currentIndex) {
				return;
			}

			wp.data
				.dispatch('core/block-editor')
				.moveBlockToPosition(currentClientID, parentClientID, destinationClientId, newIndex);
		}
	}

	const classNames = classnames({
		'visual-desktop-container': true,
		'visual-desktop-container__is-dragging': activeBlockData !== null,
	});

	return (
		<div className={classNames}>
			<DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={debounce(onDragOver, 100)}>
				{rowPositions.map((position, index) => (
					<DesktopRow
						key={position}
						position={position}
						blocks={innerBlocks}
						activeBlockData={activeBlockData}
					/>
				))}

				{/* This created the element that is visually moved when dragging */}
				<DragOverlay>
					{activeBlockData ? (
						<Block block={{ ...activeBlockData.data.current, clientId: '' }} isPreview={true} />
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
