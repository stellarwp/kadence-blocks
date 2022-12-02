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
	Icon,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { dragHandle } from '@wordpress/icons';
import {
	Fragment,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';
import { withSelect, withDispatch, useSelect, useDispatch } from '@wordpress/data';
import Draggable from 'react-draggable';
/**
 * Build the row edit
 */
function ResizeGridSection( props ) {
	const { attributes, setAttributes, clientId, parentBlock, parentBlockClientId, context } = props;
	const [ moveGrid, setMoveGrid ] = useState( [55, 35] );
	const [ gridArea, setGridArea ] = useState( ( attributes.gridArea ? attributes.gridArea : '2/5/4/10' ) );
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
		top: previewDevice === 'Desktop' ? true : false,
		bottom: previewDevice === 'Desktop' ? true : false,
	} ), [ previewDevice ] );
	const dragStartEvent = ( event ) => {
		console.log( 'dragStartEvent' );
		// const parentEl = document.querySelector( `[data-block="${ parentBlockClientId }"] > .kb-grid-layout-container-inner` )
		// const parentWidth = parentEl.clientWidth/12;
		// const parentHeight = parentEl.clientHeight/6;
		// console.log( parentEl.clientWidth );
		// setMoveGrid( [parentWidth, parentHeight ])
	}
	const dragEndEvent = ( event ) => {
		console.log( event )
	}
	const draggingEvent = ( event ) => {
		console.log( event )
	}
	const onResize = ( event ) => {
		console.log( event )
		const parentEl = document.querySelector( `[data-block="${ parentBlockClientId }"] > .innerblocks-wrap` )
		const parentWidth = parentEl.clientWidth/12;
		const parentHeight = parentEl.clientHeight/6;
		console.log( parentEl.clientWidth );
		setMoveGrid( [parentWidth, parentHeight ])
	}
	const onResizeStop = ( event ) => {
		console.log( event )
	}
	let displayGrid = false;
	if ( undefined !== context.allowResize && false === context.allowResize ) {
		displayGrid = true;
	}
	if ( ! displayGrid ) {
		return props.children;
	}
	return (
		<Draggable
			bounds="parent"
			handle=".grid-section-move-handle"
			defaultPosition={{x: 0, y: 0}}
			position={null}
			grid={moveGrid}
			scale={1}
			onStart={( value ) => {
				const parentEl = document.querySelector( `[data-block="${ parentBlockClientId }"] > .innerblocks-wrap` )
				console.log( parentEl );
				const parentWidth = parentEl.clientWidth/12;
				const parentHeight = parentEl.clientHeight/6;
				console.log( parentEl.clientWidth );
				setMoveGrid( [parentWidth, parentHeight ])
			}}
			onDrag={ ( value ) => {
				console.log( 'DRAG' );
				console.log( value );
				console.log( value.movementX );
				const parentEl = document.querySelector( `[data-block="${ parentBlockClientId }"] > .innerblocks-wrap` )
				const parentWidth = parentEl.clientWidth/12;
				const parentHeight = parentEl.clientHeight/6;
				setMoveGrid( [parentWidth, parentHeight ]);
				const grid = gridArea.split("/");
				console.log( grid );
				let vstart = grid[0];
				let vend = grid[2];
				let xstart = grid[1];
				let xend = grid[3];
				if ( 0 != value.movementY ) {
					vstart = Number( vstart ) + value.movementY;
					vend = Number( vend ) + value.movementY;
				}
				if ( 0 != value.movementX ) {
					xstart =Number( xstart ) + value.movementX;
					xend = Number( xend ) + value.movementX;
				}
				const final = vstart + '/' + xstart + '/' + vend + '/' + xend;
				console.log( final );
				setGridArea( final );
			}}
			onStop={( value ) => {
				// console.log( 'STOP' );
				// console.log( value );
				// const parentEl = document.querySelector( `[data-block="${ parentBlockClientId }"] > .innerblocks-wrap` )
				// const parentWidth = parentEl.clientWidth/12;
				// const parentHeight = parentEl.clientHeight/6;
				// setMoveGrid( [parentWidth, parentHeight ])
			}}
			>
				<ResizableBox
					className="grid-section-handle"
					style={{
						gridArea: gridArea,
						width: 'auto',
						height: 'auto',
						transform: 'none !important',
					}}
					enable={ enable }
					handleClasses={ {
						right: 'grid-section-handle-x grid-section-handle-right',
						left: 'grid-section-handle-x grid-section-handle-left',
						top: 'grid-section-handle-top',
						bottom: 'grid-section-handle-bottom',
					} }
					handleWrapperClass="grid-section-handle-container"
					grid={ moveGrid }
					onResize={ onResize }
					onResizeStop={ onResizeStop }
				>
				{ props.children }
				<span className="grid-section-move-handle">
					{ 'Move' }
					<Icon icon={dragHandle}/>
				</span>
			</ResizableBox>
		</Draggable>
	);
}
export default compose( [
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps;
		const {
			getBlocksByClientId,
			getBlockRootClientId,
		} = select( 'core/block-editor' );
		const rootID = getBlockRootClientId( clientId )
		const parentBlock = getBlocksByClientId( rootID );
		return {
			parentBlockClientId: rootID,
			parentBlock: parentBlock,
		};
	} ),
] )( ResizeGridSection );
