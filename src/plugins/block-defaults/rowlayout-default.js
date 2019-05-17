import map from 'lodash/map';
import MeasurementControls from '../../measurement-control';
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	ColorPalette,
} = wp.editor;
const {
	PanelBody,
	RangeControl,
	ButtonGroup,
	Button,
	TabPanel,
	Dashicon,
	Modal,
	SelectControl,
} = wp.components;

import icons from '../../icons';

class KadenceRowLayoutDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
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
		const config = this.state.configuration;
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
		if ( ! config[ 'kadence/rowlayout' ] ) {
			config[ 'kadence/rowlayout' ] = {};
		}
		config[ 'kadence/rowlayout' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const rowConfig = ( configuration && configuration[ 'kadence/rowlayout' ] ? configuration[ 'kadence/rowlayout' ] : {} );
		const marginTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
			{ key: '%', name: __( '%' ) },
			{ key: 'vh', name: __( 'vh' ) },
		];
		const marginMin = ( ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'em' ? 0.1 : 1 );
		const marginMax = ( ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'em' ? 12 : 100 );
		const marginStep = ( ( undefined !== rowConfig.marginType ? rowConfig.marginType : 'px' ) === 'em' ? 0.1 : 1 );
		const widthTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: '%', name: __( '%' ) },
			{ key: 'vw', name: __( 'vw' ) },
		];
		const widthMax = ( ( undefined !== rowConfig.maxWidthUnit ? rowConfig.maxWidthUnit : 'px' ) === 'px' ? 2000 : 100 );
		const mobileControls = (
			<Fragment>
				<h2>{ __( 'Mobile Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== rowConfig.topPaddingM ? rowConfig.topPaddingM : '' ) }
					className="kt-icon-rangecontrol kt-top-padding"
					onChange={ ( value ) => this.saveConfigState( 'topPaddingM', value ) }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ ( undefined !== rowConfig.rightPaddingM ? rowConfig.rightPaddingM : '' ) }
					className="kt-icon-rangecontrol kt-right-padding"
					onChange={ ( value ) => this.saveConfigState( 'rightPaddingM', value ) }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== rowConfig.bottomPaddingM ? rowConfig.bottomPaddingM : '' ) }
					className="kt-icon-rangecontrol kt-bottom-padding"
					onChange={ ( value ) => this.saveConfigState( 'bottomPaddingM', value ) }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ ( undefined !== rowConfig.leftPaddingM ? rowConfig.leftPaddingM : '' ) }
					className="kt-icon-rangecontrol kt-left-padding"
					onChange={ ( value ) => this.saveConfigState( 'leftPaddingM', value ) }
					min={ 0 }
					max={ 500 }
				/>
				<ButtonGroup className="kt-size-type-options kt-row-size-type-options" aria-label={ __( 'Margin Type' ) }>
					{ map( marginTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ ( undefined !== rowConfig.marginUnit ? rowConfig.marginUnit : 'px' ) === key }
							aria-pressed={ ( undefined !== rowConfig.marginUnit ? rowConfig.marginUnit : 'px' ) === key }
							onClick={ () => this.saveConfigState( 'marginUnit', key ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<h2>{ __( 'Mobile Margin' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== rowConfig.topMarginM ? rowConfig.topMarginM : '' ) }
					className="kt-icon-rangecontrol kt-top-margin"
					onChange={ ( value ) => this.saveConfigState( 'topMarginM', value ) }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== rowConfig.bottomMarginM ? rowConfig.bottomMarginM : '' ) }
					className="kt-icon-rangecontrol kt-bottom-margin"
					onChange={ ( value ) => this.saveConfigState( 'bottomMarginM', value ) }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
				/>
			</Fragment>
		);
		const tabletControls = (
			<Fragment>
				<MeasurementControls
					label={ __( 'Tablet Padding (px)' ) }
					value={ ( undefined !== rowConfig.tabletPadding ? rowConfig.tabletPadding : [ '', '', '', '' ] ) }
					onChange={ ( value ) => this.saveConfigState( 'tabletPadding', value ) }
					min={ 0 }
					max={ 500 }
					step={ 1 }
				/>
				<ButtonGroup className="kt-size-type-options kt-row-size-type-options" aria-label={ __( 'Margin Type' ) }>
					{ map( marginTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ ( undefined !== rowConfig.marginUnit ? rowConfig.marginUnit : 'px' ) === key }
							aria-pressed={ ( undefined !== rowConfig.marginUnit ? rowConfig.marginUnit : 'px' ) === key }
							onClick={ () => this.saveConfigState( 'marginUnit', key ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<h2>{ __( 'Tablet Margin' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== rowConfig.topMarginT ? rowConfig.topMarginT : '' ) }
					className="kt-icon-rangecontrol kt-top-margin"
					onChange={ ( value ) => this.saveConfigState( 'topMarginT', value ) }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== rowConfig.bottomMarginT ? rowConfig.bottomMarginT : '' ) }
					className="kt-icon-rangecontrol kt-bottom-margin"
					onChange={ ( value ) => this.saveConfigState( 'bottomMarginT', value ) }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
				/>
			</Fragment>
		);
		const deskControls = (
			<Fragment>
				<h2>{ __( 'Desktop Padding (px)' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== rowConfig.topPadding ? rowConfig.topPadding : 25 ) }
					className="kt-icon-rangecontrol"
					onChange={ ( value ) => this.saveConfigState( 'topPadding', value ) }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineright }
					value={ ( undefined !== rowConfig.rightPadding ? rowConfig.rightPadding : '' ) }
					className="kt-icon-rangecontrol"
					onChange={ ( value ) => this.saveConfigState( 'rightPadding', value ) }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== rowConfig.bottomPadding ? rowConfig.bottomPadding : 25 ) }
					className="kt-icon-rangecontrol"
					onChange={ ( value ) => this.saveConfigState( 'bottomPadding', value ) }
					min={ 0 }
					max={ 500 }
				/>
				<RangeControl
					label={ icons.outlineleft }
					value={ ( undefined !== rowConfig.leftPadding ? rowConfig.leftPadding : '' ) }
					className="kt-icon-rangecontrol"
					onChange={ ( value ) => this.saveConfigState( 'leftPadding', value ) }
					min={ 0 }
					max={ 500 }
				/>
				<ButtonGroup className="kt-size-type-options kt-row-size-type-options" aria-label={ __( 'Margin Type' ) }>
					{ map( marginTypes, ( { name, key } ) => (
						<Button
							key={ key }
							className="kt-size-btn"
							isSmall
							isPrimary={ ( undefined !== rowConfig.marginUnit ? rowConfig.marginUnit : 'px' ) === key }
							aria-pressed={ ( undefined !== rowConfig.marginUnit ? rowConfig.marginUnit : 'px' ) === key }
							onClick={ () => this.saveConfigState( 'marginUnit', key ) }
						>
							{ name }
						</Button>
					) ) }
				</ButtonGroup>
				<h2>{ __( 'Margin' ) }</h2>
				<RangeControl
					label={ icons.outlinetop }
					value={ ( undefined !== rowConfig.topMargin ? rowConfig.topMargin : '' ) }
					className="kt-icon-rangecontrol"
					onChange={ ( value ) => this.saveConfigState( 'topMargin', value ) }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
				/>
				<RangeControl
					label={ icons.outlinebottom }
					value={ ( undefined !== rowConfig.bottomMargin ? rowConfig.bottomMargin : '' ) }
					className="kt-icon-rangecontrol"
					onChange={ ( value ) => this.saveConfigState( 'bottomMargin', value ) }
					min={ marginMin }
					max={ marginMax }
					step={ marginStep }
				/>
			</Fragment>
		);
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.blockRow }</span>
					{ __( 'Row Layout' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Row Layout' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/rowlayout', rowConfig );
						} }>
						<PanelBody
							title={ __( 'Row Layout Controls' ) }
							initialOpen={ true }
						>
							<SelectControl
								label={ __( 'Column width Resizing control' ) }
								value={ ( undefined !== rowConfig.columnsUnlocked ? rowConfig.columnsUnlocked : false ) }
								options={ [
									{ value: false, label: __( 'Step Resizing' ) },
									{ value: true, label: __( 'Fluid Resizing' ) },
								] }
								onChange={ value => this.saveConfigState( 'columnsUnlocked', value ) }
							/>
							<SelectControl
								label={ __( 'Column Gutter' ) }
								value={ ( undefined !== rowConfig.columnGutter ? rowConfig.columnGutter : 'default' ) }
								options={ [
									{ value: 'default', label: __( 'Standard: 30px' ) },
									{ value: 'none', label: __( 'No Gutter' ) },
									{ value: 'skinny', label: __( 'Skinny: 10px' ) },
									{ value: 'narrow', label: __( 'Narrow: 20px' ) },
									{ value: 'wide', label: __( 'Wide: 40px' ) },
									{ value: 'wider', label: __( 'Wider: 60px' ) },
									{ value: 'widest', label: __( 'Widest: 80px' ) },
								] }
								onChange={ ( value ) => this.saveConfigState( 'columnGutter', value ) }
							/>
							<SelectControl
								label={ __( 'Column Collapse Vertical Gutter' ) }
								value={ ( undefined !== rowConfig.collapseGutter ? rowConfig.collapseGutter : 'default' ) }
								options={ [
									{ value: 'default', label: __( 'Standard: 30px' ) },
									{ value: 'none', label: __( 'No Gutter' ) },
									{ value: 'skinny', label: __( 'Skinny: 10px' ) },
									{ value: 'narrow', label: __( 'Narrow: 20px' ) },
									{ value: 'wide', label: __( 'Wide: 40px' ) },
									{ value: 'wider', label: __( 'Wider: 60px' ) },
									{ value: 'widest', label: __( 'Widest: 80px' ) },
								] }
								onChange={ ( value ) => this.saveConfigState( 'collapseGutter', value ) }
							/>
							<SelectControl
								label={ __( 'Collapse Order' ) }
								value={ ( undefined !== rowConfig.collapseOrder ? rowConfig.collapseOrder : 'left-to-right' ) }
								options={ [
									{ value: 'left-to-right', label: __( 'Left to Right' ) },
									{ value: 'right-to-left', label: __( 'Right to Left' ) },
								] }
								onChange={ value => this.saveConfigState( 'collapseOrder', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Padding Margin' ) }
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
							title={ __( 'Structure Settings' ) }
							initialOpen={ false }
						>
							<SelectControl
								label={ __( 'Container HTML tag' ) }
								value={ ( undefined !== rowConfig.htmlTag ? rowConfig.htmlTag : 'div' ) }
								options={ [
									{ value: 'div', label: __( 'div' ) },
									{ value: 'header', label: __( 'header' ) },
									{ value: 'section', label: __( 'section' ) },
									{ value: 'article', label: __( 'article' ) },
									{ value: 'main', label: __( 'main' ) },
									{ value: 'aside', label: __( 'aside' ) },
									{ value: 'footer', label: __( 'footer' ) },
								] }
								onChange={ ( value ) => this.saveConfigState( 'htmlTag', value ) }
							/>
							<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Max Width Type' ) }>
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
								label={ __( 'Content Max Width' ) }
								value={ ( undefined !== rowConfig.maxWidth ? rowConfig.maxWidth : '' ) }
								onChange={ ( value ) => this.saveConfigState( 'maxWidth', value ) }
								min={ 0 }
								max={ widthMax }
							/>
						</PanelBody>
						<Button className="kt-defaults-save" isDefault isPrimary onClick={ () => {
							this.saveConfig( 'kadence/rowlayout', rowConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceRowLayoutDefault;
