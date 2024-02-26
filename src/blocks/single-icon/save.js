/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import { IconSpanTag } from '@kadence/components';
/**
 * External dependencies
 */
import classnames from 'classnames';

function Save({ attributes, className }) {
	const { icon, link, target, width, title, style, linkTitle, uniqueID } = attributes;

	const classes = classnames({
		[`kt-svg-style-${style}`]: style,
		'kt-svg-icon-wrap': true,
		[`kt-svg-item-${uniqueID}`]: uniqueID,
	});

	const blockProps = useBlockProps.save({
		className: classes,
	});

	return (
		<div {...blockProps}>
			{icon && link && (
				<a
					href={link}
					className={'kt-svg-icon-link'}
					target={'_blank' === target ? target : undefined}
					rel={'_blank' === target ? 'noopener noreferrer' : undefined}
					aria-label={undefined !== linkTitle && '' !== linkTitle ? linkTitle : undefined}
				>
					<IconSpanTag
						name={icon}
						strokeWidth={'fe' === icon.substring(0, 2) ? width : undefined}
						title={title ? title : ''}
					/>
				</a>
			)}
			{icon && !link && (
				<IconSpanTag
					name={icon}
					strokeWidth={'fe' === icon.substring(0, 2) ? width : undefined}
					title={title ? title : ''}
				/>
			)}
		</div>
	);
}

export default Save;
