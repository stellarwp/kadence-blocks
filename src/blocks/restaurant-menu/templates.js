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
			],
			[
				'kadence/restaurantmenuitem',{
					title: __( 'TOFU TOD' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '3.95',
				}
			],
			[
				'kadence/restaurantmenuitem',{
					title: __( 'FRESH THAI SUMMER ROLL' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '4.50',
				}
			],
			[
				'kadence/restaurantmenuitem',{
					title: __( 'FRIED TIGER SHRIMP ROLLS' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '4.95',
				}
			],
			[
				'kadence/restaurantmenuitem',{
					title: __( 'THAI SPARE RIBS' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '8.95',
				}
			]
		]
	],
	[
		'kadence/restaurantmenucategory',
		{
			menuTitle: __( 'ENTREES' ),
		},
		[
			[
				'kadence/restaurantmenuitem',{
					title: __( 'GAI PAD KHING' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '7.95',
				}
			],
			[
				'kadence/restaurantmenuitem',{
					title: __( 'NUUR KRA PROW' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '8.50',
				}
			],
			[
				'kadence/restaurantmenuitem',{
					title: __( 'KOONG PAD KHING' ),
					description: __( 'Details about food' ),
					currency: '$',
					price: '8.95',
				}
			]
		]
	]

];
