/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
} = wp.editor;
const {
	TabPanel,
	Dashicon,
	PanelBody,
	PanelColor,
	RangeControl,
} = wp.components;
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
	category: 'common',
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
	},
	edit: props => {
		const { attributes: { id, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM }, setAttributes } = props;
		const mobileControls = (
			<PanelBody
				title={ __( 'Mobile Padding/Margin' ) }
				initialOpen={ false }
			>
				<h2>{ __( 'Mobile Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topPaddingM }
					className="kt-icon-rangecontrol kt-top-padding"
					onChange={ ( value ) => {
						setAttributes( {
							topPaddingM: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightPaddingM }
					className="kt-icon-rangecontrol kt-right-padding"
					onChange={ ( value ) => {
						setAttributes( {
							rightPaddingM: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomPaddingM }
					className="kt-icon-rangecontrol kt-bottom-padding"
					onChange={ ( value ) => {
						setAttributes( {
							bottomPaddingM: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftPaddingM }
					className="kt-icon-rangecontrol kt-left-padding"
					onChange={ ( value ) => {
						setAttributes( {
							leftPaddingM: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<h2>{ __( 'Mobile Margin (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topMarginM }
					className="kt-icon-rangecontrol kt-top-margin"
					onChange={ ( value ) => {
						setAttributes( {
							topMarginM: value,
						} );
					} }
					min={ 0 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomMarginM }
					className="kt-icon-rangecontrol kt-bottom-margin"
					onChange={ ( value ) => {
						setAttributes( {
							bottomMarginM: value,
						} );
					} }
					min={ 0 }
					max={ 200 }
				/>
			</PanelBody>
		);
		const deskControls = (
			<PanelBody
				title={ __( 'Padding/Margin' ) }
				initialOpen={ true }
			>
				<h2>{ __( 'Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topPadding }
					className="kt-icon-rangecontrol kt-top-padding"
					onChange={ ( value ) => {
						setAttributes( {
							topPadding: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightPadding }
					className="kt-icon-rangecontrol kt-right-padding"
					onChange={ ( value ) => {
						setAttributes( {
							rightPadding: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomPadding }
					className="kt-icon-rangecontrol kt-bottom-padding"
					onChange={ ( value ) => {
						setAttributes( {
							bottomPadding: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftPadding }
					className="kt-icon-rangecontrol kt-left-padding"
					onChange={ ( value ) => {
						setAttributes( {
							leftPadding: value,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<h2>{ __( 'Margin (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ topMargin }
					className="kt-icon-rangecontrol kt-top-margin"
					onChange={ ( value ) => {
						setAttributes( {
							topMargin: value,
						} );
					} }
					min={ 0 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ bottomMargin }
					className="kt-icon-rangecontrol kt-bottom-margin"
					onChange={ ( value ) => {
						setAttributes( {
							bottomMargin: value,
						} );
					} }
					min={ 0 }
					max={ 200 }
				/>
			</PanelBody>
		);
		const tabControls = (
			<TabPanel className="kt-inspect-tabs"
				activeClass="active-tab"
				tabs={ [
					{
						name: 'desk',
						title: <Dashicon icon="desktop" />,
						className: 'kt-desk-tab',
					},
					{
						name: 'mobile',
						title: <Dashicon icon="smartphone" />,
						className: 'kt-mobile-tab',
					},
				] }>
				{
					( tabName ) => {
						let tabout;
						if ( 'mobile' === tabName ) {
							tabout = mobileControls;
						} else {
							tabout = deskControls;
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		return (
			<div className={ `kadence-column inner-column-${ id }` } >
				<InspectorControls>
					{ tabControls }
				</InspectorControls>
				<div className="kadence-inner-column-inner" style={ {
					paddingLeft: leftPadding + 'px',
					paddingRight: rightPadding + 'px',
					paddingTop: topPadding + 'px',
					paddingBottom: bottomPadding + 'px',
				} } >
					<InnerBlocks templateLock={ false } />
				</div>
			</div>
		);
	},

	save( { attributes } ) {
		const { id } = attributes;

		return (
			<div className={ `inner-column-${ id }` }>
				<div className={ 'kt-inside-inner-col' } >
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
