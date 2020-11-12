/**
 * BLOCK: Kadence Advanced Heading
 *
 */
/* global kadence_blocks_params */
/**
 * Internal dependencies
 */


/**
 * Block dependencies
 */


/**
 * Import Css
 */

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
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */



class KadenceAdvancedHeading extends Component {
	constructor() {
		super( ...arguments );

	}

	render() {

		return (
			<Fragment>I am is now good</Fragment>
		)
	}
}
export default ( KadenceAdvancedHeading );
