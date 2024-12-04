import getPreviewSize from '../get-preview-size';
import { getFontSizeOptionOutput } from '../font-size-utilities';
/**
 * Return boolean about showing settings.
 */
export default (data, cssClass, previewDevice, withClass = true) => {
	let outputCSS = '';
	if (undefined !== data && undefined !== data[0]) {
		const previewTypographySize = getPreviewSize(
			previewDevice,
			undefined !== data && undefined !== data[0] && undefined !== data[0].size && undefined !== data[0].size[0]
				? data[0].size[0]
				: '',
			undefined !== data && undefined !== data[0] && undefined !== data[0].size && undefined !== data[0].size[1]
				? data[0].size[1]
				: '',
			undefined !== data && undefined !== data[0] && undefined !== data[0].size && undefined !== data[0].size[2]
				? data[0].size[2]
				: ''
		);
		if (previewTypographySize) {
			outputCSS =
				outputCSS +
				'font-size:' +
				getFontSizeOptionOutput(
					previewTypographySize,
					undefined !== data[0].sizeType ? data[0].sizeType : 'px'
				) +
				';';
		}
		const previewTypographyLineHeight = getPreviewSize(
			previewDevice,
			undefined !== data &&
				undefined !== data[0] &&
				undefined !== data[0].lineHeight &&
				undefined !== data[0].lineHeight[0]
				? data[0].lineHeight[0]
				: '',
			undefined !== data &&
				undefined !== data[0] &&
				undefined !== data[0].lineHeight &&
				undefined !== data[0].lineHeight[1]
				? data[0].lineHeight[1]
				: '',
			undefined !== data &&
				undefined !== data[0] &&
				undefined !== data[0].lineHeight &&
				undefined !== data[0].lineHeight[2]
				? data[0].lineHeight[2]
				: ''
		);
		if (previewTypographyLineHeight) {
			outputCSS =
				outputCSS +
				'line-height:' +
				previewTypographyLineHeight +
				(undefined !== data[0].lineType ? data[0].lineType : '') +
				';';
		}
		const previewTypographyLetterSpacing = getPreviewSize(
			previewDevice,
			undefined !== data &&
				undefined !== data[0] &&
				undefined !== data[0].letterSpacing &&
				undefined !== data[0].letterSpacing[0]
				? data[0].letterSpacing[0]
				: '',
			undefined !== data &&
				undefined !== data[0] &&
				undefined !== data[0].letterSpacing &&
				undefined !== data[0].letterSpacing[1]
				? data[0].letterSpacing[1]
				: '',
			undefined !== data &&
				undefined !== data[0] &&
				undefined !== data[0].letterSpacing &&
				undefined !== data[0].letterSpacing[2]
				? data[0].letterSpacing[2]
				: ''
		);
		if (previewTypographyLetterSpacing) {
			outputCSS =
				outputCSS +
				'letter-spacing:' +
				previewTypographyLetterSpacing +
				(undefined !== data[0].letterSpacingType ? data[0].letterSpacingType : 'px') +
				';';
		}
		if (undefined !== data[0].weight && '' !== data[0].weight) {
			outputCSS = outputCSS + 'font-weight:' + data[0].weight + ';';
		}
		if (undefined !== data[0].style && '' !== data[0].style) {
			outputCSS = outputCSS + 'font-style:' + data[0].style + ';';
		}
		if (undefined !== data[0].textTransform && '' !== data[0].textTransform) {
			outputCSS = outputCSS + 'text-transform:' + data[0].textTransform + ';';
		}
		if (undefined !== data[0].family && '' !== data[0].family) {
			outputCSS = outputCSS + 'font-family:' + data[0].family + ';';
		}

		if (undefined !== data[0].color && '' !== data[0].color) {
			outputCSS = outputCSS + 'color:' + data[0].color + ';';
		}
	}
	if (!outputCSS) {
		return '';
	}
	return (withClass ? cssClass + '{' : '') + outputCSS + (withClass ? '}' : '');
};
