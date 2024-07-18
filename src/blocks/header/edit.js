/**
 * BLOCK: Kadence Advanced Header
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
import { KadencePanelBody, SelectPostFromPostType, OnboardingModal } from '@kadence/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Placeholder, Spinner } from '@wordpress/components';
import { store as coreStore, EntityProvider, useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { createBlock } from '@wordpress/blocks';

import { useEntityAutoDraft, useEntityPublish } from './hooks';
import { VisualBuilder } from './components';
import { getUniqueId, getPostOrFseId, getPreviewSize } from '@kadence/helpers';
import HeaderName from './components/onboard/name';
import HeaderDesktop from './components/onboard/desktop';
import HeaderMobile from './components/onboard/mobile';
import HeaderExisting from './components/onboard/existing';

/**
 * Internal dependencies
 */
import EditInner from './edit-inner';
import { useEffect, Fragment, useState } from '@wordpress/element';
import { buildTemplateFromSelection } from './helpers';
import { HEADER_INNERBLOCK_DEFAULTS } from './constants';

export function Edit(props) {
	const { attributes, setAttributes, isSelected, clientId } = props;

	const { id, uniqueID } = attributes;

	const [meta, setMeta] = useHeaderProp('meta', id);
	const [justCompletedOnboarding, setJustCompletedOnboarding] = useState(false);

	const metaAttributes = {
		isSticky: meta?._kad_header_isSticky,
		isStickyTablet: meta?._kad_header_isStickyTablet,
		isStickyMobile: meta?._kad_header_isStickyMobile,
		isTransparent: meta?._kad_header_isTransparent,
		isTransparentTablet: meta?._kad_header_isTransparentTablet,
		isTransparentMobile: meta?._kad_header_isTransparentMobile,
	};

	const { isSticky, isStickyTablet, isStickyMobile, isTransparent, isTransparentTablet, isTransparentMobile } =
		metaAttributes;

	const { post, postExists, isLoading, currentPostType, postId } = useSelect(
		(select) => {
			return {
				post: id && select(coreStore).getEditedEntityRecord('postType', 'kadence_header', id),
				postExists: id && select(coreStore).getEntityRecord('postType', 'kadence_header', id),
				isLoading: select(coreStore).isResolving('getEntityRecord', ['postType', 'kadence_header', id]),
				currentPostType: select('core/editor')?.getCurrentPostType()
					? select('core/editor')?.getCurrentPostType()
					: '',
				postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
			};
		},
		[id]
	);

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData, previewDevice, isPreviewMode } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				isPreviewMode: select('core/block-editor').getSettings().__unstableIsPreviewMode,
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
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

	const previewIsTransparent = getPreviewSize(previewDevice, isTransparent, isTransparentTablet, isTransparentMobile);

	const blockClasses = classnames({
		'wp-block-kadence-header': true,
		[`wp-block-kadence-header${uniqueID}`]: uniqueID,
		[`header-desktop-sticky`]: isSticky == '1' && (!previewDevice || previewDevice == 'Desktop'),
		[`header-tablet-sticky`]: isStickyTablet == '1' && previewDevice == 'Tablet',
		[`header-mobile-sticky`]: isStickyMobile == '1' && previewDevice == 'Mobile',
		[`header-desktop-transparent`]: isTransparent == '1' && (!previewDevice || previewDevice == 'Desktop'),
		[`header-tablet-transparent`]: isTransparentTablet == '1' && previewDevice == 'Tablet',
		[`header-mobile-transparent`]: isTransparentMobile == '1' && previewDevice == 'Mobile',
	});

	const blockProps = useBlockProps({
		className: blockClasses,
	});

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
		if (currentPostType === 'kadence_header') {
			// Lame workaround for gutenberg to prevent showing the block Validity error.
			window.wp.data.dispatch('core/block-editor').setTemplateValidity(true);
		}
	}, []);

	let mainBlockContent = (
		<>
			<div {...blockProps}>
				{/* No headerselected or selected header was deleted from the site, display chooser */}
				{(id === 0 || (undefined === postExists && !isLoading)) && (
					<Chooser
						clientId={clientId}
						commit={(nextId) => setAttributes({ id: nextId })}
						setJustCompletedOnboarding={setJustCompletedOnboarding}
					/>
				)}

				{/* header selected but not loaded yet, show spinner */}
				{id > 0 && isEmpty(post) && undefined === postExists && isLoading && (
					<>
						<Placeholder
							className="kb-select-or-create-placeholder"
							label={__('Kadence Heading', 'kadence-blocks')}
							icon={formBlockIcon}
						>
							<Spinner />
						</Placeholder>
						<InspectorControls>
							<KadencePanelBody
								panelName={'kb-advanced-form-selected-switch'}
								title={__('Selected Header', 'kadence-blocks')}
							>
								<SelectPostFromPostType
									postType="kadence_header"
									label={__('Selected Header', 'kadence-blocks')}
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
				{/* Header selected is in the trash */}
				{id > 0 && !isEmpty(post) && post.status === 'trash' && (
					<>
						<Placeholder
							className="kb-select-or-create-placeholder"
							label={__('Kadence Heading', 'kadence-blocks')}
							icon={formBlockIcon}
						>
							{__('The selected from is in the trash.', 'kadence-blocks')}
						</Placeholder>
						<InspectorControls>
							<KadencePanelBody
								panelName={'kb-advanced-form-selected-switch'}
								title={__('Selected Header', 'kadence-blocks')}
							>
								<SelectPostFromPostType
									postType="kadence_header"
									label={__('Selected Header', 'kadence-blocks')}
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

				{/* Header selected and loaded, display it */}
				{id > 0 && !isEmpty(post) && post.status !== 'trash' && (
					<EntityProvider kind="postType" type="kadence_header" id={id}>
						<EditInner
							{...props}
							direct={false}
							id={id}
							justCompletedOnboarding={justCompletedOnboarding}
						/>
					</EntityProvider>
				)}
			</div>
			<VisualBuilder clientId={clientId} previewDevice={previewDevice} isSelected={isSelected} />
		</>
	);

	//Directly editing from via kadence_header post type
	if (currentPostType === 'kadence_header') {
		mainBlockContent = (
			<>
				<div {...blockProps}>
					<EditInner {...props} direct={true} id={postId} justCompletedOnboarding={justCompletedOnboarding} />
				</div>
				<VisualBuilder clientId={clientId} previewDevice={previewDevice} isSelected={isSelected} />
			</>
		);
	}

	if (previewIsTransparent) {
		return <div className="kb-header-transparent-placeholder">{mainBlockContent}</div>;
	}
	return mainBlockContent;
}

export default Edit;

function Chooser({ commit, clientId, setJustCompletedOnboarding }) {
	const [tmpId, setTmpId] = useState(0);
	const [formData, setFormData] = useState(null);

	const { setHeaderVisualBuilderOpenId } = useDispatch('kadenceblocks/data');

	const [isPublishing, publishNew] = useEntityPublish('kadence_header', tmpId);
	const [blocks, onInput, onChange] = useEntityBlockEditor('postType', 'kadence_header', { id: tmpId });
	const [existingTitle, setTitle] = useHeaderProp('title', tmpId);
	const [meta, setMeta] = useHeaderProp('meta', tmpId);

	const [isAdding, addNew] = useEntityAutoDraft('kadence_header', 'kadence_header');

	const [isOnboardingOpen, setIsOnboardingOpen] = useState(true);

	useEffect(() => {
		if (tmpId && formData) {
			updateTemplate(tmpId, formData);
		}
	}, [formData, tmpId]);

	const createPost = async () => {
		try {
			const response = await addNew();
			return response.id;
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	const updateTemplate = async (id, formData) => {
		const { headerName, headerDesktop, headerMobile, headerDescription } = formData;

		try {
			const response = await publishNew();
			let updatedMeta = meta;

			const { templateInnerBlocks, templatePostMeta } = buildTemplateFromSelection(headerDesktop, headerMobile);

			if (response.id) {
				if (templateInnerBlocks && headerDesktop !== 'skip' && headerMobile !== 'skip') {
					updatedMeta = { ...meta, ...templatePostMeta };
					onChange(templateInnerBlocks, clientId);
				} else {
					// Skip, or template not found
					onChange([createBlock('kadence/header', {}, HEADER_INNERBLOCK_DEFAULTS)], clientId);
				}

				setTitle(headerName);

				updatedMeta._kad_header_description = headerDescription;

				setMeta({ ...meta, updatedMeta });
				await wp.data
					.dispatch('core')
					.saveEditedEntityRecord('postType', 'kadence_header', id)
					.then(() => {
						commit(id);
					});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmit = (formData) => {
		if (formData.headerExisting && Number.isInteger(formData.headerExisting)) {
			commit(formData.headerExisting);
		} else if (formData.headerExisting === 'blank') {
			createPost().then((id) => {
				if (id !== false) {
					setFormData(formData);
					setTmpId(id);
				}
			});
		}

		//automatically open the visual editor when we've just created a new header
		setHeaderVisualBuilderOpenId(clientId);
	};

	const steps = [
		{ key: 'select-existing', name: 'Header Selection', hideSteps: true, component: HeaderExisting },
		{ key: 'name', name: 'Header Name', visualNumber: 1, component: HeaderName },
		{ key: 'desktop', name: 'Desktop Layout', visualNumber: 2, component: HeaderDesktop },
		{ key: 'mobile', name: 'Mobile Layout', visualNumber: 3, component: HeaderMobile },
	];

	return (
		<OnboardingModal
			steps={steps}
			isOpen={isOnboardingOpen}
			onRequestClose={(response) => {
				setIsOnboardingOpen(false);
				if (!response?.complete) {
					wp.data.dispatch('core/block-editor').removeBlock(clientId);
				} else {
					setJustCompletedOnboarding(true);
				}
			}}
			onSubmit={handleSubmit}
		/>
	);
}

function useHeaderProp(prop, postId) {
	return useEntityProp('postType', 'kadence_header', prop, postId);
}
