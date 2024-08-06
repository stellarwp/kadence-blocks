/**
 * BLOCK: Icon List
 *
 * Depreciated.
 */

/**
 * Internal block libraries
 */

import { IconSpanTag } from '@kadence/components';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import classnames from 'classnames';
import metadata from './block.json';

export default [
	{
		attributes: metadata.attributes,
		apiVersion: 2,
		save: ({ attributes }) => {
			const { uniqueID, icon, link, target, width, text, style, level, showIcon, size } = attributes;

			const classes = classnames({
				'kt-svg-icon-list-item-wrap': true,
				[`kt-svg-icon-list-item-${uniqueID}`]: uniqueID,
				[`kt-svg-icon-list-style-${style}`]: style,
				[`kt-svg-icon-list-level-${level}`]: level,
			});

			const blockProps = useBlockProps.save({
				className: classes,
			});

			const iconName = icon ? icon : 'USE_PARENT_DEFAULT_ICON';

			const iconSpan = (
				<IconSpanTag
					extraClass={'kt-svg-icon-list-single'}
					name={iconName}
					strokeWidth={'fe' === icon.substring(0, 2) ? width : undefined}
					ariaHidden={'true'}
				/>
			);

			const emptyIcon =
				size === 0 ? (
					<></>
				) : (
					<div
						className="kt-svg-icon-list-single"
						style="display: inline-flex; justify-content: center; align-items: center;"
					>
						<svg
							viewBox="0 0 24 24"
							height="1em"
							width="1em"
							fill="none"
							stroke="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							style="display: inline-block; vertical-align: middle;"
						></svg>
					</div>
				);

			return (
				<li {...blockProps}>
					{link && (
						<a
							href={link}
							className={'kt-svg-icon-link'}
							target={'_blank' === target ? target : undefined}
							rel={'_blank' === target ? 'noopener noreferrer' : undefined}
						>
							{showIcon ? iconSpan : emptyIcon}
							<RichText.Content tagName="span" value={text} className={'kt-svg-icon-list-text'} />
						</a>
					)}
					{!link && (
						<>
							{showIcon ? iconSpan : emptyIcon}
							<RichText.Content tagName="span" value={text} className={'kt-svg-icon-list-text'} />
						</>
					)}
				</li>
			);
		},
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			icon: {
				type: 'string',
				default: '',
			},
			link: {
				type: 'string',
				default: '',
			},
			target: {
				type: 'string',
				default: '_self',
			},
			size: {
				type: 'number',
				default: '',
			},
			width: {
				type: 'number',
				default: '',
			},
			text: {
				type: 'string',
				default: '',
			},
			color: {
				type: 'string',
				default: '',
			},
			background: {
				type: 'string',
				default: '',
			},
			border: {
				type: 'string',
				default: '',
			},
			borderRadius: {
				type: 'number',
				default: '',
			},
			padding: {
				type: 'number',
				default: '',
			},
			borderWidth: {
				type: 'number',
				default: '',
			},
			style: {
				type: 'string',
				default: '',
			},
			level: {
				type: 'number',
				default: 0,
			},
		},
		save: ({ attributes }) => {
			const { uniqueID, icon, link, target, width, text, style, level } = attributes;

			const classes = classnames({
				'kt-svg-icon-list-item-wrap': true,
				[`kt-svg-icon-list-item-${uniqueID}`]: uniqueID,
				[`kt-svg-icon-list-style-${style}`]: style,
				[`kt-svg-icon-list-level-${level}`]: level,
			});

			const blockProps = useBlockProps.save({
				className: classes,
			});

			return (
				<li {...blockProps}>
					{link && (
						<a
							href={link}
							className={'kt-svg-icon-link'}
							target={'_blank' === target ? target : undefined}
							rel={'_blank' === target ? 'noopener noreferrer' : undefined}
						>
							{icon && (
								<IconSpanTag
									extraClass={'kt-svg-icon-list-single'}
									name={icon}
									strokeWidth={'fe' === icon.substring(0, 2) ? width : undefined}
									ariaHidden={'true'}
								/>
							)}
							<RichText.Content tagName="span" value={text} className={'kt-svg-icon-list-text'} />
						</a>
					)}
					{!link && (
						<>
							{icon && (
								<IconSpanTag
									extraClass={'kt-svg-icon-list-single'}
									name={icon}
									strokeWidth={'fe' === icon.substring(0, 2) ? width : undefined}
									ariaHidden={'true'}
								/>
							)}
							<RichText.Content tagName="span" value={text} className={'kt-svg-icon-list-text'} />
						</>
					)}
				</li>
			);
		},
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			icon: {
				type: 'string',
				default: '',
			},
			link: {
				type: 'string',
				default: '',
			},
			target: {
				type: 'string',
				default: '_self',
			},
			size: {
				type: 'number',
				default: '',
			},
			width: {
				type: 'number',
				default: '',
			},
			text: {
				type: 'string',
				default: '',
			},
			color: {
				type: 'string',
				default: '',
			},
			background: {
				type: 'string',
				default: '',
			},
			border: {
				type: 'string',
				default: '',
			},
			borderRadius: {
				type: 'number',
				default: '',
			},
			padding: {
				type: 'number',
				default: '',
			},
			borderWidth: {
				type: 'number',
				default: '',
			},
			style: {
				type: 'string',
				default: '',
			},
			level: {
				type: 'number',
				default: 0,
			},
			iconTitle: {
				type: 'string',
				default: '',
			},
		},
		save: ({ attributes }) => {
			const {
				uniqueID,
				icon,
				link,
				linkSponsored,
				linkNoFollow,
				target,
				width,
				text,
				style,
				level,
				showIcon,
				size,
				iconTitle,
			} = attributes;

			const classes = classnames({
				'kt-svg-icon-list-item-wrap': true,
				[`kt-svg-icon-list-item-${uniqueID}`]: uniqueID,
				[`kt-svg-icon-list-style-${style}`]: style,
				[`kt-svg-icon-list-level-${level}`]: level,
			});

			const blockProps = useBlockProps.save({
				className: classes,
			});

			const iconName = icon ? icon : 'USE_PARENT_DEFAULT_ICON';

			const iconWidth = icon && width ? width : 'USE_PARENT_DEFAULT_WIDTH';

			const iconTitleOutput = icon && iconTitle ? iconTitle : '';
			const iconHidden = icon && iconTitle ? 'false' : 'true';

			const iconSpan = (
				<IconSpanTag
					extraClass={'kt-svg-icon-list-single'}
					name={iconName}
					strokeWidth={iconWidth}
					title={iconTitleOutput}
					ariaHidden={iconHidden}
				/>
			);

			const emptyIcon =
				size === 0 ? (
					<></>
				) : (
					<div
						className="kt-svg-icon-list-single"
						style="display: inline-flex; justify-content: center; align-items: center;"
					>
						<svg
							viewBox="0 0 24 24"
							height="1em"
							width="1em"
							fill="none"
							stroke="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							style="display: inline-block; vertical-align: middle;"
						></svg>
					</div>
				);

			let rel = '';
			if (target === '_blank') {
				rel = 'noopener noreferrer';
			}

			if (linkNoFollow) {
				if (rel !== '') {
					rel = rel + ' nofollow';
				} else {
					rel = 'nofollow';
				}
			}

			if (linkSponsored) {
				if (rel !== '') {
					rel = rel + ' sponsored';
				} else {
					rel = 'sponsored';
				}
			}

			return (
				<li {...blockProps}>
					{link && (
						<a
							href={link}
							className={'kt-svg-icon-link'}
							target={'_blank' === target ? target : undefined}
							rel={'' !== rel ? rel : undefined}
						>
							{showIcon ? iconSpan : emptyIcon}
							<RichText.Content tagName="span" value={text} className={'kt-svg-icon-list-text'} />
						</a>
					)}
					{!link && (
						<>
							{showIcon ? iconSpan : emptyIcon}
							<RichText.Content tagName="span" value={text} className={'kt-svg-icon-list-text'} />
						</>
					)}
				</li>
			);
		},
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			icon: {
				type: 'string',
				default: '',
			},
			showIcon: {
				type: 'boolean',
				default: true,
			},
			link: {
				type: 'string',
				default: '',
				__experimentalRole: 'content',
			},
			linkNoFollow: {
				type: 'boolean',
				default: false,
			},
			linkSponsored: {
				type: 'boolean',
				default: false,
			},
			target: {
				type: 'string',
				default: '_self',
				__experimentalRole: 'content',
			},
			size: {
				type: 'number',
				default: '',
			},
			width: {
				type: 'number',
				default: '',
			},
			text: {
				type: 'string',
				source: 'html',
				selector: '.kt-svg-icon-list-text',
				__experimentalRole: 'content',
			},
			color: {
				type: 'string',
				default: '',
			},
			background: {
				type: 'string',
				default: '',
			},
			border: {
				type: 'string',
				default: '',
			},
			borderRadius: {
				type: 'number',
				default: '',
			},
			padding: {
				type: 'number',
				default: '',
			},
			borderWidth: {
				type: 'number',
				default: '',
			},
			style: {
				type: 'string',
				default: '',
			},
			level: {
				type: 'number',
				default: 0,
			},
			iconTitle: {
				type: 'string',
				default: '',
			},
			tooltip: {
				type: 'string',
				source: 'html',
				selector: '.kb-tooltip-hidden-content',
				__experimentalRole: 'content',
			},
			tooltipPlacement: {
				type: 'string',
				default: '',
			},
			tooltipSelection: {
				type: 'string',
				default: 'both',
			},
			tooltipDash: {
				type: 'boolean',
				default: true,
			},
		},
		save: ({ attributes }) => {
			const {
				uniqueID,
				icon,
				link,
				linkSponsored,
				linkNoFollow,
				target,
				width,
				text,
				style,
				level,
				showIcon,
				size,
				iconTitle,
				tooltip,
				tooltipSelection,
				tooltipPlacement,
				tooltipDash,
			} = attributes;

			const tooltipID = tooltip && uniqueID ? `kt-svg-tooltip-${uniqueID}` : undefined;
			const iconOnlyTooltip = 'icon' === tooltipSelection ? true : false;
			const textOnlyTooltip = 'text' === tooltipSelection ? true : false;
			const classes = classnames({
				'kt-svg-icon-list-item-wrap': true,
				[`kt-svg-icon-list-item-${uniqueID}`]: uniqueID,
				[`kt-svg-icon-list-style-${style}`]: style,
				[`kt-svg-icon-list-level-${level}`]: level,
			});

			const blockProps = useBlockProps.save({
				className: classes,
			});

			const iconName = icon ? icon : 'USE_PARENT_DEFAULT_ICON';

			const iconWidth = icon && width ? width : 'USE_PARENT_DEFAULT_WIDTH';

			const iconTitleOutput = iconTitle ? iconTitle : '';
			const iconHidden = icon && iconTitle ? 'false' : 'true';

			const iconSpan = (
				<IconSpanTag
					extraClass={`kt-svg-icon-list-single${iconOnlyTooltip && tooltipID ? ' kb-icon-list-tooltip' : ''}${
						!tooltipDash && iconOnlyTooltip && tooltipID ? ' kb-list-tooltip-no-border' : ''
					}`}
					name={iconName}
					strokeWidth={iconWidth}
					title={iconTitleOutput}
					ariaHidden={iconHidden}
					tooltipID={iconOnlyTooltip && tooltipID ? tooltipID : undefined}
					tooltipPlacement={iconOnlyTooltip && tooltipPlacement ? tooltipPlacement : undefined}
				/>
			);

			const emptyIcon =
				size === 0 ? (
					<></>
				) : (
					<div
						className="kt-svg-icon-list-single"
						style="display: inline-flex; justify-content: center; align-items: center;"
					>
						<svg
							viewBox="0 0 24 24"
							height="1em"
							width="1em"
							fill="none"
							stroke="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							style="display: inline-block; vertical-align: middle;"
						></svg>
					</div>
				);

			let rel = '';
			if (target === '_blank') {
				rel = 'noopener noreferrer';
			}

			if (linkNoFollow) {
				if (rel !== '') {
					rel = rel + ' nofollow';
				} else {
					rel = 'nofollow';
				}
			}

			if (linkSponsored) {
				if (rel !== '') {
					rel = rel + ' sponsored';
				} else {
					rel = 'sponsored';
				}
			}
			return (
				<li {...blockProps}>
					{link && (
						<a
							href={link}
							className={'kt-svg-icon-link'}
							target={'_blank' === target ? target : undefined}
							data-tooltip-id={!iconOnlyTooltip && !textOnlyTooltip && tooltipID ? tooltipID : undefined}
							data-tooltip-placement={
								!iconOnlyTooltip && !textOnlyTooltip && tooltipID && tooltipPlacement
									? tooltipPlacement
									: undefined
							}
							rel={'' !== rel ? rel : undefined}
						>
							{showIcon ? iconSpan : emptyIcon}
							<RichText.Content
								tagName="span"
								value={text}
								className={`kt-svg-icon-list-text${
									tooltipID && textOnlyTooltip ? ' kb-icon-list-tooltip' : ''
								}${tooltipID && textOnlyTooltip && !tooltipDash ? ' kb-list-tooltip-no-border' : ''}`}
								data-tooltip-id={tooltipID && textOnlyTooltip ? tooltipID : undefined}
								data-tooltip-placement={
									tooltipID && textOnlyTooltip && tooltipPlacement ? tooltipPlacement : undefined
								}
							/>
						</a>
					)}
					{!link && (
						<>
							{!iconOnlyTooltip && !textOnlyTooltip && tooltipID && (
								<span
									className={`kb-icon-list-tooltip-wrap kb-icon-list-tooltip${
										!tooltipDash ? ' kb-list-tooltip-no-border' : ''
									}`}
									data-tooltip-id={tooltipID}
									data-tooltip-placement={tooltipPlacement}
								>
									{showIcon ? iconSpan : emptyIcon}
									<RichText.Content tagName="span" value={text} className={'kt-svg-icon-list-text'} />
								</span>
							)}
							{(!tooltipID || iconOnlyTooltip || textOnlyTooltip) && (
								<>
									{showIcon ? iconSpan : emptyIcon}
									<RichText.Content
										tagName="span"
										value={text}
										className={`kt-svg-icon-list-text${
											tooltipID && textOnlyTooltip ? ' kb-icon-list-tooltip' : ''
										}${
											tooltipID && textOnlyTooltip && !tooltipDash
												? ' kb-list-tooltip-no-border'
												: ''
										}`}
										data-tooltip-id={tooltipID && textOnlyTooltip ? tooltipID : undefined}
										data-tooltip-placement={
											tooltipID && textOnlyTooltip && tooltipPlacement
												? tooltipPlacement
												: undefined
										}
									/>
								</>
							)}
						</>
					)}
					{tooltipID && (
						<span
							className={'kb-tooltip-hidden-content'}
							style={{ display: 'none' }}
							id={tooltipID}
							dangerouslySetInnerHTML={{ __html: tooltip }} // Because this is saved into the post as html WordPress core will sanitize it if the user does not have the unfiltered_html capability.
						/>
					)}
				</li>
			);
		},
	},
];
