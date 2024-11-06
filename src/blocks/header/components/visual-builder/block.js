import { useSortable } from '@dnd-kit/sortable';
import SelectBlockButton from './selectBlock';
import DeleteBlockButton from './delete';
import { useSelect } from '@wordpress/data';
import { Icon } from '@wordpress/components';

import { get } from 'lodash';
import classnames from 'classnames';

function DragHandle(props) {
	return (
		<div className={'drag-handle'} style={{ cursor: 'grab', marginRight: '5px' }} {...props}>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
				<path d="M13 8c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM5 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zM9 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"></path>
			</svg>
		</div>
	);
}

export default function Block({ block, isPreview = false }) {
	const parentProps = {};
	let dragHandleProps = {};

	const blockMeta = useSelect((select) => {
		return select('core/blocks').getBlockType(block.name);
	}, []);

	const displayTitle = () => {
		const metadataTitle = get(block, ['attributes', 'metadata', 'name'], '');

		if (metadataTitle !== '') {
			return metadataTitle;
		}
		return blockMeta.title;
	};

	// If this is a drag item, it's just a visual representation of the block and not sortable
	if (!isPreview) {
		const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
			id: block.clientId,
			data: {
				name: block.name,
				attributes: block.attributes,
			},
		});
		const style = transform
			? {
					transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			  }
			: undefined;

		parentProps.ref = setNodeRef;
		parentProps.style = style;
		dragHandleProps = { ...listeners, ...attributes };
	}

	const classNames = classnames({
		'visual-inner-block': true,
		'visual-inner-block__preview': isPreview,
	});

	return (
		<div className={classNames} {...parentProps}>
			<div className={'visual-inner-block__controls'}>
				<DragHandle {...dragHandleProps} />
				<div>
					<SelectBlockButton clientId={block.clientId} />
					<DeleteBlockButton clientId={block.clientId} />
				</div>
			</div>
			<div className={'visual-inner-block__meta'}>
				<Icon size={16} className={'block-icon'} icon={blockMeta?.icon?.src} />
				<span className={'visual-inner-block__name'}>{displayTitle()}</span>
			</div>
		</div>
	);
}
