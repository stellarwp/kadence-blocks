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
	Fragment,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import {
	Button,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { KadenceTryParseJSON } from '@kadence/helpers';
import { kadenceBlocksIcon } from '@kadence/icons';
/**
 * Add Prebuilt Library button to Gutenberg toolbar
 */
class ToolbarLibrary extends Component {
	constructor() {
		super( ...arguments );
		this.showSettings = this.showSettings.bind( this );
		this.state = {
			user: ( kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin' ),
			settings: {},
		};
	}
	componentDidMount() {
		const blockSettings = ( kadence_blocks_params.configuration ? KadenceTryParseJSON( kadence_blocks_params.configuration, true ) : {} );
		if ( blockSettings[ 'kadence/designlibrary' ] !== undefined && typeof blockSettings[ 'kadence/designlibrary' ] === 'object' ) {
			this.setState( { settings: blockSettings[ 'kadence/designlibrary' ] } );
		}
	}
	showSettings( key ) {
		if ( undefined === this.state.settings[ key ] || 'all' === this.state.settings[ key ] ) {
			return true;
		} else if ( 'contributor' === this.state.settings[ key ] && ( 'contributor' === this.state.user || 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'author' === this.state.settings[ key ] && ( 'author' === this.state.user || 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'editor' === this.state.settings[ key ] && ( 'editor' === this.state.user || 'admin' === this.state.user ) ) {
			return true;
		} else if ( 'admin' === this.state.settings[ key ] && 'admin' === this.state.user ) {
			return true;
		}
		return false;
	}
    render() {
		const {
            insertBlocks,
        } = this.props;
		const LibraryButton = () => (
			<Button
				className="kb-toolbar-prebuilt-button"
				icon={ kadenceBlocksIcon }
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
		if ( this.showSettings( 'show' ) && kadence_blocks_params.showDesignLibrary ) {
			checkElement( '.edit-post-header-toolbar' ).then( ( selector ) => {
				if ( ! selector.querySelector( '.kadence-toolbar-design-library' ) ) {
					const toolbarButton = document.createElement( 'div' );
					toolbarButton.classList.add( 'kadence-toolbar-design-library' );

					selector.appendChild( toolbarButton );
					render( <LibraryButton />, toolbarButton );
				}
			} );
		}

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
