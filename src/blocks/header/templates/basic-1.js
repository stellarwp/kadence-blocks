/**
 * Template: Basic: 2 buttons
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_background: { type: 'normal', color: 'palette8' },
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
			createBlock('kadence/header-container-desktop', { uniqueID: '6_1d8d24-bf' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '6_10764d-6d',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_e00be5-fd',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_50fd6d-90',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_269ef9-ff',
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
								uniqueID: '6_c8207e-c2',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_695d80-c4',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_99c7cf-82',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_388d65-77',
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
						uniqueID: '6_e34992-48',
						location: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_a696a4-d7',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '6_0ee19c-e3', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/identity',
											{
												uniqueID: '6_e0ac3d-70',
												showSiteTitle: false,
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_be370d-cf',
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
								uniqueID: '6_025f5a-10',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[createBlock('kadence/navigation', { uniqueID: '6_d4bf5e-7f', templateKey: 'long' }, [])]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_2ac6ad-37',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_897bf0-ab',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_3aebe7-3c',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock('kadence/advancedbtn', { uniqueID: '6_a61a9b-27' }, [
											createBlock(
												'kadence/singlebtn',
												{
													uniqueID: '6_014d21-8f',
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
													uniqueID: '6_d950a8-bc',
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
						uniqueID: '6_58634c-1c',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_ed1fec-d5',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_3618a0-b3',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_d7db3e-35',
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
								uniqueID: '6_6ddb39-f2',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '6_324d1c-7e',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_63b27c-19',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '6_66a6bb-66',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '6_0db05f-19' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '6_d3c183-dc',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_735956-a1',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_96ebcd-88',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_55f6b1-b9',
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
						uniqueID: '6_0cacf3-2c',
						location: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_b29fb9-7a',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[
								createBlock(
									'kadence/off-canvas-trigger',
									{
										uniqueID: '6_7d4a68-e6',
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
								uniqueID: '6_4503bc-d7',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[
								createBlock(
									'kadence/identity',
									{
										uniqueID: '6_947fd5-0f',
										showSiteTitle: false,
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_924005-96',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{ uniqueID: '6_e4a604-e0', location: 'bottom', metadata: { name: 'Bottom Row' } },
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_8ac929-9b',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_1241a8-a6',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '6_a59f90-39',
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
					uniqueID: '6_aa8c37-35',
					maxWidthTablet: 700,
					containerMaxWidthTablet: 350,
					backgroundColorTablet: 'palette3',
					hAlignTablet: 'left',
					vAlignTablet: 'center',
					closeIcon: 'fas_window-close',
					closeIconSizeTablet: 25,
					closeIconColorTablet: 'palette9',
					closeIconColorHoverTablet: 'palette9',
				},
				[createBlock('kadence/navigation', { uniqueID: '6_bc45c6-f6', templateKey: 'long-vertical' }, [])]
			),
		]),
	];
}

export { postMeta, innerBlocks };
