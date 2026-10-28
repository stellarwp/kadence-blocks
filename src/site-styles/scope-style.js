/**
 * The style a scoped block instance takes site values as, matching the
 * block's `site_styles_scope_style()`: a preset's class for Single Button, and
 * the scope attribute for a block without presets, such as Spacer.
 */
import { activePresetFor, blockPresetThemeClass, storedPresetFor } from '../extension/preset-picker';

const OUTLINE_CLASS = 'kb-btn-global-outline';
const SECONDARY_CLASS = 'button-style-secondary';
const THEME_SECONDARY = 'theme-secondary';

/**
 * A class-painted preset (Outline, or a theme style) sets the style, since presets replace the scope
 * attribute; otherwise it's the instance's scope attribute, as the block renders it.
 *
 * @param {string} name       The block name.
 * @param {Object} attributes The instance's attributes.
 * @param {Object} scope      The block's scope, `{ attribute, attributes }`.
 * @return {*} The style, as a key of `scope.attributes`, or undefined for the block's default.
 */
export function scopeStyle(name, attributes, scope) {
	const classes = blockPresetThemeClass(name, activePresetFor(name, attributes)).split(/\s+/).filter(Boolean);

	if (!classes.length) {
		return attributes[scope.attribute];
	}

	if (classes.includes(OUTLINE_CLASS)) {
		return 'outline';
	}

	// Any other class-painted preset is a theme style.
	if (classes.includes(SECONDARY_CLASS) || storedPresetFor(name, attributes) === THEME_SECONDARY) {
		return 'inherit-secondary';
	}

	return 'inherit';
}
