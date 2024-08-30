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
		isMegaMenu,
		align,
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
	} = attributes;

	const editorElement = useEditorElement(currentRef, []);
	const editorWidth = editorElement?.clientWidth;
	const subMenuHeight = subMenuRef?.clientHeight ? subMenuRef.clientHeight : subMenuRef?.current?.clientHeight;

	const isFEIcon = 'fe' === mediaIcon[0].icon.substring(0, 2);

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
	const previewMediaStylePadding = getPreviewSize(
		previewDevice,
		mediaStyle[0].padding,
		mediaStyle[0].paddingTablet,
		mediaStyle[0].paddingMobile
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
	// const previewMediaIconSize = getPreviewSize(
	// 	previewDevice,
	// 	mediaIcon[0].size,
	// 	mediaIcon[0].sizeTablet,
	// 	mediaIcon[0].sizeMobile
	// );
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

	const previewMegaMenuWidth = getPreviewSize(previewDevice, megaMenuWidth, megaMenuWidthTablet, megaMenuWidthMobile);

	const previewMegaMenuCustomWidth = getPreviewSize(
		previewDevice,
		megaMenuCustomWidth,
		megaMenuCustomWidthTablet,
		megaMenuCustomWidthMobile
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

	css.render_button_styles_with_states(
		{
			backgroundBase: 'background',
			backgroundTypeBase: 'backgroundType',
			backgroundGradientBase: 'backgroundGradient',
			borderBase: 'border',
			borderRadiusBase: 'borderRadius',
			borderRadiusUnitBase: 'borderRadiusUnit',
			shadowBase: 'shadow',
			selector: `.wp-block-kadence-navigation .menu-container > ul > li.menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap`,
			selectorHover: `.wp-block-kadence-navigation .menu-container > ul > li.menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap:hover`,
			selectorActive: `.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap`,
		},
		attributes,
		previewDevice
	);

	//non specific styles and variables
	css.set_selector(`kb-nav-link-${uniqueID}`);
	css.add_property(
		'--kb-nav-dropdown-link-padding-top',
		css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit)
	);
	css.add_property(
		'--kb-nav-dropdown-link-padding-bottom',
		css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit)
	);
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

	css.set_selector(
		`.wp-block-kadence-navigation .menu-container > ul > li.menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap > a, .wp-block-kadence-navigation .menu-container > ul > li.menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap`
	);
	css.add_property('color', css.render_color(previewLinkColor));

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
		`.wp-block-kadence-navigation .menu-container > ul > li.menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap:hover > a, .wp-block-kadence-navigation .menu-container > ul > li.menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap:hover`
	);
	css.add_property('color', css.render_color(previewLinkColorHover));

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
		`.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap > a,
		.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.kb-nav-link-${uniqueID} > .kb-link-wrap`
	);
	css.add_property('color', css.render_color(previewLinkColorActive));

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

	//mega menu width styles
	if (isMegaMenu) {
		if (previewMegaMenuWidth === 'custom') {
			css.set_selector(
				`.wp-block-kadence-navigation .menu-container ul.menu .kb-nav-link-${uniqueID} > ul.sub-menu`
			);
			css.add_property('width', css.render_size(previewMegaMenuCustomWidth, megaMenuCustomWidthUnit));

			css.set_selector(
				`.wp-block-kadence-navigation .navigation[class*="header-navigation-dropdown-animation-fade"] .menu-container ul.menu .kb-nav-link-${uniqueID} > ul.sub-menu`
			);
			css.add_property('margin-left', '-50%');
			css.add_property('left', '50%');

			css.set_selector(
				`.wp-block-kadence-navigation .navigation.navigation-dropdown-animation-none .menu-container ul.menu .kb-nav-link-${uniqueID} > ul.sub-menu`
			);
			css.add_property('transform', 'translate(-50%, 0)');
			css.add_property('left', '50%');

			// css.set_selector( '.header-navigation[class*="header-navigation-dropdown-animation-fade"] #menu-item-' . $item->ID . '.kadence-menu-mega-enabled > .sub-menu' );
			// css.add_property( 'margin-left', '-' . ( $data['mega_menu_custom_width'] ? floor( $data['mega_menu_custom_width'] / 2 ) : '400' ) . 'px' );
		} else if ((previewMegaMenuWidth === 'full' || previewMegaMenuWidth === '') && currentRef?.current) {
			css.set_selector(
				`.wp-block-kadence-navigation .menu-container ul.menu .kb-nav-link-${uniqueID} > ul.sub-menu`
			);
			css.add_property('width', editorWidth + 'px');
			css.add_property(
				'left',
				-1 *
					Math.abs(
						currentRef.current.closest('.wp-block-kadence-navigation-link').getBoundingClientRect().left -
							currentRef.current.closest('.editor-styles-wrapper').getBoundingClientRect().left
					).toString() +
					'px'
			);
		} else if (previewMegaMenuWidth === 'container') {
			css.set_selector(` .wp-block-kadence-navigation .menu-container ul.menu .kb-nav-link-${uniqueID}`);
			css.add_property('position', 'static');
			css.set_selector(
				`.wp-block-kadence-navigation .menu-container ul.menu .kb-nav-link-${uniqueID} > ul.sub-menu`
			);
			css.add_property('width', '100%');
			css.add_property('left', '0');
		}
	}

	//Dropdown logic from theme Styles Component
	// Dropdown.
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul.sub-menu, .wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul.submenu`
	);
	css.add_property('width', previewDropdownWidth + dropdownWidthUnit);
	css.add_property('background', css.render_color(previewBackgroundDropdown));

	css.add_property(
		'border-top',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'top', false)
	);
	css.add_property(
		'border-right',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'right', false)
	);
	css.add_property(
		'border-bottom',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'bottom', false)
	);
	css.add_property(
		'border-left',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'left', false)
	);
	css.render_measure_output(
		dropdownBorderRadius,
		dropdownBorderRadiusTablet,
		dropdownBorderRadiusMobile,
		previewDevice,
		'border-radius',
		dropdownBorderRadiusUnit
	);
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul li:not(:last-of-type), .wp-block-kadence-navigation .menu-container ul.menu li.kb-nav-link-${uniqueID}.kadence-menu-mega-enabled > ul > li.menu-item > a`
	);
	css.add_property(
		'border-bottom',
		css.render_border(dropdownDivider, dropdownDividerTablet, dropdownDividerMobile, previewDevice, 'bottom')
	);

	//dropdown nav link
	css.set_selector(`.kb-nav-link-${uniqueID} .sub-menu li.menu-item > .kb-link-wrap > a`);
	css.render_font(dropdownTypography ? dropdownTypography : [], previewDevice);

	css.render_measure_output(
		paddingDropdownLink,
		tabletPaddingDropdownLink,
		mobilePaddingDropdownLink,
		previewDevice,
		'--kb-nav-link-padding',
		paddingDropdownLinkUnit
	);
	css.render_measure_output(
		marginDropdownLink,
		tabletMarginDropdownLink,
		mobileMarginDropdownLink,
		previewDevice,
		'--kb-nav-link-margin',
		marginDropdownLinkUnit
	);

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul li.menu-item > .kb-link-wrap > a, .wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul.sub-menu `
	);
	css.add_property('color', css.render_color(previewLinkColorDropdown));
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-${uniqueID} ul li.menu-item > .kb-link-wrap > a:hover`
	);
	css.add_property('color', css.render_color(previewLinkColorDropdownHover));
	css.add_property('background', css.render_color(previewBackgroundDropdownHover));
	css.set_selector(
		`.wp-block-kadence-navigation.navigation .menu-container ul .kb-nav-link-${uniqueID} ul li.menu-item.current-menu-item > .kb-link-wrap > a`
	);
	css.add_property('color', css.render_color(previewLinkColorDropdownActive));
	css.add_property('background', css.render_color(previewBackgroundDropdownActive));

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container > ul li.kb-nav-link-${uniqueID} > .kb-link-wrap.kb-link-wrap.kb-link-wrap > a`
	);
	css.render_font(typography ? typography : [], previewDevice);
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container > ul li.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-highlight-label`
	);
	css.render_font(highlightTypography ? highlightTypography : [], previewDevice);

	//nav link
	css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > .kb-nav-link-content`);
	css.render_measure_output(
		padding,
		tabletPadding,
		mobilePadding,
		previewDevice,
		'--kb-nav-link-padding',
		paddingUnit
	);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, '--kb-nav-link-margin', marginUnit);

	//media styles
	if (mediaType && 'none' !== mediaType) {
		//normal styles
		css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container`);
		css.add_property('background-color', css.render_color(previewMediaStyleBackground));
		css.add_property('border-radius', css.render_size(previewMediaStyleBorderRadius, 'px'));
		css.add_property('padding-top', css.render_size(previewMediaStylePadding[0], 'px'));
		css.add_property('padding-right', css.render_size(previewMediaStylePadding[1], 'px'));
		css.add_property('padding-bottom', css.render_size(previewMediaStylePadding[2], 'px'));
		css.add_property('padding-left', css.render_size(previewMediaStylePadding[3], 'px'));

		if (previewMediaAlign === 'left') {
			css.add_property('order', '-1');
			css.add_property('margin-right', css.render_size(previewMediaStyleMargin[0], 'px'));

			css.set_selector(
				`.kb-nav-link-${uniqueID}.kadence-menu-has-description.has-media > .kb-link-wrap > a > .kb-nav-item-title-wrap`
			);
			css.add_property('grid-template-columns', 'auto 1fr');
		} else if (previewMediaAlign === 'top') {
			css.add_property('order', '-1');
			css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a > .kb-nav-item-title-wrap`);
			css.add_property('flex-direction', 'column');
			css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container`);
			css.add_property('justify-content', 'center');
		} else if (previewMediaAlign === 'bottom') {
			css.add_property('order', '1');
			css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a > .kb-nav-item-title-wrap`);
			css.add_property('flex-direction', 'column');
			css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container`);
			css.add_property('justify-content', 'center');
		} else {
			css.add_property('margin-left', css.render_size(previewMediaStyleMargin[0], 'px'));
		}

		css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container > .link-svg-icon > svg`);
		// css.add_property('width', css.render_size(previewMediaIconSize, 'px'));
		// css.add_property('height', css.render_size(previewMediaIconSize, 'px'));
		// css.add_property('stroke-width', css.render_size(isFEIcon ? previewMediaIconWidth : null, 'px'));
		css.add_property('color', css.render_color(previewMediaStyleColor));

		//image styles
		//outer container
		css.set_selector(
			`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container > .kadence-navigation-link-image-inner-intrinsic-container`
		);
		css.add_property('max-width', mediaImage[0].maxWidth + 'px');
		if (hasRatio) {
			//next level container
			css.set_selector(
				`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container > .kadence-navigation-link-image-inner-intrinsic-container > .kadence-navigation-link-image-intrinsic`
			);
			css.add_property('padding-bottom', imageRatioPadding);
			css.add_property('height', imageRatioHeight == 0 ? '0px' : imageRatioHeight, null, true);
			css.add_property('width', isNaN(mediaImage[0].width) ? undefined : mediaImage[0].width + 'px');
			css.add_property('max-width', '100%');
			css.add_property('position', 'relative');
			css.add_property('overflow', 'hidden');

			//inner container
			css.set_selector(
				`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container > .kadence-navigation-link-image-inner-intrinsic-container > .kadence-navigation-link-image-intrinsic > .kadence-navigation-link-image-inner-intrinsic`
			);
			css.add_property('position', 'absolute');
			css.add_property('top', '0');
			css.add_property('left', '0');
			css.add_property('right', '0');
			css.add_property('bottom', '0');

			//img
			css.set_selector(
				`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container > .kadence-navigation-link-image-inner-intrinsic-container > .kadence-navigation-link-image-intrinsic > .kadence-navigation-link-image-inner-intrinsic > img`
			);
			css.add_property('position', 'absolute');
			css.add_property('flex', '1');
			css.add_property('height', '100%');
			css.add_property('object-fit', 'cover');
			css.add_property('width', '100%');
			css.add_property('top', '0');
			css.add_property('left', '0');
		}

		//hover style
		css.set_selector(`.kb-nav-link-${uniqueID}:hover > .kb-link-wrap > a .link-media-container`);
		css.add_property('background-color', css.render_color(previewMediaStyleBackgroundHover));
		css.set_selector(
			`.kb-nav-link-${uniqueID}:hover > .kb-link-wrap > a .link-media-container > .link-svg-icon > svg`
		);
		css.add_property('color', css.render_color(previewMediaStyleColorHover));

		//active style
		css.set_selector(`.kb-nav-link-${uniqueID}.current-menu-item > .kb-link-wrap > a .link-media-container`);
		css.add_property('background-color', css.render_color(previewMediaStyleBackgroundActive));
		css.set_selector(
			`.kb-nav-link-${uniqueID}.current-menu-item > .kb-link-wrap > a .link-media-container > .link-svg-icon > svg`
		);
		css.add_property('color', css.render_color(previewMediaStyleColorActive));
	}
	if (mediaType && 'image' === mediaType) {
		css.render_button_styles_with_states(
			{
				colorBase: 'mediaColor',
				backgroundBase: 'mediaBackground',
				backgroundTypeBase: 'mediaBackgroundType',
				backgroundGradientBase: 'mediaBackgroundGradient',
				borderBase: 'mediaBorder',
				borderRadiusBase: 'mediaBorderRadius',
				borderRadiusUnitBase: 'mediaBorderRadiusUnit',
				selector: `.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container > .kadence-navigation-link-image-inner-intrinsic-container`,
				selectorHover: `.kb-nav-link-${uniqueID}:hover > .kb-link-wrap > a .link-media-container > .kadence-navigation-link-image-inner-intrinsic-container`,
				selectorActive: `.kb-nav-link-${uniqueID}.current-menu-item > .kb-link-wrap > a .link-media-container > .kadence-navigation-link-image-inner-intrinsic-container`,
			},
			attributes,
			previewDevice,
			true
		);
	}

	//label styles
	css.set_selector(
		`.kb-nav-link-${uniqueID}.menu-item > .kb-link-wrap > a.kb-nav-link-content .link-highlight-label`
	);
	css.add_property('color', css.render_color(previewLabelColor));
	css.add_property('background-color', css.render_color(previewLabelBackground));
	css.render_measure_output(
		highlightSpacing[0].padding,
		highlightSpacing[0].tabletPadding,
		highlightSpacing[0].mobilePadding,
		previewDevice,
		'padding',
		'px'
	);
	// css.render_measure_output(
	// 	highlightSpacing[0].margin,
	// 	highlightSpacing[0].tabletMargin,
	// 	highlightSpacing[0].mobileMargin,
	// 	previewDevice,
	// 	'margin',
	// 	'px'
	// );
	css.add_property(
		'border-top',
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
		'border-right',
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
		'border-bottom',
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
		'border-left',
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
		'px'
	);
	if ('left' === previewHighlightSide) {
		css.add_property('order', '-1');
	}
	if (undefined !== previewHighlightLabelGap && previewHighlightLabelGap) {
		css.add_property('gap', css.get_gap_size(previewHighlightLabelGap, 'px'));
	}

	css.set_selector(
		`.navigation ul.kb-navigation .kb-nav-link-${uniqueID}.menu-item > .kb-link-wrap > a.kb-nav-link-content.has-highlight-label`
	);
	if (undefined !== previewHighlightLabelTextGap && previewHighlightLabelTextGap) {
		css.add_property('gap', css.get_gap_size(previewHighlightLabelTextGap, 'px'));
	}

	css.set_selector(`.kb-nav-link-${uniqueID}.menu-item > .kb-link-wrap > a:hover .link-highlight-label`);
	css.add_property('transition', 'color 0.35s ease-in-out, background-color 0.35s ease-in-out');
	css.add_property('color', css.render_color(previewLabelColorHover));
	css.add_property('background-color', css.render_color(previewLabelBackgroundHover));
	css.set_selector(`.kb-nav-link-${uniqueID}.menu-item > .kb-link-wrap > a:active .link-highlight-label`);
	css.add_property('color', css.render_color(previewLabelColorActive));
	css.add_property('background-color', css.render_color(previewLabelBackgroundActive));
	css.set_selector(
		`.kb-nav-link-${uniqueID}.menu-item > .kb-link-wrap > a .link-highlight-label .kt-highlight-label-icon`
	);
	if ('left' === previewIconSide) {
		css.add_property('order', '-1');
	}

	// Media and description placement.
	if (description) {
		css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .kb-nav-item-title-wrap:not(.specificity)`);
		css.add_property('display', 'grid');
		css.add_property('grid-template-columns', '1fr');
	}
	if (description && mediaType != 'none' && (previewMediaAlign == 'left' || previewMediaAlign == 'right')) {
		css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .kb-nav-item-title-wrap:not(.specificity)`);
		css.add_property('display', 'grid');
		css.add_property('grid-template-columns', '1fr auto');

		if (previewDescriptionPositioning === 'icon') {
			css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .menu-label-description:not(.specificity)`);
			css.add_property('grid-column', 'span 2');
		} else {
			css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-media-container:not(.specificity)`);
			css.add_property('grid-row', 'span 2');
		}
	}

	//description styles
	css.set_selector(`.kb-nav-link-${uniqueID} > .kb-link-wrap > a .menu-label-description:not(.specificity)`);
	css.add_property('padding-top', css.render_size(previewDescriptionSpacing, descriptionSpacingUnit));
	css.render_font(descriptionTypography ? descriptionTypography : [], previewDevice);
	css.add_property('color', css.render_color(previewDescriptionColor));

	//description styles hover
	css.set_selector(`.kb-nav-link-${uniqueID}:hover > .kb-link-wrap > a .menu-label-description:not(.specificity)`);
	css.add_property('color', css.render_color(previewDescriptionColorHover));

	//description styles active
	css.set_selector(
		`.kb-nav-link-${uniqueID}.current-menu-item  > .kb-link-wrap > a .menu-label-description:not(.specificity)`
	);
	css.add_property('color', css.render_color(previewDescriptionColorActive));

	//link and description text alignment
	css.set_selector(`.kb-nav-link-${uniqueID}  > .kb-link-wrap > a .kb-nav-item-title-wrap:not(.specificity)`);
	css.add_property('text-align', align != '' ? align : 'left');

	if (showSubMenusWithLogic && subMenuHeight) {
		css.set_selector(`:root`);
		css.add_property('--kb-editor-height-nv', subMenuHeight + 'px');
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
