import { Button } from "../../../plugins/prebuilt-library/ai-wizard/components";

import "./dashboard-button.scss";

export function DashboardButton({ text, href, onClick }) {
	return (
		<Button
			className="kb-dashboard-button"
			variant="primary"
			onClick={onClick}
			href={href}
		>
			<span>{text}</span>
		</Button>
	);
}
