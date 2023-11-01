import "./section-title.scss";

export function SectionTitle({ title, icon }) {
	return (
		<div className="kb-section-title">
			<div className="kb-section-title__title">{title}</div>
			<div className="kb-section-title__icon">{icon}</div>
		</div>
	);
}
