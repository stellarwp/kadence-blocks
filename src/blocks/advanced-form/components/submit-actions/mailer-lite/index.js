/**
 * Mailer Lite Controls
 *
 */

/**
 * Imports
 */
import Select from 'react-select';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { KadencePanelBody } from '@kadence/components';
import { getFormFields } from '../../';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {
	useState,
	useEffect, useMemo,
} from '@wordpress/element';
import {
	TextControl,
	Button,
	Spinner,
	SelectControl,
	ExternalLink,
} from '@wordpress/components';

const RETRIEVE_API_URL = 'https://app.mailerlite.com/integrations/api/';
const HELP_URL = 'https://help.mailerlite.com/article/show/35040-where-can-i-find-the-api-key';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */

export default function MailerLiteOptions( { formInnerBlocks, parentClientId, settings, save } ) {

	const [ api, setAPI ] = useState( '' );
	const [ isSavedAPI, setIsSavedAPI ] = useState( false );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ groups, setGroups ] = useState( false );
	const [ isFetching, setIsFetching ] = useState( false );
	const [ groupsLoaded, setGroupsLoaded ] = useState( false );
	const [ isFetchingFields, setIsFetchingFields ] = useState( false );
	const [ groupFields, setGroupFields ] = useState( false );
	const [ groupFieldsLoaded, setGroupFieldsLoaded ] = useState( false );

	useEffect( () => {
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'GET',
		} ).then( ( response ) => {
			setAPI( response.kadence_blocks_mailerlite_api );

			if ( '' !== response.kadence_blocks_mailerlite_api ) {
				setIsSavedAPI( true );
			}
		});
	}, [] );

	const fields = useMemo(() => getFormFields( formInnerBlocks ), [ parentClientId ]);

	const saveMap = ( value, uniqueID ) => {
		let updatedMap = { ...settings.map }
		updatedMap[uniqueID] = value;
		save( { map: updatedMap } );
	};

	const getMailerLiteGroups = () => {
		if ( !api ) {
			setGroups( [] );
			setGroupsLoaded( true );
			return;
		}

		setIsFetching( true );

		apiFetch( {
			path: addQueryArgs(
				'/kb-mailerlite/v1/get',
				{ apikey: api, endpoint: 'groups', queryargs: [ 'limit=500' ] },
			),
		} )
			.then( ( groups ) => {
				const theGroups = [];
				groups.data.map( ( item ) => {
					theGroups.push( { value: item.id, label: item.name } );
				} );

				setGroups( theGroups );
				setGroupsLoaded( true );
				setIsFetching( false );
			} )
			.catch( () => {
				console.log('err')
				setGroups( [] );
				setGroupsLoaded( true );
				setIsFetching( false );
			} );
	};

	const getMailerLiteFields = () => {
		if ( !api ) {
			const theFields = [];
			theFields.push( { value: null, label: 'None' } );
			theFields.push( { value: 'email', label: 'Email *' } );

			setGroupFields( theFields );
			setGroupFieldsLoaded( true );

			return;
		}

		setIsFetchingFields( true );
		apiFetch( {
			path: addQueryArgs(
				'/kb-mailerlite/v1/get',
				{ apikey: api, endpoint: 'fields' },
			),
		} )
			.then( ( fields ) => {
				const theFields = [];
				theFields.push( { value: null, label: 'None' } );
				theFields.push( { value: 'email', label: 'Email *' } );
				fields.data.map( ( item, index ) => {
					if ( item.key !== 'email' ) {
						theFields.push( { value: item.key, label: item.name } );
					}
				} );

				setGroupFields( theFields );
				setGroupFieldsLoaded( true );
				setIsFetchingFields( false );
			} )
			.catch( ( err ) => {
				const theFields = [];
				theFields.push( { value: null, label: 'None' } );
				theFields.push( { value: 'email', label: 'Email *' } );

				setGroupFields( theFields );
				setGroupFieldsLoaded( true );
				setIsFetchingFields( false );
			} );
	};

	const removeAPI = () => {
		setAPI( '' );

		if ( isSavedAPI ) {
			setIsSaving( true );

			const settingModel = new wp.api.models.Settings( {
				kadence_blocks_mailerlite_api: '',
			} );
			settingModel.save().then( () => {
				setIsSavedAPI( false );
				setIsSaving( false );
			} );
		}
	};

	const saveAPI = () => {
		setIsSaving( true );
		const settingModel = new wp.api.models.Settings( {
			kadence_blocks_mailerlite_api: api,
		} );
		settingModel.save().then( response => {
			setIsSaving( false );
			setIsSavedAPI( true );
		} );
	};

	const hasGroups = Array.isArray( groups ) && groups.length;
	const hasFields = Array.isArray( groupFields ) && groupFields.length;

	return (
		<KadencePanelBody
			title={__( 'MailerLite Settings', 'kadence-blocks-pro' )}
			initialOpen={false}
			panelName={'kb-mailerlite-settings'}
		>
			<p>
				<>
					<ExternalLink href={RETRIEVE_API_URL}>{__( 'Get API Key', 'kadence-blocks-pro' )}</ExternalLink>
					|&nbsp;
					<ExternalLink href={HELP_URL}>{__( 'Get help', 'kadence-blocks-pro' )}</ExternalLink>
				</>
			</p>
			<TextControl
				label={__( 'API Key', 'kadence-blocks' )}
				value={api}
				onChange={value => setAPI( value )}
			/>
			<div className="components-base-control">
				<Button
					isPrimary
					onClick={() => saveAPI() }
					disabled={'' === api}
				>
					{isSaving ? __( 'Saving', 'kadence-blocks-pro' ) : __( 'Save', 'kadence-blocks-pro' )}
				</Button>
				{isSavedAPI && (
					<>
						&nbsp;
						<Button
							isSecondary
							onClick={() => removeAPI()}
						>
							{__( 'Remove', 'kadence-blocks-pro' )}
						</Button>
					</>
				)}
			</div>
			{isSavedAPI && (
				<>
					{isFetching && (
						<Spinner/>
					)}
					{!isFetching && !hasGroups && (
						<>
							<h2 className="kt-heading-size-title">{__( 'Select a Group', 'kadence-blocks' )}</h2>
							{( !groupsLoaded ? getMailerLiteGroups() : '' )}
							{!Array.isArray( groups ) ?
								<Spinner/> :
								__( 'No group found.', 'kadence-blocks-pro' )}
						</>

					)}
					{!isFetching && hasGroups && (
						<>
							<h2 className="kt-heading-size-title">{__( 'Select Group', 'kadence-blocks' )}</h2>
							<div className="mailerlite-select-form-row">
								<Select
									value={( undefined !== settings && undefined !== settings && undefined !== settings.group ? settings.group : '' )}
									onChange={( value ) => {
										save( { group: ( value ? value : {} ) } );
									}}
									placeholder={__( 'Select a Group', 'kadence-blocks' )}
									maxMenuHeight={300}
									options={groups}
									isMulti={false}
								/>
							</div>
							{!settings.group && (
								<div style={{ height: '100px' }}></div>
							)}
							{settings.group && (
								<>
									{isFetchingFields && (
										<Spinner/>
									)}
									{!isFetchingFields && !hasFields && (
										<>
											<h2 className="kt-heading-size-title">{__( 'Map Fields', 'kadence-blocks' )}</h2>
											{( !groupFieldsLoaded ? getMailerLiteFields() : '' )}
											{!Array.isArray( groupFields ) ?
												<Spinner/> :
												__( 'No Fields found.', 'kadence-blocks-pro' )}
										</>

									)}
									{!isFetchingFields && hasFields && (
										<>
											<h2 className="kt-heading-size-title">{__( 'Map Fields', 'kadence-blocks' )}</h2>
											{fields && (
												fields.map( ( item, index ) => {
													return (
														<div key={index} className="kb-field-map-item">
															<div className="kb-field-map-item-form">
																<p className="kb-field-map-item-label">{__( 'Form Field', 'kadence-blocks' )}</p>
																<p className="kb-field-map-item-name">{item.label}</p>
															</div>
															<SelectControl
																label={__( 'Select Field:' )}
																options={groupFields}
																value={( undefined !== settings.map && undefined !== settings.map[ item.uniqueID ] && settings.map[ item.uniqueID ] ? settings.map[ item.uniqueID ] : '' )}
																onChange={( value ) => {
																	saveMap( value, item.uniqueID );
																}}
															/>
														</div>
													);
												} )
											)}
										</>
									)}
								</>
							)}
						</>
					)}
				</>
			)}
		</KadencePanelBody>
	);
}
