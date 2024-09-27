/**
 * Template: Mobile-4
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
			createBlock('kadence/header-container-desktop', { uniqueID: '88_67b2e2-6c' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '88_d50707-f4',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '88_11f577-89',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_54daf2-8c',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_1e363c-0c',
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
								uniqueID: '88_e8405a-48',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '88_5ddf80-27',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_63c949-f5',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_1b22dd-5f',
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
						uniqueID: '88_0f6798-80',
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
								uniqueID: '88_e5c01e-88',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '88_393b2b-c0', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/advancedbtn',
											{
												uniqueID: '88_382855-70',
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
														uniqueID: '88_6350c1-a0',
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
										uniqueID: '88_3183e2-16',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '88_36bddf-aa', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidth: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '88_9a8fe5-2f',
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '88_62d12b-3b',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_03f8c1-8e',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_dd8a9c-92',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock(
											'kadence/rowlayout',
											{
												uniqueID: '88_efca81-f3',
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
														uniqueID: '88_0090af-23',
														kbVersion: 2,
													},
													[
														createBlock(
															'kadence/advancedheading',
															{
																uniqueID: '88_eaaf9b-62',
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
														uniqueID: '88_26b104-ac',
														kbVersion: 2,
													},
													[
														createBlock(
															'kadence/off-canvas-trigger',
															{
																uniqueID: '88_267d25-20',
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
						uniqueID: '88_35e498-43',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '88_0cf0d0-db',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_f1a019-a9',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_b1882a-e1',
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
								uniqueID: '88_67a1f2-23',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '88_8d1992-53',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_7dd8f8-55',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '88_aac09f-0f',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '88_097579-d2' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '88_e14f8f-0b',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '88_eb389f-fa',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '88_a61084-4e',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '88_c53951-5e',
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
						uniqueID: '88_6595d8-c9',
						location: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '88_e1408f-c4',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[
								createBlock(
									'kadence/off-canvas-trigger',
									{
										uniqueID: '88_0159fa-ae',
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
								uniqueID: '88_1e6337-10',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidth: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '88_f364a2-34',
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '88_120f5b-c3',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[
								createBlock('kadence/advancedbtn', { uniqueID: '88_a7d78d-91' }, [
									createBlock(
										'kadence/singlebtn',
										{
											uniqueID: '88_b0ba2f-dd',
											text: 'Join Today',
											sizePreset: 'small',
											background: 'palette4',
											backgroundHover: 'palette3',
										},
										[]
									),
								]),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '88_acd27e-b5',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '88_21d99b-be',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '88_ef28da-f8',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '88_a95cb8-d8',
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
					uniqueID: '88_0808dd-d4',
					maxWidthTablet: 700,
					widthTablet: 500,
					closeIcon: 'fe_x',
					closeIconPaddingTablet: ['sm', 'sm', '', ''],
				},
				[createBlock('kadence/navigation', { uniqueID: '88_df5f65-59', templateKey: 'short' }, [])]
			),
		]),
	];
}

export { postMeta, innerBlocks };
