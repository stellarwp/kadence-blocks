/**
 * Range Control
 *
 */
/**
 * WordPress dependencies
 */
 import { useInstanceId } from '@wordpress/compose';
 import { useState, useEffect } from '@wordpress/element';
/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
 import { __ } from '@wordpress/i18n';
import {
	Flex,
	FlexBlock,
	FlexItem,
	Button,
	DropdownMenu,
	Popover,
	ButtonGroup,
	RangeControl as CoreRangeControl,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';
import {
	pxIcon,
	emIcon,
	remIcon,
	vhIcon,
	vwIcon,
	percentIcon,
} from '@kadence/icons';
import { settings, link, linkOff } from '@wordpress/icons';
import { OPTIONS_MAP } from './constants';
const icons = {
	px: pxIcon,
	em: emIcon,
	rem: remIcon,
	vh: vhIcon,
	vw: vwIcon,
	percent: percentIcon,
};
function isCustomOption( optionsArray, value ) {
	if ( ! value ) {
		return false;
	}
	if ( ! optionsArray ) {
		return false;
	}
	return (
		! optionsArray.find( ( option ) => option.value === value )
	);
}
function getOptionIndex( optionsArray, value ) {
	if ( ! value ) {
		return;
	}
	if ( ! optionsArray ) {
		return;
	}
	if ( value === '0' || value === 'default' ) {
		return 0;
	}
	const found = optionsArray.findIndex( ( option ) => option.value === value );
	if ( ! found ) {
		return;
	}
	return found;
}
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function SingleMeasureRangeControl( {
	label,
	onChange,
	value = '',
	placeholder = '',
	className = '',
	options = OPTIONS_MAP,
	step = 1,
	max = 200,
	min = 0,
	beforeIcon = '',
	help = '',
	defaultValue = 0,
	unit = '',
	onUnit,
	units = [ 'px', 'em', 'rem' ],
	disableCustomSizes = false,
	customControl = false,
	setCustomControl = null,
	isPopover = false,
	isSingle = false,
	parentLabel = null,
	onMouseOver,
	onMouseOut,
	allowAuto = false,
} ) {
	const [ isCustom, setIsCustom ] = useState( false );
	const [ isOpen, setIsOpen ] = useState( false );
	const reviewOptions = JSON.parse(JSON.stringify(options));
	reviewOptions.push( {
		value: 'ss-auto',
		output: 'var(--global-kb-spacing-auto, auto)',
		label: __( 'Auto', 'kadence-blocks' ),
		size: 0,
		name: __( 'Auto', 'kadence-blocks' ),
	} );
	useEffect( () => {
		setIsCustom( isCustomOption( reviewOptions, value ) );
	}, [] );
	const realIsCustomControl = setCustomControl ? customControl : isCustom;
	const realSetIsCustom = setCustomControl ? setCustomControl : setIsCustom;
	function toggle() {
		setIsOpen( ! isOpen );
	}
	function close() {
		setIsOpen( false );
	}
	const getNewPresetValue = ( newSize ) => {
		if ( undefined === newSize ) {
			return '';
		}
		const size = parseInt( newSize, 10 );
		if ( size === 0 ) {
			return '0';
		}
		return `${ options[ newSize ]?.value }`;
	};
	const onChangeCustom = ( newSize ) => {
		const isNumeric = ! isNaN( parseFloat( newSize ) );
		const nextValue = isNumeric ? parseFloat( newSize ) : undefined;
		// if ( onUnit && ! parentLabel ) {
		// 	const newUnit = newSize.replace(/[0-9]/g, '');
		// 	if ( newUnit !== unit ) {
		// 		onUnit( newUnit );
		// 	}
		// }
		onChange( nextValue );
	};
	const marks = options.map( ( newValue, index ) => ( {
		value: index,
		label: undefined,
	} ) );
	const controlUnits = units.map( ( unitItem ) => ( {
		value: unitItem,
		label: unitItem,
	} ) );
	const currentValue = ! realIsCustomControl ? getOptionIndex( reviewOptions, value ) : Number( value );
	const currentPlaceholder = ! realIsCustomControl ? getOptionIndex( reviewOptions, placeholder ) : Number( placeholder )
	const setInitialValue = () => {
		if ( value === undefined ) {
			onChange( '0' );
		}
	};
	const customTooltipContent = ( newValue ) => {
		return reviewOptions[ newValue ]?.label;
	}
	const currentValueLabel = reviewOptions[ currentValue ]?.label ? reviewOptions[ currentValue ]?.label : __( 'Unset', 'kadence-blocks' );
	const currentValueName = reviewOptions[ currentValue ]?.name ? reviewOptions[ currentValue ]?.name + ' ' + reviewOptions[ currentValue ]?.size + 'px' : __( 'Unset', 'kadence-blocks' );
	const addParent = parentLabel ? parentLabel + ' ' : '';
	let rangeLabel = label;
	if ( isSingle ) {
		rangeLabel = currentValueName;
	} else if ( label && addParent ) {
		rangeLabel = addParent + label + ' ' + currentValueLabel
	}
	const customRange = (
		<>
			<CoreRangeControl
				label={ rangeLabel ? rangeLabel : undefined }
				className={ 'components-spacing-sizes-control__range-control' }
				beforeIcon={ beforeIcon }
				value={ 'ss-auto' == value ? '' : currentValue }
				onChange={ ( newVal ) => {
					if ( undefined === newVal ) {
						onChange( defaultValue );
					} else {
						onChange( getNewPresetValue( newVal ) )
					}
				}}
				min={ 0 }
				max={ options.length - 1 }
				marks={ marks }
				step={ 1 }
				help={ help }
				withInputField={ false }
				aria-valuenow={ currentValue }
				aria-valuetext={ options[ currentValue ]?.label }
				renderTooltipContent={ customTooltipContent }
				initialPosition={ defaultValue ? defaultValue : 0 }
				allowReset={ isSingle ? true : false  }
				hideLabelFromVision={ ( isPopover || isSingle ) ? false : true }
				onMouseOver={ onMouseOver }
				onMouseOut={ onMouseOut }
				onMouseDown={ ( event ) => {
					// If mouse down is near start of range set initial value to 0, which
					// prevents the user have to drag right then left to get 0 setting.
					if ( event?.nativeEvent?.offsetX < 35 ) {
						setInitialValue();
					}
				} }
			/>
			{ ! disableCustomSizes && (
				<Button
					className={'kadence-radio-item radio-custom only-icon'}
					label={ __( 'Set custom size', 'kadence-blocks' ) }
					icon={ settings }
					onClick={ () => realSetIsCustom( true ) }
					isPressed={ false }
					isTertiary={ true }
				/>
			) }
		</>
	);
	return [
		onChange && (
			<div 
				className={ `components-base-control component-spacing-sizes-control kadence-single-measure-range-control${ className ? ' ' + className : '' }` }>
				{ ! setCustomControl && label && (
					<Flex
						justify="space-between"
						className={ 'kadence-radio-range__header' }
					>
						<FlexItem>
							<label className="components-base-control__label">{ label }</label>
						</FlexItem>
					</Flex>
				) }
				{ ! realIsCustomControl && (
					<div className={ 'kadence-controls-content' }>
						{ isPopover && (
							<>
								<Button
									className={ 'kadence-popover-spacing-btn' }
									disabled={ ( value && 'auto' == value ? true : false ) }
									tabIndex="-1" 
									onClick={ ( value && 'auto' == value ? '' : toggle ) }
									onMouseOver={ onMouseOver }
									onMouseOut={ onMouseOut }
								>
									{ parentLabel && label && (
										<span className='kadence-placement-label'>{ label }</span>
									) }
									<span className='kadence-spacing-btn-val'>
										{ reviewOptions[ currentValue ]?.label }
										{ ! reviewOptions[ currentValue ]?.label && (
											<span className='kadence-spacing-btn-placeholder'>{ reviewOptions?.[ currentPlaceholder ]?.label ? reviewOptions?.[ currentPlaceholder ]?.label : placeholder }</span>
										) }
									</span>
								</Button>
								{ isOpen && (
									<Popover
										onClose={ close }
										className={ 'kadence-range-popover-settings' }
									>

										<div className={ 'kadence-range-popover-settings-inner' }>
											{ customRange }
											{ allowAuto && (
												<Button
													className={'custom-auto-button'}
													variant='secondary'
													isSmall
													text={ __( 'Auto', 'kadence-blocks' ) }
													onClick={ () => onChange( 'ss-auto' ) }
													isPressed={ ( value && 'ss-auto' == value ? true : false ) }
												/>
											) }
											<Button
												className={'custom-reset-button'}
												variant='secondary'
												isSmall
												text={ __( 'Reset', 'kadence-blocks' ) }
												onClick={ () => onChange( '' ) }
											/>
										</div>
									</Popover>
								) }
							</>
						)}
						{ ! isPopover && (
							<>{ customRange }</>
						) }
					</div>
				) }
				{ realIsCustomControl && (
					<div className={ 'kadence-controls-content kadence-single-unit-control' }>
						<UnitControl
							label={ parentLabel && label ? label : undefined }
							labelPosition={'top'}
							min={ min }
							max={ max }
							disabled={ ( value && 'auto' == value ? true : false ) }
							step={ step }
							units={ controlUnits }
							value={ value }
							placeholder={ placeholder ? placeholder : undefined }
							disableUnits={ true }
							onChange={ ( newVal ) => onChangeCustom( newVal ) }
							onMouseOver={ onMouseOver }
							onMouseOut={ onMouseOut }
						/>
						{ ! parentLabel && (
							<div className={ 'kadence-measure-control-select-wrapper' }>
								<select
									className={ 'kadence-measure-control-select components-unit-control__select' }
									onChange={ ( event ) => {
										onUnit( event.target.value );
									} }
									value={ unit }
								>
									{ units.map( ( option ) => (
										<option value={ option } selected={ unit === option ? true : undefined } key={ option }>
											{ option }
										</option>
									) ) }
								</select>
							</div>
						) }
						{ ! disableCustomSizes && (
							<ButtonGroup className="kadence-radio-container-control">
								<Button
									className={'kadence-radio-item radio-custom only-icon'}
									label={ __( 'Use size preset', 'kadence-blocks' ) }
									icon={ settings }
									isPrimary={true}
									onClick={ () => realSetIsCustom( false ) }
									isPressed={ true }
								/>
							</ButtonGroup>
						) }
					</div>
				) }
			</div>
		),
	];
}
