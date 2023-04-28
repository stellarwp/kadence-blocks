import { TextControl as CoreTextControl } from '@wordpress/components';
// import './text-control.scss';

export function TextControl(props) {
	return  <CoreTextControl className={ 'stellarwp' } { ...props } />;
}

