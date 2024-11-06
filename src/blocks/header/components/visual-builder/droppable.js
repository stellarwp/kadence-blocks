import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import classnames from 'classnames';

export default function Droppable(props) {
	const { isOver, setNodeRef } = useDroppable({
		id: props.clientId,
	});
	const style = {
		backgroundColor: isOver ? 'rgba(0, 124, 186, 0.05)' : '',
	};

	const classNames = classnames({
		[props.classNames]: true,
		'visual-column-wrapper_is-dropping': isOver,
	});

	return (
		<div className={classNames} ref={setNodeRef} style={style}>
			{props.children}
		</div>
	);
}
