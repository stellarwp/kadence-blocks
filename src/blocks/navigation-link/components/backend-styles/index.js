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

	css.set_selector(`.wp-block-kadence-navigation-link${uniqueID} > .link-drop-wrap > a`);
	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingUnit);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, 'margin', marginUnit);

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
