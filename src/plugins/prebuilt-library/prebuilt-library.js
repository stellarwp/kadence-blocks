/**
 * Prebuilt Template Modal.
 */
const { localStorage } = window;

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

import { withDispatch } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { Button, Modal, Spinner } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { update, close, plusCircle } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { SafeParseJSON, showSettings } from '@kadence/helpers';
/**
 * Import Brand Icons
 */
import { kadenceCatNewIcon } from '@kadence/icons';

/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal dependencies
 */
import PatternLibrary from './pattern-library';
import CloudSections from './cloud-library';
import TemplateLibrary from './template-library';
import CloudConnect from './cloud-connect';
import './stores';

const normal_actions = [
	{
		slug: 'templates',
		title: __('Starter Packs', 'kadence-blocks'),
		key: 'kb-templates-tab',
	},
	{
		slug: 'section',
		title: __('Kadence', 'kadence-blocks'),
		key: 'kb-sections-tab',
	},
	{
		slug: 'cloud',
		title: '',
		key: 'kb-cloud-tab',
	},
];
const no_connect_actions = [
	{
		slug: 'templates',
		title: __('Starter Packs', 'kadence-blocks'),
		key: 'kb-templates-tab',
	},
	{
		slug: 'section',
		title: __('Kadence', 'kadence-blocks'),
		key: 'kb-sections-tab',
	},
];
class PrebuiltModal extends Component {
	constructor() {
		super(...arguments);
		this.saveSettings = this.saveSettings.bind(this);
		this.reloadAllActions = this.reloadAllActions.bind(this);
		this.state = {
			reload: false,
			reloadActions: false,
			isSaving: false,
			isFetching: false,
			modalOpen: false,
			onlyModal: false,
			section: null,
			cloudSettings: kadence_blocks_params.cloud_settings ? JSON.parse(kadence_blocks_params.cloud_settings) : {},
			actions: kadence_blocks_params.cloud_enabled ? normal_actions : no_connect_actions,
			user: kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin',
			librarySettings: {},
		};
	}
	componentDidMount() {
		if (this.props.open && this.props.onlyModal) {
			this.setState({
				modalOpen: true,
				onlyModal: true,
			});
		}
		if (
			typeof kadence_blocks_params.prebuilt_libraries === 'object' &&
			kadence_blocks_params.prebuilt_libraries !== null
		) {
			this.setState({
				actions: applyFilters(
					'kadence.prebuilt_library_tabs',
					kadence_blocks_params.prebuilt_libraries.concat(this.state.actions)
				),
			});
		} else {
			this.setState({ actions: applyFilters('kadence.prebuilt_library_tabs', this.state.actions) });
		}
		const blockSettings = kadence_blocks_params.configuration
			? SafeParseJSON(kadence_blocks_params.configuration, true)
			: {};
		if (
			blockSettings['kadence/designlibrary'] !== undefined &&
			typeof blockSettings['kadence/designlibrary'] === 'object'
		) {
			this.setState({ librarySettings: blockSettings['kadence/designlibrary'] });
		}
	}
	reloadAllActions() {
		this.setState({ isFetching: true });
		apiFetch({ path: '/wp/v2/settings' }).then((res) => {
			this.setState({
				reloadActions: false,
				isFetching: false,
				cloudSettings: JSON.parse(res.kadence_blocks_cloud),
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
			this.setState({
				isSaving: false,
			});
		});
	}
	render() {
		const cloudSettings = this.state.cloudSettings;
		const activePanel = SafeParseJSON(localStorage.getItem('kadenceBlocksPrebuilt'), true);
		const active_saved_tab = activePanel && activePanel.activeTab ? activePanel.activeTab : 'section';
		const active_tab = this.state.section ? this.state.section : active_saved_tab;
		let actions = this.state.actions;
		if (cloudSettings && cloudSettings.connections) {
			actions = cloudSettings.connections.concat(actions);
		}
		if (this.state.reloadActions && !this.state.isFetching) {
			this.reloadAllActions();
		}
		return (
			<>
				<Button className="kt-prebuilt" onClick={() => this.setState({ modalOpen: true })}>
					{__('Design Library', 'kadence-blocks')}
				</Button>
				{this.state.modalOpen ? (
					<Modal
						className="kt-prebuilt-modal kb-prebuilt-library-modal"
						title={__('Design Library', 'kadence-blocks')}
						onRequestClose={(event) => {
							// No action on blur event (prevents AI modal from closing when Media Library modal opens).
							if (event?.type && event.type === 'blur') {
								return;
							}

							this.setState({ modalOpen: false });
							if (this.state.onlyModal) {
								this.props.removeBlock(this.props.clientId);
							}
						}}
					>
						<div className="kb-prebuilt-section">
							<div className="kb-prebuilt-header kb-prebuilt-library-header">
								{this.state.reloadActions && (
									<div className="kb-prebuilt-library-actions">
										<Spinner />
									</div>
								)}
								{!this.state.reloadActions && (
									<div className="kb-prebuilt-library-actions">
										{actions.map((action, index) => (
											<>
												{action.slug !== 'templates' &&
													showSettings(action.slug, 'kadence/designlibrary') && (
														<Button
															key={`${action.slug}-${index}`}
															className={
																'kb-action-button' +
																(active_tab === action.slug ? ' is-pressed' : '')
															}
															aria-pressed={active_tab === action.slug}
															icon={action.slug === 'cloud' ? plusCircle : undefined}
															label={
																action.slug === 'cloud'
																	? __('Cloud Connect', 'kadence-blocks')
																	: undefined
															}
															onClick={() => {
																const activeTab = SafeParseJSON(
																	localStorage.getItem('kadenceBlocksPrebuilt'),
																	true
																);
																activeTab.activeTab = action.slug;
																localStorage.setItem(
																	'kadenceBlocksPrebuilt',
																	JSON.stringify(activeTab)
																);
																this.setState({ section: action.slug });
															}}
														>
															{action.slug === 'cloud' ? undefined : (
																<span> {action.title} </span>
															)}
														</Button>
													)}
												{action.slug === 'templates' &&
													showSettings(action.slug, 'kadence/designlibrary', false) && (
														<Button
															key={`${action.slug}-${index}`}
															className={
																'kb-action-button' +
																(active_tab === action.slug ? ' is-pressed' : '')
															}
															aria-pressed={active_tab === action.slug}
															icon={action.slug === 'cloud' ? plusCircle : undefined}
															label={
																action.slug === 'cloud'
																	? __('Cloud Connect', 'kadence-blocks')
																	: undefined
															}
															onClick={() => {
																const activeTab = SafeParseJSON(
																	localStorage.getItem('kadenceBlocksPrebuilt'),
																	true
																);
																activeTab.activeTab = action.slug;
																localStorage.setItem(
																	'kadenceBlocksPrebuilt',
																	JSON.stringify(activeTab)
																);
																this.setState({ section: action.slug });
															}}
														>
															{action.slug === 'cloud' ? undefined : (
																<span> {action.title} </span>
															)}
														</Button>
													)}
											</>
										))}
									</div>
								)}
								{'cloud' !== active_tab && (
									<div className="kb-prebuilt-library-reload">
										<Button
											className="kt-reload-templates"
											icon={update}
											label={__('Sync with Cloud', 'kadence-blocks')}
											onClick={() => this.setState({ reload: true })}
										/>
									</div>
								)}
								<div className="kb-prebuilt-header-close-wrap">
									<Button
										className="kb-prebuilt-header-close"
										icon={close}
										label={__('Close Dialog', 'kadence-blocks')}
										onClick={() => {
											this.setState({ modalOpen: false });
											if (this.state.onlyModal) {
												this.props.removeBlock(this.props.clientId);
											}
										}}
									/>
								</div>
							</div>
							{'templates' === active_tab && (
								<TemplateLibrary
									clientId={this.props.clientId}
									reload={this.state.reload}
									onReload={() => this.setState({ reload: false })}
								/>
							)}
							{'section' === active_tab && (
								<PatternLibrary
									clientId={this.props.clientId}
									tab={active_tab}
									reload={this.state.reload}
									onReload={() => this.setState({ reload: false })}
								/>
							)}
							{'cloud' === active_tab && (
								<CloudConnect
									clientId={this.props.clientId}
									onReload={() => this.setState({ reloadActions: true })}
								/>
							)}
							{'templates' !== active_tab && 'cloud' !== active_tab && 'section' !== active_tab && (
								<CloudSections
									clientId={this.props.clientId}
									tab={active_tab}
									libraries={actions}
									onLibraryUpdate={() => this.setState({ reloadActions: true })}
									reload={this.state.reload}
									onReload={() => this.setState({ reload: false })}
								/>
							)}
						</div>
					</Modal>
				) : null}
			</>
		);
	}
}
export default compose(
	withDispatch((dispatch) => {
		const { removeBlock } = dispatch('core/block-editor');

		return {
			removeBlock,
		};
	})
)(PrebuiltModal);
