import './section-title.scss';

export function SectionTitle({ title, icon, variant = 'black' }) {
	return (
		<div className={`kb-section-title kb-section-title--${variant}`}>
			<div className="kb-section-title__title">{title}</div>
			<div className="kb-section-title__icon">{icon}</div>
		</div>
	);
}
