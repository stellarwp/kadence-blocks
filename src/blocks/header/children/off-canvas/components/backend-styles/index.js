import { KadenceBlocksCSS, getPreviewSize, KadenceColorOutput, getSpacingOptionOutput } from '@kadence/helpers';
import { useRef } from '@wordpress/element';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, editorElement, context } = props;

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
	} = attributes;

	const editorWidth = editorElement?.clientWidth;
	const editorLeft = editorElement?.getBoundingClientRect().left;
	const editorRight = window.innerWidth - editorElement?.getBoundingClientRect().right;
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
	css.add_property('width', widthType === 'full' ? editorWidth + 'px' : '');
	css.add_property('background', KadenceColorOutput(previewBackgroundColor));
	css.add_property(
		'max-width',
		widthType !== 'full' ? (previewMaxWidth != 0 ? previewMaxWidth + maxWidthUnit : '') : ''
	);
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
	css.add_property('max-width', previewContainerMaxWidth != 0 ? previewContainerMaxWidth + 'px' : '');

	//content area inner alignment
	if (previewHAlign == 'center') {
		css.add_property('align-items', 'center');
	} else if (previewHAlign == 'right') {
		css.add_property('align-items', 'flex-end');
	}
	if (previewVAlign == 'center') {
		css.add_property('justify-content', 'center');
	} else if (previewVAlign == 'bottom') {
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

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
