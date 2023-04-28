import classnames from 'classnames';

import { Icon } from '@wordpress/components';

export function StepperIcon(props) {
	const {
		pageNumber,
		isComplete = false
	} = props;

	const classes = classnames('stellarwp', 'step-count', {
		'is-complete': isComplete
	});

	const icon = isComplete ? <Icon icon="saved" /> : pageNumber;

	return (
		<span className={ classes }>{ icon }</span>
	);
};

