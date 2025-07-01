/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */
import classnames from 'classnames';

import { KadencePanelBody, KadenceIconPicker, IconRender, SelectParentBlock } from '@kadence/components';
import { getUniqueId, getPostOrFseId } from '@kadence/helpers';

import { __ } from '@wordpress/i18n';
import { ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import {
	RichText,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Build the Pane edit.
 */
function PaneEdit(props) {
	const { attributes, setAttributes, clientId } = props;
	const { id, uniqueID, title, icon, iconSide, hideLabel, titleTag, ariaLabel } = attributes;
	const HtmlTagOut = !titleTag ? 'div' : titleTag;
	const [activePane, setActivePane] = useState(false);
	const { addUniqueID, addUniquePane } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, isUniquePane, isUniquePaneBlock, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				isUniquePane: (value, rootID) => select('kadenceblocks/data').isUniquePane(value, rootID),
				isUniquePaneBlock: (value, clientId, rootID) =>
					select('kadenceblocks/data').isUniquePaneBlock(value, clientId, rootID),
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
	const { accordionBlock, rootID } = useSelect(
		(select) => {
			const { getBlockRootClientId, getBlocksByClientId } = select(blockEditorStore);
			const rootID = getBlockRootClientId(clientId);
			const accordionBlock = getBlocksByClientId(rootID);
			return {
				accordionBlock: undefined !== accordionBlock ? accordionBlock : '',
				rootID: undefined !== rootID ? rootID : '',
			};
		},
		[clientId]
	);
	const { hasInnerBlocks } = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);
			return {
				hasInnerBlocks: !!(block && block.innerBlocks.length),
			};
		},
		[clientId]
	);
	const { updateBlockAttributes } = useDispatch(blockEditorStore);
	const updatePaneCount = (value) => {
		updateBlockAttributes(rootID, { paneCount: value });
	};
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
		if (!id) {
			const newPaneCount = accordionBlock[0].attributes.paneCount + 1;
			setAttributes({
				id: newPaneCount,
			});
			if (!isUniquePane(newPaneCount, rootID)) {
				addUniquePane(newPaneCount, clientId, rootID);
			}
			updatePaneCount(newPaneCount);
		} else if (!isUniquePane(id, rootID)) {
			// This checks if we are just switching views, client ID the same means we don't need to update.
			if (!isUniquePaneBlock(id, clientId, rootID)) {
				const newPaneCount = accordionBlock[0].attributes.paneCount + 1;
				setAttributes({
					id: newPaneCount,
				});
				addUniquePane(newPaneCount, clientId, rootID);
				updatePaneCount(newPaneCount);
			}
		} else {
			addUniquePane(id, clientId, rootID);
		}
		const isStartCollapsed =
			undefined !== accordionBlock?.[0]?.attributes?.startCollapsed &&
			accordionBlock[0].attributes.startCollapsed;
		const isOpenPane =
			!isStartCollapsed &&
			undefined !== accordionBlock?.[0]?.attributes?.openPane &&
			accordionBlock[0].attributes.openPane + 1 === id;
		const isNewPane = !uniqueID;
		setActivePane((activePane ?? isNewPane) ? true : isOpenPane);
	}, []);
	const blockClasses = classnames({
		'kt-accordion-pane': true,
		[`kt-accordion-pane-${id}`]: id,
		[`kt-pane${uniqueID}`]: uniqueID,
		[`kt-accordion-panel-active`]: activePane,
	});
	const blockProps = useBlockProps({
		className: blockClasses,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'kt-accordion-panel-inner',
		},
		{
			templateLock: false,
			renderAppender: hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
		}
	);
	return (
		<div {...blockProps}>
			<InspectorControls>
				<SelectParentBlock clientId={clientId} />
				<KadencePanelBody
					title={__('Title Icon Settings', 'kadence-blocks')}
					initialOpen={false}
					panelName={'kb-pane-title-icon'}
				>
					<KadenceIconPicker
						value={icon}
						onChange={(value) => setAttributes({ icon: value })}
						allowClear={true}
					/>
					<SelectControl
						label={__('Icon Side', 'kadence-blocks')}
						value={iconSide}
						options={[
							{ value: 'right', label: __('Right', 'kadence-blocks') },
							{ value: 'left', label: __('Left', 'kadence-blocks') },
						]}
						onChange={(value) => setAttributes({ iconSide: value })}
					/>
					<ToggleControl
						label={__('Show only Icon', 'kadence-blocks')}
						checked={hideLabel}
						onChange={(value) => setAttributes({ hideLabel: value })}
					/>
					<TextControl
						label={__('Button Label Attribute for Accessibility', 'kadence-blocks')}
						value={ariaLabel}
						onChange={(value) => setAttributes({ ariaLabel: value })}
					/>
				</KadencePanelBody>
			</InspectorControls>
			<HtmlTagOut className={`kt-accordion-header-wrap`}>
				<div
					className={`kt-blocks-accordion-header kt-acccordion-button-label-${hideLabel ? 'hide' : 'show'}`}
					onClick={() => {
						setActivePane(!activePane);
					}}
				>
					<div className="kt-blocks-accordion-title-wrap">
						{icon && 'left' === iconSide && (
							<IconRender
								className={`kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`}
								name={icon}
							/>
						)}
						<RichText
							className="kt-blocks-accordion-title"
							tagName={'div'}
							placeholder={__('Add Title', 'kadence-blocks')}
							onChange={(value) => setAttributes({ title: value })}
							value={title}
							keepPlaceholderOnFocus
							onClick={(e) => {
								e.stopPropagation();
							}}
						/>
						{icon && 'right' === iconSide && (
							<IconRender
								className={`kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`}
								name={icon}
							/>
						)}
					</div>
					<div className="kt-blocks-accordion-icon-trigger"></div>
				</div>
			</HtmlTagOut>
			<div className={'kt-accordion-panel'}>
				<div {...innerBlocksProps}></div>
			</div>
		</div>
	);
}
export default PaneEdit;
