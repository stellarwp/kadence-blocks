/**
 * Copy and Paste Block Styles Component
 *
 */
import { flow } from 'lodash';
import { __ } from '@wordpress/i18n';
import {
	MenuGroup,
	MenuItem,
	ToolbarDropdownMenu,
} from '@wordpress/components';

import {
	getTransferableAttributes,
} from '@kadence/helpers';

/**
 * Import Icons
 */
 import {
	copy,
	paste,
	copyStyles,
} from '@kadence/icons';


const {
	localStorage,
} = window;

/**
 * Build the copy and paste controls
 * @returns {object} The copy and paste controls.
 */
export default function CopyPasteAttributes ( {
	attributes,
    defaultAttributes = {},
    blockSlug,
    excludedAttrs = [],
    preventMultiple = [],
    onPaste,
} ) {
	
    const storageKey = blockSlug + '-style';
	const currentCopiedStyles = JSON.parse( localStorage.getItem( storageKey ) );

	const copyAction = () => {
        //grab all block attributes, minus the exclusions
        //store the attributes to be pasted later
		localStorage.setItem( storageKey, JSON.stringify( getTransferableAttributes( attributes, defaultAttributes, excludedAttrs, preventMultiple, true ) ) );
	};

	const pasteAction = () => {
		const pasteItem = JSON.parse( localStorage.getItem( storageKey ) );

		if ( pasteItem ) {
			// Filter out default values for regular paste
			const filteredPasteItem = getTransferableAttributes( pasteItem, defaultAttributes, [], [], false );
			onPaste( filteredPasteItem );
		}
	};

	const pasteAndReplaceAction = () => {
		const pasteItem = JSON.parse( localStorage.getItem( storageKey ) );

		if ( pasteItem ) {
			// Include all values including defaults for paste and replace
			onPaste( pasteItem );
		}
	};

	return (
		<ToolbarDropdownMenu
			className="components-toolbar kb-copy-paste-attributes"
			icon={ copyStyles }
			label={ __( 'Copy/Paste Styles', 'kadence-blocks' ) }
			popoverProps={ {
				className: 'kb-copy-paste-attributes__popover',
			} }
		>
			{ ( { onClose } ) => (
				<>
					<MenuGroup>
						<MenuItem
							icon={ copy }
							onClick={ flow( onClose, copyAction ) }
							label={ __( 'Copy Styles', 'kadence-blocks' ) }
						>
							{ __( 'Copy Styles', 'kadence-blocks' ) }
						</MenuItem>
						<MenuItem
							icon={ paste }
							onClick={ flow( onClose, pasteAction ) }
							disabled={ ! currentCopiedStyles }
							label={ __( 'Paste Styles', 'kadence-blocks' ) }
						>
							{ __( 'Paste Styles', 'kadence-blocks' ) }
						</MenuItem>
						<MenuItem
							icon={ paste }
							onClick={ flow( onClose, pasteAndReplaceAction ) }
							disabled={ ! currentCopiedStyles }
							label={ __( 'Paste and Replace', 'kadence-blocks' ) }
						>
							{ __( 'Paste and Replace', 'kadence-blocks' ) }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</ToolbarDropdownMenu>
	);
}
