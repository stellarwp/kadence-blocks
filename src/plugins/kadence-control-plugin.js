import { map } from 'lodash';

import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import {
	Fragment,
	useState,
} from '@wordpress/element';
import {
	PanelBody,
	Button
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
/**
 * Import Icons
 */
import * as BlockIcons from '@kadence/icons';

/**
 * Import Settings
 */
import KadenceEditorWidth from './editor-width';
import KadenceColors from './block-defaults/color-palette-defaults';

/*
 * Components
 */
import KadenceFontFamily from './block-defaults/typography-defaults';
import KadenceVisibilitySettings from './block-visibility-settings';
import ExportDefaults from './block-defaults/export-defaults';
import ImportDefaults from './block-defaults/import-defaults';
import ResetDefaults from './block-defaults/reset-defaults';

/**
 * Build the row edit
 */
function KadenceConfig() {
	const [ user, setUser ] = useState( ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ) );
	const [ controls, setControls ] = useState( applyFilters( 'kadence.block_controls_sidebar', [] ) );
	const [ blocks, setBlocks ] = useState( applyFilters( 'kadence.block_blocks_sidebar', [] ) );
	const [ extraPanels, setExtraPanels ] = useState( applyFilters( 'kadence.block_panels_sidebar', [] ) );

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem
				target="kadence-controls"
				icon={ BlockIcons.kadenceNewIcon }
			>
				{__( 'Kadence Blocks Controls', 'kadence-blocks' )}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				isPinnable={true}
				name="kadence-controls"
				title={__( 'Kadence Blocks Controls', 'kadence-blocks' )}
			>
				<PanelBody
					title={__( 'Color Palette', 'kadence-blocks' )}
					initialOpen={true}
				>
					<KadenceColors/>
				</PanelBody>

				{'admin' === user && (
					<>
					<PanelBody
						title={__('Block Visibility', 'kadence-blocks')}
						initialOpen={false}
					>
						<div className="kt-blocks-control-wrap">

							{/*Accordion*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Accordion', 'kadence-blocks')}
														   icon={ BlockIcons.accordionBlockIcon }
														   blockSlug={'accordion'}
														   options={[
									{
										key: 'paneControl',
										label: __('Enable Pane Close/Open Settings', 'kadence-blocks')
									},
									{
										key: 'titleColors',
										label: __('Enable Title Color Settings', 'kadence-blocks')
									},
									{
										key: 'titleIcon',
										label: __('Enable Title Trigger Icon Settings', 'kadence-blocks')
									},
									{
										key: 'titleSpacing',
										label: __('Enable Title Spacing Settings', 'kadence-blocks')
									},
									{
										key: 'titleBorder',
										label: __('Enable Title Border Settings', 'kadence-blocks')
									},
									{key: 'titleFont', label: __('Enable Title Font Settings', 'kadence-blocks')},
									{
										key: 'paneContent',
										label: __('Enable Inner Content Settings', 'kadence-blocks')
									},
									{key: 'titleTag', label: __('Enable Title Tag Settings', 'kadence-blocks')},
									{key: 'structure', label: __('Enable Structure Settings', 'kadence-blocks')},
								]}/>
							</div>

							{/*Advanced Button*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Advanced Button', 'kadence-blocks')}
														   icon={ BlockIcons.advancedBtnIcon }
														   blockSlug={'advancedbtn'} options={[
									{key: 'countSettings', label: __('Enable Count Settings', 'kadence-blocks')},
									{key: 'sizeSettings', label: __('Enable Size Settings', 'kadence-blocks')},
									{key: 'colorSettings', label: __('Enable Color Settings', 'kadence-blocks')},
									{key: 'iconSettings', label: __('Enable Icon Settings', 'kadence-blocks')},
									{
										key: 'fontSettings',
										label: __('Enable Font Family Settings', 'kadence-blocks')
									},
								]}/>
							</div>

							{/* Advanced Form */}
							{/*<div className="kt-blocks-control-row">*/}
							{/*		<KadenceVisibilitySettings blockName={ __('Advanced Form', 'kadence-blocks' )}*/}
							{/*								   blockSlug={'advanced-form'}*/}
							{/*								   icon={ BlockIcons.advancedFormIcon }*/}
							{/*								   options={[*/}
							{/*			{ key: 'containerSettings', label: __( 'Enable Container Style Settings', 'kadence-blocks' ) },*/}
							{/*			// { key: 'itemStyle', label: __( 'Enable Item Style Settings', 'kadence-blocks' ) },*/}
							{/*			// { key: 'numberStyle', label: __( 'Enable Number Style Settings', 'kadence-blocks' ) },*/}
							{/*			// { key: 'labelStyle', label: __( 'Enable Label Style Settings', 'kadence-blocks' ) },*/}
							{/*			// { key: 'visibilitySettings', label: __( 'Enable Visibility Settings', 'kadence-blocks' ) },*/}
							{/*		]}/>*/}
							{/*</div>*/}

							{/*Advanced Gallery*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Advanced Gallery', 'kadence-blocks')}
														   blockSlug={'advancedgallery'}
														   icon={ BlockIcons.galleryIcon }
														   options={[
									{key: 'gutterSettings', label: __('Enable Gutter Settings', 'kadence-blocks')},
									{
										key: 'lightboxSettings',
										label: __('Enable Lightbox Settings', 'kadence-blocks')
									},
									{
										key: 'styleSettings',
										label: __('Enable Image Style Settings', 'kadence-blocks')
									},
									{
										key: 'captionSettings',
										label: __('Enable Caption Settings', 'kadence-blocks')
									},
									{
										key: 'shadowSettings',
										label: __('Enable Image Shadow Settings', 'kadence-blocks')
									},
									{
										key: 'spacingSettings',
										label: __('Enable Gallery Spacing Settings', 'kadence-blocks')
									},
								]}/>
							</div>

							{/*Advanced Heading*/}
							<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings blockName={'Advanced Text'}
															   blockSlug={'advancedheading'}
															   icon={ BlockIcons.advancedHeadingIcon}
															   options={[
																   {
																	   key: 'toolbarTypography',
																	   label: __('Enable Typography Settings in Toolbar', 'kadence-blocks')
																   },
																   {
																	   key: 'toolbarColor',
																	   label: __('Enable Color Settings in Toolbar', 'kadence-blocks')
																   },
																   {
																	   key: 'colorSettings',
																	   label: __('Enable Color Settings', 'kadence-blocks')
																   },
																   {
																	   key: 'sizeSettings',
																	   label: __('Enable Size Settings', 'kadence-blocks')
																   },
																   {
																	   key: 'advancedSettings',
																	   label: __('Enable Advanced Typography Settings', 'kadence-blocks')
																   },
																   {
																	   key: 'iconSettings',
																	   label: __('Enable Icon Settings', 'kadence-blocks')
																   },
																   {
																	   key: 'highlightSettings',
																	   label: __('Enable Highlight Settings', 'kadence-blocks')
																   },
																   {
																	   key: 'marginSettings',
																	   label: __('Enable Margin Settings', 'kadence-blocks')
																   },
															   ]}/>
							</div>

							{/*Countdown*/}
							<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings blockName={__('Countdown', 'kadence-blocks')}
															   blockSlug={'countdown'}
															   icon={ BlockIcons.countdownIcon }
															   options={[
										{
											key: 'containerSettings',
											label: __('Enable Container Style Settings', 'kadence-blocks')
										},
										{key: 'itemStyle', label: __('Enable Item Style Settings', 'kadence-blocks')},
										{
											key: 'numberStyle',
											label: __('Enable Number Style Settings', 'kadence-blocks')
										},
										{key: 'labelStyle', label: __('Enable Label Style Settings', 'kadence-blocks')},
										{
											key: 'visibilitySettings',
											label: __('Enable Visibility Settings', 'kadence-blocks')
										},
									]}/>
							</div>

							{/* Count Up */}
							<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings blockName={__('Count Up', 'kadence-blocks')}
															   blockSlug={'countup'}
															   icon={ BlockIcons.countUpIcon }
															   options={[
										{key: 'titleStyle', label: __('Enable Title Style Settings', 'kadence-blocks')},
										{
											key: 'numberStyle',
											label: __('Enable Number Style Settings', 'kadence-blocks')
										},
									]}/>
							</div>

							{/* Google Maps */}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Google Maps', 'kadence-blocks')}
														   blockSlug={'googlemaps'}
														   icon={ BlockIcons.googleMapsIcon }
														   options={[
									{key: 'apiSettings', label: __('Enable API Settings', 'kadence-blocks')},
									{
										key: 'containerStyle',
										label: __('Enable Container Style Settings', 'kadence-blocks')
									},
									{
										key: 'mapLocation',
										label: __('Enable Map Location Settings', 'kadence-blocks')
									},
								]}/>
							</div>

							{/* Icon */}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Icon', 'kadence-blocks')}
														   blockSlug={'icon'}
														   icon={ BlockIcons.iconIcon }
														   options={[
									{
										key: 'iconSpacing',
										label: __('Enable Icon Spacing Settings', 'kadence-blocks')
									},
								]}/>
							</div>

							{/*Icon List*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Icon List', 'kadence-blocks')}
														   blockSlug={'iconlist'}
														   icon={ BlockIcons.iconListBlockIcon }
														   options={[
									{key: 'column', label: __('Enable List Column Settings', 'kadence-blocks')},
									{key: 'spacing', label: __('Enable List Spacing Settings', 'kadence-blocks')},
									{key: 'textStyle', label: __('Enable Text Style Settings', 'kadence-blocks')},
									{
										key: 'joinedIcons',
										label: __('Enable All List Icon Control', 'kadence-blocks')
									},
									{
										key: 'individualIcons',
										label: __('Enable individual List Item Control', 'kadence-blocks')
									},
								]}/>
							</div>

							{/*Info Box*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Info Box', 'kadence-blocks')}
														   blockSlug={'infobox'}
														   icon={ BlockIcons.infoboxIcon }
														   options={[
									{
										key: 'containerSettings',
										label: __('Enable Container Settings', 'kadence-blocks')
									},
									{key: 'mediaSettings', label: __('Enable Media Settings', 'kadence-blocks')},
									{key: 'titleSettings', label: __('Enable Title Settings', 'kadence-blocks')},
									{key: 'textSettings', label: __('Enable Text Settings', 'kadence-blocks')},
									{
										key: 'learnMoreSettings',
										label: __('Enable Learn More Settings', 'kadence-blocks')
									},
									{key: 'shadowSettings', label: __('Enable Shadow Settings', 'kadence-blocks')},
								]}/>
							</div>

							{/* Lottie */}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Lottie', 'kadence-blocks')}
														   blockSlug={'lottie'}
														   icon={ BlockIcons.lottieIcon }
														   options={[
									{key: 'sourceFile', label: __('Enable Source File Settings', 'kadence-blocks')},
									{
										key: 'playbackSettings',
										label: __('Enable Playback Settings', 'kadence-blocks')
									},
									{
										key: 'sizeControl',
										label: __('Enable Size Control Settings', 'kadence-blocks')
									},
								]} />
							</div>

							{/* Posts */}
							<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings blockName={__('Posts', 'kadence-blocks')}
															   blockSlug={'posts'}
															   icon={ BlockIcons.postsIcon }
															   options={[
										{key: 'layoutSettings', label: __('Enable Layout Settings', 'kadence-blocks')},
										{key: 'imageSettings', label: __('Enable Image Settings', 'kadence-blocks')},
										{
											key: 'categorySettings',
											label: __('Enable Category Settings', 'kadence-blocks')
										},
										{
											key: 'titleSettings',
											label: __('Enable Title Style Settings', 'kadence-blocks')
										},
										{key: 'metaSettings', label: __('Enable Meta Settings', 'kadence-blocks')},
										{
											key: 'contentSettings',
											label: __('Enable Content Settings', 'kadence-blocks')
										},
									]} />
							</div>

							{/*Row Layout*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Row Layout', 'kadence-blocks')}
														   blockSlug={'rowlayout'}
														   icon={ BlockIcons.blockRowIcon }
														   options={[
									{
										key: 'columnResize',
										label: __('Control Individual Settings Groups', 'kadence-blocks')
									},
									{
										key: 'basicLayout',
										label: __('Enable Basic Layout Controls', 'kadence-blocks')
									},
									{
										key: 'paddingMargin',
										label: __('Enable Padding/Margin Settings', 'kadence-blocks')
									},
									{key: 'background', label: __('Enable Background Settings', 'kadence-blocks')},
									{
										key: 'backgroundOverlay',
										label: __('Enable Background Overlay Settings', 'kadence-blocks')
									},
									{key: 'border', label: __('Enable Border Settings', 'kadence-blocks')},
									{key: 'dividers', label: __('Enable Dividers Settings', 'kadence-blocks')},
									{key: 'textColor', label: __('Enable Text Color Settings', 'kadence-blocks')},
									{key: 'structure', label: __('Enable Structure Settings', 'kadence-blocks')},
								]}/>
							</div>

							{/* Section */}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Section', 'kadence-blocks')}
														   blockSlug={'container'}
														   icon={ BlockIcons.blockColumnIcon }
														   options={[
									{key: 'container', label: __('Enable Container Settings', 'kadence-blocks')},
									{key: 'textAlign', label: __('Enable Text Align Control', 'kadence-blocks')},
									{key: 'textColor', label: __('Enable Text Color Control', 'kadence-blocks')},
									{
										key: 'paddingMargin',
										label: __('Enable Padding/Margin Control', 'kadence-blocks')
									},
								]}/>
							</div>

							{/* Show More */}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Show More', 'kadence-blocks')}
														   blockSlug={'show-more'}
														   icon={ BlockIcons.showMoreIcon }
														   options={[
									{
										key: 'showMoreSettings',
										label: __('Enable Show More Settings', 'kadence-blocks')
									},
									{
										key: 'spacingSettings',
										label: __('Enable Spacing Settings', 'kadence-blocks')
									},
									{key: 'expandSettings', label: __('Enable Expand Settings', 'kadence-blocks')},
								]}/>
							</div>

							{/*Spacer*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Spacer/Divider', 'kadence-blocks')}
														   blockSlug={'spacer'}
														   icon={ BlockIcons.spacerIcon }
														   options={[
									{key: 'spacerHeightUnits', label: __('Enable Height Units', 'kadence-blocks')},
									{key: 'spacerHeight', label: __('Enable Height Control', 'kadence-blocks')},
									{
										key: 'dividerToggle',
										label: __('Enable Divider Toggle Control', 'kadence-blocks')
									},
									{
										key: 'dividerStyles',
										label: __('Enable Divider Styles Control', 'kadence-blocks')
									},
								]} />
							</div>

							{/* Table of Contents */}
							<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings blockName={__('Table Of Contents', 'kadence-blocks')}
															   blockSlug={'table-of-contents'}
															   icon={ BlockIcons.tableOfContentsIcon }
															   options={[
										{
											key: 'allowedHeaders',
											label: __('Enable Allowed Headers Settings', 'kadence-blocks')
										},
										{key: 'titleSettings', label: __('Enable Title Settings', 'kadence-blocks')},
										{
											key: 'collapsibleSettings',
											label: __('Enable Collapsible Settings', 'kadence-blocks')
										},
										{key: 'listSettings', label: __('Enable List Settings', 'kadence-blocks')},
										{key: 'scrollSettings', label: __('Enable Scroll Settings', 'kadence-blocks')},
										{
											key: 'containerSettings',
											label: __('Enable Container Settings', 'kadence-blocks')
										},
										{
											key: 'nonStaticContent',
											label: __('Enable Non static Content', 'kadence-blocks')
										},
									]}/>
							</div>

							{/*Tabs*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Tabs', 'kadence-blocks')}
														   blockSlug={'tabs'}
														   icon={ BlockIcons.blockTabsIcon }
														   options={[
									{key: 'tabLayout', label: __('Enable Layout Settings', 'kadence-blocks')},
									{key: 'tabContent', label: __('Enable Content Settings', 'kadence-blocks')},
									{key: 'titleColor', label: __('Enable Title Color Settings', 'kadence-blocks')},
									{
										key: 'titleSpacing',
										label: __('Enable Title Spacing/Border Settings', 'kadence-blocks')
									},
									{key: 'titleFont', label: __('Enable Title Font Settings', 'kadence-blocks')},
									{key: 'titleIcon', label: __('Enable Title Icon Settings', 'kadence-blocks')},
									{key: 'structure', label: __('Enable Structure Settings', 'kadence-blocks')},
								]}/>
							</div>

							{/*Testimonials*/}
							<div className="kt-blocks-control-row">
								<KadenceVisibilitySettings blockName={__('Testimonials', 'kadence-blocks')}
														   blockSlug={'testimonials'}
														   icon={ BlockIcons.testimonialBlockIcon }
														   options={[
									{key: 'layoutSettings', label: __('Enable Layout Settings', 'kadence-blocks')},
									{key: 'styleSettings', label: __('Enable Style Settings', 'kadence-blocks')},
									{key: 'columnSettings', label: __('Enable Column Settings', 'kadence-blocks')},
									{
										key: 'containerSettings',
										label: __('Enable Container Settings', 'kadence-blocks')
									},
									{
										key: 'carouselSettings',
										label: __('Enable Carousel Settings', 'kadence-blocks')
									},
									{key: 'iconSettings', label: __('Enable Top Icon Settings', 'kadence-blocks')},
									{key: 'titleSettings', label: __('Enable Title Settings', 'kadence-blocks')},
									{key: 'ratingSettings', label: __('Enable Rating Settings', 'kadence-blocks')},
									{
										key: 'contentSettings',
										label: __('Enable Content Settings', 'kadence-blocks')
									},
									{key: 'mediaSettings', label: __('Enable Media Settings', 'kadence-blocks')},
									{key: 'nameSettings', label: __('Enable Name Settings', 'kadence-blocks')},
									{
										key: 'occupationSettings',
										label: __('Enable Occupation Settings', 'kadence-blocks')
									},
									{key: 'shadowSettings', label: __('Enable Shadow Settings', 'kadence-blocks')},
									{
										key: 'individualSettings',
										label: __('Enable Individual Item Settings', 'kadence-blocks')
									},
								]}/>
							</div>
							{map(blocks, ({Control}) => (
								<Control/>
							))}
							<h3>{__('Components', 'kadence-blocks')}</h3>
							<KadenceFontFamily/>

							<KadenceVisibilitySettings blockName={__('Design Library', 'kadence-blocks')}
													   blockSlug={'designlibrary'}
													   icon={ BlockIcons.kadenceCatNewIcon }
													   showBlockWideSettings={false}
													   options={[
														   {
															   key: 'show',
															   label: __('Show Design Library Button For', 'kadence-blocks')
														   },
														   {
															   key: 'wire',
															   label: __('Show Wireframe Library For', 'kadence-blocks')
														   },
														   {
															   key: 'section',
															   label: __('Show Sections Library For', 'kadence-blocks'),
															   requiresPro: true
														   },
														   {
															   key: 'templates',
															   label: __('Show Starter Packs Library For', 'kadence-blocks'),
															   requiresPro: true
														   },
													   ]}/>

							{map(controls, ({Control}) => (
								<Control/>
							))}
						</div>
					</PanelBody>

					<PanelBody
						title={__('Import/Export Block Settings', 'kadence-blocks')}
						initialOpen={ false }
					>
						<ExportDefaults />

						<hr/>

						<ImportDefaults />

					</PanelBody>

					<PanelBody
						title={__('Reset Block Defaults', 'kadence-blocks')}
						initialOpen={ false }
					>
						<ResetDefaults />
					</PanelBody>


					</>
					// End check for user = admin.
				)}

				{( ( undefined === kadence_blocks_params ) || ( undefined !== kadence_blocks_params && undefined === kadence_blocks_params.editor_width ) || ( undefined !== kadence_blocks_params && undefined !== kadence_blocks_params.editor_width && kadence_blocks_params.editor_width ) ) && (
					<PanelBody
						title={__( 'Editor Width', 'kadence-blocks' )}
						initialOpen={false}
					>
						<KadenceEditorWidth/>
					</PanelBody>
				)}
				{/* <PanelBody
						title={ __( 'Global Styles' ) }
						initialOpen={ false }
					>
						{ 'admin' === user && (
							<KadenceGlobalTypography />
						) }
					</PanelBody> */}
				{map( extraPanels, ( { Panel } ) => (
					<Panel/>
				) )}
			</PluginSidebar>
		</Fragment>
	);
}

export default KadenceConfig;
