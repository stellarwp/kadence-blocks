/**
 * Internal dependencies
 */
// import HelpTab from './help';
// import BlocksList from './settings';
import ProBlocksList from './pro-settings';
import Notices from './notices';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
const { registerCoreBlocks } = wp.blockLibrary;
const { hasFilter } = wp.hooks;
const { Fragment, Component, RawHTML, render } = wp.element;
import { TabPanel, Panel, PanelBody, PanelRow, Button } from '@wordpress/components';

class KadenceDashboard extends Component {
	render() {
		const tabs = [
			{
				name: 'dashboard',
				title: __('Dashboard', 'kadence-blocks'),
				className: 'kadence-dash-tab',
			},
			{
				name: 'help',
				title: __('Getting Started', 'kadence-blocks'),
				className: 'kadence-help-tab',
			},
			{
				name: 'changelog',
				title: __('Changelog', 'kadence-blocks'),
				className: 'kadence-changelog-tab',
			},
			// {
			// 	name: 'recommended',
			// 	title: __( 'Recommended Plugins', 'kadence-blocks' ),
			// 	className: 'kadence-recommended-tab',
			// },
			// {
			// 	name: 'starter',
			// 	title: __( 'Starter Sites', 'kadence-blocks' ),
			// 	className: 'kadence-starter-tab',
			// },
		];

		const KadenceDashTabPanel = () => (
			<TabPanel className="kadence-dashboard-tab-panel" activeClass="active-tab" tabs={tabs}>
				{(tab) => {
					switch (tab.name) {
						case 'dashboard':
							return (
								<Panel className="dashboard-section tab-section">
									<PanelBody opened={true}>
										<div className="dashboard-modules-wrapper">
											<div className="dashboard-customizer-settings">{/*<BlocksList />*/}</div>
											<div className="dashboard-pro-settings">
												<ProBlocksList />
											</div>
										</div>
									</PanelBody>
								</Panel>
							);

						case 'help':
							return (
								<Panel className="help-section tab-section">
									<PanelBody opened={true}>{/*<HelpTab />*/}</PanelBody>
								</Panel>
							);
						case 'changelog':
							return (
								<Panel className="changelog-section tab-section">
									<PanelBody opened={true}>{/*<ChangelogTab />*/}</PanelBody>
								</Panel>
							);
					}
				}}
			</TabPanel>
		);

		const MainPanel = () => (
			<div className="tab-panel">
				<KadenceDashTabPanel />
			</div>
		);

		return (
			<Fragment>
				<MainPanel />
				<Notices />
			</Fragment>
		);
	}
}

wp.domReady(() => {
	render(<KadenceDashboard />, document.querySelector('.kadence_blocks_dashboard_main'));
});
