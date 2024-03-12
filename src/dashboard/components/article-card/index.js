import './article-card.scss';

export function ArticleCard({ category, heading, description, link, linkTarget = '_blank' }) {
	return (
		<a href={link} target={linkTarget} className="kb-article-card">
			{category && <div className="kb-article-card__category">{category}</div>}
			<div className="kb-article-card__heading">{heading}</div>
			<div className="kb-article-card__description">{description}</div>
		</a>
	);
}
