import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { Button } from '@wordpress/components';

import { get } from 'lodash';
import classnames from 'classnames';
import { DndContext, useDraggable } from '@dnd-kit/core';
import Droppable from './droppable';

import DeleteBlockButton from './delete';
import SelectBlockButton from './selectBlock';
import AddBlockButton from './add';
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

const InnerBlock = ({ block }) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: block.clientId,
	});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: undefined;

	return (
		<div className={'visual-inner-block'} ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{block.name.replace('kadence/', '').replace('core/', '')}
			{/*<SelectBlockButton clientId={block.clientId} />*/}
			{/*<DeleteBlockButton clientId={block.clientId} />*/}
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
		return (
			<Droppable clientId={clientId} classNames={classNames}>
				{blocks.map((block) => (
					<InnerBlock key={block.clientId} block={block} />
				))}
			</Droppable>
		);
	}

	return __('Loading blocks…', 'kadence-blocks');
};

export default function Desktop({ blocks }) {
	const rowPositions = ['top', 'middle', 'bottom'];
	const innerBlocks = useMemo(() => get(blocks, ['innerBlocks'], []), [blocks]);

	function handleDragEnd(event) {
		if (event.over) {
			const destinationClientId = event.over.id;
			const currentClientID = event.active.id;
			const parentClientID = wp.data.select('core/block-editor').getBlockRootClientId(currentClientID);

			wp.data
				.dispatch('core/block-editor')
				.moveBlockToPosition(currentClientID, parentClientID, destinationClientId);
		}
	}

	return (
		<div className={'visual-desktop-container'}>
			<DndContext onDragEnd={handleDragEnd}>
				{rowPositions.map((position, index) => (
					<DesktopRow key={position} position={position} blocks={innerBlocks} />
				))}
			</DndContext>
		</div>
	);
}
