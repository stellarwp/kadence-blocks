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
	}
}
