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
		titleFont,

		displayText,
		contentText,
		textFont,

		displayAmount,
		amount,
		priceFont
	} = attributes;

	const hasAmount    = displayAmount && amount != '' ? true : false;
	const hasContetnt  = displayTitle || displayText ? true : false;
	const titleTagName = 'h' + titleFont[ 0 ].level;
	const textTagName = 'h' + textFont[ 0 ].level;
	const priceTagName = 'h' + priceFont[ 0 ].level;

	if ( !hasContetnt && !displayAmount ) {
		return ( <Fragment></Fragment> )
	}

	return (
		<Fragment>
			<div className={ classnames( `kt-category-content-item-id-${uniqueID} kt-category-content-item-wrap gutter` ) }>
				<div
					className={ classnames( 'kt-category-content-item' ) }
				>
					<div className={ classnames( 'kt-item-content' ) }>

						{ 	hasContetnt &&
							<div className={ classnames( 'kt-item-left' ) }>
								{ 	displayTitle &&
									<RichText.Content
										tagName={titleTagName}
										className={ classnames( 'kt-item-title' ) }
										value={ title }
									/>
								}
								{ 	displayText &&
									<RichText.Content
										tagName={ textTagName }
										className={ classnames( 'kt-item-text' ) }
										value={ contentText }
									/>
								}
							</div>
						}

						{ 	hasAmount &&
							<div className={ classnames( 'kt-item-right kt-item-price' ) }>

								<RichText.Content
									tagName={ priceTagName }
									className={ classnames( 'kt-item-amount' ) }
									value={ amount }
								/>
							</div>
						}
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default save;
