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
const { apiFetch } = wp;
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
	CheckboxControl,
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
 * Wire Sections.
 */
class WireSections extends Component {
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
			tab: 'wire',
			items: false,
			errorItems: false,
			isImporting: false,
			isLoading: false,
			sidebar: false,
			email: kadence_blocks_params.user_email,
			emailError: false,
			subscribedError: false,
			privacy: false,
			privacyError: false,
			isSubscribing: false,
			isSubscribed: kadence_blocks_params.subscribed ? true : false,
			categories: { 'category': 'Category' },
		};
		this.debouncedReloadTemplateData = debounce( this.reloadTemplateData.bind( this ), 200 );
	}
	onInsertContent( blockcode ) {
		this.importProcess( blockcode );
	}
	saveSubscribe() {
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_wire_subscribe: true },
		} ).then( ( response ) => {
			console.log( response );
		} );
	}
	subscribeProcess( email ) {
		this.setState( { isSubscribing: true } );
		var data = new FormData();
		data.append( 'action', 'kadence_subscribe_process_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'email', email );
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
				if ( response === 'success' || response === '"success"' ) {
					kadence_blocks_params.subscribed = true;
					control.setState( { isSubscribing: false, isSubscribed: true, emailError: false, privacyError: false, subscribedError: false } );
					control.saveSubscribe();
				} else if ( response === 'emailDomainPostError' ) {
					control.setState( { isSubscribing: false, isSubscribed: false, emailError: true, privacyError: false, subscribedError: false } );
				} else if ( response === 'emailDomainPreError' ) {
					control.setState( { isSubscribing: false, isSubscribed: false, emailError: true, privacyError: false, subscribedError: false } );
				} else if ( response === 'invalidRequest' || response === '"invalidRequest"' ) {
					control.setState( { isSubscribing: false, isSubscribed: false, emailError: true, privacyError: false, subscribedError: false } );
				} else {
					control.setState( { isSubscribing: false, isSubscribed: false, emailError: false, privacyError: false, subscribedError: true } );
				}
			} else {
				control.setState( { isSubscribing: false, isSubscribed: false, emailError: false, privacyError: false, subscribedError: true } );
			}
		})
		.fail( function( error ) {
			console.log( error );
			control.setState( { isSubscribing: false, isSubscribed: false, emailError: false, privacyError: false, subscribedError: true } );
		});
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
		var data = new FormData();
		data.append( 'action', 'kadence_import_reload_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'package', 'wire' );
		data.append( 'url', 'https://wire.kadenceblocks.com/' );
		data.append( 'key', 'cBLUbJZZmjed' );
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
		this.setState( { errorItems: false, isLoading: true, items: 'loading' } );
		var data = new FormData();
		data.append( 'action', 'kadence_import_get_prebuilt_data' );
		data.append( 'security', kadence_blocks_params.ajax_nonce );
		data.append( 'package', 'wire' );
		data.append( 'url', 'https://wire.kadenceblocks.com/' );
		data.append( 'key', 'cBLUbJZZmjed' );
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
	render() {
		if ( this.props.reload ) {
			this.props.onReload();
			this.debouncedReloadTemplateData();
		}
		const activePanel = KadenceTryParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
		const sidebar_saved_enabled = ( activePanel && activePanel['sidebar'] ? activePanel['sidebar'] : 'hide' );
		const sidebarEnabled = ( this.state.sidebar ? this.state.sidebar : sidebar_saved_enabled );
		const roundAccurately = (number, decimalPlaces) => Number(Math.round(Number(number + "e" + decimalPlaces)) + "e" + decimalPlaces * -1);
		const libraryItems = this.props.tab !== this.state.tab ? false : this.state.items;
		const categoryItems = this.state.categories;
		const catOptions = Object.keys( categoryItems ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: categoryItems[key] }
		} );
		const sideCatOptions = Object.keys( categoryItems ).map( function( key, index ) {
			return { value: ( 'category' === key ? 'all' : key ), label: ( 'category' === key ? __( 'All', 'kadence-blocks' ) : categoryItems[key] ) }
		} );	
		const control = this;
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
				<div className="wrap-around-wire-library">
					{ ! this.state.isSubscribed && (
						<div className="kadence-wire-subscribe-wrap" style={ {
							backgroundImage: 'url(' + kadence_blocks_params.wireImage + ')',
						} }>
							<div className="kadence-wire-subscribe">
								<h2>{ __( 'Join the Kadence WP Mailing List for Free Access to Wireframe Sections.', 'kadence-blocks' ) } </h2>
								<p>{ __( "Wireframe sections give you the ability to build out clean layout-focused designs within the WordPress editor. Enter your email to join our product updates email list and get instant access to our exclusive wireframe library.", 'kadence-blocks' ) }</p>
								<TextControl
									type="text"
									label={ __( 'Email:', 'kadence-blocks' )  }
									value={ this.state.email }
									placeholder={ __( 'example@example.com', 'kadence-blocks' ) }
									onChange={ value => this.setState( { email: value } ) }
								/>
								{ this.state.emailError && (
									<span className="kb-subscribe-form-error">{ __( 'Invalid Email, Please enter a valid email.', 'kadence-blocks' ) }</span>
								) }
								<CheckboxControl
									label={ __( 'Accept Privacy Policy', 'kadence-blocks' ) }
									help={ <Fragment>{ __( 'We do not spam, unsubscribe anytime.', 'kadence-blocks' ) } <ExternalLink href={ 'https://www.kadencewp.com/privacy-policy/' }>{ __( 'View Privacy Policy', 'kadence-blocks' ) }</ExternalLink></Fragment> }
									checked={ this.state.privacy }
									onChange={ value => this.setState( { privacy: value } ) }
								/>
								{ this.state.privacyError && (
									<span className="kb-subscribe-form-error">{ __( 'Please Accept Privacy Policy', 'kadence-blocks' ) }</span>
								) }
								<Button
									className={ 'kb-subscribe-button' }
									isPrimary
									// disabled={ ! this.state.privacy }
									onClick={ () => {
										if ( this.state.privacy ) {
											this.subscribeProcess( this.state.email );
										} else {
											this.setState( { privacyError: true } )
										}
									} }
								>
									{ __( 'Subscribe for Access', 'kadence-blocks' ) }
								</Button>
								{ this.state.isSubscribing && (
									<Spinner />
								) }
								{ this.state.subscribedError && (
									<div className="kb-subscribe-form-error">{ __( 'Error attempting to subscribe, please reload our page and try again.', 'kadence-blocks' ) }</div>
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
								const subscribed = control.state.isSubscribed;	
								const descriptionId = `${ slug }_kb_cloud__item-description`;
								if ( ( 'all' === control.state.category || Object.keys( categories ).includes( control.state.category ) ) && ( ! control.state.search || ( keywords && keywords.some( x => x.toLowerCase().includes( control.state.search.toLowerCase() ) ) ) ) ) {
									return (
										<div className="kt-prebuilt-item">
											<Button
												key={ key }
												className="kt-import-btn"
												isSmall
												aria-label={
													sprintf(
														/* translators: %s is Prebuilt Name */
														__( 'Add %s', 'kadence-blocks' ),
														name
													)
												}
												aria-describedby={ description ? descriptionId : undefined }
												isDisabled={ ! subscribed }
												onClick={ () => subscribed ? control.onInsertContent( content ) : '' }
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
											{ undefined !== subscribed && ! subscribed && (
												<Fragment>
													<div className="kt-popover-pro-notice kb-subscribe-access">
														<h2>{ __( 'Subscribe to Kadence WP Product Updates for Instant Access', 'kadence-blocks' ) } </h2>
													</div>
												</Fragment>
											) }
										</div>
									);
								}
							} ) }
						</Masonry>
					) }
				</div>
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
)( WireSections );
