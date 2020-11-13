import Inspector from './inspector';
import Controls from './controls';

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
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */



class KadenceCategoryItem extends Component {
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
			title,
			description,
			currency,
			price
		} = attributes;

		return (
			<Fragment>
				{ isSelected && <Inspector { ...this.props } /> }
				{ isSelected && <Controls { ...this.props } /> }

				<RichText
					tagName="h3"
					className={ classnames( className, 'kt-item-title' ) }
					value={ title }
					onChange={ title => setAttributes( title ) }
				/>

				<div className={ classnames( 'kt-item-content' ) }>

					<div className={ classnames( 'kt-item-left' ) }>
						<RichText
							tagName="p"
							className={ classnames( className, 'kt-item-description' ) }
							value={ description }
							onChange={ description => setAttributes( description ) }
						/>
					</div>


					<div className={ classnames( 'kt-item-right' ) }>
						<RichText
							tagName="span"
							className={ classnames( className, 'kt-item-currency' ) }
							value={ currency }
							onChange={ currency => setAttributes( currency ) }
						/>

						<RichText
							tagName="div"
							className={ classnames( className, 'kt-item-price' ) }
							value={ price }
							onChange={ price => setAttributes( price ) }
						/>
					</div>
				</div>

			</Fragment>
		)
	}
}
export default KadenceCategoryItem;
