/**
 * WordPress dependencies
 */
import { TextareaControl as CoreTextareaControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './textarea-control.scss';

export function TextareaControl(props) {
	return <CoreTextareaControl className={ 'stellarwp' } { ...props } />;
}

