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
import { useEffect, useMemo, useState } from '@wordpress/element';
import { TextControl, Button, Spinner, ToggleControl, SelectControl, ExternalLink } from '@wordpress/components';
import { KadencePanelBody, ObfuscateTextControl } from '@kadence/components';
import TagSearch from './tag-search';

const HELP_URL = 'https://help.activecampaign.com/hc/en-us/articles/207317590-Getting-started-with-the-API/';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
function ActiveCampaignOptions({ formInnerBlocks, parentClientId, settings, save }) {
	const [api, setApi] = useState('');
	const [isSavedApi, setIsSavedApi] = useState(false);
	const [isLoadingSettings, setIsLoadingSettings] = useState(true);
	const [apiBase, setApiBase] = useState('');
	const [isSavedApiBase, setIsSavedApiBase] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isSavingBase, setIsSavingBase] = useState(false);
	const [lists, setLists] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [listsLoaded, setListsLoaded] = useState(false);
	const [isFetchingAttributes, setIsFetchingAttributes] = useState(false);
	const [listAttr, setListAttr] = useState(false);
	const [listAttrLoaded, setListAttrLoaded] = useState(false);
	const [isFetchingGroups, setIsFetchingAutomations] = useState(false);
	const [automations, setAutomations] = useState(false);
	const [automationLoaded, setAutomationsLoaded] = useState(false);
	const [isFetchingTags, setIsFetchingTags] = useState(false);
	const [tags, setTags] = useState(false);
	const [tagSearch, setTagSearch] = useState('');
	const [tagsLoaded, setTagsLoaded] = useState(false);

	useEffect(() => {
		apiFetch({
			path: '/wp/v2/settings',
			method: 'GET',
		}).then((response) => {
			setApi(response.kadence_blocks_activecampaign_api_key);
			setApiBase(response.kadence_blocks_activecampaign_api_base);
			setIsLoadingSettings(false);
			if (
				'' !== response.kadence_blocks_activecampaign_api_key &&
				'' !== response.kadence_blocks_activecampaign_api_base
			) {
				setIsSavedApi(true);
				setIsSavedApiBase(true);
			}
		});
	}, []);

	const fields = useMemo(() => getFormFields(formInnerBlocks), [parentClientId]);

	const saveMap = (value, uniqueID) => {
		const updatedMap = { ...settings.map };
		updatedMap[uniqueID] = value;
		save({ map: updatedMap });
	};

	const getLists = () => {
		if (!api) {
			setLists([]);
			setListsLoaded(true);
			return;
		}

		setIsFetching(true);

		apiFetch({
			path: addQueryArgs('/kb-activecampaign/v1/get', { endpoint: 'lists', queryargs: ['limit=200'] }),
		})
			.then((lists) => {
				const theLists = [];
				lists.map((item) => {
					theLists.push({ value: item.id, label: item.name });
				});

				setLists(theLists);
				setListsLoaded(true);
				setIsFetching(false);
			})
			.catch((err) => {
				setLists([]);
				setListsLoaded(true);
				setIsFetching(false);
			});
	};

	const getAutomations = () => {
		setIsFetchingAutomations(true);

		apiFetch({
			path: addQueryArgs('/kb-activecampaign/v1/get', { endpoint: 'automations' }),
		})
			.then((automations) => {
				const theAutomations = [];
				automations.map((item) => {
					theAutomations.push({ value: item.id, label: item.name });
				});

				setAutomations(theAutomations);
				setAutomationsLoaded(true);
				setIsFetchingAutomations(false);
			})
			.catch((err) => {
				setAutomations([]);
				setAutomationsLoaded(true);
				setIsFetchingAutomations(false);
			});
	};

	const getTags = () => {
		setIsFetchingTags(true);

		apiFetch({
			path: addQueryArgs('/kb-activecampaign/v1/get', {
				endpoint: 'tags',
				queryargs: ['search=' + tagSearch],
			}),
		})
			.then((tags) => {
				const theTags = [];
				if (tags) {
					tags.map((item) => {
						theTags.push({ value: item.id, label: item.tag });
					});
				}

				setTags(theTags);
				setTagsLoaded(true);
				setIsFetchingTags(false);
			})
			.catch(() => {
				setTags([]);
				setTagsLoaded(true);
				setIsFetchingTags(false);
			});
	};

	const getAttributes = () => {
		setIsFetchingAttributes(true);

		apiFetch({
			path: addQueryArgs('/kb-activecampaign/v1/get', {
				endpoint: 'fields',
				queryargs: ['count=300', 'offset=0'],
			}),
		})
			.then((list) => {
				const theAttributes = [];
				theAttributes.push({ value: null, label: 'None' });
				theAttributes.push({ value: 'email', label: __('Email', 'kadence-blocks') + ' *' });
				theAttributes.push({ value: 'firstName', label: __('First Name', 'kadence-blocks') });
				theAttributes.push({ value: 'lastName', label: __('Last Name', 'kadence-blocks') });
				theAttributes.push({ value: 'phone', label: __('Phone', 'kadence-blocks') });
				theAttributes.push({ value: 'acct_name', label: __('Account', 'kadence-blocks') });
				theAttributes.push({ value: 'contact_jobtitle', label: __('Job Title', 'kadence-blocks') });

				list.map((item, index) => {
					theAttributes.push({ value: item.id, label: item.title });
				});

				setListAttr(theAttributes);
				setListAttrLoaded(true);
				setIsFetchingAttributes(false);
			})
			.catch(() => {
				const theAttributes = [];
				theAttributes.push({ value: null, label: 'None' });
				theAttributes.push({ value: 'email', label: __('Email', 'kadence-blocks') + ' *' });
				theAttributes.push({ value: 'firstName', label: __('First Name', 'kadence-blocks') });
				theAttributes.push({ value: 'lastName', label: __('Last Name', 'kadence-blocks') });
				theAttributes.push({ value: 'phone', label: __('Phone', 'kadence-blocks') });
				theAttributes.push({ value: 'acct_name', label: __('Account', 'kadence-blocks') });
				theAttributes.push({ value: 'contact_jobtitle', label: __('Job Title', 'kadence-blocks') });

				setListAttr(theAttributes);
				setListAttrLoaded(true);
				setIsFetchingAttributes(false);
			});
	};

	const removeAPI = () => {
		setApi('');
		setApiBase('');
		setIsSaving(true);

		const settingModel = new wp.api.models.Settings({
			kadence_blocks_activecampaign_api_key: '',
			kadence_blocks_activecampaign_api_base: '',
		});
		settingModel.save().then(() => {
			setIsSavedApi(false);
			setIsSavedApiBase(false);
			setIsSaving(false);
		});
	};

	const saveAPI = (value) => {
		setIsSaving(true);
		apiFetch({
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_activecampaign_api_key: value },
		}).then(() => {
			setApi(value);
			setIsSaving(false);
			setIsSavedApi(true);
		});
	};

	const saveAPIBase = (value) => {
		setIsSavingBase(true);
		apiFetch({
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_activecampaign_api_base: value },
		}).then(() => {
			setApiBase(value);
			setIsSavingBase(false);
			setIsSavedApiBase(true);
		});
	};

	const hasLists = Array.isArray(lists) && lists.length > 0;
	const hasAttr = Array.isArray(listAttr) && listAttr.length > 0;
	const hasAutomations = Array.isArray(automations) && automations.length > 0;
	const hasTags = Array.isArray(tags) && tags.length > 0;
	const listValue =
		undefined !== settings.listMulti && settings.listMulti
			? settings.listMulti
			: undefined !== settings.list && settings.list
				? [settings.list]
				: '';
	return (
		<KadencePanelBody
			title={__('ActiveCampaign Settings', 'kadence-blocks')}
			initialOpen={false}
			panelName={'kb-activecampaign-settings'}
		>
			<p>
				<ExternalLink href={HELP_URL}>{__('Get help', 'kadence-blocks')}</ExternalLink>
			</p>
			{isLoadingSettings && <Spinner />}
			{!isLoadingSettings && (
				<>
					<ObfuscateTextControl
						label={__('API Key', 'kadence-blocks')}
						value={api}
						onChange={(value) => saveAPI(value)}
						isSaving={isSaving}
					/>
					<ObfuscateTextControl
						label={__('API URL', 'kadence-blocks')}
						value={apiBase}
						obfuscate={false}
						placeholder={'https://youaccount.api-us1.com'}
						onChange={(value) => saveAPIBase(value)}
						isSaving={isSavingBase}
					/>
				</>
			)}
			{isSavedApi && isSavedApiBase && (
				<>
					{isFetching && <Spinner />}
					{!isFetching && !hasLists && (
						<>
							<h2 className="kt-heading-size-title">{__('Select List', 'kadence-blocks')}</h2>
							{!listsLoaded ? getLists() : ''}
							{!Array.isArray(lists) ? <Spinner /> : __('No Lists found.', 'kadence-blocks')}
						</>
					)}
					{!isFetching && hasLists && (
						<>
							<div className="components-base-control">
								<span className="kt-heading-size-title">{__('Select List', 'kadence-blocks')}</span>
								<Select
									value={listValue}
									onChange={(value) => {
										save({ listMulti: value ? value : [], list: {} });
									}}
									id={'mc-list-selection'}
									isClearable={true}
									options={lists}
									isMulti={true}
									maxMenuHeight={200}
									placeholder={__('Select List', 'kadence-blocks')}
								/>
							</div>

							<>
								{isFetchingGroups && <Spinner />}
								{!isFetchingGroups && !hasAutomations && (
									<>
										<h2 className="kt-heading-size-title">
											{__('Select Automation (Optional)', 'kadence-blocks')}
										</h2>
										{!automationLoaded ? getAutomations() : ''}
										{!Array.isArray(automations) ? (
											<Spinner />
										) : (
											__('No Groups found.', 'kadence-blocks')
										)}
									</>
								)}
								{!isFetchingGroups && hasAutomations && (
									<>
										<div className="components-base-control">
											<span className="kt-heading-size-title">
												{__('Select Automation (Optional)', 'kadence-blocks')}
											</span>
											<Select
												value={
													undefined !== settings &&
													undefined !== settings &&
													undefined !== settings.automation
														? settings.automation
														: ''
												}
												onChange={(value) => {
													save({ automation: value ? value : [] });
												}}
												id={'mc-automation-selection'}
												isClearable={true}
												options={automations}
												maxMenuHeight={200}
												placeholder={__('Select Automation')}
											/>
										</div>
									</>
								)}
								{isFetchingTags && <Spinner />}
								{!isFetchingTags && !hasTags && (
									<>
										<h2 className="kt-heading-size-title">
											{__('Select Tags (Optional)', 'kadence-blocks')}
										</h2>
										{!tagsLoaded ? getTags() : ''}
										{!Array.isArray(tags) ? <Spinner /> : __('No Tags found.', 'kadence-blocks')}
									</>
								)}
								{!isFetchingTags && hasTags && (
									<div className="components-base-control">
										<div className="kadence-select-tags-title-wrap">
											<span className="kt-heading-size-title">
												{__('Select Tags (Optional)', 'kadence-blocks')}
											</span>
											<TagSearch
												value={tagSearch}
												onChange={(value) => {
													setTagSearch(value);
												}}
												onAction={() => {
													getTags();
												}}
											/>
										</div>
										<Select
											value={
												undefined !== settings && undefined !== settings.tags
													? settings.tags
													: ''
											}
											onChange={(value) => {
												save({ tags: value ? value : [] });
											}}
											id={'mc-tag-selection'}
											isClearable={true}
											options={tags}
											isMulti={true}
											maxMenuHeight={200}
											placeholder={__('Select Tags')}
										/>
									</div>
								)}
								{isFetchingAttributes && <Spinner />}
								{!isFetchingAttributes && !hasAttr && (
									<>
										<h2 className="kt-heading-size-title">{__('Map Fields', 'kadence-blocks')}</h2>
										{!listAttrLoaded ? getAttributes() : ''}
										{!Array.isArray(listAttr) ? (
											<Spinner />
										) : (
											__('No Fields found.', 'kadence-blocks')
										)}
									</>
								)}
								{!isFetchingAttributes && hasAttr && (
									<>
										<div className="components-base-control">
											<span className="kt-heading-size-title">
												{__('Map Fields', 'kadence-blocks')}
											</span>
											{fields &&
												fields.map((item, index) => {
													return (
														<div key={index} className="kb-field-map-item">
															<div className="kb-field-map-item-form">
																<p className="kb-field-map-item-label">
																	{__('Form Field', 'kadence-blocks')}
																</p>
																<p className="kb-field-map-item-name">{item.label}</p>
															</div>
															<SelectControl
																label={__('Select Field:')}
																options={listAttr}
																value={
																	undefined !== settings.map &&
																	undefined !== settings.map[item.uniqueID] &&
																	settings.map[item.uniqueID]
																		? settings.map[item.uniqueID]
																		: ''
																}
																onChange={(value) => {
																	saveMap(value, item.uniqueID);
																}}
															/>
														</div>
													);
												})}
										</div>
									</>
								)}
							</>
							<div style={{ height: '10px' }}></div>
							<ToggleControl
								label={__('Require Double Opt In?', 'kadence-blocks')}
								help={__(
									'This will set the status of the contact to unconfirmed, you must setup an automation in ActiveCampaign to email the contact and update the status after confirmation.',
									'kadence-blocks'
								)}
								checked={undefined !== settings.doubleOptin ? settings.doubleOptin : false}
								onChange={(value) => {
									save({ doubleOptin: value });
								}}
							/>
						</>
					)}
				</>
			)}
		</KadencePanelBody>
	);
}

export default ActiveCampaignOptions;
