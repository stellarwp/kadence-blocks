import { KadenceBlocksCSS, getPreviewSize, getSpacingOptionOutput } from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, metaAttributes, context } = props;

	const { uniqueID, id, templateKey } = attributes;

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
		fillStretch,
		parentActive,
		parentActiveTablet,
		parentActiveMobile,
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
		descriptionPositioning,
		descriptionPositioningTablet,
		descriptionPositioningMobile,
		dropdownDescriptionTypography,
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
		dropdownDescriptionPositioning,
		dropdownDescriptionPositioningTablet,
		dropdownDescriptionPositioningMobile,
		collapseSubMenus,
		parentTogglesMenus,
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
		dropdownBorder,
		dropdownBorderTablet,
		dropdownBorderMobile,
		dropdownBorderRadius,
		dropdownBorderRadiusTablet,
		dropdownBorderRadiusMobile,
		dropdownBorderRadiusUnit,
	} = metaAttributes;

	const css = new KadenceBlocksCSS();

	const navigationHorizontalSpacing = spacing[1];
	const navigationHorizontalSpacingTablet = spacingTablet[1];
	const navigationHorizontalSpacingMobile = spacingMobile[1];
	const previewNavigationHorizontalSpacing = getPreviewSize(
		previewDevice,
		navigationHorizontalSpacing,
		navigationHorizontalSpacingTablet,
		navigationHorizontalSpacingMobile
	);
	const navigationVerticalSpacing = spacing[0];
	const navigationVerticalSpacingTablet = spacingTablet[0];
	const navigationVerticalSpacingMobile = spacingMobile[0];
	const previewNavigationVerticalSpacing = getPreviewSize(
		previewDevice,
		navigationVerticalSpacing,
		navigationVerticalSpacingTablet,
		navigationVerticalSpacingMobile
	);

	const inTemplatePreviewMode = !id && templateKey;
	const previewOrientation = inTemplatePreviewMode
		? templateKey.includes('vertical')
			? 'vertical'
			: 'horizontal'
		: getPreviewSize(previewDevice, orientation, orientationTablet, orientationMobile);
	const previewStyle = getPreviewSize(previewDevice, style, styleTablet, styleMobile);
	const previewParentActive = getPreviewSize(previewDevice, parentActive, parentActiveTablet, parentActiveMobile);
	const previewDropdownWidth = getPreviewSize(previewDevice, dropdownWidth, dropdownWidthTablet, dropdownWidthMobile);
	const previewLinkColor = getPreviewSize(previewDevice, linkColor, linkColorTablet, linkColorMobile);
	const previewBackground = getPreviewSize(previewDevice, background, backgroundTablet, backgroundMobile);
	const previewLinkColorHover = getPreviewSize(
		previewDevice,
		linkColorHover,
		linkColorHoverTablet,
		linkColorHoverMobile
	);
	const previewBackgroundHover = getPreviewSize(
		previewDevice,
		backgroundHover,
		backgroundHoverTablet,
		backgroundHoverMobile
	);
	const previewLinkColorActive = getPreviewSize(
		previewDevice,
		linkColorActive,
		linkColorActiveTablet,
		linkColorActiveMobile
	);
	const previewBackgroundActive = getPreviewSize(
		previewDevice,
		backgroundActive,
		backgroundActiveTablet,
		backgroundActiveMobile
	);
	const previewLinkColorDropdown = getPreviewSize(
		previewDevice,
		linkColorDropdown,
		linkColorDropdownTablet,
		linkColorDropdownMobile
	);
	const previewBackgroundDropdown = getPreviewSize(
		previewDevice,
		backgroundDropdown,
		backgroundDropdownTablet,
		backgroundDropdownMobile
	);
	const previewLinkColorDropdownHover = getPreviewSize(
		previewDevice,
		linkColorDropdownHover,
		linkColorDropdownHoverTablet,
		linkColorDropdownHoverMobile
	);
	const previewBackgroundDropdownHover = getPreviewSize(
		previewDevice,
		backgroundDropdownHover,
		backgroundDropdownHoverTablet,
		backgroundDropdownHoverMobile
	);
	const previewLinkColorDropdownActive = getPreviewSize(
		previewDevice,
		linkColorDropdownActive,
		linkColorDropdownActiveTablet,
		linkColorDropdownActiveMobile
	);
	const previewBackgroundDropdownActive = getPreviewSize(
		previewDevice,
		backgroundDropdownActive,
		backgroundDropdownActiveTablet,
		backgroundDropdownActiveMobile
	);
	const previewLinkColorTransparent = getPreviewSize(
		previewDevice,
		linkColorTransparent,
		linkColorTransparentTablet,
		linkColorTransparentMobile
	);
	const previewBackgroundTransparent = getPreviewSize(
		previewDevice,
		backgroundTransparent,
		backgroundTransparentTablet,
		backgroundTransparentMobile
	);
	const previewLinkColorTransparentHover = getPreviewSize(
		previewDevice,
		linkColorTransparentHover,
		linkColorTransparentHoverTablet,
		linkColorTransparentHoverMobile
	);
	const previewBackgroundTransparentHover = getPreviewSize(
		previewDevice,
		backgroundTransparentHover,
		backgroundTransparentHoverTablet,
		backgroundTransparentHoverMobile
	);
	const previewLinkColorTransparentActive = getPreviewSize(
		previewDevice,
		linkColorTransparentActive,
		linkColorTransparentActiveTablet,
		linkColorTransparentActiveMobile
	);
	const previewBackgroundTransparentActive = getPreviewSize(
		previewDevice,
		backgroundTransparentActive,
		backgroundTransparentActiveTablet,
		backgroundTransparentActiveMobile
	);
	const previewLinkColorSticky = getPreviewSize(
		previewDevice,
		linkColorSticky,
		linkColorStickyTablet,
		linkColorStickyMobile
	);
	const previewBackgroundSticky = getPreviewSize(
		previewDevice,
		backgroundSticky,
		backgroundStickyTablet,
		backgroundStickyMobile
	);
	const previewLinkColorStickyHover = getPreviewSize(
		previewDevice,
		linkColorStickyHover,
		linkColorStickyHoverTablet,
		linkColorStickyHoverMobile
	);
	const previewBackgroundStickyHover = getPreviewSize(
		previewDevice,
		backgroundStickyHover,
		backgroundStickyHoverTablet,
		backgroundStickyHoverMobile
	);
	const previewLinkColorStickyActive = getPreviewSize(
		previewDevice,
		linkColorStickyActive,
		linkColorStickyActiveTablet,
		linkColorStickyActiveMobile
	);
	const previewBackgroundStickyActive = getPreviewSize(
		previewDevice,
		backgroundStickyActive,
		backgroundStickyActiveTablet,
		backgroundStickyActiveMobile
	);
	const previewDropdownVerticalSpacing = getPreviewSize(
		previewDevice,
		dropdownVerticalSpacing,
		dropdownVerticalSpacingTablet,
		dropdownVerticalSpacingMobile
	);
	const previewDescriptionSpacing = getPreviewSize(
		previewDevice,
		descriptionSpacing,
		descriptionSpacingTablet,
		descriptionSpacingMobile
	);
	// const previewDescriptionPositioning = getPreviewSize(
	// 	previewDevice,
	// 	descriptionPositioning,
	// 	descriptionPositioningTablet,
	// 	descriptionPositioningMobile
	// );
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
	const previewDropdownDescriptionSpacing = getPreviewSize(
		previewDevice,
		dropdownDescriptionSpacing,
		dropdownDescriptionSpacingTablet,
		dropdownDescriptionSpacingMobile
	);
	// const previewDropdownDescriptionPositioning = getPreviewSize(
	// 	previewDevice,
	// 	dropdownDescriptionPositioning,
	// 	dropdownDescriptionPositioningTablet,
	// 	dropdownDescriptionPositioningMobile
	// );
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
	const previewDropdownBorderTopLeftRadius = getPreviewSize(
		previewDevice,
		undefined !== dropdownBorderRadius ? dropdownBorderRadius[0] : '',
		undefined !== dropdownBorderRadiusTablet ? dropdownBorderRadiusTablet[0] : '',
		undefined !== dropdownBorderRadiusMobile ? dropdownBorderRadiusMobile[0] : ''
	);
	const previewDropdownBorderTopRightRadius = getPreviewSize(
		previewDevice,
		undefined !== dropdownBorderRadius ? dropdownBorderRadius[1] : '',
		undefined !== dropdownBorderRadiusTablet ? dropdownBorderRadiusTablet[1] : '',
		undefined !== dropdownBorderRadiusMobile ? dropdownBorderRadiusMobile[1] : ''
	);
	const previewDropdownBorderBottomRightRadius = getPreviewSize(
		previewDevice,
		undefined !== dropdownBorderRadius ? dropdownBorderRadius[2] : '',
		undefined !== dropdownBorderRadiusTablet ? dropdownBorderRadiusTablet[2] : '',
		undefined !== dropdownBorderRadiusMobile ? dropdownBorderRadiusMobile[2] : ''
	);
	const previewDropdownBorderBottomLeftRadius = getPreviewSize(
		previewDevice,
		undefined !== dropdownBorderRadius ? dropdownBorderRadius[3] : '',
		undefined !== dropdownBorderRadiusTablet ? dropdownBorderRadiusTablet[3] : '',
		undefined !== dropdownBorderRadiusMobile ? dropdownBorderRadiusMobile[3] : ''
	);
	const previewDropdownHorizontalAlignment = getPreviewSize(
		previewDevice,
		dropdownHorizontalAlignment,
		dropdownHorizontalAlignmentTablet,
		dropdownHorizontalAlignmentMobile
	);
	//need to caclulate this outside of conditionals because it uses a hook underneath.
	const dividerValue = css.render_border(divider, dividerTablet, dividerMobile, previewDevice, 'bottom');
	const dropdownDividerValue = css.render_border(
		dropdownDivider,
		dropdownDividerTablet,
		dropdownDividerMobile,
		previewDevice,
		'bottom'
	);
	const transparentDividerValue = css.render_border(
		transparentDivider,
		transparentDividerTablet,
		transparentDividerMobile,
		previewDevice,
		'bottom'
	);
	const stickyDividerValue = css.render_border(
		stickyDivider,
		stickyDividerTablet,
		stickyDividerMobile,
		previewDevice,
		'bottom'
	);

	//no added specificty needed for these variables
	//these variable will slot into selectors found in the static stylesheet.
	css.set_selector(`.wp-block-kadence-navigation${uniqueID}`);
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
	css.add_property(
		'--kb-nav-top-link-padding-left',
		css.render_half_size(previewNavigationHorizontalSpacing, spacingUnit),
		previewNavigationHorizontalSpacing
	);
	css.add_property(
		'--kb-nav-top-link-padding-right',
		css.render_half_size(previewNavigationHorizontalSpacing, spacingUnit),
		previewNavigationHorizontalSpacing
	);

	css.add_property(
		'--kb-nav-link-underline-width',
		'calc( 100% - ' + css.render_size(previewNavigationHorizontalSpacing, spacingUnit) + ' )',
		previewNavigationHorizontalSpacing
	);
	css.add_property(
		'--kb-nav-top-link-color-active-ancestor',
		css.render_color(previewLinkColorActive),
		previewParentActive
	);
	css.add_property(
		'--kb-nav-top-link-background-active-ancestor',
		css.render_color(previewBackgroundActive),
		previewParentActive
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
		previewParentActive && previewLinkColorDropdownActive
	);

	css.add_property('--kb-nav-dropdown-background', css.render_color(previewBackgroundDropdown));
	css.add_property('--kb-nav-dropdown-link-background-hover', css.render_color(previewBackgroundDropdownHover));
	css.add_property('--kb-nav-dropdown-link-background-active', css.render_color(previewBackgroundDropdownActive));

	css.add_property(
		'--kb-nav-dropdown-border-top',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'top')
	);
	css.add_property(
		'--kb-nav-dropdown-border-right',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'right')
	);
	css.add_property(
		'--kb-nav-dropdown-border-bottom',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'bottom')
	);
	css.add_property(
		'--kb-nav-dropdown-border-left',
		css.render_border(dropdownBorder, dropdownBorderTablet, dropdownBorderMobile, previewDevice, 'left')
	);
	css.add_property(
		'--kb-nav-dropdown-border-top-left-radius',
		getSpacingOptionOutput(previewDropdownBorderTopLeftRadius, dropdownBorderRadiusUnit)
	);
	css.add_property(
		'--kb-nav-dropdown-border-top-right-radius',
		getSpacingOptionOutput(previewDropdownBorderTopRightRadius, dropdownBorderRadiusUnit)
	);
	css.add_property(
		'--kb-nav-dropdown-border-bottom-right-radius',
		getSpacingOptionOutput(previewDropdownBorderBottomRightRadius, dropdownBorderRadiusUnit)
	);
	css.add_property(
		'--kb-nav-dropdown-border-bottom-left-radius',
		getSpacingOptionOutput(previewDropdownBorderBottomLeftRadius, dropdownBorderRadiusUnit)
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
		paddingLink,
		tabletPaddingLink,
		mobilePaddingLink,
		previewDevice,
		'--kb-nav-top-link-padding',
		paddingLinkUnit
	);
	css.render_measure_output(
		marginLink,
		tabletMarginLink,
		mobileMarginLink,
		previewDevice,
		'--kb-nav-top-link-margin',
		marginLinkUnit
	);

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

	css.add_property(
		'--kb-nav-dropdown-link-padding-top',
		css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit),
		previewDropdownVerticalSpacing
	);
	css.add_property(
		'--kb-nav-dropdown-link-padding-bottom',
		css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit),
		previewDropdownVerticalSpacing
	);

	//additional dynamic logic, but still lands in a slot in the static stylesheet
	if (
		(previewOrientation == 'vertical' ||
			previewStyle === 'standard' ||
			previewStyle === 'underline' ||
			previewStyle === '') &&
		!isNaN(parseFloat(previewNavigationVerticalSpacing)) &&
		isFinite(previewNavigationVerticalSpacing)
	) {
		css.add_property(
			'--kb-nav-top-link-padding-top',
			css.render_half_size(previewNavigationVerticalSpacing, spacingUnit)
		);
		css.add_property(
			'--kb-nav-top-link-padding-bottom',
			css.render_half_size(previewNavigationVerticalSpacing, spacingUnit)
		);
	}
	css.add_property(
		'--kb-nav-top-link-description-padding-top',
		css.render_size(previewDescriptionSpacing, descriptionSpacingUnit)
	);
	css.add_property('--kb-nav-top-link-description-color', css.render_color(previewDescriptionColor));
	css.add_property('--kb-nav-top-link-description-color-hover', css.render_color(previewDescriptionColorHover));
	css.add_property('--kb-nav-top-link-description-color-active', css.render_color(previewDescriptionColorActive));
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
			varBase: '--kb-nav-top-link-',
		},
		metaAttributes,
		previewDevice
	);

	//transparent styles
	if (context?.['kadence/headerIsTransparent'] == '1') {
		css.add_property('--kb-nav-top-link-color', css.render_color(previewLinkColorTransparent));
		css.add_property('--kb-nav-top-link-color-hover', css.render_color(previewLinkColorTransparentHover));
		css.add_property('--kb-nav-top-link-color-active', css.render_color(previewLinkColorTransparentActive));
		css.add_property(
			'--kb-nav-top-link-color-active-ancestor',
			css.render_color(previewLinkColorTransparentActive),
			previewParentActive
		);

		css.add_property('--kb-nav-top-link-background', css.render_color(previewBackgroundTransparent));
		css.add_property('--kb-nav-top-link-background-hover', css.render_color(previewBackgroundTransparentHover));
		css.add_property('--kb-nav-top-link-background-active', css.render_color(previewBackgroundTransparentActive));
		css.add_property(
			'--kb-nav-top-link-background-active-ancestor',
			css.render_color(previewBackgroundTransparentActive)
		);

		if (previewOrientation == 'vertical') {
			css.add_property('--kb-nav-link-wrap-border-bottom', transparentDividerValue);
			css.add_property('--kb-nav-dropdown-toggle-border-left', transparentDividerValue);
		} else {
			css.add_property('--kb-nav-top-not-last-link-border-right', transparentDividerValue);
		}
	}

	//sticky styles
	if (context?.['kadence/headerIsSticky'] == '1') {
		css.add_property('--kb-nav-top-link-color', css.render_color(previewLinkColorSticky));
		css.add_property('--kb-nav-top-link-color-hover', css.render_color(previewLinkColorStickyHover));
		css.add_property('--kb-nav-top-link-color-active', css.render_color(previewLinkColorStickyActive));
		css.add_property(
			'--kb-nav-top-link-color-active-ancestor',
			css.render_color(previewLinkColorStickyActive),
			previewParentActive
		);

		css.add_property('--kb-nav-top-link-background', css.render_color(previewBackgroundSticky));
		css.add_property('--kb-nav-top-link-background-hover', css.render_color(previewBackgroundStickyHover));
		css.add_property('--kb-nav-top-link-background-active', css.render_color(previewBackgroundStickyActive));
		css.add_property(
			'--kb-nav-top-link-background-active-ancestor',
			css.render_color(previewBackgroundStickyActive)
		);

		if (previewOrientation == 'vertical') {
			css.add_property('--kb-nav-link-wrap-border-bottom', stickyDividerValue);
			css.add_property('--kb-nav-dropdown-toggle-border-left', stickyDividerValue);
		} else {
			css.add_property('--kb-nav-top-not-last-link-border-right', stickyDividerValue);
		}
	}

	//placement logic where an additional selector is needed
	if (previewOrientation != 'vertical') {
		css.add_property('--kb-nav-dropdown-link-width', css.render_size(previewDropdownWidth, dropdownWidthUnit));
		css.add_property('--kb-nav-top-not-last-link-border-right', dividerValue);

		if (dropdownShadow?.[0]?.enable) {
			css.add_property('--kb-nav-dropdown-box-shadow', css.render_shadow(dropdownShadow[0]));
		}

		if (previewDropdownHorizontalAlignment == 'center') {
			css.add_property('--kb-nav-dropdown-show-left', '50%');
			css.add_property('--kb-nav-dropdown-show-transform-x', '-50%');
			css.add_property('--kb-nav-dropdown-hide-transform-x', '-50%');
		} else if (previewDropdownHorizontalAlignment == 'right') {
			css.add_property('--kb-nav-dropdown-show-right', '0');
		}
	} else {
		css.add_property('--kb-nav-top-not-last-link-border-bottom', dividerValue);
		css.add_property('--kb-nav-dropdown-toggle-border-left', dividerValue);
	}

	//not last submenu items and mega menu nav links
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .sub-menu > .menu-item:not(:last-of-type), .wp-block-kadence-navigation${uniqueID} .sub-menu.mega-menu > .menu-item > .kb-link-wrap > .kb-nav-link-content`
	);
	css.add_property('--kb-nav-menu-item-border-bottom', dropdownDividerValue);

	//main container(don't apply to children)
	css.set_selector(`.wp-block-kadence-navigation${uniqueID} > .navigation > .menu-container > .menu`);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, '--kb-nav-margin', marginUnit);
	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, '--kb-nav-padding', paddingUnit);

	//nav item (top level only)
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap > .kb-nav-link-content`
	);
	css.render_font(typography ? typography : [], previewDevice);

	//submenu links only, do not bleed
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .sub-menu > .menu-item > .kb-link-wrap > .kb-nav-link-content`
	);
	css.render_font(dropdownTypography ? dropdownTypography : [], previewDevice);

	//nav item (top level only) descriptions
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap .kb-nav-label-description`
	);
	css.render_font(descriptionTypography ? descriptionTypography : [], previewDevice);

	//submenu link descriptions only, do not bleed
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .sub-menu > .menu-item > .kb-link-wrap .kb-nav-label-description`
	);
	css.render_font(dropdownDescriptionTypography ? dropdownDescriptionTypography : [], previewDevice);

	if (previewStyle.includes('fullheight')) {
		css.set_selector(`.wp-block-kadence-header .wp-block-kadence-navigation${uniqueID}`);
		css.add_property('height', '100%');
	}

	//editor fix
	if (isSelected) {
		css.set_selector(
			`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter`
		);
		css.add_property('display', 'none');
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
