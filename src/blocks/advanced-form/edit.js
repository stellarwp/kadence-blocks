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
import { Placeholder, Spinner, TextControl, Button, Modal } from '@wordpress/components';
import { store as coreStore, EntityProvider } from '@wordpress/core-data';
import { serialize } from '@wordpress/blocks';

import { useEntityAutoDraft } from './hooks';
import { SelectOrCreatePlaceholder } from './components';
import { uniqueIdHelper } from '@kadence/helpers';
import { applyFormIdToBlocks } from './transforms';

/**
 * Internal dependencies
 */
import EditInner from './edit-inner';
import { useEffect, useRef, useState } from '@wordpress/element';

export function Edit(props) {
	const { attributes, setAttributes, clientId } = props;

	const { id, uniqueID, legacyMigration } = attributes;

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

	const { saveEntityRecord } = useDispatch(coreStore);

	const { isPreviewMode } = useSelect(
		(select) => {
			return {
				isPreviewMode: select('core/block-editor').getSettings().__unstableIsPreviewMode,
			};
		},
		[clientId]
	);

	if (isPreviewMode) {
		return <>{formTemplateContactIcon}</>;
	}

	uniqueIdHelper(props);

	useEffect(() => {
		if (currentPostType === 'kadence_form') {
			// Lame workaround for gutenberg to prevent showing the block Validity error.
			window.wp.data.dispatch('core/block-editor').setTemplateValidity(true);
		}
	}, []);

	const legacyMigrationRef = useRef(false);
	const [pendingTitle, setPendingTitle] = useState('');
	const [chosenTitle, setChosenTitle] = useState('');
	const [isTitlePromptVisible, setIsTitlePromptVisible] = useState(false);
	const [isMigrationReady, setIsMigrationReady] = useState(false);

	useEffect(() => {
		if (legacyMigration) {
			setPendingTitle(legacyMigration.title || __('Migrated Form – Name', 'kadence-blocks'));
			setChosenTitle('');
			setIsTitlePromptVisible(true);
			setIsMigrationReady(false);
		} else {
			setIsTitlePromptVisible(false);
			setIsMigrationReady(false);
		}
	}, [legacyMigration]);

	useEffect(() => {
		if (!legacyMigration || !isMigrationReady || legacyMigrationRef.current) {
			return;
		}
		legacyMigrationRef.current = true;
		(async () => {
			try {
				const { meta, rootBlock } = legacyMigration;
				const resolvedTitle =
					chosenTitle ||
					pendingTitle.trim() ||
					legacyMigration.title ||
					__('Migrated Form', 'kadence-blocks');
				const createdRecord = await saveEntityRecord('postType', 'kadence_form', {
					status: 'publish',
					title: resolvedTitle,
					content: serialize([rootBlock]),
					meta,
				});

				if (createdRecord && createdRecord.id) {
					const contentWithId = serialize([applyFormIdToBlocks(rootBlock, String(createdRecord.id))]);
					await saveEntityRecord('postType', 'kadence_form', {
						id: createdRecord.id,
						content: contentWithId,
					});
					setAttributes({ id: createdRecord.id, legacyMigration: undefined });
				} else {
					setAttributes({ legacyMigration: undefined });
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Kadence Blocks: legacy form migration failed', error);
				setAttributes({ legacyMigration: undefined });
			} finally {
				legacyMigrationRef.current = false;
				setIsMigrationReady(false);
			}
		})();
	}, [chosenTitle, isMigrationReady, legacyMigration, pendingTitle, saveEntityRecord, setAttributes]);

	const handleConfirmMigration = (useSuggested = false) => {
		if (!legacyMigration) {
			return;
		}
		const suggestedTitle = legacyMigration.title || __('Migrated Form', 'kadence-blocks');
		const resolvedTitle = useSuggested ? suggestedTitle : pendingTitle.trim() || suggestedTitle;
		setChosenTitle(resolvedTitle);
		setIsTitlePromptVisible(false);
		setIsMigrationReady(true);
	};

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

	if (legacyMigration) {
		return (
			<div {...blockProps}>
				<Placeholder
					className="kb-select-or-create-placeholder"
					label={__('Kadence Form', 'kadence-blocks')}
					icon={formBlockIcon}
				>
					{isMigrationReady ? (
						<>
							<Spinner />
							<p>{__('Migrating legacy form…', 'kadence-blocks')}</p>
						</>
					) : (
						<>
							<p>{__('Name your migrated form to finish the upgrade.', 'kadence-blocks')}</p>
							<Button variant="primary" onClick={() => setIsTitlePromptVisible(true)}>
								{__('Name Form', 'kadence-blocks')}
							</Button>
						</>
					)}
				</Placeholder>
				{isTitlePromptVisible && (
					<Modal
						title={__('Name Your Form', 'kadence-blocks')}
						onRequestClose={() => handleConfirmMigration(false)}
						shouldCloseOnClickOutside={false}
						shouldCloseOnEsc={false}
						className="kb-form-migration-modal"
					>
						<TextControl
							label={__('Form name', 'kadence-blocks')}
							value={pendingTitle}
							onChange={(value) => setPendingTitle(value)}
							help={__('This name appears in the Kadence Forms list.', 'kadence-blocks')}
							autoComplete="off"
						/>
						<div className="kb-form-migration-modal__actions">
							<Button variant="primary" onClick={() => handleConfirmMigration(false)}>
								{__('Create Form', 'kadence-blocks')}
							</Button>
						</div>
					</Modal>
				)}
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
