/**
 * BLOCK: Kadence Block Template
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { isEmpty, get } from 'lodash';

import {
	useBlockProps,
	RichText,
	store as blockEditorStore,
	InspectorControls,
	BlockControls,
	InnerBlocks,
	useInnerBlocksProps,
	BlockEditorProvider,
} from '@wordpress/block-editor';
import {
	Placeholder,
	Spinner,
} from '@wordpress/components';
import { select, useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useEntityAutoDraft } from './hooks';
import { SelectOrCreatePlaceholder } from './components';
import { useCallback } from '@wordpress/element';

import {
	store as coreStore,
	EntityProvider,
	useEntityBlockEditor,
	useEntityProp,
} from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import EditInner from './edit-inner';

const ktUniqueIDs = [];

export function Edit( props ) {

	const {
		attributes,
		setAttributes,
		className,
		previewDevice,
		context,
		clientId,
		direct = false
	} = props;

	const {
		id,
		uniqueID,
	} = attributes;

	const { post, currentPostType, parentAttributes } = useSelect(
		( select ) => ( {
			post            :
				id &&
				select( coreStore ).getEntityRecord(
					'postType',
					'kadence_form',
					id,
				),
			currentPostType : select( editorStore ).getCurrentPostType(),
			parentAttributes: select( editorStore ).getBlockAttributes( clientId ),
		} ),
		[ id ],
	);

	const blockProps = useBlockProps( {
		className: classnames( className, {
			'test': true,
		} ),
	} );

	const [ status, setStatus ] = useFormProp( 'status', id );



	if ( currentPostType === 'kadence_form' || direct ) {
		console.log( 'Directly Editing Form' );

		const [ attrs, setAttrs ] = useFormMeta( 'kadence_form_attrs' );

		console.log( 'status', status );
		console.log( 'attrs', attrs );

		return (
			<div {...blockProps}>
				<EditInner
					attributes={attributes}
					setAttributes={setAttributes}
					className={className}
					previewDevice={previewDevice}
					clientId={clientId}
					directlyEditing={true}
					id={id}
				/>
			</div>
		);
	}

	// if ( !uniqueID ) {
	// 	const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
	// 	if ( blockConfigObject[ 'kadence/block-template' ] !== undefined && typeof blockConfigObject[ 'kadence/block-template' ] === 'object' ) {
	// 		Object.keys( blockConfigObject[ 'kadence/block-template' ] ).map( ( attribute ) => {
	// 			uniqueID = blockConfigObject[ 'kadence/block-template' ][ attribute ];
	// 		} );
	// 	}
	// 	setAttributes( {
	// 		uniqueID: '_' + clientId.substr( 2, 9 ),
	// 	} );
	// 	ktUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
	// } else if ( ktUniqueIDs.includes( uniqueID ) ) {
	// 	setAttributes( {
	// 		uniqueID: '_' + clientId.substr( 2, 9 ),
	// 	} );
	// 	ktUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
	// } else {
	// 	ktUniqueIDs.push( uniqueID );
	// }

	console.log( 'This ID: ' + id + ' ---- Parent ID: ' + parentAttributes.id );

	if ( id > 0 && !isEmpty( post ) ) {
		const [ attrs, setAttrs ] = useFormMeta( 'kadence_form_attrs' );

		console.log( 'status', status );
		console.log( 'attrs', attrs );
	}

	return (
		<div {...blockProps}>

			{id === 0 && (
				<>
					<Chooser
						id={id}
						post={post}
						commit={( nextId ) => setAttributes( { id: nextId } )}
					/>
				</>
			)}

			{id > 0 && isEmpty( post ) && (
				<Placeholder
					label={__( 'Loading Form', 'kadence_form' )}
					icon="testimonial"
				>
					<Spinner/>
				</Placeholder>
			)}
			{id > 0 && !isEmpty( post ) && (
				<EntityProvider kind="postType" type="kadence_form" id={id}>
					Hello {id}
					{/*<PostContentInnerBlocks postId={id} {...props} />*/}
					{/*<EditInner*/}
					{/*	attributes={attributes}*/}
					{/*	setAttributes={setAttributes}*/}
					{/*	className={className}*/}
					{/*	previewDevice={previewDevice}*/}
					{/*	clientId={clientId}*/}
					{/*	id={ id }*/}
					{/*/>*/}
				</EntityProvider>
			)}

			{/*{parentAttributes.id !== 0 && (*/}
			{/*	<EditInner*/}
			{/*		attributes={attributes}*/}
			{/*		setAttributes={setAttributes}*/}
			{/*		className={className}*/}
			{/*		previewDevice={previewDevice}*/}
			{/*		clientId={clientId}*/}
			{/*		id={id}*/}
			{/*	/>*/}
			{/*)}*/}
		</div>
	);
}

export default ( Edit );

function PostContentInnerBlocks( props ) {

	const { postId, attributes, setAttributes } = props;

	const [ blocks, updateBlocks ] = useEntityBlockEditor(
		'postType',
		'kadence_form',
		{ id: postId },
	);

	/*
	 *	Shows all innerBlocks in Sidebar, but no content in the editor
	 */
	return (
		<InnerBlocks
			value={blocks}
			onInput={updateBlocks}
			onChange={updateBlocks}
		/>
	);

	/*
	 *	Shows content in editor, but onChange functions are not valid for this
	 */
	// return (
	// 	<InnerBlocks
	// 		value={ get( blocks, [ 0, 'innerBlocks' ], [] ) }
	// 		onInput={updateBlocks}
	// 		onChange={updateBlocks}
	// 	/>
	// );

	return (
		<BlockEditorProvider
			value={blocks}
			onInput={updateBlocks}
			onChange={updateBlocks}
		>
			<InnerBlocks
				value={get( blocks, [ 0, 'innerBlocks' ], [] )}
				onInput={updateBlocks}
				onChange={updateBlocks}
			/>
		</BlockEditorProvider>
	);

}

function useFormProp( prop, postId ) {
	return useEntityProp( 'postType', 'kadence_form', prop, { id: postId } );
}

function useFormMeta( key ) {
	const [ meta, setMeta ] = useFormProp( 'meta' );
	return [
		meta[ key ],
		useCallback(
			( newValue ) => {
				setMeta( {
					[ key ]: newValue,
				} );
			},
			[ key, setMeta ],
		),
	];
}

function Chooser( { id, post, commit } ) {
	const [ isAdding, addNew ] = useEntityAutoDraft( 'kadence-blocks/v1', 'kadence_form' );
	const onAdd = async () => {
		try {
			const response = await addNew();
			commit( response.id );
		} catch ( error ) {
			// Todo: Implement error handling.
			// eslint-disable-next-line no-console
			console.error( error );
		}
	};

	return (
		<SelectOrCreatePlaceholder
			postType="kadence_form"
			icon="testimonial"
			label={__( 'Form', 'kadence_form' )}
			instructions={__(
				'Select an existing form or create a new one.',
				'kadence_form',
			)}
			placeholder={__( 'Select Form', 'kadence_form' )}
			onSelect={commit}
			isSelecting={id && isEmpty( post )}
			onAdd={onAdd}
			isAdding={isAdding}
		/>
	);
}
