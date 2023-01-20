import classnames from 'classnames';
import {
	Button,
	Tooltip,
	ResizableBox,
} from '@wordpress/components';
import { getGutterPercentUnit, getGutterTotal, getPreviewGutterSize, getSpacingOptionOutput } from './utils';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, Fragment } from '@wordpress/element';
import ContainerDimensions from 'react-container-dimensions';
export default function TwoColumnResizer( {
	setAttributes,
	attributes,
} ) {
	const { padding, paddingUnit, firstColumnWidth, columns, columnsUnlocked, secondColumnWidth, uniqueID, columnGutter, customGutter, gutterType, colLayout, bgColor, bgImg, gradient, overlay, overlayGradient, overlayBgImg, inheritMaxWidth, maxWidth, maxWidthUnit } = attributes;
	const currentGutter = getPreviewGutterSize( 'Desktop', columnGutter, customGutter, gutterType );
	const currentGutterTotal = getGutterTotal( currentGutter, columns );
	const previewMaxWidth = ( undefined !== maxWidth ? maxWidth : '' );
	const gutterAdjuster = `0px`;
	const [ resizeStyles, setResizeStyles ] = useState( null );
	const innerResizeClasses = classnames( {
		'kt-resizeable-column-container': true,
		[ `kt-resizeable-column-container${ uniqueID }` ]: uniqueID,
		'kb-theme-content-width': inheritMaxWidth,
	} );
	let fallbackPadding = ( bgColor || bgImg || gradient || overlay || overlayGradient || overlayBgImg ? 'var(--global-row-edge-sm, 15px)' : '0px' );
	if ( inheritMaxWidth ) {
		fallbackPadding = 'var(--global-row-edge-theme, 15px)';
	}
	const fallbackVerticalPadding = 'var(--global-row-spacing-sm, 25px)';
	const onResize = ( event, direction, elt, delta ) => {
		let firstCol;
		let secondCol;
		if ( columnsUnlocked ) {
			firstCol = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			secondCol = Math.round( ( 100 - firstCol ) * 10 ) / 10;
		} else {
			firstCol = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			secondCol = 100 - ( Math.round( parseInt( elt.style.width ) / 5 ) * 5 );
		}
		editorDocument.getElementById( 'left-column-width-' + uniqueID ).innerHTML = firstCol + '%';
		editorDocument.getElementById( 'right-column-width-' + uniqueID ).innerHTML = secondCol + '%';
		setResizeStyles( `.wp-block-kadence-rowlayout.kb-row-id-${ uniqueID } > .innerblocks-wrap.kb-grid-columns-2.kt-layout-inner-wrap-id${ uniqueID } { grid-template-columns: minmax(0, calc( ${ firstCol }% - (${ currentGutterTotal } / 2 ) ) ) minmax(0, calc( ${ secondCol }% - (${ currentGutterTotal } / 2 ) ) ) !important;}` );
	};
	const onResizeStop = ( event, direction, elt, delta ) => {
		let firstCol;
		let secondCol;
		if ( columnsUnlocked ) {
			firstCol = Math.round( parseFloat( elt.style.width ) * 10 ) / 10;
			secondCol = Math.round( ( 100 - firstCol ) * 10 ) / 10;
		} else {
			firstCol = Math.round( parseInt( elt.style.width ) / 5 ) * 5;
			secondCol = 100 - ( Math.round( parseInt( elt.style.width ) / 5 ) * 5 );
		}
		setAttributes( { firstColumnWidth: firstCol } );
		setAttributes( { secondColumnWidth: secondCol } );
		setTimeout( () => {
			setResizeStyles ( null );
		}, 400 );
	};
	const widthString = `${ parseFloat( firstColumnWidth ) || colLayout }`;
	let widthNumber;
	if ( widthString == parseFloat( widthString ) ) {
		widthNumber = widthString + '%';
	} else if ( 'left-golden' === widthString ) {
		widthNumber = '66.67%';
	} else if ( 'right-golden' === widthString ) {
		widthNumber = '33.37%';
	} else {
		widthNumber = '50%';
	}
	const previewPaddingRight = (  undefined !== padding && undefined !== padding[1] ? getSpacingOptionOutput( padding[1], ( paddingUnit ? paddingUnit : 'px' ) ) : undefined );
	const previewPaddingLeft = ( undefined !== padding && undefined !== padding[3] ? getSpacingOptionOutput( padding[3], ( paddingUnit ? paddingUnit : 'px' ) ) : undefined );
	const previewPaddingTop = ( undefined !== padding && undefined !== padding[0] ? getSpacingOptionOutput( padding[0], ( paddingUnit ? paddingUnit : 'px' ) ) : undefined );
	const previewPaddingBottom = ( undefined !== padding && undefined !== padding[2] ? getSpacingOptionOutput( padding[2], ( paddingUnit ? paddingUnit : 'px' ) ) : undefined );
	const editorDocument = document.querySelector( 'iframe[name="editor-canvas"]' )?.contentWindow.document || document;
	return (
		<div className={ innerResizeClasses } style={ {
			paddingLeft: previewPaddingLeft ? previewPaddingLeft : fallbackPadding,
			paddingRight: previewPaddingRight ? previewPaddingRight : fallbackPadding,
			marginLeft: 'auto',
			marginRight: 'auto',
			paddingTop:previewPaddingTop ?previewPaddingTop : fallbackVerticalPadding,
			paddingBottom: previewPaddingBottom ? previewPaddingBottom : fallbackVerticalPadding,
			maxWidth: ! inheritMaxWidth && previewMaxWidth ? previewMaxWidth + ( maxWidthUnit ? maxWidthUnit : 'px' ) : undefined,
		} }>
			<div className='kb-inner-resize-row' style={ {
				left: previewPaddingLeft ? previewPaddingLeft : fallbackPadding,
				right: previewPaddingRight ? previewPaddingRight : fallbackPadding,
				top:previewPaddingTop ?previewPaddingTop : fallbackVerticalPadding,
				bottom: previewPaddingBottom ? previewPaddingBottom : fallbackVerticalPadding,
			} }>
				{ resizeStyles && <style>{ resizeStyles }</style> }
				<ContainerDimensions>
					{ ( { width } ) =>
						<ResizableBox
							className="editor-row-first-column__resizer"
							size={ { width: ( ! firstColumnWidth ? widthNumber : firstColumnWidth + '%' ) } }
							minWidth="10%"
							maxWidth="90%"
							snap={ ( columnsUnlocked ? { x: [ width / 2 ] } : undefined ) }
							snapGap={ ( columnsUnlocked ? 20 : undefined ) }
							enable={ {
								right: true,
							} }
							handleClasses={ {
								right: 'components-resizable-box__handle components-resizable-box__handle-right',
							} }
							handleWrapperClass="editor-row-controls-container"
							handleWrapperStyle={{
								right: gutterAdjuster,
							}}
							grid={ ( columnsUnlocked ? [ width / 1000, 1 ] : [ width / 20, 1 ] ) }
							onResize={ onResize }
							onResizeStop={ onResizeStop }
							axis="x"
						>
							<span className="editor-row-controls-container kadence-resize-extra-controls" style={{
								right: gutterAdjuster,
							}}>
								{ columnsUnlocked && (
									<Tooltip text={ __( 'Switch to 5% step resizing' ) }>
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
									<Tooltip text={ __( 'Switch to fluid resizing' ) }>
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
									{ ( ! firstColumnWidth ? widthNumber : firstColumnWidth + '%' ) }
								</span>
								<span id={ `right-column-width-${ uniqueID }` } className="right-column-width-size column-width-size-handle" >
									{ ( ! firstColumnWidth ? Math.abs( parseFloat( widthNumber ) - 100 ) + '%' : ( Math.round( ( 100 - firstColumnWidth ) * 10 ) / 10 ) + '%' ) }
								</span>
							</span>
						</ResizableBox>
					}
				</ContainerDimensions>
			</div>
		</div>
	);
}
