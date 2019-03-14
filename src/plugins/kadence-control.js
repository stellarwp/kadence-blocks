const {
	Component,
	Fragment,
} = wp.element;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { registerPlugin } = wp.plugins;
import map from 'lodash/map';
import './editor.scss';
/**
 * Import Icons
 */
import icons from '../brand-icon';

/**
 * Import Blocks
 */
import KadenceSpacer from './block-defaults/spacer-defaults';
import KadenceSpacerSettings from './block-settings/spacer-settings';
import KadenceTabs from './block-defaults/tabs-defaults';
import KadenceTabsSettings from './block-settings/tabs-settings';
import KadenceAccordion from './block-defaults/accordion-defaults';
import KadenceAccordionSettings from './block-settings/accordion-settings';
import KadenceInfoBox from './block-defaults/info-box-defaults';
import KadenceInfoBoxSettings from './block-settings/info-box-settings';

/*
 * Components
 */
import KadenceFontFamily from './block-defaults/typography-defaults';
/**
 * Build the row edit
 */
class KadenceConfig extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			user: ( kadence_blocks_params.user ? kadence_blocks_params.user : 'admin' ),
			controls: applyFilters( 'kadence.block_controls_sidebar', [] ),
		};
	}
	render() {
		return (
			<Fragment>
				<PluginSidebarMoreMenuItem
					target="kadence-controls"
					icon={ icons.kadence }
				>
					{ __( 'Kadence Blocks Controls' ) }
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					isPinnable={ false }
					name="kadence-controls"
					title={ __( 'Kadence Blocks Controls' ) }
				>
					<div className="kt-blocks-control-wrap">
						<KadenceSpacer />
						{ 'admin' === this.state.user && (
							<KadenceSpacerSettings />
						) }
						<KadenceTabs />
						{ 'admin' === this.state.user && (
							<KadenceTabsSettings />
						) }
						<KadenceAccordion />
						{ 'admin' === this.state.user && (
							<KadenceAccordionSettings />
						) }
						<KadenceInfoBox />
						{ 'admin' === this.state.user && (
							<KadenceInfoBoxSettings />
						) }
						{ map( this.state.controls, ( { Control } ) => (
							<Control />
						) ) }
						<h3>{ __( 'Components' ) }</h3>
						<KadenceFontFamily />
					</div>
				</PluginSidebar>
			</Fragment>
		);
	}
}

registerPlugin( 'kadence-control', {
	icon: false,
	render: KadenceConfig,
} );
