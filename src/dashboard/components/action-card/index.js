import './action-card.scss';

export function ActionCard({ variant, icon, heading, content, link, linkTarget = '_self', label = '' }) {
	return (
		<div className={`kb-action-card kb-action-card--${variant}`}>
			<div className="kb-action-card__icon">{icon}</div>
			<div className="kb-action-card__heading">{heading}</div>
			<div className="kb-action-card__content">{content}</div>
			{link && (
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				<a
					href={link}
					className="kb-action-card__link"
					aria-label={label ? label : undefined}
					target={linkTarget}
				></a>
			)}
		</div>
	);
}
