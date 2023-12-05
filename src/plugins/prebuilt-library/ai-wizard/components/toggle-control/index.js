/**
 * WordPress dependencies
 */
import { ToggleControl as CoreToggleControl } from '@wordpress/components';

export function ToggleControl(props) {
	return <CoreToggleControl className={ 'stellarwp' } { ...props } />;
}

