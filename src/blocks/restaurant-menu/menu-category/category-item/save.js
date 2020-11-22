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
		uniqueID,

		displayTitle,
		title,

		displayText,
		contentText,

		displayAmount,
		amount,
	} = attributes;

	const hasContetnt = displayTitle || displayText ? true : false;

	if ( !hasContetnt && !displayAmount ) {
		return ( <Fragment></Fragment> )
	}

	return (
		<Fragment>
			<div
				className={ classnames(
					`kt-category-content-item-id-${uniqueID}`,
					'kt-category-content-item'
				) }
			>
				<div className={ classnames( 'kt-item-content' ) }>

					{ 	hasContetnt &&
						<div className={ classnames( 'kt-item-left' ) }>
							{ 	displayTitle &&
								<RichText.Content
									tagName="h3"
									className={ classnames( 'kt-item-title' ) }
									value={ title }
								/>
							}
							{ 	displayText &&
								<RichText.Content
									tagName="p"
									className={ classnames( 'kt-item-text' ) }
									value={ contentText }
								/>
							}
						</div>
					}

					{ 	displayAmount &&
						<div className={ classnames( 'kt-item-right kt-item-price' ) }>

							<RichText.Content
								tagName="div"
								className={ classnames( 'kt-item-amount' ) }
								value={ amount }
							/>
						</div>
					}
				</div>

			</div>
		</Fragment>
	);
};

export default save;
