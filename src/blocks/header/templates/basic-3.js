/**
 * Template: Basic &#8211; Middle Logo
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_background: { type: 'normal', color: 'palette8' },
	_kad_header_flex: {
		direction: ['horizontal', '', ''],
		justifyContent: ['center', '', ''],
		verticalAlignment: ['', '', ''],
	},
	_kad_header_padding: ['md', 'md', 'md', 'md'],
	_kad_header_height: ['110', '', ''],
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
			createBlock('kadence/header-container-desktop', { uniqueID: '6_8a54ee-e5' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '6_ab0443-66',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_d3211c-99',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_91abed-d2',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_9f5961-32',
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
								uniqueID: '6_378e9d-cd',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_abbeb1-2a',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_8b2d3c-0b',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_e1ec2c-70',
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
						uniqueID: '6_727312-9d',
						location: 'center',
						layout: 'fullwidth',
						padding: ['sm', 'sm', 'sm', 'sm'],
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_5ef4ea-76',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_ef1743-20',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_424422-01',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[
										createBlock(
											'kadence/navigation',
											{ uniqueID: '6_adaeb5-22', templateKey: 'short' },
											[]
										),
									]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_d73051-3d',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidth: 200,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '6_28864c-2f',
										marginDesktop: ['', 'md', '', 'md'],
										globalAlt: true,
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_f00bb1-7f',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_71b76c-e9',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[
										createBlock(
											'kadence/navigation',
											{ uniqueID: '6_9c1e43-30', templateKey: 'short' },
											[]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_5264df-4a',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock('kadence/advancedbtn', { uniqueID: '6_c4c399-29' }, [
											createBlock(
												'kadence/singlebtn',
												{
													uniqueID: '6_1dcf73-af',
													text: 'CAll to action',
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
															letterSpacing: [1, '', ''],
															letterType: 'px',
															textTransform: 'uppercase',
															family: '',
															google: '',
															style: '',
															weight: '500',
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
						uniqueID: '6_1be4fc-bb',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_d29711-a5',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_709416-dd',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_1b739b-8c',
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
								uniqueID: '6_ff0421-eb',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_099ace-7c',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_9e83d6-e8',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_176e1e-df',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '6_cdd54e-ec' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '6_9a68e2-ec',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_d14800-cd',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_8e1cce-17',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_3f44b0-36',
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
						uniqueID: '6_be98a1-59',
						layout: 'fullwidth',
						vAlignTablet: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_f7efdb-52',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_7048f8-e9',
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
										uniqueID: '6_267191-57',
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_f780bf-26',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[
								createBlock(
									'kadence/off-canvas-trigger',
									{
										uniqueID: '6_fdfe09-2d',
										icon: 'fe_alignJustify',
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
					]
				),
				createBlock('kadence/header-row', { uniqueID: '6_12c3d7-de', metadata: { name: 'Bottom Row' } }, [
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '6_092ed2-c2',
							location: 'tablet-left',
							metadata: { name: 'Left' },
						},
						[]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '6_ee92c3-ac',
							location: 'tablet-center',
							metadata: { name: 'Center' },
						},
						[]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '6_6e0811-10',
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
					uniqueID: '6_e673a2-87',
					slideFrom: 'right',
					widthType: 'full',
					containerMaxWidthTablet: 400,
					backgroundColorTablet: 'palette6',
					hAlignTablet: 'center',
					vAlignTablet: 'center',
					closeIconSizeTablet: 25,
					closeIconColorTablet: 'palette9',
					closeIconColorHoverTablet: 'palette9',
					closeIconBackgroundColorTablet: 'palette6',
					closeIconBackgroundColorHoverTablet: 'palette6',
				},
				[
					createBlock('kadence/navigation', { uniqueID: '6_533373-5b', templateKey: 'short' }, []),
					createBlock(
						'kadence/rowlayout',
						{
							uniqueID: '6_75ef70-f8',
							columns: 3,
							tabletLayout: 'equal',
							tabletGutter: 'skinny',
							customGutter: ['', 16, ''],
							colLayout: 'equal',
							tabletPadding: ['', 'xs', '', 'xs'],
							kbVersion: 2,
						},
						[
							createBlock(
								'kadence/column',
								{
									borderWidth: ['', '', '', ''],
									uniqueID: '6_396b70-3b',
									kbVersion: 2,
								},
								[
									createBlock('kadence/icon', { uniqueID: '6_1a3587-77' }, [
										createBlock(
											'kadence/single-icon',
											{
												uniqueID: '6_4b320e-48',
												icon: 'fa_facebook-n',
												link: '#',
												title: 'Facebook',
												color: 'palette9',
												hColor: 'palette7',
												tabletSize: 25,
											},
											[]
										),
									]),
								]
							),
							createBlock(
								'kadence/column',
								{
									id: 2,
									borderWidth: ['', '', '', ''],
									uniqueID: '6_e3d637-45',
									kbVersion: 2,
								},
								[
									createBlock('kadence/icon', { uniqueID: '6_e45144-3c' }, [
										createBlock(
											'kadence/single-icon',
											{
												uniqueID: '6_a6aad3-d4',
												icon: 'fe_instagram',
												link: '#',
												title: 'Instagram',
												color: 'palette9',
												hColor: 'palette7',
												tabletSize: 25,
											},
											[]
										),
									]),
								]
							),
							createBlock(
								'kadence/column',
								{
									id: 3,
									borderWidth: ['', '', '', ''],
									uniqueID: '6_8e7341-eb',
									kbVersion: 2,
								},
								[
									createBlock('kadence/icon', { uniqueID: '6_cf6c5e-9f' }, [
										createBlock(
											'kadence/single-icon',
											{
												uniqueID: '6_4c7b45-e9',
												icon: 'fa_youtube',
												link: '#',
												title: 'Youtube',
												color: 'palette9',
												hColor: 'palette7',
												tabletSize: 25,
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
		]),
	];
}

export { postMeta, innerBlocks };
