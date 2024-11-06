import { __ } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';

function removeBlockByClientId(blocks, clientId) {
	let found = false;
	const newBlocks = blocks.filter((block) => {
		if (block.clientId === clientId) {
			found = true;
			return false; // Remove this block
		}
		if (block.innerBlocks && block.innerBlocks.length > 0) {
			const result = removeBlockByClientId(block.innerBlocks, clientId);
			block.innerBlocks = result.newBlocks; // Update innerBlocks with new array
			found = result.found || found;
		}
		return true;
	});
	return { newBlocks, found };
}

export default function DeleteBlockButton({ clientId }) {
	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const confirmDelete = () => {
		wp.data.dispatch('core/block-editor').removeBlock(clientId);
		closeModal();
	};

	return (
		<>
			<Button className={'block-delete'} icon="no-alt" iconSize={14} isBusy={isOpen} onClick={openModal} />
			{isOpen && (
				<Modal title={__('Delete block?')} onRequestClose={closeModal}>
					{__('This will remove the block from the header.')}
					<div style={{ marginTop: '20px' }}>
						<Button isSecondary onClick={closeModal}>
							{__('Cancel')}
						</Button>
						<Button isSecondary isDestructive onClick={confirmDelete} style={{ marginLeft: '15px' }}>
							{__('Confirm')}
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
}
