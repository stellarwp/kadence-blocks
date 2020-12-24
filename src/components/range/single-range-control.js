/**
 * Responsive Range Component
 *
 */
/**
 * Import Icons
 */
import icons from './../../icons';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
import KadenceRange from './../../kadence-range-control';
const {
	Dashicon,
	Button,
	ButtonGroup,
	DropdownMenu,
} = wp.components;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function ResponsiveSingleRangeControl( {
	onChange,
	value,
	step = 1,
	max = 100,
	min = 0,
	unit = '',
	onUnit,
	showUnit = false,
	units = [ 'px', 'em', 'rem' ],
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
				<KadenceRange
					value={ ( value ? value : '' ) }
					onChange={ ( size ) => onChange( size ) }
					min={ min }
					max={ max }
					step={ step }
				/>
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
		),
	];
}
