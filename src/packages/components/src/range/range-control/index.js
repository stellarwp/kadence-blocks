/**
 * Range Control
 *
 */

/**
 * Internal block libraries
 */
 import { __ } from '@wordpress/i18n';
import { RangeControl as CoreRangeControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import {
	Button,
	DropdownMenu,
} from '@wordpress/components';

import {
	pxIcon,
	emIcon,
	remIcon,
	vhIcon,
	vwIcon,
	percentIcon,
} from '@kadence/icons';

let icons = {
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
export default function RangeControl( {
	label,
	onChange,
	value = '',
	className = '',
	step = 1,
	max = 100,
	min = 0,
	beforeIcon = '',
	help = '',
	unit = '',
	onUnit,
	showUnit = false,
	units = [ 'px', 'em', 'rem' ],
} ) {
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
			<div className={ `components-base-control kadence-range-control${ className ? ' ' + className : '' }` }>
				{ label && (
					<label className="components-base-control__label">{ label }</label>
				) }
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
			</div>
		),
	];
}
