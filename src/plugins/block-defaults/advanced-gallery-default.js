import map from 'lodash/map';
import MeasurementControls from '../../measurement-control';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	Tooltip,
	RangeControl,
	ButtonGroup,
	Button,
	Dashicon,
	TabPanel,
	Modal,
	ToggleControl,
	SelectControl,
} = wp.components;

import icons from '../../icons';

class KadenceAdvancedGalleryDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
			marginDeskControl: 'linked',
			marginTabletControl: 'linked',
			marginMobileControl: 'linked',
		};
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
		if ( ! config[ 'kadence/advancedgallery' ] ) {
			config[ 'kadence/advancedgallery' ] = {};
		}
		config[ 'kadence/advancedgallery' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const galleryConfig = ( configuration && configuration[ 'kadence/advancedgallery' ] ? configuration[ 'kadence/advancedgallery' ] : {} );
		const columnControlTypes = [
			{ key: 'linked', name: __( 'Linked' ), icon: __( 'Linked' ) },
			{ key: 'individual', name: __( 'Individual' ), icon: __( 'Individual' ) },
		];
		const columnsDefault = [ 3, 3, 3, 2, 1, 1 ];
		const columns = ( undefined !== galleryConfig.columns && galleryConfig.columns[ 0 ] ? galleryConfig.columns : columnsDefault );
		const onColumnChange = ( value ) => {
			let columnArray = [];
			if ( 1 === value ) {
				columnArray = [ 1, 1, 1, 1, 1, 1 ];
			} else if ( 2 === value ) {
				columnArray = [ 2, 2, 2, 2, 1, 1 ];
			} else if ( 3 === value ) {
				columnArray = [ 3, 3, 3, 2, 1, 1 ];
			} else if ( 4 === value ) {
				columnArray = [ 4, 4, 4, 3, 2, 2 ];
			} else if ( 5 === value ) {
				columnArray = [ 5, 5, 5, 4, 4, 3 ];
			} else if ( 6 === value ) {
				columnArray = [ 6, 6, 6, 4, 4, 3 ];
			} else if ( 7 === value ) {
				columnArray = [ 7, 7, 7, 5, 5, 4 ];
			} else if ( 8 === value ) {
				columnArray = [ 8, 4, 4, 6, 4, 4 ];
			}
			this.saveConfigState( 'columns', columnArray );
		};
		const gutterDefault = [ 10, '', '' ];
		const gutter = ( undefined !== galleryConfig.gutter && galleryConfig.gutter[ 0 ] ? galleryConfig.gutter : gutterDefault );

		const marginDefault = [ {
			desk: [ '', '', '', '' ],
			tablet: [ '', '', '', '' ],
			mobile: [ '', '', '', '' ],
		} ];
		const margin = ( undefined !== galleryConfig.margin && galleryConfig.margin[ 0 ] ? galleryConfig.margin : marginDefault );
		const saveMargin = ( value ) => {
			const newUpdate = margin.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'margin', newUpdate );
		};
		const marginMin = ( ( undefined !== galleryConfig.marginUnit ? galleryConfig.marginUnit : 'px' ) === 'em' || ( undefined !== galleryConfig.marginUnit ? galleryConfig.marginUnit : 'px' ) === 'rem' ? -12 : -200 );
		const marginMax = ( ( undefined !== galleryConfig.marginUnit ? galleryConfig.marginUnit : 'px' ) === 'em' || ( undefined !== galleryConfig.marginUnit ? galleryConfig.marginUnit : 'px' ) === 'rem' ? 24 : 200 );
		const marginStep = ( ( undefined !== galleryConfig.marginUnit ? galleryConfig.marginUnit : 'px' ) === 'em' || ( undefined !== galleryConfig.marginUnit ? galleryConfig.marginUnit : 'px' ) === 'rem' ? 0.1 : 1 );
		const marginTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
			{ key: '%', name: __( '%' ) },
			{ key: 'vh', name: __( 'vh' ) },
			{ key: 'rem', name: __( 'rem' ) },
		];
		const galleryTypes = [
			{ value: 'masonry', label: __( 'Masonry' ), icon: icons.galMasonry, isDisabled: false },
			{ value: 'grid', label: __( 'Grid' ), icon: icons.galGrid, isDisabled: false },
			{ value: 'carousel', label: __( 'Carousel' ), icon: icons.galCarousel, isDisabled: false },
			{ value: 'fluidcarousel', label: __( 'Fluid Carousel' ), icon: icons.galFluid, isDisabled: false },
			{ value: 'slider', label: __( 'Slider' ), icon: icons.galSlider, isDisabled: false },
		];
		const typeLabel = galleryTypes.filter( ( item ) => ( item.value === ( galleryConfig.type ? galleryConfig.type : 'masonry' ) ) );
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.gallery }</span>
					{ __( 'Advanced Gallery' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Advanced Gallery', 'kadence-blocks' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/advancedgallery', galleryConfig );
						} }>
						<PanelBody
							title={ __( 'Gallery Settings', 'kadence-blocks' ) }
							initialOpen={ true }
						>
							<h2>{ __( 'Default Gallery Type:' ) + ' ' + typeLabel[ 0 ].label }</h2>
							<ButtonGroup className="kt-style-btn-group kb-gallery-type-select" aria-label={ __( 'Gallery Type', 'kadence-blocks' ) }>
								{ map( galleryTypes, ( { value, label, icon, isDisabled } ) => (
									<Tooltip text={ label }>
										<Button
											key={ value }
											className={ `kt-style-btn${ ( isDisabled ? ' kb-disabled-btn' : '' ) }` }
											isSmall
											isDisabled={ isDisabled }
											isPrimary={ ( galleryConfig.type ? galleryConfig.type : 'masonry' ) === value }
											aria-pressed={ ( galleryConfig.type ? galleryConfig.type : 'masonry' ) === value }
											onClick={ () => this.saveConfigState( 'type', value ) }
										>
											{ icon }
										</Button>
									</Tooltip>
								) ) }
							</ButtonGroup>
							<SelectControl
								label={ __( 'Default Image ratio' ) }
								options={ [
									{
										label: __( 'Landscape 4:3', 'kadence-blocks' ),
										value: 'land43',
									},
									{
										label: __( 'Landscape 3:2', 'kadence-blocks' ),
										value: 'land32',
									},
									{
										label: __( 'Landscape 2:1', 'kadence-blocks' ),
										value: 'land21',
									},
									{
										label: __( 'Landscape 3:1', 'kadence-blocks' ),
										value: 'land31',
									},
									{
										label: __( 'Landscape 4:1', 'kadence-blocks' ),
										value: 'land41',
									},
									{
										label: __( 'Portrait 3:4', 'kadence-blocks' ),
										value: 'port34',
									},
									{
										label: __( 'Portrait 2:3', 'kadence-blocks' ),
										value: 'port23',
									},
									{
										label: __( 'Square 1:1', 'kadence-blocks' ),
										value: 'square',
									},
									{
										label: __( 'Inherit' ),
										value: 'inherit',
									},
								] }
								value={ ( undefined !== galleryConfig.imageRatio ? galleryConfig.imageRatio : 'land32' ) }
								onChange={ ( value ) => this.saveConfigState( 'imageRatio', value ) }
							/>
							<Fragment>
								<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Column Control Type' ) }>
									{ map( columnControlTypes, ( { name, key, icon } ) => (
										<Tooltip text={ name }>
											<Button
												key={ key }
												className="kt-size-btn"
												isSmall
												isPrimary={ ( galleryConfig.columnControl ? galleryConfig.columnControl : 'linked' ) === key }
												aria-pressed={ ( galleryConfig.columnControl ? galleryConfig.columnControl : 'linked' ) === key }
												onClick={ () => this.saveConfigState( 'columnControl', key ) }
											>
												{ icon }
											</Button>
										</Tooltip>
									) ) }
								</ButtonGroup>
								{ ( galleryConfig.columnControl ? galleryConfig.columnControl : 'linked' ) !== 'individual' && (
									<RangeControl
										label={ __( 'Columns', 'kadence-blocks' ) }
										value={ columns[ 2 ] }
										onChange={ onColumnChange }
										min={ 1 }
										max={ 8 }
									/>
								) }
								{ ( galleryConfig.columnControl ? galleryConfig.columnControl : 'linked' ) === 'individual' && (
									<Fragment>
										<h4>{ __( 'Columns', 'kadence-blocks' ) }</h4>
										<RangeControl
											label={ __( 'Screen Above 1500px' ) }
											value={ columns[ 0 ] }
											onChange={ ( value ) => this.saveConfigState( 'columns', [ value,columns[ 1 ],columns[ 2 ],columns[ 3 ],columns[ 4 ],columns[ 5 ] ] ) }
											min={ 1 }
											max={ 8 }
										/>
										<RangeControl
											label={ __( 'Screen 1200px - 1499px' ) }
											value={ columns[ 1 ] }
											onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ], value,columns[ 2 ],columns[ 3 ],columns[ 4 ],columns[ 5 ] ] ) }
											min={ 1 }
											max={ 8 }
										/>
										<RangeControl
											label={ __( 'Screen 992px - 1199px' ) }
											value={ columns[ 2 ] }
											onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ],columns[ 1 ], value,columns[ 3 ],columns[ 4 ],columns[ 5 ] ] ) }
											min={ 1 }
											max={ 8 }
										/>
										<RangeControl
											label={ __( 'Screen 768px - 991px' ) }
											value={ columns[ 3 ] }
											onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ],columns[ 1 ],columns[ 2 ], value,columns[ 4 ],columns[ 5 ] ] ) }
											min={ 1 }
											max={ 8 }
										/>
										<RangeControl
											label={ __( 'Screen 544px - 767px' ) }
											value={ columns[ 4 ] }
											onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ],columns[ 1 ],columns[ 2 ],columns[ 3 ], value,columns[ 5 ] ] ) }
											min={ 1 }
											max={ 8 }
										/>
										<RangeControl
											label={ __( 'Screen Below 543px' ) }
											value={ columns[ 5 ] }
											onChange={ ( value ) => this.saveConfigState( 'columns', [ columns[ 0 ],columns[ 1 ],columns[ 2 ],columns[ 3 ],columns[ 4 ], value ] ) }
											min={ 1 }
											max={ 8 }
										/>
									</Fragment>
								) }
							</Fragment>
							<Fragment>
								<h2 className="kt-heading-size-title">{ __( 'Gutter Default' ) }</h2>
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
													tabout = (
														<RangeControl
															value={ ( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' ) }
															onChange={ value => this.saveConfigState( 'gutter', [ ( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' ), ( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' ), value ] ) }
															step={ 2 }
															min={ 0 }
															max={ 100 }
														/>
													);
												} else if ( 'tablet' === tab.name ) {
													tabout = (
														<RangeControl
															value={ ( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' ) }
															onChange={ value => this.saveConfigState( 'gutter', [ ( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' ), value, ( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' ) ] ) }
															step={ 2 }
															min={ 0 }
															max={ 100 }
														/>
													);
												} else {
													tabout = (
														<RangeControl
															value={ ( ( undefined !== gutter && undefined !== gutter[ 0 ] ) ? gutter[ 0 ] : '' ) }
															onChange={ value => this.saveConfigState( 'gutter', [ value, ( ( undefined !== gutter && undefined !== gutter[ 1 ] ) ? gutter[ 1 ] : '' ), ( ( undefined !== gutter && undefined !== gutter[ 2 ] ) ? gutter[ 2 ] : '' ) ] ) }
															step={ 2 }
															min={ 0 }
															max={ 100 }
														/>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
							</Fragment>
							<SelectControl
								label={ __( 'Thumbnail Image Size', 'kadence-blocks' ) }
								value={ ( undefined !== galleryConfig.thumbSize ? galleryConfig.thumbSize : 'large' ) }
								options={ [
									{ value: 'full', label: __( 'Full', 'kadence-blocks' ) },
									{ value: 'large', label: __( 'Large', 'kadence-blocks' ) },
									{ value: 'medium_large', label: __( 'Medium Large', 'kadence-blocks' ) },
									{ value: 'medium', label: __( 'Medium', 'kadence-blocks' ) },
									{ value: 'thumbnail', label: __( 'Thumbnail', 'kadence-blocks' ) },
								] }
								onChange={ value => this.saveConfigState( 'thumbSize', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Link Settings' ) }
							initialOpen={ false }
						>
							<SelectControl
								label={ __( 'Link To', 'kadence-blocks' ) }
								value={ ( undefined !== galleryConfig.linkTo ? galleryConfig.linkTo : 'none' ) }
								options={ [
									{ value: 'attachment', label: __( 'Attachment Page', 'kadence-blocks' ) },
									{ value: 'media', label: __( 'Media File', 'kadence-blocks' ) },
									{ value: 'custom', label: __( 'Custom', 'kadence-blocks' ) },
									{ value: 'none', label: __( 'None', 'kadence-blocks' ) },
								] }
								onChange={ value => this.saveConfigState( 'linkTo', value ) }
							/>
							<SelectControl
								label={ __( 'Link Image Size', 'kadence-blocks' ) }
								value={ ( undefined !== galleryConfig.lightSize ? galleryConfig.lightSize : 'full' ) }
								options={ [
									{ value: 'full', label: __( 'Full', 'kadence-blocks' ) },
									{ value: 'large', label: __( 'Large', 'kadence-blocks' ) },
									{ value: 'medium_large', label: __( 'Medium Large', 'kadence-blocks' ) },
									{ value: 'medium', label: __( 'Medium', 'kadence-blocks' ) },
									{ value: 'thumbnail', label: __( 'Thumbnail', 'kadence-blocks' ) },
								] }
								onChange={ value => this.saveConfigState( 'lightSize', value ) }
							/>
							<ToggleControl
								label={ __( 'Lightbox', 'kadence-blocks' ) }
								checked={ ( undefined !== galleryConfig.lightbox && galleryConfig.lightbox === 'magnific' ? true : false ) }
								onChange={ ( value ) => this.saveConfigState( 'lightbox', ( value ? 'magnific' : 'none' ) ) }
							/>
							<ToggleControl
								label={ __( 'Show Caption in Lightbox', 'kadence-blocks' ) }
								checked={ ( undefined !== galleryConfig.lightboxCaption ? galleryConfig.lightboxCaption : false ) }
								onChange={ ( value ) => this.saveConfigState( 'lightboxCaption', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Gallery Spacing', 'kadence-blocks' ) }
							initialOpen={ false }
						>
							<ButtonGroup className="kt-size-type-options kt-row-size-type-options" aria-label={ __( 'Margin Type' ) }>
								{ map( marginTypes, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ ( galleryConfig.marginUnit ? galleryConfig.marginUnit : 'px' ) === key }
										aria-pressed={ ( galleryConfig.marginUnit ? galleryConfig.marginUnit : 'px' ) === key }
										onClick={ () => this.saveConfigState( 'marginUnit', key ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
							<h2 className="kt-heading-size-title">{ __( 'Margin', 'kadence-blocks' ) }</h2>
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
												tabout = (
													<MeasurementControls
														label={ __( 'Mobile Margin', 'kadence-blocks' ) }
														measurement={ margin[ 0 ].mobile }
														control={ this.state.marginMobileControl }
														onChange={ ( value ) => saveMargin( { mobile: value } ) }
														onControl={ ( value ) => this.setState( { marginMobileControl: value } ) }
														min={ marginMin }
														max={ marginMax }
														step={ marginStep }
													/>
												);
											} else if ( 'tablet' === tab.name ) {
												tabout = (
													<MeasurementControls
														label={ __( 'Tablet Margin', 'kadence-blocks' ) }
														measurement={ margin[ 0 ].tablet }
														control={ this.state.marginTabletControl }
														onChange={ ( value ) => saveMargin( { tablet: value } ) }
														onControl={ ( value ) => this.setState( { marginTabletControl: value } ) }
														min={ marginMin }
														max={ marginMax }
														step={ marginStep }
													/>
												);
											} else {
												tabout = (
													<MeasurementControls
														label={ __( 'Margin', 'kadence-blocks' ) }
														measurement={ margin[ 0 ].desk }
														control={ this.state.marginDeskControl }
														onChange={ ( value ) => saveMargin( { desk: value } ) }
														onControl={ ( value ) => this.setState( { marginDeskControl: value } ) }
														min={ marginMin }
														max={ marginMax }
														step={ marginStep }
													/>
												);
											}
										}
										return <div>{ tabout }</div>;
									}
								}
							</TabPanel>
						</PanelBody>
						<Button className="kt-defaults-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/advancedgallery', galleryConfig );
						} }>
							{ __( 'Save/Close', 'kadence-blocks' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceAdvancedGalleryDefault;
