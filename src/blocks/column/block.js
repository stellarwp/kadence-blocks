/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

const {
	InnerBlocks,
	InspectorControls,
} = wp.editor;
/**
 * Import Icons
 */
import icons from './icon';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	TabPanel,
	Dashicon,
	PanelBody,
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
	icon: icons.block,
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
		const { attributes: { id, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM }, className, setAttributes } = props;
		const mobileControls = (
			<PanelBody
				title={ __( 'Mobile Padding/Margin' ) }
				initialOpen={ false }
			>
				<RangeControl
					label={ __( 'Mobile top padding (px)' ) }
					value={ topPaddingM }
					className="kt-padding-inputs kt-top-padding"
					onChange={ ( topPaddingM ) => {
						setAttributes( {
							topPaddingM: topPaddingM,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ __( 'Mobile bottom padding (px)' ) }
					value={ bottomPaddingM }
					className="kt-padding-inputs kt-bottom-padding"
					onChange={ ( bottomPaddingM ) => {
						setAttributes( {
							bottomPaddingM: bottomPaddingM,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ __( 'Mobile right padding (px)' ) }
					value={ rightPaddingM }
					className="kt-padding-inputs kt-right-padding"
					onChange={ ( rightPaddingM ) => {
						setAttributes( {
							rightPaddingM: rightPaddingM,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ __( 'Mobile left padding (px)' ) }
					value={ leftPaddingM }
					className="kt-padding-inputs kt-left-padding"
					onChange={ ( leftPaddingM ) => {
						setAttributes( {
							leftPaddingM: leftPaddingM,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ __( 'Mobile top margin (px)' ) }
					value={ topMarginM }
					className="kt-padding-inputs kt-top-margin"
					onChange={ ( topMarginM ) => {
						setAttributes( {
							topMarginM: topMarginM,
						} );
					} }
					min={ 0 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Mobile bottom margin (px)' ) }
					value={ bottomMarginM }
					className="kt-padding-inputs kt-bottom-margin"
					onChange={ ( bottomMarginM ) => {
						setAttributes( {
							bottomMarginM: bottomMarginM,
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
				<RangeControl
					label={ __( 'Top padding (px)' ) }
					value={ topPadding }
					className="kt-padding-inputs kt-top-padding"
					onChange={ ( topPadding ) => {
						setAttributes( {
							topPadding: topPadding,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ __( 'Bottom padding (px)' ) }
					value={ bottomPadding }
					className="kt-padding-inputs kt-bottom-padding"
					onChange={ ( bottomPadding ) => {
						setAttributes( {
							bottomPadding: bottomPadding,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ __( 'Right padding (px)' ) }
					value={ rightPadding }
					className="kt-padding-inputs kt-right-padding"
					onChange={ ( rightPadding ) => {
						setAttributes( {
							rightPadding: rightPadding,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ __( 'Left padding (px)' ) }
					value={ leftPadding }
					className="kt-padding-inputs kt-left-padding"
					onChange={ ( leftPadding ) => {
						setAttributes( {
							leftPadding: leftPadding,
						} );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ __( 'Top Margin (px)' ) }
					value={ topMargin }
					className="kt-padding-inputs kt-top-margin"
					onChange={ ( topMargin ) => {
						setAttributes( {
							topMargin: topMargin,
						} );
					} }
					min={ 0 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Bottom Margin (px)' ) }
					value={ bottomMargin }
					className="kt-padding-inputs kt-bottom-margin"
					onChange={ ( bottomMargin ) => {
						setAttributes( {
							bottomMargin: bottomMargin,
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
			<div className={ `kadence-column inner-column-${ id }` } style={ {
				paddingLeft: leftPadding + 'px',
				paddingRight: rightPadding + 'px',
				paddingTop: topPadding + 'px',
				paddingBottom: bottomPadding + 'px',
			} } >
				<InspectorControls>
					{ tabControls }
				</InspectorControls>
				<InnerBlocks templateLock={ false } />
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
