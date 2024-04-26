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
		tabletPadding,
		mobilePadding,
		paddingUnit,
		widthType,
		maxWidth,
		maxWidthTablet,
		maxWidthMobile,
		maxWidthUnit,
		containerMaxWidth,
		containerMaxWidthTablet,
		containerMaxWidthMobile,
	} = attributes;

	const editorWidth = editorElement?.clientWidth;
	const editorLeft = editorElement?.getBoundingClientRect().left;
	//editor is actually full height of content, it's parent is the frame
	const editorHeight = editorElement?.parentElement.clientHeight;
	const editorTop = editorElement?.parentElement.getBoundingClientRect().top;

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0] : '',
		undefined !== tabletPadding ? tabletPadding[0] : '',
		undefined !== mobilePadding ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[1] : '',
		undefined !== tabletPadding ? tabletPadding[1] : '',
		undefined !== mobilePadding ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[2] : '',
		undefined !== tabletPadding ? tabletPadding[2] : '',
		undefined !== mobilePadding ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[3] : '',
		undefined !== tabletPadding ? tabletPadding[3] : '',
		undefined !== mobilePadding ? mobilePadding[3] : ''
	);

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

	const css = new KadenceBlocksCSS();

	//content area
	css.set_selector(`.wp-block-kadence-off-canvas${uniqueID}`);
	css.add_property('height', editorHeight + 'px');
	css.add_property('top', editorTop + 'px');
	css.add_property('left', editorLeft + 'px');
	css.add_property('background', KadenceColorOutput(previewBackgroundColor));
	css.add_property('width', widthType === 'full' ? editorWidth + 'px' : '');
	css.add_property(
		'max-width',
		widthType !== 'full' ? (previewMaxWidth != 0 ? previewMaxWidth + maxWidthUnit : '') : ''
	);

	//content area inner
	css.set_selector(`.wp-block-kadence-off-canvas${uniqueID} .kb-off-canvas-inner`);
	css.add_property('max-width', previewContainerMaxWidth != 0 ? previewContainerMaxWidth + 'px' : '');
	css.add_property('padding-top', getSpacingOptionOutput(previewPaddingTop, paddingUnit));
	css.add_property('padding-right', getSpacingOptionOutput(previewPaddingRight, paddingUnit));
	css.add_property('padding-bottom', getSpacingOptionOutput(previewPaddingBottom, paddingUnit));
	css.add_property('padding-left', getSpacingOptionOutput(previewPaddingLeft, paddingUnit));

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
