/**
 * The state binding both `ButtonScreen` and `ButtonSettings` call as siblings (the
 * `useScaleScreen` role, applied to a fetched-not-localized payload): wraps `useButtonPresets`
 * and adds the three preset write flows. No reorder chain here (that is a separate concern) and
 * no `feedVersionRef` — preset writes carry no version parameter (`helpers/preset-flows.js`'s
 * module docblock), so there is nothing to serialize against.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { createPresetFlow, deletePresetFlow, savePresetFlow } from '../helpers/preset-flows';
import { BUTTON_BLOCK, presetInitialValues } from '../helpers/presets';
import { useButtonPresets } from './use-button-presets';

/**
 * Bind the Button preset screen's config to the fetched preset collection and its three write
 * flows.
 *
 * @param {Object} library The design-tokens feed hook's return value (`useDesignTokensFeed()`).
 *
 * @since TBD
 *
 * @return {{payload: ?object, isLoading: boolean, loadError: ?Error, rows: Array<Object>, initialValuesFor: Function, isBusy: boolean, addError: ?Object, saveError: ?Object, deleteError: ?Object, clearAddError: Function, clearSaveError: Function, clearDeleteError: Function, addPreset: Function, savePreset: Function, deletePreset: Function, isDeletable: Function}}
 */
export function useButtonScreen(library) {
	const presets = useButtonPresets(library);

	const [isBusy, setIsBusy] = useState(false);
	const [addError, setAddError] = useState(null);
	const [saveError, setSaveError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);

	const namespace = library?.rest?.namespace;
	const slug = library?.slug;
	const refreshFeed = library?.refreshFeed;

	const clearAddError = useCallback(() => setAddError(null), []);
	const clearSaveError = useCallback(() => setSaveError(null), []);
	const clearDeleteError = useCallback(() => setDeleteError(null), []);

	const addPreset = useCallback(() => {
		setAddError(null);

		const existingSlugs = Object.keys(presets.payload?.presets ?? {});
		const defaultTokens = presetInitialValues(presets.payload, presets.payload?.default)?.tokens ?? {};

		return createPresetFlow({
			namespace,
			block: BUTTON_BLOCK,
			existingSlugs,
			defaultTokens,
			slug,
			refreshFeed,
			onBusy: setIsBusy,
			onError: setAddError,
		});
	}, [namespace, presets.payload, slug, refreshFeed]);

	const savePreset = useCallback(
		(id, draft, initialValues) => {
			setSaveError(null);

			return savePresetFlow({
				namespace,
				block: BUTTON_BLOCK,
				preset: id,
				draft,
				initialValues,
				slug,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setSaveError,
			});
		},
		[namespace, presets.payload, slug, refreshFeed]
	);

	const deletePreset = useCallback(
		(id) => {
			setDeleteError(null);

			return deletePresetFlow({
				namespace,
				block: BUTTON_BLOCK,
				preset: id,
				slug,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setDeleteError,
			});
		},
		[namespace, presets.payload, slug, refreshFeed]
	);

	const isDeletable = useCallback(
		(id) => presets.rows.find((row) => row.id === id)?.userCreated ?? false,
		[presets.rows]
	);

	return {
		payload: presets.payload,
		isLoading: presets.isLoading,
		loadError: presets.loadError,
		rows: presets.rows,
		initialValuesFor: presets.initialValuesFor,
		isBusy,
		addError,
		saveError,
		deleteError,
		clearAddError,
		clearSaveError,
		clearDeleteError,
		addPreset,
		savePreset,
		deletePreset,
		isDeletable,
	};
}
