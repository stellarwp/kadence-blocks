/**
 * Internal dependencies
 */
import AutoHeightPatternPreview from './shadow';

export function PatternPreview( {
	html,
	viewportWidth = 1200,
	minHeight,
	additionalStyles = [],
	title,
	ratio,
	shadowStyles,
	baseCompatStyles,
	neededCompatStyles,
	patternType,
} ) {
	if ( ! html ) {
		return null;
	}

	return (
		<AutoHeightPatternPreview
			viewportWidth={ viewportWidth }
			minHeight={ minHeight }
			html={ html }
			additionalStyles={ additionalStyles }
			title={ title }
			ratio={ ratio }
			shadowStyles={ shadowStyles }
			baseCompatStyles={ baseCompatStyles }
			neededCompatStyles={ neededCompatStyles }
			patternType={ patternType }
		/>
	);
}
