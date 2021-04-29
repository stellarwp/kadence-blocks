/**
 * WordPress dependencies
 */
 import { registerPlugin } from '@wordpress/plugins';
 import {
	withDispatch,
} from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { 
	Component,
	render,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import {
	Button,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
 import icons from '../../brand-icon';
/**
 * Add Prebuilt Library button to Gutenberg toolbar
 */
class ToolbarLibrary extends Component {
    render() {
		const {
            insertBlocks,
        } = this.props;
		const LibraryButton = () => (
			<Button
				className="kb-toolbar-prebuilt-button"
				icon={ icons.kadenceBlocks }
				isPrimary
				onClick={ () => {
					insertBlocks( createBlock( 'kadence/rowlayout', {
						isPrebuiltModal: true,
						noCustomDefaults: true,
					} ) );
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
		checkElement( '.edit-post-header-toolbar' ).then( ( selector ) => {
			if ( ! selector.querySelector( '.kadence-toolbar-design-library' ) ) {
				const toolbarButton = document.createElement( 'div' );
				toolbarButton.classList.add( 'kadence-toolbar-design-library' );

				selector.appendChild( toolbarButton );
				render( <LibraryButton />, toolbarButton );
			}
		} );

        return null;
    }
}

registerPlugin( 'kb-toolbar-library', {
    render: compose(
        withDispatch( ( dispatch ) => {
            const {
                insertBlocks,
            } = dispatch( 'core/block-editor' );

            return {
                insertBlocks,
            };
        } ),
    )( ToolbarLibrary ),
} );