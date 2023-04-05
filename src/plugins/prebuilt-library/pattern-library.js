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
import { rawHandler } from '@wordpress/blocks';
import {
	Component,
} from '@wordpress/element';
//import { debounce } from '@wordpress/compose';
import { debounce } from 'lodash';
import {
	Button,
	TextControl,
	SearchControl,
	TextareaControl,
	SelectControl,
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
} from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import PatternList from './pattern-list';
import PageList from './page-list';
import { useMemo, useEffect, useState } from '@wordpress/element';
import {
	store as blockEditorStore,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers'

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
	const [ categories, setCategories ] = useState( { 
		'category': __( 'Category', 'kadence-blocks' ),
		'hero': __( 'Hero', 'kadence-blocks' ),
		'cards': __( 'Cards', 'kadence-blocks' ),
		'columns': __( 'Columns', 'kadence-blocks' ),
		'media-text': __( 'Media and Text', 'kadence-blocks' ),
		'counter-or-stats': __( 'Counter or Stats', 'kadence-blocks' ),
		'form': __( 'Form', 'kadence-blocks' ),
		'gallery': __( 'Gallery', 'kadence-blocks' ),
		'accordion': __( 'Accordion', 'kadence-blocks' ),
		'image': __( 'Image', 'kadence-blocks' ),
		'list': __( 'List', 'kadence-blocks' ),
		'location': __( 'Location', 'kadence-blocks' ),
		'logo-farm': __( 'Logo Farm', 'kadence-blocks' ),
		'team': __( 'Team', 'kadence-blocks' ),
		'post-loop': __( 'Post Loop', 'kadence-blocks' ),
		'pricing-table': __( 'Pricing Table', 'kadence-blocks' ),
		'slider': __( 'Slider', 'kadence-blocks' ),
		'tabs': __( 'Tabs', 'kadence-blocks' ),
		'testimonials': __( 'Testimonials', 'kadence-blocks' ),
		'title-or-header': __( 'Title or Header', 'kadence-blocks' ),
		'video': __( 'Video', 'kadence-blocks' ),
	 } );
	const [ categorySelectOptions, setCategorySelectOptions ] = useState( [] );
	const [ categoryListOptions, setCategoryListOptions ] = useState( [] );
	const [ pagesCategories, setPagesCategories ] = useState( { 'category': __( 'Category', 'kadence-blocks' ) } );
	const [ pageCategorySelectOptions, setPageCategorySelectOptions ] = useState( [] );
	const [ pageCategoryListOptions, setPageCategoryListOptions ] = useState( [] );
	const [ sidebar, setSidebar ] = useState( false );
	const [ gridSize, setGridSize ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isImporting, setIsImporting ] = useState( false );
	const [ isError, setIsError ] = useState( false );
	const [ style, setStyle ] = useState( '' );
	let data_key     = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_key ?  kadence_blocks_params.proData.api_key : '' );
	let data_email   = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_email ?  kadence_blocks_params.proData.api_email : '' );
	const product_id = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.product_id ?  kadence_blocks_params.proData.product_id : '' );
	if ( ! data_key ) {
		data_key = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.ithemes_key ?  kadence_blocks_params.proData.ithemes_key : '' );
		if ( data_key ) {
			data_email = 'iThemes';
		}
	}
	const onInsertContent = ( pattern ) => {
		const newPattern = {
			content: pattern?.content ? pattern.content : '',
			type: pattern?.type ? pattern.type : 'pattern',
			style: pattern?.style ? pattern.style : 'light',
			id: pattern?.id ? pattern.id : '',
		}
		importProcess( newPattern.content, newPattern.type, newPattern.id, newPattern.style );
	}
	const importProcess = ( blockcode, type = '', item_id = '', style = '' ) => {
		setIsImporting( true );
		var data = new FormData();
		data.append( 'action', 'kadence_import_process_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'import_content', blockcode );
		data.append( 'import_item_id', item_id );
		data.append( 'import_type', type );
		data.append( 'import_style', style );
		data.append( 'import_library', 'pattern' );
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				importContent( response, clientId );
				setIsImporting( false );
			}
		})
		.fail( function( error ) {
			console.log( error );
			setIsImporting( false );
		});
	}
	const reloadAllData = debounce( () => {
		setIsLoading( true );
		setIsError( false );
		setPatterns( 'loading' );
		setPages( 'loading' );

		// Prep Form.
		const data = new FormData();
		data.append( 'action', 'kadence_import_reload_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'product_id', product_id );
		data.append( 'package', 'section' );
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				const o = SafeParseJSON( response, false );
				if ( o ) {
					const cats = { 
						'category': __( 'Category', 'kadence-blocks' ),
						'hero': __( 'Hero', 'kadence-blocks' ),
						'cards': __( 'Cards', 'kadence-blocks' ),
						'columns': __( 'Columns', 'kadence-blocks' ),
						'media-text': __( 'Media and Text', 'kadence-blocks' ),
						'counter-or-stats': __( 'Counter or Stats', 'kadence-blocks' ),
						'form': __( 'Form', 'kadence-blocks' ),
						'gallery': __( 'Gallery', 'kadence-blocks' ),
						'accordion': __( 'Accordion', 'kadence-blocks' ),
						'image': __( 'Image', 'kadence-blocks' ),
						'list': __( 'List', 'kadence-blocks' ),
						'location': __( 'Location', 'kadence-blocks' ),
						'logo-farm': __( 'Logo Farm', 'kadence-blocks' ),
						'team': __( 'Team', 'kadence-blocks' ),
						'post-loop': __( 'Post Loop', 'kadence-blocks' ),
						'pricing-table': __( 'Pricing Table', 'kadence-blocks' ),
						'slider': __( 'Slider', 'kadence-blocks' ),
						'tabs': __( 'Tabs', 'kadence-blocks' ),
						'testimonials': __( 'Testimonials', 'kadence-blocks' ),
						'title-or-header': __( 'Title or Header', 'kadence-blocks' ),
						'video': __( 'Video', 'kadence-blocks' ),
					 };
					const filteredLibraryItems = applyFilters( 'kadence.prebuilt_object', o );
					kadence_blocks_params.library_sections = filteredLibraryItems;
					{ Object.keys( o ).map( function( key, index ) {
						if ( o[ key ].categories && typeof o[ key ].categories === "object") {
							{ Object.keys( o[ key ].categories ).map( function( ckey, i ) {
								if ( ! cats.hasOwnProperty( ckey ) ) {
									cats[ ckey ] = o[ key ].categories[ ckey ];
								}
							} ) }
						}
					} ) }
					setIsError( false );
					setPatterns( filteredLibraryItems );
					setCategories( cats );
				} else {
					setIsError( true );
					setPatterns( 'error' );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			setIsError( true );
			setPatterns( 'error' );
		});
		if ( ! isError ) {
			const pageData = new FormData();
			pageData.append( 'action', 'kadence_import_reload_prebuilt_pages_data' );
			pageData.append( 'security', kadence_blocks_params.ajax_nonce );
			pageData.append( 'api_key', data_key );
			pageData.append( 'api_email', data_email );
			pageData.append( 'product_id', product_id );
			pageData.append( 'package', 'pages' );
			jQuery.ajax( {
				method:      'POST',
				url:         kadence_blocks_params.ajax_url,
				data:        pageData,
				contentType: false,
				processData: false,
			} )
			.done( function( response, status, stately ) {
				if ( response ) {
					const o = SafeParseJSON( response, false );
					if ( o ) {
						const pageCats = { 'category': 'Category' };
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
						setIsError( false );
						setPages( o );
						setPagesCategories( pageCats );
					} else {
						setIsError( true );
						setPages( 'error' );
					}
				}
			})
			.fail( function( error ) {
				console.log(error);
				setIsError( true );
				setPages( 'error' );
			});
		}
		setIsLoading( false );
	}, 250 );
	const loadPatternData = debounce( () => {
		setIsLoading( true );
		setIsError( false );
		setPatterns( 'loading' );

		var data = new FormData();
		data.append( 'action', 'kadence_import_get_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'product_id', product_id );
		data.append( 'package', 'section' );
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				const o = SafeParseJSON( response, false );
				if ( o ) {
					const filteredLibraryItems = applyFilters( 'kadence.prebuilt_object', o );
					kadence_blocks_params.library_sections = filteredLibraryItems;
					const cats = { 
						'category': __( 'Category', 'kadence-blocks' ),
						'hero': __( 'Hero', 'kadence-blocks' ),
						'cards': __( 'Cards', 'kadence-blocks' ),
						'columns': __( 'Columns', 'kadence-blocks' ),
						'media-text': __( 'Media and Text', 'kadence-blocks' ),
						'counter-or-stats': __( 'Counter or Stats', 'kadence-blocks' ),
						'form': __( 'Form', 'kadence-blocks' ),
						'gallery': __( 'Gallery', 'kadence-blocks' ),
						'accordion': __( 'Accordion', 'kadence-blocks' ),
						'image': __( 'Image', 'kadence-blocks' ),
						'list': __( 'List', 'kadence-blocks' ),
						'location': __( 'Location', 'kadence-blocks' ),
						'logo-farm': __( 'Logo Farm', 'kadence-blocks' ),
						'team': __( 'Team', 'kadence-blocks' ),
						'post-loop': __( 'Post Loop', 'kadence-blocks' ),
						'pricing-table': __( 'Pricing Table', 'kadence-blocks' ),
						'slider': __( 'Slider', 'kadence-blocks' ),
						'tabs': __( 'Tabs', 'kadence-blocks' ),
						'testimonials': __( 'Testimonials', 'kadence-blocks' ),
						'title-or-header': __( 'Title or Header', 'kadence-blocks' ),
						'video': __( 'Video', 'kadence-blocks' ),
					 };
					{ Object.keys( o ).map( function( key, index ) {
						//console.log( o[ key ].categories );
						if ( o[ key ].categories && typeof o[ key ].categories === "object") {
							{ Object.keys( o[ key ].categories ).map( function( ckey, i ) {
								if ( ! cats.hasOwnProperty( ckey ) ) {
									cats[ ckey ] = o[ key ].categories[ ckey ];
								}
							} ) }
						}
					} ) }
					setIsError( false );
					setIsLoading( false );
					setPatterns( filteredLibraryItems );
					setCategories( cats );
				} else {
					setIsError( true );
					setIsLoading( false );
					setPatterns( 'error' );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			setIsError( true );
			setIsLoading( false );
			setPatterns( 'error' );
		});
	}, 250 );
	const loadPagesData = debounce( () => {
		setIsLoading( true );
		setIsError( false );
		setPages( 'loading' );

		var data = new FormData();
		data.append( 'action', 'kadence_import_get_prebuilt_pages_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'product_id', product_id );
		data.append( 'package', 'pages' );
		var control = this;
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				const o = SafeParseJSON( response, false );
				if ( o ) {
					const pageCats = { 'category': 'Category' };
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
					setIsLoading( false );
					setIsError( false );
					setPages( o );
					setPagesCategories( pageCats );
				} else {
					setIsLoading( false );
					setIsError( true );
					setPages( 'error' );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			setIsLoading( false );
			setIsError( true );
			setPages( 'error' );
		});
	}, 250 );
	if ( reload && ! isLoading ) {
		onReload();
		reloadAllData();
	}
	const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
	const sidebar_saved_enabled = ( activeStorage && activeStorage['sidebar'] ? activeStorage['sidebar'] : 'show' );
	const savedGridSize = ( activeStorage && activeStorage['grid'] ? activeStorage['grid'] : 'normal' );
	const savedStyle = ( undefined !== activeStorage?.style && '' !== activeStorage?.style ? activeStorage.style : 'light' );
	const savedTab = ( undefined !== activeStorage?.subTab && '' !== activeStorage?.subTab ? activeStorage.subTab : 'patterns' );
	const savedSelectedCategory = ( undefined !== activeStorage?.kbCat && '' !== activeStorage?.kbCat ? activeStorage.kbCat : 'all' );
	const savedSelectedPageCategory = ( undefined !== activeStorage?.kbPageCat && '' !== activeStorage?.kbPageCat ? activeStorage.kbPageCat : 'all' );
	const sidebarEnabled = ( sidebar ? sidebar : sidebar_saved_enabled );
	const theGridSize = ( gridSize ? gridSize : savedGridSize );
	const selectedCategory = ( category ? category : savedSelectedCategory );
	const selectedPageCategory = ( pageCategory ? pageCategory : savedSelectedPageCategory );
	const selectedStyle = ( style ? style : savedStyle );
	const selectedSubTab = ( subTab ? subTab : savedTab );
	useEffect( () => {
		setCategorySelectOptions( Object.keys( categories ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: categories[key] }
		} ) );
		setCategoryListOptions( Object.keys( categories ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: ( 'category' === key ? __( 'All', 'kadence-blocks' ) : categories[key] ) }
		} ) );
	}, [ categories ] );
	useEffect( () => {
		setPageCategorySelectOptions( Object.keys( pagesCategories ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: pagesCategories[key] }
		} ) );
		setPageCategoryListOptions( Object.keys( pagesCategories ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: ( 'category' === key ? __( 'All', 'kadence-blocks' ) : pagesCategories[key] ) }
		} ) );
	}, [ pagesCategories ] );
	const styleOptions = [
		{ value: 'light', label: __( 'Light', 'kadence-blocks' ) },
		{ value: 'dark', label: __( 'Dark', 'kadence-blocks' ) },
		{ value: 'highlight', label: __( 'Highlight', 'kadence-blocks' ) }
	];
	// let breakpointColumnsObj = {
	// 	default: 4,
	// 	1900: 3,
	// 	1600: 3,
	// 	1200: 2,
	// 	500: 2,
	// };
	// if ( theGridSize === 'large' ) {
	// 	breakpointColumnsObj = {
	// 		default: 3,
	// 		1900: 3,
	// 		1600: 2,
	// 		1200: 2,
	// 		500: 1,
	// 	};
	// }
	const breakpointColumnsObj = {
		default: 3,
		1900: 3,
		1600: 3,
		1200: 2,
		500: 1,
	};
	return (
		<div className={ `kt-prebuilt-content${ ( sidebarEnabled === 'show' ? ' kb-prebuilt-has-sidebar' : '' ) }` }>
			{ sidebarEnabled === 'show' && (
				<div className="kt-prebuilt-sidebar kb-section-sidebar">
					<div className="kb-library-sidebar-top">
						<SearchControl
							value={ search }
							placeholder={ __( 'Search', 'kadence-blocks' ) }
							onChange={ value => setSearch( value ) }
						/>
						{/* <Button
							className={ 'kb-trigger-sidebar' }
							icon={ previous }
							onClick={ () => {
								const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
								tempActiveStorage['sidebar'] = 'hide';
								localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
								setSidebar( 'hide' );
							}}
						/> */}
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
					{ ! search && (
						<div className="kb-library-sidebar-bottom-wrap">
							<div className="kb-library-sidebar-bottom">
								{ selectedSubTab === 'pages' ? (
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
								) : (
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
							</div>
						</div>
					) }
					{ selectedSubTab !== 'pages' && (
						<div className="kb-library-sidebar-fixed-bottom kb-library-color-select-wrap">
							<h2>{ __( 'Change Colors', 'kadence-blocks' ) }</h2>
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
			) }
			{ sidebarEnabled !== 'show' && (
				<div className="kt-prebuilt-header kb-library-header">
					<div className="kb-library-header-left">
						<Button
							className={ 'kb-trigger-sidebar' }
							icon={ next }
							onClick={ () => {
								const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
								tempActiveStorage['sidebar'] = 'show';
								localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
								setSidebar( 'show' );
							} }
						/>
						{ selectedSubTab === 'pages' ? (
							<SelectControl
								className={ "kb-library-header-cat-select" }
								value={ selectedPageCategory }
								options={ pageCategorySelectOptions }
								onChange={ value => {
									const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									tempActiveStorage['kbPageCat'] = value;
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
									setPageCategory( value );
								}}
							/>
						) : (
							<SelectControl
								className={ "kb-library-header-cat-select" }
								value={ selectedCategory }
								options={ categorySelectOptions }
								onChange={ value => {
									const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									tempActiveStorage['kbCat'] = value;
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
									setCategory( value );
								}}
							/>
						) }
					</div>
					<div className="kb-library-header-right">
						{ selectedSubTab !== 'pages' && (
							<div className="kb-library-header-colors kb-library-color-select-wrap">
								<h2>{ __( 'Change Colors', 'kadence-blocks' ) }</h2>
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
						{/* <Button
							icon={  <svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 32 32"
								>
								<path d="M8 15h7V8H8v7zm9-7v7h7V8h-7zm0 16h7v-7h-7v7zm-9 0h7v-7H8v7z"></path>
								</svg> }
							className={ 'kb-grid-btns kb-trigger-large-grid-size' + ( theGridSize === 'large' ? ' is-pressed' : '' ) }
							aria-pressed={ theGridSize === 'large' }
							onClick={ () => {
								const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
								tempActiveStorage['grid'] = 'large';
								localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
								this.setState( { theGridSize: 'large' } );
							} }
						/>
						<Button
							icon={ <svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 32 32"
								>
								<path d="M8 12h4V8H8v4zm6 0h4V8h-4v4zm6-4v4h4V8h-4zM8 18h4v-4H8v4zm6 0h4v-4h-4v4zm6 0h4v-4h-4v4zM8 24h4v-4H8v4zm6 0h4v-4h-4v4zm6 0h4v-4h-4v4z"></path>
								</svg> }
							className={ 'kb-grid-btns kb-trigger-normal-grid-size' + ( theGridSize === 'normal' ? ' is-pressed' : '' ) }
							aria-pressed={ theGridSize === 'normal' }
							onClick={ () => {
								const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
								tempActiveStorage['grid'] = 'normal';
								localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
								this.setState( { theGridSize: 'normal' } );
							} }
						/> */}
						<SearchControl
							value={ search }
							placeholder={ __( 'Search', 'kadence-blocks' ) }
							onChange={ value => setSearch( value ) }
						/>
					</div>
				</div>
			) }
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
							{ isError && (
								<div>
									<h2 style={ { textAlign:'center' } }>
										{ __( 'Error, Unable to access library database, please try re-syncing', 'kadence-blocks' ) }
									</h2>
									<div style={ { textAlign:'center' } }>
										<Button
											className="kt-reload-templates"
											icon={ update }
											onClick={ () => reloadAllData() }
										>
											{ __( ' Sync with Cloud', 'kadence-blocks' ) }
										</Button>
									</div>
								</div>
							) }
							{ false === pages && (
								<>{ loadPagesData() }</>
							) }
						</>
					) : (
						<PageList
							pages={ pages }
							filterValue={ search }
							selectedCategory={ selectedPageCategory }
							patternCategories={ pageCategorySelectOptions }
							selectedStyle={ selectedStyle }
							breakpointCols={ breakpointColumnsObj }
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
							{ isError && (
								<div>
									<h2 style={ { textAlign:'center' } }>
										{ __( 'Error, Unable to access library database, please try re-syncing', 'kadence-blocks' ) }
									</h2>
									<div style={ { textAlign:'center' } }>
										<Button
											className="kt-reload-templates"
											icon={ update }
											onClick={ () => reloadAllData() }
										>
											{ __( ' Sync with Cloud', 'kadence-blocks' ) }
										</Button>
									</div>
								</div>
							) }
							{ false === patterns && (
								<>{ loadPatternData() }</>
							) }
						</>
					) : (
						<PatternList
							patterns={ patterns }
							filterValue={ search }
							selectedCategory={ selectedCategory }
							patternCategories={ categorySelectOptions }
							selectedStyle={ selectedStyle }
							breakpointCols={ breakpointColumnsObj }
							onSelect={ ( pattern ) => onInsertContent( pattern ) }
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
				canUserUseUnfilteredHTML: select( 'core/editor' ).canUserUseUnfilteredHTML(),
			};
		},
		[]
	);
	return <PatternLibraryWrapper canUserUseUnfilteredHTML={ canUserUseUnfilteredHTML }  { ...props } />;
};
export default PatternLibraryEdit;