export default function hasKadenceCustomCSS( kadenceBlockCSS ) {
	// if (hasBlockCSS) {
	// 	const {
	// 		attributes: { kadenceBlockCSS },
	// 	} = props;
		const isValidCSSRule = kadenceBlockCSS && /^\s*[^{]+\s*\{\s*[^\s}]+\s*[:;][^}]*\}$/.test(kadenceBlockCSS);
		const globalSettings = kadence_blocks_params.globalSettings
			? JSON.parse(kadence_blocks_params.globalSettings)
			: {};
		const showCSSIndicator =
			globalSettings.enable_custom_css_indicator !== undefined
				? globalSettings.enable_custom_css_indicator
				: false;

		if (isValidCSSRule && showCSSIndicator) {
			// props.wrapperProps = {
			// 	...props.wrapperProps,
			// 	className: 'kadence-has-custom-css',
			// };
			return true;
		}

		return false;
	// }

}
