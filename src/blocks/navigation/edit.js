/**
 * BLOCK: Kadence Advanced Navigation
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
import { Placeholder, Spinner, Button } from '@wordpress/components';
import { store as coreStore, EntityProvider, useEntityProp } from '@wordpress/core-data';

import { useEntityAutoDraft, useEntityAutoDraftAndPublish } from './hooks';
import { SelectOrCreatePlaceholder } from './components';
import { getUniqueId, getPostOrFseId, getPreviewSize } from '@kadence/helpers';

/**
 * Internal dependencies
 */
import EditInner from './edit-inner';
import { useEffect } from '@wordpress/element';

export function Edit(props) {
	const { attributes, setAttributes, clientId } = props;

	const { id, uniqueID, templateKey } = attributes;

	// Since we're not in the EntityProvider yet, we need to provide a post id.
	// 'id' and 'meta' will be undefined untill the actual post is chosen / loaded
	const [meta, setMeta] = useNavigationProp('meta', id);

	const metaAttributes = {
		orientation: meta?._kad_navigation_orientation,
		orientationTablet: meta?._kad_navigation_orientationTablet,
		orientationMobile: meta?._kad_navigation_orientationMobile,
		stretch: meta?._kad_navigation_stretch,
		stretchTablet: meta?._kad_navigation_stretchTablet,
		stretchMobile: meta?._kad_navigation_stretchMobile,
		fillStretch: meta?._kad_navigation_fillStretch,
		fillStretchTablet: meta?._kad_navigation_fillStretchTablet,
		fillStretchMobile: meta?._kad_navigation_fillStretchMobile,
	};

	const {
		orientation,
		orientationTablet,
		orientationMobile,
		stretch,
		stretchTablet,
		stretchMobile,
		fillStretch,
		fillStretchTablet,
		fillStretchMobile,
	} = metaAttributes;

	const { post, postExists, isLoading, currentPostType, postId } = useSelect(
		(select) => {
			return {
				post: id && select(coreStore).getEditedEntityRecord('postType', 'kadence_navigation', id),
				postExists: id && select(coreStore).getEntityRecord('postType', 'kadence_navigation', id),
				isLoading: select(coreStore).isResolving('getEntityRecord', ['postType', 'kadence_navigation', id]),
				currentPostType: select('core/editor')?.getCurrentPostType()
					? select('core/editor')?.getCurrentPostType()
					: '',
				postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
			};
		},
		[id]
	);

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
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
		if (currentPostType === 'kadence_navigation') {
			// Lame workaround for gutenberg to prevent showing the block Validity error.
			window.wp.data.dispatch('core/block-editor').setTemplateValidity(true);
		}
	}, []);

	const blockClasses = classnames({
		[`wp-block-kadence-navigation${uniqueID}`]: uniqueID,
		[`navigation-desktop-layout-stretch-${stretch}`]: !previewDevice || previewDevice == 'Desktop',
		[`navigation-tablet-layout-stretch-${stretchTablet}`]: previewDevice == 'Tablet',
		[`navigation-mobile-layout-stretch-${stretchMobile}`]: previewDevice == 'Mobile',
		[`navigation-desktop-layout-fill-stretch-${fillStretch}`]: !previewDevice || previewDevice == 'Desktop',
		[`navigation-tablet-layout-fill-stretch-${fillStretchTablet}`]: previewDevice == 'Tablet',
		[`navigation-mobile-layout-fill-stretch-${fillStretchMobile}`]: previewDevice == 'Mobile',
		[`navigation-desktop-orientation-${orientation ? orientation : 'horizontal'}`]:
			!previewDevice || previewDevice == 'Desktop',
		[`navigation-tablet-orientation-${orientationTablet ? orientationTablet : 'horizontal'}`]:
			previewDevice == 'Tablet',
		[`navigation-mobile-orientation-${orientationMobile ? orientationMobile : 'horizontal'}`]:
			previewDevice == 'Mobile',
	});
	const blockProps = useBlockProps({
		className: blockClasses,
	});

	if (isPreviewMode) {
		return <>{formTemplateContactIcon}</>;
	}

	{
		/* Directly editing from via kadence_navigation post type */
	}
	if (currentPostType === 'kadence_navigation') {
		return (
			<div {...blockProps}>
				<EditInner {...props} direct={true} id={postId} />
			</div>
		);
	}

	const [isAdding, addNew] = useEntityAutoDraftAndPublish('kadence_navigation', 'kadence_navigation');
	const makeNavigationPost = async () => {
		try {
			const response = await addNew();
			setAttributes({ id: response.id });
		} catch (error) {
			console.error(error);
		}
	};

	//if this is a templated navigation (usually coming from header onboarding)
	//then it should get premade with some templated content based on templateKey
	useEffect(() => {
		if (!id && templateKey) {
			makeNavigationPost();
		}
	}, []);

	return (
		<div {...blockProps}>
			{/* No navigation selected or selected navigation was deleted from the site, display chooser */}
			{(id === 0 || (undefined === postExists && !isLoading)) && (
				<Chooser
					id={id}
					postExists={postExists}
					post={post}
					commit={(nextId) => setAttributes({ id: nextId })}
				/>
			)}

			{/* Navigation selected but not loaded yet, show spinner */}
			{id > 0 && isEmpty(post) && undefined === postExists && isLoading && (
				<>
					<Placeholder
						className="kb-select-or-create-placeholder"
						label={__('Kadence Navigation', 'kadence-blocks')}
						icon={formBlockIcon}
					>
						<Spinner />
					</Placeholder>
					<InspectorControls>
						<KadencePanelBody
							panelName={'kb-navigation-selected-switch'}
							title={__('Selected Navigation', 'kadence-blocks')}
						>
							<SelectPostFromPostType
								postType="kadence_navigation"
								label={__('Selected Navigation', 'kadence-blocks')}
								hideLabelFromVision={true}
								onChange={(nextId) => {
									setAttributes({ id: parseInt(nextId) });
								}}
								value={id}
							/>

							<Button
								isLink={true}
								onClick={() => {
									setAttributes({ id: 0 });
								}}
								style={{ marginBottom: '10px' }}
							>
								{__('Create a New Navigation', 'kadence-blocks')}
							</Button>
						</KadencePanelBody>
					</InspectorControls>
				</>
			)}
			{/* Navigation selected is in the trash */}
			{id > 0 && !isEmpty(post) && post.status === 'trash' && (
				<>
					<Placeholder
						className="kb-select-or-create-placeholder"
						label={__('Kadence Navigation', 'kadence-blocks')}
						icon={formBlockIcon}
					>
						{__('The selected from is in the trash.', 'kadence-blocks')}
					</Placeholder>
					<InspectorControls>
						<KadencePanelBody
							panelName={'kb-advanced-form-selected-switch'}
							title={__('Selected Navigation', 'kadence-blocks')}
						>
							<SelectPostFromPostType
								postType="kadence_navigation"
								label={__('Selected Navigation', 'kadence-blocks')}
								hideLabelFromVision={true}
								onChange={(nextId) => {
									setAttributes({ id: parseInt(nextId) });
								}}
								value={id}
							/>

							<Button
								isLink={true}
								onClick={() => {
									setAttributes({ id: 0 });
								}}
								style={{ marginBottom: '10px' }}
							>
								{__('Create a New Navigation', 'kadence-blocks')}
							</Button>
						</KadencePanelBody>
					</InspectorControls>
				</>
			)}

			{/* Navigation selected and loaded, display it */}
			{((id > 0 && templateKey) || (id > 0 && !isEmpty(post) && post.status !== 'trash')) && (
				<EntityProvider kind="postType" type="kadence_navigation" id={id}>
					<EditInner {...props} direct={false} id={id} />
				</EntityProvider>
			)}
		</div>
	);
}

export default Edit;

function Chooser({ id, post, commit, postExists }) {
	const [isAdding, addNew] = useEntityAutoDraft('kadence_navigation', 'kadence_navigation');
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
			postType="kadence_navigation"
			label={__('Advanced Navigation', 'kadence-blocks')}
			instructions={__('Select an existing navigation or create a new one.', 'kadence-blocks')}
			placeholder={__('Select navigation', 'kadence-blocks')}
			onSelect={commit}
			isSelecting={id && isEmpty(post) && undefined !== postExists}
			onAdd={onAdd}
			isAdding={isAdding}
		/>
	);
}

function useNavigationProp(prop, postId) {
	return useEntityProp('postType', 'kadence_navigation', prop, postId);
}
