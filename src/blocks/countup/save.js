/**
 * BLOCK: Kadence Count-Up
 */

/**
 * Import External
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * Build the count up save
 */
function KadenceCounterUpSave( props ) {

	const {
		attributes,
	} = props;

	const {
		uniqueID,
		title,
		start,
		end,
		startDecimal,
		endDecimal,
		prefix,
		suffix,
		duration,
		separator,
		titleFont,
		displayTitle,
		decimal,
		decimalSpaces,
	} = attributes;

	const classes = classnames( {
		[ `kb-count-up-${uniqueID}` ]: uniqueID,
		'kb-count-up'                : true,
	} );

	const tagName = titleFont[ 0 ].htmlTag && titleFont[ 0 ].htmlTag !== 'heading' ? titleFont[ 0 ].htmlTag : 'h' + titleFont[ 0 ].level;

	const blockProps = useBlockProps.save( {
		className: classes
	} );
	return (
		<div
			{...blockProps}
			data-start={start || startDecimal }
			data-end={end || endDecimal }
			data-prefix={prefix}
			data-suffix={suffix}
			data-duration={duration}
			data-separator={separator}
			data-decimal={decimal ? decimal : undefined}
			data-decimal-spaces={decimal ? decimalSpaces : undefined}
		>
			<div className={'kb-count-up-process kb-count-up-number'}/>
			{title && displayTitle && (
				<RichText.Content
					tagName={tagName}
					className={'kb-count-up-title'}
					value={title}
				/>
			)}
		</div>
	);

}

export default KadenceCounterUpSave;
