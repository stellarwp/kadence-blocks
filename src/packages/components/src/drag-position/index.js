/**
 * Drag Position Component.
 */

import { Icon } from '@wordpress/components';
import { dragHandle } from '@wordpress/icons';
import { useEffect, useMemo, useState, useRef } from '@wordpress/element';
import { withSelect, withDispatch, useSelect, useDispatch } from '@wordpress/data';
import Draggable from 'react-draggable';

import "./editor.scss";
/**
 * Build the row edit
 */
function DragPosition(props) {
	const { attributes, setAttributes, clientId, context } = props;
	const [moveGrid, setMoveGrid] = useState([25, 25]);
	const [transform, setTransform] = useState(attributes?.dragTransform ? attributes.dragTransform : [0, 0]);
	const ref = useRef();
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);
	useEffect(() => {
		console.log('transfrom', attributes?.dragTransform);
		console.log('transfromState', transform);
	}, [clientId]);
	let displayGrid = true;
	let displayHandle = true;
	// if (undefined !== context.gridResize && false === context.gridResize) {
	// 	displayGrid = true;
	// }
	if (!displayGrid) {
		return props.children;
	}
	return (
		<Draggable
			ref={ref}
			handle=".kb-drag-position-move-handle"
			defaultPosition={{ x: transform[0], y: transform[1] }}
			position={null}
			grid={moveGrid}
			scale={1}
			onStart={(value, ui) => {
				console.log(attributes.dragTransform);
				console.log(value);
			}}
			onDrag={(value, ui) => {
				setTransform([ui.x, ui.y]);
				console.log('DRAG');
				console.log(value);
				console.log(ui);
			}}
			onStop={(value, ui) => {
				console.log('STOP');
				console.log(value);
				console.log(ui);
				setTransform([ui.x, ui.y]);
				setAttributes({ dragTransform: [ui.x, ui.y] });
				// const parentEl = document.querySelector( `[data-block="${ parentBlockClientId }"] > .innerblocks-wrap` )
				// const parentWidth = parentEl.clientWidth/12;
				// const parentHeight = parentEl.clientHeight/6;
				// setMoveGrid( [parentWidth, parentHeight ])
			}}
			style={{ transform: `translate(${transform[0]}, ${transform[1]})` }}
		>
			<div className={`kb-drag-position-wrap ${props.className}`} style={props.style}>
				{props.children}
				{displayHandle && (
					<span className="kb-drag-position-move-handle">
						<Icon icon={dragHandle} />
					</span>
				)}
			</div>
		</Draggable>
	);
}
export default DragPosition;
