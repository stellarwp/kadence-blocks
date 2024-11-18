import { KadenceBlocksCSS, getPreviewSize, useEditorElement } from '@kadence/helpers';
import { useRef } from '@wordpress/element';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, currentRef, subMenuRef, showSubMenusWithLogic, context } = props;

	const {
		uniqueID,
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
		paddingDropdownLink,
		tabletPaddingDropdownLink,
		mobilePaddingDropdownLink,
		paddingDropdownLinkUnit,
		marginDropdownLink,
		tabletMarginDropdownLink,
		mobileMarginDropdownLink,
		marginDropdownLinkUnit,
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
		highlightSideTablet,
		highlightSideMobile,
		iconSide,
		iconSideTablet,
		iconSideMobile,
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
		megaMenuWidthTablet,
		megaMenuWidthMobile,
		megaMenuCustomWidth,
		megaMenuCustomWidthTablet,
		megaMenuCustomWidthMobile,
		megaMenuCustomWidthUnit,
		typography,
		highlightTypography,
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
		mediaIcon,
		mediaImage,
		mediaStyle,
		mediaAlign,
		mediaAlignTablet,
		mediaAlignMobile,
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
		descriptionColor,
		descriptionColorTablet,
		descriptionColorMobile,
		descriptionColorHover,
		descriptionColorHoverTablet,
		descriptionColorHoverMobile,
		descriptionColorActive,
		descriptionColorActiveTablet,
		descriptionColorActiveMobile,
		descriptionTypography,
		description,
		descriptionPositioning,
		descriptionPositioningTablet,
		descriptionPositioningMobile,
		dropdownDescriptionSpacing,
		dropdownDescriptionSpacingTablet,
		dropdownDescriptionSpacingMobile,
		dropdownDescriptionSpacingUnit,
		dropdownDescriptionColor,
		dropdownDescriptionColorTablet,
		dropdownDescriptionColorMobile,
		dropdownDescriptionColorHover,
		dropdownDescriptionColorHoverTablet,
		dropdownDescriptionColorHoverMobile,
		dropdownDescriptionColorActive,
		dropdownDescriptionColorActiveTablet,
		dropdownDescriptionColorActiveMobile,
		dropdownDescriptionTypography,
		dropdownDescription,
		dropdownDescriptionPositioning,
		dropdownDescriptionPositioningTablet,
		dropdownDescriptionPositioningMobile,
		isMegaMenu,
		align,
		alignTablet,
		alignMobile,
		border,
		borderHover,
		borderActive,
		borderTablet,
		borderHoverTablet,
		borderActiveTablet,
		borderMobile,
		borderHoverMobile,
		borderActiveMobile,
		borderRadius,
		borderRadiusHover,
		borderRadiusActive,
		borderRadiusTablet,
		borderRadiusHoverTablet,
		borderRadiusActiveTablet,
		borderRadiusMobile,
		borderRadiusHoverMobile,
		borderRadiusActiveMobile,
		borderRadiusUnit,
		borderRadiusUnitHover,
		borderRadiusUnitActive,
		shadow,
		shadowHover,
		shadowActive,
		backgroundType,
		backgroundTypeHover,
		backgroundTypeActive,
		backgroundGradient,
		backgroundGradientHover,
		backgroundGradientActive,
		imageRatio,
		mediaBorder,
		mediaBorderTablet,
		mediaBorderMobile,
		mediaBorderHover,
		mediaBorderHoverTablet,
		mediaBorderHoverMobile,
		mediaBorderActive,
		mediaBorderActiveTablet,
		mediaBorderActiveMobile,
		mediaBorderRadius,
		mediaBorderRadiusTablet,
		mediaBorderRadiusMobile,
		mediaBorderRadiusHover,
		mediaBorderRadiusHoverTablet,
		mediaBorderRadiusHoverMobile,
		mediaBorderRadiusActive,
		mediaBorderRadiusActiveTablet,
		mediaBorderRadiusActiveMobile,
		mediaBorderRadiusUnit,
		mediaBorderRadiusUnitHover,
		mediaBorderRadiusUnitActive,
		mediaColor,
		mediaColorHover,
		mediaColorActive,
		mediaColorTablet,
		mediaColorHoverTablet,
		mediaColorActiveTablet,
		mediaColorMobile,
		mediaColorHoverMobile,
		mediaColorActiveMobile,
		mediaBackground,
		mediaBackgroundHover,
		mediaBackgroundActive,
		mediaBackgroundTablet,
		mediaBackgroundHoverTablet,
		mediaBackgroundActiveTablet,
		mediaBackgroundMobile,
		mediaBackgroundHoverMobile,
		mediaBackgroundActiveMobile,
		mediaBackgroundType,
		mediaBackgroundTypeHover,
		mediaBackgroundTypeActive,
		mediaBackgroundGradient,
		mediaBackgroundGradientHover,
		mediaBackgroundGradientActive,
		dropdownHorizontalAlignment,
		dropdownHorizontalAlignmentTablet,
		dropdownHorizontalAlignmentMobile,
	} = attributes;

	const editorElement = useEditorElement(currentRef, []);
	const editorWidth = editorElement?.clientWidth;
	const subMenuHeight = subMenuRef?.clientHeight ? subMenuRef.clientHeight : subMenuRef?.current?.clientHeight;

	const isFEIcon = 'fe' === mediaIcon[0].icon.substring(0, 2);

	const previewAlign = getPreviewSize(previewDevice, align, alignTablet, alignMobile);
	const previewBackgroundActive = getPreviewSize(
		previewDevice,
		backgroundActive,
		backgroundActiveTablet,
		backgroundActiveMobile
	);
	const previewLinkColor = getPreviewSize(previewDevice, linkColor, linkColorTablet, linkColorMobile);
	const previewLinkColorHover = getPreviewSize(
		previewDevice,
		linkColorHover,
		linkColorHoverTablet,
		linkColorHoverMobile
	);
	const previewLinkColorActive = getPreviewSize(
		previewDevice,
		linkColorActive,
		linkColorActiveTablet,
		linkColorActiveMobile
	);
	const previewLinkColorDropdown = getPreviewSize(
		previewDevice,
		linkColorDropdown,
		linkColorDropdownTablet,
		linkColorDropdownMobile
	);
	const previewLinkColorDropdownHover = getPreviewSize(
		previewDevice,
		linkColorDropdownHover,
		linkColorDropdownHoverTablet,
		linkColorDropdownHoverMobile
	);
	const previewLinkColorDropdownActive = getPreviewSize(
		previewDevice,
		linkColorDropdownActive,
		linkColorDropdownActiveTablet,
		linkColorDropdownActiveMobile
	);
	const previewLinkColorTransparent = getPreviewSize(
		previewDevice,
		linkColorTransparent,
		linkColorTransparentTablet,
		linkColorTransparentMobile
	);
	const previewLinkColorTransparentHover = getPreviewSize(
		previewDevice,
		linkColorTransparentHover,
		linkColorTransparentHoverTablet,
		linkColorTransparentHoverMobile
	);
	const previewLinkColorTransparentActive = getPreviewSize(
		previewDevice,
		linkColorTransparentActive,
		linkColorTransparentActiveTablet,
		linkColorTransparentActiveMobile
	);
	const previewLinkColorSticky = getPreviewSize(
		previewDevice,
		linkColorSticky,
		linkColorStickyTablet,
		linkColorStickyMobile
	);
	const previewLinkColorStickyHover = getPreviewSize(
		previewDevice,
		linkColorStickyHover,
		linkColorStickyHoverTablet,
		linkColorStickyHoverMobile
	);
	const previewLinkColorStickyActive = getPreviewSize(
		previewDevice,
		linkColorStickyActive,
		linkColorStickyActiveTablet,
		linkColorStickyActiveMobile
	);

	const previewBackgroundTransparent = getPreviewSize(
		previewDevice,
		backgroundTransparent,
		backgroundTransparentTablet,
		backgroundTransparentMobile
	);
	const previewBackgroundTransparentHover = getPreviewSize(
		previewDevice,
		backgroundTransparentHover,
		backgroundTransparentHoverTablet,
		backgroundTransparentHoverMobile
	);
	const previewBackgroundTransparentActive = getPreviewSize(
		previewDevice,
		backgroundTransparentActive,
		backgroundTransparentActiveTablet,
		backgroundTransparentActiveMobile
	);
	const previewBackgroundSticky = getPreviewSize(
		previewDevice,
		backgroundSticky,
		backgroundStickyTablet,
		backgroundStickyMobile
	);
	const previewBackgroundStickyHover = getPreviewSize(
		previewDevice,
		backgroundStickyHover,
		backgroundStickyHoverTablet,
		backgroundStickyHoverMobile
	);
	const previewBackgroundStickyActive = getPreviewSize(
		previewDevice,
		backgroundStickyActive,
		backgroundStickyActiveTablet,
		backgroundStickyActiveMobile
	);
	const previewLabelColor = getPreviewSize(previewDevice, labelColor, labelColorTablet, labelColorMobile);
	const previewLabelColorHover = getPreviewSize(
		previewDevice,
		labelColorHover,
		labelColorHoverTablet,
		labelColorHoverMobile
	);
	const previewLabelColorActive = getPreviewSize(
		previewDevice,
		labelColorActive,
		labelColorActiveTablet,
		labelColorActiveMobile
	);
	const previewLabelBackground = getPreviewSize(
		previewDevice,
		labelBackground,
		labelBackgroundTablet,
		labelBackgroundMobile
	);
	const previewLabelBackgroundHover = getPreviewSize(
		previewDevice,
		labelBackgroundHover,
		labelBackgroundHoverTablet,
		labelBackgroundHoverMobile
	);
	const previewLabelBackgroundActive = getPreviewSize(
		previewDevice,
		labelBackgroundActive,
		labelBackgroundActiveTablet,
		labelBackgroundActiveMobile
	);
	const previewBackgroundDropdown = getPreviewSize(
		previewDevice,
		backgroundDropdown,
		backgroundDropdownTablet,
		backgroundDropdownMobile
	);
	const previewBackgroundDropdownHover = getPreviewSize(
		previewDevice,
		backgroundDropdownHover,
		backgroundDropdownHoverTablet,
		backgroundDropdownHoverMobile
	);
	const previewBackgroundDropdownActive = getPreviewSize(
		previewDevice,
		backgroundDropdownActive,
		backgroundDropdownActiveTablet,
		backgroundDropdownActiveMobile
	);
	const previewDropdownDivider = getPreviewSize(
		previewDevice,
		dropdownDivider,
		dropdownDividerTablet,
		dropdownDividerMobile
	);
	const previewDropdownVerticalSpacing = getPreviewSize(
		previewDevice,
		dropdownVerticalSpacing,
		dropdownVerticalSpacingTablet,
		dropdownVerticalSpacingMobile
	);
	const previewDropdownWidth = getPreviewSize(previewDevice, dropdownWidth, dropdownWidthTablet, dropdownWidthMobile);

	const previewMediaStyleMargin = getPreviewSize(
		previewDevice,
		mediaStyle[0].margin,
		mediaStyle[0].marginTablet,
		mediaStyle[0].marginMobile
	);
	const previewMediaStyleColor = getPreviewSize(
		previewDevice,
		mediaStyle[0].color,
		mediaStyle[0].colorTablet,
		mediaStyle[0].colorMobile
	);
	const previewMediaStyleColorHover = getPreviewSize(
		previewDevice,
		mediaStyle[0].colorHover,
		mediaStyle[0].colorHoverTablet,
		mediaStyle[0].colorHoverMobile
	);
	const previewMediaStyleColorActive = getPreviewSize(
		previewDevice,
		mediaStyle[0].colorActive,
		mediaStyle[0].colorActiveTablet,
		mediaStyle[0].colorActiveMobile
	);
	const previewMediaStyleBackground = getPreviewSize(
		previewDevice,
		mediaStyle[0].background,
		mediaStyle[0].backgroundTablet,
		mediaStyle[0].backgroundMobile
	);
	const previewMediaStyleBackgroundHover = getPreviewSize(
		previewDevice,
		mediaStyle[0].backgroundHover,
		mediaStyle[0].backgroundHoverTablet,
		mediaStyle[0].backgroundHoverMobile
	);
	const previewMediaStyleBackgroundActive = getPreviewSize(
		previewDevice,
		mediaStyle[0].backgroundActive,
		mediaStyle[0].backgroundActiveTablet,
		mediaStyle[0].backgroundActiveMobile
	);
	const previewMediaStyleBorderRadius = getPreviewSize(
		previewDevice,
		mediaStyle[0].borderRadius,
		mediaStyle[0].borderRadiusTablet,
		mediaStyle[0].borderRadiusMobile
	);
	const previewMediaIconSize = getPreviewSize(
		previewDevice,
		mediaIcon[0].size,
		mediaIcon[0].sizeTablet,
		mediaIcon[0].sizeMobile
	);
	// const previewMediaIconWidth = getPreviewSize(
	// 	previewDevice,
	// 	mediaIcon[0].width,
	// 	mediaIcon[0].widthTablet,
	// 	mediaIcon[0].widthMobile
	// );
	const previewHighlightLabelGap = getPreviewSize(
		previewDevice,
		highlightSpacing[0].gap[0],
		highlightSpacing[0].gap[1],
		highlightSpacing[0].gap[2]
	);
	const previewHighlightLabelTextGap = getPreviewSize(
		previewDevice,
		highlightSpacing[0]?.textGap?.[0],
		highlightSpacing[0]?.textGap?.[1],
		highlightSpacing[0]?.textGap?.[2]
	);

	const previewHighlightSide = getPreviewSize(previewDevice, highlightSide, highlightSideTablet, highlightSideMobile);
	const previewIconSide = getPreviewSize(previewDevice, iconSide, iconSideTablet, iconSideMobile);
	const previewMediaAlign = getPreviewSize(previewDevice, mediaAlign, mediaAlignTablet, mediaAlignMobile);

	const previewDescriptionSpacing = getPreviewSize(
		previewDevice,
		descriptionSpacing,
		descriptionSpacingTablet,
		descriptionSpacingMobile
	);
	const previewDescriptionColor = getPreviewSize(
		previewDevice,
		descriptionColor,
		descriptionColorTablet,
		descriptionColorMobile
	);
	const previewDescriptionColorHover = getPreviewSize(
		previewDevice,
		descriptionColorHover,
		descriptionColorHoverTablet,
		descriptionColorHoverMobile
	);
	const previewDescriptionColorActive = getPreviewSize(
		previewDevice,
		descriptionColorActive,
		descriptionColorActiveTablet,
		descriptionColorActiveMobile
	);
	const previewDescriptionPositioning = getPreviewSize(
		previewDevice,
		descriptionPositioning,
		descriptionPositioningTablet,
		descriptionPositioningMobile
	);
	const previewDropdownDescriptionSpacing = getPreviewSize(
		previewDevice,
		dropdownDescriptionSpacing,
		dropdownDescriptionSpacingTablet,
		dropdownDescriptionSpacingMobile
	);
	const previewDropdownDescriptionColor = getPreviewSize(
		previewDevice,
		dropdownDescriptionColor,
		dropdownDescriptionColorTablet,
		dropdownDescriptionColorMobile
	);
	const previewDropdownDescriptionColorHover = getPreviewSize(
		previewDevice,
		dropdownDescriptionColorHover,
		dropdownDescriptionColorHoverTablet,
		dropdownDescriptionColorHoverMobile
	);
	const previewDropdownDescriptionColorActive = getPreviewSize(
		previewDevice,
		dropdownDescriptionColorActive,
		dropdownDescriptionColorActiveTablet,
		dropdownDescriptionColorActiveMobile
	);
	const previewDropdownDescriptionPositioning = getPreviewSize(
		previewDevice,
		dropdownDescriptionPositioning,
		dropdownDescriptionPositioningTablet,
		dropdownDescriptionPositioningMobile
	);

	const previewMegaMenuWidth = getPreviewSize(previewDevice, megaMenuWidth, megaMenuWidthTablet, megaMenuWidthMobile);

	const previewMegaMenuCustomWidth = getPreviewSize(
		previewDevice,
		megaMenuCustomWidth,
		megaMenuCustomWidthTablet,
		megaMenuCustomWidthMobile
	);
	const previewDropdownHorizontalAlignment = getPreviewSize(
		previewDevice,
		dropdownHorizontalAlignment,
		dropdownHorizontalAlignmentTablet,
		dropdownHorizontalAlignmentMobile
	);
	const css = new KadenceBlocksCSS();

	let imageRatioPadding = isNaN(mediaImage[0].height)
		? undefined
		: (mediaImage[0].height / mediaImage[0].width) * 100 + '%';
	let imageRatioHeight = isNaN(mediaImage[0].height) ? undefined : 0;
	let hasRatio = false;
	if (imageRatio && 'inherit' !== imageRatio) {
		hasRatio = true;
		imageRatioHeight = 0;
		switch (imageRatio) {
			case 'land43':
				imageRatioPadding = '75%';
				break;
			case 'land32':
				imageRatioPadding = '66.67%';
				break;
			case 'land169':
				imageRatioPadding = '56.25%';
				break;
			case 'land21':
				imageRatioPadding = '50%';
				break;
			case 'land31':
				imageRatioPadding = '33%';
				break;
			case 'land41':
				imageRatioPadding = '25%';
				break;
			case 'port34':
				imageRatioPadding = '133.33%';
				break;
			case 'port23':
				imageRatioPadding = '150%';
				break;
			default:
				imageRatioPadding = '100%';
				break;
		}
	}

	//no added specificty needed for these variables
	//these variable will slot into selectors found in the static stylesheet.
	css.set_selector(`.kb-nav-link-${uniqueID}`);
	css.render_measure_output(
		paddingDropdown,
		tabletPaddingDropdown,
		mobilePaddingDropdown,
		previewDevice,
		'--kb-nav-dropdown-padding',
		paddingDropdownUnit
	);
	css.render_measure_output(
		marginDropdown,
		tabletMarginDropdown,
		mobileMarginDropdown,
		previewDevice,
		'--kb-nav-dropdown-margin',
		marginDropdownUnit
	);
	css.render_measure_output(
		paddingDropdownLink,
		tabletPaddingDropdownLink,
		mobilePaddingDropdownLink,
		previewDevice,
		'--kb-nav-dropdown-link-padding',
		paddingDropdownLinkUnit
	);
	css.render_measure_output(
		marginDropdownLink,
		tabletMarginDropdownLink,
		mobileMarginDropdownLink,
		previewDevice,
		'--kb-nav-dropdown-link-margin',
		marginDropdownLinkUnit
	);
	css.render_measure_output(
		mediaStyle?.[0]?.padding,
		mediaStyle?.[0]?.paddingTablet,
		mediaStyle?.[0]?.paddingMobile,
		previewDevice,
		'--kb-nav-link-media-container-padding',
		mediaStyle[0].paddingType,
		{
			first_prop: '--kb-nav-link-media-container-padding-top',
			second_prop: '--kb-nav-link-media-container-padding-right',
			third_prop: '--kb-nav-link-media-container-padding-bottom',
			fourth_prop: '--kb-nav-link-media-container-padding-left',
		}
	);
	css.add_property(
		'--kb-nav-dropdown-link-color',
		css.render_color(previewLinkColorDropdown),
		previewLinkColorDropdown
	);
	css.add_property(
		'--kb-nav-dropdown-link-color-hover',
		css.render_color(previewLinkColorDropdownHover),
		previewLinkColorDropdownHover
	);
	css.add_property(
		'--kb-nav-dropdown-link-color-active',
		css.render_color(previewLinkColorDropdownActive),
		previewLinkColorDropdownActive
	);
	css.add_property(
		'--kb-nav-dropdown-link-color-active-ancestor',
		css.render_color(previewLinkColorDropdownActive),
		previewLinkColorDropdownActive
	);
	if (dropdownShadow?.[0]?.enable) {
		css.add_property('--kb-nav-dropdown-box-shadow', css.render_shadow(dropdownShadow[0]));
	}
	css.add_property('--kb-nav-dropdown-background', css.render_color(previewBackgroundDropdown));

	css.add_property('--kb-nav-dropdown-link-background-hover', css.render_color(previewBackgroundDropdownHover));
	css.add_property('--kb-nav-dropdown-link-background-active', css.render_color(previewBackgroundDropdownActive));
	css.add_property('--kb-nav-dropdown-link-width', previewDropdownWidth + dropdownWidthUnit, previewDropdownWidth);
	css.add_property(
		'--kb-nav-dropdown-link-padding-top',
		css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit)
	);
	css.add_property(
		'--kb-nav-dropdown-link-padding-bottom',
		css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit)
	);
	css.add_property(
		'--kb-nav-link-color-active-ancestor',
		css.render_color(previewLinkColorActive),
		previewLinkColorActive
	);
	css.add_property(
		'--kb-nav-dropdown-link-description-padding-top',
		css.render_size(previewDropdownDescriptionSpacing, dropdownDescriptionSpacingUnit)
	);
	css.add_property('--kb-nav-dropdown-link-description-color', css.render_color(previewDropdownDescriptionColor));
	css.add_property(
		'--kb-nav-dropdown-link-description-color-hover',
		css.render_color(previewDropdownDescriptionColorHover)
	);
	css.add_property(
		'--kb-nav-dropdown-link-description-color-active',
		css.render_color(previewDropdownDescriptionColorActive)
	);
	css.add_property(
		'--kb-nav-link-dropdown-description-color-active-ancestor',
		css.render_color(previewDropdownDescriptionColorActive)
	);
	if (previewDropdownHorizontalAlignment == 'center') {
		css.add_property('--kb-nav-dropdown-show-left', '50%');
		css.add_property('--kb-nav-dropdown-show-right', 'unset');
		css.add_property('--kb-nav-dropdown-show-transform-x', '-50%');
		css.add_property('--kb-nav-dropdown-hide-transform-x', '-50%');
	} else if (previewDropdownHorizontalAlignment == 'right') {
		css.add_property('--kb-nav-dropdown-show-right', '0px');
		css.add_property('--kb-nav-dropdown-show-left', 'unset');
		css.add_property('--kb-nav-dropdown-show-transform-x', '0px');
		css.add_property('--kb-nav-dropdown-hide-transform-x', '0px');
	} else if (previewDropdownHorizontalAlignment == 'left') {
		css.add_property('--kb-nav-dropdown-show-left', '0px');
		css.add_property('--kb-nav-dropdown-show-right', 'unset');
		css.add_property('--kb-nav-dropdown-show-transform-x', '0px');
		css.add_property('--kb-nav-dropdown-hide-transform-x', '0px');
	}

	//placement logic where an additional selector is needed
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul li:not(:last-of-type), .wp-block-kadence-navigation .menu-container ul.menu li.kb-nav-link-${uniqueID}.kadence-menu-mega-enabled > ul > li.menu-item > a`
	);
	css.add_property(
		'--kb-nav-menu-item-border-bottom',
		css.render_border(dropdownDivider, dropdownDividerTablet, dropdownDividerMobile, previewDevice, 'bottom')
	);

	css.set_selector(
		`.wp-block-kadence-navigation .menu-container > ul > li.menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap`
	);

	if (context?.['kadence/headerIsTransparent'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorTransparent));
		css.add_property('background', css.render_color(previewBackgroundTransparent));
	}
	if (context?.['kadence/headerIsSticky'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorSticky));
		css.add_property('background', css.render_color(previewBackgroundSticky));
	}

	css.set_selector(
		`.wp-block-kadence-navigation .menu-container > ul > li.menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap:hover`
	);
	if (context?.['kadence/headerIsTransparent'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorTransparentHover));
		css.add_property('background', css.render_color(previewBackgroundTransparentHover));
	}
	if (context?.['kadence/headerIsSticky'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorStickyHover));
		css.add_property('background', css.render_color(previewBackgroundStickyHover));
	}

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap`
	);
	if (context?.['kadence/headerIsTransparent'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorTransparentActive));
		css.add_property('background', css.render_color(previewBackgroundTransparentActive));
	}
	if (context?.['kadence/headerIsSticky'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorStickyActive));
		css.add_property('background', css.render_color(previewBackgroundStickyActive));
	}

	//Dropdown logic from theme Styles Component
	// Dropdown.
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul.sub-menu, .wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul.submenu`
	);

	css.add_property(
		'border-top',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'top', false)
	);
	css.add_property(
		'--kb-nav-dropdown-border-right',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'right', false)
	);
	css.add_property(
		'--kb-nav-dropdown-border-bottom',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'bottom', false)
	);
	css.add_property(
		'--kb-nav-dropdown-border-left',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'left', false)
	);
	css.render_measure_output(
		dropdownBorderRadius,
		dropdownBorderRadiusTablet,
		dropdownBorderRadiusMobile,
		previewDevice,
		'border-radius',
		dropdownBorderRadiusUnit,
		{
			first_prop: '--kb-nav-dropdown-border-top-left-radius',
			second_prop: '--kb-nav-dropdown-border-top-right-radius',
			third_prop: '--kb-nav-dropdown-border-bottom-right-radius',
			fourth_prop: '--kb-nav-dropdown-border-bottom-left-radius',
		}
	);
	if (isMegaMenu) {
		if (previewMegaMenuWidth === 'container') {
			css.add_property('--kb-nav-link-has-children-position', 'static');
		}
	}

	//no bleed variables (extra specific to beat things like dropdown or top level styling)
	css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap`);
	css.add_property(
		'--kb-nav-link-color-active-ancestor',
		css.render_color(previewLinkColorActive),
		previewLinkColorActive
	);
	css.add_property(
		'--kb-nav-link-background-active-ancestor',
		css.render_color(previewBackgroundActive),
		previewBackgroundActive
	);

	css.add_property('--kb-nav-link-highlight-color', css.render_color(previewLabelColor));
	css.add_property('--kb-nav-link-highlight-background', css.render_color(previewLabelBackground));
	css.add_property('--kb-nav-link-highlight-color-hover', css.render_color(previewLabelColorHover));
	css.add_property('--kb-nav-link-highlight-background-hover', css.render_color(previewLabelBackgroundHover));
	css.add_property('--kb-nav-link-highlight-color-active', css.render_color(previewLabelColorActive));
	css.add_property('--kb-nav-link-highlight-background-active', css.render_color(previewLabelBackgroundActive));
	css.add_property('--kb-nav-link-highlight-color-active-ancestor', css.render_color(previewLabelColorActive));
	css.add_property(
		'--kb-nav-link-highlight-background-active-ancestor',
		css.render_color(previewLabelBackgroundActive)
	);
	if ('left' === previewHighlightSide) {
		css.add_property('--kb-nav-link-highlight-order', '-1');
	}
	if ('left' === previewIconSide) {
		css.add_property('--kb-nav-link-media-container-order', '-1');
	}
	css.render_measure_output(
		padding,
		tabletPadding,
		mobilePadding,
		previewDevice,
		'--kb-nav-link-padding',
		paddingUnit
	);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, '--kb-nav-link-margin', marginUnit);
	css.render_button_styles_with_states(
		{
			colorBase: 'linkColor',
			backgroundBase: 'background',
			backgroundTypeBase: 'backgroundType',
			backgroundGradientBase: 'backgroundGradient',
			borderBase: 'border',
			borderRadiusBase: 'borderRadius',
			borderRadiusUnitBase: 'borderRadiusUnit',
			shadowBase: 'shadow',
			renderAsVars: true,
			varBase: '--kb-nav-link-',
		},
		attributes,
		previewDevice
	);

	css.render_button_styles_with_states(
		{
			colorBase: 'mediaColor',
			backgroundBase: 'mediaBackground',
			backgroundTypeBase: 'mediaBackgroundType',
			backgroundGradientBase: 'mediaBackgroundGradient',
			borderBase: 'mediaBorder',
			borderRadiusBase: 'mediaBorderRadius',
			borderRadiusUnitBase: 'mediaBorderRadiusUnit',
			renderAsVars: true,
			varBase: '--kb-nav-link-media-container-',
		},
		attributes,
		previewDevice
	);

	//transparent styles
	if (context?.['kadence/headerIsTransparent'] == '1') {
		css.add_property('--kb-nav-link-color', css.render_color(previewLinkColorTransparent));
		css.add_property('--kb-nav-link-background', css.render_color(previewBackgroundTransparent));
		css.add_property('--kb-nav-link-color-hover', css.render_color(previewLinkColorTransparentHover));
		css.add_property('--kb-nav-link-background-hover', css.render_color(previewBackgroundTransparentHover));
		css.add_property('--kb-nav-link-color-active', css.render_color(previewLinkColorTransparentActive));
		css.add_property('--kb-nav-link-background-active', css.render_color(previewBackgroundTransparentActive));
		css.add_property('--kb-nav-link-color-active-ancestor', css.render_color(previewLinkColorTransparentActive));
		css.add_property(
			'--kb-nav-link-background-active-ancestor',
			css.render_color(previewBackgroundTransparentActive)
		);
	}

	//sticky styles
	if (context?.['kadence/headerIsSticky'] == '1') {
		css.add_property('--kb-nav-link-color', css.render_color(previewLinkColorSticky));
		css.add_property('--kb-nav-link-background', css.render_color(previewBackgroundSticky));
		css.add_property('--kb-nav-link-color-hover', css.render_color(previewLinkColorStickyHover));
		css.add_property('--kb-nav-link-background-hover', css.render_color(previewBackgroundStickyHover));
		css.add_property('--kb-nav-link-color-active', css.render_color(previewLinkColorStickyActive));
		css.add_property('--kb-nav-link-background-active', css.render_color(previewBackgroundStickyActive));
		css.add_property('--kb-nav-link-color-active-ancestor', css.render_color(previewLinkColorStickyActive));
		css.add_property('--kb-nav-link-background-active-ancestor', css.render_color(previewBackgroundStickyActive));
	}

	css.render_measure_output(
		highlightSpacing[0].padding,
		highlightSpacing[0].tabletPadding,
		highlightSpacing[0].mobilePadding,
		previewDevice,
		'--kb-nav-link-highlight-padding',
		'px'
	);
	// css.render_measure_output(
	// 	highlightSpacing[0].margin,
	// 	highlightSpacing[0].tabletMargin,
	// 	highlightSpacing[0].mobileMargin,
	// 	previewDevice,
	// 	'--kb-nav-link-highlight-margin',
	// 	'px'
	// );
	css.add_property(
		'--kb-nav-link-highlight-border-top',
		css.render_border(
			highlightSpacing[0].border,
			highlightSpacing[0].tabletBorder,
			highlightSpacing[0].mobileBorder,
			previewDevice,
			'top',
			false
		)
	);
	css.add_property(
		'--kb-nav-link-highlight-border-right',
		css.render_border(
			highlightSpacing[0].border,
			highlightSpacing[0].tabletBorder,
			highlightSpacing[0].mobileBorder,
			previewDevice,
			'right',
			false
		)
	);
	css.add_property(
		'--kb-nav-link-highlight-border-bottom',
		css.render_border(
			highlightSpacing[0].border,
			highlightSpacing[0].tabletBorder,
			highlightSpacing[0].mobileBorder,
			previewDevice,
			'bottom',
			false
		)
	);
	css.add_property(
		'--kb-nav-link-highlight-border-left',
		css.render_border(
			highlightSpacing[0].border,
			highlightSpacing[0].tabletBorder,
			highlightSpacing[0].mobileBorder,
			previewDevice,
			'left',
			false
		)
	);
	css.render_measure_output(
		highlightSpacing[0].borderRadius,
		highlightSpacing[0].tabletBorderRadius,
		highlightSpacing[0].mobileBorderRadius,
		previewDevice,
		'border-radius',
		'px',
		{
			first_prop: '--kb-nav-link-highlight-border-top-left-radius',
			second_prop: '--kb-nav-link-highlight-border-top-right-radius',
			third_prop: '--kb-nav-link-highlight-border-bottom-right-radius',
			fourth_prop: '--kb-nav-link-highlight-border-bottom-left-radius',
		}
	);
	if (undefined !== previewHighlightLabelGap && previewHighlightLabelGap) {
		css.add_property('--kb-nav-link-highlight-gap', css.get_gap_size(previewHighlightLabelGap, 'px'));
	}

	if (undefined !== previewHighlightLabelTextGap && previewHighlightLabelTextGap) {
		css.add_property('--kb-nav-link-highlight-text-gap', css.get_gap_size(previewHighlightLabelTextGap, 'px'));
	}

	// Icon and description placement.
	if (description) {
		css.add_property('--kb-nav-link-title-wrap-display', 'grid');
		css.add_property('--kb-nav-link-title-wrap-grid-template-columns', '1fr');
	}

	if (
		description &&
		mediaType != 'none' &&
		mediaType != '' &&
		(previewMediaAlign == 'left' || previewMediaAlign == 'right')
	) {
		css.add_property('--kb-nav-link-title-wrap-display', 'grid');
		css.add_property('--kb-nav-link-title-wrap-grid-template-columns', '1fr auto');

		if (previewDescriptionPositioning === 'icon') {
			css.add_property('--kb-nav-link-description-grid-column', 'span 2');
		} else if (previewMediaAlign == 'right') {
			css.add_property('--kb-nav-link-description-grid-column', '1');
		} else {
			css.add_property('--kb-nav-link-description-grid-column', '2');
		}
	}
	//description styles
	css.add_property(
		'--kb-nav-link-description-padding-top',
		css.render_size(previewDescriptionSpacing, descriptionSpacingUnit)
	);
	css.add_property('--kb-nav-link-description-color', css.render_color(previewDescriptionColor));
	css.add_property('--kb-nav-link-description-color-hover', css.render_color(previewDescriptionColorHover));
	css.add_property('--kb-nav-link-description-color-active', css.render_color(previewDescriptionColorActive));
	css.add_property(
		'--kb-nav-link-description-color-active-ancestor',
		css.render_color(previewDescriptionColorActive)
	);

	//link, description, and media alignment
	if (previewAlign) {
		css.add_property('--kb-nav-link-align', previewAlign);
		const previewFlexAlign = previewAlign == 'right' ? 'end' : previewAlign == 'center' ? 'center' : 'start';
		css.add_property('--kb-nav-link-flex-justify', previewFlexAlign);
		css.add_property('--kb-nav-link-media-container-align-self', previewFlexAlign);
		if (previewMediaAlign == 'top' || previewMediaAlign == 'bottom') {
			css.add_property('--kb-nav-link-flex-align', previewFlexAlign);
		}
	}

	//media styles
	if (mediaType && 'none' !== mediaType) {
		css.add_property('--kb-nav-link-icon-font-size', css.render_size(previewMediaIconSize, 'px'));
		//$css->add_property( '--kb-nav-link-icon-height', $css->render_size( $media_icon_size, 'px' ) );

		if (previewMediaAlign === 'left') {
			css.add_property('--kb-nav-link-media-container-order', '-1');
			css.add_property(
				'--kb-nav-link-media-container-margin-right',
				css.render_size(previewMediaStyleMargin[0], 'px')
			);
			css.add_property('--kb-nav-link-title-wrap-has-media-grid-template-columns', 'auto 1fr');
		} else if (previewMediaAlign === 'top') {
			css.add_property('--kb-nav-link-title-wrap-display', 'flex');
			css.add_property('--kb-nav-link-media-container-order', '-1');
			css.add_property('--kb-nav-link-title-wrap-flex-direction', 'column');
			css.add_property('--kb-nav-link-media-container-justify-content', 'center');
			css.add_property('--kb-nav-link-media-container-align-self', 'center');
			css.add_property(
				'--kb-nav-link-media-container-margin-bottom',
				css.render_size(previewMediaStyleMargin[0], 'px')
			);
		} else if (previewMediaAlign === 'bottom') {
			//add here
			css.add_property('--kb-nav-link-title-wrap-display', 'flex');
			css.add_property('--kb-nav-link-media-container-order', '1');
			css.add_property('--kb-nav-link-title-wrap-flex-direction', 'column');
			css.add_property('--kb-nav-link-media-container-justify-content', 'center');
			css.add_property('--kb-nav-link-media-container-align-self', 'center');
			css.add_property(
				'--kb-nav-link-media-container-margin-top',
				css.render_size(previewMediaStyleMargin[0], 'px')
			);
		} else {
			css.add_property(
				'--kb-nav-link-media-container-margin-left',
				css.render_size(previewMediaStyleMargin[0], 'px')
			);
		}
		css.add_property('--kb-nav-link-media-max-width', mediaImage[0].maxWidth + 'px');
		if (hasRatio) {
			//next level container
			css.add_property('--kb-nav-link-media-intrinsic-padding-bottom', imageRatioPadding);
			css.add_property(
				'--kb-nav-link-media-intrinsic-height',
				imageRatioHeight == 0 ? '0px' : imageRatioHeight,
				null,
				true
			);
			css.add_property(
				'--kb-nav-link-media-intrinsic-width',
				isNaN(mediaImage[0].width) ? undefined : mediaImage[0].width + 'px'
			);
		}
	}

	//placement logic where an additional selector is needed
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul li:not(:last-of-type), .wp-block-kadence-navigation .menu-container ul.menu li.kb-nav-link-${uniqueID}.kadence-menu-mega-enabled > ul > li.menu-item > a`
	);
	css.add_property(
		'--kb-nav-menu-item-border-bottom',
		css.render_border(dropdownDivider, dropdownDividerTablet, dropdownDividerMobile, previewDevice, 'bottom')
	);
	// Mega menu width styles.
	if (isMegaMenu) {
		if (previewMegaMenuWidth === 'custom') {
			//first sub menu only, no bleed
			//extra specificty to beat nav level styling
			css.set_selector(
				`.wp-block-kadence-navigation .menu .kb-nav-link-${uniqueID} > .sub-menu.sub-menu.sub-menu`
			);
			css.add_property(
				'--kb-nav-dropdown-width',
				css.render_size(previewMegaMenuCustomWidth, megaMenuCustomWidthUnit)
			);
		} else if ((previewMegaMenuWidth === 'full' || previewMegaMenuWidth === '') && currentRef?.current) {
			//first sub menu only, no bleed
			//extra specificty to beat nav level styling
			css.set_selector(
				`.wp-block-kadence-navigation .menu .kb-nav-link-${uniqueID} > .sub-menu.sub-menu.sub-menu`
			);
			if (editorElement?.clientWidth) {
				css.add_property('--kb-nav-dropdown-width', editorElement.clientWidth + 'px');
			} else {
				css.add_property('--kb-nav-dropdown-width', '100vw');
			}
			css.add_property(
				'--kb-nav-dropdown-show-left',
				-1 *
					Math.abs(
						currentRef.current.closest('.wp-block-kadence-navigation-link').getBoundingClientRect().left -
							currentRef.current.closest('.editor-styles-wrapper').getBoundingClientRect().left
					).toString() +
					'px'
			);
			css.add_property('--kb-nav-dropdown-show-transform-x', '0');
		} else if (previewMegaMenuWidth === 'content' && currentRef?.current) {
			css.set_selector(
				`.wp-block-kadence-navigation .menu .kb-nav-link-${uniqueID} > .sub-menu.sub-menu.sub-menu`
			);
			const row = currentRef.current.closest('.kadence-header-row-inner');
			if (row) {
				const rowCS = getComputedStyle(row);
				const rowPaddingX = parseFloat(rowCS.paddingLeft) + parseFloat(rowCS.paddingRight);
				const rowDistanceToEdge = parseFloat(row.getBoundingClientRect().left) + parseFloat(rowCS.paddingLeft);
				if (currentRef.current.closest('.kadence-header-row-inner')) {
					css.add_property('--kb-nav-dropdown-width', row.offsetWidth - rowPaddingX + 'px');
				} else {
					css.add_property('--kb-nav-dropdown-width', '100%');
				}
				css.add_property(
					'--kb-nav-dropdown-show-left',
					-1 *
						Math.abs(
							currentRef.current.closest('.wp-block-kadence-navigation-link').getBoundingClientRect()
								.left - rowDistanceToEdge
						).toString() +
						'px'
				);
			} else {
				css.add_property('--kb-nav-dropdown-width', 'var(--wp--style--global--content-size, 100%)');
				css.add_property(
					'--kb-nav-dropdown-show-left',
					'calc( (((100vw - var(--wp--style--global--content-size, 100%)) / 2) - ' +
						Math.abs(
							currentRef.current.closest('.wp-block-kadence-navigation-link').getBoundingClientRect().left
						).toString() +
						'px))'
				);
			}
			css.add_property('--kb-nav-dropdown-show-transform-x', '0');
		} else if (previewMegaMenuWidth === 'container') {
			//first sub menu only, no bleed
			//extra specificty to beat nav level styling
			css.set_selector(
				`.wp-block-kadence-navigation .menu .kb-nav-link-${uniqueID} > .sub-menu.sub-menu.sub-menu`
			);
			css.add_property('--kb-nav-dropdown-width', '100%');
			css.add_property('--kb-nav-dropdown-show-left', '0');
			css.add_property('--kb-nav-dropdown-show-transform-x', '0');
		}
	}

	css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap.kb-link-wrap.kb-link-wrap > .kb-nav-link-content`);
	css.render_font(typography ? typography : [], previewDevice);

	css.set_selector(`.kb-nav-link-${uniqueID} .sub-menu li.menu-item > .kb-link-wrap > .kb-nav-link-content`);
	css.render_font(dropdownTypography ? dropdownTypography : [], previewDevice);

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container > ul li.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-highlight-label`
	);
	css.render_font(highlightTypography ? highlightTypography : [], previewDevice);

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} > .kb-link-wrap > a .kb-nav-label-description:not(.specificity)`
	);
	css.render_font(descriptionTypography ? descriptionTypography : [], previewDevice);

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} .sub-menu .kb-link-wrap > a .kb-nav-label-description:not(.specificity)`
	);
	css.render_font(dropdownDescriptionTypography ? dropdownDescriptionTypography : [], previewDevice);

	css.set_selector(`.kb-nav-link-${uniqueID}.menu-item > .kb-link-wrap > a:hover .link-highlight-label`);
	css.add_property('transition', 'color 0.35s ease-in-out, background-color 0.35s ease-in-out');

	if (showSubMenusWithLogic && subMenuHeight) {
		css.set_selector(`:root`);
		css.add_property('--kb-editor-height-nv', subMenuHeight + 'px');
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
