const {
	Component,
	Fragment,
} = wp.element;
const {
	Dashicon,
	Tooltip,
	SelectControl,
	Button,
	Modal,
} = wp.components;
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
class KadenceTestimonialSettings extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			settings: ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} ),
		};
	}
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( ! config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_settings_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, settings: config, isOpen: false } );
			kadence_blocks_params.settings = JSON.stringify( config );
		} );
	}
	saveConfigState( key, value ) {
		const config = this.state.settings;
		if ( ! config[ 'kadence/testimonials' ] ) {
			config[ 'kadence/testimonials' ] = {};
		}
		config[ 'kadence/testimonials' ][ key ] = value;
		this.setState( { settings: config } );
	}
	render() {
		const { settings, isOpen } = this.state;
		const testimonialSettings = ( settings && settings[ 'kadence/testimonials' ] ? settings[ 'kadence/testimonials' ] : {} );
		return (
			<Fragment>
				<Tooltip text="Block Settings Visibility">
					<Button className="kt-block-settings" onClick={ () => this.setState( { isOpen: true } ) }>
						<Dashicon icon="visibility" />
					</Button>
				</Tooltip>
				{ isOpen ?
					<Modal
						className="kt-block-settings-modal"
						title={ __( 'Testimonial Settings' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/testimonials', testimonialSettings );
						} }>
						<SelectControl
							label={ __( 'Enabled All Settings For' ) }
							value={ ( testimonialSettings.allSettings ? testimonialSettings.allSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'allSettings', value ) }
						/>
						<hr />
						<h2>{ __( 'Control Individual Settings Groups' ) }</h2>
						<SelectControl
							label={ __( 'Enable Layout Settings' ) }
							value={ ( testimonialSettings.layoutSettings ? testimonialSettings.layoutSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'layoutSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Style Settings' ) }
							value={ ( testimonialSettings.styleSettings ? testimonialSettings.styleSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'styleSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Column Settings' ) }
							value={ ( testimonialSettings.columnSettings ? testimonialSettings.columnSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'columnSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Container Settings' ) }
							value={ ( testimonialSettings.containerSettings ? testimonialSettings.containerSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'containerSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Carousel Settings' ) }
							value={ ( testimonialSettings.carouselSettings ? testimonialSettings.carouselSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'carouselSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Top Icon Settings' ) }
							value={ ( testimonialSettings.iconSettings ? testimonialSettings.iconSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'iconSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Title Settings' ) }
							value={ ( testimonialSettings.titleSettings ? testimonialSettings.titleSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'titleSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Rating Settings' ) }
							value={ ( testimonialSettings.ratingSettings ? testimonialSettings.ratingSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'ratingSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Content Settings' ) }
							value={ ( testimonialSettings.contentSettings ? testimonialSettings.contentSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'contentSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Media Settings' ) }
							value={ ( testimonialSettings.mediaSettings ? testimonialSettings.mediaSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'mediaSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Name Settings' ) }
							value={ ( testimonialSettings.nameSettings ? testimonialSettings.nameSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'nameSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Occupation Settings' ) }
							value={ ( testimonialSettings.occupationSettings ? testimonialSettings.occupationSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'occupationSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Shadow Settings' ) }
							value={ ( testimonialSettings.shadowSettings ? testimonialSettings.shadowSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'shadowSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Individual Item Settings' ) }
							value={ ( testimonialSettings.shadowSettings ? testimonialSettings.shadowSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'shadowSettings', value ) }
						/>
						<Button className="kt-settings-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/testimonials', testimonialSettings );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceTestimonialSettings;
