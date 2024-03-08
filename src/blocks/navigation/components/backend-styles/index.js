import { KadenceBlocksCSS, getPreviewSize } from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, metaAttributes } = props;

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
		spacing,
		spacingUnit,
		style,
		stretch,
		fillStretch,
		parentActive,
		linkColor,
		linkColorHover,
		linkColorActive,
		background,
		backgroundHover,
		backgroundActive,
		typography,
		collapseSubMenus,
		parentTogglesMenus,
		divider,
		dividerTablet,
		dividerMobile,
	} = metaAttributes;

	const navigationHorizontalSpacing = spacing[1];
	const navigationVerticalSpacing = spacing[0];

	// const previewDivider = getPreviewSize(previewDevice, divider, dividerTablet, dividerMobile);

	const css = new KadenceBlocksCSS();

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
	css.add_property('width', 'calc( 100% - ' + css.render_size(navigationHorizontalSpacing, spacingUnit) + ')');
	css.set_selector(`.wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap`);
	css.add_property('padding-left', css.render_half_size(navigationHorizontalSpacing, spacingUnit));
	css.add_property('padding-right', css.render_half_size(navigationHorizontalSpacing, spacingUnit));
	if (orientation == 'vertical' || style === 'standard' || style === 'underline' || style === '') {
		css.add_property('padding-top', css.render_size(navigationVerticalSpacing, spacingUnit));
		css.add_property('padding-bottom', css.render_size(navigationVerticalSpacing, spacingUnit));
	}

	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap, .wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap > a`
	);
	css.add_property('color', css.render_color(linkColor));
	css.add_property('background', css.render_color(background));
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap:hover, .wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > .link-drop-wrap:hover > a`
	);
	css.add_property('color', css.render_color(linkColorHover));
	css.add_property('background', css.render_color(backgroundHover));
	if (parentActive) {
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation[class*="navigation-style-underline"] .menu-container.menu-container>ul>li.current-menu-ancestor>a:after`
		);
		css.add_property('transform', 'scale(1, 1) translate(50%, 0)');
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap, .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .link-drop-wrap, .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .link-drop-wrap, .wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap > a, .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .link-drop-wrap > a, .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .link-drop-wrap > a`
		);
	} else {
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap, .wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap > a`
		);
	}
	css.add_property('color', css.render_color(linkColorActive));
	css.add_property('background', css.render_color(backgroundActive));

	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item .dropdown-nav-special-toggle`
	);
	css.add_property('right', css.render_half_size(navigationHorizontalSpacing, spacingUnit));
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul li.menu-item > .link-drop-wrap > a`
	);
	css.render_font(typography, previewDevice);

	//Mobile menu logic from theme styles component
	// // Mobile Menu.
	// $css->set_selector( '.mobile-navigation ul li' );
	// $css->render_font( kadence()->option( 'mobile_navigation_typography' ), $css );
	// $css->start_media_query( $media_query['tablet'] );
	// $css->set_selector( '.mobile-navigation ul li' );
	// $css->add_property( 'font-size', $this->render_font_size( kadence()->option( 'mobile_navigation_typography' ), 'tablet' ) );
	// $css->add_property( 'line-height', $this->render_font_height( kadence()->option( 'mobile_navigation_typography' ), 'tablet' ) );
	// $css->add_property( 'letter-spacing', $this->render_font_spacing( kadence()->option( 'mobile_navigation_typography' ), 'tablet' ) );
	// $css->stop_media_query();
	// $css->start_media_query( $media_query['mobile'] );
	// $css->set_selector( '.mobile-navigation ul li' );
	// $css->add_property( 'font-size', $this->render_font_size( kadence()->option( 'mobile_navigation_typography' ), 'mobile' ) );
	// $css->add_property( 'line-height', $this->render_font_height( kadence()->option( 'mobile_navigation_typography' ), 'mobile' ) );
	// $css->add_property( 'letter-spacing', $this->render_font_spacing( kadence()->option( 'mobile_navigation_typography' ), 'mobile' ) );
	// $css->stop_media_query();
	// $css->set_selector( '.mobile-navigation ul li a' );
	// $css->add_property( 'padding-top', kadence()->sub_option( 'mobile_navigation_vertical_spacing', 'size' ) . kadence()->sub_option( 'mobile_navigation_vertical_spacing', 'unit' ) );
	// $css->add_property( 'padding-bottom', kadence()->sub_option( 'mobile_navigation_vertical_spacing', 'size' ) . kadence()->sub_option( 'mobile_navigation_vertical_spacing', 'unit' ) );
	// $css->set_selector( '.mobile-navigation ul li > a, .mobile-navigation ul li.menu-item-has-children > .drawer-nav-drop-wrap' );
	// $css->add_property( 'background', $css->render_color( kadence()->sub_option( 'mobile_navigation_background', 'color' ) ) );
	// $css->add_property( 'color', $css->render_color( kadence()->sub_option( 'mobile_navigation_color', 'color' ) ) );
	// $css->set_selector( '.mobile-navigation ul li > a:hover, .mobile-navigation ul li.menu-item-has-children > .drawer-nav-drop-wrap:hover' );
	// $css->add_property( 'background', $css->render_color( kadence()->sub_option( 'mobile_navigation_background', 'hover' ) ) );
	// $css->add_property( 'color', $css->render_color( kadence()->sub_option( 'mobile_navigation_color', 'hover' ) ) );
	// $css->set_selector( '.mobile-navigation ul li.current-menu-item > a, .mobile-navigation ul li.current-menu-item.menu-item-has-children > .drawer-nav-drop-wrap' );
	// $css->add_property( 'background', $css->render_color( kadence()->sub_option( 'mobile_navigation_background', 'active' ) ) );
	// $css->add_property( 'color', $css->render_color( kadence()->sub_option( 'mobile_navigation_color', 'active' ) ) );
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation ul li.menu-item-has-children .link-drop-wrap, .wp-block-kadence-navigation${uniqueID} .navigation ul li:not(.menu-item-has-children) a`
	);
	css.add_property(
		'border-bottom',
		css.render_border(previewDevice, 'bottom', divider, dividerTablet, dividerMobile)
	);
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation:not(.drawer-navigation-parent-toggle-true) ul li.menu-item-has-children .link-drop-wrap button`
	);
	css.add_property('border-left', css.render_border(previewDevice, 'bottom', divider, dividerTablet, dividerMobile));

	//New Logic for block
	if (orientation == 'vertical') {
	}
	css.set_selector(`.wp-block-kadence-navigation${uniqueID} > .navigation > .menu-container > .menu`);
	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingUnit);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, 'margin', marginUnit);

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
