/**
 * WordPress dependencies
 */
import { CheckboxControl as CoreCheckboxControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './checkbox-control.scss';

export function CheckboxControl(props) {
	return <CoreCheckboxControl className={'stellarwp'} {...props} />;
}
