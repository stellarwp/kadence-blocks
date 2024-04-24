import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function Droppable(props) {
	const { isOver, setNodeRef } = useDroppable({
		id: props.clientId,
	});
	const style = {
		backgroundColor: isOver ? 'aqua' : '',
	};

	return (
		<div className={props.classNames} ref={setNodeRef} style={style}>
			{props.children}
		</div>
	);
}
