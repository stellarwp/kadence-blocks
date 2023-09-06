/**
 * WordPress dependencies
 */

import {
	withSelect,
	withDispatch,
} from '@wordpress/data';
import { parse } from '@wordpress/blocks';
import {
	Button,
	TextControl,
	SelectControl,
	VisuallyHidden,
	ExternalLink,
	Spinner,
	Tooltip,
	Icon,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import {
	arrowLeft,
	download,
	previous,
	next,
	chevronLeft,
	chevronDown,
	update,
	close,
	plusCircle,
} from '@wordpress/icons';
import { kadenceNewIcon, aiIcon, aiSettings } from '@kadence/icons';
import { useMemo, useEffect, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';
import { speak } from '@wordpress/a11y';
import { searchItems } from './search-items';
import replaceColors from './replace/replace-colors';
import replaceImages from './replace/replace-images';
import replaceContent from './replace/replace-content';
import deleteContent from './replace/remove-content';
import replaceMasks from './replace/replace-masks';
import KadenceBlockPatternList from './block-pattern-list';
import { useSelect, useDispatch } from '@wordpress/data';
import { CONTEXT_PROMPTS } from './data-fetch/constants';

function PatternsListHeader( { filterValue, filteredBlockPatternsLength } ) {
	if ( ! filterValue ) {
		return null;
	}
	return (
		<Heading
			level={ 2 }
			lineHeight={ '48px' }
			className="block-editor-block-patterns-explorer__search-results-count"
		>
			{ sprintf(
				/* translators: %d: number of patterns. %s: block pattern search query */
				_n(
					'%1$d pattern found for "%2$s"',
					'%1$d patterns found for "%2$s"',
					filteredBlockPatternsLength
				),
				filteredBlockPatternsLength,
				filterValue
			) }
		</Heading>
	);
}
function BannerHeader( { selectedCategory } ) {
	if ( ! selectedCategory ) {
		return null;
	}
	const productLabel = ! kadence_blocks_params.hasWoocommerce ? __( 'Add WooCommerce and create some products.', 'kadence Blocks' ) :  __( 'Add some products here.', 'kadence Blocks' )
	return (
		<Heading
			level={ 2 }
			lineHeight={ '48px' }
			className="kb-patterns-banner-notice"
		>
			{ ( selectedCategory == 'featured-products' || selectedCategory == 'product-loop' ) && (
				<>
					{ __( 'These patterns require you to have some products.', 'kadence Blocks' ) } <ExternalLink href={ ( kadence_blocks_params.addProductsLink ? kadence_blocks_params.addProductsLink : '#' ) }>{productLabel}</ExternalLink>
				</>
			) }
			{ selectedCategory == 'post-loop' && (
				<>
					{ __( 'These patterns require you to have some posts.', 'kadence Blocks' ) } <ExternalLink href={ ( kadence_blocks_params.addPostsLink ? kadence_blocks_params.addPostsLink : '#' ) }>{__( 'Add some posts here.', 'kadence Blocks' )}</ExternalLink>
				</>
			) }

		</Heading>
	);
}
function LoadingHeader( { type } ) {
	if ( 'error' === type ) {
		return (
			<Heading
				level={ 2 }
				lineHeight={ '48px' }
				className="kb-patterns-banner-notice kb-patterns-banner-notice-error"
			>
				{ __( 'Error Generating AI Content', 'kadence Blocks' ) }
			</Heading>
		);
	}
	return (
		<Heading
			level={ 2 }
			lineHeight={ '48px' }
			className="kb-patterns-banner-notice"
		>
			<Spinner />
			{ 'processing' === type ? __( 'Generating AI Content.', 'kadence Blocks' ) : __( 'Loading AI Content.', 'kadence Blocks' ) }
		</Heading>
	);
}
function GenerateHeader( { context, contextLabel, contextState, generateContext } ) {
	const [ loading, setLoading ] = useState( false );
	const [ btnDisabled, setBtnDisabled ] = useState( false );
	useEffect( () => {
		setLoading( false );
		if ( 'credits' === contextState || 'error' === contextState || 'failed' === contextState ) {
			setBtnDisabled( true );
		}
	}, [ context, contextState ] );
	const hasPro = ( kadence_blocks_params.pro && kadence_blocks_params.pro === 'true' ? true : false );
	const data_key = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_key ?  kadence_blocks_params.proData.api_key : '' );
	return (
		<div className="kb-patterns-banner-generate-notice">
			<Icon className='kadence-generate-icons' icon={ aiIcon } />
			<Heading
				level={ 2 }
				lineHeight={ '1.2' }
				className="kb-patterns-heading-notice"
			>
				{ sprintf(
				/* translators: %s: the current context */
				__(
					'Would you like to generate AI powered content for the %s context?', 'kadence Blocks'
				),
				contextLabel,
			) }
			</Heading>
			<p>
				{ sprintf(
					/* translators: %s: the current context */
				__('Using the site information you provided we will generate copy for the %s context.', 'kadence Blocks' ),
				contextLabel,
				) }
			</p>
			{ ! hasPro && ! data_key && (
				<ExternalLink className='kadence-upgrade-to-pro-btn' href={ 'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=ai-content' }>{ __( 'Upgrade to Pro', 'kadence-blocks' ) }</ExternalLink>
			)}
			{ hasPro && ! data_key && (
				<Button
					className='kadence-generate-copy-button'
					iconPosition='right'
					icon={ aiIcon }
					text={ __('Activate Kadence Blocks Pro Required', 'kadence-blocks') }
					disabled={ true }
				/>
			)}
			{ hasPro && data_key && ! loading && (
				<Button
					className='kadence-generate-copy-button'
					iconPosition='right'
					icon={ aiIcon }
					disabled={ btnDisabled }
					text={ sprintf(
						/* translators: %s is the credit amount */
						__( 'Generate Content (%s Credits)', 'kadence-blocks' ),
						CONTEXT_PROMPTS?.[context] ? CONTEXT_PROMPTS[context] : '1'
					) }
					onClick={ () => {
						setLoading( true );
						generateContext( context );
					}}
				/>
			)}
			{ loading && (
				<Spinner />
			)}
		</div>
	);
}
function LaunchWizard( { launchWizard } ) {
	const launchWizardHeadline = __( 'Supercharge your web design process with Kadence AI', 'kadence-blocks' );
	const launchWizardBody = __(
		`To fill your library with thoughtful, relevant, and unique content, simply enter your site goals and information into our prompt wizard. 
		Our design library includes context-driven design patterns that are easy to use, saving you time and effort during the design process. It 
		only takes a few minutes to get started.`,
		'kadence-blocks'
	);
	return (
		<div className="kb-patterns-banner-generate-notice">
			<Icon className='kadence-generate-icons' icon={ aiIcon } />
			<Heading
				level={ 2 }
				lineHeight={ '1.2' }
				className="kb-patterns-heading-notice"
			>
				{ launchWizardHeadline }
			</Heading>
			<p>
				{ launchWizardBody }
			</p>
			<Button
				className='kadence-generate-copy-button'
				iconPosition='right'
				icon={ aiIcon }
				text={ __( 'Launch AI Startup', 'kadence-blocks' ) }
				onClick={ () => {
					launchWizard();
				}}
			/>

		</div>
	);
}
function LoadingFailedHeader( { type } ) {
	if ( 'license' === type ) {
		return (
			<Heading
				level={ 2 }
				lineHeight={ '48px' }
				className="kb-patterns-banner-notice ai-failed-loading"
			>
				{ __( 'Error Generating AI Content, verify license and available credits.', 'kadence Blocks' ) }
			</Heading>
		);
	}
	if ( 'credits' === type ) {
		return (
			<Heading
				level={ 2 }
				lineHeight={ '48px' }
				className="kb-patterns-banner-notice ai-failed-loading"
			>
				{ __( 'Error, Can not generate AI Content because of insufficient credits.', 'kadence Blocks' ) }
			</Heading>
		);
	}
	return (
		<Heading
			level={ 2 }
			lineHeight={ '48px' }
			className="kb-patterns-banner-notice ai-failed-loading"
		>
			{ 'reload' === type ? __( 'AI Content Failed to Load, Please reload this browser window.', 'kadence Blocks' ) : __( 'AI Content Failed to Load.', 'kadence Blocks' ) }
		</Heading>
	);
}


function PatternList( {
	patterns,
	filterValue,
	selectedCategory,
	selectedStyle = 'light',
	breakpointCols,
	onSelect,
	previewMode = 'iframe',
	selectedFontSize,
	aiContext,
	aINeedsData,
	contextTab,
	imageCollection,
	contextStatesRef,
	useImageReplace,
	generateContext,
	contextLabel,
	launchWizard,
 } ) {
	const [ failedAI, setFailedAI ] = useState( false );
	const [ failedAIType, setFailedAIType ] = useState( 'general' );
	const debouncedSpeak = useDebounce( speak, 500 );
	const { getContextState, getContextContent, getAllContext } = useSelect(
		( select ) => {
			return {
				getContextState: ( value ) => select( 'kadence/library' ).getContextState( value ),
				getContextContent: ( value ) => select( 'kadence/library' ).getContextContent( value ),
				getAllContext: () => select( 'kadence/library' ).getAllContext(),
			};
		},
		[]
	);
	const onSelectBlockPattern = ( info ) => {
		const patternSend = {
			id: info.id,
			slug:info.slug,
			type: 'pattern',
			style: selectedStyle ? selectedStyle : 'light',
		}
		let newInfo = info.content;
		newInfo = deleteContent( newInfo );
		if ( ! selectedStyle || 'light' === selectedStyle ) {
			// Perhaps do something later.
		} else if ( 'dark' === selectedStyle ) {
			newInfo = replaceColors( newInfo, 'dark' );
		} else if ( 'highlight' === selectedStyle ) {
			newInfo = replaceColors( newInfo, 'highlight' );
		}
		patternSend.content = newInfo;
		onSelect( patternSend );
	}
	const thePatterns = useMemo( () => {
		let allPatterns = [];
		Object.keys( patterns ).map( function( key, index ) {
			const temp = [];
			temp['title'] = patterns[key].name;
			temp['name'] = patterns[key].name;
			temp['image'] = patterns[key].image;
			temp['imageWidth'] = patterns[key].imageW;
			temp['imageHeight'] = patterns[key].imageH;
			temp['id'] = patterns[key].id;
			temp['slug'] = patterns[key].slug;
			temp['categories'] = patterns[key].categories ? Object.keys( patterns[key].categories ) : [];
			temp['contexts'] = patterns[key].contexts ? Object.keys( patterns[key].contexts ) : [];
			temp['hpcontexts'] = patterns[key].hpcontexts ? Object.keys( patterns[key].hpcontexts ) : [];
			temp['keywords'] = patterns[key].keywords ? patterns[key].keywords : [];
			if ( patterns[key]?.html) {
				temp['html'] = replaceMasks( patterns[key].html );
			}
			temp['content'] = patterns[key]?.content || '';
			temp['pro'] = patterns[key].pro;
			temp['locked'] = ( patterns[key].pro && 'true' !== kadence_blocks_params.pro ? true : false );
			temp['proRender'] = false;
			temp['viewportWidth'] = 1200;
			allPatterns.push( temp );
		});
		return allPatterns;
	}, [ patterns ] );
	const filteredBlockPatterns = useMemo( () => {
		let contextTax = 'contact-form' === aiContext ? 'contact' : aiContext;
		contextTax = 'subscribe-form' === contextTax ? 'subscribe' : contextTax;
		contextTax = 'pricing-table' === contextTax ? 'pricing' : contextTax;
		if ( contextTab === 'context' ) {
			if ( aINeedsData ) {
				console.log( 'AI Needed' );
				return [];
			} else if ( ! getContextState(aiContext) ) {
				console.log( 'AI Needed' );
				return [];
			} else if ( 'loading' === getContextState(aiContext) ) {
				console.log( 'Loading AI Content' );
				setFailedAI( false );
				return [];
			} else if ( 'processing' === getContextState(aiContext) ) {
				console.log( 'Generating AI Content' );
				setFailedAI( false );
				return [];
			} else if ( 'error' === getContextState(aiContext) ) {
				console.log( 'Error Generating AI Content' );
				setFailedAI( true );
				setFailedAIType( 'license' );
			} else if ( 'credits' === getContextState(aiContext) ) {
				console.log( 'Error not enough credits' );
				setFailedAI( true );
				setFailedAIType( 'credits' );
			} else if ( getContextContent(aiContext) === 'failed' ){
				console.log( 'AI Content has failed' );
				setFailedAI( true );
				setFailedAIType( 'general' );
			} else if ( getContextContent(aiContext) === 'failedReload' ){
				console.log( 'AI Content has failed, reload page required.' );
				setFailedAI( true );
				setFailedAIType( 'reload' );
			}
		}
		let allPatterns = thePatterns;
		if ( ! filterValue && contextTab === 'design' && selectedCategory && 'all' !== selectedCategory ) {
			allPatterns = allPatterns.filter( ( pattern ) =>
				pattern.categories?.includes( selectedCategory )
			);
		}
		if ( contextTab === 'context' && contextTax ) {
			allPatterns = allPatterns.filter( ( pattern ) =>
				pattern.contexts?.includes( contextTax )
			);
			//allPatterns.reverse();

			allPatterns = allPatterns.sort( ( pattern ) =>
				pattern?.hpcontexts?.includes( contextTax + '-hp' ) ? -1 : 1
			);
		}
		if ( useImageReplace === 'all' && imageCollection ) {
			let variation = 0;
			allPatterns = allPatterns.map( ( item, index ) => {
				if ( variation === 11 ) {
					variation = 0;
				}
				if ( item?.html ) {
					item['html'] = replaceImages( item.html, imageCollection, item.categories, item.name, variation);
					item['content'] = replaceImages( item.content, imageCollection, item.categories, item.name, variation);
				} else {
					item['content'] = replaceImages( item.content, imageCollection, item.categories, aiContext, variation);
				}
				variation ++;
				return item;
			} );
		}
		if ( contextTab === 'context' ) {
			const allContext = getAllContext();
			let variation = 0;
			allPatterns = allPatterns.map( ( item, index ) => {
				if ( variation === 11 ) {
					variation = 0;
				}
				if ( item?.html) {
					item['html'] = replaceContent( item.html, allContext, item.categories, aiContext, item.name, true );
					item['content'] = replaceContent( item.content, allContext, item.categories, aiContext, item.name );
				} else {
					item['content'] = replaceContent( item.content, allContext, item.categories, aiContext, variation );
				}
				variation ++;
				return item;
			} );
		}
		return searchItems( allPatterns, filterValue );
	}, [ filterValue, selectedCategory, thePatterns, aiContext, contextTab, contextStatesRef, imageCollection, useImageReplace, aINeedsData ] );
	const hasHTml = useMemo( () => {
		return ( patterns[Object.keys( patterns )[0]]?.html ? true : false );
	}, [ patterns ] );

	// Announce search results on change.
	useEffect( () => {
		if ( ! filterValue ) {
			return;
		}
		const count = filteredBlockPatterns.length;
		const resultsFoundMessage = sprintf(
			/* translators: %d: number of results. */
			_n( '%d result found.', '%d results found.', count ),
			count
		);
		debouncedSpeak( resultsFoundMessage );
	}, [ filterValue, debouncedSpeak ] );

	// Define selected style.
	const customStyles = useMemo( () => {
		let tempStyles = '';
		if ( ! selectedStyle || 'light' === selectedStyle ) {
			tempStyles = tempStyles.concat( `body {--global-content-edge-padding: 3rem;padding:0px !important;}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` );
		}
		if ( 'dark' === selectedStyle ) {
			tempStyles = tempStyles.concat( `body {--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};
			--global-content-edge-padding: 3rem;
			padding:0px !important;}.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette3']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}.wp-block-kadence-tabs.kb-pattern-active-tab-highlight .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title{ color:${kadence_blocks_params.global_colors['--global-palette9']} !important} .kb-pattern-light-color{--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` );
		} else if ( 'highlight' === selectedStyle ) {
			tempStyles = tempStyles.concat( `body {--global-palette1:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-content-edge-padding: 3rem;
			padding:0px !important; }.kb-submit-field .kb-forms-submit, .kb-btns-outer-wrap .wp-block-button__link {color:${kadence_blocks_params.global_colors['--global-palette9']};background:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btns-outer-wrap .kb-button.kb-btn-global-outline {color:${kadence_blocks_params.global_colors['--global-palette9']};border-color:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}.block-editor-block-list__layout.is-root-container>.wp-block[data-align=full] {margin-left: 0 !important;margin-right: 0 !important;}` );
		}
		if ( 'sm' === selectedFontSize ) {
			tempStyles = tempStyles.concat( `.block-editor-block-list__layout.is-root-container {--global-kb-font-size-xxxl:${kadence_blocks_params.font_sizes['xxl']};
			--global-kb-font-size-xxl:${kadence_blocks_params.font_sizes['xl']};
			--global-kb-font-size-xl:${kadence_blocks_params.font_sizes['lg']};
			--global-kb-font-size-lg:${kadence_blocks_params.font_sizes['md']}; }` );
		}
		const newStyles = [
			{ css: tempStyles }
		];
		return newStyles;
	}, [ selectedStyle, selectedFontSize ] );
	const customShadowStyles = useMemo( () => {
		let tempStyles = '.pattern-shadow-wrap .single-iframe-content {--global-content-width:1200px }';
		if ( ! selectedStyle || 'light' === selectedStyle ) {
			tempStyles = tempStyles.concat( `.single-iframe-content {--global-content-edge-padding: 3rem;padding:0px !important;}` );
		}
		if ( ! kadence_blocks_params.isKadenceT ) {
			const colorClasses = `.single-iframe-content .has-theme-palette-1-color { color: var(--global-palette1); }
			.single-iframe-content .has-theme-palette-2-color { color: var(--global-palette2); }
			.single-iframe-content .has-theme-palette-3-color { color: var(--global-palette3); }
			.single-iframe-content .has-theme-palette-4-color { color: var(--global-palette4); }
			.single-iframe-content .has-theme-palette-5-color { color: var(--global-palette5); }
			.single-iframe-content .has-theme-palette-6-color { color: var(--global-palette6); }
			.single-iframe-content .has-theme-palette-7-color { color: var(--global-palette7); }
			.single-iframe-content .has-theme-palette-8-color { color: var(--global-palette8); }
			.single-iframe-content .has-theme-palette-9-color { color: var(--global-palette9); }
			.single-iframe-content .has-theme-palette1-color { color: var(--global-palette1); }
			.single-iframe-content .has-theme-palette2-color { color: var(--global-palette2); }
			.single-iframe-content .has-theme-palette3-color { color: var(--global-palette3); }
			.single-iframe-content .has-theme-palette4-color { color: var(--global-palette4); }
			.single-iframe-content .has-theme-palette5-color { color: var(--global-palette5); }
			.single-iframe-content .has-theme-palette6-color { color: var(--global-palette6); }
			.single-iframe-content .has-theme-palette7-color { color: var(--global-palette7); }
			.single-iframe-content .has-theme-palette8-color { color: var(--global-palette8); }
			.single-iframe-content .has-theme-palette9-color { color: var(--global-palette9); }
			.single-iframe-content .has-theme-palette1-background-color { background-color: var(--global-palette1); }
			.single-iframe-content .has-theme-palette2-background-color { background-color: var(--global-palette2); }
			.single-iframe-content .has-theme-palette3-background-color { background-color: var(--global-palette3); }
			.single-iframe-content .has-theme-palette4-background-color { background-color: var(--global-palette4); }
			.single-iframe-content .has-theme-palette5-background-color { background-color: var(--global-palette5); }
			.single-iframe-content .has-theme-palette6-background-color { background-color: var(--global-palette6); }
			.single-iframe-content .has-theme-palette7-background-color { background-color: var(--global-palette7); }
			.single-iframe-content .has-theme-palette8-background-color { background-color: var(--global-palette8); }
			.single-iframe-content .has-theme-palette9-background-color { background-color: var(--global-palette9); }`
			tempStyles = tempStyles.concat( colorClasses );
		}
		if ( 'dark' === selectedStyle ) {
			tempStyles = tempStyles.concat( `.single-iframe-content {--global-palette1:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette3']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette4']};
			--global-content-edge-padding: 3rem;
			padding:0px !important;}.kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}} .kb-btn-custom-colors .kb-btns-outer-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette3']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}.wp-block-kadence-tabs.kb-pattern-active-tab-highlight .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title{ color:${kadence_blocks_params.global_colors['--global-palette9']} !important} .kb-pattern-light-color{--global-palette9:${kadence_blocks_params.global_colors['--global-palette9']}}` );
		} else if ( 'highlight' === selectedStyle ) {
			tempStyles = tempStyles.concat( `.single-iframe-content {--global-palette1:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette2:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette3:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette4:${kadence_blocks_params.global_colors['--global-palette9']};
			--global-palette5:${kadence_blocks_params.global_colors['--global-palette8']};
			--global-palette6:${kadence_blocks_params.global_colors['--global-palette7']};
			--global-palette7:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette8:${kadence_blocks_params.global_colors['--global-palette2']};
			--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']};
			--global-content-edge-padding: 3rem;
			padding:0px !important; }.single-iframe-content .kb-form .kadence-blocks-form-field .kb-forms-submit, .kb-buttons-wrap .wp-block-button__link {color:${kadence_blocks_params.global_colors['--global-palette9']};background:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-buttons-wrap .kb-button.kb-btn-global-outline {color:${kadence_blocks_params.global_colors['--global-palette3']};border-color:${kadence_blocks_params.global_colors['--global-palette3']};} .kb-btn-custom-colors .kb-buttons-wrap {--global-palette9:${kadence_blocks_params.global_colors['--global-palette1']}} img[src^="https://patterns.startertemplatecloud.com/wp-content/uploads/2023/02/Logo-ploaceholder"] {filter: invert(1);}` );
		}
		if ( 'sm' === selectedFontSize ) {
			tempStyles = tempStyles.concat( `.single-iframe-content {--global-kb-font-size-xxxl:${kadence_blocks_params.font_sizes['xxl']};
			--global-kb-font-size-xxl:${kadence_blocks_params.font_sizes['xl']};
			--global-kb-font-size-xl:${kadence_blocks_params.font_sizes['lg']};
			--global-kb-font-size-lg:${kadence_blocks_params.font_sizes['md']}; }` );
		}
		const newStyles = [
			{ css: tempStyles }
		];
		return newStyles;
	}, [ selectedStyle, selectedFontSize ] );
	const hasItems = !! filteredBlockPatterns?.length;
	return (
		<div className="block-editor-block-patterns-explorer__wrap">
			<div className="block-editor-block-patterns-explorer__list">
				{ hasItems && (
					<PatternsListHeader
						filterValue={ filterValue }
						filteredBlockPatternsLength={ filteredBlockPatterns.length }
					/>
				) }
				{/* { ! hasItems && ( selectedCategory && ( selectedCategory === 'posts-loop' || selectedCategory === 'featured-products' || selectedCategory === 'product-loop' ) ) && (
					<BannerHeader
						selectedCategory={ selectedCategory }
					/>
				) } */}
				{ contextTab === 'context' && aINeedsData && (
					<LaunchWizard launchWizard={ () => launchWizard() } />
				) }
				{ contextTab === 'context' && failedAI && (
					<LoadingFailedHeader type={ failedAIType } />
				) }
				{ contextTab === 'context' && ! aINeedsData && ( 'processing' === getContextState(aiContext) || 'loading' === getContextState(aiContext) ) && (
					<LoadingHeader type={getContextState(aiContext)} />
				) }
				{ contextTab === 'context' && ! aINeedsData && ( ! getContextState(aiContext) || 'credits' === getContextState(aiContext) ) && (
					<GenerateHeader context={ aiContext } contextLabel={ contextLabel } contextState={ getContextState(aiContext) } generateContext={ ( tempCon ) => generateContext( tempCon ) } />
				) }
				{ hasItems && !failedAI && (
					<KadenceBlockPatternList
						selectedCategory={ selectedCategory }
						blockPatterns={ filteredBlockPatterns }
						onClickPattern={ onSelectBlockPattern }
						showTitlesAsTooltip={ false }
						customStyles={ customStyles }
						customShadowStyles={ customShadowStyles }
						breakpointCols={ breakpointCols }
						previewMode={ previewMode }
						selectedStyle={ selectedStyle }
						renderType={ hasHTml ? 'shadow' : 'iframe' }
					/>
				) }
			</div>
		</div>
	);
}

export default PatternList;
