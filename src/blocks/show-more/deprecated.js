/**
 * BLOCK: Kadence Show More Block
 */

/**
 * Import External
 */
import classnames from 'classnames';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * Deprecated versions of the Show More block save function.
 * Each entry represents a previous version of the block.
 */
export default [
	{
		attributes: {
			align: {
				type: 'string',
			},
			id: {
				type: 'number',
			},
			uniqueID: {
				type: 'string',
			},
			showHideMore: {
				type: 'boolean',
				default: true,
			},
			defaultExpandedMobile: {
				type: 'boolean',
				default: false,
			},
			defaultExpandedTablet: {
				type: 'boolean',
				default: false,
			},
			defaultExpandedDesktop: {
				type: 'boolean',
				default: false,
			},
			heightDesktop: {
				type: 'number',
				default: 250,
			},
			heightTablet: {
				type: 'number',
				default: '',
			},
			heightMobile: {
				type: 'number',
				default: '',
			},
			heightType: {
				type: 'string',
				default: 'px',
			},
			enableFadeOut: {
				type: 'boolean',
				default: false,
			},
			fadeOutSize: {
				type: 'number',
				default: 50,
			},
			marginDesktop: {
				type: 'array',
				default: ['', '', '', ''],
			},
			marginTablet: {
				type: 'array',
				default: ['', '', '', ''],
			},
			marginMobile: {
				type: 'array',
				default: ['', '', '', ''],
			},
			marginUnit: {
				type: 'string',
				default: 'px',
			},
			paddingDesktop: {
				type: 'array',
				default: ['', '', '', ''],
			},
			paddingTablet: {
				type: 'array',
				default: ['', '', '', ''],
			},
			paddingMobile: {
				type: 'array',
				default: ['', '', '', ''],
			},
			paddingUnit: {
				type: 'string',
				default: 'px',
			},
			inQueryBlock: {
				type: 'boolean',
				default: false,
			},
		},
		save: ({ attributes, innerBlocks }) => {
			const { uniqueID } = attributes;
			const classes = classnames({
				'kb-block-show-more-container': true,
				[`kb-block-show-more-container${uniqueID}`]: true,
			});

			return (
				<div {...useBlockProps.save({ className: classes })}>
					<InnerBlocks.Content />
				</div>
			);
		},
	},
];
