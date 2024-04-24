import { KadenceBlocksCSS, getPreviewSize } from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, metaAttributes, context } = props;

	const { uniqueID } = attributes;

	const {
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		margin,
		tabletMargin,
		mobileMargin,
		marginUnit,
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
		typography,
		dropdownTypography,
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
		dropdownWidth,
		dropdownWidthTablet,
		dropdownWidthMobile,
		dropdownWidthUnit,
		dropdownVerticalSpacing,
		dropdownVerticalSpacingTablet,
		dropdownVerticalSpacingMobile,
		dropdownVerticalSpacingUnit,
		dropdownShadow,
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

	const previewOrientation = getPreviewSize(
		previewDevice,
		orientation ? orientation : 'horizontal',
		orientationTablet,
		orientationMobile
	);
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
	const previewDropdownVerticalSpacing = getPreviewSize(
		previewDevice,
		dropdownVerticalSpacing,
		dropdownVerticalSpacingTablet,
		dropdownVerticalSpacingMobile
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

	if (isSelected) {
		css.set_selector(
			`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter`
		);
		css.add_property('display', 'none');
	}

	// Navigation logic from theme styles component.
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation[class*="navigation-style-underline"] .menu-container>ul>li>a:after`
	);
	css.add_property('width', 'calc( 100% - ' + css.render_size(previewNavigationHorizontalSpacing) + ')');
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap >a`
	);
	css.add_property(
		'padding-left',
		css.render_half_size(previewNavigationHorizontalSpacing),
		previewNavigationHorizontalSpacing
	);
	css.add_property(
		'padding-right',
		css.render_half_size(previewNavigationHorizontalSpacing),
		previewNavigationHorizontalSpacing
	);
	if (
		(previewOrientation == 'vertical' ||
			previewStyle === 'standard' ||
			previewStyle === 'underline' ||
			previewStyle === '') &&
		!isNaN(parseFloat(previewNavigationVerticalSpacing)) &&
		isFinite(previewNavigationVerticalSpacing)
	) {
		css.add_property('padding-top', css.render_half_size(previewNavigationVerticalSpacing));
		css.add_property('padding-bottom', css.render_half_size(previewNavigationVerticalSpacing));
	}

	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap > a, .wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap`
	);
	css.add_property('color', css.render_color(previewLinkColor));
	css.add_property('background', css.render_color(previewBackground));
	if (context?.['kadence/headerIsTransparent'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorTransparent));
		css.add_property('background', css.render_color(previewBackgroundTransparent));
	}
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap:hover > a, .wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap:hover`
	);
	css.add_property('color', css.render_color(previewLinkColorHover));
	css.add_property('background', css.render_color(previewBackgroundHover));
	if (context?.['kadence/headerIsTransparent'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorTransparentHover));
		css.add_property('background', css.render_color(previewBackgroundTransparentHover));
	}
	if (previewParentActive) {
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation[class*="navigation-style-underline"] .menu-container.menu-container>ul>li.current-menu-ancestor>a:after`
		);
		css.add_property('transform', 'scale(1, 1) translate(50%, 0)');
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap > a,
			.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap,
			.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .link-drop-wrap > a,
			.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .link-drop-wrap`
		);
	} else {
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap > a,
			.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap`
		);
	}
	css.add_property('color', css.render_color(previewLinkColorActive));
	css.add_property('background', css.render_color(previewBackgroundActive));
	if (context?.['kadence/headerIsTransparent'] == '1') {
		css.add_property('color', css.render_color(previewLinkColorTransparentActive));
		css.add_property('background', css.render_color(previewBackgroundTransparentActive));
	}

	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item .dropdown-navigation-toggle`
	);
	css.add_property('right', css.render_half_size(previewNavigationHorizontalSpacing, spacingUnit));
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul li.menu-item > .link-drop-wrap > a`
	);
	css.render_font(typography ? typography : [], previewDevice);

	//Dropdown logic from theme Styles Component
	// Dropdown.
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container ul ul.sub-menu, .wp-block-kadence-navigation${uniqueID} .navigation .menu-container ul ul.submenu`
	);
	css.add_property('background', css.render_color(previewBackgroundDropdown));
	if (previewOrientation == 'horizontal') {
		if (dropdownShadow?.[0]?.enable) {
			css.add_property('box-shadow', css.render_shadow(dropdownShadow[0]));
		}
	}
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container ul ul li:not(:last-of-type), .wp-block-kadence-navigation${uniqueID} .menu-container ul.menu > li.kadence-menu-mega-enabled > ul > li.menu-item > a`
	);
	css.add_property('border-bottom', dropdownDividerValue);
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container ul ul li.menu-item > .link-drop-wrap > a`
	);
	if (previewOrientation == 'horizontal') {
		css.add_property('width', previewDropdownWidth + dropdownWidthUnit);
	}
	css.add_property('padding-top', css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit));
	css.add_property('padding-bottom', css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit));
	css.render_font(dropdownTypography ? dropdownTypography : [], previewDevice);
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container ul ul li.menu-item > .link-drop-wrap > a, .wp-block-kadence-navigation${uniqueID} .navigation .menu-container ul ul.sub-menu `
	);
	css.add_property('color', css.render_color(previewLinkColorDropdown));
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container ul ul li.menu-item > .link-drop-wrap > a:hover`
	);
	css.add_property('color', css.render_color(previewLinkColorDropdownHover));
	css.add_property('background', css.render_color(previewBackgroundDropdownHover));
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID}.navigation .menu-container ul ul li.menu-item.current-menu-item > .link-drop-wrap > a`
	);
	css.add_property('color', css.render_color(previewLinkColorDropdownActive));
	css.add_property('background', css.render_color(previewBackgroundDropdownActive));

	//New Logic for block
	if (previewOrientation == 'vertical') {
		css.set_selector(`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container ul li .link-drop-wrap`);
		css.add_property('border-bottom', dividerValue);
		if (context?.['kadence/headerIsTransparent'] == '1') {
			css.add_property('border-bottom', transparentDividerValue);
		}
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation:not(.drawer-navigation-parent-toggle-true) ul li .link-drop-wrap button`
		);
		css.add_property('border-left', dividerValue);
		if (context?.['kadence/headerIsTransparent'] == '1') {
			css.add_property('border-left', transparentDividerValue);
		}
	} else {
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation > .menu-container > ul > li:not(:last-of-type) > .link-drop-wrap`
		);
		css.add_property('border-right', dividerValue);
		if (context?.['kadence/headerIsTransparent'] == '1') {
			css.add_property('border-right', transparentDividerValue);
		}
	}
	css.set_selector(`.wp-block-kadence-navigation${uniqueID} > .navigation > .menu-container > .menu`);
	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingUnit);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, 'margin', marginUnit);

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
