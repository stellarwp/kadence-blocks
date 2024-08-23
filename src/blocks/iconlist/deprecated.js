/**
 * BLOCK: Icon List
 *
 * Depreciated.
 */

/**
 * Internal block libraries
 */

import { times } from 'lodash';
import { KadenceColorOutput } from '@kadence/helpers';
import { IconRender } from '@kadence/components';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { migrateToInnerblocks } from './utils';

export default [
	{
		attributes: {
			items: {
				type: 'array',
				default: [
					{
						icon: 'fe_checkCircle',
						link: '',
						target: '_self',
						size: 20,
						width: 2,
						text: '',
						color: '',
						background: '',
						border: '',
						borderRadius: 0,
						padding: 5,
						borderWidth: 1,
						style: 'default',
						level: 0,
					},
				],
			},
			listStyles: {
				type: 'array',
				default: [
					{
						size: ['', '', ''],
						sizeType: 'px',
						lineHeight: ['', '', ''],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						color: '',
						textTransform: '',
					},
				],
			},
			listCount: {
				type: 'number',
				default: 1,
			},
			columns: {
				type: 'number',
				default: 1,
			},
			tabletColumns: {
				type: 'number',
				default: '',
			},
			mobileColumns: {
				type: 'number',
				default: '',
			},
			listGap: {
				type: 'number',
				default: 5,
			},
			tabletListGap: {
				type: 'number',
				default: '',
			},
			mobileListGap: {
				type: 'number',
				default: '',
			},
			columnGap: {
				type: 'number',
				default: 0,
			},
			tabletColumnGap: {
				type: 'number',
				default: '',
			},
			mobileColumnGap: {
				type: 'number',
				default: '',
			},
			listLabelGap: {
				type: 'number',
				default: 10,
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
			blockAlignment: {
				type: 'string',
				default: 'none',
			},
			listMargin: {
				type: 'array',
				default: [0, 0, 10, 0],
			},
			tabletListMargin: {
				type: 'array',
				default: ['', '', '', ''],
			},
			mobileListMargin: {
				type: 'array',
				default: ['', '', '', ''],
			},
			listMarginType: {
				type: 'string',
				default: 'px',
			},
			iconAlign: {
				type: 'string',
				default: 'middle',
			},
		},
		save: ({ attributes }) => {
			const { items, listCount, columns, blockAlignment, iconAlign, uniqueID, tabletColumns, mobileColumns } =
				attributes;

			const renderItems = (index) => {
				if (undefined === items?.[index]) {
					return;
				}
				return (
					<li
						className={`kt-svg-icon-list-style-${items[index].style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${index} kt-svg-icon-list-level-${items[index].level}`}
					>
						{items[index].link && (
							<a
								href={items[index].link}
								className={'kt-svg-icon-link'}
								target={'_blank' === items[index].target ? items[index].target : undefined}
								rel={'_blank' === items[index].target ? 'noopener noreferrer' : undefined}
							>
								{items[index].icon && (
									<IconRender
										className={`kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`}
										name={items[index].icon}
										size={items[index].size}
										strokeWidth={
											'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined
										}
										ariaHidden={'true'}
										style={{
											color: items[index].color
												? KadenceColorOutput(items[index].color)
												: undefined,
											backgroundColor:
												items[index].background && items[index].style !== 'default'
													? KadenceColorOutput(items[index].background)
													: undefined,
											padding:
												items[index].padding && items[index].style !== 'default'
													? items[index].padding + 'px'
													: undefined,
											borderColor:
												items[index].border && items[index].style !== 'default'
													? KadenceColorOutput(items[index].border)
													: undefined,
											borderWidth:
												items[index].borderWidth && items[index].style !== 'default'
													? items[index].borderWidth + 'px'
													: undefined,
											borderRadius:
												items[index].borderRadius && items[index].style !== 'default'
													? items[index].borderRadius + '%'
													: undefined,
										}}
									/>
								)}
								<RichText.Content
									tagName="span"
									value={items[index].text}
									className={'kt-svg-icon-list-text'}
								/>
							</a>
						)}
						{!items[index].link && (
							<Fragment>
								{items[index].icon && (
									<IconRender
										className={`kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`}
										name={items[index].icon}
										size={items[index].size}
										strokeWidth={
											'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined
										}
										ariaHidden={'true'}
										style={{
											color: items[index].color
												? KadenceColorOutput(items[index].color)
												: undefined,
											backgroundColor:
												items[index].background && items[index].style !== 'default'
													? KadenceColorOutput(items[index].background)
													: undefined,
											padding:
												items[index].padding && items[index].style !== 'default'
													? items[index].padding + 'px'
													: undefined,
											borderColor:
												items[index].border && items[index].style !== 'default'
													? KadenceColorOutput(items[index].border)
													: undefined,
											borderWidth:
												items[index].borderWidth && items[index].style !== 'default'
													? items[index].borderWidth + 'px'
													: undefined,
											borderRadius:
												items[index].borderRadius && items[index].style !== 'default'
													? items[index].borderRadius + '%'
													: undefined,
											marginTop: items[index].marginTop
												? items[index].marginTop + 'px'
												: undefined,
											marginRight: items[index].marginRight
												? items[index].marginRight + 'px'
												: undefined,
											marginBottom: items[index].marginBottom
												? items[index].marginBottom + 'px'
												: undefined,
											marginLeft: items[index].marginLeft
												? items[index].marginLeft + 'px'
												: undefined,
										}}
									/>
								)}
								<RichText.Content
									tagName="span"
									value={items[index].text}
									className={'kt-svg-icon-list-text'}
								/>
							</Fragment>
						)}
					</li>
				);
			};

			const blockProps = useBlockProps.save({
				className: `wp-block-kadence-iconlist kt-svg-icon-list-items kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns} align${
					blockAlignment ? blockAlignment : 'none'
				}${undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : ''}${
					undefined !== tabletColumns && '' !== tabletColumns
						? ' kt-tablet-svg-icon-list-columns-' + tabletColumns
						: ''
				}${
					undefined !== mobileColumns && '' !== mobileColumns
						? ' kt-mobile-svg-icon-list-columns-' + mobileColumns
						: ''
				}`,
			});

			return (
				<div {...blockProps}>
					<ul className="kt-svg-icon-list">{times(listCount, (n) => renderItems(n))}</ul>
				</div>
			);
		},
		migrate: migrateToInnerblocks,
	},
	{
		attributes: {
			items: {
				type: 'array',
				default: [
					{
						icon: 'fe_checkCircle',
						link: '',
						target: '_self',
						size: 20,
						width: 2,
						text: '',
						color: '',
						background: '',
						border: '',
						borderRadius: 0,
						padding: 5,
						borderWidth: 1,
						style: 'default',
					},
				],
			},
			listStyles: {
				type: 'array',
				default: [
					{
						size: ['', '', ''],
						sizeType: 'px',
						lineHeight: ['', '', ''],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						color: '',
						textTransform: '',
					},
				],
			},
			listCount: {
				type: 'number',
				default: 1,
			},
			columns: {
				type: 'number',
				default: 1,
			},
			tabletColumns: {
				type: 'number',
				default: '',
			},
			mobileColumns: {
				type: 'number',
				default: '',
			},
			listGap: {
				type: 'number',
				default: 5,
			},
			listLabelGap: {
				type: 'number',
				default: 10,
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
			blockAlignment: {
				type: 'string',
				default: 'none',
			},
			listMargin: {
				type: 'array',
				default: [0, 0, 10, 0],
			},
			iconAlign: {
				type: 'string',
				default: 'middle',
			},
		},
		save: ({ attributes }) => {
			const { items, listCount, columns, blockAlignment, iconAlign, uniqueID, tabletColumns, mobileColumns } =
				attributes;
			const renderItems = (index) => {
				if (undefined === items?.[index]) {
					return;
				}
				return (
					<li
						className={`kt-svg-icon-list-style-${items[index].style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${index}`}
					>
						{items[index].icon && items[index].link && (
							<a
								href={items[index].link}
								className={'kt-svg-icon-link'}
								target={'_blank' === items[index].target ? items[index].target : undefined}
								rel={'_blank' === items[index].target ? 'noopener noreferrer' : undefined}
							>
								<IconRender
									className={`kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`}
									name={items[index].icon}
									size={items[index].size}
									strokeWidth={
										'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined
									}
									ariaHidden={'true'}
									style={{
										color: items[index].color ? KadenceColorOutput(items[index].color) : undefined,
										backgroundColor:
											items[index].background && items[index].style !== 'default'
												? KadenceColorOutput(items[index].background)
												: undefined,
										padding:
											items[index].padding && items[index].style !== 'default'
												? items[index].padding + 'px'
												: undefined,
										borderColor:
											items[index].border && items[index].style !== 'default'
												? KadenceColorOutput(items[index].border)
												: undefined,
										borderWidth:
											items[index].borderWidth && items[index].style !== 'default'
												? items[index].borderWidth + 'px'
												: undefined,
										borderRadius:
											items[index].borderRadius && items[index].style !== 'default'
												? items[index].borderRadius + '%'
												: undefined,
									}}
								/>
								<RichText.Content
									tagName="span"
									value={items[index].text}
									className={'kt-svg-icon-list-text'}
								/>
							</a>
						)}
						{items[index].icon && !items[index].link && (
							<Fragment>
								<IconRender
									className={`kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`}
									name={items[index].icon}
									size={items[index].size}
									strokeWidth={
										'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined
									}
									ariaHidden={'true'}
									style={{
										color: items[index].color ? KadenceColorOutput(items[index].color) : undefined,
										backgroundColor:
											items[index].background && items[index].style !== 'default'
												? KadenceColorOutput(items[index].background)
												: undefined,
										padding:
											items[index].padding && items[index].style !== 'default'
												? items[index].padding + 'px'
												: undefined,
										borderColor:
											items[index].border && items[index].style !== 'default'
												? KadenceColorOutput(items[index].border)
												: undefined,
										borderWidth:
											items[index].borderWidth && items[index].style !== 'default'
												? items[index].borderWidth + 'px'
												: undefined,
										borderRadius:
											items[index].borderRadius && items[index].style !== 'default'
												? items[index].borderRadius + '%'
												: undefined,
										marginTop: items[index].marginTop ? items[index].marginTop + 'px' : undefined,
										marginRight: items[index].marginRight
											? items[index].marginRight + 'px'
											: undefined,
										marginBottom: items[index].marginBottom
											? items[index].marginBottom + 'px'
											: undefined,
										marginLeft: items[index].marginLeft
											? items[index].marginLeft + 'px'
											: undefined,
									}}
								/>
								<RichText.Content
									tagName="span"
									value={items[index].text}
									className={'kt-svg-icon-list-text'}
								/>
							</Fragment>
						)}
					</li>
				);
			};
			return (
				<div
					className={`kt-svg-icon-list-items kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns} align${
						blockAlignment ? blockAlignment : 'none'
					}${undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : ''}${
						undefined !== tabletColumns && '' !== tabletColumns
							? ' kt-tablet-svg-icon-list-columns-' + tabletColumns
							: ''
					}${
						undefined !== mobileColumns && '' !== mobileColumns
							? ' kt-mobile-svg-icon-list-columns-' + mobileColumns
							: ''
					}`}
				>
					<ul className="kt-svg-icon-list">{times(listCount, (n) => renderItems(n))}</ul>
				</div>
			);
		},
		migrate: migrateToInnerblocks,
	},
	{
		attributes: {
			items: {
				type: 'array',
				default: [
					{
						icon: 'fe_checkCircle',
						link: '',
						target: '_self',
						size: 20,
						width: 2,
						text: '',
						color: '',
						background: '',
						border: '',
						borderRadius: 0,
						padding: 5,
						borderWidth: 1,
						style: 'default',
					},
				],
			},
			listStyles: {
				type: 'array',
				default: [
					{
						size: ['', '', ''],
						sizeType: 'px',
						lineHeight: ['', '', ''],
						lineType: 'px',
						letterSpacing: '',
						family: '',
						google: false,
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						color: '',
						textTransform: '',
					},
				],
			},
			listCount: {
				type: 'number',
				default: 1,
			},
			columns: {
				type: 'number',
				default: 1,
			},
			listGap: {
				type: 'number',
				default: 5,
			},
			listLabelGap: {
				type: 'number',
				default: 10,
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
			blockAlignment: {
				type: 'string',
				default: 'none',
			},
			listMargin: {
				type: 'array',
				default: [0, 0, 10, 0],
			},
			iconAlign: {
				type: 'string',
				default: 'middle',
			},
		},
		save: ({ attributes }) => {
			const { items, listCount, columns, blockAlignment, iconAlign, uniqueID } = attributes;
			const renderItems = (index) => {
				if (undefined === items?.[index]) {
					return;
				}
				return (
					<li
						className={`kt-svg-icon-list-style-${items[index].style} kt-svg-icon-list-item-wrap kt-svg-icon-list-item-${index}`}
					>
						{items[index].icon && items[index].link && (
							<a
								href={items[index].link}
								className={'kt-svg-icon-link'}
								target={'_blank' === items[index].target ? items[index].target : undefined}
								rel={'_blank' === items[index].target ? 'noopener noreferrer' : undefined}
							>
								<IconRender
									className={`kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`}
									name={items[index].icon}
									size={items[index].size}
									strokeWidth={
										'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined
									}
									style={{
										color: items[index].color ? KadenceColorOutput(items[index].color) : undefined,
										backgroundColor:
											items[index].background && items[index].style !== 'default'
												? KadenceColorOutput(items[index].background)
												: undefined,
										padding:
											items[index].padding && items[index].style !== 'default'
												? items[index].padding + 'px'
												: undefined,
										borderColor:
											items[index].border && items[index].style !== 'default'
												? KadenceColorOutput(items[index].border)
												: undefined,
										borderWidth:
											items[index].borderWidth && items[index].style !== 'default'
												? items[index].borderWidth + 'px'
												: undefined,
										borderRadius:
											items[index].borderRadius && items[index].style !== 'default'
												? items[index].borderRadius + '%'
												: undefined,
									}}
								/>
								<RichText.Content
									tagName="span"
									value={items[index].text}
									className={'kt-svg-icon-list-text'}
								/>
							</a>
						)}
						{items[index].icon && !items[index].link && (
							<Fragment>
								<IconRender
									className={`kt-svg-icon-list-single kt-svg-icon-list-single-${items[index].icon}`}
									name={items[index].icon}
									size={items[index].size}
									strokeWidth={
										'fe' === items[index].icon.substring(0, 2) ? items[index].width : undefined
									}
									style={{
										color: items[index].color ? KadenceColorOutput(items[index].color) : undefined,
										backgroundColor:
											items[index].background && items[index].style !== 'default'
												? KadenceColorOutput(items[index].background)
												: undefined,
										padding:
											items[index].padding && items[index].style !== 'default'
												? items[index].padding + 'px'
												: undefined,
										borderColor:
											items[index].border && items[index].style !== 'default'
												? KadenceColorOutput(items[index].border)
												: undefined,
										borderWidth:
											items[index].borderWidth && items[index].style !== 'default'
												? items[index].borderWidth + 'px'
												: undefined,
										borderRadius:
											items[index].borderRadius && items[index].style !== 'default'
												? items[index].borderRadius + '%'
												: undefined,
										marginTop: items[index].marginTop ? items[index].marginTop + 'px' : undefined,
										marginRight: items[index].marginRight
											? items[index].marginRight + 'px'
											: undefined,
										marginBottom: items[index].marginBottom
											? items[index].marginBottom + 'px'
											: undefined,
										marginLeft: items[index].marginLeft
											? items[index].marginLeft + 'px'
											: undefined,
									}}
								/>
								<RichText.Content
									tagName="span"
									value={items[index].text}
									className={'kt-svg-icon-list-text'}
								/>
							</Fragment>
						)}
					</li>
				);
			};
			return (
				<div
					className={`kt-svg-icon-list-items kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns} align${
						blockAlignment ? blockAlignment : 'none'
					}${undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : ''}`}
				>
					<ul className="kt-svg-icon-list">{times(listCount, (n) => renderItems(n))}</ul>
				</div>
			);
		},
		migrate: migrateToInnerblocks,
	},
];
