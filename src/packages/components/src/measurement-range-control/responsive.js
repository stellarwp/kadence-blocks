/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map, isEqual } from 'lodash';
import MeasureRangeControl from './index';
import { capitalizeFirstLetter, objectSameFill, clearNonMatchingValues } from '@kadence/helpers';
import { undo, settings, link, linkOff } from '@wordpress/icons';
/**
 * Import Css
 */
 import './editor.scss';
import {
	Dashicon,
	Button,
	ButtonGroup,
	Flex,
} from '@wordpress/components';
import {
	outlineTopIcon,
	outlineRightIcon,
	outlineBottomIcon,
	outlineLeftIcon,
} from '@kadence/icons';
import { OPTIONS_MAP } from './constants';
import { isCustomOption, getOptionIndex, getOptionFromSize, getOptionSize } from './utils';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveMeasureRangeControl( {
		label,
		subLabel,
		onChange,
		onChangeTablet,
		onChangeMobile,
		mobileValue,
		tabletValue,
		value,
		onControl,
		control = 'individual',
		options = OPTIONS_MAP,
		step = 1,
		max = 100,
		min = 0,
		unit = '',
		onUnit,
		showUnit = false,
		units = [ 'px', 'em', 'rem' ],
		isBorderRadius = false,
		disableCustomSizes = false,
		firstIcon = outlineTopIcon,
		secondIcon = outlineRightIcon,
		thirdIcon = outlineBottomIcon,
		fourthIcon = outlineLeftIcon,
		linkIcon = link,
		unlinkIcon = linkOff,
		deskDefault = [ '', '', '', '' ],
		tabletDefault = [ '', '', '', '' ],
		mobileDefault = [ '', '', '', '' ],
		ghostDefault = [ '', '', '', '' ],
		reset = true,
		setCustomControl = null,
		onMouseOver,
		onMouseOut,
		allowAuto = false,
	} ) {
	const ref = useRef();
	const measureIcons = {
		first: isBorderRadius ? topLeftIcon : firstIcon,
		second: isBorderRadius ? topRightIcon : secondIcon,
		third: isBorderRadius ? bottomRightIcon : thirdIcon,
		fourth: isBorderRadius ? bottomLeftIcon : fourthIcon,
		link: isBorderRadius ? radiusLinkedIcon : linkIcon,
		unlink: isBorderRadius ? radiusIndividualIcon : unlinkIcon,
	}
	const [ isCustom, setIsCustom ] = useState( false );
	const [ theControl, setTheControl ] = useState( control );
	const realIsCustomControl = setCustomControl ? customControl : isCustom;
	const realSetIsCustom = setCustomControl ? setCustomControl : setIsCustom;
	const reviewOptions = JSON.parse(JSON.stringify(options));
	reviewOptions.push( {
		value: 'ss-auto',
		output: 'var(--global-kb-spacing-auto, auto)',
		label: __( 'Auto', 'kadence-blocks' ),
		size: 0,
		name: __( 'Auto', 'kadence-blocks' ),
	} );
	const onSetIsCustom = () => {
		convertValueToFromCustomByDeviceType()

		realSetIsCustom( ! realIsCustomControl );
	}

	const convertValueToFromCustomByDeviceType = () => {
		if ( deviceType == 'Mobile' ) {
			const newValue = convertValueToFromCustom( mobileValue );
			if ( objectSameFill( mobileValue, newValue ) ) {
				onChangeMobile( newValue );
			}
		} else if ( deviceType == 'Tablet' ) {
			const newValue = convertValueToFromCustom( tabletValue );
			if ( objectSameFill( tabletValue, newValue ) ) {
				onChangeTablet( newValue );
			}
		} else {
			const newValue = convertValueToFromCustom( value );
			if ( objectSameFill( value, newValue ) ) {
				onChange( newValue );
			}
		}
	}

	const convertValueToFromCustom = ( valueToConvert ) => {
		let convertedValue = [];
		//convert to custom
		if ( ! realIsCustomControl ) {
			convertedValue = [
				getOptionSize( options, ( valueToConvert ? valueToConvert[ 0 ] : '' ), unit ),
				getOptionSize( options, ( valueToConvert ? valueToConvert[ 1 ] : '' ), unit ),
				getOptionSize( options, ( valueToConvert ? valueToConvert[ 2 ] : '' ), unit ),
				getOptionSize( options, ( valueToConvert ? valueToConvert[ 3 ] : '' ), unit ),
			];
		//convert to option
		} else {
			convertedValue = [
				getOptionFromSize( options, ( valueToConvert ? valueToConvert[ 0 ] : '' ), unit ),
				getOptionFromSize( options, ( valueToConvert ? valueToConvert[ 1 ] : '' ), unit ),
				getOptionFromSize( options, ( valueToConvert ? valueToConvert[ 2 ] : '' ), unit ),
				getOptionFromSize( options, ( valueToConvert ? valueToConvert[ 3 ] : '' ), unit ),
			];
		}
		return convertedValue;
	}

	const realControl = onControl ? control : theControl;
	const realSetOnControl = onControl ? onControl : setTheControl;
	const [ deviceType, setDeviceType ] = useState( 'Desktop' );
	const theDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	if ( theDevice !== deviceType ) {
		setDeviceType( theDevice );
	}
	useEffect( () => {
		let valueToCheck = value;
		if ( theDevice == 'Tablet' ) {
			valueToCheck = tabletValue;
		}else if ( theDevice == 'Mobile' ) {
			valueToCheck = mobileValue;
		}
		setIsCustom( isCustomOption( reviewOptions, valueToCheck ) );
	}, [theDevice] );

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
			onChangeTablet( tabletDefault );
		} else if ( deviceType === 'Mobile' ) {
			onChangeMobile( mobileDefault );
		} else {
			onChange( deskDefault );
		}
	}
	const mobilePlaceholder = tabletValue ? JSON.parse( JSON.stringify( tabletValue ) ) : [ '', '', '', '' ];
	if ( ! mobilePlaceholder?.[0] ) {
		mobilePlaceholder[0] = value?.[0] ? value[0] : '';
	}
	if ( ! mobilePlaceholder?.[1] ) {
		mobilePlaceholder[1] = value?.[1] ? value[1] : '';
	}
	if ( ! mobilePlaceholder?.[2] ) {
		mobilePlaceholder[2] = value?.[2] ? value[2] : '';
	}
	if ( ! mobilePlaceholder?.[3] ) {
		mobilePlaceholder[3] = value?.[3] ? value[3] : '';
	}
	const output = {};
	output.Mobile = (
		<MeasureRangeControl
			key={ 2 }
			className="measure-mobile-size"
			parentLabel={ label }
			label={ ( subLabel ? __( 'Mobile:', 'kadence-blocks' ) + subLabel : undefined ) }
			value={ ( mobileValue ? mobileValue : [ '', '', '', '' ] ) }
			placeholder={ mobilePlaceholder }
			onChange={ ( size ) => onChangeMobile( clearNonMatchingValues( mobileValue, size ) ) }
			control={ realControl }
			onControl={ ( value ) => realSetOnControl( value ) }
			setCustomControl={ realSetIsCustom }
			customControl={ realIsCustomControl }
			options={ options }
			defaultValue={ mobileDefault }
			min={ min }
			max={ max }
			step={ step }
			unit={ unit }
			onUnit={ ( onUnit ? onUnit : undefined ) }
			showUnit={ true }
			units={ [ unit ] }
			isBorderRadius={ isBorderRadius }
			firstIcon={ firstIcon }
			secondIcon={ secondIcon }
			thirdIcon={ thirdIcon }
			fourthIcon={ fourthIcon }
			linkIcon={ linkIcon }
			unlinkIcon={ unlinkIcon }
			onMouseOver={ onMouseOver }
			onMouseOut={ onMouseOut }
			allowAuto={ allowAuto }
		/>
	);
	output.Tablet = (
		<MeasureRangeControl
			key={ 1 }
			className="measure-tablet-size"
			parentLabel={ label }
			label={ ( subLabel ? __( 'Tablet:', 'kadence-blocks' ) + subLabel : undefined ) }
			value={ ( tabletValue ? tabletValue : [ '', '', '', '' ] ) }
			placeholder={ ( value ? value : [ '', '', '', '' ] ) }
			onChange={ ( size ) => onChangeTablet( clearNonMatchingValues( tabletValue, size ) ) }
			control={ realControl }
			onControl={ ( value ) => realSetOnControl( value ) }
			setCustomControl={ realSetIsCustom }
			customControl={ realIsCustomControl }
			options={ options }
			defaultValue={ tabletDefault }
			min={ min }
			max={ max }
			step={ step }
			unit={ unit }
			onUnit={ ( onUnit ? onUnit : undefined ) }
			showUnit={ true }
			units={ [ unit ] }
			isBorderRadius={ isBorderRadius }
			firstIcon={ firstIcon }
			secondIcon={ secondIcon }
			thirdIcon={ thirdIcon }
			fourthIcon={ fourthIcon }
			linkIcon={ linkIcon }
			unlinkIcon={ unlinkIcon }
			onMouseOver={ onMouseOver }
			onMouseOut={ onMouseOut }
			allowAuto={ allowAuto }
		/>
	);
	output.Desktop = (
		<MeasureRangeControl
			key={ 0 }
			className="measure-desktop-size"
			parentLabel={ label }
			label={ ( subLabel ? subLabel : undefined ) }
			value={ ( value ? value : [ '', '', '', '' ] ) }
			placeholder={ ( ghostDefault ? ghostDefault : [ '', '', '', '' ] ) }
			onChange={ ( size ) => onChange( clearNonMatchingValues( value, size ) ) }
			control={ realControl }
			onControl={ ( value ) => realSetOnControl( value ) }
			setCustomControl={ realSetIsCustom }
			customControl={ realIsCustomControl }
			options={ options }
			defaultValue={ deskDefault }
			min={ min }
			max={ max }
			step={ step }
			unit={ unit }
			onUnit={ ( onUnit ? onUnit : undefined ) }
			showUnit={ showUnit }
			units={ units }
			isBorderRadius={ isBorderRadius }
			firstIcon={ firstIcon }
			secondIcon={ secondIcon }
			thirdIcon={ thirdIcon }
			fourthIcon={ fourthIcon }
			linkIcon={ linkIcon }
			unlinkIcon={ unlinkIcon }
			onMouseOver={ onMouseOver }
			onMouseOut={ onMouseOut }
			allowAuto={ allowAuto }
		/>
	);
	let currentDefault = deskDefault;
	if ( 'Mobile' === deviceType ) {
		currentDefault = mobileDefault;
	} else if ( 'Mobile' === deviceType ) {
		currentDefault = tabletDefault;
	}
	return [
		onChange && onChangeTablet && onChangeMobile && (
			<div ref={ ref } className={ 'components-base-control kb-responsive-measure-control kadence-measure-range-control' }>
				<Flex
					justify="space-between"
					className={ 'kadence-title-bar kadence-component__header kadence-measure-range__header kadence-radio-range__header' }
				>
					{ label && (
						<div className="kadence-component__header__title kadence-radio-range__title">
							<label className="components-base-control__label">{ label }</label>
							{ reset === true && (realControl !== 'linked' || (realControl === 'linked' && realIsCustomControl === true)) && (
								<div className='title-reset-wrap'>
									<Button
										className="is-reset is-single"
										label='reset'
										isSmall
										disabled={ ( ( isEqual( currentDefault, liveValue ) ) ? true : false ) }
										icon={ undo }
										onClick={ () => onReset() }
									/>
								</div>
							) }
						</div>
					) }
					<ButtonGroup className="kb-responsive-options kb-measure-responsive-options" aria-label={ __( 'Device', 'kadence-blocks' ) }>
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
					{ ! disableCustomSizes && ! subLabel && (
						<Button
							className={'kadence-radio-item radio-custom only-icon'}
							label={ ! realIsCustomControl ? __( 'Set custom size', 'kadence-blocks' ) : __( 'Use size preset', 'kadence-blocks' )  }
							icon={ settings }
							isSmall={ true }
							onClick={ onSetIsCustom }
							isPressed={ realIsCustomControl ? true : false }
							isTertiary={ realIsCustomControl ? false : true }
						/>
					) }
					{ realSetOnControl && ! subLabel && (
						<Button
							isSmall={ true }
							className={'kadence-radio-item radio-custom is-single only-icon'}
							label={ realControl !== 'individual' ? __( 'Individual', 'kadence-blocks' ) : __( 'Linked', 'kadence-blocks' )  }
							icon={ realControl !== 'individual' ? measureIcons.link : measureIcons.unlink }
							onClick={ () => realSetOnControl( realControl !== 'individual' ? 'individual' : 'linked' ) }
							isPressed={ realControl !== 'individual' ? true : false }
							isTertiary={ realControl !== 'individual' ? false : true }
						/>
					) }
				</Flex>
				<div className="kb-responsive-measure-control-inner">
					{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
				</div>
			</div>
		),
	];
}
