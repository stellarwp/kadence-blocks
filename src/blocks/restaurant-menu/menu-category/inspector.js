const {
	PanelBody
} = wp.components

const { InspectorControls } = wp.blockEditor;

const {
	Component,
	Fragment,
} = wp.element;

const { __, sprintf } = wp.i18n;
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
