/**
 * BLOCK: Kadence Count Up
 */

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	getPreviewSize,
	KadenceColorOutput,
	setBlockDefaults,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	uniqueIdHelper,
	getFontSizeOptionOutput,
} from '@kadence/helpers';
import { WebfontLoader, SpacingVisualizer, CopyPasteAttributes } from '@kadence/components';

/**
 * Import External
 */
import CountUp from 'react-countup';
import classnames from 'classnames';
import metadata from './block.json';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { RichText, useBlockProps, BlockControls } from '@wordpress/block-editor';
import { useEffect, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Build the count up edit
 */
function KadenceCounterUp(props) {
	const { clientId, attributes, className, isSelected, setAttributes } = props;

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
		displayTitle,
		titleFont,
		titleAlign,
		titleColor,
		titleMinHeight,
		numberFont,
		numberAlign,
		numberColor,
		numberMinHeight,
		numberPadding,
		numberMobilePadding,
		numberMobileMargin,
		numberTabletMargin,
		numberTabletPadding,
		numberMargin,
		numberPaddingType,
		numberMarginType,
		titlePadding,
		titleMobilePadding,
		titleMobileMargin,
		titleTabletMargin,
		titleTabletPadding,
		titleMargin,
		titlePaddingType,
		titleMarginType,
		decimal,
		decimalSpaces,
	} = attributes;

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	uniqueIdHelper(props);

	useEffect(() => {
		setBlockDefaults('kadence/countup', attributes);
	}, []);

	const TitleTagName =
		titleFont[0].htmlTag && titleFont[0].htmlTag !== 'heading' ? titleFont[0].htmlTag : 'h' + titleFont[0].level;

	const gconfig = {
		google: {
			families: [titleFont[0].family + (titleFont[0].variant ? ':' + titleFont[0].variant : '')],
		},
	};
	const config = titleFont[0].google ? gconfig : '';
	const ngconfig = {
		google: {
			families: [numberFont[0].family + (numberFont[0].variant ? ':' + numberFont[0].variant : '')],
		},
	};
	const nconfig = numberFont[0].google ? ngconfig : '';

	const previewTitleAlign = getPreviewSize(
		previewDevice,
		undefined !== titleAlign[0] ? titleAlign[0] : '',
		undefined !== titleAlign[1] ? titleAlign[1] : '',
		undefined !== titleAlign[2] ? titleAlign[2] : ''
	);
	const previewNumberAlign = getPreviewSize(
		previewDevice,
		undefined !== numberAlign[0] ? numberAlign[0] : '',
		undefined !== numberAlign[1] ? numberAlign[1] : '',
		undefined !== numberAlign[2] ? numberAlign[2] : ''
	);

	const previewNumberMarginTop = getPreviewSize(
		previewDevice,
		undefined !== numberMargin && undefined !== numberMargin[0] ? numberMargin[0] : '',
		undefined !== numberTabletMargin && undefined !== numberTabletMargin[0] ? numberTabletMargin[0] : '',
		undefined !== numberMobileMargin && undefined !== numberMobileMargin[0] ? numberMobileMargin[0] : ''
	);
	const previewNumberMarginRight = getPreviewSize(
		previewDevice,
		undefined !== numberMargin && undefined !== numberMargin[1] ? numberMargin[1] : '',
		undefined !== numberTabletMargin && undefined !== numberTabletMargin[1] ? numberTabletMargin[1] : '',
		undefined !== numberMobileMargin && undefined !== numberMobileMargin[1] ? numberMobileMargin[1] : ''
	);
	const previewNumberMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== numberMargin && undefined !== numberMargin[2] ? numberMargin[2] : '',
		undefined !== numberTabletMargin && undefined !== numberTabletMargin[2] ? numberTabletMargin[2] : '',
		undefined !== numberMobileMargin && undefined !== numberMobileMargin[2] ? numberMobileMargin[2] : ''
	);
	const previewNumberMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== numberMargin && undefined !== numberMargin[3] ? numberMargin[3] : '',
		undefined !== numberTabletMargin && undefined !== numberTabletMargin[3] ? numberTabletMargin[3] : '',
		undefined !== numberMobileMargin && undefined !== numberMobileMargin[3] ? numberMobileMargin[3] : ''
	);

	const previewNumberPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== numberPadding && undefined !== numberPadding[0] ? numberPadding[0] : '',
		undefined !== numberTabletPadding && undefined !== numberTabletPadding[0] ? numberTabletPadding[0] : '',
		undefined !== numberMobilePadding && undefined !== numberMobilePadding[0] ? numberMobilePadding[0] : ''
	);
	const previewNumberPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== numberPadding && undefined !== numberPadding[1] ? numberPadding[1] : '',
		undefined !== numberTabletPadding && undefined !== numberTabletPadding[1] ? numberTabletPadding[1] : '',
		undefined !== numberMobilePadding && undefined !== numberMobilePadding[1] ? numberMobilePadding[1] : ''
	);
	const previewNumberPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== numberPadding && undefined !== numberPadding[2] ? numberPadding[2] : '',
		undefined !== numberTabletPadding && undefined !== numberTabletPadding[2] ? numberTabletPadding[2] : '',
		undefined !== numberMobilePadding && undefined !== numberMobilePadding[2] ? numberMobilePadding[2] : ''
	);
	const previewNumberPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== numberPadding && undefined !== numberPadding[3] ? numberPadding[3] : '',
		undefined !== numberTabletPadding && undefined !== numberTabletPadding[3] ? numberTabletPadding[3] : '',
		undefined !== numberMobilePadding && undefined !== numberMobilePadding[3] ? numberMobilePadding[3] : ''
	);

	const previewTitleMarginTop = getPreviewSize(
		previewDevice,
		undefined !== titleMargin && undefined !== titleMargin[0] ? titleMargin[0] : '',
		undefined !== titleTabletMargin && undefined !== titleTabletMargin[0] ? titleTabletMargin[0] : '',
		undefined !== titleMobileMargin && undefined !== titleMobileMargin[0] ? titleMobileMargin[0] : ''
	);
	const previewTitleMarginRight = getPreviewSize(
		previewDevice,
		undefined !== titleMargin && undefined !== titleMargin[1] ? titleMargin[1] : '',
		undefined !== titleTabletMargin && undefined !== titleTabletMargin[1] ? titleTabletMargin[1] : '',
		undefined !== titleMobileMargin && undefined !== titleMobileMargin[1] ? titleMobileMargin[1] : ''
	);
	const previewTitleMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== titleMargin && undefined !== titleMargin[2] ? titleMargin[2] : '',
		undefined !== titleTabletMargin && undefined !== titleTabletMargin[2] ? titleTabletMargin[2] : '',
		undefined !== titleMobileMargin && undefined !== titleMobileMargin[2] ? titleMobileMargin[2] : ''
	);
	const previewTitleMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== titleMargin && undefined !== titleMargin[3] ? titleMargin[3] : '',
		undefined !== titleTabletMargin && undefined !== titleTabletMargin[3] ? titleTabletMargin[3] : '',
		undefined !== titleMobileMargin && undefined !== titleMobileMargin[3] ? titleMobileMargin[3] : ''
	);
	const previewTitlePaddingTop = getPreviewSize(
		previewDevice,
		undefined !== titlePadding && undefined !== titlePadding[0] ? titlePadding[0] : '',
		undefined !== titleTabletPadding && undefined !== titleTabletPadding[0] ? titleTabletPadding[0] : '',
		undefined !== titleMobilePadding && undefined !== titleMobilePadding[0] ? titleMobilePadding[0] : ''
	);
	const previewTitlePaddingRight = getPreviewSize(
		previewDevice,
		undefined !== titlePadding && undefined !== titlePadding[1] ? titlePadding[1] : '',
		undefined !== titleTabletPadding && undefined !== titleTabletPadding[1] ? titleTabletPadding[1] : '',
		undefined !== titleMobilePadding && undefined !== titleMobilePadding[1] ? titleMobilePadding[1] : ''
	);
	const previewTitlePaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== titlePadding && undefined !== titlePadding[2] ? titlePadding[2] : '',
		undefined !== titleTabletPadding && undefined !== titleTabletPadding[2] ? titleTabletPadding[2] : '',
		undefined !== titleMobilePadding && undefined !== titleMobilePadding[2] ? titleMobilePadding[2] : ''
	);
	const previewTitlePaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== titlePadding && undefined !== titlePadding[3] ? titlePadding[3] : '',
		undefined !== titleTabletPadding && undefined !== titleTabletPadding[3] ? titleTabletPadding[3] : '',
		undefined !== titleMobilePadding && undefined !== titleMobilePadding[3] ? titleMobilePadding[3] : ''
	);

	const previewNumberFontSize = getPreviewSize(
		previewDevice,
		undefined !== numberFont[0].size[0] ? numberFont[0].size[0] : '',
		undefined !== numberFont[0].size[1] ? numberFont[0].size[1] : '',
		undefined !== numberFont[0].size[2] ? numberFont[0].size[2] : ''
	);

	const previewTitleFontSize = getPreviewSize(
		previewDevice,
		undefined !== titleFont[0].size[0] ? titleFont[0].size[0] : '',
		undefined !== titleFont[0].size[1] ? titleFont[0].size[1] : '',
		undefined !== titleFont[0].size[2] ? titleFont[0].size[2] : ''
	);

	const previewNumberLineHeight = getPreviewSize(
		previewDevice,
		undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[0]
			? numberFont[0].lineHeight[0]
			: '',
		undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[1]
			? numberFont[0].lineHeight[1]
			: '',
		undefined !== numberFont[0].lineHeight && undefined !== numberFont[0].lineHeight[2]
			? numberFont[0].lineHeight[2]
			: ''
	);

	const previewTitleLineHeight = getPreviewSize(
		previewDevice,
		undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[0]
			? titleFont[0].lineHeight[0]
			: '',
		undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[1]
			? titleFont[0].lineHeight[1]
			: '',
		undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[2]
			? titleFont[0].lineHeight[2]
			: ''
	);

	const numberPaddingMouseOver = mouseOverVisualizer();
	const numberMarginMouseOver = mouseOverVisualizer();
	const titlePaddingMouseOver = mouseOverVisualizer();
	const titleMarginMouseOver = mouseOverVisualizer();

	const classes = classnames({
		[`kb-count-up-${uniqueID}`]: uniqueID,
		'kb-count-up': true,
	});
	let theSeparator = separator === true ? ',' : separator;
	theSeparator = theSeparator === false ? '' : theSeparator;

	const blockProps = useBlockProps({});

	return (
		<div {...blockProps}>
			{isSelected && (
				<>
					<BlockControls>
						<CopyPasteAttributes
							attributes={attributes}
							excludedAttrs={['start', 'end', 'endDecimal', 'title', 'suffix', 'prefix']}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
						/>
					</BlockControls>
					<Inspector
						setAttributes={setAttributes}
						attributes={attributes}
						numberPaddingMouseOver={numberPaddingMouseOver}
						numberMarginMouseOver={numberMarginMouseOver}
						titlePaddingMouseOver={titlePaddingMouseOver}
						titleMarginMouseOver={titleMarginMouseOver}
					/>
				</>
			)}

			{displayTitle && titleFont[0].google && <WebfontLoader config={config} />}

			{numberFont[0].google && <WebfontLoader config={nconfig} />}
			<div className={classes}>
				<div
					className={'kb-count-up-number'}
					style={{
						fontWeight: numberFont[0].weight,
						fontStyle: numberFont[0].style,
						color: KadenceColorOutput(numberColor),
						fontSize: getFontSizeOptionOutput(previewNumberFontSize, numberFont[0].sizeType),
						lineHeight: previewNumberLineHeight
							? previewNumberLineHeight + numberFont[0].lineType
							: undefined,
						letterSpacing: numberFont[0].letterSpacing + 'px',
						fontFamily: numberFont[0].family ? numberFont[0].family : '',
						minHeight:
							undefined !== numberMinHeight && undefined !== numberMinHeight[0]
								? numberMinHeight[0] + 'px'
								: undefined,
						textAlign: previewNumberAlign,
						paddingTop:
							'' !== previewNumberPaddingTop
								? getSpacingOptionOutput(previewNumberPaddingTop, numberPaddingType)
								: undefined,
						paddingRight:
							'' !== previewNumberPaddingRight
								? getSpacingOptionOutput(previewNumberPaddingRight, numberPaddingType)
								: undefined,
						paddingBottom:
							'' !== previewNumberPaddingBottom
								? getSpacingOptionOutput(previewNumberPaddingBottom, numberPaddingType)
								: undefined,
						paddingLeft:
							'' !== previewNumberPaddingLeft
								? getSpacingOptionOutput(previewNumberPaddingLeft, numberPaddingType)
								: undefined,
						marginTop: previewNumberMarginTop
							? getSpacingOptionOutput(previewNumberMarginTop, numberMarginType)
							: undefined,
						marginRight: previewNumberMarginRight
							? getSpacingOptionOutput(previewNumberMarginRight, numberMarginType)
							: undefined,
						marginBottom: previewNumberMarginBottom
							? getSpacingOptionOutput(previewNumberMarginBottom, numberMarginType)
							: undefined,
						marginLeft: previewNumberMarginLeft
							? getSpacingOptionOutput(previewNumberMarginLeft, numberMarginType)
							: undefined,
					}}
				>
					<CountUp
						start={start}
						end={end}
						duration={duration}
						separator={theSeparator}
						decimal={decimal ? decimal : undefined}
						decimals={decimal && decimalSpaces ? decimalSpaces : undefined}
						prefix={prefix}
						suffix={suffix}
					/>
					<SpacingVisualizer
						// style={ {
						// 	marginLeft: ( undefined !== previewNumberMarginLeft ? getSpacingOptionOutput( previewNumberMarginLeft, numberMarginType ) : undefined ),
						// 	marginRight: ( undefined !== previewNumberMarginRight ? getSpacingOptionOutput( previewNumberMarginRight, numberMarginType ) : undefined ),
						// 	marginTop: ( undefined !== previewNumberMarginTop ? getSpacingOptionOutput( previewNumberMarginTop, numberMarginType ) : undefined ),
						// 	marginBottom: ( undefined !== previewNumberMarginBottom ? getSpacingOptionOutput( previewNumberMarginBottom, numberMarginType ) : undefined ),
						// } }
						type="outside"
						forceShow={numberMarginMouseOver.isMouseOver}
						spacing={[
							getSpacingOptionOutput(previewNumberMarginTop, numberMarginType),
							getSpacingOptionOutput(previewNumberMarginRight, numberMarginType),
							getSpacingOptionOutput(previewNumberMarginBottom, numberMarginType),
							getSpacingOptionOutput(previewNumberMarginLeft, numberMarginType),
						]}
					/>
					<SpacingVisualizer
						type="inside"
						forceShow={numberPaddingMouseOver.isMouseOver}
						spacing={[
							getSpacingOptionOutput(previewNumberPaddingTop, numberPaddingType),
							getSpacingOptionOutput(previewNumberPaddingRight, numberPaddingType),
							getSpacingOptionOutput(previewNumberPaddingBottom, numberPaddingType),
							getSpacingOptionOutput(previewNumberPaddingLeft, numberPaddingType),
						]}
					/>
				</div>

				{displayTitle && (
					<TitleTagName
						className={'kb-count-up-wrap'}
						style={{
							position: 'relative',
							paddingTop:
								'' !== previewTitlePaddingTop
									? getSpacingOptionOutput(previewTitlePaddingTop, titlePaddingType)
									: undefined,
							paddingRight:
								'' !== previewTitlePaddingRight
									? getSpacingOptionOutput(previewTitlePaddingRight, titlePaddingType)
									: undefined,
							paddingBottom:
								'' !== previewTitlePaddingBottom
									? getSpacingOptionOutput(previewTitlePaddingBottom, titlePaddingType)
									: undefined,
							paddingLeft:
								'' !== previewTitlePaddingLeft
									? getSpacingOptionOutput(previewTitlePaddingLeft, titlePaddingType)
									: undefined,
							marginTop: previewTitleMarginTop
								? getSpacingOptionOutput(previewTitleMarginTop, titleMarginType)
								: undefined,
							marginRight: previewTitleMarginRight
								? getSpacingOptionOutput(previewTitleMarginRight, titleMarginType)
								: undefined,
							marginBottom: previewTitleMarginBottom
								? getSpacingOptionOutput(previewTitleMarginBottom, titleMarginType)
								: undefined,
							marginLeft: previewTitleMarginLeft
								? getSpacingOptionOutput(previewTitleMarginLeft, titleMarginType)
								: undefined,
							textTransform: titleFont[0].textTransform ? titleFont[0].textTransform : undefined,
						}}
					>
						<RichText
							tagName={'span'}
							className={'kb-count-up-title'}
							value={title}
							onChange={(content) => setAttributes({ title: content })}
							placeholder={__('Type Here…', 'kadence-blocks')}
							style={{
								display: 'block',
								fontWeight: titleFont[0].weight,
								fontStyle: titleFont[0].style,
								color: KadenceColorOutput(titleColor),
								fontSize: getFontSizeOptionOutput(previewTitleFontSize, titleFont[0].sizeType),
								lineHeight: previewTitleLineHeight
									? previewTitleLineHeight + titleFont[0].lineType
									: undefined,
								letterSpacing: titleFont[0].letterSpacing + 'px',
								fontFamily: titleFont[0].family ? titleFont[0].family : '',
								minHeight:
									undefined !== titleMinHeight && undefined !== titleMinHeight[0]
										? titleMinHeight[0] + 'px'
										: undefined,
								textTransform: titleFont[0].textTransform ? titleFont[0].textTransform : undefined,
								textAlign: previewTitleAlign,
							}}
						/>
						<SpacingVisualizer
							type="outside"
							forceShow={titleMarginMouseOver.isMouseOver}
							spacing={[
								getSpacingOptionOutput(previewTitleMarginTop, numberMarginType),
								getSpacingOptionOutput(previewTitleMarginRight, numberMarginType),
								getSpacingOptionOutput(previewTitleMarginBottom, numberMarginType),
								getSpacingOptionOutput(previewTitleMarginLeft, numberMarginType),
							]}
						/>
						<SpacingVisualizer
							type="inside"
							forceShow={titlePaddingMouseOver.isMouseOver}
							spacing={[
								getSpacingOptionOutput(previewTitlePaddingTop, numberPaddingType),
								getSpacingOptionOutput(previewTitlePaddingRight, numberPaddingType),
								getSpacingOptionOutput(previewTitlePaddingBottom, numberPaddingType),
								getSpacingOptionOutput(previewTitlePaddingLeft, numberPaddingType),
							]}
						/>
					</TitleTagName>
				)}
			</div>
		</div>
	);
}

export default KadenceCounterUp;
