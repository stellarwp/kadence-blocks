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
	SelectControl,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;
const { compose } = wp.compose;
import map from 'lodash/map';
import LazyLoad from 'react-lazy-load';

import Prebuilts from './prebuilt_array';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
class CustomComponent extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			category: 'all',
		};
	}
	onInsertContent( blockcode ) {
		this.props.import( blockcode );
	}
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	render() {
		const blockOutput = applyFilters( 'kadence.prebuilt_array', Prebuilts );
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
				<SelectControl
					label={ __( 'Category' ) }
					value={ this.state.category }
					options={ catOptions }
					onChange={ value => this.setState( { category: value } ) }
				/>
				<ButtonGroup aria-label={ __( 'Prebuilt Options' ) }>
					{ map( blockOutput, ( { name, key, image, content, background, category } ) => {
						if ( 'all' == this.state.category || category.includes( this.state.category ) ) {
							return (
								<div className="kt-prebuilt-item" data-background-style={ background }>
									<Tooltip text={ name }>
										<Button
											key={ key }
											className="kt-import-btn"
											isSmall
											onClick={ () => this.onInsertContent( content )  }
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
			</Fragment>
		);
	}
}

export default compose(
	withSelect( ( select, { clientId } ) => {
		const { getBlock, canUserUseUnfilteredHTML } = select( 'core/editor' );
		const block = getBlock( clientId );
		return {
			block,
			canUserUseUnfilteredHTML: canUserUseUnfilteredHTML(),
		};
	} ),
	withDispatch( ( dispatch, { block, canUserUseUnfilteredHTML } ) => ( {
		import: ( blockcode ) => dispatch( 'core/editor' ).replaceBlocks(
			block.clientId,
			rawHandler( {
				HTML: blockcode,
				mode: 'BLOCKS',
				canUserUseUnfilteredHTML,
			} ),
		),
	} ) ),
)( CustomComponent );
