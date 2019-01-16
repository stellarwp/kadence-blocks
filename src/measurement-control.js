/**
 * Measure Component
 *
 */

/**
 * Import Icons
 */
import icons from './icons';

/**
 * Import External
 */
import map from 'lodash/map';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Fragment,
} = wp.element;
const {
	Button,
	ButtonGroup,
	Tooltip,
	RangeControl,
} = wp.components;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function MeasurementControls( {
	label,
	measurement,
	control,
	onChange,
	onControl,
	step = 1,
	max = 100,
	min = 0,
} ) {
	const borderTypes = [
		{ key: 'linked', name: __( 'Linked' ), icon: icons.linked },
		{ key: 'individual', name: __( 'Individual' ), icon: icons.individual },
	];

	return [
		onChange && onControl && (
			<Fragment>
				<ButtonGroup className="kt-size-type-options kt-outline-control" aria-label={ __( 'Measurement Control Type' ) }>
					{ map( borderTypes, ( { name, key, icon } ) => (
						<Tooltip text={ name }>
							<Button
								key={ key }
								className="kt-size-btn"
								isSmall
								isPrimary={ control === key }
								aria-pressed={ control === key }
								onClick={ () => onControl( key ) }
							>
								{ icon }
							</Button>
						</Tooltip>
					) ) }
				</ButtonGroup>
				{ control && control !== 'individual' && (
					<RangeControl
						label={ label }
						value={ ( measurement ? measurement[ 0 ] : '' ) }
						onChange={ ( value ) => onChange( [ value, value, value, value ] ) }
						min={ min }
						max={ max }
						step={ step }
					/>
				) }
				{ control && control === 'individual' && (
					<Fragment>
						<p>{ label }</p>
						<RangeControl
							className="kt-icon-rangecontrol"
							label={ icons.outlinetop }
							value={ ( measurement ? measurement[ 0 ] : '' ) }
							onChange={ ( value ) => onChange( [ value, measurement[ 1 ], measurement[ 2 ], measurement[ 3 ] ] ) }
							min={ min }
							max={ max }
							step={ step }
						/>
						<RangeControl
							className="kt-icon-rangecontrol"
							label={ icons.outlineright }
							value={ ( measurement ? measurement[ 1 ] : '' ) }
							onChange={ ( value ) => onChange( [ measurement[ 0 ], value, measurement[ 2 ], measurement[ 3 ] ] ) }
							min={ min }
							max={ max }
							step={ step }
						/>
						<RangeControl
							className="kt-icon-rangecontrol"
							label={ icons.outlinebottom }
							value={ ( measurement ? measurement[ 2 ] : '' ) }
							onChange={ ( value ) => onChange( [ measurement[ 0 ], measurement[ 1 ], value, measurement[ 3 ] ] ) }
							min={ min }
							max={ max }
							step={ step }
						/>
						<RangeControl
							className="kt-icon-rangecontrol"
							label={ icons.outlineleft }
							value={ ( measurement ? measurement[ 3 ] : '' ) }
							onChange={ ( value ) => onChange( [ measurement[ 0 ], measurement[ 1 ], measurement[ 2 ], value ] ) }
							min={ min }
							max={ max }
							step={ step }
						/>
					</Fragment>
				) }
			</Fragment>
		),
	];
}
