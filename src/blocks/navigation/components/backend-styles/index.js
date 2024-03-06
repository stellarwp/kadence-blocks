import { KadenceBlocksCSS } from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice } = props;

	const {
		uniqueID,
		navigationOrientation,
		navigationSpacing,
		navigationSpacingUnit,
		navigationStyle,
		navigationStretch,
		navigationFillStretch,
		navigationParentActive,
		navigationLinkColor,
		navigationLinkColorHover,
		navigationLinkColorActive,
		navigationBackground,
		navigationBackgroundHover,
		navigationBackgroundActive,
		navigationTypography,
	} = attributes;

	const navigationHorizontalSpacing = navigationSpacing[1];
	const navigationVerticalSpacing = navigationSpacing[0];

	let css = new KadenceBlocksCSS();

	if (isSelected) {
		css.set_selector(
			`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter`
		);
		css.add_property('display', 'none');
	}

	// Navigation logic from theme styles component.
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation[class*="header-navigation-style-underline"] .menu-container>ul>li>a:after`
	);
	css.add_property(
		'width',
		'calc( 100% - ' + css.render_size(navigationHorizontalSpacing, navigationSpacingUnit) + ')'
	);
	css.set_selector(`.wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > a`);
	css.add_property('padding-left', css.render_half_size(navigationHorizontalSpacing, navigationSpacingUnit));
	css.add_property('padding-right', css.render_half_size(navigationHorizontalSpacing, navigationSpacingUnit));
	if (navigationOrientation == 'vertical' || navigationStyle === 'standard' || navigationStyle === 'underline') {
		css.add_property('padding-top', css.render_size(navigationVerticalSpacing, navigationSpacingUnit));
		css.add_property('padding-bottom', css.render_size(navigationVerticalSpacing, navigationSpacingUnit));
	}
	css.add_property('color', css.render_color(navigationLinkColor));
	css.add_property('background', css.render_color(navigationBackground));
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item .dropdown-nav-special-toggle`
	);
	css.add_property('right', css.render_half_size(navigationHorizontalSpacing, navigationSpacingUnit));
	css.set_selector(`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul li.menu-item > a`);
	css.render_font(navigationTypography, `.wp-block-kadence-navigation${uniqueID} .navigation`, previewDevice);
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item > a:hover`
	);
	css.add_property('color', css.render_color(navigationLinkColorHover));
	css.add_property('background', css.render_color(navigationBackgroundHover));
	if (navigationParentActive) {
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation[class*="header-navigation-style-underline"] .menu-container.menu-container>ul>li.current-menu-ancestor>a:after`
		);
		css.add_property('transform', 'scale(1, 1) translate(50%, 0)');
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > a, .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > a, .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > a`
		);
	} else {
		css.set_selector(
			`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item.current-menu-item > a`
		);
	}
	css.add_property('color', css.render_color(navigationLinkColorActive));
	css.add_property('background', css.render_color(navigationBackgroundActive));

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
