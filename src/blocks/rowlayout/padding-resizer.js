import { ResizableBox } from '@wordpress/components';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { PADDING_RESIZE_MAP } from './constants';
import { getSpacingOptionName, getSpacingOptionSize, getSpacingNameFromSize, getSpacingValueFromSize } from './utils';
import { getPreviewSize, showSettings } from '@kadence/helpers';
export default function PaddingResizer({
	previewDevice = 'Desktop',
	edge = 'top',
	attributes,
	setAttributes,
	toggleSelection,
	finishedResizing,
	isPreviewMode,
}) {
	const {
		leftPadding,
		rightPadding,
		topPadding,
		bottomPadding,
		tabletPadding,
		topPaddingM,
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
		maxWidthUnit,
		maxWidth,
		padding,
		mobilePadding,
		templateLock,
	} = attributes;
	const index = edge === 'top' ? 0 : 2;
	const editorDocument = document.querySelector('iframe[name="editor-canvas"]')?.contentWindow.document || document;
	const previewPaddingLabel = getPreviewSize(
		previewDevice,
		undefined !== padding && undefined !== padding[index]
			? getSpacingOptionName(padding[index], paddingUnit)
			: __('Unset', 'kadence-blocks'),
		undefined !== tabletPadding && undefined !== tabletPadding[index] && '' !== tabletPadding[index]
			? getSpacingOptionName(tabletPadding[index])
			: '',
		undefined !== mobilePadding && undefined !== mobilePadding[index] && '' !== mobilePadding[index]
			? getSpacingOptionName(mobilePadding[index])
			: ''
	);

	const previewPadding = getPreviewSize(
		previewDevice,
		undefined !== padding && undefined !== padding[index] ? getSpacingOptionSize(padding[index]) : '',
		undefined !== tabletPadding && undefined !== tabletPadding[index] && '' !== tabletPadding[index]
			? getSpacingOptionSize(tabletPadding[index])
			: '',
		undefined !== mobilePadding && undefined !== mobilePadding[index] && '' !== mobilePadding[index]
			? getSpacingOptionSize(mobilePadding[index])
			: ''
	);
	let paddingType = 'variable';
	if (padding?.[index] !== undefined && Number(padding?.[index]) === parseFloat(padding?.[index])) {
		paddingType = 'normal';
	}
	const previewPaddingUnit = paddingUnit ? paddingUnit : 'px';
	return (
		<>
			{showSettings('allSettings', 'kadence/rowlayout') &&
				showSettings('paddingMargin', 'kadence/rowlayout') &&
				!isPreviewMode &&
				'normal' === paddingType &&
				'px' === previewPaddingUnit &&
				'contentOnly' !== templateLock && (
					<ResizableBox
						size={{
							height: previewPadding,
						}}
						minHeight="0"
						handleClasses={{
							top: 'wp-block-kadence-rowlayout-handler-top',
							bottom: 'wp-block-kadence-rowlayout-handler-bottom',
						}}
						enable={{
							top: false,
							right: false,
							bottom: true,
							left: false,
							topRight: false,
							bottomRight: false,
							bottomLeft: false,
							topLeft: false,
						}}
						className={`kt-${edge}-padding-resize kt-padding-resize-box`}
						onResize={(event, direction, elt, delta) => {
							event.preventDefault();
							editorDocument.getElementById('row-' + edge + '-' + uniqueID).innerHTML =
								parseInt(previewPadding + delta.height, 10) + 'px';
						}}
						onResizeStop={(event, direction, elt, delta) => {
							finishedResizing(true);
							if ('Mobile' === previewDevice) {
								if (edge === 'top') {
									setAttributes({
										mobilePadding: [
											parseInt(previewPadding + delta.height, 10),
											mobilePadding ? mobilePadding[1] : '',
											mobilePadding ? mobilePadding[2] : '',
											mobilePadding ? mobilePadding[3] : '',
										],
									});
								} else {
									setAttributes({
										mobilePadding: [
											mobilePadding ? mobilePadding[0] : '',
											mobilePadding ? mobilePadding[1] : '',
											parseInt(previewPadding + delta.height, 10),
											mobilePadding ? mobilePadding[3] : '',
										],
									});
								}
							} else if ('Tablet' === previewDevice) {
								if (edge === 'top') {
									setAttributes({
										tabletPadding: [
											parseInt(previewPadding + delta.height, 10),
											tabletPadding ? tabletPadding[1] : '',
											tabletPadding ? tabletPadding[2] : '',
											tabletPadding ? tabletPadding[3] : '',
										],
									});
								} else {
									setAttributes({
										tabletPadding: [
											tabletPadding ? tabletPadding[0] : '',
											tabletPadding ? tabletPadding[1] : '',
											parseInt(previewPadding + delta.height, 10),
											tabletPadding ? tabletPadding[3] : '',
										],
									});
								}
							} else if (edge === 'top') {
								setAttributes({
									padding: [
										parseInt(previewPadding + delta.height, 10),
										padding ? padding[1] : '',
										padding ? padding[2] : '',
										padding ? padding[3] : '',
									],
								});
							} else {
								setAttributes({
									padding: [
										padding ? padding[0] : '',
										padding ? padding[1] : '',
										parseInt(previewPadding + delta.height, 10),
										padding ? padding[3] : '',
									],
								});
							}
							// This is legacy code from core, removing does not seem to affect anything. Was causing an issue with inner blocks losing context.
							// toggleSelection(true);
						}}
						onResizeStart={() => {
							// This is legacy code from core, removing does not seem to affect anything. Was causing an issue with inner blocks losing context.
							// toggleSelection(false);
						}}
					>
						{uniqueID && (
							<div className="kt-row-padding">
								<span id={`row-${edge}-${uniqueID}`}>{previewPadding + 'px'}</span>
							</div>
						)}
					</ResizableBox>
				)}
			{showSettings('allSettings', 'kadence/rowlayout') &&
				showSettings('paddingMargin', 'kadence/rowlayout') &&
				!isPreviewMode &&
				'variable' === paddingType &&
				'contentOnly' !== templateLock && (
					<ResizableBox
						size={{
							height: previewPadding,
						}}
						minHeight="0"
						maxHeight={PADDING_RESIZE_MAP[PADDING_RESIZE_MAP.length - 1] + 'px'}
						handleClasses={{
							top: 'wp-block-kadence-rowlayout-handler-top',
							bottom: 'wp-block-kadence-rowlayout-handler-bottom',
						}}
						enable={{
							top: false,
							right: false,
							bottom: true,
							left: false,
							topRight: false,
							bottomRight: false,
							bottomLeft: false,
							topLeft: false,
						}}
						snap={{
							y: PADDING_RESIZE_MAP,
						}}
						snapGap={16}
						grid={[1, 8]}
						className={`kt-${edge}-padding-resize kt-padding-resize-box`}
						onResize={(event, direction, elt, delta) => {
							event.preventDefault();
							const name = getSpacingNameFromSize(parseInt(previewPadding + delta.height, 10));
							editorDocument.getElementById('row-' + edge + '-' + uniqueID).innerHTML = name;
						}}
						onResizeStop={(event, direction, elt, delta) => {
							finishedResizing(true);
							const size = getSpacingValueFromSize(parseInt(previewPadding + delta.height, 10));
							if ('Mobile' === previewDevice) {
								if (edge === 'top') {
									setAttributes({
										mobilePadding: [
											size,
											mobilePadding ? mobilePadding[1] : '',
											mobilePadding ? mobilePadding[2] : '',
											mobilePadding ? mobilePadding[3] : '',
										],
									});
								} else {
									setAttributes({
										mobilePadding: [
											mobilePadding ? mobilePadding[0] : '',
											mobilePadding ? mobilePadding[1] : '',
											size,
											mobilePadding ? mobilePadding[3] : '',
										],
									});
								}
							} else if ('Tablet' === previewDevice) {
								if (edge === 'top') {
									setAttributes({
										tabletPadding: [
											size,
											tabletPadding ? tabletPadding[1] : '',
											tabletPadding ? tabletPadding[2] : '',
											tabletPadding ? tabletPadding[3] : '',
										],
									});
								} else {
									setAttributes({
										tabletPadding: [
											tabletPadding ? tabletPadding[0] : '',
											tabletPadding ? tabletPadding[1] : '',
											size,
											tabletPadding ? tabletPadding[3] : '',
										],
									});
								}
							} else if (edge === 'top') {
								setAttributes({
									padding: [
										size,
										padding ? padding[1] : '',
										padding ? padding[2] : '',
										padding ? padding[3] : '',
									],
								});
							} else {
								setAttributes({
									padding: [
										padding ? padding[0] : '',
										padding ? padding[1] : '',
										size,
										padding ? padding[3] : '',
									],
								});
							}
							toggleSelection(true);
						}}
						onResizeStart={() => {
							toggleSelection(false);
						}}
						axis="y"
					>
						{uniqueID && (
							<div className="kt-row-padding">
								<span id={`row-${edge}-${uniqueID}`}>{previewPaddingLabel}</span>
							</div>
						)}
					</ResizableBox>
				)}
			{(!showSettings('allSettings', 'kadence/rowlayout') ||
				!showSettings('paddingMargin', 'kadence/rowlayout') ||
				isPreviewMode ||
				'contentOnly' === templateLock ||
				('normal' === paddingType && paddingUnit && 'px' !== paddingUnit)) && (
				<>
					{uniqueID && (
						<div
							className="kt-row-padding kb-static-row-padding"
							style={{
								paddingTop: previewPadding + ('variable' !== paddingType ? previewPaddingUnit : 'px'),
							}}
						>
							<div className={'kb-row-padding-container'}>
								<span id={`row-${edge}-${uniqueID}`}>
									{'variable' === paddingType
										? previewPaddingLabel
										: previewPadding + previewPaddingUnit}
								</span>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}
