/**
 * Range Control
 *
 */

/**
 * Internal block libraries
 */
import { RangeControl as CoreRangeControl, Button } from '@wordpress/components';
import { undo } from '@wordpress/icons';
import { isEqual } from 'lodash';

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function RangeControl({
	label,
	onChange,
	value = '',
	defaultValue = '',
	className = '',
	step = 1,
	max = 100,
	min = 0,
	beforeIcon = '',
	help = '',
	unit = '',
	onUnit,
	showUnit = false,
	lockUnits = false,
	units = ['px', 'em', 'rem'],
	reset,
}) {
	const onReset = () => {
		onChange( defaultValue );
	};
	return [
		onChange && (
			<div className={`components-base-control kadence-range-control${className ? ' ' + className : ''}`}>
				<div className="kadence-title-bar">
					{label && <span className="kadence-control-title">{label}</span>}
					{reset && (
						<Button
							className="is-reset is-single"
							isSmall
							disabled={isEqual('', value) ? true : false}
							icon={undo}
							onClick={() => {
								if (typeof reset === 'function') {
									reset();
								} else {
									onReset();
								}
							}}
						></Button>
					)}
				</div>
				<div className={'kadence-controls-content'}>
					<div className={'kadence-range-control-inner'}>
						<CoreRangeControl
							className={'kadence-range-control-range'}
							beforeIcon={beforeIcon}
							value={value}
							onChange={(newVal) => onChange(newVal)}
							min={min}
							max={max}
							step={step}
							help={help}
							allowReset={true}
						/>
					</div>
					{(onUnit || showUnit) && (
						<div className={'kadence-units kadence-measure-control-select-wrapper'}>
							<select
								className={'kadence-measure-control-select components-unit-control__select'}
								onChange={(event) => {
									if (onUnit) {
										onUnit(event.target.value);
									}
								}}
								value={unit}
								disabled={units.length === 1 || lockUnits}
							>
								{units.map((option, index) => (
									<option value={option} key={index}>
										{option}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			</div>
		),
	];
}
