import { TextareaControl as CoreTextareaControl } from '@wordpress/components';
// import './textarea-control.scss';

export function TextareaControl(props) {
	return <CoreTextareaControl className={ 'stellarwp' } { ...props } />;
}

