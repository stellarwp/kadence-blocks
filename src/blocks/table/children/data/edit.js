import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { BlockControls, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';

import {
	KadenceBlockDefaults,
	CopyPasteAttributes,
	KadenceInspectorControls,
	KadencePanelBody,
	InspectorControlTabs,
	SelectParentBlock,
} from '@kadence/components';
import { setBlockDefaults, getUniqueId, getPostOrFseId } from '@kadence/helpers';

import classnames from 'classnames';
import { ToggleControl } from '@wordpress/components';

const DEFAULT_BLOCK = [['core/paragraph', {}]];
export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

	const { uniqueID, isHeader } = attributes;

	const [activeTab, setActiveTab] = useState('general');

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);

	const classes = classnames(className, 'kb-table-data');
	const blockProps = useBlockProps({
		className: classes,
	});

	useEffect(() => {
		setBlockDefaults('kadence/table-data', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);

	const Tag = isHeader ? 'th' : 'td';

	return (
		<Tag {...blockProps}>
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					setAttributes={setAttributes}
					blockName={'kadence/table-data'}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/table-data'}>
				<SelectParentBlock
					label={__('View Row Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/table-row'}
				/>
				<InspectorControlTabs
					panelName={'table-data'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<KadencePanelBody title={__('General', 'kadence-blocks')} initialOpen={true}>
						<ToggleControl
							label={__('Table Header', 'kadence-blocks')}
							checked={isHeader}
							onChange={(value) => setAttributes({ isHeader: value })}
							help={__('Switches to th tag and applies header typography styles.', 'kadence-blocks')}
						/>
					</KadencePanelBody>
				)}
				{activeTab === 'advanced' && (
					<KadenceBlockDefaults
						blockSlug={'kadence/table-data'}
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				)}
			</KadenceInspectorControls>
			<InnerBlocks template={DEFAULT_BLOCK} renderAppender={false} templateLock={false} />
		</Tag>
	);
}

export default Edit;
