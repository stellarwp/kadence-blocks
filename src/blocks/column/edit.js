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
import MeasurementControls from '../../measurement-control';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

const {
	Component,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
} = wp.editor;
const {
	TabPanel,
	Dashicon,
	PanelBody,
	RangeControl,
} = wp.components;

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const ktcolumnUniqueIDs = [];
/**
 * Build the spacer edit
 */
class KadenceColumn extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			borderWidthControl: 'linked',
			borderRadiusControl: 'linked',
		};
	}
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktcolumnUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( ktcolumnUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			ktcolumnUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			ktcolumnUniqueIDs.push( this.props.attributes.uniqueID );
		}
		if ( this.props.attributes.borderWidth && this.props.attributes.borderWidth[ 0 ] === this.props.attributes.borderWidth[ 1 ] && this.props.attributes.borderWidth[ 0 ] === this.props.attributes.borderWidth[ 2 ] && this.props.attributes.borderWidth[ 0 ] === this.props.attributes.borderWidth[ 3 ] ) {
			this.setState( { borderWidthControl: 'linked' } );
		} else {
			this.setState( { borderWidthControl: 'individual' } );
		}
		if ( this.props.attributes.borderRadius && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 1 ] && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 2 ] && this.props.attributes.borderRadius[ 0 ] === this.props.attributes.borderRadius[ 3 ] ) {
			this.setState( { borderRadiusControl: 'linked' } );
		} else {
			this.setState( { borderRadiusControl: 'individual' } );
		}
	}
	render() {
		const { attributes: { id, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, leftMargin, rightMargin, leftMarginM, rightMarginM, backgroundOpacity, background, zIndex, border, borderWidth, borderOpacity, borderRadius, uniqueID, kadenceAnimation, kadenceAOSOptions, collapseOrder }, setAttributes } = this.props;
		const { borderWidthControl, borderRadiusControl } = this.state;
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
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightMarginM }
					className="kt-icon-rangecontrol kt-right-margin"
					onChange={ ( value ) => {
						setAttributes( {
							rightMarginM: value,
						} );
					} }
					min={ -200 }
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
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftMarginM }
					className="kt-icon-rangecontrol kt-left-margin"
					onChange={ ( value ) => {
						setAttributes( {
							leftMarginM: value,
						} );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ __( 'Mobile Collapse Order' ) }
					value={ collapseOrder }
					onChange={ ( value ) => {
						setAttributes( {
							collapseOrder: value,
						} );
					} }
					min={ -10 }
					max={ 10 }
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
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ rightMargin }
					className="kt-icon-rangecontrol kt-right-margin"
					onChange={ ( value ) => {
						setAttributes( {
							rightMargin: value,
						} );
					} }
					min={ -200 }
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
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ leftMargin }
					className="kt-icon-rangecontrol kt-left-margin"
					onChange={ ( value ) => {
						setAttributes( {
							leftMargin: value,
						} );
					} }
					min={ -200 }
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
					( tab ) => {
						let tabout;
						if ( tab.name ) {
							if ( 'mobile' === tab.name ) {
								tabout = mobileControls;
							} else {
								tabout = deskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const backgroundString = ( background ? hexToRGBA( background, backgroundOpacity ) : 'transparent' );
		const borderString = ( border ? hexToRGBA( border, borderOpacity ) : 'transparent' );
		return (
			<div className={ `kadence-column inner-column-${ id } kadence-column-${ uniqueID }` } >
				<InspectorControls>
					<h2>{ __( 'Background Color' ) }</h2>
					<ColorPalette
						value={ background }
						onChange={ ( value ) => setAttributes( { background: value } ) }
					/>
					<RangeControl
						label={ __( 'Background Opacity' ) }
						value={ backgroundOpacity }
						onChange={ ( value ) => {
							setAttributes( {
								backgroundOpacity: value,
							} );
						} }
						min={ 0 }
						max={ 1 }
						step={ 0.01 }
					/>
					<h2>{ __( 'Border Color' ) }</h2>
					<ColorPalette
						value={ border }
						onChange={ ( value ) => setAttributes( { border: value } ) }
					/>
					<RangeControl
						label={ __( 'Border Opacity' ) }
						value={ borderOpacity }
						onChange={ ( value ) => {
							setAttributes( {
								borderOpacity: value,
							} );
						} }
						min={ 0 }
						max={ 1 }
						step={ 0.01 }
					/>
					<MeasurementControls
						label={ __( 'Border Width' ) }
						measurement={ borderWidth }
						control={ borderWidthControl }
						onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
						onControl={ ( value ) => this.setState( { borderWidthControl: value } ) }
						min={ 0 }
						max={ 40 }
						step={ 1 }
					/>
					<MeasurementControls
						label={ __( 'Border Radius' ) }
						measurement={ borderRadius }
						control={ borderRadiusControl }
						onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
						onControl={ ( value ) => this.setState( { borderRadiusControl: value } ) }
						min={ 0 }
						max={ 200 }
						step={ 1 }
						controlTypes={ [
							{ key: 'linked', name: __( 'Linked' ), icon: icons.radiuslinked },
							{ key: 'individual', name: __( 'Individual' ), icon: icons.radiusindividual },
						] }
						firstIcon={ icons.topleft }
						secondIcon={ icons.topright }
						thirdIcon={ icons.bottomright }
						fourthIcon={ icons.bottomleft }
					/>
					<RangeControl
						label={ __( 'Z Index Control' ) }
						value={ zIndex }
						onChange={ ( value ) => {
							setAttributes( {
								zIndex: value,
							} );
						} }
						min={ -200 }
						max={ 200 }
					/>
					{ tabControls }
				</InspectorControls>
				<div id={ `animate-id${ uniqueID }` } className="kadence-inner-column-inner aos-animate kt-animation-wrap" data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) } data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) } data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) } style={ {
					paddingLeft: leftPadding + 'px',
					paddingRight: rightPadding + 'px',
					paddingTop: topPadding + 'px',
					paddingBottom: bottomPadding + 'px',
					marginLeft: leftMargin + 'px',
					marginRight: rightMargin + 'px',
					marginTop: topMargin + 'px',
					marginBottom: bottomMargin + 'px',
					zIndex: zIndex,
					background: backgroundString,
					borderColor: borderString,
					borderWidth: ( borderWidth ? borderWidth[ 0 ] + 'px ' + borderWidth[ 1 ] + 'px ' + borderWidth[ 2 ] + 'px ' + borderWidth[ 3 ] + 'px' : '' ),
					borderRadius: ( borderRadius ? borderRadius[ 0 ] + 'px ' + borderRadius[ 1 ] + 'px ' + borderRadius[ 2 ] + 'px ' + borderRadius[ 3 ] + 'px' : '' ),
				} } >
					<InnerBlocks templateLock={ false } />
				</div>
			</div>
		);
	}
}
export default ( KadenceColumn );
