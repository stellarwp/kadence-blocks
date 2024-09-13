/**
 * Template: Mega Menu 2 (free)
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock(
			'kadence/rowlayout',
			{
				uniqueID: '356_64edcb-b5',
				columns: 6,
				tabletLayout: 'three-grid',
				mobileRowGutter: 'none',
				customRowGutter: ['', '', 0],
				columnGutter: 'skinny',
				customGutter: [16, '', ''],
				colLayout: 'equal',
				columnsInnerHeight: true,
				borderRadius: [6, 6, 6, 6],
				inheritMaxWidth: true,
				align: '',
				padding: ['0', 'xs', '0', '0'],
				mobilePadding: ['md', 'md', '', 'md'],
				templateLock: false,
				kbVersion: 2,
			},
			[
				createBlock(
					'kadence/column',
					{
						background: 'palette7',
						borderWidth: ['', '', '', ''],
						uniqueID: '356_196251-23',
						textAlign: ['', '', 'center'],
						direction: ['', '', 'vertical'],
						justifyContent: ['', '', 'center'],
						rowGap: [10, 16, 0],
						rowGapVariable: ['', '', 'none'],
						verticalAlignment: 'middle',
						verticalAlignmentMobile: 'middle',
						padding: ['sm', 'sm', 'sm', 'sm'],
						tabletPadding: ['', '', 'sm', ''],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/image',
							{
								align: 'center',
								imgMaxWidth: '',
								imgMaxWidthMobile: '',
								sizeSlug: 'full',
								linkDestination: 'none',
								uniqueID: '356_966520-f4',
								globalAlt: true,
								url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/gray.png',
							},
							[]
						),
						createBlock(
							'kadence/navigation-link',
							{
								uniqueID: '356_6ed1df-cc',
								label: 'New Arrivals',
								url: 'New%20Arrivals',
								kind: 'custom',
							},
							[]
						),
						createBlock(
							'kadence/navigation-link',
							{
								uniqueID: '356_754bd9-ff',
								label: 'Best Sellers',
								url: 'Best%20Sellers',
								kind: 'custom',
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
						uniqueID: '356_162b49-5e',
						direction: ['', '', 'horizontal'],
						justifyContent: ['', '', 'center'],
						gutter: ['', '', 0],
						gutterVariable: ['', '', 'none'],
						rowGap: [10, '', 0],
						rowGapVariable: ['', '', 'none'],
						verticalAlignmentMobile: 'middle',
						padding: ['xs', '', 'xs', ''],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/image',
							{
								imgMaxWidthMobile: 75,
								sizeSlug: 'large',
								ratio: 'square',
								useRatio: true,
								linkDestination: 'none',
								uniqueID: '356_c78042-04',
								globalAlt: true,
								url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/gray.png',
							},
							[]
						),
						createBlock(
							'kadence/navigation-link',
							{
								uniqueID: '356_a30122-0e',
								label: 'Women',
								url: 'Women',
								kind: 'custom',
								typography: [
									{
										size: [16, '', ''],
										sizeType: 'px',
										lineHeight: ['', '', ''],
										lineType: '',
										letterSpacing: [1, '', ''],
										letterType: 'px',
										textTransform: 'uppercase',
										family: '',
										google: '',
										style: '',
										weight: 'bold',
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
				createBlock(
					'kadence/column',
					{
						id: 2,
						borderWidth: ['', '', '', ''],
						uniqueID: '356_4fdb6e-9f',
						direction: ['', '', 'horizontal'],
						justifyContent: ['', '', 'center'],
						gutter: ['', '', 0],
						gutterVariable: ['', '', 'none'],
						rowGap: [10, 16, 0],
						rowGapVariable: ['', '', 'none'],
						verticalAlignmentMobile: 'middle',
						padding: ['xs', '', 'xs', ''],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/image',
							{
								imgMaxWidthMobile: 75,
								sizeSlug: 'large',
								ratio: 'square',
								useRatio: true,
								linkDestination: 'none',
								uniqueID: '356_fb70e2-00',
								globalAlt: true,
								url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/gray.png',
							},
							[]
						),
						createBlock(
							'kadence/navigation-link',
							{
								uniqueID: '356_8dd1df-5c',
								label: 'Children',
								url: 'Children',
								kind: 'custom',
								padding: ['0', '0', '0', '0'],
								typography: [
									{
										size: [16, '', ''],
										sizeType: 'px',
										lineHeight: ['', '', ''],
										lineType: '',
										letterSpacing: [1, '', ''],
										letterType: 'px',
										textTransform: 'uppercase',
										family: '',
										google: '',
										style: '',
										weight: 'bold',
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
				createBlock(
					'kadence/column',
					{
						id: 2,
						borderWidth: ['', '', '', ''],
						uniqueID: '356_a26c05-fc',
						direction: ['', '', 'horizontal'],
						justifyContent: ['', '', 'center'],
						gutter: ['', '', 0],
						gutterVariable: ['', '', 'none'],
						rowGap: [10, 64, 0],
						rowGapVariable: ['', '', 'none'],
						verticalAlignmentMobile: 'middle',
						padding: ['xs', '', 'xs', ''],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/image',
							{
								imgMaxWidthMobile: 75,
								sizeSlug: 'large',
								ratio: 'square',
								useRatio: true,
								linkDestination: 'none',
								uniqueID: '356_38c2f8-eb',
								globalAlt: true,
								url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/gray.png',
							},
							[]
						),
						createBlock(
							'kadence/navigation-link',
							{
								uniqueID: '356_1deae2-98',
								label: 'Men',
								url: 'Men',
								kind: 'custom',
								typography: [
									{
										size: [16, '', ''],
										sizeType: 'px',
										lineHeight: ['', '', ''],
										lineType: '',
										letterSpacing: [1, '', ''],
										letterType: 'px',
										textTransform: 'uppercase',
										family: '',
										google: '',
										style: '',
										weight: 'bold',
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
				createBlock(
					'kadence/column',
					{
						id: 2,
						borderWidth: ['', '', '', ''],
						uniqueID: '356_12ad71-7d',
						direction: ['', '', 'horizontal'],
						justifyContent: ['', '', 'center'],
						gutter: ['', '', 0],
						gutterVariable: ['', '', 'none'],
						rowGap: [10, '', 0],
						rowGapVariable: ['', '', 'none'],
						verticalAlignmentMobile: 'middle',
						padding: ['xs', '', 'xs', ''],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/image',
							{
								imgMaxWidthMobile: 75,
								sizeSlug: 'large',
								ratio: 'square',
								useRatio: true,
								linkDestination: 'none',
								uniqueID: '356_97546e-4e',
								globalAlt: true,
								url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/gray.png',
							},
							[]
						),
						createBlock(
							'kadence/navigation-link',
							{
								uniqueID: '356_dc2bce-56',
								label: 'Accessories',
								url: 'Men',
								kind: 'custom',
								typography: [
									{
										size: [16, '', ''],
										sizeType: 'px',
										lineHeight: ['', '', ''],
										lineType: '',
										letterSpacing: [1, '', ''],
										letterType: 'px',
										textTransform: 'uppercase',
										family: '',
										google: '',
										style: '',
										weight: 'bold',
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
				createBlock(
					'kadence/column',
					{
						id: 2,
						borderWidth: ['', '', '', ''],
						uniqueID: '356_b1ced8-77',
						direction: ['', '', 'horizontal'],
						justifyContent: ['', '', 'center'],
						gutter: ['', '', 0],
						gutterVariable: ['', '', 'none'],
						rowGap: [10, '', 0],
						rowGapVariable: ['', '', 'none'],
						verticalAlignmentMobile: 'middle',
						padding: ['xs', '', 'xs', ''],
						kbVersion: 2,
					},
					[
						createBlock(
							'kadence/image',
							{
								imgMaxWidthMobile: 75,
								sizeSlug: 'large',
								ratio: 'square',
								useRatio: true,
								linkDestination: 'none',
								uniqueID: '356_ed3c5b-d1',
								globalAlt: true,
								url: '/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/gray.png',
							},
							[]
						),
						createBlock(
							'kadence/navigation-link',
							{
								uniqueID: '356_2084d3-fc',
								label: 'Sale',
								url: 'Men',
								kind: 'custom',
								typography: [
									{
										size: [16, '', ''],
										sizeType: 'px',
										lineHeight: ['', '', ''],
										lineType: '',
										letterSpacing: [1, '', ''],
										letterType: 'px',
										textTransform: 'uppercase',
										family: '',
										google: '',
										style: '',
										weight: 'bold',
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
	];
}

export { postMeta, innerBlocks };
