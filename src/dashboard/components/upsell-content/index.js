import { DashboardButton } from '../dashboard-button';

import './upsell-content.scss';

export function UpsellContent({ image, tag, heading, description, href, buttonText, flip = false }) {
	return (
		<div className={`kb-upsell-content ${flip ? 'kb-upsell-content--flipped' : ''}`}>
			{image && <img className="kb-upsell-content__image" src={image} />}
			<div className="kb-upsell-content__container">
				{tag && <div className="kb-upsell-content__tag">{tag}</div>}
				{heading && <div className="kb-upsell-content__heading">{heading}</div>}
				{description && <div className="kb-upsell-content__description">{description}</div>}
				{href && buttonText && <DashboardButton variant="primary" text={buttonText} href={href} />}
			</div>
		</div>
	);
}
