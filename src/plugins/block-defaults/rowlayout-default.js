import map from 'lodash/map';
import { MeasurementControls } from '@kadence/components';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	RangeControl,
	ButtonGroup,
	Button,
	TabPanel,
	Dashicon,
	Modal,
	ToggleControl,
	SelectControl,
} = wp.components;

import icons from '../../icons';

class KadenceRowLayoutDefault extends Component {
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
		};
	}
	componentDidMount() {
		// Check for old defaults.
		if ( ! this.state.configuration[ 'kadence/rowlayout' ] ) {
			const blockConfig = kadence_blocks_params.config[ 'kadence/rowlayout' ];
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
		if ( config[ 'kadence/rowlayout' ] === undefined || config[ 'kadence/rowlayout' ].length == 0 ) {
			config[ 'kadence/rowlayout' ] = {};
		}
		config[ 'kadence/rowlayout' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	clearDefaults( key ) {
		const config = this.state.configuration;
		if ( config[ 'kadence/rowlayout' ] === undefined || config[ 'kadence/rowlayout' ].length == 0 ) {
			config[ 'kadence/rowlayout' ] = {};
		}
		if ( undefined !== config[ 'kadence/rowlayout' ][ key ] ) {
			delete config[ 'kadence/rowlayout' ][ key ];
		}
		this.setState( { configuration: config } );
	}
	clearAllDefaults() {
		const config = this.state.configuration;
		config[ 'kadence/rowlayout' ] = {};
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const rowConfig = ( configuration && configuration[ 'kadence/rowlayout' ] ? configuration[ 'kadence/rowlayout' ] : {} );
		const marginMin = ( ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'em' || ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'rem' ? 0.1 : 1 );
		const marginMax = ( ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'em' || ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'rem' ? 12 : 100 );
		const marginStep = ( ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'em' || ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'rem' ? 0.1 : 1 );
		const paddingMin = ( ( undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' ) === 'em' || ( undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' ) === 'rem' ? 0 : 0 );
		const paddingMax = ( ( undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' ) === 'em' || ( undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' ) === 'rem' ? 24 : 500 );
		const paddingStep = ( ( undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' ) === 'em' || ( undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' ) === 'rem' ? 0.1 : 1 );
		const widthTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: '%', name: __( '%' ) },
			{ key: 'vw', name: __( 'vw' ) },
		];
		const widthMax = ( ( undefined !== rowConfig.maxWidthUnit ? rowConfig.maxWidthUnit : 'px' ) === 'px' ? 2000 : 100 );
		const mobileControls = (
			<Fragment>
				<MeasurementControls
					reset={ () => {
						this.clearDefaults( 'topPaddingM' );
						this.clearDefaults( 'rightPaddingM' );
						this.clearDefaults( 'bottomPaddingM' );
						this.clearDefaults( 'leftPaddingM' );
					} }
					label={ __( 'Mobile Padding', 'kadence-blocks' ) }
					measurement={ [ ( undefined !== rowConfig.topPaddingM ? rowConfig.topPaddingM : '' ), ( undefined !== rowConfig.rightPaddingM ? rowConfig.rightPaddingM : '' ), ( undefined !== rowConfig.bottomPaddingM ? rowConfig.bottomPaddingM : '' ), ( undefined !== rowConfig.leftPaddingM ? rowConfig.leftPaddingM : '' ) ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topPaddingM', value[ 0 ] );
						this.saveConfigState( 'rightPaddingM', value[ 1 ] );
						this.saveConfigState( 'bottomPaddingM', value[ 2 ] );
						this.saveConfigState( 'leftPaddingM', value[ 3 ] );
					} }
					min={ paddingMin }
					max={ paddingMax }
					step={ paddingStep }
					unit={ undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' }
					units={ [ ( undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' ) ] }
					showUnit={ true }
					allowEmpty={ true }
				/>
				<MeasurementControls
					reset={ () => {
						this.clearDefaults( 'topMarginM' );
						this.clearDefaults( 'bottomMarginM' );
					} }
					label={ __( 'Mobile Margin', 'kadence-blocks' ) }
					measurement={ [ ( undefined !== rowConfig.topMarginM ? rowConfig.topMarginM : '' ), 'auto', ( undefined !== rowConfig.bottomMarginM ? rowConfig.bottomMarginM : '' ), 'auto' ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topMarginM', value[ 0 ] );
						this.saveConfigState( 'bottomMarginM', value[ 2 ] );
					} }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
					unit={ undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px' }
					units={ [ undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px' ] }
					showUnit={ true }
					allowEmpty={ true }
				/>
			</Fragment>
		);
		const tabletControls = (
			<Fragment>
				<MeasurementControls
					reset={ () => this.clearDefaults( 'tabletPadding' ) }
					label={ __( 'Tablet Padding', 'kadence-blocks' ) }
					measurement={ ( undefined !== rowConfig.tabletPadding ? rowConfig.tabletPadding : [ '', '', '', '' ] ) }
					onChange={ ( value ) => this.saveConfigState( 'tabletPadding', value ) }
					min={ paddingMin }
					max={ paddingMax }
					step={ paddingStep }
					unit={ undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' }
					units={ [ ( undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' ) ] }
					showUnit={ true }
					allowEmpty={ true }
				/>
				<MeasurementControls
					reset={ () => {
						this.clearDefaults( 'topMarginT' );
						this.clearDefaults( 'bottomMarginT' );
					} }
					label={ __( 'Tablet Margin', 'kadence-blocks' ) }
					measurement={ [ ( undefined !== rowConfig.topMarginT ? rowConfig.topMarginT : '' ), 'auto', ( undefined !== rowConfig.bottomMarginT ? rowConfig.bottomMarginT : '' ), 'auto' ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topMarginT', value[ 0 ] );
						this.saveConfigState( 'bottomMarginT', value[ 2 ] );
					} }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
					unit={ undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px' }
					units={ [ undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px' ] }
					showUnit={ true }
					allowEmpty={ true }
				/>
			</Fragment>
		);
		const deskControls = (
			<Fragment>
				<MeasurementControls
					reset={ () => {
						this.clearDefaults( 'topPadding' );
						this.clearDefaults( 'rightPadding' );
						this.clearDefaults( 'bottomPadding' );
						this.clearDefaults( 'leftPadding' );
					} }
					label={ __( 'Padding', 'kadence-blocks' ) }
					measurement={ [ ( undefined !== rowConfig.topPadding ? rowConfig.topPadding : '' ), ( undefined !== rowConfig.rightPadding ? rowConfig.rightPadding : '' ), ( undefined !== rowConfig.bottomPadding ? rowConfig.bottomPadding : '' ), ( undefined !== rowConfig.leftPadding ? rowConfig.leftPadding : '' ) ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topPadding', value[ 0 ] );
						this.saveConfigState( 'rightPadding', value[ 1 ] );
						this.saveConfigState( 'bottomPadding', value[ 2 ] );
						this.saveConfigState( 'leftPadding', value[ 3 ] );
					} }
					min={ paddingMin }
					max={ paddingMax }
					step={ paddingStep }
					unit={ undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px' }
					units={ [ 'px', 'em', 'rem', '%', 'vh', 'vw' ] }
					onUnit={ ( value ) => this.saveConfigState( 'paddingUnit', value ) }
					allowEmpty={ true }
				/>
				<MeasurementControls
					reset={ () => {
						this.clearDefaults( 'topMargin' );
						this.clearDefaults( 'bottomMargin' );
					} }
					label={ __( 'Margin', 'kadence-blocks' ) }
					measurement={ [ ( undefined !== rowConfig.topMargin ? rowConfig.topMargin : '' ), 'auto', ( undefined !== rowConfig.bottomMargin ? rowConfig.bottomMargin : '' ), 'auto' ] }
					onChange={ ( value ) => {
						this.saveConfigState( 'topMargin', value[ 0 ] );
						this.saveConfigState( 'bottomMargin', value[ 2 ] );
					} }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
					unit={ undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px' }
					units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
					onUnit={ ( value ) => this.saveConfigState( 'marginUnit', value ) }
					allowEmpty={ true }
				/>
			</Fragment>
		);
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.blockRow }</span>
					{ __( 'Row Layout', 'kadence-blocks' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Row Layout' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/rowlayout', rowConfig );
						} }>
						<PanelBody
							title={ __( 'Row Layout Controls', 'kadence-blocks' ) }
							initialOpen={ true }
						>
							<SelectControl
								label={ __( 'Align', 'kadence-blocks' ) }
								value={ ( undefined !== rowConfig.align ? rowConfig.align : '' ) }
								options={ [
									{ value: '', label: __( 'Default', 'kadence-blocks' ) },
									{ value: 'wide', label: __( 'Wide', 'kadence-blocks' ) },
									{ value: 'full', label: __( 'Fullwidth', 'kadence-blocks' ) },
								] }
								onChange={ ( value ) => this.saveConfigState( 'align', value ) }
							/>
							<SelectControl
								label={ __( 'Column width Resizing control', 'kadence-blocks' ) }
								value={ ( undefined !== rowConfig.columnsUnlocked ? rowConfig.columnsUnlocked : false ) }
								options={ [
									{ value: false, label: __( 'Step Resizing', 'kadence-blocks' ) },
									{ value: true, label: __( 'Fluid Resizing', 'kadence-blocks' ) },
								] }
								onChange={ value => this.saveConfigState( 'columnsUnlocked', value ) }
							/>
							<SelectControl
								label={ __( 'Column Gutter', 'kadence-blocks' ) }
								value={ ( undefined !== rowConfig.columnGutter ? rowConfig.columnGutter : 'default' ) }
								options={ [
									{ value: 'default', label: __( 'Standard: 30px', 'kadence-blocks' ) },
									{ value: 'none', label: __( 'No Gutter', 'kadence-blocks' ) },
									{ value: 'skinny', label: __( 'Skinny: 10px', 'kadence-blocks' ) },
									{ value: 'narrow', label: __( 'Narrow: 20px', 'kadence-blocks' ) },
									{ value: 'wide', label: __( 'Wide: 40px', 'kadence-blocks' ) },
									{ value: 'wider', label: __( 'Wider: 60px', 'kadence-blocks' ) },
									{ value: 'widest', label: __( 'Widest: 80px', 'kadence-blocks' ) },
								] }
								onChange={ ( value ) => this.saveConfigState( 'columnGutter', value ) }
							/>
							<SelectControl
								label={ __( 'Column Collapse Vertical Gutter', 'kadence-blocks' ) }
								value={ ( undefined !== rowConfig.collapseGutter ? rowConfig.collapseGutter : 'default' ) }
								options={ [
									{ value: 'default', label: __( 'Standard: 30px', 'kadence-blocks' ) },
									{ value: 'none', label: __( 'No Gutter', 'kadence-blocks' ) },
									{ value: 'skinny', label: __( 'Skinny: 10px', 'kadence-blocks' ) },
									{ value: 'narrow', label: __( 'Narrow: 20px', 'kadence-blocks' ) },
									{ value: 'wide', label: __( 'Wide: 40px', 'kadence-blocks' ) },
									{ value: 'wider', label: __( 'Wider: 60px', 'kadence-blocks' ) },
									{ value: 'widest', label: __( 'Widest: 80px', 'kadence-blocks' ) },
								] }
								onChange={ ( value ) => this.saveConfigState( 'collapseGutter', value ) }
							/>
							<SelectControl
								label={ __( 'Collapse Order' ) }
								value={ ( undefined !== rowConfig.collapseOrder ? rowConfig.collapseOrder : 'left-to-right' ) }
								options={ [
									{ value: 'left-to-right', label: __( 'Left to Right', 'kadence-blocks' ) },
									{ value: 'right-to-left', label: __( 'Right to Left', 'kadence-blocks' ) },
								] }
								onChange={ value => this.saveConfigState( 'collapseOrder', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Padding Margin', 'kadence-blocks' ) }
							initialOpen={ false }
						>
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
						</PanelBody>
						<PanelBody
							title={ __( 'Structure Settings', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<SelectControl
								label={ __( 'Container HTML tag', 'kadence-blocks' ) }
								value={ ( undefined !== rowConfig.htmlTag ? rowConfig.htmlTag : 'div' ) }
								options={ [
									{ value: 'div', label: 'div' },
									{ value: 'header', label: 'header' },
									{ value: 'section', label: 'section' },
									{ value: 'article', label: 'article' },
									{ value: 'main', label: 'main' },
									{ value: 'aside', label: 'aside' },
									{ value: 'footer', label: 'footer' },
								] }
								onChange={ ( value ) => this.saveConfigState( 'htmlTag', value ) }
							/>
							<ToggleControl
								label={ __( 'Content Max Width Inherit from Theme?', 'kadence-blocks' ) }
								checked={ ( undefined !== rowConfig.inheritMaxWidth ? rowConfig.inheritMaxWidth : false ) }
								onChange={ ( value ) => this.saveConfigState( 'inheritMaxWidth', value ) }
							/>
							{ undefined !== rowConfig.inheritMaxWidth && rowConfig.inheritMaxWidth !== true && (
								<Fragment>
									<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Max Width Type', 'kadence-blocks' ) }>
										{ map( widthTypes, ( { name, key } ) => (
											<Button
												key={ key }
												className="kt-size-btn"
												isSmall
												isPrimary={ ( undefined !== rowConfig.maxWidthUnit ? rowConfig.maxWidthUnit : 'px' ) === key }
												aria-pressed={ ( undefined !== rowConfig.maxWidthUnit ? rowConfig.maxWidthUnit : 'px' ) === key }
												onClick={ () => this.saveConfigState( 'maxWidthUnit', key ) }
											>
												{ name }
											</Button>
										) ) }
									</ButtonGroup>
									<RangeControl
										label={ __( 'Content Max Width', 'kadence-blocks' ) }
										value={ ( undefined !== rowConfig.maxWidth ? rowConfig.maxWidth : '' ) }
										onChange={ ( value ) => this.saveConfigState( 'maxWidth', value ) }
										min={ 0 }
										max={ widthMax }
									/>
								</Fragment>
							) }
							<ToggleControl
								label={ __( 'Inner Column Height 100%', 'kadence-blocks' ) }
								checked={ ( undefined !== rowConfig.columnsInnerHeight ? rowConfig.columnsInnerHeight : false ) }
								onChange={ ( value ) => this.saveConfigState( 'columnsInnerHeight', value ) }
							/>
						</PanelBody>
						<div className="kb-modal-footer">
							{ ! this.state.resetConfirm && (
								<Button className="kt-defaults-save" isDestructive disabled={ ( JSON.stringify( this.state.configuration[ 'kadence/rowlayout' ] ) === JSON.stringify( {} ) ? true : false ) } onClick={ () => {
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
								this.saveConfig( 'kadence/rowlayout', rowConfig );
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
export default KadenceRowLayoutDefault;
