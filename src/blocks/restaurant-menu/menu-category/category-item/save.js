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
			<div
				className={ classnames( 'kt-category-content-item col-12 col-md-6 col-lg-4' ) }
			>
				<div className={ classnames( 'kt-item-content' ) }>
					<div className={ classnames( 'kt-item-left' ) }>
						<RichText.Content
							tagName="h3"
							className={ classnames( 'kt-item-title' ) }
							value={ title }
						/>

						<RichText.Content
							tagName="p"
							className={ classnames( 'kt-item-description' ) }
							value={ description }
						/>
					</div>

					<div className={ classnames( 'kt-item-right' ) }>
						<RichText.Content
							tagName="span"
							className={ classnames( 'kt-item-currency' ) }
							value={ currency }
						/>

						<RichText.Content
							tagName="div"
							className={ classnames( 'kt-item-price' ) }
							value={ price }
						/>
					</div>
				</div>

			</div>
		</Fragment>
	);
};

export default save;
