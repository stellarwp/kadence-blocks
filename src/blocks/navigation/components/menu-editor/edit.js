import { useCallback, useEffect, useState, useMemo } from '@wordpress/element';
import { TextControl, Button, Icon } from '@wordpress/components';
import { useEntityBlockEditor, EntityProvider } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { get } from 'lodash';
import { createBlock, serialize } from '@wordpress/blocks';
import { RichText, ListView, BlockEditorProvider } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { EDITABLE_BLOCK_ATTRIBUTES, PREVENT_BLOCK_DELETE } from './constants';
import { link } from '@wordpress/icons';
import { debounce } from 'lodash';

import {
	Announcements,
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragOverlay,
	DragMoveEvent,
	DragEndEvent,
	DragOverEvent,
	MeasuringStrategy,
	DropAnimation,
	defaultDropAnimation,
	Modifier,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

const DragHandle = React.memo((props) => (
	<div className={'drag-handle'} style={{ cursor: 'grab', marginRight: '5px' }} {...props}>
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
			<path d="M13 8c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM5 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zM9 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"></path>
		</svg>
	</div>
));

function BlockItem({ thisBlock, activeBlock, toggleCollapse, collapsed }) {
	const parentProps = {};

	const hasChildren = thisBlock?.children?.length > 0;

	const blockMeta = useSelect((select) => {
		return select('core/blocks').getBlockType(thisBlock.name);
	}, []);

	function stripHtml(html) {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}

	let labelOrTitle = stripHtml(get(thisBlock, ['attributes', 'label'], ''));
	if (labelOrTitle === '') {
		labelOrTitle = get(blockMeta, ['title'], '');
	}

	const depth = () => {
		if (thisBlock.depth === 0) {
			return 0;
		}

		return thisBlock.depth * 15 + 30;
	};

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: thisBlock.clientId,
		data: {
			name: thisBlock.name,
			attributes: thisBlock.attributes,
		},
	});

	const style = transform
		? {
				backgroundColor: activeBlock ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				marginLeft: depth() + 'px',
		  }
		: {
				marginLeft: depth() + 'px',
		  };

	parentProps.ref = setNodeRef;
	parentProps.style = style;
	const dragHandleProps = { ...listeners, ...attributes };

	return (
		<div className={`menu-block ${!hasChildren ? 'no-children' : ''}`} {...parentProps}>
			<DragHandle {...dragHandleProps} />

			{/* Expand all for the time being */}
			{hasChildren && (
				<Icon
					className={'has-children'}
					icon={collapsed ? 'arrow-right-alt2' : 'arrow-down-alt2'}
					onClick={() => toggleCollapse(thisBlock.clientId)}
				/>
			)}
			<Icon className={'block-icon'} icon={blockMeta?.icon?.src} />
			<span className={'block-label'}>{labelOrTitle}</span>
			<Icon className={'block-settings'} icon="ellipsis" />
		</div>
	);
}

export default function MenuEdit({ closeModal, blocks }) {
	const [collapsed, setCollapsed] = useState([]);
	const [activeBlock, setActiveBlock] = useState(null);

	function handleDragStart({ active }) {
		setActiveBlock(active.id);
	}

	const getIndex = (clientId) => {
		return wp.data.select('core/block-editor').getBlockIndex(clientId);
	};

	function handleDragOver({ active, over }) {
		if (over && active) {
			let destinationClientId = over.id;
			const currentClientID = active.id;

			const parentClientID = wp.data.select('core/block-editor').getBlockRootClientId(currentClientID);
			const destinationParentClientID = wp.data
				.select('core/block-editor')
				.getBlockRootClientId(destinationClientId);
			const newIndex = getIndex(destinationClientId);
			const currentIndex = getIndex(currentClientID);
			const destName = wp.data.select('core/block-editor').getBlockName(destinationClientId);
			const parentName = wp.data.select('core/block-editor').getBlockName(parentClientID);

			// We're moving within the same parent
			if (parentClientID === destinationParentClientID) {
				destinationClientId = parentClientID;
			}

			// Sorting into same position, no action needed.
			if (destinationClientId === parentClientID && newIndex === currentIndex) {
				return;
			}

			// clientID, fromRootClientId, toRootClientId, newIndex
			wp.data
				.dispatch('core/block-editor')
				.moveBlockToPosition(currentClientID, parentClientID, destinationClientId, newIndex);
		}
	}

	function handleDragEnd({ active, over }) {
		setActiveBlock(null);
	}

	function handleDragCancel() {
		setActiveBlock(null);
	}

	function hideCollapsedItems(array, idsToCollapse) {
		let isChild = [];

		return array.filter((item) => {
			if (isChild.includes(item.id)) {
				return false;
			}
			if ((idsToCollapse.includes(item.id) || isChild.includes(item.id)) && item.children) {
				isChild = [...isChild, ...item.children];
			}
			return true;
		});
	}

	const flattenBlocks = (blocks, depth = 0) => {
		const result = [];

		const traverse = (block, depth) => {
			const { innerBlocks, clientId } = block;
			const children = innerBlocks.map((innerBlock) => innerBlock.clientId);
			// delete block.innerBlocks; // Just for cleanup

			result.push({
				id: block.clientId,
				...block,
				depth,
				children,
			});

			innerBlocks.forEach((innerBlock) => traverse(innerBlock, depth + 1));
		};

		blocks.forEach((block) => traverse(block, depth));

		return result;
	};

	const toggleCollapse = (id) => {
		setCollapsed((prev) => {
			if (prev.includes(id)) {
				return prev.filter((i) => i !== id);
			}
			return [...prev, id];
		});
	};

	const flattenedItems = useMemo(() => {
		// Foreach block in blocks, add a property called children
		// This will be an array of all the innerBlocks
		const flat = flattenBlocks(blocks);
		return hideCollapsedItems(flat, collapsed);
	}, [blocks, collapsed]);

	const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);

	return (
		<div className={'menu-management'}>
			<div className={'edit-menu-name'}>
				NAME:{' '}
				<RichText
					tagName={'span'}
					placeholder={__('Set a Title', 'kadence-blocks')}
					onChange={(value) => console.log(value)}
					value={''}
					withoutInteractiveFormatting={true}
					allowedFormats={[]}
				/>
			</div>

			<DndContext
				// collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragOver={debounce(handleDragOver, 50)}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
					{flattenedItems.map((block) => (
						<BlockItem
							activeBlock={activeBlock === block.clientId}
							key={block.clientId}
							thisBlock={block}
							toggleCollapse={toggleCollapse}
							collapsed={collapsed.includes(block.clientId)}
						/>
					))}
				</SortableContext>
			</DndContext>

			<div style={{ marginTop: '20px' }}>
				<Button
					icon={link}
					isSecondary
					iconPosition="left"
					onClick={() => {
						console.log('INSERT NEW BLOCK');
					}}
					style={{
						width: '100%',
						color: '#000',
						borderColor: '#000',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					Add Navigation Item
				</Button>
			</div>

			<div style={{ marginTop: '30px', float: 'right' }}>
				<Button isPrimary onClick={closeModal}>
					{__('Done', 'kadence-blocks')}
				</Button>
			</div>
		</div>
	);
}
