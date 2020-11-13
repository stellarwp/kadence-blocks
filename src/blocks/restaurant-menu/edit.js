import Inspector from './inspector';
import Controls from './controls';

import classnames from 'classnames';

import './style.scss';

/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
const {
	createBlock,
} = wp.blocks;
const {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	RichText,
} = wp.blockEditor;
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelBody,
	Toolbar,
	ButtonGroup,
	Button,
	ToolbarGroup,
	Dashicon,
	TabPanel,
	SelectControl,
	TextControl,
} = wp.components;

const {
	InnerBlocks
} = wp.blockEditor


const { select, dispatch, withSelect, withDispatch } = wp.data;

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
				{ isSelected && <Inspector { ...this.props } /> }
				{ isSelected && <Controls { ...this.props } /> }
				<div className={ classnames( 'kt-restaurent-menu' ) }>
					<InnerBlocks
						template={ [
							[
								'kadence/restaurantmenucategory'
							]
						] }
						templateLock={ false }
						renderAppender={ () => ( null ) }
					/>
				</div>

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
			</Fragment>
		)
	}
}
export default KadenceRestaurantMenu;
