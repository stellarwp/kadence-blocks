export function serializeGradientColor( { type, value } ) {
	if ( type === 'literal' ) {
		return value;
	}
	if ( type === 'hex' ) {
		return `#${ value }`;
	}
	return `${ type }(${ value.join( ',' ) })`;
}

export function serializeGradientPosition( position ) {
	if ( ! position ) {
		return '';
	}
	const { value, type } = position;
	return `${ value }${ type }`;
}

export function serializeGradientColorStop( { type, value, length } ) {
	return `${ serializeGradientColor( {
		type,
		value,
	} ) } ${ serializeGradientPosition( length ) }`;
}

export function serializeGradientOrientation( type, orientation ) {
	if ( 'radial-gradient' === type ) {
		if ( ! orientation || ! orientation[0] || orientation[0].type !== 'shape' ) {
			return;
		}
		if ( '%' === orientation[0].at.value.x.type ) {
			return `${ orientation[0].value } at ${ orientation[0].at.value.x.value }% ${ orientation[0].at.value.y.value }%`;
		}
		return `${ orientation[0].value } at ${ orientation[0].at.value.x.value } ${ orientation[0].at.value.y.value }`;
	}
	if ( ! orientation || orientation.type !== 'angular' ) {
		return;
	}
	return `${ orientation.value }deg`;
}

export function serializeGradient( { type, orientation, colorStops } ) {
	const serializedOrientation = serializeGradientOrientation( type, orientation );
	const serializedColorStops = colorStops
		.sort( ( colorStop1, colorStop2 ) => {
			return (
				( colorStop1?.length?.value ?? 0 ) -
				( colorStop2?.length?.value ?? 0 )
			);
		} )
		.map( serializeGradientColorStop );
	return `${ type }(${ [ serializedOrientation, ...serializedColorStops ]
		.filter( Boolean )
		.join( ',' ) })`;
}
