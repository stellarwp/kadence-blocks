/**
 * Convert number with the type of string, into integers.
 * @param {array} array of strings.
 * @returns {array} with numbers as integers.
 */
export default ( array ) => {
	const result = array.map(function (x) {
		const parsedValue = parseInt(x);
		if( isNaN( parsedValue ) ) {
			return x;
		}
		return parsedValue;
	});

	return result;
}
