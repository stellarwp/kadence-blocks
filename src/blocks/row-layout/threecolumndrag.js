const {
	Fragment,
} = wp.element;
import ContainerDimensions from 'react-container-dimensions';
import ResizableBox from 're-resizable';
export default function ThreeColumnDrag( {
	uniqueID,
	onSetState,
	onSetAttributes,
	firstColumnWidth,
	secondColumnWidth,
	widthString,
	secondWidthString,
	leftPadding,
	rightPadding,
} ) {
	let widthNumberThirds;
	if ( widthString === parseInt( widthString ) ) {
		widthNumberThirds = widthString;
	} else if ( 'left-half' === widthString ) {
		widthNumberThirds = '50';
	} else if ( 'right-half' === widthString ) {
		widthNumberThirds = '25';
	} else if ( 'center-half' === secondWidthString ) {
		widthNumberThirds = '25';
	} else if ( 'center-wide' === secondWidthString ) {
		widthNumberThirds = '20';
	} else if ( 'center-exwide' === secondWidthString ) {
		widthNumberThirds = '15';
	} else {
		widthNumberThirds = '33.33';
	}
	let secondWidthNumber;
	if ( secondWidthString === parseInt( secondWidthString ) ) {
		secondWidthNumber = secondWidthString;
	} else if ( 'left-half' === secondWidthString ) {
		secondWidthNumber = '25';
	} else if ( 'right-half' === secondWidthString ) {
		secondWidthNumber = '25';
	} else if ( 'center-half' === secondWidthString ) {
		secondWidthNumber = '50';
	} else if ( 'center-wide' === secondWidthString ) {
		secondWidthNumber = '60';
	} else if ( 'center-exwide' === secondWidthString ) {
		secondWidthNumber = '70';
	} else {
		secondWidthNumber = '33.33';
	}
	let thirdWidthNumber;
	if ( secondWidthString === parseInt( secondWidthString ) ) {
		thirdWidthNumber = Math.abs( ( widthNumberThirds + secondWidthNumber ) - 100 );
	} else if ( 'left-half' === secondWidthString ) {
		thirdWidthNumber = '25';
	} else if ( 'right-half' === secondWidthString ) {
		thirdWidthNumber = '50';
	} else if ( 'center-half' === secondWidthString ) {
		thirdWidthNumber = '25';
	} else if ( 'center-wide' === secondWidthString ) {
		thirdWidthNumber = '20';
	} else if ( 'center-exwide' === secondWidthString ) {
		thirdWidthNumber = '15';
	} else {
		thirdWidthNumber = '33.33';
	}
	const firstRoundDown = ( '33.33' === widthNumberThirds ? 30 : parseFloat( widthNumberThirds ) );
	const realThirdsFirstWidth = ( ! firstColumnWidth ? firstRoundDown : firstColumnWidth );
	const secondRoundDown = ( '33.33' === secondWidthNumber ? 30 : parseFloat( secondWidthNumber ) );
	const realThirdsSecondWidth = ( ! secondColumnWidth ? secondRoundDown : secondColumnWidth );
	const onResizeThirds = ( event, direction, elt ) => {
		const tempfirstW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
		const tempChange = tempfirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
		const tempsecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) / 5 ) * 5;
		onSetState( {
			firstWidth: tempfirstW,
		} );
		onSetState( {
			secondWidth: tempsecondW,
		} );
		document.getElementById( 'left-column-width-' + uniqueID ).innerHTML = tempfirstW + '%';
		document.getElementById( 'right-column-width-' + uniqueID ).innerHTML = tempsecondW + '%';
		document.getElementById( 'third-right-column-width-' + uniqueID ).innerHTML = tempsecondW + '%';
		document.getElementById( 'third-column-width-' + uniqueID ).innerHTML = Math.abs( ( tempsecondW + tempfirstW ) - 100 ) + '%';
	};
	const onResizeStopThirds = ( event, direction, elt ) => {
		const tempfirstW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
		const tempChange = tempfirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
		const tempsecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) / 5 ) * 5;
		onSetAttributes( { firstColumnWidth: tempfirstW } );
		onSetAttributes( { secondColumnWidth: tempsecondW } );
		this.setState( {
			firstWidth: null,
			secondWidth: null,
		} );
	};
	const onResizeSecond = ( event, direction, elt ) => {
		const tempfirstW = Math.round( ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth ) / 5 ) * 5;
		const tempsecondW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
		const tempsecondWidth = Math.round( ( tempsecondW - tempfirstW ) / 5 ) * 5;
		this.setState( {
			firstWidth: tempfirstW,
		} );
		this.setState( {
			secondWidth: tempsecondWidth,
		} );
		document.getElementById( 'left-column-width-' + uniqueID ).innerHTML = tempfirstW + '%';
		document.getElementById( 'right-column-width-' + uniqueID ).innerHTML = ( tempsecondWidth ) + '%';
		document.getElementById( 'third-right-column-width-' + uniqueID ).innerHTML = ( tempsecondWidth ) + '%';
		document.getElementById( 'third-column-width-' + uniqueID ).innerHTML = Math.abs( ( tempsecondWidth + tempfirstW ) - 100 ) + '%';
	};
	const onResizeStopSecond = ( event, direction, elt ) => {
		const tempsecondW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
		onSetAttributes( { firstColumnWidth: Math.round( ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth ) / 5 ) * 5 } );
		onSetAttributes( { secondColumnWidth: Math.round( ( tempsecondW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth ) ) / 5 ) * 5 } );
		this.setState( {
			firstWidth: null,
			secondWidth: null,
		} );
	};
	return (
		<div className="kt-resizeable-column-container" style={ {
			left: leftPadding + 'px',
			right: rightPadding + 'px',
		} }>
			<ContainerDimensions>
				{ ( { width } ) =>
					<Fragment>
						<ResizableBox
							className="editor-row-first-column__resizer"
							size={ { width: ( ! firstColumnWidth ? widthNumberThirds + '%' : firstColumnWidth + '%' ) } }
							minWidth="5%"
							maxWidth={ ( ( realThirdsFirstWidth + realThirdsSecondWidth ) - 5 ) + '%' }
							enable={ {
								right: true,
							} }
							handleClasses={ {
								right: 'components-resizable-box__handle components-resizable-box__handle-right',
							} }
							grid={ [ width / 20, 1 ] }
							onResize={ onResizeThirds }
							onResizeStop={ onResizeStopThirds }
							axis="x"
						>
							<span id={ `left-column-width-${ uniqueID }` } className="left-column-width-size column-width-size-handle" >
								{ ( ! firstColumnWidth ? widthNumberThirds + '%' : firstColumnWidth + '%' ) }
							</span>
							<span id={ `right-column-width-${ uniqueID }` } className="right-column-width-size column-width-size-handle" >
								{ ( ! secondColumnWidth ? secondWidthNumber + '%' : secondColumnWidth + '%' ) }
							</span>
						</ResizableBox>
						<ResizableBox
							className="editor-row-first-column__resizer second_resizer"
							size={ { width: ( ! secondColumnWidth ? Math.abs( parseFloat( secondWidthNumber ) + parseFloat( widthNumberThirds ) ) + '%' : secondColumnWidth + firstColumnWidth + '%' ) } }
							minWidth={ ( ( Math.round( ( ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth ) ) / 5 ) * 5 ) + 5 ) + '%' }
							maxWidth="95%"
							enable={ {
								right: true,
							} }
							handleClasses={ {
								right: 'components-resizable-box__handle components-resizable-box__handle-right',
							} }
							grid={ [ width / 20, 1 ] }
							onResize={ onResizeSecond }
							onResizeStop={ onResizeStopSecond }
							axis="x"
						>
							<span id={ `third-right-column-width-${ uniqueID }` } className="left-column-width-size column-width-size-handle" >
								{ ( ! secondColumnWidth ? secondWidthNumber + '%' : secondColumnWidth + '%' ) }
							</span>
							<span id={ `third-column-width-${ uniqueID }` } className="right-column-width-size column-width-size-handle" >
								{ thirdWidthNumber + '%' }
							</span>
						</ResizableBox>
					</Fragment>
				}
			</ContainerDimensions>
		</div>
	);
}
