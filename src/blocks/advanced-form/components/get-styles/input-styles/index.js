import { getPreviewSize, KadenceColorOutput } from '@kadence/helpers';
import { get } from 'lodash';

/**
 * Return the proper preview size, given the current preview device
 */
export default ( previewDevice, parentFieldStyle ) => {

	let styles = {};

	let lineHeight = getPreviewSize( previewDevice, parentFieldStyle.lineHeight[0], parentFieldStyle.lineHeight[1], parentFieldStyle.lineHeight[2] );
	let lineHeightType = get( parentFieldStyle, 'lineType', 'px');
	styles.lineHeight = lineHeight + lineHeightType;

	let fontSize = getPreviewSize( previewDevice, parentFieldStyle.fontSize[0], parentFieldStyle.fontSize[1], parentFieldStyle.fontSize[2] );
	let fontSizeType = get( parentFieldStyle, 'fontSizeType', 'px');
	styles.fontSize = fontSize + fontSizeType;

	styles.previewRowGap = getPreviewSize( previewDevice, ( undefined !== parentFieldStyle.rowGap && '' !== parentFieldStyle.rowGap ? parentFieldStyle.rowGap + 'px' : '' ), ( undefined !== parentFieldStyle.tabletRowGap && '' !== parentFieldStyle.tabletRowGap ? parentFieldStyle.tabletRowGap + 'px' : '' ), ( undefined !== parentFieldStyle.mobileRowGap && '' !== parentFieldStyle.mobileRowGap ? parentFieldStyle.mobileRowGap + 'px' : '' ) );
	styles.previewGutter = getPreviewSize( previewDevice, ( undefined !== parentFieldStyle.gutter && '' !== parentFieldStyle.gutter ? parentFieldStyle.gutter : '' ), ( undefined !== parentFieldStyle.tabletGutter && '' !== parentFieldStyle.tabletGutter ? parentFieldStyle.tabletGutter : '' ), ( undefined !== parentFieldStyle.mobileGutter && '' !== parentFieldStyle.mobileGutter ? parentFieldStyle.mobileGutter : '' ) );

	styles.paddingTop = ( 'custom' === parentFieldStyle.size && '' !== parentFieldStyle.deskPadding[ 0 ] ? parentFieldStyle.deskPadding[ 0 ] + 'px' : undefined );
	styles.paddingRight = ( 'custom' === parentFieldStyle.size && '' !== parentFieldStyle.deskPadding[ 1 ] ? parentFieldStyle.deskPadding[ 1 ] + 'px' : undefined );
	styles.paddingBottom = ( 'custom' === parentFieldStyle.size && '' !== parentFieldStyle.deskPadding[ 2 ] ? parentFieldStyle.deskPadding[ 2 ] + 'px' : undefined );
	styles.paddingLeft = ( 'custom' === parentFieldStyle.size && '' !== parentFieldStyle.deskPadding[ 3 ] ? parentFieldStyle.deskPadding[ 3 ] + 'px' : undefined );

	styles.color = ( undefined !== parentFieldStyle.color ? KadenceColorOutput( parentFieldStyle.color ) : undefined );

	styles.borderRadius = ( undefined !== parentFieldStyle.borderRadius ? parentFieldStyle.borderRadius + 'px' : undefined );
	styles.borderTopWidth = ( parentFieldStyle.borderWidth && '' !== parentFieldStyle.borderWidth[ 0 ] ? parentFieldStyle.borderWidth[ 0 ] + 'px' : undefined );
	styles.borderRightWidth = ( parentFieldStyle.borderWidth && '' !== parentFieldStyle.borderWidth[ 1 ] ? parentFieldStyle.borderWidth[ 1 ] + 'px' : undefined );
	styles.borderBottomWidth = ( parentFieldStyle.borderWidth && '' !== parentFieldStyle.borderWidth[ 2 ] ? parentFieldStyle.borderWidth[ 2 ] + 'px' : undefined );
	styles.borderLeftWidth = ( parentFieldStyle.borderWidth && '' !== parentFieldStyle.borderWidth[ 3 ] ? parentFieldStyle.borderWidth[ 3 ] + 'px' : undefined );

	styles.borderColor = ( undefined === parentFieldStyle.border ? undefined : KadenceColorOutput( parentFieldStyle.border, ( parentFieldStyle.borderOpacity !== undefined ? parentFieldStyle.borderOpacity : 1 ) ) );
	styles.boxShadow = ( undefined !== parentFieldStyle.boxShadow && undefined !== parentFieldStyle.boxShadow[ 0 ] && parentFieldStyle.boxShadow[ 0 ] ? ( undefined !== parentFieldStyle.boxShadow[ 7 ] && parentFieldStyle.boxShadow[ 7 ] ? 'inset ' : '' ) + ( undefined !== parentFieldStyle.boxShadow[ 3 ] ? parentFieldStyle.boxShadow[ 3 ] : 1 ) + 'px ' + ( undefined !== parentFieldStyle.boxShadow[ 4 ] ? parentFieldStyle.boxShadow[ 4 ] : 1 ) + 'px ' + ( undefined !== parentFieldStyle.boxShadow[ 5 ] ? parentFieldStyle.boxShadow[ 5 ] : 2 ) + 'px ' + ( undefined !== parentFieldStyle.boxShadow[ 6 ] ? parentFieldStyle.boxShadow[ 6 ] : 0 ) + 'px ' + KadenceColorOutput( ( undefined !== parentFieldStyle.boxShadow[ 1 ] ? parentFieldStyle.boxShadow[ 1 ] : '#000000' ), ( undefined !== parentFieldStyle.boxShadow[ 2 ] ? parentFieldStyle.boxShadow[ 2 ] : 1 ) ) : undefined );


	let inputBG, inputGrad, inputGrad2;

	if ( undefined !== parentFieldStyle.backgroundType && 'gradient' === parentFieldStyle.backgroundType ) {
		inputGrad = ( undefined === parentFieldStyle.background ? 'rgba(255,255,255,0)' : KadenceColorOutput( parentFieldStyle.background, ( parentFieldStyle.backgroundOpacity !== undefined ? parentFieldStyle.backgroundOpacity : 1 ) ) );
		inputGrad2 = ( undefined !== parentFieldStyle.gradient && undefined !== parentFieldStyle.gradient[ 0 ] && '' !== parentFieldStyle.gradient[ 0 ] ? KadenceColorOutput( parentFieldStyle.gradient[ 0 ], ( undefined !== parentFieldStyle.gradient && parentFieldStyle.gradient[ 1 ] !== undefined ? parentFieldStyle.gradient[ 1 ] : 1 ) ) : KadenceColorOutput( '#999999', ( undefined !== parentFieldStyle.gradient && parentFieldStyle.gradient[ 1 ] !== undefined ? parentFieldStyle.gradient[ 1 ] : 1 ) ) );
		if ( undefined !== parentFieldStyle.gradient && 'radial' === parentFieldStyle.gradient[ 4 ] ) {
			inputBG = `radial-gradient(at ${ ( undefined === parentFieldStyle.gradient[ 6 ] ? 'center center' : parentFieldStyle.gradient[ 6 ] ) }, ${ inputGrad } ${ ( undefined === parentFieldStyle.gradient[ 2 ] ? '0' : parentFieldStyle.gradient[ 2 ] ) }%, ${ inputGrad2 } ${ ( undefined === parentFieldStyle.gradient[ 3 ] ? '100' : parentFieldStyle.gradient[ 3 ] ) }%)`;
		} else if ( undefined === parentFieldStyle.gradient || 'radial' !== parentFieldStyle.gradient[ 4 ] ) {
			inputBG = `linear-gradient(${ ( undefined !== parentFieldStyle.gradient && undefined !== parentFieldStyle.gradient[ 5 ] ? parentFieldStyle.gradient[ 5 ] : '180' ) }deg, ${ inputGrad } ${ ( undefined !== parentFieldStyle.gradient && undefined !== parentFieldStyle.gradient[ 2 ] ? parentFieldStyle.gradient[ 2 ] : '0' ) }%, ${ inputGrad2 } ${ ( undefined !== parentFieldStyle.gradient && undefined !== parentFieldStyle.gradient[ 3 ] ? parentFieldStyle.gradient[ 3 ] : '100' ) }%)`;
		}
	} else {
		inputBG = ( undefined === parentFieldStyle.background ? undefined : KadenceColorOutput( parentFieldStyle.background, ( parentFieldStyle.backgroundOpacity !== undefined ? parentFieldStyle.backgroundOpacity : 1 ) ) );
	}

 	styles.background = ( undefined !== inputBG ? inputBG : undefined );

	return styles;
};


