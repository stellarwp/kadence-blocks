/**
 * Internal dependencies
 */
import { typographyStyle } from '@kadence/helpers';

/**
 * Adds the typography declarations for the previewed device to the CSS builder's current selector.
 *
 * @param {KadenceBlocksCSS} css           The CSS builder, with its selector already set.
 * @param {Array}            typography    The block's typography attribute.
 * @param {string}           previewDevice The device being previewed in the editor.
 *
 * @since TBD
 *
 * @return {void}
 */
export default function renderFont(css, typography, previewDevice) {
	const rule = typographyStyle(typography ? typography : [], '', previewDevice);

	rule.replace(/^\s*\{/, '')
		.replace(/\}\s*$/, '')
		.split(';')
		.forEach((declaration) => {
			const separator = declaration.indexOf(':');
			if (separator > 0) {
				css.add_property(declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim());
			}
		});
}
