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
const { Fragment } = wp.element;
const { RichText } = wp.blockEditor;

/**
 * Build the restaurant menu category item save
 */
const save = ( { attributes } ) => {

	const {
		title,
		description,
		currency,
		price
	} = attributes;

	return (
		<Fragment>
			<RichText.Content
				tagName="h3"
				className={ classnames(
				 	attributes.className ? attributes.classnames : '',
					'kt-item-title'
				) }
				value={ title }
			/>

			<RichText.Content
				tagName="p"
				className={ classnames(
					attributes.className ? attributes.classnames : '',
					'kt-item-description'
				) }
				value={ description }
			/>

			<RichText.Content
				tagName="span"
				className={ classnames(
					attributes.className ? attributes.classnames : '',
					'kt-item-currency'
				) }
				value={ currency }
			/>

			<RichText.Content
				tagName="div"
				className={ classnames(
					attributes.className ? attributes.classnames : '',
					'kt-item-price'
				) }
				value={ price }
			/>
		</Fragment>
	);
};

export default save;
