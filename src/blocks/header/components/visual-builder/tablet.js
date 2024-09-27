import { useMemo, useState } from '@wordpress/element';
import { get } from 'lodash';
import classnames from 'classnames';
import { DragOverlay } from '@dnd-kit/core';

import SelectBlockButton from './selectBlock';
import AddBlockButton from './add';
import Block from './block';
import ColumnBlocks from './columnBlocks';
import DragDropContext from './dragDropContext';
import { ROW_TO_KEY } from './constants';

const TabletRow = ({ position, blocks }) => {
	const thisRow = get(blocks, [ROW_TO_KEY[position]], []);
	const isSingleColumn = thisRow?.attributes?.layoutConfig === 'single';
	return (
		<div className={'visual-row-wrapper'} key={position}>
			<SelectBlockButton clientId={thisRow.clientId} />
			<div
				className={`visual-tablet-row visual-tablet-row-${position}${
					isSingleColumn ? ' kb-single-column-header' : ''
				}`}
			>
				{['left', 'center', 'right'].map((align, index) => (
					<div className={`visual-section-wrapper visual-section-wrapper-${align}`}>
						<ColumnBlocks
							blocks={get(thisRow, ['innerBlocks', index, 'innerBlocks'], [])}
							className={align}
							clientId={get(thisRow, ['innerBlocks', index, 'clientId'], [])}
							showMidColumns={false}
							isTablet={true}
						/>
						<AddBlockButton
							position={align}
							clientId={get(thisRow, ['innerBlocks', index, 'clientId'], [])}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default function Tablet({ blocks }) {
	const rowPositions = ['top', 'middle', 'bottom'];
	const innerBlocks = useMemo(() => get(blocks, ['innerBlocks'], []), [blocks]);
	const [activeBlockData, setActiveBlockData] = useState(null);

	const classNames = classnames({
		'visual-tablet-container': true,
		'visual-container__is-dragging': activeBlockData !== null,
	});

	return (
		<div className={classNames}>
			<DragDropContext setActiveBlockData={setActiveBlockData}>
				{rowPositions.map((position) => (
					<TabletRow key={position} position={position} blocks={innerBlocks} />
				))}
				{/* This created the element that is visually moved when dragging */}
				<DragOverlay>
					{activeBlockData ? (
						<Block block={{ ...activeBlockData.data.current, clientId: '' }} isPreview={true} />
					) : null}
				</DragOverlay>
			</DragDropContext>
		</div>
	);
}
