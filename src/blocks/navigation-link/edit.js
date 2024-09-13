/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
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
	ExternalLink,
	MenuItem,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { plusCircle, addSubmenu, plusCircleFilled } from '@wordpress/icons';
import { isKeyboardEvent, ENTER } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
	store as blockEditorStore,
	getColorClassName,
	useInnerBlocksProps,
	BlockSettingsMenuControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import { isURL, prependHTTP, safeDecodeURI, addQueryArgs } from '@wordpress/url';
import { useState, useEffect, useRef } from '@wordpress/element';
import { placeCaretAtHorizontalEdge, __unstableStripHTML as stripHTML } from '@wordpress/dom';
import { decodeEntities } from '@wordpress/html-entities';
import { store as coreStore } from '@wordpress/core-data';
import { useMergeRefs } from '@wordpress/compose';
import { last, map, get } from 'lodash';
import {
	getUniqueId,
	getPostOrFseId,
	typographyStyle,
	getSpacingOptionOutput,
	getBorderStyle,
	showSettings,
	getPreviewSize,
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
	ResponsiveBorderControl,
	KadenceIconPicker,
	MeasurementControls,
	ResponsiveMeasurementControls,
	IconRender,
	ResponsiveSelectControl,
	KadenceMediaPlaceholder,
	SelectPostFromPostType,
	KadenceWebfontLoader,
} from '@kadence/components';

import {
	ArrowDown,
	ArrowUp,
	rowIcon,
	twoColIcon,
	threeColIcon,
	twoRightGoldenIcon,
	navigationItemMega1Icon,
	navigationItemMega2Icon,
	navigationItemMega3Icon,
	navigationItemMega4Icon,
	navigationItemMega5Icon,
	navigationItemMega6Icon,
	navigationItemMega7Icon,
} from '@kadence/icons';

/**
 * Internal dependencies
 */
import { LinkUI } from './link-ui';
import { updateAttributes } from './update-attributes';

import metadata from './block.json';
import BackendStyles from './components/backend-styles';
import addNavLink from '../navigation/helpers/addNavLink';
import { buildTemplateFromSelection } from './helpers';

/**
 * Import Css
 */
import './editor.scss';

const DEFAULT_BLOCK = { name: 'kadence/navigation-link' };
const ALLOWED_MEDIA_TYPES = ['image'];

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

function correctPostType(postType) {
	if (postType === 'post') {
		return 'posts';
	} else if (postType === 'page') {
		return 'pages';
	}

	return postType;
}

export default function Edit(props) {
	const { attributes, isSelected, setAttributes, insertBlocksAfter, mergeBlocks, onReplace, context, clientId } =
		props;

	const {
		id,
		label,
		hideLabel,
		type,
		url,
		disableLink,
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
		highlightLabel,
		highlightSpacing,
		highlightSide,
		highlightSideMobile,
		highlightSideTablet,
		labelBackground,
		labelBackgroundHover,
		labelBackgroundActive,
		labelBackgroundTablet,
		labelBackgroundHoverTablet,
		labelBackgroundActiveTablet,
		labelBackgroundMobile,
		labelBackgroundHoverMobile,
		labelBackgroundActiveMobile,
		labelColor,
		labelColorHover,
		labelColorActive,
		labelColorTablet,
		labelColorHoverTablet,
		labelColorActiveTablet,
		labelColorMobile,
		labelColorHoverMobile,
		labelColorActiveMobile,
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
		linkColorTransparent,
		linkColorTransparentHover,
		linkColorTransparentActive,
		linkColorTransparentTablet,
		linkColorTransparentHoverTablet,
		linkColorTransparentActiveTablet,
		linkColorTransparentMobile,
		linkColorTransparentHoverMobile,
		linkColorTransparentActiveMobile,
		backgroundTransparent,
		backgroundTransparentHover,
		backgroundTransparentActive,
		backgroundTransparentTablet,
		backgroundTransparentHoverTablet,
		backgroundTransparentActiveTablet,
		backgroundTransparentMobile,
		backgroundTransparentHoverMobile,
		backgroundTransparentActiveMobile,
		linkColorSticky,
		linkColorStickyHover,
		linkColorStickyActive,
		linkColorStickyTablet,
		linkColorStickyHoverTablet,
		linkColorStickyActiveTablet,
		linkColorStickyMobile,
		linkColorStickyHoverMobile,
		linkColorStickyActiveMobile,
		backgroundSticky,
		backgroundStickyHover,
		backgroundStickyActive,
		backgroundStickyTablet,
		backgroundStickyHoverTablet,
		backgroundStickyActiveTablet,
		backgroundStickyMobile,
		backgroundStickyHoverMobile,
		backgroundStickyActiveMobile,
		megaMenuWidth,
		megaMenuCustomWidth,
		megaMenuCustomWidthUnit,
		typography,
		highlightTypography,
		dropdownTypography,
		descriptionTypography,
		mediaType,
		mediaAlign,
		mediaImage,
		imageRatio,
		mediaIcon,
		mediaStyle,
		highlightIcon,
		iconSide,
		iconSideTablet,
		iconSideMobile,
		align,
		dropdownShadow,
		kadenceDynamic,
	} = attributes;

	const [activeTab, setActiveTab] = useState('general');
	const [showSubMenus, setShowSubMenus] = useState(false);
	const [megaMenuOnboardingStep, setMegaMenuOnboardingStep] = useState('design');
	const [megaMenuColumnChoice, setMegaMenuColumnChoice] = useState('');
	const [activePreview, setActivePreview] = useState(false);

	const [isInvalid, isDraft] = useIsInvalidLink(kind, type, id);
	const { maxNestingLevel } = context;

	const isPostType = kind === 'post-type' || type === 'post' || type === 'page';
	const hasSyncedLink = isPostType && kind === 'post-type' && id && !disableLink;

	const { insertBlock, replaceInnerBlocks, __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
	const [isLinkOpen, setIsLinkOpen] = useState(false);
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const listItemRef = useRef(null);
	const ref = useRef();
	const subMenuRef = useRef();

	//See if this is the first Nav Item in the menu
	const hasNoBlockBefore = wp.data.select('core/block-editor').getPreviousBlockClientId(clientId) === null;

	// Change the label using inspector causes rich text to change focus on firefox.
	// This is a workaround to keep the focus on the label field when label filed is focused we don't render the rich text.
	const [isLabelFieldFocused, setIsLabelFieldFocused] = useState(false);

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData, parentBlockId, currentIndex, childSelected } =
		useSelect(
			(select) => {
				const parentBlocks = select('core/block-editor').getBlockParents(clientId);

				return {
					isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
					isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
					previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
					currentIndex: select('core/block-editor').getBlockIndex(clientId),
					parentBlockId: last(parentBlocks),
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
					childSelected: select('core/block-editor').hasSelectedInnerBlock(clientId, true),
				};
			},
			[clientId]
		);

	const previewMediaIconSize = getPreviewSize(
		previewDevice,
		undefined !== mediaIcon[0] && undefined !== mediaIcon[0].size ? mediaIcon[0].size : '20',
		undefined !== mediaIcon[0].tabletSize && undefined !== mediaIcon[0].tabletSize ? mediaIcon[0].tabletSize : '',
		undefined !== mediaIcon[0].mobileSize && undefined !== mediaIcon[0].mobileSize ? mediaIcon[0].mobileSize : ''
	);
	const previewMediaIconWidth =
		undefined !== mediaIcon[0] && undefined !== mediaIcon[0].width ? mediaIcon[0].width : '2';
	const previewHighlightIconSize = getPreviewSize(
		previewDevice,
		undefined !== highlightIcon[0] && undefined !== highlightIcon[0].size ? highlightIcon[0].size : '14',
		undefined !== highlightIcon[0].tabletSize && undefined !== highlightIcon[0].tabletSize
			? highlightIcon[0].tabletSize
			: '',
		undefined !== highlightIcon[0].mobileSize && undefined !== highlightIcon[0].mobileSize
			? highlightIcon[0].mobileSize
			: ''
	);
	const previewHighlightIconWidth =
		undefined !== highlightIcon[0] && undefined !== highlightIcon[0].width ? highlightIcon[0].width : '2';

	const hasHighlightLabel =
		(undefined !== highlightIcon?.[0]?.icon && '' !== highlightIcon[0].icon) ||
		(undefined !== highlightLabel && '' !== highlightLabel);

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

	//get the most up to date links for links with a post type and id (non custom)
	useEffect(() => {
		const postType = kind == 'post-type' ? correctPostType(type) : '';

		//only get the fields we need
		const args = { _fields: 'link' };

		if (hasSyncedLink && postType && id) {
			apiFetch({
				path: addQueryArgs(`/wp/v2/${postType}/${id}`, args),
			})
				.then((response) => {
					if (response && response.link && response.link !== url) {
						setAttributesDebug({ url: response.link });
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [type, id, kind]);

	//hasChildren is a proxy for isSubmenu
	const { isAtMaxNesting, isSubMenuChild, isTopLevelLink, isParentOfSelectedBlock, hasChildren, inMegaMenu } =
		useSelect(
			(select) => {
				const {
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
					isAtMaxNesting: navLinkParents.length >= maxNestingLevel,
					isSubMenuChild: navLinkParents.length > 0,
					isTopLevelLink: rootBlockName === 'core/navigation' || rootBlockName === 'kadence/navigation',
					isParentOfSelectedBlock: hasSelectedInnerBlock(clientId, true),
					hasChildren: !!getBlockCount(clientId),
					inMegaMenu: getBlockParentsByBlockName(clientId, 'kadence/navigation').length !== 1,
				};
			},
			[clientId]
		);

	const isMegaMenuOnboarding = isMegaMenu && !hasChildren;
	const megaMenuColumnOptions = [
		// { key: 'equal|1', name: __('Row', 'kadence-blocks'), icon: rowIcon },
		// { key: 'equal|2', name: __('Two: Equal', 'kadence-blocks'), icon: twoColIcon },
		{ key: 'equal|3', name: __('Three: Equal', 'kadence-blocks'), icon: threeColIcon },
		{
			key: 'right-golden|2',
			name: __('Two: Right Heavy 33/66', 'kadence-blocks'),
			icon: twoRightGoldenIcon,
		},
	];
	const megaMenuDesignOptions = [
		{ key: 'mega-1', name: __('3 Column Text CTA', 'kadence-blocks'), icon: navigationItemMega1Icon },
		{ key: 'mega-2', name: __('3 Column Image CTA', 'kadence-blocks'), icon: navigationItemMega2Icon },
		{ key: 'mega-3', name: __('Vertical Nav with Image Nav', 'kadence-blocks'), icon: navigationItemMega3Icon },
		{ key: 'mega-4', name: __('3 Colum Stacked Simple', 'kadence-blocks'), icon: navigationItemMega4Icon },
		{ key: 'mega-5', name: __('3 Column with Button CTA', 'kadence-blocks'), icon: navigationItemMega5Icon },
		{ key: 'mega-6', name: __('2 Column with Image CTA', 'kadence-blocks'), icon: navigationItemMega6Icon },
		{ key: 'mega-7', name: __('3 Column Stacked with Lower Nav', 'kadence-blocks'), icon: navigationItemMega7Icon },
	];

	/**
	 * Enable or disable the mega menu by changing the row layout and setting the attribute.
	 */
	function doMegaMenu(key) {
		//TODO put any existing submenus / items into the new mega menu
		if (key) {
			//main/normal temlpated mega menu construction
			const { templateInnerBlocks, templatePostMeta } = buildTemplateFromSelection(key);

			//for mega menus inner blocks should always just be a single rowlayout block.
			//so just insert the first inner block from the template
			if (templateInnerBlocks) {
				insertBlock(templateInnerBlocks[0], 0, clientId);
			}
		}
	}

	/**
	 * Enable or disable the mega menu by changing the row layout and setting the attribute.
	 */
	function doMegaMenuEnable(value) {
		if (value) {
			//enable
			replaceInnerBlocks(clientId, []);
			setAttributes({ isMegaMenu: true });
		} else {
			//disable
			replaceInnerBlocks(clientId, []);
			setAttributes({ isMegaMenu: false });
			setMegaMenuColumnChoice('');
			setMegaMenuOnboardingStep('design');
		}
	}

	/**
	 * Add a submenu item to this nav item.
	 * TODO if this is a mega menu, add the sub menu item inside the mega menu (row layout)
	 */
	function addSubMenuItem() {
		if (!isAtMaxNesting) {
			const newMenuItem = createBlock('kadence/navigation-link', {}, []);
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

	const megaMenuWidthClass = 'kb-menu-mega-width-' + (megaMenuWidth ? megaMenuWidth : 'full');
	const showSubMenusWithLogic = showSubMenus || isSelected || childSelected;

	const blockProps = useBlockProps({
		ref: useMergeRefs([setPopoverAnchor, listItemRef]),
		className: classnames('wp-block-kadence-navigation-item', 'menu-item', {
			'is-editing': isSelected || isParentOfSelectedBlock,
			'has-link': !!url,
			'has-child': hasChildren,
			'kb-menu-has-media': mediaType && mediaType != 'none',
			'menu-item-has-children': hasChildren,
			'menu-item--toggled-on': showSubMenusWithLogic,
			'current-menu-item': activePreview,
			'kadence-menu-mega-enabled': isMegaMenu,
			[`${megaMenuWidthClass}`]: isMegaMenu,
			'kb-menu-has-icon': mediaType == 'icon',
			'kb-menu-has-image': mediaType == 'image',
			'kb-menu-has-description': description,
			[`kb-nav-link-${uniqueID}`]: uniqueID,
		}),
		onKeyDown,
	});

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			...blockProps,
			className: classnames('remove-outline', {
				'sub-menu': hasChildren || isMegaMenuOnboarding,
				'show-sub-menus': showSubMenusWithLogic,
				'mega-menu': isMegaMenu,
			}),
		},
		{
			defaultBlock: DEFAULT_BLOCK,
			directInsert: true,
			renderAppender: false,
			template: isMegaMenu ? [['kadence/rowlayout']] : [],
			templateLock: isMegaMenu ? 'all' : false,
		}
	);

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

	const onSelectImage = (media) => {
		let url;
		let itemSize;
		if (mediaImage[0] && mediaImage[0].width && mediaImage[0].height) {
			const sizes = undefined !== media.sizes ? media.sizes : [];
			const imgSizes = Object.keys(sizes).map((item) => {
				return { slug: item, name: item };
			});
			map(imgSizes, ({ name, slug }) => {
				const type = get(media, ['mime_type']);
				if ('image/svg+xml' === type) {
					return null;
				}
				const sizeUrl = get(media, ['sizes', slug, 'url']);
				if (!sizeUrl) {
					return null;
				}
				const sizeWidth = get(media, ['sizes', slug, 'width']);
				if (!sizeWidth) {
					return null;
				}
				const sizeHeight = get(media, ['sizes', slug, 'height']);
				if (!sizeHeight) {
					return null;
				}
				if (sizeHeight === mediaImage[0].height && sizeWidth === mediaImage[0].width) {
					itemSize = slug;
					return null;
				}
			});
		}
		const size = itemSize && '' !== itemSize ? itemSize : 'full';
		if (size !== 'full') {
			url = get(media, ['sizes', size, 'url']) || get(media, ['media_details', 'sizes', size, 'source_url']);
		}
		const width =
			get(media, ['sizes', size, 'width']) ||
			get(media, ['media_details', 'sizes', size, 'width']) ||
			get(media, ['width']) ||
			get(media, ['media_details', 'width']);
		const height =
			get(media, ['sizes', size, 'height']) ||
			get(media, ['media_details', 'sizes', size, 'height']) ||
			get(media, ['height']) ||
			get(media, ['media_details', 'height']);
		const maxwidth = mediaImage[0] && mediaImage[0].maxWidth ? mediaImage[0].maxWidth : media.width;
		saveMediaImage({
			id: media.id,
			url: url || media.url,
			alt: media.alt,
			width,
			height,
			maxWidth: maxwidth ? maxwidth : 50,
			subtype: media.subtype,
		});
	};
	let hasRatio = false;
	if (imageRatio && 'inherit' !== imageRatio) {
		hasRatio = true;
	}
	let showImageToolbar = 'image' === mediaType && mediaImage[0].url ? true : false;
	if (
		showImageToolbar &&
		kadenceDynamic &&
		kadenceDynamic['mediaImage:0:url'] &&
		kadenceDynamic['mediaImage:0:url'].enable
	) {
		showImageToolbar = false;
	}

	const mediaContent = (
		<>
			{mediaType && 'none' !== mediaType && (
				<div className={'link-media-container '}>
					{!mediaImage[0].url && 'image' === mediaType && (
						<KadenceMediaPlaceholder
							labels={''}
							selectIcon={plusCircleFilled}
							selectLabel={__('Select Image', 'kadence-blocks')}
							onSelect={onSelectImage}
							accept="image/*"
							className={'kadence-image-upload'}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							disableMediaButtons={true}
						/>
					)}
					{mediaImage[0].url && 'image' === mediaType && (
						<div className="kadence-navigation-link-image-inner-intrinsic-container">
							<div
								className={`kadence-navigation-link-image-intrinsic kt-info-animate-${
									mediaImage[0].hoverAnimation
								}${'svg+xml' === mediaImage[0].subtype ? ' kb-navigation-link-image-type-svg' : ''}${
									hasRatio
										? ' kb-navigation-link-image-ratio kb-navigation-link-image-ratio-' + imageRatio
										: ''
								}`}
							>
								<div className="kadence-navigation-link-image-inner-intrinsic">
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
												? `kt-navigation-link-image wp-image-${mediaImage[0].id}`
												: 'kt-navigation-link-image wp-image-offsite'
										} ${
											mediaImage[0].subtype && 'svg+xml' === mediaImage[0].subtype
												? ' kt-navigation-link-svg-image'
												: ''
										}`}
									/>
									{mediaImage[0].flipUrl && 'flip' === mediaImage[0].hoverAnimation && (
										<img
											src={mediaImage[0].flipUrl}
											alt={mediaImage[0].flipAlt ? mediaImage[0].flipAlt : mediaImage[0].flipAlt}
											width={
												mediaImage[0].flipSubtype && 'svg+xml' === mediaImage[0].flipSubtype
													? mediaImage[0].maxWidth
													: mediaImage[0].flipWidth
											}
											height={mediaImage[0].flipHeight}
											className={`${
												mediaImage[0].flipId
													? `kt-navigation-link-image-flip wp-image-${mediaImage[0].flipId}`
													: 'kt-navigation-link-image-flip wp-image-offsite'
											} ${
												mediaImage[0].flipSubtype && 'svg+xml' === mediaImage[0].flipSubtype
													? ' kt-navigation-link-svg-image'
													: ''
											}`}
										/>
									)}
								</div>
							</div>
						</div>
					)}
					{'icon' === mediaType && (
						<>
							<IconRender
								className={`link-media-icon-wrap link-svg-icon link-svg-icon-${mediaIcon[0].icon}`}
								name={mediaIcon[0].icon}
								htmltag="span"
								size={previewMediaIconSize ? previewMediaIconSize : null}
								strokeWidth={
									'fe' === mediaIcon[0].icon.substring(0, 2) ? previewMediaIconWidth : undefined
								}
							/>
						</>
					)}
				</div>
			)}
		</>
	);

	if (!url || isInvalid || isDraft) {
		blockProps.onClick = () => setIsLinkOpen(true);
	}

	//pro feature
	const megaMenuToolbarControls = <></>;

	//pro feature
	const megaMenuControls = <></>;

	//pro feature
	const styleControls = (
		<>
			<KadencePanelBody>
				<div className="kb-pro-notice">
					<h2>{__('Link Styles', 'kadence-blocks')} </h2>
					<p>
						{__(
							'Make every item in your navigation unique and eye catching with Kadence Pro! Add to your overall navigation styles by setting styles for individual links.',
							'kadence-blocks'
						)}{' '}
					</p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>
			<KadencePanelBody
				title={__('Highlight Label', 'kadence-blocks')}
				initialOpen={false}
				panelName={'navigation-link-highlight-settings'}
				proTag={true}
			>
				<div className="kb-pro-notice">
					<h2>{__('Higlight Labels', 'kadence-blocks')} </h2>
					<p>
						{__(
							'Add colorful labels to your navigation items. Highlight new content, items on sale, and more! ',
							'kadence-blocks'
						)}{' '}
					</p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>

			<KadencePanelBody
				title={__('Icon', 'kadence-blocks')}
				initialOpen={false}
				panelName={'navigation-media-settings'}
				proTag={true}
			>
				<div className="kb-pro-notice">
					<h2>{__('Icons', 'kadence-blocks')} </h2>
					<p>
						{__(
							'Add icons to your navigation items. Help users find what they want quickly with clear visual icons on your navigation.',
							'kadence-blocks'
						)}{' '}
					</p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=navigation-link'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>
		</>
	);

	const classes = classnames('kb-nav-link-content', {
		'wp-block-kadence-navigation-link__placeholder': !url || isInvalid || isDraft,
		'has-highlight-label': hasHighlightLabel,
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
					excludedAttrs={['url', 'id', 'rel', 'kind', 'isMegaMenu', 'isTopLevelLink', 'label']}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				<ToolbarGroup>
					<ToolbarButton
						className="kb-icons-add-icon"
						icon={plusCircle}
						onClick={() => {
							addNavLink(parentBlockId, currentIndex + 1);
						}}
						label={__('Add Navigation Link', 'kadence-blocks')}
						showTooltip={true}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					{!isAtMaxNesting && !hasChildren && !isMegaMenu && (
						<ToolbarButton
							name="submenu"
							icon={addSubmenu}
							title={__('Add sub menu')}
							onClick={() => addSubMenuItem()}
						/>
					)}
				</ToolbarGroup>
				{applyFilters(
					'kadence.megaMenuToolbarControlsNavigationLink',
					megaMenuToolbarControls,
					props,
					doMegaMenuEnable,
					previewDevice
				)}

				<AlignmentToolbar
					value={align}
					onChange={(nextAlign) => {
						setAttributes({ align: nextAlign });
					}}
				/>
			</BlockControls>
			{isSelected && (
				<BlockSettingsMenuControls>
					{(props) => {
						const { selectedBlocks, onClose } = props;

						if (selectedBlocks.length === 1 && selectedBlocks[0] === 'kadence/navigation-link') {
							return (
								<MenuItem
									onClick={() => {
										addNavLink(parentBlockId, currentIndex + 1);
										onClose();
									}}
									label={__('Add Navigation Link', 'kadence-blocks')}
									role={null}
								>
									{__('Add Navigation Link', 'kadence-blocks')}
								</MenuItem>
							);
						}
					}}
				</BlockSettingsMenuControls>
			)}
			{/* Warning, this duplicated in packages/block-library/src/navigation-submenu/edit.js */}
			<BackendStyles
				{...props}
				previewDevice={previewDevice}
				currentRef={ref}
				subMenuRef={subMenuRef}
				showSubMenusWithLogic={showSubMenusWithLogic}
			/>
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
						<ToggleControl
							label={__('Hide Label', 'kadence-blocks')}
							checked={hideLabel}
							onChange={(value) => setAttributes({ hideLabel: value })}
						/>
						<TextControl
							__nextHasNoMarginBottom
							value={url ? url : ''}
							onChange={(value) => {
								setAttributes({ url: value });
							}}
							label={__('URL')}
							autoComplete="off"
							disabled={hasSyncedLink}
						/>
						{hasSyncedLink && (
							<Button
								variant="link"
								onClick={() => {
									setAttributes({ type: '', kind: 'custom' });
								}}
								className={'components-base-control kb-nav-link-edit-link-button'}
							>
								{__('Edit URL', 'kadence-blocks')}
							</Button>
						)}
						<ToggleControl
							label={__('Disable Link', 'kadence-blocks')}
							checked={disableLink}
							onChange={(value) => setAttributes({ disableLink: value })}
						/>

						{applyFilters(
							'kadence.megaMenuControlsNavigationLink',
							megaMenuControls,
							props,
							doMegaMenuEnable,
							isTopLevelLink,
							previewDevice,
							inMegaMenu
						)}
						<TextareaControl
							__nextHasNoMarginBottom
							value={description || ''}
							onChange={(descriptionValue) => {
								setAttributes({ description: descriptionValue });
							}}
							label={__('Description', 'kadence-blocks')}
							help={__('Supporting text for this item.', 'kadence-blocks')}
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
						{applyFilters(
							'kadence.styleControlsNavigationLink',
							styleControls,
							props,
							hasChildren,
							setActivePreview,
							activePreview
						)}
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-navigation-link-padding'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
								onChange={(value) => setAttributes({ padding: value })}
								tabletValue={tabletPadding}
								onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
								mobileValue={mobilePadding}
								onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
								min={
									paddingUnit === 'em' || paddingUnit === 'rem'
										? -25
										: paddingUnit === 'px'
										? -400
										: -100
								}
								max={
									paddingUnit === 'em' || paddingUnit === 'rem'
										? 25
										: paddingUnit === 'px'
										? 400
										: 100
								}
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
								min={
									marginUnit === 'em' || marginUnit === 'rem'
										? -25
										: marginUnit === 'px'
										? -400
										: -100
								}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : marginUnit === 'px' ? 400 : 100}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem']}
								onUnit={(value) => setAttributes({ marginUnit: value })}
							/>
						</KadencePanelBody>

						<KadencePanelBody panelName={'kb-navigation-link-sub-menus'}>
							{isTopLevelLink && hasChildren && (
								<ToggleControl
									label={
										isMegaMenu
											? __('Freeze Mega Menu Preview', 'kadence-blocks')
											: __('Freeze Sub Menu Preview', 'kadence-blocks')
									}
									checked={showSubMenus}
									onChange={(value) => setShowSubMenus(value)}
								/>
							)}
						</KadencePanelBody>

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

				<div class="kb-link-wrap">
					<a className={classes}>
						<span className="kb-nav-item-title-wrap">
							{/* eslint-enable */}
							{!hideLabel && (
								<>
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
														className="wp-block-navigation-item__label kb-nav-label-content"
														value={hideLabel ? '' : label}
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
														placeholder={__('Add label…')}
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
												<div className="wp-block-navigation-link__placeholder-text">
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
							{description && <span className="kb-nav-label-description">{description}</span>}
						</span>
						{hasHighlightLabel && (
							<span className="link-highlight-label">
								<span className="link-highlight-label-text">{highlightLabel}</span>
								{undefined !== highlightIcon?.[0]?.icon && '' !== highlightIcon[0].icon && (
									<IconRender
										className={`kt-highlight-label-icon`}
										name={highlightIcon[0].icon}
										size={previewHighlightIconSize ? previewHighlightIconSize : null}
										htmltag="span"
										strokeWidth={
											'fe' === highlightIcon[0].icon.substring(0, 2)
												? previewHighlightIconWidth
												: undefined
										}
									/>
								)}
							</span>
						)}
					</a>

					{hasChildren && (
						<button
							aria-label="Expand child menu"
							class="kb-nav-dropdown-toggle-btn"
							data-toggle-duration="10"
							data-toggle-target={`kb-nav-link-${uniqueID} .sub-menu`}
							aria-expanded="false"
						>
							<span class="screen-reader-text">Expand child menu</span>
							{ArrowDown}
						</button>
					)}
				</div>
				<ul {...innerBlocksProps} ref={subMenuRef}>
					{!isMegaMenuOnboarding && children}
					{isMegaMenuOnboarding && (
						<div className="kt-select-layout">
							{megaMenuOnboardingStep == '' && (
								<>
									<div className="kt-select-layout-title">
										{__('Select Your Columns', 'kadence-blocks')}
									</div>
									<ButtonGroup aria-label={__('Column Layout', 'kadence-blocks')}>
										{map(megaMenuColumnOptions, ({ name, key, icon }) => (
											<Button
												key={key}
												className="kt-layout-btn"
												isSmall
												label={name}
												icon={icon}
												onClick={() => {
													setMegaMenuColumnChoice(key);
													setMegaMenuOnboardingStep('design');
												}}
											/>
										))}
									</ButtonGroup>
									<Button className="kt-prebuilt" onClick={() => doMegaMenu('mega-blank')}>
										{__('Skip', 'kadence-blocks')}
									</Button>
									{/* <Button className="kt-prebuilt" onClick={() => setAttributes({ isPrebuiltModal: true })}>
										{__('Design Library', 'kadence-blocks')}
									</Button> */}
								</>
							)}
							{megaMenuOnboardingStep == 'design' && (
								<>
									<div className="kt-select-layout-title">
										{__('Select Your Content', 'kadence-blocks')}
									</div>
									<ButtonGroup aria-label={__('Content Layout', 'kadence-blocks')}>
										{map(megaMenuDesignOptions, ({ name, key, icon }) => (
											<Button
												key={key}
												className="kt-layout-btn"
												isSmall
												label={name}
												icon={icon}
												onClick={() => {
													doMegaMenu(key);
												}}
											/>
										))}
									</ButtonGroup>
									<Button className="kt-prebuilt" onClick={() => doMegaMenu('simple|1')}>
										{__('Skip', 'kadence-blocks')}
									</Button>
									{/* <Button className="kt-prebuilt" onClick={() => setAttributes({ isPrebuiltModal: true })}>
										{__('Design Library', 'kadence-blocks')}
									</Button> */}
								</>
							)}
						</div>
					)}
				</ul>
			</li>

			{typography?.[0]?.google && (
				<KadenceWebfontLoader typography={typography} clientId={clientId} id={'typography'} />
			)}
			{highlightTypography?.[0]?.google && (
				<KadenceWebfontLoader typography={highlightTypography} clientId={clientId} id={'highlightTypography'} />
			)}
			{dropdownTypography?.[0]?.google && (
				<KadenceWebfontLoader typography={dropdownTypography} clientId={clientId} id={'dropdownTypography'} />
			)}
			{descriptionTypography?.[0]?.google && (
				<KadenceWebfontLoader
					typography={descriptionTypography}
					clientId={clientId}
					id={'descriptionTypography'}
				/>
			)}
		</>
	);
}
