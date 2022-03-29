/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { KadenceRange } from '@kadence/components';
import {
	Button,
	DropdownMenu,
} from '@wordpress/components';

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

	// @todo: Replace with icon from @kadence/icons once created
	let icons = {};
	icons.percent = <svg width="24" height="24"
						 xmlns="http://www.w3.org/2000/svg"
						 fillRule="evenodd"
						 strokeLinejoin="round"
						 strokeMiterlimit="2"
						 clipRule="evenodd"
						 viewBox="0 0 20 20"
	>
		<path
			fillRule="nonzero"
			d="M5.689 7.831c0 .246.017.476.053.69.035.215.092.401.17.559.079.158.182.283.309.375a.775.775 0 00.467.138.803.803 0 00.473-.138.978.978 0 00.315-.375 2.11 2.11 0 00.178-.559c.039-.214.059-.444.059-.69 0-.219-.015-.433-.046-.644a1.995 1.995 0 00-.164-.565 1.076 1.076 0 00-.316-.401.794.794 0 00-.499-.151.797.797 0 00-.5.151 1.02 1.02 0 00-.308.401 1.992 1.992 0 00-.152.565 5.253 5.253 0 00-.039.644zm1.012 2.616c-.394 0-.732-.07-1.012-.21a1.899 1.899 0 01-.684-.566 2.316 2.316 0 01-.381-.828 4.148 4.148 0 01-.118-1.012c0-.35.042-.685.125-1.005.083-.32.215-.598.394-.835.18-.236.408-.425.684-.565.276-.14.606-.21.992-.21s.716.07.992.21c.276.14.504.329.684.565.179.237.311.515.394.835.083.32.125.655.125 1.005 0 .36-.039.697-.118 1.012a2.3 2.3 0 01-.382.828 1.887 1.887 0 01-.683.566c-.28.14-.618.21-1.012.21zm5.586 1.722c0 .245.017.475.053.69.035.214.092.401.17.558.079.158.182.283.309.375a.775.775 0 00.467.138.803.803 0 00.473-.138.978.978 0 00.315-.375c.079-.157.138-.344.178-.558.039-.215.059-.445.059-.69 0-.219-.015-.434-.046-.644a1.992 1.992 0 00-.164-.566 1.065 1.065 0 00-.316-.4.795.795 0 00-.499-.152.798.798 0 00-.5.152 1.01 1.01 0 00-.308.4 1.99 1.99 0 00-.152.566c-.026.21-.039.425-.039.644zm1.012 2.615c-.394 0-.732-.07-1.012-.21a1.885 1.885 0 01-.683-.565 2.317 2.317 0 01-.382-.828 4.16 4.16 0 01-.118-1.012c0-.351.042-.686.125-1.006.083-.32.215-.598.394-.834.18-.237.408-.425.684-.566.276-.14.606-.21.992-.21s.716.07.992.21c.276.141.504.329.684.566.179.236.311.514.394.834.083.32.125.655.125 1.006 0 .359-.039.696-.118 1.012a2.332 2.332 0 01-.381.828 1.897 1.897 0 01-.684.565c-.28.14-.618.21-1.012.21zm-1.341-9.7h.999l-5.086 9.832H6.846l5.112-9.832z"
		></path>
	</svg>;

	return [
		onChange && (
			<div className={ `kadence-controls-content kb-responsive-range-control-inner${ '' !== className ? ' ' + className : '' }` }>
				<KadenceRange
					value={ ( undefined !== value ? value : '' ) }
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
