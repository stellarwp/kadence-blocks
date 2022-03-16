/**
 * Mailer Lite Controls
 *
 */

/**
 * Imports
 */
import Select from 'react-select';
const { addQueryArgs } = wp.url;
const { apiFetch } = wp;
import KadencePanelBody from '../../components/KadencePanelBody';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	TextControl,
	Button,
	Spinner,
	SelectControl,
	ExternalLink,
} = wp.components;

const RETRIEVE_API_URL = 'https://app.mailerlite.com/integrations/api/';
const HELP_URL = 'https://help.mailerlite.com/article/show/35040-where-can-i-find-the-api-key';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class MailerLiteControls extends Component {
	constructor( fields, settings, save ) {
		super( ...arguments );
		this.getMailerLiteGroup = this.getMailerLiteGroup.bind( this );
		this.getMailerLiteFields = this.getMailerLiteFields.bind( this );
		this.removeAPI = this.removeAPI.bind( this );
		this.saveAPI = this.saveAPI.bind( this );
		this.state = {
			api: '',
			isSavedAPI: false,
			isSaving: false,
			group: false,
			isFetching: false,
			groupsLoaded: false,
			isFetchingFields: false,
			groupFields: false,
			groupFieldsLoaded: false,
		};
	}
	componentDidMount() {
		/**
		 * Get settings
		 */
		let settings;
		wp.api.loadPromise.then( () => {
			settings = new wp.api.models.Settings();
			settings.fetch().then( response => {
				this.setState( {
					api: response.kadence_blocks_mailerlite_api,
				} );
				if ( '' !== this.state.api ) {
					this.setState( { isSavedAPI: true } );
				}
			} );
		} );
	}
	getMailerLiteGroup() {
		if ( ! this.state.api ) {
			this.setState( { group: [], groupsLoaded: true } );
			return;
		}
		this.setState( { isFetching: true } );
		apiFetch( {
			path: addQueryArgs(
				'/kb-mailerlite/v1/get',
				{ apikey: this.state.api, endpoint: 'groups', queryargs: [ 'limit=500' ] }
			),
		} )
			.then( ( groups ) => {
				const theGroups = [];
				groups.map( ( item ) => {
					theGroups.push( { value: item.id, label: item.name } );
				} );
				this.setState( { group: theGroups, groupsLoaded: true, isFetching: false } );
			} )
			.catch( () => {
				this.setState( { group: [], groupsLoaded: true, isFetching: false } );
			} );
	}
	getMailerLiteFields() {
		if ( ! this.state.api ) {
			const theFields = [];
			theFields.push( { value: null, label: 'None' } );
			theFields.push( { value: 'email', label: 'Email *' } );
			this.setState( { groupFields: theFields, groupFieldsLoaded: true } );
			return;
		}
		this.setState( { isFetchingFields: true } );
		apiFetch( {
			path: addQueryArgs(
				'/kb-mailerlite/v1/get',
				{ apikey: this.state.api, endpoint: 'fields' }
			),
		} )
			.then( ( fields ) => {
				const theFields = [];
				theFields.push( { value: null, label: 'None' } );
				theFields.push( { value: 'email', label: 'Email *' } );
				fields.map( ( item, index ) => {
					if ( item.key !== 'email' ) {
						theFields.push( { value: item.key, label: item.title } );
					}
				} );
				this.setState( { groupFields: theFields, groupFieldsLoaded: true, isFetchingFields: false } );
			} )
			.catch( () => {
				const theFields = [];
				theFields.push( { value: null, label: 'None' } );
				theFields.push( { value: 'email', label: 'Email *' } );
				this.setState( { groupFields: theFields, groupFieldsLoaded: true, isFetchingFields: false } );
			} );
	}
	removeAPI() {
		this.setState( {
			api: '',
		} );
		if ( this.state.isSavedAPI ) {
			this.setState( { isSaving: true } );
			const settingModel = new wp.api.models.Settings( {
				kadence_blocks_mailerlite_api: '',
			} );
			settingModel.save().then( () => {
				this.setState( { isSavedAPI: false, isSaving: false } );
			} );
		}
	}
	saveAPI() {
		this.setState( { isSaving: true } );
		const settingModel = new wp.api.models.Settings( {
			kadence_blocks_mailerlite_api: this.state.api,
		} );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, isSavedAPI: true } );
		} );
	}
	render() {
		const { group, groupsLoaded, isFetching, isSavedAPI, groupFields, isFetchingFields, groupFieldsLoaded } = this.state;
		const hasGroup = Array.isArray( group ) && group.length;
		const hasFields = Array.isArray( this.state.groupFields ) && this.state.groupFields.length;
		return (
			<KadencePanelBody
				title={ __( 'MailerLite Settings', 'kadence-blocks-pro' ) }
				initialOpen={ false }
				panelName={ 'kb-mailerlite-settings' }
			>
				<p>
					<Fragment>
						<ExternalLink href={ RETRIEVE_API_URL }>{ __( 'Get API Key', 'kadence-blocks-pro' ) }</ExternalLink>
						|&nbsp;
						<ExternalLink href={ HELP_URL }>{ __( 'Get help', 'kadence-blocks-pro' ) }</ExternalLink>
					</Fragment>
				</p>
				<TextControl
					label={ __( 'API Key', 'kadence-blocks' ) }
					value={ this.state.api }
					onChange={ value => this.setState( { api: value } ) }
				/>
				<div className="components-base-control">
					<Button
						isPrimary
						onClick={ this.saveAPI }
						disabled={ '' === this.state.api }
					>
						{ this.state.isSaving ? __( 'Saving', 'kadence-blocks-pro' ) : __( 'Save', 'kadence-blocks-pro' ) }
					</Button>
					{ this.state.isSavedKey && (
						<Fragment>
								&nbsp;
							<Button
								isDefault
								onClick={ this.removeAPI }
							>
								{ __( 'Remove', 'kadence-blocks-pro' ) }
							</Button>
						</Fragment>
					) }
				</div>
				{ isSavedAPI && (
					<Fragment>
						{ isFetching && (
							<Spinner />
						) }
						{ ! isFetching && ! hasGroup && (
							<Fragment>
								<h2 className="kt-heading-size-title">{ __( 'Select Group', 'kadence-blocks' ) }</h2>
								{ ( ! groupsLoaded ? this.getMailerLiteGroup() : '' ) }
								{ ! Array.isArray( group ) ?
									<Spinner /> :
									__( 'No group found.', 'kadence-blocks-pro' ) }
							</Fragment>

						) }
						{ ! isFetching && hasGroup && (
							<Fragment>
								<h2 className="kt-heading-size-title">{ __( 'Select Group', 'kadence-blocks' ) }</h2>
								<div className="mailerlite-select-form-row">
								<Select
									value={ ( group ? group.filter( ( { value } ) => value.toString() === ( undefined !== this.props.settings[ 0 ].group && this.props.settings[ 0 ].group[0] ? this.props.settings[ 0 ].group[0].toString() : '' ) ) : '' ) }
									onChange={ ( value ) => {
										this.props.save( { group: ( value.value ? [ value.value ] : [] ) } );
									} }
									placeholder={ __( 'Select a Group', 'kadence-blocks' ) }
									maxMenuHeight={ 300 }
									options={ group }
								/>
								</div>
								{ ! this.props.settings[ 0 ].group && (
									<div style={ { height: '100px' } }></div>
								) }
								{ this.props.settings[ 0 ].group && (
									<Fragment>
										{ isFetchingFields && (
											<Spinner />
										) }
										{ ! isFetchingFields && ! hasFields && (
											<Fragment>
												<h2 className="kt-heading-size-title">{ __( 'Map Fields', 'kadence-blocks' ) }</h2>
												{ ( ! groupFieldsLoaded ? this.getMailerLiteFields() : '' ) }
												{ ! Array.isArray( groupFields ) ?
													<Spinner /> :
													__( 'No Fields found.', 'kadence-blocks-pro' ) }
											</Fragment>

										) }
										{ ! isFetchingFields && hasFields && (
											<Fragment>
												<h2 className="kt-heading-size-title">{ __( 'Map Fields', 'kadence-blocks' ) }</h2>
												{ this.props.fields && (
													this.props.fields.map( ( item, index ) => {
														return (
															<div key={ index } className="kb-field-map-item">
																<div className="kb-field-map-item-form">
																	<p className="kb-field-map-item-label">{ __( 'Form Field', 'kadence-blocks' ) }</p>
																	<p className="kb-field-map-item-name">{ item.label }</p>
																</div>
																<SelectControl
																	label={ __( 'Select Field:' ) }
																	options={ groupFields }
																	value={ ( undefined !== this.props.settings[ 0 ].map && undefined !== this.props.settings[ 0 ].map[ index ] && this.props.settings[ 0 ].map[ index ] ? this.props.settings[ 0 ].map[ index ] : '' ) }
																	onChange={ ( value ) => {
																		this.props.saveMap( value, index );
																	} }
																/>
															</div>
														);
													} )
												) }
											</Fragment>
										) }
									</Fragment>
								) }
							</Fragment>
						) }
					</Fragment>
				) }
			</KadencePanelBody>
		);
	}
}
export default ( MailerLiteControls );
