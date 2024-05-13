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
			opacity: 0.20000000000000001,
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
			createBlock('kadence/header-container-desktop', { uniqueID: '8_dcfe32-61' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_c03f33-d7',
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
							{ uniqueID: '8_a0a2a0-bf', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_0e527f-63', location: 'left', metadata: { name: 'Left' } },
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_56ac77-3d',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_ca797e-13', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/advancedheading',
									{
										uniqueID: '8_878588-fc',
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
							{ uniqueID: '8_f20182-15', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_c76184-82',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_07690d-fa', location: 'right', metadata: { name: 'Right' } },
									[]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_693740-f9',
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
							{ uniqueID: '8_409ffa-a4', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_b9a7ac-84', location: 'left', metadata: { name: 'Left' } },
									[createBlock('kadence/navigation', { uniqueID: '8_a14bfe-58' }, [])]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_69c280-8d',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_acdd0e-cb', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/image',
									{
										align: 'center',
										imgMaxWidth: 100,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '8_52d144-f3',
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_328ae2-4f', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_356866-d4',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_e8fbc9-9c', location: 'right', metadata: { name: 'Right' } },
									[
										createBlock('kadence/icon', { uniqueID: '8_60dbbb-24', gap: ['md', '', ''] }, [
											createBlock(
												'kadence/single-icon',
												{
													uniqueID: '8_5bfbdf-42',
													icon: 'fas_search',
													size: 20,
													color: 'palette5',
													margin: ['', 'md', '', ''],
													hColor: 'palette3',
												},
												[]
											),
										]),
										createBlock(
											'kadence/advancedbtn',
											{ hAlign: 'left', uniqueID: '8_394702-b0' },
											[
												createBlock(
													'kadence/singlebtn',
													{
														uniqueID: '8_1251d6-e7',
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
					{ uniqueID: '8_885c65-f9', location: 'bottom', metadata: { name: 'Bottom Row' } },
					[
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_8f5435-63', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_a42dda-2c', location: 'left', metadata: { name: 'Left' } },
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_dcf40e-2f',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_fdc00e-2c', location: 'center', metadata: { name: 'Center' } },
							[]
						),
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_8eee78-44', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_1dfe15-55',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_3d1bab-a2', location: 'right', metadata: { name: 'Right' } },
									[]
								),
							]
						),
					]
				),
			]),
			createBlock('kadence/header-container-tablet', { uniqueID: '8_cfd599-d0' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_7ffdea-ed',
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
							{ uniqueID: '8_406d8e-2e', location: 'tablet-left', metadata: { name: 'Left' } },
							[]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_0310f3-16', metadata: { name: 'Center', location: 'tablet-center' } },
							[]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_961016-9f', location: 'tablet-right', metadata: { name: 'Right' } },
							[]
						),
					]
				),
				createBlock('kadence/header-row', { uniqueID: '8_9b39c4-3f', metadata: { name: 'Middle Row' } }, [
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_0fdcfe-0c', location: 'tablet-left', metadata: { name: 'Left' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_a7ffd1-20', metadata: { name: 'Center', location: 'tablet-center' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_1d54d5-ce', location: 'tablet-right', metadata: { name: 'Right' } },
						[]
					),
				]),
				createBlock('kadence/header-row', { uniqueID: '8_5a4f2b-36', metadata: { name: 'Bottom Row' } }, [
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_a64ac6-5e', location: 'tablet-left', metadata: { name: 'Left' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_bdebb8-da', metadata: { name: 'Center', location: 'tablet-center' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_d49469-22', location: 'tablet-right', metadata: { name: 'Right' } },
						[]
					),
				]),
			]),
			createBlock('kadence/off-canvas', { uniqueID: '8_a8a561-62' }, [
				createBlock('core/paragraph', { placeholder: 'Create Awesome' }, []),
			]),
		]),
	];
}

export { postMeta, innerBlocks };
