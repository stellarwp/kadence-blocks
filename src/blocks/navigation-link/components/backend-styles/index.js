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
		megaMenuWidth,
		megaMenuCustomWidth,
		megaMenuCustomWidthUnit,
		typography,
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
