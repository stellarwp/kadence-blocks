/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import map from 'lodash/map';
import get from 'lodash/get';
import capitalizeFirstLetter from './../common/capitalfirst';
const {
	Dashicon,
	Button,
	ButtonGroup,
} = wp.components;
const {
	AlignmentToolbar,
} = wp.blockEditor;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveAlignControls( {
	label,
	onChange,
	onChangeTablet,
	onChangeMobile,
	mobileValue,
	tabletValue,
	value,
	isCollapsed = false,
} ) {
	const [ deviceType, setDeviceType ] = useState( 'Desktop' );
	let customSetPreviewDeviceType = ( device ) => {
		setDeviceType( capitalizeFirstLetter( device ) );
	};
	const theDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	if ( theDevice !== deviceType ) {
		setDeviceType( theDevice );
	}
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
		<AlignmentToolbar
			value={ ( mobileValue ? mobileValue : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( align ) => onChangeMobile( align ) }
		/>
	);
	output.Tablet = (
		<AlignmentToolbar
			value={ ( tabletValue ? tabletValue : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( align ) => onChangeTablet( align ) }
		/>
	);
	output.Desktop = (
		<AlignmentToolbar
			value={ ( value ? value : '' ) }
			isCollapsed={ isCollapsed }
			onChange={ ( align ) => onChange( align ) }
		/>
	);
	return [
		onChange && onChangeTablet && onChangeMobile && (
			<div className={ 'components-base-control kb-sidebar-alignment kb-responsive-align-control' }>
				<div className="kadence-title-bar">
					{ label && (
						<span className="kadence-control-title">{ label }</span>
					) }
					<ButtonGroup className="kb-measure-responsive-options" aria-label={ __( 'Device', 'kadence-blocks' ) }>
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
				<div className="kb-responsive-align-control-inner">
					{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
				</div>
			</div>
		),
	];
}
