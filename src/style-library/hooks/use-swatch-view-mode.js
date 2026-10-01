/**
 * Holds the Color Palette swatch view mode in state, seeded from and saved to `localStorage`.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isSwatchViewMode, readSwatchViewMode, writeSwatchViewMode } from '../helpers/swatch-view-mode';

/**
 * The swatch view mode and a setter that also saves it.
 *
 * The saved value is read in the `useState` initializer, not in an effect, so the very first
 * render (including the loading skeleton) already shows the saved mode instead of flashing grid.
 *
 * @since TBD
 *
 * @return {Array} `[viewMode, setViewMode]`.
 */
export function useSwatchViewMode() {
	const [viewMode, setViewModeState] = useState(() => readSwatchViewMode());

	const setViewMode = useCallback((mode) => {
		if (!isSwatchViewMode(mode)) {
			return;
		}

		setViewModeState(mode);
		writeSwatchViewMode(mode);
	}, []);

	return [viewMode, setViewMode];
}
