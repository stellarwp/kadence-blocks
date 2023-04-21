import { registerPlugin } from '@wordpress/plugins';
import { useSelect, useDispatch } from '@wordpress/data';
import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { get, startsWith } from 'lodash';

const RenameBlockMenuItem = () => {
	const { getBlock } = useSelect( 'core/block-editor' );
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	const handleRenameClick = ( block ) => {
		const newBlockName = prompt( __( 'Select a new name for this block', 'kadence-blocks' ), block.attributes.metadata.name || '' );

		if ( newBlockName !== null ) {
			updateBlockAttributes( block.clientId, { metadata: { ...block.attributes.metadata, name: newBlockName } } );
		}
	};

	return (
		<BlockSettingsMenuControls>
			{( props ) => {
				const { selectedClientIds, selectedBlocks, onClose } = props;

				if ( selectedClientIds.length !== 1 || !startsWith( get( selectedBlocks, [ 0 ] ), 'kadence' ) ) {
					return null;
				}

				return (
					<MenuItem
						onClick={() => {
							handleRenameClick( getBlock( selectedClientIds[ 0 ] ) );
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
	);

};

registerPlugin( 'kadence-block-rename', {
	render: RenameBlockMenuItem,
} );
