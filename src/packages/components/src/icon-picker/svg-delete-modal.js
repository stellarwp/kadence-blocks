import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	Modal,
} from '@wordpress/components';
import { has, get } from 'lodash';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';

export default function SvgDeleteModal( { isOpen, setIsOpen, id, callback } ) {
	const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);

	const deleteFailedSnacbkar = () => {
		createErrorNotice(__('There was an error deleting the SVG.', 'kadence-blocks'), {
			type: 'snackbar',
		});
	};

	const handleDelete = ( id ) => {
		const apiId = ('' + id).replace(/^kb-custom-/, '');
		apiFetch({
			path: `/wp/v2/kadence_custom_svg/${apiId}`,
			method: 'DELETE',
		}).then((response) => {
			if ( get( response, 'id', false ) ) {
				createSuccessNotice(__('SVG Deleted.', 'kadence-blocks'), {
					type: 'snackbar',
				});
				callback();
			} else if (has(response, 'error') && has(response, 'message')) {
				console.log(response.message);
				deleteFailedSnacbkar();
			} else {
				console.log('An error occurred when delete your svg');
				deleteFailedSnacbkar();
			}
		}).catch((error) => {
			console.log(error);
			deleteFailedSnacbkar();
		});
	};

	return (
		<>
			{isOpen && id !== null && (
				<Modal title={__( 'Delete SVG' )} onRequestClose={() => setIsOpen( false )}>

					<Button isSecondary={true} onClick={() => setIsOpen( false )}>{__( 'Cancel', 'kadence-blocks' )}</Button>
					<Button isDestructive={true} onClick={() => {
						handleDelete( id );
						setIsOpen( false );
					}}>{__( 'Delete', 'kadence-blocks' )}</Button>
				</Modal>
			)}
		</>
	);

}
