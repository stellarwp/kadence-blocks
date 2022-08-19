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

let icons = {
	px: pxIcon,
	em: emIcon,
	rem: remIcon,
	vh: vhIcon,
	vw: vwIcon,
	percent: percentIcon,
};
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
	unit = '',
	onUnit,
	showUnit = false,
	units = [ 'px', 'em', 'rem' ],
	disableCustomSizes = false,
	showCustom = false,
} ) {
	const selectedOption = getSelectOption( options, value );
	const isCustomValue = selectedOption.value === 'custom';
	const [ showCustomValueControl, setShowCustomValueControl ] = useState(
		! disableCustomSizes && ( showCustom || isCustomValue )
	);
	/**
	 * Build Toolbar Items.
	 *
	 * @param {string} mappedUnit the unit.
	 * @returns {array} the unit array.
	 */
	 const createLevelControlToolbar = ( mappedUnit ) => {
		return [ {
			icon: ( mappedUnit === '%' ? icons.percent : icons[ mappedUnit ] ),
			isActive: unit === mappedUnit,
			onClick: () => {
				onUnit( mappedUnit );
			},
		} ];
	};
	const POPOVER_PROPS = {
		className: 'kadence-units-popover',
	};
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
						{ ! disableCustomSizes && (
							<FlexItem>
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
							</FlexItem>
						) }
					</Flex>
				) }
				{ ! showCustomValueControl && (
					<div className={ 'kadence-controls-content' }>
						<ButtonGroup className="kadence-radio-container-control">
							{ options.map( ( option, index ) =>
								<Button
									key={`${option.label}-${option.value}-${index}`}
									isTertiary={value !== option.value}
									className={'kadence-radio-item radio-' + option.value}
									isPrimary={value === option.value}
									icon={ undefined !== option.icon ? option.icon : undefined }
									aria-pressed={value === option.value}
									onClick={() => onChange( option.value )}
								>
									{option.label}
								</Button>
							)}
						</ButtonGroup>
					</div>
				) }
				{ showCustomValueControl && (
					<div className={ 'kadence-controls-content' }>
						<div className={ 'kadence-range-control-inner' }>
							<CoreRangeControl
								className={ 'kadence-range-control-range' }
								beforeIcon={ beforeIcon }
								value={ value }
								onChange={ ( newVal ) => onChange( newVal ) }
								min={ min }
								max={ max }
								step={ step }
								help={ help }
								allowReset={ true }
							/>
						</div>
						{ ( onUnit || showUnit ) && (
							<div className="kadence-units">
								{ units.length === 1 ? (
									<Button
										className="is-active is-single"
										isSmall
										disabled
									>{ ( '%' === unit ? icons.percent : icons[ unit ] ) }</Button>
								) : (
									<DropdownMenu
										icon={ ( '%' === unit ? icons.percent : icons[ unit ] ) }
										label={ __( 'Select a Unit', 'kadence-blocks' ) }
										controls={ units.map( ( singleUnit ) => createLevelControlToolbar( singleUnit ) ) }
										className={ 'kadence-units-group' }
										popoverProps={ POPOVER_PROPS }
									/>
								) }
							</div>
						) }
					</div>
				) }
			</div>
		),
	];
}
