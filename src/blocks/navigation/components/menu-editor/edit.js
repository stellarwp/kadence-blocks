import { useCallback, useEffect, useState } from '@wordpress/element';
import { TextControl, Button } from '@wordpress/components';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { get } from 'lodash';
import { createBlock, serialize } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
function NavigationItem({ thisBlock, allBlocks, index, updateLocalBlocks, maxIndex }) {
	const [isEditing, setIsEditing] = useState(false);
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

	return (
		<>
			<p>
				<strong>Block:</strong> {thisBlock.name} <br />
				{thisBlock.name === 'kadence/navigation-link' && (
					<>
						<strong>Label:</strong> {thisBlock.attributes.label} <br />
						<button onClick={() => setIsEditing(!isEditing)}>Edit</button>
					</>
				)}
			</p>
			{isEditing && (
				<>
					<p>
						Label:{' '}
						<TextControl
							value={thisBlock.attributes.label}
							onChange={(value) => handleAttributeUpdate({ label: value }, thisBlock.clientId, allBlocks)}
						/>
					</p>
					<p>
						Url:{' '}
						<TextControl
							value={thisBlock.attributes.url}
							onChange={(value) => handleAttributeUpdate({ url: value }, thisBlock.clientId, allBlocks)}
						/>
					</p>
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
				</>
			)}
			{thisBlock.innerBlocks.length > 0 && (
				<div style={{ marginTop: '10px', backgroundColor: 'red' }}>
					{renderBlocks(allBlocks, thisBlock.innerBlocks, updateLocalBlocks)}
				</div>
			)}
		</>
	);
}

const renderBlocks = (allBlocks, innerBlocks, updateLocalBlocks) => {
	const maxIndex = innerBlocks.length - 1;

	return innerBlocks.map((block, index) => (
		<div
			key={block.clientId}
			style={{
				backgroundColor: index % 2 === 1 ? '#FFF' : '#EEE',
				border: '1px solid #BBB',
				padding: '15px',
			}}
		>
			<NavigationItem
				index={index}
				maxIndex={maxIndex}
				thisBlock={block}
				allBlocks={allBlocks}
				updateLocalBlocks={updateLocalBlocks}
			/>
		</div>
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
		<div>
			<div className={'edit-menu-name'}>
				MENU NAME:{' '}
				<RichText
					className="kt-blocks-accordion-title"
					tagName={'span'}
					placeholder={__('Add Title', 'kadence-blocks')}
					onChange={(value) => setTmpTitle(value)}
					value={tmpTitle}
					keepPlaceholderOnFocus
				/>
			</div>

			{renderBlocks(innerBlocks, innerBlocks, updateLocalBlocks)}

			<div style={{ marginTop: '20px' }}>
				<Button
					isSmall
					onClick={() => {
						updateLocalBlocks([
							...innerBlocks,
							createBlock('kadence/navigation-link', { label: 'New Item' }),
						]);
					}}
				>
					Add New Item
				</Button>
			</div>

			<div style={{ marginTop: '20px' }}>
				<Button isSmall isDefault onClick={discardChanges}>
					Discard Changes
				</Button>
				<Button isSmall isPrimary onClick={saveChanges}>
					Save Changes
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
