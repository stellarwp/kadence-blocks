/**
 * Template: Basic: Logo &#8211; Nav &#8211; CTA
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_background: { type: 'normal', color: 'palette8' },
	_kad_header_isSticky: '0',
	_kad_header_isTransparent: '0',
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
			createBlock('kadence/header-container-desktop', { uniqueID: '6_b9c987-a7' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '6_6c9b81-87',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_bc4f28-70',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_b96307-98',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_ef8816-65',
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
								uniqueID: '6_a747de-57',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_d87423-24',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_8f50a6-ea',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_e7481c-77',
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
						uniqueID: '6_ebec9e-74',
						location: 'center',
						vAlign: 'center',
						minHeight: 80,
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_d957c0-53',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '6_569d28-f9', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/identity',
											{
												uniqueID: '6_961c4f-90',
												showSiteTitle: false,
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_f2df43-27',
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
								uniqueID: '6_43f7e5-b0',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_82e24a-5e',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_594813-d8',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_62cdc0-cb',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock(
											'kadence/navigation',
											{
												uniqueID: '6_59d3e4-f2',
												templateKey: 'short',
											},
											[]
										),
										createBlock('kadence/advancedbtn', { uniqueID: '6_b0e311-af' }, [
											createBlock(
												'kadence/singlebtn',
												{
													uniqueID: '6_bcb4c5-2a',
													text: 'Call to Action',
													sizePreset: 'small',
													color: 'palette9',
													background: 'palette3',
													colorHover: 'palette9',
													backgroundHover: 'palette6',
													typography: [
														{
															size: ['sm', '', ''],
															sizeType: 'px',
															lineHeight: ['', '', ''],
															lineType: '',
															letterSpacing: ['', '', ''],
															letterType: 'px',
															textTransform: 'uppercase',
															family: '',
															google: '',
															style: '',
															weight: '',
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
						uniqueID: '6_db25ae-87',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_f60ab1-8b',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_a8aad6-0f',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_934650-c2',
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
								uniqueID: '6_8ed3ff-b3',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_57d3e4-b8',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_355050-69',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_aec591-8e',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '6_741598-d5' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '6_a08282-68',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{ uniqueID: '6_43b503-12', location: 'tablet-left', metadata: { name: 'Left' } },
							[
								createBlock(
									'kadence/identity',
									{
										uniqueID: '6_eb8552-af',
										showSiteTitle: false,
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_552a9f-e7',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_e13dc2-d0',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[
								createBlock(
									'kadence/off-canvas-trigger',
									{
										uniqueID: '6_9fd5e3-19',
										iconSizeTablet: 20,
										iconColorTablet: 'palette3',
										iconColorHoverTablet: 'palette6',
										iconBackgroundColorTablet: 'palette8',
										iconBackgroundColorHoverTablet: 'palette8',
									},
									[]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{ uniqueID: '6_68c1c3-80', location: 'center', metadata: { name: 'Middle Row' } },
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_ee97d8-f1',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_16a0d7-83',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_0d1746-3e',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{ uniqueID: '6_78c60d-7b', location: 'bottom', metadata: { name: 'Bottom Row' } },
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_8e84ad-2c',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_c839f3-8d',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_ca5c87-c5',
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
					uniqueID: '6_1d3153-51',
					slideFrom: 'right',
					maxWidthTablet: 700,
					containerMaxWidthTablet: 400,
					backgroundColorTablet: 'palette3',
					paddingTablet: ['sm', 'sm', 'sm', 'sm'],
					hAlignTablet: 'center',
					vAlignTablet: 'center',
					closeIcon: 'fe_xSquare',
					closeIconSizeTablet: 25,
					closeIconColorTablet: 'palette9',
					closeIconColorHoverTablet: 'palette9',
					closeIconBackgroundColorTablet: 'palette3',
					closeIconBackgroundColorHoverTablet: 'palette3',
					closeIconPaddingTablet: ['xs', 'xs', 'xs', 'xs'],
				},
				[
					createBlock(
						'kadence/navigation',
						{
							uniqueID: '6_3492b0-e3',
							templateKey: 'short-vertical',
						},
						[]
					),
				]
			),
		]),
	];
}

export { postMeta, innerBlocks };
