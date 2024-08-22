import { KadenceBlocksCSS, getPreviewSize, KadenceColorOutput, getSpacingOptionOutput } from '@kadence/helpers';
import { useRef } from '@wordpress/element';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, editorElement, context, active } = props;

	const {
		uniqueID,
		slideFrom,
		backgroundColor,
		backgroundColorTablet,
		backgroundColorMobile,
		pageBackgroundColor,
		pageBackgroundColorTablet,
		pageBackgroundColorMobile,
		padding,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		widthType,
		maxWidth,
		maxWidthTablet,
		maxWidthMobile,
		maxWidthUnit,
		containerMaxWidth,
		containerMaxWidthTablet,
		containerMaxWidthMobile,
		containerMaxWidthUnit,
		width,
		widthTablet,
		widthMobile,
		widthUnit,
		hAlign,
		hAlignTablet,
		hAlignMobile,
		vAlign,
		vAlignTablet,
		vAlignMobile,
		border,
		borderTablet,
		borderMobile,
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		borderRadiusUnit,
		closeIcon,
		closeIconSize,
		closeIconSizeTablet,
		closeIconSizeMobile,
		closeIconColor,
		closeIconColorTablet,
		closeIconColorMobile,
		closeIconColorHover,
		closeIconColorHoverTablet,
		closeIconColorHoverMobile,
		closeIconBackgroundColor,
		closeIconBackgroundColorTablet,
		closeIconBackgroundColorMobile,
		closeIconBackgroundColorHover,
		closeIconBackgroundColorHoverTablet,
		closeIconBackgroundColorHoverMobile,
		closeIconPadding,
		closeIconPaddingTablet,
		closeIconPaddingMobile,
		closeIconPaddingUnit,
		closeIconBorder,
		closeIconBorderTablet,
		closeIconBorderMobile,
		closeIconBorderHover,
		closeIconBorderHoverTablet,
		closeIconBorderHoverMobile,
		closeIconBorderRadius,
		closeIconBorderRadiusTablet,
		closeIconBorderRadiusMobile,
		closeIconBorderRadiusUnit,
	} = attributes;

	const editorWidth = editorElement?.clientWidth;
	const editorLeft = editorElement?.getBoundingClientRect().left;
	const editorRight = editorElement?.closest('body').offsetWidth - editorElement?.getBoundingClientRect().right;
	//editor is actually full height of content, it's parent is the frame
	const editorHeight = editorElement?.parentElement.clientHeight;
	const editorTop = editorElement?.parentElement.getBoundingClientRect().top;

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== maxWidth ? maxWidth : '',
		undefined !== maxWidthTablet ? maxWidthTablet : '',
		undefined !== maxWidthMobile ? maxWidthMobile : ''
	);

	const previewContainerMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== containerMaxWidth ? containerMaxWidth : '',
		undefined !== containerMaxWidthTablet ? containerMaxWidthTablet : '',
		undefined !== containerMaxWidthMobile ? containerMaxWidthMobile : ''
	);
	const previewBackgroundColor = getPreviewSize(
		previewDevice,
		backgroundColor,
		backgroundColorTablet,
		backgroundColorMobile
	);
	const previewPageBackgroundColor = getPreviewSize(
		previewDevice,
		pageBackgroundColor,
		pageBackgroundColorTablet,
		pageBackgroundColorMobile
	);
	const previewHAlign = getPreviewSize(previewDevice, hAlign, hAlignTablet, hAlignMobile);
	const previewVAlign = getPreviewSize(previewDevice, vAlign, vAlignTablet, vAlignMobile);

	const previewCloseIconColor = getPreviewSize(
		previewDevice,
		closeIconColor,
		closeIconColorTablet,
		closeIconColorMobile
	);
	const previewCloseIconColorHover = getPreviewSize(
		previewDevice,
		closeIconColorHover,
		closeIconColorHoverTablet,
		closeIconColorHoverMobile
	);
	const previewCloseIconBackgroundColor = getPreviewSize(
		previewDevice,
		closeIconBackgroundColor,
		closeIconBackgroundColorTablet,
		closeIconBackgroundColorMobile
	);
	const previewCloseIconBackgroundColorHover = getPreviewSize(
		previewDevice,
		closeIconBackgroundColorHover,
		closeIconBackgroundColorHoverTablet,
		closeIconBackgroundColorHoverMobile
	);

	const css = new KadenceBlocksCSS();

	//content area
	css.set_selector(`.wp-block-kadence-off-canvas${uniqueID}`);
	if (slideFrom == 'right') {
		css.add_property('right', editorRight + 'px');
	} else {
		css.add_property('left', editorLeft + 'px');
	}
	css.add_property('height', editorHeight + 'px');
	css.add_property('top', editorTop + 'px');
	css.add_property('background', KadenceColorOutput(previewBackgroundColor));

	if (widthType == 'full') {
		css.add_property('width', editorWidth + 'px');
	} else if (previewMaxWidth) {
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

	//content area inner
	css.set_selector(`.wp-block-kadence-off-canvas${uniqueID} .kb-off-canvas-inner`);
	css.render_measure_output(padding, paddingTablet, paddingMobile, previewDevice, 'padding', paddingUnit);
	css.add_property(
		'max-width',
		previewContainerMaxWidth != 0 && null !== previewContainerMaxWidth
			? previewContainerMaxWidth + containerMaxWidthUnit
			: ''
	);

	//content area inner alignment
	if (previewHAlign === 'center') {
		css.add_property('align-items', 'center');
		css.add_property('margin-left', 'auto');
		css.add_property('margin-right', 'auto');
	} else if (previewHAlign === 'right') {
		css.add_property('align-items', 'flex-end');
		css.add_property('margin-left', 'auto');
	}
	if (previewVAlign === 'center') {
		css.add_property('justify-content', 'center');
	} else if (previewVAlign === 'bottom') {
		css.add_property('justify-content', 'flex-end');
	}

	//overlay
	css.set_selector(`.kb-off-canvas-overlay${uniqueID}`);
	css.add_property('width', editorWidth + 'px');
	css.add_property('height', editorHeight + 'px');
	css.add_property('top', editorTop + 'px');
	css.add_property('left', editorLeft + 'px');
	css.add_property('background-color', KadenceColorOutput(previewPageBackgroundColor));

	//random fix
	css.set_selector('.components-popover.block-editor-block-popover');
	css.add_property('z-index', '10000');

	// For the close icon container styles, they need to get applied to the hover state too, due to resets on hover styles in the css
	//close icon container
	css.set_selector(
		`.wp-block-kadence-off-canvas${uniqueID} .kb-off-canvas-close, .wp-block-kadence-off-canvas${uniqueID} .kb-off-canvas-close:hover`
	);
	css.render_measure_output(
		closeIconPadding,
		closeIconPaddingTablet,
		closeIconPaddingMobile,
		previewDevice,
		'padding',
		closeIconPaddingUnit
	);
	css.add_property('background-color', KadenceColorOutput(previewCloseIconBackgroundColor));
	css.add_property(
		'border-top',
		css.render_border(closeIconBorder, closeIconBorderTablet, closeIconBorderMobile, previewDevice, 'top', false)
	);
	css.add_property(
		'border-right',
		css.render_border(closeIconBorder, closeIconBorderTablet, closeIconBorderMobile, previewDevice, 'right', false)
	);
	css.add_property(
		'border-bottom',
		css.render_border(closeIconBorder, closeIconBorderTablet, closeIconBorderMobile, previewDevice, 'bottom', false)
	);
	css.add_property(
		'border-left',
		css.render_border(closeIconBorder, closeIconBorderTablet, closeIconBorderMobile, previewDevice, 'left', false)
	);
	css.render_measure_output(
		closeIconBorderRadius,
		closeIconBorderRadiusTablet,
		closeIconBorderRadiusMobile,
		previewDevice,
		'border-radius',
		closeIconBorderRadiusUnit
	);

	//close icon container hover
	css.set_selector(`.wp-block-kadence-off-canvas${uniqueID} .kb-off-canvas-close:hover`);
	css.add_property('background-color', KadenceColorOutput(previewCloseIconBackgroundColorHover));
	css.add_property(
		'border-top',
		css.render_border(
			closeIconBorderHover,
			closeIconBorderHoverTablet,
			closeIconBorderHoverMobile,
			previewDevice,
			'top',
			false
		)
	);
	css.add_property(
		'border-right',
		css.render_border(
			closeIconBorderHover,
			closeIconBorderHoverTablet,
			closeIconBorderHoverMobile,
			previewDevice,
			'right',
			false
		)
	);
	css.add_property(
		'border-bottom',
		css.render_border(
			closeIconBorderHover,
			closeIconBorderHoverTablet,
			closeIconBorderHoverMobile,
			previewDevice,
			'bottom',
			false
		)
	);
	css.add_property(
		'border-left',
		css.render_border(
			closeIconBorderHover,
			closeIconBorderHoverTablet,
			closeIconBorderHoverMobile,
			previewDevice,
			'left',
			false
		)
	);

	//close icon
	css.set_selector(`.wp-block-kadence-off-canvas${uniqueID} .kb-off-canvas-close svg`);
	css.add_property('color', KadenceColorOutput(previewCloseIconColor));

	//close icon hover
	css.set_selector(`.wp-block-kadence-off-canvas${uniqueID} .kb-off-canvas-close:hover svg`);
	css.add_property('color', KadenceColorOutput(previewCloseIconColorHover));

	if (active) {
		//make sure the full site editing canvas is some what up to the height of editing this component
		css.set_selector(`:root`);
		css.add_property('--kb-editor-height-oc', 600 + 'px');
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
