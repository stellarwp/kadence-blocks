/**
 * BLOCK: Kadence Count-Up
 */

/**
 * Import External
 */
import classnames from 'classnames';

const { RichText, useBlockProps } = wp.blockEditor;

export default [
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			title: {
				type: 'string',
				default: '',
			},
			displayTitle: {
				type: 'boolean',
				default: true,
			},
			titleFont: {
				type: 'array',
				default: [ {
					level: 4,
					htmlTag: 'div',
					size: [ '', '', '' ],
					sizeType: 'px',
					lineHeight: [ '', '', '' ],
					lineType: '',
					letterSpacing: '',
					textTransform: '',
					family: '',
					google: false,
					style: '',
					weight: '',
					variant: '',
					subset: '',
					loadGoogle: true,
				} ],
			},
			titlePaddingType: {
				type: 'string',
				default: 'px',
			},
			titlePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleTabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMarginType: {
				type: 'string',
				default: 'px',
			},
			titleMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleTabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			titleColor: {
				type: 'string',
				default: '',
			},
			titleHoverColor: {
				type: 'string',
				default: '',
			},
			titleMinHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			numberFont: {
				type: 'array',
				default: [ {
					size: [ '50', '', '' ],
					sizeType: 'px',
					lineHeight: [ '', '', '' ],
					lineType: 'px',
					letterSpacing: '',
					textTransform: '',
					family: '',
					google: false,
					style: '',
					weight: '',
					variant: '',
					subset: '',
					loadGoogle: true,
				} ],
			},
			numberPaddingType: {
				type: 'string',
				default: 'px',
			},
			numberPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberTabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMarginType: {
				type: 'string',
				default: 'px',
			},
			numberMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberTabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			numberColor: {
				type: 'string',
				default: '',
			},
			numberHoverColor: {
				type: 'string',
				default: '',
			},
			numberMinHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			start: {
				type: 'number',
				default: 0
			},
			end: {
				type: 'number',
				default: 100
			},
			prefix: {
				type: 'string',
				default: '',
			},
			suffix: {
				type: 'string',
				default: '',
			},
			duration: {
				type: 'number',
				default: 2.5,
			},
			separator: {
				type: 'boolean',
				default: false,
			}
		},
		save: ( { attributes } ) => {
			const {
				uniqueID,
				title,
				start,
				end,
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
					data-start={start}
					data-end={end}
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
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			title: {
				type: 'string',
				default: '',
			},
			displayTitle: {
				type: 'boolean',
				default: true,
			},
			titleFont: {
				type: 'array',
				default: [ {
					level: 4,
					htmlTag: 'div',
					size: [ '', '', '' ],
					sizeType: 'px',
					lineHeight: [ '', '', '' ],
					lineType: '',
					letterSpacing: '',
					textTransform: '',
					family: '',
					google: false,
					style: '',
					weight: '',
					variant: '',
					subset: '',
					loadGoogle: true,
				} ],
			},
			titlePaddingType: {
				type: 'string',
				default: 'px',
			},
			titlePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleTabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMarginType: {
				type: 'string',
				default: 'px',
			},
			titleMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleTabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			titleColor: {
				type: 'string',
				default: '',
			},
			titleHoverColor: {
				type: 'string',
				default: '',
			},
			titleMinHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			numberFont: {
				type: 'array',
				default: [ {
					size: [ '50', '', '' ],
					sizeType: 'px',
					lineHeight: [ '', '', '' ],
					lineType: 'px',
					letterSpacing: '',
					textTransform: '',
					family: '',
					google: false,
					style: '',
					weight: '',
					variant: '',
					subset: '',
					loadGoogle: true,
				} ],
			},
			numberPaddingType: {
				type: 'string',
				default: 'px',
			},
			numberPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberTabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMarginType: {
				type: 'string',
				default: 'px',
			},
			numberMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberTabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			numberColor: {
				type: 'string',
				default: '',
			},
			numberHoverColor: {
				type: 'string',
				default: '',
			},
			numberMinHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			start: {
				type: 'number',
				default: 0
			},
			end: {
				type: 'number',
				default: 100
			},
			prefix: {
				type: 'string',
				default: '',
			},
			suffix: {
				type: 'string',
				default: '',
			},
			duration: {
				type: 'number',
				default: 2.5,
			},
			separator: {
				type: 'boolean',
				default: false,
			}
		},
		save: ( { attributes } ) => {
			const {
				uniqueID,
					title,
					start,
					end,
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
					data-start={start}
					data-end={end}
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
	},
	{
		attributes: {
			uniqueID: {
				type: 'string',
				default: '',
			},
			title: {
				type: 'string',
				default: '',
			},
			displayTitle: {
				type: 'boolean',
				default: true,
			},
			titleFont: {
				type: 'array',
				default: [ {
					level: 4,
					htmlTag: 'div',
					size: [ '', '', '' ],
					sizeType: 'px',
					lineHeight: [ '', '', '' ],
					lineType: 'px',
					letterSpacing: '',
					textTransform: '',
					family: '',
					google: false,
					style: '',
					weight: '',
					variant: '',
					subset: '',
					loadGoogle: true,
				} ],
			},
			titlePaddingType: {
				type: 'string',
				default: 'px',
			},
			titlePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleTabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMarginType: {
				type: 'string',
				default: 'px',
			},
			titleMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleTabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleMobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			titleAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			titleColor: {
				type: 'string',
				default: '',
			},
			titleHoverColor: {
				type: 'string',
				default: '',
			},
			titleMinHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			numberFont: {
				type: 'array',
				default: [ {
					size: [ '50', '', '' ],
					sizeType: 'px',
					lineHeight: [ '', '', '' ],
					lineType: 'px',
					letterSpacing: '',
					textTransform: '',
					family: '',
					google: false,
					style: '',
					weight: '',
					variant: '',
					subset: '',
					loadGoogle: true,
				} ],
			},
			numberPaddingType: {
				type: 'string',
				default: 'px',
			},
			numberPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberTabletPadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMobilePadding: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMarginType: {
				type: 'string',
				default: 'px',
			},
			numberMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberTabletMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberMobileMargin: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			numberAlign: {
				type: 'array',
				default: [ '', '', '' ],
			},
			numberColor: {
				type: 'string',
				default: '',
			},
			numberHoverColor: {
				type: 'string',
				default: '',
			},
			numberMinHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			start: {
				type: 'number',
				default: 0
			},
			end: {
				type: 'number',
				default: 100
			},
			prefix: {
				type: 'string',
				default: '',
			},
			suffix: {
				type: 'string',
				default: '',
			},
			duration: {
				type: 'number',
				default: 2.5,
			},
			separator: {
				type: 'boolean',
				default: false,
			}
		},
		save: ( { attributes } ) => {
			const {
				uniqueID,
				title,
				start,
				end,
				prefix,
				suffix,
				duration,
				separator,
				titleFont,
				displayTitle,
			} = attributes
			const classes = classnames( {
				[ `kb-count-up-${ uniqueID }` ]: uniqueID,
				'kb-count-up': true
			} );
			const tagName = titleFont[ 0 ].htmlTag && titleFont[ 0 ].htmlTag !== 'heading' ? titleFont[ 0 ].htmlTag : 'h' + titleFont[ 0 ].level;
			return (
				<div
					className={ classes }
					data-start={ start }
					data-end={ end }
					data-prefix={ prefix }
					data-suffix={ suffix }
					data-duration={ duration }
					data-separator={ separator }
				>
					<div className={ 'kb-count-up-process kb-count-up-number' } />
					{ title && displayTitle && (
						<RichText.Content
							tagName={ tagName }
							className={ 'kb-count-up-title' }
							value={ title }
						/>
					) }
				</div>
			);
		}
	}
];

