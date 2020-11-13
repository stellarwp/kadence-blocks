import Inspector from './inspector';
import Controls from './controls';

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
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
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
				{ isSelected && <Inspector { ...this.props } /> }
				{ isSelected && <Controls { ...this.props } /> }

				<InnerBlocks
					template={ [
						[
							'kadence/restaurantmenuitem'
						]
					] }
					templateLock={ false }
					renderAppender={ () => ( null ) }
				/>
			</Fragment>
		)
	}
}
export default KadenceRestaurantMenu;
