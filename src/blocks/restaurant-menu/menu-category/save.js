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
		menuTitle,
		columns,
		uniqueID,
		displayTitle,
		titleFont
	} = attributes;

	const titleTagName = 'h' + titleFont[ 0 ].level;

	return (
		<Fragment>
			<div className={ classnames(
				`kt-menu-category-id-${uniqueID}`,
				'kt-menu-category'
			) } >

				{ 	displayTitle && <RichText.Content
						tagName={ titleTagName }
						className={ classnames( 'kt-menu-category-title' ) }
						value={ menuTitle }
					/>
				}

				<div
					className={ classnames( 'kt-category-content' ) }
					data-columns-xxl={ columns[ 0 ] }
					data-columns-xl={ columns[ 1 ] }
					data-columns-lg={ columns[ 2 ] }
					data-columns-md={ columns[ 3 ] }
					data-columns-sm={ columns[ 4 ] }
					data-columns-xs={ columns[ 5 ] }
				>
					<InnerBlocks.Content />
				</div>
			</div>
		</Fragment>
	);
};

export default save;
