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
let icons = {
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
} ) {
	const [ isCustom, setIsCustom ] = useState( false );
	const [ isOpen, setIsOpen ] = useState( false );
	useEffect( () => {
		setIsCustom( isCustomOption( options, value ) );
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
		const size = parseInt( newSize, 10 );
		if ( size === 0 ) {
			return '0';
		}
		return `${ options[ newSize ]?.value }`;
	};
	const onChangeCustom = ( newSize ) => {
		const isNumeric = ! isNaN( parseFloat( newSize ) );
		const nextValue = isNumeric ? parseFloat( newSize ) : undefined;
		if ( onUnit && ! parentLabel ) {
			const newUnit = newSize.replace(/[0-9]/g, '');
			if ( newUnit !== unit ) {
				onUnit( newUnit );
			}
		}
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
	const currentValue = ! realIsCustomControl ? getOptionIndex( options, value ) : Number( value );
	const setInitialValue = () => {
		if ( value === undefined ) {
			onChange( '0' );
		}
	};
	const customTooltipContent = ( newValue ) => {
		return options[ newValue ]?.label;
	}
	const currentValueLabel = options[ currentValue ]?.label ? options[ currentValue ]?.label : __( 'Unset', 'kadence-blocks' );
	const currentValueName = options[ currentValue ]?.name ? options[ currentValue ]?.name + ' ' + options[ currentValue ]?.size + 'px' : __( 'Unset', 'kadence-blocks' );
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
				value={ currentValue }
				onChange={ ( newVal ) => onChange( getNewPresetValue( newVal ) ) }
				min={ 0 }
				max={ options.length - 1 }
				marks={ marks }
				step={ 1 }
				help={ help }
				withInputField={ false }
				aria-valuenow={ currentValue }
				aria-valuetext={ options[ currentValue ]?.label }
				renderTooltipContent={ customTooltipContent }
				initialPosition={ defaultValue }
				allowReset={ ( isPopover || isSingle ) ? true : false  }
				hideLabelFromVision={ ( isPopover || isSingle ) ? false : true }
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
				className={ `components-base-control component-spacing-sizes-control kadence-single-measure-range-control ${ className ? ' ' + className : '' }` }>
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
								<Button className={ 'kadence-popover-spacing-btn' } disabled={ ( value && 'auto' == value ? true : false ) } tabIndex="-1" onClick={ ( value && 'auto' == value ? '' : toggle ) }>
									{ parentLabel && label && (
										<span className='kadence-placement-label'>{ label }</span>
									) }
									<span className='kadence-spacing-btn-val'>{ options[ currentValue ]?.label }</span>
								</Button>
								{ isOpen && (
									<Popover
										onClose={ close }
										className={ 'kadence-range-popover-settings' }
									>
										{ customRange }
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
					<div className={ 'kadence-controls-content' }>
						<UnitControl
							label={ parentLabel && label ? label : undefined }
							labelPosition={'top'}
							min={ min }
							max={ max }
							step={ step }
							units={ controlUnits }
							value={ value }
							disableUnits={ parentLabel ? true : false }
							onChange={ ( newVal ) => onChangeCustom( newVal ) }
						/>
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
