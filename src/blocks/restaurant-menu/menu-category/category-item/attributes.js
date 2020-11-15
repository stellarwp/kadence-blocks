/**
 * BLOCK: Kadence Restaurant Menu Category Item
 */

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

/**
 * Set default state
 */
export default {
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
