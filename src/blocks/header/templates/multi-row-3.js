/**
 * Template: Multi-row 3
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_margin: ['', '0', '', ''],
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
			createBlock('kadence/header-container-desktop', { uniqueID: '8_cf5d2d-d1' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_d676cf-2a',
						location: 'top',
						background: {
							color: 'palette4',
							image: '',
							imageID: '',
							position: 'center center',
							size: 'cover',
							repeat: 'no-repeat',
							attachment: 'scroll',
							type: 'normal',
							gradient: '',
						},
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_84c8a7-08',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_093a19-78',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_62c66d-07',
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
								uniqueID: '8_989487-de',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[
								createBlock(
									'kadence/advancedheading',
									{
										uniqueID: '8_718d54-0d',
										align: 'center',
										color: 'palette9',
										typography: 'var( --global-heading-font-family, inherit )',
										fontWeight: '300',
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
										textTransform: 'capitalize',
										colorClass: 'theme-palette9',
										htmlTag: 'div',
										fontSize: ['sm', '', ''],
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_50f4b8-58',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_938fe4-f5',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_af268b-d4',
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
						uniqueID: '8_82a1be-98',
						location: 'center',
						layout: 'fullwidth',
						background: {
							color: 'palette9',
							image: '',
							imageID: '',
							position: 'center center',
							size: 'cover',
							repeat: 'no-repeat',
							attachment: 'scroll',
							type: 'normal',
							gradient: '',
						},
						padding: ['', 'lg', '', 'lg'],
						vAlign: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_f9e01a-bb',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_f3757c-f1', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/navigation',
											{
												uniqueID: '8_e9bf08-b5',
												templateKey: 'short',
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_a42e50-05',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_4d3aab-83', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/image',
									{
										align: 'center',
										imgMaxWidth: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '8_f36657-ce',
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
								uniqueID: '8_b6a60a-ec',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_b83e93-01',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_60df1f-25', location: 'right', metadata: { name: 'Right' } },
									[
										createBlock(
											'kadence/icon',
											{
												uniqueID: '8_c19000-db',
												gap: ['md', '', ''],
											},
											[
												createBlock(
													'kadence/single-icon',
													{
														uniqueID: '8_ec126f-9c',
														icon: 'fas_search',
														size: 20,
														color: 'palette5',
														margin: ['', 'md', '', ''],
														hColor: 'palette3',
													},
													[]
												),
											]
										),
										createBlock(
											'kadence/advancedbtn',
											{ hAlign: 'left', uniqueID: '8_f4452a-99' },
											[
												createBlock(
													'kadence/singlebtn',
													{
														uniqueID: '8_0b0239-ef',
														text: 'Contact',
														sizePreset: 'small',
														color: 'palette4',
														borderStyle: [
															{
																top: ['palette4', '', 1],
																right: ['palette4', '', 1],
																bottom: ['palette4', '', 1],
																left: ['palette4', '', 1],
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
																letterSpacing: ['', '', ''],
																letterType: 'px',
																textTransform: '',
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
						uniqueID: '8_94e89d-25',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_ef2e08-69',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_db7e50-28',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_9b9e6b-c8',
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
								uniqueID: '8_f2bc66-2f',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_938a0a-c0',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_faf93a-3d',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_81ff46-c4',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '8_c6dc40-3f' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_85c68f-65',
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
						paddingTablet: ['xxs', 'xxs', 'xxs', 'xxs'],
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_9513a8-e7',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_0be155-f9',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[
								createBlock(
									'kadence/advancedheading',
									{
										uniqueID: '8_2bfe81-30',
										color: 'palette9',
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
										htmlTag: 'div',
										fontSize: ['', 'sm', ''],
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_529ad8-82',
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
						uniqueID: '8_68a701-2e',
						location: 'center',
						minHeightTablet: 80,
						vAlignTablet: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_6f537d-7d', location: 'tablet-left', metadata: { name: 'Left' } },
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidthTablet: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '8_746f4a-a0',
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_65af20-8c',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_4e999c-64',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[
								createBlock(
									'kadence/off-canvas-trigger',
									{
										uniqueID: '8_62c72d-52',
										icon: 'fe_grid',
										iconSizeTablet: 25,
										iconColorTablet: 'palette3',
										iconColorHoverTablet: 'palette3',
									},
									[]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{ uniqueID: '8_da0c68-5e', location: 'bottom', metadata: { name: 'Bottom Row' } },
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_6658fd-77',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_5756d8-9c',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_fe7dad-c4',
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
					uniqueID: '8_684fff-53',
					slideFrom: 'right',
					widthType: 'full',
					containerMaxWidthTablet: 300,
					backgroundColorTablet: 'palette8',
					hAlignTablet: 'center',
					vAlignTablet: 'center',
					closeIconSizeTablet: 25,
					closeIconColorTablet: 'palette3',
				},
				[
					createBlock(
						'kadence/navigation',
						{
							uniqueID: '8_3603db-f6',
							align: 'wide',
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
