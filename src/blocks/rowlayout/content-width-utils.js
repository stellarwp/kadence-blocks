export function isNamedContentWidthPreset(innerContentWidth, inheritMaxWidth) {
	if (innerContentWidth) {
		return innerContentWidth !== 'custom';
	}
	return !!inheritMaxWidth;
}
