import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import WebFont from "webfontloader";
const statuses = {
	inactive: 'inactive',
	active: 'active',
	loading: 'loading',
};

export default function KadenceWebfontLoader( {
	typography,
	clientId,
	id,
	children
} ) {
   const [ status, setStatus ] = useState( undefined );
	const { addWebFont } = useDispatch( 'kadenceblocks/data' );
	const [ device, setDevice ] = useState( 'desktop' );
	const { previewDevice, isUniqueFont } = useSelect(
		( select ) => {
			return {
				isUniqueFont: ( value, frame ) => select( 'kadenceblocks/data' ).isUniqueFont( value, frame ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[]
	);
	const nConfig = {
		google: {
			families: [ typography[ 0 ].family + ( typography?.[ 0 ]?.variant ? ':' + typography[ 0 ].variant : '' ) ],
		},
	};
	const loadFonts = () => {
		setTimeout( () => {
			if ( undefined !== nConfig?.google?.families?.[ 0 ] && isUniqueFont( nConfig?.google?.families?.[ 0 ], ( frames['editor-canvas'] ? 'Desktop' : 'iframe' ) ) ) {
				WebFont.load( {
					...nConfig,
					loading: handleLoading,
					active: handleActive,
					inactive: handleInactive,
					context: frames['editor-canvas'],
				} );
				addWebFont( nConfig?.google?.families?.[ 0 ], ( frames['editor-canvas'] ? 'Desktop' : 'iframe' ) );
			}
		}, 50 );
	}
   	useEffect( () => {
		setDevice( previewDevice );
	}, [] );
	useEffect( () => {
		if ( device !== previewDevice ) {
			setDevice( previewDevice );
			loadFonts();
		}
	}, [previewDevice] );
	useEffect( () => {
		loadFonts();
	}, [ nConfig ] );
	const handleLoading = () => {
		setStatus( statuses.loading );
	}
	const handleActive = () => {
		setStatus( statuses.active );
	}
	const handleInactive = () => {
		setStatus( statuses.inactive );
	}
	return children || null;
}