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
		default: __( 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' )
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
