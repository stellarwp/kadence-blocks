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
		default: __( 'Drinks' )
	},

	description: {
		type: 'String',
		default: __( 'It is a long established fact that a reader.' )
	},

	currency: {
		type: 'String',
		default: '$'
	},

	price: {
		type: 'String',
		default: '50'
	}
}
