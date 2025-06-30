import { useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function SimpleWebfontLoader( {
	typography,
	clientId,
	id,
	children
} ) {
	const linkRef = useRef( null );
	const { previewDevice } = useSelect(
		( select ) => {
			return {
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[]
	);

	useEffect( () => {
		if ( typography && typography[0] && typography[0].family ) {
			// Clean up previous link if it exists
			if ( linkRef.current ) {
				linkRef.current.remove();
			}

			// Build Google Fonts URL
			const family = typography[0].family;
			const variant = typography[0].variant || '';
			const fontString = variant ? `${family}:${variant}` : family;
			const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontString.replace(/ /g, '+'))}&display=swap`;

			// Create and append link element
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = url;
			const context = frames['editor-canvas']?.document || document;
			context.head.appendChild(link);
			linkRef.current = link;

			return () => {
				if ( linkRef.current ) {
					linkRef.current.remove();
				}
			};
		}
	}, [ typography, previewDevice ] );

	return children || null;
}