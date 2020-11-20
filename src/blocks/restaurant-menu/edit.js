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
const { IconButton }    = wp.components;
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
						allowedBlocks={['kadence/restaurantmenucategory']}
						template={ templates }
						templateLock={ false }
						renderAppender={ () => (
							<IconButton
					        icon="insert"
					        label={ __('Add New Menu') }
					        onClick={ () => {
								const innerCount = select("core/editor").getBlocksByClientId(clientId)[0].innerBlocks.length;
								let block = createBlock("kadence/restaurantmenucategory");
								dispatch("core/block-editor").insertBlock(block, innerCount, clientId);
							} }
					    /> ) }
					/>
				</div>

			</Fragment>
		)
	}
}

export default KadenceRestaurantMenu;
