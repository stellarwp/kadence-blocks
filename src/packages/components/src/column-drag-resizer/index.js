import { Button, Tooltip, ResizableBox } from '@wordpress/components';
import { isRTL } from '@kadence/helpers';
import classnames from 'classnames';
import { debounce, throttle } from 'lodash';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { getPreviewGutterSize, getGutterTotal } from './utils';
import { getPreviewSize } from '@kadence/helpers';

const ContainerDimensions = ({ children }) => {
	const [dimensions, setDimensions] = useState(null);
	const parentRef = useRef(null);

	useEffect(() => {
		if (!parentRef.current?.parentElement) return;

		const getDimensions = (element) => {
			const { top, right, bottom, left, width, height } = element.getBoundingClientRect();
			return { top, right, bottom, left, width, height };
		};

		const updateDimensions = () => {
			if (parentRef.current?.parentElement) {
				setDimensions(getDimensions(parentRef.current.parentElement));
			}
		};

		// Initial dimensions
		updateDimensions();

		// Set up ResizeObserver
		const resizeObserver = new ResizeObserver(() => {
			updateDimensions();
		});

		resizeObserver.observe(parentRef.current.parentElement);

		// Cleanup
		return () => {
			if (parentRef.current?.parentElement) {
				resizeObserver.unobserve(parentRef.current.parentElement);
			}
			resizeObserver.disconnect();
		};
	}, []);

	if (!dimensions) {
		return <div ref={parentRef} />;
	}

	if (typeof children === 'function') {
		const renderedChildren = children(dimensions);
		return renderedChildren ? <div ref={parentRef}>{renderedChildren}</div> : null;
	}

	return React.cloneElement(children, {
		...dimensions,
		ref: (node) => {
			parentRef.current = node;
			const { ref } = children;
			if (typeof ref === 'function') {
				ref(node);
			} else if (ref) {
				ref.current = node;
			}
		},
	});
};

/**
 * Import Css
 */
import './editor.scss';

export default function ColumnDragResizer(props) {
	//columns a number of columns
	//column widths and array of
	const {
		attributes,
		setAttributes,
		previewDevice,
		columns,
		columnWidths,
		columnGap,
		columnsUnlocked,
		onColumnsUnlocked,
		onResize,
		onResizeStop,
		onResizeTablet,
		onResizeStopTablet,
		onResizeMobile,
		onResizeStopMobile,
		active,
	} = props;
	const { uniqueID, columnGutter, customGutter, gutterType } = attributes;
	// const currentGutter = getPreviewGutterSize(previewDevice, columnGutter, customGutter, gutterType);
	// const currentGutterTotal = getGutterTotal(currentGutter, columns);
	// const gutterAdjuster = `calc( -1 * ( ${currentGutter} / 3 ) / 2)`;

	//TODO use actual mobile values
	const previewColumnWidths = getPreviewSize(previewDevice, columnWidths, columnWidths, columnWidths);

	const localOnResizeStop = (event, direction, elt) => {
		const newColumnWidths = packageWidths(event, direction, elt);
		if (onResizeStopMobile && previewDevice == 'Mobile') {
			onResizeStopMobile(newColumnWidths);
		} else if (onResizeStopTablet && previewDevice == 'Tablet') {
			onResizeStopTablet(newColumnWidths);
		} else {
			onResizeStop(newColumnWidths);
		}
	};
	const localOnResize = (event, direction, elt) => {
		const newColumnWidths = packageWidths(event, direction, elt);
		if (onResizeMobile && previewDevice == 'Mobile') {
			onResizeMobile(newColumnWidths);
		} else if (onResizeTablet && previewDevice == 'Tablet') {
			onResizeTablet(newColumnWidths);
		} else {
			onResize(newColumnWidths);
		}
	};

	const packageWidths = (event, direction, elt) => {
		let tempColumnW;
		let tempChange;
		let tempNextColumnW;
		const currentElementWidth = elt.style.width;
		const currentColumn = parseInt(elt.dataset?.column);
		const currentColumnWidth = previewColumnWidths[currentColumn];
		const nextColumn = currentColumn + 1;
		const nextColumnWidth = previewColumnWidths[nextColumn];
		const sumPreviousColumnWidths =
			currentColumn == 0
				? 0
				: previewColumnWidths.slice(0, currentColumn).reduce((partialSum, a) => partialSum + a, 0);

		//calculate width changes depending on unlocked status
		if (columnsUnlocked) {
			tempColumnW = Math.round(parseFloat(currentElementWidth) * 10) / 10 - sumPreviousColumnWidths;
			tempChange = tempColumnW - (!currentColumnWidth ? 10 : currentColumnWidth);
			tempNextColumnW = Math.round(Math.abs((!nextColumnWidth ? 10 : nextColumnWidth) - tempChange) * 10) / 10;
		} else {
			tempColumnW = Math.round(parseInt(currentElementWidth) / 5) * 5 - sumPreviousColumnWidths;
			tempChange = tempColumnW - (!currentColumnWidth ? 10 : currentColumnWidth);
			tempNextColumnW = Math.round(Math.abs((!nextColumnWidth ? 10 : nextColumnWidth) - tempChange) / 5) * 5;
		}

		//package new widths to be dispatched
		var newColumnWidths = [...previewColumnWidths];
		newColumnWidths[currentColumn] = tempColumnW;
		newColumnWidths[nextColumn] = tempNextColumnW;

		//if this row had previously assumed column widths like 33.33%, than moving this column may have made it so the whole thing doesn't add up to 100% anymore.
		//For instance now the columns are [30,35,33.33]
		//this ensures the grid adds up to 100% and is in 5% incriments if it was set to snap
		if (columns > 2) {
			//make sure all column values are rounded
			newColumnWidths = newColumnWidths.map((x) =>
				columnsUnlocked ? Math.round(parseFloat(x) * 10) / 10 : Math.round(parseInt(x) / 5) * 5
			);

			//if we don't add to one hundred, add that to the last other column
			const sumAllColumnWidths = newColumnWidths.reduce((partialSum, a) => partialSum + a, 0);
			const needToAddToLast = 100 - sumAllColumnWidths;

			//need to add some to a column not just adjusted to make us equal 100
			const columnToAddTo = currentColumn == columns - 2 ? 0 : newColumnWidths.length - 1;
			newColumnWidths[columnToAddTo] = newColumnWidths[columnToAddTo] + needToAddToLast;
		}

		return newColumnWidths;
	};

	const innerResizeClasses = classnames({
		'kt-resizeable-column-container': true,
		[`kt-resizeable-column-container${uniqueID}`]: uniqueID,
		'kt-resizeable-column-inactive': !active,
	});

	var resizableBoxes = (width) => {
		var resizableBoxArray = [];
		for (let column = 0; column < columns - 1; column++) {
			const columnWidth = previewColumnWidths?.[column];
			const nextColumnWidth = previewColumnWidths?.[column + 1];
			const sumPreviousColumnWidths =
				column == 0 ? 0 : previewColumnWidths.slice(0, column).reduce((partialSum, a) => partialSum + a, 0);
			const minWidth = 10;
			//This takes out the column's portion of the gap from the overall percent width.
			//the preset columns aren't actually displayed as percents on the frontend for the row layout. They use fr's.
			//This also adjusts for the difference in how gaps are potioned out between fr's and % grids.
			//The same calculation is run for the row layout grid.
			//It's in the form of a left offset because I can't calc() the width of a ResizableBox
			//It attempts to place the edge of the resizable box right in the middle of the joint.
			const gutterAdjustment =
				'calc(((((' +
				columnGap +
				' * ' +
				(columns - 1) +
				')) / ' +
				columns +
				') * ' +
				-1 * (column + 1) +
				') + ( (' +
				columnGap +
				' * ' +
				column +
				') + (' +
				columnGap +
				' / 2 ) ) )';

			const columnBox = (
				<ResizableBox
					className="editor-row-column__resizer"
					size={{
						width: sumPreviousColumnWidths + columnWidth + '%',
					}}
					style={{ left: gutterAdjustment }}
					minWidth={sumPreviousColumnWidths + minWidth + '%'}
					maxWidth={sumPreviousColumnWidths + columnWidth + nextColumnWidth - minWidth + '%'}
					enable={{
						right: isRTL ? false : true,
						left: isRTL ? true : false,
					}}
					handleClasses={{
						right: 'components-resizable-box__handle components-resizable-box__handle-right',
						left: 'components-resizable-box__handle components-resizable-box__handle-left',
					}}
					handleWrapperClass="editor-row-controls-container"
					grid={columnsUnlocked ? [width / 1000, 1] : [width / 20, 1]}
					onResize={localOnResize}
					onResizeStop={localOnResizeStop}
					axis="x"
					data-column={column}
				>
					<span className="editor-row-controls-container kadence-resize-extra-controls">
						{columnsUnlocked && (
							<Tooltip text={__('Switch to 5% step resizing', 'kadence-blocks')}>
								<Button className="kt-fluid-grid-btn" isSmall onClick={() => onColumnsUnlocked(false)}>
									{
										<svg
											viewBox="0 0 20 20"
											width="20"
											height="20"
											xmlns="http://www.w3.org/2000/svg"
											fillRule="evenodd"
											clipRule="evenodd"
											strokeLinejoin="round"
											strokeMiterlimit="1.414"
										>
											<path d="M4.217,10.611l0,2.7l-3.31,-3.311l3.31,-3.311l0,2.7l11.566,0l0,-2.7l3.31,3.311l-3.31,3.311l0,-2.7l-11.566,0Z" />
										</svg>
									}
								</Button>
							</Tooltip>
						)}
						{!columnsUnlocked && (
							<Tooltip text={__('Switch to fluid resizing', 'kadence-blocks')}>
								<Button className="kt-fluid-grid-btn" isSmall onClick={() => onColumnsUnlocked(true)}>
									{
										<svg
											viewBox="0 0 20 20"
											width="20"
											height="20"
											xmlns="http://www.w3.org/2000/svg"
											fillRule="evenodd"
											clipRule="evenodd"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeMiterlimit="1.5"
										>
											<path d="M13.967,10.611l0.001,-1.222l1.815,0l0,-2.7l3.31,3.311l-3.31,3.311l0,-2.7l-1.816,0Z" />
											<path d="M8.918,10.611l-0.022,-1.222l2.15,0l-0.031,1.222l-2.097,0Z" />
											<path d="M4.217,10.611l0,2.7l-3.31,-3.311l3.31,-3.311l0,2.7l1.693,0l-0.028,1.222l-1.665,0Z" />
											<circle cx="12.427" cy="9.997" r="1.419" fill="none" stroke="#0085ba" />
											<circle cx="7.456" cy="9.997" r="1.419" fill="none" stroke="#0085ba" />
										</svg>
									}
								</Button>
							</Tooltip>
						)}
						<span
							id={`left-column-width-${column}`}
							className="left-column-width-size column-width-size-handle"
						>
							{columnWidth + '%'}
						</span>
						<span
							id={`right-column-width-${column}`}
							className="right-column-width-size column-width-size-handle"
						>
							{nextColumnWidth + '%'}
						</span>
					</span>
				</ResizableBox>
			);
			resizableBoxArray.push(columnBox);
		}
		return resizableBoxArray;
	};

	return (
		<div className={innerResizeClasses}>
			<ContainerDimensions>{({ width }) => <>{resizableBoxes(width)}</>}</ContainerDimensions>
		</div>
	);
}
