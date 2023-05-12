/**
 * Handle Section Library.
 */

/**
 * Globals.
 */
const {
	localStorage,
} = window;

/**
 * WordPress dependencies
 */
const {
	applyFilters,
} = wp.hooks;

import {
	withSelect,
	useSelect,
	withDispatch,
} from '@wordpress/data';
/**
 * WordPress dependencies
 */
import { parse, rawHandler } from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	Component,
} from '@wordpress/element';
import { debounce, isEqual } from 'lodash';
import {
	Button,
	TextControl,
	SearchControl,
	TextareaControl,
	SelectControl,
	Popover,
	ToggleControl,
	VisuallyHidden,
	ExternalLink,
	Spinner,
} from '@wordpress/components';
import {
	arrowLeft,
	download,
	previous,
	update,
	next,
	edit,
	chevronLeft,
	chevronDown,
	settings,
} from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import PatternList from './pattern-list';
import PageList from './page-list';
import { useMemo, useEffect, useState } from '@wordpress/element';
import {
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { getAsyncData } from './data-fetch/get-async-data';
/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';

import { kadenceNewIcon, aiIcon, aiSettings } from '@kadence/icons';
import { AiWizard } from './ai-wizard';
import { PAGE_CATEGORIES, PATTERN_CONTEXTS, PATTERN_CATEGORIES } from './data-fetch/constants';

/**
 * Prebuilt Sections.
 */
function PatternLibrary( {
	importContent,
	clientId,
	reload = false,
	onReload,
 } ) {
	const [ category, setCategory ] = useState( '' );
	const [ pageCategory, setPageCategory ] = useState( '' );
	const [ search, setSearch ] = useState( null );
	const [ subTab, setSubTab ] = useState( '' );
	const [ patterns, setPatterns ] = useState( false );
	const [ pages, setPages ] = useState( false );
	const [ aiContent, setAIContent ] = useState( {} );
	const [ context, setContext ] = useState( '' );
	const [ contextTab, setContextTab ] = useState( '' );
	const [ aIUserData, setAIUserData ] = useState( false );
	const [ imageCollection, setImageCollection ] = useState( {} );
	const [ categories, setCategories ] = useState( PATTERN_CATEGORIES );
	const [ categoryListOptions, setCategoryListOptions ] = useState( [] );
	const [ contextOptions, setContextOptions ] = useState( PATTERN_CONTEXTS );
	const [ contextListOptions, setContextListOptions ] = useState( [] );
	const [ pagesCategories, setPagesCategories ] = useState( PAGE_CATEGORIES );
	const [ pageCategoryListOptions, setPageCategoryListOptions ] = useState( [] );
	const [ previewMode, setPreviewMode ] = useState();
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isImporting, setIsImporting ] = useState( false );
	const [ isLoadingAI, setIsLoadingAI ] = useState( false );
	const [ wizardState, setWizardState ] = useState( {
		visible: false,
		photographyOnly: false
	} );
	const [ isError, setIsError ] = useState( false );
	const [ isErrorType, setIsErrorType ] = useState( 'general' );
	const [ style, setStyle ] = useState( '' );
	const [ replaceImages, setReplaceImages ] = useState( '' );
	const [ fontSize, setFontSize ] = useState( '' );
	const [ aiDataState, triggerAIDataReload ] = useState( false );
	const [ isVisible, setIsVisible ] = useState( false );
	const [ isContextReloadVisible, setIsContextReloadVisible ] = useState( false );
	const [ popoverContextAnchor, setPopoverContextAnchor ] = useState();
	const [ popoverAnchor, setPopoverAnchor ] = useState();
    const toggleVisible = () => {
        setIsVisible( ( state ) => ! state );
    };
	const toggleReloadVisible = () => {
        setIsContextReloadVisible( ( state ) => ! state );
    };
	const closeAIWizard = () => {
		setWizardState( {
			visible: false,
			photographyOnly: false
		} );
		triggerAIDataReload( ( state ) => ! state );
	};
	const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
	const savedStyle = ( undefined !== activeStorage?.style && '' !== activeStorage?.style ? activeStorage.style : 'light' );
	const savedTab = ( undefined !== activeStorage?.subTab && '' !== activeStorage?.subTab ? activeStorage.subTab : 'patterns' );
	const savedSelectedCategory = ( undefined !== activeStorage?.kbCat && '' !== activeStorage?.kbCat ? activeStorage.kbCat : 'all' );
	const savedSelectedPageCategory = ( undefined !== activeStorage?.kbPageCat && '' !== activeStorage?.kbPageCat ? activeStorage.kbPageCat : 'all' );
	const savedPreviewMode = ( undefined !== activeStorage?.previewMode && '' !== activeStorage?.previewMode ? activeStorage.previewMode : 'iframe' );
	const savedReplaceImages = ( undefined !== activeStorage?.replaceImages && '' !== activeStorage?.replaceImages ? activeStorage.replaceImages : 'all' );
	const savedFontSize = ( undefined !== activeStorage?.fontSize && '' !== activeStorage?.fontSize ? activeStorage.fontSize : 'lg' );
	const savedContextTab = ( undefined !== activeStorage?.contextTab && '' !== activeStorage?.contextTab ? activeStorage.contextTab : 'design' );
	const savedContext = ( undefined !== activeStorage?.context && '' !== activeStorage?.context ? activeStorage.context : 'about' );
	const selectedCategory = ( category ? category : savedSelectedCategory );
	const selectedPageCategory = ( pageCategory ? pageCategory : savedSelectedPageCategory );
	const selectedPreviewMode = ( previewMode ? previewMode : savedPreviewMode );
	const selectedStyle = ( style ? style : savedStyle );
	const selectedReplaceImages = ( replaceImages ? replaceImages : savedReplaceImages );
	const selectedFontSize = ( fontSize ? fontSize : savedFontSize );
	const selectedSubTab = ( subTab ? subTab : savedTab );
	const selectedContextTab = ( contextTab ? contextTab : savedContextTab );
	const selectedContext = ( context ? context : savedContext );
	useEffect( () => {
		setCategoryListOptions( Object.keys( categories ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: ( 'category' === key ? __( 'All', 'kadence-blocks' ) : categories[key] ) }
		} ) );
	}, [ categories ] );
	useEffect( () => {
		setPageCategoryListOptions( Object.keys( pagesCategories ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: ( 'category' === key ? __( 'All', 'kadence-blocks' ) : pagesCategories[key] ) }
		} ) );
	}, [ pagesCategories ] );
	useEffect( () => {
		setContextListOptions( Object.keys( contextOptions ).map( function( key, index ) {
			return { value: key, label: contextOptions[key] }
		} ) );
	}, [] );
	const { getAIContentData, getAIContentDataReload, getAIWizardData, getCollectionByIndustry, getPatterns, getPattern, processPattern } = getAsyncData();
	async function getLibraryContent( tempSubTab, tempReload ) {
		setIsLoading( true );
		setIsError( false );
		setIsErrorType( 'general' );
		const response = await getPatterns( ( tempSubTab === 'pages' ? 'pages' : 'section' ), tempReload );
		if ( response === 'failed' ) {
			console.log( 'Permissions Error getting library Content' );
			if ( tempSubTab === 'pages' ) {
				setPages( 'error' );
			} else {
				setPatterns( 'error' );
			}
			setIsError( true );
			setIsErrorType( 'reload' );
			setIsLoading( false );
		} else if ( response === 'error' ) {
			console.log( 'Error getting library Content.' );
			if ( tempSubTab === 'pages' ) {
				setPages( 'error' );
			} else {
				setPatterns( 'error' );
			}
			setIsError( true );
			setIsLoading( false );
		} else {
			const o = SafeParseJSON( response, false );
			if ( o ) {
				if ( tempSubTab === 'pages' ) {
					const pageCats = PAGE_CATEGORIES;
					kadence_blocks_params.library_pages = o;
					{ Object.keys( o ).map( function( key, index ) {
						if ( o[ key ].categories && typeof o[ key ].categories === "object") {
							{ Object.keys( o[ key ].categories ).map( function( ckey, i ) {
								if ( ! pageCats.hasOwnProperty( ckey ) ) {
									pageCats[ ckey ] = o[ key ].categories[ ckey ];
								}
							} ) }
						}
					} ) }
					setPagesCategories( pageCats );
					setPages( o );
				} else {
					const cats = PATTERN_CATEGORIES;
					kadence_blocks_params.library_sections = o;
					{ Object.keys( o ).map( function( key, index ) {
						if ( o[ key ].categories && typeof o[ key ].categories === "object") {
							{ Object.keys( o[ key ].categories ).map( function( ckey, i ) {
								if ( ! cats.hasOwnProperty( ckey ) ) {
									cats[ ckey ] = o[ key ].categories[ ckey ];
								}
							} ) }
						}
					} ) }
					setPatterns( o );
					setCategories( cats );
				}
			} else {
				if ( tempSubTab === 'pages' ) {
					setPages( 'error' );
				} else {
					setPatterns( 'error' );
				}
				setIsError( true );
			}
			setIsLoading( false );
		}
	}
	useEffect( () => {
		if ( reload && ! isLoading ) {
			onReload();
			getLibraryContent( selectedSubTab, true );
		} else if ( ! isLoading ) {
			getLibraryContent( selectedSubTab, false );
		}
	}, [reload, selectedSubTab] );
	const forceRefreshLibrary = () => {
		console.log( 'Force Refresh Library start');
		if ( ! isLoading && patterns ) {
			console.log( 'Force Refresh Library');
			setPatterns( JSON.parse(JSON.stringify(patterns)) );
		}
		if ( ! isLoading && pages ) {
			setPages( JSON.parse(JSON.stringify(pages)) );
		}
	}
	async function getAIContent( tempContext ) {
		setIsLoadingAI( true );
		const response = await getAIContentData( tempContext );
		if ( response === 'processing' ) {
			console.log( 'Is processing AI' );
			setTimeout( () => {
				getAIContent( tempContext );
			}, 1000 );
		} else if ( response === 'Failed' ) {
			console.log( 'Permissions Error getting AI Content.' );
			const newAiContent = { ...aiContent };
			newAiContent[tempContext] = 'failedReload';
			setAIContent( newAiContent );
			debounce( forceRefreshLibrary, 500 );
			setIsLoadingAI( false );
		} else if ( response === 'error' ) {
			console.log( 'Error getting AI Content.' );
			const newAiContent = { ...aiContent };
			newAiContent[tempContext] = 'failed';
			setAIContent( newAiContent );
			debounce( forceRefreshLibrary, 500 );
			setIsLoadingAI( false );
		} else {
			const o = SafeParseJSON( response, false );
			const newAiContent = { ...aiContent };
			newAiContent[tempContext] = o;
			console.log( newAiContent );
			setAIContent( newAiContent );
			debounce( forceRefreshLibrary, 500 );
			setIsLoadingAI( false );
		}
	}
	async function reloadAI( tempContext ) {
		setIsLoadingAI( true );
		const response = await getAIContentDataReload( tempContext, aiContent );
		if ( response === 'processing' ) {
			console.log( 'Is processing AI' );
			setTimeout( () => {
				getAIContent( tempContext );
			}, 1000 );
		} else if ( response === 'credits' ) {
			console.log( 'Error not enough credits to reload.' );
			setIsLoadingAI( false );
		} else {
			console.log( 'Error getting New AI Job.' );
			const newAiContent = { ...aiContent };
			newAiContent[tempContext] = 'failed';
			setAIContent( newAiContent );
			debounce( forceRefreshLibrary, 500 );
			setIsLoadingAI( false );
		}
	}
	useEffect( () => {
		getAIContent( selectedContext );
	}, [selectedContext] );
	async function getAIUserData() {
		const response = await getAIWizardData();
		const data = response ? SafeParseJSON(response) : {};
		setAIUserData(data);
	}
	async function getImageCollection() {
		const response = await getCollectionByIndustry( aIUserData );
		if ( ! isEqual( response, imageCollection ) ) {
			console.log( 'Image Collection Updating' );
			setImageCollection(response);
			forceRefreshLibrary();
		}
	}
	useEffect(() => {
		console.log( 'triggered recheck' );
		getAIUserData();
	}, [aiDataState]);
	useEffect(() => {
		if ( aIUserData ) {
			console.log( 'triggered data update recheck' );
			getImageCollection();
		}
	}, [aIUserData]);
	async function onInsertContent( pattern ) {
		setIsImporting( true );
		const response = await getPattern( ( pattern?.type === 'page' ? 'pages' : 'section' ), ( pattern?.type ? pattern.type : 'pattern' ), ( pattern?.id ? pattern.id : '' ), ( pattern?.style ? pattern.style : 'light' ) );
		let patternBlocks = pattern?.content ? pattern.content : '';
		if ( response && ! patternBlocks ) {
			patternBlocks = parse( response, {
				__unstableSkipMigrationLogs: true
			});
		}
		processImportContent( patternBlocks );
	}
	async function processImportContent( blockCode ) {
		const response = await processPattern( blockCode, imageCollection );
		if ( response === 'failed' ) {
			console.log( 'Import Process Failed when processing data.' );
			setIsError( true );
			setIsErrorType( 'reload' );
		} else {
			importContent( response, clientId );
		}
		setIsImporting( false );
	}
	const styleOptions = [
		{ value: 'light', label: __( 'Light', 'kadence-blocks' ) },
		{ value: 'dark', label: __( 'Dark', 'kadence-blocks' ) },
		{ value: 'highlight', label: __( 'Highlight', 'kadence-blocks' ) }
	];
	const sizeOptions = [
		{ value: 'sm', label: __( 'Smaller', 'kadence-blocks' ) },
		{ value: 'lg', label: __( 'Normal', 'kadence-blocks' ) }
	];
	const breakpointColumnsObj = {
		default: 3,
		1900: 3,
		1600: 3,
		1200: 2,
		500: 1,
	};
	return (
		<div className={ `kt-prebuilt-content kb-prebuilt-has-sidebar` }>
			<div className="kt-prebuilt-sidebar kb-section-sidebar">
				<div className='kb-prebuilt-sidebar-header-wrap'>
					<div className="kb-prebuilt-sidebar-header kb-prebuilt-library-logo">
						<span className="kb-prebuilt-header-logo">{ kadenceNewIcon }</span>
						<div className="kb-library-style-popover">
							<Button
								className={ 'kb-trigger-extra-settings' }
								icon={ aiSettings }
								ref={ setPopoverAnchor }
								isPressed={ isVisible }
								disabled={ isVisible }
								onClick={ toggleVisible }
							/>
							{ isVisible && (
								<Popover
									className="kb-library-extra-settings"
									placement="top-end"
									onClose={ debounce( toggleVisible, 100 ) }
									anchor={ popoverAnchor }
								>
									<Button
										className='kadence-ai-wizard-button'
										iconPosition='right'
										icon={ aiIcon }
										text={ __('Update My Information', 'kadence-blocks') }
										onClick={ () => {
											setIsVisible( false );
											setWizardState( {
												visible: true,
												photographyOnly: false
											} );
										}}
									/>
									{ selectedReplaceImages !== 'none' && (
										<Button
											className='kadence-ai-wizard-button'
											text={ __('Update Image Selection', 'kadence-blocks') }
											onClick={ () => {
												setIsVisible( false );
												setWizardState( {
													visible: true,
													photographyOnly: true
												} );
											}}
										/>
									) }
									<ToggleControl
										className='kb-toggle-align-right'
										label={__( 'Custom Image Selection', 'kadence-blocks' )}
										checked={selectedReplaceImages !== 'none'}
										help={__('If disabled you will import and preview only wireframe images.', 'kadence-blocks')}
										onChange={( value ) => {
											const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
											tempActiveStorage['replaceImages'] = ( value ? 'all' : 'none' );
											localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
											setPatterns( JSON.parse(JSON.stringify(patterns)) );
											setReplaceImages( ( value ? 'all' : 'none' ) );
										}}
									/>
									<ToggleControl
										className='kb-toggle-align-right'
										label={__( 'Live Preview', 'kadence-blocks' )}
										checked={selectedPreviewMode !== 'image'}
										help={__('If disabled you will not see a live preview of how the patterns will look on your site.', 'kadence-blocks')}
										onChange={( value ) => {
											const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
											tempActiveStorage['previewMode'] = value ? 'iframe' : 'image';
											localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
											setPreviewMode( ( value ? 'iframe' : 'image' ) );
										}}
									/>
								</Popover>
							) }
							{ wizardState.visible && (
								<AiWizard onClose={ closeAIWizard } photographyOnly={ wizardState.photographyOnly } />
							) }
						</div>
					</div>
					<div className="kb-library-sidebar-sub-choices">
						<Button
							className={ 'kb-subtab-button kb-trigger-patterns' + ( selectedSubTab === 'patterns' ? ' is-pressed' : '' ) }
							aria-pressed={ selectedSubTab === 'patterns' }
							onClick={ () => {
								const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
								tempActiveStorage['subTab'] = 'patterns';
								localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
								setSubTab( 'patterns' );
							}}
						>
							{ __( 'Patterns', 'kadence-blocks' ) }
						</Button>
						<Button
							className={ 'kb-subtab-button kb-trigger-pages' + ( selectedSubTab === 'pages' ? ' is-pressed' : '' ) }
							aria-pressed={ selectedSubTab === 'pages' }
							onClick={ () => {
								const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
								tempActiveStorage['subTab'] = 'pages';
								localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
								setSubTab( 'pages' );
							}}
						>
							{ __( 'Pages', 'kadence-blocks' ) }
						</Button>
					</div>
					{ selectedSubTab === 'pages' ? (
						<div className="kb-library-sidebar-context-choices">
							<Button
								className={ 'kb-context-tab-button kb-trigger-design' + ( selectedContextTab === 'design' ? ' is-pressed' : '' ) }
								aria-pressed={ selectedContextTab === 'design' }
								onClick={ () => {
									const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									tempActiveStorage['contextTab'] = 'design';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
									setContextTab( 'design' );
								}}
							>
								{ __( 'Wireframe', 'kadence-blocks' ) }
							</Button>
							<Button
								className={ 'kb-context-tab-button kb-trigger-context' + ( selectedContextTab === 'context' ? ' is-pressed' : '' ) }
								aria-pressed={ selectedContextTab === 'context' }
								icon={ aiIcon }
								iconPosition='right'
								iconSize={ 16 }
								text={ __( 'With Context', 'kadence-blocks' )}
								onClick={ () => {
									const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									tempActiveStorage['contextTab'] = 'context';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
									setContextTab( 'context' );
								}}
							/>
						</div>
					) : (
						<div className="kb-library-sidebar-context-choices">
							<Button
								className={ 'kb-context-tab-button kb-trigger-design' + ( selectedContextTab === 'design' ? ' is-pressed' : '' ) }
								aria-pressed={ selectedContextTab === 'design' }
								onClick={ () => {
									const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									tempActiveStorage['contextTab'] = 'design';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
									setPatterns( JSON.parse(JSON.stringify(patterns)) );
									setContextTab( 'design' );
								}}
							>
								{ __( 'By Design', 'kadence-blocks' ) }
							</Button>
							<Button
								className={ 'kb-context-tab-button kb-trigger-context' + ( selectedContextTab === 'context' ? ' is-pressed' : '' ) }
								aria-pressed={ selectedContextTab === 'context' }
								icon={ aiIcon }
								iconPosition='right'
								iconSize={ 16 }
								text={ __( 'By Context', 'kadence-blocks' )}
								onClick={ () => {
									const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									tempActiveStorage['contextTab'] = 'context';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
									setPatterns( JSON.parse(JSON.stringify(patterns)) );
									setContextTab( 'context' );
								}}
							/>
						</div>
					) }
				</div>
				<div className='kb-prebuilt-sidebar-body-wrap'>
					<div className="kb-library-sidebar-search">
						<SearchControl
							value={ search }
							placeholder={ __( 'Search', 'kadence-blocks' ) }
							onChange={ value => setSearch( value ) }
						/>
					</div>
					<div className="kb-library-sidebar-bottom-wrap">
						<div className="kb-library-sidebar-bottom">
							{ selectedSubTab === 'pages' ? (
								<>
									{ ! search && (
										<>
											{ pageCategoryListOptions.map( ( category, index ) =>
												<Button
													key={ `${ category.value }-${ index }` }
													className={ 'kb-category-button' + ( selectedPageCategory === category.value ? ' is-pressed' : '' ) }
													aria-pressed={ selectedPageCategory === category.value }
													onClick={ () => {
														const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
														tempActiveStorage['kbPageCat'] = category.value;
														localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
														setPageCategory( category.value );
													}}
												>
													{ category.label }
												</Button>
											) }
										</>
									) }
								</>
							) : (
								<>
									{ selectedContextTab === 'design' ? (
										<>
											{ ! search && (
												<>
													{ categoryListOptions.map( ( category, index ) =>
														<Button
															key={ `${ category.value }-${ index }` }
															className={ 'kb-category-button' + ( selectedCategory === category.value ? ' is-pressed' : '' ) }
															aria-pressed={ selectedCategory === category.value }
															onClick={ () => {
																const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
																tempActiveStorage['kbCat'] = category.value;
																localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
																setCategory( category.value );
															}}
														>
															{ category.label }
														</Button>
													) }
												</>
											) }
										</>
									) : (
										<>
											{ contextListOptions.map( ( contextCategory, index ) =>
												<div key={ `${ contextCategory.value }-${ index }` } className='context-category-wrap'>
													<Button
														className={ 'kb-category-button' + ( selectedContext === contextCategory.value ? ' is-pressed' : '' ) }
														aria-pressed={ selectedContext === contextCategory.value }
														onClick={ () => {
															const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
															tempActiveStorage['context'] = contextCategory.value;
															localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
															setContext( contextCategory.value );
														}}
													>
														{ contextCategory.label }
													</Button>
													{ selectedContext === contextCategory.value && (
														<>
															<Button
																className={ 'kb-reload-context-popover-toggle' + ( isContextReloadVisible ? ' is-pressed' : '' ) }
																aria-pressed={ isContextReloadVisible }
																ref={ setPopoverContextAnchor }
																icon={ update }
																disabled={ isContextReloadVisible }
																onClick={ debounce( toggleReloadVisible, 100 ) }
															>
															</Button>
															{ isContextReloadVisible && (
																<Popover
																	className="kb-library-extra-settings"
																	placement="top-end"
																	onClose={ debounce( toggleReloadVisible, 100 ) }
																	anchor={ popoverContextAnchor }
																>
																	<p>{__('You can regenerate ai content for this context. This will use one credit and your current ai text will be forever lost. Would you like to regenerate ai content for this context?', 'kadence-blocks')}</p>
																	<Button
																		variant='primary'
																		icon={ aiIcon }
																		iconSize={ 16 }
																		disabled={ isLoadingAI }
																		iconPosition='right'
																		text={ __( 'Regenerate AI Content', 'kadence-blocks' ) }
																		className={ 'kb-reload-context-confirm' }
																		onClick={ () => {
																			setIsContextReloadVisible(false);
																			reloadAI( selectedContext );
																		}}
																	/>
																</Popover>
															) }
														</>
													)}
												</div>
											) }
										</>
									) }
								</>
							) }
						</div>
					</div>
				</div>
				{ selectedSubTab !== 'pages' && (
					<div className="kb-library-sidebar-fixed-bottom kb-library-color-select-wrap">
						<h2>{ __( 'Style', 'kadence-blocks' ) }</h2>
						<div className="kb-library-style-options">
							{ styleOptions.map( ( style, index ) =>
								<Button
									key={ `${ style.value }-${ index }` }
									label={ style.label }
									className={ 'kb-style-button kb-style-' + style.value + ( selectedStyle === style.value ? ' is-pressed' : '' ) }
									aria-pressed={ selectedStyle === style.value }
									onClick={ () => {
										const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
										tempActiveStorage['style'] = style.value;
										localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
										setStyle( style.value );
									}}
								>
									<span></span>
								</Button>
							) }
						</div>
					</div>
				) }
			</div>
			{ selectedSubTab === 'pages' ? (
				<>
					{ ( isImporting || isLoading || false === pages || isError ) ? (
						<>
							{ ! isError && isLoading && (
								<div className="kb-loading-library"><Spinner /></div>
							) }
							{ ! isError && isImporting &&  (
								<div className="preparing-importing-images">
									<Spinner />
									<h2>{ __( 'Preparing Content...', 'kadence-blocks' ) }</h2>
								</div>
							) }
							{ isError && isErrorType === 'general' && (
								<div className='kb-pattern-error-wrapper'>
									<h2 style={ { textAlign:'center' } }>
										{ __( 'Error, Unable to access library database, please try re-syncing', 'kadence-blocks' ) }
									</h2>
									<div style={ { textAlign:'center' } }>
										<Button
											className="kt-reload-templates"
											icon={ update }
											onClick={ () => ! isLoading ? getLibraryContent( selectedSubTab, true ) : null }
										>
											{ __( ' Sync with Cloud', 'kadence-blocks' ) }
										</Button>
									</div>
								</div>
							) }
							{ isError && isErrorType === 'reload' && (
								<div className='kb-pattern-error-wrapper'>
									<h2 style={ { textAlign:'center' } }>
										{ __( 'Error, Unable to access library, please reload this page in your browser.', 'kadence-blocks' ) }
									</h2>
								</div>
							) }
							{/* { false === pages && (
								<>{ loadPagesData() }</>
							) } */}
						</>
					) : (
						<PageList
							pages={ pages }
							filterValue={ search }
							selectedCategory={ selectedPageCategory }
							selectedStyle={ selectedStyle }
							selectedFontSize={ selectedFontSize }
							breakpointCols={ breakpointColumnsObj }
							aiContext={ selectedContext }
							aiContent={ aiContent }
							contextTab={ selectedContextTab }
							imageCollection={ imageCollection }
							onSelect={ ( pattern ) => onInsertContent( pattern ) }
						/>
					) }
				</>
			) : (
				<>
					{ ( isImporting || isLoading || false === patterns || isError ) ? (
						<>
							{ ! isError && isLoading && (
								<div className="kb-loading-library"><Spinner /></div>
							) }
							{ ! isError && isImporting &&  (
								<div className="preparing-importing-images">
									<Spinner />
									<h2>{ __( 'Preparing Content...', 'kadence-blocks' ) }</h2>
								</div>
							) }
							{ isError && isErrorType === 'general' && (
								<div className='kb-pattern-error-wrapper'>
									<h2 style={ { textAlign:'center' } }>
										{ __( 'Error, Unable to access library database, please try re-syncing', 'kadence-blocks' ) }
									</h2>
									<div style={ { textAlign:'center' } }>
										<Button
											className="kt-reload-templates"
											icon={ update }
											onClick={ () => ! isLoading ? getLibraryContent( selectedSubTab, true ) : null }
										>
											{ __( ' Sync with Cloud', 'kadence-blocks' ) }
										</Button>
									</div>
								</div>
							) }
							{ isError && isErrorType === 'reload' && (
								<div className='kb-pattern-error-wrapper'>
									<h2 style={ { textAlign:'center' } }>
										{ __( 'Error, Unable to access library, please reload this page in your browser.', 'kadence-blocks' ) }
									</h2>
								</div>
							) }
						</>
					) : (
						<PatternList
							patterns={ patterns }
							filterValue={ search }
							selectedCategory={ selectedCategory }
							selectedStyle={ selectedStyle }
							selectedFontSize={ selectedFontSize }
							breakpointCols={ breakpointColumnsObj }
							contextTab={ selectedContextTab }
							aiContent={ aiContent }
							aiContext={ selectedContext }
							previewMode={ savedPreviewMode }
							imageCollection={ imageCollection }
							onSelect={ ( pattern ) => onInsertContent( pattern ) }
							isLoadingAI={ isLoadingAI }
							useImageReplace={ selectedReplaceImages }
						/>
					) }
				</>
			) }
		</div>
	);
}
const PatternLibraryWrapper = withDispatch(
	( dispatch, { canUserUseUnfilteredHTML } ) => ( {
		importContent( blockcode, clientId ) {
			const { replaceBlocks } = dispatch( blockEditorStore );
			replaceBlocks(
				clientId,
				rawHandler( {
					HTML: blockcode,
					mode: 'BLOCKS',
					canUserUseUnfilteredHTML,
				} ),
			);
		}
	} )
)( PatternLibrary );
const PatternLibraryEdit = ( props ) => {
	const { canUserUseUnfilteredHTML } = useSelect(
		( select ) => {
			return {
				canUserUseUnfilteredHTML: select( 'core/editor' ) ? select( 'core/editor' ).canUserUseUnfilteredHTML() : false
			};
		},
		[]
	);
	return <PatternLibraryWrapper canUserUseUnfilteredHTML={ canUserUseUnfilteredHTML }  { ...props } />;
};
export default PatternLibraryEdit;
