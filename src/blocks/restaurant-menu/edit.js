/**
 * BLOCK: Kadence Restaurant Menu
 */

/**
 * Internal dependencies
 */
import Controls from './controls';
import templates from './templates';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Import Css
 */
import './style.scss';

/**
 * Internal block libraries
 */
const { __ }                  = wp.i18n;
const { createBlock }         = wp.blocks;
const { Component, Fragment } = wp.element;
const { Button, Dashicon }              = wp.components;
const { InnerBlocks }         = wp.blockEditor
const { select, dispatch }    = wp.data;

/**
 * Build the restaurant menu edit
 */
class KadenceRestaurantMenu extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const {
			clientId,
			attributes,
			className,
			isSelected,
			setAttributes
		} = this.props;

		return (
			<Fragment>

				{ isSelected && <Controls {...this.props} /> }

				<div className={ classnames( 'kt-restaurent-menu' ) }>
					<InnerBlocks
						template={ templates }
						templateLock={ false }
						renderAppender={ () => ( null ) }
					/>
				</div>

				<div className={ classnames( 'kt-add-more-btn-wrap' ) }>
					<Dashicon icon="plus" />
					<Button
						onClick={ () => {

							const block = select( 'core/block-editor' ).getBlock( clientId );

							const newItem = createBlock(
								'kadence/restaurantmenucategory'
							);

							const newInnerBlocks = [ ...block.innerBlocks, { ...newItem } ];
							dispatch( 'core/block-editor' ).replaceInnerBlocks( clientId, newInnerBlocks, false );
						} }
					>
						{__('Add New Menu')}
					</Button>
				</div>
			</Fragment>
		)
	}
}

export default KadenceRestaurantMenu;
