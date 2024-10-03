import {
	KadenceBlocksCSS,
	getPreviewSize,
	KadenceColorOutput,
	getSpacingOptionOutput,
	getGapSizeOptionOutput,
} from '@kadence/helpers';
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
		vAlign,
		vAlignTablet,
		vAlignMobile,
		layout,
		kadenceBlockCSS,
	} = attributes;

	const previewMinHeight = getPreviewSize(previewDevice, minHeight, minHeightTablet, minHeightMobile);
	const previewMaxWidth = getPreviewSize(previewDevice, maxWidth, maxWidthTablet, maxWidthMobile);
	const previewItemGap = getPreviewSize(previewDevice, itemGap, itemGapTablet, itemGapMobile);

	const previewVAlign = getPreviewSize(previewDevice, vAlign, vAlignTablet, vAlignMobile);

	const css = new KadenceBlocksCSS();
	//container
	css.set_selector(`.wp-block-kadence-header-row.wp-block-kadence-header-row${uniqueID} .kadence-header-row-inner`);
	css.render_measure_output(padding, paddingTablet, paddingMobile, previewDevice, 'padding', paddingUnit);
	css.render_measure_output(margin, marginTablet, marginMobile, previewDevice, 'margin', marginUnit);
	if (previewMinHeight != 0 && previewMinHeight) {
		css.add_property('min-height', previewMinHeight + minHeightUnit);
	}
	if (previewMaxWidth != 0 && previewMaxWidth) {
		css.add_property('max-width', previewMaxWidth + maxWidthUnit);
	}
	if ('contained' === layout) {
		css.set_selector(`.wp-block-kadence-header-row${uniqueID} .kadence-header-row-inner`);
	} else {
		css.set_selector(`.wp-block-kadence-header-row${uniqueID}`);
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
		css.add_property('background-size', background.size);
		css.add_property('background-repeat', background.repeat);
		css.add_property('background-attachment', background.attachment);
		css.add_property('background-position', background.position);
	}
	if ('normal' === background?.type && background?.color) {
		css.add_property('background-color', KadenceColorOutput(background.color));
	}
	if ('gradient' === background?.type && background?.gradient) {
		css.add_property('background', background.gradient);
	}

	//transparent overrides
	if (context?.['kadence/headerIsTransparent'] == '1') {
		if ('normal' === backgroundTransparent?.type && backgroundTransparent?.color) {
			css.add_property('background-color', KadenceColorOutput(backgroundTransparent.color));
		}
		if ('normal' === backgroundTransparent?.type && backgroundTransparent?.image) {
			css.add_property('background-image', backgroundTransparent.image);
			css.add_property('background-size', backgroundTransparent.size);
			css.add_property('background-repeat', backgroundTransparent.repeat);
			css.add_property('background-attachment', backgroundTransparent.attachment);
			css.add_property('background-position', backgroundTransparent.position);
		}
		if ('gradient' === backgroundTransparent?.type && backgroundTransparent?.gradient) {
			css.add_property('background', backgroundTransparent.gradient);
		}
	}

	//pass down to sections
	css.set_selector(
		`.wp-block-kadence-header-row${uniqueID} .wp-block-kadence-header-section, .wp-block-kadence-header-row${uniqueID} .wp-block-kadence-header-column`
	);
	css.add_property('gap', getGapSizeOptionOutput(previewItemGap, itemGapUnit));

	if (previewVAlign == 'top') {
		css.add_property('align-items', 'flex-start');
	} else if (previewVAlign == 'bottom') {
		css.add_property('align-items', 'flex-end');
	}

	const cssOutput = css.css_output();

	return (
		<style>
			{`${cssOutput}`}
			{kadenceBlockCSS && <>{kadenceBlockCSS.replace(/selector/g, `.wp-block-kadence-header-row${uniqueID}`)}</>}
		</style>
	);
}
