/**
 * BLOCK Section: Kadence Row / Layout Overlay
 */

 import memoize from 'memize';

 import { KadenceColorOutput, getPreviewSize } from '@kadence/helpers';

import {
	ToggleControl,
	SelectControl,
	ToolbarGroup,
	TabPanel,
	ResizableBox,
} from '@wordpress/components';
import {
	Fragment,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
/**
 * Build the row edit
 */
function ResizeColumn( props ) {
	const { attributes: { uniqueID }, setAttributes, clientId, parentBlock } = props;
	const { previewDevice } = useSelect(
		( select ) => {
			return {
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ]
	);
	const enable = useMemo( () => ( {
		right: previewDevice === 'Desktop' ? true : false,
		left: previewDevice === 'Desktop' ? true : false,
	} ), [ previewDevice ] );
	
	return (
		<ResizableBox
			className="editor-row-first-column__resizer"
			size={ { width: ( ! firstColumnWidth ? widthNumber : firstColumnWidth + '%' ) } }
			minWidth="10%"
			maxWidth="90%"
			enable={ enable }
			handleClasses={ {
				right: 'components-resizable-box__handle components-resizable-box__handle-right',
			} }
			handleWrapperClass="editor-row-controls-container"
			grid={ ( columnsUnlocked ? [ width / 1000, 1 ] : [ width / 20, 1 ] ) }
			onResize={ onResize }
			onResizeStop={ onResizeStop }
			axis="x"
		>
			<span className="editor-row-controls-container">
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
				{ props.children }
				<span id={ `left-column-width-${ uniqueID }` } className="left-column-width-size column-width-size-handle" >
					{ ( ! firstColumnWidth ? widthNumber : firstColumnWidth + '%' ) }
				</span>
				<span id={ `right-column-width-${ uniqueID }` } className="right-column-width-size column-width-size-handle" >
					{ ( ! firstColumnWidth ? Math.abs( parseFloat( widthNumber ) - 100 ) + '%' : ( Math.round( ( 100 - firstColumnWidth ) * 10 ) / 10 ) + '%' ) }
				</span>
			</span>
		</ResizableBox>
	);
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			getBlocksByClientId,
		} = select( 'core/block-editor' );
		const parentBlock = getBlocksByClientId( rootID );
		return {
			parentBlock: parentBlock,
		};
	} ),
] )( ResizeColumn );
