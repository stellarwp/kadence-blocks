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
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
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

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers';

import { kadenceCatNewIcon, kadenceNewIcon, aiIcon, aiSettings } from '@kadence/icons';

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
	const [ contextOptions, setContextOptions ] = useState( {
		'hero': __( 'Website Hero', 'kadence-blocks' ),
		'about': __( 'About', 'kadence-blocks' ),
		'products-services': __( 'Products or Services', 'kadence-blocks' ),
		'call-to-action': __( 'Call to Action', 'kadence-blocks' ),
		'work': __( 'Work', 'kadence-blocks' ),
		'faq': __( 'FAQ', 'kadence-blocks' ),
		'value-prop': __( 'Value Proposition', 'kadence-blocks' ),
		'news': __( 'News', 'kadence-blocks' ),
		'blog': __( 'Blog', 'kadence-blocks' ),
		'contact': __( 'Contact', 'kadence-blocks' ),
		'subscribe': __( 'Subscribe', 'kadence-blocks' ),
		'welcome': __( 'Welcome', 'kadence-blocks' ),
		'location': __( 'Location', 'kadence-blocks' ),
		'partners': __( 'Partners', 'kadence-blocks' ),
		'team': __( 'Team', 'kadence-blocks' ),
		'testimonial': __( 'Testimonials', 'kadence-blocks' ),
		'profile': __( 'Profile', 'kadence-blocks' ),
		'mission': __( 'Mission', 'kadence-blocks' ),
		'history': __( 'History', 'kadence-blocks' ),
		'get-started': __( 'Get Started', 'kadence-blocks' ),
		'plans': __( 'Plans', 'kadence-blocks' ),
	 } );
	const [ contextListOptions, setContextListOptions ] = useState( [] );
	const [ pagesCategories, setPagesCategories ] = useState( { 'category': __( 'Category', 'kadence-blocks' ) } );
	const [ pageCategorySelectOptions, setPageCategorySelectOptions ] = useState( [] );
	const [ pageCategoryListOptions, setPageCategoryListOptions ] = useState( [] );
	const [ sidebar, setSidebar ] = useState( false );
	const [ gridSize, setGridSize ] = useState( '' );
	const [ previewMode, setPreviewMode ] = useState();
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isImporting, setIsImporting ] = useState( false );
	const [ isLoadingAI, setIsLoadingAI ] = useState( false );
	const [ isError, setIsError ] = useState( false );
	const [ style, setStyle ] = useState( '' );
	const [ fontSize, setFontSize ] = useState( '' );
	const [ isVisible, setIsVisible ] = useState( false );
	const [ isContextReloadVisible, setIsContextReloadVisible ] = useState( false );
	const [ popoverContextAnchor, setPopoverContextAnchor ] = useState();
	const [ popoverAnchor, setPopoverAnchor ] = useState();
    const toggleVisible = () => {
        setIsVisible( ( state ) => ! state );
    };
	const toggleReloadVisible = () => {
		console.log( "here" );
        setIsContextReloadVisible( ( state ) => ! state );
    };
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
					setIsLoading( false );
				} else {
					setIsError( true );
					setPatterns( 'error' );
					setIsLoading( false );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			setIsError( true );
			setPatterns( 'error' );
			setIsLoading( false );
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
	const savedPreviewMode = ( undefined !== activeStorage?.previewMode && '' !== activeStorage?.previewMode ? activeStorage.previewMode : 'iframe' );
	const savedFontSize = ( undefined !== activeStorage?.fontSize && '' !== activeStorage?.fontSize ? activeStorage.fontSize : 'lg' );
	const savedContextTab = ( undefined !== activeStorage?.contextTab && '' !== activeStorage?.contextTab ? activeStorage.contextTab : 'design' );
	const savedContext = ( undefined !== activeStorage?.context && '' !== activeStorage?.context ? activeStorage.context : 'about' );
	const sidebarEnabled = ( sidebar ? sidebar : sidebar_saved_enabled );
	const theGridSize = ( gridSize ? gridSize : savedGridSize );
	const selectedCategory = ( category ? category : savedSelectedCategory );
	const selectedPageCategory = ( pageCategory ? pageCategory : savedSelectedPageCategory );
	const selectedPreviewMode = ( previewMode ? previewMode : savedPreviewMode );
	const selectedStyle = ( style ? style : savedStyle );
	const selectedFontSize = ( fontSize ? fontSize : savedFontSize );
	const selectedSubTab = ( subTab ? subTab : savedTab );
	const selectedContextTab = ( contextTab ? contextTab : savedContextTab );
	const selectedContext = ( context ? context : savedContext );
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
	useEffect( () => {
		setContextListOptions( Object.keys( contextOptions ).map( function( key, index ) {
			return { value: key, label: contextOptions[key] }
		} ) );
	}, [] );
	const loadAI = async ( theContext ) => {
		const response = await apiFetch( {
			path: addQueryArgs( '/kb-design-library/v1/get', {
				context: theContext,
				api_key: data_key,
				api_email: data_email,
			} ),
		} );
		if ( response === 'processing' ) {
			console.log( 'is processing' );
			setTimeout( () => {
				loadAI( theContext );
			}, 1000 );
		} else if ( response === 'error' ) {
			console.log( 'Error getting AI Content.' );
			const newAiContent = { ...aiContent };
			newAiContent[theContext] = 'failed';
			console.log( newAiContent );
			setAIContent( newAiContent );
		} else {
			const o = SafeParseJSON( response, false );
			const newAiContent = { ...aiContent };
			newAiContent[theContext] = o;
			console.log( newAiContent );
			setAIContent( newAiContent );
		}
	};
	const reloadAI = async ( theContext ) => {
		const response = await apiFetch( {
			path: addQueryArgs( '/kb-design-library/v1/get', {
				reload: true,
				context: theContext,
				api_key: data_key,
				api_email: data_email,
			} ),
		} );
		console.log(  response );
		if ( response === 'processing' ) {
			console.log( 'is processing' );
			setTimeout( () => {
				reloadAI( theContext );
			}, 1000 );
		} else if ( response === 'error' ) {
			console.log( 'Error getting AI Content.' );
			const newAiContent = { ...aiContent };
			newAiContent[theContext] = 'failed';
			console.log( newAiContent );
			setAIContent( newAiContent );
		} else {
			const o = SafeParseJSON( response, false );
			const newAiContent = { ...aiContent };
			newAiContent[theContext] = o;
			console.log( newAiContent );
			setAIContent( newAiContent );
		}
	};
	const loadVerticals = async () => {
		const response = await apiFetch( {
			path: addQueryArgs( '/kb-design-library/v1/get_verticals', {
				api_key: data_key,
				api_email: data_email,
			} ),
		} );
		const o = SafeParseJSON( response, false );
		console.log( o );
	};
	const loadCollections = async () => {
		const response = await apiFetch( {
			path: addQueryArgs( '/kb-design-library/v1/get_image_collections', {
				api_key: data_key,
				api_email: data_email,
			} ),
		} );
		const o = SafeParseJSON( response, false );
		console.log( o );
	};
	const loadACollection = async () => {
		const response = await apiFetch( {
			path: addQueryArgs( '/kb-design-library/v1/get_images', {
				context: 'Consulting',
				api_key: data_key,
				api_email: data_email,
			} ),
		} );
		const o = SafeParseJSON( response, false );
		console.log( o );
	};
	useEffect( () => {
		loadVerticals();
		loadCollections();
		loadACollection();
		loadAI( selectedContext );
	}, [selectedContext] );

	const styleOptions = [
		{ value: 'light', label: __( 'Light', 'kadence-blocks' ) },
		{ value: 'dark', label: __( 'Dark', 'kadence-blocks' ) },
		{ value: 'highlight', label: __( 'Highlight', 'kadence-blocks' ) }
	];
	const sizeOptions = [
		{ value: 'sm', label: __( 'Smaller', 'kadence-blocks' ) },
		{ value: 'lg', label: __( 'Normal', 'kadence-blocks' ) }
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
									<ToggleControl
										label={__( 'Disable Live Preview', 'kadence-blocks' )}
										checked={selectedPreviewMode === 'image'}
										help={__('If disabled you will not see a live preview of how the patterns will look on your site.')}
										onChange={( value ) => {
											const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
											tempActiveStorage['previewMode'] = value ? 'image' : 'iframe';
											localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
											setPreviewMode( ( value ? 'image' : 'iframe' ) );
										}}
									/>
									{/* <div className="kb-library-size-options">
										{ sizeOptions.map( ( size, index ) =>
											<Button
												key={ `${ size.value }-${ index }` }
												className={ 'kb-size-button kb-size-' + size.value + ( selectedFontSize === size.value ? ' is-pressed' : '' ) }
												aria-pressed={ selectedFontSize === size.value }
												onClick={ () => {
													const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
													tempActiveStorage['fontSize'] = size.value;
													localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
													setFontSize( size.value );
												}}
											>
												{size.label}
											</Button>
										) }
									</div> */}
								</Popover>
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
												<div className='context-category-wrap'>
													<Button
														key={ `${ contextCategory.value }-${ index }` }
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
																key={ `reload-${ contextCategory.value }-${ index }` }
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
																	<ToggleControl
																		label={__( 'Disable Live Preview', 'kadence-blocks' )}
																		checked={selectedPreviewMode === 'image'}
																		help={__('If disabled you will not see a live preview of how the patterns will look on your site.')}
																		onChange={( value ) => {
																			const tempActiveStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
																			tempActiveStorage['previewMode'] = value ? 'image' : 'iframe';
																			localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( tempActiveStorage ) );
																			setPreviewMode( ( value ? 'image' : 'iframe' ) );
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
							selectedFontSize={ selectedFontSize }
							breakpointCols={ breakpointColumnsObj }
							aiContext={ selectedContext }
							aiContent={ aiContent }
							contextTab={ selectedContextTab }
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
							selectedFontSize={ selectedFontSize }
							breakpointCols={ breakpointColumnsObj }
							contextTab={ selectedContextTab }
							aiContent={ aiContent }
							aiContext={ selectedContext }
							previewMode={ savedPreviewMode }
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
				canUserUseUnfilteredHTML: select( 'core/editor' ) ? select( 'core/editor' ).canUserUseUnfilteredHTML() : false
			};
		},
		[]
	);
	return <PatternLibraryWrapper canUserUseUnfilteredHTML={ canUserUseUnfilteredHTML }  { ...props } />;
};
export default PatternLibraryEdit;