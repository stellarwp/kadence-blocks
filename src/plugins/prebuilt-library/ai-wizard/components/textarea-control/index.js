/**
 * WordPress dependencies
 */
import { TextareaControl as CoreTextareaControl } from '@wordpress/components';
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './textarea-control.scss';

export const TextareaControl = forwardRef(
	function TextareaControl(props, ref) {
		return (
			<div ref={ ref }>
				<CoreTextareaControl className={ 'stellarwp' } { ...props } />
			</div>
		)
	}
);

