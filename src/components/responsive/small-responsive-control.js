/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, dispatch, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import map from 'lodash/map';
import capitalizeFirstLetter from './../common/capitalfirst';
import {
	Dashicon,
	Button,
	ButtonGroup,
} from '@wordpress/components';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function SmallResponsiveControl( {
	label,
	desktopChildren,
	tabletChildren,
	mobileChildren,
} ) {
	const [ deviceType, setDeviceType ] = useState( 'Desktop' );
	const theDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	if ( theDevice !== deviceType ) {
		setDeviceType( theDevice );
	}
	let customSetPreviewDeviceType = ( device ) => {
		dispatch( 'kadenceblocks/data' ).setDevice( capitalizeFirstLetter( device ) );
		setDeviceType( capitalizeFirstLetter( device ) );
	};
	if ( wp.data.select( 'core/edit-post' ) ) {
		const {
			__experimentalSetPreviewDeviceType = null,
		} = useDispatch( 'core/edit-post' );
		customSetPreviewDeviceType = ( device ) => {
			__experimentalSetPreviewDeviceType( capitalizeFirstLetter( device ) );
			setDeviceType( capitalizeFirstLetter( device ) );
		};
	}
	const devices = [
		{
			name: 'Desktop',
			title: <Dashicon icon="desktop" />,
			itemClass: 'kb-desk-tab',
		},
		{
			name: 'Tablet',
			title: <Dashicon icon="tablet" />,
			itemClass: 'kb-tablet-tab',
		},
		{
			name: 'Mobile',
			key: 'mobile',
			title: <Dashicon icon="smartphone" />,
			itemClass: 'kb-mobile-tab',
		},
	];
	const output = {};
	output.Mobile = (
		mobileChildren
	);
	output.Tablet = (
		tabletChildren
	);
	output.Desktop = (
		desktopChildren
	);
	return (
		<div className={ 'components-base-control kb-small-responsive-control' }>
			<div className="kadence-title-bar">
				{ label && (
					<span className="kadence-control-title">{ label }</span>
				) }
				<ButtonGroup className="kb-small-responsive-options" aria-label={ __( 'Device', 'kadence-blocks' ) }>
					{ map( devices, ( { name, key, title, itemClass } ) => (
						<Button
							key={ key }
							className={ `kb-responsive-btn ${ itemClass }${ name === deviceType ? ' is-active' : '' }` }
							isSmall
							aria-pressed={ deviceType === name }
							onClick={ () => customSetPreviewDeviceType( name ) }
						>
							{ title }
						</Button>
					) ) }
				</ButtonGroup>
			</div>
			<div className="kb-small-measure-control-inner">
				{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
			</div>
		</div>
	);
}
