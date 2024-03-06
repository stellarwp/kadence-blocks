import { KadenceBlocksCSS } from '@kadence/helpers';
import { Getstyles } from '../';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, metaAttributes } = props;

	const { uniqueID } = attributes;

	const {
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
		navigationTypography,
	} = metaAttributes;

	const navigationHorizontalSpacing = spacing[1];
	const navigationVerticalSpacing = spacing[0];

	const css = new KadenceBlocksCSS();

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
	css.add_property('width', 'calc( 100% - ' + css.render_size(navigationHorizontalSpacing, spacingUnit) + ')');
	css.set_selector(`.wp-block-kadence-navigation${uniqueID} .menu-container > ul > li.menu-item > a`);
	css.add_property('padding-left', css.render_half_size(navigationHorizontalSpacing, spacingUnit));
	css.add_property('padding-right', css.render_half_size(navigationHorizontalSpacing, spacingUnit));
	if (orientation == 'vertical' || style === 'standard' || style === 'underline' || style === '') {
		css.add_property('padding-top', css.render_size(navigationVerticalSpacing, spacingUnit));
		css.add_property('padding-bottom', css.render_size(navigationVerticalSpacing, spacingUnit));
	}
	css.add_property('color', css.render_color(linkColor));
	css.add_property('background', css.render_color(background));
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item .dropdown-nav-special-toggle`
	);
	css.add_property('right', css.render_half_size(navigationHorizontalSpacing, spacingUnit));
	css.set_selector(`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul li.menu-item > a`);
	css.render_font(navigationTypography, `.wp-block-kadence-navigation${uniqueID} .navigation`, previewDevice);
	css.set_selector(
		`.wp-block-kadence-navigation${uniqueID} .navigation .menu-container > ul > li.menu-item > a:hover`
	);
	css.add_property('color', css.render_color(linkColorHover));
	css.add_property('background', css.render_color(backgroundHover));
	if (parentActive) {
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
	css.add_property('color', css.render_color(linkColorActive));
	css.add_property('background', css.render_color(backgroundActive));

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
