import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	Icon,
	Modal,
	TextareaControl,
	DropZone,
	FormFileUpload,
} from '@wordpress/components';
import { has, get } from 'lodash';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

export default function SvgDeleteModal( { isOpen, setIsOpen, id, setId, callback } ) {
	const { createSuccessNotice } = useDispatch(noticesStore);

	const deletePost = async ( id ) => {
		const response = await fetch( `/wp-json/kb-custom-svg/v1/manage/${id}`, {
			method: 'DELETE',
		} );

		if ( !response.ok ) {
			throw new Error( 'Network response was not ok' );
		}

		return response.json();
	};

	const handleDelete = ( id ) => {
		deletePost( id ).then( ( response ) => {
			if ( get( response, 'success', false ) ) {
				createSuccessNotice(__('SVG Deleted.', 'kadence-blocks'), {
					type: 'snackbar',
				});
				callback();
			}

			setId( null );
		} );

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
