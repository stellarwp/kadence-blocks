
import { map } from 'lodash';

import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import {
	withSelect,
} from '@wordpress/data';
import {
	Component,
	Fragment,
} from '@wordpress/element';
import {
	PanelBody,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { applyFilters } from '@wordpress/hooks';
/**
 * Import Icons
 */
import { kadenceNewIcon } from '@kadence/icons';

/**
 * Import Settings
 */
import KadenceEditorWidth from './editor-width';
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
import KadenceGallery from './block-defaults/advanced-gallery-default';
import KadenceGallerySettings from './block-settings/advanced-gallery-settings';
import KadenceColumn from './block-defaults/column-defaults';
import KadenceColumnSettings from './block-settings/column-settings';
import KadenceColors from './block-defaults/color-palette-defaults';
import KadenceDesignLibrarySettings from './block-settings/design-library-settings';
//import KadenceGlobalTypography from './block-globals/typography';

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
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			controls: applyFilters( 'kadence.block_controls_sidebar', [] ),
			blocks: applyFilters( 'kadence.block_blocks_sidebar', [] ),
			extraPanels: applyFilters( 'kadence.block_panels_sidebar', [] ),
			deviceType: 'Desktop',
		};
	}
	render() {
		const changeBodyClass = ( key ) => {
			if ( key ) {
				document.body.classList.remove( 'kadence-preview-width-tablet' );
				document.body.classList.remove( 'kadence-preview-width-mobile' );
				document.body.classList.remove( 'kadence-preview-width-desktop' );
				document.body.classList.add( 'kadence-preview-width-' + key.toLowerCase() );
			}
		};
		if ( this.state.deviceType !== this.props.getPreviewDevice ) {
			this.setState( { deviceType:this.props.getPreviewDevice } );
			changeBodyClass( this.props.getPreviewDevice );
		}
		return (
			<Fragment>
				<PluginSidebarMoreMenuItem
					target="kadence-controls"
					icon={ kadenceNewIcon }
				>
					{ __( 'Kadence Blocks Controls', 'kadence-blocks' ) }
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					isPinnable={ true }
					name="kadence-controls"
					title={ __( 'Kadence Blocks Controls', 'kadence-blocks'  ) }
				>
					<PanelBody
						title={ __( 'Color Palette', 'kadence-blocks'  ) }
						initialOpen={ true }
					>
						<KadenceColors />
					</PanelBody>
					<PanelBody
						title={ __( 'Block Defaults', 'kadence-blocks'  ) }
						initialOpen={ false }
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
							<div className="kt-blocks-control-row">
								<KadenceColumn />
								{ 'admin' === this.state.user && (
									<KadenceColumnSettings />
								) }
							</div>
							<div className="kt-blocks-control-row">
								<KadenceGallery />
								{ 'admin' === this.state.user && (
									<KadenceGallerySettings />
								) }
							</div>
							{ map( this.state.blocks, ( { Control } ) => (
								<Control />
							) ) }
							<h3>{ __( 'Components', 'kadence-blocks'  ) }</h3>
							<KadenceFontFamily />
							<KadenceDesignLibrarySettings />
							{ map( this.state.controls, ( { Control } ) => (
								<Control />
							) ) }
						</div>
					</PanelBody>
					{ ( ( undefined === kadence_blocks_params ) || ( undefined !== kadence_blocks_params && undefined === kadence_blocks_params.editor_width ) || ( undefined !== kadence_blocks_params && undefined !== kadence_blocks_params.editor_width && kadence_blocks_params.editor_width ) ) && (
						<PanelBody
							title={ __( 'Editor Width', 'kadence-blocks'  ) }
							initialOpen={ false }
						>
							<KadenceEditorWidth />
						</PanelBody>
					) }
					{/* <PanelBody
						title={ __( 'Global Styles' ) }
						initialOpen={ false }
					>
						{ 'admin' === this.state.user && (
							<KadenceGlobalTypography />
						) }
					</PanelBody> */}
					{ map( this.state.extraPanels, ( { Panel } ) => (
						<Panel />
					) ) }
				</PluginSidebar>
			</Fragment>
		);
	}
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
] )( KadenceConfig );
