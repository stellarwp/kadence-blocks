import classnames from 'classnames';
import { useMemo } from '@wordpress/element';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import Droppable from './droppable';
import Block from './block';
import { map } from 'lodash';

export default function ColumnBlocks({ blocks, className, clientId, showMidColumns = true, isTablet = false }) {
	const classNames = classnames({
		'visual-column-wrapper': true,
		[`visual-column-wrapper-${className}`]: true,
		'visual-column-wrapper-empty-center': !showMidColumns && !isTablet,
	});

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
