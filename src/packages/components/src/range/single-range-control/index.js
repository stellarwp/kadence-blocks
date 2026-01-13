/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import RangeControl from '../range-control';
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
export default function ResponsiveSingleRangeControl( {
		device = 'device',
		onChange,
		value,
		step = 1,
		max = 100,
		min = 0,
		unit = '',
		onUnit,
		showUnit = false,
		units = [ 'px', 'em', 'rem' ],
		lockUnits = false,
		className = '',
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
			<div className={ `kadence-controls-content kb-responsive-range-control-inner${ '' !== className ? ' ' + className : '' }` }>
				<RangeControl
					value={ ( undefined !== value ? value : '' ) }
					onChange={ ( size ) => onChange( size ) }
					min={ min }
					max={ max }
					step={ step }
				/>
				{ ( onUnit || showUnit ) && (
					<div className="kadence-units">
						{ ( units.length === 1 || lockUnits ) ? (
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
		),
	];
}
