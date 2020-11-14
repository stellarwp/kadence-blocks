/**
 * BLOCK: Kadence Restaurant Menu Category
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { Fragment }              = wp.element;
const { InnerBlocks, RichText } = wp.blockEditor

/**
 * Build the restaurant menu category save
 */
const save = ( { attributes } ) => {

	const {
		menuTitle
	} = attributes;

	return (
		<Fragment>
			<RichText.Content
				tagName="h1"
				className={ classnames(
					attributes.className ? attributes.classnames : '',
					'kt-mc-title'
				) }
				value={ menuTitle }
			/>
			<InnerBlocks.Content />
		</Fragment>
	);
};

export default save;
