/**
 * External dependencies
 */
import Select from 'react-select';

import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ToneSelectLabel } from './tone-select-label';
import './tone-select-control.scss';

export const ToneSelectControl = forwardRef(function ToneSelectControl(props, ref) {
	const { maxMenuHeight, menuPlacement, options = [], value, ...rest } = props;

	if (!options.length) {
		return;
	}

	return (
		<div ref={ref}>
			<Select
				maxMenuHeight={maxMenuHeight}
				menuPlacement={menuPlacement}
				classNamePrefix="stellarwp-tone"
				value={value}
				options={options}
				getOptionLabel={(option) => <ToneSelectLabel {...option} />}
				{...rest}
			/>
		</div>
	);
});
