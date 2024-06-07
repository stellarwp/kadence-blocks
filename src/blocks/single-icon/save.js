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
	const { icon, link, target, width, title, style, linkTitle, uniqueID, tooltip, tooltipPlacement } = attributes;

	const classes = classnames({
		[`kt-svg-style-${style}`]: style,
		'kt-svg-icon-wrap': true,
		[`kt-svg-item-${uniqueID}`]: uniqueID,
	});

	const blockProps = useBlockProps.save({
		className: classes,
	});
	const tooltipID = tooltip && uniqueID ? `kt-svg-tooltip-${uniqueID}` : undefined;
	return (
		<div {...blockProps}>
			{icon && link && (
				<a
					href={link}
					className={'kt-svg-icon-link'}
					data-tooltip-id={tooltipID ? tooltipID : undefined}
					data-tooltip-placement={tooltipID && tooltipPlacement ? tooltipPlacement : undefined}
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
					tooltipID={tooltipID ? tooltipID : undefined}
					tooltipPlacement={tooltipPlacement ? tooltipPlacement : undefined}
				/>
			)}
			{tooltipID && (
				<span
					className={'kb-tooltip-hidden-content'}
					style={{ display: 'none' }}
					id={tooltipID}
					dangerouslySetInnerHTML={{ __html: tooltip }}
				/>
			)}
		</div>
	);
}

export default Save;
