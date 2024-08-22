/**
 * Template: Mobile &#8211; 1
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
};

function innerBlocks() {
	return [
		createBlock('kadence/header', {}, [
			createBlock('kadence/header-container-desktop', { uniqueID: '42_e52e8f-ef' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '42_072324-fd',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '42_e7dbf9-aa',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_72525b-ba',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_e15cf0-4e',
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
								uniqueID: '42_675a02-c5',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '42_fa6524-07',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_ae3f27-ed',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_6b3646-b5',
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
						uniqueID: '42_cc738e-02',
						location: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '42_31a719-ac',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '42_fa7143-0a', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/image',
											{
												imgMaxWidth: 100,
												sizeSlug: 'full',
												linkDestination: 'none',
												uniqueID: '42_700bf6-9f',
												globalAlt: true,
												url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_a1f09b-2a',
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
								uniqueID: '42_c10169-40',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[createBlock('kadence/navigation', { uniqueID: '42_aa5abb-ca', templateKey: 'short' }, [])]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '42_9de6d3-31',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_4c0530-47',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_178588-71',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock('kadence/advancedbtn', { uniqueID: '42_067a44-b6' }, [
											createBlock(
												'kadence/singlebtn',
												{
													uniqueID: '42_30e239-70',
													text: 'Call To Action',
													sizePreset: 'small',
													typography: [
														{
															size: ['', '', ''],
															sizeType: 'px',
															lineHeight: ['', '', ''],
															lineType: '',
															letterSpacing: [0.5, '', ''],
															letterType: 'px',
															textTransform: 'uppercase',
															family: 'var( --global-heading-font-family, inherit )',
															google: false,
															style: 'normal',
															weight: 'inherit',
															variant: '',
															subset: '',
															loadGoogle: true,
														},
													],
												},
												[]
											),
											createBlock(
												'kadence/singlebtn',
												{
													uniqueID: '42_bb54fd-29',
													text: 'Secondary',
													sizePreset: 'small',
													inheritStyles: 'outline',
													typography: [
														{
															size: ['', '', ''],
															sizeType: 'px',
															lineHeight: ['', '', ''],
															lineType: '',
															letterSpacing: [0.5, '', ''],
															letterType: 'px',
															textTransform: 'uppercase',
															family: 'var( --global-heading-font-family, inherit )',
															google: false,
															style: 'normal',
															weight: 'inherit',
															variant: '',
															subset: '',
															loadGoogle: true,
														},
													],
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
						uniqueID: '42_444e11-16',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '42_635709-96',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_0cdfc4-61',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_db96a3-56',
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
								uniqueID: '42_2a66e5-ba',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '42_b20a52-4f',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_edd10e-67',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '42_90a9fe-73',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '42_99b740-24' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '42_b11bd1-c0',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '42_c92648-8e',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '42_4e4853-63',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '42_ebe192-48',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '42_5ed048-42',
						layout: 'fullwidth',
						vAlignTablet: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '42_19270f-d5',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[
								createBlock(
									'kadence/off-canvas-trigger',
									{
										uniqueID: '42_6165e0-2d',
										iconSizeTablet: 25,
										iconColorTablet: 'palette3',
										iconColorHoverTablet: 'palette3',
										iconBackgroundColorTablet: 'palette8',
										iconBackgroundColorHoverTablet: 'palette8',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '42_c5037b-3f',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidthTablet: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '42_11aab1-8e',
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '42_a5ebed-38',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[]
						),
					]
				),
				createBlock('kadence/header-row', { uniqueID: '42_1fe649-e4', metadata: { name: 'Bottom Row' } }, [
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '42_cf727a-2c',
							location: 'tablet-left',
							metadata: { name: 'Left' },
						},
						[]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '42_a6e551-1c',
							location: 'tablet-center',
							metadata: { name: 'Center' },
						},
						[]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '42_c73452-ad',
							location: 'tablet-right',
							metadata: { name: 'Right' },
						},
						[]
					),
				]),
			]),
			createBlock(
				'kadence/off-canvas',
				{
					uniqueID: '42_ec0ed5-87',
					slideFrom: 'right',
					maxWidthTablet: 700,
					containerMaxWidth: '',
					containerMaxWidthTablet: '',
					containerMaxWidthMobile: '',
					widthTablet: 450,
					backgroundColorTablet: 'palette4',
					hAlignTablet: 'left',
					vAlignTablet: 'top',
					closeIcon: 'fe_x',
					closeIconSizeTablet: 25,
					closeIconColorTablet: 'palette9',
					closeIconColorHoverTablet: 'palette9',
					closeIconPaddingTablet: ['sm', 'sm', '', ''],
				},
				[createBlock('kadence/navigation', { uniqueID: '42_9ae050-24', templateKey: 'short-vertical' }, [])]
			),
		]),
	];
}

export { postMeta, innerBlocks };
