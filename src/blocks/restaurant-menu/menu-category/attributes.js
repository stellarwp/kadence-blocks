/**
 * BLOCK: Kadence Restaurant Menu category
 */

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

/**
 * Set default state
 */
export default {
	uniqueID: {
		type: 'string',
	},

	menuTitle: {
		type: 'String',
		default: ''
 	},

 	title: {
		type: 'String',
		default: ''
	},

	description: {
		type: 'String',
		default: ''
	},

	currency: {
		type: 'String',
		default: ''
	},

	price: {
		type: 'String',
		default: ''
	},

	columns: {
		type: 'Array',
		default: [ 3, 3, 3, 2, 1, 1 ],
	},

	columnControl: {
		type: 'string',
		default: 'linked',
	},

	gutter: {
		type: 'Array',
		default: [ 10, '', '' ],
	},
}
