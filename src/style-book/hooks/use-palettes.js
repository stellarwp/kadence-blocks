/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { fetchPalettes, fetchPalette, setCurrentPalette, saveSwatch } from '../api/client';

/**
 * State + actions for the Style Book palettes page: the set's palette listing, the selected palette's full
 * node (groups of swatches), switching the set's `$current` palette, and saving a single swatch's value back
 * to the current palette. All writes go through the palette REST surface (B3); a write reloads so the view
 * reflects the persisted state.
 *
 * @param {string} namespace REST namespace (e.g. kb-design-tokens/v1).
 * @param {string} slug      Token set slug the feed resolved against.
 *
 * @since TBD
 *
 * @return {{ listing: object|null, selected: object|null, selectedId: string, busy: boolean, error: string, selectPalette: Function, switchCurrent: Function, saveSwatchValue: Function }} The palettes state and actions.
 */
export function usePalettes(namespace, slug) {
	const [listing, setListing] = useState(null);
	const [selectedId, setSelectedId] = useState('');
	const [selected, setSelected] = useState(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');

	const loadListing = useCallback(async () => {
		if (!namespace) {
			return null;
		}

		const next = await fetchPalettes(namespace, slug);
		setListing(next);

		return next;
	}, [namespace, slug]);

	const loadPalette = useCallback(
		async (id) => {
			if (!namespace || !id) {
				setSelected(null);

				return;
			}

			setSelected(await fetchPalette(namespace, id, slug));
		},
		[namespace, slug]
	);

	// Initial load: fetch the listing and select the set's current palette.
	useEffect(() => {
		let cancelled = false;

		loadListing().then((next) => {
			if (!cancelled && next?.$current) {
				setSelectedId(next.$current);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [loadListing]);

	// Whenever the selected palette changes, load its full node.
	useEffect(() => {
		loadPalette(selectedId);
	}, [selectedId, loadPalette]);

	const selectPalette = useCallback((id) => setSelectedId(id), []);

	const run = useCallback(async (action) => {
		setBusy(true);
		setError('');

		try {
			await action();
		} catch (err) {
			setError(err?.message || 'The palette could not be saved.');
		} finally {
			setBusy(false);
		}
	}, []);

	const switchCurrent = useCallback(
		(id) =>
			run(async () => {
				await setCurrentPalette(namespace, id, slug);
				await loadListing();
			}),
		[namespace, slug, loadListing, run]
	);

	const saveSwatchValue = useCallback(
		(token, nextValue) =>
			run(async () => {
				if (!selected) {
					return;
				}

				// Send only the changed swatch: the palette's other colors are untouched, and any token this
				// palette does not set falls back to the default palette.
				await saveSwatch(namespace, selected.id, token, nextValue, slug);
				await loadPalette(selected.id);
				await loadListing();
			}),
		[namespace, slug, selected, loadPalette, loadListing, run]
	);

	return { listing, selected, selectedId, busy, error, selectPalette, switchCurrent, saveSwatchValue };
}
