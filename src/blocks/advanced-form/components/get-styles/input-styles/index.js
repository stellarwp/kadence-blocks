import { getPreviewSize, KadenceColorOutput, getBorderStyle, getFontSizeOptionOutput, getBorderColor } from '@kadence/helpers';
import { get } from 'lodash';

/**
 * Return the proper preview size, given the current preview device
 */
export default ( previewDevice, parentFieldStyle, inputFont, useFormMeta ) => {

	const [ fieldBorderRadius ] = useFormMeta( '_kad_form_fieldBorderRadius' );
	const [ tabletFieldBorderRadius ] = useFormMeta( '_kad_form_tabletFieldBorderRadius' );
	const [ mobileFieldBorderRadius ] = useFormMeta( '_kad_form_mobileFieldBorderRadius' );
	const [ fieldBorderRadiusUnit ] = useFormMeta( '_kad_form_fieldBorderRadiusUnit' );

	const [ fieldBorderStyle ] = useFormMeta( '_kad_form_fieldBorderStyle' );
	const [ tabletFieldBorderStyle ] = useFormMeta( '_kad_form_tabletFieldBorderStyle' );
	const [ mobileFieldBorderStyle ] = useFormMeta( '_kad_form_mobileFieldBorderStyle' );

	let styles = {};

	let lineHeight = getPreviewSize( previewDevice, parentFieldStyle?.lineHeight?.[0], parentFieldStyle?.lineHeight?.[1], parentFieldStyle?.lineHeight?.[2] );
	let lineHeightType = get( parentFieldStyle, 'lineType', 'px');
	styles.lineHeight = lineHeight + lineHeightType;

	let fontSize = getPreviewSize( previewDevice, inputFont.size[0], inputFont.size[1], inputFont.size[2] );
	styles.fontSize = getFontSizeOptionOutput( fontSize, inputFont.sizeType );
	styles.fieldFont = inputFont;

	styles.previewRowGap = getPreviewSize( previewDevice, ( undefined !== parentFieldStyle?.rowGap && '' !== parentFieldStyle?.rowGap ? parentFieldStyle?.rowGap + 'px' : '' ), ( undefined !== parentFieldStyle?.tabletRowGap && '' !== parentFieldStyle?.tabletRowGap ? parentFieldStyle?.tabletRowGap + 'px' : '' ), ( undefined !== parentFieldStyle?.mobileRowGap && '' !== parentFieldStyle?.mobileRowGap ? parentFieldStyle?.mobileRowGap + 'px' : '' ) );
	styles.previewGutter = getPreviewSize( previewDevice, ( undefined !== parentFieldStyle?.gutter && '' !== parentFieldStyle?.gutter ? parentFieldStyle?.gutter : '' ), ( undefined !== parentFieldStyle?.tabletGutter && '' !== parentFieldStyle?.tabletGutter ? parentFieldStyle?.tabletGutter : '' ), ( undefined !== parentFieldStyle?.mobileGutter && '' !== parentFieldStyle?.mobileGutter ? parentFieldStyle?.mobileGutter : '' ) );

	styles.paddingTop = ( 'custom' === parentFieldStyle?.size && '' !== parentFieldStyle?.deskPadding[ 0 ] ? parentFieldStyle?.deskPadding[ 0 ] + 'px' : undefined );
	styles.paddingRight = ( 'custom' === parentFieldStyle?.size && '' !== parentFieldStyle?.deskPadding[ 1 ] ? parentFieldStyle?.deskPadding[ 1 ] + 'px' : undefined );
	styles.paddingBottom = ( 'custom' === parentFieldStyle?.size && '' !== parentFieldStyle?.deskPadding[ 2 ] ? parentFieldStyle?.deskPadding[ 2 ] + 'px' : undefined );
	styles.paddingLeft = ( 'custom' === parentFieldStyle?.size && '' !== parentFieldStyle?.deskPadding[ 3 ] ? parentFieldStyle?.deskPadding[ 3 ] + 'px' : undefined );

	styles.color = ( undefined !== parentFieldStyle?.color ? KadenceColorOutput( parentFieldStyle?.color ) : undefined );
	styles.placeholderColor = ( undefined !== parentFieldStyle?.placeholderColor ? KadenceColorOutput( parentFieldStyle?.placeholderColor ) : undefined );

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

	styles.boxShadow = ( undefined !== parentFieldStyle?.boxShadow && undefined !== parentFieldStyle?.boxShadow[ 0 ] && parentFieldStyle?.boxShadow[ 0 ] ? ( undefined !== parentFieldStyle?.boxShadow[ 7 ] && parentFieldStyle?.boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== parentFieldStyle?.boxShadow[ 3 ] ? parentFieldStyle?.boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== parentFieldStyle?.boxShadow[ 4 ] ? parentFieldStyle?.boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== parentFieldStyle?.boxShadow[ 5 ] ? parentFieldStyle?.boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== parentFieldStyle?.boxShadow[ 6 ] ? parentFieldStyle?.boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== parentFieldStyle?.boxShadow[ 1 ] ? parentFieldStyle?.boxShadow[ 1 ] : '#000000' ), ( undefined !== parentFieldStyle?.boxShadow[ 2 ] ? parentFieldStyle?.boxShadow[ 2 ] : 1 ) ) : undefined );

	if ( undefined !== parentFieldStyle?.backgroundType && 'gradient' === parentFieldStyle?.backgroundType && undefined !== parentFieldStyle?.gradient && '' !== parentFieldStyle?.gradient ) {
		styles.background = parentFieldStyle?.gradient;
	} else {
		styles.background = ( undefined === parentFieldStyle?.background ? undefined : KadenceColorOutput( parentFieldStyle?.background, ( parentFieldStyle?.backgroundOpacity !== undefined ? parentFieldStyle?.backgroundOpacity : 1 ) ) );
	}

	if ( undefined !== parentFieldStyle?.backgroundActiveType && 'gradient' === parentFieldStyle?.backgroundActiveType && undefined !== parentFieldStyle?.gradientActive && '' !== parentFieldStyle?.gradientActive ) {
		styles.backgroundActive = parentFieldStyle?.gradientActive;
	} else {
		styles.backgroundActive = ( undefined === parentFieldStyle?.backgroundActive ? undefined : KadenceColorOutput( parentFieldStyle?.backgroundActive, ( parentFieldStyle?.backgroundActiveOpacity !== undefined ? parentFieldStyle?.backgroundActiveOpacity : 1 ) ) );
	}


	return styles;
};


