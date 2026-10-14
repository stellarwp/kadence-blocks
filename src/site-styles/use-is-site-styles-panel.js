/**
 * Tells a block's edit component whether it renders in the Kadence panel, so
 * it can leave out controls for content and per-button settings there.
 *
 * The panel marks the settings of its own block editor. Reading the setting
 * from the block editor store gives the same answer in every bundle, unlike a
 * React context, which each bundle would create anew.
 */
import { useSelect } from '@wordpress/data';

/**
 * The block editor setting the Kadence panel sets on its block editor.
 */
export const SITE_STYLES_PANEL_SETTING = 'kadenceSiteStylesPanel';

/**
 * @return {boolean} Whether the block renders in the Kadence panel.
 */
export function useIsSiteStylesPanel() {
	return useSelect((select) => true === select('core/block-editor').getSettings()[SITE_STYLES_PANEL_SETTING], []);
}
