/**
 * Fetch-and-bind hook for a block's preset collection — the `use-libraries.js` shape (a state slot
 * plus an effect that re-fetches), not `useScaleScreen`'s live-feed-in-hand shape, because presets
 * have no counterpart in the localized feed: there is no group to map, so the payload has to be
 * fetched on its own.
 *
 * Takes the block name as an argument (default the Button block) so a later preset screen built on
 * the same contract can reuse this hook unchanged.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { fetchBlockPresets } from '../api/client';
import { presetInitialValues, presetRows } from '../helpers/presets';

/**
 * Fetch a block's preset collection and bind it to row view models.
 *
 * Re-fetches whenever the library slug or version changes — the version bumps on every preset
 * write's `refreshFeed`, which is the cross-slot invalidation signal a sibling settings panel's
 * save relies on to make this hook's rows current again.
 *
 * @param {Object} library The design-tokens feed hook's return value (`useDesignTokensFeed()`).
 * @param {string} block   The block name whose presets are fetched.
 *
 * @since TBD
 *
 * @return {{payload: ?object, isLoading: boolean, loadError: ?Error, rows: Array<Object>, initialValuesFor: Function}}
 */
export function usePresets(library, preset) {
	// See `use-preset-screen.js`: `properties` is a throwing getter on the preset configs, so it is
	// read where it is used rather than destructured at render scope.
	const { block, preview } = preset;
	const [payload, setPayload] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState(null);

	const namespace = library?.rest?.namespace;
	const slug = library?.slug;
	const version = library?.version;

	// Dropped the moment the library changes, not when its replacement arrives: the refetch below
	// keeps the previous payload on purpose (a version bump after a write must not blank the list),
	// but across libraries that same payload is another library's data. Callers key their panels on
	// the preset id alone, so leaving it in place lets a panel opened on the old library keep
	// editing its draft under the new one. Assigning during render rather than in an effect avoids
	// a commit that would show the stale rows first.
	const slugRef = useRef(slug);

	if (slugRef.current !== slug) {
		slugRef.current = slug;
		setPayload(null);
		setIsLoading(true);
		setLoadError(null);
	}

	useEffect(() => {
		if (!namespace || !slug) {
			return;
		}

		let cancelled = false;

		setIsLoading(true);
		setLoadError(null);

		fetchBlockPresets(namespace, block, slug)
			.then((result) => {
				if (!cancelled) {
					setPayload(result);
				}
			})
			.catch((err) => {
				if (!cancelled) {
					setLoadError(err);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setIsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [namespace, block, slug, version]);

	const rows = useMemo(() => presetRows(payload, library?.values, preview), [payload, library?.values, preview]);

	const initialValuesFor = (presetSlug) => presetInitialValues(payload, presetSlug, preset.properties);

	return { payload, isLoading, loadError, rows, initialValuesFor };
}
