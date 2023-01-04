import { __ } from '@wordpress/i18n';
import { SPACING_SIZES_MAP } from '../constants';
export function getSpacingOptionName( value, unit, spacingMap = SPACING_SIZES_MAP ) {
	if ( ! value ) {
		return __( 'None', 'kadence-blocks' );
	}
	if ( ! spacingMap ) {
		return __( 'Unset', 'kadence-blocks' );
	}
	if ( value === '0') {
		return __( 'None', 'kadence-blocks' );
	}
	const found = spacingMap.find( ( option ) => option.value === value );
	if ( ! found ) {
		return value + unit;
	}
	return found.name;
}
export function getSpacingOptionOutput( value, unit, spacingMap = SPACING_SIZES_MAP ) {
	if ( undefined === value ) {
		return '';
	}
	if ( ! spacingMap ) {
		return value;
	}
	if ( value === '0') {
		return '0';
	}
	if ( value === 0 ) {
		return '0' + unit;
	}
	const found = spacingMap.find( ( option ) => option.value === value );
	if ( ! found ) {
		return value + unit;
	}
	return found.output;
}
export function getSpacingOptionSize( value, spacingMap = SPACING_SIZES_MAP ) {
	if ( ! value ) {
		return 0;
	}
	if ( ! spacingMap ) {
		return value;
	}
	if ( value === '0') {
		return 0;
	}
	const found = spacingMap.find( ( option ) => option.value === value );
	if ( ! found ) {
		return value;
	}
	return found.size;
}
export function getSpacingNameFromSize( value, spacingMap = SPACING_SIZES_MAP ) {
	if ( ! value ) {
		return __( 'Unset', 'kadence-blocks' );
	}
	if ( ! spacingMap ) {
		return __( 'Unset', 'kadence-blocks' );
	}
	if ( value === '0') {
		return __( 'None', 'kadence-blocks' );
	}
	const found = spacingMap.find( ( option ) => option.size === value );
	if ( ! found ) {
		return value + 'px';
	}
	return found.name;
}
export function getSpacingValueFromSize( value, spacingMap = SPACING_SIZES_MAP ) {
	if ( ! value ) {
		return '';
	}
	if ( ! spacingMap ) {
		return '';
	}
	if ( value === '0') {
		return '0';
	}
	const found = spacingMap.find( ( option ) => option.size === value );
	if ( ! found ) {
		return value;
	}
	return found.value;
}