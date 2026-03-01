import classnames from 'classnames';
import { Button, Tooltip, ResizableBox } from '@wordpress/components';
import { getGutterPercentUnit, getGutterTotal, getPreviewGutterSize } from './utils';
import { getSpacingOptionOutput } from '@kadence/helpers';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, Fragment } from '@wordpress/element';
export default function GridVisualizer({ setAttributes, attributes }) {
	const {
		padding,
		paddingUnit,
		firstColumnWidth,
		columns,
		columnsUnlocked,
		secondColumnWidth,
		uniqueID,
		columnGutter,
		customGutter,
		gutterType,
		colLayout,
		bgColor,
		bgImg,
		gradient,
		overlay,
		overlayGradient,
		overlayBgImg,
		inheritMaxWidth,
		maxWidth,
		maxWidthUnit,
	} = attributes;
	const currentGutter = getPreviewGutterSize('Desktop', columnGutter, customGutter, gutterType);
	const currentGutterTotal = getGutterTotal(currentGutter, columns);
	const previewMaxWidth = undefined !== maxWidth ? maxWidth : '';
	const gutterAdjuster = `0px`;
	const innerResizeClasses = classnames({
		'kt-resizeable-column-container': true,
		'kb-grid-align-display-wrap': true,
		[`kt-resizeable-column-container${uniqueID}`]: uniqueID,
		'kb-theme-content-width': inheritMaxWidth,
	});
	let fallbackPadding =
		bgColor || bgImg || gradient || overlay || overlayGradient || overlayBgImg
			? 'var(--global-row-edge-sm, 15px)'
			: '0px';
	if (inheritMaxWidth) {
		fallbackPadding = 'var(--global-row-edge-theme, 15px)';
	}
	const fallbackVerticalPadding = 'var(--global-row-spacing-sm, 25px)';
	const previewPaddingRight =
		undefined !== padding && undefined !== padding[1]
			? getSpacingOptionOutput(padding[1], paddingUnit ? paddingUnit : 'px')
			: undefined;
	const previewPaddingLeft =
		undefined !== padding && undefined !== padding[3]
			? getSpacingOptionOutput(padding[3], paddingUnit ? paddingUnit : 'px')
			: undefined;
	const previewPaddingTop =
		undefined !== padding && undefined !== padding[0]
			? getSpacingOptionOutput(padding[0], paddingUnit ? paddingUnit : 'px')
			: undefined;
	const previewPaddingBottom =
		undefined !== padding && undefined !== padding[2]
			? getSpacingOptionOutput(padding[2], paddingUnit ? paddingUnit : 'px')
			: undefined;
	const editorDocument = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow.document || document;
	return (
		<div
			className={innerResizeClasses}
			style={{
				paddingLeft: previewPaddingLeft ? previewPaddingLeft : fallbackPadding,
				paddingRight: previewPaddingRight ? previewPaddingRight : fallbackPadding,
				marginLeft: 'auto',
				marginRight: 'auto',
				paddingTop: previewPaddingTop ? previewPaddingTop : fallbackVerticalPadding,
				paddingBottom: previewPaddingBottom ? previewPaddingBottom : fallbackVerticalPadding,
				maxWidth:
					!inheritMaxWidth && previewMaxWidth
						? previewMaxWidth + (maxWidthUnit ? maxWidthUnit : 'px')
						: undefined,
			}}
		>
			<div
				className="kb-grid-align-display"
				style={{
					left: previewPaddingLeft ? previewPaddingLeft : fallbackPadding,
					right: previewPaddingRight ? previewPaddingRight : fallbackPadding,
					top: previewPaddingTop ? previewPaddingTop : fallbackVerticalPadding,
					bottom: previewPaddingBottom ? previewPaddingBottom : fallbackVerticalPadding,
				}}
			>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
