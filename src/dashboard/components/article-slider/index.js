import ReactSlidy from 'react-slidy';
import { ArticleCard } from '../article-card';
import { useScreenResolution } from '../../hooks/use-screen-resolution';

import './article-slider.scss';

export function ArticleSlider({ articles }) {
	const screenResolution = useScreenResolution();
	let numberOfSlides = 1;

	if (screenResolution.width > 768) {
		numberOfSlides = 2;
	}

	if (screenResolution.width > 1200) {
		numberOfSlides = 3;
	}

	return (
		<div className="kb-article-slider">
			{articles.length > 0 && (
				<ReactSlidy numOfSlides={numberOfSlides}>
					{articles.map((article) => {
						return (
							<div className="kb-article-slider__single">
								<ArticleCard key={article.heading} {...article} />
							</div>
						);
					})}
				</ReactSlidy>
			)}
		</div>
	);
}
