import map from 'lodash/map';
import MeasurementControls from '../../components/measurement/measurement-control';
import PopColorControl from '../../components/color/pop-color-control';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	AlignmentToolbar,
} = wp.blockEditor;
const {
	Panel,
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
		this.clearDefaults = this.clearDefaults.bind( this );
		this.clearAllDefaults = this.clearAllDefaults.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			resetConfirm: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
			borderWidthControl: 'individual',
			borderRadiusControl: 'individual',
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
		if ( config[ 'kadence/column' ] === undefined || config[ 'kadence/column' ].length == 0 ) {
			config[ 'kadence/column' ] = {};
		}
		config[ 'kadence/column' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	clearDefaults( key ) {
		const config = this.state.configuration;
		if ( config[ 'kadence/column' ] === undefined || config[ 'kadence/column' ].length == 0 ) {
			config[ 'kadence/column' ] = {};
		}
		if ( undefined !== config[ 'kadence/column' ][ key ] ) {
			delete config[ 'kadence/column' ][ key ];
		}
		this.setState( { configuration: config } );
	}
	clearAllDefaults() {
		const config = this.state.configuration;
		config[ 'kadence/column' ] = {};
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const columnConfig = ( configuration && configuration[ 'kadence/column' ] ? configuration[ 'kadence/column' ] : {} );
		const textAlignDefaultStyles = [ '', '', '' ];
		const textAlign = ( undefined !== columnConfig.textAlign && columnConfig.textAlign[ 0 ] ? columnConfig.textAlign : textAlignDefaultStyles );
		const mobileControls = (
			<Panel className="components-panel__body is-opened">
				<MeasurementControls
					label={ __( 'Mobile Padding' ) }
					reset={ () => {
						this.clearDefaults( 'topPaddingM' );
						this.clearDefaults( 'rightPaddingM' );
						this.clearDefaults( 'bottomPaddingM' );
						this.clearDefaults( 'leftPaddingM' );
					} }
					measurement={ [ ( undefined !== columnConfig.topPaddingM ? columnConfig.topPaddingM : '' ), ( undefined !== columnConfig.rightPaddingM ? columnConfig.rightPaddingM : '' ), ( undefined !== columnConfig.bottomPaddingM ? columnConfig.bottomPaddingM : '' ), ( undefined !== columnConfig.leftPaddingM ? columnConfig.leftPaddingM : '' ) ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topPaddingM', value[ 0 ] );
						this.saveConfigState( 'rightPaddingM', value[ 1 ] );
						this.saveConfigState( 'bottomPaddingM', value[ 2 ] );
						this.saveConfigState( 'leftPaddingM', value[ 3 ] );
					} }
					min={ 0 }
					max={ 500 }
					step={ 1 }
					unit={ 'px' }
					showUnit={ true }
					units={ [ 'px' ] }
					allowEmpty={ true }
				/>
				<MeasurementControls
					label={ __( 'Mobile Margin' ) }
					reset={ () => {
						this.clearDefaults( 'topMarginM' );
						this.clearDefaults( 'rightMarginM' );
						this.clearDefaults( 'bottomMarginM' );
						this.clearDefaults( 'leftMarginM' );
					} }
					measurement={ [ ( undefined !== columnConfig.topMarginM ? columnConfig.topMarginM : '' ), ( undefined !== columnConfig.rightMarginM ? columnConfig.rightMarginM : '' ), ( undefined !== columnConfig.bottomMarginM ? columnConfig.bottomMarginM : '' ), ( undefined !== columnConfig.leftMarginM ? columnConfig.leftMarginM : '' ) ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topMarginM', value[ 0 ] );
						this.saveConfigState( 'rightMarginM', value[ 1 ] );
						this.saveConfigState( 'bottomMarginM', value[ 2 ] );
						this.saveConfigState( 'leftMarginM', value[ 3 ] );
					} }
					min={ -200 }
					max={ 200 }
					step={ 1 }
					allowEmpty={ true }
					unit={ 'px' }
					showUnit={ true }
					units={ [ 'px' ] }
				/>
			</Panel>
		);
		const tabletControls = (
			<Panel className="components-panel__body is-opened">
				<MeasurementControls
					label={ __( 'Tablet Padding' ) }
					reset={ () => {
						this.clearDefaults( 'topPaddingT' );
						this.clearDefaults( 'rightPaddingT' );
						this.clearDefaults( 'bottomPaddingT' );
						this.clearDefaults( 'leftPaddingT' );
					} }
					measurement={ [ ( undefined !== columnConfig.topPaddingT ? columnConfig.topPaddingT : '' ), ( undefined !== columnConfig.rightPaddingT ? columnConfig.rightPaddingT : '' ), ( undefined !== columnConfig.bottomPaddingT ? columnConfig.bottomPaddingT : '' ), ( undefined !== columnConfig.leftPaddingT ? columnConfig.leftPaddingT : '' ) ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topPaddingT', value[ 0 ] );
						this.saveConfigState( 'rightPaddingT', value[ 1 ] );
						this.saveConfigState( 'bottomPaddingT', value[ 2 ] );
						this.saveConfigState( 'leftPaddingT', value[ 3 ] );
					} }
					min={ 0 }
					max={ 500 }
					step={ 1 }
					unit={ 'px' }
					showUnit={ true }
					units={ [ 'px' ] }
					allowEmpty={ true }
				/>
				<MeasurementControls
					label={ __( 'Tablet Margin' ) }
					reset={ () => {
						this.clearDefaults( 'topMarginT' );
						this.clearDefaults( 'rightMarginT' );
						this.clearDefaults( 'bottomMarginT' );
						this.clearDefaults( 'leftMarginT' );
					} }
					measurement={ [ ( undefined !== columnConfig.topMarginT ? columnConfig.topMarginT : '' ), ( undefined !== columnConfig.rightMarginT ? columnConfig.rightMarginT : '' ), ( undefined !== columnConfig.bottomMarginT ? columnConfig.bottomMarginT : '' ), ( undefined !== columnConfig.leftMarginT ? columnConfig.leftMarginT : '' ) ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topMarginT', value[ 0 ] );
						this.saveConfigState( 'rightMarginT', value[ 1 ] );
						this.saveConfigState( 'bottomMarginT', value[ 2 ] );
						this.saveConfigState( 'leftMarginT', value[ 3 ] );
					} }
					min={ -200 }
					max={ 200 }
					step={ 1 }
					allowEmpty={ true }
					unit={ 'px' }
					showUnit={ true }
					units={ [ 'px' ] }
				/>
			</Panel>
		);
		const deskControls = (
			<Panel className="components-panel__body is-opened">
				<MeasurementControls
					label={ __( 'Padding', 'kadence-blocks' ) }
					reset={ () => {
						this.clearDefaults( 'topPadding' );
						this.clearDefaults( 'rightPadding' );
						this.clearDefaults( 'bottomPadding' );
						this.clearDefaults( 'leftPadding' );
					} }
					measurement={ [ ( undefined !== columnConfig.topPadding ? columnConfig.topPadding : '' ), ( undefined !== columnConfig.rightPadding ? columnConfig.rightPadding : '' ), ( undefined !== columnConfig.bottomPadding ? columnConfig.bottomPadding : '' ), ( undefined !== columnConfig.leftPadding ? columnConfig.leftPadding : '' ) ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topPadding', value[ 0 ] );
						this.saveConfigState( 'rightPadding', value[ 1 ] );
						this.saveConfigState( 'bottomPadding', value[ 2 ] );
						this.saveConfigState( 'leftPadding', value[ 3 ] );
					} }
					min={ 0 }
					max={ 500 }
					step={ 1 }
					unit={ 'px' }
					showUnit={ true }
					units={ [ 'px' ] }
					allowEmpty={ true }
				/>
				<MeasurementControls
					label={ __( 'Margin', 'kadence-blocks' ) }
					reset={ () => {
						this.clearDefaults( 'topMargin' );
						this.clearDefaults( 'rightMargin' );
						this.clearDefaults( 'bottomMargin' );
						this.clearDefaults( 'leftMargin' );
					} }
					measurement={ [ ( undefined !== columnConfig.topMargin ? columnConfig.topMargin : '' ), ( undefined !== columnConfig.rightMargin ? columnConfig.rightMargin : '' ), ( undefined !== columnConfig.bottomMargin ? columnConfig.bottomMargin : '' ), ( undefined !== columnConfig.leftMargin ? columnConfig.leftMargin : '' ) ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topMargin', value[ 0 ] );
						this.saveConfigState( 'rightMargin', value[ 1 ] );
						this.saveConfigState( 'bottomMargin', value[ 2 ] );
						this.saveConfigState( 'leftMargin', value[ 3 ] );
					} }
					min={ -200 }
					max={ 200 }
					step={ 1 }
					allowEmpty={ true }
					unit={ 'px' }
					showUnit={ true }
					units={ [ 'px' ] }
				/>
			</Panel>
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
			<div className="kb-sidebar-alignment">
				<h2 className="kt-heading-size-title">{ __( 'Text Alignment', 'kadence-blocks' ) }</h2>
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
			</div>
		);
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.blockColumn }</span>
					{ __( 'Section', 'kadence-blocks' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Section', 'kadence-blocks' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/column', columnConfig );
						} }>
						<PanelBody
							title={ __( 'Kadence Section Controls', 'kadence-blocks' ) }
							initialOpen={ true }
						>
							<div className="components-base-control">
								<PopColorControl
									label={ __( 'Background Color', 'kadence-blocks' ) }
									value={ ( undefined !== columnConfig.background ? columnConfig.background : '' ) }
									default={ '' }
									onChange={ value => this.saveConfigState( 'background', value ) }
									opacityValue={ ( undefined !== columnConfig.backgroundOpacity ? columnConfig.backgroundOpacity : 1 ) }
									onOpacityChange={ value => this.saveConfigState( 'backgroundOpacity', value ) }
								/>
							</div>
							<div className="components-base-control">
								<PopColorControl
									label={ __( 'Border Color', 'kadence-blocks' ) }
									value={ ( undefined !== columnConfig.border ? columnConfig.border : '' ) }
									default={ '' }
									onChange={ value => this.saveConfigState( 'border', value ) }
									opacityValue={ ( undefined !== columnConfig.borderOpacity ? columnConfig.borderOpacity : 1 ) }
									onOpacityChange={ value => this.saveConfigState( 'borderOpacity', value ) }
								/>
							</div>
							<MeasurementControls
								label={ __( 'Border Width', 'kadence-blocks' ) }
								reset={ () => {
									this.clearDefaults( 'borderWidth' );
								} }
								measurement={ ( undefined !== columnConfig.borderWidth ? columnConfig.borderWidth : [ 0, 0, 0, 0 ] ) }
								control={ this.state.borderWidthControl }
								onChange={ ( value ) => this.saveConfigState( 'borderWidth', value ) }
								onControl={ ( value ) => this.setState( { borderWidthControl: value } ) }
								min={ 0 }
								max={ 40 }
								step={ 1 }
							/>
							<MeasurementControls
								label={ __( 'Border Radius', 'kadence-blocks' ) }
								reset={ () => {
									this.clearDefaults( 'borderRadius' );
								} }
								measurement={ ( undefined !== columnConfig.borderRadius ? columnConfig.borderRadius : [ 0, 0, 0, 0 ] ) }
								control={ this.state.borderRadiusControl }
								onChange={ ( value ) => this.saveConfigState( 'borderRadius', value ) }
								onControl={ ( value ) => this.setState( { borderRadiusControl: value } ) }
								min={ 0 }
								max={ 200 }
								step={ 1 }
								controlTypes={ [
									{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: icons.radiuslinked },
									{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: icons.radiusindividual },
								] }
								firstIcon={ icons.topleft }
								secondIcon={ icons.topright }
								thirdIcon={ icons.bottomright }
								fourthIcon={ icons.bottomleft }
							/>
							{ textAlignControls }
							<PanelBody
								title={ __( 'Text Color Settings', 'kadence-blocks' ) }
								initialOpen={ false }
							>
								<div className="components-base-control">
									<PopColorControl
										label={ __( 'Text Color', 'kadence-blocks' ) }
										value={ ( columnConfig.textColor ? columnConfig.textColor : '' ) }
										default={ '' }
										onChange={ value => this.saveConfigState( 'textColor', value ) }
									/>
								</div>
								<div className="components-base-control">
									<PopColorControl
										label={ __( 'Link Color', 'kadence-blocks' ) }
										value={ ( columnConfig.linkColor ? columnConfig.linkColor : '' ) }
										default={ '' }
										onChange={ value => this.saveConfigState( 'linkColor', value ) }
									/>
								</div>
								<div className="components-base-control">
									<PopColorControl
										label={ __( 'Link Hover Color', 'kadence-blocks' ) }
										value={ ( columnConfig.linkHoverColor ? columnConfig.linkHoverColor : '' ) }
										default={ '' }
										onChange={ value => this.saveConfigState( 'linkHoverColor', value ) }
									/>
								</div>
							</PanelBody>
							<div className="kt-spacer-sidebar-15"></div>
							{ tabControls }
						</PanelBody>
						<div className="kb-modal-footer">
							{ ! this.state.resetConfirm && (
								<Button className="kt-defaults-save" isDestructive disabled={ ( JSON.stringify( this.state.configuration[ 'kadence/column' ] ) === JSON.stringify( {} ) ? true : false ) } onClick={ () => {
									this.setState( { resetConfirm: true } );
								} }>
									{ __( 'Reset', 'kadence-blocks' ) }
								</Button>
							) }
							{ this.state.resetConfirm && (
								<Button className="kt-defaults-save" isDestructive onClick={ () => {
									this.clearAllDefaults();
									this.setState( { resetConfirm: false } );
								} }>
									{ __( 'Confirm Reset', 'kadence-blocks' ) }
								</Button>
							) }
							<Button className="kt-defaults-save" isPrimary onClick={ () => {
								this.saveConfig( 'kadence/column', columnConfig );
							} }>
								{ __( 'Save/Close', 'kadence-blocks' ) }
							</Button>
						</div>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceColumnDefault;
