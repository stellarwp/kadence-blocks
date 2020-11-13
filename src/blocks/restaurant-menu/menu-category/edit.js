import Inspector from './inspector';
import Controls from './controls';

/**
 * External dependencies
 */
import classnames from 'classnames';

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



class KadenceRestaurantMenuCategory extends Component {
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

		const {
			menuTitle
		} = attributes;

		return (
			<Fragment>
				{ isSelected && <Inspector { ...this.props } /> }
				{ isSelected && <Controls { ...this.props } /> }

				<RichText
					tagName="h1"
					className={ classnames( className, 'kt-mc-title' ) }
					value={ menuTitle }
					onChange={ menuTitle => setAttributes( menuTitle ) }
				/>

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
export default KadenceRestaurantMenuCategory;
