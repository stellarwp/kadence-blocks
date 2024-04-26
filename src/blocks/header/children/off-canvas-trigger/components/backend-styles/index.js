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
		iconBackgroundColor,
		iconBackgroundColorTablet,
		iconBackgroundColorMobile,
		label,
		padding,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		margin,
		marginTablet,
		marginMobile,
		marginUnit,
	} = attributes;

	const previewIconColor = getPreviewSize(previewDevice, iconColor, iconColorTablet, iconColorMobile);
	const previewIconBackgroundColor = getPreviewSize(
		previewDevice,
		iconBackgroundColor,
		iconBackgroundColorTablet,
		iconBackgroundColorMobile
	);

	const css = new KadenceBlocksCSS();

	//container
	css.set_selector(`.wp-block-kadence-off-canvas-trigger${uniqueID}`);
	css.render_measure_output(margin, marginTablet, marginMobile, previewDevice, 'margin', marginUnit);
	css.render_measure_output(padding, paddingTablet, paddingMobile, previewDevice, 'padding', paddingUnit);
	css.add_property('background-color', KadenceColorOutput(previewIconBackgroundColor));

	//icon
	css.set_selector(`.wp-block-kadence-off-canvas-trigger${uniqueID} svg`);
	css.add_property('color', KadenceColorOutput(previewIconColor));

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
