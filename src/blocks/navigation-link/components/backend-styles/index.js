import { KadenceBlocksCSS, getPreviewSize, useEditorWidth } from '@kadence/helpers';
import { useRef } from '@wordpress/element';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, currentRef } = props;

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
		mediaIcon,
		mediaImage,
		mediaStyle,
		mediaAlign,
		mediaAlignTablet,
		mediaAlignMobile,
	} = attributes;

	//const ref = useRef();
	const editorWidth = useEditorWidth(currentRef, []);
	const isFEIcon = 'fe' === mediaIcon[0].icon.substring(0, 2);
	//console.log(1, currentRef);

	// const previewDivider = getPreviewSize(previewDevice, divider, dividerTablet, dividerMobile);

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

	const previewBackground = getPreviewSize(previewDevice, background, backgroundTablet, backgroundMobile);
	const previewBackgroundHover = getPreviewSize(
		previewDevice,
		backgroundHover,
		backgroundHoverTablet,
		backgroundHoverMobile
	);
	const previewLabelColor = getPreviewSize(
		previewDevice,
		labelColor,
		labelColorTablet,
		labelColorMobile
	);
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
	const previewBackgroundActive = getPreviewSize(
		previewDevice,
		backgroundActive,
		backgroundActiveTablet,
		backgroundActiveMobile
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
	const previewMediaIconSize = getPreviewSize(
		previewDevice,
		mediaIcon[0].size,
		mediaIcon[0].sizeTablet,
		mediaIcon[0].sizeMobile
	);
	const previewMediaIconWidth = getPreviewSize(
		previewDevice,
		mediaIcon[0].width,
		mediaIcon[0].widthTablet,
		mediaIcon[0].widthMobile
	);
	const previewMediaAlign = getPreviewSize(previewDevice, mediaAlign, mediaAlignTablet, mediaAlignMobile);
	if (uniqueID == '494_c9029f-f0') {
		console.log(1, mediaStyle);
	}
	const css = new KadenceBlocksCSS();

	css.set_selector(
		`.wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a, .wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap`
	);
	css.add_property('color', css.render_color(previewLinkColor));
	css.add_property('background', css.render_color(previewBackground));
	css.set_selector(
		`.wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap:hover > a, .wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap:hover`
	);
	css.add_property('color', css.render_color(previewLinkColorHover));
	css.add_property('background', css.render_color(previewBackgroundHover));

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a,
		.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap`
	);
	css.add_property('color', css.render_color(previewLinkColorActive));
	css.add_property('background', css.render_color(previewBackgroundActive));

	if (megaMenuWidth === 'custom') {
		css.set_selector(
			`.wp-block-kadence-navigation .menu-container ul.menu .wp-block-kadence-navigation-link${uniqueID}.kadence-menu-mega-width-custom > ul.sub-menu`
		);
		css.add_property('width', css.render_size(megaMenuCustomWidth, megaMenuCustomWidthUnit));
		// $css->set_selector( '.header-navigation[class*="header-navigation-dropdown-animation-fade"] #menu-item-' . $item->ID . '.kadence-menu-mega-enabled > .sub-menu' );
		// $css->add_property( 'margin-left', '-' . ( $data['mega_menu_custom_width'] ? floor( $data['mega_menu_custom_width'] / 2 ) : '400' ) . 'px' );
	} else if (megaMenuWidth === 'full' && currentRef?.current) {
		css.set_selector(
			`.wp-block-kadence-navigation .menu-container ul.menu .wp-block-kadence-navigation-link${uniqueID}.kadence-menu-mega-width-full > ul.sub-menu`
		);
		css.add_property('width', editorWidth + 'px');
		css.add_property(
			'left',
			-1 *
				Math.abs(
					currentRef.current.closest('.wp-block-kadence-navigation-link').getBoundingClientRect().left
				).toString() +
				'px'
		);
	}

	//Dropdown logic from theme Styles Component
	// Dropdown.
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul.sub-menu, .wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul.submenu`
	);
	css.add_property('background', css.render_color(previewBackgroundDropdown));
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li:not(:last-of-type), .wp-block-kadence-navigation .menu-container ul.menu li.wp-block-kadence-navigation-link${uniqueID}.kadence-menu-mega-enabled > ul > li.menu-item > a`
	);
	css.add_property('border-bottom', css.render_border(previewDropdownDivider, 'bottom'));
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li.menu-item > .link-drop-wrap > a`
	);
	css.add_property('padding-top', css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit));
	css.add_property('padding-bottom', css.render_size(previewDropdownVerticalSpacing, dropdownVerticalSpacingUnit));
	css.render_font(dropdownTypography ? dropdownTypography : [], previewDevice);
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li.menu-item > .link-drop-wrap > a, .wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul.sub-menu `
	);
	css.add_property('color', css.render_color(previewLinkColorDropdown));
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li.menu-item > .link-drop-wrap > a:hover`
	);
	css.add_property('color', css.render_color(previewLinkColorDropdownHover));
	css.add_property('background', css.render_color(previewBackgroundDropdownHover));
	css.set_selector(
		`.wp-block-kadence-navigation.navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li.menu-item.current-menu-item > .link-drop-wrap > a`
	);
	css.add_property('color', css.render_color(previewLinkColorDropdownActive));
	css.add_property('background', css.render_color(previewBackgroundDropdownActive));

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container > ul li.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a`
	);
	css.render_font(typography ? typography : [], previewDevice);

	css.set_selector(`.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a`);
	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingUnit);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, 'margin', marginUnit);

	//media styles
	if (mediaType && 'none' !== mediaType) {
		//normal styles
		css.set_selector(
			`.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a > .link-drop-title-wrap > .link-media-container`
		);
		css.add_property('background-color', css.render_color(previewMediaStyleBackground));
		css.add_property('border-radius', css.render_size(previewMediaStyleBorderRadius));
		css.add_property('padding-top', css.render_size(previewMediaStylePadding[0], 'px'));
		css.add_property('padding-right', css.render_size(previewMediaStylePadding[1], 'px'));
		css.add_property('padding-bottom', css.render_size(previewMediaStylePadding[2], 'px'));
		css.add_property('padding-left', css.render_size(previewMediaStylePadding[3], 'px'));

		if (previewMediaAlign == 'left') {
			css.add_property('order', '-1');
			css.add_property('margin-right', css.render_size(previewMediaStyleMargin[0], 'px'));

			css.set_selector(
				`.wp-block-kadence-navigation-link${uniqueID}.kadence-menu-has-description.kadence-menu-has-icon > .link-drop-wrap > a > .link-drop-title-wrap`
			);
			css.add_property('grid-template-columns', 'auto 1fr');
		} else {
			css.add_property('margin-left', css.render_size(previewMediaStyleMargin[0], 'px'));
		}

		css.set_selector(
			`.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a > .link-drop-title-wrap > .link-media-container > .link-svg-icon > svg`
		);
		css.add_property('width', css.render_size(previewMediaIconSize, 'px'));
		css.add_property('height', css.render_size(previewMediaIconSize, 'px'));
		css.add_property('stroke-width', css.render_size(isFEIcon ? previewMediaIconWidth : null, 'px'));
		css.add_property('color', css.render_color(previewMediaStyleColor));

		//hover style
		css.set_selector(
			`.wp-block-kadence-navigation-link${uniqueID}:hover > .link-drop-wrap > a > .link-drop-title-wrap > .link-media-container`
		);
		css.add_property('background-color', css.render_color(previewMediaStyleBackgroundHover));
		css.set_selector(
			`.wp-block-kadence-navigation-link${uniqueID}:hover > .link-drop-wrap > a > .link-drop-title-wrap > .link-media-container > .link-svg-icon > svg`
		);
		css.add_property('color', css.render_color(previewMediaStyleColorHover));

		//active style
		css.set_selector(
			`.wp-block-kadence-navigation-link${uniqueID}.current-menu-item > .link-drop-wrap > a > .link-drop-title-wrap > .link-media-container`
		);
		css.add_property('background-color', css.render_color(previewMediaStyleBackgroundActive));
		css.set_selector(
			`.wp-block-kadence-navigation-link${uniqueID}.current-menu-item > .link-drop-wrap > a > .link-drop-title-wrap > .link-media-container > .link-svg-icon > svg`
		);
		css.add_property('color', css.render_color(previewMediaStyleColorActive));
	}

	css.set_selector(
		`.wp-block-kadence-navigation-link${uniqueID}.menu-item > .link-drop-wrap > a .link-highlight-label`
	);
	css.add_property('color', css.render_color(previewLabelColor));
	css.add_property('background-color', css.render_color(previewLabelBackground));
	css.set_selector(
		`.wp-block-kadence-navigation-link${uniqueID}.menu-item:hover > .link-drop-wrap > a .link-highlight-label`
	);
	css.add_property('transition', 'all 0.35s ease-in-out');
	css.add_property('color', css.render_color(previewLabelColorHover));
	css.add_property('background-color', css.render_color(previewLabelBackgroundHover));
	css.set_selector(
		`.wp-block-kadence-navigation-link${uniqueID}.menu-item > .link-drop-wrap > a:active .link-highlight-label`
	);
	css.add_property('color', css.render_color(previewLabelColorActive));
	css.add_property('background-color', css.render_color(previewLabelBackgroundActive));

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
