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
	update,
	chevronLeft,
	chevronDown,
} from '@wordpress/icons';
const {
	applyFilters,
} = wp.hooks;
const { compose } = wp.compose;
import map from 'lodash/map';
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
			url: ( this.props.tab === 'kadence_cloud' && kadence_blocks_params.kadence_cloud && kadence_blocks_params.kadence_cloud.url ? kadence_blocks_params.kadence_cloud.url : '' ),
			key: ( this.props.tab === 'kadence_cloud' && kadence_blocks_params.kadence_cloud && kadence_blocks_params.kadence_cloud.key ? kadence_blocks_params.kadence_cloud.key : '' ),
		};
	}
	onInsertContent( blockcode ) {
		this.props.import( blockcode );
	}
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	reloadTemplateData() {
		this.setState( { errorItems: false, isLoading: true, items: 'loading' } );
		var data = new FormData();
		data.append( 'action', 'kadence_import_reload_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', ( kadence_blocks_params.pro_data && kadence_blocks_params.pro_data.ktp_api_key ? kadence_blocks_params.pro_data.ktp_api_key : '' ) );
		data.append( 'api_email', ( kadence_blocks_params.pro_data && kadence_blocks_params.pro_data.activation_email ? kadence_blocks_params.pro_data.activation_email : '' ) );
		data.append( 'package', this.props.tab );
		data.append( 'url', ( this.props.url ? this.props.url : this.state.url ) );
		data.append( 'key', ( this.props.key ? this.props.key : this.state.key ) );
		var control = this;
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			console.log( response );
			if ( response ) {
				const o = kadenceBlocksTryParseJSON( response );
				if ( o ) {
					control.setState( { items: o, errorItems: false, isLoading: false } );
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
		var data = new FormData();
		data.append( 'action', 'kadence_import_get_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'api_key', ( kadence_blocks_params.pro_data && kadence_blocks_params.pro_data.ktp_api_key ? kadence_blocks_params.pro_data.ktp_api_key : '' ) );
		data.append( 'api_email', ( kadence_blocks_params.pro_data && kadence_blocks_params.pro_data.activation_email ? kadence_blocks_params.pro_data.activation_email : '' ) );
		data.append( 'package', this.props.tab );
		data.append( 'url', ( this.props.url ? this.props.url : this.state.url ) );
		data.append( 'key', ( this.props.key ? this.props.key : this.state.key ) );
		var control = this;
		jQuery.ajax( {
			method:      'POST',
			url:         kadence_blocks_params.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			console.log( response );
			if ( response ) {
				const o = kadenceBlocksTryParseJSON( response );
				if ( o ) {
					control.setState( { items: o, errorItems: false, isLoading: false } );
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
		const cats = [ 'all' ];
		const libraryItems = this.state.items;
		let filteredLibraryItems = libraryItems;
		if ( this.props.tab === 'section' && libraryItems ) {
			filteredLibraryItems = applyFilters( 'kadence.prebuilt_array', libraryItems );
		}
		if ( filteredLibraryItems && filteredLibraryItems.length ) {
			for ( let i = 0; i < filteredLibraryItems.length; i++ ) {
				if ( filteredLibraryItems[ i ].categories && filteredLibraryItems[ i ].categories.length ) {
					for ( let c = 0; c < filteredLibraryItems[ i ].categories.length; c++ ) {
						if ( ! cats.includes( filteredLibraryItems[ i ].categories[ c ] ) ) {
							cats.push( filteredLibraryItems[ i ].categories[ c ] );
						}
					}
				}
			}
		}
		const catOptions = cats.map( ( item ) => {
			return { value: item, label: this.capitalizeFirstLetter( item ) }
		} );
		const control = this;
		return (
			<Fragment>
				<div className="kt-prebuilt-header">
					<SelectControl
						label={ __( 'Category' ) }
						value={ this.state.category }
						options={ catOptions }
						onChange={ value => this.setState( { category: value } ) }
					/>
					<TextControl
						type="text"
						value={ this.state.search }
						placeholder={ __( 'Search' ) }
						onChange={ value => this.setState( { search: value } ) }
					/>
					{ false !== libraryItems && this.props.tab && (
						<div class="kadence_blocks_dash_reload">
							<Tooltip text={ __( 'Sync with Cloud' ) }>
								<Button 
									className="kt-reload-templates"
									icon={ update }
									onClick={ () => this.reloadTemplateData() }
								/>
							</Tooltip>
						</div>
					) }
				</div>
				{ ( this.state.isLoading || false === libraryItems || this.state.errorItems ) ? (
					<Fragment>
						{ ! this.state.errorItems && (
							<Spinner />
						) }
						{ this.state.errorItems && (
							<Fragment>
								<h2 style={{ textAlign:'center' } }>
									{ __( 'Error, Unable to access library database, please try re-syncing', 'kadence-blocks' ) }
								</h2>
								<div style={{ textAlign:'center' } }>
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
					<ButtonGroup aria-label={ __( 'Prebuilt Options' ) }>
						{ Object.keys( filteredLibraryItems ).map( function( key, index ) {
							const name = control.state.items[key].name;
							const content = control.state.items[key].content;
							const image = control.state.items[key].image;
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
												<LazyLoad>
													<img src={ image } alt={ name } />
												</LazyLoad>
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
					</ButtonGroup>
				) }
			</Fragment>
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
