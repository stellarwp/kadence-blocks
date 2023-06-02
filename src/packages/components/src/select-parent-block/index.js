/**
 * WordPress dependencies
 */
 import { __ } from '@wordpress/i18n';
 import {
	useState,
	useRef,
	useEffect,
	useMemo,
 } from '@wordpress/element';
 import {
	Panel,
	ToggleControl,
	Button,
} from '@wordpress/components';
import {
	useBlockDisplayInformation,
	store as blockEditorStore,
	BlockIcon,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Import Css
 */
import './editor.scss';

export default function SelectParentBlock( { clientId, label = null } ) {
	
	const { selectBlock } = useDispatch( blockEditorStore );
	const { firstParentClientId } = useSelect(
		( select ) => {
			const {
				getBlockParents,
			} = select( blockEditorStore );
			const parents = getBlockParents( clientId  );
			const _firstParentClientId = parents[ parents.length - 1 ];
			return {
				firstParentClientId: _firstParentClientId,
			};
		},
		[]
	);
	if ( firstParentClientId === undefined ) {
		return null;
	}
	const blockInformation = useBlockDisplayInformation( firstParentClientId );
	return (
		<div
			className="kadence-blocks-block-parent-selector"
			key={ firstParentClientId }
		>
			<Button
				className="kadence-blocks-block-parent-selector__button"
				onClick={ () => selectBlock( firstParentClientId ) }
				icon={ <BlockIcon icon={ blockInformation?.icon } /> }
			>
				{ label ? label : __( 'View Parent Block Settings', 'kadence-blocks' ) }
			</Button>
		</div>
	);
}