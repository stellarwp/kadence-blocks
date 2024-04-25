import { __ } from '@wordpress/i18n';
import { useMemo, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';

import { get, map, debounce } from 'lodash';
import classnames from 'classnames';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';

import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import Droppable from './droppable';
import DeleteBlockButton from './delete';
import SelectBlockButton from './selectBlock';
import AddBlockButton from './add';
import Block from './block';
import { DESKTOP_SECTION_NAMES, DESKTOP_BLOCK_POSITIONS, DESKTOP_CLIENT_ID_POSITIONS, ROW_TO_KEY } from './constants';

const computeSections = (thisRow, blocks) =>
	useMemo(() => {
		return DESKTOP_SECTION_NAMES.map((name, index) => ({
			name,
			blocks: get(thisRow, DESKTOP_BLOCK_POSITIONS[index], []),
			clientId: get(thisRow, DESKTOP_CLIENT_ID_POSITIONS[index], []),
		}));
	}, [blocks]);

const DesktopRow = ({ position, blocks }) => {
	const thisRow = get(blocks, [ROW_TO_KEY[position]], []);
	const sections = computeSections(thisRow, blocks);

	// If mid columns are empty, and the center is empty, don't show mid columns
	const isCenterEmpty = sections[2].blocks.length === 0;
	const areMidColumnsEmpty = sections[1].blocks.length === 0 && sections[3].blocks.length === 0;
	const showMidColumns = !isCenterEmpty || !areMidColumnsEmpty;

	return (
		<div className={'visual-row-wrapper'} key={position}>
			<SelectBlockButton clientId={thisRow.clientId} />
			<div className={`visual-desktop-row visual-desktop-row-${position}`}>
				<div className={'visual-section-wrapper visual-section-wrapper-left'}>
					<InnerBlocks
						blocks={sections[0].blocks}
						position={position}
						className={'left'}
						clientId={sections[0].clientId}
					/>
					<AddBlockButton position={'left'} clientId={sections[0].clientId} showMidColumns={showMidColumns} />
					{showMidColumns && (
						<>
							<InnerBlocks
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
					<InnerBlocks blocks={sections[2].blocks} className={'center'} clientId={sections[2].clientId} />
					<AddBlockButton position={'center'} clientId={sections[2].clientId} />
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-right'}>
					{showMidColumns && (
						<>
							<InnerBlocks
								blocks={sections[3].blocks}
								className={'center-right'}
								showMidColumns={showMidColumns}
								clientId={sections[3].clientId}
							/>
							<AddBlockButton position={'center-right'} clientId={sections[3].clientId} />
						</>
					)}
					<InnerBlocks blocks={sections[4].blocks} className={'right'} clientId={sections[4].clientId} />
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

const InnerBlocks = ({ blocks, className, clientId, showMidColumns = true }) => {
	const classNames = classnames({
		'visual-column-wrapper': true,
		[`visual-column-wrapper-${className}`]: true,
		'visual-column-wrapper-empty-center': !showMidColumns,
	});

	if (blocks) {
		const clientIds = useMemo(() => map(blocks, 'clientId'), [blocks]);

		return (
			<SortableContext items={clientIds} strategy={horizontalListSortingStrategy}>
				<Droppable clientId={clientId} classNames={classNames}>
					{blocks.map((block) => (
						<Block key={block.clientId} block={block} />
					))}
				</Droppable>
			</SortableContext>
		);
	}

	return __('Loading blocks…', 'kadence-blocks');
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
		// console.log('onDragOver', event);

		const { active, over } = event;
		console.log('----- -- ---- -- - -- - - - - - -- ');

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

	return (
		<div className={'visual-desktop-container'}>
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				onDragStart={handleDragStart}
				onDragOver={debounce(onDragOver, 100)}
			>
				{rowPositions.map((position, index) => (
					<DesktopRow key={position} position={position} blocks={innerBlocks} />
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
