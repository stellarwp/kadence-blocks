import { KadenceBlocksCSS, getPreviewSize, KadenceColorOutput, getSpacingOptionOutput } from '@kadence/helpers';
import { min } from 'lodash';

export default function BackendStyles(props) {
	const { attributes, previewDevice, context } = props;

	const {
		uniqueID,
		location,
		background,
		backgroundTransparent,
		border,
		borderTablet,
		borderMobile,
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		borderRadiusUnit,
		padding,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		margin,
		marginTablet,
		marginMobile,
		marginUnit,
		minHeight,
		minHeightTablet,
		minHeightMobile,
		minHeightUnit,
		maxWidth,
		maxWidthTablet,
		maxWidthMobile,
		maxWidthUnit,
		itemGap,
		itemGapTablet,
		itemGapMobile,
		itemGapUnit,
	} = attributes;

	const previewMinHeight = getPreviewSize(previewDevice, minHeight, minHeightTablet, minHeightMobile);
	const previewMaxWidth = getPreviewSize(previewDevice, maxWidth, maxWidthTablet, maxWidthMobile);
	const previewItemGap = getPreviewSize(previewDevice, itemGap, itemGapTablet, itemGapMobile);

	const css = new KadenceBlocksCSS();

	//container
	css.set_selector(`.wp-block-kadence-header-row${uniqueID}`);
	css.render_measure_output(padding, paddingTablet, paddingMobile, previewDevice, 'padding', paddingUnit);
	css.render_measure_output(margin, marginTablet, marginMobile, previewDevice, 'margin', marginUnit);
	css.add_property('min-height', previewMinHeight + minHeightUnit);
	if (previewMaxWidth != 0) {
		css.add_property('max-width', previewMaxWidth + maxWidthUnit);
	}
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
	css.render_measure_output(
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		previewDevice,
		'border-radius',
		borderRadiusUnit
	);
	if ('normal' === background?.type && background?.image) {
		css.add_property('background-image', background.image);
		css.add_property('background-size', background.imageSize);
		css.add_property('background-repeat', background.imageRepeat);
		css.add_property('background-attachment', background.imageAttachment);
		css.add_property('background-position', background.imagePosition);
	}
	if ('normal' === background?.type && background?.color) {
		css.add_property('background-color', KadenceColorOutput(background.color));
	}
	if ('gradient' === background?.type && background?.gradient) {
		css.add_property('background', background.gradient);
	}

	//transparent overrides
	if (context?.['kadence/headerIsTransparent'] == '1') {
		if ('normal' === backgroundTransparent?.type && backgroundTransparent?.image) {
			css.add_property('background-image', backgroundTransparent.image);
			css.add_property('background-size', backgroundTransparent.imageSize);
			css.add_property('background-repeat', backgroundTransparent.imageRepeat);
			css.add_property('background-attachment', backgroundTransparent.imageAttachment);
			css.add_property('background-position', backgroundTransparent.imagePosition);
		}
		if ('normal' === backgroundTransparent?.type && backgroundTransparent?.color) {
			css.add_property('background-color', KadenceColorOutput(backgroundTransparent.color));
		}
		if ('gradient' === backgroundTransparent?.type && backgroundTransparent?.gradient) {
			css.add_property('background', backgroundTransparent.gradient);
		}
	}

	//pass down to sections
	css.set_selector(
		`.wp-block-kadence-header-row${uniqueID} .wp-block-kadence-header-section, .wp-block-kadence-header-row${uniqueID} .wp-block-kadence-header-column`
	);
	css.add_property('gap', previewItemGap + itemGapUnit);

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
