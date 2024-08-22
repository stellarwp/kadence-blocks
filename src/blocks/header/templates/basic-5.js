/**
 * Template: Off Canvas Header 1
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_autoTransparentSpacing: '1',
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
	_kad_header_backgroundSticky: {
		color: 'palette7',
		image: '',
		imageID: '',
		position: 'center center',
		size: 'cover',
		repeat: 'no-repeat',
		attachment: 'scroll',
		type: 'normal',
		gradient: '',
	},
	_kad_header_isSticky: '1',
	_kad_header_isTransparent: '1',
	_kad_header_backgroundTransparent: {
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
};

function innerBlocks() {
	return [
		createBlock('kadence/header', {}, [
			createBlock('kadence/header-container-desktop', { uniqueID: '10_968ead-cb' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_6f786b-b4',
						location: 'top',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_5d5bd7-54',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_d39fd1-a7',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_7baf4f-a5',
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
								uniqueID: '10_9f5235-b5',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_d73ff1-09',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_3ebdce-3a',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_1ffa87-b2',
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
						uniqueID: '10_888396-50',
						location: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_e536f1-8a',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '10_e34255-d3', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/image',
											{
												sizeSlug: 'full',
												linkDestination: 'none',
												uniqueID: '10_8a74e4-3e',
												url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
											},
											[]
										),
									]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_4abf0b-c1',
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
								uniqueID: '10_849b5b-6b',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_56ebea-d1',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_0505fa-29',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_d0fad7-ea',
										location: 'right',
										metadata: { name: 'Right' },
									},
									[
										createBlock(
											'kadence/off-canvas-trigger',
											{
												uniqueID: '10_9d95b2-4b',
												iconColor: 'palette4',
												iconColorHover: 'palette4',
												iconBackgroundColor: 'palette7',
												iconBackgroundColorHover: 'palette7',
												padding: ['xxs', 'xxs', '0', 'xxs'],
												border: [
													{
														top: ['palette7', '', 1],
														right: ['palette7', '', 1],
														bottom: ['palette7', '', 1],
														left: ['palette7', '', 1],
														unit: 'px',
													},
												],
												borderHover: [
													{
														top: ['palette4', '', 1],
														right: ['palette4', '', 1],
														bottom: ['palette4', '', 1],
														left: ['palette4', '', 1],
														unit: 'px',
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
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_860f00-42',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_e4230b-35',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_f40ed0-0d',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_9e6fa9-7e',
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
								uniqueID: '10_6cf997-44',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '10_5e49ea-f5',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_16286d-e4',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '10_cebf42-fc',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '10_7339cb-dc' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '10_ff22b0-b9',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_40aa2f-05',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_c2473b-5d',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '10_689c72-5a',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[]
						),
					]
				),
				createBlock('kadence/header-row', { uniqueID: '10_f501f7-a6', metadata: { name: 'Middle Row' } }, [
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_0d66dd-55',
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
									uniqueID: '10_015386-a1',
									url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
								},
								[]
							),
						]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_d71e8e-0c',
							location: 'tablet-center',
							metadata: { name: 'Center' },
						},
						[]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_7f6a43-63',
							location: 'tablet-right',
							metadata: { name: 'Right' },
						},
						[
							createBlock(
								'kadence/off-canvas-trigger',
								{
									uniqueID: '10_d85126-03',
									iconSizeTablet: 25,
									iconColorTablet: 'palette4',
									iconColorHoverTablet: 'palette4',
									iconBackgroundColorTablet: 'palette7',
									iconBackgroundColorHoverTablet: 'palette7',
									paddingTablet: ['xxs', 'xxs', '0', 'xxs'],
									borderTablet: [
										{
											top: ['palette7', '', 1],
											right: ['palette7', '', 1],
											bottom: ['palette7', '', 1],
											left: ['palette7', '', 1],
											unit: '',
										},
									],
									borderHoverTablet: [
										{
											top: ['palette4', '', 1],
											right: ['palette4', '', 1],
											bottom: ['palette4', '', 1],
											left: ['palette4', '', 1],
											unit: '',
										},
									],
									borderRadiusTablet: [3, 3, 3, 3],
								},
								[]
							),
						]
					),
				]),
				createBlock('kadence/header-row', { uniqueID: '10_8bc98d-52', metadata: { name: 'Bottom Row' } }, [
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_68494a-b5',
							location: 'tablet-left',
							metadata: { name: 'Left' },
						},
						[]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_8716fa-e6',
							location: 'tablet-center',
							metadata: { name: 'Center' },
						},
						[]
					),
					createBlock(
						'kadence/header-column',
						{
							uniqueID: '10_984f70-75',
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
					uniqueID: '10_146ae3-9e',
					slideFrom: 'right',
					widthType: 'full',
					containerMaxWidthTablet: 400,
					backgroundColor: 'palette3',
					paddingTablet: ['xl', 'xl', 'xl', 'xl'],
					hAlign: 'center',
					hAlignTablet: 'center',
					vAlign: 'center',
					vAlignTablet: 'center',
					closeIconSizeTablet: 25,
					closeIconColor: 'palette7',
					closeIconColorTablet: 'palette9',
					closeIconColorHover: 'palette9',
					closeIconColorHoverTablet: 'palette9',
					closeIconBackgroundColorTablet: 'palette3',
					closeIconBackgroundColorHoverTablet: 'palette3',
				},
				[createBlock('kadence/navigation', { uniqueID: '10_d18939-76', templateKey: 'short' }, [])]
			),
		]),
	];
}

export { postMeta, innerBlocks };
