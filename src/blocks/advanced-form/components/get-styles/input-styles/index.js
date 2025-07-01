import {
	getPreviewSize,
	KadenceColorOutput,
	getBorderStyle,
	getFontSizeOptionOutput,
	getBorderColor,
	getBorderWidth,
	getGapSizeOptionOutput,
} from '@kadence/helpers';
import { get } from 'lodash';

/**
 * Return the proper preview size, given the current preview device
 */
export default (previewDevice, fieldStyle, inputFont, useFormMeta) => {
	const [fieldBorderRadius] = useFormMeta('_kad_form_fieldBorderRadius');
	const [tabletFieldBorderRadius] = useFormMeta('_kad_form_tabletFieldBorderRadius');
	const [mobileFieldBorderRadius] = useFormMeta('_kad_form_mobileFieldBorderRadius');
	const [fieldBorderRadiusUnit] = useFormMeta('_kad_form_fieldBorderRadiusUnit');
	const [fieldBorderStyle] = useFormMeta('_kad_form_fieldBorderStyle');
	const [tabletFieldBorderStyle] = useFormMeta('_kad_form_tabletFieldBorderStyle');
	const [mobileFieldBorderStyle] = useFormMeta('_kad_form_mobileFieldBorderStyle');

	const styles = {};

	const lineHeight = getPreviewSize(
		previewDevice,
		inputFont?.lineHeight?.[0],
		inputFont?.lineHeight?.[1],
		inputFont?.lineHeight?.[2]
	);
	if (lineHeight) {
		styles.lineHeight = lineHeight + get(inputFont, 'lineType', '');
	}
	const letterSpacing = getPreviewSize(
		previewDevice,
		inputFont?.letterSpacing?.[0],
		inputFont?.letterSpacing?.[1],
		inputFont?.letterSpacing?.[2]
	);
	if (letterSpacing) {
		styles.letterSpacing = letterSpacing + get(inputFont, 'letterType', 'px');
	}

	const fontSize = getPreviewSize(previewDevice, inputFont.size[0], inputFont.size[1], inputFont.size[2]);
	styles.fontSize = getFontSizeOptionOutput(fontSize, inputFont.sizeType);
	styles.fieldFont = inputFont;
	if (inputFont?.color) {
		styles.color = KadenceColorOutput(inputFont.color);
	}

	const previewGap = getPreviewSize(
		previewDevice,
		undefined !== fieldStyle?.gap?.[0] && '' !== fieldStyle?.gap?.[0] ? fieldStyle?.gap[0] : '',
		undefined !== fieldStyle?.gap?.[1] && '' !== fieldStyle?.gap?.[1] ? fieldStyle?.gap[1] : '',
		undefined !== fieldStyle?.gap?.[2] && '' !== fieldStyle?.gap?.[2] ? fieldStyle?.gap[2] : ''
	);
	if (previewGap) {
		styles.previewRowGap = getGapSizeOptionOutput(previewGap, fieldStyle?.gapUnit ? fieldStyle.gapUnit : 'px');
	}

	const paddingTop = getPreviewSize(
		previewDevice,
		fieldStyle?.padding?.[0],
		fieldStyle?.tabletPadding?.[0],
		fieldStyle?.mobilePadding?.[0]
	);
	const paddingRight = getPreviewSize(
		previewDevice,
		fieldStyle?.padding?.[1],
		fieldStyle?.tabletPadding?.[1],
		fieldStyle?.mobilePadding?.[1]
	);
	const paddingBottom = getPreviewSize(
		previewDevice,
		fieldStyle?.padding?.[2],
		fieldStyle?.tabletPadding?.[2],
		fieldStyle?.mobilePadding?.[2]
	);
	const paddingLeft = getPreviewSize(
		previewDevice,
		fieldStyle?.padding?.[3],
		fieldStyle?.tabletPadding?.[3],
		fieldStyle?.mobilePadding?.[3]
	);
	const paddingUnit = fieldStyle?.paddingUnit ? fieldStyle?.paddingUnit : 'px';
	styles.paddingTop = '' !== paddingTop ? paddingTop + paddingUnit : undefined;
	styles.paddingRight = '' !== paddingRight ? paddingRight + paddingUnit : undefined;
	styles.paddingBottom = '' !== paddingBottom ? paddingBottom + paddingUnit : undefined;
	styles.paddingLeft = '' !== paddingLeft ? paddingLeft + paddingUnit : undefined;

	styles.placeholderColor =
		undefined !== fieldStyle?.placeholderColor ? KadenceColorOutput(fieldStyle?.placeholderColor) : undefined;

	const borderRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== fieldBorderRadius?.[0] ? fieldBorderRadius[0] : '',
		undefined !== tabletFieldBorderRadius?.[0] ? tabletFieldBorderRadius[0] : '',
		undefined !== mobileFieldBorderRadius?.[0] ? mobileFieldBorderRadius[0] : ''
	);
	const borderRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== fieldBorderRadius?.[1] ? fieldBorderRadius[1] : '',
		undefined !== tabletFieldBorderRadius?.[1] ? tabletFieldBorderRadius[1] : '',
		undefined !== mobileFieldBorderRadius?.[1] ? mobileFieldBorderRadius[1] : ''
	);
	const borderRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== fieldBorderRadius?.[2] ? fieldBorderRadius[2] : '',
		undefined !== tabletFieldBorderRadius?.[2] ? tabletFieldBorderRadius[2] : '',
		undefined !== mobileFieldBorderRadius?.[2] ? mobileFieldBorderRadius[2] : ''
	);
	const borderRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== fieldBorderRadius?.[3] ? fieldBorderRadius[3] : '',
		undefined !== tabletFieldBorderRadius?.[3] ? tabletFieldBorderRadius[3] : '',
		undefined !== mobileFieldBorderRadius?.[3] ? mobileFieldBorderRadius[3] : ''
	);
	styles.borderRadiusUnit = fieldBorderRadiusUnit ? fieldBorderRadiusUnit : 'px';

	styles.borderRadiusTop = '' !== borderRadiusTop ? borderRadiusTop + styles.borderRadiusUnit : undefined;
	styles.borderRadiusRight = '' !== borderRadiusRight ? borderRadiusRight + styles.borderRadiusUnit : undefined;
	styles.borderRadiusBottom = '' !== borderRadiusBottom ? borderRadiusBottom + styles.borderRadiusUnit : undefined;
	styles.borderRadiusLeft = '' !== borderRadiusLeft ? borderRadiusLeft + styles.borderRadiusUnit : undefined;

	styles.borderTopWidth = getBorderWidth(
		previewDevice,
		'top',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);

	styles.borderTopColor = getBorderColor(
		previewDevice,
		'top',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);
	styles.borderRightColor = getBorderColor(
		previewDevice,
		'right',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);
	styles.borderBottomColor = getBorderColor(
		previewDevice,
		'bottom',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);
	styles.borderLeftColor = getBorderColor(
		previewDevice,
		'left',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);

	styles.borderActive = fieldStyle?.borderActive ? fieldStyle.borderActive : '';

	styles.borderTop = getBorderStyle(
		previewDevice,
		'top',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);
	styles.borderRight = getBorderStyle(
		previewDevice,
		'right',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);
	styles.borderBottom = getBorderStyle(
		previewDevice,
		'bottom',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);
	styles.borderLeft = getBorderStyle(
		previewDevice,
		'left',
		[fieldBorderStyle],
		[tabletFieldBorderStyle],
		[mobileFieldBorderStyle]
	);

	styles.boxShadow =
		undefined !== fieldStyle?.boxShadow && undefined !== fieldStyle?.boxShadow[0] && fieldStyle?.boxShadow[0]
			? (undefined !== fieldStyle?.boxShadow[7] && fieldStyle?.boxShadow[7] ? 'inset ' : '') +
				(undefined !== fieldStyle?.boxShadow[3] ? fieldStyle?.boxShadow[3] : 1) +
				'px ' +
				(undefined !== fieldStyle?.boxShadow[4] ? fieldStyle?.boxShadow[4] : 1) +
				'px ' +
				(undefined !== fieldStyle?.boxShadow[5] ? fieldStyle?.boxShadow[5] : 2) +
				'px ' +
				(undefined !== fieldStyle?.boxShadow[6] ? fieldStyle?.boxShadow[6] : 0) +
				'px ' +
				KadenceColorOutput(
					undefined !== fieldStyle?.boxShadow[1] ? fieldStyle?.boxShadow[1] : '#000000',
					undefined !== fieldStyle?.boxShadow[2] ? fieldStyle?.boxShadow[2] : 1
				)
			: undefined;

	if (
		undefined !== fieldStyle?.backgroundType &&
		'gradient' === fieldStyle?.backgroundType &&
		undefined !== fieldStyle?.gradient &&
		'' !== fieldStyle?.gradient
	) {
		styles.background = fieldStyle?.gradient;
	} else {
		styles.background =
			undefined === fieldStyle?.background
				? undefined
				: KadenceColorOutput(
						fieldStyle?.background,
						fieldStyle?.backgroundOpacity !== undefined ? fieldStyle?.backgroundOpacity : 1
					);
	}

	if (
		undefined !== fieldStyle?.backgroundActiveType &&
		'gradient' === fieldStyle?.backgroundActiveType &&
		undefined !== fieldStyle?.gradientActive &&
		'' !== fieldStyle?.gradientActive
	) {
		styles.backgroundActive = fieldStyle?.gradientActive;
	} else {
		styles.backgroundActive =
			undefined === fieldStyle?.backgroundActive
				? undefined
				: KadenceColorOutput(
						fieldStyle?.backgroundActive,
						fieldStyle?.backgroundActiveOpacity !== undefined ? fieldStyle?.backgroundActiveOpacity : 1
					);
	}

	return styles;
};
