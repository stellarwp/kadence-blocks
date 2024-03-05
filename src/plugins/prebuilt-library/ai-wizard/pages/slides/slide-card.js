/**
 * Wordpress dependencies
 */
import { Card, CardBody } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './slide-card.scss';

export function SlideCard({ children }) {
	if (!children) {
		return;
	}

	return (
		<Card isBorderless size="large" className="slide-card">
			<CardBody>{children}</CardBody>
		</Card>
	);
}
