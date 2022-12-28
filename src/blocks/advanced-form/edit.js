/**
 * BLOCK: Kadence Advanced Form
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { isEmpty } from 'lodash';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { advancedFormIcon } from '@kadence/icons';

import { useBlockProps } from '@wordpress/block-editor';
import {
	Placeholder,
	Spinner,
} from '@wordpress/components';
import {
	store as coreStore,
	EntityProvider,
} from '@wordpress/core-data';

import { useEntityAutoDraft } from './hooks';
import { SelectOrCreatePlaceholder } from './components';

/**
 * Internal dependencies
 */
import EditInner from './edit-inner';
import { useEffect } from '@wordpress/element';

export function Edit( props ) {

	const {
		attributes,
		setAttributes,
		clientId,
	} = props;

	const { id, uniqueID } = attributes;

	const blockProps = useBlockProps();

	const { post, currentPostType } = useSelect(
		( select ) => ( {
			post:
				id &&
				select( coreStore ).getEditedEntityRecord(
					'postType',
					'kadence_form',
					id,
				),
			currentPostType: select( editorStore ).getCurrentPostType(),
		} ),
		[ id ],
	);

	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		let smallID = '_' + clientId.substr( 2, 9 );
		if ( ! uniqueID ) {
			if ( ! isUniqueID( smallID ) ) {
				smallID = uniqueId( smallID );
			}
			setAttributes( {
				uniqueID: smallID,
			} );
			addUniqueID( smallID, clientId );
		} else if ( ! isUniqueID( uniqueID ) ) {
			// This checks if we are just switching views, client ID the same means we don't need to update.
			if ( ! isUniqueBlock( uniqueID, clientId ) ) {
				attributes.uniqueID = smallID;
				addUniqueID( smallID, clientId );
			}
		} else {
			addUniqueID( uniqueID, clientId );
		}
	}, [] );

	{/* Directly editing from via kadence_form post type */}
	if ( currentPostType === 'kadence_form' ) {
		return (
			<div {...blockProps}>
				<EditInner {...props} direct={true} id={ id }/>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			{/* No form selected, display chooser */}
			{id === 0 && (
				<Chooser
					id={id}
					post={post}
					commit={( nextId ) => setAttributes( { id: nextId } )}
				/>
			)}

			{/* Form selected but not loaded yet, show spinner */}
			{id > 0 && isEmpty( post ) && (
				<Placeholder
					className="kb-select-or-create-placeholder"
					label={__( 'Kadence Form', 'kadence-form' )}
					icon={ advancedFormIcon }
				>
					<Spinner/>
				</Placeholder>
			)}

			{id > 0 && !isEmpty( post ) && post.status === "trash" && (
				<>
					<Placeholder
						className="kb-select-or-create-placeholder"
						label={__( 'Kadence Form', 'kadence-blocks' )}
						icon={ advancedFormIcon }
					>
						{ __( 'The selected from is in the trash.', 'kadence-blocks' ) }
					</Placeholder>
				</>
			)}

			{/* Form selected and loaded, display form */}
			{id > 0 && !isEmpty( post ) && post.status !== 'trash' && (
				<EntityProvider kind="postType" type="kadence_form" id={id}>
					<EditInner {...props} direct={false} id={id}/>
				</EntityProvider>
			)}
		</div>
	);
}

export default ( Edit );

function Chooser( { id, post, commit } ) {
	const [ isAdding, addNew ] = useEntityAutoDraft( 'kadence_form', 'kadence_form' );
	const onAdd = async () => {
		try {
			const response = await addNew();
			commit( response.id );
		} catch ( error ) {
			console.error( error );
		}
	};

	return (
		<SelectOrCreatePlaceholder
			postType="kadence_form"
			label={__( 'Kadence Form', 'kadence-blocks' )}
			instructions={__(
				'Select an existing form or create a new one.',
				'kadence-blocks',
			)}
			placeholder={__( 'Select Form', 'kadence-blocks' )}
			onSelect={commit}
			isSelecting={id && isEmpty( post )}
			onAdd={onAdd}
			isAdding={isAdding}
		/>
	);
}
