import classnames from 'classnames';

import { useState } from '@wordpress/element';
import { SelectControl as CoreSelectControl } from '@wordpress/components';

export function SelectControl(props) {
	const {
		className = '',
		onFocus = () => {},
		onBlur = () => {},
		...rest
	} = props;

	const [ isFocused, setIsFocused ] = useState(false);

	const handleOnFocused = (event) => {
		setIsFocused(true);

		if (typeof onFocus === 'function') {
			onFocus(event);
		}
	};
	
	const handleOnBlurred = (event) => {
		setIsFocused(false);

		if (typeof onBlur === 'function') {
			onBlur(event);
		}
	};

	const classes = classnames( 'stellarwp', className, {
		'is-focused': isFocused
	} );
	
	return (
		<CoreSelectControl
			className={ classes }
			{ ...rest }
			onFocus={ (event) => handleOnFocused(event) }
			onBlur={ (event) => handleOnBlurred(event) }
		/>
	);
}

