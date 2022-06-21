if ( ktgooglefonts === undefined ) {
	var ktgooglefonts = [];
}
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
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
	const [ mounted, setMounted ] = useState( false );
	const { previewDevice } = useSelect(
		( select ) => {
			return {
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ]
	);
	const [ device, setDevice ] = useState( 'desktop' );
	const nConfig = {
		google: {
			families: [ typography[ 0 ].family + ( typography[ 0 ].variant ? ':' + typography[ 0 ].variant : '' ) ],
		},
	};
	const addFont = ( font ) => {
		if ( ! ktgooglefonts.includes( font ) ) {
			ktgooglefonts.push( font );
		}
	}
	const loadFonts = () => {
		if ( mounted ) {
			if ( ! ktgooglefonts.includes( nConfig.google.families[ 0 ] ) ) {
				WebFont.load( {
					...nConfig,
					loading: handleLoading,
					active: handleActive,
					inactive: handleInactive,
					context: frames['editor-canvas'],
				} );
				addFont( nConfig.google.families[ 0 ] );
			}
		}
	}
   	useEffect( () => {
		setDevice( previewDevice );
		setMounted( true );
	}, [] );
	useEffect( () => {
		if ( device !== previewDevice ) {
			ktgooglefonts = [];
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