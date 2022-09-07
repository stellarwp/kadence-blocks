/**
 * Step Component
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Dashicon,
} from '@wordpress/components';
import './editor.scss';
import {
	chevronLeftSmall,
	chevronRightSmall,
} from '@wordpress/icons';
/**
 * Build the Step controls
 * @returns {object} Step settings.
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
				<p className="components-base-control__label">{ label }</p>
				<div className="components-base-control__field kb-flex-center kb-step-control">
					<Button
						className="kb-step-btn"
						icon={ chevronLeftSmall }
						isDefault
						onClick={ onMinus }
					/>
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
						icon={ chevronRightSmall }
						onClick={ onPlus }
					/>
				</div>
			</div>
		),
	];
}
