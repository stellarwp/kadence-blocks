import { flow } from 'lodash';
import { __, sprintf } from '@wordpress/i18n';
import React, { useState, useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch, dispatch, select } from '@wordpress/data';
import { useBlockProps, BlockControls, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';
import metadata from './block.json';
import './editor.scss';
import { createBlock } from '@wordpress/blocks';

import {
	RangeControl,
	ToggleControl,
	SelectControl,
	Button,
	TextControl,
	__experimentalNumberControl as NumberControl,
	ResizableBox,
	ExternalLink,
	ToolbarDropdownMenu,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';

import {
	KadencePanelBody,
	InspectorControlTabs,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	CopyPasteAttributes,
	TypographyControls,
	HoverToggleControl,
	PopColorControl,
	ResponsiveBorderControl,
	ResponsiveRangeControls,
	ResponsiveAlignControls,
} from '@kadence/components';

import { uniqueIdHelper, getPreviewSize } from '@kadence/helpers';
import BackendStyles from './components/backend-styles';
import { applyFilters } from '@wordpress/hooks';
import { plus } from '@wordpress/icons';

const DEFAULT_PERCENT_WIDTH = 30;
const DEFAULT_PIXEL_WIDTH = 150;

const getColumnDefaults = () => ({
	useAuto: true,
	width: DEFAULT_PERCENT_WIDTH,
	unit: '%',
});
const createTableRow = () => createBlock('kadence/table-row', {});

export function Edit(props) {
	const { attributes, setAttributes, className, isSelected, clientId } = props;

	const {
		uniqueID,
		rows,
		columns,
		dataTypography,
		headerTypography,
		evenOddBackground,
		backgroundColorEven,
		backgroundColorOdd,
		backgroundHoverColorEven,
		backgroundHoverColorOdd,
		columnBackgrounds,
		columnBackgroundsHover,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderOnRowOnly,
		stickyFirstRow,
		stickyFirstColumn,
		maxWidth,
		maxWidthUnit,
		maxHeight,
		maxHeightUnit,
		cellPadding,
		mobileCellPadding,
		tabletCellPadding,
		cellPaddingType,
		textAlign,
		textAlignTablet,
		textAlignMobile,
		headerAlign,
		headerAlignTablet,
		headerAlignMobile,
		isFirstRowHeader,
		isFirstColumnHeader,
		columnSettings,
		overflowXScroll,
		rowMinHeight,
		tabletRowMinHeight,
		mobileRowMinHeight,
		rowMinHeightType,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		margin,
		tabletMargin,
		mobileMargin,
		marginType,
		enableCaption,
		caption,
	} = attributes;

	const { insertBlock } = useDispatch('core/block-editor');
	const { previewDevice, childSelected } = useSelect(
		(select) => {
			return {
				childSelected: select('core/block-editor').hasSelectedInnerBlock(clientId, true),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const [activeTab, setActiveTab] = useState('general');
	const [placeholderRows, setPlaceholderRows] = useState(4);
	const [placeholderColumns, setPlaceholderColumns] = useState(2);
	const [isResizing, setIsResizing] = useState(false);

	const nonTransAttrs = [];

	const classes = useMemo(
		() =>
			classnames(
				{
					'kb-table-container': true,
					[`kb-table-container${uniqueID}`]: uniqueID,
				},
				className
			),
		[uniqueID, className]
	);

	const blockProps = useBlockProps({
		className: classes,
	});

	uniqueIdHelper(props);

	const addRow = (position) => {
		let insertIndex;

		switch (position) {
			case 'top':
				insertIndex = 0;
				break;
			case 'bottom':
				insertIndex = undefined;
				break;
			default:
				return;
		}

		const newRow = createBlock('kadence/table-row', {});
		insertBlock(newRow, insertIndex, clientId, false);
	};

	const rowControls = [
		{
			title: __('Add Row at Top', 'kadence-blocks'),
			onClick: () => addRow('top'),
		},
		{
			title: __('Add Row at Bottom', 'kadence-blocks'),
			onClick: () => addRow('bottom'),
		},
	];

	const rowCount = select('core/block-editor').getBlocks(clientId);

	const adjustRows = (newRows) => {
		if (newRows > rowCount.length) {
			handleInsertRowBelow(9999);
		} else {
			handleDeleteLastRow();
		}
	};
	const updateColumnBackground = (index, color, isHover = false) => {
		const arrayToUpdate = isHover ? [...columnBackgroundsHover] : [...columnBackgrounds];
		if (color === '') {
			delete arrayToUpdate[index];
			arrayToUpdate.length = arrayToUpdate.length || index + 1;
		} else {
			arrayToUpdate[index] = color;
		}
		setAttributes({
			[isHover ? 'columnBackgroundsHover' : 'columnBackgrounds']: arrayToUpdate,
		});
	};

	const getColumnBackground = (index, isHover = false) => {
		const array = isHover ? columnBackgroundsHover : columnBackgrounds;
		return array && array[index] ? array[index] : '';
	};

	const innerBlockClassName = useMemo(
		() =>
			classnames(
				{
					'kb-table': true,
					[`kb-table${uniqueID}`]: uniqueID,
				},
				className
			),
		[uniqueID, className]
	);

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			className: innerBlockClassName,
			style: {},
		},
		{
			allowedBlocks: ['kadence/table-row'],
			renderAppender: false,
			templateInsertUpdatesSelection: false,
		}
	);

	const handleInsertRowBelow = (index) => {
		const { insertBlock } = dispatch('core/block-editor');
		const newRow = createTableRow();
		insertBlock(newRow, index + 1, clientId, false);
	};

	const handleDeleteLastRow = () => {
		const { removeBlock } = dispatch('core/block-editor');
		const blocks = select('core/block-editor').getBlocks(clientId);
		if (blocks.length > 1) {
			// Prevent deleting last row
			removeBlock(blocks[blocks.length - 1].clientId, false);
		}
	};

	const createTable = () => {
		setAttributes({
			columns: parseInt(placeholderColumns),
		});
		updateRowsColumns(placeholderRows);
	};

	const getColumnSetting = (index) => {
		const settings = columnSettings || [];
		return settings[index] || getColumnDefaults();
	};

	const updateColumnSetting = (index, updates) => {
		const newSettings = [...(columnSettings || [])];
		const currentSetting = getColumnSetting(index);

		// If we're changing units, update all columns
		if (updates.unit || updates.unitTablet || updates.unitMobile) {
			newSettings.forEach((setting, idx) => {
				if (setting) {
					newSettings[idx] = {
						...setting,
						...(updates.unit && { unit: updates.unit }),
						...(updates.unitTablet && { unitTablet: updates.unitTablet }),
						...(updates.unitMobile && { unitMobile: updates.unitMobile }),
					};
				}
			});

			// Fill in missing columns
			for (let i = 0; i < columns; i++) {
				if (!newSettings[i]) {
					newSettings[i] = {
						...getColumnDefaults(),
						...(updates.unit && { unit: updates.unit }),
						...(updates.unitTablet && { unitTablet: updates.unitTablet }),
						...(updates.unitMobile && { unitMobile: updates.unitMobile }),
					};
				}
			}
		} else {
			newSettings[index] = {
				...currentSetting,
				...updates,
			};
		}

		setAttributes({ columnSettings: newSettings });
	};

	const updateRowsColumns = (newRows) => {
		const blocks = select('core/block-editor').getBlocks(clientId);
		let newBlocks = [...blocks];

		const additionalRows = Array(newRows)
			.fill(null)
			.map(() => createTableRow());
		newBlocks = [...newBlocks, ...additionalRows];

		replaceInnerBlocks(clientId, newBlocks, false);
	};

	const saveDataTypography = (value) => {
		setAttributes({
			dataTypography: [{ ...dataTypography[0], ...value }, ...dataTypography.slice(1)],
		});
	};

	const saveHeaderTypography = (value) => {
		setAttributes({
			headerTypography: [{ ...headerTypography[0], ...value }, ...headerTypography.slice(1)],
		});
	};
	const previewColumnSettingUnit = getPreviewSize(
		previewDevice,
		columnSettings?.find((setting) => setting?.unit)?.unit,
		columnSettings?.find((setting) => setting?.unitTablet)?.unitTablet,
		columnSettings?.find((setting) => setting?.unitMobile)?.unitMobile
	);

	const StickyUpsell = (
		<>
			<KadencePanelBody
				title={__('Sticky Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'table-sticky-upsell'}
				proTag={true}
			>
				<div className="kb-pro-notice">
					<h2>{__('Sticky Rows & Columns Styles', 'kadence-blocks')} </h2>
					<p>
						{__(
							'Custmize your table with sticky rows and columns. This feature is available in the Pro version of Kadence Blocks.',
							'kadence-blocks'
						)}{' '}
					</p>
					<ExternalLink
						href={
							'https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=table'
						}
					>
						{__('Upgrade to Pro', 'kadence-blocks')}
					</ExternalLink>
				</div>
			</KadencePanelBody>
		</>
	);

	if (undefined === columns) {
		return (
			<div {...blockProps} style={{ backgroundColor: '#FFF', border: '0.5px solid #000', padding: '20px' }}>
				<h4 style={{ marginTop: '0', marginBottom: '15px' }}>{__('Table layout', 'kadence-blocks')}</h4>
				<div style={{ maxWidth: '350px' }}>
					<RangeControl
						label={__('Columns', 'kadence-blocks')}
						value={placeholderColumns}
						onChange={(value) => setPlaceholderColumns(value)}
						min={1}
						max={15}
					/>

					<RangeControl
						label={__('Rows', 'kadence-blocks')}
						value={placeholderRows}
						onChange={(value) => setPlaceholderRows(value)}
						min={1}
						max={100}
					/>

					<Button isPrimary style={{ marginTop: '10px' }} onClick={() => createTable()}>
						{__('Create Table', 'kadence-blocks')}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarDropdownMenu icon={plus} label={__('Add Row', 'kadence-blocks')}>
					{({ onClose }) => (
						<>
							<MenuGroup>
								{rowControls.map((control) => (
									<MenuItem key={control.title} onClick={flow(onClose, control.onClick)}>
										{control.title}
									</MenuItem>
								))}
							</MenuGroup>
						</>
					)}
				</ToolbarDropdownMenu>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/lottie'}>
				<InspectorControlTabs panelName={'lottie'} setActiveTab={setActiveTab} activeTab={activeTab} />

				{activeTab === 'general' && (
					<>
						<KadencePanelBody initialOpen={true} panelName={'tableStructure'} blockSlug={'kadence/table'}>
							<NumberControl
								label={__('Rows', 'kadence-blocks')}
								value={rowCount.length}
								onChange={(value) => adjustRows(parseInt(value))}
								min={1}
								max={200}
								style={{ marginTop: '15px' }}
							/>
							<NumberControl
								label={__('Columns', 'kadence-blocks')}
								value={columns}
								onChange={(value) => setAttributes({ columns: parseInt(value) })}
								min={1}
								max={20}
								style={{ marginTop: '15px' }}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Headers', 'kadence-blocks')}
							initialOpen={false}
							panelName={'table-headers'}
						>
							<ToggleControl
								label={__('First row is header', 'kadence-blocks')}
								checked={isFirstRowHeader}
								onChange={(value) => setAttributes({ isFirstRowHeader: value })}
								help={__('Switches to th tag and applies header typography styles.', 'kadence-blocks')}
							/>

							<ToggleControl
								label={__('First column is header', 'kadence-blocks')}
								checked={isFirstColumnHeader}
								onChange={(value) => setAttributes({ isFirstColumnHeader: value })}
								help={__('Switches to th tag and applies header typography styles.', 'kadence-blocks')}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Column Widths', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-table-column-widths'}
						>
							<div className="kb-table-column-controls">
								{Array.from({ length: columns }).map((_, index) => {
									const columnSetting = getColumnSetting(index);
									return (
										<div
											key={index}
											className="kb-table-column-control"
											style={{
												marginBottom: '24px',
												borderBottom: '1px solid #e0e0e0',
												paddingBottom: '16px',
											}}
										>
											<h3 style={{ margin: '0 0 8px' }}>
												{sprintf(
													// Translators: %d is the column number.
													__('Column %d', 'kadence-blocks'),
													index + 1
												)}
											</h3>

											<ToggleControl
												label={__('Use auto width', 'kadence-blocks')}
												checked={columnSetting.useAuto}
												onChange={(value) => updateColumnSetting(index, { useAuto: value })}
											/>

											{!columnSetting.useAuto && (
												<>
													<div
														style={{
															display: 'flex',
															gap: '8px',
															alignItems: 'flex-start',
															marginTop: '8px',
														}}
													>
														<div style={{ flex: 1 }}>
															<ResponsiveRangeControls
																label={__('Max Width', 'kadence-blocks')}
																value={
																	parseFloat(columnSetting.width) ||
																	(previewColumnSettingUnit === '%'
																		? DEFAULT_PERCENT_WIDTH
																		: DEFAULT_PIXEL_WIDTH)
																}
																onChange={(value) => {
																	value = value ? value : '';
																	updateColumnSetting(index, { width: value });
																}}
																tabletValue={
																	parseFloat(columnSetting.widthTablet) ||
																	(previewColumnSettingUnit === '%'
																		? DEFAULT_PERCENT_WIDTH
																		: DEFAULT_PIXEL_WIDTH)
																}
																onChangeTablet={(value) => {
																	value = value ? value : '';
																	updateColumnSetting(index, { widthTablet: value });
																}}
																mobileValue={
																	parseFloat(columnSetting.widthMobile) ||
																	(previewColumnSettingUnit === '%'
																		? DEFAULT_PERCENT_WIDTH
																		: DEFAULT_PIXEL_WIDTH)
																}
																onChangeMobile={(value) => {
																	value = value ? value : '';
																	updateColumnSetting(index, { widthMobile: value });
																}}
																min={0}
																max={previewColumnSettingUnit === 'px' ? 2000 : 100}
																step={1}
																reset={() =>
																	updateColumnSetting(index, {
																		width: '',
																		widthTablet: '',
																		widthMobile: '',
																	})
																}
																unit={
																	previewColumnSettingUnit
																		? previewColumnSettingUnit
																		: '%'
																}
																allowResponsiveUnitChange={true}
																onUnit={(value) => {
																	const device =
																		'Desktop' === previewDevice
																			? ''
																			: previewDevice;
																	console.log('Setting unit to: ', {
																		['unit' + device]: value,
																	});
																	updateColumnSetting(index, {
																		['unit' + device]: value,
																	});
																}}
																units={['px', '%']}
															/>
														</div>
													</div>
												</>
											)}
										</div>
									);
								})}
							</div>
						</KadencePanelBody>

						{applyFilters('kadence.tableBlockStickySettings', StickyUpsell, props)}

						<KadencePanelBody
							title={__('Table Sizing', 'kadence-blocks')}
							panelName={'table-sizing'}
							initialOpen={false}
						>
							<ResponsiveRangeControls
								label={__('Max Height', 'kadence-blocks')}
								reset={true}
								value={undefined !== maxHeight && undefined !== maxHeight[0] ? maxHeight[0] : ''}
								onChange={(value) => {
									setAttributes({
										maxHeight: [
											value,
											undefined !== maxHeight && undefined !== maxHeight[1] ? maxHeight[1] : '',
											undefined !== maxHeight && undefined !== maxHeight[2] ? maxHeight[2] : '',
										],
									});
								}}
								tabletValue={undefined !== maxHeight && undefined !== maxHeight[1] ? maxHeight[1] : ''}
								onChangeTablet={(value) => {
									setAttributes({
										maxHeight: [
											undefined !== maxHeight && undefined !== maxHeight[0] ? maxHeight[0] : '',
											value,
											undefined !== maxHeight && undefined !== maxHeight[2] ? maxHeight[2] : '',
										],
									});
								}}
								mobileValue={undefined !== maxHeight && undefined !== maxHeight[2] ? maxHeight[2] : ''}
								onChangeMobile={(value) => {
									setAttributes({
										maxHeight: [
											undefined !== maxHeight && undefined !== maxHeight[0] ? maxHeight[0] : '',
											undefined !== maxHeight && undefined !== maxHeight[1] ? maxHeight[1] : '',
											value,
										],
									});
								}}
								min={0}
								max={maxHeightUnit === 'px' ? 2000 : 100}
								step={1}
								unit={maxHeightUnit ? maxHeightUnit : 'px'}
								onUnit={(value) => {
									setAttributes({ maxHeightUnit: value });
								}}
								units={['px', '%', 'vw']}
							/>

							<ResponsiveRangeControls
								label={__('Max Width', 'kadence-blocks')}
								reset={true}
								value={undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : ''}
								onChange={(value) => {
									setAttributes({
										maxWidth: [
											value,
											undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
											undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
										],
									});
								}}
								tabletValue={undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : ''}
								onChangeTablet={(value) => {
									setAttributes({
										maxWidth: [
											undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
											value,
											undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
										],
									});
								}}
								mobileValue={undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : ''}
								onChangeMobile={(value) => {
									setAttributes({
										maxWidth: [
											undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
											undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
											value,
										],
									});
								}}
								min={0}
								max={maxWidthUnit === 'px' ? 2000 : 100}
								step={1}
								unit={maxWidthUnit ? maxWidthUnit : '%'}
								onUnit={(value) => {
									setAttributes({ maxWidthUnit: value });
								}}
								units={['px', '%', 'vw']}
							/>

							<ToggleControl
								label={__('Overflow-x scroll', 'kadence-blocks')}
								checked={overflowXScroll}
								onChange={(value) => setAttributes({ overflowXScroll: value })}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Caption', 'kadence-blocks')}
							panelName={'table-caption'}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Enable Caption?', 'kadence-blocks')}
								checked={enableCaption}
								onChange={(value) => setAttributes({ enableCaption: value })}
							/>
							{enableCaption && (
								<TextControl
									label={__('Caption Text', 'kadence-blocks')}
									value={caption || ''}
									onChange={(value) => setAttributes({ caption: value })}
								/>
							)}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<>
						<KadencePanelBody
							title={__('Borders', 'kadence-blocks')}
							panelName={'table-borders'}
							initialOpen={true}
						>
							<ResponsiveBorderControl
								label={__('Border', 'kadence-blocks')}
								value={borderStyle}
								tabletValue={tabletBorderStyle}
								mobileValue={mobileBorderStyle}
								onChange={(value) => setAttributes({ borderStyle: value })}
								onChangeTablet={(value) => setAttributes({ tabletBorderStyle: value })}
								onChangeMobile={(value) => setAttributes({ mobileBorderStyle: value })}
							/>

							<ToggleControl
								label={__('Only apply to rows', 'kadence-blocks')}
								checked={borderOnRowOnly}
								onChange={(value) => setAttributes({ borderOnRowOnly: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Cell Padding', 'kadence-blocks')}
							panelName={'table-cell-padding'}
							initialOpen={false}
						>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={cellPadding}
								tabletValue={tabletCellPadding}
								mobileValue={mobileCellPadding}
								onChange={(value) => setAttributes({ cellPadding: value })}
								onChangeTablet={(value) => setAttributes({ tabletCellPadding: value })}
								onChangeMobile={(value) => setAttributes({ mobileCellPadding: value })}
								min={cellPaddingType === 'em' || cellPaddingType === 'rem' ? -25 : -999}
								max={cellPaddingType === 'em' || cellPaddingType === 'rem' ? 25 : 999}
								step={cellPaddingType === 'em' || cellPaddingType === 'rem' ? 0.1 : 1}
								unit={cellPaddingType}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ cellPaddingType: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Cell Typography', 'kadence-blocks')}
							panelName={'table-cell-typography'}
							initialOpen={false}
						>
							<ResponsiveAlignControls
								label={__('Text Alignment', 'kadence-blocks')}
								value={textAlign}
								mobileValue={textAlignMobile}
								tabletValue={textAlignTablet}
								onChange={(nextAlign) => setAttributes({ textAlign: nextAlign })}
								onChangeTablet={(nextAlign) => setAttributes({ textAlignTablet: nextAlign })}
								onChangeMobile={(nextAlign) => setAttributes({ textAlignMobile: nextAlign })}
							/>
							<PopColorControl
								label={__('Text Color', 'kadence-blocks')}
								value={dataTypography[0].color}
								default={''}
								onChange={(value) => saveDataTypography({ color: value })}
							/>
							<TypographyControls
								fontGroup={'heading'}
								fontSize={dataTypography[0].size}
								onFontSize={(value) => saveDataTypography({ size: value })}
								fontSizeType={dataTypography[0].sizeType}
								onFontSizeType={(value) => saveDataTypography({ sizeType: value })}
								lineHeight={dataTypography[0].lineHeight}
								onLineHeight={(value) => saveDataTypography({ lineHeight: value })}
								lineHeightType={dataTypography[0].lineType}
								onLineHeightType={(value) => saveDataTypography({ lineType: value })}
								letterSpacing={dataTypography[0].letterSpacing}
								onLetterSpacing={(value) => saveDataTypography({ letterSpacing: value })}
								textTransform={dataTypography[0].textTransform}
								onTextTransform={(value) => saveDataTypography({ textTransform: value })}
								fontFamily={dataTypography[0].family}
								onFontFamily={(value) => saveDataTypography({ family: value })}
								onFontChange={(select) => {
									saveDataTypography({
										family: select.value,
										google: select.google,
									});
								}}
								onFontArrayChange={(values) => saveDataTypography(values)}
								googleFont={dataTypography[0].google}
								onGoogleFont={(value) => saveDataTypography({ google: value })}
								loadGoogleFont={dataTypography[0].loadGoogle}
								onLoadGoogleFont={(value) => saveDataTypography({ loadGoogle: value })}
								fontVariant={dataTypography[0].variant}
								onFontVariant={(value) => saveDataTypography({ variant: value })}
								fontWeight={dataTypography[0].weight}
								onFontWeight={(value) => saveDataTypography({ weight: value })}
								fontStyle={dataTypography[0].style}
								onFontStyle={(value) => saveDataTypography({ style: value })}
								fontSubset={dataTypography[0].subset}
								onFontSubset={(value) => saveDataTypography({ subset: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Header Typography', 'kadence-blocks')}
							panelName={'table-header-typography'}
							initialOpen={false}
						>
							<ResponsiveAlignControls
								label={__('Text Alignment', 'kadence-blocks')}
								value={headerAlign}
								mobileValue={headerAlignMobile}
								tabletValue={headerAlignTablet}
								onChange={(nextAlign) => setAttributes({ headerAlign: nextAlign })}
								onChangeTablet={(nextAlign) => setAttributes({ headerAlignTablet: nextAlign })}
								onChangeMobile={(nextAlign) => setAttributes({ headerAlignMobile: nextAlign })}
							/>
							<PopColorControl
								label={__('Header Color', 'kadence-blocks')}
								value={headerTypography[0].color}
								default={''}
								onChange={(value) => saveHeaderTypography({ color: value })}
							/>
							<TypographyControls
								fontGroup={'heading'}
								fontSize={headerTypography[0].size}
								onFontSize={(value) => saveHeaderTypography({ size: value })}
								fontSizeType={headerTypography[0].sizeType}
								onFontSizeType={(value) => saveHeaderTypography({ sizeType: value })}
								lineHeight={headerTypography[0].lineHeight}
								onLineHeight={(value) => saveHeaderTypography({ lineHeight: value })}
								lineHeightType={headerTypography[0].lineType}
								onLineHeightType={(value) => saveHeaderTypography({ lineType: value })}
								letterSpacing={headerTypography[0].letterSpacing}
								onLetterSpacing={(value) => saveHeaderTypography({ letterSpacing: value })}
								textTransform={headerTypography[0].textTransform}
								onTextTransform={(value) => saveHeaderTypography({ textTransform: value })}
								fontFamily={headerTypography[0].family}
								onFontFamily={(value) => saveHeaderTypography({ family: value })}
								onFontChange={(select) => {
									saveHeaderTypography({
										family: select.value,
										google: select.google,
									});
								}}
								onFontArrayChange={(values) => saveHeaderTypography(values)}
								googleFont={headerTypography[0].google}
								onGoogleFont={(value) => saveHeaderTypography({ google: value })}
								loadGoogleFont={headerTypography[0].loadGoogle}
								onLoadGoogleFont={(value) => saveHeaderTypography({ loadGoogle: value })}
								fontVariant={headerTypography[0].variant}
								onFontVariant={(value) => saveHeaderTypography({ variant: value })}
								fontWeight={headerTypography[0].weight}
								onFontWeight={(value) => saveHeaderTypography({ weight: value })}
								fontStyle={headerTypography[0].style}
								onFontStyle={(value) => saveHeaderTypography({ style: value })}
								fontSubset={headerTypography[0].subset}
								onFontSubset={(value) => saveHeaderTypography({ subset: value })}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Row Backgrounds', 'kadence-blocks')}
							panelName={'table-row-background'}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Even/Odd Backgrounds', 'kadence-blocks')}
								checked={evenOddBackground}
								onChange={(value) => setAttributes({ evenOddBackground: value })}
							/>

							<HoverToggleControl
								hover={
									<>
										<PopColorControl
											label={__('Hover Background Color', 'kadence-blocks')}
											value={backgroundHoverColorEven ? backgroundHoverColorEven : ''}
											default={''}
											onChange={(value) => setAttributes({ backgroundHoverColorEven: value })}
										/>

										{evenOddBackground && (
											<PopColorControl
												label={__('Hover Odd Background Color', 'kadence-blocks')}
												value={backgroundHoverColorOdd ? backgroundHoverColorOdd : ''}
												default={''}
												onChange={(value) => setAttributes({ backgroundHoverColorOdd: value })}
											/>
										)}
									</>
								}
								normal={
									<>
										<PopColorControl
											label={__('Background Color', 'kadence-blocks')}
											value={backgroundColorEven ? backgroundColorEven : ''}
											default={''}
											onChange={(value) => setAttributes({ backgroundColorEven: value })}
										/>

										{evenOddBackground && (
											<PopColorControl
												label={__('Odd Background Color', 'kadence-blocks')}
												value={backgroundColorOdd ? backgroundColorOdd : ''}
												default={''}
												onChange={(value) => setAttributes({ backgroundColorOdd: value })}
											/>
										)}
									</>
								}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Column Backgrounds', 'kadence-blocks')}
							panelName={'column-bgs'}
							initialOpen={false}
						>
							{Array.from({ length: columns }).map((_, index) => (
								<KadencePanelBody
									key={index}
									// Translators: %d is the column number
									title={sprintf(__('Column %d Background', 'kadence-blocks'), index + 1)}
									panelName={'column-bg-' + index}
									initialOpen={false}
								>
									<HoverToggleControl
										hover={
											<PopColorControl
												key={index + 'hover'}
												label={__('Hover Background Color', 'kadence-blocks')}
												value={getColumnBackground(index, true)}
												default={''}
												onChange={(value) => updateColumnBackground(index, value, true)}
											/>
										}
										normal={
											<PopColorControl
												key={index + 'normal'}
												label={__('Background Color', 'kadence-blocks')}
												value={getColumnBackground(index)}
												default={''}
												onChange={(value) => updateColumnBackground(index, value)}
											/>
										}
									/>
								</KadencePanelBody>
							))}
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Row Height', 'kadence-blocks')}
							initialOpen={false}
							panelName={'table-row-height'}
						>
							<ResponsiveRangeControls
								label={__('Height', 'kadence-blocks')}
								value={rowMinHeight}
								onChange={(value) => setAttributes({ rowMinHeight: value })}
								tabletValue={tabletRowMinHeight}
								onChangeTablet={(value) => setAttributes({ tabletRowMinHeight: value })}
								mobileValue={mobileRowMinHeight}
								onChangeMobile={(value) => setAttributes({ mobileRowMinHeight: value })}
								min={0}
								max={rowMinHeightType === 'px' ? 600 : 100}
								step={1}
								unit={rowMinHeightType}
								onUnit={(value) => {
									setAttributes({ rowMinHeightType: value });
								}}
								units={['px', 'em', 'vh']}
								reset={() =>
									setAttributes({
										rowMinHeight: null,
										tabletRowMinHeight: null,
										mobileRowMinHeight: null,
									})
								}
								showUnit={true}
							/>
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody initialOpen={true}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
								tabletValue={tabletPadding}
								mobileValue={mobilePadding}
								onChange={(value) => setAttributes({ padding: value })}
								onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
								onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
								min={0}
								max={
									paddingType === 'em' || paddingType === 'rem'
										? 25
										: paddingType === 'px'
											? 400
											: 100
								}
								step={paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1}
								unit={paddingType}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ paddingType: value })}
							/>

							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={margin}
								tabletValue={tabletMargin}
								mobileValue={mobileMargin}
								onChange={(value) => setAttributes({ margin: value })}
								onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
								onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
								min={0}
								max={marginType === 'em' || marginType === 'rem' ? 25 : marginType === 'px' ? 400 : 100}
								step={marginType === 'em' || marginType === 'rem' ? 0.1 : 1}
								unit={marginType}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ marginType: value })}
							/>

							<KadenceBlockDefaults
								attributes={attributes}
								defaultAttributes={metadata.attributes}
								blockSlug={metadata.name}
								excludedAttrs={nonTransAttrs}
							/>
						</KadencePanelBody>
					</>
				)}
			</KadenceInspectorControls>
			<BackendStyles attributes={attributes} previewDevice={previewDevice} />
			{(isSelected || childSelected) && (
				<div className="kb-table-width-controls">
					<div className="kb-table-width-resizers" style={{ display: 'flex' }}>
						{Array.from({ length: columns }).map((_, index) => {
							const columnSetting = getColumnSetting(index);

							if (columnSetting.useAuto) {
								return (
									<div
										key={index}
										style={{
											flex: 1,
											height: '30px',
											backgroundColor: '#f0f0f0',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '12px',
											margin: '0 1px',
										}}
									>
										{__('Auto', 'kadence-blocks')}
									</div>
								);
							}

							const previewColumnWidth = getPreviewSize(
								previewDevice,
								columnSetting.width,
								columnSetting.widthTablet,
								columnSetting.widthMobile,
								true
							);

							return (
								<ResizableBox
									key={index}
									size={{
										width: `${
											previewColumnWidth || DEFAULT_PERCENT_WIDTH
										}${previewColumnSettingUnit}`,
										height: 30,
									}}
									minWidth={previewColumnSettingUnit === '%' ? '1%' : '20'}
									maxWidth={previewColumnSettingUnit === '%' ? '100%' : '1000'}
									enable={{
										top: false,
										right: true,
										bottom: false,
										left: false,
										topRight: false,
										bottomRight: false,
										bottomLeft: false,
										topLeft: false,
									}}
									onResizeStart={() => {
										setIsResizing(true);
										// Ensure we have a valid initial width
										if (!previewColumnWidth) {
											updateColumnSetting(index, {
												width:
													previewColumnSettingUnit === '%'
														? DEFAULT_PERCENT_WIDTH
														: DEFAULT_PIXEL_WIDTH,
											});
										}
									}}
									onResizeStop={(event, direction, elt, delta) => {
										setIsResizing(false);
										const currentWidth =
											parseFloat(previewColumnWidth) ||
											(previewColumnSettingUnit === '%'
												? DEFAULT_PERCENT_WIDTH
												: DEFAULT_PIXEL_WIDTH);

										const newWidth =
											previewColumnSettingUnit === '%'
												? currentWidth + (delta.width / elt.parentElement.offsetWidth) * 100
												: currentWidth + delta.width;

										updateColumnSetting(index, {
											width: Math.round(
												Math.max(
													previewColumnSettingUnit === '%' ? 1 : 20,
													Math.min(previewColumnSettingUnit === '%' ? 100 : 1000, newWidth)
												)
											),
										});
									}}
									showHandle={!isResizing}
								>
									<div
										style={{
											height: '100%',
											backgroundColor: '#e0e0e0',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '12px',
										}}
									>
										{`${Math.round(
											previewColumnWidth ||
												(previewColumnSettingUnit === '%'
													? DEFAULT_PERCENT_WIDTH
													: DEFAULT_PIXEL_WIDTH)
										)}${previewColumnSettingUnit}`}
									</div>
								</ResizableBox>
							);
						})}
					</div>
				</div>
			)}
			<table {...innerBlocksProps}>
				{enableCaption && caption && <caption>{caption}</caption>}
				{children}
			</table>
		</div>
	);
}

export default Edit;
