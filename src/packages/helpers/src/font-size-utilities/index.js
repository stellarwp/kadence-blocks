import { __ } from '@wordpress/i18n';
import { FONT_SIZES_MAP } from '../constants';
export function getFontSizeOptionOutput( value, unit, sizesMap = FONT_SIZES_MAP ) {
	if ( ! value ) {
		return '';
	}
	if ( ! sizesMap ) {
		return value;
	}
	if ( value === '0') {
		return '0';
	}
	const found = sizesMap.find( ( option ) => option.value === value );
	if ( ! found ) {
		return value + unit;
	}
	return found.output;
}
