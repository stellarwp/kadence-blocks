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
import KadenceAdvancedBtn from './block-defaults/advanced-button-defaults';
import KadenceAdvancedSettings from './block-settings/advanced-button-settings';
import KadenceIconList from './block-defaults/icon-list-defaults';
import KadenceIconListSettings from './block-settings/icon-list-settings';
import KadenceTestimonials from './block-defaults/testimonial-defaults';
import KadenceTestimonialsSettings from './block-settings/testimonial-settings';
import KadenceHeadings from './block-defaults/advanced-heading-default';
import KadenceHeadingsSettings from './block-settings/advanced-heading-settings';
import KadenceRowLayout from './block-defaults/rowlayout-default';
import KadenceRowLayoutSettings from './block-settings/rowlayout-settings';

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
						<div className="kt-blocks-control-row">
							<KadenceSpacer />
							{ 'admin' === this.state.user && (
								<KadenceSpacerSettings />
							) }
						</div>
						<div className="kt-blocks-control-row">
							<KadenceTabs />
							{ 'admin' === this.state.user && (
								<KadenceTabsSettings />
							) }
						</div>
						<div className="kt-blocks-control-row">	
							<KadenceAccordion />
							{ 'admin' === this.state.user && (
								<KadenceAccordionSettings />
							) }
						</div>
						<div className="kt-blocks-control-row">
							<KadenceInfoBox />
							{ 'admin' === this.state.user && (
								<KadenceInfoBoxSettings />
							) }
						</div>
						<div className="kt-blocks-control-row">
							<KadenceAdvancedBtn />
							{ 'admin' === this.state.user && (
								<KadenceAdvancedSettings />
							) }
						</div>
						<div className="kt-blocks-control-row">
							<KadenceIconList />
							{ 'admin' === this.state.user && (
								<KadenceIconListSettings />
							) }
						</div>
						<div className="kt-blocks-control-row">
							<KadenceTestimonials />
							{ 'admin' === this.state.user && (
								<KadenceTestimonialsSettings />
							) }
						</div>
						<div className="kt-blocks-control-row">
							<KadenceHeadings />
							{ 'admin' === this.state.user && (
								<KadenceHeadingsSettings />
							) }
						</div>
						<div className="kt-blocks-control-row">
							<KadenceRowLayout />
							{ 'admin' === this.state.user && (
								<KadenceRowLayoutSettings />
							) }
						</div>
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
