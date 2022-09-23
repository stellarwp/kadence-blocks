import {map} from 'lodash';

import {PluginSidebar, PluginSidebarMoreMenuItem} from '@wordpress/edit-post';
import {__} from '@wordpress/i18n';
import {
    withSelect,
} from '@wordpress/data';
import {
    Component,
    Fragment,
    useState
} from '@wordpress/element';
import {
    PanelBody,
} from '@wordpress/components';
import {compose} from '@wordpress/compose';
import {applyFilters} from '@wordpress/hooks';
/**
 * Import Icons
 */
import {kadenceNewIcon} from '@kadence/icons';


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

import KadenceCountdownSettings from "./block-settings/countdown-settings";
import KadenceCountdown from "./block-defaults/countdown-defaults";

/*
 * Components
 */
import KadenceFontFamily from './block-defaults/typography-defaults';
import KadenceVisibilitySettings from "./block-settings/block-visability-settings";

/**
 * Build the row edit
 */
function KadenceConfig({getPreviewDevice}) {

    const [user, setUser] = useState((kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin'));
    const [controls, setControls] = useState(applyFilters('kadence.block_controls_sidebar', []));
    const [blocks, setBlocks] = useState(applyFilters('kadence.block_blocks_sidebar', []));
    const [extraPanels, setExtraPanels] = useState(applyFilters('kadence.block_panels_sidebar', []));

    return (
        <Fragment>
            <PluginSidebarMoreMenuItem
                target="kadence-controls"
                icon={kadenceNewIcon}
            >
                {__('Kadence Blocks Controls', 'kadence-blocks')}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar
                isPinnable={true}
                name="kadence-controls"
                title={__('Kadence Blocks Controls', 'kadence-blocks')}
            >
                <PanelBody
                    title={__('Color Palette', 'kadence-blocks')}
                    initialOpen={true}
                >
                    <KadenceColors/>
                </PanelBody>
                <PanelBody
                    title={__('Block Defaults', 'kadence-blocks')}
                >
                    <div className="kt-blocks-control-wrap">
                        {/*Accordion*/}
                        <div className="kt-blocks-control-row">
                            <KadenceAccordion/>
                            {'admin' === user && (
                                <KadenceAccordionSettings/>
                            )}
                        </div>
                        {/*Advanced Button*/}
                        <div className="kt-blocks-control-row">
                            <KadenceAdvancedBtn/>
                            {'admin' === user && (
                                <KadenceAdvancedSettings/>
                            )}
                        </div>
                        {/*Advanced Gallery*/}
                        <div className="kt-blocks-control-row">
                            <KadenceGallery/>
                            {'admin' === user && (
                                <KadenceGallerySettings/>
                            )}
                        </div>
                        {/*Advanced Heading*/}
                        <div className="kt-blocks-control-row">
                            <KadenceHeadings/>
                            {'admin' === user && (
                                <KadenceHeadingsSettings/>
                            )}
                        </div>
                        {/*Countdown*/}
                        <div className="kt-blocks-control-row">
                            <KadenceCountdown/>
                            {'admin' === user && (
                                <KadenceVisabilitySettings blockName={'Countdown'} blockSlug={'countdown'} options={ [
                                    { key: 'textStyle', label: __( 'Enable Text Style Settings', 'kadence-blocks' ) },
                                    { key: 'joinedIcons', label: __( 'Enable All List Icon Control', 'kadence-blocks' ) },
                                    { key: 'individualIcons', label: __( 'Enable individual List Item Control', 'kadence-blocks' ) },
                                ] } />
                            )}
                        </div>
                        {/*Info Box*/}
                        <div className="kt-blocks-control-row">
                            <KadenceInfoBox/>
                            {'admin' === user && (
                                <KadenceVisibilitySettings blockName={'Info Box'} blockSlug={'infobox'} options={ [
                                    { key: 'containerSettings', label: __( 'Enable Container Settings', 'kadence-blocks' ) },
                                    { key: 'mediaSettings', label: __( 'Enable Media Settings', 'kadence-blocks' ) },
                                    { key: 'titleSettings', label: __( 'Enable Title Settings', 'kadence-blocks' ) },
                                    { key: 'textSettings', label: __( 'Enable Text Settings', 'kadence-blocks' ) },
                                    { key: 'learnMoreSettings', label: __( 'Enable Learn More Settings', 'kadence-blocks' ) },
                                    { key: 'shadowSettings', label: __( 'Enable Shadow Settings', 'kadence-blocks' ) }
                                ] } />
                            )}
                        </div>
                        {/*Icon List*/}
                        <div className="kt-blocks-control-row">
                            <KadenceIconList/>
                            {'admin' === user && (
                                <KadenceIconListSettings/>
                            )}
                        </div>
                        {/*Row Layout*/}
                        <div className="kt-blocks-control-row">
                            <KadenceRowLayout/>
                            {'admin' === user && (
                                <KadenceRowLayoutSettings/>
                            )}
                        </div>
                        {/*Section*/}
                        <div className="kt-blocks-control-row">
                            <KadenceColumn/>
                            {'admin' === user && (
                                <KadenceColumnSettings/>
                            )}
                        </div>
                        {/*Spacer*/}
                        <div className="kt-blocks-control-row">
                            <KadenceSpacer/>
                            {'admin' === user && (
                                <KadenceSpacerSettings/>
                            )}
                        </div>
                        {/*Tabs*/}
                        <div className="kt-blocks-control-row">
                            <KadenceTabs/>
                            {'admin' === user && (
                                <KadenceTabsSettings/>
                            )}
                        </div>
                        {/*Testimonials*/}
                        <div className="kt-blocks-control-row">
                            <KadenceTestimonials/>
                            {'admin' === user && (
                                <KadenceTestimonialsSettings/>
                            )}
                        </div>
                        {map(blocks, ({Control}) => (
                            <Control/>
                        ))}
                        <h3>{__('Components', 'kadence-blocks')}</h3>
                        <KadenceFontFamily/>
                        <KadenceDesignLibrarySettings/>
                        {map(controls, ({Control}) => (
                            <Control/>
                        ))}
                    </div>
                </PanelBody>
                {((undefined === kadence_blocks_params) || (undefined !== kadence_blocks_params && undefined === kadence_blocks_params.editor_width) || (undefined !== kadence_blocks_params && undefined !== kadence_blocks_params.editor_width && kadence_blocks_params.editor_width)) && (
                    <PanelBody
                        title={__('Editor Width', 'kadence-blocks')}
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
                {map(extraPanels, ({Panel}) => (
                    <Panel/>
                ))}
            </PluginSidebar>
        </Fragment>
    );
}

export default KadenceConfig;
