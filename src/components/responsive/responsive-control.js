/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import map from 'lodash/map';
import capitalizeFirstLetter from './../common/capitalfirst';
const {
	Dashicon,
	Button,
	ButtonGroup,
} = wp.components;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveControl( {
	desktopChildren,
	tabletChildren,
	mobileChildren,
} ) {
	const deviceType = useSelect( ( select ) => {
		return select( 'core/edit-post' ).__experimentalGetPreviewDeviceType();
	}, [] );
	const {
		__experimentalSetPreviewDeviceType: setPreviewDeviceType,
	} = useDispatch( 'core/edit-post' );
	const customSetPreviewDeviceType = ( device ) => {
		setPreviewDeviceType( capitalizeFirstLetter( device ) );
	};
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
		<div className={ 'components-base-control kt-inspect-tabs kb-responsive-control' }>
			<div className="kadence-title-bar">
				<ButtonGroup className="components-tab-panel__tabs" aria-label={ __( 'Device', 'kadence-blocks' ) }>
					{ map( devices, ( { name, key, title, itemClass } ) => (
						<Button
							key={ key }
							className={ `components-tab-panel__tabs-item ${ itemClass }${ name === deviceType ? ' active-tab' : '' }` }
							aria-pressed={ deviceType === name }
							onClick={ () => customSetPreviewDeviceType( name ) }
						>
							{ title }
						</Button>
					) ) }
				</ButtonGroup>
			</div>
			<div className="kb-responsive-control-inner">
				{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
			</div>
		</div>
	);
}
