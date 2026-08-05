/**
 * Settings-panel state bound to the route: the panel is open exactly when the `item` route arg is
 * non-empty. Holds the draft values and dirty flag; save/delete stay caller callbacks so the hook
 * is storage-agnostic — what Save writes differs per screen (token writes, palette writes, preset
 * writes), so this hook ends at the callback boundary.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isEqual, setValueAtPath } from '../helpers/settings-schema';

/**
 * Read and drive the settings-panel state.
 *
 * @param {Object}   options               The options.
 * @param {Object}   options.route         The route from `useStyleLibraryRoute`.
 * @param {Function}  options.navigate      The route navigator.
 * @param {Object}   options.initialValues The persisted values for the open item.
 *
 * @since TBD
 *
 * @return {{itemId: string, isOpen: boolean, close: Function, draft: Object, setFieldValue: Function, isDirty: boolean, resetDraft: Function}}
 *         The panel state and controls.
 */
export function useSettingsPanel({ route, navigate, initialValues }) {
	const itemId = route.item;
	const [draft, setDraft] = useState(initialValues || {});

	// Re-seed the draft whenever the open item changes — not on every initialValues identity change,
	// so an in-flight edit is not silently discarded by an unrelated re-render.
	useEffect(() => {
		setDraft(initialValues || {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemId]);

	const close = () => navigate({ item: '' });
	const setFieldValue = (path, value) => setDraft((current) => setValueAtPath(current, path, value));
	const resetDraft = () => setDraft(initialValues || {});
	const isDirty = !isEqual(draft, initialValues || {});

	return { itemId, isOpen: Boolean(itemId), close, draft, setFieldValue, isDirty, resetDraft };
}
