import { getPreviewSize, KadenceColorOutput, getBorderStyle, getFontSizeOptionOutput, getBorderColor, getGapSizeOptionOutput } from '@kadence/helpers';
import { get } from 'lodash';

/**
 * Return the proper preview size, given the current preview device
 */
export default ( previewDevice, fieldStyle, inputFont, useFormMeta ) => {

	const [ fieldBorderRadius ] = useFormMeta( '_kad_form_fieldBorderRadius' );
	const [ tabletFieldBorderRadius ] = useFormMeta( '_kad_form_tabletFieldBorderRadius' );
	const [ mobileFieldBorderRadius ] = useFormMeta( '_kad_form_mobileFieldBorderRadius' );
	const [ fieldBorderRadiusUnit ] = useFormMeta( '_kad_form_fieldBorderRadiusUnit' );

	const [ fieldBorderStyle ] = useFormMeta( '_kad_form_fieldBorderStyle' );
	const [ tabletFieldBorderStyle ] = useFormMeta( '_kad_form_tabletFieldBorderStyle' );
	const [ mobileFieldBorderStyle ] = useFormMeta( '_kad_form_mobileFieldBorderStyle' );

	let styles = {};

	let lineHeight = getPreviewSize( previewDevice, inputFont?.lineHeight?.[0], inputFont?.lineHeight?.[1], inputFont?.lineHeight?.[2] );
	if( lineHeight ){
		styles.lineHeight = lineHeight + get( inputFont, 'lineType', '');
	}
	let letterSpacing = getPreviewSize( previewDevice, inputFont?.letterSpacing?.[0], inputFont?.letterSpacing?.[1], inputFont?.letterSpacing?.[2] );
	if( letterSpacing ){
		styles.letterSpacing = letterSpacing + get( inputFont, 'letterType', 'px');
	}

	let fontSize = getPreviewSize( previewDevice, inputFont.size[0], inputFont.size[1], inputFont.size[2] );
	styles.fontSize = getFontSizeOptionOutput( fontSize, inputFont.sizeType );
	styles.fieldFont = inputFont;

	let previewGap = getPreviewSize( previewDevice, ( undefined !== fieldStyle?.gap?.[0] && '' !== fieldStyle?.gap?.[0] ? fieldStyle?.gap[0] : '' ), ( undefined !== fieldStyle?.gap?.[1] && '' !== fieldStyle?.gap?.[1] ? fieldStyle?.gap[1] : '' ), ( undefined !== fieldStyle?.gap?.[2] && '' !== fieldStyle?.gap?.[2] ? fieldStyle?.gap[2] : '' ) );
	styles.previewRowGap = getGapSizeOptionOutput( previewGap, ( fieldStyle?.gapUnit ? fieldStyle.gapUnit : 'px' ) );

	let paddingTop = getPreviewSize( previewDevice, fieldStyle?.padding?.[ 0 ], fieldStyle?.tabletPadding?.[ 0 ], fieldStyle?.mobilePadding?.[ 0 ] );
	let paddingRight = getPreviewSize( previewDevice, fieldStyle?.padding?.[ 1 ], fieldStyle?.tabletPadding?.[ 1 ], fieldStyle?.mobilePadding?.[ 1 ] );
	let paddingBottom = getPreviewSize( previewDevice, fieldStyle?.padding?.[ 2 ], fieldStyle?.tabletPadding?.[ 2 ], fieldStyle?.mobilePadding?.[ 2 ] );
	let paddingLeft = getPreviewSize( previewDevice, fieldStyle?.padding?.[ 3 ], fieldStyle?.tabletPadding?.[ 3 ], fieldStyle?.mobilePadding?.[ 3 ] );
	let paddingUnit = fieldStyle?.paddingUnit ? fieldStyle?.paddingUnit : 'px';
	styles.paddingTop = ( '' !== paddingTop ? paddingTop + paddingUnit : undefined );
	styles.paddingRight = ( '' !== paddingRight ? paddingRight + paddingUnit : undefined );
	styles.paddingBottom = ( '' !== paddingBottom ? paddingBottom + paddingUnit : undefined );
	styles.paddingLeft = ( '' !== paddingLeft ? paddingLeft + paddingUnit : undefined );

	styles.color = ( undefined !== fieldStyle?.color ? KadenceColorOutput( fieldStyle?.color ) : undefined );
	styles.placeholderColor = ( undefined !== fieldStyle?.placeholderColor ? KadenceColorOutput( fieldStyle?.placeholderColor ) : undefined );

	styles.borderRadiusTop = getPreviewSize( previewDevice, ( undefined !== fieldBorderRadius ? fieldBorderRadius[ 0 ] : '' ), ( undefined !== tabletFieldBorderRadius ? tabletFieldBorderRadius[ 0 ] : '' ), ( undefined !== mobileFieldBorderRadius ? mobileFieldBorderRadius[ 0 ] : '' ) );
	styles.borderRadiusRight = getPreviewSize( previewDevice, ( undefined !== fieldBorderRadius ? fieldBorderRadius[ 1 ] : '' ), ( undefined !== tabletFieldBorderRadius ? tabletFieldBorderRadius[ 1 ] : '' ), ( undefined !== mobileFieldBorderRadius ? mobileFieldBorderRadius[ 1 ] : '' ) );
	styles.borderRadiusBottom = getPreviewSize( previewDevice, ( undefined !== fieldBorderRadius ? fieldBorderRadius[ 2 ] : '' ), ( undefined !== tabletFieldBorderRadius ? tabletFieldBorderRadius[ 2 ] : '' ), ( undefined !== mobileFieldBorderRadius ? mobileFieldBorderRadius[ 2 ] : '' ) );
	styles.borderRadiusLeft = getPreviewSize( previewDevice, ( undefined !== fieldBorderRadius ? fieldBorderRadius[ 3 ] : '' ), ( undefined !== tabletFieldBorderRadius ? tabletFieldBorderRadius[ 3 ] : '' ), ( undefined !== mobileFieldBorderRadius ? mobileFieldBorderRadius[ 3 ] : '' ) );
	styles.borderRadiusUnit = fieldBorderRadiusUnit ? fieldBorderRadiusUnit : 'px';

	styles.borderTopColor = getBorderColor( previewDevice, 'top', [ fieldBorderStyle ], [ tabletFieldBorderStyle ], [ mobileFieldBorderStyle ] );
	styles.borderRightColor = getBorderColor( previewDevice, 'right', [ fieldBorderStyle ], [ tabletFieldBorderStyle ], [ mobileFieldBorderStyle ] );
	styles.borderBottomColor = getBorderColor( previewDevice, 'bottom', [ fieldBorderStyle ], [ tabletFieldBorderStyle ], [ mobileFieldBorderStyle ] );
	styles.borderLeftColor = getBorderColor( previewDevice, 'left', [ fieldBorderStyle ], [ tabletFieldBorderStyle ], [ mobileFieldBorderStyle ] );

	styles.borderTop = getBorderStyle( previewDevice, 'top', [ fieldBorderStyle ], [ tabletFieldBorderStyle ], [ mobileFieldBorderStyle ] );
	styles.borderRight = getBorderStyle( previewDevice, 'right', [ fieldBorderStyle ], [ tabletFieldBorderStyle ], [ mobileFieldBorderStyle ] );
	styles.borderBottom = getBorderStyle( previewDevice, 'bottom', [ fieldBorderStyle ], [ tabletFieldBorderStyle ], [ mobileFieldBorderStyle ] );
	styles.borderLeft = getBorderStyle( previewDevice, 'left', [ fieldBorderStyle ], [ tabletFieldBorderStyle ], [ mobileFieldBorderStyle ] );

	styles.boxShadow = ( undefined !== fieldStyle?.boxShadow && undefined !== fieldStyle?.boxShadow[ 0 ] && fieldStyle?.boxShadow[ 0 ] ? ( undefined !== fieldStyle?.boxShadow[ 7 ] && fieldStyle?.boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== fieldStyle?.boxShadow[ 3 ] ? fieldStyle?.boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== fieldStyle?.boxShadow[ 4 ] ? fieldStyle?.boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== fieldStyle?.boxShadow[ 5 ] ? fieldStyle?.boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== fieldStyle?.boxShadow[ 6 ] ? fieldStyle?.boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== fieldStyle?.boxShadow[ 1 ] ? fieldStyle?.boxShadow[ 1 ] : '#000000' ), ( undefined !== fieldStyle?.boxShadow[ 2 ] ? fieldStyle?.boxShadow[ 2 ] : 1 ) ) : undefined );

	if ( undefined !== fieldStyle?.backgroundType && 'gradient' === fieldStyle?.backgroundType && undefined !== fieldStyle?.gradient && '' !== fieldStyle?.gradient ) {
		styles.background = fieldStyle?.gradient;
	} else {
		styles.background = ( undefined === fieldStyle?.background ? undefined : KadenceColorOutput( fieldStyle?.background, ( fieldStyle?.backgroundOpacity !== undefined ? fieldStyle?.backgroundOpacity : 1 ) ) );
	}

	if ( undefined !== fieldStyle?.backgroundActiveType && 'gradient' === fieldStyle?.backgroundActiveType && undefined !== fieldStyle?.gradientActive && '' !== fieldStyle?.gradientActive ) {
		styles.backgroundActive = fieldStyle?.gradientActive;
	} else {
		styles.backgroundActive = ( undefined === fieldStyle?.backgroundActive ? undefined : KadenceColorOutput( fieldStyle?.backgroundActive, ( fieldStyle?.backgroundActiveOpacity !== undefined ? fieldStyle?.backgroundActiveOpacity : 1 ) ) );
	}


	return styles;
};


