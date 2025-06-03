import { withSelect, withDispatch } from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import { Fragment, Component } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, ExternalLink, Spinner } from '@wordpress/components';
import { trash } from '@wordpress/icons';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';
/**
 * Internal block libraries
 */
class CloudConnect extends Component {
	constructor() {
		super(...arguments);
		this.saveSettings = this.saveSettings.bind(this);
		this.addConnection = this.addConnection.bind(this);
		this.state = {
			isLoading: true,
			errorConnecting: false,
			cloudSettings: {},
			newKey: '',
			newURl: '',
		};
	}
	componentDidMount() {
		apiFetch({ path: '/wp/v2/settings' }).then((res) => {
			this.setState({
				isLoading: false,
				cloudSettings: SafeParseJSON(res.kadence_blocks_cloud),
			});
		});
	}
	saveSettings(cloudSettings) {
		kadence_blocks_params.cloud_settings = JSON.stringify(cloudSettings);
		this.setState({ isSaving: true });
		apiFetch({
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_cloud: JSON.stringify(cloudSettings) },
		}).then((response) => {
			//console.log( response );
			this.setState({
				isSaving: false,
				errorConnecting: false,
				isLoading: false,
				newUrl: '',
				newKey: '',
				cloudSettings,
			});
			this.props.onReload();
		});
	}
	addConnection() {
		this.setState({ isLoading: true });
		const data = new FormData();
		data.append('action', 'kadence_import_get_new_connection_data');
		data.append('security', kadence_blocks_params.ajax_nonce);
		data.append('url', this.state.newUrl ? this.state.newUrl : '');
		data.append('key', this.state.newKey ? this.state.newKey : '');
		const control = this;
		jQuery
			.ajax({
				method: 'POST',
				url: kadence_blocks_params.ajax_url,
				data,
				contentType: false,
				processData: false,
			})
			.done(function (response, status, stately) {
				if (response) {
					//console.log( response );
					const o = SafeParseJSON(response, false);
					if (o) {
						const cloudSettings = control.state.cloudSettings;
						if (!cloudSettings.connections) {
							cloudSettings.connections = [];
						}
						const newConnect = {};
						newConnect.slug = o.slug;
						newConnect.title = o.name;
						newConnect.url = control.state.newUrl;
						newConnect.key = control.state.newKey;
						newConnect.expires = o.expires;
						newConnect.refresh = o.refresh;
						newConnect.pages = o.pages;
						cloudSettings.connections.push(newConnect);
						control.saveSettings(cloudSettings);
					} else {
						control.setState({ errorConnecting: true, errorNotice: response, isLoading: false });
					}
				}
			})
			.fail(function (error) {
				console.log(error);
				control.setState({ errorConnecting: true, isLoading: false });
			});
	}
	render() {
		const control = this;
		//console.log( this.state.cloudSettings );
		return (
			<div className={`kb-new-connection-content`}>
				{this.state.isLoading ? (
					<Fragment>
						<Spinner />
					</Fragment>
				) : (
					<Fragment>
						{this.state.errorConnecting && <div className="error">{this.state.errorNotice}</div>}
						{this.state.cloudSettings.connections && this.state.cloudSettings.connections[0] && (
							<Fragment>
								{this.state.cloudSettings.connections.map((connection, index) => (
									<Fragment>
										<div className="kb-connection-title">
											{connection.title}
											<Button
												key={`connection-${index}`}
												className={'kb-connection-remove-button'}
												icon={trash}
												aria-label={__('Remove Connection', 'kadence-blocks')}
												onClick={() => {
													const cloudSettings = this.state.cloudSettings;
													cloudSettings.connections.splice(index, 1);
													this.setState({ cloudSettings });
													this.saveSettings(cloudSettings);
												}}
											/>
										</div>
									</Fragment>
								))}
							</Fragment>
						)}
						<div className="kb-connection-add-new">
							<TextControl
								label={__('Connection URL', 'kadence-blocks')}
								type="text"
								value={this.state.newUrl}
								onChange={(value) => this.setState({ newUrl: value })}
							/>
							<TextControl
								label={__('Connection Access Key', 'kadence-blocks')}
								type="text"
								value={this.state.newKey}
								onChange={(value) => this.setState({ newKey: value })}
							/>
							<Button
								className={'kb-connection-add-button'}
								isPrimary
								onClick={() => {
									this.addConnection();
								}}
							>
								{__('Add Connection', 'kadence-blocks')}
							</Button>
						</div>
						<div className="kb-connection-info">
							{__('Learn about connecting libraries at:', 'kadence-blocks') + ' '}
							<ExternalLink
								href={
									'https://www.kadencewp.com/kadence-cloud/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=design-library'
								}
							>
								{__('Kadence Pattern Hub', 'kadence-blocks')}
							</ExternalLink>
						</div>
					</Fragment>
				)}
			</div>
		);
	}
}

export default compose(
	withSelect((select, { clientId }) => {
		const { getBlock } = select('core/block-editor');
		const block = getBlock(clientId);
		return {
			block,
			canUserUseUnfilteredHTML: select('core/editor') ? select('core/editor').canUserUseUnfilteredHTML() : false,
		};
	}),
	withDispatch((dispatch, { block, canUserUseUnfilteredHTML }) => ({
		import: (blockcode) =>
			dispatch('core/block-editor').replaceBlocks(
				block.clientId,
				rawHandler({
					HTML: blockcode,
					mode: 'BLOCKS',
					canUserUseUnfilteredHTML,
				})
			),
	}))
)(CloudConnect);
