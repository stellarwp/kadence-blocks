/**
 * Fetch-and-bind hook for a block's preset collection — reads it from the Style Library store, so a
 * screen and its settings panel calling this hook for the same block/library share one underlying
 * fetch instead of each running its own.
 *
 * Takes the block name as an argument (default the Button block) so a later preset screen built on
 * the same contract can reuse this hook unchanged.
 */

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { presetInitialValues, presetRows } from '../helpers/presets';
import { useBreakpoint } from '../../token-controls/context/breakpoint';
import { STORE_NAME } from '../store';

/**
 * Read a block's preset collection from the store and bind it to row view models.
 *
 * A screen and its settings panel are separate mounts of this hook (see `usePresetScreen` and
 * `PresetSidebar`), and both read the same selector call when they share a `namespace`/`block`/
 * `slug`, so only one of them ever triggers the resolver.
 *
 * @param {Object} library The design-tokens feed hook's return value (`useDesignTokensFeed()`).
 * @param {Object} preset  The block's preset config.
 *
 * @since TBD
 *
 * @return {{payload: ?object, isLoading: boolean, loadError: ?Error, rows: Array<Object>, initialValuesFor: Function}}
 */
export function usePresets(library, preset) {
	// See `use-preset-screen.js`: `properties` is a throwing getter on the preset configs, so it is
	// read where it is used rather than destructured at render scope.
	const { block, preview } = preset;

	const namespace = library?.rest?.namespace;
	const slug = library?.slug;

	const { payload, isLoading, loadError } = useSelect(
		(select) => ({
			payload: namespace && block && slug ? select(STORE_NAME).getBlockPresets(namespace, block, slug) : null,
			// Gated on `!payload`, not raw `isResolving` alone: a write's wrapped `refreshFeed`
			// (`use-preset-screen.js`) invalidates and re-resolves this same selector, which raises
			// `isResolving` for the duration of that background re-fetch too. Once the presets list has
			// loaded once, the store keeps serving that payload while it revalidates, so there is data to
			// keep rendering — a loading state should only ever show up before the first payload lands.
			isLoading:
				Boolean(namespace && block && slug) &&
				select(STORE_NAME).isResolving('getBlockPresets', [namespace, block, slug]) &&
				!select(STORE_NAME).getBlockPresets(namespace, block, slug),
			loadError:
				namespace && block && slug
					? select(STORE_NAME).getResolutionError('getBlockPresets', [namespace, block, slug])
					: null,
		}),
		[namespace, block, slug]
	);

	// The row previews resolve at the active breakpoint, so switching the panel to Tablet re-renders
	// every chip with its tablet value rather than leaving them all showing desktop.
	const [breakpoint] = useBreakpoint();
	const rows = useMemo(
		() => presetRows(payload, library?.values, preview, breakpoint),
		[payload, library?.values, preview, breakpoint]
	);

	const initialValuesFor = (presetSlug) => presetInitialValues(payload, presetSlug, preset.properties);

	return { payload, isLoading, loadError, rows, initialValuesFor };
}
