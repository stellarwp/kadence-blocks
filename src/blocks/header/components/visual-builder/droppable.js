import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function Droppable(props) {
	const { isOver, setNodeRef } = useDroppable({
		id: props.clientId,
	});
	const style = {
		backgroundColor: isOver ? 'rgba(0, 124, 186, 0.05)' : '',
	};

	return (
		<div className={props.classNames} ref={setNodeRef} style={style}>
			{props.children}
		</div>
	);
}
