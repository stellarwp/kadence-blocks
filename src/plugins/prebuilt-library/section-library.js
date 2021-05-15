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
import Masonry from 'react-masonry-component';
import debounce from 'lodash/debounce';
import LazyLoad from 'react-lazy-load';
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

/**
 * Internal dependencies
 */
 import KadenceTryParseJSON from '../../components/common/parse-json'

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
			category: 'all',
			starting: true,
			search: null,
			tab: 'section',
			items: kadence_blocks_params.library_sections ? KadenceTryParseJSON( kadence_blocks_params.library_sections, false ) : false,
			errorItems: false,
			isImporting: false,
			isLoading: false,
			sidebar: false,
			categories: {
				'category': __( 'Category', 'kadence-blocks' ),
				'pro': __( 'Pro', 'kadence-blocks' ),
				'feature': __( 'Feature', 'kadence-blocks' ),
				'hero': __( 'Hero', 'kadence-blocks' ),
				'form': __( 'Form', 'kadence-blocks' ),
				'pricing-table': __( 'Pricing Table', 'kadence-blocks' ),
				'tabs': __( 'Tabs', 'kadence-blocks' ),
				'accordion': __( 'Accordion', 'kadence-blocks' ),
				'testimonials': __( 'Testimonials', 'kadence-blocks' ),
			},
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
				control.props.import( response );
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
				const o = KadenceTryParseJSON( response, false );
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
				const o = KadenceTryParseJSON( response, false );
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
		const activePanel = KadenceTryParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
		const sidebar_saved_enabled = ( activePanel && activePanel['sidebar'] ? activePanel['sidebar'] : 'hide' );
		const sidebarEnabled = ( this.state.sidebar ? this.state.sidebar : sidebar_saved_enabled );
		const control = this;
		const roundAccurately = (number, decimalPlaces) => Number(Math.round(Number(number + "e" + decimalPlaces)) + "e" + decimalPlaces * -1);
		const libraryItems = this.state.items;
		const categoryItems = this.state.categories;
		const catOptions = Object.keys( categoryItems ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: categoryItems[key] }
		} );
		const sideCatOptions = Object.keys( categoryItems ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: ( 'category' === key ? __( 'All', 'kadence-blocks' ) : categoryItems[key] ) }
		} );
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
									const activeSidebar = KadenceTryParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeSidebar['sidebar'] = 'hide';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeSidebar ) );
									this.setState( { sidebar: 'hide' } );
								}}
							/>
						</div>
						<div className="kb-library-sidebar-bottom">
							{ sideCatOptions.map( ( category, index ) =>
								<Button
									key={ `${ category.value }-${ index }` }
									className={ 'kb-category-button' + ( this.state.category === category.value ? ' is-pressed' : '' ) }
									aria-pressed={ this.state.category === category.value }
									onClick={ () => this.setState( { category: category.value } ) }
								>
									{ category.label }
								</Button>
							) }
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
									const activeSidebar = KadenceTryParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeSidebar['sidebar'] = 'show';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeSidebar ) );
									this.setState( { sidebar: 'show' } );
								} }
							/>
							<SelectControl
								className={ "kb-library-header-cat-select" }
								value={ this.state.category }
								options={ catOptions }
								onChange={ value => this.setState( { category: value } ) }
							/>
						</div>
						<div className="kb-library-header-right">
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
					<Masonry
						className={ 'kb-prebuilt-grid kb-prebuilt-masonry-grid kb-core-section-library' }
						elementType={ 'div' }
						options={ {
							transitionDuration: 0,
						} }
						disableImagesLoaded={ false }
						enableResizableChildren={ true }
						updateOnEachImageLoad={ false }
					>
						{ Object.keys( this.state.items ).map( function( key, index ) {
							const name = libraryItems[key].name;
							const slug = libraryItems[key].slug;
							const content = libraryItems[key].content;
							const image = libraryItems[key].image;
							const imageWidth = libraryItems[key].imageW;
							const imageHeight = libraryItems[key].imageH;
							const categories = libraryItems[key].categories;
							const keywords = libraryItems[key].keywords;
							const description = control.state.items[key].description;
							const pro = libraryItems[key].pro;
							const locked = libraryItems[key].locked;
							const descriptionId = `${ slug }_kb_cloud__item-description`;
							if ( ( 'all' === control.state.category || Object.keys( categories ).includes( control.state.category ) ) && ( ! control.state.search || ( keywords && keywords.some( x => x.toLowerCase().includes( control.state.search.toLowerCase() ) ) ) ) ) {
								return (
									<div className="kt-prebuilt-item">
										<Button
											key={ key }
											className="kt-import-btn"
											isSmall
											// translators: %s: Prebuilt Name
											aria-label={ sprintf( __( 'Add %s', 'kadence-blocks' ), name ) }
											aria-describedby={ description ? descriptionId : undefined }
											isDisabled={ locked }
											onClick={ () => ! locked ? control.onInsertContent( content ) : '' }
										>
											<div
												className="kt-import-btn-inner"
												style={ {
													paddingBottom: ( imageWidth && imageHeight ? roundAccurately( ( imageHeight/imageWidth * 100), 2 ) + '%' : undefined ),
												} }
											>
												<LazyLoad offsetBottom={400}>
													<img src={ image } alt={ name } />
												</LazyLoad>
												<span className="kb-import-btn-title">{ name }</span>
											</div>
										</Button>
										{ !! description && (
											<VisuallyHidden id={ descriptionId }>
												{ description }
											</VisuallyHidden>
										) }
										{ undefined !== pro && pro && (
											<Fragment>
												<span className="kb-pro-template">{ __( 'Pro', 'kadence-blocks' ) }</span>
												{ locked && (
													<div className="kt-popover-pro-notice">
														<h2>{ __( 'Kadence Blocks Pro required for this item' ) } </h2>
														<ExternalLink href={ 'https://www.kadenceblocks.com/pro/' }>{ __( 'Upgrade to Pro', 'kadence-blocks' ) }</ExternalLink>
													</div>
												) }
											</Fragment>
										) }
									</div>
								);
							}
						} ) }
					</Masonry>
				) }
			</div>
		);
	}
}

export default compose(
	withSelect( ( select, { clientId } ) => {
		const { getBlock } = select( 'core/block-editor' );
		const { canUserUseUnfilteredHTML } = select( 'core/editor' );
		const block = getBlock( clientId );
		return {
			block,
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML(),
		};
	} ),
	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML } ) => ( {
		import: ( blockcode ) => dispatch( 'core/block-editor' ).replaceBlocks(
			block.clientId,
			rawHandler( {
				HTML: blockcode,
				mode: 'BLOCKS',
				canUserUseUnfilteredHTML,
			} ),
		),
	} ) ),
)( PrebuiltSections );
