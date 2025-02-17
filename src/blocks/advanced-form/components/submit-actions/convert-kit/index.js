/**
 * SendInBlue Controls
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
import { Fragment, useEffect, useMemo, useState } from '@wordpress/element';
import { TextControl, Button, Spinner, ToggleControl, SelectControl, ExternalLink } from '@wordpress/components';
import { KadencePanelBody } from '@kadence/components';

const HELP_URL = 'https://app.kit.com/account_settings/developer_settings';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
function ConvertKitOptions({ formInnerBlocks, parentClientId, settings, save }) {
	const [api, setApi] = useState('');
	const [isSavedApi, setIsSavedApi] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [list, setList] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [listsLoaded, setListsLoaded] = useState(false);
	const [isFetchingAttributes, setIsFetchingAttributes] = useState(false);
	const [listAttr, setListAttr] = useState(false);
	const [listAttrLoaded, setListAttrLoaded] = useState(false);
	const [isFetchingGroups, setIsFetchingGroups] = useState(false);
	const [listGroups, setListGroups] = useState(false);
	const [listGroupLoaded, setListGroupLoaded] = useState(false);
	const [isFetchingTags, setIsFetchingTags] = useState(false);
	const [listTags, setListTags] = useState(false);
	const [listTagsLoaded, setListTagsLoaded] = useState(false);

	useEffect(() => {
		apiFetch({
			path: '/wp/v2/settings',
			method: 'GET',
		}).then((response) => {
			setApi(response.kadence_blocks_convertkit_api);

			if ('' !== response.kadence_blocks_convertkit_api) {
				setIsSavedApi(true);
			}
		});
	}, []);

	const fields = useMemo(() => getFormFields(formInnerBlocks), [parentClientId]);

	const saveMap = (value, uniqueID) => {
		const updatedMap = { ...settings.map };
		updatedMap[uniqueID] = value;
		save({ map: updatedMap });
	};

	const getConvertKitForms = () => {
		if (!api) {
			setList([]);
			setListsLoaded(true);
			return;
		}

		setIsFetching(true);

		apiFetch({
			path: addQueryArgs('/kb-convertkit/v1/get', { endpoint: 'forms' }),
		})
			.then((list) => {
				const theForms = [];
				list.forms.map((item) => {
					theForms.push({ value: item.id, label: item.name });
				});

				setList(theForms);
				setListsLoaded(true);
				setIsFetching(false);
			})
			.catch((err) => {
				setList([]);
				setListsLoaded(true);
				setIsFetching(false);
			});
	};

	const getConvertKitSequences = () => {
		setIsFetchingGroups(true);

		apiFetch({
			path: addQueryArgs('/kb-convertkit/v1/get', { endpoint: 'sequences' }),
		})
			.then((list) => {
				const theSequences = [];
				list.courses.map((item) => {
					theSequences.push({ value: item.id, label: item.name });
				});

				setListGroups(theSequences);
				setListGroupLoaded(true);
				setIsFetchingGroups(false);
			})
			.catch(() => {
				setListGroups([]);
				setListGroupLoaded(true);
				setIsFetchingGroups(false);
			});
	};

	const getTags = () => {
		setIsFetchingTags(true);

		apiFetch({
			path: addQueryArgs('/kb-convertkit/v1/get', { endpoint: 'tags' }),
		})
			.then((list) => {
				const theTags = [];
				if (list.tags) {
					list.tags.map((item) => {
						theTags.push({ value: item.id, label: item.name });
					});
				}

				setListTags(theTags);
				setListTagsLoaded(true);
				setIsFetchingTags(false);
			})
			.catch(() => {
				setListTags([]);
				setListTagsLoaded(true);
				setIsFetchingTags(false);
			});
	};

	const getConvertKitAttributes = () => {
		setIsFetchingAttributes(true);

		apiFetch({
			path: addQueryArgs('/kb-convertkit/v1/get', { endpoint: 'custom_fields' }),
		})
			.then((list) => {
				const theAttributes = [];
				theAttributes.push({ value: null, label: 'None' });
				theAttributes.push({ value: 'email', label: 'Email *' });
				theAttributes.push({ value: 'first_name', label: 'First Name' });

				if (list.custom_fields) {
					list.custom_fields.map((item) => {
						theAttributes.push({ value: item.key, label: item.label });
					});
				}

				setListAttr(theAttributes);
				setListAttrLoaded(true);
				setIsFetchingAttributes(false);
			})
			.catch((err) => {
				setListAttr([]);
				setListAttrLoaded(true);
				setIsFetchingAttributes(false);
			});
	};

	const removeAPI = () => {
		setApi('');

		if (isSavedApi) {
			setIsSaving(true);

			const settingModel = new wp.api.models.Settings({
				kadence_blocks_convertkit_api: '',
			});
			settingModel.save().then(() => {
				setIsSavedApi(false);
				setIsSaving(false);
			});
		}
	};

	const saveAPI = () => {
		setIsSaving(true);

		const settingModel = new wp.api.models.Settings({
			kadence_blocks_convertkit_api: api,
		});
		settingModel.save().then((response) => {
			setIsSaving(false);
			setIsSavedApi(true);
		});
	};

	const hasList = Array.isArray(list) && list.length > 0;
	const hasAttr = Array.isArray(listAttr) && listAttr.length > 0;
	const hasGroups = Array.isArray(listGroups) && listGroups.length > 0;
	const hasTags = Array.isArray(listTags) && listTags.length > 0;

	return (
		<KadencePanelBody
			title={__('Kit (ConvertKit) Settings', 'kadence-blocks')}
			initialOpen={false}
			panelName={'kb-convertkit'}
		>
			<p>
				<ExternalLink href={HELP_URL}>{__('Get help', 'kadence-blocks')}</ExternalLink>
			</p>
			<TextControl label={__('API Key', 'kadence-blocks')} value={api} onChange={(value) => setApi(value)} />
			<div className="components-base-control">
				<Button isPrimary onClick={() => saveAPI()} disabled={'' === api}>
					{isSaving ? __('Saving', 'kadence-blocks') : __('Save', 'kadence-blocks')}
				</Button>
				{api !== '' && (
					<Fragment>
						&nbsp;
						<Button isSecondary onClick={() => removeAPI()}>
							{__('Remove', 'kadence-blocks')}
						</Button>
					</Fragment>
				)}
			</div>
			{isSavedApi && (
				<Fragment>
					{isFetching && <Spinner />}
					{!isFetching && !hasList && (
						<Fragment>
							<h2 className="kt-heading-size-title">{__('Select Form', 'kadence-blocks')}</h2>
							{!listsLoaded ? getConvertKitForms() : ''}
							{!Array.isArray(list) ? <Spinner /> : __('No forms found.', 'kadence-blocks')}
						</Fragment>
					)}
					{!isFetching && hasList && (
						<Fragment>
							<h2 className="kt-heading-size-title">{__('Select Form', 'kadence-blocks')}</h2>
							<Select
								value={
									undefined !== settings && undefined !== settings && undefined !== settings.form
										? settings.form
										: ''
								}
								onChange={(value) => {
									save({ form: value ? value : [] });
								}}
								id={'mc-list-selection'}
								isClearable={true}
								options={list}
								isMulti={false}
								maxMenuHeight={200}
								placeholder={__('Select Form')}
							/>

							<Fragment>
								{isFetchingGroups && <Spinner />}
								{!isFetchingGroups && !hasGroups && (
									<Fragment>
										<h2 className="kt-heading-size-title">
											{__('Select Sequence', 'kadence-blocks')}
										</h2>
										{!listGroupLoaded ? getConvertKitSequences() : ''}
										{!Array.isArray(listGroups) ? (
											<Spinner />
										) : (
											__('No Sequences found.', 'kadence-blocks')
										)}
									</Fragment>
								)}
								{!isFetchingGroups && hasGroups && (
									<Fragment>
										<h2 className="kt-heading-size-title">
											{__('Select Sequence', 'kadence-blocks')}
										</h2>
										<Select
											value={
												undefined !== settings &&
												undefined !== settings &&
												undefined !== settings.sequence
													? settings.sequence
													: ''
											}
											onChange={(value) => {
												save({ sequence: value ? value : [] });
											}}
											id={'mc-sequence-selection'}
											isClearable={true}
											options={listGroups}
											maxMenuHeight={200}
											placeholder={__('Select Sequence')}
										/>
									</Fragment>
								)}
								{isFetchingTags && <Spinner />}
								{!isFetchingTags && !hasTags && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__('Select Tags', 'kadence-blocks')}</h2>
										{!listTagsLoaded ? getTags() : ''}
										{!Array.isArray(listTags) ? (
											<Spinner />
										) : (
											__('No Tags found.', 'kadence-blocks')
										)}
									</Fragment>
								)}
								{!isFetchingTags && hasTags && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__('Select Tags', 'kadence-blocks')}</h2>
										<Select
											value={
												undefined !== settings &&
												undefined !== settings &&
												undefined !== settings.tags
													? settings.tags
													: ''
											}
											onChange={(value) => {
												save({ tags: value ? value : [] });
											}}
											id={'mc-tag-selection'}
											isClearable={true}
											options={listTags}
											isMulti={true}
											maxMenuHeight={200}
											placeholder={__('Select Tags')}
										/>
									</Fragment>
								)}
								{isFetchingAttributes && <Spinner />}
								{!isFetchingAttributes && !hasAttr && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__('Map Fields', 'kadence-blocks')}</h2>
										{!listAttrLoaded ? getConvertKitAttributes() : ''}
										{!Array.isArray(listAttr) ? (
											<Spinner />
										) : (
											__('No Fields found.', 'kadence-blocks')
										)}
									</Fragment>
								)}
								{!isFetchingAttributes && hasAttr && (
									<Fragment>
										<h2 className="kt-heading-size-title">{__('Map Fields', 'kadence-blocks')}</h2>
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

export default ConvertKitOptions;
