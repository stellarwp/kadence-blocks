/**
 * BLOCK: Kadence Restaurant Menu Category Item
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { RichText } = wp.blockEditor;
const { Component, Fragment } = wp.element;

/**
 * Build the restaurant menu category item edit
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
				<div className={ classnames( 'kt-category-content-item' ) }>
					<div className={ classnames( 'kt-item-content' ) }>
						<div className={ classnames( 'kt-item-left' ) }>
							<RichText
								tagName="h3"
								className={ classnames( className, 'kt-item-title' ) }
								value={ title }
								onChange={ title => setAttributes( title ) }
							/>

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
								tagName="span"
								className={ classnames( className, 'kt-item-price' ) }
								value={ price }
								onChange={ price => setAttributes( price ) }
							/>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

export default KadenceCategoryItem;
