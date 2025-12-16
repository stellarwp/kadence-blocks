/**
 * Range Control
 *
 */
/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { map, isEqual } from 'lodash';

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
   SelectControl,
   ButtonGroup,
   __experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { settings, link, linkOff, undo } from '@wordpress/icons';
import { GAP_SIZES_MAP } from '@kadence/helpers';
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
function getOptionSize( optionsArray, value ) {
   if ( ! value ) {
	   return '';
   }
   if ( ! optionsArray ) {
	   return '';
   }
   if ( value === '0' ) {
	   return 0;
   }
   const found = optionsArray.find( ( option ) => option.value === value );
   if ( ! found ) {
	   return '';
   }
   return found.size;
}
function getOptionFromSize( optionsArray, size ) {
   if ( ! size ) {
	   return '';
   }
   if ( ! optionsArray ) {
	   return '';
   }
   if ( size === '0' ) {
	   return '';
   }
   const found = optionsArray.find( ( option ) => option.size === size );
   if ( ! found ) {
	   return '';
   }
   return found.value;
}
function getOptionValue( optionsArray, value ) {
   if ( ! value ) {
	   return '';
   }
   if ( ! optionsArray ) {
	   return '';
   }
   if ( value === '0' ) {
	   return 0;
   }
   const found = optionsArray.find( ( option ) => option.value === value );
   if ( ! found ) {
	   return '';
   }
   return found.value;
}
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function GapSizeControl( {
   label,
   onChange,
   value = '',
   className = '',
   options = GAP_SIZES_MAP,
   step = 1,
   max = 200,
   min = 0,
   defaultValue = '',
   unit = 'px',
   onUnit,
   units = [ 'px', 'em', 'rem' ],
   disableCustomSizes = false,
   customControl = false,
   setCustomControl = null,
   parentLabel = null,
   reset = true,
   radio = true,
} ) {
   const [ isCustom, setIsCustom ] = useState( false );
   useEffect( () => {
	   setIsCustom( isCustomOption( options, value ) );
   }, [] );
   const realIsCustomControl = setCustomControl ? customControl : isCustom;
   const realSetIsCustom = setCustomControl ? setCustomControl : setIsCustom;
   const onChangeCustom = ( newSize ) => {
	   const isNumeric = ! isNaN( parseFloat( newSize ) );
	   const nextValue = isNumeric ? parseFloat( newSize ) : undefined;
	   onChange( nextValue );
   };
   const controlUnits = units.map( ( unitItem ) => ( {
	   value: unitItem,
	   label: unitItem,
   } ) );
   const currentValue = ! realIsCustomControl ? getOptionValue( options, value ) : value;
   const onReset = () => {
	   if ( typeof reset === 'function' ){
		   reset();
	   } else {
		   onChange( defaultValue );
	   }
   }
   const selectOptions = [ {
	   value: '',
	   output: '',
	   size: '',
	   label:  __( 'Inherit', 'kadence-blocks' ),
	   name:  __( 'Inherit', 'kadence-blocks' ),
   }, ...options ];;
   return [
	   onChange && (
		   <div className={ `components-base-control component-gap-size-control kadence-gap-size-control${ className ? ' ' + className : '' }` }>
			   { ! setCustomControl && label && (
				   <div className={ 'kadence-gap-size-control__header kadence-component__header' } >
					   <div className="kadence-component__header__title kadence-radio-range__title">
						   <label className="components-base-control__label">{ label }</label>
						   { reset && (
							   <div className='title-reset-wrap'>
								   <Button
									   className="is-reset is-single"
									   label='reset'
									   isSmall
									   disabled={ ( isEqual( defaultValue, value ) ? true : false ) }
									   icon={ undo }
									   onClick={ () => onReset() }
								   />
							   </div>
						   ) }
					   </div>
				   </div>
			   ) }
			   { ! realIsCustomControl && radio && (
				   <div className={ 'kadence-controls-content' }>
					   <ButtonGroup className="kadence-radio-container-control">
						   { options.map( ( option, index ) =>
							   <Button
								   key={`${option.label}-${option.value}-${index}`}
								   isTertiary={currentValue !== option.value}
								   className={'kadence-radio-item radio-' + option.value}
								   isPrimary={currentValue === option.value}
								   icon={ undefined !== option.icon ? option.icon : undefined }
								   aria-pressed={currentValue === option.value}
								   onClick={ () => {
									   if ( currentValue == option.value && defaultValue == '' ) {
										   onChange( '' );
									   } else {
										   onChange( option.value )}
									   }
								   }
							   >
								   {option.label}
							   </Button>
						   )}
						   { ! disableCustomSizes && (
							   <Button
								   className={'kadence-radio-item radio-custom only-icon'}
								   label={ __( 'Set custom size', 'kadence-blocks' ) }
								   icon={ settings }
								   onClick={ () => {
									   if ( currentValue && unit === 'px' ) {
										   onChange( getOptionSize( options, currentValue ) );
									   }
									   realSetIsCustom( true );
								   } }
								   isPressed={ false }
								   isTertiary={ true }
							   />
						   ) }
					   </ButtonGroup>
				   </div>
			   ) }
			   { ! realIsCustomControl && ! radio && (
				   <div className={ 'kadence-controls-content kadence-gap-size-select-control-wrap' }>
					   <SelectControl
						   className="kadence-gap-size-select-control"
						   value={ currentValue }
						   options={ selectOptions }
						   onChange={ (value) => {
							   if ( currentValue == value && defaultValue == '' ) {
								   onChange( '' );
							   } else {
								   onChange( value )}
							   }
						   }
					   />			
					   { ! disableCustomSizes && (
						   <ButtonGroup className="kadence-radio-container-control">
							   <Button
								   className={'kadence-radio-item radio-custom only-icon'}
								   label={ __( 'Set custom size', 'kadence-blocks' ) }
								   icon={ settings }
								   onClick={ () => {
									   if ( currentValue && unit === 'px' ) {
										   onChange( getOptionSize( options, currentValue ) );
									   }
									   realSetIsCustom( true );
								   } }
								   isPressed={ false }
								   isTertiary={ true }
							   />
						   </ButtonGroup>
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
						   step={ step }
						   units={ controlUnits }
						   value={ value }
						   disableUnits={ true }
						   onChange={ ( newVal ) => onChangeCustom( newVal ) }
					   />
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
					   { ! disableCustomSizes && (
						   <ButtonGroup className="kadence-radio-container-control">
							   <Button
								   className={'kadence-radio-item radio-custom only-icon'}
								   label={ __( 'Use size preset', 'kadence-blocks' ) }
								   icon={ settings }
								   isPrimary={true}
								   onClick={ () => {
									   if ( value && unit === 'px' ) {
										   onChange( getOptionFromSize( options, value ) );
									   }
									   realSetIsCustom( false );
								   } }
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
