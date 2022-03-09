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
import MeasurementControls from './measurement-control';
import capitalizeFirstLetter from '../common/capitalfirst';
const {
	Dashicon,
	Button,
	ButtonGroup,
} = wp.components;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveMeasurementControls( {
	label,
	subLabel,
	onChange,
	onChangeTablet,
	onChangeMobile,
	mobileValue,
	tabletValue,
	value,
	onChangeMobileControl,
	mobileControl,
	onChangeTabletControl,
	tabletControl,
	onChangeControl,
	control,
	step = 1,
	max = 100,
	min = 0,
	unit = '',
	onUnit,
	showUnit = false,
	units = [ 'px', 'em', 'rem' ],
	allowEmpty = true,
	preset = '',
} ) {
	const realMobileControl = mobileControl ? mobileControl : control;
	const realTabletControl = tabletControl ? tabletControl : control;
	const realOnChangeTabletControl = onChangeTabletControl ? onChangeTabletControl : onChangeControl;
	const realOnChangeMobileControl = onChangeMobileControl ? onChangeMobileControl : onChangeControl;
	const zero = ( allowEmpty ? true : false );
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
		<MeasurementControls
			key={ 2 }
			className="measure-mobile-size"
			label={ ( subLabel ? __( 'Mobile:', 'kadence-blocks' ) + subLabel : undefined ) }
			measurement={ ( mobileValue ? mobileValue : [ '', '', '', '' ] ) }
			control={ ( realMobileControl ? realMobileControl : 'individual' ) }
			onChange={ ( size ) => onChangeMobile( size ) }
			onControl={ ( sizeControl ) => realOnChangeMobileControl( sizeControl ) }
			min={ min }
			max={ max }
			step={ step }
			allowEmpty={ zero }
			unit={ unit }
			showUnit={ true }
			units={ [ unit ] }
			preset={ preset }
		/>
	);
	output.Tablet = (
		<MeasurementControls
			key={ 1 }
			className="measure-tablet-size"
			label={ ( subLabel ? __( 'Tablet:', 'kadence-blocks' ) + subLabel : undefined ) }
			measurement={ ( tabletValue ? tabletValue : [ '', '', '', '' ] ) }
			control={ ( realTabletControl ? realTabletControl : 'individual' ) }
			onChange={ ( size ) => onChangeTablet( size ) }
			onControl={ ( sizeControl ) => realOnChangeTabletControl( sizeControl ) }
			min={ min }
			max={ max }
			step={ step }
			allowEmpty={ zero }
			unit={ unit }
			showUnit={ true }
			units={ [ unit ] }
			preset={ preset }
		/>
	);
	output.Desktop = (
		<MeasurementControls
			key={ 0 }
			className="measure-desktop-size"
			label={ ( subLabel ? subLabel : undefined ) }
			measurement={ ( value ? value : [ '', '', '', '' ] ) }
			control={ ( control ? control : 'individual' ) }
			onChange={ ( size ) => onChange( size ) }
			onControl={ ( sizeControl ) => onChangeControl( sizeControl ) }
			min={ min }
			max={ max }
			step={ step }
			allowEmpty={ zero }
			unit={ unit }
			onUnit={ ( onUnit ? onUnit : undefined ) }
			showUnit={ showUnit }
			units={ units }
			preset={ preset }
		/>
	);
	return [
		onChange && onChangeTablet && onChangeMobile && (
			<div className={ 'components-base-control kb-responsive-measure-control' }>
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
				<div className="kb-responsive-measure-control-inner">
					{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
				</div>
			</div>
		),
	];
}
