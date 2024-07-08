/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Wordpress dependencies
 */
import { Card, CardHeader, CardBody, Icon } from '@wordpress/components';

export function LocationSelectCard(props) {
	const { icon, text = '', value = '', selected, onClick = () => {} } = props;

	const cardClasses = classnames('location-select-card', {
		'is-selected': selected,
	});

	return (
		<Card className={cardClasses} as="button" size="small" isRounded onClick={() => onClick(value)}>
			<CardHeader>{icon ? <Icon icon={icon} /> : null}</CardHeader>
			<CardBody>{text}</CardBody>
		</Card>
	);
}
