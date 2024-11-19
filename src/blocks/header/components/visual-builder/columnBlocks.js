import classnames from 'classnames';
import { useMemo } from '@wordpress/element';
import { horizontalListSortingStrategy, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import Droppable from './droppable';
import Block from './block';
import { map } from 'lodash';

export default function ColumnBlocks({ blocks, className, clientId, showMidColumns = true, type = '' }) {
	const classNames = classnames({
		'visual-column-wrapper': true,
		[`visual-column-wrapper-${className}`]: true,
		'visual-column-wrapper-empty-center': !showMidColumns && type === 'desktop',
	});

	const clientIds = useMemo(() => map(blocks, 'clientId'), [blocks]);

	return (
		<SortableContext
			items={clientIds}
			strategy={type === 'off-canvas' ? verticalListSortingStrategy : horizontalListSortingStrategy}
		>
			{type !== 'off-canvas' ? (
				<Droppable clientId={clientId} classNames={classNames}>
					{blocks.map((block) => (
						<Block key={block.clientId} block={block} />
					))}
				</Droppable>
			) : (
				<>
					{blocks.map((block) => (
						<Block key={block.clientId} block={block} />
					))}
				</>
			)}
		</SortableContext>
	);
}
