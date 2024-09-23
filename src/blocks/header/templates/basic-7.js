/**
 * Template: Off Canvas &#8211; 4
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_shadow: [
		{
			enable: false,
			color: '#000000',
			opacity: 0.2,
			spread: 0,
			blur: 2,
			hOffset: 1,
			vOffset: 1,
			inset: false,
		},
	],
	_kad_header_isSticky: '1',
	_kad_header_isTransparent: '0',
};

function innerBlocks() {
	return [
		createBlock('kadence/header', {}, [
			createBlock('kadence/header-container-desktop', { uniqueID: '10_9b8274-df' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_f4816d-58',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_1db117-66',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_eeb809-55',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_63e52d-99',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_a6253a-9a',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_817efa-f4',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_ebd725-15',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_be6fab-2d',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_38d32f-b3',
						location: 'center',
						minHeight: 60,
						vAlign: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_e3294a-db',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_93f2a8-d7',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[
										createBlock(
											'kadence/off-canvas-trigger',
											{
												uniqueID: '10_8c3ae3-e3',
												iconColor: 'palette3',
												iconColorHover: 'palette6',
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_edd39c-23',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '10_95414b-3e', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidth: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '10_1bcfb7-cb',
										globalAlt: true,
										link: '/',
										marginDesktop: ['0', '', '0', ''],
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_9225e0-a4',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_fa4550-a6',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_38aa24-cf',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock('kadence/icon', { uniqueID: '10_b26f06-67' }, [
											createBlock(
												'kadence/single-icon',
												{
													uniqueID: '10_c06b96-64',
													icon: 'fe_messageCircle',
													link: '#',
													size: 30,
													title: 'Chat or support',
													color: 'palette3',
													hColor: 'palette6',
												},
												[]
											),
										]),
									]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_be279b-96',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_156db1-12',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_4fd11e-d8',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_27b2ae-f8',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_662575-4d',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_bad89b-9f',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_7cb51b-69',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_1bcc4f-41',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[]
								),
							]
						),
					]
				),
			]),
			createBlock('kadence/header-container-tablet', { uniqueID: '10_ea8334-1d' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_b87809-b2',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_a5fe2e-3d',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_a628c2-31',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_835e6f-11',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{ uniqueID: '10_5922ae-0e', location: 'center', metadata: { name: 'Middle Row' } },
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_748893-45',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidthTablet: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '10_e81621-7a',
										link: '/',
										marginDesktop: ['0', '', '0', ''],
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_c2fbc3-92',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_42c593-4d',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[
								createBlock(
									'kadence/icon',
									{ uniqueID: '10_875530-ba', tabletTextAlignment: 'right' },
									[
										createBlock(
											'kadence/single-icon',
											{
												uniqueID: '10_969615-c8',
												icon: 'fe_messageCircle',
												color: 'palette3',
												tabletSize: 25,
											},
											[]
										),
									]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_b4c9b8-ca',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_722118-db',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_d5ddbd-e2',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_3f8aab-6f',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[]
						),
					]
				),
			]),
			createBlock(
				'kadence/off-canvas',
				{
					uniqueID: '10_a7af72-d0',
					maxWidth: 300,
					containerMaxWidth: 300,
					backgroundColor: 'palette3',
					vAlign: 'center',
					closeIcon: 'fe_x',
					closeIconColor: 'palette9',
					closeIconColorHover: 'palette7',
				},
				[createBlock('kadence/navigation', { uniqueID: '10_6f903e-a7', templateKey: 'short' }, [])]
			),
		]),
	];
}

export { postMeta, innerBlocks };
