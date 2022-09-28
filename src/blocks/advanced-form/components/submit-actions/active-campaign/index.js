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
function ActiveCampaignOptions( { settings, save, parentClientId } ) {

	const [ api, setApi ] = useState( '' );
	const [ isSavedApi, setIsSavedApi ] = useState( false );
	const [ apiBase, setApiBase ] = useState( '' );
	const [ isSavedApiBase, setIsSavedApiBase ] = useState( false );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ list, setList ] = useState( false );
	const [ isFetching, setIsFetching ] = useState( false );
	const [ listsLoaded, setListsLoaded ] = useState( false );
	const [ isFetchingAttributes, setIsFetchingAttributes ] = useState( false );
	const [ listAttr, setListAttr ] = useState( false );
	const [ listAttrLoaded, setListAttrLoaded ] = useState( false );
	const [ isFetchingGroups, setIsFetchingGroups ] = useState( false );
	const [ listGroups, setListGroups ] = useState( false );
	const [ listGroupLoaded, setListGroupLoaded ] = useState( false );
	const [ isFetchingTags, setIsFetchingTags ] = useState( false );
	const [ listTags, setListTags ] = useState( false );
	const [ listTagsLoaded, setListTagsLoaded ] = useState( false );

	useEffect( () => {
		let apiSettings;
		wp.api.loadPromise.then( () => {
			apiSettings = new wp.api.models.Settings();
			apiSettings.fetch().then( response => {
				setApi( response.kadence_blocks_activecampaign_api_key );
				setApiBase( response.kadence_blocks_activecampaign_api_base );

				if ( '' !== response.kadence_blocks_activecampaign_api_key && '' !== response.kadence_blocks_activecampaign_api_base ) {
					setIsSavedApi( true );
					setIsSavedApiBase( true );
				}
			} );
		} );
	}, [] );

	const fields = useMemo( () => getFormFields( parentClientId ), [ parentClientId ] );

	const saveMap = ( value, index ) => {
		const newItems = fields.map( ( item, thisIndex ) => {
			let newString = '';
			if ( index === thisIndex ) {
				newString = value;
			} else if ( undefined !== settings.map && undefined !== settings.map[ thisIndex ] ) {
				newString = settings.map[ thisIndex ];
			} else {
				newString = '';
			}

			return newString;
		} );
		save( { map: newItems } );
	};

	const getLists = () => {

		if ( !api ) {
			setList( [] );
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
			.then( ( list ) => {
				const theLists = [];
				list.lists.map( ( item ) => {
					theLists.push( { value: item.id, label: item.name } );
				} );

				setList( theLists );
				setListsLoaded( true );
				setIsFetching( false );
			} )
			.catch( ( err ) => {
				setList( [] );
				setListsLoaded( true );
				setIsFetching( false );
			} );
	};

	const getAutomations = () => {
		setIsFetchingGroups( true );

		apiFetch( {
			path: addQueryArgs(
				'/kb-activecampaign/v1/get',
				{ endpoint: 'automations' },
			),
		} )
			.then( ( list ) => {
				const theGroups = [];
				list.automations.map( ( item ) => {
					theGroups.push( { value: item.id, label: item.name } );
				} );

				setListGroups( theGroups );
				setListGroupLoaded( true );
				setIsFetchingGroups( false );
			} )
			.catch( () => {
				setListGroups( [] );
				setListGroupLoaded( true );
				setIsFetchingGroups( false );
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
			.then( ( list ) => {
				const theTags = [];
				if ( list.tags ) {
					list.tags.map( ( item ) => {
						theTags.push( { value: item.id, label: item.tag } );
					} );
				}

				setListTags( theTags );
				setListTagsLoaded( true );
				setIsFetchingTags( false );
			} )
			.catch( () => {
				setListTags( [] );
				setListTagsLoaded( true );
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

	const hasList = Array.isArray( list ) && list.length;
	const hasAttr = Array.isArray( listAttr ) && listAttr.length;
	const hasGroups = Array.isArray( listGroups ) && listGroups.length;
	const hasTags = Array.isArray( listTags ) && listTags.length;

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
					{!isFetching && !hasList && (
						<Fragment>
							<h2 className="kt-heading-size-title">{__( 'Select List', 'kadence-blocks' )}</h2>
							{( !listsLoaded ? getLists() : '' )}
							{!Array.isArray( list ) ?
								<Spinner/> :
								__( 'No Lists found.', 'kadence-blocks' )}
						</Fragment>

					)}
					{!isFetching && hasList && (
						<Fragment>
							<h2 className="kt-heading-size-title">{__( 'Select List', 'kadence-blocks' )}</h2>
							<Select
								value={( undefined !== settings && undefined !== settings && undefined !== settings.list ? settings.list : '' )}
								onChange={( value ) => {
									save( { list: ( value ? value : [] ) } );
								}}
								id={'mc-list-selection'}
								isClearable={true}
								options={list}
								isMulti={false}
								maxMenuHeight={200}
								placeholder={__( 'Select List' )}
							/>

							<Fragment>
								{isFetchingGroups && (
									<Spinner/>
								)}
								{!isFetchingGroups && !hasGroups && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__( 'Select Automation', 'kadence-blocks' )}</h2>
										{( !listGroupLoaded ? getAutomations() : '' )}
										{!Array.isArray( listGroups ) ?
											<Spinner/> :
											__( 'No Groups found.', 'kadence-blocks' )}
									</Fragment>

								)}
								{!isFetchingGroups && hasGroups && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__( 'Select Automation', 'kadence-blocks' )}</h2>
										<Select
											value={( undefined !== settings && undefined !== settings && undefined !== settings.groups ? settings.groups : '' )}
											onChange={( value ) => {
												save( { groups: ( value ? value : [] ) } );
											}}
											id={'mc-automation-selection'}
											isClearable={true}
											options={listGroups}
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
										{( !listTagsLoaded ? getTags() : '' )}
										{!Array.isArray( listTags ) ?
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
											options={listTags}
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
															value={( undefined !== settings.map && undefined !== settings.map[ index ] && settings.map[ index ] ? settings.map[ index ] : '' )}
															onChange={( value ) => {
																saveMap( value, index );
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
