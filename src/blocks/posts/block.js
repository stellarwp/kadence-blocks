/**
 * BLOCK: Kadence Latest Posts
 *
 * Registering a block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from './icon';

import classnames from 'classnames';
/**
 * Import Css
 */
import './editor.scss';



import edit from './edit';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	registerBlockType,
	createBlock,
	getBlockDefaultClassName,
} = wp.blocks;
const {
	Fragment,
} = wp.element;
const {
	RichText,
	getColorClassName,
} = wp.blockEditor;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/posts', {
	title: __( 'Posts', 'kadence-blocks' ),
	icon: {
		src: icons.block,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'latest posts', 'kadence-blocks' ),
		__( 'blog', 'kadence-blocks' ),
		'KB',
	],
	supports: {
		html: false,
		//align: [ 'left', 'right', 'center' ],
	},
	attributes: {
		uniqueID: {
			type: 'string',
		},
		columns: {
			type: 'number',
			default: 3,
		},
		postsToShow: {
			type: 'number',
			default: 6,
		},
		offsetQuery: {
			type: 'number',
			default: 0,
		},
		allowSticky: {
			type: 'bool',
			default: false,
		},
		postType: {
			type: 'string',
			default: 'post',
		},
		postTax: {
			type: 'bool',
			default: false,
		},
		taxType: {
			type: 'string',
			default: '',
		},
		order: {
			type: 'string',
			default: 'desc',
		},
		orderBy: {
			type: 'string',
			default: 'date',
		},
		excludeTax: {
			type: 'string',
			default: 'include',
		},
		categories: {
			type: 'array',
			default: [],
		},
		tags: {
			type: 'array',
			default: [],
		},
		alignImage: {
			type: 'string',
			default: 'beside',
		},
		image: {
			type: 'bool',
			default: true,
		},
		imageSize: {
			type: 'string',
			default: 'medium_large',
		},
		imageRatio: {
			type: 'string',
			default: '2-3',
		},
		aboveCategories: {
			type: 'bool',
			default: true,
		},
		categoriesDivider: {
			type: 'string',
			default: 'vline',
		},
		categoriesStyle: {
			type: 'string',
			default: 'normal',
		},
		meta: {
			type: 'bool',
			default: true,
		},
		metaDivider: {
			type: 'string',
			default: 'dot',
		},
		author: {
			type: 'bool',
			default: true,
		},
		authorImage: {
			type: 'bool',
			default: false,
		},
		authorImageSize: {
			type: 'number',
			default: 25,
		},
		authorEnabledLabel: {
			type: 'bool',
			default: true,
		},
		authorLabel: {
			type: 'string',
			default: '',
		},
		date: {
			type: 'bool',
			default: true,
		},
		dateEnabledLabel: {
			type: 'bool',
			default: false,
		},
		dateLabel: {
			type: 'string',
			default: '',
		},
		dateUpdated: {
			type: 'bool',
			default: false,
		},
		dateUpdatedEnabledLabel: {
			type: 'bool',
			default: false,
		},
		dateUpdatedLabel: {
			type: 'string',
			default: '',
		},
		metaCategories: {
			type: 'bool',
			default: false,
		},
		metaCategoriesEnabledLabel: {
			type: 'bool',
			default: false,
		},
		metaCategoriesLabel: {
			type: 'string',
			default: '',
		},
		comments: {
			type: 'bool',
			default: false,
		},
		excerpt: {
			type: 'bool',
			default: true,
		},
		excerptCustomLength: {
			type: 'bool',
			default: false,
		},
		excerptLength: {
			type: 'number',
			default: 40,
		},
		readmore: {
			type: 'bool',
			default: true,
		},
		readmoreLabel: {
			type: 'string',
			default: '',
		},
		loopStyle: {
			type: 'string',
			default: 'boxed',
		},
		titleFont: {
			type: 'array',
			default: [ {
				level: 2,
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: [ '', '', '' ],
				letterType: 'px',
				textTransform: '',
			} ],
		},
		tabletColumns: {
			type: 'number',
		},
		mobileColumns: {
			type: 'number',
		},
		showUnique: {
			type: 'bool',
			default: false,
		},
	},
	edit,
	save() {
		return null;
	},
} );
