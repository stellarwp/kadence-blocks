import { __ } from '@wordpress/i18n';

import { OPTIONS_MAP } from "./constants";
export function isCustomOption( optionsArray, value ) {
	if ( ! value ) {
		return false;
	}
	if ( ! optionsArray ) {
		return false;
	}
	// If empty lets default to options instead of custom.
	if ( undefined !== value[0] && '' === value[0] && undefined !== value[1] && ( '' === value[1] || 'auto' === value[1] ) && undefined !== value[2] && '' === value[2] && undefined !== value[3] && ( '' === value[3] || 'auto' === value[3] ) ) {
		return false;
	}
	if ( undefined !== value[0] && '' !== value[0] ) {
		return (
			! optionsArray.find( ( option ) => option.value === value[0] )
		);
	}
	if ( undefined !== value[1] && '' !== value[1] && 'auto' !== value[1] ) {
		return (
			! optionsArray.find( ( option ) => option.value === value[1] )
		);
	}
	if ( undefined !== value[2] && '' !== value[2] ) {
		return (
			! optionsArray.find( ( option ) => option.value === value[2] )
		);
	}
	if ( undefined !== value[3] && '' !== value[3] && 'auto' !== value[3] ) {
		return (
			! optionsArray.find( ( option ) => option.value === value[3] )
		);
	}
	return (
		! optionsArray.find( ( option ) => option.value === value )
	);
}
export function getOptionIndex( optionsArray, value ) {
	if ( ! value ) {
		return;
	}
	if ( ! optionsArray ) {
		return;
	}
	if ( value === '0' || value === 'default' ) {
		return 0;
	}
	const found = optionsArray.findIndex( ( option ) => option.value === value );
	if ( ! found ) {
		return;
	}
	return found;
}
export function getOptionSize( optionsArray, value, unit ) {
	if ( ! value ) {
		return '';
	}
	if ( ! optionsArray ) {
		return '';
	}
	if ( value === '0') {
		return 0;
	}
	if ( unit !== 'px' ) {
		return '';
	}
	const found = optionsArray.find( ( option ) => option.value === value );
	if ( ! found ) {
		return '';
	}
	return found.size;
}
export function getOptionFromSize( optionsArray, value, unit ) {
	if ( ! value ) {
		return '';
	}
	if ( ! optionsArray ) {
		return '';
	}
	if ( value === 0 ) {
		return '0';
	}
	if ( unit !== 'px' ) {
		return '';
	}
	const found = optionsArray.find( ( option ) => option.size === value );
	if ( ! found ) {
		return '';
	}
	return found.value;
}