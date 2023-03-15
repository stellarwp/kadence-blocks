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
 * External dependencies
 */
 import { debounce } from 'lodash';
/**
 * WordPress dependencies
 */
const {
	applyFilters,
} = wp.hooks;

import {
	withSelect,
	withDispatch,
} from '@wordpress/data';
import { rawHandler } from '@wordpress/blocks';
import {
	Component,
	Fragment,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import {
	Button,
	TextControl,
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
	chevronLeft,
	chevronDown,
} from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import PatternList from './pattern-list';
import {
    BlockEditorProvider,
	__experimentalBlockPatternsList as BlockPatternsList,
	store as blockEditorStore,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { SafeParseJSON } from '@kadence/helpers'

/**
 * Prebuilt Sections.
 */
class PrebuiltSections extends Component {
	constructor() {
		super( ...arguments );
		this.loadTemplateData = this.loadTemplateData.bind( this );
		this.onInsertContent = this.onInsertContent.bind( this );
		this.importProcess = this.importProcess.bind( this );
		this.reloadTemplateData = this.reloadTemplateData.bind( this );
		this.state = {
			category: '',
			starting: true,
			search: null,
			tab: 'section',
			items: kadence_blocks_params.library_sections ? SafeParseJSON( kadence_blocks_params.library_sections, false ) : false,
			errorItems: false,
			isImporting: false,
			isLoading: false,
			sidebar: false,
			gridSize: '',
			categories: {
				'category': __( 'Category', 'kadence-blocks' ),
				'accordion': __( 'Accordion', 'kadence-blocks' ),
				'cards': __( 'Cards', 'kadence-blocks' ),
				'columns': __( 'Columns', 'kadence-blocks' ),
				'counter-or-stats': __( 'Counter or Stats', 'kadence-blocks' ),
				'form': __( 'Form', 'kadence-blocks' ),
				'gallery': __( 'Gallery', 'kadence-blocks' ),
				'hero': __( 'Hero', 'kadence-blocks' ),
				'image': __( 'Image', 'kadence-blocks' ),
				'list': __( 'List', 'kadence-blocks' ),
				'location': __( 'Location', 'kadence-blocks' ),
				'logo-farm': __( 'Logo Farm', 'kadence-blocks' ),
				'media-text': __( 'Media and Text', 'kadence-blocks' ),
				'people': __( 'People', 'kadence-blocks' ),
				'post-loop': __( 'Post Loop', 'kadence-blocks' ),
				'pricing-table': __( 'Pricing Table', 'kadence-blocks' ),
				'slider': __( 'Slider', 'kadence-blocks' ),
				'tabs': __( 'Tabs', 'kadence-blocks' ),
				'testimonials': __( 'Testimonials', 'kadence-blocks' ),
				'title-or-header': __( 'Title or Header', 'kadence-blocks' ),
				'video': __( 'Video', 'kadence-blocks' ),
			},
			style: '',
		};
		this.debouncedReloadTemplateData = debounce( this.reloadTemplateData.bind( this ), 200 );
	}
	onInsertContent( blockcode ) {
		this.importProcess( blockcode );
	}
	importProcess( blockcode ) {
		this.setState( { isImporting: true } );
		var data = new FormData();
		data.append( 'action', 'kadence_import_process_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'import_content', blockcode );
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
				control.props.import( response, control.props.clientId );
				control.setState( { isImporting: false } );
			}
		})
		.fail( function( error ) {
			console.log( error );
			control.setState( { isImporting: false } );
		});
	}
	reloadTemplateData() {
		this.setState( { errorItems: false, isLoading: true, items: 'loading' } );
		var data_key = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_key ?  kadence_blocks_params.proData.api_key : '' );
		var data_email = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_email ?  kadence_blocks_params.proData.api_email : '' );
		var product_id = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.product_id ?  kadence_blocks_params.proData.product_id : '' );
		if ( ! data_key ) {
			data_key = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.ithemes_key ?  kadence_blocks_params.proData.ithemes_key : '' );
			if ( data_key ) {
				data_email = 'iThemes';
			}
		}
		var data = new FormData();
		data.append( 'action', 'kadence_import_reload_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'product_id', product_id );
		data.append( 'package', 'section' );
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
					const filteredLibraryItems = applyFilters( 'kadence.prebuilt_object', o );
					kadence_blocks_params.library_sections = filteredLibraryItems;
					control.setState( { items: filteredLibraryItems, errorItems: false, isLoading: false } );
				} else {
					control.setState( { items: 'error', errorItems: true, isLoading: false } );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			control.setState( { items: 'error', errorItems: true, isLoading: false } );
		});
	}
	loadTemplateData() {
		this.setState( { errorItems: false, isLoading: true, items: 'loading' } );
		var data_key = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_key ?  kadence_blocks_params.proData.api_key : '' );
		var data_email = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.api_email ?  kadence_blocks_params.proData.api_email : '' );
		var product_id = ( kadence_blocks_params.proData &&  kadence_blocks_params.proData.product_id ?  kadence_blocks_params.proData.product_id : '' );
		if ( ! data_key ) {
			data_key = (  kadence_blocks_params.proData &&  kadence_blocks_params.proData.ithemes_key ?  kadence_blocks_params.proData.ithemes_key : '' );
			if ( data_key ) {
				data_email = 'iThemes';
			}
		}
		var data = new FormData();
		data.append( 'action', 'kadence_import_get_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'product_id', product_id );
		data.append( 'package', 'section' );
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
					const filteredLibraryItems = applyFilters( 'kadence.prebuilt_object', o );
					kadence_blocks_params.library_sections = filteredLibraryItems;
					control.setState( { items: filteredLibraryItems, errorItems: false, isLoading: false } );
				} else {
					control.setState( { items: 'error', errorItems: true, isLoading: false } );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			control.setState( { items: 'error', errorItems: true, isLoading: false } );
		});
	}
	render() {
		if ( this.props.reload ) {
			this.props.onReload();
			this.debouncedReloadTemplateData();
		}
		const activePanel = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
		const sidebar_saved_enabled = ( activePanel && activePanel['sidebar'] ? activePanel['sidebar'] : 'show' );
		const savedGridSize = ( activePanel && activePanel['grid'] ? activePanel['grid'] : 'normal' );
		const savedStyle = ( undefined !== activePanel?.style && '' !== activePanel?.style ? activePanel.style : 'light' );
		const savedSelectedCategory = ( undefined !== activePanel?.kbCat && '' !== activePanel?.kbCat ? activePanel.kbCat : 'all' );
		const sidebarEnabled = ( this.state.sidebar ? this.state.sidebar : sidebar_saved_enabled );
		const gridSize = ( this.state.gridSize ? this.state.gridSize : savedGridSize );
		const selectedCategory = ( this.state.category ? this.state.category : savedSelectedCategory );
		const selectedStyle = ( this.state.style ? this.state.style : savedStyle );
		const control = this;
		const libraryItems = this.state.items;
		const categoryItems = this.state.categories;
		const catOptions = Object.keys( categoryItems ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: categoryItems[key] }
		} );
		const sideCatOptions = Object.keys( categoryItems ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: ( 'category' === key ? __( 'All', 'kadence-blocks' ) : categoryItems[key] ) }
		} );
		const styleOptions = [
			{ value: 'light', label: __( 'Light', 'kadence-blocks' ) },
			{ value: 'dark', label: __( 'Dark', 'kadence-blocks' ) },
			{ value: 'highlight', label: __( 'Highlight', 'kadence-blocks' ) }
		];
		let breakpointColumnsObj = {
			default: 4,
			1900: 3,
			1600: 3,
			1200: 2,
			500: 2,
		};
		if ( gridSize === 'large' ) {
			breakpointColumnsObj = {
				default: 3,
				1900: 3,
				1600: 2,
				1200: 2,
				500: 1,
			};
		}
		return (
			<div className={ `kt-prebuilt-content${ ( sidebarEnabled === 'show' ? ' kb-prebuilt-has-sidebar' : '' ) }` }>
				{ sidebarEnabled === 'show' && (
					<div className="kt-prebuilt-sidebar">
						<div className="kb-library-sidebar-top">
							<TextControl
								type="text"
								value={ this.state.search }
								placeholder={ __( 'Search', 'kadence-blocks' ) }
								onChange={ value => this.setState( { search: value } ) }
							/>
							<Button
								className={ 'kb-trigger-sidebar' }
								icon={ previous }
								onClick={ () => {
									const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeStorage['sidebar'] = 'hide';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeStorage ) );
									this.setState( { sidebar: 'hide' } );
								}}
							/>
						</div>
						{ ! this.state.search && (
							<div className="kb-library-sidebar-bottom">
								{ sideCatOptions.map( ( category, index ) =>
									<Button
										key={ `${ category.value }-${ index }` }
										className={ 'kb-category-button' + ( selectedCategory === category.value ? ' is-pressed' : '' ) }
										aria-pressed={ selectedCategory === category.value }
										onClick={ () => {
											const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
											activeStorage['kbCat'] = category.value;
											localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeStorage ) );
											this.setState( { category: category.value } );
										}}
									>
										{ category.label }
									</Button>
								) }
							</div>
						) }
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
											const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
											activeStorage['style'] = style.value;
											localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeStorage ) );
											this.setState( { style: style.value } );
										}}
									>
										<span></span>
									</Button>
								) }
							</div>
						</div>
					</div>
				) }
				{ sidebarEnabled !== 'show' && (
					<div className="kt-prebuilt-header kb-library-header">
						<div className="kb-library-header-left">
							<Button
								className={ 'kb-trigger-sidebar' }
								icon={ next }
								onClick={ () => {
									const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeStorage['sidebar'] = 'show';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeStorage ) );
									this.setState( { sidebar: 'show' } );
								} }
							/>
							<SelectControl
								className={ "kb-library-header-cat-select" }
								value={ selectedCategory }
								options={ catOptions }
								onChange={ value => {
									const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeStorage['kbCat'] = value;
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeStorage ) );
									this.setState( { category: value } );
								}}
							/>
						</div>
						<div className="kb-library-header-right">
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
												const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
												activeStorage['style'] = style.value;
												localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeStorage ) );
												this.setState( { style: style.value } );
											}}
										>
											<span></span>
										</Button>
									) }
								</div>
							</div>
							<Button
								icon={  <svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 32 32"
								  >
									<path d="M8 15h7V8H8v7zm9-7v7h7V8h-7zm0 16h7v-7h-7v7zm-9 0h7v-7H8v7z"></path>
								  </svg> }
								className={ 'kb-grid-btns kb-trigger-large-grid-size' + ( gridSize === 'large' ? ' is-pressed' : '' ) }
								aria-pressed={ gridSize === 'large' }
								onClick={ () => {
									const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeStorage['grid'] = 'large';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeStorage ) );
									this.setState( { gridSize: 'large' } );
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
								className={ 'kb-grid-btns kb-trigger-normal-grid-size' + ( gridSize === 'normal' ? ' is-pressed' : '' ) }
								aria-pressed={ gridSize === 'normal' }
								onClick={ () => {
									const activeStorage = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeStorage['grid'] = 'normal';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeStorage ) );
									this.setState( { gridSize: 'normal' } );
								} }
							/>
							<TextControl
								type="text"
								value={ this.state.search }
								placeholder={ __( 'Search', 'kadence-blocks' ) }
								onChange={ value => this.setState( { search: value } ) }
							/>
						</div>
					</div>
				) }
				{ ( this.state.isImporting || this.state.isLoading || false === libraryItems || this.state.errorItems ) ? (
					<Fragment>
						{ ! this.state.errorItems && this.state.isLoading && (
							<Spinner />
						) }
						{ ! this.state.errorItems && this.state.isImporting &&  (
							<div className="preparing-importing-images">
								<Spinner />
								<h2>{ __( 'Preparing Content...', 'kadence-blocks' ) }</h2>
							</div>
						) }
						{ this.state.errorItems && (
							<div>
								<h2 style={ { textAlign:'center' } }>
									{ __( 'Error, Unable to access library database, please try re-syncing', 'kadence-blocks' ) }
								</h2>
								<div style={ { textAlign:'center' } }>
									<Button
										className="kt-reload-templates"
										icon={ update }
										onClick={ () => this.reloadTemplateData() }
									>
										{ __( ' Sync with Cloud', 'kadence-blocks' ) }
									</Button>
								</div>
							</div>
						) }
						{ false === libraryItems && (
							<Fragment>{ this.loadTemplateData() }</Fragment>
						) }
					</Fragment>
				) : (
					<PatternList
						patterns={ this.state.items }
						filterValue={ this.state.search }
						selectedCategory={ selectedCategory }
						patternCategories={ catOptions }
						selectedStyle={ selectedStyle }
						breakpointCols={ breakpointColumnsObj }
						onSelect={ ( blockcode ) => control.onInsertContent( blockcode ) }
					/>
				) }
			</div>
		);
	}
}

export default compose(
	withSelect( ( select ) => {
		const { canUserUseUnfilteredHTML } = select( 'core/editor' );
		return {
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML(),
		};
	} ),
	withDispatch( ( dispatch, { canUserUseUnfilteredHTML } ) => ( {
		import: ( blockcode, clientId ) => dispatch( 'core/block-editor' ).replaceBlocks(
			clientId,
			rawHandler( {
				HTML: blockcode,
				mode: 'BLOCKS',
				canUserUseUnfilteredHTML,
			} ),
		),
	} ) ),
)( PrebuiltSections );
