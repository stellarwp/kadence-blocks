export function ActionCard({ variant, icon, heading, content }) {
	return (
		<div className="kb-action-card">
			<div className="kb-action-card__icon">{icon}</div>
			<div className="kb-action-card__heading">{heading}</div>
			<div className="kb-action-card__content">{content}</div>
		</div>
	);
}
