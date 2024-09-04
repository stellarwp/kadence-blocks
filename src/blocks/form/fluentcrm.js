/**
 * FluentCRM Controls
 *
 */

/* global kadence_blocks_params */

/**
 * Imports
 */
import Select from 'react-select';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { KadencePanelBody } from '@kadence/components';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const { Component, Fragment } = wp.element;
import { ToggleControl, Spinner, SelectControl } from '@wordpress/components';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class FluentCRMControls extends Component {
	constructor(fields, settings, save) {
		super(...arguments);
		this.getLists = this.getLists.bind(this);
		this.getFields = this.getFields.bind(this);
		this.getTags = this.getTags.bind(this);
		this.state = {
			isActive: false,
			isSaving: false,
			list: false,
			listTags: false,
			isFetching: false,
			isFetchingTags: false,
			listsLoaded: false,
			isFetchingFields: false,
			listFields: false,
			listFieldsLoaded: false,
		};
	}
	componentDidMount() {
		/**
		 * Confirm active.
		 */
		if (undefined !== kadence_blocks_params.fluentCRM && kadence_blocks_params.fluentCRM) {
			this.setState({ isActive: true });
		}
	}
	getLists() {
		this.setState({ isFetching: true });
		apiFetch({
			path: addQueryArgs('/kb-fluentcrm/v1/get', { endpoint: 'lists' }),
		})
			.then((lists) => {
				const theLists = [];
				lists.map((item) => {
					theLists.push({ value: item.id, label: item.title });
				});
				this.setState({ list: theLists, listsLoaded: true, isFetching: false });
			})
			.catch(() => {
				this.setState({ list: [], listsLoaded: true, isFetching: false });
			});
	}
	getTags() {
		this.setState({ isFetchingTags: true });
		apiFetch({
			path: addQueryArgs('/kb-fluentcrm/v1/get', { endpoint: 'tags' }),
		})
			.then((tags) => {
				const theLists = [];
				tags.map((item) => {
					theLists.push({ value: item.id, label: item.title });
				});
				this.setState({ listTags: theLists, tagsLoaded: true, isFetchingTags: false });
			})
			.catch(() => {
				this.setState({ listTags: [], tagsLoaded: true, isFetchingTags: false });
			});
	}
	getFields() {
		this.setState({ isFetchingFields: true });
		apiFetch({
			path: addQueryArgs('/kb-fluentcrm/v1/get', { endpoint: 'fields' }),
		})
			.then((fields) => {
				const theFields = [];
				theFields.push({ value: null, label: 'None' });
				theFields.push({ value: 'email', label: 'Email *' });
				fields.map((item, index) => {
					if (item.key !== 'email') {
						theFields.push({ value: item.key, label: item.title });
					}
				});
				this.setState({ listFields: theFields, listFieldsLoaded: true, isFetchingFields: false });
			})
			.catch(() => {
				const theFields = [];
				theFields.push({ value: null, label: 'None' });
				theFields.push({ value: 'email', label: 'Email *' });
				this.setState({ listFields: theFields, listFieldsLoaded: true, isFetchingFields: false });
			});
	}

	render() {
		const {
			list,
			listsLoaded,
			isFetching,
			isActive,
			listFields,
			isFetchingFields,
			listFieldsLoaded,
			tagsLoaded,
			isFetchingTags,
			listTags,
		} = this.state;
		const hasList = Array.isArray(list) && list.length;
		const hasFields = Array.isArray(this.state.listFields) && this.state.listFields.length;
		const hasTags = Array.isArray(this.state.listTags) && this.state.listTags.length;
		return (
			<KadencePanelBody
				title={__('FluentCRM Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-fluent-crm-settings'}
			>
				{!isActive && <>{__('FluentCRM is not setup/active.', 'kadence-blocks')}</>}
				{isActive && (
					<>
						{isFetching && <Spinner />}
						{!isFetching && !hasList && (
							<>
								<h2 className="kt-heading-size-title">{__('Select List', 'kadence-blocks')}</h2>
								{!listsLoaded ? this.getLists() : ''}
								{!Array.isArray(list) ? <Spinner /> : __('No lists found.', 'kadence-blocks')}
							</>
						)}
						{!isFetching && hasList && (
							<>
								<h2 className="kb-heading-fln-list-title">{__('Select List', 'kadence-blocks')}</h2>
								<Select
									value={
										undefined !== this.props.settings[0].lists ? this.props.settings[0].lists : ''
									}
									onChange={(value) => {
										this.props.save({ lists: value ? value : [] });
									}}
									id={'fln-list-selection'}
									options={list}
									isMulti={true}
									maxMenuHeight={200}
									placeholder={__('Select List', 'kadence-blocks')}
								/>
								{!this.props.settings[0].lists && <div style={{ height: '100px' }}></div>}
								{undefined !== this.props.settings &&
									undefined !== this.props.settings[0] &&
									this.props.settings[0].lists &&
									this.props.settings[0].lists[0] && (
										<>
											{isFetchingTags && <Spinner />}
											{!isFetchingTags && !hasTags && (
												<>
													<h2 className="kt-heading-size-title">
														{__('Select Tags', 'kadence-blocks')}
													</h2>
													{!tagsLoaded ? this.getTags() : ''}
													{!Array.isArray(listTags) ? (
														<Spinner />
													) : (
														__('No Tags found.', 'kadence-blocks')
													)}
												</>
											)}
											{!isFetchingTags && hasTags && (
												<>
													<h2 className="kt-heading-size-title">
														{__('Select Tags', 'kadence-blocks')}
													</h2>
													<Select
														value={
															undefined !== this.props.settings &&
															undefined !== this.props.settings[0] &&
															undefined !== this.props.settings[0].tags
																? this.props.settings[0].tags
																: ''
														}
														onChange={(value) => {
															this.props.save({ tags: value ? value : [] });
														}}
														id={'fln-tag-selection'}
														isClearable={true}
														options={listTags}
														isMulti={true}
														maxMenuHeight={200}
														placeholder={__('Select Tags', 'kadence-blocks')}
													/>
												</>
											)}
											{isFetchingFields && <Spinner />}
											{!isFetchingFields && !hasFields && (
												<>
													<h2 className="kt-heading-size-title">
														{__('Map Fields', 'kadence-blocks')}
													</h2>
													{!listFieldsLoaded ? this.getFields() : ''}
													{!Array.isArray(listFields) ? (
														<Spinner />
													) : (
														__('No Fields found.', 'kadence-blocks')
													)}
												</>
											)}
											{!isFetchingFields && hasFields && (
												<>
													<h2 className="kt-heading-size-title">
														{__('Map Fields', 'kadence-blocks')}
													</h2>
													{this.props.fields &&
														this.props.fields.map((item, index) => {
															return (
																<div key={index} className="kb-field-map-item">
																	<div className="kb-field-map-item-form">
																		<p className="kb-field-map-item-label">
																			{__('Form Field', 'kadence-blocks')}
																		</p>
																		<p className="kb-field-map-item-name">
																			{item.label}
																		</p>
																	</div>
																	<SelectControl
																		label={__('Select Field:', 'kadence-blocks')}
																		options={listFields}
																		value={
																			undefined !== this.props.settings[0].map &&
																			undefined !==
																				this.props.settings[0].map[index] &&
																			this.props.settings[0].map[index]
																				? this.props.settings[0].map[index]
																				: ''
																		}
																		onChange={(value) => {
																			this.props.saveMap(value, index);
																		}}
																	/>
																</div>
															);
														})}
												</>
											)}
											<div style={{ height: '10px' }}></div>
											<ToggleControl
												label={__('Require Double Opt In?', 'kadence-blocks')}
												checked={
													undefined !== this.props.settings &&
													undefined !== this.props.settings[0] &&
													undefined !== this.props.settings[0].doubleOptin
														? this.props.settings[0].doubleOptin
														: false
												}
												onChange={(value) => this.props.save({ doubleOptin: value })}
											/>
										</>
									)}
							</>
						)}
					</>
				)}
			</KadencePanelBody>
		);
	}
}
export default FluentCRMControls;
