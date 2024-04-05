/**
 * Internal dependencies
 */
import AutoHeightPatternPreview from './shadow';

export function PatternPreview({
	html,
	viewportWidth = 1200,
	minHeight,
	additionalStyles = [],
	title,
	ratio,
	shadowStyles,
	shadowCompatStyles,
	patternType,
	rootScroll,
}) {
	if (!html) {
		return null;
	}

	return (
		<AutoHeightPatternPreview
			viewportWidth={viewportWidth}
			minHeight={minHeight}
			html={html}
			additionalStyles={additionalStyles}
			title={title}
			ratio={ratio}
			shadowStyles={shadowStyles}
			shadowCompatStyles={shadowCompatStyles}
			patternType={patternType}
			rootScroll={rootScroll}
		/>
	);
}
