/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { Fragment } = wp.element;
import map from 'lodash/map';
const { withFilters, TabPanel, Panel, PanelBody, PanelRow, Button } = wp.components;

export const BlocksList = () => {
	const KadenceBlocks = [
		{
			title: __( 'Global Colors', 'kadence' ),
			description: __( 'Setup the base color scheme for your site.', 'kadence' ),
			focus: 'kadence_customizer_general_colors',
			type: 'section',
			setting: false
		},
		{
			title: __( 'Branding', 'kadence' ),
			description: __( 'Upload your logo and favicon.', 'kadence' ),
			focus: 'title_tagline',
			type: 'section',
			setting: false
		},
		{
			title: __( 'Typography', 'kadence' ),
			description: __( 'Choose the perfect font family, style and sizes.', 'kadence' ),
			focus: 'kadence_customizer_general_typography',
			type: 'section',
			setting: false
		},
		{
			title: __( 'Header Layout', 'kadence' ),
			description: __( 'Add elements and arrage them how you want.', 'kadence' ),
			focus: 'kadence_customizer_header',
			type: 'panel',
			setting: false
		},
		{
			title: __( 'Page Layout', 'kadence' ),
			description: __( 'Define your sites general page look and feel for page title, and content style.', 'kadence' ),
			focus: 'kadence_customizer_page_layout',
			type: 'section',
			setting: false
		},
		{
			title: __( 'Footer Layout', 'kadence' ),
			description: __( 'Customize the columns and place widget areas in unlimited configurations', 'kadence' ),
			focus: 'kadence_customizer_footer_layout',
			type: 'section',
			setting: false
		},
	];
	return (
		<Fragment>
			<h2 className="section-header">{ __( 'Customize Your Site', 'kadence' ) }</h2>
			{/* <h3 className="section-sub-head">{ __( 'Header Builder', 'kadence' ) }</h3> */}
			<div className="two-col-grid">
				{ map( KadenceBlocks, ( link ) => {
					return (
						<div className="link-item">
							<h4>{ link.title }</h4>
							<p>{ link.description }</p>
							<div className="link-item-foot">
								<a href={ `${kadenceDashboardParams.adminURL}customize.php?autofocus%5B${ link.type }%5D=${ link.focus }` }>
									{ __( 'Customize', 'kadence') }
								</a>
							</div>
						</div>
					);
				} ) }
			</div>
		</Fragment>
	);
};

export default withFilters( 'kadence_blocks_enabled_list' )( BlocksList );