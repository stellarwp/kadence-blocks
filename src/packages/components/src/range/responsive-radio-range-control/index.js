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
import { map, isEqual } from 'lodash';
import { undo } from '@wordpress/icons';
import { capitalizeFirstLetter } from '@kadence/helpers'
import RadioRangeControl from '../radio-range-control';
import { settings } from '@wordpress/icons';

import {
	Dashicon,
	Button,
	ButtonGroup,
} from '@wordpress/components';
function getSelectOption( optionsArray, value ) {
	if ( ! value ) {
		return '';
	}
	if ( ! optionsArray ) {
		return 'custom';
	}
	return (
		optionsArray.find( ( option ) => option.value === value ) ||
		'custom'
	);
}
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveRadioRangeControls( {
	label,
	onChange,
	onChangeTablet,
	onChangeMobile,
	mobileValue,
	tabletValue,
	value,
	options = [],
	step = 1,
	max = 100,
	min = 0,
	unit = '',
	onUnit,
	showUnit = false,
	units = [ 'px', 'em', 'rem' ],
	allowEmpty = true,
	className = '',
	disableCustomSizes = false,
	reset,
} ) {
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
			key: 'desktop',
			title: <Dashicon icon="desktop" />,
			itemClass: 'kb-desk-tab',
		},
		{
			name: 'Tablet',
			key: 'tablet',
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
	const selectedOption = getSelectOption( options, value );
	const isCustomValue = selectedOption.value === 'custom';
	const [ showCustomValueControl, setShowCustomValueControl ] = useState(
		! disableCustomSizes && isCustomValue
	);
	const output = {};
	output.Mobile = (
		<RadioRangeControl
			value={ ( undefined !== mobileValue ? mobileValue : '' ) }
			onChange={ ( size ) => onChangeMobile( size ) }
			options={ options }
			min={ min }
			max={ max }
			step={ step }
			unit={ unit }
			onUnit={ onUnit }
			showUnit={ showUnit }
			units={ units }
		/>
	);
	output.Tablet = (
		<RadioRangeControl
			value={ ( undefined !== tabletValue ? tabletValue : '' ) }
			onChange={ ( size ) => onChangeTablet( size ) }
			options={ options }
			min={ min }
			max={ max }
			step={ step }
			unit={ unit }
			onUnit={ onUnit }
			showUnit={ showUnit }
			units={ units }
		/>
	);
	output.Desktop = (
		<RadioRangeControl
			value={ ( undefined !== value ? value : '' ) }
			onChange={ ( size ) => onChange( size ) }
			options={ options }
			min={ min }
			max={ max }
			step={ step }
			unit={ unit }
			onUnit={ onUnit }
			showUnit={ showUnit }
			units={ units }
		/>
	);
	return [
		onChange && onChangeTablet && onChangeMobile && (
			<div className={ `components-base-control kb-responsive-radio-range-control${ '' !== className ? ' ' + className : '' }` }>
				<div className="kadence-title-bar">
					{ reset && (
						<Button
							className="is-reset is-single"
							isSmall
							disabled={ ( ( isEqual( '', value ) ) ? true : false ) }
							icon={ undo }
							onClick={ () => reset() }
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
					{ ! disableCustomSizes && (
						<Button
							label={
								showCustomValueControl
									? __( 'Use size preset' )
									: __( 'Set custom size' )
							}
							icon={ settings }
							onClick={ () => {
								setShowCustomValueControl(
									! showCustomValueControl
								);
							} }
							isPressed={ showCustomValueControl }
							isSmall
						/>
					) }
				</div>
				{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
			</div>
		),
	];
}
