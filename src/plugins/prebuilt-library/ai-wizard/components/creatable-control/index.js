/**
 * External dependencies
 */
import Creatable from 'react-select';
import classnames from 'classnames';

/**
 * Wordpress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './creatable-control.scss';

export const CreatableControl = forwardRef(function CreatableControl(props, ref) {
	const { maxMenuHeight, menuPlacement, label, options, value, prefix, ...rest } = props;

	const containerClasses = classnames('components-input-control__container', {
		'has-prefix': !!prefix,
	});

	return (
		<div className="stellarwp components-creatable-control">
			{label ? <label className="components-input-control__label">{label}</label> : null}
			<div className={containerClasses} ref={ref}>
				{prefix ? prefix : null}
				<Creatable
					classNamePrefix="stellarwp-creatable"
					maxMenuHeight={maxMenuHeight}
					menuPlacement={menuPlacement}
					styles={{
						control: (baseStyles, state) => ({
							...baseStyles,
							fontSize: 16,
							boxShadow: 'none',
							borderColor: state.isFocused ? '#000000' : '#DFDFDF',
						}),
						valueContainer: (baseStyles) => ({
							...baseStyles,
							paddingLeft: prefix ? 35 : 8,
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
					isClearable
					options={options}
					value={value}
					{...rest}
				/>
			</div>
		</div>
	);
});
