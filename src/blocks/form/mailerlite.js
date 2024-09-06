/**
 * Mailer Lite Controls
 *
 */

/**
 * Imports
 */
import Select from 'react-select';
const { addQueryArgs } = wp.url;
import apiFetch from '@wordpress/api-fetch';

import { KadencePanelBody } from '@kadence/components';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const { Component } = wp.element;
import { TextControl, Button, Spinner, SelectControl, ExternalLink } from '@wordpress/components';

const RETRIEVE_API_URL = 'https://dashboard.mailerlite.com/integrations/api';
const HELP_URL = 'https://www.mailerlite.com/help/where-to-find-the-mailerlite-api-key-groupid-and-documentation';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
class MailerLiteControls extends Component {
	constructor(fields, settings, save) {
		super(...arguments);
		this.getMailerLiteGroup = this.getMailerLiteGroup.bind(this);
		this.getMailerLiteFields = this.getMailerLiteFields.bind(this);
		this.removeAPI = this.removeAPI.bind(this);
		this.saveAPI = this.saveAPI.bind(this);
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
			groupError: '',
		};
	}
	componentDidMount() {
		/**
		 * Get settings
		 */
		apiFetch({
			path: '/wp/v2/settings',
			method: 'GET',
		}).then((response) => {
			this.setState({
				api: response.kadence_blocks_mailerlite_api,
			});
			if ('' !== this.state.api) {
				this.setState({ isSavedAPI: true });
			}
		});
	}
	getMailerLiteGroup() {
		let errorNote = __('Groups could not be accessed using API key', 'kadence-blocks');
		if (!this.state.api) {
			this.setState({ group: [], groupError: errorNote, groupsLoaded: true });
			return;
		}
		this.setState({ isFetching: true });
		apiFetch({
			path: addQueryArgs('/kb-mailerlite/v1/get', {
				apikey: this.state.api,
				endpoint: 'groups',
				queryargs: ['limit=250'],
			}),
		})
			.then((groups) => {
				if (Array.isArray(groups)) {
					const theGroups = [];
					groups.map((item) => {
						theGroups.push({ value: item.id, label: item.name });
					});
					this.setState({ group: theGroups, groupError: '', groupsLoaded: true, isFetching: false });
				} else if (undefined !== groups?.data && Array.isArray(groups.data)) {
					const theGroups = [];
					groups.data.map((item) => {
						theGroups.push({ value: item.id, label: item.name });
					});
					this.setState({ group: theGroups, groupError: '', groupsLoaded: true, isFetching: false });
				} else {
					if ('Forbidden' === groups) {
						errorNote = __(
							'Retrieving groups was denied (403) for that API token or because of Mailerlite firewall. Contact MailerLite for support.',
							'kadence-blocks'
						);
					} else if ('Unauthorized' === groups) {
						errorNote = __(
							'Retrieving groups was denied because the provided API token is invalid.',
							'kadence-blocks'
						);
					}
					this.setState({ group: [], groupError: errorNote, groupsLoaded: true, isFetching: false });
				}
			})
			.catch(() => {
				this.setState({ group: [], groupError: errorNote, groupsLoaded: true, isFetching: false });
			});
	}
	getMailerLiteFields() {
		if (!this.state.api) {
			const theFields = [];
			theFields.push({ value: null, label: 'None' });
			theFields.push({ value: 'email', label: 'Email *' });
			this.setState({ groupFields: theFields, groupFieldsLoaded: true });
			return;
		}
		this.setState({ isFetchingFields: true });
		apiFetch({
			path: addQueryArgs('/kb-mailerlite/v1/get', { apikey: this.state.api, endpoint: 'fields' }),
		})
			.then((fields) => {
				if (Array.isArray(fields)) {
					const theFields = [];
					theFields.push({ value: null, label: 'None' });
					theFields.push({ value: 'email', label: 'Email *' });
					fields.map((item, index) => {
						if (item.key !== 'email') {
							theFields.push({ value: item.key, label: item.title });
						}
					});
					this.setState({ groupFields: theFields, groupFieldsLoaded: true, isFetchingFields: false });
				} else if (undefined !== fields?.data && Array.isArray(fields.data)) {
					const theFields = [];
					theFields.push({ value: null, label: 'None' });
					theFields.push({ value: 'email', label: 'Email *' });
					fields.data.map((item, index) => {
						if (item.key !== 'email') {
							theFields.push({ value: item.key, label: item.name });
						}
					});
					this.setState({ groupFields: theFields, groupFieldsLoaded: true, isFetchingFields: false });
				} else {
					const theFields = [];
					theFields.push({ value: null, label: 'None' });
					theFields.push({ value: 'email', label: 'Email *' });
					this.setState({ groupFields: theFields, groupFieldsLoaded: true, isFetchingFields: false });
				}
			})
			.catch(() => {
				const theFields = [];
				theFields.push({ value: null, label: 'None' });
				theFields.push({ value: 'email', label: 'Email *' });
				this.setState({ groupFields: theFields, groupFieldsLoaded: true, isFetchingFields: false });
			});
	}
	removeAPI() {
		this.setState({
			api: '',
		});
		if (this.state.isSavedAPI) {
			this.setState({ isSaving: true });
			const settingModel = new wp.api.models.Settings({
				kadence_blocks_mailerlite_api: '',
			});
			settingModel.save().then(() => {
				this.setState({ isSavedAPI: false, isSaving: false });
			});
		}
	}
	saveAPI() {
		this.setState({ isSaving: true });
		const settingModel = new wp.api.models.Settings({
			kadence_blocks_mailerlite_api: this.state.api,
		});
		settingModel.save().then((response) => {
			this.setState({ isSaving: false, isSavedAPI: true });
		});
	}
	render() {
		const {
			group,
			groupsLoaded,
			isFetching,
			isSavedAPI,
			groupFields,
			groupError,
			isFetchingFields,
			groupFieldsLoaded,
		} = this.state;
		const hasGroup = Array.isArray(group) && group.length ? true : false;
		const hasFields = Array.isArray(this.state.groupFields) && this.state.groupFields.length ? true : false;
		return (
			<KadencePanelBody
				title={__('MailerLite Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-mailerlite-settings'}
			>
				<p>
					<>
						<ExternalLink href={RETRIEVE_API_URL}>{__('Get API Key', 'kadence-blocks')}</ExternalLink>
						|&nbsp;
						<ExternalLink href={HELP_URL}>{__('Get help', 'kadence-blocks')}</ExternalLink>
					</>
				</p>
				<TextControl
					label={__('API Key', 'kadence-blocks')}
					value={this.state.api}
					onChange={(value) => this.setState({ api: value })}
				/>
				<div className="components-base-control">
					<Button isPrimary onClick={this.saveAPI} disabled={'' === this.state.api}>
						{this.state.isSaving ? __('Saving', 'kadence-blocks') : __('Save', 'kadence-blocks')}
					</Button>
					{this.state.isSavedKey && (
						<>
							&nbsp;
							<Button isSecondary onClick={this.removeAPI}>
								{__('Remove', 'kadence-blocks')}
							</Button>
						</>
					)}
				</div>
				{isSavedAPI && (
					<>
						{isFetching && <Spinner />}
						{!isFetching && !hasGroup && (
							<>
								<h2 className="kt-heading-size-title">{__('Select Group', 'kadence-blocks')}</h2>
								{!groupsLoaded ? this.getMailerLiteGroup() : ''}
								{!groupsLoaded ? <Spinner /> : groupError}
							</>
						)}
						{!isFetching && true === hasGroup && (
							<>
								<h2 className="kt-heading-size-title">{__('Select Group', 'kadence-blocks')}</h2>
								<div className="mailerlite-select-form-row">
									<Select
										value={
											group
												? group.filter(
														({ value }) =>
															value.toString() ===
															(undefined !== this.props.settings[0].group &&
															this.props.settings[0].group[0]
																? this.props.settings[0].group[0].toString()
																: '')
												  )
												: ''
										}
										onChange={(value) => {
											this.props.save({ group: value.value ? [value.value] : [] });
										}}
										placeholder={__('Select a Group', 'kadence-blocks')}
										maxMenuHeight={300}
										options={group}
									/>
								</div>
								{!this.props.settings[0].group && <div style={{ height: '100px' }}></div>}
								{this.props.settings[0].group && (
									<>
										{isFetchingFields && <Spinner />}
										{!isFetchingFields && !hasFields && (
											<>
												<h2 className="kt-heading-size-title">
													{__('Map Fields', 'kadence-blocks')}
												</h2>
												{!groupFieldsLoaded ? this.getMailerLiteFields() : ''}
												{!Array.isArray(groupFields) ? (
													<Spinner />
												) : (
													__('No Fields found.', 'kadence-blocks')
												)}
											</>
										)}
										{!isFetchingFields && true === hasFields && (
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
																	options={groupFields}
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
export default MailerLiteControls;
