/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons';
import hexToRGBA from '../../hex-to-rgba';
/**
 * Import edit
 */
import edit from './edit';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	InnerBlocks,
} = wp.editor;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/column', {
	title: __( 'Column' ),
	icon: icons.blockColumn,
	category: 'kadence-blocks',
	parent: [ 'kadence/rowlayout' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
		},
		topPadding: {
			type: 'number',
			default: '',
		},
		bottomPadding: {
			type: 'number',
			default: '',
		},
		leftPadding: {
			type: 'number',
			default: '',
		},
		rightPadding: {
			type: 'number',
			default: '',
		},
		topPaddingM: {
			type: 'number',
			default: '',
		},
		bottomPaddingM: {
			type: 'number',
			default: '',
		},
		leftPaddingM: {
			type: 'number',
			default: '',
		},
		rightPaddingM: {
			type: 'number',
			default: '',
		},
		topMargin: {
			type: 'number',
			default: '',
		},
		bottomMargin: {
			type: 'number',
			default: '',
		},
		topMarginM: {
			type: 'number',
			default: '',
		},
		bottomMarginM: {
			type: 'number',
			default: '',
		},
		leftMargin: {
			type: 'number',
			default: '',
		},
		rightMargin: {
			type: 'number',
			default: '',
		},
		leftMarginM: {
			type: 'number',
			default: '',
		},
		rightMarginM: {
			type: 'number',
			default: '',
		},
		zIndex: {
			type: 'number',
			default: '',
		},
		background: {
			type: 'string',
			default: '',
		},
		backgroundOpacity: {
			type: 'number',
			default: 1,
		},
		border: {
			type: 'string',
			default: '',
		},
		borderOpacity: {
			type: 'number',
			default: 1,
		},
		borderWidth: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		borderRadius: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		uniqueID: {
			type: 'string',
			default: '',
		},
	},
	supports: {
		inserter: false,
		reusable: false,
		html: false,
	},
	edit,

	save( { attributes } ) {
		const { id, background, backgroundOpacity, uniqueID } = attributes;
		const backgroundString = ( background ? hexToRGBA( background, backgroundOpacity ) : undefined );
		return (
			<div className={ `inner-column-${ id } kadence-column${ uniqueID }` }>
				<div className={ 'kt-inside-inner-col' } style={ {
					background: backgroundString,
				} } >
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes: {
				id: {
					type: 'number',
					default: 1,
				},
				topPadding: {
					type: 'number',
					default: '',
				},
				bottomPadding: {
					type: 'number',
					default: '',
				},
				leftPadding: {
					type: 'number',
					default: '',
				},
				rightPadding: {
					type: 'number',
					default: '',
				},
				topPaddingM: {
					type: 'number',
					default: '',
				},
				bottomPaddingM: {
					type: 'number',
					default: '',
				},
				leftPaddingM: {
					type: 'number',
					default: '',
				},
				rightPaddingM: {
					type: 'number',
					default: '',
				},
				topMargin: {
					type: 'number',
					default: '',
				},
				bottomMargin: {
					type: 'number',
					default: '',
				},
				topMarginM: {
					type: 'number',
					default: '',
				},
				bottomMarginM: {
					type: 'number',
					default: '',
				},
				leftMargin: {
					type: 'number',
					default: '',
				},
				rightMargin: {
					type: 'number',
					default: '',
				},
				leftMarginM: {
					type: 'number',
					default: '',
				},
				rightMarginM: {
					type: 'number',
					default: '',
				},
				zIndex: {
					type: 'number',
					default: '',
				},
				background: {
					type: 'string',
					default: '',
				},
				backgroundOpacity: {
					type: 'number',
					default: 1,
				},
			},
			save: ( { attributes } ) => {
				const { id, background, backgroundOpacity } = attributes;
				const backgroundString = ( background ? hexToRGBA( background, backgroundOpacity ) : undefined );
				return (
					<div className={ `inner-column-${ id }` }>
						<div className={ 'kt-inside-inner-col' } style={ {
							background: backgroundString,
						} } >
							<InnerBlocks.Content />
						</div>
					</div>
				);
			},
		},
		{
			attributes: {
				id: {
					type: 'number',
					default: 1,
				},
			},
			save: ( { attributes } ) => {
				const { id } = attributes;
				return (
					<div className={ `inner-column-${ id }` }>
						<div className={ 'kt-inside-inner-col' } >
							<InnerBlocks.Content />
						</div>
					</div>
				);
			},
		},
		{
			attributes: {
				id: {
					type: 'number',
					default: 1,
				},
			},
			save: ( { attributes } ) => {
				const { id } = attributes;
				return (
					<div className={ `inner-column-${ id }` }>
						<InnerBlocks.Content />
					</div>
				);
			},
		},
	],
} );
