import { map } from 'lodash';

import { PluginSidebar, PluginSidebarMoreMenuItem, store as editorStore } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect, useRef } from '@wordpress/element';
import { PanelBody, Button, ToggleControl } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import { external } from '@wordpress/icons';
import { store as coreStore } from '@wordpress/core-data';
import { store as preferencesStore } from '@wordpress/preferences';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
/**
 * Import Icons
 */
import * as BlockIcons from '@kadence/icons';

/**
 * Import Settings
 */
import KadenceEditorWidth from './editor-width';
import KadenceSetting from './settings';
import KadenceColors from './block-defaults/color-palette-defaults';

/*
 * Components
 */
import KadenceFontFamily from './block-defaults/typography-defaults';
import KadenceVisibilitySettings from './block-visibility-settings';
import ExportDefaults from './block-defaults/export-defaults';
import ImportDefaults from './block-defaults/import-defaults';
import ResetDefaults from './block-defaults/reset-defaults';
import DefaultEditorBlock from './default-editor-block';

// Optimizer constants - matching the PHP version
const META_KEY = '_kb_optimizer_status';
const STATUS_EXCLUDED = -1;
const STATUS_UNOPTIMIZED = 0;
const STATUS_OPTIMIZED = 1;

/**
 * Custom hook to get the performance optimizer enabled setting
 * @returns {boolean} Whether the optimizer is enabled
 */
function useOptimizerEnabled() {
	const globalSettings = kadence_blocks_params.globalSettings ? JSON.parse(kadence_blocks_params.globalSettings) : {};
	return globalSettings?.performance_optimizer_enabled === true;
}

/**
 * Performance Optimizer toggle component that uses the shared hook
 * This ensures we use the same state source for both the toggle and conditional panel
 */
function PerformanceOptimizerToggle() {
	const isOptimizerEnabled = useOptimizerEnabled();
	const [isSaving, setIsSaving] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const saveConfig = (value) => {
		setIsSaving(true);
		const config = kadence_blocks_params.globalSettings ? JSON.parse(kadence_blocks_params.globalSettings) : {};
		config.performance_optimizer_enabled = value;
		const settingModel = new wp.api.models.Settings({ kadence_blocks_settings: JSON.stringify(config) });

		settingModel.save().then((response) => {
			createSuccessNotice(__('Settings saved', 'kadence-blocks'), {
				type: 'snackbar',
			});

			setIsSaving(false);
			kadence_blocks_params.globalSettings = JSON.stringify(config);
			// Reload the page to load/unload the external optimizer JavaScript.
			window.location.reload();
		});
	};

	return (
		<ToggleControl
			label={__('Globally Enable The Performance Optimizer', 'kadence-blocks')}
			isBusy={isSaving}
			checked={isOptimizerEnabled}
			onChange={(value) => {
				saveConfig(value);
			}}
		/>
	);
}

/**
 * Component for excluding the current post from optimization
 */
function OptimizerExcludeToggle() {
	const meta = useSelect((select) => select('core/editor').getEditedPostAttribute('meta'));
	const savedMeta = useSelect((select) => select('core/editor').getCurrentPostAttribute('meta'));
	const { editPost } = useDispatch('core/editor');
	const originalMetaValue = useRef(null);

	// Capture the original meta value when it first becomes available, before any edits.
	useEffect(() => {
		if (savedMeta !== undefined && originalMetaValue.current === null) {
			// Capture the value from the saved post, not the edited version
			if (savedMeta && savedMeta[META_KEY] !== undefined) {
				originalMetaValue.current = savedMeta[META_KEY];
			} else {
				// If no saved value exists, default to unoptimized
				originalMetaValue.current = STATUS_UNOPTIMIZED;
			}
		}
	}, [savedMeta]);

	if (meta === undefined) {
		return null;
	}

	return (
		<ToggleControl
			label={__('Exclude this post from optimization', 'kadence-blocks')}
			checked={meta[META_KEY] === STATUS_EXCLUDED}
			onChange={(value) => {
				if (value) {
					// When checking, set to excluded
					editPost({ meta: { [META_KEY]: STATUS_EXCLUDED } });
				} else {
					// When unchecking, restore to original value (or unoptimized if original was excluded)
					const restoreValue =
						originalMetaValue.current !== null && originalMetaValue.current !== STATUS_EXCLUDED
							? originalMetaValue.current
							: STATUS_UNOPTIMIZED;
					editPost({ meta: { [META_KEY]: restoreValue } });
				}
			}}
		/>
	);
}

/**
 * Component for viewing the optimized version of a post
 */
function OptimizedViewLink() {
	const { hasLoaded, permalink, isPublished, label, meta, showIconLabels } = useSelect((select) => {
		const editor = select(editorStore);
		const { get } = select(preferencesStore);

		// Get post type for label.
		const postTypeSlug = editor.getCurrentPostType();
		const postType = select(coreStore).getPostType(postTypeSlug);
		const postTypeLabel = postType?.labels?.singular_name || 'Post';
		const dynamicLabel = __('View Optimized', 'kadence-blocks') + ' ' + postTypeLabel;

		return {
			permalink: editor.getPermalink(),
			isPublished: editor.isCurrentPostPublished(),
			label: dynamicLabel,
			hasLoaded: !!postType,
			meta: editor.getEditedPostAttribute('meta'),
			showIconLabels: get('core', 'showIconLabels'),
		};
	}, []);

	if (!isPublished || !permalink || !hasLoaded) {
		return null;
	}

	if (meta !== undefined && meta[META_KEY] !== STATUS_OPTIMIZED) {
		return null;
	}

	const optimizerData = window.kbOptimizer || {};
	const nonce = optimizerData.token;

	const url = addQueryArgs(permalink, {
		perf_token: nonce,
		kb_optimizer_preview: 1,
	});

	return (
		<div style={{ marginTop: '12px' }}>
			<Button
				style={{ paddingLeft: 0 }}
				icon={external}
				iconPosition={'right'}
				label={label}
				href={url}
				target="_blank"
				showTooltip={!showIconLabels}
				size="compact"
			>
				{label}
			</Button>
		</div>
	);
}

/**
 * Build the row edit
 */
function KadenceConfig() {
	const [user, setUser] = useState(kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin');
	const [controls, setControls] = useState(applyFilters('kadence.block_controls_sidebar', []));
	const [blocks, setBlocks] = useState(applyFilters('kadence.block_blocks_sidebar', []));
	const [extraPanels, setExtraPanels] = useState(applyFilters('kadence.block_panels_sidebar', []));
	const [controlName, setControlName] = useState(
		applyFilters('kadence.block_sidebar_control_name', __('Kadence Blocks Controls', 'kadence-blocks'))
	);
	const [controlIcon, setControlIcon] = useState(
		applyFilters('kadence.block_sidebar_control_icon', BlockIcons.kadenceNewIcon)
	);

	// Get the performance optimizer enabled setting using the shared hook
	const isOptimizerEnabled = useOptimizerEnabled();

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem target="kadence-controls" icon={controlIcon}>
				{controlName}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar isPinnable={true} name="kadence-controls" title={controlName}>
				<PanelBody title={__('Color Palette', 'kadence-blocks')} initialOpen={true}>
					<KadenceColors />
				</PanelBody>

				{'admin' === user && (
					<>
						<PanelBody title={__('Block Visibility', 'kadence-blocks')} initialOpen={false}>
							<div className="kt-blocks-control-wrap">
								{/*Accordion*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Accordion', 'kadence-blocks')}
										icon={BlockIcons.accordionBlockIcon}
										blockSlug={'accordion'}
										options={[
											{
												key: 'paneControl',
												label: __('Enable Pane Close/Open Settings', 'kadence-blocks'),
											},
											{
												key: 'titleColors',
												label: __('Enable Title Color Settings', 'kadence-blocks'),
											},
											{
												key: 'titleIcon',
												label: __('Enable Title Trigger Icon Settings', 'kadence-blocks'),
											},
											{
												key: 'titleSpacing',
												label: __('Enable Title Spacing Settings', 'kadence-blocks'),
											},
											{
												key: 'titleBorder',
												label: __('Enable Title Border Settings', 'kadence-blocks'),
											},
											{
												key: 'titleFont',
												label: __('Enable Title Font Settings', 'kadence-blocks'),
											},
											{
												key: 'paneContent',
												label: __('Enable Inner Content Settings', 'kadence-blocks'),
											},
											{
												key: 'titleTag',
												label: __('Enable Title Tag Settings', 'kadence-blocks'),
											},
											{
												key: 'structure',
												label: __('Enable Structure Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Advanced Button*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Advanced Button', 'kadence-blocks')}
										icon={BlockIcons.advancedBtnIcon}
										blockSlug={'advancedbtn'}
										options={[
											{
												key: 'countSettings',
												label: __('Enable Count Settings', 'kadence-blocks'),
											},
											{
												key: 'sizeSettings',
												label: __('Enable Size Settings', 'kadence-blocks'),
											},
											{
												key: 'colorSettings',
												label: __('Enable Color Settings', 'kadence-blocks'),
											},
											{
												key: 'iconSettings',
												label: __('Enable Icon Settings', 'kadence-blocks'),
											},
											{
												key: 'fontSettings',
												label: __('Enable Font Family Settings', 'kadence-blocks'),
											},
										]}
									/>
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
									<KadenceVisibilitySettings
										blockName={__('Advanced Gallery', 'kadence-blocks')}
										blockSlug={'advancedgallery'}
										icon={BlockIcons.galleryIcon}
										options={[
											{
												key: 'gutterSettings',
												label: __('Enable Gutter Settings', 'kadence-blocks'),
											},
											{
												key: 'lightboxSettings',
												label: __('Enable Lightbox Settings', 'kadence-blocks'),
											},
											{
												key: 'styleSettings',
												label: __('Enable Image Style Settings', 'kadence-blocks'),
											},
											{
												key: 'captionSettings',
												label: __('Enable Caption Settings', 'kadence-blocks'),
											},
											{
												key: 'shadowSettings',
												label: __('Enable Image Shadow Settings', 'kadence-blocks'),
											},
											{
												key: 'spacingSettings',
												label: __('Enable Gallery Spacing Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Advanced Heading*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Advanced Text', 'kadence-blocks')}
										blockSlug={'advancedheading'}
										icon={BlockIcons.advancedHeadingIcon}
										options={[
											{
												key: 'toolbarTypography',
												label: __('Enable Typography Settings in Toolbar', 'kadence-blocks'),
												initial: 'none',
											},
											{
												key: 'toolbarColor',
												label: __('Enable Color Settings in Toolbar', 'kadence-blocks'),
												initial: 'none',
											},
											{
												key: 'colorSettings',
												label: __('Enable Color Settings', 'kadence-blocks'),
											},
											{
												key: 'sizeSettings',
												label: __('Enable Size Settings', 'kadence-blocks'),
											},
											{
												key: 'advancedSettings',
												label: __('Enable Advanced Typography Settings', 'kadence-blocks'),
											},
											{
												key: 'iconSettings',
												label: __('Enable Icon Settings', 'kadence-blocks'),
											},
											{
												key: 'highlightSettings',
												label: __('Enable Highlight Settings', 'kadence-blocks'),
											},
											{
												key: 'marginSettings',
												label: __('Enable Margin Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Countdown*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Countdown', 'kadence-blocks')}
										blockSlug={'countdown'}
										icon={BlockIcons.countdownIcon}
										options={[
											{
												key: 'containerSettings',
												label: __('Enable Container Style Settings', 'kadence-blocks'),
											},
											{
												key: 'itemStyle',
												label: __('Enable Item Style Settings', 'kadence-blocks'),
											},
											{
												key: 'numberStyle',
												label: __('Enable Number Style Settings', 'kadence-blocks'),
											},
											{
												key: 'labelStyle',
												label: __('Enable Label Style Settings', 'kadence-blocks'),
											},
											{
												key: 'visibilitySettings',
												label: __('Enable Visibility Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/* Count Up */}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Count Up', 'kadence-blocks')}
										blockSlug={'countup'}
										icon={BlockIcons.countUpIcon}
										options={[
											{
												key: 'titleStyle',
												label: __('Enable Title Style Settings', 'kadence-blocks'),
											},
											{
												key: 'numberStyle',
												label: __('Enable Number Style Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/* Google Maps */}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Google Maps', 'kadence-blocks')}
										blockSlug={'googlemaps'}
										icon={BlockIcons.googleMapsIcon}
										options={[
											{ key: 'apiSettings', label: __('Enable API Settings', 'kadence-blocks') },
											{
												key: 'containerStyle',
												label: __('Enable Container Style Settings', 'kadence-blocks'),
											},
											{
												key: 'mapLocation',
												label: __('Enable Map Location Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/* Icon */}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Icon', 'kadence-blocks')}
										blockSlug={'icon'}
										icon={BlockIcons.iconIcon}
										options={[
											{
												key: 'iconSpacing',
												label: __('Enable Icon Spacing Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Icon List*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Icon List', 'kadence-blocks')}
										blockSlug={'iconlist'}
										icon={BlockIcons.iconListBlockIcon}
										options={[
											{
												key: 'column',
												label: __('Enable List Column Settings', 'kadence-blocks'),
											},
											{
												key: 'spacing',
												label: __('Enable List Spacing Settings', 'kadence-blocks'),
											},
											{
												key: 'textStyle',
												label: __('Enable Text Style Settings', 'kadence-blocks'),
											},
											{
												key: 'joinedIcons',
												label: __('Enable All List Icon Control', 'kadence-blocks'),
											},
											{
												key: 'individualIcons',
												label: __('Enable individual List Item Control', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Info Box*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Info Box', 'kadence-blocks')}
										blockSlug={'infobox'}
										icon={BlockIcons.infoboxIcon}
										options={[
											{
												key: 'containerSettings',
												label: __('Enable Container Settings', 'kadence-blocks'),
											},
											{
												key: 'mediaSettings',
												label: __('Enable Media Settings', 'kadence-blocks'),
											},
											{
												key: 'titleSettings',
												label: __('Enable Title Settings', 'kadence-blocks'),
											},
											{
												key: 'textSettings',
												label: __('Enable Text Settings', 'kadence-blocks'),
											},
											{
												key: 'learnMoreSettings',
												label: __('Enable Learn More Settings', 'kadence-blocks'),
											},
											{
												key: 'shadowSettings',
												label: __('Enable Shadow Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/* Lottie */}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Lottie', 'kadence-blocks')}
										blockSlug={'lottie'}
										icon={BlockIcons.lottieIcon}
										options={[
											{
												key: 'sourceFile',
												label: __('Enable Source File Settings', 'kadence-blocks'),
											},
											{
												key: 'playbackSettings',
												label: __('Enable Playback Settings', 'kadence-blocks'),
											},
											{
												key: 'sizeControl',
												label: __('Enable Size Control Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/* Posts */}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Posts', 'kadence-blocks')}
										blockSlug={'posts'}
										icon={BlockIcons.postsIcon}
										options={[
											{
												key: 'layoutSettings',
												label: __('Enable Layout Settings', 'kadence-blocks'),
											},
											{
												key: 'imageSettings',
												label: __('Enable Image Settings', 'kadence-blocks'),
											},
											{
												key: 'categorySettings',
												label: __('Enable Category Settings', 'kadence-blocks'),
											},
											{
												key: 'titleSettings',
												label: __('Enable Title Style Settings', 'kadence-blocks'),
											},
											{
												key: 'metaSettings',
												label: __('Enable Meta Settings', 'kadence-blocks'),
											},
											{
												key: 'contentSettings',
												label: __('Enable Content Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Row Layout*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Row Layout', 'kadence-blocks')}
										blockSlug={'rowlayout'}
										icon={BlockIcons.blockRowIcon}
										options={[
											{
												key: 'columnResize',
												label: __('Control Individual Settings Groups', 'kadence-blocks'),
											},
											{
												key: 'basicLayout',
												label: __('Enable Basic Layout Controls', 'kadence-blocks'),
											},
											{
												key: 'paddingMargin',
												label: __('Enable Padding/Margin Settings', 'kadence-blocks'),
											},
											{
												key: 'background',
												label: __('Enable Background Settings', 'kadence-blocks'),
											},
											{
												key: 'backgroundOverlay',
												label: __('Enable Background Overlay Settings', 'kadence-blocks'),
											},
											{ key: 'border', label: __('Enable Border Settings', 'kadence-blocks') },
											{
												key: 'dividers',
												label: __('Enable Dividers Settings', 'kadence-blocks'),
											},
											{
												key: 'textColor',
												label: __('Enable Text Color Settings', 'kadence-blocks'),
											},
											{
												key: 'structure',
												label: __('Enable Structure Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/* Section */}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Section', 'kadence-blocks')}
										blockSlug={'column'}
										icon={BlockIcons.blockColumnIcon}
										options={[
											{
												key: 'container',
												label: __('Enable Container Settings', 'kadence-blocks'),
											},
											{
												key: 'textAlign',
												label: __('Enable Text Align Control', 'kadence-blocks'),
											},
											{
												key: 'textColor',
												label: __('Enable Text Color Control', 'kadence-blocks'),
											},
											{
												key: 'paddingMargin',
												label: __('Enable Padding/Margin Control', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/* Show More */}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Show More', 'kadence-blocks')}
										blockSlug={'show-more'}
										icon={BlockIcons.showMoreIcon}
										options={[
											{
												key: 'showMoreSettings',
												label: __('Enable Show More Settings', 'kadence-blocks'),
											},
											{
												key: 'spacingSettings',
												label: __('Enable Spacing Settings', 'kadence-blocks'),
											},
											{
												key: 'expandSettings',
												label: __('Enable Expand Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Spacer*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Spacer/Divider', 'kadence-blocks')}
										blockSlug={'spacer'}
										icon={BlockIcons.spacerIcon}
										options={[
											{
												key: 'spacerHeightUnits',
												label: __('Enable Height Units', 'kadence-blocks'),
											},
											{
												key: 'spacerHeight',
												label: __('Enable Height Control', 'kadence-blocks'),
											},
											{
												key: 'dividerToggle',
												label: __('Enable Divider Toggle Control', 'kadence-blocks'),
											},
											{
												key: 'dividerStyles',
												label: __('Enable Divider Styles Control', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/* Table of Contents */}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Table of Contents', 'kadence-blocks')}
										blockSlug={'table-of-contents'}
										icon={BlockIcons.tableOfContentsIcon}
										options={[
											{
												key: 'allowedHeaders',
												label: __('Enable Allowed Headers Settings', 'kadence-blocks'),
											},
											{
												key: 'titleSettings',
												label: __('Enable Title Settings', 'kadence-blocks'),
											},
											{
												key: 'collapsibleSettings',
												label: __('Enable Collapsible Settings', 'kadence-blocks'),
											},
											{
												key: 'listSettings',
												label: __('Enable List Settings', 'kadence-blocks'),
											},
											{
												key: 'scrollSettings',
												label: __('Enable Scroll Settings', 'kadence-blocks'),
											},
											{
												key: 'containerSettings',
												label: __('Enable Container Settings', 'kadence-blocks'),
											},
											{
												key: 'nonStaticContent',
												label: __('Enable Non static Content', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Tabs*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Tabs', 'kadence-blocks')}
										blockSlug={'tabs'}
										icon={BlockIcons.blockTabsIcon}
										options={[
											{ key: 'tabLayout', label: __('Enable Layout Settings', 'kadence-blocks') },
											{
												key: 'tabContent',
												label: __('Enable Content Settings', 'kadence-blocks'),
											},
											{
												key: 'titleColor',
												label: __('Enable Title Color Settings', 'kadence-blocks'),
											},
											{
												key: 'titleSpacing',
												label: __('Enable Title Spacing/Border Settings', 'kadence-blocks'),
											},
											{
												key: 'titleFont',
												label: __('Enable Title Font Settings', 'kadence-blocks'),
											},
											{
												key: 'titleIcon',
												label: __('Enable Title Icon Settings', 'kadence-blocks'),
											},
											{
												key: 'structure',
												label: __('Enable Structure Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>

								{/*Testimonials*/}
								<div className="kt-blocks-control-row">
									<KadenceVisibilitySettings
										blockName={__('Testimonials', 'kadence-blocks')}
										blockSlug={'testimonials'}
										icon={BlockIcons.testimonialBlockIcon}
										options={[
											{
												key: 'layoutSettings',
												label: __('Enable Layout Settings', 'kadence-blocks'),
											},
											{
												key: 'styleSettings',
												label: __('Enable Style Settings', 'kadence-blocks'),
											},
											{
												key: 'columnSettings',
												label: __('Enable Column Settings', 'kadence-blocks'),
											},
											{
												key: 'containerSettings',
												label: __('Enable Container Settings', 'kadence-blocks'),
											},
											{
												key: 'carouselSettings',
												label: __('Enable Carousel Settings', 'kadence-blocks'),
											},
											{
												key: 'iconSettings',
												label: __('Enable Top Icon Settings', 'kadence-blocks'),
											},
											{
												key: 'titleSettings',
												label: __('Enable Title Settings', 'kadence-blocks'),
											},
											{
												key: 'ratingSettings',
												label: __('Enable Rating Settings', 'kadence-blocks'),
											},
											{
												key: 'contentSettings',
												label: __('Enable Content Settings', 'kadence-blocks'),
											},
											{
												key: 'mediaSettings',
												label: __('Enable Media Settings', 'kadence-blocks'),
											},
											{
												key: 'nameSettings',
												label: __('Enable Name Settings', 'kadence-blocks'),
											},
											{
												key: 'occupationSettings',
												label: __('Enable Occupation Settings', 'kadence-blocks'),
											},
											{
												key: 'shadowSettings',
												label: __('Enable Shadow Settings', 'kadence-blocks'),
											},
											{
												key: 'individualSettings',
												label: __('Enable Individual Item Settings', 'kadence-blocks'),
											},
										]}
									/>
								</div>
								{map(blocks, ({ Control }) => (
									<Control />
								))}
								<h3>{__('Components', 'kadence-blocks')}</h3>
								<KadenceFontFamily />

								<KadenceVisibilitySettings
									blockName={__('Design Library', 'kadence-blocks')}
									blockSlug={'designlibrary'}
									icon={BlockIcons.kadenceCatNewIcon}
									showBlockWideSettings={false}
									options={[
										{
											key: 'show',
											label: __('Show Design Library Button For', 'kadence-blocks'),
										},
										{
											key: 'section',
											label: __('Show Kadence Library For', 'kadence-blocks'),
											requiresPro: true,
										},
										{
											key: 'templates',
											label: __('Show Starter Packs Library For', 'kadence-blocks'),
											initial: 'none',
										},
									]}
								/>

								{map(controls, ({ Control }, index) => (
									<Control key={index} />
								))}
							</div>
						</PanelBody>

						<DefaultEditorBlock />

						<PanelBody title={__('Import/Export Block Settings', 'kadence-blocks')} initialOpen={false}>
							<ExportDefaults />

							<hr />

							<ImportDefaults />
						</PanelBody>

						<PanelBody title={__('Reset Block Defaults', 'kadence-blocks')} initialOpen={false}>
							<ResetDefaults />
						</PanelBody>
						<PanelBody title={__('Pexels Library Search', 'kadence-blocks')} initialOpen={false}>
							<KadenceSetting
								slug={'enable_image_picker'}
								label={__('Enable Pexels Image Picker', 'kadence-blocks')}
								type={'toggle'}
								theDefault={true}
							/>
						</PanelBody>
						<PanelBody title={__('Performance Optimizer', 'kadence-blocks')} initialOpen={false}>
							<PerformanceOptimizerToggle />
						</PanelBody>
						<PanelBody title={__('Custom CSS Indicator', 'kadence-blocks')} initialOpen={false}>
							<KadenceSetting
								slug={'enable_custom_css_indicator'}
								label={__('Enable Custom CSS Indicator', 'kadence-blocks')}
								type={'toggle'}
								theDefault={false}
								help={__(
									'This will add a custom indicator to the block editor to indicate if the block has custom CSS.',
									'kadence-blocks'
								)}
							/>
						</PanelBody>
						{'undefined' !== typeof window.kadenceDynamicParams && (
							<PanelBody title={__('Dynamic Content Settings', 'kadence-blocks')} initialOpen={false}>
								<KadenceSetting
									slug={'get_fields_show_all'}
									label={__('Always show all fields', 'kadence-blocks')}
									type={'toggle'}
									theDefault={false}
								/>
							</PanelBody>
						)}
					</>
					// End check for user = admin.
				)}

				{(undefined === kadence_blocks_params ||
					(undefined !== kadence_blocks_params && undefined === kadence_blocks_params.editor_width) ||
					(undefined !== kadence_blocks_params &&
						undefined !== kadence_blocks_params.editor_width &&
						kadence_blocks_params.editor_width)) && (
					<PanelBody title={__('Editor Width', 'kadence-blocks')} initialOpen={false}>
						<KadenceEditorWidth />
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
				{map(extraPanels, ({ Panel }, index) => (
					<Panel key={index} />
				))}
				{isOptimizerEnabled && (
					<PanelBody title={__('Page Optimization', 'kadence-blocks')} initialOpen={false}>
						<OptimizerExcludeToggle />
						<OptimizedViewLink />
					</PanelBody>
				)}
			</PluginSidebar>
		</Fragment>
	);
}

export default KadenceConfig;
