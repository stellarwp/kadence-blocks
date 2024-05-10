/**
 * BLOCK: Kadence Advanced Form
 */

/**
 * Import Css
 */
import './editor.scss';
/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { isEmpty } from 'lodash';
import { useSelect, useDispatch } from '@wordpress/data';
import { formBlockIcon, formTemplateContactIcon } from '@kadence/icons';
import { KadencePanelBody, SelectPostFromPostType } from '@kadence/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Placeholder, Spinner } from '@wordpress/components';
import { store as coreStore, EntityProvider } from '@wordpress/core-data';

import { useEntityAutoDraft } from './hooks';
import { SelectOrCreatePlaceholder } from './components';
import { getUniqueId, getPostOrFseId } from '@kadence/helpers';

/**
 * Internal dependencies
 */
import EditInner from './edit-inner';
import { useEffect } from '@wordpress/element';

export function Edit(props) {
	const { attributes, setAttributes, clientId } = props;

	const { id, uniqueID } = attributes;

	const blockClasses = classnames({
		'wp-block-kadence-advanced-form': true,
		[`wp-block-kadence-advanced-form${uniqueID}`]: uniqueID,
	});
	const blockProps = useBlockProps({
		className: blockClasses,
	});
	const { post, postExists, isLoading, currentPostType, postId } = useSelect(
		(select) => {
			return {
				post: id && select(coreStore).getEditedEntityRecord('postType', 'kadence_form', id),
				postExists: id && select(coreStore).getEntityRecord('postType', 'kadence_form', id),
				isLoading: select(coreStore).isResolving('getEntityRecord', ['postType', 'kadence_form', id]),
				currentPostType: select('core/editor')?.getCurrentPostType()
					? select('core/editor')?.getCurrentPostType()
					: '',
				postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
			};
		},
		[id]
	);

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData, isPreviewMode } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				isPreviewMode: select('core/block-editor').getSettings().__unstableIsPreviewMode,
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

	if (isPreviewMode) {
		return <>{formTemplateContactIcon}</>;
	}

	useEffect(() => {
		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueId, clientId);
		}
		if (currentPostType === 'kadence_form') {
			// Lame workaround for gutenberg to prevent showing the block Validity error.
			window.wp.data.dispatch('core/block-editor').setTemplateValidity(true);
		}
	}, []);

	{
		/* Directly editing from via kadence_form post type */
	}
	if (currentPostType === 'kadence_form') {
		return (
			<div {...blockProps}>
				<EditInner {...props} direct={true} id={postId} />
			</div>
		);
	}
	return (
		<div {...blockProps}>
			{/* No form selected or selected form was deleted from the site, display chooser */}
			{(id === 0 || (undefined === postExists && !isLoading)) && (
				<Chooser
					id={id}
					postExists={postExists}
					post={post}
					commit={(nextId) => setAttributes({ id: nextId })}
				/>
			)}

			{/* Form selected but not loaded yet, show spinner */}
			{id > 0 && isEmpty(post) && undefined === postExists && isLoading && (
				<>
					<Placeholder
						className="kb-select-or-create-placeholder"
						label={__('Kadence Form', 'kadence-blocks')}
						icon={formBlockIcon}
					>
						<Spinner />
					</Placeholder>
					<InspectorControls>
						<KadencePanelBody
							panelName={'kb-advanced-form-selected-switch'}
							title={__('Selected Form', 'kadence-blocks')}
						>
							<SelectPostFromPostType
								postType="kadence_form"
								label={__('Selected Form', 'kadence-blocks')}
								hideLabelFromVision={true}
								onChange={(nextId) => {
									setAttributes({ id: parseInt(nextId) });
								}}
								value={id}
							/>
						</KadencePanelBody>
					</InspectorControls>
				</>
			)}
			{/* Form selected is in the trash */}
			{id > 0 && !isEmpty(post) && post.status === 'trash' && (
				<>
					<Placeholder
						className="kb-select-or-create-placeholder"
						label={__('Kadence Form', 'kadence-blocks')}
						icon={formBlockIcon}
					>
						{__('The selected from is in the trash.', 'kadence-blocks')}
					</Placeholder>
					<InspectorControls>
						<KadencePanelBody
							panelName={'kb-advanced-form-selected-switch'}
							title={__('Selected Form', 'kadence-blocks')}
						>
							<SelectPostFromPostType
								postType="kadence_form"
								label={__('Selected Form', 'kadence-blocks')}
								hideLabelFromVision={true}
								onChange={(nextId) => {
									setAttributes({ id: parseInt(nextId) });
								}}
								value={id}
							/>
						</KadencePanelBody>
					</InspectorControls>
				</>
			)}

			{/* Form selected and loaded, display it */}
			{id > 0 && !isEmpty(post) && post.status !== 'trash' && (
				<EntityProvider kind="postType" type="kadence_form" id={id}>
					<EditInner {...props} direct={false} id={id} />
				</EntityProvider>
			)}
		</div>
	);
}

export default Edit;

function Chooser({ id, post, commit, postExists }) {
	const [isAdding, addNew] = useEntityAutoDraft('kadence_form', 'kadence_form');
	const onAdd = async () => {
		try {
			const response = await addNew();
			commit(response.id);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<SelectOrCreatePlaceholder
			postType="kadence_form"
			label={__('Advanced Form', 'kadence-blocks')}
			instructions={__('Select an existing form or create a new one.', 'kadence-blocks')}
			placeholder={__('Select Form', 'kadence-blocks')}
			onSelect={commit}
			isSelecting={id && isEmpty(post) && undefined !== postExists}
			onAdd={onAdd}
			isAdding={isAdding}
		/>
	);
}
