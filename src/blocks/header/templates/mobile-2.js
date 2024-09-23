/**
 * Template: Mobile-2
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
			createBlock('kadence/header-container-desktop', { uniqueID: '56_20a751-5b' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '56_55ec9f-b5',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '56_79c0c0-db',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_4fc859-d0',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_26c786-91',
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
								uniqueID: '56_43db6e-9f',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '56_08e616-f9',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_a40af3-5d',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_aeac76-c2',
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
						uniqueID: '56_6521bf-ac',
						location: 'center',
						vAlign: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '56_25a2fe-74',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '56_2d679e-65', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/image',
											{
												imgMaxWidth: 105,
												sizeSlug: 'full',
												linkDestination: 'none',
												uniqueID: '56_d3383f-53',
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
									'kadence/header-column',
									{
										uniqueID: '56_86cdcc-8c',
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
								uniqueID: '56_7b35d4-c2',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '56_382fa0-28',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_94b338-2b',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_e6b64e-67',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock(
											'kadence/navigation',
											{
												uniqueID: '56_192eb5-9e',
												templateKey: 'short',
											},
											[]
										),
										createBlock('kadence/advancedbtn', { uniqueID: '56_07c8cf-de' }, [
											createBlock(
												'kadence/singlebtn',
												{
													uniqueID: '56_1c3285-3f',
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
						uniqueID: '56_71a213-0a',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '56_bd4ab7-5e',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_1a9d89-f7',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_4dd013-66',
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
								uniqueID: '56_b7ded6-f6',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '56_16145e-3f',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_6a401f-df',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '56_eea961-75',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '56_97ea08-7c' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '56_b888bd-ad',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '56_01cd63-f4',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '56_f363d3-79',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '56_cf6da8-d2',
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
						uniqueID: '56_e87b6f-48',
						location: 'center',
						layout: 'fullwidth',
						vAlignTablet: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '56_0749e8-3e',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidth: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '56_6b3b28-b2',
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
								uniqueID: '56_2a5574-34',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '56_35395a-c2',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[
								createBlock(
									'kadence/off-canvas-trigger',
									{
										uniqueID: '56_b4c1d7-f0',
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
				createBlock(
					'kadence/header-row',
					{ uniqueID: '56_d0d653-cb', location: 'bottom', metadata: { name: 'Bottom Row' } },
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '56_b87607-e2',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '56_1fe859-b7',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '56_9289e6-e4',
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
					uniqueID: '56_6488f5-aa',
					maxWidthTablet: 700,
					widthTablet: 400,
					backgroundColorTablet: 'palette5',
					hAlignTablet: 'left',
					vAlignTablet: 'top',
					closeIconColorTablet: 'palette5',
					closeIconBackgroundColorTablet: 'palette7',
				},
				[createBlock('kadence/navigation', { uniqueID: '56_1d1567-c1', templateKey: 'short-vertical' }, [])]
			),
		]),
	];
}

export { postMeta, innerBlocks };
