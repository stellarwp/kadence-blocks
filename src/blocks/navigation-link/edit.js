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
	TabPanel,
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
	SmallResponsiveControl,
	TypographyControls,
	ResponsiveSingleBorderControl,
	KadenceIconPicker,
	MeasurementControls,
	IconRender,
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
import BackendStyles from './components/backend-styles';

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
		linkColor,
		linkColorHover,
		linkColorActive,
		linkColorTablet,
		linkColorHoverTablet,
		linkColorActiveTablet,
		linkColorMobile,
		linkColorHoverMobile,
		linkColorActiveMobile,
		background,
		backgroundHover,
		backgroundActive,
		backgroundTablet,
		backgroundHoverTablet,
		backgroundActiveTablet,
		backgroundMobile,
		backgroundHoverMobile,
		backgroundActiveMobile,
		linkColorDropdown,
		linkColorDropdownHover,
		linkColorDropdownActive,
		linkColorDropdownTablet,
		linkColorDropdownHoverTablet,
		linkColorDropdownActiveTablet,
		linkColorDropdownMobile,
		linkColorDropdownHoverMobile,
		linkColorDropdownActiveMobile,
		backgroundDropdown,
		backgroundDropdownHover,
		backgroundDropdownActive,
		backgroundDropdownTablet,
		backgroundDropdownHoverTablet,
		backgroundDropdownActiveTablet,
		backgroundDropdownMobile,
		backgroundDropdownHoverMobile,
		backgroundDropdownActiveMobile,
		megaMenuWidth,
		megaMenuCustomWidth,
		megaMenuCustomWidthUnit,
		typography,
		dropdownTypography,
		dropdownDivider,
		dropdownDividerTablet,
		dropdownDividerMobile,
		dropdownWidth,
		dropdownWidthTablet,
		dropdownWidthMobile,
		dropdownWidthUnit,
		dropdownVerticalSpacing,
		dropdownVerticalSpacingTablet,
		dropdownVerticalSpacingMobile,
		dropdownVerticalSpacingUnit,
		dropdownShadow,
		mediaType,
		mediaAlign,
		mediaImage,
		mediaIcon,
		mediaStyle,
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

	const previewMediaIconSize = getPreviewSize(
		previewDevice,
		undefined !== mediaIcon[0] && undefined !== mediaIcon[0].size ? mediaIcon[0].size : '14',
		undefined !== mediaIcon[0].tabletSize && undefined !== mediaIcon[0].tabletSize ? mediaIcon[0].tabletSize : '',
		undefined !== mediaIcon[0].mobileSize && undefined !== mediaIcon[0].mobileSize ? mediaIcon[0].mobileSize : ''
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

	const saveTypography = (value) => {
		const newUpdate = typography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({ typography: newUpdate });
	};

	const saveDropdownTypography = (value) => {
		const newUpdate = typography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({ dropdownTypography: newUpdate });
	};
	const saveMediaImage = (value) => {
		const newUpdate = mediaImage.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			mediaImage: newUpdate,
		});
	};
	const saveMediaIcon = (value) => {
		const newUpdate = mediaIcon.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			mediaIcon: newUpdate,
		});
	};
	const saveMediaStyle = (value) => {
		const newUpdate = mediaStyle.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			mediaStyle: newUpdate,
		});
	};

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

	const megaMenuWidthClass = 'kadence-menu-mega-width-' + (megaMenuWidth ? megaMenuWidth : 'container');

	const blockProps = useBlockProps({
		ref: useMergeRefs([setPopoverAnchor, listItemRef]),
		className: classnames('wp-block-kadence-navigation-item', 'menu-item', {
			'is-editing': isSelected || isParentOfSelectedBlock,
			'is-dragging-within': isDraggingWithin,
			'has-link': !!url,
			'has-child': hasChildren,
			'has-media': mediaType && mediaType != 'none',
			'menu-item-has-children': hasChildren,
			'menu-item--toggled-on': showSubMenus,
			'current-menu-item': hasNoBlockBefore,
			'kadence-menu-mega-enabled': isMegaMenu,
			[`${megaMenuWidthClass}`]: isMegaMenu,
			'kadence-menu-has-icon': mediaType == 'icon',
			'kadence-menu-has-description': description,
			[`wp-block-kadence-navigation-link${uniqueID}`]: uniqueID,
		}),
		onKeyDown,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			...blockProps,
			className: classnames('remove-outline', {
				'sub-menu': hasChildren,
				'show-sub-menus': showSubMenus,
				'mega-menu': isMegaMenu,
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

	const styleColorControls = (size = '', suffix = '') => {
		const linkColorValue = attributes['linkColor' + suffix + size];
		const backgroundValue = attributes['background' + suffix + size];
		const linkColorHoverValue = attributes['linkColor' + suffix + 'Hover' + size];
		const backgroundHoverValue = attributes['background' + suffix + 'Hover' + size];
		const linkColorActiveValue = attributes['linkColor' + suffix + 'Active' + size];
		const backgroundActiveValue = attributes['background' + suffix + 'Active' + size];
		return (
			<>
				<HoverToggleControl
					normal={
						<>
							<PopColorControl
								label={__('Link Color', 'kadence-blocks')}
								value={linkColorValue}
								default={''}
								onChange={(value) => setAttributes({ ['linkColor' + suffix + size]: value })}
								key={'normal'}
							/>
							<PopColorControl
								label={__('Background', 'kadence-blocks')}
								value={backgroundValue}
								default={''}
								onChange={(value) => setAttributes({ ['background' + suffix + size]: value })}
								key={'normalb'}
							/>
						</>
					}
					hover={
						<>
							<PopColorControl
								label={__('Link Color Hover', 'kadence-blocks')}
								value={linkColorHoverValue}
								default={''}
								onChange={(value) => setAttributes({ ['linkColor' + suffix + 'Hover' + size]: value })}
								key={'hover'}
							/>
							<PopColorControl
								label={__('Background Hover', 'kadence-blocks')}
								value={backgroundHoverValue}
								default={''}
								onChange={(value) => setAttributes({ ['background' + suffix + 'Hover' + size]: value })}
								key={'hoverb'}
							/>
						</>
					}
					active={
						<>
							<PopColorControl
								label={__('Link Color Active', 'kadence-blocks')}
								value={linkColorActiveValue}
								default={''}
								onChange={(value) => setAttributes({ ['linkColor' + suffix + 'Active' + size]: value })}
								key={'active'}
							/>
							<PopColorControl
								label={__('Background Active', 'kadence-blocks')}
								value={backgroundActiveValue}
								default={''}
								onChange={(value) =>
									setAttributes({ ['background' + suffix + 'Active' + size]: value })
								}
								key={'activeb'}
							/>
						</>
					}
				/>
			</>
		);
	};
	const mediaSettingsControls = (size = '', suffix = '') => {
		const mediaAlignValue = attributes['mediaAlign' + suffix + size];
		return (
			<>
				<SelectControl
					value={mediaAlignValue}
					options={[
						{ value: 'right', label: __('Right', 'kadence-blocks') },
						{ value: 'left', label: __('Left', 'kadence-blocks') },
						// { value: 'top', label: __('Top', 'kadence-blocks') },
					]}
					onChange={(value) => setAttributes({ ['mediaAlign' + suffix + size]: value })}
				/>
			</>
		);
	};
	const iconColorControls = (size = '', suffix = '') => {
		const colorValue = attributes.mediaStyle[0]['color' + suffix + size];
		const colorHoverValue = attributes.mediaStyle[0]['colorHover' + suffix + size];
		const colorActiveValue = attributes.mediaStyle[0]['colorActive' + suffix + size];
		const backgroundValue = attributes.mediaStyle[0]['background' + suffix + size];
		const backgroundHoverValue = attributes.mediaStyle[0]['backgroundHover' + suffix + size];
		const backgroundActiveValue = attributes.mediaStyle[0]['backgroundActive' + suffix + size];
		return (
			<>
				<HoverToggleControl
					normal={
						<>
							<PopColorControl
								label={__('Color', 'kadence-blocks')}
								value={colorValue}
								default={''}
								onChange={(value) => saveMediaStyle({ ['color' + suffix + size]: value })}
								key={'normal'}
							/>
							<PopColorControl
								label={__('Background', 'kadence-blocks')}
								value={backgroundValue}
								default={''}
								onChange={(value) => saveMediaStyle({ ['background' + suffix + size]: value })}
								key={'normalb'}
							/>
						</>
					}
					hover={
						<>
							<PopColorControl
								label={__('Hover Color', 'kadence-blocks')}
								value={colorHoverValue}
								default={''}
								onChange={(value) => saveMediaStyle({ ['colorHover' + suffix + size]: value })}
								key={'hover'}
							/>
							<PopColorControl
								label={__('Hover Background', 'kadence-blocks')}
								value={backgroundHoverValue}
								default={''}
								onChange={(value) => saveMediaStyle({ ['backgroundHover' + suffix + size]: value })}
								key={'hoverb'}
							/>
						</>
					}
					active={
						<>
							<PopColorControl
								label={__('Active Color', 'kadence-blocks')}
								value={colorActiveValue}
								default={''}
								onChange={(value) => saveMediaStyle({ ['colorActive' + suffix + size]: value })}
								key={'active'}
							/>
							<PopColorControl
								label={__('Active Background', 'kadence-blocks')}
								value={backgroundActiveValue}
								default={''}
								onChange={(value) => saveMediaStyle({ ['backgroundActive' + suffix + size]: value })}
								key={'activeb'}
							/>
						</>
					}
				/>
			</>
		);
	};

	const mediaContent = (
		<>
			{mediaType && 'none' !== mediaType && (
				<div className={'link-media-container'}>
					{/* {!mediaImage[0].url && 'image' === mediaType && (
						<>
							<Fragment>
								<KadenceMediaPlaceholder
									labels={''}
									selectIcon={plusCircleFilled}
									selectLabel={__('Select Image', 'kadence-blocks')}
									onSelect={onSelectImage}
									accept="image/*"
									className={'kadence-image-upload'}
									allowedTypes={ALLOWED_MEDIA_TYPES}
									disableMediaButtons={false}
								/>
							</Fragment>

							<div
								className="link-image-inner-intrisic-container"
								style={{
									maxWidth: mediaImage[0].maxWidth + 'px',
								}}
							>
								<div
									className={`link-image-intrisic link-animate-${mediaImage[0].hoverAnimation}${
										'svg+xml' === mediaImage[0].subtype ? ' link-image-type-svg' : ''
									}${hasRatio ? ' link-image-ratio link-image-ratio-' + imageRatio : ''}`}
									style={{
										paddingBottom: imageRatioPadding,
										height: imageRatioHeight,
										width: isNaN(mediaImage[0].width) ? undefined : mediaImage[0].width + 'px',
										maxWidth: '100%',
									}}
								>
									<div className="link-image-inner-intrisic">
										<img
											src={mediaImage[0].url}
											alt={mediaImage[0].alt ? mediaImage[0].alt : mediaImage[0].alt}
											width={
												mediaImage[0].subtype && 'svg+xml' === mediaImage[0].subtype
													? mediaImage[0].maxWidth
													: mediaImage[0].width
											}
											height={mediaImage[0].height}
											className={`${
												mediaImage[0].id
													? `link-image wp-image-${mediaImage[0].id}`
													: 'link-image wp-image-offsite'
											} ${
												mediaImage[0].subtype && 'svg+xml' === mediaImage[0].subtype
													? ' link-svg-image'
													: ''
											}`}
										/>
										{mediaImage[0].flipUrl && 'flip' === mediaImage[0].hoverAnimation && (
											<img
												src={mediaImage[0].flipUrl}
												alt={
													mediaImage[0].flipAlt
														? mediaImage[0].flipAlt
														: mediaImage[0].flipAlt
												}
												width={
													mediaImage[0].flipSubtype && 'svg+xml' === mediaImage[0].flipSubtype
														? mediaImage[0].maxWidth
														: mediaImage[0].flipWidth
												}
												height={mediaImage[0].flipHeight}
												className={`${
													mediaImage[0].flipId
														? `link-image-flip wp-image-${mediaImage[0].flipId}`
														: 'link-image-flip wp-image-offsite'
												} ${
													mediaImage[0].flipSubtype && 'svg+xml' === mediaImage[0].flipSubtype
														? ' link-svg-image'
														: ''
												}`}
											/>
										)}
									</div>
								</div>
							</div>
						</>
					)} */}
					{'icon' === mediaType && (
						<>
							<IconRender
								className={`link-svg-icon link-svg-icon-${mediaIcon[0].icon}`}
								name={mediaIcon[0].icon}
								htmltag="span"
							/>
							{mediaIcon[0].flipIcon && 'flip' === mediaIcon[0].hoverAnimation && (
								<IconRender
									className={`link-svg-icon-flip link-svg-icon-${mediaIcon[0].flipIcon}`}
									name={mediaIcon[0].flipIcon}
									htmltag="span"
								/>
							)}
						</>
					)}
				</div>
			)}
		</>
	);

	if (!url || isInvalid || isDraft) {
		blockProps.onClick = () => setIsLinkOpen(true);
	}

	const classes = classnames('wp-block-kadence-navigation-link__content', {
		'wp-block-kadence-navigation-link__placeholder': !url || isInvalid || isDraft,
	});

	const missingText = getMissingText(type);
	/* translators: Whether the navigation link is Invalid or a Draft. */
	const placeholderText = `(${isInvalid ? __('Invalid') : __('Draft')})`;
	const tooltipText =
		isInvalid || isDraft ? __('This item has been deleted, or is a draft') : __('This item is missing a link');

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
			<BackendStyles {...props} previewDevice={previewDevice} currentRef={ref} />
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
								onUnit={(value) => setAttributes({ megaMenuCustomWidthUnit: value })}
								min={120}
								max={800}
								units={['px', 'em', 'rem', '%']}
								unit={megaMenuCustomWidthUnit}
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
							label={__('Description', 'kadence-blocks')}
							help={__('Hidden by default. This can be shown in the style settings.', 'kadence-blocks')}
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
							<SmallResponsiveControl
								label={'Colors'}
								desktopChildren={styleColorControls()}
								tabletChildren={styleColorControls('Tablet')}
								mobileChildren={styleColorControls('Mobile')}
							></SmallResponsiveControl>
						</KadencePanelBody>

						{showSettings('fontSettings', 'kadence/navigation') && (
							<KadencePanelBody
								title={__('Typography Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-btn-font-family'}
							>
								<TypographyControls
									fontSize={typography[0].size}
									onFontSize={(value) => saveTypography({ size: value })}
									fontSizeType={typography[0].sizeType}
									onFontSizeType={(value) => saveTypography({ sizeType: value })}
									lineHeight={typography[0].lineHeight}
									onLineHeight={(value) => saveTypography({ lineHeight: value })}
									lineHeightType={typography[0].lineType}
									onLineHeightType={(value) => saveTypography({ lineType: value })}
									reLetterSpacing={typography[0].letterSpacing}
									onLetterSpacing={(value) => saveTypography({ letterSpacing: value })}
									letterSpacingType={typography[0].letterType}
									onLetterSpacingType={(value) => saveTypography({ letterType: value })}
									textTransform={typography[0].textTransform}
									onTextTransform={(value) => saveTypography({ textTransform: value })}
									fontFamily={typography[0].family}
									onFontFamily={(value) => saveTypography({ family: value })}
									onFontChange={(select) => {
										saveTypography({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveTypography(values)}
									googleFont={typography[0].google}
									onGoogleFont={(value) => saveTypography({ google: value })}
									loadGoogleFont={typography[0].loadGoogle}
									onLoadGoogleFont={(value) => saveTypography({ loadGoogle: value })}
									fontVariant={typography[0].variant}
									onFontVariant={(value) => saveTypography({ variant: value })}
									fontWeight={typography[0].weight}
									onFontWeight={(value) => saveTypography({ weight: value })}
									fontStyle={typography[0].style}
									onFontStyle={(value) => saveTypography({ style: value })}
									fontSubset={typography[0].subset}
									onFontSubset={(value) => saveTypography({ subset: value })}
								/>
							</KadencePanelBody>
						)}

						<KadencePanelBody
							title={__('Sub Menu Styles', 'kadence-blocks')}
							panelName={'kb-navigation-style-sub-menus'}
							initialOpen={false}
						>
							<ResponsiveRangeControls
								label={__('Dropdown Vertical Spacing', 'kadence-blocks')}
								value={parseFloat(dropdownVerticalSpacing)}
								valueTablet={parseFloat(dropdownVerticalSpacingTablet)}
								valueMobile={parseFloat(dropdownVerticalSpacingMobile)}
								onChange={(value) => setAttributes({ dropdownVerticalSpacing: value.toString() })}
								onChangeTablet={(value) =>
									setAttributes({ dropdownVerticalSpacingTablet: value.toString() })
								}
								onChangeMobile={(value) =>
									setAttributes({ dropdownVerticalSpacingMobile: value.toString() })
								}
								min={0}
								max={
									dropdownVerticalSpacingUnit === 'em' || dropdownVerticalSpacingUnit === 'rem'
										? 24
										: 200
								}
								step={
									dropdownVerticalSpacingUnit === 'em' || dropdownVerticalSpacingUnit === 'rem'
										? 0.1
										: 1
								}
								unit={dropdownVerticalSpacingUnit}
								units={['em', 'rem', 'px', 'vw']}
								onUnit={(value) => setAttributes({ dropdownVerticalSpacingUnit: value })}
								showUnit={true}
							/>
							<ResponsiveSingleBorderControl
								label={'Divider'}
								value={dropdownDivider}
								tabletValue={dropdownDividerTablet}
								mobileValue={dropdownDividerMobile}
								onChange={(value) => setAttributes({ dropdownDivider: value })}
								onChangeTablet={(value) => setAttributes({ dropdownDividerTablet: value })}
								onChangeMobile={(value) => setAttributes({ dropdownDividerMobile: value })}
							/>
							<SmallResponsiveControl
								label={'Colors'}
								desktopChildren={styleColorControls('', 'Dropdown')}
								tabletChildren={styleColorControls('Tablet', 'Dropdown')}
								mobileChildren={styleColorControls('Mobile', 'Dropdown')}
							></SmallResponsiveControl>

							{showSettings('fontSettings', 'kadence/navigation') && (
								<KadencePanelBody
									title={__('Typography Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-adv-btn-font-family'}
								>
									<TypographyControls
										fontSize={dropdownTypography[0].size}
										onFontSize={(value) => saveDropdownTypography({ size: value })}
										fontSizeType={dropdownTypography[0].sizeType}
										onFontSizeType={(value) => saveDropdownTypography({ sizeType: value })}
										lineHeight={dropdownTypography[0].lineHeight}
										onLineHeight={(value) => saveDropdownTypography({ lineHeight: value })}
										lineHeightType={dropdownTypography[0].lineType}
										onLineHeightType={(value) => saveDropdownTypography({ lineType: value })}
										reLetterSpacing={dropdownTypography[0].letterSpacing}
										onLetterSpacing={(value) => saveDropdownTypography({ letterSpacing: value })}
										letterSpacingType={dropdownTypography[0].letterType}
										onLetterSpacingType={(value) => saveDropdownTypography({ letterType: value })}
										textTransform={dropdownTypography[0].textTransform}
										onTextTransform={(value) => saveDropdownTypography({ textTransform: value })}
										fontFamily={dropdownTypography[0].family}
										onFontFamily={(value) => saveDropdownTypography({ family: value })}
										onFontChange={(select) => {
											saveDropdownTypography({
												family: select.value,
												google: select.google,
											});
										}}
										onFontArrayChange={(values) => saveDropdownTypography(values)}
										googleFont={dropdownTypography[0].google}
										onGoogleFont={(value) => saveDropdownTypography({ google: value })}
										loadGoogleFont={dropdownTypography[0].loadGoogle}
										onLoadGoogleFont={(value) => saveDropdownTypography({ loadGoogle: value })}
										fontVariant={dropdownTypography[0].variant}
										onFontVariant={(value) => saveDropdownTypography({ variant: value })}
										fontWeight={dropdownTypography[0].weight}
										onFontWeight={(value) => saveDropdownTypography({ weight: value })}
										fontStyle={dropdownTypography[0].style}
										onFontStyle={(value) => saveDropdownTypography({ style: value })}
										fontSubset={dropdownTypography[0].subset}
										onFontSubset={(value) => saveDropdownTypography({ subset: value })}
									/>
								</KadencePanelBody>
							)}
						</KadencePanelBody>

						{showSettings('mediaSettings', 'kadence/infobox') && (
							<KadencePanelBody
								title={__('Media Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-info-media-settings'}
							>
								<SelectControl
									label={__('Media Type', 'kadence-blocks')}
									value={mediaType}
									options={[
										{ value: 'none', label: __('None', 'kadence-blocks') },
										{ value: 'icon', label: __('Icon', 'kadence-blocks') },
										//{ value: 'image', label: __('Image', 'kadence-blocks') },
									]}
									onChange={(value) => setAttributes({ mediaType: value })}
								/>
								{mediaType && 'none' !== mediaType && (
									<>
										<SmallResponsiveControl
											label={__('Media Align', 'kadence-blocks')}
											desktopChildren={mediaSettingsControls()}
											tabletChildren={mediaSettingsControls('Tablet')}
											mobileChildren={mediaSettingsControls('Mobile')}
										/>
									</>
								)}
								{/* {'image' === mediaType && (
									<>
										<KadenceImageControl
											label={__('Image', 'kadence-blocks')}
											hasImage={mediaImage && mediaImage[0] && mediaImage[0].url ? true : false}
											imageURL={
												mediaImage && mediaImage[0] && mediaImage[0].url
													? mediaImage[0].url
													: ''
											}
											imageID={
												mediaImage && mediaImage[0] && mediaImage[0].id ? mediaImage[0].id : ''
											}
											onRemoveImage={clearImage}
											onSaveImage={onSelectImage}
											disableMediaButtons={mediaImage[0].url ? true : false}
											dynamicAttribute="mediaImage:0:url"
											isSelected={isSelected}
											attributes={attributes}
											setAttributes={setAttributes}
											name={name}
											clientId={clientId}
											context={context}
										/>
										{mediaImage[0].id && 'svg+xml' !== mediaImage[0].subtype && (
											<ImageSizeControl
												label={__('Image File Size', 'kadence-blocks')}
												id={mediaImage[0].id}
												url={mediaImage[0].url}
												onChange={changeImageSize}
											/>
										)}
										<RangeControl
											label={__('Max Image Width', 'kadence-blocks')}
											value={mediaImage[0].maxWidth}
											onChange={(value) => saveMediaImage({ maxWidth: value })}
											min={5}
											max={800}
											step={1}
										/>
										<div className="components-base-control">
											<TextareaControl
												label={__('Alt text', 'kadence-blocks')}
												value={
													mediaImage && mediaImage[0] && mediaImage[0].alt
														? mediaImage[0].alt
														: ''
												}
												onChange={(value) => saveMediaImage({ alt: value })}
												className={'mb-0'}
											/>
											<Button
												text={__("Use as this image's default alt text", 'kadence-blocks')}
												variant={'link'}
												onClick={() => {
													updateMediaImageAlt(
														mediaImage && mediaImage[0] && mediaImage[0].alt
															? mediaImage[0].alt
															: '',
														mediaImage[0].id
													);
												}}
												disabled={isEmpty(mediaImageRecord)}
											/>
										</div>
										<SelectControl
											label={__('Image ratio', 'kadence-blocks')}
											options={[
												{
													label: __('Inherit', 'kadence-blocks'),
													value: 'inherit',
												},
												{
													label: __('Landscape 4:3', 'kadence-blocks'),
													value: 'land43',
												},
												{
													label: __('Landscape 3:2', 'kadence-blocks'),
													value: 'land32',
												},
												{
													label: __('Landscape 16:9', 'kadence-blocks'),
													value: 'land169',
												},
												{
													label: __('Landscape 2:1', 'kadence-blocks'),
													value: 'land21',
												},
												{
													label: __('Landscape 3:1', 'kadence-blocks'),
													value: 'land31',
												},
												{
													label: __('Landscape 4:1', 'kadence-blocks'),
													value: 'land41',
												},
												{
													label: __('Portrait 3:4', 'kadence-blocks'),
													value: 'port34',
												},
												{
													label: __('Portrait 2:3', 'kadence-blocks'),
													value: 'port23',
												},
												{
													label: __('Square 1:1', 'kadence-blocks'),
													value: 'square',
												},
											]}
											value={imageRatio}
											onChange={(value) => setAttributes({ imageRatio: value })}
										/>
										<SelectControl
											label={__('Image Hover Animation', 'kadence-blocks')}
											value={mediaImage[0].hoverAnimation}
											options={[
												{ value: 'none', label: __('None', 'kadence-blocks') },
												{
													value: 'grayscale',
													label: __('Grayscale to Color', 'kadence-blocks'),
												},
												{
													value: 'drawborder',
													label: __('Border Spin In', 'kadence-blocks'),
												},
												{
													value: 'grayscale-border-draw',
													label: __('Grayscale to Color & Border Spin In', 'kadence-blocks'),
												},
												{
													value: 'flip',
													label: __('Flip to Another Image', 'kadence-blocks'),
												},
											]}
											onChange={(value) => saveMediaImage({ hoverAnimation: value })}
										/>
										{'flip' === mediaImage[0].hoverAnimation && (
											<>
												<h2>
													{__('Flip Image (Use same size as start image', 'kadence-blocks')}
												</h2>
												<KadenceImageControl
													label={__('Image', 'kadence-blocks')}
													hasImage={
														mediaImage && mediaImage[0] && mediaImage[0].flipUrl
															? true
															: false
													}
													imageURL={
														mediaImage && mediaImage[0] && mediaImage[0].flipUrl
															? mediaImage[0].flipUrl
															: ''
													}
													imageID={
														mediaImage && mediaImage[0] && mediaImage[0].flipId
															? mediaImage[0].flipId
															: ''
													}
													onRemoveImage={clearFlipImage}
													onSaveImage={onSelectFlipImage}
													disableMediaButtons={
														mediaImage && mediaImage[0] && mediaImage[0].flipUrl
															? true
															: false
													}
													setAttributes={setAttributes}
													{...attributes}
												/>
												{mediaImage[0].flipId && 'svg+xml' !== mediaImage[0].flipSubtype && (
													<ImageSizeControl
														label={__('Image File Size', 'kadence-blocks')}
														id={mediaImage[0].flipId}
														url={mediaImage[0].flipUrl}
														onChange={changeFlipImageSize}
													/>
												)}
												<div className="components-base-control">
													<TextareaControl
														label={__('Alt text', 'kadence-blocks')}
														value={
															mediaImage && mediaImage[0] && mediaImage[0].flipAlt
																? mediaImage[0].flipAlt
																: ''
														}
														onChange={(value) => saveMediaImage({ flipAlt: value })}
														className={'mb-0'}
													/>
													<Button
														text={__(
															"Use as this image's default alt text",
															'kadence-blocks'
														)}
														variant={'link'}
														onClick={() => {
															updateMediaImageAlt(
																mediaImage && mediaImage[0] && mediaImage[0].flipAlt
																	? mediaImage[0].flipAlt
																	: '',
																mediaImage[0].flipId
															);
														}}
														disabled={isEmpty(mediaImageFlipRecord)}
													/>
												</div>
											</>
										)}
										<MeasurementControls
											label={__('Image Border', 'kadence-blocks')}
											measurement={mediaStyle[0].borderWidth}
											onChange={(value) => saveMediaStyle({ borderWidth: value })}
											min={0}
											max={40}
											step={1}
										/>
										<RangeControl
											label={__('Image Border Radius (px)', 'kadence-blocks')}
											value={mediaStyle[0].borderRadius}
											onChange={(value) => saveMediaStyle({ borderRadius: value })}
											step={1}
											min={0}
											max={200}
										/>
										<TabPanel
											className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={[
												{
													name: 'normal',
													title: __('Normal', 'kadence-blocks'),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __('Hover', 'kadence-blocks'),
													className: 'kt-hover-tab',
												},
											]}
										>
											{(tab) => {
												let tabout;
												if (tab.name) {
													if ('hover' === tab.name) {
														tabout = (
															<>
																{mediaImage[0].subtype &&
																	'svg+xml' === mediaImage[0].subtype && (
																		<>
																			<PopColorControl
																				label={__(
																					'SVG Hover Color',
																					'kadence-blocks'
																				)}
																				value={
																					mediaIcon[0].colorHover
																						? mediaIcon[0].colorHover
																						: '#444444'
																				}
																				default={'#444444'}
																				onChange={(value) =>
																					saveMediaIcon({
																						colorHover: value,
																					})
																				}
																			/>
																			<small>
																				{__(
																					'*you must force inline svg for this to have effect.',
																					'kadence-blocks'
																				)}
																			</small>
																		</>
																	)}
																<PopColorControl
																	label={__(
																		'Image Hover Background',
																		'kadence-blocks'
																	)}
																	value={
																		mediaStyle[0].backgroundHover
																			? mediaStyle[0].backgroundHover
																			: ''
																	}
																	default={'transparent'}
																	onChange={(value) =>
																		saveMediaStyle({ backgroundHover: value })
																	}
																/>
																<PopColorControl
																	label={__('Image Hover Border', 'kadence-blocks')}
																	value={
																		mediaStyle[0].hoverBorder
																			? mediaStyle[0].hoverBorder
																			: '#444444'
																	}
																	default={'#444444'}
																	onChange={(value) =>
																		saveMediaStyle({ hoverBorder: value })
																	}
																/>
															</>
														);
													} else {
														tabout = (
															<>
																{mediaImage[0].subtype &&
																	'svg+xml' === mediaImage[0].subtype && (
																		<>
																			<PopColorControl
																				label={__(
																					'SVG Color',
																					'kadence-blocks'
																				)}
																				value={
																					mediaIcon[0].color
																						? mediaIcon[0].color
																						: '#444444'
																				}
																				default={'#444444'}
																				onChange={(value) =>
																					saveMediaIcon({ color: value })
																				}
																			/>
																			<small>
																				{__(
																					'*you must force inline svg for this to have effect.',
																					'kadence-blocks'
																				)}
																			</small>
																		</>
																	)}
																<PopColorControl
																	label={__('Image Background', 'kadence-blocks')}
																	value={
																		mediaStyle[0].background
																			? mediaStyle[0].background
																			: ''
																	}
																	default={'transparent'}
																	onChange={(value) =>
																		saveMediaStyle({ background: value })
																	}
																/>
																<PopColorControl
																	label={__('Image Border', 'kadence-blocks')}
																	value={
																		mediaStyle[0].border
																			? mediaStyle[0].border
																			: '#444444'
																	}
																	default={'#444444'}
																	onChange={(value) =>
																		saveMediaStyle({ border: value })
																	}
																/>
															</>
														);
													}
												}
												return (
													<div className={tab.className} key={tab.className}>
														{tabout}
													</div>
												);
											}}
										</TabPanel>
									</>
								)} */}
								{'icon' === mediaType && (
									<>
										<KadenceIconPicker
											value={mediaIcon[0].icon}
											onChange={(value) => saveMediaIcon({ icon: value })}
										/>
										<SmallResponsiveControl
											label={__('Colors', 'kadence-blocks')}
											desktopChildren={iconColorControls()}
											tabletChildren={iconColorControls('Tablet')}
											mobileChildren={iconColorControls('Mobile')}
										/>
										<ResponsiveRangeControls
											label={__('Icon Size', 'kadence-blocks')}
											value={mediaIcon[0].size}
											tabletValue={mediaIcon[0].sizeTablet ? mediaIcon[0].sizeTablet : ''}
											mobileValue={mediaIcon[0].sizeMobile ? mediaIcon[0].sizeMobile : ''}
											onChange={(value) => saveMediaIcon({ size: value })}
											onChangeTablet={(value) => saveMediaIcon({ sizeTablet: value })}
											onChangeMobile={(value) => saveMediaIcon({ sizeMobile: value })}
											units={['px']}
											unit={'px'}
											min={5}
											max={250}
											step={1}
										/>
										{mediaIcon[0].icon && 'fe' === mediaIcon[0].icon.substring(0, 2) && (
											<ResponsiveRangeControls
												label={__('Icon Line Width', 'kadence-blocks')}
												value={mediaIcon[0].width}
												valueTablet={mediaIcon[0].widthTablet}
												valueMobile={mediaIcon[0].widthMobile}
												onChange={(value) => saveMediaIcon({ width: value })}
												onChangeTablet={(value) => saveMediaIcon({ widthTablet: value })}
												onChangeMobile={(value) => saveMediaIcon({ widthMobile: value })}
												step={0.5}
												min={0.5}
												max={4}
											/>
										)}
										<ResponsiveRangeControls
											label={__('Icon Border Radius', 'kadence-blocks')}
											value={mediaStyle[0].borderRadius}
											valueTablet={mediaStyle[0].borderRadiusTablet}
											valueMobile={mediaStyle[0].borderRadiusMobile}
											onChange={(value) => saveMediaStyle({ borderRadius: value })}
											onChangeTablet={(value) => saveMediaStyle({ borderRadiusTablet: value })}
											onChangeMobile={(value) => saveMediaStyle({ borderRadiusMobile: value })}
											units={['px']}
											unit={'px'}
											step={1}
											min={0}
											max={200}
										/>
										<ResponsiveRangeControls
											label={__('Media Spacing', 'kadence-blocks')}
											value={mediaStyle[0].margin[0]}
											valueTablet={mediaStyle[0].marginTablet[0]}
											valueMobile={mediaStyle[0].marginMobile[0]}
											onChange={(value) => saveMediaStyle({ margin: [value, '', '', ''] })}
											onChangeTablet={(value) =>
												saveMediaStyle({ marginTablet: [value, '', '', ''] })
											}
											onChangeMobile={(value) =>
												saveMediaStyle({ marginMobile: [value, '', '', ''] })
											}
											units={['px']}
											unit={'px'}
											step={1}
											min={0}
											max={100}
										/>
										<ResponsiveMeasureRangeControl
											label={__('Media Padding', 'kadence-blocks')}
											value={mediaStyle[0].padding}
											onChange={(value) => saveMediaStyle({ padding: value })}
											tabletValue={mediaStyle[0].paddingTablet}
											onChangeTablet={(value) => saveMediaStyle({ tabletPadding: value })}
											mobileValue={mediaStyle[0].paddingMobile}
											onChangeMobile={(value) => saveMediaStyle({ mobilePadding: value })}
											min={0}
											max={200}
											step={1}
											units={['px']}
											unit={'px'}
										/>
										<TextControl
											label={__('Title for screen readers', 'kadence-blocks')}
											help={__(
												'If no title added screen readers will ignore, good if the icon is purely decorative.',
												'kadence-blocks'
											)}
											value={mediaIcon[0].title}
											onChange={(value) => saveMediaIcon({ title: value })}
										/>
									</>
								)}
							</KadencePanelBody>
						)}
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

				<div class="link-drop-wrap">
					<a className={classes}>
						<span className="link-drop-title-wrap">
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
							{mediaContent}
							{description && <span className="menu-label-description">{description}</span>}
							{hasChildren && <span className="title-dropdown-navigation-toggle">{ArrowDown}</span>}
						</span>
					</a>

					{hasChildren && (
						<button
							aria-label="Expand child menu"
							class="dropdown-navigation-toggle vertical-sub-toggle"
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
