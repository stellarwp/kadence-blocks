/**
 * Range Control
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
	RangeControl,
} = wp.components;
const {
	useInstanceId,
} = wp.compose;

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function KadenceRange( {
	label,
	onChange,
	value = '',
	className = '',
	step = 1,
	max = 100,
	min = 0,
	beforeIcon = '',
	help = '',
} ) {
	const onChangInput = ( event ) => {
		if ( event.target.value === '' ) {
			onChange( undefined );
			return;
		}
		const newValue = Number( event.target.value );
		if ( newValue === '' ) {
			onChange( undefined );
			return;
		}
		if ( min < -0.1 ) {
			if ( newValue > max ) {
				onChange( max );
			} else if ( newValue < min && newValue !== '-' ) {
				onChange( min );
			} else {
				onChange( newValue );
			}
		} else {
			if ( newValue > max ) {
				onChange( max );
			} else if ( newValue < -0.1 ) {
				onChange( min );
			} else {
				onChange( newValue );
			}
		}
	};
	const id = useInstanceId( KadenceRange, 'inspector-kadence-range' );
	return [
		onChange && (
			<div className={ `components-base-control kadence-range-control${ className ? ' ' + className : '' }` }>
				{ label && (
					<label htmlFor={ id } className="components-base-control__label">{ label }</label>
				) }
				<div className={ 'kadence-range-control-inner' }>
					<RangeControl
						className={ 'kadence-range-control-range' }
						beforeIcon={ beforeIcon }
						value={ value }
						onChange={ ( newVal ) => onChange( newVal ) }
						min={ min }
						max={ max }
						step={ step }
						help={ help }
						withInputField={ false }
					/>
					<div className="components-base-control kt-range-number-input">
						<div className="components-base-control__field">
							<input
								value={ value }
								onChange={ onChangInput }
								min={ min }
								max={ max }
								id={ id }
								step={ step }
								type="number"
								className="components-text-control__input"
							/>
						</div>
					</div>
				</div>
			</div>
		),
	];
}
