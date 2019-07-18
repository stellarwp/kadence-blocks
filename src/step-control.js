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
	Dashicon,
} = wp.components;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function StepControls( {
	label,
	value,
	onChange,
	min,
	max,
	step = 1,
} ) {
	const onMinus = () => {
		if ( value > min ) {
			onChange( value - step );
		}
	};
	const onPlus = () => {
		if ( value < max ) {
			onChange( value + step );
		}
	};
	return [
		onChange && (
			<div className="components-base-control">
				<div className="components-base-control__field">
					<p className="components-base-control__label">{ label }</p>
					<Button
						className="kb-step-btn"
						isDefault
						onClick={ onMinus }
					>
						<Dashicon icon="arrow-left" />
					</Button>
					<input
						className="components-step-control__number"
						type="number"
						onChange={ ( event ) => onChange( Number( event.target.value ) ) }
						aria-label={ label }
						value={ value }
						min={ min }
						max={ max }
						step={ step }
					/>
					<Button
						className="kb-step-btn"
						isDefault
						onClick={ onPlus }
					>
						<Dashicon icon="arrow-right" />
					</Button>
				</div>
			</div>
		),
	];
}
