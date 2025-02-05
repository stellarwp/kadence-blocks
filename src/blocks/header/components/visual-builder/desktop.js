import { useMemo, useState } from '@wordpress/element';
import { get } from 'lodash';
import { DragOverlay } from '@dnd-kit/core';

import SelectBlockButton from './selectBlock';
import AddBlockButton from './add';
import Block from './block';
import ColumnBlocks from './columnBlocks';
import DragDropContext from './dragDropContext';
import { ROW_TO_KEY } from './constants';
import { computeDesktopSections } from './helpers';

const rowPositions = ['top', 'middle', 'bottom'];

const DesktopRow = ({ position, blocks, activeBlockData }) => {
	const thisRow = get(blocks, [ROW_TO_KEY[position]], []);
	const sections = computeDesktopSections(thisRow, blocks);

	// If mid columns and center are empty, don't show mid columns
	// Also don't show the mid columns when dragging a block across the middle.
	const isCenterEmpty = sections[2].blocks.length === 0;
	const areMidColumnsEmpty = sections[1].blocks.length === 0 && sections[3].blocks.length === 0;
	const isActiveDragTheOnlyCenterBlock =
		null !== activeBlockData &&
		sections[2].blocks.length === 1 &&
		activeBlockData.id === sections[2].blocks[0].clientId;
	const showMidColumns = (!isCenterEmpty && !isActiveDragTheOnlyCenterBlock) || !areMidColumnsEmpty;
	const isSingleColumn = thisRow?.attributes?.layoutConfig === 'single';
	return (
		<div className={'visual-row-wrapper'} key={position}>
			<SelectBlockButton clientId={thisRow.clientId} />
			<div
				className={`visual-desktop-row visual-desktop-row-${position}${
					isSingleColumn ? ' kb-single-column-header' : ''
				}`}
			>
				<div className={'visual-section-wrapper visual-section-wrapper-left'}>
					<ColumnBlocks
						key={`${position}-left`}
						blocks={sections[0].blocks}
						position={position}
						className={'left'}
						clientId={sections[0].clientId}
						type={'desktop'}
					/>
					<AddBlockButton
						key={`${position}-left-add`}
						position={'left'}
						clientId={sections[0].clientId}
						showMidColumns={showMidColumns}
					/>
					{showMidColumns && (
						<>
							<ColumnBlocks
								key={`${position}-center-left`}
								blocks={sections[1].blocks}
								className={'center-left'}
								showMidColumns={showMidColumns}
								clientId={sections[1].clientId}
								type={'desktop'}
							/>
							<AddBlockButton
								key={`${position}-center-left-add`}
								position={'center-left'}
								clientId={sections[1].clientId}
							/>
						</>
					)}
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-center'}>
					<ColumnBlocks
						key={`${position}-center`}
						blocks={sections[2].blocks}
						className={'center'}
						clientId={sections[2].clientId}
						type={'desktop'}
					/>
					<AddBlockButton
						key={`${position}-center-add`}
						position={'center'}
						clientId={sections[2].clientId}
					/>
				</div>
				<div className={'visual-section-wrapper visual-section-wrapper-right'}>
					{showMidColumns && (
						<>
							<ColumnBlocks
								key={`${position}-center-right`}
								blocks={sections[3].blocks}
								className={'center-right'}
								showMidColumns={showMidColumns}
								clientId={sections[3].clientId}
								type={'desktop'}
							/>
							<AddBlockButton
								key={`${position}-center-right-add`}
								position={'center-right'}
								clientId={sections[3].clientId}
							/>
						</>
					)}
					<ColumnBlocks
						key={`${position}-right`}
						blocks={sections[4].blocks}
						className={'right'}
						clientId={sections[4].clientId}
						type={'desktop'}
					/>
					<AddBlockButton
						key={`${position}-right-add`}
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
	const innerBlocks = useMemo(() => get(blocks, ['innerBlocks'], []), [blocks]);
	const [activeBlockData, setActiveBlockData] = useState(null);

	return (
		<div className={'visual-desktop-container'}>
			<DragDropContext setActiveBlockData={setActiveBlockData}>
				{rowPositions.map((position) => (
					<DesktopRow
						key={position}
						position={position}
						blocks={innerBlocks}
						activeBlockData={activeBlockData}
					/>
				))}
				{/* This created the element that is visually moved when dragging */}
				<DragOverlay>
					{activeBlockData !== null && (
						<Block block={{ ...activeBlockData.data.current, clientId: '' }} isPreview={true} />
					)}
				</DragOverlay>
			</DragDropContext>
		</div>
	);
}
