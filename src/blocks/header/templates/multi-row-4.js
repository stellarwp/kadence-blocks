/**
 * Template: Multi-Row 4
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock('kadence/header', {}, [
			createBlock('kadence/header-container-desktop', { uniqueID: '8_1e4c61-34' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_d7adea-16',
						location: 'top',
						background: {
							color: 'palette3',
							image: '',
							imageID: '',
							position: 'center center',
							size: 'cover',
							repeat: 'no-repeat',
							attachment: 'scroll',
							type: 'normal',
							gradient: '',
						},
						border: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['palette4', '', 1],
								left: ['', '', ''],
								unit: 'px',
							},
						],
						padding: ['xxs', 'sm', 'xxs', 'sm'],
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_8637b3-3b', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_3a30ac-d7', location: 'left', metadata: { name: 'Left' } },
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_91c063-dd',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_620954-ad', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/advancedheading',
									{
										uniqueID: '8_3bd042-ae',
										color: 'palette9',
										letterSpacing: 0.5,
										tabletLetterSpacing: '',
										mobileLetterSpacing: '',
										typography: 'var( --global-heading-font-family, inherit )',
										fontWeight: '100',
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
										htmlTag: 'span',
										fontSize: ['sm', '', ''],
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_f1d8a5-7d', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_fc37dc-ce',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_e711b3-24', location: 'right', metadata: { name: 'Right' } },
									[
										createBlock('kadence/icon', { uniqueID: '8_68609e-60', gap: ['xs', '', ''] }, [
											createBlock(
												'kadence/single-icon',
												{
													uniqueID: '8_d6e58a-81',
													icon: 'fa_facebook-n',
													link: '#',
													size: 15,
													title: 'Facebook',
													color: 'palette9',
													background: 'palette4',
													borderRadius: 50,
													borderWidth: 0,
													padding: [5, 5, 5, 5],
													style: 'stacked',
													hColor: 'palette9',
													hBackground: 'palette6',
												},
												[]
											),
											createBlock(
												'kadence/single-icon',
												{
													uniqueID: '8_cb8f98-1c',
													icon: 'fa_instagram',
													link: '#',
													size: 15,
													title: 'Instagram',
													color: 'palette9',
													background: 'palette4',
													borderRadius: 50,
													borderWidth: 0,
													padding: [5, 5, 5, 5],
													style: 'stacked',
													hColor: 'palette9',
													hBackground: 'palette6',
												},
												[]
											),
											createBlock(
												'kadence/single-icon',
												{
													uniqueID: '8_d538e7-80',
													icon: 'fa_youtube',
													link: '#',
													size: 15,
													title: 'Youtube',
													color: 'palette9',
													background: 'palette4',
													borderRadius: 50,
													borderWidth: 0,
													padding: [5, 5, 5, 5],
													style: 'stacked',
													hColor: 'palette9',
													hBackground: 'palette6',
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
						uniqueID: '8_89eaf0-b7',
						location: 'center',
						background: {
							color: 'palette3',
							image: '',
							imageID: '',
							position: 'center center',
							size: 'cover',
							repeat: 'no-repeat',
							attachment: 'scroll',
							type: 'normal',
							gradient: '',
						},
						padding: ['sm', 'sm', 'sm', 'sm'],
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_dbceb6-2f', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_fb386c-41', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/image',
											{
												imgMaxWidth: 312,
												sizeSlug: 'full',
												linkDestination: 'none',
												uniqueID: '8_fc5cfe-d6',
												url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-light-lg.png',
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_00ba5c-f8',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_357f76-69', location: 'center', metadata: { name: 'Center' } },
							[]
						),
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_c3ace8-31', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_b851ec-e4',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_dacfb7-df', location: 'right', metadata: { name: 'Right' } },
									[
										createBlock(
											'kadence/rowlayout',
											{
												uniqueID: '8_79857a-80',
												colLayout: 'row',
												padding: ['', '', '', ''],
												kbVersion: 2,
											},
											[
												createBlock(
													'kadence/column',
													{
														id: 2,
														borderWidth: ['', '', '', ''],
														uniqueID: '8_8e4f3b-bb',
														direction: ['horizontal', '', ''],
														justifyContent: ['flex-end', '', ''],
														verticalAlignment: 'middle',
														kbVersion: 2,
													},
													[
														createBlock(
															'kadence/navigation',
															{ uniqueID: '8_3d0d59-4f' },
															[]
														),
														createBlock(
															'kadence/advancedbtn',
															{ uniqueID: '8_1d3abd-1b' },
															[
																createBlock(
																	'kadence/singlebtn',
																	{
																		uniqueID: '8_49ae60-32',
																		text: 'Subscribe',
																		sizePreset: 'small',
																		color: 'palette9',
																		colorHover: 'palette7',
																		borderStyle: [
																			{
																				top: ['palette9', '', 1],
																				right: ['palette9', '', 1],
																				bottom: ['palette9', '', 1],
																				left: ['palette9', '', 1],
																				unit: 'px',
																			},
																		],
																		borderRadius: [0, 0, 0, 0],
																		inheritStyles: 'outline',
																		typography: [
																			{
																				size: ['', '', ''],
																				sizeType: 'px',
																				lineHeight: ['', '', ''],
																				lineType: '',
																				letterSpacing: [1, '', ''],
																				letterType: 'px',
																				textTransform: 'uppercase',
																				family: '',
																				google: '',
																				style: '',
																				weight: '700',
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
													'kadence/column',
													{
														borderWidth: ['', '', '', ''],
														uniqueID: '8_f01137-34',
														kbVersion: 2,
													},
													[createBlock('kadence/navigation', { uniqueID: '8_c82741-f7' }, [])]
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
					{ uniqueID: '8_df7e5e-06', location: 'bottom', metadata: { name: 'Bottom Row' } },
					[
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_da77da-98', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_61d7dc-63', location: 'left', metadata: { name: 'Left' } },
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_6ea788-0b',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_fc6f4f-6c', location: 'center', metadata: { name: 'Center' } },
							[]
						),
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_77071e-1f', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_f7f3f2-3a',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_c07288-da', location: 'right', metadata: { name: 'Right' } },
									[]
								),
							]
						),
					]
				),
			]),
			createBlock('kadence/header-container-tablet', { uniqueID: '8_4d7dc3-65' }, [
				createBlock('kadence/header-row', { uniqueID: '8_f62ef1-21', metadata: { name: 'Top Row' } }, [
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_c4f25f-6e', location: 'tablet-left', metadata: { name: 'Left' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_b76c81-fb', metadata: { name: 'Center' }, location: 'tablet-center' },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_eb802f-8c', location: 'tablet-right', metadata: { name: 'Right' } },
						[]
					),
				]),
				createBlock('kadence/header-row', { uniqueID: '8_8f1a3f-19', metadata: { name: 'Middle Row' } }, [
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_f22052-b3', location: 'tablet-left', metadata: { name: 'Left' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_3109c0-ba', metadata: { name: 'Center' }, location: 'tablet-center' },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_2bc25e-55', location: 'tablet-right', metadata: { name: 'Right' } },
						[]
					),
				]),
				createBlock('kadence/header-row', { uniqueID: '8_82407b-53', metadata: { name: 'Bottom Row' } }, [
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_de19fd-4d', location: 'tablet-left', metadata: { name: 'Left' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_a6d1c4-f9', metadata: { name: 'Center' }, location: 'tablet-center' },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_ea7703-87', location: 'tablet-right', metadata: { name: 'Right' } },
						[]
					),
				]),
			]),
			createBlock('kadence/off-canvas', { uniqueID: '8_504714-28' }, [
				createBlock('core/paragraph', { placeholder: 'Create Awesome' }, []),
			]),
		]),
	];
}

export { postMeta, innerBlocks };
