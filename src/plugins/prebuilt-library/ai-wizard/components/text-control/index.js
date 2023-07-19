/**
 * WordPress dependencies
 */
import { TextControl as CoreTextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './text-control.scss';

export function TextControl(props) {
	return  <CoreTextControl className={ 'stellarwp' } { ...props } />;
}

