/**
 * WordPress dependencies
 */
const { __ }                  = wp.i18n;
const { Component, Fragment } = wp.element;
const { BlockControls }       = wp.blockEditor;
const { Toolbar }             = wp.components;
const { select, dispatch }    = wp.data;
const { createBlock }         = wp.blocks;

/**
 * Build the restaurant menu controls
 */
class Controls extends Component {
	render() {
		const {
			clientId,
			attributes,
			setAttributes,
		} = this.props;

		const {
			fullWidth
		} = attributes

		const toolbarControls = [
			{
				icon: 'align-full-width',
				title: __( 'Full Width' ),
				isActive: fullWidth,
				onClick: () => {
					setAttributes({ fullWidth: fullWidth ? false : true })
				}
			},
			{
				icon: 'plus',
				title: __( 'Add New Menu' ),
				isActive: false,
				onClick: () => {
					const innerCount = select("core/editor").getBlocksByClientId(clientId)[0].innerBlocks.length;
					let block = createBlock("kadence/restaurantmenucategory");
					dispatch("core/block-editor").insertBlock(block, innerCount, clientId);
				}
			}
		];

		return (
			<Fragment>
				<BlockControls>
					<Toolbar controls={ toolbarControls } />
				</BlockControls>
			</Fragment>
		);
	}
}

export default Controls;
