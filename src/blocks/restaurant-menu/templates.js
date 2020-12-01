/**
 * BLOCK: Kadence Restaurant Menu Default Template
 */

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

/**
 * Set default template
 */
export default [
	[
		'kadence/restaurantmenucategory',
		{
			menuTitle: __( 'APPETIZERS' ),
		},
		[
			[
				'kadence/restaurantmenuitem',{
					title: __( 'FRIED SPRING ROLLS' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '2',
				}
			],
			[
				'kadence/restaurantmenuitem',{
					title: __( 'GAI OF NUUR SATAY' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '4.95',
				}
			]
		]
	]
];
