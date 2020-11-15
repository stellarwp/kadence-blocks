/**
 * WordPress dependencies
 */
const { __ }                  = wp.i18n;
const { Component, Fragment } = wp.element;
const { BlockControls }       = wp.blockEditor;
const { Toolbar }             = wp.components;

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
