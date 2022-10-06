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
import { capitalizeFirstLetter } from '@kadence/helpers';
import { undo } from '@wordpress/icons';
import {
	Dashicon,
	Button,
	ButtonGroup,
	Flex,
	FlexItem,
} from '@wordpress/components';
import {
	outlineTopIcon,
	outlineRightIcon,
	outlineBottomIcon,
	outlineLeftIcon,
	individualIcon,
	linkedIcon,
} from '@kadence/icons';
import { OPTIONS_MAP } from './constants';
import { settings, link, linkOff } from '@wordpress/icons';
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
		onChangeMobileControl,
		mobileControl,
		onChangeTabletControl,
		tabletControl,
		onChangeControl,
		control,
		options = OPTIONS_MAP,
		step = 1,
		max = 100,
		min = 0,
		unit = '',
		onUnit,
		showUnit = false,
		units = [ 'px', 'em', 'rem' ],
		allowEmpty = true,
		preset = '',
		hasToggle = true,
		isBorderRadius = false,
		disableCustomSizes = false,
		firstIcon = outlineTopIcon,
		secondIcon = outlineRightIcon,
		thirdIcon = outlineBottomIcon,
		fourthIcon = outlineLeftIcon,
		linkIcon = link,
		unlinkIcon = linkOff,
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
	useEffect( () => {
		setIsCustom( isCustomOption( options, value ) );
	}, [] );
	const realIsCustomControl = setCustomControl ? customControl : isCustom;
	const realSetIsCustom = setCustomControl ? setCustomControl : setIsCustom;
	const onSetIsCustom = () => {
		if ( ! realIsCustomControl ) {
			const newValue = [
				getOptionSize( options, ( value ? value[ 0 ] : '' ), unit ),
				getOptionSize( options, ( value ? value[ 1 ] : '' ), unit ),
				getOptionSize( options, ( value ? value[ 2 ] : '' ), unit ),
				getOptionSize( options, ( value ? value[ 3 ] : '' ), unit ),
			];
			onChange( newValue );
		} else {
			const newValue = [
				getOptionFromSize( options, ( value ? value[ 0 ] : '' ), unit ),
				getOptionFromSize( options, ( value ? value[ 1 ] : '' ), unit ),
				getOptionFromSize( options, ( value ? value[ 2 ] : '' ), unit ),
				getOptionFromSize( options, ( value ? value[ 3 ] : '' ), unit ),
			];
			onChange( newValue );
		}
		realSetIsCustom( ! realIsCustomControl );
	}
	const realControl = onControl ? control : theControl;
	const realSetOnControl = onControl ? onControl : setTheControl;
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
		<MeasureRangeControl
			key={ 2 }
			className="measure-mobile-size"
			label={ ( subLabel ? __( 'Mobile:', 'kadence-blocks' ) + subLabel : undefined ) }
			value={ ( mobileValue ? mobileValue : [ '', '', '', '' ] ) }
			control={ ( realMobileControl ? realMobileControl : 'individual' ) }
			onChange={ ( size ) => onChangeMobile( size ) }
			onControl={ ( hasToggle ? ( sizeControl ) => realOnChangeMobileControl( sizeControl ) : undefined ) }
			options={ options }
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
		<MeasureRangeControl
			key={ 1 }
			className="measure-tablet-size"
			label={ ( subLabel ? __( 'Tablet:', 'kadence-blocks' ) + subLabel : undefined ) }
			value={ ( tabletValue ? tabletValue : [ '', '', '', '' ] ) }
			control={ ( realTabletControl ? realTabletControl : 'individual' ) }
			onChange={ ( size ) => onChangeTablet( size ) }
			onControl={ ( hasToggle ? ( sizeControl ) => realOnChangeTabletControl( sizeControl ) : undefined ) }
			options={ options }
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
		<MeasureRangeControl
			key={ 0 }
			className="measure-desktop-size"
			label={ ( subLabel ? subLabel : undefined ) }
			value={ ( value ? value : [ '', '', '', '' ] ) }
			// control={ ( realDesktopControl ? realDesktopControl : 'individual' ) }
			onChange={ ( size ) => onChange( size ) }
			//onControl={ ( hasToggle ? ( sizeControl ) => realOnChangeDesktopControl( sizeControl ) : undefined ) }
			options={ options }
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
				<Flex
					justify="space-between"
					className={ 'kadence-title-bar kadence-measure-range__header' }
				>
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
						<FlexItem>
							<label className="components-base-control__label">{ label }</label>
						</FlexItem>
					) }
					<ButtonGroup className="kb-responsive-options" aria-label={ __( 'Device', 'kadence-blocks' ) }>
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
