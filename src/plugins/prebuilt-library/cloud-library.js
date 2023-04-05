/**
 * Handle Cloud Connections.
 */
const {
	localStorage,
} = window;

/**
 * External dependencies
 */
import Masonry from 'react-masonry-css'
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
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
import { SafeParseJSON } from '@kadence/helpers'


class CloudSections extends Component {
	constructor() {
		super( ...arguments );
		this.loadTemplateData = this.loadTemplateData.bind( this );
		this.onInsertContent = this.onInsertContent.bind( this );
		this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind( this );
		this.reloadTemplateData = this.reloadTemplateData.bind( this );
		this.state = {
			category: {},
			search: null,
			tab: 'section',
			items: false,
			errorItems: false,
			isLoading: false,
			isImporting: false,
			sidebar:false,
			gridSize: 'normal',
			categories: { 'category': 'Category' },
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
				//console.log( response );
				control.props.import( response );
				control.setState( { isImporting: false } );
			}
		})
		.fail( function( error ) {
			console.log( error );
			control.setState( { isImporting: false } );
		});
	}
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	reloadTemplateData() {
		this.setState( { errorItems: false, isLoading: true, items: 'loading', tab: this.props.tab } );
		let action = {}
		if ( this.props.tab !== 'section' ) {
			action = this.props.libraries.filter( obj => {
				return obj.slug === this.props.tab;
			});
		}
		var data = new FormData();
		data.append( 'action', 'kadence_import_reload_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'package', this.props.tab );
		data.append( 'url', this.props.tab !== 'section' && action[0] && action[0].url ? action[0].url : '' );
		data.append( 'key', this.props.tab !== 'section' && action[0] && action[0].key ? action[0].key : '' );
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
					const cats = { 'category': 'Category' };
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
					control.setState( { items: o, errorItems: false, isLoading: false, categories: cats } );
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
		this.setState( { errorItems: false, isLoading: true, items: 'loading', tab: this.props.tab } );
		let action = [];
		if ( this.props.tab !== 'section' ) {
			action = this.props.libraries.filter( obj => {
				return obj.slug === this.props.tab;
			});
		}
		if ( action === undefined || action.length == 0 ) {
			const cloudSettings = kadence_blocks_params.cloud_settings ? JSON.parse( kadence_blocks_params.cloud_settings ) : {};
			if ( cloudSettings && cloudSettings['connections'] ) {
				action = cloudSettings['connections'].filter( obj => {
					return obj.slug === this.props.tab;
				});
			}
		}
		if ( action === undefined || action.length == 0 ) {
			if ( typeof kadence_blocks_params.prebuilt_libraries === 'object' && kadence_blocks_params.prebuilt_libraries !== null ) {
				this.setState( { actions: kadence_blocks_params.prebuilt_libraries.concat( this.state.actions ) } );
				action = kadence_blocks_params.prebuilt_libraries.filter( obj => {
					return obj.slug === this.props.tab;
				});
			}
		}
		var data = new FormData();
		data.append( 'action', 'kadence_import_get_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'package', this.props.tab );
		data.append( 'url', this.props.tab !== 'section' && action[0] && action[0].url ? action[0].url : '' );
		data.append( 'key', this.props.tab !== 'section' && action[0] && action[0].key ? action[0].key : '' );
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
					const cats = { 'category': 'Category' };
					{ Object.keys( o ).map( function( key, index ) {
						//console.log( o[ key ].categories );
						if ( o[ key ].categories && typeof o[ key ].categories === "object") {
							{ Object.keys( o[ key ].categories ).map( function( ckey, i ) {
								if ( ! cats.hasOwnProperty( ckey ) ) {
									cats[ckey] = o[ key ].categories[ ckey ];
								}
							} ) }
						}
					} ) }
					control.setState( { items: o, errorItems: false, isLoading: false, categories: cats } );
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
		const sidebarEnabled = ( this.state.sidebar ? this.state.sidebar : sidebar_saved_enabled );
		const roundAccurately = (number, decimalPlaces) => Number(Math.round(Number(number + "e" + decimalPlaces)) + "e" + decimalPlaces * -1);
		const libraryItems = this.props.tab !== this.state.tab ? false : this.state.items;
		const categoryItems = this.state.categories;
		const savedGridSize = ( activePanel && activePanel['grid'] ? activePanel['grid'] : 'normal' );
		const gridSize = ( this.state.gridSize ? this.state.gridSize : savedGridSize );
		const catOptions = Object.keys( categoryItems ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: categoryItems[key] }
		} );
		const sideCatOptions = Object.keys( categoryItems ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: ( 'category' === key ? __( 'All', 'kadence-blocks' ) : categoryItems[key] ) }
		} );
		const getActiveCat = ( this.state.category[activePanel.activeTab] ? this.state.category[activePanel.activeTab] : 'all' );
		const control = this;
		let breakpointColumnsObj = {
			default: 5,
			1600: 4,
			1200: 3,
			500: 2,
		};
		if ( gridSize === 'large' ) {
			breakpointColumnsObj = {
				default: 4,
				1600: 3,
				1200: 2,
				500: 1,
			};
		}
		if ( sidebarEnabled === 'show' ) {
			breakpointColumnsObj = {
				default: 4,
				1600: 3,
				1200: 2,
				500: 1,
			};
			if ( gridSize === 'large' ) {
				breakpointColumnsObj = {
					default: 3,
					1600: 2,
					1200: 2,
					500: 1,
				};
			}
		}
		return (
			<div className={ `kt-prebuilt-content${ ( sidebarEnabled === 'show' ? ' kb-prebuilt-has-sidebar' : '' ) }` }>
				{ sidebarEnabled === 'show' && (
					<div className="kt-prebuilt-sidebar kb-cloud-library-sidebar">
						<div className="kb-library-sidebar-top">
							<TextControl
								type="text"
								value={ this.state.search }
								placeholder={ __( 'Search' ) }
								onChange={ value => this.setState( { search: value } ) }
							/>
							<Button
								className={ 'kb-trigger-sidebar' }
								icon={ previous }
								onClick={ () => {
									const activeSidebar = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
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
									className={ 'kb-category-button' + ( getActiveCat === category.value ? ' is-pressed' : '' ) }
									aria-pressed={ getActiveCat === category.value }
									onClick={ () => {
										let newCat = this.state.category;
										newCat[activePanel.activeTab] = category.value;
										this.setState( { category: newCat } );
								} }
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
									const activeSidebar = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeSidebar['sidebar'] = 'show';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeSidebar ) );
									this.setState( { sidebar: 'show' } );
								}}
							/>
							<SelectControl
								className={ "kb-library-header-cat-select" }
								value={ getActiveCat }
								options={ catOptions }
								onChange={ value => {
									let newCat = this.state.category;
									newCat[activePanel.activeTab] = value;
									this.setState( { category: newCat } );
								}}
							/>
						</div>
						<div className="kb-library-header-right">
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
									const activeSidebar = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeSidebar['grid'] = 'large';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeSidebar ) );
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
									const activeSidebar = SafeParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
									activeSidebar['grid'] = 'normal';
									localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeSidebar ) );
									this.setState( { gridSize: 'normal' } );
								} }
							/>
							<TextControl
								type="text"
								value={ this.state.search }
								placeholder={ __( 'Search' ) }
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
					<div className='kb-cloud-library-outer-wrap'>
						<Masonry
							breakpointCols={breakpointColumnsObj}
							className={ `kb-css-masonry kb-cloud-library-wrap` }
							columnClassName="kb-css-masonry_column"
							// className={ 'kb-prebuilt-grid kb-prebuilt-masonry-grid' }
							// elementType={ 'div' }
							// options={ {
							// 	transitionDuration: 0,
							// } }
							// disableImagesLoaded={ false }
							// enableResizableChildren={ true }
							// updateOnEachImageLoad={ false }
						>
							{ Object.keys( this.state.items ).map( function( key, index ) {
								const name = control.state.items[key].name;
								const slug = control.state.items[key].slug;
								const content = control.state.items[key].content;
								const image = control.state.items[key].image;
								const imageWidth = control.state.items[key].imageW;
								const imageHeight = control.state.items[key].imageH;
								const categories = control.state.items[key].categories;
								const keywords = control.state.items[key].keywords;
								const description = control.state.items[key].description;
								const pro = control.state.items[key].pro;
								const locked = libraryItems[key].locked;
								const descriptionId = `${ slug }_kb_cloud__item-description`;
								if ( ( 'all' === getActiveCat || Object.keys( categories ).includes( getActiveCat ) ) && ( ! control.state.search || ( keywords && keywords.some( x => x.toLowerCase().includes( control.state.search.toLowerCase() ) ) ) ) ) {
									return (
										<div className="kb-css-masonry-inner">
											<Button
												key={ key }
												className="kb-css-masonry-btn"
												isSmall
												aria-label={
													sprintf(
														/* translators: %s is Prebuilt Name */
														__( 'Add %s', 'kadence-blocks' ),
														name
													)
												}
												aria-describedby={ description ? descriptionId : undefined }
												isDisabled={ locked }
												onClick={ () => ! locked ? control.onInsertContent( content ) : '' }
											>
												<div
													className="kb-css-masonry-btn-inner"
													style={ {
														paddingBottom: ( imageWidth && imageHeight ? roundAccurately( ( imageHeight/imageWidth * 100), 2 ) + '%' : undefined ),
													} }
												>
													<img src={ image } loading={ "lazy" } alt={ name } />
													<span className="kb-import-btn-title" dangerouslySetInnerHTML={ { __html: name }} />
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
														<div className="kb-popover-pro-notice">
															<h2>{ __( 'Pro required for this item', 'kadence-blocks' ) } </h2>
														</div>
													) }
												</Fragment>
											) }
										</div>
									);
								}
							} ) }
						</Masonry>
					</div>
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
)( CloudSections );
