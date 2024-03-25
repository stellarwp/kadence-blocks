import { KadenceBlocksCSS, getPreviewSize } from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice } = props;

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
	} = attributes;

	// const previewDivider = getPreviewSize(previewDevice, divider, dividerTablet, dividerMobile);

	const css = new KadenceBlocksCSS();

	css.set_selector(
		`.wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a, .wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap`
	);
	css.add_property('color', css.render_color(linkColor, linkColorTablet, linkColorMobile, previewDevice));
	css.add_property('background', css.render_color(background, backgroundTablet, backgroundMobile, previewDevice));
	css.set_selector(
		`.wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap:hover > a, .wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap:hover`
	);
	css.add_property(
		'color',
		css.render_color(linkColorHover, linkColorHoverTablet, linkColorHoverMobile, previewDevice)
	);
	css.add_property(
		'background',
		css.render_color(backgroundHover, backgroundHoverTablet, backgroundHoverMobile, previewDevice)
	);

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a,
		.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap`
	);
	css.add_property(
		'color',
		css.render_color(linkColorActive, linkColorActiveTablet, linkColorActiveMobile, previewDevice)
	);
	css.add_property(
		'background',
		css.render_color(backgroundActive, backgroundActiveTablet, backgroundActiveMobile, previewDevice)
	);

	if ('custom' === megaMenuWidth) {
		css.set_selector(
			`.wp-block-kadence-navigation .menu-container ul.menu .wp-block-kadence-navigation-link${uniqueID}.kadence-menu-mega-width-custom > ul.sub-menu`
		);
		css.add_property('width', css.render_size(megaMenuCustomWidth, null, null, null, megaMenuCustomWidthUnit));
		// $css->set_selector( '.header-navigation[class*="header-navigation-dropdown-animation-fade"] #menu-item-' . $item->ID . '.kadence-menu-mega-enabled > .sub-menu' );
		// $css->add_property( 'margin-left', '-' . ( $data['mega_menu_custom_width'] ? floor( $data['mega_menu_custom_width'] / 2 ) : '400' ) . 'px' );
	}

	//Dropdown logic from theme Styles Component
	// Dropdown.
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul.sub-menu, .wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul.submenu`
	);
	css.add_property(
		'background',
		css.render_color(backgroundDropdown, backgroundDropdownTablet, backgroundDropdownMobile, previewDevice)
	);
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li:not(:last-of-type), .wp-block-kadence-navigation .menu-container ul.menu li.wp-block-kadence-navigation-link${uniqueID}.kadence-menu-mega-enabled > ul > li.menu-item > a`
	);
	css.add_property(
		'border-bottom',
		css.render_border(dropdownDivider, dropdownDividerTablet, dropdownDividerMobile, previewDevice, 'bottom')
	);
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li.menu-item > .link-drop-wrap > a`
	);
	css.add_property(
		'padding-top',
		css.render_size(
			dropdownVerticalSpacing,
			dropdownVerticalSpacingTablet,
			dropdownVerticalSpacingMobile,
			previewDevice,
			dropdownVerticalSpacingUnit
		)
	);
	css.add_property(
		'padding-bottom',
		css.render_size(
			dropdownVerticalSpacing,
			dropdownVerticalSpacingTablet,
			dropdownVerticalSpacingMobile,
			previewDevice,
			dropdownVerticalSpacingUnit
		)
	);
	css.render_font(dropdownTypography ? dropdownTypography : [], previewDevice);
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li.menu-item > .link-drop-wrap > a, .wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul.sub-menu `
	);
	css.add_property(
		'color',
		css.render_color(linkColorDropdown, linkColorDropdownTablet, linkColorDropdownMobile, previewDevice)
	);
	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li.menu-item > .link-drop-wrap > a:hover`
	);
	css.add_property(
		'color',
		css.render_color(
			linkColorDropdownHover,
			linkColorDropdownHoverTablet,
			linkColorDropdownHoverMobile,
			previewDevice
		)
	);
	css.add_property(
		'background',
		css.render_color(
			backgroundDropdownHover,
			backgroundDropdownHoverTablet,
			backgroundDropdownHoverMobile,
			previewDevice
		)
	);
	css.set_selector(
		`.wp-block-kadence-navigation.navigation .menu-container ul .wp-block-kadence-navigation-link${uniqueID} ul li.menu-item.current-menu-item > .link-drop-wrap > a`
	);
	css.add_property(
		'color',
		css.render_color(
			linkColorDropdownActive,
			linkColorDropdownActiveTablet,
			linkColorDropdownActiveMobile,
			previewDevice
		)
	);
	css.add_property(
		'background',
		css.render_color(
			backgroundDropdownActive,
			backgroundDropdownActiveTablet,
			backgroundDropdownActiveMobile,
			previewDevice
		)
	);

	css.set_selector(
		`.wp-block-kadence-navigation .navigation .menu-container > ul li.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a`
	);
	css.render_font(typography ? typography : [], previewDevice);

	css.set_selector(`.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a`);
	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingUnit);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, 'margin', marginUnit);

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
