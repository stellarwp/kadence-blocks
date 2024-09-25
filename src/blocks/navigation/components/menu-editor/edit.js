import { useState, useMemo } from '@wordpress/element';
import { DropdownMenu, Button, Icon, TextControl } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { get, debounce } from 'lodash';
import { __ } from '@wordpress/i18n';
import { PREVENT_BLOCK_DELETE } from './constants';
import { moreHorizontal, edit, trash, plus } from '@wordpress/icons';
import { memo } from 'react';

import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

const DragHandle = memo((props) => (
	<div className={'drag-handle'} style={{ cursor: 'grab', marginRight: '5px' }} {...props}>
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
			<path d="M13 8c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM5 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zM9 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"></path>
		</svg>
	</div>
));

function BlockItem({ thisBlock, activeBlock, toggleCollapse, collapsed }) {
	const forceOpenInEditor = get(thisBlock, ['attributes', 'forceOpenInEditor'], false);
	const [isEditing, setIsEditing] = useState(forceOpenInEditor);
	const parentProps = {};

	if (forceOpenInEditor) {
		wp.data.dispatch('core/block-editor').updateBlockAttributes(thisBlock.clientId, { forceOpenInEditor: false });
	}

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

		return thisBlock.depth * 20 + 30;
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

	const isPostType =
		thisBlock.attributes.kind === 'post-type' ||
		thisBlock.attributes.type === 'post' ||
		thisBlock.attributes.type === 'page';
	const hasSyncedLink =
		isPostType &&
		thisBlock.attributes.kind === 'post-type' &&
		thisBlock.attributes.id &&
		!thisBlock.attributes.disableLink;

	return (
		<div {...parentProps}>
			<div className={`menu-block ${!hasChildren ? 'no-children' : ''}`}>
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
				<span className={'block-label'} onClick={() => setIsEditing(!isEditing)}>
					{labelOrTitle}
				</span>
				<DropdownMenu
					icon={moreHorizontal}
					className={'block-settings'}
					label={__('Options', 'kadence-blocks')}
					controls={[
						{
							title: 'Edit',
							icon: edit,
							isDisabled: thisBlock.name !== 'kadence/navigation-link',
							onClick: () => setIsEditing(!isEditing),
						},
						{
							title: 'Delete',
							icon: trash,
							isDisabled: PREVENT_BLOCK_DELETE.includes(thisBlock.name),
							onClick: () => deleteBlock(thisBlock.clientId),
						},
					]}
				/>
			</div>
			{isEditing && thisBlock.name == 'kadence/navigation-link' && (
				<div
					key={thisBlock.clientId}
					style={{
						display: 'block',
						marginLeft: '25px',
						backgroundColor: 'rgb(242, 242, 242)',
						padding: '15px',
					}}
				>
					<TextControl
						label={__('Label', 'kadence-blocks')}
						value={thisBlock.attributes.label}
						onChange={(value) => {
							wp.data
								.dispatch('core/block-editor')
								.updateBlockAttributes(thisBlock.clientId, { label: value });
						}}
					/>

					<TextControl
						label={__('URL', 'kadence-blocks')}
						value={thisBlock.attributes.url}
						onChange={(value) => {
							wp.data
								.dispatch('core/block-editor')
								.updateBlockAttributes(thisBlock.clientId, { url: value });
						}}
						disabled={hasSyncedLink}
					/>

					<div style={{ marginTop: '15px', display: 'flex' }}>
						<Button
							style={{ marginRight: '10px' }}
							onClick={() => {
								wp.data.dispatch('core/block-editor').insertBlocks(
									[
										createBlock('kadence/navigation-link', {
											label: __('New Link', 'kadence-blocks'),
											url: '',
											kind: 'custom',
											uniqueID: Math.random().toString(36).substr(2, 9),
											forceOpenInEditor: true,
										}),
									],
									99999,
									thisBlock.clientId,
									false,
									null
								);
							}}
							icon={plus}
							isSecondary
						>
							{__('Add sub menu link', 'kadence-blocks')}
						</Button>

						<Button onClick={() => setIsEditing(false)} isPrimary>
							{__('Close', 'kadence-blocks')}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

const deleteBlock = (clientId) => {
	wp.data.dispatch('core/block-editor').removeBlock(clientId, false);
};

export default function MenuEdit({ blocks }) {
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
		const isChild = [];

		function addChildrenRecursively(children) {
			children.forEach((childId) => {
				if (!isChild.includes(childId)) {
					isChild.push(childId);
					const childItem = array.find((item) => item.id === childId);
					if (childItem && childItem.children) {
						addChildrenRecursively(childItem.children);
					}
				}
			});
		}

		return array.filter((item) => {
			if (isChild.includes(item.id)) {
				return false;
			}
			if ((idsToCollapse.includes(item.id) || isChild.includes(item.id)) && item.children) {
				addChildrenRecursively(item.children);
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
			{blocks.length === 0 ? (
				<p>{__('Insert links to get started.', 'kadence-blocks')}</p>
			) : (
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
			)}
		</div>
	);
}
