import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { debounce } from 'lodash';
export default function DragDropContext({ children, setActiveBlockData }) {
	const getIndex = (clientId) => {
		return wp.data.select('core/block-editor').getBlockIndex(clientId);
	};

	// Action when dragging over a new drop section
	function onDragOver(event) {
		const { active, over } = event;

		if (over && active) {
			let destinationClientId = over.id;
			const currentClientID = active.id;
			const parentClientID = wp.data.select('core/block-editor').getBlockRootClientId(currentClientID);
			const newIndex = getIndex(destinationClientId);
			const currentIndex = getIndex(currentClientID);
			const destName = wp.data.select('core/block-editor').getBlockName(destinationClientId);
			const parentName = wp.data.select('core/block-editor').getBlockName(parentClientID);

			// We're moving within the same column
			if (destName !== 'kadence/header-column') {
				destinationClientId = parentClientID;
			}

			// Sorting into same position, no action needed.
			if (destinationClientId === parentClientID && newIndex === currentIndex) {
				return;
			}

			wp.data
				.dispatch('core/block-editor')
				.moveBlockToPosition(currentClientID, parentClientID, destinationClientId, newIndex);
		}
	}

	return (
		<DndContext
			onDragEnd={() => setActiveBlockData(null)}
			onDragStart={(event) => setActiveBlockData(event.active)}
			onDragOver={debounce(onDragOver, 100)}
		>
			{children}
		</DndContext>
	);
}
