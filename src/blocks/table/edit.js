import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch, dispatch, select } from '@wordpress/data';
import { useBlockProps, BlockControls, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import classnames from 'classnames';
import metadata from './block.json';
import './editor.scss';
import { createBlock } from '@wordpress/blocks';

import {
	RangeControl,
	ToggleControl,
	TextControl,
	Modal,
	SelectControl,
	FormFileUpload,
	Button,
	ButtonGroup,
	Notice,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

import {
	KadenceSelectPosts,
	KadencePanelBody,
	InspectorControlTabs,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	TypographyControls,
	HoverToggleControl,
	PopColorControl,
	ResponsiveMeasurementControls,
	ResponsiveBorderControl,
	ResponsiveRangeControls,
	ResponsiveAlignControls,
} from '@kadence/components';

import {
	setBlockDefaults,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getUniqueId,
	getPostOrFseId,
	getPreviewSize,
} from '@kadence/helpers';
import BackendStyles from './components/backend-styles';

export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

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
		tabletCelladding,
		cellPaddingType,
		textAlign,
		textAlignTablet,
		textAlignMobile,
		headerAlign,
		headerAlignTablet,
		headerAlignMobile,
		isFirstRowHeader,
		isFirstColumnHeader,
	} = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);

	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const [activeTab, setActiveTab] = useState('general');
	const [placeholderRows, setPlaceholderRows] = useState(2);
	const [placeholderColumns, setPlaceholderColumns] = useState(2);

	const nonTransAttrs = [];

	const classes = classnames(
		{
			'kb-table-container': true,
			[`kb-table-container${uniqueID}`]: uniqueID,
		},
		className
	);
	const blockProps = useBlockProps({
		className: classes,
	});

	useEffect(() => {
		setBlockDefaults('kadence/table', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);

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

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: classnames(
				{
					'kb-table': true,
					[`kb-table${uniqueID}`]: uniqueID,
				},
				className
			),
			style: {},
		},
		{
			allowedBlocks: ['kadence/table-row'],
			renderAppender: false,
			templateInsertUpdatesSelection: false,
		}
	);

	const createTableRow = () => {
		return createBlock('kadence/table-row', {});
	};

	const handleInsertRowAbove = (index) => {
		const { insertBlock } = dispatch('core/block-editor');
		const newRow = createTableRow();
		const blocks = select('core/block-editor').getBlocks(clientId);
		insertBlock(newRow, index, clientId, false);
		setAttributes({ rows: rows + 1 });
	};

	const handleInsertRowBelow = (index) => {
		const { insertBlock } = dispatch('core/block-editor');
		const newRow = createTableRow();
		const blocks = select('core/block-editor').getBlocks(clientId);
		insertBlock(newRow, index + 1, clientId, false);
		setAttributes({ rows: rows + 1 });
	};

	const handleDeleteLastRow = () => {
		const { removeBlock } = dispatch('core/block-editor');
		const blocks = select('core/block-editor').getBlocks(clientId);
		if (blocks.length > 1) {
			// Prevent deleting last row
			removeBlock(blocks[blocks.length - 1].clientId, false);
		}
	};

	const handleInsertColumnLeft = (index) => {
		const { replaceBlock } = dispatch('core/block-editor');
		const blocks = select('core/block-editor').getBlocks(clientId);

		blocks.forEach((row) => {
			const newCells = [...row.innerBlocks];
			const newCell = createBlock('kadence/table-data', {});
			newCells.splice(index, 0, newCell);

			const newRow = createBlock('kadence/table-row', { ...row.attributes, columns: columns + 1 }, newCells);

			replaceBlock(row.clientId, newRow);
		});

		setAttributes({ columns: columns + 1 });
	};

	const createTable = () => {
		setAttributes({
			columns: placeholderColumns,
		});
		updateRowsColumns(placeholderRows);
	};

	const updateRowsColumns = (newRows) => {
		const blocks = select('core/block-editor').getBlocks(clientId);
		let newBlocks = [...blocks];

		// Handle rows
		if (newRows > rows) {
			const additionalRows = Array(newRows - rows)
				.fill(null)
				.map(() => createTableRow());
			newBlocks = [...newBlocks, ...additionalRows];
		} else if (newRows < rows) {
			newBlocks = newBlocks.slice(0, newRows);
		}

		replaceInnerBlocks(clientId, newBlocks, false);
		setAttributes({ rows: newRows });
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

	if (undefined === columns) {
		return (
			<div
				className={'placeholder'}
				style={{ backgroundColor: '#FFF', border: '2px solid #000', padding: '20px' }}
			>
				<h4 style={{ marginTop: '0', marginBottom: '15px' }}>{__('Table layout', 'kadence-blocks')}</h4>
				<div style={{ maxWidth: '350px' }}>
					<RangeControl
						label={__('Columns', 'kadence-blocks')}
						value={placeholderColumns}
						onChange={(value) => setPlaceholderColumns(value)}
						min={2}
						max={15}
					/>

					<RangeControl
						label={__('Rows', 'kadence-blocks')}
						value={placeholderRows}
						onChange={(value) => setPlaceholderRows(value)}
						min={2}
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
							<ButtonGroup>
								<Button onClick={() => handleInsertRowBelow(9999)} isSecondary>
									{__('Add Row', 'kadence-blocks')}
								</Button>
								<Button onClick={() => handleDeleteLastRow()} isSecondary>
									{__('Delete Row', 'kadence-blocks')}
								</Button>
							</ButtonGroup>
							<NumberControl
								label={__('Number of Columns', 'kadence-blocks')}
								value={columns}
								onChange={(value) => setAttributes({ columns: value })}
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
							title={__('Sticky Settings', 'kadence-blocks')}
							panelName={'sticky-settings'}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Sticky first row', 'kadence-blocks')}
								checked={stickyFirstRow}
								onChange={(value) => setAttributes({ stickyFirstRow: value })}
								help={__('Max height must be set for this to apply.', 'kadence-blocks')}
							/>

							<ToggleControl
								label={__('Sticky first column', 'kadence-blocks')}
								checked={stickyFirstColumn}
								onChange={(value) => setAttributes({ stickyFirstColumn: value })}
								help={__('Max width must be set for this to apply.', 'kadence-blocks')}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Sizing', 'kadnece-blocks')}
							panelName={'sizing'}
							initialOpen={false}
						>
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
							initialOpen={true}
						>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={cellPadding}
								tabletValue={tabletCelladding}
								mobileValue={mobileCellPadding}
								onChange={(value) => setAttributes({ cellPadding: value })}
								onChangeTablet={(value) => setAttributes({ tabletCelladding: value })}
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
							initialOpen={true}
						>
							<ResponsiveAlignControls
								label={__('Text Alignment', 'kadence-blocks')}
								value={textAlign}
								mobileValue={textAlignMobile}
								tabletValue={textAlignTablet}
								onChange={(nextAlign) => setAttributes({ textAlign: nextAlign })}
								onChangeTablet={(nextAlign) => setAttributes({ textAlignMobile: nextAlign })}
								onChangeMobile={(nextAlign) => setAttributes({ textAlignTablet: nextAlign })}
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
								onChangeTablet={(nextAlign) => setAttributes({ headerAlignMobile: nextAlign })}
								onChangeMobile={(nextAlign) => setAttributes({ headerAlignTablet: nextAlign })}
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
									title={__(`Column ${index + 1} Background`, 'kadence-blocks')}
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
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={nonTransAttrs}
						/>
					</>
				)}
			</KadenceInspectorControls>
			<BackendStyles attributes={attributes} previewDevice={previewDevice} />
			<table {...innerBlocksProps} />
		</div>
	);
}

export default Edit;
