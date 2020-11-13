const {
	InspectorControls,
	PanelBody
} = wp.components
const {
	Component,
	Fragment,
} = wp.element;
/**
 * Inspector controls
 */
class Inspector extends Component {
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

		} = attributes

		const parentId = select( 'core/block-editor' ).getBlockRootClientId( clientId );

		return (

			<Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( "Inserter", 'frontrom' ) }
						initialOpen={ false }
					>

					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}

export default Inspector;
