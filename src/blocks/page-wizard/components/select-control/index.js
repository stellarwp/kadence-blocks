/**
 * External dependencies
 */
import Select from 'react-select';

/**
 * Wordpress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './select-control.scss';

export const SelectControl = forwardRef(function SelectControl(props, ref) {
	const {
		maxMenuHeight,
		menuPlacement,
		menuPosition = 'absolute',
		isClearable,
		label,
		options,
		value,
		horizontal,
		...rest
	} = props;

	return (
		<div className={`stellarwp components-select-control ${horizontal ? 'input-control-horizontal' : ''}`}>
			{label ? <label className="components-input-control__label">{label}</label> : null}
			<div className="components-input-control__container" ref={ref}>
				<Select
					classNamePrefix="stellarwp-select"
					maxMenuHeight={maxMenuHeight}
					menuPlacement={menuPlacement}
					menuPosition={menuPosition}
					styles={{
						control: (baseStyles, state) => ({
							...baseStyles,
							fontSize: 16,
							boxShadow: 'none',
							borderColor: state.isFocused ? '#000000' : '#DFDFDF',
							width: '100%',
						}),
						valueContainer: (baseStyles) => ({
							...baseStyles,
							paddingLeft: 16,
						}),
						menu: (baseStyles) => ({
							...baseStyles,
							fontSize: 16,
						}),
						indicatorsContainer: (baseStyles) => ({
							...baseStyles,
							color: '#000000',
						}),
					}}
					isClearable={isClearable}
					options={options}
					value={value}
					{...rest}
				/>
			</div>
		</div>
	);
});
