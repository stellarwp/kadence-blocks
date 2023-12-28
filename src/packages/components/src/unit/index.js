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
	ButtonGroup,
	__experimentalUnitControl as CoreUnitControl,
} from '@wordpress/components';
import { settings, link, linkOff, undo } from '@wordpress/icons';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function UnitControl( {
	label,
	onChange,
	value = '',
	className = '',
	step = 1,
	max = 200,
	min = 0,
	defaultValue = '',
	unit = '',
	onUnit,
	units = [ 'px', 'em', 'rem' ],
	parentLabel = null,
	reset = true,
	preventUnitSelection = false,
} ) {
	const onChangeCustom = ( newSize ) => {
		const isNumeric = ! isNaN( parseFloat( newSize ) );
		const nextValue = isNumeric ? parseFloat( newSize ) : undefined;
		onChange( nextValue );
	};
	const controlUnits = units.map( ( unitItem ) => ( {
		value: unitItem,
		label: unitItem,
	} ) );
	const onReset = () => {
		if ( typeof reset === 'function' ){
			reset();
		} else {
			onChange( defaultValue );
		}
	}
	return [
		onChange && (
			<div className={ `components-base-control component-font-size-control kadence-font-size-control${ className ? ' ' + className : '' }` }>
				{ label && (
					<div className={ 'kadence-font-size-control__header kadence-component__header' } >
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
				
				<div className={ 'kadence-controls-content kadence-single-unit-control' }>
					<CoreUnitControl
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
								if ( '-' === event.target.value ) {
									onUnit( '' );
								} else {
									onUnit( event.target.value );
								}
							} }
							value={ unit }
							disabled={ preventUnitSelection ? true : false }
						>
							{ units.map( ( option ) => (
								!preventUnitSelection
									? 
										<option value={ option } selected={ unit === option || ( unit === '' && '-' === option ) ? true : undefined } key={ option }>
											{ option }
										</option>
									: 
										unit === option &&
											<option value={ option } selected={ unit === option || ( unit === '' && '-' === option ) ? true : undefined } key={ option }>
												{ option }
											</option>
							) ) }
						</select>
					</div>
				</div>
			</div>
		),
	];
}
