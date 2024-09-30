/**
 * BLOCK: Kadence Advanced Navigation
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, isEqual } from 'lodash';
import { addQueryArgs } from '@wordpress/url';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { formBlockIcon } from '@kadence/icons';
import addNavLink from './helpers/addNavLink';
import { coreMenuToBlocks } from './helpers/coreMenuToBlocks';
import {
	KadencePanelBody,
	InspectorControlTabs,
	SpacingVisualizer,
	ResponsiveMeasureRangeControl,
	ResponsiveRangeControls,
	PopColorControl,
	HoverToggleControl,
	TypographyControls,
	ResponsiveSingleBorderControl,
	ResponsiveBorderControl,
	ResponsiveSelectControl,
	SmallResponsiveControl,
	BoxShadowControl,
	ResponsiveMeasurementControls,
	SelectPostFromPostType,
	CopyPasteAttributes,
	ResponsiveButtonStyleControlsWithStates,
	KadenceWebfontLoader,
	KadenceSubPanelBody,
} from '@kadence/components';
import { getPreviewSize, mouseOverVisualizer, showSettings } from '@kadence/helpers';

import {
	InspectorControls,
	BlockControls,
	useInnerBlocksProps,
	InspectorAdvancedControls,
	store as editorStore,
	BlockSettingsMenuControls,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	ExternalLink,
	Button,
	Placeholder,
	MenuItem,
	Modal,
} from '@wordpress/components';

import { MenuEditor } from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { DEFAULT_BLOCK, ALLOWED_BLOCKS, PRIORITIZED_INSERTER_BLOCKS } from './constants';
import BackendStyles from './components/backend-styles';
import { plus, plusCircle } from '@wordpress/icons';
import metadata from './block.json';

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;
export function EditInner(props) {
	const { attributes, setAttributes, clientId, direct, id, isSelected, context } = props;
	const { uniqueID, templateKey } = attributes;

	const { previewDevice, childSelected, offCanvasParent } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				childSelected: select('core/block-editor').hasSelectedInnerBlock(clientId, true),
				offCanvasParent: select('core/block-editor')
					.getBlockParentsByBlockName(clientId, 'kadence/off-canvas')
					.slice(-1)[0],
			};
		},
		[clientId]
	);

	const [activeTab, setActiveTab] = useState('general');
	const [navPlaceholderBlocks, setNavPlaceholderBlocks] = useState([]);
	const [blocksToInsert, setBlocksToInsert] = useState([]);

	const [isOpen, setOpen] = useState(false);
	const closeModal = () => {
		setOpen(false);
	};

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();
	const borderMouseOver = mouseOverVisualizer();

	const [meta, setMeta] = useNavigationProp('meta');

	const metaAttributes = {
		padding: meta?._kad_navigation_padding,
		tabletPadding: meta?._kad_navigation_tabletPadding,
		mobilePadding: meta?._kad_navigation_mobilePadding,
		paddingUnit: meta?._kad_navigation_paddingUnit,
		margin: meta?._kad_navigation_margin,
		tabletMargin: meta?._kad_navigation_tabletMargin,
		mobileMargin: meta?._kad_navigation_mobileMargin,
		marginUnit: meta?._kad_navigation_marginUnit,
		paddingDropdown: meta?._kad_navigation_paddingDropdown,
		tabletPaddingDropdown: meta?._kad_navigation_tabletPaddingDropdown,
		mobilePaddingDropdown: meta?._kad_navigation_mobilePaddingDropdown,
		paddingDropdownUnit: meta?._kad_navigation_paddingDropdownUnit,
		marginDropdown: meta?._kad_navigation_marginDropdown,
		tabletMarginDropdown: meta?._kad_navigation_tabletMarginDropdown,
		mobileMarginDropdown: meta?._kad_navigation_mobileMarginDropdown,
		marginDropdownUnit: meta?._kad_navigation_marginDropdownUnit,
		paddingLink: meta?._kad_navigation_paddingLink,
		tabletPaddingLink: meta?._kad_navigation_tabletPaddingLink,
		mobilePaddingLink: meta?._kad_navigation_mobilePaddingLink,
		paddingLinkUnit: meta?._kad_navigation_paddingLinkUnit,
		marginLink: meta?._kad_navigation_marginLink,
		tabletMarginLink: meta?._kad_navigation_tabletMarginLink,
		mobileMarginLink: meta?._kad_navigation_mobileMarginLink,
		marginLinkUnit: meta?._kad_navigation_marginLinkUnit,
		paddingDropdownLink: meta?._kad_navigation_paddingDropdownLink,
		tabletPaddingDropdownLink: meta?._kad_navigation_tabletPaddingDropdownLink,
		mobilePaddingDropdownLink: meta?._kad_navigation_mobilePaddingDropdownLink,
		paddingDropdownLinkUnit: meta?._kad_navigation_paddingDropdownLinkUnit,
		marginDropdownLink: meta?._kad_navigation_marginDropdownLink,
		tabletMarginDropdownLink: meta?._kad_navigation_tabletMarginDropdownLink,
		mobileMarginDropdownLink: meta?._kad_navigation_mobileMarginDropdownLink,
		marginDropdownLinkUnit: meta?._kad_navigation_marginDropdownLinkUnit,
		className: meta?._kad_navigation_className,
		anchor: meta?._kad_navigation_anchor,
		orientation: meta?._kad_navigation_orientation,
		orientationTablet: meta?._kad_navigation_orientationTablet,
		orientationMobile: meta?._kad_navigation_orientationMobile,
		style: meta?._kad_navigation_style,
		styleTablet: meta?._kad_navigation_styleTablet,
		styleMobile: meta?._kad_navigation_styleMobile,
		spacing: meta?._kad_navigation_spacing,
		spacingTablet: meta?._kad_navigation_spacingTablet,
		spacingMobile: meta?._kad_navigation_spacingMobile,
		spacingUnit: meta?._kad_navigation_spacingUnit,
		stretch: meta?._kad_navigation_stretch,
		stretchTablet: meta?._kad_navigation_stretchTablet,
		stretchMobile: meta?._kad_navigation_stretchMobile,
		fillStretch: meta?._kad_navigation_fillStretch,
		fillStretchTablet: meta?._kad_navigation_fillStretchTablet,
		fillStretchMobile: meta?._kad_navigation_fillStretchMobile,
		parentActive: meta?._kad_navigation_parentActive,
		parentActiveTablet: meta?._kad_navigation_parentActiveTablet,
		parentActiveMobile: meta?._kad_navigation_parentActiveMobile,
		collapseSubMenus: meta?._kad_navigation_collapseSubMenus,
		collapseSubMenusTablet: meta?._kad_navigation_collapseSubMenusTablet,
		collapseSubMenusMobile: meta?._kad_navigation_collapseSubMenusMobile,
		parentTogglesMenus: meta?._kad_navigation_parentTogglesMenus,
		parentTogglesMenusTablet: meta?._kad_navigation_parentTogglesMenusTablet,
		parentTogglesMenusMobile: meta?._kad_navigation_parentTogglesMenusMobile,
		linkColor: meta?._kad_navigation_linkColor,
		linkColorHover: meta?._kad_navigation_linkColorHover,
		linkColorActive: meta?._kad_navigation_linkColorActive,
		linkColorTablet: meta?._kad_navigation_linkColorTablet,
		linkColorHoverTablet: meta?._kad_navigation_linkColorHoverTablet,
		linkColorActiveTablet: meta?._kad_navigation_linkColorActiveTablet,
		linkColorMobile: meta?._kad_navigation_linkColorMobile,
		linkColorHoverMobile: meta?._kad_navigation_linkColorHoverMobile,
		linkColorActiveMobile: meta?._kad_navigation_linkColorActiveMobile,
		background: meta?._kad_navigation_background,
		backgroundHover: meta?._kad_navigation_backgroundHover,
		backgroundActive: meta?._kad_navigation_backgroundActive,
		backgroundTablet: meta?._kad_navigation_backgroundTablet,
		backgroundHoverTablet: meta?._kad_navigation_backgroundHoverTablet,
		backgroundActiveTablet: meta?._kad_navigation_backgroundActiveTablet,
		backgroundMobile: meta?._kad_navigation_backgroundMobile,
		backgroundHoverMobile: meta?._kad_navigation_backgroundHoverMobile,
		backgroundActiveMobile: meta?._kad_navigation_backgroundActiveMobile,
		linkColorDropdown: meta?._kad_navigation_linkColorDropdown,
		linkColorDropdownHover: meta?._kad_navigation_linkColorDropdownHover,
		linkColorDropdownActive: meta?._kad_navigation_linkColorDropdownActive,
		linkColorDropdownTablet: meta?._kad_navigation_linkColorDropdownTablet,
		linkColorDropdownHoverTablet: meta?._kad_navigation_linkColorDropdownHoverTablet,
		linkColorDropdownActiveTablet: meta?._kad_navigation_linkColorDropdownActiveTablet,
		linkColorDropdownMobile: meta?._kad_navigation_linkColorDropdownMobile,
		linkColorDropdownHoverMobile: meta?._kad_navigation_linkColorDropdownHoverMobile,
		linkColorDropdownActiveMobile: meta?._kad_navigation_linkColorDropdownActiveMobile,
		backgroundDropdown: meta?._kad_navigation_backgroundDropdown,
		backgroundDropdownHover: meta?._kad_navigation_backgroundDropdownHover,
		backgroundDropdownActive: meta?._kad_navigation_backgroundDropdownActive,
		backgroundDropdownTablet: meta?._kad_navigation_backgroundDropdownTablet,
		backgroundDropdownHoverTablet: meta?._kad_navigation_backgroundDropdownHoverTablet,
		backgroundDropdownActiveTablet: meta?._kad_navigation_backgroundDropdownActiveTablet,
		backgroundDropdownMobile: meta?._kad_navigation_backgroundDropdownMobile,
		backgroundDropdownHoverMobile: meta?._kad_navigation_backgroundDropdownHoverMobile,
		backgroundDropdownActiveMobile: meta?._kad_navigation_backgroundDropdownActiveMobile,
		linkColorTransparent: meta?._kad_navigation_linkColorTransparent,
		linkColorTransparentHover: meta?._kad_navigation_linkColorTransparentHover,
		linkColorTransparentActive: meta?._kad_navigation_linkColorTransparentActive,
		linkColorTransparentTablet: meta?._kad_navigation_linkColorTransparentTablet,
		linkColorTransparentHoverTablet: meta?._kad_navigation_linkColorTransparentHoverTablet,
		linkColorTransparentActiveTablet: meta?._kad_navigation_linkColorTransparentActiveTablet,
		linkColorTransparentMobile: meta?._kad_navigation_linkColorTransparentMobile,
		linkColorTransparentHoverMobile: meta?._kad_navigation_linkColorTransparentHoverMobile,
		linkColorTransparentActiveMobile: meta?._kad_navigation_linkColorTransparentActiveMobile,
		backgroundTransparent: meta?._kad_navigation_backgroundTransparent,
		backgroundTransparentHover: meta?._kad_navigation_backgroundTransparentHover,
		backgroundTransparentActive: meta?._kad_navigation_backgroundTransparentActive,
		backgroundTransparentTablet: meta?._kad_navigation_backgroundTransparentTablet,
		backgroundTransparentHoverTablet: meta?._kad_navigation_backgroundTransparentHoverTablet,
		backgroundTransparentActiveTablet: meta?._kad_navigation_backgroundTransparentActiveTablet,
		backgroundTransparentMobile: meta?._kad_navigation_backgroundTransparentMobile,
		backgroundTransparentHoverMobile: meta?._kad_navigation_backgroundTransparentHoverMobile,
		backgroundTransparentActiveMobile: meta?._kad_navigation_backgroundTransparentActiveMobile,
		linkColorSticky: meta?._kad_navigation_linkColorSticky,
		linkColorStickyHover: meta?._kad_navigation_linkColorStickyHover,
		linkColorStickyActive: meta?._kad_navigation_linkColorStickyActive,
		linkColorStickyTablet: meta?._kad_navigation_linkColorStickyTablet,
		linkColorStickyHoverTablet: meta?._kad_navigation_linkColorStickyHoverTablet,
		linkColorStickyActiveTablet: meta?._kad_navigation_linkColorStickyActiveTablet,
		linkColorStickyMobile: meta?._kad_navigation_linkColorStickyMobile,
		linkColorStickyHoverMobile: meta?._kad_navigation_linkColorStickyHoverMobile,
		linkColorStickyActiveMobile: meta?._kad_navigation_linkColorStickyActiveMobile,
		backgroundSticky: meta?._kad_navigation_backgroundSticky,
		backgroundStickyHover: meta?._kad_navigation_backgroundStickyHover,
		backgroundStickyActive: meta?._kad_navigation_backgroundStickyActive,
		backgroundStickyTablet: meta?._kad_navigation_backgroundStickyTablet,
		backgroundStickyHoverTablet: meta?._kad_navigation_backgroundStickyHoverTablet,
		backgroundStickyActiveTablet: meta?._kad_navigation_backgroundStickyActiveTablet,
		backgroundStickyMobile: meta?._kad_navigation_backgroundStickyMobile,
		backgroundStickyHoverMobile: meta?._kad_navigation_backgroundStickyHoverMobile,
		backgroundStickyActiveMobile: meta?._kad_navigation_backgroundStickyActiveMobile,
		typography: meta?._kad_navigation_typography
			? meta?._kad_navigation_typography
			: [
					{
						size: ['', '', ''],
						sizeType: 'px',
						lineHeight: ['', '', ''],
						lineType: '',
						letterSpacing: ['', '', ''],
						letterType: 'px',
						textTransform: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					},
			  ],
		dropdownTypography: meta?._kad_navigation_dropdownTypography
			? meta?._kad_navigation_dropdownTypography
			: [
					{
						size: ['', '', ''],
						sizeType: 'px',
						lineHeight: ['', '', ''],
						lineType: '',
						letterSpacing: ['', '', ''],
						letterType: 'px',
						textTransform: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					},
			  ],
		descriptionTypography: meta?._kad_navigation_descriptionTypography
			? meta?._kad_navigation_descriptionTypography
			: [
					{
						size: ['', '', ''],
						sizeType: 'px',
						lineHeight: ['', '', ''],
						lineType: '',
						letterSpacing: ['', '', ''],
						letterType: 'px',
						textTransform: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					},
			  ],
		dropdownDescriptionTypography: meta?._kad_navigation_dropdownDescriptionTypography
			? meta?._kad_navigation_dropdownDescriptionTypography
			: [
					{
						size: ['', '', ''],
						sizeType: 'px',
						lineHeight: ['', '', ''],
						lineType: '',
						letterSpacing: ['', '', ''],
						letterType: 'px',
						textTransform: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					},
			  ],
		divider: meta?._kad_navigation_divider,
		dividerTablet: meta?._kad_navigation_dividerTablet,
		dividerMobile: meta?._kad_navigation_dividerMobile,
		dropdownDivider: meta?._kad_navigation_dropdownDivider,
		dropdownDividerTablet: meta?._kad_navigation_dropdownDividerTablet,
		dropdownDividerMobile: meta?._kad_navigation_dropdownDividerMobile,
		transparentDivider: meta?._kad_navigation_transparentDivider,
		transparentDividerTablet: meta?._kad_navigation_transparentDividerTablet,
		transparentDividerMobile: meta?._kad_navigation_transparentDividerMobile,
		stickyDivider: meta?._kad_navigation_stickyDivider,
		stickyDividerTablet: meta?._kad_navigation_stickyDividerTablet,
		stickyDividerMobile: meta?._kad_navigation_stickyDividerMobile,
		dropdownWidth: meta?._kad_navigation_dropdownWidth,
		dropdownWidthTablet: meta?._kad_navigation_dropdownWidthTablet,
		dropdownWidthMobile: meta?._kad_navigation_dropdownWidthMobile,
		dropdownWidthUnit: meta?._kad_navigation_dropdownWidthUnit,
		dropdownVerticalSpacing: meta?._kad_navigation_dropdownVerticalSpacing,
		dropdownVerticalSpacingTablet: meta?._kad_navigation_dropdownVerticalSpacingTablet,
		dropdownVerticalSpacingMobile: meta?._kad_navigation_dropdownVerticalSpacingMobile,
		dropdownVerticalSpacingUnit: meta?._kad_navigation_dropdownVerticalSpacingUnit,
		dropdownHorizontalAlignment: meta?._kad_navigation_dropdownHorizontalAlignment,
		dropdownHorizontalAlignmentTablet: meta?._kad_navigation_dropdownHorizontalAlignmentTablet,
		dropdownHorizontalAlignmentMobile: meta?._kad_navigation_dropdownHorizontalAlignmentMobile,
		dropdownHorizontalAlignmentCustom: meta?._kad_navigation_dropdownHorizontalAlignmentCustom,
		dropdownHorizontalAlignmentCustomTablet: meta?._kad_navigation_dropdownHorizontalAlignmentCustomTablet,
		dropdownHorizontalAlignmentCustomMobile: meta?._kad_navigation_dropdownHorizontalAlignmentCustomMobile,
		dropdownHorizontalAlignmentCustomUnit: meta?._kad_navigation_dropdownHorizontalAlignmentCustomUnit,
		dropdownShadow: meta?._kad_navigation_dropdownShadow,
		dropdownReveal: meta?._kad_navigation_dropdownReveal,
		dropdownRevealTablet: meta?._kad_navigation_dropdownRevealTablet,
		dropdownRevealMobile: meta?._kad_navigation_dropdownRevealMobile,
		dropdownBorder: meta?._kad_navigation_dropdownBorder,
		dropdownBorderTablet: meta?._kad_navigation_dropdownBorderTablet,
		dropdownBorderMobile: meta?._kad_navigation_dropdownBorderMobile,
		dropdownBorderRadius: meta?._kad_navigation_dropdownBorderRadius,
		dropdownBorderRadiusTablet: meta?._kad_navigation_dropdownBorderRadiusTablet,
		dropdownBorderRadiusMobile: meta?._kad_navigation_dropdownBorderRadiusMobile,
		dropdownBorderRadiusUnit: meta?._kad_navigation_dropdownBorderRadiusUnit,
		backgroundType: meta?._kad_navigation_backgroundType,
		backgroundTypeHover: meta?._kad_navigation_backgroundTypeHover,
		backgroundTypeActive: meta?._kad_navigation_backgroundTypeActive,
		backgroundGradient: meta?._kad_navigation_backgroundGradient,
		backgroundGradientHover: meta?._kad_navigation_backgroundGradientHover,
		backgroundGradientActive: meta?._kad_navigation_backgroundGradientActive,
		border: meta?._kad_navigation_border,
		borderTablet: meta?._kad_navigation_borderTablet,
		borderMobile: meta?._kad_navigation_borderMobile,
		borderHover: meta?._kad_navigation_borderHover,
		borderHoverTablet: meta?._kad_navigation_borderHoverTablet,
		borderHoverMobile: meta?._kad_navigation_borderHoverMobile,
		borderActive: meta?._kad_navigation_borderActive,
		borderActiveTablet: meta?._kad_navigation_borderActiveTablet,
		borderActiveMobile: meta?._kad_navigation_borderActiveMobile,
		borderRadius: meta?._kad_navigation_borderRadius,
		borderRadiusTablet: meta?._kad_navigation_borderRadiusTablet,
		borderRadiusMobile: meta?._kad_navigation_borderRadiusMobile,
		borderRadiusHover: meta?._kad_navigation_borderRadiusHover,
		borderRadiusHoverTablet: meta?._kad_navigation_borderRadiusHoverTablet,
		borderRadiusHoverMobile: meta?._kad_navigation_borderRadiusHoverMobile,
		borderRadiusActive: meta?._kad_navigation_borderRadiusActive,
		borderRadiusActiveTablet: meta?._kad_navigation_borderRadiusActiveTablet,
		borderRadiusActiveMobile: meta?._kad_navigation_borderRadiusActiveMobile,
		borderUnit: meta?._kad_navigation_borderUnit,
		borderUnitHover: meta?._kad_navigation_borderUnitHover,
		borderUnitActive: meta?._kad_navigation_borderUnitActive,
		shadow: meta?._kad_navigation_shadow,
		shadowHover: meta?._kad_navigation_shadowHover,
		shadowActive: meta?._kad_navigation_shadowActive,
		descriptionColor: meta?._kad_navigation_descriptionColor,
		descriptionColorHover: meta?._kad_navigation_descriptionColorHover,
		descriptionColorActive: meta?._kad_navigation_descriptionColorActive,
		descriptionColorTablet: meta?._kad_navigation_descriptionColorTablet,
		descriptionColorHoverTablet: meta?._kad_navigation_descriptionColorHoverTablet,
		descriptionColorActiveTablet: meta?._kad_navigation_descriptionColorActiveTablet,
		descriptionColorMobile: meta?._kad_navigation_descriptionColorMobile,
		descriptionColorHoverMobile: meta?._kad_navigation_descriptionColorHoverMobile,
		descriptionColorActiveMobile: meta?._kad_navigation_descriptionColorActiveMobile,
		descriptionSpacing: meta?._kad_navigation_descriptionSpacing,
		descriptionSpacingTablet: meta?._kad_navigation_descriptionSpacingTablet,
		descriptionSpacingMobile: meta?._kad_navigation_descriptionSpacingMobile,
		descriptionSpacingUnit: meta?._kad_navigation_descriptionSpacingUnit,
		descriptionPositioning: meta?._kad_navigation_descriptionPositioning,
		descriptionPositioningTablet: meta?._kad_navigation_descriptionPositioningTablet,
		descriptionPositioningMobile: meta?._kad_navigation_descriptionPositioningMobile,
		dropdownDescriptionColor: meta?._kad_navigation_dropdownDescriptionColor,
		dropdownDescriptionColorHover: meta?._kad_navigation_dropdownDescriptionColorHover,
		dropdownDescriptionColorActive: meta?._kad_navigation_dropdownDescriptionColorActive,
		dropdownDescriptionColorTablet: meta?._kad_navigation_dropdownDescriptionColorTablet,
		dropdownDescriptionColorHoverTablet: meta?._kad_navigation_dropdownDescriptionColorHoverTablet,
		dropdownDescriptionColorActiveTablet: meta?._kad_navigation_dropdownDescriptionColorActiveTablet,
		dropdownDescriptionColorMobile: meta?._kad_navigation_dropdownDescriptionColorMobile,
		dropdownDescriptionColorHoverMobile: meta?._kad_navigation_dropdownDescriptionColorHoverMobile,
		dropdownDescriptionColorActiveMobile: meta?._kad_navigation_dropdownDescriptionColorActiveMobile,
		dropdownDescriptionSpacing: meta?._kad_navigation_dropdownDescriptionSpacing,
		dropdownDescriptionSpacingTablet: meta?._kad_navigation_dropdownDescriptionSpacingTablet,
		dropdownDescriptionSpacingMobile: meta?._kad_navigation_dropdownDescriptionSpacingMobile,
		dropdownDescriptionSpacingUnit: meta?._kad_navigation_dropdownDescriptionSpacingUnit,
		dropdownDescriptionPositioning: meta?._kad_navigation_dropdownDescriptionPositioning,
		dropdownDescriptionPositioningTablet: meta?._kad_navigation_dropdownDescriptionPositioningTablet,
		dropdownDescriptionPositioningMobile: meta?._kad_navigation_dropdownDescriptionPositioningMobile,
	};

	const {
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		margin,
		tabletMargin,
		mobileMargin,
		marginUnit,
		paddingDropdown,
		tabletPaddingDropdown,
		mobilePaddingDropdown,
		paddingDropdownUnit,
		marginDropdown,
		tabletMarginDropdown,
		mobileMarginDropdown,
		marginDropdownUnit,
		paddingLink,
		tabletPaddingLink,
		mobilePaddingLink,
		paddingLinkUnit,
		marginLink,
		tabletMarginLink,
		mobileMarginLink,
		marginLinkUnit,
		paddingDropdownLink,
		tabletPaddingDropdownLink,
		mobilePaddingDropdownLink,
		paddingDropdownLinkUnit,
		marginDropdownLink,
		tabletMarginDropdownLink,
		mobileMarginDropdownLink,
		marginDropdownLinkUnit,
		border,
		borderRadius,
		borderColor,
		borderUnit,
		className,
		anchor,
		orientation,
		orientationTablet,
		orientationMobile,
		style,
		styleTablet,
		styleMobile,
		spacing,
		spacingTablet,
		spacingMobile,
		spacingUnit,
		stretch,
		stretchTablet,
		stretchMobile,
		fillStretch,
		fillStretchTablet,
		fillStretchMobile,
		parentActive,
		parentActiveTablet,
		parentActiveMobile,
		collapseSubMenus,
		collapseSubMenusTablet,
		collapseSubMenusMobile,
		parentTogglesMenus,
		parentTogglesMenusTablet,
		parentTogglesMenusMobile,
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
		typography,
		dropdownTypography,
		descriptionTypography,
		dropdownDescriptionTypography,
		divider,
		dividerTablet,
		dividerMobile,
		dropdownDivider,
		dropdownDividerTablet,
		dropdownDividerMobile,
		transparentDivider,
		transparentDividerTablet,
		transparentDividerMobile,
		stickyDivider,
		stickyDividerTablet,
		stickyDividerMobile,
		dropdownWidth,
		dropdownWidthTablet,
		dropdownWidthMobile,
		dropdownWidthUnit,
		dropdownVerticalSpacing,
		dropdownVerticalSpacingTablet,
		dropdownVerticalSpacingMobile,
		dropdownVerticalSpacingUnit,
		dropdownHorizontalAlignment,
		dropdownHorizontalAlignmentTablet,
		dropdownHorizontalAlignmentMobile,
		dropdownShadow,
		dropdownReveal,
		dropdownRevealTablet,
		dropdownRevealMobile,
		dropdownBorder,
		dropdownBorderTablet,
		dropdownBorderMobile,
		dropdownBorderRadius,
		dropdownBorderRadiusTablet,
		dropdownBorderRadiusMobile,
		dropdownBorderRadiusUnit,
		descriptionSpacing,
		descriptionSpacingTablet,
		descriptionSpacingMobile,
		descriptionSpacingUnit,
		dropdownDescriptionSpacing,
		dropdownDescriptionSpacingTablet,
		dropdownDescriptionSpacingMobile,
		dropdownDescriptionSpacingUnit,
		descriptionPositioning,
		descriptionPositioningTablet,
		descriptionPositioningMobile,
		dropdownDescriptionPositioning,
		dropdownDescriptionPositioningTablet,
		dropdownDescriptionPositioningMobile,
	} = metaAttributes;

	const inTemplatePreviewMode = !id && templateKey;

	const previewOrientation = inTemplatePreviewMode
		? templateKey.includes('vertical')
			? 'vertical'
			: 'horizontal'
		: getPreviewSize(previewDevice, orientation, orientationTablet, orientationMobile);

	const setMetaAttribute = (value, key) => {
		setMeta({ ...meta, ['_kad_navigation_' + key]: value });
	};

	const saveTypography = (value) => {
		const newUpdate = typography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setMetaAttribute(newUpdate, 'typography');
	};
	const saveDropdownTypography = (value) => {
		const newUpdate = dropdownTypography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setMetaAttribute(newUpdate, 'dropdownTypography');
	};
	const saveDescriptionTypography = (value) => {
		const newUpdate = descriptionTypography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setMetaAttribute(newUpdate, 'descriptionTypography');
	};
	const saveDropdownDescriptionTypography = (value) => {
		const newUpdate = dropdownDescriptionTypography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setMetaAttribute(newUpdate, 'dropdownDescriptionTypography');
	};

	const saveShadow = (value) => {
		const newUpdate = dropdownShadow.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setMetaAttribute(newUpdate, 'dropdownShadow');
	};

	const navClasses = classnames('navigation', {
		[`navigation-desktop-dropdown-animation-${dropdownReveal ? dropdownReveal : 'none'}`]:
			!previewDevice || previewDevice === 'Desktop',
		[`navigation-tablet-dropdown-animation-${dropdownRevealTablet}`]: previewDevice === 'Tablet',
		[`navigation-mobile-dropdown-animation-${dropdownRevealMobile}`]: previewDevice === 'Mobile',
		[`navigation-desktop-style-${style}`]: !previewDevice || previewDevice === 'Desktop',
		[`navigation-tablet-style-${styleTablet}`]: previewDevice === 'Tablet',
		[`navigation-mobile-style-${styleMobile}`]: previewDevice === 'Mobile',
		[`navigation-desktop-collapse-sub-menus-${collapseSubMenus}`]: !previewDevice || previewDevice === 'Desktop',
		[`navigation-tablet-collapse-sub-menus-${collapseSubMenusTablet}`]: previewDevice === 'Tablet',
		[`navigation-mobile-collapse-sub-menus-${collapseSubMenusMobile}`]: previewDevice === 'Mobile',
		//we don't need to apply this setting in the editor
		// [`navigation-desktop-parent-toggles-menus-${parentTogglesMenus}`]: !previewDevice || previewDevice == 'Desktop',
		// [`navigation-tablet-parent-toggles-menus-${parentTogglesMenusTablet}`]: previewDevice === 'Tablet',
		// [`navigation-mobile-parent-toggles-menus-${parentTogglesMenusMobile}`]: previewDevice === 'Mobile',
		[`navigation-desktop-parent-active-${parentActive}`]: !previewDevice || previewDevice === 'Desktop',
		[`navigation-tablet-parent-active-${parentActiveTablet}`]: previewDevice === 'Tablet',
		[`navigation-mobile-parent-active-${parentActiveMobile}`]: previewDevice === 'Mobile',
	});

	const innerNavClasses = classnames('menu', {
		'kb-navigation': true,
		[`kb-navigation-${id}`]: true,
	});

	const [title, setTitle] = useNavigationProp('title');

	let [blocks, onInput, onChange] = useEntityBlockEditor('postType', 'kadence_navigation', id);

	const applyTemplateKeyBlocks = (templateKey) => {
		//if this nav block is getting created through the header onboarding, but doesn't need a whole post
		//then we need to auto create some basic block structure
		if (templateKey.includes('long')) {
			setNavPlaceholderBlocks([
				createBlock('kadence/navigation', {}, [
					createBlock('kadence/navigation-link', { label: 'about', url: '#' }),
					createBlock('kadence/navigation-link', { label: 'blog', url: '#' }),
					createBlock('kadence/navigation-link', { label: 'contact', url: '#' }),
					createBlock('kadence/navigation-link', { label: 'resources', url: '#' }),
					createBlock('kadence/navigation-link', { label: 'locations', url: '#' }),
					createBlock('kadence/navigation-link', { label: 'shop', url: '#' }),
				]),
			]);
		} else {
			setNavPlaceholderBlocks([
				createBlock('kadence/navigation', {}, [
					createBlock('kadence/navigation-link', { label: 'about', url: '#' }),
					createBlock('kadence/navigation-link', { label: 'blog', url: '#' }),
					createBlock('kadence/navigation-link', { label: 'contact', url: '#' }),
				]),
			]);
		}
	};

	useEffect(() => {
		if (!blocks || blocks.length === 0) {
			if (templateKey) {
				//this nav is meant to be a premade template (with no post associated), set innerblocks based on it's template key
				applyTemplateKeyBlocks(templateKey);
			} else {
				//otherwise it's a normal nav block and just needs the placeholder put in place
				setNavPlaceholderBlocks([createBlock('kadence/navigation', {})]);
			}
		}
	}, []);
	useEffect(() => {
		//if there's no orientation set and our parent is an off canvas block, then default the orientation to vertical
		if (
			meta &&
			!metaAttributes['orientation'] &&
			!metaAttributes['orientationTablet'] &&
			!metaAttributes['orientationMobile'] &&
			offCanvasParent
		) {
			setMetaAttribute('vertical', 'orientation');
		}
	}, []);

	//if this was a templated placeholder nav
	//on it's first selection, replace it with the nav onboarding
	useEffect(() => {
		if (isSelected && templateKey && !id) {
			setAttributes({ templateKey: '', id: 0 });
		}
	}, [isSelected]);

	// Handle importing existing core menus
	useEffect(() => {
		let isMounted = true; // To handle component unmounting

		const fetchCoreMenu = async () => {
			if (window.kb_navigation_import_core !== undefined && id === window.kb_navigation_import_core.id) {
				const coreMenuBlocks = await coreMenuToBlocks(window.kb_navigation_import_core.coreMenuId);
				if (isMounted) {
					if (coreMenuBlocks !== false) {
						// Hacky workaround because the blocks are not being when calling the onChange directly here
						// I think the entity is still swapping out because the ID has just changed
						setBlocksToInsert(coreMenuBlocks);
						setTitle(window.kb_navigation_import_core.label);
					}
					window.kb_navigation_import_core = undefined;
				}
			}
		};

		fetchCoreMenu();

		return () => {
			isMounted = false; // Cleanup to avoid setting state on unmounted component
		};
	}, [window.kb_navigation_import_core]);

	useEffect(() => {
		if (blocksToInsert.length !== 0) {
			updateBlocksCallback(blocksToInsert);
			setBlocksToInsert([]);
		}
	}, [blocksToInsert]);

	if (!blocks || blocks.length === 0) {
		blocks = navPlaceholderBlocks;
	}

	const navigationInnerBlocks = useMemo(() => {
		return get(blocks, [0, 'innerBlocks'], []);
	}, [blocks]);

	const newBlock = useMemo(() => {
		return get(blocks, [0], {});
	}, [blocks]);

	const navAppender = () => {
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Button
					className={classnames(className, {
						'block-editor-inserter__toggle': true,
						'has-icon': true,
					})}
					style={{
						minWidth: '24px',
						padding: '0px',
						height: '24px',
						background: '#000',
						color: '#FFF',
						borderRadius: '2px',
					}}
					onClick={() => {
						addNavLink(clientId);
					}}
					icon={plus}
				/>
			</div>
		);
	};

	const TEMPLATE = [['kadence/navigation-link', { label: __('Home', 'kadence-blocks'), url: '/' }]];

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerNavClasses,
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			prioritizedInserterBlocks: PRIORITIZED_INSERTER_BLOCKS,
			value: !direct ? navigationInnerBlocks : undefined,
			onInput: !direct ? (a, b) => onInput([{ ...newBlock, innerBlocks: a }], b) : undefined,
			onChange: !direct ? (a, b) => onChange([{ ...newBlock, innerBlocks: a }], b) : undefined,
			templateLock: false,
			defaultBlock: DEFAULT_BLOCK,
			renderAppender: false,
			//template: TEMPLATE,
		}
	);

	const generalToggleControls = (size = '') => {
		const collapseSubMenusValue = metaAttributes['collapseSubMenus' + size];
		const parentTogglesMenusValue = metaAttributes['parentTogglesMenus' + size];
		const stretchValue = metaAttributes['stretch' + size];
		const fillStretchValue = metaAttributes['fillStretch' + size];
		const parentActiveValue = metaAttributes['parentActive' + size];
		const orientationValue = metaAttributes['orientation' + size];

		return (
			<>
				{orientationValue === 'vertical' && (
					<ToggleControl
						label={__('Collapse Vertical Sub Menus', 'kadence-blocks')}
						checked={collapseSubMenusValue}
						onChange={(value) => setMetaAttribute(value, 'collapseSubMenus' + size)}
					/>
				)}
				{orientationValue === 'vertical' && collapseSubMenusValue && (
					<ToggleControl
						label={__('Entire Item Expands Vertical Sub Menu', 'kadence-blocks')}
						checked={parentTogglesMenusValue}
						onChange={(value) => setMetaAttribute(value, 'parentTogglesMenus' + size)}
					/>
				)}
				{orientationValue !== 'vertical' && (
					<ToggleControl
						label={__('Stretch Menu', 'kadence-blocks')}
						checked={stretchValue}
						onChange={(value) => setMetaAttribute(value, 'stretch' + size)}
					/>
				)}
				{orientationValue !== 'vertical' && stretchValue && (
					<ToggleControl
						label={__('Fill and Center Menu Items?', 'kadence-blocks')}
						checked={fillStretchValue}
						onChange={(value) => setMetaAttribute(value, 'fillStretch' + size)}
					/>
				)}
				<ToggleControl
					label={__('Make Parent of Current Menu item Active', 'kadence-blocks')}
					checked={parentActiveValue}
					onChange={(value) => setMetaAttribute(value, 'parentActive' + size)}
				/>
			</>
		);
	};

	const styleColorControls = (size = '', suffix = '') => {
		const linkColorValue = metaAttributes['linkColor' + suffix + size];
		const backgroundValue = metaAttributes['background' + suffix + size];
		const linkColorHoverValue = metaAttributes['linkColor' + suffix + 'Hover' + size];
		const backgroundHoverValue = metaAttributes['background' + suffix + 'Hover' + size];
		const linkColorActiveValue = metaAttributes['linkColor' + suffix + 'Active' + size];
		const backgroundActiveValue = metaAttributes['background' + suffix + 'Active' + size];
		return (
			<>
				<HoverToggleControl
					normal={
						<>
							<PopColorControl
								label={__('Link Color', 'kadence-blocks')}
								value={linkColorValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'linkColor' + suffix + size)}
								key={'normal'}
							/>
							<PopColorControl
								label={__('Background', 'kadence-blocks')}
								value={backgroundValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'background' + suffix + size)}
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
								onChange={(value) => setMetaAttribute(value, 'linkColor' + suffix + 'Hover' + size)}
								key={'hover'}
							/>
							<PopColorControl
								label={__('Background Hover', 'kadence-blocks')}
								value={backgroundHoverValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'background' + suffix + 'Hover' + size)}
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
								onChange={(value) => setMetaAttribute(value, 'linkColor' + suffix + 'Active' + size)}
								key={'active'}
							/>
							<PopColorControl
								label={__('Background Active', 'kadence-blocks')}
								value={backgroundActiveValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'background' + suffix + 'Active' + size)}
								key={'activeb'}
							/>
						</>
					}
				/>
			</>
		);
	};
	const styleDescriptionColorControls = (size = '', suffix = '') => {
		const descriptionColorValue = metaAttributes['descriptionColor' + suffix + size];
		const descriptionColorHoverValue = metaAttributes['descriptionColor' + suffix + 'Hover' + size];
		const descriptionColorActiveValue = metaAttributes['descriptionColor' + suffix + 'Active' + size];
		return (
			<>
				<HoverToggleControl
					normal={
						<>
							<PopColorControl
								label={__('Color', 'kadence-blocks')}
								value={descriptionColorValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'descriptionColor' + suffix + size)}
								key={'normal'}
							/>
						</>
					}
					hover={
						<>
							<PopColorControl
								label={__('Color Hover', 'kadence-blocks')}
								value={descriptionColorHoverValue}
								default={''}
								onChange={(value) =>
									setMetaAttribute(value, 'descriptionColor' + suffix + 'Hover' + size)
								}
								key={'hover'}
							/>
						</>
					}
					active={
						<>
							<PopColorControl
								label={__('Color Active', 'kadence-blocks')}
								value={descriptionColorActiveValue}
								default={''}
								onChange={(value) =>
									setMetaAttribute(value, 'descriptionColor' + suffix + 'Active' + size)
								}
								key={'active'}
							/>
						</>
					}
				/>
			</>
		);
	};
	const styleDropdownDescriptionColorControls = (size = '', suffix = '') => {
		const dropdownDescriptionColorValue = metaAttributes['dropdownDescriptionColor' + suffix + size];
		const dropdownDescriptionColorHoverValue = metaAttributes['dropdownDescriptionColor' + suffix + 'Hover' + size];
		const dropdownDescriptionColorActiveValue =
			metaAttributes['dropdownDescriptionColor' + suffix + 'Active' + size];
		return (
			<>
				<HoverToggleControl
					normal={
						<>
							<PopColorControl
								label={__('Color', 'kadence-blocks')}
								value={dropdownDescriptionColorValue}
								default={''}
								onChange={(value) =>
									setMetaAttribute(value, 'dropdownDescriptionColor' + suffix + size)
								}
								key={'normal'}
							/>
						</>
					}
					hover={
						<>
							<PopColorControl
								label={__('Color Hover', 'kadence-blocks')}
								value={dropdownDescriptionColorHoverValue}
								default={''}
								onChange={(value) =>
									setMetaAttribute(value, 'dropdownDescriptionColor' + suffix + 'Hover' + size)
								}
								key={'hover'}
							/>
						</>
					}
					active={
						<>
							<PopColorControl
								label={__('Color Active', 'kadence-blocks')}
								value={dropdownDescriptionColorActiveValue}
								default={''}
								onChange={(value) =>
									setMetaAttribute(value, 'dropdownDescriptionColor' + suffix + 'Active' + size)
								}
								key={'active'}
							/>
						</>
					}
				/>
			</>
		);
	};

	const updateBlocksCallback = (navItems) => {
		onChange(
			[
				{
					...newBlock,
					innerBlocks: [...navigationInnerBlocks, ...navItems],
				},
			],
			clientId
		);
	};

	useEffect(() => {
		if (navigationInnerBlocks.length === 0 && !templateKey) {
			setOpen(true);
		}
	}, [navigationInnerBlocks.length]);

	if (inTemplatePreviewMode) {
		//This displays this block as a preview. It should have some temporary inner blocks to display
		//it will not work in any other function. As soon as it's clicked, it should be replaced with a real nav onboarding to make a post.
		return (
			<nav className={navClasses}>
				<div className="menu-container">
					<ul {...innerBlocksProps} />
				</div>
			</nav>
		);
	}

	if (typeof pagenow !== 'undefined' && ('widgets' === pagenow || 'customize' === pagenow)) {
		const editPostLink = addQueryArgs('post.php', {
			post: id,
			action: 'edit',
		});
		return (
			<>
				<Placeholder
					className="kb-select-or-create-placeholder"
					label={__('Kadence Navigation', 'kadence-blocks')}
					icon={formBlockIcon}
				>
					<p style={{ width: '100%', marginBottom: '10px' }}>
						{__('Advanced Navs can not be edited within the widgets screen.', 'kadence-blocks')}
					</p>
					<Button href={editPostLink} variant="primary" className="kb-navigation-edit-link">
						{__('Edit Navigation', 'kadence-blocks')}
					</Button>
				</Placeholder>
				<InspectorControls>
					<KadencePanelBody panelName={'kb-advanced-navigation-selected-switch'}>
						<SelectPostFromPostType
							postType="kadence_navigation"
							label={__('Selected Navigation', 'kadence-blocks')}
							hideLabelFromVision={false}
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
		);
	}

	return (
		<>
			{isOpen && (
				<style>
					{`
						.components-modal__content > div:not(.components-modal__header) { height: 100%; }
						.components-modal__content { padding-bottom: 0; }
					`}
				</style>
			)}
			<BlockControls>
				<CopyPasteAttributes
					attributes={meta}
					excludedAttributes={['_kad_navigation_description']}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setMeta({ ...meta, ...attributesToPaste })}
				/>
				<ToolbarGroup>
					<ToolbarButton
						className="kb-icons-add-icon"
						icon={plusCircle}
						onClick={() => {
							addNavLink(clientId);
						}}
						label={__('Add Navigation Link', 'kadence-blocks')}
						showTooltip={true}
					/>
				</ToolbarGroup>
			</BlockControls>
			{isSelected && (
				<BlockSettingsMenuControls>
					{(props) => {
						const { selectedBlocks, onClose } = props;

						if (selectedBlocks.length === 1 && selectedBlocks[0] === 'kadence/navigation') {
							return (
								<MenuItem
									onClick={() => {
										addNavLink(clientId);
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
			{isOpen && (
				<Modal size={'fill'} title={__('Navigation Builder', 'kadence-blocks')} onRequestClose={closeModal}>
					<MenuEditor
						updateBlocksCallback={updateBlocksCallback}
						clientId={clientId}
						closeModal={closeModal}
						title={title}
						setTitle={setTitle}
						setMetaAttribute={setMetaAttribute}
						orientation={meta?._kad_navigation_orientation}
						orientationTablet={meta?._kad_navigation_orientationTablet}
					/>
				</Modal>
			)}
			<BackendStyles {...props} metaAttributes={metaAttributes} previewDevice={previewDevice} />
			<InspectorControls>
				<InspectorControlTabs
					panelName={'advanced-navigation'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody panelName={'kb-navigation-selected-switch'}>
							{!direct && (
								<>
									<SelectPostFromPostType
										postType="kadence_navigation"
										label={__('Selected Navigation', 'kadence-blocks')}
										onChange={(nextId) => setAttributes({ id: parseInt(nextId) })}
										value={id}
										overrideLabel={title}
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
								</>
							)}
						</KadencePanelBody>
						<KadencePanelBody panelName={'kb-navigation-modal'}>
							<Button variant="secondary" onClick={() => setOpen(true)} style={{ margin: '0 auto' }}>
								{__('Open Navigation Builder', 'kadence-blocks')}
							</Button>
						</KadencePanelBody>
						<div className="kt-sidebar-settings-spacer"></div>
						<KadencePanelBody panelName={'kb-navigation-general'}>
							<ResponsiveSelectControl
								label={__('Orientation', 'kadence-blocks')}
								value={orientation}
								tabletValue={orientationTablet}
								mobileValue={orientationMobile}
								options={[
									{ value: 'horizontal', label: __('Horizontal') },
									{ value: 'vertical', label: __('Vertical') },
								]}
								onChange={(value) => setMetaAttribute(value, 'orientation')}
								onChangeTablet={(value) => setMetaAttribute(value, 'orientationTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'orientationMobile')}
							/>
							<ResponsiveRangeControls
								label={__('Horizontal Item Spacing', 'kadence-blocks')}
								value={parseFloat(spacing[1]) ? parseFloat(spacing[1]) : ''}
								valueTablet={parseFloat(spacingTablet[1]) ? parseFloat(spacingTablet[1]) : ''}
								valueMobile={parseFloat(spacingMobile[1]) ? parseFloat(spacingMobile[1]) : ''}
								onChange={(value) =>
									setMetaAttribute(
										[spacing[0], String(value ?? ''), spacing[2], String(value ?? '')],
										'spacing'
									)
								}
								onChangeTablet={(value) =>
									setMetaAttribute(
										[spacingTablet[0], String(value ?? ''), spacingTablet[2], String(value ?? '')],
										'spacingTablet'
									)
								}
								onChangeMobile={(value) =>
									setMetaAttribute(
										[spacingMobile[0], String(value ?? ''), spacingMobile[2], String(value ?? '')],
										'spacingMobile'
									)
								}
								min={0}
								max={
									spacingUnit === 'em' || spacingUnit === 'rem'
										? 24
										: spacingUnit === 'px'
										? 200
										: 100
								}
								step={spacingUnit === 'em' || spacingUnit === 'rem' ? 0.1 : 1}
								unit={spacingUnit}
								units={['em', 'rem', 'px', 'vw']}
								onUnit={(value) => setMetaAttribute(value, 'spacingUnit')}
								showUnit={true}
								reset={() => setMetaAttribute([spacingMobile[0], '', spacingMobile[2], ''], 'spacing')}
							/>
							{(previewOrientation === 'vertical' ||
								style === 'underline' ||
								style === 'standard' ||
								style === '') && (
								<ResponsiveRangeControls
									label={__('Vertical Item Spacing', 'kadence-blocks')}
									value={parseFloat(spacing[0]) ? parseFloat(spacing[0]) : ''}
									valueTablet={parseFloat(spacingTablet[0]) ? parseFloat(spacingTablet[0]) : ''}
									valueMobile={parseFloat(spacingMobile[0]) ? parseFloat(spacingMobile[0]) : ''}
									onChange={(value) =>
										setMetaAttribute(
											[String(value ?? ''), spacing[1], String(value ?? ''), spacing[3]],
											'spacing'
										)
									}
									onChangeTablet={(value) =>
										setMetaAttribute(
											[
												String(value ?? ''),
												spacingTablet[1],
												String(value ?? ''),
												spacingTablet[3],
											],
											'spacingTablet'
										)
									}
									onChangeMobile={(value) =>
										setMetaAttribute(
											[value.toString(), spacingMobile[1], value.toString(), spacingMobile[3]],
											'spacingMobile'
										)
									}
									min={0}
									max={
										spacingUnit === 'em' || spacingUnit === 'rem'
											? 24
											: spacingUnit === 'px'
											? 200
											: 100
									}
									step={spacingUnit === 'em' || spacingUnit === 'rem' ? 0.1 : 1}
									unit={spacingUnit}
									units={['em', 'rem', 'px', 'vw']}
									onUnit={(value) => setMetaAttribute(value, 'spacingUnit')}
									showUnit={true}
									reset={() =>
										setMetaAttribute(['', spacingMobile[1], '', spacingMobile[3]], 'spacing')
									}
								/>
							)}
							<SmallResponsiveControl
								label={'Layout Options'}
								desktopChildren={generalToggleControls()}
								tabletChildren={generalToggleControls('Tablet')}
								mobileChildren={generalToggleControls('Mobile')}
							></SmallResponsiveControl>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'style' && (
					<>
						<KadencePanelBody panelName={'kb-navigation-style'}>
							<ResponsiveSelectControl
								label={__('Style', 'kadence-blocks')}
								value={style}
								tabletValue={styleTablet}
								mobileValue={styleMobile}
								options={[
									{ value: 'standard', label: __('Standard', 'kadence-blocks') },
									{ value: 'fullheight', label: __('Full Height', 'kadence-blocks') },
									{ value: 'underline', label: __('Underline', 'kadence-blocks') },
									{
										value: 'underline-fullheight',
										label: __('Full Height Underline', 'kadence-blocks'),
									},
								]}
								onChange={(value) => setMetaAttribute(value, 'style')}
								onChangeTablet={(value) => setMetaAttribute(value, 'styleTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'styleMobile')}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Navigation Item Styles', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-navigation-nav-item-styles'}
						>
							<ResponsiveButtonStyleControlsWithStates
								colorBase={'linkColor'}
								backgroundBase={'background'}
								backgroundTypeBase={'backgroundType'}
								backgroundGradientBase={'backgroundGradient'}
								borderBase={'border'}
								borderRadiusBase={'borderRadius'}
								borderRadiusUnitBase={'borderRadiusUnit'}
								shadowBase={'shadow'}
								setMetaAttribute={setMetaAttribute}
								attributes={metaAttributes}
							/>
						</KadencePanelBody>
						{context?.['kadence/headerIsTransparent'] == '1' && (
							<KadencePanelBody
								title={__('Transparent Styles', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-navigation-transparent-styles'}
							>
								<SmallResponsiveControl
									label={__('Colors', 'kadence-blocks')}
									desktopChildren={styleColorControls('', 'Transparent')}
									tabletChildren={styleColorControls('Tablet', 'Transparent')}
									mobileChildren={styleColorControls('Mobile', 'Transparent')}
								></SmallResponsiveControl>
								<ResponsiveSingleBorderControl
									label={'Divider'}
									value={transparentDivider}
									tabletValue={transparentDividerTablet}
									mobileValue={transparentDividerMobile}
									onChange={(value) => setMetaAttribute(value, 'transparentDivider')}
									onChangeTablet={(value) => setMetaAttribute(value, 'transparentDividerTablet')}
									onChangeMobile={(value) => setMetaAttribute(value, 'transparentDividerMobile')}
								/>
							</KadencePanelBody>
						)}
						{context?.['kadence/headerIsSticky'] == '1' && (
							<KadencePanelBody
								title={__('Sticky Styles', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-navigation-sticky-styles'}
							>
								<SmallResponsiveControl
									label={__('Colors', 'kadence-blocks')}
									desktopChildren={styleColorControls('', 'Sticky')}
									tabletChildren={styleColorControls('Tablet', 'Sticky')}
									mobileChildren={styleColorControls('Mobile', 'Sticky')}
								></SmallResponsiveControl>
								<ResponsiveSingleBorderControl
									label={'Divider'}
									value={stickyDivider}
									tabletValue={stickyDividerTablet}
									mobileValue={stickyDividerMobile}
									onChange={(value) => setMetaAttribute(value, 'stickyDivider')}
									onChangeTablet={(value) => setMetaAttribute(value, 'stickyDividerTablet')}
									onChangeMobile={(value) => setMetaAttribute(value, 'stickyDividerMobile')}
								/>
							</KadencePanelBody>
						)}

						<KadencePanelBody
							title={__('Divider Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-navigation-divider'}
						>
							<ResponsiveSingleBorderControl
								label={'Divider'}
								value={divider}
								tabletValue={dividerTablet}
								mobileValue={dividerMobile}
								onChange={(value) => setMetaAttribute(value, 'divider')}
								onChangeTablet={(value) => setMetaAttribute(value, 'dividerTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'dividerMobile')}
							/>
						</KadencePanelBody>

						{showSettings('fontSettings', 'kadence/navigation') && (
							<KadencePanelBody
								title={__('Typography Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-btn-font-family'}
							>
								<TypographyControls
									fontSize={typography?.[0]?.size}
									onFontSize={(value) => saveTypography({ size: value })}
									fontSizeType={typography?.[0]?.sizeType}
									onFontSizeType={(value) => saveTypography({ sizeType: value })}
									lineHeight={typography?.[0]?.lineHeight}
									onLineHeight={(value) => saveTypography({ lineHeight: value })}
									lineHeightType={typography?.[0]?.lineType}
									onLineHeightType={(value) => saveTypography({ lineType: value })}
									reLetterSpacing={typography?.[0]?.letterSpacing}
									onLetterSpacing={(value) => saveTypography({ letterSpacing: value })}
									letterSpacingType={typography?.[0]?.letterType}
									onLetterSpacingType={(value) => saveTypography({ letterType: value })}
									textTransform={typography?.[0]?.textTransform}
									onTextTransform={(value) => saveTypography({ textTransform: value })}
									fontFamily={typography?.[0]?.family}
									onFontFamily={(value) => saveTypography({ family: value })}
									onFontChange={(select) => {
										saveTypography({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveTypography(values)}
									googleFont={typography?.[0]?.google}
									onGoogleFont={(value) => saveTypography({ google: value })}
									loadGoogleFont={typography?.[0]?.loadGoogle}
									onLoadGoogleFont={(value) => saveTypography({ loadGoogle: value })}
									fontVariant={typography?.[0]?.variant}
									onFontVariant={(value) => saveTypography({ variant: value })}
									fontWeight={typography?.[0]?.weight}
									onFontWeight={(value) => saveTypography({ weight: value })}
									fontStyle={typography?.[0]?.style}
									onFontStyle={(value) => saveTypography({ style: value })}
									fontSubset={typography?.[0]?.subset}
									onFontSubset={(value) => saveTypography({ subset: value })}
								/>
							</KadencePanelBody>
						)}
						<KadencePanelBody
							title={__('Sub Menu Styles', 'kadence-blocks')}
							panelName={'kb-navigation-style-sub-menus'}
							initialOpen={false}
						>
							<KadenceSubPanelBody title={__('Sub Menu Container', 'kadence-blocks')}>
								{previewOrientation != 'vertical' && (
									<>
										<ResponsiveSelectControl
											label={__('Reveal Animation', 'kadence-blocks')}
											value={dropdownReveal}
											tabletValue={dropdownRevealTablet}
											mobileValue={dropdownRevealMobile}
											options={[
												{ value: 'none', label: __('None') },
												{ value: 'fade', label: __('Fade') },
												{ value: 'fade-up', label: __('Fade Up') },
												{ value: 'fade-down', label: __('Fade Down') },
											]}
											onChange={(value) => setMetaAttribute(value, 'dropdownReveal')}
											onChangeTablet={(value) => setMetaAttribute(value, 'dropdownRevealTablet')}
											onChangeMobile={(value) => setMetaAttribute(value, 'dropdownRevealMobile')}
										/>

										<ResponsiveSelectControl
											label={__('Dropdown Horizontal Alignment', 'kadence-blocks')}
											value={dropdownHorizontalAlignment}
											tabletValue={dropdownHorizontalAlignmentTablet}
											mobileValue={dropdownHorizontalAlignmentMobile}
											options={[
												{ value: '', label: __('Left') },
												{ value: 'center', label: __('Center') },
												{ value: 'right', label: __('Right') },
											]}
											onChange={(value) => setMetaAttribute(value, 'dropdownHorizontalAlignment')}
											onChangeTablet={(value) =>
												setMetaAttribute(value, 'dropdownHorizontalAlignmentTablet')
											}
											onChangeMobile={(value) =>
												setMetaAttribute(value, 'dropdownHorizontalAlignmentMobile')
											}
										/>

										<ResponsiveRangeControls
											label={__('Dropdown Width', 'kadence-blocks')}
											value={dropdownWidth ? parseFloat(dropdownWidth) : ''}
											valueTablet={dropdownWidthTablet ? parseFloat(dropdownWidthTablet) : ''}
											valueMobile={dropdownWidthMobile ? parseFloat(dropdownWidthMobile) : ''}
											onChange={(value) => setMetaAttribute(value.toString(), 'dropdownWidth')}
											onChangeTablet={(value) =>
												setMetaAttribute(value.toString(), 'dropdownWidthTablet')
											}
											onChangeMobile={(value) =>
												setMetaAttribute(value.toString(), 'dropdownWidthMobile')
											}
											min={0}
											max={
												dropdownWidthUnit === 'em' || dropdownWidthUnit === 'rem'
													? 24
													: dropdownWidthUnit === 'px'
													? 2000
													: 100
											}
											step={dropdownWidthUnit === 'em' || dropdownWidthUnit === 'rem' ? 0.1 : 1}
											reset={() => setMetaAttribute('', 'dropdownWidth')}
											unit={dropdownWidthUnit}
											units={['em', 'rem', 'px', 'vw']}
											onUnit={(value) => setMetaAttribute(value, 'dropdownWidthUnit')}
											showUnit={true}
										/>
									</>
								)}
								<ResponsiveRangeControls
									label={__('Vertical Spacing', 'kadence-blocks')}
									value={dropdownVerticalSpacing ? parseFloat(dropdownVerticalSpacing) : ''}
									valueTablet={
										dropdownVerticalSpacingTablet ? parseFloat(dropdownVerticalSpacingTablet) : ''
									}
									valueMobile={
										dropdownVerticalSpacingMobile ? parseFloat(dropdownVerticalSpacingMobile) : ''
									}
									onChange={(value) => setMetaAttribute(value.toString(), 'dropdownVerticalSpacing')}
									onChangeTablet={(value) =>
										setMetaAttribute(value.toString(), 'dropdownVerticalSpacingTablet')
									}
									onChangeMobile={(value) =>
										setMetaAttribute(value.toString(), 'dropdownVerticalSpacingMobile')
									}
									min={0}
									max={
										dropdownVerticalSpacingUnit === 'em' || dropdownVerticalSpacingUnit === 'rem'
											? 24
											: dropdownVerticalSpacingUnit === 'px'
											? 200
											: 100
									}
									step={
										dropdownVerticalSpacingUnit === 'em' || dropdownVerticalSpacingUnit === 'rem'
											? 0.1
											: 1
									}
									reset={() => setMetaAttribute('', 'dropdownVerticalSpacing')}
									unit={dropdownVerticalSpacingUnit}
									units={['em', 'rem', 'px', 'vw']}
									onUnit={(value) => setMetaAttribute(value, 'dropdownVerticalSpacingUnit')}
									showUnit={true}
								/>
								<ResponsiveBorderControl
									label={__('Border', 'kadence-blocks')}
									value={dropdownBorder}
									tabletValue={dropdownBorderTablet}
									mobileValue={dropdownBorderMobile}
									onChange={(value) => setMetaAttribute(value, 'dropdownBorder')}
									onChangeTablet={(value) => setMetaAttribute(value, 'dropdownBorderTablet')}
									onChangeMobile={(value) => setMetaAttribute(value, 'dropdownBorderMobile')}
								/>
								<ResponsiveMeasurementControls
									label={__('Border Radius', 'kadence-blocks')}
									value={dropdownBorderRadius}
									tabletValue={dropdownBorderRadiusTablet}
									mobileValue={dropdownBorderRadiusMobile}
									onChange={(value) => setMetaAttribute(value, 'dropdownBorderRadius')}
									onChangeTablet={(value) => setMetaAttribute(value, 'dropdownBorderRadiusTablet')}
									onChangeMobile={(value) => setMetaAttribute(value, 'dropdownBorderRadiusMobile')}
									unit={dropdownBorderRadiusUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setMetaAttribute(value, 'dropdownBorderRadiusUnit')}
									max={
										dropdownBorderRadiusUnit === 'em' || dropdownBorderRadiusUnit === 'rem'
											? 24
											: 100
									}
									step={
										dropdownBorderRadiusUnit === 'em' || dropdownBorderRadiusUnit === 'rem'
											? 0.1
											: 1
									}
									min={0}
									isBorderRadius={true}
									allowEmpty={true}
								/>
								{previewOrientation != 'vertical' && (
									<BoxShadowControl
										label={__('Box Shadow', 'kadence-blocks')}
										enable={
											undefined !== dropdownShadow &&
											undefined !== dropdownShadow[0] &&
											undefined !== dropdownShadow[0].enable
												? dropdownShadow[0].enable
												: true
										}
										color={
											undefined !== dropdownShadow &&
											undefined !== dropdownShadow[0] &&
											undefined !== dropdownShadow[0].color
												? dropdownShadow[0].color
												: '#000000'
										}
										colorDefault={'#000000'}
										onArrayChange={(color, opacity) => {
											saveShadow({ color, opacity });
										}}
										opacity={
											undefined !== dropdownShadow &&
											undefined !== dropdownShadow[0] &&
											undefined !== dropdownShadow[0].opacity
												? dropdownShadow[0].opacity
												: 0.2
										}
										hOffset={
											undefined !== dropdownShadow &&
											undefined !== dropdownShadow[0] &&
											undefined !== dropdownShadow[0].hOffset
												? dropdownShadow[0].hOffset
												: 0
										}
										vOffset={
											undefined !== dropdownShadow &&
											undefined !== dropdownShadow[0] &&
											undefined !== dropdownShadow[0].vOffset
												? dropdownShadow[0].vOffset
												: 0
										}
										blur={
											undefined !== dropdownShadow &&
											undefined !== dropdownShadow[0] &&
											undefined !== dropdownShadow[0].blur
												? dropdownShadow[0].blur
												: 14
										}
										spread={
											undefined !== dropdownShadow &&
											undefined !== dropdownShadow[0] &&
											undefined !== dropdownShadow[0].spread
												? dropdownShadow[0].spread
												: 0
										}
										inset={
											undefined !== dropdownShadow &&
											undefined !== dropdownShadow[0] &&
											undefined !== dropdownShadow[0].inset
												? dropdownShadow[0].inset
												: false
										}
										onEnableChange={(value) => {
											saveShadow({ enable: value });
										}}
										onColorChange={(value) => {
											saveShadow({ color: value });
										}}
										onOpacityChange={(value) => {
											saveShadow({ opacity: value });
										}}
										onHOffsetChange={(value) => {
											saveShadow({ hOffset: value });
										}}
										onVOffsetChange={(value) => {
											saveShadow({ vOffset: value });
										}}
										onBlurChange={(value) => {
											saveShadow({ blur: value });
										}}
										onSpreadChange={(value) => {
											saveShadow({ spread: value });
										}}
										onInsetChange={(value) => {
											saveShadow({ inset: value });
										}}
									/>
								)}
								<ResponsiveMeasureRangeControl
									label={__('Padding', 'kadence-blocks')}
									value={paddingDropdown}
									tabletValue={tabletPaddingDropdown}
									mobileValue={mobilePaddingDropdown}
									onChange={(value) => {
										setMetaAttribute(value.map(String), 'paddingDropdown');
									}}
									onChangeTablet={(value) => {
										setMetaAttribute(value.map(String), 'tabletPaddingDropdown');
									}}
									onChangeMobile={(value) => {
										setMetaAttribute(value.map(String), 'mobilePaddingDropdown');
									}}
									min={0}
									max={
										paddingDropdownUnit === 'em' || paddingDropdownUnit === 'rem'
											? 24
											: paddingDropdownUnit === 'px'
											? 200
											: 100
									}
									step={paddingDropdownUnit === 'em' || paddingDropdownUnit === 'rem' ? 0.1 : 1}
									unit={paddingDropdownUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setMetaAttribute(value, 'paddingDropdownUnit')}
								/>
								<ResponsiveMeasureRangeControl
									label={__('Margin', 'kadence-blocks')}
									value={marginDropdown}
									tabletValue={tabletMarginDropdown}
									mobileValue={mobileMarginDropdown}
									onChange={(value) => {
										setMetaAttribute(value.map(String), 'marginDropdown');
									}}
									onChangeTablet={(value) => {
										setMetaAttribute(value.map(String), 'tabletMarginDropdown');
									}}
									onChangeMobile={(value) => {
										setMetaAttribute(value.map(String), 'mobileMarginDropdown');
									}}
									min={
										marginDropdownUnit === 'em' || marginDropdownUnit === 'rem'
											? -25
											: marginDropdownUnit === 'px'
											? -400
											: -100
									}
									max={
										marginDropdownUnit === 'em' || marginDropdownUnit === 'rem'
											? 24
											: marginDropdownUnit === 'px'
											? 200
											: 100
									}
									step={marginDropdownUnit === 'em' || marginDropdownUnit === 'rem' ? 0.1 : 1}
									unit={marginDropdownUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setMetaAttribute(value, 'marginDropdownUnit')}
								/>
							</KadenceSubPanelBody>
							<KadenceSubPanelBody title={__('Sub Menu Links', 'kadence-blocks')}>
								<SmallResponsiveControl
									label={__('Colors', 'kadence-blocks')}
									desktopChildren={styleColorControls('', 'Dropdown')}
									tabletChildren={styleColorControls('Tablet', 'Dropdown')}
									mobileChildren={styleColorControls('Mobile', 'Dropdown')}
								></SmallResponsiveControl>
								<ResponsiveSingleBorderControl
									label={'Divider'}
									value={dropdownDivider}
									tabletValue={dropdownDividerTablet}
									mobileValue={dropdownDividerMobile}
									onChange={(value) => setMetaAttribute(value, 'dropdownDivider')}
									onChangeTablet={(value) => setMetaAttribute(value, 'dropdownDividerTablet')}
									onChangeMobile={(value) => setMetaAttribute(value, 'dropdownDividerMobile')}
								/>
								<ResponsiveMeasureRangeControl
									label={__('Link Padding', 'kadence-blocks')}
									value={paddingDropdownLink}
									tabletValue={tabletPaddingDropdownLink}
									mobileValue={mobilePaddingDropdownLink}
									onChange={(value) => {
										setMetaAttribute(value.map(String), 'paddingDropdownLink');
									}}
									onChangeTablet={(value) => {
										setMetaAttribute(value.map(String), 'tabletPaddingDropdownLink');
									}}
									onChangeMobile={(value) => {
										setMetaAttribute(value.map(String), 'mobilePaddingDropdownLink');
									}}
									min={0}
									max={
										paddingDropdownLinkUnit === 'em' || paddingDropdownLinkUnit === 'rem'
											? 24
											: paddingDropdownLinkUnit === 'px'
											? 200
											: 100
									}
									step={
										paddingDropdownLinkUnit === 'em' || paddingDropdownLinkUnit === 'rem' ? 0.1 : 1
									}
									unit={paddingDropdownLinkUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setMetaAttribute(value, 'paddingDropdownLinkUnit')}
								/>
								<ResponsiveMeasureRangeControl
									label={__('Link Margin', 'kadence-blocks')}
									value={marginDropdownLink}
									tabletValue={tabletMarginDropdownLink}
									mobileValue={mobileMarginDropdownLink}
									onChange={(value) => {
										setMetaAttribute(value.map(String), 'marginDropdownLink');
									}}
									onChangeTablet={(value) => {
										setMetaAttribute(value.map(String), 'tabletMarginDropdownLink');
									}}
									onChangeMobile={(value) => {
										setMetaAttribute(value.map(String), 'mobileMarginDropdownLink');
									}}
									min={0}
									max={
										marginDropdownLinkUnit === 'em' || marginDropdownLinkUnit === 'rem'
											? 24
											: marginDropdownLinkUnit === 'px'
											? 200
											: 100
									}
									step={marginDropdownLinkUnit === 'em' || marginDropdownLinkUnit === 'rem' ? 0.1 : 1}
									unit={marginDropdownLinkUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setMetaAttribute(value, 'marginDropdownLinkUnit')}
								/>
								{showSettings('fontSettings', 'kadence/navigation') && (
									<KadencePanelBody
										title={__('Typography Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-adv-nav-sub-font'}
									>
										<TypographyControls
											fontSize={dropdownTypography?.[0]?.size}
											onFontSize={(value) => saveDropdownTypography({ size: value })}
											fontSizeType={dropdownTypography?.[0]?.sizeType}
											onFontSizeType={(value) => saveDropdownTypography({ sizeType: value })}
											lineHeight={dropdownTypography?.[0]?.lineHeight}
											onLineHeight={(value) => saveDropdownTypography({ lineHeight: value })}
											lineHeightType={dropdownTypography?.[0]?.lineType}
											onLineHeightType={(value) => saveDropdownTypography({ lineType: value })}
											reLetterSpacing={dropdownTypography?.[0]?.letterSpacing}
											onLetterSpacing={(value) =>
												saveDropdownTypography({ letterSpacing: value })
											}
											letterSpacingType={dropdownTypography?.[0]?.letterType}
											onLetterSpacingType={(value) =>
												saveDropdownTypography({ letterType: value })
											}
											textTransform={dropdownTypography?.[0]?.textTransform}
											onTextTransform={(value) =>
												saveDropdownTypography({ textTransform: value })
											}
											fontFamily={dropdownTypography?.[0]?.family}
											onFontFamily={(value) => saveDropdownTypography({ family: value })}
											onFontChange={(select) => {
												saveDropdownTypography({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => saveDropdownTypography(values)}
											googleFont={dropdownTypography?.[0]?.google}
											onGoogleFont={(value) => saveDropdownTypography({ google: value })}
											loadGoogleFont={dropdownTypography?.[0]?.loadGoogle}
											onLoadGoogleFont={(value) => saveDropdownTypography({ loadGoogle: value })}
											fontVariant={dropdownTypography?.[0]?.variant}
											onFontVariant={(value) => saveDropdownTypography({ variant: value })}
											fontWeight={dropdownTypography?.[0]?.weight}
											onFontWeight={(value) => saveDropdownTypography({ weight: value })}
											fontStyle={dropdownTypography?.[0]?.style}
											onFontStyle={(value) => saveDropdownTypography({ style: value })}
											fontSubset={dropdownTypography?.[0]?.subset}
											onFontSubset={(value) => saveDropdownTypography({ subset: value })}
										/>
									</KadencePanelBody>
								)}
							</KadenceSubPanelBody>
							<KadenceSubPanelBody title={__('Sub Menu Descriptions', 'kadence-blocks')}>
								{/* <ResponsiveSelectControl
									label={__('Align', 'kadence-blocks-pro')}
									value={dropdownDescriptionPositioning}
									tabletValue={dropdownDescriptionPositioningTablet}
									mobileValue={dropdownDescriptionPositioningMobile}
									options={[
										{ value: 'normal', label: __('Align with Title', 'kadence-blocks-pro') },
										{ value: 'icon', label: __('Align with Icon', 'kadence-blocks-pro') },
									]}
									tabletOptions={[
										{ value: '', label: __('Inherit', 'kadence-blocks-pro') },
										{ value: 'normal', label: __('Align with Title', 'kadence-blocks-pro') },
										{ value: 'icon', label: __('Align with Icon', 'kadence-blocks-pro') },
									]}
									onChange={(value) => setAttributes({ dropdownDescriptionPositioning: value })}
									onChangeTablet={(value) =>
										setAttributes({ dropdownDescriptionPositioningTablet: value })
									}
									onChangeMobile={(value) =>
										setAttributes({ dropdownDescriptionPositioningMobile: value })
									}
								/> */}
								<ResponsiveRangeControls
									label={__('Spacing from label', 'kadence-blocks')}
									value={dropdownDescriptionSpacing ? parseFloat(dropdownDescriptionSpacing) : ''}
									valueTablet={
										dropdownDescriptionSpacingTablet
											? parseFloat(dropdownDescriptionSpacingTablet)
											: ''
									}
									valueMobile={
										dropdownDescriptionSpacingMobile
											? parseFloat(dropdownDescriptionSpacingMobile)
											: ''
									}
									onChange={(value) =>
										setMetaAttribute(value.toString(), 'dropdownDescriptionSpacing')
									}
									onChangeTablet={(value) =>
										setMetaAttribute(value.toString(), 'dropdownDescriptionSpacingTablet')
									}
									onChangeMobile={(value) =>
										setMetaAttribute(value.toString(), 'dropdownDescriptionSpacingMobile')
									}
									min={0}
									max={
										dropdownDescriptionSpacingUnit === 'em' ||
										dropdownDescriptionSpacingUnit === 'rem'
											? 24
											: dropdownDescriptionSpacingUnit === 'px'
											? 2000
											: 100
									}
									step={
										dropdownDescriptionSpacingUnit === 'em' ||
										dropdownDescriptionSpacingUnit === 'rem'
											? 0.1
											: 1
									}
									reset={() => setMetaAttribute('', 'dropdownDescriptionSpacing')}
									unit={dropdownDescriptionSpacingUnit}
									units={['em', 'rem', 'px', 'vw']}
									onUnit={(value) => setMetaAttribute(value, 'dropdownDescriptionSpacingUnit')}
									showUnit={true}
								/>
								<SmallResponsiveControl
									label={__('Colors', 'kadence-blocks')}
									desktopChildren={styleDropdownDescriptionColorControls('', '')}
									tabletChildren={styleDropdownDescriptionColorControls('Tablet', '')}
									mobileChildren={styleDropdownDescriptionColorControls('Mobile', '')}
								></SmallResponsiveControl>

								{showSettings('fontSettings', 'kadence/navigation') && (
									<KadencePanelBody
										title={__('Typography Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-nav-desc-font'}
									>
										<TypographyControls
											fontSize={dropdownDescriptionTypography?.[0]?.size}
											onFontSize={(value) => saveDropdownDescriptionTypography({ size: value })}
											fontSizeType={dropdownDescriptionTypography?.[0]?.sizeType}
											onFontSizeType={(value) =>
												saveDropdownDescriptionTypography({ sizeType: value })
											}
											lineHeight={dropdownDescriptionTypography?.[0]?.lineHeight}
											onLineHeight={(value) =>
												saveDropdownDescriptionTypography({ lineHeight: value })
											}
											lineHeightType={dropdownDescriptionTypography?.[0]?.lineType}
											onLineHeightType={(value) =>
												saveDropdownDescriptionTypography({ lineType: value })
											}
											reLetterSpacing={dropdownDescriptionTypography?.[0]?.letterSpacing}
											onLetterSpacing={(value) =>
												saveDropdownDescriptionTypography({ letterSpacing: value })
											}
											letterSpacingType={dropdownDescriptionTypography?.[0]?.letterType}
											onLetterSpacingType={(value) =>
												saveDropdownDescriptionTypography({ letterType: value })
											}
											textTransform={dropdownDescriptionTypography?.[0]?.textTransform}
											onTextTransform={(value) =>
												saveDropdownDescriptionTypography({ textTransform: value })
											}
											fontFamily={dropdownDescriptionTypography?.[0]?.family}
											onFontFamily={(value) =>
												saveDropdownDescriptionTypography({ family: value })
											}
											onFontChange={(select) => {
												saveDropdownDescriptionTypography({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => saveDropdownDescriptionTypography(values)}
											googleFont={dropdownDescriptionTypography?.[0]?.google}
											onGoogleFont={(value) =>
												saveDropdownDescriptionTypography({ google: value })
											}
											loadGoogleFont={dropdownDescriptionTypography?.[0]?.loadGoogle}
											onLoadGoogleFont={(value) =>
												saveDropdownDescriptionTypography({ loadGoogle: value })
											}
											fontVariant={dropdownDescriptionTypography?.[0]?.variant}
											onFontVariant={(value) =>
												saveDropdownDescriptionTypography({ variant: value })
											}
											fontWeight={dropdownDescriptionTypography?.[0]?.weight}
											onFontWeight={(value) =>
												saveDropdownDescriptionTypography({ weight: value })
											}
											fontStyle={dropdownDescriptionTypography?.[0]?.style}
											onFontStyle={(value) => saveDropdownDescriptionTypography({ style: value })}
											fontSubset={dropdownDescriptionTypography?.[0]?.subset}
											onFontSubset={(value) =>
												saveDropdownDescriptionTypography({ subset: value })
											}
										/>
									</KadencePanelBody>
								)}
							</KadenceSubPanelBody>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Description Styles', 'kadence-blocks')}
							panelName={'kb-navigation-style-description'}
							initialOpen={false}
						>
							{/* <ResponsiveSelectControl
								label={__('Align', 'kadence-blocks-pro')}
								value={descriptionPositioning}
								tabletValue={descriptionPositioningTablet}
								mobileValue={descriptionPositioningMobile}
								options={[
									{ value: 'normal', label: __('Align with Title', 'kadence-blocks-pro') },
									{ value: 'icon', label: __('Align with Icon', 'kadence-blocks-pro') },
								]}
								tabletOptions={[
									{ value: '', label: __('Inherit', 'kadence-blocks-pro') },
									{ value: 'normal', label: __('Align with Title', 'kadence-blocks-pro') },
									{ value: 'icon', label: __('Align with Icon', 'kadence-blocks-pro') },
								]}
								onChange={(value) => setAttributes({ descriptionPositioning: value })}
								onChangeTablet={(value) => setAttributes({ descriptionPositioningTablet: value })}
								onChangeMobile={(value) => setAttributes({ descriptionPositioningMobile: value })}
							/> */}
							<ResponsiveRangeControls
								label={__('Spacing from label', 'kadence-blocks')}
								value={descriptionSpacing ? parseFloat(descriptionSpacing) : ''}
								valueTablet={descriptionSpacingTablet ? parseFloat(descriptionSpacingTablet) : ''}
								valueMobile={descriptionSpacingMobile ? parseFloat(descriptionSpacingMobile) : ''}
								onChange={(value) => setMetaAttribute(value.toString(), 'descriptionSpacing')}
								onChangeTablet={(value) =>
									setMetaAttribute(value.toString(), 'descriptionSpacingTablet')
								}
								onChangeMobile={(value) =>
									setMetaAttribute(value.toString(), 'descriptionSpacingMobile')
								}
								min={0}
								max={
									descriptionSpacingUnit === 'em' || descriptionSpacingUnit === 'rem'
										? 24
										: descriptionSpacingUnit === 'px'
										? 2000
										: 100
								}
								step={descriptionSpacingUnit === 'em' || descriptionSpacingUnit === 'rem' ? 0.1 : 1}
								reset={() => setMetaAttribute('', 'descriptionSpacing')}
								unit={descriptionSpacingUnit}
								units={['em', 'rem', 'px', 'vw']}
								onUnit={(value) => setMetaAttribute(value, 'descriptionSpacingUnit')}
								showUnit={true}
							/>
							<SmallResponsiveControl
								label={__('Colors', 'kadence-blocks')}
								desktopChildren={styleDescriptionColorControls('', '')}
								tabletChildren={styleDescriptionColorControls('Tablet', '')}
								mobileChildren={styleDescriptionColorControls('Mobile', '')}
							></SmallResponsiveControl>

							{showSettings('fontSettings', 'kadence/navigation') && (
								<KadencePanelBody
									title={__('Typography Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-nav-desc-font'}
								>
									<TypographyControls
										fontSize={descriptionTypography?.[0]?.size}
										onFontSize={(value) => saveDescriptionTypography({ size: value })}
										fontSizeType={descriptionTypography?.[0]?.sizeType}
										onFontSizeType={(value) => saveDescriptionTypography({ sizeType: value })}
										lineHeight={descriptionTypography?.[0]?.lineHeight}
										onLineHeight={(value) => saveDescriptionTypography({ lineHeight: value })}
										lineHeightType={descriptionTypography?.[0]?.lineType}
										onLineHeightType={(value) => saveDescriptionTypography({ lineType: value })}
										reLetterSpacing={descriptionTypography?.[0]?.letterSpacing}
										onLetterSpacing={(value) => saveDescriptionTypography({ letterSpacing: value })}
										letterSpacingType={descriptionTypography?.[0]?.letterType}
										onLetterSpacingType={(value) =>
											saveDescriptionTypography({ letterType: value })
										}
										textTransform={descriptionTypography?.[0]?.textTransform}
										onTextTransform={(value) => saveDescriptionTypography({ textTransform: value })}
										fontFamily={descriptionTypography?.[0]?.family}
										onFontFamily={(value) => saveDescriptionTypography({ family: value })}
										onFontChange={(select) => {
											saveDescriptionTypography({
												family: select.value,
												google: select.google,
											});
										}}
										onFontArrayChange={(values) => saveDescriptionTypography(values)}
										googleFont={descriptionTypography?.[0]?.google}
										onGoogleFont={(value) => saveDescriptionTypography({ google: value })}
										loadGoogleFont={descriptionTypography?.[0]?.loadGoogle}
										onLoadGoogleFont={(value) => saveDescriptionTypography({ loadGoogle: value })}
										fontVariant={descriptionTypography?.[0]?.variant}
										onFontVariant={(value) => saveDescriptionTypography({ variant: value })}
										fontWeight={descriptionTypography?.[0]?.weight}
										onFontWeight={(value) => saveDescriptionTypography({ weight: value })}
										fontStyle={descriptionTypography?.[0]?.style}
										onFontStyle={(value) => saveDescriptionTypography({ style: value })}
										fontSubset={descriptionTypography?.[0]?.subset}
										onFontSubset={(value) => saveDescriptionTypography({ subset: value })}
									/>
								</KadencePanelBody>
							)}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-navigation-padding'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
								tabletValue={tabletPadding}
								mobileValue={mobilePadding}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'padding');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletPadding');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobilePadding');
								}}
								min={0}
								max={
									paddingUnit === 'em' || paddingUnit === 'rem'
										? 24
										: paddingUnit === 'px'
										? 200
										: 100
								}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'paddingUnit')}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={margin}
								tabletValue={tabletMargin}
								mobileValue={mobileMargin}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'margin');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletMargin');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobileMargin');
								}}
								min={
									marginUnit === 'em' || marginUnit === 'rem'
										? -25
										: marginUnit === 'px'
										? -400
										: -100
								}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : marginUnit === 'px' ? 200 : 100}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'marginUnit')}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Nav Link Padding', 'kadence-blocks')}
								value={paddingLink}
								tabletValue={tabletPaddingLink}
								mobileValue={mobilePaddingLink}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'paddingLink');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletPaddingLink');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobilePaddingLink');
								}}
								min={0}
								max={
									paddingLinkUnit === 'em' || paddingLinkUnit === 'rem'
										? 24
										: paddingLinkUnit === 'px'
										? 200
										: 100
								}
								step={paddingLinkUnit === 'em' || paddingLinkUnit === 'rem' ? 0.1 : 1}
								unit={paddingLinkUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'linkPaddinggUnit')}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Nav Link Margin', 'kadence-blocks')}
								value={marginLink}
								tabletValue={tabletMarginLink}
								mobileValue={mobileMarginLink}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'marginLink');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletMarginLink');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobileMarginLink');
								}}
								min={0}
								max={
									marginLinkUnit === 'em' || marginLinkUnit === 'rem'
										? 24
										: marginLinkUnit === 'px'
										? 200
										: 100
								}
								step={marginLinkUnit === 'em' || marginLinkUnit === 'rem' ? 0.1 : 1}
								unit={marginLinkUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'marginLinkUnit')}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					__nextHasNoMarginBottom
					className="html-anchor-control"
					label={__('HTML anchor')}
					help={
						<>
							{__(
								'Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page.'
							)}

							<ExternalLink href={__('https://wordpress.org/documentation/article/page-jumps/')}>
								{__('Learn more about anchors')}
							</ExternalLink>
						</>
					}
					value={anchor}
					placeholder={__('Add an anchor')}
					onChange={(nextValue) => {
						nextValue = nextValue.replace(ANCHOR_REGEX, '-');
						setMetaAttribute(nextValue, 'anchor');
					}}
					autoCapitalize="none"
					autoComplete="off"
				/>

				<TextControl
					__nextHasNoMarginBottom
					autoComplete="off"
					label={__('Additional CSS class(es)')}
					value={className}
					onChange={(nextValue) => {
						setMetaAttribute(nextValue !== '' ? nextValue : undefined, 'className');
					}}
					help={__('Separate multiple classes with spaces.')}
				/>
			</InspectorAdvancedControls>
			<nav className={navClasses}>
				<div className="menu-container">
					<ul {...innerBlocksProps} />
					{(isSelected || childSelected) && navAppender()}
				</div>
			</nav>
			{/*<SpacingVisualizer*/}
			{/*	style={ {*/}
			{/*		marginLeft: ( undefined !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),*/}
			{/*		marginRight: ( undefined !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),*/}
			{/*		marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),*/}
			{/*		marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),*/}
			{/*	} }*/}
			{/*	type="inside"*/}
			{/*	forceShow={ paddingMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewPaddingTop, paddingUnit ), getSpacingOptionOutput( previewPaddingRight, paddingUnit ), getSpacingOptionOutput( previewPaddingBottom, paddingUnit ), getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) ] }*/}
			{/*/>*/}
			{/*<SpacingVisualizer*/}
			{/*	type="inside"*/}
			{/*	forceShow={ marginMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewMarginTop, marginUnit ), getSpacingOptionOutput( previewMarginRight, marginUnit ), getSpacingOptionOutput( previewMarginBottom, marginUnit ), getSpacingOptionOutput( previewMarginLeft, marginUnit ) ] }*/}
			{/*/>*/}

			{typography?.[0]?.google && (
				<KadenceWebfontLoader typography={typography} clientId={clientId} id={'typography'} />
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
export default EditInner;

function useNavigationProp(prop) {
	return useEntityProp('postType', 'kadence_navigation', prop);
}

function useNavigationMeta(key) {
	const [meta, setMeta] = useNavigationProp('meta');

	return [
		meta[key],
		useCallback(
			(newValue) => {
				setMeta({ ...meta, [key]: newValue });
			},
			[key, setMeta]
		),
	];
}
