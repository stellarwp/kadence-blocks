/**
 * Range Control
 *
 */

/**
 * Internal block libraries
 */
 import { __ } from '@wordpress/i18n';
import {
	Flex,
	FlexBlock,
	FlexItem,
	RangeControl as CoreRangeControl
} from '@wordpress/components';
import { useState, useMemo, forwardRef } from '@wordpress/element';
import {
	Button,
	DropdownMenu,
	ButtonGroup,
} from '@wordpress/components';
import {
	pxIcon,
	emIcon,
	remIcon,
	vhIcon,
	vwIcon,
	percentIcon,
} from '@kadence/icons';
import { settings } from '@wordpress/icons';

const icons = {
	px: pxIcon,
	em: emIcon,
	rem: remIcon,
	vh: vhIcon,
	vw: vwIcon,
	percent: percentIcon,
};

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function RadioRangeControl( {
	label,
	onChange,
	value = '',
	className = '',
	options = [],
	step = 1,
	max = 100,
	min = 0,
	beforeIcon = '',
	help = '',
	defaultValue = '',
	unit = '',
	onUnit,
	showUnit = false,
	units = [ 'px', 'em', 'rem' ],
	disableCustomSizes = false,
} ) {
	const stringValue = ( value.value ? value.value : '' );
	const sizeValue = ( value.size ? value.size : '' );
	return [
		onChange && (
			<div className={ `components-base-control kadence-radio-range-control kadence-range-control${ className ? ' ' + className : '' }` }>
				{ label && (
					<Flex
						justify="space-between"
						className={ 'kadence-radio-range__header' }
					>
						<FlexItem>
							<label className="components-base-control__label">{ label }</label>
						</FlexItem>
					</Flex>
				) }
				{ stringValue !== 'custom' && (
					<div className={ 'kadence-controls-content' }>
						<ButtonGroup className="kadence-radio-container-control">
							{ options.map( ( option, index ) =>
								<Button
									key={`${option.label}-${option.value}-${index}`}
									isTertiary={stringValue !== option.value}
									className={'kadence-radio-item radio-' + option.value}
									isPrimary={stringValue === option.value}
									icon={ undefined !== option.icon ? option.icon : undefined }
									aria-pressed={stringValue === option.value}
									onClick={ () => {
										if ( stringValue == option.value && defaultValue == '' ) {
											onChange( '', '' );
										} else {
											onChange( option.value, option.size )}
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
									onClick={ () => onChange( 'custom', sizeValue ) }
									isPressed={ false }
									isTertiary={ true }
								/>
							) }
						</ButtonGroup>
					</div>
				) }
				{ stringValue === 'custom' && (
					<div className={ 'kadence-controls-content' }>
						<div className={ 'kadence-range-control-inner' }>
							<CoreRangeControl
								className={ 'kadence-range-control-range' }
								beforeIcon={ beforeIcon }
								value={ sizeValue }
								onChange={ ( newVal ) => onChange( 'custom', newVal ) }
								min={ min }
								max={ max }
								step={ step }
								help={ help }
								allowReset={ true }
								initialPosition={ value.size === 0 ? 0 : "" }
							/>
						</div>
						{ ( onUnit || showUnit ) && (
							<div className={ 'kadence-units kadence-measure-control-select-wrapper' }>
								<select
									className={ 'kadence-measure-control-select components-unit-control__select' }
									onChange={ ( event ) => {
										if ( onUnit ) {
											onUnit( event.target.value );
										}
									} }
									value={ unit }
									disabled={ units.length === 1 }
								>
									{ units.map( ( option, index ) => (
										<option value={ option } key={ index }>
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
									onClick={ () => onChange( defaultValue, sizeValue ) }
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
