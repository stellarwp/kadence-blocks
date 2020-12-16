/**
 * BLOCK: Kadence Counter Up
 */

/**
 * External dependencies
 */
import map from 'lodash/map';

/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { InspectorControls, ContrastChecker, PanelColorSettings, AlignmentToolbar } = wp.blockEditor;
const {
	TextControl,
	SelectControl,
	PanelBody,
	RangeControl,
	ToggleControl,
	BaseControl,
	ButtonGroup,
	Button,
	ColorPicker,
	TextareaControl,
	CheckboxControl,
	Tooltip,
	TabPanel,
	Dashicon
} = wp.components;


/**
 * Menu category Settings
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
			setAttributes,
		} = this.props;

		const {
			start,
			end,
			prefix,
			suffix,
			duration,
			separator
		} = attributes;

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( 'Counter Up Settings' ) }
						initialOpen={ false }>

						<div className="kt-columns-control">
							<RangeControl
								label={ __( 'Starting Number' ) }
								value={ start }
								onChange={ (value) => setAttributes({ start: value }) }
								min={ -1000 }
								max={ 1000 }
								step={ 1 }
							/>

							<RangeControl
								label={ __( 'Ending Number' ) }
								value={ end }
								onChange={ (value) => setAttributes({ end: value }) }
								min={ -9000 }
								max={ 9000 }
								step={ 1 }
							/>

							<TextControl
								label={ __( 'Number Prefix' ) }
								value={ prefix }
								onChange={ value => setAttributes( { prefix: value } ) }
							/>

							<TextControl
								label={ __( 'Number Suffix' ) }
								value={ suffix }
								onChange={ value => setAttributes( { suffix: value } ) }
							/>

							<RangeControl
								label={ __( 'Animation Duration' ) }
								value={ duration }
								onChange={ (value) => setAttributes({ duration: value }) }
								min={ 1 }
								max={ 50 }
								step={ 1 }
							/>

							<ToggleControl
								label={ __( 'Thousand Separator' ) }
								checked={ separator }
								onChange={ ( value ) => setAttributes( { separator: value } ) }
							/>
						</div>
					</PanelBody>
	            </InspectorControls>
	        </Fragment>
		);
	}
}

export default Inspector;
