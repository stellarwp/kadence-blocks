import { useMemo, useState } from '@wordpress/element';
import { get } from 'lodash';
import { DragOverlay } from '@dnd-kit/core';

import SelectBlockButton from './selectBlock';
import AddBlockButton from './add';
import Block from './block';
import ColumnBlocks from './columnBlocks';
import DragDropContext from './dragDropContext';

const OffCanvasRow = ({ blocks, offCanvasClientId }) => {
	return (
		<div className={'visual-row-wrapper'}>
			<SelectBlockButton clientId={offCanvasClientId} />
			<div className={`visual-off-canvas-row`}>
				<div className={`visual-section-wrapper visual-section-wrapper-off-canvas`}>
					<ColumnBlocks
						key={`off-canvas-blocks-${offCanvasClientId}`}
						blocks={blocks}
						className={'off-canvas'}
						clientId={offCanvasClientId}
						showMidColumns={false}
						isTablet={true}
						type={'off-canvas'}
					/>
					{/*<AddBlockButton position={'off-canvas'} clientId={offCanvasClientId} />*/}
				</div>
			</div>
			<AddBlockButton
				key={`off-canvas-add-${offCanvasClientId}`}
				position={'off-canvas'}
				clientId={offCanvasClientId}
			/>
		</div>
	);
};

export default function OffCanvas({ blocks, topLevelBlocks }) {
	const [activeBlockData, setActiveBlockData] = useState(null);
	const innerBlocks = useMemo(() => get(blocks, ['innerBlocks'], []), [blocks]);
	const clientId = get(topLevelBlocks, [2, 'clientId'], '');

	return (
		<div className={'visual-off-canvas-container'}>
			<DragDropContext setActiveBlockData={setActiveBlockData}>
				<OffCanvasRow blocks={innerBlocks} offCanvasClientId={clientId} />
				{/* This created the element that is visually moved when dragging */}
				<DragOverlay>
					{activeBlockData !== null && (
						<Block
							key={`drag-overlay-${activeBlockData.data.current.clientId}`}
							block={{ ...activeBlockData.data.current, clientId: '' }}
							isPreview={true}
						/>
					)}
				</DragOverlay>
			</DragDropContext>
		</div>
	);
}
