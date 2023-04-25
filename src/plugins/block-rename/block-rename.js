import { get, startsWith } from 'lodash';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import {
	MenuItem,
	Modal,
	TextControl,
	Button,
} from '@wordpress/components';

const RenameBlockMenuItem = () => {
	const { getBlock } = useSelect( 'core/block-editor' );
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	const [ isOpen, setOpen ] = useState( false );
	const [ block, setBlock ] = useState( null );
	const [ tmpName, setTmpName ] = useState( '' );
	const closeModal = () => setOpen( false );
	const openModal = ( blockData ) => {
		setBlock( blockData );
		setTmpName( get( blockData, [ 'attributes', 'metadata', 'name' ], '' ) );
		setOpen( true );
	};

	return (
		<>
			<BlockSettingsMenuControls>
				{( props ) => {
					const { selectedClientIds, selectedBlocks, onClose } = props;

					if ( selectedClientIds.length !== 1 || !hasBlockSupport( get( selectedBlocks, [ 0 ] ), 'kbMetadata' ) ) {
						return null;
					}

					return (
						<MenuItem
							onClick={() => {
								openModal( getBlock( selectedClientIds[ 0 ] ) );
								onClose();
							}}
							icon={'smiley'}
							iconPosition={null}
							label={'Rename'}
							role={null}
						>
							Rename
						</MenuItem>
					);
				}}
			</BlockSettingsMenuControls>

			{isOpen && (
				<Modal title={__( 'Rename Block', 'kadence-blocks' )} onRequestClose={closeModal} focusOnMount={false}>
					<TextControl
						label={__( 'Block Name', 'kadence-blocks' )}
						value={tmpName}
						autoFocus={true}
						onFocus={( event ) => event.target.select()}
						onChange={( value ) => {
							setTmpName( value );
						}}
					/>

					<div style={ { display: 'flex', flexDirection: 'row-reverse' } }>
						<Button
							isPrimary
							style={ { marginLeft: '15px' } }
							onClick={() => {
								updateBlockAttributes( block.clientId, { metadata: { ...block.attributes.metadata, name: tmpName } } );
								closeModal();
							}}>
							{__( 'Save', 'kadence-blocks' )}
						</Button>

						<Button
							isDestructive
							onClick={() => {
								closeModal();
								setTmpName( '' );
							}}>
							{__( 'Cancel', 'kadence-blocks' )}
						</Button>
					</div>
				</Modal>
			)}
		</>
	);

};

registerPlugin( 'kadence-block-rename', {
	render: RenameBlockMenuItem,
} );
