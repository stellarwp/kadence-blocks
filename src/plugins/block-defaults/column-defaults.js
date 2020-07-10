import map from 'lodash/map';
import MeasurementControls from '../../measurement-control';
import AdvancedPopColorControl from '../../advanced-pop-color-control-default';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	AlignmentToolbar,
} = wp.blockEditor;
const {
	PanelBody,
	RangeControl,
	Button,
	TabPanel,
	Dashicon,
	Modal,
} = wp.components;

import icons from '../../icons';

class KadenceColumnDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
			borderWidthControl: 'linked',
			borderRadiusControl: 'linked',
		};
	}
	componentDidMount() {
		// Check for old defaults.
		if ( ! this.state.configuration[ 'kadence/column' ] ) {
			const blockConfig = kadence_blocks_params.config[ 'kadence/column' ];
			if ( blockConfig !== undefined && typeof blockConfig === 'object' ) {
				Object.keys( blockConfig ).map( ( attribute ) => {
					this.saveConfigState( attribute, blockConfig[ attribute ] );
				} );
			}
		}
	}
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} );
		if ( ! config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_config_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, configuration: config, isOpen: false } );
			kadence_blocks_params.configuration = JSON.stringify( config );
		} );
	}
	saveConfigState( key, value ) {
		const config = this.state.configuration;
		if ( ! config[ 'kadence/column' ] ) {
			config[ 'kadence/column' ] = {};
		}
		config[ 'kadence/column' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const columnConfig = ( configuration && configuration[ 'kadence/column' ] ? configuration[ 'kadence/column' ] : {} );
		const textAlignDefaultStyles = [ '', '', '' ];
		const textAlign = ( undefined !== columnConfig.textAlign && columnConfig.textAlign[ 0 ] ? columnConfig.textAlign : textAlignDefaultStyles );
		const mobileControls = (
			<PanelBody
				title={ __( 'Mobile Padding/Margin' ) }
				initialOpen={ false }
			>
				<h2>{ __( 'Mobile Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== columnConfig.topPaddingM ? columnConfig.topPaddingM : '' ) }
					className="kt-icon-rangecontrol kt-top-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'topPaddingM', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ ( undefined !== columnConfig.rightPaddingM ? columnConfig.rightPaddingM : '' ) }
					className="kt-icon-rangecontrol kt-right-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'rightPaddingM', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== columnConfig.bottomPaddingM ? columnConfig.bottomPaddingM : '' ) }
					className="kt-icon-rangecontrol kt-bottom-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'bottomPaddingM', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ ( undefined !== columnConfig.leftPaddingM ? columnConfig.leftPaddingM : '' ) }
					className="kt-icon-rangecontrol kt-left-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'leftPaddingM', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<h2>{ __( 'Mobile Margin (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== columnConfig.topMarginM ? columnConfig.topMarginM : '' ) }
					className="kt-icon-rangecontrol kt-top-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'topMarginM', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ ( undefined !== columnConfig.rightMarginM ? columnConfig.rightMarginM : '' ) }
					className="kt-icon-rangecontrol kt-right-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'rightMarginM', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== columnConfig.bottomMarginM ? columnConfig.bottomMarginM : '' ) }
					className="kt-icon-rangecontrol kt-bottom-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'bottomMarginM', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ ( undefined !== columnConfig.leftMarginM ? columnConfig.leftMarginM : '' ) }
					className="kt-icon-rangecontrol kt-left-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'leftMarginM', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
			</PanelBody>
		);
		const tabletControls = (
			<PanelBody
				title={ __( 'Tablet Padding/Margin' ) }
				initialOpen={ false }
			>
				<h2>{ __( 'Tablet Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== columnConfig.topPaddingT ? columnConfig.topPaddingT : '' ) }
					className="kt-icon-rangecontrol kt-top-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'topPaddingT', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ ( undefined !== columnConfig.rightPaddingT ? columnConfig.rightPaddingT : '' ) }
					className="kt-icon-rangecontrol kt-right-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'rightPaddingT', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== columnConfig.bottomPaddingT ? columnConfig.bottomPaddingT : '' ) }
					className="kt-icon-rangecontrol kt-bottom-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'bottomPaddingT', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ ( undefined !== columnConfig.leftPaddingT ? columnConfig.leftPaddingT : '' ) }
					className="kt-icon-rangecontrol kt-left-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'leftPaddingT', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<h2>{ __( 'Tablet Margin (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== columnConfig.topMarginT ? columnConfig.topMarginT : '' ) }
					className="kt-icon-rangecontrol kt-top-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'topMarginT', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ ( undefined !== columnConfig.rightMarginT ? columnConfig.rightMarginT : '' ) }
					className="kt-icon-rangecontrol kt-right-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'rightMarginT', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== columnConfig.bottomMarginT ? columnConfig.bottomMarginT : '' ) }
					className="kt-icon-rangecontrol kt-bottom-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'bottomMarginT', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ ( undefined !== columnConfig.leftMarginT ? columnConfig.leftMarginT : '' ) }
					className="kt-icon-rangecontrol kt-left-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'leftMarginT', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
			</PanelBody>
		);
		const deskControls = (
			<PanelBody
				title={ __( 'Padding/Margin' ) }
				initialOpen={ false }
			>
				<h2>{ __( 'Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== columnConfig.topPadding ? columnConfig.topPadding : '' ) }
					className="kt-icon-rangecontrol kt-top-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'topPadding', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ ( undefined !== columnConfig.rightPadding ? columnConfig.rightPadding : '' ) }
					className="kt-icon-rangecontrol kt-right-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'rightPadding', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== columnConfig.bottomPadding ? columnConfig.bottomPadding : '' ) }
					className="kt-icon-rangecontrol kt-bottom-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'bottomPadding', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ ( undefined !== columnConfig.leftPadding ? columnConfig.leftPadding : '' ) }
					className="kt-icon-rangecontrol kt-left-padding"
					onChange={ ( value ) => {
						this.saveConfigState( 'leftPadding', value );
					} }
					min={ 0 }
					max={ 500 }
				/>
				<h2>{ __( 'Margin (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== columnConfig.topMargin ? columnConfig.topMargin : '' ) }
					className="kt-icon-rangecontrol kt-top-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'topMargin', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ ( undefined !== columnConfig.rightMargin ? columnConfig.rightMargin : '' ) }
					className="kt-icon-rangecontrol kt-right-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'rightMargin', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== columnConfig.bottomMargin ? columnConfig.bottomMargin : '' ) }
					className="kt-icon-rangecontrol kt-bottom-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'bottomMargin', value );
					} }
					min={ -200 }
					max={ 200 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ ( undefined !== columnConfig.leftMargin ? columnConfig.leftMargin : '' ) }
					className="kt-icon-rangecontrol kt-left-margin"
					onChange={ ( value ) => {
						this.saveConfigState( 'leftMargin', value );
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
						name: 'tablet',
						title: <Dashicon icon="tablet" />,
						className: 'kt-tablet-tab',
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
							} else if ( 'tablet' === tab.name ) {
								tabout = tabletControls;
							} else {
								tabout = deskControls;
							}
						}
						return <div>{ tabout }</div>;
					}
				}
			</TabPanel>
		);
		const alignDeskControls = (
			<AlignmentToolbar
				isCollapsed={ false }
				value={ ( textAlign && textAlign[ 0 ] ? textAlign[ 0 ] : '' ) }
				onChange={ ( nextAlign ) => {
					this.saveConfigState( 'textAlign', [ nextAlign, textAlign[ 1 ], textAlign[ 2 ] ] );
				} }
			/>
		);
		const alignTabletControls = (
			<AlignmentToolbar
				isCollapsed={ false }
				value={ ( textAlign && textAlign[ 1 ] ? textAlign[ 1 ] : '' ) }
				onChange={ ( nextAlign ) => {
					this.saveConfigState( 'textAlign', [ textAlign[ 0 ], nextAlign, textAlign[ 2 ] ] );
				} }
			/>
		);
		const alignMobileControls = (
			<AlignmentToolbar
				isCollapsed={ false }
				value={ ( textAlign && textAlign[ 2 ] ? textAlign[ 2 ] : '' ) }
				onChange={ ( nextAlign ) => {
					this.saveConfigState( 'textAlign', [ textAlign[ 0 ], textAlign[ 1 ], nextAlign ] );
				} }
			/>
		);
		const textAlignControls = (
			<Fragment>
				<h2 className="kt-heading-size-title">{ __( 'Text Alignment' ) }</h2>
				<TabPanel className="kt-size-tabs"
					activeClass="active-tab"
					tabs={ [
						{
							name: 'desk',
							title: <Dashicon icon="desktop" />,
							className: 'kt-desk-tab',
						},
						{
							name: 'tablet',
							title: <Dashicon icon="tablet" />,
							className: 'kt-tablet-tab',
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
									tabout = alignMobileControls;
								} else if ( 'tablet' === tab.name ) {
									tabout = alignTabletControls;
								} else {
									tabout = alignDeskControls;
								}
							}
							return <div>{ tabout }</div>;
						}
					}
				</TabPanel>
			</Fragment>
		);
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.blockColumn }</span>
					{ __( 'Column' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Columns' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/column', columnConfig );
						} }>
						<PanelBody
							title={ __( 'Kadence Column Controls' ) }
							initialOpen={ true }
						>
							<div className="components-base-control">
								<AdvancedPopColorControl
									label={ __( 'Background Color' ) }
									colorValue={ ( undefined !== columnConfig.background ? columnConfig.background : '' ) }
									colorDefault={ '' }
									onColorChange={ value => this.saveConfigState( 'background', value ) }
									opacityValue={ ( undefined !== columnConfig.backgroundOpacity ? columnConfig.backgroundOpacity : 1 ) }
									onOpacityChange={ value => this.saveConfigState( 'backgroundOpacity', value ) }
								/>
							</div>
							<div className="components-base-control">
								<AdvancedPopColorControl
									label={ __( 'Border Color' ) }
									colorValue={ ( undefined !== columnConfig.border ? columnConfig.border : '' ) }
									colorDefault={ '' }
									onColorChange={ value => this.saveConfigState( 'border', value ) }
									opacityValue={ ( undefined !== columnConfig.borderOpacity ? columnConfig.borderOpacity : 1 ) }
									onOpacityChange={ value => this.saveConfigState( 'borderOpacity', value ) }
								/>
							</div>
							<MeasurementControls
								label={ __( 'Border Width' ) }
								measurement={ ( undefined !== columnConfig.borderWidth ? columnConfig.borderWidth : [ 0, 0, 0, 0 ] ) }
								control={ this.state.borderWidthControl }
								onChange={ ( value ) => this.saveConfigState( 'borderWidth', value ) }
								onControl={ ( value ) => this.setState( { borderWidthControl: value } ) }
								min={ 0 }
								max={ 40 }
								step={ 1 }
							/>
							<MeasurementControls
								label={ __( 'Border Radius' ) }
								measurement={ ( undefined !== columnConfig.borderRadius ? columnConfig.borderRadius : [ 0, 0, 0, 0 ] ) }
								control={ this.state.borderRadiusControl }
								onChange={ ( value ) => this.saveConfigState( 'borderRadius', value ) }
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
							{ textAlignControls }
							<PanelBody
								title={ __( 'Text Color Settings' ) }
								initialOpen={ false }
							>
								<div className="components-base-control">
									<AdvancedPopColorControl
										label={ __( 'Text Color' ) }
										colorValue={ ( columnConfig.textColor ? columnConfig.textColor : '' ) }
										colorDefault={ '' }
										onColorChange={ value => this.saveConfigState( 'textColor', value ) }
									/>
								</div>
								<div className="components-base-control">
									<AdvancedPopColorControl
										label={ __( 'Link Color' ) }
										colorValue={ ( columnConfig.linkColor ? columnConfig.linkColor : '' ) }
										colorDefault={ '' }
										onColorChange={ value => this.saveConfigState( 'linkColor', value ) }
									/>
								</div>
								<div className="components-base-control">
									<AdvancedPopColorControl
										label={ __( 'Link Hover Color' ) }
										colorValue={ ( columnConfig.linkHoverColor ? columnConfig.linkHoverColor : '' ) }
										colorDefault={ '' }
										onColorChange={ value => this.saveConfigState( 'linkHoverColor', value ) }
									/>
								</div>
							</PanelBody>
							<div className="kt-spacer-sidebar-15"></div>
							{ tabControls }
						</PanelBody>
						<Button className="kt-defaults-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/column', columnConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceColumnDefault;
