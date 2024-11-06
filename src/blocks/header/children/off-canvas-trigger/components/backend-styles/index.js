import { KadenceBlocksCSS, getPreviewSize, KadenceColorOutput, getSpacingOptionOutput } from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, context } = props;

	const {
		uniqueID,
		icon,
		iconSize,
		iconSizeTablet,
		iconSizeMobile,
		iconColor,
		iconColorTablet,
		iconColorMobile,
		iconColorHover,
		iconColorHoverTablet,
		iconColorHoverMobile,
		iconBackgroundColor,
		iconBackgroundColorTablet,
		iconBackgroundColorMobile,
		iconBackgroundColorHover,
		iconBackgroundColorHoverTablet,
		iconBackgroundColorHoverMobile,
		label,
		padding,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		margin,
		marginTablet,
		marginMobile,
		marginUnit,
		border,
		borderTablet,
		borderMobile,
		borderHover,
		borderHoverTablet,
		borderHoverMobile,
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		borderRadiusUnit,
	} = attributes;

	const previewIconColor = getPreviewSize(previewDevice, iconColor, iconColorTablet, iconColorMobile);
	const previewIconColorHover = getPreviewSize(
		previewDevice,
		iconColorHover,
		iconColorHoverTablet,
		iconColorHoverMobile
	);
	const previewIconBackgroundColor = getPreviewSize(
		previewDevice,
		iconBackgroundColor,
		iconBackgroundColorTablet,
		iconBackgroundColorMobile
	);
	const previewIconBackgroundColorHover = getPreviewSize(
		previewDevice,
		iconBackgroundColorHover,
		iconBackgroundColorHoverTablet,
		iconBackgroundColorHoverMobile
	);

	const css = new KadenceBlocksCSS();

	// For the contaner styles, they need to get applied to the hover state too, due to resets on hover styles in the css
	//container (fix for margin specificty)
	css.set_selector(
		`.editor-styles-wrapper .wp-block-kadence-off-canvas-trigger${uniqueID}, .wp-block-kadence-off-canvas-trigger${uniqueID}:hover`
	);
	css.render_measure_output(margin, marginTablet, marginMobile, previewDevice, 'margin', marginUnit);
	//container
	css.set_selector(
		`.wp-block-kadence-off-canvas-trigger${uniqueID}, .wp-block-kadence-off-canvas-trigger${uniqueID}:hover`
	);
	css.render_measure_output(padding, paddingTablet, paddingMobile, previewDevice, 'padding', paddingUnit);
	css.add_property('background-color', KadenceColorOutput(previewIconBackgroundColor));
	css.add_property('border-top', css.render_border(border, borderTablet, borderMobile, previewDevice, 'top', false));
	css.add_property(
		'border-right',
		css.render_border(border, borderTablet, borderMobile, previewDevice, 'right', false)
	);
	css.add_property(
		'border-bottom',
		css.render_border(border, borderTablet, borderMobile, previewDevice, 'bottom', false)
	);
	css.add_property(
		'border-left',
		css.render_border(border, borderTablet, borderMobile, previewDevice, 'left', false)
	);
	// SVG
	css.set_selector(`.wp-block-kadence-off-canvas-trigger${uniqueID} svg`);
	css.add_property('color', KadenceColorOutput(previewIconColor));
	// SVG hover
	css.set_selector(`.wp-block-kadence-off-canvas-trigger${uniqueID}:hover svg`);
	css.add_property('color', KadenceColorOutput(previewIconColorHover));
	//fix for editor specificity
	css.set_selector(
		`.editor-styles-wrapper .wp-block-kadence-off-canvas-trigger${uniqueID}, .wp-block-kadence-off-canvas-trigger${uniqueID}:hover`
	);
	css.render_measure_output(
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		previewDevice,
		'border-radius',
		borderRadiusUnit
	);

	//container hover
	css.set_selector(
		`.wp-block-kadence-off-canvas-trigger${uniqueID}:hover, .wp-block-kadence-off-canvas-trigger${uniqueID}:focus`
	);
	css.add_property('background-color', KadenceColorOutput(previewIconBackgroundColorHover));
	css.add_property(
		'border-top',
		css.render_border(borderHover, borderHoverTablet, borderHoverMobile, previewDevice, 'top', false)
	);
	css.add_property(
		'border-right',
		css.render_border(borderHover, borderHoverTablet, borderHoverMobile, previewDevice, 'right', false)
	);
	css.add_property(
		'border-bottom',
		css.render_border(borderHover, borderHoverTablet, borderHoverMobile, previewDevice, 'bottom', false)
	);
	css.add_property(
		'border-left',
		css.render_border(borderHover, borderHoverTablet, borderHoverMobile, previewDevice, 'left', false)
	);

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
