/**
 * Template: Multi-row 1
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_flex: {
		direction: ['horizontal', '', ''],
		justifyContent: ['', '', ''],
		verticalAlignment: ['', '', ''],
	},
	_kad_header_width: ['100', '', ''],
	_kad_header_widthUnit: '%',
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
			createBlock('kadence/header-container-desktop', { uniqueID: '8_be1909-97' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_fb6ba9-c7',
						location: 'top',
						background: {
							color: 'palette5',
							image: '',
							imageID: '',
							position: 'center center',
							size: 'cover',
							repeat: 'no-repeat',
							attachment: 'scroll',
							type: 'normal',
							gradient: '',
						},
						padding: ['xxs', 'lg', 'xxs', 'lg'],
						maxWidth: 100,
						maxWidthUnit: '%',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_d2e513-f1',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_c7bab4-ae',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_98e105-62',
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
								uniqueID: '8_5e39ab-6d',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[
								createBlock(
									'kadence/advancedheading',
									{
										uniqueID: '8_5a3063-13',
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
								uniqueID: '8_075bea-3c',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_aee3ed-ff',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_0d7d29-c6',
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
						uniqueID: '8_d388a8-e5',
						location: 'center',
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
						border: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['palette6', '', 1],
								left: ['', '', ''],
								unit: 'px',
							},
						],
						padding: ['md', 'lg', 'md', 'lg'],
						maxWidth: 100,
						maxWidthUnit: '%',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_be8cc6-77',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_38eca9-c2', location: 'left', metadata: { name: 'Left' } },
									[
										createBlock(
											'kadence/image',
											{
												sizeSlug: 'full',
												linkDestination: 'none',
												uniqueID: '8_7ceea4-52',
												imageFilter: 'mayfair',
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
										uniqueID: '8_b251bb-58',
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
								uniqueID: '8_632700-11',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[createBlock('kadence/navigation', { uniqueID: '8_35dcc4-2a', templateKey: 'long' }, [])]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_e4e150-77',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_0340ee-76',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_5fd0c2-12', location: 'right', metadata: { name: 'Right' } },
									[
										createBlock(
											'kadence/icon',
											{
												uniqueID: '8_bb80f7-d7',
												gap: ['xs', '', ''],
											},
											[
												createBlock(
													'kadence/single-icon',
													{
														uniqueID: '8_6bac87-03',
														icon: 'fa_facebook-n',
														link: '#',
														size: 15,
														title: 'Facebook',
														color: 'palette9',
														background: 'palette6',
														borderRadius: 50,
														borderWidth: 0,
														padding: [5, 5, 5, 5],
														style: 'stacked',
														margin: ['0', '0', '0', '0'],
														hColor: 'palette9',
														hBackground: 'palette6',
													},
													[]
												),
												createBlock(
													'kadence/single-icon',
													{
														uniqueID: '8_db3174-41',
														icon: 'fa_instagram',
														link: '#',
														size: 15,
														title: 'Instagram',
														color: 'palette9',
														background: 'palette6',
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
														uniqueID: '8_311e14-91',
														icon: 'fa_youtube',
														link: '#',
														size: 15,
														title: 'Youtube',
														color: 'palette9',
														background: 'palette6',
														borderRadius: 50,
														borderWidth: 0,
														padding: [5, 5, 5, 5],
														style: 'stacked',
														hColor: 'palette9',
														hBackground: 'palette6',
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
						uniqueID: '8_b09dc6-18',
						location: 'bottom',
						layout: 'fullwidth',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_7de42f-2f',
								location: 'left',
								metadata: { name: 'Left Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_7dbebb-81',
										location: 'left',
										metadata: { name: 'Left' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_1834be-97',
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
								uniqueID: '8_3f128f-1f',
								location: 'center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-section',
							{
								uniqueID: '8_2d5b36-24',
								location: 'right',
								metadata: { name: 'Right Section' },
							},
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_8899ea-8c',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_cb717b-da',
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
			createBlock('kadence/header-container-tablet', { uniqueID: '8_729ba9-a5' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_3207a2-2f',
						location: 'top',
						layout: 'fullwidth',
						background: {
							color: 'palette5',
							image: '',
							imageID: '',
							position: 'center center',
							size: 'cover',
							repeat: 'no-repeat',
							attachment: 'scroll',
							type: 'normal',
							gradient: '',
						},
						minHeightTablet: 2,
						minHeightUnit: 'em',
						vAlignTablet: 'center',
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_03edf6-99',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_a6dc83-53',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[
								createBlock(
									'kadence/advancedheading',
									{
										uniqueID: '8_182396-02',
										align: 'center',
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
										fontSize: ['', 'sm', ''],
										fontHeight: ['', 2, ''],
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_61399c-38',
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
						uniqueID: '8_057f8b-cf',
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
						minHeightUnit: 'em',
						vAlignTablet: 'center',
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_fd0621-82', location: 'tablet-left', metadata: { name: 'Left' } },
							[
								createBlock(
									'kadence/image',
									{
										imgMaxWidthTablet: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '8_6b72dc-6d',
										marginTablet: ['sm', '', 'sm', ''],
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
								uniqueID: '8_04c9c7-f1',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_f7b5df-47',
								location: 'tablet-right',
								metadata: { name: 'Right' },
							},
							[
								createBlock(
									'kadence/off-canvas-trigger',
									{ uniqueID: '8_cd4c25-4c', iconSizeTablet: 20 },
									[]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_123946-0b',
						location: 'bottom',
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_dd9a1d-70',
								location: 'tablet-left',
								metadata: { name: 'Left' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_803649-37',
								location: 'tablet-center',
								metadata: { name: 'Center' },
							},
							[]
						),
						createBlock(
							'kadence/header-column',
							{
								uniqueID: '8_6d893f-e0',
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
					uniqueID: '8_8696e1-1b',
					slideFrom: 'right',
					backgroundColorTablet: 'palette3',
					hAlignTablet: 'center',
					vAlignTablet: 'center',
					closeIconSizeTablet: 20,
					closeIconColorTablet: 'palette9',
				},
				[createBlock('kadence/navigation', { uniqueID: '8_6cd84d-ff', templateKey: 'long-vertical' }, [])]
			),
		]),
	];
}

export { postMeta, innerBlocks };
