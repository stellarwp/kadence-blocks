/**
 * WordPress dependencies
 */
export default function replaceMasks(content) {
	if (!content) {
		return content;
	}
	//const searchStr = "https://patterns.startertemplatecloud.com/wp-content/plugins/kadence-blocks/includes/assets/images/masks/";
	const searchStr = new RegExp(
		'https://patterns\\.startertemplatecloud\\.com/wp-content/plugins/kadence-blocks/includes/assets/images/masks/',
		'g'
	);
	// Background.
	content = content.replace(searchStr, kadence_blocks_params.svgMaskPath);

	return content;
}
