import { useMemo, useState } from '@wordpress/element';
import { get } from 'lodash';
import classnames from 'classnames';
import { DragOverlay } from '@dnd-kit/core';

import SelectBlockButton from './selectBlock';
import AddBlockButton from './add';
import Block from './block';
import ColumnBlocks from './columnBlocks';
import DragDropContext from './dragDropContext';

const OffCanvasRow = ({ blocks, offCanvasClientId }) => {
	return (
		<div className={'visual-row-wrapper'} key={'off-canvas'}>
			<SelectBlockButton clientId={offCanvasClientId} />
			<div className={`visual-off-canvas-row`}>
				<div className={`visual-section-wrapper visual-section-wrapper-off-canvas`}>
					<ColumnBlocks
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
			<AddBlockButton position={'off-canvas'} clientId={offCanvasClientId} />
		</div>
	);
};

export default function OffCanvas({ blocks, topLevelBlocks }) {
	const [activeBlockData, setActiveBlockData] = useState(null);
	const innerBlocks = useMemo(() => get(blocks, ['innerBlocks'], []), [blocks]);
	const clientId = get(topLevelBlocks, [2, 'clientId'], '');

	const classNames = classnames({
		'visual-off-canvas-container': true,
		'visual-container__is-dragging': activeBlockData !== null,
	});

	return (
		<div className={classNames}>
			<DragDropContext setActiveBlockData={setActiveBlockData}>
				<OffCanvasRow blocks={innerBlocks} offCanvasClientId={clientId} />
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