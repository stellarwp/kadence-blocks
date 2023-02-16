/**
 * WordPress dependencies
 */
 import { registerPlugin } from '@wordpress/plugins';
 import {
	withDispatch,
} from '@wordpress/data';
import {
    useEffect,
    useState,
	render,
} from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock, isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import {
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import {
	Button,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { SafeParseJSON, showSettings } from '@kadence/helpers';
import { kadenceBlocksIcon } from '@kadence/icons';
/**
 * Add Prebuilt Library button to Gutenberg toolbar
 */
function ToolbarLibrary() {
	// const [ borderWidthControl, setBorderWidthControl ] = useState( 'individual' );
	// const [ borderRadiusControl, setBorderRadiusControl ] = useState( 'linked' );
	const { getSelectedBlock, getBlockIndex, getBlockHierarchyRootClientId } = useSelect( blockEditorStore );
	const {
		replaceBlocks,
		insertBlocks,
	} = useDispatch( blockEditorStore );
	const LibraryButton = () => (
		<Button
			className="kb-toolbar-prebuilt-button"
			icon={ kadenceBlocksIcon }
			isPrimary
			onClick={ () => {
				const selectedBlock = getSelectedBlock();
				if ( selectedBlock && isUnmodifiedDefaultBlock( selectedBlock ) ) {
					replaceBlocks(
						selectedBlock.clientId,
						createBlock( 'kadence/rowlayout', {
							isPrebuiltModal: true,
							noCustomDefaults: true,
						} ),
						null,
						0,
					);
				} else if ( selectedBlock ) {
					const destinationRootClientId = getBlockHierarchyRootClientId(selectedBlock.clientId);
					let destinationIndex = 0;
					if ( destinationRootClientId ) {
						destinationIndex = getBlockIndex( destinationRootClientId ) + 1;
					} else {
						destinationIndex = getBlockIndex( selectedBlock.clientId ) + 1;
					}
					insertBlocks(
						createBlock( 'kadence/rowlayout', {
							isPrebuiltModal: true,
							noCustomDefaults: true,
						} ),
						destinationIndex,
					);
				} else {
					insertBlocks(
						createBlock( 'kadence/rowlayout', {
							isPrebuiltModal: true,
							noCustomDefaults: true,
						} ),
					);
				}
			} }
		>
			{ __( 'Design Library', 'kadence-blocks' ) }
		</Button>
	);
	const checkElement = async selector => {
		while ( document.querySelector(selector) === null) {
			await new Promise( resolve => requestAnimationFrame( resolve ) )
		}
		return document.querySelector(selector);
	}
	const renderButton = () => {
		checkElement( '.edit-post-header-toolbar' ).then( ( selector ) => {
			if ( ! selector.querySelector( '.kadence-toolbar-design-library' ) ) {
				const toolbarButton = document.createElement( 'div' );
				toolbarButton.classList.add( 'kadence-toolbar-design-library' );

				selector.appendChild( toolbarButton );
				render( <LibraryButton />, toolbarButton );

				setTimeout(() => {
					renderButton()
				}, 1000)
			}
		} );
		
	}

	if ( showSettings( 'show', 'kadence/designlibrary' ) && kadence_blocks_params.showDesignLibrary ) {
		renderButton()
	}

	return null;
}
registerPlugin( 'kb-toolbar-library', {
    render: ToolbarLibrary,
} );
