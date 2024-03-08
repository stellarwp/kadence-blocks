import { useCallback, useEffect, useState } from '@wordpress/element';
import { TextControl, Button, Icon } from '@wordpress/components';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { get } from 'lodash';
import { createBlock, serialize } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { EDITABLE_BLOCK_ATTRIBUTES, PREVENT_BLOCK_DELETE } from './constants';
import { link } from '@wordpress/icons';

function BlockItem({ thisBlock, allBlocks, index, updateLocalBlocks, maxIndex, depth }) {
	const [isEditing, setIsEditing] = useState(false);

	const hasChildren = thisBlock.innerBlocks.length > 0;
	const hasEditableAttributes = EDITABLE_BLOCK_ATTRIBUTES.some((block) => block.name === thisBlock.name);
	const editableAttributes = hasEditableAttributes
		? EDITABLE_BLOCK_ATTRIBUTES.find((block) => block.name === thisBlock.name).attributes
		: [];

	const blockMeta = useSelect((select) => {
		return select('core/blocks').getBlockType(thisBlock.name);
	}, []);

	const moveBlock = (direction, clientId, blocks, inRecursion = false) => {
		let index;
		const newArray = blocks.map((block, i) => {
			if (block.clientId === clientId) {
				index = i;
				return block;
			} else if (block.innerBlocks && block.innerBlocks.length > 0) {
				return {
					...block,
					innerBlocks: moveBlock(direction, clientId, block.innerBlocks, true),
				};
			}
			return block;
		});

		if (index !== undefined) {
			if (direction === 'up' && index > 0) {
				[newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
			} else if (direction === 'down' && index < newArray.length - 1) {
				[newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
			}
		}

		if (inRecursion) {
			return newArray;
		}

		updateLocalBlocks(newArray);
	};

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

	return (
		<>
			<div
				onClick={() => {
					hasEditableAttributes ? setIsEditing(!isEditing) : null;
				}}
				className={`menu-block ${isEditing ? 'active' : ''} ${!hasChildren ? 'no-children' : ''}`}
				style={{ marginLeft: depth * 20 + 'px' }}
			>
				{/* Expand all for the time being */}
				{/*{hasChildren && !isEditing && <Icon className={'has-children'} icon="arrow-right-alt2" />}*/}
				{/*{hasChildren && isEditing && <Icon className={'has-children'} icon="arrow-down-alt2" />}				{hasChildren && !isEditing && <Icon className={'has-children'} icon="arrow-right-alt2" />}*/}
				{hasChildren && <Icon className={'has-children'} icon="arrow-down-alt2" />}
				<Icon className={'block-icon'} icon={blockMeta.icon.src} />
				<span className={'block-label'}>{blockMeta.title}</span>
				<Icon className={'block-settings'} icon="ellipsis" />
			</div>
			{isEditing && (
				<div className={'edit-block'}>
					{renderEditableAttributes()}
					{index !== 0 && (
						<Button isSmall isPrimary onClick={() => moveBlock('up', thisBlock.clientId, allBlocks)}>
							Move Up
						</Button>
					)}
					&nbsp;&nbsp;&nbsp;
					{index < maxIndex && (
						<Button isSmall isPrimary onClick={() => moveBlock('down', thisBlock.clientId, allBlocks)}>
							Move Down
						</Button>
					)}
				</div>
			)}

			{hasChildren && <div>{renderBlocks(allBlocks, thisBlock.innerBlocks, updateLocalBlocks, depth + 1)}</div>}
		</>
	);
}

const renderBlocks = (allBlocks, innerBlocks, updateLocalBlocks, depth = 0) => {
	const maxIndex = innerBlocks.length - 1;

	return innerBlocks.map((block, index) => (
		<BlockItem
			key={block.clientId}
			depth={depth}
			index={index}
			maxIndex={maxIndex}
			thisBlock={block}
			allBlocks={allBlocks}
			updateLocalBlocks={updateLocalBlocks}
		/>
	));
};

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
		console.log('Saving changes');
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

			{renderBlocks(innerBlocks, innerBlocks, updateLocalBlocks)}

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
