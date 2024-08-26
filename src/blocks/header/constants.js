import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

export const HEADER_INNERBLOCK_DEFAULTS = [
	createBlock('kadence/header-container-desktop', {}, [
		createBlock('kadence/header-row', { metadata: { name: __('Top Row', 'kadence-blocks') }, location: 'top' }, [
			createBlock(
				'kadence/header-section',
				{ metadata: { name: __('Left Section', 'kadence-blocks') }, location: 'left' },
				[
					createBlock(
						'kadence/header-column',
						{ metadata: { name: __('Left', 'kadence-blocks') }, location: 'left' },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ metadata: { name: __('Center Left', 'kadence-blocks') }, location: 'center-left' },
						[]
					),
				]
			),
			createBlock('kadence/header-column', {
				metadata: { name: __('Center', 'kadence-blocks') },
				location: 'center',
			}),
			createBlock(
				'kadence/header-section',
				{ metadata: { name: __('Right Section', 'kadence-blocks') }, location: 'right' },
				[
					createBlock(
						'kadence/header-column',
						{ metadata: { name: __('Center Right', 'kadence-blocks') }, location: 'center-right' },
						[]
					),
					createBlock(
						'kadence/header-column',
						{ metadata: { name: __('Right', 'kadence-blocks') }, location: 'right' },
						[]
					),
				]
			),
		]),
		createBlock(
			'kadence/header-row',
			{ metadata: { name: __('Middle Row', 'kadence-blocks') }, location: 'center' },
			[
				createBlock(
					'kadence/header-section',
					{ metadata: { name: __('Left Section', 'kadence-blocks') }, location: 'left' },
					[
						createBlock(
							'kadence/header-column',
							{ metadata: { name: __('Left', 'kadence-blocks') }, location: 'left' },
							[]
						),
						createBlock(
							'kadence/header-column',
							{ metadata: { name: __('Center Left', 'kadence-blocks') }, location: 'center-left' },
							[]
						),
					]
				),
				createBlock('kadence/header-column', {
					metadata: { name: __('Center', 'kadence-blocks') },
					location: 'center',
				}),
				createBlock(
					'kadence/header-section',
					{ metadata: { name: __('Right Section', 'kadence-blocks') }, location: 'right' },
					[
						createBlock(
							'kadence/header-column',
							{ metadata: { name: __('Center Right', 'kadence-blocks') }, location: 'center-right' },
							[]
						),
						createBlock(
							'kadence/header-column',
							{ metadata: { name: __('Right', 'kadence-blocks') }, location: 'right' },
							[]
						),
					]
				),
			]
		),
		createBlock(
			'kadence/header-row',
			{ metadata: { name: __('Bottom Row', 'kadence-blocks') }, location: 'bottom' },
			[
				createBlock(
					'kadence/header-section',
					{ metadata: { name: __('Left Section', 'kadence-blocks') }, location: 'left' },
					[
						createBlock(
							'kadence/header-column',
							{ metadata: { name: __('Left', 'kadence-blocks') }, location: 'left' },
							[]
						),
						createBlock(
							'kadence/header-column',
							{ metadata: { name: __('Center Left', 'kadence-blocks') }, location: 'center-left' },
							[]
						),
					]
				),
				createBlock('kadence/header-column', {
					metadata: { name: __('Center', 'kadence-blocks') },
					location: 'center',
				}),
				createBlock(
					'kadence/header-section',
					{ metadata: { name: __('Right Section', 'kadence-blocks') }, location: 'right' },
					[
						createBlock(
							'kadence/header-column',
							{ metadata: { name: __('Center Right', 'kadence-blocks') }, location: 'center-right' },
							[]
						),
						createBlock(
							'kadence/header-column',
							{ metadata: { name: __('Right', 'kadence-blocks') }, location: 'right' },
							[]
						),
					]
				),
			]
		),
	]),
	createBlock('kadence/header-container-tablet', {}, [
		createBlock('kadence/header-row', { metadata: { name: __('Top Row', 'kadence-blocks') }, location: 'top' }, [
			createBlock(
				'kadence/header-column',
				{ metadata: { name: __('Left', 'kadence-blocks') }, location: 'tablet-left' },
				[]
			),
			createBlock(
				'kadence/header-column',
				{ metadata: { name: __('Center', 'kadence-blocks') }, location: 'tablet-center' },
				[]
			),
			createBlock(
				'kadence/header-column',
				{ metadata: { name: __('Right', 'kadence-blocks') }, location: 'tablet-right' },
				[]
			),
		]),
		createBlock(
			'kadence/header-row',
			{ metadata: { name: __('Middle Row', 'kadence-blocks') }, location: 'center' },
			[
				createBlock(
					'kadence/header-column',
					{ metadata: { name: __('Left', 'kadence-blocks') }, location: 'tablet-left' },
					[]
				),
				createBlock(
					'kadence/header-column',
					{ metadata: { name: __('Center', 'kadence-blocks') }, location: 'tablet-center' },
					[]
				),
				createBlock(
					'kadence/header-column',
					{ metadata: { name: __('Right', 'kadence-blocks') }, location: 'tablet-right' },
					[]
				),
			]
		),
		createBlock(
			'kadence/header-row',
			{ metadata: { name: __('Bottom Row', 'kadence-blocks') }, location: 'bottom' },
			[
				createBlock(
					'kadence/header-column',
					{ metadata: { name: __('Left', 'kadence-blocks') }, location: 'tablet-left' },
					[]
				),
				createBlock(
					'kadence/header-column',
					{ metadata: { name: __('Center', 'kadence-blocks') }, location: 'tablet-center' },
					[]
				),
				createBlock(
					'kadence/header-column',
					{ metadata: { name: __('Right', 'kadence-blocks') }, location: 'tablet-right' },
					[]
				),
			]
		),
	]),
	createBlock('kadence/off-canvas', {}, []),
];

export const HEADER_ALLOWED_BLOCKS = [
	'kadence/header-container-desktop',
	'kadence/header-container-tablet',
	'kadence/header-row',
	'kadence/header-column',
	'kadence/off-canvas',
];
