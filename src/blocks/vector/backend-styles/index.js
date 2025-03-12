import { KadenceBlocksCSS, getPreviewSize, getSpacingOptionOutput, KadenceColorOutput } from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, clientId } = props;

	const {
		uniqueID,
		align,
		maxWidth,
		maxWidthUnit,
		tabletPadding,
		padding,
		mobilePadding,
		paddingUnit,
		tabletMargin,
		margin,
		mobileMargin,
		marginUnit,
	} = attributes;

	const css = new KadenceBlocksCSS();

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding?.[0] ? padding[0] : '',
		undefined !== tabletPadding?.[0] ? tabletPadding[0] : '',
		undefined !== mobilePadding?.[0] ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding?.[1] ? padding[1] : '',
		undefined !== tabletPadding?.[1] ? tabletPadding[1] : '',
		undefined !== mobilePadding?.[1] ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding?.[2] ? padding[2] : '',
		undefined !== tabletPadding?.[2] ? tabletPadding[2] : '',
		undefined !== mobilePadding?.[2] ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding?.[3] ? padding[3] : '',
		undefined !== tabletPadding?.[3] ? tabletPadding[3] : '',
		undefined !== mobilePadding?.[3] ? mobilePadding[3] : ''
	);

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin?.[0] ? margin[0] : '',
		undefined !== tabletMargin?.[0] ? tabletMargin[0] : '',
		undefined !== mobileMargin?.[0] ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin?.[1] ? margin[1] : '',
		undefined !== tabletMargin?.[1] ? tabletMargin[1] : '',
		undefined !== mobileMargin?.[1] ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin?.[2] ? margin[2] : '',
		undefined !== tabletMargin?.[2] ? tabletMargin[2] : '',
		undefined !== mobileMargin?.[2] ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin?.[3] ? margin[3] : '',
		undefined !== tabletMargin?.[3] ? tabletMargin[3] : '',
		undefined !== mobileMargin?.[3] ? mobileMargin[3] : ''
	);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== maxWidth?.[0] ? maxWidth[0] : '',
		undefined !== maxWidth?.[1] ? maxWidth[1] : '',
		undefined !== maxWidth?.[2] ? maxWidth[2] : ''
	);

	// Vector container
	css.set_selector(`.wp-block-kadence-vector.kb-vector-${uniqueID}`);
	css.add_property('margin-top', getSpacingOptionOutput(previewMarginTop, marginUnit));
	css.add_property('margin-right', getSpacingOptionOutput(previewMarginRight, marginUnit));
	css.add_property('margin-bottom', getSpacingOptionOutput(previewMarginBottom, marginUnit));
	css.add_property('margin-left', getSpacingOptionOutput(previewMarginLeft, marginUnit));

	css.set_selector(`.wp-block-kadence-vector.kb-vector-${uniqueID} .kb-vector-container svg`);
	css.add_property('max-width', previewMaxWidth !== '' ? previewMaxWidth + (maxWidthUnit || 'px') : '100%');
	
	// Vector inner container
	css.set_selector(`.wp-block-kadence-vector.kb-vector-${uniqueID} .kb-vector-container`);
	css.add_property('padding-top', getSpacingOptionOutput(previewPaddingTop, paddingUnit));
	css.add_property('padding-right', getSpacingOptionOutput(previewPaddingRight, paddingUnit));
	css.add_property('padding-bottom', getSpacingOptionOutput(previewPaddingBottom, paddingUnit));
	css.add_property('padding-left', getSpacingOptionOutput(previewPaddingLeft, paddingUnit));

	// Set justify-content based on alignment if it's not handled by the editor
	if (align === 'left') {
		css.add_property('justify-content', 'flex-start');
	} else if (align === 'right') {
		css.add_property('justify-content', 'flex-end');
	} else {
		css.add_property('justify-content', 'center');
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
