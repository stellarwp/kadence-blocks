const {
	Fragment,
} = wp.element;
const {
	Button,
	Tooltip,
} = wp.components;
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
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
	columnsUnlocked,
	leftPadding,
	rightPadding,
} ) {
	let widthNumberThirds;
	if ( Math.abs( widthString ) === parseFloat( widthString ) ) {
		widthNumberThirds = widthString;
	} else if ( 'left-half' === widthString ) {
		widthNumberThirds = '50';
	} else if ( 'right-half' === widthString ) {
		widthNumberThirds = '25';
	} else if ( 'center-half' === widthString ) {
		widthNumberThirds = '25';
	} else if ( 'center-wide' === widthString ) {
		widthNumberThirds = '20';
	} else if ( 'center-exwide' === widthString ) {
		widthNumberThirds = '15';
	} else {
		widthNumberThirds = '33.3';
	}
	let secondWidthNumber;
	if ( Math.abs( secondWidthString ) === parseFloat( secondWidthString ) ) {
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
		secondWidthNumber = '33.3';
	}
	let thirdWidthNumber;
	if ( Math.abs( secondWidthString ) === parseFloat( secondWidthString ) ) {
		thirdWidthNumber = Math.abs( Math.round( ( ( parseFloat( widthNumberThirds ) + parseFloat( secondWidthNumber ) ) - 100 ) * 10 ) / 10 );
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
		thirdWidthNumber = '33.3';
	}
	const firstRoundDown = ( '33.3' === widthNumberThirds ? 30 : parseFloat( widthNumberThirds ) );
	const realThirdsFirstWidth = ( ! firstColumnWidth ? firstRoundDown : firstColumnWidth );
	const secondRoundDown = ( '33.3' === secondWidthNumber ? 30 : parseFloat( secondWidthNumber ) );
	const realThirdsSecondWidth = ( ! secondColumnWidth ? secondRoundDown : secondColumnWidth );
	const onResizeThirds = ( event, direction, elt ) => {
		let tempfirstW;
		let tempChange;
		let tempsecondW;
		if ( columnsUnlocked ) {
			tempfirstW = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			tempChange = tempfirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
			tempsecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) * 10 ) / 10;
		} else {
			tempfirstW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			tempChange = tempfirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
			tempsecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) / 5 ) * 5;
		}
		onSetState( {
			firstWidth: tempfirstW,
			secondWidth: tempsecondW,
		} );
		document.getElementById( 'left-column-width-' + uniqueID ).innerHTML = tempfirstW + '%';
		document.getElementById( 'right-column-width-' + uniqueID ).innerHTML = tempsecondW + '%';
		document.getElementById( 'third-right-column-width-' + uniqueID ).innerHTML = tempsecondW + '%';
		document.getElementById( 'third-column-width-' + uniqueID ).innerHTML = Math.abs( Math.round( ( ( tempsecondW + tempfirstW ) - 100 ) * 10 ) / 10 ) + '%';
	};
	const onResizeStopThirds = ( event, direction, elt ) => {
		let tempfirstW;
		let tempChange;
		let tempsecondW;
		if ( columnsUnlocked ) {
			tempfirstW = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			tempChange = tempfirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
			tempsecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) * 10 ) / 10;
		} else {
			tempfirstW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			tempChange = tempfirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
			tempsecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) / 5 ) * 5;
		}
		onSetAttributes( { firstColumnWidth: tempfirstW } );
		onSetAttributes( { secondColumnWidth: tempsecondW } );
		onSetState( {
			firstWidth: null,
			secondWidth: null,
		} );
	};
	const onResizeSecond = ( event, direction, elt ) => {
		let tempfirstW;
		let tempsecondWidth;
		let tempsecondW;
		if ( columnsUnlocked ) {
			tempfirstW = ( ! firstColumnWidth ? parseFloat( widthNumberThirds ) : firstColumnWidth );
			tempsecondW = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			tempsecondWidth = Math.round( ( tempsecondW - tempfirstW ) * 10 ) / 10;
		} else {
			tempfirstW = Math.round( ( ! firstColumnWidth ? parseFloat( widthNumberThirds ) : firstColumnWidth ) / 5 ) * 5;
			tempsecondW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			tempsecondWidth = Math.round( ( tempsecondW - tempfirstW ) / 5 ) * 5;
		}
		onSetState( {
			firstWidth: tempfirstW,
			secondWidth: tempsecondWidth,
		} );
		document.getElementById( 'left-column-width-' + uniqueID ).innerHTML = tempfirstW + '%';
		document.getElementById( 'right-column-width-' + uniqueID ).innerHTML = ( tempsecondWidth ) + '%';
		document.getElementById( 'third-right-column-width-' + uniqueID ).innerHTML = ( tempsecondWidth ) + '%';
		document.getElementById( 'third-column-width-' + uniqueID ).innerHTML = Math.abs( Math.round( ( parseFloat( tempsecondWidth ) + parseFloat( tempfirstW ) - 100 ) * 10 ) / 10 ) + '%';
	};
	const onResizeStopSecond = ( event, direction, elt ) => {
		let tempfirstW;
		let tempsecondWidth;
		let tempsecondW;
		if ( columnsUnlocked ) {
			tempfirstW = ( ! firstColumnWidth ? parseFloat( widthNumberThirds ) : firstColumnWidth );
			tempsecondW = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			tempsecondWidth = Math.round( ( tempsecondW - tempfirstW ) * 10 ) / 10;
		} else {
			tempfirstW = Math.round( ( ! firstColumnWidth ? parseFloat( widthNumberThirds ) : firstColumnWidth ) / 5 ) * 5;
			tempsecondW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			tempsecondWidth = Math.round( ( tempsecondW - tempfirstW ) / 5 ) * 5;
		}
		onSetAttributes( { firstColumnWidth: tempfirstW } );
		onSetAttributes( { secondColumnWidth: tempsecondWidth } );
		onSetState( {
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
							minWidth="10%"
							maxWidth={ ( ( realThirdsFirstWidth + realThirdsSecondWidth ) - 10 ) + '%' }
							enable={ {
								right: true,
							} }
							handleClasses={ {
								right: 'components-resizable-box__handle components-resizable-box__handle-right',
							} }
							grid={ ( columnsUnlocked ? [ width / 1000, 1 ] : [ width / 20, 1 ] ) }
							onResize={ onResizeThirds }
							onResizeStop={ onResizeStopThirds }
							axis="x"
						>
							{ columnsUnlocked && (
								<Tooltip text={ __( 'Switch to 5% step resizing', 'kadence-blocks' ) }>
									<Button
										className="kt-fluid-grid-btn"
										isSmall
										onClick={ () => onSetAttributes( { columnsUnlocked: false } ) }
									>
										{
											<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><path d="M4.217,10.611l0,2.7l-3.31,-3.311l3.31,-3.311l0,2.7l11.566,0l0,-2.7l3.31,3.311l-3.31,3.311l0,-2.7l-11.566,0Z" /></svg>
										}
									</Button>
								</Tooltip>
							) }
							{ ! columnsUnlocked && (
								<Tooltip text={ __( 'Switch to fluid resizing', 'kadence-blocks' ) }>
									<Button
										className="kt-fluid-grid-btn"
										isSmall
										onClick={ () => onSetAttributes( { columnsUnlocked: true } ) }
									>
										{
											<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="1.5">
												<path d="M13.967,10.611l0.001,-1.222l1.815,0l0,-2.7l3.31,3.311l-3.31,3.311l0,-2.7l-1.816,0Z"
												/>
												<path d="M8.918,10.611l-0.022,-1.222l2.15,0l-0.031,1.222l-2.097,0Z" />
												<path d="M4.217,10.611l0,2.7l-3.31,-3.311l3.31,-3.311l0,2.7l1.693,0l-0.028,1.222l-1.665,0Z"
												/>
												<circle cx="12.427" cy="9.997" r="1.419" fill="none" stroke="#0085ba" />
												<circle cx="7.456" cy="9.997" r="1.419" fill="none" stroke="#0085ba" />
											</svg>
										}
									</Button>
								</Tooltip>
							) }
							<span id={ `left-column-width-${ uniqueID }` } className="left-column-width-size column-width-size-handle" >
								{ ( ! firstColumnWidth ? widthNumberThirds + '%' : firstColumnWidth + '%' ) }
							</span>
							<span id={ `right-column-width-${ uniqueID }` } className="right-column-width-size column-width-size-handle" >
								{ ( ! secondColumnWidth ? secondWidthNumber + '%' : secondColumnWidth + '%' ) }
							</span>
						</ResizableBox>
						<ResizableBox
							className="editor-row-first-column__resizer second_resizer"
							size={ { width: ( ! secondColumnWidth ? Math.abs( parseFloat( secondWidthNumber ) + parseFloat( widthNumberThirds ) ) + '%' : Math.abs( parseFloat( secondColumnWidth ) + parseFloat( firstColumnWidth ) ) + '%' ) } }
							minWidth={ ( ( Math.round( ( ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth ) ) / 5 ) * 5 ) + 10 ) + '%' }
							maxWidth="90%"
							enable={ {
								right: true,
							} }
							handleClasses={ {
								right: 'components-resizable-box__handle components-resizable-box__handle-right',
							} }
							grid={ ( columnsUnlocked ? [ width / 1000, 1 ] : [ width / 20, 1 ] ) }
							onResize={ onResizeSecond }
							onResizeStop={ onResizeStopSecond }
							axis="x"
						>
							{ columnsUnlocked && (
								<Tooltip text={ __( 'Switch to 5% step resizing', 'kadence-blocks' ) }>
									<Button
										className="kt-fluid-grid-btn"
										isSmall
										onClick={ () => onSetAttributes( { columnsUnlocked: false } ) }
									>
										{
											<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414"><path d="M4.217,10.611l0,2.7l-3.31,-3.311l3.31,-3.311l0,2.7l11.566,0l0,-2.7l3.31,3.311l-3.31,3.311l0,-2.7l-11.566,0Z" /></svg>
										}
									</Button>
								</Tooltip>
							) }
							{ ! columnsUnlocked && (
								<Tooltip text={ __( 'Switch to fluid resizing', 'kadence-blocks' ) }>
									<Button
										className="kt-fluid-grid-btn"
										isSmall
										onClick={ () => onSetAttributes( { columnsUnlocked: true } ) }
									>
										{
											<svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="1.5">
												<path d="M13.967,10.611l0.001,-1.222l1.815,0l0,-2.7l3.31,3.311l-3.31,3.311l0,-2.7l-1.816,0Z"
												/>
												<path d="M8.918,10.611l-0.022,-1.222l2.15,0l-0.031,1.222l-2.097,0Z" />
												<path d="M4.217,10.611l0,2.7l-3.31,-3.311l3.31,-3.311l0,2.7l1.693,0l-0.028,1.222l-1.665,0Z"
												/>
												<circle cx="12.427" cy="9.997" r="1.419" fill="none" stroke="#0085ba" />
												<circle cx="7.456" cy="9.997" r="1.419" fill="none" stroke="#0085ba" />
											</svg>
										}
									</Button>
								</Tooltip>
							) }
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
