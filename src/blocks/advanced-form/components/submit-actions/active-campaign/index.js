/**
 * Active Campaign Controls
 *
 */

/**
 * Imports
 */
import Select from 'react-select';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { getFormFields } from '../../';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {
	Fragment,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import {
	TextControl,
	Button,
	Spinner,
	ToggleControl,
	SelectControl,
	ExternalLink,
} from '@wordpress/components';
import { KadencePanelBody } from '@kadence/components';

const HELP_URL = 'https://ithemes92330.activehosted.com/app/settings/developer';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
function ActiveCampaignOptions( { formInnerBlocks, parentClientId, settings, save } ) {

	const [ api, setApi ] = useState( '' );
	const [ isSavedApi, setIsSavedApi ] = useState( false );
	const [ apiBase, setApiBase ] = useState( '' );
	const [ isSavedApiBase, setIsSavedApiBase ] = useState( false );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ lists, setLists ] = useState( false );
	const [ isFetching, setIsFetching ] = useState( false );
	const [ listsLoaded, setListsLoaded ] = useState( false );
	const [ isFetchingAttributes, setIsFetchingAttributes ] = useState( false );
	const [ listAttr, setListAttr ] = useState( false );
	const [ listAttrLoaded, setListAttrLoaded ] = useState( false );
	const [ isFetchingGroups, setIsFetchingAutomations ] = useState( false );
	const [ automations, setAutomations ] = useState( false );
	const [ automationLoaded, setAutomationsLoaded ] = useState( false );
	const [ isFetchingTags, setIsFetchingTags ] = useState( false );
	const [ tags, setTags ] = useState( false );
	const [ tagsLoaded, setTagsLoaded ] = useState( false );

	useEffect( () => {
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'GET',
		} ).then( ( response ) => {
			setApi( response.kadence_blocks_activecampaign_api_key );
			setApiBase( response.kadence_blocks_activecampaign_api_base );

			if ( '' !== response.kadence_blocks_activecampaign_api_key && '' !== response.kadence_blocks_activecampaign_api_base ) {
				setIsSavedApi( true );
				setIsSavedApiBase( true );
			}
		});

	}, [] );

	const fields = useMemo( () => getFormFields( formInnerBlocks ), [ parentClientId ] );

	const saveMap = ( value, uniqueID ) => {
		let updatedMap = { ...settings.map }
		updatedMap[uniqueID] = value;
		save( { map: updatedMap } );
	};

	const getLists = () => {
		if ( !api ) {
			setLists( [] );
			setListsLoaded( true );
			return;
		}

		setIsFetching( true );

		apiFetch( {
			path: addQueryArgs(
				'/kb-activecampaign/v1/get',
				{ endpoint: 'lists' },
			),
		} )
			.then( ( lists ) => {
				const theLists = [];
				lists.map( ( item ) => {
					theLists.push( { value: item.id, label: item.name } );
				} );

				setLists( theLists );
				setListsLoaded( true );
				setIsFetching( false );
			} )
			.catch( ( err ) => {
				setLists( [] );
				setListsLoaded( true );
				setIsFetching( false );
			} );
	};

	const getAutomations = () => {
		setIsFetchingAutomations( true );

		apiFetch( {
			path: addQueryArgs(
				'/kb-activecampaign/v1/get',
				{ endpoint: 'automations' },
			),
		} )
			.then( ( automations ) => {
				const theAutomations = [];
				automations.map( ( item ) => {
					theAutomations.push( { value: item.id, label: item.name } );
				} );

				setAutomations( theAutomations );
				setAutomationsLoaded( true );
				setIsFetchingAutomations( false );
			} )
			.catch( (err) => {
				setAutomations( [] );
				setAutomationsLoaded( true );
				setIsFetchingAutomations( false );
			} );
	};

	const getTags = () => {
		setIsFetchingTags( true );

		apiFetch( {
			path: addQueryArgs(
				'/kb-activecampaign/v1/get',
				{ endpoint: 'tags' },
			),
		} )
			.then( ( tags ) => {
				const theTags = [];
				if ( tags ) {
					tags.map( ( item ) => {
						theTags.push( { value: item.id, label: item.tag } );
					} );
				}

				setTags( theTags );
				setTagsLoaded( true );
				setIsFetchingTags( false );
			} )
			.catch( () => {
				setTags( [] );
				setTagsLoaded( true );
				setIsFetchingTags( false );
			} );
	};

	const getAttributes = () => {
		setIsFetchingAttributes( true );

		apiFetch( {
			path: addQueryArgs(
				'/kb-activecampaign/v1/get',
				{ endpoint: 'fields' },
			),
		} )
			.then( ( list ) => {
				const theAttributes = [];
				theAttributes.push( { value: null, label: 'None' } );
				theAttributes.push( { value: 'email', label: __('Email', 'kadence-blocks' ) + ' *' } );
				theAttributes.push( { value: 'firstName', label: __('First Name', 'kadence-blocks' ) } );
				theAttributes.push( { value: 'lastName', label: __( 'Last Name', 'kadence-blocks' ) } );
				theAttributes.push( { value: 'phone', label: __('Phone', 'kadence-blocks' ) } );

				list.fields.map( ( item, index ) => {
					theAttributes.push( { value: item.id, label: item.title } );
				} );

				setListAttr( theAttributes );
				setListAttrLoaded( true );
				setIsFetchingAttributes( false );
			} )
			.catch( () => {
				const theAttributes = [];
				theAttributes.push( { value: null, label: 'None' } );
				theAttributes.push( { value: 'email', label: __('Email', 'kadence-blocks' ) + ' *' } );
				theAttributes.push( { value: 'firstName', label: __('First Name', 'kadence-blocks' ) } );
				theAttributes.push( { value: 'lastName', label: __( 'Last Name', 'kadence-blocks' ) } );
				theAttributes.push( { value: 'phone', label: __('Phone', 'kadence-blocks' ) } );

				setListAttr( theAttributes );
				setListAttrLoaded( true );
				setIsFetchingAttributes( false );
			} );
	};

	const removeAPI = () => {
		setApi( '' );
		setApiBase( '' );
		setIsSaving( true );

		const settingModel = new wp.api.models.Settings( {
			kadence_blocks_activecampaign_api_key : '',
			kadence_blocks_activecampaign_api_base: '',
		} );
		settingModel.save().then( () => {
			setIsSavedApi( false );
			setIsSavedApiBase( false );
			setIsSaving( false );
		} );

	};

	const saveAPI = () => {
		setIsSaving( true );

		const settingModel = new wp.api.models.Settings( {
			kadence_blocks_activecampaign_api_key : api,
			kadence_blocks_activecampaign_api_base: apiBase,
		} );
		settingModel.save().then( response => {
			setIsSaving( false );
			setIsSavedApi( true );
			setIsSavedApiBase( true );
		} );
	};

	const hasLists = Array.isArray( lists ) && lists.length > 0;
	const hasAttr = Array.isArray( listAttr ) && listAttr.length > 0;
	const hasAutomations = Array.isArray( automations ) && automations.length > 0;
	const hasTags = Array.isArray( tags ) && tags.length > 0;

	return (
		<KadencePanelBody
			title={__( 'ActiveCampaign Settings', 'kadence-blocks' )}
			initialOpen={false}
			panelName={'kb-activecampaign-settings'}
		>
			<p>
				<ExternalLink href={HELP_URL}>{__( 'Get help', 'kadence-blocks' )}</ExternalLink>
			</p>
			<TextControl
				label={__( 'API Key', 'kadence-blocks' )}
				value={api}
				onChange={value => setApi( value )}
			/>
			<TextControl
				label={__( 'API URL', 'kadence-blocks' )}
				placeholder={'https://youaccount.api-us1.com'}
				value={apiBase}
				onChange={value => setApiBase( value )}
			/>
			<div className="components-base-control">
				<Button
					isPrimary
					onClick={() => saveAPI()}
					disabled={'' === api}
				>
					{isSaving ? __( 'Saving', 'kadence-blocks' ) : __( 'Save', 'kadence-blocks' )}
				</Button>
				{api !== '' && (
					<Fragment>
						&nbsp;
						<Button
							isSecondary
							onClick={() => removeAPI()}
						>
							{__( 'Remove', 'kadence-blocks' )}
						</Button>
					</Fragment>
				)}
			</div>
			{isSavedApi && isSavedApiBase && (
				<Fragment>
					{isFetching && (
						<Spinner/>
					)}
					{!isFetching && !hasLists && (
						<Fragment>
							<h2 className="kt-heading-size-title">{__( 'Select List', 'kadence-blocks' )}</h2>
							{( !listsLoaded ? getLists() : '' )}
							{!Array.isArray( lists ) ?
								<Spinner/> :
								__( 'No Lists found.', 'kadence-blocks' )}
						</Fragment>

					)}
					{!isFetching && hasLists && (
						<Fragment>
							<h2 className="kt-heading-size-title">{__( 'Select List', 'kadence-blocks' )}</h2>
							<Select
								value={( undefined !== settings && undefined !== settings && undefined !== settings.list ? settings.list : '' )}
								onChange={( value ) => {
									save( { list: ( value ? value : {} ) } );
								}}
								id={'mc-list-selection'}
								isClearable={true}
								options={lists}
								isMulti={false}
								maxMenuHeight={200}
								placeholder={__( 'Select List' )}
							/>

							<Fragment>
								{isFetchingGroups && (
									<Spinner/>
								)}
								{!isFetchingGroups && !hasAutomations && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__( 'Select Automation', 'kadence-blocks' )}</h2>
										{( !automationLoaded ? getAutomations() : '' )}
										{!Array.isArray( automations ) ?
											<Spinner/> :
											__( 'No Groups found.', 'kadence-blocks' )}
									</Fragment>
								)}
								{ ! isFetchingGroups && hasAutomations && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__( 'Select Automation', 'kadence-blocks' )}</h2>
										<Select
											value={( undefined !== settings && undefined !== settings && undefined !== settings.automation ? settings.automation : '' )}
											onChange={( value ) => {
												save( { automation: ( value ? value : [] ) } );
											}}
											id={'mc-automation-selection'}
											isClearable={true}
											options={automations}
											maxMenuHeight={200}
											placeholder={__( 'Select Automation' )}
										/>
									</Fragment>
								)}
								{isFetchingTags && (
									<Spinner/>
								)}
								{!isFetchingTags && !hasTags && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__( 'Select Tags', 'kadence-blocks' )}</h2>
										{( !tagsLoaded ? getTags() : '' )}
										{!Array.isArray( tags ) ?
											<Spinner/> :
											__( 'No Tags found.', 'kadence-blocks' )}
									</Fragment>

								)}
								{!isFetchingTags && hasTags && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__( 'Select Tags', 'kadence-blocks' )}</h2>
										<Select
											value={( undefined !== settings && undefined !== settings && undefined !== settings.tags ? settings.tags : '' )}
											onChange={( value ) => {
												save( { tags: ( value ? value : [] ) } );
											}}
											id={'mc-tag-selection'}
											isClearable={true}
											options={tags}
											isMulti={true}
											maxMenuHeight={200}
											placeholder={__( 'Select Tags' )}
										/>
									</Fragment>
								)}
								{isFetchingAttributes && (
									<Spinner/>
								)}
								{!isFetchingAttributes && !hasAttr && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__( 'Map Fields', 'kadence-blocks' )}</h2>
										{( !listAttrLoaded ? getAttributes() : '' )}
										{!Array.isArray( listAttr ) ?
											<Spinner/> :
											__( 'No Fields found.', 'kadence-blocks' )}
									</Fragment>

								)}
								{!isFetchingAttributes && hasAttr && (
									<Fragment>
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
															options={listAttr}
															value={( undefined !== settings.map && undefined !== settings.map[ item.uniqueID ] && settings.map[ item.uniqueID ] ? settings.map[ item.uniqueID ] : '' )}
															onChange={( value ) => {
																saveMap( value, item.uniqueID );
															}}
														/>
													</div>
												);
											} )
										)}
									</Fragment>
								)}
							</Fragment>
						</Fragment>
					)}
				</Fragment>
			)}
		</KadencePanelBody>
	);
}

export default ( ActiveCampaignOptions );
