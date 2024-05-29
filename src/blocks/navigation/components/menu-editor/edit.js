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

function BlockItem({ thisBlock, allBlocks, index, maxIndex, depth }) {
	const [isEditing, setIsEditing] = useState(false);

	const hasChildren = thisBlock?.innerBlocks?.length > 0;
	const hasEditableAttributes = EDITABLE_BLOCK_ATTRIBUTES.some((block) => block.name === thisBlock.name);
	const editableAttributes = hasEditableAttributes
		? EDITABLE_BLOCK_ATTRIBUTES.find((block) => block.name === thisBlock.name).attributes
		: [];

	const blockMeta = useSelect((select) => {
		return select('core/blocks').getBlockType(thisBlock.name);
	}, []);

	// const renderEditableAttributes = () => {
	// 	return editableAttributes.map((attribute) => {
	// 		const value = get(thisBlock, ['attributes', attribute.name], '');
	//
	// 		if (attribute.type === 'string') {
	// 			return (
	// 				<p key={attribute.name} style={{ textTransform: 'capitalize' }}>
	// 					{attribute.name}:{' '}
	// 					<TextControl
	// 						value={value}
	// 						onChange={(newValue) => {
	// 							console.log('Update Attribute');
	// 						}}
	// 					/>
	// 				</p>
	// 			);
	// 		}
	//
	// 		return <p>Attribute type of {attribute.type} is not supported yet.</p>;
	// 	});
	// };

	function stripHtml(html) {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	}

	let labelOrTitle = stripHtml(get(thisBlock, ['attributes', 'label'], ''));
	if (labelOrTitle === '') {
		labelOrTitle = get(blockMeta, ['title'], '');
	}

	return (
		<>
			<div
				onClick={() => {
					// hasEditableAttributes ? setIsEditing(!isEditing) : null;
				}}
				className={`menu-block ${isEditing ? 'active' : ''} ${!hasChildren ? 'no-children' : ''}`}
				style={{ marginLeft: depth * 20 + 'px' }}
			>
				{/* Expand all for the time being */}
				{/*{hasChildren && !isEditing && <Icon className={'has-children'} icon="arrow-right-alt2" />}*/}
				{/*{hasChildren && isEditing && <Icon className={'has-children'} icon="arrow-down-alt2" />}				{hasChildren && !isEditing && <Icon className={'has-children'} icon="arrow-right-alt2" />}*/}
				{hasChildren && <Icon className={'has-children'} icon="arrow-down-alt2" />}
				<Icon className={'block-icon'} icon={blockMeta?.icon?.src} />
				<span className={'block-label'}>{labelOrTitle}</span>
				<Icon className={'block-settings'} icon="ellipsis" />
			</div>
			{/*{isEditing && (*/}
			{/*	<div className={'edit-block'}>*/}
			{/*		{renderEditableAttributes()}*/}
			{/*		{index !== 0 && (*/}
			{/*			<Button isSmall isPrimary onClick={() => moveBlock('up', thisBlock.clientId, allBlocks)}>*/}
			{/*				Move Up*/}
			{/*			</Button>*/}
			{/*		)}*/}
			{/*		&nbsp;&nbsp;&nbsp;*/}
			{/*		{index < maxIndex && (*/}
			{/*			<Button isSmall isPrimary onClick={() => moveBlock('down', thisBlock.clientId, allBlocks)}>*/}
			{/*				Move Down*/}
			{/*			</Button>*/}
			{/*		)}*/}
			{/*	</div>*/}
			{/*)}*/}

			{hasChildren && <div>{renderBlocks(allBlocks, thisBlock.innerBlocks, depth + 1)}</div>}
		</>
	);
}

const renderBlocks = (allBlocks, innerBlocks, depth = 0) => {
	const maxIndex = innerBlocks.length - 1;

	return innerBlocks.map((block, index) => (
		<BlockItem
			key={block.clientId}
			depth={depth}
			index={index}
			maxIndex={maxIndex}
			thisBlock={block}
			allBlocks={allBlocks}
		/>
	));
};

export default function MenuEdit({ blocks }) {
	const discardChanges = () => {
		console.log('Discarding changes');
	};

	const saveChanges = async () => {
		console.log('Save changes');
	};

	return (
		<div className={'menu-management'}>
			<div className={'edit-menu-name'}>
				MENU NAME:{' '}
				<RichText
					tagName={'span'}
					placeholder={__('Set a Title', 'kadence-blocks')}
					onChange={(value) => console.log(value)}
					value={''}
					withoutInteractiveFormatting={true}
					allowedFormats={[]}
				/>
			</div>

			{renderBlocks(blocks, blocks)}

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
