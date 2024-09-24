import {
	KadenceBlocksCSS,
	getFontSizeOptionOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	KadenceColorOutput,
	useElementHeight,
	getBorderStyle,
	getBorderColor,
} from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, context, active } = props;

	const {
		uniqueID,
		showSiteTitle,
		showSiteTagline,
		layout,
		containerMaxWidth,
		tabletContainerMaxWidth,
		mobileContainerMaxWidth,
		containerMaxWidthType,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		margin,
		tabletMargin,
		mobileMargin,
		marginType,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		borderStyles,
		tabletBorderStyles,
		mobileBorderStyles,
	} = attributes;

	const previewContainerMaxWidth = getPreviewSize(
		previewDevice,
		containerMaxWidth,
		tabletContainerMaxWidth,
		mobileContainerMaxWidth
	);

	const css = new KadenceBlocksCSS();

	css.set_selector(`.kb-logo${uniqueID}`);
	css.add_property(
		'max-width',
		getSpacingOptionOutput(previewContainerMaxWidth, containerMaxWidthType) + ' !important'
	);
	css.render_measure_output(
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		previewDevice,
		'border-radius',
		borderRadiusUnit
	);

	css.add_property(
		'border-top',
		css.render_border(borderStyles, tabletBorderStyles, mobileBorderStyles, previewDevice, 'top', false)
	);
	css.add_property(
		'border-right',
		css.render_border(borderStyles, tabletBorderStyles, mobileBorderStyles, previewDevice, 'right', false)
	);
	css.add_property(
		'border-bottom',
		css.render_border(borderStyles, tabletBorderStyles, mobileBorderStyles, previewDevice, 'bottom', false)
	);
	css.add_property(
		'border-left',
		css.render_border(borderStyles, tabletBorderStyles, mobileBorderStyles, previewDevice, 'left', false)
	);

	css.render_measure_output(padding, tabletPadding, mobilePadding, previewDevice, 'padding', paddingType);
	css.render_measure_output(margin, tabletMargin, mobileMargin, previewDevice, 'margin', marginType);

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
