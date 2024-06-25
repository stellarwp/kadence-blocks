/**
 * Template: Multi-Row 5
 * Post Type: kadence_header
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_header_typography: {
		color: '',
		size: ['', '', ''],
		sizeType: 'px',
		lineHeight: ['', '', ''],
		lineType: '',
		letterSpacing: ['', '', ''],
		letterType: 'px',
		textTransform: '',
		family: '',
		google: false,
		style: '',
		weight: '400',
		variant: '',
		subset: '',
		loadGoogle: true,
	},
};

function innerBlocks() {
	return [
		createBlock('kadence/header', {}, [
			createBlock('kadence/header-container-desktop', { uniqueID: '8_eac20d-0e' }, [
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_01e9d8-55',
						location: 'top',
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
						border: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['#cbd7eb', '', 1],
								left: ['', '', ''],
								unit: 'px',
							},
						],
						padding: ['sm', 'xs', 'xs', 'xs'],
						metadata: { name: 'Top Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_cb0e82-52', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_0ea44e-76', location: 'left', metadata: { name: 'Left' } },
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_338fd5-28',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_ca4eb9-b0', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/image',
									{
										align: 'center',
										imgMaxWidth: 80,
										sizeSlug: 'full',
										linkDestination: 'none',
										uniqueID: '8_7c4342-4e',
										url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/logo-dark.png',
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_91ea52-93', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_bdba40-3e',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_299831-a6', location: 'right', metadata: { name: 'Right' } },
									[]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_591a9a-34',
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
						padding: ['xxs', 'xxs', 'xxs', 'xxs'],
						metadata: { name: 'Middle Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_4bafef-da', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_b1e937-75', location: 'left', metadata: { name: 'Left' } },
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_49423f-ae',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_2dfff2-71', location: 'center', metadata: { name: 'Center' } },
							[createBlock('kadence/navigation', { uniqueID: '8_bed1fc-74' }, [])]
						),
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_b61893-ea', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_f335de-3d',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_299a6e-3e', location: 'right', metadata: { name: 'Right' } },
									[]
								),
							]
						),
					]
				),
				createBlock(
					'kadence/header-row',
					{
						uniqueID: '8_e847b2-fd',
						location: 'bottom',
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
						padding: ['', '', 'sm', ''],
						metadata: { name: 'Bottom Row' },
					},
					[
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_d03b94-a6', location: 'left', metadata: { name: 'Left Section' } },
							[
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_3146f7-fe', location: 'left', metadata: { name: 'Left' } },
									[]
								),
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_de2b33-4d',
										location: 'center-left',
										metadata: { name: 'Center Left' },
									},
									[]
								),
							]
						),
						createBlock(
							'kadence/header-column',
							{ uniqueID: '8_f67b49-32', location: 'center', metadata: { name: 'Center' } },
							[
								createBlock(
									'kadence/advancedheading',
									{
										uniqueID: '8_b2c27e-57',
										typography: 'var( --global-heading-font-family, inherit )',
										fontWeight: '900',
										fontStyle: 'italic',
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
										htmlTag: 'div',
										fontSize: ['md', '', ''],
										fontHeight: [2.1000000000000001, '', ''],
										fontHeightType: 'em',
										icon: 'ic_wrench',
									},
									[]
								),
								createBlock('kadence/navigation', { uniqueID: '8_8962b2-f4' }, []),
							]
						),
						createBlock(
							'kadence/header-section',
							{ uniqueID: '8_92e755-23', location: 'right', metadata: { name: 'Right Section' } },
							[
								createBlock(
									'kadence/header-column',
									{
										uniqueID: '8_26ce2a-22',
										location: 'center-right',
										metadata: { name: 'Center Right' },
									},
									[]
								),
								createBlock(
									'kadence/header-column',
									{ uniqueID: '8_144dd9-dc', location: 'right', metadata: { name: 'Right' } },
									[]
								),
							]
						),
					]
				),
			]),
			createBlock('kadence/header-container-tablet', { uniqueID: '8_c1d23d-cd' }, [
				createBlock('kadence/header-row', { uniqueID: '8_a9c2dc-41', metadata: { name: 'Top Row' } }, [
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_8c9896-8d', location: 'tablet-left', metadata: { name: 'Left' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_2b878a-1d', metadata: { name: 'Center' }, location: 'tablet-center' },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_46c129-e2', location: 'tablet-right', metadata: { name: 'Right' } },
						[]
					),
				]),
				createBlock('kadence/header-row', { uniqueID: '8_9f31c1-da', metadata: { name: 'Middle Row' } }, [
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_b83edd-1e', location: 'tablet-left', metadata: { name: 'Left' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_b459e0-e6', metadata: { name: 'Center' }, location: 'tablet-center' },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_ba9b38-48', location: 'tablet-right', metadata: { name: 'Right' } },
						[]
					),
				]),
				createBlock('kadence/header-row', { uniqueID: '8_73e416-36', metadata: { name: 'Bottom Row' } }, [
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_d0ef5c-c5', location: 'tablet-left', metadata: { name: 'Left' } },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_b7d315-57', metadata: { name: 'Center' }, location: 'tablet-center' },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ uniqueID: '8_33f42a-11', location: 'tablet-right', metadata: { name: 'Right' } },
						[]
					),
				]),
			]),
			createBlock('kadence/off-canvas', { uniqueID: '8_0cbe19-86' }, [
				createBlock('core/paragraph', { placeholder: 'Create Awesome' }, []),
			]),
		]),
	];
}

export { postMeta, innerBlocks };
