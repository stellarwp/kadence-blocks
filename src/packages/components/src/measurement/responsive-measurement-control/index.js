/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map, isEqual } from 'lodash';
import MeasurementControls from '../measurement-control';
import { capitalizeFirstLetter } from '@kadence/helpers';
import { undo } from '@wordpress/icons';
import {
	Dashicon,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import {
	outlineTopIcon,
	outlineRightIcon,
	outlineBottomIcon,
	outlineLeftIcon,
	individualIcon,
	linkedIcon,
} from '@kadence/icons';
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
		onChangeControl = false,
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
		isBorderRadius = false,
		firstIcon = outlineTopIcon,
		secondIcon = outlineRightIcon,
		thirdIcon = outlineBottomIcon,
		fourthIcon = outlineLeftIcon,
		linkIcon = linkedIcon,
		unlinkIcon = individualIcon,
		reset = true,
	} ) {
	const ref = useRef();
	const [ localControl, setLocalControl ] = useState( 'individual' );
	const realDesktopControl = control ? control : localControl;
	const realMobileControl = mobileControl ? mobileControl : realDesktopControl;
	const realTabletControl = tabletControl ? tabletControl : realDesktopControl;
	const realOnChangeDesktopControl = onChangeControl ? onChangeControl : setLocalControl;
	const realOnChangeTabletControl = onChangeTabletControl ? onChangeTabletControl : realOnChangeDesktopControl;
	const realOnChangeMobileControl = onChangeMobileControl ? onChangeMobileControl : realOnChangeDesktopControl;
	const zero = ( allowEmpty ? true : false );
	const [ deviceType, setDeviceType ] = useState( 'Desktop' );
	const theDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	if ( theDevice !== deviceType ) {
		setDeviceType( theDevice );
	}
	const {
		setPreviewDeviceType,
	} = useDispatch( 'kadenceblocks/data' );
	const customSetPreviewDeviceType = ( device ) => {
		setPreviewDeviceType( capitalizeFirstLetter( device ) );
		setDeviceType( capitalizeFirstLetter( device ) );
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
	let liveValue = ( value ? value : [ '', '', '', '' ] );
	if ( deviceType === 'Tablet' ) {
		liveValue = ( tabletValue ? tabletValue : [ '', '', '', '' ] );
	} else if ( deviceType === 'Mobile' ) {
		liveValue = ( mobileValue ? mobileValue : [ '', '', '', '' ] );
	}
	const onReset = () => {
		if ( deviceType === 'Tablet' ) {
			onChangeTablet( [ '', '', '', '' ] );
		} else if ( deviceType === 'Mobile' ) {
			onChangeMobile( [ '', '', '', '' ] );
		} else {
			onChange( [ '', '', '', '' ] );
		}
	}
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
			isBorderRadius={ isBorderRadius }
			firstIcon={ firstIcon }
			secondIcon={ secondIcon }
			thirdIcon={ thirdIcon }
			fourthIcon={ fourthIcon }
			linkIcon={ linkIcon }
			unlinkIcon={ unlinkIcon }
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
			isBorderRadius={ isBorderRadius }
			firstIcon={ firstIcon }
			secondIcon={ secondIcon }
			thirdIcon={ thirdIcon }
			fourthIcon={ fourthIcon }
			linkIcon={ linkIcon }
			unlinkIcon={ unlinkIcon }
		/>
	);
	output.Desktop = (
		<MeasurementControls
			key={ 0 }
			className="measure-desktop-size"
			label={ ( subLabel ? subLabel : undefined ) }
			measurement={ ( value ? value : [ '', '', '', '' ] ) }
			control={ ( realDesktopControl ? realDesktopControl : 'individual' ) }
			onChange={ ( size ) => onChange( size ) }
			onControl={ ( sizeControl ) => realOnChangeDesktopControl( sizeControl ) }
			min={ min }
			max={ max }
			step={ step }
			allowEmpty={ zero }
			unit={ unit }
			onUnit={ ( onUnit ? onUnit : undefined ) }
			showUnit={ showUnit }
			units={ units }
			preset={ preset }
			isBorderRadius={ isBorderRadius }
			firstIcon={ firstIcon }
			secondIcon={ secondIcon }
			thirdIcon={ thirdIcon }
			fourthIcon={ fourthIcon }
			linkIcon={ linkIcon }
			unlinkIcon={ unlinkIcon }
		/>
	);
	return [
		onChange && onChangeTablet && onChangeMobile && (
			<div ref={ ref } className={ 'components-base-control kb-responsive-measure-control' }>
				<div className="kadence-title-bar">
					{ reset && (
						<Button
							className="is-reset is-single"
							isSmall
							disabled={ ( ( isEqual( [ '', '', '', '' ], liveValue ) || isEqual( [ '', 'auto', '', 'auto' ], liveValue ) ) ? true : false ) }
							icon={ undo }
							onClick={ () => onReset() }
						></Button>
					) }
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
