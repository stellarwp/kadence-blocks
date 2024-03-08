/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToolbarButton,
	Tooltip,
	ToolbarGroup,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { displayShortcut, isKeyboardEvent, ENTER } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
	store as blockEditorStore,
	getColorClassName,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { isURL, prependHTTP, safeDecodeURI } from '@wordpress/url';
import { useState, useEffect, useRef } from '@wordpress/element';
import { placeCaretAtHorizontalEdge, __unstableStripHTML as stripHTML } from '@wordpress/dom';
import { decodeEntities } from '@wordpress/html-entities';
import { link as linkIcon, addSubmenu } from '@wordpress/icons';
import { store as coreStore } from '@wordpress/core-data';
import { useMergeRefs } from '@wordpress/compose';

import {
	getUniqueId,
	getPostOrFseId,
	typographyStyle,
	getSpacingOptionOutput,
	getBorderStyle,
	showSettings,
	getPreviewSize,
	KadenceColorOutput,
	getGapSizeOptionOutput,
} from '@kadence/helpers';

import {
	KadencePanelBody,
	KadenceRadioButtons,
	InspectorControlTabs,
	ResponsiveMeasureRangeControl,
	CopyPasteAttributes,
	SelectParentBlock,
	ResponsiveRangeControls,
	ResponsiveGapSizeControl,
	ButtonStyleControls,
	ResponsiveAlignControls,
	PopColorControl,
	GradientControl,
	BackgroundTypeControl,
	HoverToggleControl,
	KadenceBlockDefaults,
	RangeControl,
} from '@kadence/components';

import { ArrowDown, ArrowUp } from '@kadence/icons';

/**
 * Internal dependencies
 */
import { LinkUI } from './link-ui';
import { updateAttributes } from './update-attributes';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

const DEFAULT_BLOCK = { name: 'kadence/navigation-link' };

/**
 * A React hook to determine if it's dragging within the target element.
 *
 * @typedef {import('@wordpress/element').RefObject} RefObject
 *
 * @param {RefObject<HTMLElement>} elementRef The target elementRef object.
 *
 * @return {boolean} Is dragging within the target element.
 */
const useIsDraggingWithin = (elementRef) => {
	const [isDraggingWithin, setIsDraggingWithin] = useState(false);

	useEffect(() => {
		const { ownerDocument } = elementRef.current;

		function handleDragStart(event) {
			// Check the first time when the dragging starts.
			handleDragEnter(event);
		}

		// Set to false whenever the user cancel the drag event by either releasing the mouse or press Escape.
		function handleDragEnd() {
			setIsDraggingWithin(false);
		}

		function handleDragEnter(event) {
			// Check if the current target is inside the item element.
			if (elementRef.current.contains(event.target)) {
				setIsDraggingWithin(true);
			} else {
				setIsDraggingWithin(false);
			}
		}

		// Bind these events to the document to catch all drag events.
		// Ideally, we can also use `event.relatedTarget`, but sadly that
		// doesn't work in Safari.
		ownerDocument.addEventListener('dragstart', handleDragStart);
		ownerDocument.addEventListener('dragend', handleDragEnd);
		ownerDocument.addEventListener('dragenter', handleDragEnter);

		return () => {
			ownerDocument.removeEventListener('dragstart', handleDragStart);
			ownerDocument.removeEventListener('dragend', handleDragEnd);
			ownerDocument.removeEventListener('dragenter', handleDragEnter);
		};
	}, []);

	return isDraggingWithin;
};

const useIsInvalidLink = (kind, type, id) => {
	const isPostType = kind === 'post-type' || type === 'post' || type === 'page';
	const hasId = Number.isInteger(id);
	const postStatus = useSelect(
		(select) => {
			if (!isPostType) {
				return null;
			}
			const { getEntityRecord } = select(coreStore);
			return getEntityRecord('postType', type, id)?.status;
		},
		[isPostType, type, id]
	);

	// Check Navigation Link validity if:
	// 1. Link is 'post-type'.
	// 2. It has an id.
	// 3. It's neither null, nor undefined, as valid items might be either of those while loading.
	// If those conditions are met, check if
	// 1. The post status is published.
	// 2. The Navigation Link item has no label.
	// If either of those is true, invalidate.
	const isInvalid = isPostType && hasId && postStatus && 'trash' === postStatus;
	const isDraft = 'draft' === postStatus;

	return [isInvalid, isDraft];
};

function getMissingText(type) {
	let missingText = '';

	switch (type) {
		case 'post':
			/* translators: label for missing post in navigation link block */
			missingText = __('Select post');
			break;
		case 'page':
			/* translators: label for missing page in navigation link block */
			missingText = __('Select page');
			break;
		case 'category':
			/* translators: label for missing category in navigation link block */
			missingText = __('Select category');
			break;
		case 'tag':
			/* translators: label for missing tag in navigation link block */
			missingText = __('Select tag');
			break;
		default:
			/* translators: label for missing values in navigation link block */
			missingText = __('Add link');
	}

	return missingText;
}

export default function Edit(props) {
	const { attributes, isSelected, setAttributes, insertBlocksAfter, mergeBlocks, onReplace, context, clientId } =
		props;

	const {
		id,
		label,
		type,
		url,
		description,
		rel,
		title,
		kind,
		isMegaMenu,
		uniqueID,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		margin,
		tabletMargin,
		mobileMargin,
		marginUnit,
		color,
		background,
		gradient,
		backgroundType,
		colorHover,
		backgroundHover,
		gradientHover,
		backgroundHoverType,
		megaMenuWidth,
		megaMenuCustomWidth,
	} = attributes;

	const [activeTab, setActiveTab] = useState('general');
	const [showSubMenus, setShowSubMenus] = useState(false);

	const [isInvalid, isDraft] = useIsInvalidLink(kind, type, id);
	const { maxNestingLevel } = context;

	const { insertBlock, replaceInnerBlocks, __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
	const [isLinkOpen, setIsLinkOpen] = useState(false);
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const listItemRef = useRef(null);
	const isDraggingWithin = useIsDraggingWithin(listItemRef);
	const itemLabelPlaceholder = __('Add label…');
	const ref = useRef();

	//See if this is the first Nav Item in the menu
	const hasNoBlockBefore = wp.data.select('core/block-editor').getPreviousBlockClientId(clientId) === null;

	// Change the label using inspector causes rich text to change focus on firefox.
	// This is a workaround to keep the focus on the label field when label filed is focused we don't render the rich text.
	const [isLabelFieldFocused, setIsLabelFieldFocused] = useState(false);

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor').getCurrentPostId(),
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
	}, []);

	//hasChildren is a proxy for isSubmenu
	const { innerBlocks, isAtMaxNesting, isSubMenuChild, isTopLevelLink, isParentOfSelectedBlock, hasChildren } =
		useSelect(
			(select) => {
				const {
					getBlocks,
					getBlockCount,
					getBlockName,
					getBlockRootClientId,
					hasSelectedInnerBlock,
					getBlockParentsByBlockName,
				} = select(blockEditorStore);

				const rootBlockName = getBlockName(getBlockRootClientId(clientId));
				const navLinkParents = getBlockParentsByBlockName(clientId, [
					'kadence/navigation-link',
					'core/navigation-submenu',
				]);

				return {
					innerBlocks: getBlocks(clientId),
					isAtMaxNesting: navLinkParents.length >= maxNestingLevel,
					isSubMenuChild: navLinkParents.length > 0,
					isTopLevelLink: rootBlockName === 'core/navigation' || rootBlockName === 'kadence/navigation',
					isParentOfSelectedBlock: hasSelectedInnerBlock(clientId, true),
					hasChildren: !!getBlockCount(clientId),
				};
			},
			[clientId]
		);

	/**
	 * Enable or disable the mega menu by changing the row layout and setting the attribute.
	 */
	function doMegaMenu(value) {
		if (value) {
			//enable
			//TODO put any existing submenus / items into the new mega menu
			const newMegaMenu = createBlock('kadence/rowlayout', [], []);
			insertBlock(newMegaMenu, 0, clientId);
			setAttributes({ isMegaMenu: true });
			setShowSubMenus(true);
		} else {
			//disable
			replaceInnerBlocks(clientId, []);
			setAttributes({ isMegaMenu: false });
		}
	}

	/**
	 * Add a submenu item to this nav item.
	 * TODO if this is a mega menu, add the sub menu item inside the mega menu (row layout)
	 */
	function addSubMenuItem() {
		if (!isAtMaxNesting) {
			const newMenuItem = createBlock('kadence/navigation-link', [], []);
			insertBlock(newMenuItem, 0, clientId);
		}
	}

	useEffect(() => {
		// Show the LinkControl on mount if the URL is empty
		// ( When adding a new menu item)
		// This can't be done in the useState call because it conflicts
		// with the autofocus behavior of the BlockListBlock component.
		if (!url) {
			setIsLinkOpen(true);
		}
	}, [url]);

	//Disabling for now, but this could be something where we automatically do some processing if the user adds a row layout manually.
	// useEffect(() => {
	// 	// If block has inner blocks, transform to Submenu.
	// 	if (hasChildren) {
	// 		// This side-effect should not create an undo level as those should
	// 		// only be created via user interactions.
	// 		__unstableMarkNextChangeAsNotPersistent();
	// 		enableMegaMenu();
	// 	}
	// }, [hasChildren]);

	/**
	 * The hook shouldn't be necessary but due to a focus loss happening
	 * when selecting a suggestion in the link popover, we force close on block unselection.
	 */
	useEffect(() => {
		if (!isSelected) {
			setIsLinkOpen(false);
		}
	}, [isSelected]);

	// If the LinkControl popover is open and the URL has changed, close the LinkControl and focus the label text.
	useEffect(() => {
		if (isLinkOpen && url) {
			// Does this look like a URL and have something TLD-ish?
			if (isURL(prependHTTP(label)) && /^.+\.[a-z]+/.test(label)) {
				// Focus and select the label text.
				selectLabelText();
			} else {
				// Focus it (but do not select).
				placeCaretAtHorizontalEdge(ref.current, true);
			}
		}
	}, [url]);

	/**
	 * Focus the Link label text and select it.
	 */
	function selectLabelText() {
		ref.current.focus();
		const { ownerDocument } = ref.current;
		const { defaultView } = ownerDocument;
		const selection = defaultView.getSelection();
		const range = ownerDocument.createRange();
		// Get the range of the current ref contents so we can add this range to the selection.
		range.selectNodeContents(ref.current);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	/**
	 * Removes the current link if set.
	 */
	function removeLink() {
		// Reset all attributes that comprise the link.
		// It is critical that all attributes are reset
		// to their default values otherwise this may
		// in advertently trigger side effects because
		// the values will have "changed".
		setAttributes({
			url: undefined,
			label: undefined,
			id: undefined,
			kind: undefined,
			type: undefined,
			opensInNewTab: false,
		});

		// Close the link editing UI.
		setIsLinkOpen(false);
	}

	function onKeyDown(event) {
		if (isKeyboardEvent.primary(event, 'k') || ((!url || isDraft || isInvalid) && event.keyCode === ENTER)) {
			setIsLinkOpen(true);
		}
	}

	const blockProps = useBlockProps({
		ref: useMergeRefs([setPopoverAnchor, listItemRef]),
		className: classnames(
			'wp-block-kadence-navigation-item',
			'menu-item',
			'kadence-menu-mega-width-' + (megaMenuWidth ? megaMenuWidth : 'container'),
			{
				'is-editing': isSelected || isParentOfSelectedBlock,
				'is-dragging-within': isDraggingWithin,
				'has-link': !!url,
				'has-child': hasChildren,
				'menu-item-has-children': hasChildren,
				'menu-item--toggled-on': showSubMenus,
				'current-menu-item': hasNoBlockBefore,
				'kadence-menu-mega-enabled': isMegaMenu,
				[`wp-block-kadence-navigation-link${uniqueID}`]: uniqueID,
			}
		),
		onKeyDown,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			...blockProps,
			className: classnames('remove-outline', {
				'sub-menu': hasChildren,
				'show-sub-menus': showSubMenus,
			}),
		},
		{
			defaultBlock: DEFAULT_BLOCK,
			directInsert: true,
			renderAppender: false,
			template: isMegaMenu ? ['kadence/rowlayout'] : [],
			templateLock: isMegaMenu ? 'all' : false,
		}
	);

	if (!url || isInvalid || isDraft) {
		blockProps.onClick = () => setIsLinkOpen(true);
	}

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin?.[0] ? margin[0] : '',
		undefined !== tabletMargin?.[0] ? tabletMargin[0] : '',
		undefined !== mobileMargin?.[0] ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin?.[1] ? margin[1] : '',
		undefined !== tabletMargin?.[1] ? tabletMargin[1] : '',
		undefined !== mobileMargin?.[1] ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin?.[2] ? margin[2] : '',
		undefined !== tabletMargin?.[2] ? tabletMargin[2] : '',
		undefined !== mobileMargin?.[2] ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin?.[3] ? margin[3] : '',
		undefined !== tabletMargin?.[3] ? tabletMargin[3] : '',
		undefined !== mobileMargin?.[3] ? mobileMargin[3] : ''
	);
	const previewMarginUnit = marginUnit ? marginUnit : 'px';

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding?.[0] ? padding[0] : '',
		undefined !== tabletPadding?.[0] ? tabletPadding[0] : '',
		undefined !== mobilePadding?.[0] ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding?.[1] ? padding[1] : '',
		undefined !== tabletPadding?.[1] ? tabletPadding[1] : '',
		undefined !== mobilePadding?.[1] ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding?.[2] ? padding[2] : '',
		undefined !== tabletPadding?.[2] ? tabletPadding[2] : '',
		undefined !== mobilePadding?.[2] ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding?.[3] ? padding[3] : '',
		undefined !== tabletPadding?.[3] ? tabletPadding[3] : '',
		undefined !== mobilePadding?.[3] ? mobilePadding[3] : ''
	);

	const classes = classnames('wp-block-navigation-item__content', {
		'wp-block-navigation-link__placeholder': !url || isInvalid || isDraft,
	});

	const missingText = getMissingText(type);
	/* translators: Whether the navigation link is Invalid or a Draft. */
	const placeholderText = `(${isInvalid ? __('Invalid') : __('Draft')})`;
	const tooltipText =
		isInvalid || isDraft ? __('This item has been deleted, or is a draft') : __('This item is missing a link');

	const linkCSS = (
		<style>
			{`.wp-block-kadence-navigation-link${uniqueID} {`}
			{color ? 'color:' + KadenceColorOutput(color) + ';' : ''}
			{backgroundType === 'gradient'
				? gradient
					? 'background:' + gradient + ';'
					: ''
				: background
				? 'background:' + KadenceColorOutput(background) + ';'
				: ''}
			{'}'}
			{`.wp-block-kadence-navigation-link${uniqueID}:hover {`}
			{colorHover ? 'color:' + KadenceColorOutput(colorHover) + ';' : ''}
			{backgroundHoverType === 'gradient'
				? gradientHover
					? 'background:' + gradientHover + ';'
					: ''
				: backgroundHover
				? 'background:' + KadenceColorOutput(backgroundHover) + ';'
				: ''}
			{'}'}
		</style>
	);

	return (
		<>
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={[]}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				<ToolbarGroup>
					{!isAtMaxNesting && !hasChildren && (
						<ToolbarButton
							name="submenu"
							icon={addSubmenu}
							title={__('Add sub menu')}
							onClick={() => addSubMenuItem()}
						/>
					)}
				</ToolbarGroup>
				<ToolbarGroup>
					{isTopLevelLink && (
						<ToolbarButton
							name="megamenu"
							icon={addSubmenu}
							title={isMegaMenu ? __('Disable mega menu') : __('Add mega menu')}
							onClick={() => doMegaMenu(!isMegaMenu)}
							isPressed={isMegaMenu}
						/>
					)}
				</ToolbarGroup>
			</BlockControls>
			{/* Warning, this duplicated in packages/block-library/src/navigation-submenu/edit.js */}
			<InspectorControls>
				<SelectParentBlock
					label={__('View Navigation Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/navigation'}
				/>
				<InspectorControlTabs
					panelName={'navigation-link'}
					initialOpen={'general'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>
				{activeTab === 'general' && (
					<KadencePanelBody panelName={'navigation-link-general'}>
						{isTopLevelLink && (
							<ToggleControl
								label={__('Mega Menu', 'kadence-blocks')}
								checked={isMegaMenu}
								onChange={(value) => doMegaMenu(value)}
							/>
						)}
						{isMegaMenu && (
							<SelectControl
								label={__('Mega Menu Width', 'kadence-blocks')}
								value={megaMenuWidth}
								options={[
									{ value: 'container', label: __('Menu Container Width', 'kadence-blocks') },
									{ value: 'content', label: __('Content', 'kadence-blocks') },
									{ value: 'full', label: __('Full Width', 'kadence-blocks') },
									{ value: 'custom', label: __('Custom Width', 'kadence-blocks') },
								]}
								onChange={(value) => setAttributes({ megaMenuWidth: value })}
							/>
						)}
						{isMegaMenu && megaMenuWidth == 'custom' && (
							<RangeControl
								label={__('Mega Menu Custom Width', 'kadence-blocks')}
								value={megaMenuCustomWidth}
								onChange={(value) => setAttributes({ megaMenuCustomWidth: value })}
								min={120}
								max={800}
								units={['px']}
								unit={'px'}
								showUnit={true}
							/>
						)}
						{isTopLevelLink && hasChildren && (
							<ToggleControl
								label={__('Show Sub Menus', 'kadence-blocks')}
								checked={showSubMenus}
								onChange={(value) => setShowSubMenus(value)}
							/>
						)}
						<TextControl
							__nextHasNoMarginBottom
							value={label ? stripHTML(label) : ''}
							onChange={(labelValue) => {
								setAttributes({ label: labelValue });
							}}
							label={__('Label')}
							autoComplete="off"
							onFocus={() => setIsLabelFieldFocused(true)}
							onBlur={() => setIsLabelFieldFocused(false)}
						/>
						<TextControl
							__nextHasNoMarginBottom
							value={url ? safeDecodeURI(url) : ''}
							onChange={(urlValue) => {
								updateAttributes({ url: urlValue }, setAttributes, attributes);
							}}
							label={__('URL')}
							autoComplete="off"
						/>
						<TextareaControl
							__nextHasNoMarginBottom
							value={description || ''}
							onChange={(descriptionValue) => {
								setAttributes({ description: descriptionValue });
							}}
							label={__('Description')}
							help={__('The description will be displayed in the menu if the current theme supports it.')}
						/>
						<TextControl
							__nextHasNoMarginBottom
							value={title || ''}
							onChange={(titleValue) => {
								setAttributes({ title: titleValue });
							}}
							label={__('Title attribute')}
							autoComplete="off"
							help={__('Additional information to help clarify the purpose of the link.')}
						/>
						<TextControl
							__nextHasNoMarginBottom
							value={rel || ''}
							onChange={(relValue) => {
								setAttributes({ rel: relValue });
							}}
							label={__('Rel attribute')}
							autoComplete="off"
							help={__('The relationship of the linked URL as space-separated link types.')}
						/>
					</KadencePanelBody>
				)}

				{activeTab === 'style' && (
					<>
						<KadencePanelBody panelName={'navigation-link-style-settings'}>
							<HoverToggleControl
								hover={
									<>
										<PopColorControl
											label={__('Hover Color', 'kadence-blocks')}
											value={colorHover ? colorHover : ''}
											default={''}
											onChange={(value) => setAttributes({ colorHover: value })}
										/>
										<BackgroundTypeControl
											label={__('Hover Type', 'kadence-blocks')}
											type={backgroundHoverType ? backgroundHoverType : 'normal'}
											onChange={(value) => setAttributes({ backgroundHoverType: value })}
											allowedTypes={['normal', 'gradient']}
										/>
										{'gradient' === backgroundHoverType && (
											<GradientControl
												value={gradientHover}
												onChange={(value) => setAttributes({ gradientHover: value })}
												gradients={[]}
											/>
										)}
										{'gradient' !== backgroundHoverType && (
											<>
												<PopColorControl
													label={__('Background Color', 'kadence-blocks')}
													value={backgroundHover ? backgroundHover : ''}
													default={''}
													onChange={(value) => setAttributes({ backgroundHover: value })}
												/>
											</>
										)}
									</>
								}
								normal={
									<>
										<PopColorControl
											label={__('Color', 'kadence-blocks')}
											value={color ? color : ''}
											default={''}
											onChange={(value) => setAttributes({ color: value })}
										/>
										<BackgroundTypeControl
											label={__('Type', 'kadence-blocks')}
											type={backgroundType ? backgroundType : 'normal'}
											onChange={(value) => setAttributes({ backgroundType: value })}
											allowedTypes={['normal', 'gradient']}
										/>
										{'gradient' === backgroundType && (
											<GradientControl
												value={gradient}
												onChange={(value) => setAttributes({ gradient: value })}
												gradients={[]}
											/>
										)}
										{'gradient' !== backgroundType && (
											<>
												<PopColorControl
													label={__('Background Color', 'kadence-blocks')}
													value={background ? background : ''}
													default={''}
													onChange={(value) => setAttributes({ background: value })}
												/>
											</>
										)}
									</>
								}
							/>
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<ResponsiveMeasureRangeControl
							label={__('Padding', 'kadence-blocks')}
							value={padding}
							onChange={(value) => setAttributes({ padding: value })}
							tabletValue={tabletPadding}
							onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
							mobileValue={mobilePadding}
							onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
							min={paddingUnit === 'em' || paddingUnit === 'rem' ? -25 : -400}
							max={paddingUnit === 'em' || paddingUnit === 'rem' ? 25 : 400}
							step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
							unit={paddingUnit}
							units={['px', 'em', 'rem']}
							onUnit={(value) => setAttributes({ paddingUnit: value })}
						/>
						<ResponsiveMeasureRangeControl
							label={__('Margin', 'kadence-blocks')}
							value={margin}
							onChange={(value) => setAttributes({ margin: value })}
							tabletValue={tabletMargin}
							onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
							mobileValue={mobileMargin}
							onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
							min={marginUnit === 'em' || marginUnit === 'rem' ? -25 : -400}
							max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : 400}
							step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
							unit={marginUnit}
							units={['px', 'em', 'rem']}
							onUnit={(value) => setAttributes({ marginUnit: value })}
						/>

						<div className="kt-sidebar-settings-spacer"></div>

						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
						/>
					</>
				)}
				{/* <PanelBody title={__('Settings')}>

				</PanelBody> */}
			</InspectorControls>
			<li {...blockProps}>
				{/* eslint-disable jsx-a11y/anchor-is-valid */}

				{linkCSS}

				<div class="link-drop-wrap">
					<a
						className={classes}
						style={{
							marginTop:
								undefined !== previewMarginTop && '' !== previewMarginTop
									? getSpacingOptionOutput(previewMarginTop, previewMarginUnit)
									: undefined,
							marginRight:
								undefined !== previewMarginRight && '' !== previewMarginRight
									? getSpacingOptionOutput(previewMarginRight, previewMarginUnit)
									: undefined,
							marginBottom:
								undefined !== previewMarginBottom && '' !== previewMarginBottom
									? getSpacingOptionOutput(previewMarginBottom, previewMarginUnit)
									: undefined,
							marginLeft:
								undefined !== previewMarginLeft && '' !== previewMarginLeft
									? getSpacingOptionOutput(previewMarginLeft, previewMarginUnit)
									: undefined,

							paddingTop:
								undefined !== previewPaddingTop && '' !== previewPaddingTop
									? getSpacingOptionOutput(previewPaddingTop, paddingUnit)
									: undefined,
							paddingRight:
								undefined !== previewPaddingRight && '' !== previewPaddingRight
									? getSpacingOptionOutput(previewPaddingRight, paddingUnit)
									: undefined,
							paddingBottom:
								undefined !== previewPaddingBottom && '' !== previewPaddingBottom
									? getSpacingOptionOutput(previewPaddingBottom, paddingUnit)
									: undefined,
							paddingLeft:
								undefined !== previewPaddingLeft && '' !== previewPaddingLeft
									? getSpacingOptionOutput(previewPaddingLeft, paddingUnit)
									: undefined,
						}}
					>
						{/* eslint-enable */}
						{!url ? (
							<div className="wp-block-navigation-link__placeholder-text">
								<Tooltip text={tooltipText}>
									<span>{missingText}</span>
								</Tooltip>
							</div>
						) : (
							<>
								{!isInvalid && !isDraft && !isLabelFieldFocused && (
									<>
										<RichText
											ref={ref}
											identifier="label"
											className="wp-block-navigation-item__label"
											value={label}
											onChange={(labelValue) =>
												setAttributes({
													label: labelValue,
												})
											}
											onMerge={mergeBlocks}
											onReplace={onReplace}
											__unstableOnSplitAtEnd={() =>
												insertBlocksAfter(createBlock('kadence/navigation-link'))
											}
											aria-label={__('Navigation link text')}
											placeholder={itemLabelPlaceholder}
											withoutInteractiveFormatting
											allowedFormats={[
												'core/bold',
												'core/italic',
												'core/image',
												'core/strikethrough',
											]}
											onClick={() => {
												if (!url) {
													setIsLinkOpen(true);
												}
											}}
										/>
										{description && (
											<span className="wp-block-navigation-item__description">{description}</span>
										)}
									</>
								)}
								{(isInvalid || isDraft || isLabelFieldFocused) && (
									<div className="wp-block-navigation-link__placeholder-text wp-block-navigation-link__label">
										<Tooltip text={tooltipText}>
											<span aria-label={__('Navigation link text')}>
												{
													// Some attributes are stored in an escaped form. It's a legacy issue.
													// Ideally they would be stored in a raw, unescaped form.
													// Unescape is used here to "recover" the escaped characters
													// so they display without encoding.
													// See `updateAttributes` for more details.
													`${decodeEntities(label)} ${
														isInvalid || isDraft ? placeholderText : ''
													}`.trim()
												}
											</span>
										</Tooltip>
									</div>
								)}
							</>
						)}
						{isLinkOpen && (
							<LinkUI
								clientId={clientId}
								link={attributes}
								onClose={() => setIsLinkOpen(false)}
								anchor={popoverAnchor}
								onRemove={removeLink}
								onChange={(updatedValue) => {
									updateAttributes(updatedValue, setAttributes, attributes);
								}}
							/>
						)}
					</a>

					{hasChildren && (
						<button
							aria-label="Expand child menu"
							class="dropdown-nav-toggle drawer-sub-toggle"
							data-toggle-duration="10"
							data-toggle-target={`wp-block-kadence-navigation-link${uniqueID} .sub-menu`}
							aria-expanded="false"
						>
							<span class="screen-reader-text">Expand child menu</span>
							{ArrowDown}
						</button>
					)}
				</div>
				<ul {...innerBlocksProps} />
			</li>
		</>
	);
}
