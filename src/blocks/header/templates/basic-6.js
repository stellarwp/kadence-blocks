/**
 * Template: Off Canvas Header 2
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_revealScrollUp: '1',
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
	_kad_header_background: {
		color: 'palette8',
		image: '',
		imageID: '',
		imagePosition: 'center center',
		imageSize: 'cover',
		imageRepeat: 'no-repeat',
		imageAttachment: 'scroll',
		type: 'normal',
		gradient: '',
	},
	_kad_header_isSticky: '1',
	_kad_header_isTransparent: '0',
	_kad_header_border: [
		{
			top: ['palette3', 'solid', 1],
			right: ['', 'solid', ''],
			bottom: ['palette3', 'solid', 1],
			left: ['', 'solid', ''],
			unit: 'px',
		},
	],
	_kad_header_borderTablet: [
		{
			top: ['', 'solid', ''],
			right: ['', 'solid', ''],
			bottom: ['', 'solid', ''],
			left: ['', 'solid', ''],
			unit: '',
		},
	],
	_kad_header_borderMobile: [
		{
			top: ['', 'solid', ''],
			right: ['', 'solid', ''],
			bottom: ['', 'solid', ''],
			left: ['', 'solid', ''],
			unit: '',
		},
	],
};

function innerBlocks() {
	return [
		createBlock('kadence/header', {}, [
			createBlock('kadence/header-container-desktop', { uniqueID: '10_47dd5f-61' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_cfc06c-ce',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_7cad62-6c',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_dfa1c3-41',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_f6db3b-53',
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
								uniqueID: '10_0ff5c6-3a',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_1051ef-b1',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_d03c44-3e',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_2b9c58-2f',
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
						uniqueID: '10_548d34-93',
						location: 'center',
						background: {
							color: 'palette8',
							image: '',
							imageID: '',
							position: 'center center',
							size: 'cover',
							repeat: 'no-repeat',
							attachment: 'scroll',
							type: 'normal',
							gradient: '',
						},
						minHeight: 60,
						vAlign: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_a9eaf4-88',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '10_f0b099-6d', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/advancedbtn',
											{
												uniqueID: '10_dd8bb8-58',
												margin: [
													{
														desk: ['', '', '0', ''],
														tablet: ['', '', '', ''],
														mobile: ['', '', '', ''],
													},
												],
												orientation: [null, '', ''],
											},
											[
												createBlock(
													'kadence/singlebtn',
													{
														uniqueID: '10_b752c7-cc',
														text: 'Call to Action',
														sizePreset: 'small',
														color: 'palette3',
														colorHover: 'palette6',
														borderStyle: [
															{
																top: ['palette3', '', ''],
																right: ['palette3', '', ''],
																bottom: ['palette3', '', ''],
																left: ['palette3', '', ''],
																unit: 'px',
															},
														],
														borderHoverStyle: [
															{
																top: ['palette6', '', ''],
																right: ['palette6', '', ''],
																bottom: ['palette6', '', ''],
																left: ['palette6', '', ''],
																unit: 'px',
															},
														],
														inheritStyles: 'outline',
														typography: [
															{
																size: ['sm', '', ''],
																sizeType: 'px',
																lineHeight: ['', '', ''],
																lineType: '',
																letterSpacing: [1, '', ''],
																letterType: 'px',
																textTransform: 'uppercase',
																family: 'var( --global-heading-font-family, inherit )',
																google: false,
																style: 'normal',
																weight: '600',
																variant: '',
																subset: '',
																loadGoogle: true,
															},
														],
													},
													[]
												),
											]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_fad384-ae',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '10_dd0168-26', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/image',
									{
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '10_639a2d-4d',
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_346913-8b',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_33f7a0-20',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_75f9e9-f4',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock(
											'kadence/rowlayout',
											{
												uniqueID: '10_c9b4dc-a3',
												collapseGutter: 'skinny',
												customRowGutter: [10, '', ''],
												columnGutter: 'custom',
												customGutter: [10, '', ''],
												colLayout: 'equal',
												maxWidth: 400,
												firstColumnWidth: 65,
												secondColumnWidth: 35,
												kbVersion: 2,
											},
											[
												createBlock(
													'kadence/column',
													{
														borderWidth: ['', '', '', ''],
														uniqueID: '10_85221c-18',
														kbVersion: 2,
													},
													[
														createBlock(
															'kadence/advancedheading',
															{
																uniqueID: '10_dafc06-6d',
																letterSpacing: 1,
																typography: 'var( --global-body-font-family, inherit )',
																fontWeight: '600',
																markBorder: '',
																markBorderStyles: [
																	{
																		top: [null, '', ''],
																		right: [null, '', ''],
																		bottom: [null, '', ''],
																		left: [null, '', ''],
																		unit: 'px',
																	},
																],
																tabletMarkBorderStyles: [
																	{
																		top: [null, '', ''],
																		right: [null, '', ''],
																		bottom: [null, '', ''],
																		left: [null, '', ''],
																		unit: 'px',
																	},
																],
																mobileMarkBorderStyles: [
																	{
																		top: [null, '', ''],
																		right: [null, '', ''],
																		bottom: [null, '', ''],
																		left: [null, '', ''],
																		unit: 'px',
																	},
																],
																textTransform: 'uppercase',
																htmlTag: 'div',
																fontSize: ['sm', '', ''],
															},
															[]
														),
													]
												),
												createBlock(
													'kadence/column',
													{
														id: 2,
														borderWidth: ['', '', '', ''],
														uniqueID: '10_df90f5-bb',
														kbVersion: 2,
													},
													[
														createBlock(
															'kadence/off-canvas-trigger',
															{
																uniqueID: '10_e079d5-c3',
																icon: 'ic_fourUp',
																iconColor: 'palette3',
																iconColorHover: 'palette6',
																iconBackgroundColor: 'palette8',
																iconBackgroundColorHover: 'palette8',
															},
															[]
														),
													]
												),
											]
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
						uniqueID: '10_65fbc1-8b',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_65db21-47',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_97c123-a5',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_dee5c5-c2',
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
								uniqueID: '10_25d778-94',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_010c01-6d',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_09d8ba-72',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_cab003-9b',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '10_030330-ff' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_ab4dfa-81',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_0fd69b-d5',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_2102c6-23',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_de5bf7-9c',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[]
						),
					]
				),
				createBlock('kadence/header-row', { uniqueID: '10_c37740-ce', metadata: { name: 'Middle Row' } }, [
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_d16dac-89',
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
									uniqueID: '10_768b26-c2',
									url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
								},
								[]
							),
						]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_c2e29f-f3',
							location: 'tablet-center',
							metadata: { name: 'Center' },
						},
						[]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_da4b6e-3f',
							location: 'tablet-right',
							metadata: { name: 'Right' },
						},
						[
							createBlock(
								'kadence/rowlayout',
								{
									uniqueID: '10_88b878-5a',
									tabletLayout: 'equal',
									tabletGutter: 'skinny',
									customGutter: ['', 16, ''],
									colLayout: 'equal',
									verticalAlignment: 'middle',
									kbVersion: 2,
								},
								[
									createBlock(
										'kadence/column',
										{ borderWidth: ['', '', '', ''], uniqueID: '10_95bbb6-da', kbVersion: 2 },
										[
											createBlock(
												'kadence/advancedheading',
												{
													uniqueID: '10_c080ac-97',
													align: 'right',
													color: 'palette3',
													tabletLetterSpacing: 1,
													markBorder: '',
													markBorderStyles: [
														{
															top: [null, '', ''],
															right: [null, '', ''],
															bottom: [null, '', ''],
															left: [null, '', ''],
															unit: 'px',
														},
													],
													tabletMarkBorderStyles: [
														{
															top: [null, '', ''],
															right: [null, '', ''],
															bottom: [null, '', ''],
															left: [null, '', ''],
															unit: 'px',
														},
													],
													mobileMarkBorderStyles: [
														{
															top: [null, '', ''],
															right: [null, '', ''],
															bottom: [null, '', ''],
															left: [null, '', ''],
															unit: 'px',
														},
													],
													textTransform: 'uppercase',
													colorClass: 'theme-palette3',
													htmlTag: 'div',
													fontSize: ['', 'sm', ''],
												},
												[]
											),
										]
									),
									createBlock(
										'kadence/column',
										{
											id: 2,
											borderWidth: ['', '', '', ''],
											uniqueID: '10_bc8cae-ab',
											justifyContent: ['', 'flex-start', ''],
											verticalAlignment: 'middle',
											kbVersion: 2,
										},
										[
											createBlock(
												'kadence/off-canvas-trigger',
												{
													uniqueID: '10_151eec-16',
													icon: 'ic_fourUp',
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
						]
					),
				]),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_063c11-db',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_bf01fc-ee',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_f52042-78',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_efd061-74',
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
					uniqueID: '10_8734cb-ee',
					slideFrom: 'right',
					maxWidth: 700,
					containerMaxWidth: 500,
					backgroundColor: 'palette6',
					pageBackgroundColor: 'rgba(0,0,0,0)',
					vAlign: 'center',
					closeIcon: 'fe_x',
					closeIconColor: 'palette8',
					closeIconColorHover: 'palette9',
				},
				[
					createBlock('kadence/navigation', { uniqueID: '10_8bfb46-ae', templateKey: 'short' }, []),
					createBlock(
						'kadence/rowlayout',
						{
							uniqueID: '10_0d41ea-63',
							columns: 1,
							colLayout: 'equal',
							inheritMaxWidth: true,
							kbVersion: 2,
						},
						[
							createBlock(
								'kadence/column',
								{ borderWidth: ['', '', '', ''], uniqueID: '10_ecad58-0a', kbVersion: 2 },
								[
									createBlock(
										'kadence/advancedheading',
										{
											uniqueID: '10_8d7f6a-cb',
											color: 'palette9',
											margin: ['', '', 'xs', ''],
											markBorder: '',
											markBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											tabletMarkBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											mobileMarkBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											colorClass: 'theme-palette9',
											htmlTag: 'div',
											fontSize: ['sm', '', ''],
											icon: 'fe_mail',
										},
										[]
									),
									createBlock(
										'kadence/advancedheading',
										{
											uniqueID: '10_c34138-26',
											color: 'palette9',
											margin: ['', '', 'xs', ''],
											markBorder: '',
											markBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											tabletMarkBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											mobileMarkBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											colorClass: 'theme-palette9',
											htmlTag: 'div',
											fontSize: ['sm', '', ''],
											icon: 'fe_phone',
										},
										[]
									),
									createBlock(
										'kadence/advancedheading',
										{
											uniqueID: '10_5cc5ac-0d',
											color: 'palette9',
											markBorder: '',
											markBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											tabletMarkBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											mobileMarkBorderStyles: [
												{
													top: [null, '', ''],
													right: [null, '', ''],
													bottom: [null, '', ''],
													left: [null, '', ''],
													unit: 'px',
												},
											],
											colorClass: 'theme-palette9',
											htmlTag: 'div',
											fontSize: ['sm', '', ''],
											icon: 'fe_mapPin',
											iconVerticalAlign: 'baseline',
										},
										[]
									),
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
