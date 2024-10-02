import { useState, useMemo } from '@wordpress/element';
import { DropdownMenu, Button, Icon, TextControl } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { get, debounce } from 'lodash';
import { __ } from '@wordpress/i18n';
import { PREVENT_BLOCK_DELETE } from './constants';
import { moreHorizontal, edit, trash, plus } from '@wordpress/icons';
import { memo } from 'react';

import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

const DragHandle = memo((props) => (
	<div className={'drag-handle'} style={{ cursor: 'grab', marginRight: '5px' }} {...props}>
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
			<path d="M13 8c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM5 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zM9 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"></path>
		</svg>
	</div>
));

function BlockItem({ thisBlock, activeBlock, toggleCollapse, collapsed, isOver, dropZone, isPreview = false }) {
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

	const depth = useMemo(() => {
		if (thisBlock.depth === 0) {
			return 0;
		}

		return thisBlock.depth * 20 + 30;
	}, [thisBlock.depth]);

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: thisBlock.clientId,
		data: {
			name: thisBlock.name,
			attributes: thisBlock.attributes,
		},
	});

	const style = useMemo(() => {
		const styles = {
			marginLeft: depth + 'px',
			transition,
			position: 'relative',
			zIndex: activeBlock ? 1 : 'auto',
		};

		if (isPreview && transform) {
			styles.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
		}

		return styles;
	}, [depth, transition, activeBlock]);

	const menuBlockStyle = useMemo(() => {
		if (isPreview) {
			return {
				background: '#eee',
				opacity: 0.8,
				position: 'relative',
				top: '-10px',
				left: '-10px',
			};
		}

		return {
			opacity: activeBlock ? 0.5 : 1,
		};
	}, [activeBlock]);

	parentProps.ref = setNodeRef;
	parentProps.style = style;
	const dragHandleProps = { ...listeners, ...attributes };

	const isPostType =
		thisBlock?.attributes?.kind === 'post-type' ||
		thisBlock?.attributes?.type === 'post' ||
		thisBlock?.attributes?.type === 'page';
	const hasSyncedLink =
		isPostType &&
		thisBlock?.attributes?.kind === 'post-type' &&
		thisBlock?.attributes?.id &&
		!thisBlock?.attributes?.disableLink;

	return (
		<div {...parentProps}>
			<div className={`menu-block ${!hasChildren ? 'no-children' : ''}`} style={menuBlockStyle}>
				{thisBlock.name === 'kadence/navigation-link' && <DragHandle {...dragHandleProps} />}

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
			{isOver && (
				<>
					{dropZone === 'before' && (
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								height: '2px',
								backgroundColor: 'rgba(0, 120, 260, 0.8)',
								top: '-1px',
							}}
						/>
					)}
					{dropZone === 'child' && (
						<div
							style={{
								position: 'absolute',
								right: 0,
								left: `${depth + 75}px`,
								height: '2px',
								backgroundColor: 'rgba(0, 120, 260, 0.8)',
								bottom: '-1px',
							}}
						/>
					)}
				</>
			)}
			{isEditing && thisBlock.name === 'kadence/navigation-link' && (
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
	const [activeBlockLabel, setActiveBlockLabel] = useState(null);
	const [dropTarget, setDropTarget] = useState(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	function handleDragStart({ active }) {
		setActiveBlock(active.id);
		setActiveBlockLabel(active.data.current.attributes.label);
	}

	const getIndex = (clientId) => {
		return wp.data.select('core/block-editor').getBlockIndex(clientId);
	};

	function handleDragOver({ active, over }) {
		if (over) {
			const activeId = active.id;
			const overId = over.id;
			const overBlock = wp.data.select('core/block-editor').getBlock(overId);

			let dropZone = 'before';

			// Calculate the horizontal distance from the left edge of the over item
			const horizontalDistance = active.rect.current.translated.left - over.rect.left;

			// Determine if we're dropping as a child based on horizontal position
			if (
				overBlock.name === 'kadence/navigation-link' &&
				horizontalDistance > 80 &&
				activeId !== overId &&
				!isParentOf(activeId, overId)
			) {
				dropZone = 'child';
			}

			setDropTarget({ id: overId, dropZone });
		} else {
			setDropTarget(null);
		}
	}

	function isParentOf(potentialParentId, childId) {
		let currentParentId = wp.data.select('core/block-editor').getBlockRootClientId(childId);
		while (currentParentId) {
			if (currentParentId === potentialParentId) {
				return true;
			}
			currentParentId = wp.data.select('core/block-editor').getBlockRootClientId(currentParentId);
		}
		return false;
	}

	function handleDragEnd({ active, over }) {
		if (over && active.id !== over.id) {
			const activeId = active.id;
			const overId = over.id;

			const activeBlock = wp.data.select('core/block-editor').getBlock(activeId);
			const overBlock = wp.data.select('core/block-editor').getBlock(overId);

			const activeParentId = wp.data.select('core/block-editor').getBlockRootClientId(activeId);
			const overParentId = wp.data.select('core/block-editor').getBlockRootClientId(overId);

			const newIndex = wp.data.select('core/block-editor').getBlockIndex(overId);

			if (dropTarget.dropZone === 'child') {
				// Moving as a child
				wp.data.dispatch('core/block-editor').moveBlockToPosition(activeId, activeParentId, overId, 0);
			} else if (!overParentId && activeParentId) {
				// Moving from a nested position to the root
				wp.data.dispatch('core/block-editor').moveBlockToPosition(activeId, activeParentId, '', newIndex);
			} else {
				// Moving to a new position at the same level
				wp.data
					.dispatch('core/block-editor')
					.moveBlockToPosition(activeId, activeParentId, overParentId, newIndex);
			}

			// Update the block's attributes if necessary
			if (dropTarget.dropZone === 'child' && activeBlock.name === 'kadence/navigation-link') {
				wp.data.dispatch('core/block-editor').updateBlockAttributes(activeId, {
					parentId: overId,
				});
			} else if (!overParentId && activeParentId && activeBlock.name === 'kadence/navigation-link') {
				wp.data.dispatch('core/block-editor').updateBlockAttributes(activeId, {
					parentId: '',
				});
			}
		}

		setActiveBlock(null);
		setActiveBlockLabel(null);
		setDropTarget(null);
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
		const flat = flattenBlocks(blocks);

		let collapsedAndActive = collapsed;
		if (activeBlock) {
			collapsedAndActive = [...collapsed, activeBlock];
		}

		return hideCollapsedItems(flat, collapsedAndActive);
	}, [blocks, collapsed, activeBlock]);

	const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);

	return (
		<div className={'menu-management'}>
			{blocks.length === 0 ? (
				<p>{__('Insert links to get started.', 'kadence-blocks')}</p>
			) : (
				<DndContext
					sensors={sensors}
					onDragStart={handleDragStart}
					onDragMove={handleDragOver}
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
								isOver={dropTarget && dropTarget.id === block.clientId}
								dropZone={dropTarget && dropTarget.id === block.clientId ? dropTarget.dropZone : null}
							/>
						))}
					</SortableContext>
					<DragOverlay>
						<BlockItem
							activeBlock={true}
							key={activeBlock}
							isPreview={true}
							thisBlock={{
								clientId: activeBlock,
								depth: 0,
								name: 'kadence/navigation-link',
								attributes: { label: activeBlockLabel ? activeBlockLabel : 'Kadence Link' },
							}}
							toggleCollapse={toggleCollapse}
							collapsed={collapsed.includes(activeBlock)}
							isOver={false}
							dropZone={false}
						/>
					</DragOverlay>
				</DndContext>
			)}
		</div>
	);
}
