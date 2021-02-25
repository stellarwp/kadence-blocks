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
	Dashicon,
	SelectControl,
	Modal,
	Popover,
	IconButton,
	ExternalLink,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;
const { compose } = wp.compose;
import map from 'lodash/map';
import LazyLoad from 'react-lazy-load';

import Prebuilts from './prebuilt_template_array';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
class CustomComponent extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			category: 'all',
			search: null,
			view: 'templates',
			selected: null,
			showProNotice: false,
		};
	}
	onInsertContent( blockcode ) {
		this.props.import( blockcode );
	}
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	render() {
		const blockOutput = applyFilters( 'kadence.prebuilt_templates_array', Prebuilts );
		const cats = [ 'all' ];
		for ( let i = 0; i < blockOutput.length; i++ ) {
			for ( let c = 0; c < blockOutput[ i ].category.length; c++ ) {
				if ( ! cats.includes( blockOutput[ i ].category[ c ] ) ) {
					cats.push( blockOutput[ i ].category[ c ] );
				}
			}
		}
		const catOptions = cats.map( ( item ) => {
			return { value: item, label: this.capitalizeFirstLetter( item ) }
		} );
		return (
			<Fragment>
				{/* <div className="kt-prebuilt-template-header">
					<SelectControl
						label={ __( 'Category', 'kadence-blocks' ) }
						value={ this.state.category }
						options={ catOptions }
						onChange={ value => this.setState( { category: value } ) }
					/>
					<TextControl
						type="text"
						value={ this.state.search }
						placeholder={ __( 'Search', 'kadence-blocks' ) }
						onChange={ value => this.setState( { search: value } ) }
					/>
				</div> */}
				{ this.state.view === 'templates' && (
					<ButtonGroup className="kb-template-packs" aria-label={ __( 'Prebuilt Starter Packs', 'kadence-blocks' ) }>
						{ map( blockOutput, ( { name, key, image, background, category, keywords, by, pages } ) => {
							if ( ( 'all' === this.state.category || category.includes( this.state.category ) ) && ( ! this.state.search || ( keywords && keywords.some( x => x.toLowerCase().includes( this.state.search.toLowerCase() ) ) ) ) ) {
								return (
									<div className="kt-prebuilt-item" data-background-style={ background }>
										<Tooltip text={ name }>
											<Button
												key={ key }
												className="kt-import-btn"
												isSmall
												onClick={ () => {
													this.setState( { view: 'single', selected: key } );
												} }
												data-by={ by }
												data-pages={ pages }
											>
												<LazyLoad>
													<img src={ image } alt={ name } />
												</LazyLoad>
											</Button>
										</Tooltip>
									</div>
								);
							}
						} ) }
					</ButtonGroup>
				) }
				{ this.state.view === 'single' && (
					<Fragment>
						{ map( blockOutput, ( { name, key, templates, by, byLink } ) => {
							if ( this.state.selected === key ) {
								return (
									<Fragment>
										<div className="kb-templates-header-top">
											<Button
												className="kt-return-templates-btn"
												onClick={ () => {
													this.setState( { view: 'templates', selected: null } );
												} }
											>
												<Dashicon icon="arrow-left-alt" />{ __( 'Back to Starter Packs', 'kadence-blocks' ) }
											</Button>
											<div className="kb-template-top-credit">
												<h2 className="kb-template-name">
													{ name }
												</h2>
												<div className="kb-top-designed-by-credit">{ __( 'Designed by', 'kadence-blocks' ) } <a href={ byLink } className={ 'kb-designed-by-link' }>{ by }</a></div>
											</div>
										</div>
										<ButtonGroup className="kb-template-packs kb-template-packs-scroll" aria-label={ __( 'Prebuilt Starter Packs', 'kadence-blocks' ) }>
											{ map( templates, ( { name, key, image, content, pro } ) => {
												return (
													<div className="kt-prebuilt-item">
														<Tooltip text={ name }>
															<Button
																key={ key }
																className="kt-import-btn"
																isSmall
																isDisabled={ pro && 'true' !== kadence_blocks_params.pro }
																onClick={ () => {
																	if ( pro && 'true' !== kadence_blocks_params.pro ) {
																		this.setState( { showProNotice: true } );
																	} else {
																		this.onInsertContent( content );
																	}
																} }
															>
																<LazyLoad>
																	<img src={ image } alt={ name } />
																</LazyLoad>
															</Button>
														</Tooltip>
														{ pro && (
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
											} ) }
										</ButtonGroup>
									</Fragment>
								);
							}
						} ) }
					</Fragment>
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
)( CustomComponent );
