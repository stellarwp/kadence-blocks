import { Button } from '../../../plugins/prebuilt-library/ai-wizard/components';
import { aiIcon } from '@kadence/icons';

import './DashboardButton.scss';

export function DashboardButton({ text, onClick }) {

	return (
		<Button
			className="kb-dashboard-button"
			variant="primary"
			onClick={ onClick }
		>
			<span>{ text }</span>
			<span>{ aiIcon }</span>
		</Button>
	);
}
