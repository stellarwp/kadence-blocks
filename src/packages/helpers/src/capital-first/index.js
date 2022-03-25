/**
 * function to return string with capital letter.
 * @param {string} string the word string.
 * @returns {string} with capital letter.
 */
export default ( string ) => {
	return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}
