const { withSelect, withDispatch } = wp.data;
const {
	rawHandler,
} = wp.blocks;
const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	ButtonGroup,
	Tooltip,
	TextControl,
	SelectControl,
	ExternalLink,
	Spinner,
} = wp.components;
import {
	arrowLeft,
	download,
	previous,
	update,
	next,
	chevronLeft,
	chevronDown,
} from '@wordpress/icons';
import Masonry from 'react-masonry-component';
const {
	applyFilters,
} = wp.hooks;
const { compose } = wp.compose;
import map from 'lodash/map';
import debounce from 'lodash/debounce';
import LazyLoad from 'react-lazy-load';

//import Prebuilts from './prebuilt_array';
function kadenceBlocksTryParseJSON(jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
class PrebuiltSections extends Component {
	constructor() {
		super( ...arguments );
		this.loadTemplateData = this.loadTemplateData.bind( this );
		this.onInsertContent = this.onInsertContent.bind( this );
		this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind( this );
		this.reloadTemplateData = this.reloadTemplateData.bind( this );
		this.state = {
			category: 'all',
			search: null,
			tab: 'section',
			items: false,
			errorItems: false,
			isLoading: false,
			sidebar:false,
			categories: [ 'category' ],
			url: ( this.props.tab === 'kadence_cloud' && kadence_blocks_params.kadence_cloud && kadence_blocks_params.kadence_cloud.url ? kadence_blocks_params.kadence_cloud.url : '' ),
			key: ( this.props.tab === 'kadence_cloud' && kadence_blocks_params.kadence_cloud && kadence_blocks_params.kadence_cloud.key ? kadence_blocks_params.kadence_cloud.key : '' ),
		};
		this.debouncedReloadTemplateData = debounce( this.reloadTemplateData.bind( this ), 200 );
	}
	onInsertContent( blockcode ) {
		this.props.import( blockcode );
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
		data.append( 'api_key', ( kadence_blocks_params.pro_data && kadence_blocks_params.pro_data.ktp_api_key ? kadence_blocks_params.pro_data.ktp_api_key : '' ) );
		data.append( 'api_email', ( kadence_blocks_params.pro_data && kadence_blocks_params.pro_data.activation_email ? kadence_blocks_params.pro_data.activation_email : '' ) );
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
				console.log( response );
				const o = kadenceBlocksTryParseJSON( response );
				if ( o ) {
					const filteredLibraryItems = applyFilters( 'kadence.prebuilt_object', o );
					const cats = [ 'category' ];
					{ Object.keys( filteredLibraryItems ).map( function( key, index ) {
						if ( filteredLibraryItems[ key ].categories && filteredLibraryItems[ key ].categories.length ) {
							for ( let c = 0; c < filteredLibraryItems[ key ].categories.length; c++ ) {
								if ( ! cats.includes( filteredLibraryItems[ key ].categories[ c ] ) ) {
									cats.push( filteredLibraryItems[ key ].categories[ c ] );
								}
							}
						}
					} ) }
					control.setState( { items: filteredLibraryItems, errorItems: false, isLoading: false, categories: cats } );
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
		let action = {}
		if ( this.props.tab !== 'section' ) {
			action = this.props.libraries.filter( obj => {
				return obj.slug === this.props.tab;
			});
		}

		var data = new FormData();
		data.append( 'action', 'kadence_import_get_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', ( kadence_blocks_params.pro_data && kadence_blocks_params.pro_data.ktp_api_key ? kadence_blocks_params.pro_data.ktp_api_key : '' ) );
		data.append( 'api_email', ( kadence_blocks_params.pro_data && kadence_blocks_params.pro_data.activation_email ? kadence_blocks_params.pro_data.activation_email : '' ) );
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
				const o = kadenceBlocksTryParseJSON( response );
				if ( o ) {
					const filteredLibraryItems = applyFilters( 'kadence.prebuilt_object', o );
					const cats = [ 'category' ];
					{ Object.keys( filteredLibraryItems ).map( function( key, index ) {
						if ( filteredLibraryItems[ key ].categories && filteredLibraryItems[ key ].categories.length ) {
							for ( let c = 0; c < filteredLibraryItems[ key ].categories.length; c++ ) {
								if ( ! cats.includes( filteredLibraryItems[ key ].categories[ c ] ) ) {
									cats.push( filteredLibraryItems[ key ].categories[ c ] );
								}
							}
						}
					} ) }
					control.setState( { items: filteredLibraryItems, errorItems: false, isLoading: false, categories: cats } );
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
		const roundAccurately = (number, decimalPlaces) => Number(Math.round(Number(number + "e" + decimalPlaces)) + "e" + decimalPlaces * -1);
		const libraryItems = this.props.tab !== this.state.tab ? false : this.state.items;
		console.log( libraryItems );
		const catOptions = this.state.categories.map( ( item ) => {
			return { value: ( 'category' === item ? 'all' : item ), label: this.capitalizeFirstLetter( item ) }
		} );
		const sideCatOptions = this.state.categories.map( ( item ) => {
			return { value:( 'category' === item ? 'all' : item ), label: ( 'category' === item ? 'All' : this.capitalizeFirstLetter( item ) ) }
		} );		
		const control = this;
		return (
			<div className={ `kt-prebuilt-content${ ( this.state.sidebar ? ' kb-prebuilt-has-sidebar' : '' ) }` }>
				{ this.state.sidebar && (
					<div className="kt-prebuilt-sidebar">
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
								onClick={ () => this.setState( { sidebar: false } ) }
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
				{ ! this.state.sidebar && (
					<div className="kt-prebuilt-header kb-library-header">
						<div className="kb-library-header-left">
							<Button
								className={ 'kb-trigger-sidebar' }
								icon={ next }
								onClick={ () => this.setState( { sidebar: true } ) }
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
								placeholder={ __( 'Search' ) }
								onChange={ value => this.setState( { search: value } ) }
							/>
						</div>
					</div>
				) }
				{ ( this.state.isLoading || false === libraryItems || this.state.errorItems ) ? (
					<Fragment>
						{ ! this.state.errorItems && (
							<Spinner />
						) }
						{ this.state.errorItems && (
							<Fragment>
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
							</Fragment>
						) }
						{ false === libraryItems && (
							<Fragment>{ this.loadTemplateData() }</Fragment>
						) }
					</Fragment>
				) : (
					<Masonry
						className={ 'kb-prebuilt-grid kb-prebuilt-masonry-grid' }
						elementType={ 'div' }
						options={ {
							transitionDuration: 0,
						} }
						disableImagesLoaded={ false }
						enableResizableChildren={ true }
						updateOnEachImageLoad={ false }
					>
						{ Object.keys( this.state.items ).map( function( key, index ) {
							const name = control.state.items[key].name;
							const content = control.state.items[key].content;
							const image = control.state.items[key].image;
							const imageWidth = control.state.items[key].imageW;
							const imageHeight = control.state.items[key].imageH;
							const categories = control.state.items[key].categories;
							const keywords = control.state.items[key].keywords;
							const pro = control.state.items[key].pro;
							const member = control.state.items[key].member;
							if ( ( 'all' === control.state.category || categories.includes( control.state.category ) ) && ( ! control.state.search || ( keywords && keywords.some( x => x.toLowerCase().includes( control.state.search.toLowerCase() ) ) ) ) ) {
								return (
									<div className="kt-prebuilt-item">
										<Tooltip text={ name }>
											<Button
												key={ key }
												className="kt-import-btn"
												isSmall
												isDisabled={ undefined !== pro && pro && 'true' !== kadence_blocks_params.pro }
												onClick={ () => control.onInsertContent( content ) }
											>
												<div
													className="kt-import-btn-inner"
													style={ {
														paddingBottom: ( imageWidth && imageHeight ? roundAccurately( ( imageHeight/imageWidth * 100), 2 ) + '%' : undefined ),
													} }
												>
													<LazyLoad>
														<img src={ image } alt={ name } />
													</LazyLoad>
												</div>
											</Button>
										</Tooltip>
										{ undefined !== pro && pro && (
											<Fragment>
												<span className="kb-pro-template">{ __( 'Pro', 'kadence-blocks' ) }</span>
												{ 'true' !== kadence_blocks_params.pro && (
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
