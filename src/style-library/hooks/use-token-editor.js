/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { saveTokenLeaf, fetchResolvedTokens } from '../api/client';
import { buildTokenLeaf } from '../helpers/tokens';

/**
 * Manage token save state and refresh resolved values after writes.
 *
 * The document version changes on every write to the library, including ones made outside this
 * hook (e.g. a user-primitive create/rename/delete), so `onVersionChange` is called whenever a
 * fresh version is read here — this keeps a version shared across the app instead of each write
 * surface tracking a copy that can drift stale relative to the others.
 *
 * `slug` must be the same token library the feed's schema/values were read from (the active library, from
 * `useDesignTokensFeed`) — writing to a different slug than the one being displayed would silently
 * save into a document the page never reads back.
 *
 * `refreshValues` re-reads both the flat resolved values AND the authored responsive / clamp shape, so a
 * responsive field hydrates from the same source the write went to. Refreshing only the flat values would
 * leave the responsive read-model on its page-load bootstrap, and a responsive field re-deriving from that
 * stale shape after a save would drop the just-saved per-breakpoint steps.
 *
 * @param {{ namespace: string }|null} rest              REST descriptor from the feed.
 * @param {Record<string, string>}     initialValues     Resolved values keyed by token id.
 * @param {Record<string, object>}     initialResponsive Authored responsive / clamp shape keyed by token id.
 * @param {Function}                   [onVersionChange] Called with the latest document version.
 * @param {string}                     slug              Token library slug.
 * @return {{ values: Record<string, string>, responsive: Record<string, object>, saveToken: Function, getFieldState: Function, refreshValues: Function }}
 */
export function useTokenEditor(rest, initialValues, initialResponsive, onVersionChange, slug) {
	const [values, setValues] = useState(initialValues);
	const [responsive, setResponsive] = useState(initialResponsive);
	const [fieldState, setFieldState] = useState({});

	useEffect(() => {
		setValues(initialValues);
	}, [initialValues]);

	useEffect(() => {
		setResponsive(initialResponsive);
	}, [initialResponsive]);

	const refreshValues = useCallback(async () => {
		if (!rest?.namespace) {
			return;
		}

		const resolved = await fetchResolvedTokens(rest.namespace, slug);
		setValues(resolved?.by_id ?? {});
		setResponsive(resolved?.responsive ?? {});

		if (resolved?.version) {
			onVersionChange?.(resolved.version);
		}
	}, [rest, onVersionChange, slug]);

	const saveToken = useCallback(
		async (tokenId, type, nextValue) => {
			if (!rest?.namespace) {
				return { ok: false, error: 'missing_rest' };
			}

			setFieldState((current) => ({
				...current,
				[tokenId]: { status: 'saving', error: null },
			}));

			try {
				await saveTokenLeaf(rest.namespace, tokenId, buildTokenLeaf(type, nextValue), slug);

				await refreshValues();

				setFieldState((current) => ({
					...current,
					[tokenId]: { status: 'saved', error: null },
				}));

				return { ok: true };
			} catch (error) {
				const message = error?.message || 'Save failed.';

				setFieldState((current) => ({
					...current,
					[tokenId]: { status: 'error', error: message },
				}));

				return { ok: false, error: message };
			}
		},
		[rest, refreshValues, slug]
	);

	const getFieldState = useCallback(
		(tokenId) => fieldState[tokenId] ?? { status: 'idle', error: null },
		[fieldState]
	);

	return {
		values,
		responsive,
		saveToken,
		getFieldState,
		refreshValues,
	};
}
