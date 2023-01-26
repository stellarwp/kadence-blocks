import {
	Button,
	Tooltip,
	ResizableBox,
} from '@wordpress/components';
import {isRTL} from '@kadence/helpers';
import classnames from 'classnames';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { getPreviewGutterSize, getGutterTotal } from './utils';
import ContainerDimensions from 'react-container-dimensions';
export default function ThreeColumnDrag( {
	attributes,
	setAttributes,
	secondWidthString,
} ) {
	const { padding, paddingUnit, firstColumnWidth, columns, columnsUnlocked, secondColumnWidth, uniqueID, columnGutter, customGutter, gutterType, colLayout, bgColor, bgImg, gradient, overlay, overlayGradient, overlayBgImg, inheritMaxWidth, maxWidthUnit, maxWidth } = attributes;
	const currentGutter = getPreviewGutterSize( 'Desktop', columnGutter, customGutter, gutterType );
	const currentGutterTotal = getGutterTotal( currentGutter, columns );
	const gutterAdjuster = `calc( ( ${currentGutter} / 3 ) / 2)`;
	const secondGutterAdjuster = `calc( -1 * ( ( ${currentGutter} / 3 ) / 2 ))`;
	const [ resizeStyles, setResizeStyles ] = useState( null );
	const editorDocument = document.querySelector( 'iframe[name="editor-canvas"]' )?.contentWindow.document || document;
	const widthString = `${ parseFloat( firstColumnWidth ) || colLayout }`;
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
	let fallbackPadding = ( bgColor || bgImg || gradient || overlay || overlayGradient || overlayBgImg ? 'var(--global-row-edge-sm, 15px)' : '0px' );
	if ( inheritMaxWidth ) {
		fallbackPadding = 'var(--global-row-edge-theme, 15px)';
	}
	const firstRoundDown = ( '33.3' === widthNumberThirds ? 30 : parseFloat( widthNumberThirds ) );
	const realThirdsFirstWidth = ( ! firstColumnWidth ? firstRoundDown : firstColumnWidth );
	const secondRoundDown = ( '33.3' === secondWidthNumber ? 30 : parseFloat( secondWidthNumber ) );
	const realThirdsSecondWidth = ( ! secondColumnWidth ? secondRoundDown : secondColumnWidth );
	const onResizeThirds = ( event, direction, elt ) => {
		let tempFirstW;
		let tempChange;
		let tempSecondW;
		if ( columnsUnlocked ) {
			tempFirstW = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			tempChange = tempFirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
			tempSecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) * 10 ) / 10;
		} else {
			tempFirstW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			tempChange = tempFirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
			tempSecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) / 5 ) * 5;
		}
		let tempThird = Math.abs( Math.round( ( ( tempSecondW + tempFirstW ) - 100 ) * 10 ) / 10 );

		//set text width percentages on resizer flags
		editorDocument.getElementById( 'left-column-width-' + uniqueID ).innerHTML = tempFirstW + '%';
		editorDocument.getElementById( 'right-column-width-' + uniqueID ).innerHTML = tempSecondW + '%';
		editorDocument.getElementById( 'third-right-column-width-' + uniqueID ).innerHTML = tempSecondW + '%';
		editorDocument.getElementById( 'third-column-width-' + uniqueID ).innerHTML = Math.abs( Math.round( ( ( tempSecondW + tempFirstW ) - 100 ) * 10 ) / 10 ) + '%';

		//set the temp resized styles on underlying columns
		setResizeStyles( `.wp-block-kadence-rowlayout.kb-row-id-${ uniqueID } > .innerblocks-wrap.kb-grid-columns-3.kt-layout-inner-wrap-id${ uniqueID } { grid-template-columns: minmax(0, calc( ${ tempFirstW }% - (${ currentGutterTotal } / 3 ) ) ) minmax(0, calc( ${ tempSecondW }% - (${ currentGutterTotal } / 3 ) ) )  minmax(0, calc( ${ tempThird }% - (${ currentGutterTotal } / 3 ) ) ) !important;}` );
	};
	const onResizeStopThirds = ( event, direction, elt ) => {
		let tempFirstW;
		let tempChange;
		let tempSecondW;
		if ( columnsUnlocked ) {
			tempFirstW = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			tempChange = tempFirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
			tempSecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) * 10 ) / 10;
		} else {
			tempFirstW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			tempChange = tempFirstW - ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth );
			tempSecondW = Math.round( Math.abs( ( ! secondColumnWidth ? secondWidthNumber : secondColumnWidth ) - tempChange ) / 5 ) * 5;
		}
		let tempThird = Math.abs( Math.round( ( ( tempSecondW + tempFirstW ) - 100 ) * 10 ) / 10 );

		setAttributes( { firstColumnWidth: tempFirstW, secondColumnWidth: tempSecondW } );
		setTimeout( () => {
			setResizeStyles ( null );
		}, 400 );
	};
	const onResizeSecond = ( event, direction, elt ) => {
		let tempFirstW;
		let tempSecondWidth;
		let tempSecondW;
		if ( columnsUnlocked ) {
			tempFirstW = ( ! firstColumnWidth ? parseFloat( widthNumberThirds ) : firstColumnWidth );
			tempSecondW = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			tempSecondWidth = Math.round( ( tempSecondW - tempFirstW ) * 10 ) / 10;
		} else {
			tempFirstW = Math.round( ( ! firstColumnWidth ? parseFloat( widthNumberThirds ) : firstColumnWidth ) / 5 ) * 5;
			tempSecondW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			tempSecondWidth = Math.round( ( tempSecondW - tempFirstW ) / 5 ) * 5;
		}
		let tempThird = Math.abs( Math.round( ( ( tempSecondWidth + tempFirstW ) - 100 ) * 10 ) / 10 );

		//set text width percentages on resizer flags
		editorDocument.getElementById( 'left-column-width-' + uniqueID ).innerHTML = tempFirstW + '%';
		editorDocument.getElementById( 'right-column-width-' + uniqueID ).innerHTML = ( tempSecondWidth ) + '%';
		editorDocument.getElementById( 'third-right-column-width-' + uniqueID ).innerHTML = ( tempSecondWidth ) + '%';
		editorDocument.getElementById( 'third-column-width-' + uniqueID ).innerHTML = Math.abs( Math.round( ( parseFloat( tempSecondWidth ) + parseFloat( tempFirstW ) - 100 ) * 10 ) / 10 ) + '%';

		//set the temp resized styles on underlying columns
		setResizeStyles( `.wp-block-kadence-rowlayout.kb-row-id-${ uniqueID } > .innerblocks-wrap.kb-grid-columns-3.kt-layout-inner-wrap-id${ uniqueID } { grid-template-columns: minmax(0, calc( ${ tempFirstW }% - (${ currentGutterTotal } / 3 ) ) ) minmax(0, calc( ${ tempSecondWidth }% - (${ currentGutterTotal } / 3 ) ) )  minmax(0, calc( ${ tempThird }% - (${ currentGutterTotal } / 3 ) ) ) !important;}` );
	};
	const onResizeStopSecond = ( event, direction, elt ) => {
		let tempFirstW;
		let tempSecondWidth;
		let tempSecondW;
		if ( columnsUnlocked ) {
			tempFirstW = ( ! firstColumnWidth ? parseFloat( widthNumberThirds ) : firstColumnWidth );
			tempSecondW = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			tempSecondWidth = Math.round( ( tempSecondW - tempFirstW ) * 10 ) / 10;
		} else {
			tempFirstW = Math.round( ( ! firstColumnWidth ? parseFloat( widthNumberThirds ) : firstColumnWidth ) / 5 ) * 5;
			tempSecondW = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			tempSecondWidth = Math.round( ( tempSecondW - tempFirstW ) / 5 ) * 5;
		}

		setAttributes( { firstColumnWidth: tempFirstW, secondColumnWidth: tempSecondWidth } );
		setTimeout( () => {
			setResizeStyles ( null );
		}, 400 );
	};
	const previewPaddingRight = (  undefined !== padding && undefined !== padding[1] ? padding[1] : undefined );
	const previewPaddingLeft = ( undefined !== padding && undefined !== padding[3] ? padding[3] : undefined );
	const previewMaxWidth = ( undefined !== maxWidth ? maxWidth : '' );
	const innerResizeClasses = classnames( {
		'kt-resizeable-column-container': true,
		[ `kt-resizeable-column-container${ uniqueID }` ]: uniqueID,
		'kb-theme-content-width': inheritMaxWidth,
	} );
	return (
		<div className={ innerResizeClasses } style={ {
			paddingLeft: previewPaddingLeft ? previewPaddingLeft + ( paddingUnit ? paddingUnit : 'px' ) : fallbackPadding,
			paddingRight: previewPaddingRight ? previewPaddingRight + ( paddingUnit ? paddingUnit : 'px' ) : fallbackPadding,
			marginLeft: 'auto',
			marginRight: 'auto',
			maxWidth: ! inheritMaxWidth && previewMaxWidth ? previewMaxWidth + maxWidthUnit : undefined,
		} }>
			<div className='kb-inner-resize-row' style={ {
				left: previewPaddingLeft ? previewPaddingLeft + ( paddingUnit ? paddingUnit : 'px' ) : fallbackPadding,
				right: previewPaddingRight ? previewPaddingRight + ( paddingUnit ? paddingUnit : 'px' ) : fallbackPadding,
			} }>
				{ resizeStyles && <style>{ resizeStyles }</style> }
				<ContainerDimensions>
					{ ( { width } ) =>
						<>
							<ResizableBox
								className="editor-row-first-column__resizer"
								size={ { width: ( ! firstColumnWidth ? widthNumberThirds + '%' : firstColumnWidth + '%' ) } }
								minWidth="10%"
								maxWidth={ ( ( realThirdsFirstWidth + realThirdsSecondWidth ) - 10 ) + '%' }
								enable={ {
									right: isRTL ? false : true,
									left: isRTL ? true : false,
								} }
								handleClasses={ {
									right: 'components-resizable-box__handle components-resizable-box__handle-right',
									left: 'components-resizable-box__handle components-resizable-box__handle-left',
								} }
								handleWrapperClass="editor-row-controls-container"
								handleWrapperStyle={{
									right: isRTL ? undefined : gutterAdjuster,
									left: isRTL ? gutterAdjuster : undefined,
								}}
								grid={ ( columnsUnlocked ? [ width / 1000, 1 ] : [ width / 20, 1 ] ) }
								onResize={ onResizeThirds }
								onResizeStop={ onResizeStopThirds }
								axis="x"
							>
								<span className="editor-row-controls-container kadence-resize-extra-controls" style={{
									right: isRTL ? undefined : gutterAdjuster,
									left: isRTL ? gutterAdjuster : undefined,
								}}>
									{ columnsUnlocked && (
										<Tooltip text={ __( 'Switch to 5% step resizing', 'kadence-blocks' ) }>
											<Button
												className="kt-fluid-grid-btn"
												isSmall
												onClick={ () => setAttributes( { columnsUnlocked: false } ) }
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
												onClick={ () => setAttributes( { columnsUnlocked: true } ) }
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
								</span>
							</ResizableBox>
							<ResizableBox
								className="editor-row-first-column__resizer second_resizer"
								size={ { width: ( ! secondColumnWidth ? Math.abs( parseFloat( secondWidthNumber ) + parseFloat( widthNumberThirds ) ) + '%' : Math.abs( parseFloat( secondColumnWidth ) + parseFloat( firstColumnWidth ) ) + '%' ) } }
								minWidth={ ( ( Math.round( ( ( ! firstColumnWidth ? widthNumberThirds : firstColumnWidth ) ) / 5 ) * 5 ) + 10 ) + '%' }
								maxWidth="90%"
								enable={ {
									right: isRTL ? false : true,
									left: isRTL ? true : false,
								} }
								handleClasses={ {
									right: 'components-resizable-box__handle components-resizable-box__handle-right',
									left: 'components-resizable-box__handle components-resizable-box__handle-left',
								} }
								handleWrapperClass="editor-row-controls-container"
								handleWrapperStyle={{
									right: isRTL ? undefined : secondGutterAdjuster,
									left: isRTL ? secondGutterAdjuster : undefined,
								}}
								grid={ ( columnsUnlocked ? [ width / 1000, 1 ] : [ width / 20, 1 ] ) }
								onResize={ onResizeSecond }
								onResizeStop={ onResizeStopSecond }
								axis="x"
							>
								<span className="editor-row-controls-container kadence-resize-extra-controls" style={{
									right: isRTL ? undefined : secondGutterAdjuster,
									left: isRTL ? secondGutterAdjuster : undefined,
								}}>
									{ columnsUnlocked && (
										<Tooltip text={ __( 'Switch to 5% step resizing', 'kadence-blocks' ) }>
											<Button
												className="kt-fluid-grid-btn"
												isSmall
												onClick={ () => setAttributes( { columnsUnlocked: false } ) }
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
												onClick={ () => setAttributes( { columnsUnlocked: true } ) }
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
								</span>
							</ResizableBox>
						</>
					}
				</ContainerDimensions>
			</div>
		</div>
	);
}
