import { useState } from '@wordpress/element';
import { plus } from '@wordpress/icons';
import { Button, Modal, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';

export default function CreateNew() {
	const { saveEntityRecord } = useDispatch('core');

	const [isOpen, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const createMenu = async () => {
		try {
			await saveEntityRecord('postType', 'kadence_navigation', {
				status: 'publish',
				title,
			});
		} catch (error) {
			console.error('Error creating post:', error);
		}

		closeModal();
	};

	return (
		<>
			<Button className="create-menu-button" icon={plus} onClick={openModal}>
				{__('Create New Menu', 'kadence-blocks')}
			</Button>

			{isOpen && (
				<Modal title={__('Creating new menu', 'kadence-blocks')} onRequestClose={closeModal}>
					<TextControl
						label={__('Menu Title', 'kadence-blocks')}
						value={title}
						onChange={(value) => setTitle(value)}
					/>

					<div style={{ marginTop: '15px' }}>
						<Button isTertiary onClick={closeModal} style={{ marginRight: '20px' }}>
							Cancel
						</Button>
						<Button isPrimary onClick={() => createMenu()} isDisabled={name === ''}>
							Create
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
}
