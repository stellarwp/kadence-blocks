import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { TextControl, Button, Icon, DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { debounce, get } from 'lodash';
import { createBlock, serialize } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { EDITABLE_BLOCK_ATTRIBUTES, PREVENT_BLOCK_DELETE, PREVENT_BLOCK_MOVE } from './constants';
import { link, trash } from '@wordpress/icons';

function DragHandle(props) {
	return (
		<div className={'drag-handle'} style={{ cursor: 'grab', marginRight: '5px' }} {...props}>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
				<path d="M13 8c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM5 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm8 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zM9 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"></path>
			</svg>
		</div>
	);
}

const moveBlock = (blocks, clientIdToMove, destinationParentId, index) => {
	const blocksCopy = JSON.parse(JSON.stringify(blocks)); // Make a deep copy to avoid modifying the original
	let blockToMove = null;

	// Function to find and remove the block from its current location
	function findAndRemoveBlock(blocks, clientId) {
		for (let i = 0; i < blocks.length; i++) {
			if (blocks[i].clientId === clientId) {
				blockToMove = blocks.splice(i, 1)[0];
				return true;
			}
			if (blocks[i].innerBlocks && blocks[i].innerBlocks.length > 0) {
				if (findAndRemoveBlock(blocks[i].innerBlocks, clientId)) {
					return true;
				}
			}
		}
		return false;
	}

	// Function to find the destination block
	function findBlock(blocks, clientId) {
		for (const block of blocks) {
			if (block.clientId === clientId) {
				return block;
			}
			if (block.innerBlocks && block.innerBlocks.length > 0) {
				const foundBlock = findBlock(block.innerBlocks, clientId);
				if (foundBlock) {
					return foundBlock;
				}
			}
		}
		return null;
	}

	// Remove the block from its original location
	findAndRemoveBlock(blocksCopy, clientIdToMove);

	if (blockToMove) {
		// Find the destination block
		const parentBlock = findBlock(blocksCopy, destinationParentId);

		if (parentBlock) {
			// Insert the block at the specified index within the destination block's innerBlocks
			parentBlock.innerBlocks.splice(index, 0, blockToMove);
			// Assuming updateLocalBlocks is a function that accepts the modified blocks array
			return blocksCopy;
		}
		console.error('Destination block not found');
		return null;
	}
	console.error('Block to move not found');
	return null;
};

function BlockItem({ thisBlock, allBlocks, block, updateLocalBlocks, toggleCollapse, collapsedItems }) {
	const { depth, index, hasChildren } = block;
	const [isEditing, setIsEditing] = useState(false);

	const hasEditableAttributes = EDITABLE_BLOCK_ATTRIBUTES.some((block) => block.name === thisBlock.name);
	const editableAttributes = hasEditableAttributes
		? EDITABLE_BLOCK_ATTRIBUTES.find((block) => block.name === thisBlock.name).attributes
		: [];

	const blockMeta = useSelect((select) => {
		return select('core/blocks').getBlockType(thisBlock.name);
	}, []);

	// const moveBlock = (direction, clientId, blocks, inRecursion = false) => {
	// 	let index;
	// 	const newArray = blocks.map((block, i) => {
	// 		if (block.clientId === clientId) {
	// 			index = i;
	// 			return block;
	// 		} else if (block.innerBlocks && block.innerBlocks.length > 0) {
	// 			return {
	// 				...block,
	// 				innerBlocks: moveBlock(direction, clientId, block.innerBlocks, true),
	// 			};
	// 		}
	// 		return block;
	// 	});
	//
	// 	if (index !== undefined) {
	// 		if (direction === 'up' && index > 0) {
	// 			[newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
	// 		} else if (direction === 'down' && index < newArray.length - 1) {
	// 			[newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
	// 		}
	// 	}
	//
	// 	if (inRecursion) {
	// 		return newArray;
	// 	}
	//
	// 	updateLocalBlocks(newArray);
	// };

	const handleAttributeUpdate = (newAttribute, clientId, blocks, inRecursion = false) => {
		const newArray = blocks.map((block) => {
			if (block.clientId === clientId) {
				return {
					...block,
					attributes: {
						...block.attributes,
						...newAttribute,
					},
				};
			} else if (block.innerBlocks && block.innerBlocks.length > 0) {
				return {
					...block,
					innerBlocks: handleAttributeUpdate(newAttribute, clientId, block.innerBlocks, true),
				};
			}
			return block;
		});

		if (inRecursion) {
			return newArray;
		}

		updateLocalBlocks(newArray);
	};

	const renderEditableAttributes = () => {
		return editableAttributes.map((attribute) => {
			const value = get(thisBlock, ['attributes', attribute.name], '');

			if (attribute.type === 'string') {
				return (
					<p key={attribute.name} style={{ textTransform: 'capitalize' }}>
						{attribute.name}:{' '}
						<TextControl
							value={value}
							onChange={(newValue) =>
								handleAttributeUpdate({ [attribute.name]: newValue }, thisBlock.clientId, allBlocks)
							}
						/>
					</p>
				);
			}

			return <p>Attribute type of {attribute.type} is not supported yet.</p>;
		});
	};

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: thisBlock.clientId });

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: undefined;

	return (
		<div style={style} ref={setNodeRef}>
			<div className={'menu-block-container'} style={{ marginLeft: depth * 22 + 'px' }}>
				{!PREVENT_BLOCK_MOVE.includes(thisBlock.name) && <DragHandle {...attributes} {...listeners} />}
				<div className={`menu-block ${isEditing ? 'active' : ''} ${!hasChildren ? 'no-children' : ''}`}>
					{hasChildren && collapsedItems.includes(thisBlock.clientId) && (
						<Button onClick={() => toggleCollapse(thisBlock.clientId)}>
							<Icon className={'has-children'} icon="arrow-right-alt2" />
						</Button>
					)}
					{hasChildren && !collapsedItems.includes(thisBlock.clientId) && (
						<Button onClick={() => toggleCollapse(thisBlock.clientId)}>
							<Icon className={'has-children'} icon="arrow-down-alt2" />
						</Button>
					)}
					<Icon className={'block-icon'} icon={blockMeta?.icon?.src} />
					<span className={'block-label'}>{blockMeta?.title}</span>
					<DropdownMenu icon={'ellipsis'} className={'menu-options'} label="Select a direction">
						{({ onClose }) => (
							<>
								<MenuGroup>
									<MenuItem
										icon={link}
										onClick={() => {
											console.log('Edit Block');
											setIsEditing(!isEditing);
											onClose();
										}}
									>
										{__('Edit Block', 'kadence-blocks')}
									</MenuItem>
									<MenuItem
										icon={trash}
										onClick={() => {
											console.log('Delete Block');
											onClose();
										}}
									>
										{__('Delete Block', 'kadence-blocks')}
									</MenuItem>
								</MenuGroup>
							</>
						)}
					</DropdownMenu>
				</div>
			</div>
			{isEditing && <div className={'edit-block'}>{renderEditableAttributes()}</div>}
		</div>
	);
}

export default function MenuEdit({ selectedPostId }) {
	const { saveEntityRecord } = useDispatch('core');
	const [blocks, , onChange] = useEntityBlockEditor('postType', 'kadence_navigation', { id: selectedPostId });
	const [title, setTitle] = useNavigationProp('title', selectedPostId);

	const initialBlocks = get(blocks, [0, 'innerBlocks'], [selectedPostId]);
	const [innerBlocks, setInnerBlocks] = useState(initialBlocks);
	const [tmpTitle, setTmpTitle] = useState(title);

	useEffect(() => {
		setInnerBlocks(initialBlocks);
		setTmpTitle(title);
	}, [selectedPostId]);

	const updateLocalBlocks = (newBlocks) => {
		setInnerBlocks(newBlocks);
	};

	const discardChanges = () => {
		console.log('Discarding changes');
		updateLocalBlocks([...initialBlocks]); // Reset to initial state
	};

	const saveChanges = async () => {
		onChange(
			[
				{
					...innerBlocks[0],
					innerBlocks,
				},
			],
			blocks[0].clientId
		);
		try {
			const newBlock = createBlock('kadence/navigation', {}, innerBlocks);
			await saveEntityRecord('postType', 'kadence_navigation', {
				id: selectedPostId,
				content: serialize(newBlock),
				title: tmpTitle,
			});
			console.log('Post saved successfully');
		} catch (error) {
			console.error('Error saving post:', error);
		}
	};

	function handleDragEnd(event) {
		const { active, over } = event;

		console.log('handleDragEnd');
		console.log(event);

		if (active.clientId !== over.clientId) {
			// setItems((items) => {
			// 	const oldIndex = items.indexOf(active.clientId);
			// 	const newIndex = items.indexOf(over.clientId);
			//
			// 	return arrayMove(items, oldIndex, newIndex);
			// });
		}
	}

	function handleDragStart(event) {
		const { active, over } = event;

		console.log('handleDragStart');
		console.log(event);
	}

	function handleDragMove(event) {
		const { active, over } = event;

		console.log('handleDragMove');
		console.log(active.id, over.id);

		const updatedBlocks = moveBlock(innerBlocks, active.id, over.id, 0);

		if (null !== updatedBlocks) {
			console.log('Updated Blocks');
			setInnerBlocks([...updatedBlocks]);
		}
		console.log(updatedBlocks);
	}

	function handleDragOver(event) {
		const { active, over } = event;

		console.log('handleDragOver');
		console.log(event);
	}

	function flattenBlocks(blocks, collapsedItems, parentId = null, depth = 0, path = []) {
		let result = [];
		blocks.forEach((block, index) => {
			const { clientId, name, isValid, attributes, innerBlocks } = block;
			const flatBlock = {
				id: clientId,
				clientId,
				name,
				isValid,
				attributes,
				parentId,
				depth,
				index: path.concat(index).join('.'),
				hasChildren: innerBlocks && innerBlocks.length > 0,
			};
			result.push(flatBlock);

			// foreach collapsedItems, check if the value matched the current clientId
			if (!collapsedItems.includes(clientId)) {
				if (innerBlocks && innerBlocks.length > 0) {
					result = result.concat(
						flattenBlocks(innerBlocks, collapsedItems, clientId, depth + 1, path.concat(index))
					);
				}
			}
		});
		return result;
	}

	const [collapsedItems, setCollapsedItems] = useState([]);
	const flattenedBlocks = useMemo(() => {
		return flattenBlocks(initialBlocks, collapsedItems);
	}, [initialBlocks, collapsedItems]);

	const toggleCollapse = (clientId) => {
		if (collapsedItems.includes(clientId)) {
			setCollapsedItems(collapsedItems.filter((item) => item !== clientId));
		} else {
			setCollapsedItems([...collapsedItems, clientId]);
		}
	};

	return (
		<div className={'menu-management'}>
			<div className={'edit-menu-name'}>
				MENU NAME:{' '}
				<RichText
					tagName={'span'}
					placeholder={__('Set a Title', 'kadence-blocks')}
					onChange={(value) => setTmpTitle(value)}
					value={tmpTitle}
					withoutInteractiveFormatting={true}
					allowedFormats={[]}
				/>
			</div>

			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				handleDragStart={handleDragStart}
				onDragMove={debounce(handleDragMove, 200)}
				onDragOver={handleDragOver}
			>
				<SortableContext items={flattenedBlocks} strategy={verticalListSortingStrategy}>
					{flattenedBlocks.map((block, index) => (
						<BlockItem
							key={block.clientId}
							block={block} // Ensure depth is taken from each block if varying depths are expected
							thisBlock={block}
							allBlocks={flattenedBlocks} // Assuming you want to pass the entire flattened structure
							updateLocalBlocks={updateLocalBlocks}
							toggleCollapse={toggleCollapse}
							collapsedItems={collapsedItems}
						/>
					))}
				</SortableContext>
				<DragOverlay>Dragging me!</DragOverlay>
			</DndContext>

			<div style={{ marginTop: '20px' }}>
				<Button
					icon={link}
					isSecondary
					iconPosition="left"
					onClick={() => {
						updateLocalBlocks([
							...innerBlocks,
							createBlock('kadence/navigation-link', { label: 'New Item' }),
						]);
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
				<Button isTertiary onClick={discardChanges} style={{ marginRight: '20px' }}>
					Cancel
				</Button>
				<Button isPrimary onClick={saveChanges}>
					Apply
				</Button>
			</div>
		</div>
	);
}

function useNavigationProp(prop, id) {
	return useEntityProp('postType', 'kadence_navigation', prop, id);
}

function useNavigationMeta(key) {
	const [meta, setMeta] = useNavigationProp('meta');

	return [
		meta[key],
		useCallback(
			(newValue) => {
				setMeta({ ...meta, [key]: newValue });
			},
			[key, setMeta]
		),
	];
}
